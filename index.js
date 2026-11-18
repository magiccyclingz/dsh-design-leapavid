/**
 * dsh-design-leapavid — Host half.
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

export const name = 'dsh-design-leapavid'
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
    deliverable: '- 单文件 `index.html`（内联 CSS/JS，不引用外部字体、CDN、图片外链），写入当前工作目录。\n- 同一份文件内置亮色与暗色两套主题变量，跟随系统 `prefers-color-scheme`，并提供一个手动切换按钮。\n- 右上角或页脚提供「打印 / 导出 PDF」按钮（调用 `window.print()`）；`@media print` 下隐藏导航吸顶与悬浮控件、按钮本身，保留品牌色块（`-webkit-print-color-adjust: exact`），`@page{size:A4 portrait;margin:12mm}`，卡片与代码块 `break-inside: avoid`，避免半截元素跨页。\n- 结构按需求组织（导航、首屏、内容区、页脚等），信息密度与留白节奏按该风格原文处理；不要只留占位文本。',
  },
  webDark: {
    label: '网页（以深色为默认主题）',
    deliverable: '- 单文件 `index.html`（内联 CSS/JS，不引用外部字体、CDN、图片外链），写入当前工作目录。\n- 默认渲染深色主题（该风格的原生深色画布），同时保留一套可切换的亮色变量。\n- 右上角或页脚提供「打印 / 导出 PDF」按钮（调用 `window.print()`）；`@media print` 下隐藏导航吸顶与悬浮控件、按钮本身，保留品牌色块（`-webkit-print-color-adjust: exact`），`@page{size:A4 portrait;margin:12mm}`，卡片与代码块 `break-inside: avoid`，避免半截元素跨页。\n- 结构按需求组织，深色下注意描边、次级文字与强调色的对比度。',
  },
  slides: {
    label: '演示幻灯片',
    deliverable: '- 单文件 `deck.html`（内联 CSS/JS，无外部资源），16:9 满屏分页，写入当前工作目录。\n- 画布按 1600×900 设计、整体等比缩放适配窗口；正文不小于 16px、注释不小于 12px，保证投影可读。\n- 封面沿用「画布色底 + 底部超大品牌名贴左」版式（底色跟随当前主题：浅色主题用品牌浅底，不要强行做深底；深色主题用品牌深底）：左上角一行小字（品牌 + 样本/年份），底部左侧一小段说明与年份，品牌名以超大字号贴左、几乎占满整行宽度、下沿贴齐页面底边；不要用满幅色带，标题保持品牌原名大小写。\n- 同一份文件内置亮色与深色两套主题变量（`:root` 与 `:root[data-theme="dark"]`），默认跟随 `prefers-color-scheme`，右上角提供手动切换按钮。\n- 键盘 ←/→ 或 PageUp/PageDown 翻页，右下角显示页码，每页一整屏、不出现滚动条。\n- 右上角提供「打印 / 导出 PDF」按钮（调用 `window.print()`）；`@media print` 下隐藏翻页 UI、主题按钮与提示文案，每页 `break-after: page`（最后一页除外），`@page{size:1600px 900px;margin:0}`，导出结果即 16:9 横向、一页一张。\n- 每页至多 3 个信息块，内容在页内垂直居中，避免内容堆在顶部、下半页整块留白。\n- 恰含 1 页封面、1 页目录、正文若干页、1 页封底；标题层级、正文、要点列表都使用 token 中的字号与字重。',
  },
  infographic: {
    label: '信息图（竖版长图）',
    deliverable: '- 单文件 `infographic.html`（内联 CSS/SVG，无外部资源），竖版长图，画布按 1080×2160 设计、整体等比缩放，写入当前工作目录。\n- 全部图表用内联 `<svg>` 手绘，不引用任何图表库或数据接口；配色只取 token。\n- 数据一律是「示例数据」，在图注里写清楚，不要编造真实统计口径。\n- 结构：标题区 → 关键数字 → 主图 → 2 组辅助图（环形 + 条形/折线）→ 结论/图注 → 页脚。\n- 圆角、间距节奏、标题字号与字距都按该风格 token 走（`radiusCard` / `spaceBase` / `displaySize`），不要退回通用 8px 网格。\n- 正文不小于 14px、图表标签不小于 11px；长图可打印，`@page{size:A3 portrait;margin:12mm}`，各区块 `break-inside: avoid`。',
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

const DENSITIES = {
  airy: {
    label: '宽松',
    blocks: 2,
    scale: '展示标题 88–96px / 小标题 40–44px / 正文 18–19px / 注释 13px',
    rhythm: '段落间距 40–56px，页边距 96–112px；一页只讲一件事，留白占三成以上',
    hint: '发布会、路演大屏：一页一个主张，字大、留白多',
  },
  standard: {
    label: '标准',
    blocks: 3,
    scale: '展示标题 72–80px / 小标题 34–38px / 正文 16–17px / 注释 12px',
    rhythm: '段落间距 28–40px，页边距 80–96px；一页最多三个信息块，内容垂直居中',
    hint: '通用对外 deck：信息量与留白平衡',
  },
  dense: {
    label: '信息密集',
    blocks: 4,
    scale: '展示标题 56–64px / 小标题 28–32px / 正文 15–16px / 注释 12px',
    rhythm: '段落间距 18–24px，页边距 64–72px；允许四个信息块，但每块仍需一句话标题',
    hint: '内部汇报、评审会：信息密度优先，字号仍保证投影可读',
  },
}

const INFO_RATIOS = {
  square: { label: '1:1', w: 1, h: 1, hint: '方形，适合社交平台单图' },
  wide: { label: '4:3', w: 4, h: 3, hint: '横向，适合演示与打印' },
  tall: { label: '3:4', w: 3, h: 4, hint: '竖版长图，信息图的默认比例' },
  hd: { label: '16:9', w: 16, h: 9, hint: '宽屏，适合投屏与视频封面' },
  vertical: { label: '9:16', w: 9, h: 16, hint: '手机竖屏，适合公众号封面与短视频' },
}

const INFO_CELL_DENSITY = {
  compact: { label: '紧凑', cells: '4–6', note: '每栏可排 4–6 个信息块，行距压缩、字号略小' },
  standard: { label: '标准', cells: '3–4', note: '每栏 3–4 个信息块，留白充足' },
}

const INFO_LAYOUTS = {
  classic: { label: '一栏模板', lines: ['标题与定位', '三格 KPI 横条', '主图（按所选图表）', '环形占比 + 图例 + 关键结论'] },
  grid: { label: '三栏模板', lines: ['标题与定位', '三格 KPI 横条', '三栏并排：环形占比 / 渠道图例 / 关键结论', '通栏主图（按所选图表）'] },
  rings: { label: '同心环', lines: ['标题与定位', '三层同心环做主视觉（每层一段占比）', '右侧图例与关键结论', '底部三格 KPI 横条'] },
  spread: { label: '两栏模板', lines: ['页眉 + 双栏布局', '左栏：标题、KPI、渠道图例', '右栏：主图（按所选图表）与关键结论'] },
  columns: { label: '四栏模板', lines: ['品牌页眉（品牌名 + INFOGRAPHIC · 年份），与三栏模板同一套', '四栏正文，栏间用 1px 竖线分隔：①三个大数字与三段流程 ②环形占比 + 图例 ③主图 + 关键结论 ④选项清单 + 柱状图', '底部一条 5 段色条收尾（唯一的满幅色块）', '每栏 2–3 个 cell，cell 之间用 1px 横线分隔'] },
}

const INFO_PALETTES = {
  brand: { label: '品牌色', hexes: [] },
  teal: {
    label: '模板蓝 · 珊瑚红',
    hexes: ['#0B3B52', '#2E7FA8', '#E8402F', '#5BB8E8', '#F4F7F9'],
    roles: { background: '#FFFFFF', ink: '#0B3B52', accent: '#E8402F', secondary: '#2E7FA8', muted: '#6C7A85', hairline: '#D8E2E8' },
  },
  mint: {
    label: '扁平绿 · 青蓝',
    hexes: ['#1B3A5C', '#7CC242', '#22A9DC', '#8ED1F0', '#F7F9FB'],
    roles: { background: '#FFFFFF', ink: '#1B3A5C', accent: '#7CC242', secondary: '#22A9DC', muted: '#7A8894', hairline: '#E1E8EE' },
  },
}

const CHARTS = {
  auto: {
    label: '自动选择',
    tip: '按内容挑一种最合适的图形，不要为了凑图而堆图表',
    main: '主图：由你按数据形态选择（比较用柱状、趋势用折线、占比用环形）',
  },
  bar: {
    label: '柱状图',
    tip: '适合类别之间的比较',
    main: '主图：柱状图（6–8 根柱，柱宽一致，数值标在柱顶，零线用 hairline）',
  },
  line: {
    label: '折线图',
    tip: '适合时间序列与趋势',
    main: '主图：折线图（8–12 个点，2–3 条线，线宽 2px，拐点用 3px 圆点，末端可加数值标签）',
  },
  donut: {
    label: '环形图',
    tip: '适合占比与构成',
    main: '主图：环形图（3–4 段，中心放一个关键数字，段与段之间留 2px 白色间隙）',
  },
  area: {
    label: '面积图',
    tip: '适合强调累计量与堆叠关系',
    main: '主图：面积图（2 条堆叠区域，填充用 accent 的 18% 与 8% 透明度，描边用实色）',
  },
  funnel: {
    label: '漏斗 / 条形对比',
    tip: '适合流程转化与排名',
    main: '主图：横向条形图或漏斗（5–6 级，左侧标签、右侧数值，条形端头做 4px 圆角）',
  },
}

const STRUCTURES = {
  auto: { label: '不限', outline: [] },
  landing: {
    label: '落地页',
    surface: 'web',
    outline: ['首屏：标题 + 一句副标题 + 主次两个 CTA + 一张主视觉', '三条产品价值（图标/编号 + 标题 + 两句说明）', '一段能建立信任的内容（客户 logo 墙、数据、或引用）', '一个收尾 CTA 区块 + 页脚'],
  },
  pricing: {
    label: '定价页',
    surface: 'web',
    outline: ['首屏：一句定位 + 计费周期切换（月付/年付）', '三档价格卡（中档为推荐，强调色描边或实底）', '功能对比表或清单', 'FAQ 折叠列表（4–6 条）', '底部 CTA + 页脚'],
  },
  dashboard: {
    label: '控制台',
    surface: 'web',
    outline: ['左侧固定导航 + 顶部工具栏（搜索、通知、账户）', '4 个关键指标卡（数字 + 环比）', '一张主图表（折线或柱状）+ 一张分布图', '一张数据表格（斑马纹、状态标签、行操作）'],
  },
  blog: {
    label: '博客',
    surface: 'web',
    outline: ['文章列表：封面 + 标题 + 摘要 + 日期/作者', '置顶或精选一文', '标签筛选行', '分页或「加载更多」'],
  },
  deck: {
    label: '标准 deck',
    surface: 'slides',
    outline: [
      '第 1 页 封面：品牌名 + 一句话定位 + 年份',
      '第 2 页 主张：一句结论 + 三条支撑要点',
      '第 3 页 目录：三个章节 + 页码',
      '第 4 页 数据：四个关键指标（数字 + 标签）',
      '第 5 页 速览：六格要点拼贴 + 页脚',
    ],
  },
  pitch: {
    label: '提案 deck',
    surface: 'slides',
    outline: [
      '第 1 页 封面：项目名 + 客户 + 日期',
      '第 2 页 问题：现状与痛点（三条）',
      '第 3 页 方案：主张 + 三个能力',
      '第 4 页 证据：数据或案例（四个指标）',
      '第 5 页 下一步：里程碑与联系人',
    ],
  },
  product: {
    label: '产品 deck',
    surface: 'slides',
    outline: [
      '第 1 页 封面：产品名 + 一句话价值 + 发布状态',
      '第 2 页 现状：三个真实场景里的痛点',
      '第 3 页 产品：三个核心能力（每项一句 + 一个产品截图位）',
      '第 4 页 证据：实测数据或用户评价（四个指标）',
      '第 5 页 行动：价格档位 + 上线时间 + 行动号召',
    ],
  },
  venture: {
    label: '融资 deck',
    surface: 'slides',
    outline: [
      '第 1 页 封面：项目名 + 一句话定位 + 轮次',
      '第 2 页 市场：机会规模与切入角度（三个数字）',
      '第 3 页 产品与增长：核心能力 + 验证指标',
      '第 4 页 团队：三位关键成员 + 各自战绩',
      '第 5 页 融资：金额 / 用途拆解 / 里程碑',
    ],
  },
  training: {
    label: '培训 deck',
    surface: 'slides',
    outline: [
      '第 1 页 封面：课程名 + 讲师 + 时长',
      '第 2 页 目标：学完能独立完成什么',
      '第 3 页 知识点：三块内容（每块一句解释）',
      '第 4 页 示例与练习：一个完整例子 + 动手任务',
      '第 5 页 回顾：要点清单 + 延伸资料',
    ],
  },
  report: {
    label: '汇报 deck',
    surface: 'slides',
    outline: [
      '第 1 页 封面：报告名 + 周期 + 汇报人',
      '第 2 页 结论先行：一句话结论',
      '第 3 页 过程：关键动作与时间线',
      '第 4 页 数据：四个指标 + 同比',
      '第 5 页 计划：下阶段三件事',
    ],
  },
}

function buildPrompt(style, brief, options) {
  const surface = SURFACES[options.surface] || SURFACES.web
  const surfaceFamily = options.surface === 'infographic'
    ? 'info'
    : (options.surface === 'slides' || options.surface === 'poster' ? 'slides' : 'web')
  const chart = CHARTS[options.chart] || CHARTS.auto
  const layout = INFO_LAYOUTS[options.layout] || INFO_LAYOUTS.classic
  const palette = INFO_PALETTES[options.palette] || INFO_PALETTES.brand
  const ratio = INFO_RATIOS[options.ratio] || INFO_RATIOS.tall
  const cellDensity = INFO_CELL_DENSITY[options.cell] || INFO_CELL_DENSITY.standard
  const picked = STRUCTURES[options.structure] || STRUCTURES.auto
  const structure = picked.surface && picked.surface !== surfaceFamily ? STRUCTURES.auto : picked
  const density = DENSITIES[options.density] || DENSITIES.standard
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
    structure.outline.length
      ? ['## 页面结构（按此顺序排布）', ...structure.outline.map((line, i) => `${i + 1}. ${line}`)].join('\n')
      : '',
    structure.outline.length ? '' : null,
    options.surface === 'slides'
      ? [
        `## 版式密度（${density.label}）`,
        `- 字号：${density.scale}`,
        `- 节奏：${density.rhythm}`,
        `- 每页信息块上限：${density.blocks} 个`,
      ].join('\n')
      : '',
    surfaceFamily === 'slides' ? '' : null,
    surfaceFamily === 'info'
      ? [`## 信息图版式（${layout.label}）`, ...layout.lines.map((line, i) => `${i + 1}. ${line}`)].join('\n')
      : '',
    surfaceFamily === 'info'
      ? [
        `## 画布比例（${ratio.label}）`,
        `- 画布宽高比固定为 ${ratio.w}:${ratio.h}（${ratio.hint}）；所有内容按这个比例重排，不要裁切、不要出现需要横向滚动的内容。`,
        '- 比例变化时优先重排信息块位置（多栏改单栏、左右改上下），不要简单拉伸留白。',
      ].join('\n')
      : '',
    surfaceFamily === 'info'
      ? [
        `## 信息块密度（${cellDensity.label}）`,
        `- ${cellDensity.note}；全图信息块约 ${cellDensity.cells} 个/栏。`,
        '- 密度只改信息块数量与间距，不改配色与图表类型。',
      ].join('\n')
      : '',
    surfaceFamily === 'info' ? '' : null,
    surfaceFamily === 'info' && palette.hexes.length
      ? [
        `## 配色覆写（${palette.label}）`,
        `- 背景 ${palette.roles.background}、正文 ${palette.roles.ink}、强调 ${palette.roles.accent}、辅色 ${palette.roles.secondary}`,
        `- 次要文字 ${palette.roles.muted}、分割线 ${palette.roles.hairline}`,
        `- 色板：${palette.hexes.join(' / ')}；这些颜色优先于品牌 token，图表系列色从这里派生。`,
        '- 除上述颜色与白色外不要再引入其他色相，图表最多 3 个系列。',
      ].join('\n')
      : '',
    surfaceFamily === 'info' ? '' : null,
    (surfaceFamily === 'info' || surfaceFamily === 'web' || surfaceFamily === 'slides') && options.surface !== 'poster'
      ? [
        `## 图表规范（${chart.label}）`,
        `- ${chart.main}`,
        '- 只用内联 SVG 手写，不要引入 ECharts / Chart.js / D3 等任何图表库或外部资源。',
        '- 系列颜色只能取 token 中的 accent / ink / muted 及其浅深派生，最多 4 个系列，禁止彩虹配色。',
        '- 坐标轴与网格用 hairline 或 8% 透明度的 ink；数据标签 11–12px，贴在图形上而不是图例里。',
        `- 选型原则：${chart.tip}；数据用「示例数据」标注，不要编造真实统计口径。`,
      ].join('\n')
      : '',
    surfaceFamily === 'info' || surfaceFamily === 'web' || surfaceFamily === 'slides' ? '' : null,
    `## 交付要求（${surface.label}）`,
    structure.outline.length && surfaceFamily === 'slides'
      ? surface.deliverable.replace(
        '- 恰含 1 页封面、1 页目录、正文若干页、1 页封底；标题层级、正文、要点列表都使用 token 中的字号与字重。',
        `- 严格按上面的页面结构逐页生成，共 ${structure.outline.length} 页；封面就是第 1 页，最后一项是收束页，不额外插入目录或封底。\n- 标题层级、正文、要点列表都使用 token 中的字号与字重。`,
      )
      : surface.deliverable,
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
  if (options.previous) {
    parts.push('', '## 上一次的产物', `文件：${options.previous}`, '请在这个文件的基础上修改，保留其余部分不要重写。')
  }
  const cleaned = parts.filter((x) => typeof x === 'string' && x.length > 0)
  parts.length = 0
  parts.push(...cleaned)
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
      + '「LeapAvid 设计风格库 / DSH-Design-LeapAvid」sidebar panel shows). action "list" searches by keyword or category and returns slug / '
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
          if (body.surface != null && !Object.hasOwn(SURFACES, body.surface)) {
            return sendJson(res, 400, { error: 'unknown surface' })
          }
          const surfaceKey = typeof body.surface === 'string' && Object.hasOwn(SURFACES, body.surface) ? body.surface : 'web'
          const structureKey = typeof body.structure === 'string' && Object.hasOwn(STRUCTURES, body.structure) ? body.structure : 'auto'
          const densityKey = typeof body.density === 'string' && Object.hasOwn(DENSITIES, body.density) ? body.density : 'standard'
          const chartKey = typeof body.chart === 'string' && Object.hasOwn(CHARTS, body.chart) ? body.chart : 'auto'
          const layoutKey = typeof body.layout === 'string' && Object.hasOwn(INFO_LAYOUTS, body.layout) ? body.layout : 'classic'
          const paletteKey = typeof body.palette === 'string' && Object.hasOwn(INFO_PALETTES, body.palette) ? body.palette : 'brand'
          const ratioKey = typeof body.ratio === 'string' && Object.hasOwn(INFO_RATIOS, body.ratio) ? body.ratio : 'tall'
          const cellKey = typeof body.cell === 'string' && Object.hasOwn(INFO_CELL_DENSITY, body.cell) ? body.cell : 'standard'
          const previous = typeof body.previous === 'string' ? body.previous.slice(0, 400) : ''
          const withDesign = body.includeDesign === true
          const brief = await loadStyle(style.slug, 'brief')
          const designText = withDesign ? await loadStyle(style.slug, 'design') : undefined
          const requirement = typeof body.requirement === 'string' ? body.requirement : ''
          const prompt = buildPrompt(style, brief, {
            surface: surfaceKey,
            structure: structureKey,
            density: densityKey,
            chart: chartKey,
            layout: layoutKey,
            palette: paletteKey,
            ratio: ratioKey,
            cell: cellKey,
            previous,
            requirement,
            includeDesign: withDesign,
            designText,
          })
          return sendJson(res, 200, {
            prompt,
            chars: [...prompt].length,
            structure: structureKey,
            density: densityKey,
            chart: chartKey,
            layout: layoutKey,
            palette: paletteKey,
            ratio: ratioKey,
            cell: cellKey,
            style: { slug: style.slug, displayName: style.displayName, nameZh: style.nameZh },
          })
        }

        return sendJson(res, 404, { error: 'not found' })
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        const missing = Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')
        const status = error instanceof HttpError ? error.status : missing ? 404 : 500
        ctx.logger?.warn?.(`[dsh-design-leapavid] route failed (${status}): ${detail}`)
        if (res.headersSent) {
          if (!res.writableEnded) res.end()
          return
        }
        if (status === 500) return sendJson(res, 500, { error: 'internal error' })
        sendJson(res, status, { error: missing ? 'style data not found' : detail })
      }
    },
  }), 'dsh-design-leapavid: /api/design-md')

  ctx.effect(() => ctx.tools.register(makeTool(ctx, loadStyle)), 'dsh-design-leapavid: design_md tool')
}
