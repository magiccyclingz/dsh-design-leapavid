/**
 * dsh-design-md — Client half.
 *
 * Registers one sidebar row (the panel icon) and one main panel: the style
 * library. Every card is a live React rendering of that style's own DESIGN.md
 * tokens — no iframes, no screenshots — so 84 styles can be compared at any
 * panel width.
 */
window.__ModuleLoader__.load({
  id: 'dsh-design-md',
  factory: (require) => {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo, useRef } = React

    const API = '/api/design-md'
    const PANEL_ID = 'design-md'

    /** ctx is captured at apply() time; slot components cannot receive it. */
    const runtime = { ctx: null }
    /** Survives panel unmount (switching back to the conversation). */
    const memory = { query: '', category: null, surface: 'page', slug: null }

    /* ------------------------------------------------------------ strings */

    const STRINGS = {
      zh: {
        title: '设计风格库',
        subtitle: '84 套品牌设计语言 · 点开看网页亮/暗、幻灯片、海报',
        search: '搜索品牌、风格关键词、适用场景…',
        all: '全部',
        empty: '没有匹配的风格',
        emptyHint: '换个关键词，或点「全部」看完整 84 套。',
        retry: '重试',
        loading: '正在读取设计库…',
        useThis: '用这套风格',
        surfaces: { page: '网页', dark: '深色', slides: '幻灯片', poster: '海报' },
        back: '返回列表',
        backChat: '回到对话',
        close: '关闭',
        shapeCard: '卡片圆角',
        shapeButton: '按钮圆角',
        shapePill: '胶囊圆角',
        shapeBase: '间距基数',
        shapeDisplay: '展示字体',
        shapeBody: '正文字体',
        clearFilters: '清除筛选',
        copyFailed: '复制失败，请手动选择文本',
        designFailed: '读取 DESIGN.md 失败',
        cardBody: '按这套版式排布的模块说明与要点。',
        learnMore: '了解更多 →',
        source: '来源 getdesign.md',
        brief: '设计要点',
        palette: '配色',
        typeScale: '字体层级',
        shape: '圆角与间距',
        keywords: '关键词',
        bestFor: '适合',
        avoidFor: '避免',
        checklist: 'AI 生成检查项',
        recipe: '推荐提示词',
        copy: '复制',
        copied: '已复制',
        expand: '展开全文',
        collapse: '收起',
        formTitle: '用这套风格生成',
        formHint: '选好产出形态、写下需求，发送到当前会话即可开始生成。',
        output: '产出形态',
        outputs: { web: '网页', webDark: '深色网页', slides: '幻灯片', poster: '海报' },
        requirement: '需求描述',
        requirementPlaceholder: '例如：做一个 AI 笔记产品的官网首页，首屏突出卖点，带三栏功能区和定价表。',
        includeDesign: '连同完整 DESIGN.md 一起发送（更还原，提示词更长）',
        send: '发送到当前会话',
        sending: '正在发送…',
        sendOk: '已发送到当前会话，DSH 会按这套风格开始生成。',
        backToChat: '切回对话',
        copyPrompt: '复制提示词',
        viewDesign: '查看 DESIGN.md',
        chars: '提示词约 {n} 字',
        noSession: '没有找到当前会话：请先在左侧打开一个对话再发送。',
        detailNote: '预览是该风格 token 的实时渲染，文案为示意内容。',
        allCategories: '全部',
        errorCatalog: '设计库读取失败',
      },
      en: {
        title: 'Design library',
        subtitle: '84 brand design languages — light/dark pages, slides, posters',
        search: 'Search brands, keywords, use cases…',
        all: 'All',
        empty: 'No style matches',
        emptyHint: 'Try another keyword, or switch back to All.',
        retry: 'Retry',
        loading: 'Loading design library…',
        useThis: 'Use this style',
        surfaces: { page: 'Web', dark: 'Dark', slides: 'Slides', poster: 'Poster' },
        back: 'Back',
        backChat: 'Back to chat',
        close: 'Close',
        shapeCard: 'Card radius',
        shapeButton: 'Button radius',
        shapePill: 'Pill radius',
        shapeBase: 'Spacing base',
        shapeDisplay: 'Display font',
        shapeBody: 'Body font',
        clearFilters: 'Clear filters',
        copyFailed: 'Copy failed — select the text manually',
        designFailed: 'Could not load DESIGN.md',
        cardBody: 'Module copy set in this layout rhythm.',
        learnMore: 'Learn more →',
        source: 'Source: getdesign.md',
        brief: 'Design notes',
        palette: 'Palette',
        typeScale: 'Type scale',
        shape: 'Radii & spacing',
        keywords: 'Keywords',
        bestFor: 'Best for',
        avoidFor: 'Avoid for',
        checklist: 'AI checklist',
        recipe: 'Prompt recipe',
        copy: 'Copy',
        copied: 'Copied',
        expand: 'Show all',
        collapse: 'Collapse',
        formTitle: 'Generate with this style',
        formHint: 'Pick an output, describe the work, send it to this conversation.',
        output: 'Output',
        outputs: { web: 'Web page', webDark: 'Dark page', slides: 'Slide deck', poster: 'Poster' },
        requirement: 'What to build',
        requirementPlaceholder: 'e.g. a landing page for an AI notes app — hero, three-column features, pricing table.',
        includeDesign: 'Attach the full DESIGN.md (closer match, longer prompt)',
        send: 'Send to this conversation',
        sending: 'Sending…',
        sendOk: 'Sent. DSH is starting on it with this style.',
        backToChat: 'Back to chat',
        copyPrompt: 'Copy prompt',
        viewDesign: 'View DESIGN.md',
        chars: '~{n} characters',
        noSession: 'No active conversation — open one on the left first.',
        detailNote: 'Live rendering of this style\u2019s tokens; copy is placeholder.',
        allCategories: 'All',
        errorCatalog: 'Could not load the library',
      },
    }

    let locale = 'zh'
    const localeSubs = new Set()

    /** Switches the module locale and wakes every mounted component. */
    function setLocale(next) {
      const value = typeof next === 'string' ? next : next && typeof next === 'object' ? next.active : null
      if (!value || value === locale) return
      locale = value
      for (const fn of localeSubs) fn(value)
    }

    /** Re-renders the caller whenever the host locale changes. */
    function useLocale() {
      const [value, setValue] = useState(locale)
      useEffect(() => {
        const fn = (next) => setValue(next)
        localeSubs.add(fn)
        setValue(locale)
        return () => { localeSubs.delete(fn) }
      }, [])
      return value
    }

    const t = (key) => {
      const dict = STRINGS[locale] || STRINGS.zh
      const value = key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict)
      return value !== undefined ? value : key
    }

    /* -------------------------------------------------------------- utils */

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

    function hexToRgb(hex) {
      const value = String(hex || '').replace('#', '')
      const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value
      const num = Number.parseInt(full.slice(0, 6), 16)
      if (Number.isNaN(num)) return { r: 0, g: 0, b: 0 }
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
    }

    function rgbToHex({ r, g, b }) {
      const to = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')
      return `#${to(r)}${to(g)}${to(b)}`
    }

    function mix(a, b, weight) {
      const x = hexToRgb(a)
      const y = hexToRgb(b)
      const w = clamp(Number(weight) || 0, 0, 1)
      return rgbToHex({ r: x.r + (y.r - x.r) * w, g: x.g + (y.g - x.g) * w, b: x.b + (y.b - x.b) * w })
    }

    function alpha(hex, value) {
      const { r, g, b } = hexToRgb(hex)
      return `rgba(${r}, ${g}, ${b}, ${value})`
    }

    function luminance(hex) {
      const { r, g, b } = hexToRgb(hex)
      const channel = (v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
    }

    const prettyRadius = (value) => {
      const text = String(value ?? '')
      const num = Number.parseFloat(text)
      if (!Number.isFinite(num)) return text || '—'
      return num >= 999 ? (locale === 'en' ? 'fully rounded' : '全圆角') : `${Math.round(num)}px`
    }

    const shorten = (text, max) => {
      const value = String(text || '').replace(/\s+/g, ' ').trim()
      return value.length > max ? `${value.slice(0, max - 1)}…` : value
    }

    function themeOf(style, kind) {
      const v = style.visual
      if (kind === 'poster') {
        const bg = luminance(v.ink) > 0.5 ? v.ink : mix(v.ink, '#000000', 0)
        return {
          bg,
          surface: mix(bg, v.canvas, 0.1),
          ink: v.canvas,
          muted: mix(v.canvas, bg, 0.42),
          line: mix(v.canvas, bg, 0.7),
          accent: v.accent,
          accentInk: v.accentText,
          dark: luminance(bg) < 0.5,
        }
      }
      const dark = kind === 'dark' || v.darkFirst
      if (dark) {
        return {
          bg: v.darkCanvas,
          surface: v.darkSurface,
          ink: v.darkInk,
          muted: v.darkMuted,
          line: mix(v.darkInk, v.darkCanvas, 0.78),
          accent: v.accent,
          accentInk: v.accentText,
          dark: true,
        }
      }
      return {
        bg: v.canvas,
        surface: v.surface,
        ink: v.ink,
        muted: v.muted,
        line: v.hairline,
        accent: v.accent,
        accentInk: v.accentText,
        dark: false,
      }
    }

    const BASE_WIDTH = { page: 1400, dark: 1400, slides: 1280, poster: 900 }
    const ASPECT = { page: '4 / 3', dark: '4 / 3', slides: '16 / 9', poster: '3 / 4' }

    /* ---------------------------------------------------------- copy deck */

    function copyDeck(style) {
      const v = style.visual
      const brand = shorten(style.displayName || style.nameZh, 20)
      const keywords = (style.styleKeywords || []).filter((k) => k && k.length <= 10)
      const cards = (style.useCases && style.useCases.length ? style.useCases : style.tagsZh || []).slice(0, 3)
      const bullets = [...keywords, ...(style.tagsZh || [])].filter(Boolean).slice(0, 3)
      const eyebrow = style.category || (keywords[0] ?? 'Design system')
      const lede = shorten(style.summaryZh || style.descriptionEn || style.positioningZh || '', 46)
      return {
        brand,
        eyebrow,
        lede,
        cards: cards.length ? cards : ['产品首页', '定价页', '控制台'],
        bullets: bullets.length ? bullets : ['Typography', 'Color', 'Spacing'],
        meta: `${v.radiusCard} r · ${v.spaceBase || 8}px`,
        navLinks: ['产品', '方案', '定价'],
        cta: '开始使用',
        ctaAlt: '了解更多',
      }
    }

    /* ------------------------------------------------------------ surface */

    function Surface({ style, kind }) {
      const base = BASE_WIDTH[kind] || 1400
      const u = (px) => `${((px / base) * 100).toFixed(3)}cqw`
      // Radii must scale with the artboard too, or a 24px card corner becomes a pill at thumbnail size.
      const r = (value) => {
        const text = String(value ?? '')
        return /^9{3,}/.test(text) ? '9999px' : u(Number.parseFloat(text) || 0)
      }
      const v = style.visual
      const th = themeOf(style, kind)
      const deck = copyDeck(style)
      const displayFont = v.displayStack
      const bodyFont = v.bodyStack

      const rootStyle = {
        '--dm-bg': th.bg,
        '--dm-surface': th.surface,
        '--dm-ink': th.ink,
        '--dm-muted': th.muted,
        '--dm-line': th.line,
        '--dm-accent': th.accent,
        '--dm-accent-ink': th.accentInk,
        '--dm-display': displayFont,
        '--dm-body': bodyFont,
        '--dm-rcard': r(v.radiusCard),
        '--dm-rbtn': r(v.radiusButton),
        '--dm-rpill': r(v.radiusPill),
        background: th.bg,
        color: th.ink,
        fontFamily: bodyFont,
      }

      if (kind === 'slides') {
        return h('div', { className: 'dm-art', 'data-kind': kind, style: { ...rootStyle, aspectRatio: ASPECT[kind] } },
          h('div', { className: 'dm-art-inner dm-slide' },
            h('div', { className: 'dm-slide-head' },
              h('span', { className: 'dm-kicker', style: { color: th.muted, fontSize: u(15), letterSpacing: u(2) } }, deck.eyebrow),
              h('span', { className: 'dm-slide-no', style: { color: th.accent, fontSize: u(15), fontFamily: v.monoFamily || bodyFont } }, '01 / 08'),
            ),
            h('div', { className: 'dm-slide-body' },
              h('h3', {
                className: 'dm-slide-title',
                style: {
                  fontFamily: displayFont,
                  fontWeight: v.displayWeight,
                  fontSize: u(v.displaySize * 0.78),
                  letterSpacing: u(Number.parseFloat(v.displayTracking) || 0),
                  lineHeight: v.displayLineHeight,
                  color: th.ink,
                  margin: 0,
                },
              }, deck.brand),
              h('p', {
                style: { fontSize: u(19), lineHeight: 1.6, color: th.muted, margin: 0, maxWidth: '78%' },
              }, deck.lede),
              h('div', { className: 'dm-slide-bar', style: { background: th.accent } }),
              h('ul', { className: 'dm-slide-list' },
                ...deck.bullets.map((item, index) => h('li', { key: index },
                  h('span', { className: 'dm-bullet', style: { background: th.accent } }),
                  h('span', { style: { fontSize: u(16), color: th.ink } }, item),
                )),
              ),
            ),
            h('div', { className: 'dm-slide-foot', style: { borderColor: th.line } },
              h('span', { style: { fontSize: u(13), color: th.muted }, }, `${style.displayName} · Design System`),
              h('span', { style: { fontSize: u(13), color: th.muted, fontFamily: v.monoFamily || bodyFont } }, 'getdesign.md'),
            ),
          ),
        )
      }

      if (kind === 'poster') {
        const words = String(deck.brand).split(/\s+/)
        const lines = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [deck.brand]
        return h('div', { className: 'dm-art', 'data-kind': kind, style: { ...rootStyle, aspectRatio: ASPECT[kind] } },
          h('div', { className: 'dm-art-inner dm-poster' },
            h('div', { className: 'dm-poster-top' },
              h('span', { style: { fontSize: u(15), letterSpacing: u(3), color: th.muted, textTransform: 'uppercase' } }, deck.eyebrow),
              h('span', { className: 'dm-poster-dot', style: { background: th.accent } }),
            ),
            h('div', { className: 'dm-poster-mid' },
              h('h3', {
                style: {
                  fontFamily: displayFont,
                  fontWeight: v.displayWeight,
                  fontSize: u(v.displaySize * 1.5),
                  lineHeight: clamp(Number.parseFloat(v.displayLineHeight) || 1.1, 0.9, 1.1),
                  letterSpacing: u((Number.parseFloat(v.displayTracking) || 0) * 1.5),
                  color: th.ink,
                  margin: 0,
                  textTransform: 'uppercase',
                  whiteSpace: 'pre-line',
                },
              }, lines.join('\n')),
              h('p', { style: { fontSize: u(20), lineHeight: 1.65, color: th.muted, margin: 0, maxWidth: '82%' } }, deck.lede),
            ),
            h('div', { className: 'dm-poster-foot' },
              h('div', { style: { height: u(3), background: th.accent, width: u(120) } }),
              h('div', { className: 'dm-poster-meta', style: { color: th.muted, fontSize: u(14), fontFamily: v.monoFamily || bodyFont } },
                h('span', null, style.slug),
                h('span', null, `${v.radiusCard} · ${v.fontClass}`),
              ),
            ),
          ),
        )
      }

      /* page + dark page */
      return h('div', { className: 'dm-art', 'data-kind': 'page', style: { ...rootStyle, aspectRatio: ASPECT.page } },
        h('div', { className: 'dm-art-inner dm-page' },
          h('nav', { className: 'dm-nav', style: { borderColor: th.line } },
            h('div', { className: 'dm-nav-brand' },
              h('span', {
                className: 'dm-logo',
                style: { background: th.accent, color: th.accentInk, borderRadius: r(v.radiusCard), fontSize: u(15), fontFamily: displayFont, fontWeight: 700 },
              }, (deck.brand[0] || 'A').toUpperCase()),
              h('span', { style: { fontSize: u(17), fontWeight: 600, letterSpacing: '-0.01em' } }, deck.brand),
            ),
            h('div', { className: 'dm-nav-links' },
              ...deck.navLinks.map((link, index) => h('span', { key: index, style: { fontSize: u(14.5), color: th.muted } }, link)),
            ),
            h('span', {
              className: 'dm-nav-cta',
              style: { fontSize: u(14), background: th.accent, color: th.accentInk, borderRadius: r(v.radiusButton), padding: `${u(9)} ${u(20)}` },
            }, deck.cta),
          ),
          h('div', { className: 'dm-hero' },
            h('span', { className: 'dm-eyebrow', style: { color: th.accent, fontSize: u(13), letterSpacing: u(1.6) } }, deck.eyebrow),
            h('h3', {
              style: {
                fontFamily: displayFont,
                fontWeight: v.displayWeight,
                fontSize: u(v.displaySize),
                lineHeight: v.displayLineHeight,
                letterSpacing: u(Number.parseFloat(v.displayTracking) || 0),
                margin: 0,
                color: th.ink,
              },
            }, deck.brand),
            h('p', { style: { fontSize: u(19), lineHeight: 1.7, color: th.muted, margin: 0, maxWidth: '66%' } }, deck.lede),
            h('div', { className: 'dm-ctas' },
              h('span', {
                style: { background: th.accent, color: th.accentInk, borderRadius: r(v.radiusButton), fontSize: u(14.5), padding: `${u(11)} ${u(24)}` },
              }, deck.cta),
              h('span', {
                style: { border: `${u(1)} solid ${th.line}`, color: th.ink, borderRadius: r(v.radiusButton), fontSize: u(14.5), padding: `${u(11)} ${u(24)}` },
              }, deck.ctaAlt),
            ),
          ),
          h('div', { className: 'dm-cards' },
            ...deck.cards.map((title, index) => {
              const second = style.colors.find((c) => c.hex)?.hex || th.accent
              return h('div', {
                key: index,
                className: 'dm-mini-card',
                style: { background: th.surface, border: `${u(1)} solid ${th.line}`, borderRadius: r(v.radiusCard), padding: u(24) },
              },
              h('span', {
                className: 'dm-mini-media',
                style: {
                  background: `linear-gradient(${[135, 112, 158][index % 3]}deg, ${alpha(th.accent, [0.32, 0.22, 0.14][index % 3])}, ${alpha(second, 0.12)} 62%, transparent 100%)`,
                  border: `${u(1)} solid ${alpha(th.accent, 0.22)}`,
                  borderRadius: r(v.radiusCard),
                },
              }),
              h('span', {
                className: 'dm-mini-icon',
                style: { background: mix(th.accent, th.bg, index === 0 ? 0.12 : index === 1 ? 0.78 : 0.9), borderRadius: u(10) },
              }),
              h('span', { style: { fontSize: u(18), fontWeight: 600, color: th.ink, marginTop: u(14) } }, title),
              h('span', { style: { fontSize: u(14), lineHeight: 1.6, color: th.muted } }, t('cardBody')),
              h('span', { style: { fontSize: u(14), fontWeight: 600, color: th.accent, marginTop: u(10) } }, t('learnMore')),
              )
            }),
          ),
          h('footer', { className: 'dm-foot', style: { borderTop: `${u(1)} solid ${th.line}` } },
            h('span', { style: { fontSize: u(13), color: th.muted } }, `${deck.brand} · © 2026`),
            h('span', { className: 'dm-foot-links' },
              ...deck.navLinks.map((link, index) => h('span', { key: index, style: { fontSize: u(13), color: th.muted } }, link)),
            ),
          ),
        ),
      )
    }

    /* --------------------------------------------------------------- card */

    function StyleCard({ style, kind, onOpen }) {
      const swatches = useMemo(() => {
        const picks = [style.visual.canvas, style.visual.accent, style.visual.surface]
        const extra = style.colors.filter((c) => c.hex && !picks.includes(c.hex)).slice(0, 1).map((c) => c.hex)
        return [...picks, ...extra].slice(0, 4)
      }, [style])
      return h('button', {
        type: 'button',
        className: 'dm-card',
        onClick: () => onOpen(style.slug),
        title: `${style.nameZh} · ${style.displayName}`,
        'aria-label': `${style.nameZh} · ${style.displayName}（${style.category}）`,
      },
      h('span', { className: 'dm-card-art' }, h(Surface, { style, kind })),
      h('span', { className: 'dm-card-hover' }, `${t('useThis')} →`),
      h('span', { className: 'dm-card-meta' },
        h('span', { className: 'dm-card-names' },
          h('span', { className: 'dm-card-zh' }, style.nameZh),
          h('span', { className: 'dm-card-en' },
            style.nameZh === style.displayName ? style.category : `${style.displayName} · ${style.category}`,
          ),
        ),
        h('span', { className: 'dm-dots' },
          ...swatches.map((hex, index) => h('i', { key: index, style: { background: hex } })),
        ),
      ),
      )
    }

    const StyleCardM = React.memo(StyleCard)

    /* ------------------------------------------------------- brief render */

    function BriefText({ text }) {
      const [open, setOpen] = useState(false)
      const lines = useMemo(() => {
        const kept = []
        for (const raw of String(text || '').split('\n')) {
          const line = raw.trimEnd()
          if (!line) continue
          if (/^#\s/.test(line)) continue
          if (/^[-*]\s*(画布|文字|字体|圆角|canvas|ink|type|radius)/i.test(line)) continue
          kept.push(line)
        }
        return kept
      }, [text])
      const limit = 12
      const shown = open ? lines : lines.slice(0, limit)
      const blocks = shown.map((line, index) => {
        if (/^##\s/.test(line)) return h('h4', { key: index, className: 'dm-brief-h' }, line.replace(/^##\s*/, ''))
        if (/^[-*]\s/.test(line)) {
          return h('div', { key: index, className: 'dm-brief-li' },
            h('span', { className: 'dm-brief-dot' }),
            h('span', null, line.replace(/^[-*]\s*/, '').replace(/`/g, '')),
          )
        }
        return h('p', { key: index, className: 'dm-brief-p' }, line.replace(/`/g, ''))
      })
      return h('div', { className: 'dm-brief' },
        ...blocks,
        lines.length > limit
          ? h('button', { type: 'button', className: 'dm-link dm-brief-more', onClick: () => setOpen((v) => !v) }, open ? t('collapse') : t('expand'))
          : null,
      )
    }

    /* ------------------------------------------------------------- detail */

    function Detail({ style, kind, setKind, onBack, onToast }) {
      useLocale()
      const [brief, setBrief] = useState('')
      const [briefError, setBriefError] = useState('')
      const [form, setForm] = useState({ surface: kind === 'dark' ? 'webDark' : kind === 'slides' ? 'slides' : kind === 'poster' ? 'poster' : 'web', requirement: '', includeDesign: false })
      const [sending, setSending] = useState(false)
      const [promptInfo, setPromptInfo] = useState(null)
      const [done, setDone] = useState(false)
      const [designText, setDesignText] = useState('')
      const [designError, setDesignError] = useState('')
      const [designOpen, setDesignOpen] = useState(false)
      const [designBusy, setDesignBusy] = useState(false)
      const modalRef = useRef(null)
      const closeRef = useRef(null)
      const openRef = useRef(null)

      useEffect(() => {
        let alive = true
        setBrief('')
        setBriefError('')
        fetch(`${API}/style/${encodeURIComponent(style.slug)}`)
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
          .then((data) => { if (alive) setBrief(data.brief || '') })
          .catch((error) => { if (alive) setBriefError(String(error.message || error)) })
        return () => { alive = false }
      }, [style.slug])

      const v = style.visual
      const typeTop = Math.max(16, ...style.typography.map((step) => Number.parseFloat(step.fontSize) || 0))

      const buildPrompt = async () => {
        const res = await fetch(`${API}/prompt`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            slug: style.slug,
            surface: form.surface,
            requirement: form.requirement,
            includeDesign: form.includeDesign,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
        return data
      }

      const send = async () => {
        setSending(true)
        setDone(false)
        try {
          const data = await buildPrompt()
          setPromptInfo({ chars: data.chars })
          await deliverToCurrentSession(data.prompt)
          setDone(true)
          onToast({ kind: 'ok', text: t('sendOk') })
        } catch (error) {
          onToast({ kind: 'error', text: String(error.message || error) })
        } finally {
          setSending(false)
        }
      }

      const copyPrompt = async () => {
        try {
          const data = await buildPrompt()
          await writeClipboard(data.prompt)
          setPromptInfo({ chars: data.chars })
          onToast({ kind: 'ok', text: t('copied') })
        } catch (error) {
          onToast({ kind: 'error', text: String(error.message || error) })
        }
      }

      const loadDesign = async () => {
        setDesignBusy(true)
        setDesignError('')
        try {
          const res = await fetch(`${API}/design/${encodeURIComponent(style.slug)}`)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          setDesignText(await res.text())
        } catch (error) {
          setDesignText('')
          setDesignError(`${t('designFailed')}：${String(error.message || error)}`)
        } finally {
          setDesignBusy(false)
        }
      }

      const openDesign = async () => {
        if (designOpen) { setDesignOpen(false); return }
        if (openRef.current === null) openRef.current = document.activeElement
        setDesignOpen(true)
        if (!designText && !designBusy) loadDesign()
      }

      // Modal: Escape closes, background scroll is locked, focus moves in and back out.
      useEffect(() => {
        if (!designOpen) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            setDesignOpen(false)
            return
          }
          if (event.key !== 'Tab' || !modalRef.current) return
          const nodes = [...modalRef.current.querySelectorAll('button:not([disabled]), pre[tabindex="0"]')]
          if (!nodes.length) return
          const first = nodes[0]
          const last = nodes[nodes.length - 1]
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          }
        }
        document.addEventListener('keydown', onKey, true)
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const scroller = document.querySelector('.dm-detail')
        if (scroller) scroller.classList.add('is-locked')
        const focusTimer = window.setTimeout(() => closeRef.current && closeRef.current.focus(), 0)
        return () => {
          document.removeEventListener('keydown', onKey, true)
          document.body.style.overflow = previous
          if (scroller) scroller.classList.remove('is-locked')
          window.clearTimeout(focusTimer)
          if (openRef.current && openRef.current.focus) openRef.current.focus()
          openRef.current = null
        }
      }, [designOpen])

      const copyValue = async (value) => {
        try {
          await writeClipboard(String(value || ''))
          onToast({ kind: 'ok', text: t('copied') })
        } catch {
          onToast({ kind: 'error', text: t('copyFailed') })
        }
      }

      return h('div', { className: 'dm-detail' },
        h('div', { className: 'dm-detail-head' },
          h('button', { type: 'button', className: 'dm-back', onClick: onBack }, '← ' + t('back')),
          h('div', { className: 'dm-detail-title' },
            h('h2', null, style.nameZh === style.displayName ? style.displayName : style.nameZh),
            h('span', null, style.nameZh === style.displayName ? style.category : `${style.displayName} · ${style.category}`),
          ),
          h('a', { className: 'dm-source', href: style.sourceUrl, target: '_blank', rel: 'noreferrer' }, t('source') + ' ↗'),
        ),
        h('div', { className: 'dm-detail-grid' },
          h('div', { className: 'dm-detail-main' },
            h('div', { className: 'dm-seg dm-seg-preview' },
              ...Object.keys(STRINGS.zh.surfaces).map((key) => h('button', {
                key,
                type: 'button',
                className: `dm-seg-btn${kind === key ? ' is-on' : ''}`,
                onClick: () => setKind(key),
              }, t(`surfaces.${key}`))),
            ),
            h('div', { className: 'dm-preview-wrap' },
              h('div', { className: 'dm-preview', style: { maxWidth: kind === 'poster' ? 400 : 720 } }, h(Surface, { style, kind })),
            ),
            h('p', { className: 'dm-note' }, t('detailNote')),

            h('section', { className: 'dm-block' },
              h('h3', null, t('brief')),
              style.summaryZh ? h('p', { className: 'dm-brief-lead' }, style.summaryZh) : null,
              style.positioningZh ? h('p', { className: 'dm-brief-lead is-dim' }, style.positioningZh) : null,
              briefError
                ? h('p', { className: 'dm-note' }, briefError)
                : brief ? h(BriefText, { text: brief }) : h('p', { className: 'dm-note' }, t('loading')),
            ),

            h('section', { className: 'dm-block' },
              h('h3', null, t('palette')),
              h('div', { className: 'dm-swatches' },
                ...style.colors.filter((c) => c.hex).slice(0, 18).map((color, index) => h('button', {
                  key: `${color.name}-${index}`,
                  type: 'button',
                  className: 'dm-swatch',
                  onClick: () => copyValue(color.hex),
                  title: `${color.name} ${color.hex}`,
                },
                h('span', { className: 'dm-swatch-chip', style: { background: color.hex } }),
                h('span', { className: 'dm-swatch-name' }, color.name),
                h('span', { className: 'dm-swatch-hex' }, color.hex),
                )),
              ),
            ),

            h('section', { className: 'dm-block' },
              h('h3', null, t('typeScale')),
              h('div', { className: 'dm-type' },
                ...style.typography.slice(0, 8).map((step) => h('div', { key: step.token, className: 'dm-type-row' },
                  h('span', {
                    className: 'dm-type-sample',
                    style: {
                      fontFamily: step.fontFamily ? /serif|mono/i.test(step.fontFamily) ? step.fontFamily : `${step.fontFamily}, ${v.displayStack}` : v.displayStack,
                      fontSize: `${clamp(((Number.parseFloat(step.fontSize) || 16) / typeTop) * 26, 9, 26)}px`,
                      fontWeight: step.fontWeight || 400,
                    },
                  }, 'Aa'),
                  h('span', { className: 'dm-type-name' }, step.token),
                  h('span', { className: 'dm-type-meta' },
                    [step.fontSize, step.fontWeight, step.lineHeight, step.letterSpacing].filter(Boolean).join(' / ') || '—',
                  ),
                )),
              ),
            ),

            h('section', { className: 'dm-block' },
              h('h3', null, t('shape')),
              h('div', { className: 'dm-tags' },
                ...[
                  [t('shapeCard'), v.radiusCard],
                  [t('shapeButton'), v.radiusButton],
                  [t('shapePill'), v.radiusPill],
                  [t('shapeBase'), `${v.spaceBase || 8}px`],
                ].map(([label, value]) => h('span', { key: label, className: 'dm-tag' },
                  h('span', { className: 'dm-tag-label' }, label),
                  h('span', { className: 'dm-tag-value' }, prettyRadius(value)),
                )),
                h('span', { className: 'dm-tag' },
                  h('span', { className: 'dm-tag-label' }, t('shapeDisplay')),
                  h('span', { className: 'dm-tag-value' }, v.displayFamily),
                ),
                h('span', { className: 'dm-tag' },
                  h('span', { className: 'dm-tag-label' }, t('shapeBody')),
                  h('span', { className: 'dm-tag-value' }, v.bodyFamily),
                ),
              ),
            ),

            style.recommendedPromptZh
              ? h('section', { className: 'dm-block' },
                h('div', { className: 'dm-block-head' },
                  h('h3', null, t('recipe')),
                  h('button', { type: 'button', className: 'dm-link', onClick: () => copyValue(style.recommendedPromptZh) }, t('copy')),
                ),
                h('p', { className: 'dm-recipe' }, style.recommendedPromptZh),
              )
              : null,

            h('section', { className: 'dm-block dm-block-split' },
              h('div', null,
                h('h3', null, t('bestFor')),
                h('div', { className: 'dm-chips' },
                  ...(() => {
                    const seen = []
                    for (const item of [...(style.bestFor || []), ...(style.useCases || []).slice(0, 2)]) {
                      if (item && !seen.includes(item)) seen.push(item)
                    }
                    return seen.map((item) => h('span', { key: item, className: 'dm-tag dm-tag-ok' }, item))
                  })(),
                ),
                h('h3', { style: { marginTop: '18px' } }, t('avoidFor')),
                h('div', { className: 'dm-chips' },
                  ...(style.avoidFor || []).map((item) => h('span', { key: item, className: 'dm-tag dm-tag-no' }, item)),
                ),
              ),
              h('div', null,
                h('h3', null, t('checklist')),
                h('ul', { className: 'dm-checklist' },
                  ...(style.aiChecklist || []).map((item) => h('li', { key: item }, item)),
                ),
              ),
            ),
          ),

          h('aside', { className: 'dm-form' },
            h('h3', null, t('formTitle')),
            h('p', { className: 'dm-form-hint' }, t('formHint')),

            h('label', { className: 'dm-field-label' }, t('output')),
            h('div', { className: 'dm-seg dm-seg-form' },
              ...Object.keys(STRINGS.zh.outputs).map((key) => h('button', {
                key,
                type: 'button',
                className: `dm-seg-btn${form.surface === key ? ' is-on' : ''}`,
                onClick: () => setForm((prev) => ({ ...prev, surface: key })),
              }, t(`outputs.${key}`))),
            ),

            h('label', { className: 'dm-field-label' }, t('requirement')),
            h('textarea', {
              className: 'dm-textarea',
              rows: 6,
              value: form.requirement,
              placeholder: t('requirementPlaceholder'),
              onChange: (event) => setForm((prev) => ({ ...prev, requirement: event.target.value })),
            }),

            h('label', { className: 'dm-check' },
              h('input', {
                type: 'checkbox',
                checked: form.includeDesign,
                onChange: (event) => setForm((prev) => ({ ...prev, includeDesign: event.target.checked })),
              }),
              h('span', null, t('includeDesign')),
            ),

            h('button', {
              type: 'button',
              className: 'dm-primary',
              disabled: sending,
              onClick: send,
            }, sending ? t('sending') : t('send')),

            h('div', { className: 'dm-form-row' },
              h('button', { type: 'button', className: 'dm-ghost', onClick: copyPrompt }, t('copyPrompt')),
              h('button', { type: 'button', className: 'dm-ghost', onClick: openDesign }, t('viewDesign')),
            ),

            promptInfo ? h('p', { className: 'dm-note' }, t('chars').replace('{n}', String(promptInfo.chars))) : null,
            done ? h('button', {
              type: 'button',
              className: 'dm-ghost dm-back-chat',
              onClick: backToChat,
            }, `${t('backToChat')} →`) : null,
          ),
        ),
        designOpen ? h('div', {
          className: 'dm-modal',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'dm-modal-title',
          onClick: () => setDesignOpen(false),
        },
          h('div', { className: 'dm-modal-card', ref: modalRef, onClick: (event) => event.stopPropagation() },
            h('div', { className: 'dm-modal-head' },
              h('span', { id: 'dm-modal-title' }, `DESIGN.md · ${style.displayName}`),
              h('div', { className: 'dm-modal-actions' },
                h('button', { type: 'button', className: 'dm-ghost', disabled: designBusy || !designText, onClick: () => copyValue(designText) }, t('copy')),
                h('button', { type: 'button', className: 'dm-ghost', ref: closeRef, onClick: () => setDesignOpen(false) }, t('close')),
              ),
            ),
            designError
              ? h('div', { className: 'dm-modal-body' },
                h('p', { className: 'dm-note' }, designError),
                h('button', { type: 'button', className: 'dm-ghost', onClick: loadDesign }, t('retry')),
              )
              : h('pre', { className: 'dm-modal-body', tabIndex: 0 }, designBusy ? t('loading') : designText),
          ),
        ) : null,
      )
    }

    /* -------------------------------------------------------------- panel */

    /** Module-level catalog cache: the panel mounts/unmounts on every tab switch. */
    const catalogCache = { data: null, at: 0, promise: null }
    const CATALOG_TTL = 5 * 60 * 1000

    function fetchCatalog(force = false) {
      const fresh = catalogCache.data && Date.now() - catalogCache.at < CATALOG_TTL
      if (!force && fresh) return Promise.resolve(catalogCache.data)
      if (!force && catalogCache.promise) return catalogCache.promise
      const promise = fetch(`${API}/catalog`)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((data) => {
          catalogCache.data = data
          catalogCache.at = Date.now()
          return data
        })
        .finally(() => { catalogCache.promise = null })
      catalogCache.promise = promise
      return promise
    }

    function backToChat() {
      const layout = runtime.ctx && (runtime.ctx.get ? runtime.ctx.get('layout') : runtime.ctx.layout);
      if (layout && typeof layout.selectPanel === 'function') layout.selectPanel(null);
    }

  function Panel() {
      const loc = useLocale()
      const [catalog, setCatalog] = useState(null)
      const [error, setError] = useState('')
      const [query, setQuery] = useState(memory.query)
      const [category, setCategory] = useState(memory.category)
      const [kind, setKind] = useState(memory.surface)
      const [slug, setSlug] = useState(memory.slug)
      const [toast, setToast] = useState(null)
      const toastTimer = useRef(0)

      const notify = (next) => {
        setToast(next)
        window.clearTimeout(toastTimer.current)
        toastTimer.current = window.setTimeout(() => setToast(null), 4200)
      }

      useEffect(() => () => window.clearTimeout(toastTimer.current), [])

      const loadCatalog = (force) => {
        setError('')
        fetchCatalog(force)
          .then((data) => { if (!unmounted.current) setCatalog(data) })
          .catch((err) => { if (!unmounted.current) setError(String(err.message || err)) })
      }
      const unmounted = useRef(false)

      useEffect(() => {
        unmounted.current = false
        loadCatalog(false)
        return () => { unmounted.current = true }
      }, [])

      useEffect(() => { memory.query = query }, [query])
      useEffect(() => { memory.category = category }, [category])
      useEffect(() => { memory.surface = kind }, [kind])
      useEffect(() => { memory.slug = slug }, [slug])

      const styles = catalog ? catalog.styles : []
      const categories = useMemo(() => {
        const seen = []
        for (const style of styles) if (style.category && !seen.includes(style.category)) seen.push(style.category)
        return [null, ...seen]
      }, [styles, loc])

      const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return styles.filter((style) => {
          if (category && style.category !== category) return false
          if (!q) return true
          const haystack = [
            style.slug, style.displayName, style.nameZh, style.category,
            ...(style.tagsZh || []), ...(style.styleKeywords || []), ...(style.useCases || []),
            ...(style.bestFor || []),
          ].join(' ').toLowerCase()
          return haystack.includes(q)
        })
      }, [styles, query, category])

      const current = slug ? styles.find((style) => style.slug === slug) : null

      if (current) {
        return h('div', { className: 'dm-panel' },
          h('style', null, CSS),
          h(Detail, {
            style: current,
            kind,
            setKind,
            onBack: () => setSlug(null),
            onToast: notify,
          }),
          toast ? h('div', { className: `dm-toast is-${toast.kind}` }, toast.text) : null,
        )
      }

      return h('div', { className: 'dm-panel' },
        h('style', null, CSS),
        h('header', { className: 'dm-head' },
          h('div', { className: 'dm-head-top' },
            h('div', null,
              h('h1', { className: 'dm-h1' }, t('title')),
              h('p', { className: 'dm-sub' }, catalog ? t('subtitle') : t('loading')),
            ),
            h('div', { className: 'dm-head-right' },
              catalog ? h('span', { className: 'dm-count' }, filtered.length === catalog.count ? String(catalog.count) : `${filtered.length}/${catalog.count}`) : null,
              h('button', { type: 'button', className: 'dm-ghost dm-head-back', onClick: backToChat }, t('backChat')),
            ),
          ),
          h('div', { className: 'dm-search-row' },
            h('input', {
              className: 'dm-search',
              value: query,
              placeholder: t('search'),
              'aria-label': t('search'),
              onChange: (event) => setQuery(event.target.value),
            }),
          ),
          h('div', { className: 'dm-seg' },
            ...Object.keys(STRINGS.zh.surfaces).map((key) => h('button', {
              key,
              type: 'button',
              className: `dm-seg-btn${kind === key ? ' is-on' : ''}`,
              'aria-pressed': kind === key,
              onClick: () => setKind(key),
            }, t(`surfaces.${key}`))),
          ),
          h('div', { className: 'dm-chips dm-chips-scroll' },
            ...categories.map((name) => h('button', {
              key: name || '__all__',
              type: 'button',
              className: `dm-chip${category === name ? ' is-on' : ''}`,
              'aria-pressed': category === name,
              onClick: () => setCategory(name),
            }, name || t('all'))),
          ),
        ),
        h('div', { className: 'dm-body' },
          error
            ? h('div', { className: 'dm-empty' },
              h('p', null, `${t('errorCatalog')}：${error}`),
              h('button', { type: 'button', className: 'dm-ghost', onClick: () => loadCatalog(true) }, t('retry')),
            )
            : !catalog
              ? h('div', { className: 'dm-empty' }, h('p', null, t('loading')))
              : filtered.length === 0
                ? h('div', { className: 'dm-empty' },
                  h('p', null, t('empty')),
                  h('p', { className: 'dm-note' }, t('emptyHint')),
                  (query || category)
                    ? h('button', {
                      type: 'button',
                      className: 'dm-ghost',
                      onClick: () => { setQuery(''); setCategory(null) },
                    }, t('clearFilters'))
                    : null,
                )
                : h('div', { className: 'dm-grid' },
                  ...filtered.map((style) => h(StyleCardM, { key: style.slug, style, kind, onOpen: setSlug })),
                ),
        ),
        toast ? h('div', { className: `dm-toast is-${toast.kind}`, role: 'status', 'aria-live': 'polite' }, toast.text) : null,
      )
    }

    /* --------------------------------------------------------------- misc */

    async function writeClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return
      }
      const area = document.createElement('textarea')
      area.value = text
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      try {
        area.select()
        if (!document.execCommand('copy')) throw new Error('copy was rejected')
      } finally {
        document.body.removeChild(area)
      }
    }

    async function deliverToCurrentSession(text) {
      const ctx = runtime.ctx
      const sessions = ctx && (typeof ctx.get === 'function' ? ctx.get('sessions') : ctx.sessions)
      if (!sessions) throw new Error(t('noSession'))
      const snapshot = sessions.list.getSnapshot()
      const row = Object.values(snapshot.byId || {}).find((candidate) => (candidate.retainedBy?.mainView ?? 0) > 0)
      if (!row) throw new Error(t('noSession'))
      const binding = sessions.binding(row.id)
      if (!binding || !binding.session || typeof binding.session.prompt !== 'function') {
        throw new Error(t('noSession'))
      }
      const result = await binding.session.prompt([{ type: 'text', text }], 'queue')
      if (result && result.ok === false) {
        throw new Error(result.error?.message || 'prompt rejected')
      }
    }

    function PanelIcon({ size }) {
      const dimension = typeof size === 'number' ? size : 22
      return h('svg', {
        width: dimension,
        height: dimension,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
      },
      h('rect', { x: 3.2, y: 3.2, width: 17.6, height: 17.6, rx: 4.6, stroke: 'currentColor', strokeWidth: 1.5 }),
      h('path', { d: 'M7.6 15.4 10.9 8l3.3 7.4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('path', { d: 'M8.6 13h4.6', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('circle', { cx: 16.4, cy: 16.2, r: 1.55, fill: 'currentColor' }),
      )
    }

    /* ---------------------------------------------------------------- css */

    const CSS = `
.dm-panel{position:relative;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}
.dm-head{flex:none;display:flex;flex-direction:column;gap:10px;padding:18px 22px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base)}
.dm-head-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.dm-h1{margin:0;font-size:17px;font-weight:600;letter-spacing:-.01em}
.dm-sub{margin:3px 0 0;font-size:12px;line-height:1.5;color:var(--dsw-alias-label-secondary)}
.dm-head-right{display:flex;align-items:center;gap:10px}
.dm-head-back{white-space:nowrap}
.dm-count{font-size:12px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:2px 9px}
.dm-search{width:100%;box-sizing:border-box;padding:8px 12px;font-size:13px;border-radius:9px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);outline:none}
.dm-search:focus{border-color:var(--dsw-alias-brand-primary)}
.dm-seg{display:inline-flex;gap:2px;padding:3px;border-radius:9px;background:var(--dsw-alias-bg-layer-2);align-self:flex-start;flex-wrap:wrap}
.dm-seg-btn{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:5px 11px;border-radius:7px;cursor:pointer;white-space:nowrap}
.dm-seg-btn:hover{color:var(--dsw-alias-label-primary)}
.dm-seg-btn.is-on{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:0 1px 2px rgba(0,0,0,.14)}
.dm-seg-preview{align-self:flex-start}
.dm-seg-form{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-self:stretch}
.dm-seg-form .dm-seg-btn{text-align:center;padding:6px 4px}
.dm-chips{display:flex;gap:6px;flex-wrap:wrap}
.dm-chips-scroll{flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}
.dm-tags{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.dm-tag{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:6px 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);font-size:12px}
.dm-tag-label{color:var(--dsw-alias-label-secondary)}
.dm-tag-value{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dm-modal-body{overscroll-behavior:contain}
@media (max-width:620px){.dm-chips-scroll{flex-wrap:wrap;overflow:visible;padding-bottom:0}}
.dm-chips-scroll::-webkit-scrollbar{display:none}
.dm-chip{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:4px 10px;border-radius:999px;cursor:pointer;white-space:nowrap}
.dm-chip:hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2)}
.dm-chip.is-on{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border-color:transparent}
.dm-body{flex:1;min-height:0;overflow-y:auto;padding:18px 22px 28px}
.dm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}
.dm-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:0;border:0;background:transparent;text-align:left;cursor:pointer;font:inherit;color:inherit;border-radius:12px}
.dm-card:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:4px}
.dm-card:focus-visible .dm-card-art{transform:translateY(-2px);box-shadow:0 12px 28px -14px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.1)}
.dm-card:focus-visible .dm-card-hover{opacity:1;transform:none}
.dm-chip:focus-visible,.dm-seg-btn:focus-visible,.dm-ghost:focus-visible,.dm-primary:focus-visible,.dm-swatch:focus-visible,.dm-back:focus-visible,.dm-link:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dm-search:focus{box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 26%, transparent)}
.dm-card-art{display:block;border-radius:11px;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);transition:transform .18s ease,box-shadow .18s ease}
.dm-card:hover .dm-card-art{transform:translateY(-2px);box-shadow:0 10px 26px -12px rgba(0,0,0,.45)}
.dm-card-art .dm-art{width:100%;height:auto}
.dm-card-hover{position:absolute;left:9px;top:9px;padding:4px 9px;border-radius:999px;font-size:11px;background:rgba(12,12,14,.82);color:#fff;opacity:0;transform:translateY(-3px);transition:opacity .18s ease,transform .18s ease;pointer-events:none}
.dm-card:hover .dm-card-hover{opacity:1;transform:none}
.dm-card-meta{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:0 2px}
.dm-card-names{display:flex;flex-direction:column;gap:2px;min-width:0}
.dm-card-zh{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dm-card-en{font-size:11.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dm-dots{display:flex;gap:3px;flex:none;padding-top:3px}
.dm-dots i{width:9px;height:9px;border-radius:50%;display:block;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
.dm-art{position:relative;container-type:inline-size;overflow:hidden;isolation:isolate}
.dm-art-inner{position:absolute;inset:0;display:flex;flex-direction:column;font-family:var(--dm-body);color:var(--dm-ink)}
.dm-page{justify-content:flex-start}
.dm-nav{display:flex;align-items:center;justify-content:space-between;gap:2cqw;padding:1.55cqw 3.4cqw;border-bottom:1px solid var(--dm-line)}
.dm-nav-brand{display:flex;align-items:center;gap:.85cqw;min-width:0}
.dm-logo{display:inline-flex;align-items:center;justify-content:center;width:2.35cqw;height:2.35cqw;font-size:1.05cqw;line-height:1}
.dm-nav-links{display:flex;gap:1.85cqw;align-items:center}
.dm-nav-cta{white-space:nowrap}
.dm-hero{display:flex;flex-direction:column;gap:1.5cqw;padding:2.8cqw 3.4cqw 2.2cqw;flex:1;justify-content:center}
.dm-foot{display:flex;align-items:center;justify-content:space-between;gap:2cqw;padding:1.5cqw 3.4cqw}
.dm-foot-links{display:flex;gap:1.8cqw;align-items:center}
.dm-eyebrow{text-transform:uppercase;font-weight:600;letter-spacing:.1em}
.dm-ctas{display:flex;gap:1.1cqw;align-items:center;margin-top:.5cqw}
.dm-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5cqw;padding:0 3.4cqw 2.4cqw}
.dm-mini-card{display:flex;flex-direction:column;gap:.7cqw}
.dm-mini-media{display:block;width:100%;aspect-ratio:3/2;margin-bottom:.9cqw}
.dm-card-art .dm-foot-links,.dm-card-art .dm-nav-links,.dm-card-art .dm-mini-card>span:nth-child(n+4){display:none}
.dm-mini-icon{width:2.4cqw;height:2.4cqw;display:block;border-radius:.7cqw}
.dm-slide{padding:3.2cqw 4.2cqw;justify-content:space-between}
.dm-slide-head{display:flex;align-items:center;justify-content:space-between}
.dm-kicker{text-transform:uppercase;letter-spacing:.16em;font-weight:600}
.dm-slide-body{display:flex;flex-direction:column;gap:1.4cqw;flex:1;justify-content:center}
.dm-slide-bar{width:6.5cqw;height:.32cqw;border-radius:99px;display:block}
.dm-slide-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1.1cqw}
.dm-slide-list li{display:flex;align-items:center;gap:1.1cqw}
.dm-bullet{width:.75cqw;height:.75cqw;border-radius:50%;display:block;flex:none}
.dm-slide-foot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--dm-line);padding-top:1.2cqw}
.dm-poster{padding:5cqw 5.2cqw;justify-content:space-between}
.dm-poster-top{display:flex;align-items:center;justify-content:space-between}
.dm-poster-dot{width:1.1cqw;height:1.1cqw;border-radius:50%;display:block}
.dm-poster-mid{display:flex;flex-direction:column;gap:2.6cqw}
.dm-poster-foot{display:flex;flex-direction:column;gap:1.8cqw}
.dm-poster-meta{display:flex;justify-content:space-between;text-transform:uppercase;letter-spacing:.08em}
.dm-empty{display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:40px 4px;color:var(--dsw-alias-label-secondary);font-size:13px}
.dm-note{margin:8px 0 0;font-size:11.5px;line-height:1.55;color:var(--dsw-alias-label-secondary)}
.dm-detail{display:flex;flex-direction:column;gap:16px;padding:16px 22px 40px;overflow-y:auto;height:100%;min-height:0;box-sizing:border-box}
.dm-detail.is-locked{overflow:hidden}
.dm-detail-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.dm-back{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:5px 10px;border-radius:8px;cursor:pointer}
.dm-back:hover{color:var(--dsw-alias-label-primary)}
.dm-detail-title{display:flex;align-items:baseline;gap:9px;min-width:0}
.dm-detail-title h2{margin:0;font-size:17px;font-weight:600}
.dm-detail-title span{font-size:12px;color:var(--dsw-alias-label-secondary)}
.dm-source{margin-left:auto;font-size:11.5px;color:var(--dsw-alias-label-secondary);text-decoration:none}
.dm-source:hover{color:var(--dsw-alias-brand-primary)}
.dm-detail-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:26px;align-items:start}
.dm-detail-main{display:flex;flex-direction:column;gap:14px;min-width:0}
.dm-preview-wrap{display:flex;justify-content:flex-start}
.dm-preview{width:100%;border-radius:13px;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);box-shadow:0 18px 40px -30px rgba(0,0,0,.6)}
.dm-block{border-top:1px solid var(--dsw-alias-border-l1);padding-top:14px}
.dm-block h3{margin:0 0 9px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--dsw-alias-label-secondary)}
.dm-block-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.dm-block-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:26px}
.dm-brief-lead{margin:10px 0 4px;font-size:12.5px;line-height:1.75;color:var(--dsw-alias-label-primary)}
.dm-brief-lead.is-dim{color:var(--dsw-alias-label-secondary)}
.dm-brief{display:flex;flex-direction:column;gap:7px;max-width:68ch;font-size:12.5px;line-height:1.68;color:var(--dsw-alias-label-primary)}
.dm-brief-h{margin:6px 0 0;font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--dsw-alias-label-secondary)}
.dm-brief-p{margin:0;color:var(--dsw-alias-label-primary)}
.dm-brief-li{display:flex;gap:7px;align-items:flex-start;color:var(--dsw-alias-label-secondary)}
.dm-brief-dot{width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-border-l2);margin-top:7px;flex:none}
.dm-brief-more{margin-top:4px}
.dm-link{appearance:none;border:0;background:transparent;color:var(--dsw-alias-brand-primary);font:inherit;font-size:11.5px;cursor:pointer;padding:0}
.dm-swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
.dm-swatch{display:flex;flex-direction:column;gap:3px;align-items:flex-start;border:0;background:transparent;padding:0;cursor:pointer;font:inherit;text-align:left;min-width:0}
.dm-swatch-chip{width:100%;height:30px;border-radius:7px;display:block;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}
.dm-swatch-name{font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.dm-swatch-hex{font-size:10.5px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);opacity:.75}
.dm-type{display:flex;flex-direction:column;gap:2px}
.dm-type-row{display:grid;grid-template-columns:34px 1fr auto;align-items:baseline;gap:10px;padding:5px 0;border-bottom:1px dashed var(--dsw-alias-border-l1)}
.dm-type-sample{color:var(--dsw-alias-label-primary);line-height:1}
.dm-type-name{font-size:12px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.dm-type-meta{font-size:11px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;text-align:right}
.dm-tag{font-size:11px;padding:2px 8px;border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dm-tag-ok{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 16%,transparent);color:var(--dsw-alias-state-success-primary)}
.dm-tag-no{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 14%,transparent);color:var(--dsw-alias-state-error-primary)}
.dm-checklist{margin:0;padding-left:18px;font-size:12.5px;line-height:1.7;color:var(--dsw-alias-label-secondary)}
.dm-recipe{margin:0;font-size:12.5px;line-height:1.7;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;padding:11px 13px}
.dm-form{position:sticky;top:0;display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:13px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dm-form h3{margin:0;font-size:14px;font-weight:600}
.dm-form-hint{margin:0;font-size:11.5px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
.dm-field-label{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--dsw-alias-label-secondary);margin-top:4px}
.dm-textarea{width:100%;box-sizing:border-box;resize:vertical;min-height:96px;padding:9px 11px;font:inherit;font-size:12.5px;line-height:1.6;border-radius:9px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);outline:none}
.dm-textarea:focus{border-color:var(--dsw-alias-brand-primary)}
.dm-check{display:flex;gap:7px;align-items:flex-start;font-size:11.5px;line-height:1.55;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dm-check input{margin-top:2px;accent-color:var(--dsw-alias-brand-primary)}
.dm-primary{appearance:none;border:0;border-radius:9px;padding:9px 14px;font:inherit;font-size:12.5px;font-weight:600;background:var(--dsw-alias-brand-primary);color:#fff;cursor:pointer}
.dm-primary:hover{filter:brightness(1.06)}
.dm-primary:disabled{opacity:.6;cursor:default}
.dm-form-row{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.dm-ghost{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11.5px;padding:7px 9px;border-radius:8px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dm-ghost:hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2)}
.dm-back-chat{grid-column:1 / -1}
.dm-modal{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:24px}
.dm-modal-card{width:min(880px,100%);max-height:86vh;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;overflow:hidden;box-shadow:0 30px 80px -40px rgba(0,0,0,.8)}
.dm-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:12.5px;color:var(--dsw-alias-label-primary)}
.dm-modal-actions{display:flex;gap:8px}
.dm-modal-body{margin:0;padding:14px 16px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.7;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word}
.dm-toast{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);max-width:min(520px,80%);padding:9px 15px;border-radius:9px;font-size:12px;line-height:1.5;color:#fff;background:rgba(24,24,27,.94);box-shadow:0 12px 30px -14px rgba(0,0,0,.6);z-index:40}
.dm-toast.is-error{background:var(--dsw-alias-state-error-primary);color:#fff}
.dm-toast.is-ok{background:rgba(24,24,27,.94)}
@media (max-width:980px){.dm-detail-grid{grid-template-columns:minmax(0,1fr);gap:14px}.dm-detail-main{display:contents}.dm-form{position:static;order:3}.dm-block{order:4}.dm-form-hint{display:none}.dm-textarea{min-height:70px}}
@media (max-width:620px){.dm-block-split{grid-template-columns:minmax(0,1fr)}.dm-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))}}
`

    /* -------------------------------------------------------------- apply */

    function apply(ctx) {
      runtime.ctx = ctx
      try {
        setLocale(ctx.locale?.getLocale?.())
        // The locale service notifies without arguments; re-read the snapshot instead.
        ctx.locale?.subscribe?.(() => setLocale(ctx.locale?.getLocale?.()))
      } catch {
        /* locale service is optional */
      }

      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 25,
        label: () => t('title'),
        locale: PANEL_ID,
      }, (props) => h(PanelIcon, { size: props?.size })))

      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        locale: PANEL_ID,
      }, () => h(Panel)))
    }

    return { name: 'dsh-design-md', inject: ['slots', 'locale', 'layout'], apply }
  },
})
