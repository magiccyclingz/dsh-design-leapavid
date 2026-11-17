/**
 * dsh-design-md — Host half.
 *
 * Serves the 84-style catalog collected from getdesign.md (built by
 * build/build-data.mjs) to the Client panel, composes the "style brief" prompt
 * the panel hands to the current conversation, and registers the `design_md`
 * agent tool so the model can pull a style on its own.
 *
 * Read-only with respect to the workspace: it never writes files. Generation
 * happens in the conversation, by the agent, from the prompt this route builds.
 */
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(HERE, 'data')
const ROUTE = '/api/design-md'

export const name = 'dsh-design-md'
export const inject = ['webServer', 'tools']

/** UTF-8 text response. */
function sendText(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' })
  res.end(body)
}

/** JSON response. */
function sendJson(res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  })
  res.end(body)
}

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

/** Bounded request body reader: 413 for oversize, 400 for malformed JSON. */
async function readJson(req, limit = 256 * 1024) {
  const chunks = []
  let size = 0
  let overflow = false
  // Drain the whole body first so the client still gets a status line, then 413.
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) {
      overflow = true
      chunks.length = 0
      continue
    }
    if (!overflow) chunks.push(chunk)
  }
  if (overflow) throw new HttpError(413, 'request body too large (256KB max)')
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new HttpError(400, 'invalid JSON body')
  }
}

/* --------------------------------------------------------------- catalog */

let catalogCache = { key: '', data: null }
/** Reloads whenever data/catalog.json changes on disk, so a rebuild needs no plugin reload. */
async function loadCatalog() {
  const file = path.join(DATA, 'catalog.json')
  const info = await stat(file)
  const key = `${info.mtimeMs}:${info.size}`
  if (catalogCache.data && catalogCache.key === key) return catalogCache.data
  const text = await readFile(file, 'utf8')
  catalogCache = { key, data: JSON.parse(text) }
  return catalogCache.data
}

/** The brief repeats the token block for the panel; the prompt already carries tokens. */
function trimBriefForPrompt(brief) {
  return brief
    .trim()
    .replace(/^#\s.*\n+/, '')
    .split('\n')
    .filter((line) => !/^-\s*(画布|文字|字体|圆角)\s/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Catalog projection for the panel: everything the UI renders, nothing else. */
function projectStyle(style) {
  return {
    slug: style.slug,
    displayName: style.displayName,
    nameZh: style.nameZh,
    category: style.category,
    group: style.group,
    summaryZh: style.summaryZh,
    positioningZh: style.positioningZh,
    descriptionEn: style.descriptionEn,
    styleKeywords: style.styleKeywords,
    tagsZh: style.tagsZh,
    useCases: style.useCases,
    bestFor: style.bestFor,
    avoidFor: style.avoidFor,
    aiChecklist: style.aiChecklist,
    recommendedPromptZh: style.recommendedPromptZh,
    updatedAt: style.updatedAt,
    sourceUrl: style.sourceUrl,
    colors: style.colors,
    typography: style.typography,
    radius: style.radius,
    spacing: style.spacing,
    visual: style.visual,
    componentCount: style.componentCount,
  }
}

/* ---------------------------------------------------------------- prompt */

const SURFACES = {
  web: {
    label: '网页（亮色 + 暗色双主题）',
    deliverable: '- 单文件 `index.html`（内联 CSS/JS，不引用外部字体、CDN、图片外链），写入当前工作目录。\n- 同一份文件内置亮色与暗色两套主题变量，跟随系统 `prefers-color-scheme`，并提供一个手动切换按钮。\n- 结构按需求组织（导航、首屏、内容区、页脚等），信息密度与留白节奏按该风格原文处理；不要只留占位文本。',
  },
  webDark: {
    label: '网页（以深色为默认主题）',
    deliverable: '- 单文件 `index.html`（内联 CSS/JS，不引用外部字体、CDN、图片外链），写入当前工作目录。\n- 默认渲染深色主题（该风格的原生深色画布），同时保留一套可切换的亮色变量。\n- 结构按需求组织，深色下注意描边、次级文字与强调色的对比度。',
  },
  slides: {
    label: '演示幻灯片',
    deliverable: '- 单文件 `deck.html`（内联 CSS/JS，无外部资源），16:9 满屏分页，写入当前工作目录。\n- 键盘 ←/→ 或 PageUp/PageDown 翻页，右下角显示页码，每页一整屏、不出现滚动条。\n- 恰含 1 页封面、1 页目录、正文若干页、1 页封底；标题层级、正文、要点列表都使用 token 中的字号与字重。',
  },
  poster: {
    label: '海报（竖版 3:4）',
    deliverable: '- 单文件 `poster.html`（内联 CSS，无外部资源），竖版 3:4，写入当前工作目录。\n- 以展示字体排版为核心：主标题、副标题、信息块、落款；边距与出血按海报比例处理。\n- 额外输出一份 `poster.svg`（同版式的矢量版本，便于印刷缩放）。',
  },
}

function tokenBlock(style) {
  const v = style.visual
  const lines = [
    `- 底色 canvas \`${v.canvas}\`；表面 surface \`${v.surface}\`；描边 hairline \`${v.hairline}\``,
    `- 正文 ink \`${v.ink}\`；次级文字 \`${v.muted}\`；强调 accent \`${v.accent}\`（其上文字 \`${v.accentText}\`，只用于主 CTA 与关键强调）`,
    `- 展示字体 \`${v.displayFamily}\`（${v.fontClass}）字重 ${v.displayWeight} / 字距 ${v.displayTracking} / 行高 ${v.displayLineHeight}；正文字体 \`${v.bodyFamily}\` ${v.bodySize}px`,
    `- 圆角：卡片 ${v.radiusCard} / 按钮 ${v.radiusButton} / 胶囊 ${v.radiusPill}；间距基准 ${v.spaceBase || 8}px`,
  ]
  if (v.darkFirst) {
    lines.push(`- 该风格原生为深色：深色画布 \`${v.darkCanvas}\`，深色文字 \`${v.darkInk}\`；亮色版本按上面 canvas/ink 取值`)
  } else if (v.darkCanvas && v.darkInk) {
    lines.push(`- 深色模式：画布 \`${v.darkCanvas}\`，文字 \`${v.darkInk}\``)
  }
  const mainColors = style.colors.filter((c) => c.hex).slice(0, 8).map((c) => `\`${c.hex}\` ${c.name}`).join('、')
  if (mainColors) lines.push(`- 完整色板（前 8 个）：${mainColors}`)
  return lines.join('\n')
}

function buildPrompt(style, brief, options) {
  const surface = SURFACES[options.surface] || SURFACES.web
  const requirement = String(options.requirement || '').trim()
  const parts = [
    `请用「${style.nameZh} · ${style.displayName}」这套设计语言，完成下面这件设计工作。`,
    '',
    `风格来源：getdesign.md/${style.slug}（${style.category}）`,
    '',
    '## 设计 Token（生成时必须严格使用这些值，不要引入未列出的颜色）',
    tokenBlock(style),
    '',
    '## 风格要点（摘自该风格的 DESIGN.md）',
    trimBriefForPrompt(brief),
    '',
    '## 本单需求',
    requirement || '（用户未填写额外需求：请按该风格最擅长的场景，生成一版完整、可直接打开的作品）',
    '',
    `## 交付要求（${surface.label}）`,
    surface.deliverable,
    '',
    '## 自检',
    '- 颜色全部来自上面的 token；强调色只用于 CTA 与关键强调，不做大面积铺色。',
    '- 标题/正文字号字重按层级递减，字距与行高与 token 一致。',
    '- 圆角、间距、描边保持同一套尺度，页面之间不漂移。',
    options.includeDesign
      ? '- 已附完整 DESIGN.md，排版细节以它为准。'
      : `- 需要更多细节时，可调用 \`design_md\` 工具取 \`slug=${style.slug}\` 的完整 DESIGN.md。`,
    '',
    '完成后请给出产物文件路径，并说明如何在浏览器里打开。',
  ]
  if (options.includeDesign && options.designText) {
    parts.push('', '---', '', `# 附录：${style.displayName} 完整 DESIGN.md`, '', options.designText)
  }
  return parts.join('\n')
}

/* ------------------------------------------------------------------ tool */

function makeTool(ctx, loadStyle) {
  return {
    name: 'design_md',
    description:
      'Browse and read the 84 brand design languages collected from getdesign.md (the same library the '
      + '「设计风格库」sidebar panel shows). action "list" searches by keyword or category and returns slug / '
      + 'name / category / keywords (40 per page, pass offset for more); action "get" returns one style\'s design tokens (colors, type, radii, spacing) '
      + 'and its style brief. Use it whenever the user asks to build a page, deck or poster in the style of a '
      + 'named brand, or asks what a style contains.',
    parameters: {
      action: {
        type: 'string',
        enum: ['list', 'get'],
        required: true,
        description: 'list = search the library; get = read one style by slug.',
      },
      query: {
        type: 'string',
        description: 'list only: keyword matched against slug, names, category, tags, style keywords and use cases.',
      },
      category: {
        type: 'string',
        description: 'list only: exact category name, e.g. 品牌官网 / 开发工具 / AI 产品.',
      },
      slug: {
        type: 'string',
        description: 'get only: the style slug returned by list (e.g. stripe, x.ai, claude).',
      },
      withDesign: {
        type: 'boolean',
        description: 'get only: also return the full DESIGN.md text (long; only when the detail matters).',
      },
      offset: {
        type: 'number',
        description: 'list only: start index for paging when the reply says more matches exist (default 0).',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          action: { type: 'string', enum: ['list', 'get'] },
          total: { type: 'integer' },
          returned: { type: 'integer' },
          truncated: { type: 'boolean' },
          hint: {
            type: 'object',
            additionalProperties: false,
            properties: {
              categories: { type: 'array', items: { type: 'string' } },
              samples: { type: 'array', items: { type: 'string' } },
            },
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                slug: { type: 'string' },
                displayName: { type: 'string' },
                nameZh: { type: 'string' },
                category: { type: 'string' },
                keywords: { type: 'string' },
              },
              required: ['slug', 'displayName', 'nameZh', 'category'],
            },
          },
          style: {
            type: 'object',
            additionalProperties: false,
            properties: {
              slug: { type: 'string' },
              displayName: { type: 'string' },
              nameZh: { type: 'string' },
              category: { type: 'string' },
              summaryZh: { type: 'string' },
              sourceUrl: { type: 'string' },
              tokens: { type: 'string' },
              brief: { type: 'string' },
              design: { type: 'string' },
            },
            required: ['slug', 'displayName', 'nameZh', 'category', 'sourceUrl', 'tokens', 'brief'],
          },
        },
        required: ['action'],
      },
      render: (args, value) => {
        if (value.action === 'list') {
          const lines = (value.items || []).map((s) => `- ${s.slug} — ${s.nameZh}（${s.displayName}）· ${s.category}${s.keywords ? ' · ' + s.keywords : ''}`)
          if (!lines.length) {
            const hint = value.hint || {}
            return [{
              type: 'text',
              text: `没有匹配的风格。可用分类：${(hint.categories || []).join(' / ')}。示例 slug：${(hint.samples || []).join(', ')}。也可以用 category 精确筛选，或直接说品牌名。`,
            }]
          }
          const head = `共 ${value.total ?? lines.length} 个匹配风格`
          const tail = value.truncated
            ? `（本页显示 ${value.returned ?? lines.length} 个，传 offset=${(value.items?.length ?? 0)} 继续）`
            : ''
          return [{ type: 'text', text: `${head}${tail}：\n${lines.join('\n')}` }]
        }
        const s = value.style
        if (!s) return [{ type: 'text', text: '未找到该 slug，可先用 list 搜索。' }]
        return [{ type: 'text', text: `## ${s.nameZh} · ${s.displayName}（${s.category}）\n${s.summaryZh || ''}\n\n### Token\n${s.tokens}\n\n### 风格要点\n${s.brief}` }]
      },
    },
    execute: async (args) => {
      const catalog = await loadCatalog()
      if (args.action === 'get') {
        const style = catalog.styles.find((s) => s.slug === String(args.slug || '').trim())
        if (!style) return { action: 'get' }
        const brief = await loadStyle(style.slug, 'brief')
        const payload = {
          slug: style.slug,
          displayName: style.displayName,
          nameZh: style.nameZh,
          category: style.category,
          summaryZh: style.summaryZh || '',
          sourceUrl: style.sourceUrl,
          tokens: tokenBlock(style),
          brief,
        }
        if (args.withDesign) payload.design = await loadStyle(style.slug, 'design')
        return { action: 'get', style: payload }
      }
      const query = String(args.query || '').trim().toLowerCase()
      const category = String(args.category || '').trim()
      const items = catalog.styles
        .filter((s) => (!category || s.category === category))
        .filter((s) => !query || [
          s.slug, s.displayName, s.nameZh, s.category, s.summaryZh, s.positioningZh,
          ...(s.tagsZh || []), ...(s.styleKeywords || []), ...(s.useCases || []), ...(s.bestFor || []), ...(s.aliases || []),
        ].join(' ').toLowerCase().includes(query))
        .map((s) => ({
          slug: s.slug,
          displayName: s.displayName,
          nameZh: s.nameZh,
          category: s.category,
          keywords: (s.styleKeywords || []).slice(0, 3).join(' / '),
        }))
      if (!items.length) {
        return {
          action: 'list',
          total: 0,
          items: [],
          hint: {
            categories: [...new Set(catalog.styles.map((s) => s.category))],
            samples: catalog.styles.slice(0, 8).map((s) => s.slug),
          },
        }
      }
      const pageSize = 40
      const offset = Number.isFinite(Number(args.offset)) && Number(args.offset) > 0 ? Math.floor(Number(args.offset)) : 0
      const page = items.slice(offset, offset + pageSize)
      return { action: 'list', total: items.length, returned: page.length, truncated: offset + page.length < items.length, items: page }
    },
  }
}

/* ------------------------------------------------------------------ apply */

export function apply(ctx) {
  const loadStyle = async (slug, kind) => {
    if (!/^[a-z0-9][a-z0-9.-]*$/i.test(slug)) throw new Error('bad slug')
    const file = path.join(DATA, kind, `${slug}.md`)
    return readFile(file, 'utf8')
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE,
    handler: async (req, res) => {
      try {
        let url
        try {
          url = new URL(req.url ?? '/', 'http://localhost')
        } catch {
          throw new HttpError(400, 'bad request url')
        }
        const rest = url.pathname.slice(ROUTE.length).replace(/^\/+/, '')
        const method = req.method ?? 'GET'

        if (method === 'GET' && (rest === '' || rest === 'health')) {
          const catalog = await loadCatalog()
          return sendJson(res, 200, { ok: true, count: catalog.styles.length, generatedAt: catalog.generatedAt })
        }

        if (method === 'GET' && rest === 'catalog') {
          const catalog = await loadCatalog()
          return sendJson(res, 200, {
            generatedAt: catalog.generatedAt,
            count: catalog.styles.length,
            styles: catalog.styles.map(projectStyle),
          })
        }

        const match = /^(style|brief|design)\/(.+)$/.exec(rest)
        if (method === 'GET' && match) {
          const [, kind, rawSlug] = match
          let slug
          try {
            slug = decodeURIComponent(rawSlug)
          } catch {
            throw new HttpError(400, 'bad style slug')
          }
          const catalog = await loadCatalog()
          const style = catalog.styles.find((s) => s.slug === slug)
          if (!style) return sendJson(res, 404, { error: 'unknown style' })
          if (kind === 'style') {
            const brief = await loadStyle(slug, 'brief')
            return sendJson(res, 200, { style: projectStyle(style), brief })
          }
          const text = await loadStyle(slug, kind)
          return sendText(res, 200, text, 'text/markdown; charset=utf-8')
        }

        if (method === 'POST' && rest === 'prompt') {
          const body = await readJson(req)
          if (!body || typeof body !== 'object' || Array.isArray(body)) {
            throw new HttpError(400, 'expected a JSON object')
          }
          const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
          if (!slug) throw new HttpError(400, 'slug is required')
          const catalog = await loadCatalog()
          const style = catalog.styles.find((s) => s.slug === slug)
          if (!style) return sendJson(res, 404, { error: 'unknown style' })
          const surfaceKey = typeof body.surface === 'string' && Object.hasOwn(SURFACES, body.surface) ? body.surface : 'web'
          const withDesign = body.includeDesign === true
          const brief = await loadStyle(style.slug, 'brief')
          const designText = withDesign ? await loadStyle(style.slug, 'design') : undefined
          const requirement = typeof body.requirement === 'string' ? body.requirement : ''
          const prompt = buildPrompt(style, brief, {
            surface: surfaceKey,
            requirement,
            includeDesign: withDesign,
            designText,
          })
          return sendJson(res, 200, {
            prompt,
            chars: [...prompt].length,
            style: { slug: style.slug, displayName: style.displayName, nameZh: style.nameZh },
          })
        }

        return sendJson(res, 404, { error: 'not found' })
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        const missing = Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')
        const status = error instanceof HttpError ? error.status : missing ? 404 : 500
        ctx.logger?.warn?.(`[dsh-design-md] route failed (${status}): ${detail}`)
        if (res.headersSent) {
          if (!res.writableEnded) res.end()
          return
        }
        if (status === 500) return sendJson(res, 500, { error: 'internal error' })
        sendJson(res, status, { error: missing ? 'style data not found' : detail })
      }
    },
  }), 'dsh-design-md: /api/design-md')

  ctx.effect(() => ctx.tools.register(makeTool(ctx, loadStyle)), 'dsh-design-md: design_md tool')
}
