/**
 * dsh-design-md — Client half.
 *
 * One sidebar row (the panel icon) + one main panel: the style library.
 * Every preview is rendered live from that style's own DESIGN.md tokens —
 * no iframes, no screenshots — so all 84 styles stay comparable at any width.
 */
window.__ModuleLoader__.load({
  id: 'dsh-design-md',
  factory: (require) => {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo, useRef, useCallback } = React

    const API = '/api/design-md'
    const PANEL_ID = 'design-md'

    /** ctx is captured at apply() time; slot components cannot receive it. */
    const runtime = { ctx: null }
    /** Survives panel unmount (switching back to the conversation). */
    const memory = { query: '', category: null, surface: 'page', theme: 'light', slug: null }

    /** Re-clicking the sidebar entry must take the panel back to the grid, even when it is already selected. */
    const viewBus = { listeners: new Set() }
    function requestListView() {
      memory.slug = null
      for (const fn of viewBus.listeners) {
        try { fn() } catch { /* listeners must not break the click */ }
      }
    }

    /* ------------------------------------------------------------ strings */

    const STRINGS = {
      zh: {
        title: '设计风格库',
        subtitle: '每一套都由该品牌 DESIGN.md 的 token 现场渲染 —— 不是截图，是同一套颜色、字体与间距在网页、幻灯片、海报三种载体上的真实投影。挑一套，写清楚你要做什么。',
        search: '搜索品牌、风格关键词、适用场景…',
        all: '全部',
        empty: '没有匹配的风格',
        emptyHint: '换个关键词，或点「全部」看完整 84 套。',
        clearFilters: '清除筛选',
        retry: '重试',
        loading: '正在读取设计库…',
        errorCatalog: '设计库读取失败',
        backChat: '回到对话',
        back: '返回列表',
        close: '关闭',
        copy: '复制',
        copied: '已复制',
        copyFailed: '复制失败，请手动选择文本',
        useThis: '用这套风格 →',
        surfaces: { page: '网页', slides: '幻灯片', poster: '海报' },
        themes: { light: '浅色', dark: '深色' },
        brandDark: '该品牌本身为深色，无浅色版本',
        source: '来源',
        tokensCount: '{c} 个色值 · {t} 级字号',
        notes: '设计要点',
        palette: '配色',
        typography: '排版要求',
        shapes: '形状与间距',
        components: '组件样例',
        fitAvoid: '适合 · 避免',
        bestFor: '适合',
        avoidFor: '避免',
        formTitle: '用这套风格生成',
        formHint: '提示词会带上完整 token 与交付规范。',
        output: '产出形态',
        requirement: '需求描述',
        requirementPlaceholder: '例如：做一个 AI 笔记产品的官网首页，首屏突出卖点，带三栏功能区和定价表。',
        includeDesign: '连同完整 DESIGN.md 一起发送（更还原，提示词更长）',
        send: '发送到当前会话',
        sending: '正在发送…',
        sendOk: '已发送到当前会话，DSH 会按这套风格开始生成。',
        copyPrompt: '复制提示词',
        viewDesign: '查看 DESIGN.md',
        backToChat: '切回对话 →',
        chars: '提示词约 {n} 字',
        noSession: '没有找到当前会话：请先在左侧打开一个对话再发送。',
        designFailed: '读取 DESIGN.md 失败',
        previewNote: '由 DESIGN.md 的 token 现场渲染，不是截图。',
        previewFull: '完整页面 · 8 个区块',
        previewSketch: '示意排版',
        cardBody: '按这套版式排布的模块说明与要点。',
        cardLearn: '了解更多 →',
        heroLede: '该预览由 DESIGN.md 的 token 实时渲染，用来对照版式、配色与字号层级。',
        pageEyebrow: 'DESIGN LIBRARY',
        pageTitle: '84 套品牌设计语言',
        pageLede: '每一套都由该品牌的 DESIGN.md token 现场渲染 —— 不是截图，是同一套颜色、字体与间距在网页、幻灯片、海报三种载体上的真实投影。挑一套，写清楚你要做什么。',
        fontMono: '等宽字体',
        fontDisplay: '展示字体',
        fontBody: '正文字体',
        typeSample: '设计系统 Design System',
        radiusCard: '卡片圆角',
        radiusButton: '按钮圆角',
        radiusPill: '胶囊圆角',
        spaceBase: '间距基数',
        fullyRounded: '全圆角',
        size: '{n} 个色值 · {m} 级字号',
        demoBtn: '主要按钮',
        demoBtn2: '次要按钮',
        demoBtn3: '标签胶囊',
        demoCard: '卡片标题',
        demoCardBody: '卡片说明文字，随品牌字号与行高。',
        demoInput: '输入框占位文本',
        demoCheck: '记住我',
      },
      en: {
        title: 'Design library',
        subtitle: 'Every preset is rendered live from that brand’s DESIGN.md tokens — not a screenshot: the same palette, type and rhythm projected onto a web page, a slide and a poster. Pick one, then describe what you want built.',
        search: 'Search brands, keywords, use cases…',
        all: 'All',
        empty: 'No style matches',
        emptyHint: 'Try another keyword, or switch back to All.',
        clearFilters: 'Clear filters',
        retry: 'Retry',
        loading: 'Loading design library…',
        errorCatalog: 'Could not load the library',
        backChat: 'Back to chat',
        back: 'Back',
        close: 'Close',
        copy: 'Copy',
        copied: 'Copied',
        copyFailed: 'Copy failed — select the text manually',
        useThis: 'Use this style →',
        surfaces: { page: 'Web', slides: 'Slides', poster: 'Poster' },
        themes: { light: 'Light', dark: 'Dark' },
        brandDark: 'This brand is dark by nature — no light variant',
        source: 'Source',
        tokensCount: '{c} colors · {t} type steps',
        notes: 'Design notes',
        palette: 'Palette',
        typography: 'Typography',
        shapes: 'Shape & spacing',
        components: 'Components',
        fitAvoid: 'Best for · Avoid',
        bestFor: 'Best for',
        avoidFor: 'Avoid',
        formTitle: 'Generate in this style',
        formHint: 'The prompt carries the full token set and the delivery rules.',
        output: 'Output',
        requirement: 'What to build',
        requirementPlaceholder: 'e.g. a landing page for an AI note-taking app: hero with the key promise, three feature columns and a pricing table.',
        includeDesign: 'Also send the full DESIGN.md (closer match, longer prompt)',
        send: 'Send to current chat',
        sending: 'Sending…',
        sendOk: 'Sent to the current chat — the agent will build it in this style.',
        copyPrompt: 'Copy prompt',
        viewDesign: 'View DESIGN.md',
        backToChat: 'Back to chat →',
        chars: 'about {n} characters',
        noSession: 'No active chat found — open a conversation first.',
        designFailed: 'Could not load DESIGN.md',
        previewNote: 'Rendered live from the DESIGN.md tokens — not a screenshot.',
        previewFull: 'Full page · 8 sections',
        previewSketch: 'Layout sketch',
        cardBody: 'Module copy set in this layout rhythm.',
        cardLearn: 'Learn more →',
        heroLede: 'This preview renders the DESIGN.md tokens live so you can compare layout, palette and type scale.',
        pageEyebrow: 'DESIGN LIBRARY',
        pageTitle: '84 brand design languages',
        pageLede: 'Each one is rendered live from its DESIGN.md tokens — not a screenshot. The same colors, type and spacing projected onto a web page, a slide deck and a poster.',
        fontMono: 'Mono',
        fontDisplay: 'Display',
        fontBody: 'Body',
        typeSample: 'Design System',
        radiusCard: 'Card radius',
        radiusButton: 'Button radius',
        radiusPill: 'Pill radius',
        spaceBase: 'Spacing base',
        fullyRounded: 'fully rounded',
        size: '{n} colors · {m} type steps',
        demoBtn: 'Primary',
        demoBtn2: 'Secondary',
        demoBtn3: 'Tag',
        demoCard: 'Card title',
        demoCardBody: 'Card copy set in the brand type and leading.',
        demoInput: 'Placeholder text',
        demoCheck: 'Remember me',
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

    const t = (key, vars) => {
      const dict = STRINGS[locale] || STRINGS.zh
      const value = key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict)
      if (value === undefined) return key
      if (typeof value !== 'string' || !vars) return value
      return value.replace(/\{(\w+)\}/g, (all, name) => (vars[name] !== undefined ? String(vars[name]) : all))
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

    const shorten = (text, max) => {
      const value = String(text || '').replace(/\s+/g, ' ').trim()
      return value.length > max ? `${value.slice(0, max - 1)}…` : value
    }

    const esc = (value) => String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

    /** Resolves a style's palette for one theme. */
    /** Slides / posters keep the brand's native polarity; only the web page follows the toggle. */
    function baseMode(style) {
      return style && style.visual && style.visual.darkFirst ? 'dark' : 'light'
    }

    function themeOf(style, mode) {
      const v = style.visual
      const dark = mode === 'dark' || (!mode && v.darkFirst)
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

    const prettyRadius = (value) => {
      const text = String(value ?? '')
      const num = Number.parseFloat(text)
      if (!Number.isFinite(num)) return text || '—'
      return num >= 999 ? t('fullyRounded') : `${Math.round(num)}px`
    }

    /** Display copy reused by every surface of one style. */
    function deckOf(style) {
      const keywords = (style.styleKeywords || []).filter((k) => k && k.length <= 12).slice(0, 5)
      const useCases = (style.useCases || []).filter(Boolean).slice(0, 3)
      return {
        brand: shorten(style.displayName || style.nameZh || style.slug, 22),
        brandZh: shorten(style.nameZh || style.displayName || style.slug, 16),
        kicker: style.category || t('pageEyebrow'),
        tagline: shorten(style.positioningZh || style.summaryZh || style.descriptionEn || '', 42),
        lede: shorten(style.summaryZh || style.descriptionEn || '', 72),
        keywords: keywords.length ? keywords : ['Typography', 'Color', 'Spacing'],
        cards: useCases.length ? useCases : ['产品首页', '定价页', '控制台'],
        bullets: (keywords.length ? keywords : ['Color', 'Type', 'Grid']).slice(0, 3),
      }
    }

    /* ------------------------------------------------------- art: web page */

    const PAGE_BASE = 1180
    const SLIDE_BASE = 1280
    const POSTER_BASE = 900

    const unit = (base) => (px) => `${((Number(px) || 0) / base * 100).toFixed(3)}cqw`
    const U = unit(PAGE_BASE)
    const US = unit(SLIDE_BASE)
    const UP = unit(POSTER_BASE)

    const radiusCss = (u, value) => (/^9{3,}/.test(String(value ?? '')) ? '9999px' : u(Number.parseFloat(value) || 0))

    /** DESIGN.md line-heights arrive either as a ratio (1.2) or as px (96px); normalise to a ratio. */
    function lhRatio(raw, size) {
      const n = Number.parseFloat(raw)
      if (!Number.isFinite(n) || n <= 0) return 1.2
      const ratio = n > 4 ? n / (size || 16) : n
      return clamp(ratio, 0.92, 1.9)
    }

    /** Font stacks often carry double quotes; inside an HTML style attribute they must be single quotes. */
    function fam(stack) {
      return String(stack || '').replace(/"/g, "'")
    }

    /** The reference "design system" page: nav + hero + 8 sections + footer. */
    function webHtml(style, mode) {
      const v = style.visual
      const th = themeOf(style, mode)
      const d = deckOf(style)
      const colors = (style.colors || []).filter((c) => c && c.hex).slice(0, 14)
      const types = (style.typography || [])
        .filter((s) => s && Number.parseFloat(s.fontSize) > 0)
        .sort((a, b) => Number.parseFloat(b.fontSize) - Number.parseFloat(a.fontSize))
        .slice(0, 10)
      const radii = (style.radius || []).filter((r) => r && r.value).slice(0, 5)
      const spaces = (style.spacing || []).filter((s) => s && s.value).slice(0, 8)
      const navLinks = ['Colors', 'Typography', 'Buttons', 'Cards', 'Forms', 'Spacing', 'Radius', 'Elevation']
      const display = fam(v.displayStack || 'system-ui, sans-serif')
      const body = fam(v.bodyStack || display)
      const mono = fam(v.monoFamily && v.monoFamily !== '—' ? v.monoFamily : 'ui-monospace, SFMono-Regular, Menlo, monospace')
      const maxStep = Math.max(...types.map((s) => Number.parseFloat(s.fontSize) || 16), 16)
      const rCard = radiusCss(U, v.radiusCard)
      const rBtn = radiusCss(U, v.radiusButton)
      const rPill = radiusCss(U, v.radiusPill)

      const sectionHead = (index, en, zh) => `
        <div style="display:flex;align-items:baseline;gap:${U(10)};margin-bottom:${U(22)}">
          <span style="font-size:${U(13)};line-height:${1};font-family:${mono};letter-spacing:.16em;text-transform:uppercase;color:${th.muted}">${String(index).padStart(2, '0')} / ${en}</span>
        </div>
        <div style="font-family:${display};font-weight:${v.displayWeight || 600};font-size:${U(22)};line-height:1.25;letter-spacing:${U(-0.4)};color:${th.ink};margin-bottom:${U(26)}">${zh}</div>`

      const sectionId = (en) => `dm-${style.slug}-${en.toLowerCase()}`
      const section = (index, en, zh, inner) => `
        <section id="${sectionId(en)}" style="border-top:1px solid ${th.line};padding:${U(56)} 0 ${U(60)};scroll-margin-top:${U(12)}">
          ${sectionHead(index, en, zh)}
          ${inner}
        </section>`

      const colorCells = colors.map((c) => `
        <div style="border:1px solid ${th.line};border-radius:${U(16)};overflow:hidden;background:${th.bg}">
          <div style="height:${U(54)};background:${c.hex}"></div>
          <div style="padding:${U(10)} ${U(12)}">
            <div style="font-size:${U(13)};line-height:${1.35};font-family:${mono};color:${th.ink}">${esc(c.name || 'token')}</div>
            <div style="font-size:${U(11.5)};line-height:${1.35};font-family:${mono};color:${th.muted}">${esc(c.hex)}</div>
          </div>
        </div>`).join('')

      const typeRows = types.map((s, i) => {
        const size = Number.parseFloat(s.fontSize) || 16
        const weight = Number.parseInt(s.fontWeight, 10) || 400
        const lh = lhRatio(s.lineHeight, size)
        const ls = Number.parseFloat(s.letterSpacing) || 0
        const scaled = clamp((size / maxStep) * 26, 8, 26)
        const family = s.token && /mono|code|num/i.test(s.token) ? mono : display
        return `
          <div style="display:flex;align-items:center;gap:${U(16)};padding:${U(11)} 0;border-bottom:1px solid ${th.line}">
            <span style="flex:none;width:${U(26)};font-size:${U(13.5)};line-height:1;font-family:${display};color:${th.muted}">Aa</span>
            <span style="flex:1;min-width:0;font-family:${family};font-weight:${weight};letter-spacing:${U(ls)};font-size:${U(scaled)};line-height:${lh};color:${th.ink};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t('typeSample'))}</span>
            <span style="flex:none;max-width:${U(176)};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:${U(11.5)};line-height:1.45;font-family:${mono};color:${th.muted};text-align:right">${s.token || `step-${i + 1}`} · ${Math.round(size)}/${weight}/${lh.toFixed(2)}</span>
          </div>`
      }).join('')

      const buttons = `
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:${U(10)}">
          <span style="background:${th.accent};color:${th.accentInk};border-radius:${rBtn};padding:${U(11)} ${U(20)};font-size:${U(13)};line-height:1.2;font-weight:600;font-family:${body}">${esc(t('demoBtn'))}</span>
          <span style="background:${th.ink};color:${th.bg};border-radius:${rBtn};padding:${U(11)} ${U(20)};font-size:${U(13)};line-height:1.2;font-weight:600;font-family:${body}">${esc(t('demoBtn2'))}</span>
          <span style="border:1px solid ${th.ink};color:${th.ink};border-radius:${rBtn};padding:${U(11)} ${U(20)};font-size:${U(13)};line-height:1.2;font-weight:500;font-family:${body}">${esc(t('demoBtn3'))}</span>
          <span style="border:1px solid ${th.line};color:${th.muted};border-radius:${rPill};padding:${U(9)} ${U(16)};font-size:${U(12)};line-height:1.2;font-weight:500;font-family:${body}">pill</span>
        </div>`

      const cards = d.cards.map((label, i) => `
        <div style="border:1px solid ${th.line};border-radius:${rCard};overflow:hidden;background:${th.bg}">
          <div style="height:${U(70)};background:linear-gradient(135deg, ${th.accent}, ${th.surface})"></div>
          <div style="padding:${U(14)} ${U(16)} ${U(18)}">
            <div style="font-size:${U(14)};line-height:1.35;font-weight:600;font-family:${body};color:${th.ink}">${esc(label)}</div>
            <div style="margin-top:${U(6)};font-size:${U(12.5)};line-height:1.55;font-family:${body};color:${th.muted}">${esc(t('cardBody'))}</div>
          </div>
        </div>`).join('')

      const forms = `
        <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:${U(10)}">
          <div style="border:1px solid ${th.line};border-radius:${rBtn};padding:${U(12)} ${U(14)};font-size:${U(13)};line-height:1.35;font-family:${body};color:${th.muted}">name@example.com</div>
          <div style="border:1px solid ${th.line};border-radius:${rBtn};padding:${U(12)} ${U(14)};font-size:${U(13)};line-height:1.35;font-family:${body};color:${th.muted};display:flex;justify-content:space-between">Select an option <span>▾</span></div>
          <div style="grid-column:1/-1;border:1px solid ${th.line};border-radius:${rBtn};padding:${U(13)} ${U(14)};font-size:${U(13)};line-height:1.55;font-family:${body};color:${th.muted};min-height:${U(62)}">Multi-line message…</div>
          <label style="grid-column:1/-1;display:flex;align-items:center;gap:${U(9)};font-size:${U(12.5)};line-height:1.35;font-family:${body};color:${th.muted}">
            <span style="width:${U(11)};height:${U(11)};border:1px solid ${th.line};border-radius:${U(3)};display:inline-block"></span>${esc(t('demoCheck'))}
          </label>
        </div>`

      const barFor = (index) => clamp(8 + index * 9, 8, 82)
      const spaceRows = spaces.map((s, i) => {
        const value = Number.parseFloat(s.value) || 0
        return `
          <div style="display:grid;grid-template-columns:${U(56)} 1fr ${U(56)};align-items:center;gap:${U(16)};padding:${U(8)} 0">
            <span style="font-size:${U(13)};line-height:1.4;font-family:${mono};color:${th.muted}">${esc(s.name || `space-${i}`)}</span>
            <span style="height:${U(6)};background:${alpha(th.accent, 0.9)};border-radius:${U(2)};width:${barFor(i)}%"></span>
            <span style="font-size:${U(13)};line-height:1.4;font-family:${mono};color:${th.ink};text-align:right">${Math.round(value)}px</span>
          </div>`
      }).join('')

      const radiusCells = radii.map((r, i) => {
        const value = Number.parseFloat(r.value) || 0
        const radius = value >= 999 ? '9999px' : U(Math.min(value, 40))
        return `
          <div style="text-align:center;min-width:0">
            <div style="height:${U(64)};border:1px solid ${th.line};border-radius:${radius};background:${th.surface}"></div>
            <div style="margin-top:${U(8)};font-size:${U(12.5)};line-height:1.45;font-family:${mono};color:${th.muted}">${esc(r.name || `r-${i + 1}`)} · ${Math.round(value)}px</div>
          </div>`
      }).join('')

      const elevation = [0.06, 0.12, 0.2].map((strength, i) => `
        <div style="height:${U(64)};display:flex;align-items:center;justify-content:center;border:1px solid ${th.line};border-radius:${rCard};background:${th.bg};box-shadow:0 ${U(2 + i * 2)} ${U(8 + i * 8)} ${alpha(th.ink, strength)}">
          <span style="font-size:${U(13)};line-height:1.4;font-family:${mono};color:${th.muted}">elevation ${i + 1}</span>
        </div>`).join('')

      return `
        <div style="background:${th.bg};color:${th.ink};font-family:${body};padding:0 ${U(56)} ${U(72)}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:${U(16)};padding:${U(16)} 0;border-bottom:1px solid ${th.line}">
            <div style="display:flex;align-items:center;gap:${U(9)}">
              <span style="width:${U(16)};height:${U(16)};border-radius:${U(4)};background:${th.accent}"></span>
              <span style="font-size:${U(14)};line-height:1;font-weight:600;font-family:${body};color:${th.ink}">${esc(d.brand)}</span>
            </div>
            <div style="display:flex;gap:${U(20)};font-size:${U(12.5)};line-height:1;font-family:${body};color:${th.muted}">
              ${navLinks.map((l) => `<a href="#dm-${style.slug}-${l.toLowerCase()}" style="color:inherit;text-decoration:none;cursor:pointer">${l}</a>`).join('')}
            </div>
            <span style="background:${th.accent};color:${th.accentInk};border-radius:${rPill};padding:${U(9)} ${U(17)};font-size:${U(12)};line-height:1;font-weight:600;font-family:${body}">Design System</span>
          </div>

          <div style="text-align:center;padding:${U(88)} 0 ${U(72)}">
            <div style="font-family:${display};font-weight:${v.displayWeight || 600};letter-spacing:${U(v.displayTracking || 0)};
              font-size:min(${U(clamp((v.displaySize || 56) * 1.15, 34, 88))}, ${U(96)});line-height:1.05;color:${th.ink}">
              Design System<br>Inspired by <span style="color:${th.accent}">${esc(d.brand)}</span>
            </div>
            <div style="margin:${U(14)} auto 0;max-width:${U(580)};font-size:${U(14)};line-height:1.7;font-family:${body};color:${th.muted};display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden">${esc(style.summaryZh || d.tagline)}</div>
            <div style="margin-top:${U(18)};display:flex;justify-content:center;gap:${U(9)}">
              <span data-dm-action="design" style="cursor:pointer;background:${th.accent};color:${th.accentInk};border-radius:${rBtn};padding:${U(11)} ${U(18)};font-size:${U(13)};line-height:1.1;font-weight:600;font-family:${body}">Open DESIGN.md</span>
              <span data-dm-action="theme" style="cursor:pointer;border:1px solid ${th.line};color:${th.ink};border-radius:${rBtn};padding:${U(11)} ${U(18)};font-size:${U(13)};line-height:1.1;font-weight:500;font-family:${body}">${mode === 'dark' ? 'Light Preview' : 'Dark Preview'}</span>
            </div>
          </div>

          ${section(1, 'COLORS', 'Color Palette', `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:${U(10)}">${colorCells}</div>`)}
          ${section(2, 'TYPOGRAPHY', 'Type Scale', typeRows)}
          ${section(3, 'BUTTONS', 'Buttons', buttons)}
          ${section(4, 'CARDS', 'Cards', `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${U(20)}">${cards}</div>`)}
          ${section(5, 'FORMS', 'Forms', forms)}
          ${section(6, 'SPACING', 'Spacing Scale', spaceRows)}
          ${section(7, 'RADIUS', 'Radius Scale', `<div style="display:grid;grid-template-columns:repeat(${Math.max(radii.length, 1)},minmax(0,1fr));gap:${U(10)}">${radiusCells}</div>`)}
          ${section(8, 'ELEVATION', 'Elevation', `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${U(20)}">${elevation}</div>`)}

          <div style="display:flex;justify-content:space-between;border-top:1px solid ${th.line};padding-top:${U(12)};font-size:${U(8.5)};line-height:1.4;font-family:${mono};color:${th.muted}">
            <span>${esc(d.brand)} · Design tokens from DESIGN.md</span>
            <span>getdesign.md</span>
          </div>
        </div>`
    }

    /* -------------------------------------------------- art: slide + poster */

    function slidesHtml(style, mode) {
      const th = themeOf(style, mode)
      const v = style.visual
      const d = deckOf(style)
      const display = fam(v.displayStack || 'system-ui, sans-serif')
      const body = fam(v.bodyStack || display)
      const mono = fam(v.monoFamily && v.monoFamily !== '—' ? v.monoFamily : 'ui-monospace, SFMono-Regular, Menlo, monospace')
      const accentInk = v.accentText || (luminance(th.accent) > 0.55 ? '#111111' : '#ffffff')

      /* An editorial deck page: meta rail, oversized wordmark, spec columns,
         an accent plate, and a technical drawing of the corner system. */
      const tiny = (label, value) => `
        <div style="display:flex;align-items:baseline;gap:${US(6)};font-size:${US(9.5)};line-height:1.6">
          <span style="color:${th.muted};min-width:${US(52)}">${label}</span>
          <span style="flex:1;border-bottom:1px dotted ${alpha(th.ink, 0.22)};transform:translateY(-${US(2)})"></span>
          <span style="font-family:${mono};color:${th.ink}">${value}</span>
        </div>`

      const row = (label, value) => `
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:${US(12)};
          padding:${US(9)} 0;border-top:1px solid ${alpha(accentInk, 0.22)};font-size:${US(10)};line-height:1.4">
          <span style="color:${alpha(accentInk, 0.82)};letter-spacing:.02em">${label}</span>
          <span style="font-family:${mono};color:${accentInk};font-weight:500">${value}</span>
        </div>`

      const radiusTokens = (style.radius || []).filter((r) => r && r.value).slice(0, 4)
      const shapes = radiusTokens.length ? radiusTokens : [
        { name: 'card', value: v.radiusCard }, { name: 'button', value: v.radiusButton },
        { name: 'pill', value: v.radiusPill }, { name: 'full', value: 9999 },
      ]
      const shapeCell = (item, index) => {
        const raw = String(item.value || '')
        const px = Number.parseFloat(raw)
        const isPill = /9{3,}/.test(raw) || !Number.isFinite(px)
        const radius = isPill ? '9999px' : US(px)
        const label = isPill ? '9999px' : `${Math.round(px)}px`
        const size = index % 2 === 0 ? US(86) : US(68)
        return `
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:${US(7)}">
            <div style="width:${size};height:${size};border-radius:${radius};
              border:1px solid ${index === 0 ? th.accent : alpha(th.ink, 0.26)};
              background:${index === 0 ? th.accent : alpha(th.accent, 0.07)}"></div>
            <div style="font-size:${US(8.5)};line-height:1.3;font-family:${mono};color:${th.muted}">
              ${esc(String(item.name || 'radius'))} · ${label}
            </div>
          </div>`
      }

      const title = clamp((v.displaySize || 56) * 2.4, 54, 128)

      return `
        <div style="position:relative;height:100%;background:${th.bg};color:${th.ink};font-family:${body};box-sizing:border-box;overflow:hidden">
          <div style="position:absolute;inset:${US(16)};border:1px solid ${alpha(th.ink, 0.16)};pointer-events:none"></div>
          <div style="position:relative;height:100%;box-sizing:border-box;
            padding:${US(30)} ${US(40)} ${US(24)} ${US(40)};display:flex;flex-direction:column">

            <div style="display:flex;align-items:baseline;justify-content:space-between;
              font-size:${US(8.5)};line-height:1.4;font-family:${mono};letter-spacing:.14em;text-transform:uppercase;color:${th.muted}">
              <span>${esc(style.category || '')} / deck</span>
              <span>${esc(d.brand)} · ${esc(t('surfaces.slides'))}</span>
            </div>

            <div style="flex:1;display:grid;grid-template-columns:minmax(0,1.32fr) minmax(0,0.68fr);
              gap:${US(34)};padding-top:${US(22)};min-height:0">

              <div style="display:flex;flex-direction:column;min-width:0">
                <div style="display:flex;align-items:center;gap:${US(8)};font-size:${US(9.5)};line-height:1.4;
                  letter-spacing:.18em;text-transform:uppercase;color:${th.muted}">
                  <span style="width:${US(18)};height:${US(2)};background:${th.accent};display:inline-block"></span>
                  ${esc(d.kicker)}
                </div>

                <div style="font-family:${display};font-weight:${v.displayWeight || 600};
                  letter-spacing:${US((v.displayTracking || 0) * 0.6)};font-size:${US(title)};line-height:.98;
                  margin-top:${US(12)};word-break:break-word">${esc(d.brand)}</div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:${US(4)} ${US(22)};
                  margin-top:${US(16)};max-width:${US(430)}">
                  ${tiny('强调色', esc((style.colors && style.colors[0] && style.colors[0].hex) || th.accent))}
                  ${tiny('间距', `${v.spaceBase || 8}px`)}
                  ${tiny('展示字体', esc(String(v.displayFamily || 'sans').slice(0, 12)))}
                  ${tiny('正文字号', `${v.bodySize || 14}px`)}
                </div>

                <div style="margin-top:${US(22)};max-width:${US(430)}">
                  <div style="font-size:${US(8.5)};line-height:1.4;letter-spacing:.18em;text-transform:uppercase;
                    color:${th.muted};margin-bottom:${US(8)}">highlights / 要点</div>
                  ${(d.bullets || []).slice(0, 3).map((b) => `
                    <div style="display:flex;gap:${US(8)};font-size:${US(11)};line-height:1.65;color:${th.ink}">
                      <span style="color:${th.accent}">—</span><span style="min-width:0">${esc(b)}</span>
                    </div>`).join('')}
                </div>

                <div style="flex:1;min-height:${US(10)}"></div>

                <div style="background:${th.accent};color:${accentInk};padding:${US(24)} ${US(26)} ${US(18)}">
                  <div style="font-size:${US(8.5)};line-height:1.4;letter-spacing:.18em;text-transform:uppercase;
                    color:${alpha(accentInk, 0.7)};margin-bottom:${US(10)}">specification / 规范</div>
                  <div style="font-family:${display};font-weight:${v.displayWeight || 600};font-size:${US(30)};
                    line-height:1.14;letter-spacing:${US((v.displayTracking || 0) * 0.4)}">${esc(d.tagline)}</div>
                  <div style="margin-top:${US(18)}">
                    ${row('卡片圆角 / radius', `${v.radiusCard || 0}px`)}
                    ${row('按钮圆角 / button', /9{3,}/.test(String(v.radiusButton)) ? '9999px' : `${v.radiusButton || 0}px`)}
                    ${row('间距基数 / space', `${v.spaceBase || 8}px`)}
                    ${row('展示字体 / display', esc(String(v.displayFamily || 'sans').slice(0, 16)))}
                  </div>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;min-width:0;position:relative">
                <div style="display:flex;justify-content:space-between;align-items:baseline;
                  font-size:${US(8.5)};line-height:1.4;font-family:${mono};letter-spacing:.14em;
                  text-transform:uppercase;color:${th.muted}">
                  <span>corner system</span><span>fig. 01</span>
                </div>

                <div style="position:relative;flex:1;min-height:0;border-left:1px solid ${alpha(th.ink, 0.14)};
                  border-bottom:1px solid ${alpha(th.ink, 0.14)};margin-top:${US(6)}">
                  <div style="position:relative;padding:${US(20)} ${US(18)};
                    display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:${US(16)} ${US(14)}">
                    ${shapes.map((item, index) => shapeCell(item, index)).join('')}
                  </div>
                  <div style="position:absolute;left:${US(16)};bottom:${US(12)};right:${US(16)};
                    display:flex;align-items:center;gap:${US(8)};font-size:${US(8)};line-height:1.3;
                    font-family:${mono};color:${th.muted}">
                    <span style="flex:1;height:1px;background:${alpha(th.ink, 0.18)}"></span>
                    <span>radius scale</span>
                    <span style="flex:1;height:1px;background:${alpha(th.ink, 0.18)}"></span>
                  </div>
                </div>

                <div style="margin-top:${US(12)};display:flex;flex-direction:column;gap:${US(4)};
                  font-size:${US(8.5)};line-height:1.5;font-family:${mono};color:${th.muted}">
                  <span style="display:flex;justify-content:space-between;border-top:1px solid ${alpha(th.ink, 0.14)};padding-top:${US(5)}">
                    <span>display</span><span>${esc(String(v.displayFamily || 'sans').slice(0, 16))}</span></span>
                  <span style="display:flex;justify-content:space-between">
                    <span>body</span><span>${esc(String(v.bodyFamily || 'sans').slice(0, 12))} / ${v.bodySize || 14}px</span></span>
                  <span style="display:flex;justify-content:space-between">
                    <span>tracking</span><span>${Math.round(Number.parseFloat(v.displayTracking) || 0)}px</span></span>
                </div>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:baseline;
              margin-top:${US(14)};padding-top:${US(8)};border-top:1px solid ${alpha(th.ink, 0.16)};
              font-size:${US(8.5)};line-height:1.3;font-family:${mono};color:${th.muted}">
              <span>${esc(d.brandZh || d.brand)} · ${esc(d.kicker)}</span>
              <span>01 / 08 · getdesign.md/${esc(style.slug)}</span>
            </div>
          </div>
        </div>`
    }

    function posterHtml(style, mode) {
      const v = style.visual
      // The poster follows the chosen tone: light = paper, dark = ink.
      const th = themeOf(style, mode)
      const d = deckOf(style)
      const display = fam(v.displayStack || 'system-ui, sans-serif')
      const body = fam(v.bodyStack || display)
      const title = clamp((v.displaySize || 56) * 2.4, 28, 84)
      return `
        <div style="height:100%;background:${th.bg};color:${th.ink};font-family:${body};box-sizing:border-box;
          padding:${UP(34)} ${UP(34)} ${UP(26)};display:flex;flex-direction:column">
          <div style="display:flex;justify-content:space-between;font-size:${UP(9)};line-height:1.3;font-family:${body};letter-spacing:.16em;text-transform:uppercase;color:${th.muted}">
            <span>${esc(d.kicker)}</span><span>2026</span>
          </div>
          <div style="flex:1"></div>
          <div style="font-family:${display};font-weight:${v.displayWeight || 600};text-transform:uppercase;letter-spacing:${UP(v.displayTracking || 0)};
            font-size:${UP(title)};line-height:.96">${esc(d.brand)}</div>
          <div style="height:${UP(2)};background:${th.accent};margin:${UP(14)} 0 ${UP(12)}"></div>
          <div style="font-size:${UP(11)};line-height:1.6;font-family:${body};color:${th.muted};max-width:${UP(300)}">${esc(d.tagline)}</div>
          <div style="display:flex;justify-content:space-between;margin-top:${UP(18)};font-size:${UP(8.5)};line-height:1.3;font-family:${body};color:${th.muted}">
            <span>${esc(d.brandZh)} · ${esc(d.kicker)}</span><span>getdesign.md</span>
          </div>
        </div>`
    }

    const ART_BUILDERS = {
      page: { build: webHtml, cls: 'is-page', base: PAGE_BASE },
      slides: { build: slidesHtml, cls: 'is-slides', base: SLIDE_BASE },
      poster: { build: posterHtml, cls: 'is-poster', base: POSTER_BASE },
    }

    function Art({ style, mode, surface, clip, onAction }) {
      const spec = ART_BUILDERS[surface] || ART_BUILDERS.page
      const html = useMemo(() => spec.build(style, mode), [spec, style, mode])
      const onClick = (event) => {
        if (!onAction) return
        const hit = event.target && event.target.closest ? event.target.closest('[data-dm-action]') : null
        if (hit) onAction(hit.getAttribute('data-dm-action'))
      }
      return h('div', {
        className: `dm-art ${spec.cls}${clip ? ' is-clip' : ''}`,
        style: { '--dm-art-bg': themeOf(style, mode).bg },
        onClick,
        dangerouslySetInnerHTML: { __html: html },
      })
    }

    /* --------------------------------------------------------------- panel */

    const CATALOG_TTL = 5 * 60 * 1000
    const catalogCache = { data: null, at: 0, promise: null }

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
      const ctx = runtime.ctx
      const layout = ctx && (typeof ctx.get === 'function' ? ctx.get('layout') : ctx.layout)
      if (layout && typeof layout.selectPanel === 'function') layout.selectPanel(null)
    }

    async function writeClipboard(text) {
      // Some environments resolve clipboard.writeText only after a real user gesture and
      // leave the promise pending otherwise — race it so the UI always gets an answer.
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await Promise.race([
            navigator.clipboard.writeText(text),
            new Promise((_, reject) => window.setTimeout(() => reject(new Error('clipboard timeout')), 1500)),
          ])
          return
        } catch {
          /* fall through to the textarea fallback */
        }
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
      if (!binding || !binding.session || typeof binding.session.prompt !== 'function') throw new Error(t('noSession'))
      const result = await binding.session.prompt([{ type: 'text', text }], 'queue')
      if (result && result.ok === false) throw new Error(result.error?.message || 'prompt rejected')
    }

    /* ----------------------------------------------------------- list card */

    function StyleCard({ style, surface, mode, onOpen }) {
      const v = style.visual
      const dots = [v.canvas, v.accent, v.surface, v.darkCanvas].filter(Boolean)
      const meta = style.nameZh === style.displayName ? style.category : `${style.displayName} · ${style.category}`
      const keywords = (style.styleKeywords || []).slice(0, 3).join(' / ')
      return h('article', {
        className: 'dm-card',
        tabIndex: 0,
        role: 'button',
        'aria-label': `${style.displayName} ${style.nameZh || ''}`.trim(),
        onClick: () => onOpen(style.slug),
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(style.slug)
          }
        },
      },
      h('div', { className: 'dm-card-art' }, h(Art, { style, mode: mode || baseMode(style), surface, clip: true })),
      h('div', { className: 'dm-card-body' },
        h('div', { className: 'dm-card-head' },
          h('div', { className: 'dm-card-title' }, style.nameZh || style.displayName),
          h('div', { className: 'dm-card-meta' }, meta),
        ),
        keywords ? h('div', { className: 'dm-card-kw' }, keywords) : null,
        h('p', { className: 'dm-card-desc' }, style.summaryZh || style.positioningZh || style.descriptionEn || ''),
        h('div', { className: 'dm-card-foot' },
          h('div', { className: 'dm-dots' }, ...dots.map((hex, i) => h('span', { key: i, className: 'dm-dot', style: { background: hex } }))),
          h('span', { className: 'dm-card-go' }, t('useThis')),
        ),
      ))
    }

    /* -------------------------------------------------------------- detail */

    function Detail({ style, surface, setSurface, mode, setMode, onBack, onToast }) {
      const loc = useLocale()
      const v = style.visual
      const [form, setForm] = useState({ requirement: '', includeDesign: false })
      const [busy, setBusy] = useState(false)
      const [sent, setSent] = useState(false)
      const [design, setDesign] = useState({ open: false, text: '', busy: false })
      const [chars, setChars] = useState(0)
      const gridRef = useRef(null)

      /* A new surface starts at the top of the preview. */
      useEffect(() => {
        if (gridRef.current) gridRef.current.scrollTop = 0
      }, [surface, style.slug])

      const colors = (style.colors || []).filter((c) => c && c.hex)
      const types = (style.typography || []).filter((s) => Number.parseFloat(s.fontSize) > 0)
      const typeTop = types.reduce((max, s) => Math.max(max, Number.parseFloat(s.fontSize) || 0), 16)
      const bestFor = [...new Set([...(style.bestFor || []), ...(style.useCases || []).slice(0, 3)].filter(Boolean))]
      const avoidFor = [...new Set((style.avoidFor || []).filter(Boolean))]

      const promptFor = useCallback(async () => {
        const res = await fetch(`${API}/prompt`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            slug: style.slug,
            surface: hostKey(form.output || surface, mode),
            requirement: form.requirement,
            includeDesign: form.includeDesign,
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      }, [style.slug, surface, form.requirement, form.includeDesign])

      const send = async () => {
        setBusy(true)
        try {
          const data = await promptFor()
          setChars(data.chars || 0)
          await deliverToCurrentSession(data.prompt)
          setSent(true)
          onToast({ kind: 'ok', text: `${t('sendOk')} ${t('chars', { n: data.chars })}` })
        } catch (err) {
          onToast({ kind: 'err', text: String(err.message || err) })
        } finally {
          setBusy(false)
        }
      }

      const copy = async () => {
        try {
          const data = await promptFor()
          setChars(data.chars || 0)
          await writeClipboard(data.prompt)
          onToast({ kind: 'ok', text: `${t('copied')} · ${t('chars', { n: data.chars })}` })
        } catch (err) {
          onToast({ kind: 'err', text: err && err.message === 'copy was rejected' ? t('copyFailed') : String(err.message || err) })
        }
      }

      const openDesign = async () => {
        setDesign({ open: true, text: '', busy: true })
        try {
          const res = await fetch(`${API}/design/${style.slug}`)
          if (!res.ok) throw new Error(t('designFailed'))
          const text = await res.text()
          setDesign({ open: true, text, busy: false })
        } catch (err) {
          setDesign({ open: true, text: String(err.message || err), busy: false })
        }
      }

      useEffect(() => {
        if (!design.open) return undefined
        const onKey = (event) => { if (event.key === 'Escape') setDesign({ open: false, text: '', busy: false }) }
        document.addEventListener('keydown', onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
          document.removeEventListener('keydown', onKey)
          document.body.style.overflow = prev
        }
      }, [design.open])

      const rValue = (value) => /^9{3,}/.test(String(value ?? '')) ? 9999 : Number.parseFloat(value) || 0

      return h('div', { className: 'dm-detail' },
        h('div', { className: 'dm-detail-top' },
          h('button', { type: 'button', className: 'dm-ghost dm-back', onClick: onBack }, `← ${t('back')}`),
        ),
        h('div', { className: 'dm-detail-head' },
          h('div', { className: 'dm-detail-head-l' },
            h('h2', { className: 'dm-detail-title' }, style.nameZh || style.displayName),
            h('p', { className: 'dm-detail-cat' },
              `${style.category || ''} · ${t('source')} `,
              h('a', {
                className: 'dm-source',
                href: style.sourceUrl || '#',
                target: '_blank',
                rel: 'noreferrer',
              }, `getdesign.md/${style.slug}`),
            ),
          ),
          h('div', { className: 'dm-detail-head-r' },
            h('div', { className: 'dm-seg' },
              ...Object.keys(STRING_SURFACES).map((key) => h('button', {
                key,
                type: 'button',
                className: `dm-seg-btn${surface === key ? ' is-on' : ''}`,
                'aria-pressed': surface === key,
                onClick: () => setSurface(key),
              }, t(`surfaces.${key}`))),
            ),
            style.darkFirst
              ? h('span', { className: 'dm-note-inline' }, t('brandDark'))
              : h('div', { className: 'dm-seg dm-seg-themed' },
                ...['light', 'dark'].map((key) => h('button', {
                  key,
                  type: 'button',
                  className: `dm-seg-btn${mode === key ? ' is-on' : ''}`,
                  'aria-pressed': mode === key,
                  onClick: () => setMode(key),
                }, t(`themes.${key}`))),
              ),
          ),
        ),

        h('div', { className: 'dm-detail-grid', ref: gridRef },
          h('div', { className: 'dm-left' },
            h('div', { className: 'dm-preview' + (surface === 'page' ? ' is-page' : surface === 'poster' ? ' is-poster' : ' is-slides') },
              h(Art, {
                style,
                mode: style.visual.darkFirst ? 'dark' : mode,
                surface,
                onAction: (action) => {
                  if (action === 'design') openDesign()
                  else if (action === 'theme') setMode(mode === 'dark' ? 'light' : 'dark')
                },
              }),
            ),
            h('div', { className: 'dm-preview-cap' },
              h('span', null, t('previewNote')),
              h('span', null, surface === 'page' ? t('previewFull') : t('previewSketch')),
            ),
          ),

          h('div', { className: 'dm-right' },
            h('section', { className: 'dm-card2 dm-form' },
              h('h3', null, t('formTitle')),
              h('p', { className: 'dm-form-hint' }, t('formHint')),
              h('div', { className: 'dm-label' }, t('output')),
              h('div', { className: 'dm-seg dm-seg-form' },
                ...Object.keys(STRING_SURFACES).map((key) => h('button', {
                  key,
                  type: 'button',
                  className: `dm-seg-btn${(form.output || surface) === key ? ' is-on' : ''}`,
                  'aria-pressed': (form.output || surface) === key,
                  onClick: () => setForm((prev) => ({ ...prev, output: key })),
                }, t(`surfaces.${key}`))),
              ),
              h('div', { className: 'dm-label' }, t('requirement')),
              h('textarea', {
                className: 'dm-textarea',
                rows: 4,
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
              h('button', { type: 'button', className: 'dm-primary', disabled: busy, onClick: send }, busy ? t('sending') : t('send')),
              h('div', { className: 'dm-form-row' },
                h('button', { type: 'button', className: 'dm-ghost', onClick: copy }, t('copyPrompt')),
                h('button', { type: 'button', className: 'dm-ghost', onClick: openDesign }, t('viewDesign')),
              ),
              chars ? h('div', { className: 'dm-chars' }, t('chars', { n: chars })) : null,
              sent ? h('button', { type: 'button', className: 'dm-ghost dm-back-chat', onClick: backToChat }, t('backToChat')) : null,
            ),

            h('section', { className: 'dm-card2' },
              h('h3', null, t('fitAvoid')),
              h('div', { className: 'dm-kv-cap' }, t('bestFor')),
              h('div', { className: 'dm-kv' },
                ...bestFor.map((item) => h('span', { key: `b-${item}`, className: 'dm-tag dm-tag-ok' }, item)),
              ),
              h('div', { className: 'dm-kv-cap' }, t('avoidFor')),
              h('div', { className: 'dm-kv' },
                ...avoidFor.map((item) => h('span', { key: `a-${item}`, className: 'dm-tag' }, item)),
              ),
            ),

            h('section', { className: 'dm-card2' },
              h('h3', null, t('notes')),
              style.summaryZh ? h('p', { className: 'dm-lead' }, style.summaryZh) : null,
              style.positioningZh ? h('p', { className: 'dm-lead is-dim' }, style.positioningZh) : null,
              h('div', { className: 'dm-kv' },
                ...(style.styleKeywords || []).slice(0, 6).map((k) => h('span', { key: k, className: 'dm-tag dm-tag-flat' }, k)),
              ),
            ),

            h('section', { className: 'dm-card2' },
              h('h3', null, `${t('palette')} · ${colors.length}`),
              h('div', { className: 'dm-swatches' },
                ...colors.slice(0, 18).map((c, i) => h('button', {
                  key: `${c.name}-${i}`,
                  type: 'button',
                  className: 'dm-swatch',
                  onClick: async () => {
                    await writeClipboard(c.hex)
                    onToast({ kind: 'ok', text: `${c.hex} ${t('copied')}` })
                  },
                },
                h('span', { className: 'dm-swatch-chip', style: { background: c.hex } }),
                h('span', { className: 'dm-swatch-name' }, c.name || 'token'),
                h('span', { className: 'dm-swatch-hex' }, c.hex),
                )),
              ),
            ),

            h('section', { className: 'dm-card2' },
              h('h3', null, t('typography')),
              h('div', { className: 'dm-spec' },
                ...(v.displayFamily ? [specRow(t('fontDisplay'), `${v.displayFamily} · ${v.fontClass || 'sans'}`)] : []),
                ...(v.bodyFamily ? [specRow(t('fontBody'), `${v.bodyFamily} · ${v.bodySize || 16}px`)] : []),
                ...(v.monoFamily ? [specRow(t('fontMono'), v.monoFamily)] : []),
                specRow('Display', `${v.displaySize || '—'}px / ${v.displayWeight || 400}`),
                specRow('Tracking', `${Math.round(Number.parseFloat(v.displayTracking) || 0)}px`),
                specRow('Leading', `${v.displayLineHeight || 1.2}`),
              ),
              h('div', { className: 'dm-types' },
                ...types.slice(0, 8).map((s, i) => {
                  const size = Number.parseFloat(s.fontSize) || 16
                  const weight = Number.parseInt(s.fontWeight, 10) || 400
                  const lh = lhRatio(s.lineHeight, size)
                  const ls = Number.parseFloat(s.letterSpacing) || 0
                  const scaled = clamp((size / typeTop) * 24, 9, 24)
                  return h('div', { key: `${s.token}-${i}`, className: 'dm-type-row' },
                    h('span', {
                      className: 'dm-type-sample',
                      style: {
                        fontSize: `${scaled.toFixed(1)}px`,
                        fontWeight: weight,
                        lineHeight: lh,
                        letterSpacing: `${ls}px`,
                        fontFamily: s.fontFamily || v.displayStack,
                      },
                    }, 'Aa'),
                    h('span', { className: 'dm-type-token' }, s.token || `step-${i + 1}`),
                    h('span', { className: 'dm-type-spec' }, `${Math.round(size)} / ${weight} / ${lh.toFixed(2)}`),
                  )
                }),
              ),
            ),

            h('section', { className: 'dm-card2' },
              h('h3', null, t('shapes')),
              h('div', { className: 'dm-spec' },
                specRow(t('radiusCard'), prettyRadius(v.radiusCard)),
                specRow(t('radiusButton'), prettyRadius(v.radiusButton)),
                specRow(t('radiusPill'), prettyRadius(v.radiusPill)),
                specRow(t('spaceBase'), `${v.spaceBase || 8}px`),
              ),
              h('div', { className: 'dm-scale' },
                ...(style.spacing || []).slice(0, 8).map((s, i) => {
                  const value = Number.parseFloat(s.value) || 0
                  return h('div', { key: `${s.name}-${i}`, className: 'dm-scale-row' },
                    h('span', { className: 'dm-scale-name' }, s.name || `s-${i}`),
                    h('span', { className: 'dm-scale-bar', style: { width: `${clamp(6 + i * 9, 6, 84)}%`, background: v.accent } }),
                    h('span', { className: 'dm-scale-val' }, `${Math.round(value)}px`),
                  )
                }),
              ),
              h('div', { className: 'dm-shapes' },
                ...[
                  [t('radiusCard'), v.radiusCard],
                  [t('radiusButton'), v.radiusButton],
                  [t('radiusPill'), v.radiusPill],
                ].map(([label, value], i) => h('div', { key: `r-${i}`, className: 'dm-shape' },
                  h('span', {
                    className: 'dm-shape-box',
                    style: {
                      background: v.surface,
                      border: `1px solid ${v.hairline}`,
                      borderRadius: rValue(value) >= 999 ? '9999px' : `${Math.min(rValue(value), 28)}px`,
                    },
                  }),
                  h('span', { className: 'dm-shape-label' }, label),
                )),
              ),
            ),

            h('section', { className: 'dm-card2' },
              h('h3', null, t('components')),
              h('div', { className: 'dm-demo', style: { background: v.canvas, border: `1px solid ${v.hairline}`, borderRadius: `${Math.min(rValue(v.radiusCard), 20)}px` } },
                h('div', { className: 'dm-demo-row' },
                  h('span', { style: { background: v.accent, color: v.accentText, borderRadius: `${Math.min(rValue(v.radiusButton), 18)}px`, padding: '6px 12px', fontSize: 11, fontWeight: 600 } }, t('demoBtn')),
                  h('span', { style: { background: v.ink, color: v.canvas, borderRadius: `${Math.min(rValue(v.radiusButton), 18)}px`, padding: '6px 12px', fontSize: 11, fontWeight: 600 } }, t('demoBtn2')),
                  h('span', { style: { border: `1px solid ${v.hairline}`, color: v.muted, borderRadius: `${rValue(v.radiusPill) >= 999 ? '9999px' : '8px'}`, padding: '5px 10px', fontSize: 10.5 } }, t('demoBtn3')),
                ),
                h('div', { style: { background: v.bg || v.canvas, border: `1px solid ${v.hairline}`, borderRadius: `${Math.min(rValue(v.radiusCard), 20)}px`, overflow: 'hidden' } },
                  h('div', { style: { height: 42, background: `linear-gradient(135deg, ${v.accent}, ${v.surface})` } }),
                  h('div', { style: { padding: '9px 11px' } },
                    h('div', { style: { fontSize: 11, fontWeight: 600, color: v.ink } }, t('demoCard')),
                    h('div', { style: { marginTop: 3, fontSize: 10, color: v.muted, lineHeight: 1.5 } }, t('demoCardBody')),
                  ),
                ),
                h('div', { style: { border: `1px solid ${v.hairline}`, borderRadius: `${Math.min(rValue(v.radiusButton), 18)}px`, padding: '7px 10px', fontSize: 10.5, color: v.muted } }, t('demoInput')),
              ),
            ),
          ),
        ),

        design.open ? h('div', {
          className: 'dm-modal',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': `DESIGN.md · ${style.displayName}`,
          onClick: (event) => { if (event.target === event.currentTarget) setDesign({ open: false, text: '', busy: false }) },
        },
        h('div', { className: 'dm-modal-card' },
          h('div', { className: 'dm-modal-head' },
            h('span', null, `DESIGN.md · ${style.displayName}`),
            h('div', { className: 'dm-modal-actions' },
              h('button', { type: 'button', className: 'dm-ghost', onClick: async () => { await writeClipboard(design.text); onToast({ kind: 'ok', text: t('copied') }) } }, t('copy')),
              h('button', { type: 'button', className: 'dm-ghost', onClick: () => setDesign({ open: false, text: '', busy: false }) }, t('close')),
            ),
          ),
          h('pre', { className: 'dm-modal-body', tabIndex: 0 }, design.busy ? t('loading') : design.text),
        )) : null,
      )
    }

    const specRow = (label, value) => h('div', { key: `${label}-${value}`, className: 'dm-spec-row' },
      h('span', { className: 'dm-spec-label' }, label),
      h('span', { className: 'dm-spec-value' }, String(value)),
    )

    const STRING_SURFACES = { page: true, slides: true, poster: true }
    const HOST_SURFACE = { page: 'web', slides: 'slides', poster: 'poster' }
    /** page + dark theme maps to the host's dedicated dark-page deliverable. */
    const hostKey = (chosen, mode) => (chosen === 'page' ? (mode === 'dark' ? 'webDark' : 'web') : HOST_SURFACE[chosen] || 'web')

    /* ------------------------------------------------------------ panel UI */

    function Panel() {
      useLocale()
      const [catalog, setCatalog] = useState(catalogCache.data)
      const [error, setError] = useState('')
      const [query, setQuery] = useState(memory.query)
      const [category, setCategory] = useState(memory.category)
      const [surface, setSurface] = useState(memory.surface)
      const [mode, setMode] = useState(memory.theme)
      const [slug, setSlug] = useState(memory.slug)
      const [toast, setToast] = useState(null)
      const toastTimer = useRef(0)
      const alive = useRef(true)

      const notify = (next) => {
        setToast(next)
        window.clearTimeout(toastTimer.current)
        toastTimer.current = window.setTimeout(() => setToast(null), 4200)
      }

      useEffect(() => () => window.clearTimeout(toastTimer.current), [])

      const load = (force) => {
        setError('')
        fetchCatalog(force)
          .then((data) => { if (alive.current) setCatalog(data) })
          .catch((err) => { if (alive.current) setError(String(err.message || err)) })
      }

      useEffect(() => {
        alive.current = true
        load(false)
        return () => { alive.current = false }
      }, [])

      useEffect(() => {
        const handler = () => setSlug(null)
        viewBus.listeners.add(handler)
        return () => { viewBus.listeners.delete(handler) }
      }, [])

      useEffect(() => { memory.query = query }, [query])
      useEffect(() => { memory.category = category }, [category])
      useEffect(() => { memory.surface = surface }, [surface])
      useEffect(() => { memory.theme = mode }, [mode])
      useEffect(() => { memory.slug = slug }, [slug])

      const styles = catalog ? catalog.styles : []
      const categories = useMemo(() => {
        const seen = []
        for (const style of styles) if (style.category && !seen.includes(style.category)) seen.push(style.category)
        return [null, ...seen]
      }, [styles])

      const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return styles.filter((style) => {
          if (category && style.category !== category) return false
          if (!q) return true
          const haystack = [
            style.slug, style.displayName, style.nameZh, style.category,
            ...(style.tagsZh || []), ...(style.styleKeywords || []), ...(style.useCases || []),
            ...(style.bestFor || []), style.summaryZh, style.positioningZh,
          ].join(' ').toLowerCase()
          return haystack.includes(q)
        })
      }, [styles, query, category])

      const current = slug ? styles.find((style) => style.slug === slug) : null

      const toastEl = toast
        ? h('div', { className: `dm-toast is-${toast.kind}`, role: 'status', 'aria-live': 'polite' }, toast.text)
        : null

      if (current) {
        return h('div', { className: 'dm-panel' },
          h('style', null, CSS),
          h(Detail, {
            style: current,
            surface,
            setSurface,
            mode: current.visual.darkFirst ? 'dark' : mode,
            setMode,
            onBack: () => setSlug(null),
            onToast: notify,
          }),
          toastEl,
        )
      }

      return h('div', { className: 'dm-panel' },
        h('style', null, CSS),
        h('header', { className: 'dm-head' },
          h('div', { className: 'dm-head-top' },
            h('div', null,
              h('div', { className: 'dm-eyebrow' }, t('pageEyebrow')),
              h('h1', { className: 'dm-h1' }, t('title')),
              h('p', { className: 'dm-sub' }, catalog ? t('subtitle') : t('loading')),
            ),
            h('div', { className: 'dm-head-right' },
              h('button', { type: 'button', className: 'dm-ghost', onClick: backToChat }, t('backChat')),
            ),
          ),
          h('div', { className: 'dm-toolbar' },
            h('div', { className: 'dm-seg' },
              ...Object.keys(STRING_SURFACES).map((key) => h('button', {
                key,
                type: 'button',
                className: `dm-seg-btn${surface === key ? ' is-on' : ''}`,
                'aria-pressed': surface === key,
                onClick: () => setSurface(key),
              }, t(`surfaces.${key}`))),
            ),
            h('div', { className: 'dm-seg dm-seg-themed' },
              ...['light', 'dark'].map((key) => h('button', {
                key,
                type: 'button',
                className: `dm-seg-btn${mode === key ? ' is-on' : ''}`,
                'aria-pressed': mode === key,
                onClick: () => setMode(key),
              }, t(`themes.${key}`))),
            ),
            h('input', {
              className: 'dm-search',
              value: query,
              placeholder: t('search'),
              'aria-label': t('search'),
              onChange: (event) => setQuery(event.target.value),
            }),
            catalog ? h('span', { className: 'dm-count' }, filtered.length === catalog.count ? String(catalog.count) : `${filtered.length} / ${catalog.count}`) : null,
          ),
          h('div', { className: 'dm-chips' },
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
              h('button', { type: 'button', className: 'dm-ghost', onClick: () => load(true) }, t('retry')),
            )
            : !catalog
              ? h('div', { className: 'dm-empty' }, h('p', null, t('loading')))
              : filtered.length === 0
                ? h('div', { className: 'dm-empty' },
                  h('p', null, t('empty')),
                  h('p', { className: 'dm-note' }, t('emptyHint')),
                  (query || category) ? h('button', {
                    type: 'button',
                    className: 'dm-ghost',
                    onClick: () => { setQuery(''); setCategory(null) },
                  }, t('clearFilters')) : null,
                )
                : h('div', { className: 'dm-grid' },
                  ...filtered.map((style) => h(StyleCard, {
                    key: style.slug,
                    style,
                    surface,
                    mode: style.visual.darkFirst ? 'dark' : mode,
                    onOpen: setSlug,
                  })),
                ),
        ),
        toastEl,
      )
    }

    function PanelIcon({ size }) {
      const dimension = typeof size === 'number' ? size : 22
      return h('svg', {
        width: dimension,
        height: dimension,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
        onClick: () => requestListView(),
        'data-dm-entry': 'design-md',
        style: { cursor: 'pointer' },
      },
      h('rect', { x: 3.2, y: 3.2, width: 17.6, height: 17.6, rx: 5.2, stroke: 'currentColor', strokeWidth: 1.5 }),
      h('path', { d: 'M7.6 15.4 10.9 8l3.3 7.4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('path', { d: 'M8.6 13h4.6', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('circle', { cx: 16.4, cy: 16.2, r: 1.55, fill: 'currentColor' }),
      )
    }

    /* ---------------------------------------------------------------- css */

    const CSS = `
.dm-panel{position:relative;display:flex;flex-direction:column;height:100%;min-height:0;
  --bg:#ffffff;--bg-2:#f5f5f5;--ink:#1e1e1e;--ink-2:#4d4d4d;--ink-3:#8c8c8c;--line:#e6e6e6;--line-2:#f0f0f0;
  --accent:#000000;--radius:10px;--shadow:0 1px 2px rgba(0,0,0,.05),0 10px 30px -20px rgba(0,0,0,.25);
  background:var(--bg);color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue","PingFang SC","Hiragino Sans GB",system-ui,sans-serif;
  -webkit-font-smoothing:antialiased}
.dm-head{flex:none;padding:clamp(16px,2vw,28px) clamp(20px,3.2vw,64px) 0}
.dm-head-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.dm-eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:600;margin-bottom:8px}
.dm-h1{margin:0 0 8px;font-size:clamp(26px,2.4vw,36px);line-height:1.1;letter-spacing:-.03em;font-weight:700}
.dm-sub{margin:0;font-size:13px;line-height:1.55;color:var(--ink-2);max-width:88ch;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.dm-head-right{display:flex;align-items:center;gap:10px;flex:none;padding-top:6px}
.dm-count{font-size:12.5px;color:var(--ink-3);font-variant-numeric:tabular-nums}
.dm-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 0 12px;border-bottom:1px solid var(--line);margin-top:4px}
.dm-toolbar .dm-count{margin-left:auto}
.dm-seg{display:inline-flex;background:#f0f0f0;border-radius:8px;padding:3px;gap:2px}
.dm-seg-btn{appearance:none;border:0;background:transparent;font:inherit;font-size:12.5px;color:var(--ink-2);padding:6px 14px;border-radius:8px;cursor:pointer;transition:background .15s,color .15s;white-space:nowrap}
.dm-seg-btn:hover:not(.is-on){color:var(--ink)}
.dm-seg-btn.is-on{background:var(--ink);color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.dm-seg-btn:disabled{opacity:.5;cursor:default}
.dm-search{flex:1;min-width:220px;box-sizing:border-box;background:var(--bg-2);border-radius:8px;padding:10px 14px;border:1px solid transparent;font:inherit;font-size:13px;color:var(--ink);outline:none}
.dm-search::placeholder{color:var(--ink-3)}
.dm-search:focus{border-color:#000;background:#fff;box-shadow:0 0 0 3px rgba(0,0,0,.10)}
.dm-chips{display:flex;gap:8px;overflow-x:auto;padding:10px 0 2px;scrollbar-width:none}
.dm-chips::-webkit-scrollbar{display:none}
.dm-chip{white-space:nowrap;font:inherit;font-size:12.5px;padding:6px 12px;border-radius:7px;border:1px solid var(--line);color:var(--ink-2);background:#fff;cursor:pointer}
.dm-chip:hover{color:var(--ink)}
.dm-chip.is-on{background:var(--ink);border-color:var(--ink);color:#fff;font-weight:600}
.dm-body{flex:1;min-height:0;overflow:auto}
.dm-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(24px,2vw,40px) clamp(20px,1.8vw,36px);padding:26px clamp(20px,3.2vw,64px) 80px}
@media (max-width:1180px){.dm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:720px){.dm-grid{grid-template-columns:1fr}}
@media (min-width:1440px){.dm-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (min-width:1900px){.dm-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}
.dm-card{display:flex;flex-direction:column;cursor:pointer;min-width:0;background:transparent;border:0;container-type:inline-size}
.dm-card-art{transition:box-shadow .2s,transform .2s,border-color .2s;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff}
.dm-card:hover .dm-card-art{box-shadow:var(--shadow);transform:translateY(-2px);border-color:#dcdcdf}
.dm-card:focus-visible{outline:2px solid #000;outline-offset:3px}
.dm-card-art{position:relative;aspect-ratio:16/10}
.dm-card-body{padding:15px 2px 0}
.dm-card-title{font-size:16.5px;font-weight:600;letter-spacing:-.01em;margin:0}
.dm-card-meta{font-size:12px;color:var(--ink-3);margin-left:8px;font-weight:400}
.dm-card-head{display:flex;align-items:baseline;gap:2px}
.dm-card-kw{font-size:12.5px;color:var(--ink-3);margin:3px 0 0}
.dm-card-desc{font-size:13px;line-height:1.62;color:var(--ink-2);margin:9px 0 0;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:4;line-clamp:4;min-height:calc(1.62em * 3)}
@container (min-width:340px){.dm-card-desc{-webkit-line-clamp:3;line-clamp:3}}
@container (min-width:460px){.dm-card-desc{-webkit-line-clamp:2;line-clamp:2}}
.dm-card-foot{display:flex;align-items:center;justify-content:space-between}
.dm-dots{display:flex;gap:5px;margin-top:12px}
.dm-dot{width:13px;height:13px;border-radius:4px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.10)}
.dm-card-go{font-size:12px;color:var(--ink-3);opacity:0;transition:opacity .15s}
.dm-card:hover .dm-card-go,.dm-card:focus-visible .dm-card-go{opacity:1;color:var(--ink)}
.dm-art{container-type:inline-size;width:100%;height:100%}
.dm-art.is-clip{position:absolute;inset:0}
.dm-art.is-clip a{pointer-events:none}
.dm-detail-grid{scroll-behavior:smooth}
.dm-ghost{font:inherit;font-size:12.5px;padding:7px 13px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink-2);cursor:pointer}
.dm-ghost:hover{color:var(--ink);border-color:#d4d4d6}
.dm-primary{width:100%;margin-top:12px;padding:10px 0;border:0;border-radius:8px;background:var(--accent);color:#fff;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.dm-primary:disabled{opacity:.55;cursor:default}
.dm-empty{padding:40px 0 80px;color:var(--ink-3);font-size:13px;line-height:1.7}
.dm-note{color:var(--ink-3);opacity:.85}
.dm-toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);max-width:min(460px,82%);padding:10px 16px;border-radius:8px;background:#1e1e1e;color:#fff;font-size:12.5px;line-height:1.5;box-shadow:0 10px 30px rgba(0,0,0,.28);z-index:30}
.dm-detail{display:flex;flex-direction:column;height:100%;min-height:0}
.dm-detail-top{flex:none;padding:16px clamp(20px,3.2vw,64px) 0}
.dm-detail-head{flex:none;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:10px clamp(20px,3.2vw,64px) 14px;border-bottom:1px solid var(--line)}
.dm-detail-head-l{display:flex;align-items:flex-end;gap:14px;min-width:0;flex-wrap:wrap}
.dm-detail-title-wrap{display:flex;align-items:baseline;flex-wrap:wrap}
.dm-seg-themed{background:#f0f0f0}
.dm-back{padding:6px 13px;border-radius:8px;font-size:12.5px}
.dm-detail-title{margin:0;font-size:clamp(24px,2.1vw,32px);letter-spacing:-.03em;font-weight:700}

.dm-detail-cat{margin:8px 0 0;font-size:13px;color:var(--ink-3)}
.dm-detail-head-r{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
.dm-theme{display:inline-flex;background:#f0f0f0;border-radius:8px;padding:3px;gap:2px}
.dm-theme .dm-seg-btn{font-size:12px;padding:5px 12px;border-radius:7px}
.dm-theme .dm-seg-btn.is-on{box-shadow:0 1px 2px rgba(0,0,0,.16)}
.dm-note-inline{font-size:11.5px;color:var(--ink-3);max-width:230px;line-height:1.45}
.dm-source{font-size:12.5px;color:var(--ink-2);text-decoration:none;border-bottom:1px solid var(--line);padding-bottom:1px}
.dm-source:hover{color:var(--ink)}
.dm-detail-grid{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1fr) clamp(340px,24vw,460px);gap:clamp(24px,2vw,40px);align-items:start;padding:22px clamp(20px,3.2vw,64px) 70px}
.dm-left{min-width:0;display:flex;flex-direction:column}
.dm-preview{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.dm-preview.is-slides,.dm-preview.is-poster{background:transparent;border:0;box-shadow:none}
.dm-preview.is-slides .dm-art{aspect-ratio:16/9;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff}
.dm-preview.is-poster .dm-art{aspect-ratio:4/5;max-width:440px;margin:0 auto;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.dm-preview-cap{font-size:11.5px;color:var(--ink-3);margin-top:10px;display:flex;justify-content:space-between;gap:10px}
.dm-right{display:flex;flex-direction:column;gap:14px;min-width:0}
.dm-card2{border:1px solid var(--line);border-radius:10px;padding:20px 22px;background:#fff}
.dm-card2 h3{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);font-weight:600;margin:0 0 12px}
.dm-form{border-color:#dcdce2}
.dm-form h3{font-size:14px;letter-spacing:-.01em;text-transform:none;color:var(--ink)}
.dm-form-hint{margin:0 0 4px;font-size:12px;color:var(--ink-3);line-height:1.55}
.dm-label{font-size:11px;color:var(--ink-3);margin:12px 0 6px;letter-spacing:.04em}
.dm-seg-form{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;background:transparent;padding:0}
.dm-seg-form .dm-seg-btn{border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink-2);padding:8px 0;text-align:center;font-size:12px}
.dm-seg-form .dm-seg-btn.is-on{background:var(--ink);border-color:var(--ink);color:#fff;box-shadow:none}
.dm-textarea{width:100%;box-sizing:border-box;min-height:84px;resize:vertical;border:1px solid var(--line);border-radius:10px;padding:9px 11px;font:inherit;font-size:12.5px;line-height:1.6;outline:none;color:var(--ink);background:#fff}
.dm-textarea:focus{border-color:#c9c9cf}
.dm-check{display:flex;align-items:flex-start;gap:7px;margin:12px 0 0;font-size:12px;line-height:1.55;color:var(--ink-2);cursor:pointer}
.dm-check input{margin:2px 0 0;flex:none}
.dm-form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.dm-form-row .dm-ghost{border-radius:8px;font-size:12px;padding:9px 0;text-align:center}
.dm-chars{margin-top:10px;font-size:11.5px;color:var(--ink-3);text-align:center}
.dm-back-chat{width:100%;margin-top:8px;border-radius:8px;font-size:12px;padding:9px 0;text-align:center}
.dm-lead{margin:0 0 8px;font-size:13px;line-height:1.7;color:var(--ink)}
.dm-lead.is-dim{color:var(--ink-2)}
.dm-kv{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.dm-kv-cap{font-size:11.5px;color:var(--ink-3);margin:10px 0 2px;letter-spacing:.04em}
.dm-tag{font:inherit;font-size:11.5px;padding:4px 10px;border:0;border-radius:6px;background:#f5f5f5;color:var(--ink-2)}
.dm-tag-ok{background:#f0f0f0;color:#1e1e1e}
.dm-tag-flat{background:transparent;padding:0;color:var(--ink-3)}
.dm-swatches{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dm-swatch{display:grid;grid-template-columns:20px 1fr;grid-template-rows:auto auto;column-gap:8px;align-items:center;padding:0;border:0;background:transparent;text-align:left;cursor:pointer}
.dm-swatch-chip{width:20px;height:20px;border-radius:6px;grid-row:1 / span 2;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
.dm-swatch-name{font-size:11.5px;font-weight:500;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-swatch-hex{font-size:10.5px;color:var(--ink-3);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.dm-spec{display:flex;flex-direction:column;margin-bottom:6px}
.dm-spec-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--line-2);font-size:12.5px}
.dm-spec-label{color:var(--ink-3)}
.dm-spec-value{color:var(--ink);text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-types{display:flex;flex-direction:column;margin-top:12px}
.dm-type-row{display:flex;align-items:center;gap:12px;padding:6px 0;border-bottom:1px solid var(--line-2)}
.dm-type-sample{width:44px;flex:none;line-height:1;color:var(--ink)}
.dm-type-token{font-size:11.5px;color:var(--ink-2);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-type-spec{font-size:10.5px;color:var(--ink-3);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:nowrap}
.dm-scale{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0 4px}
.dm-scale-row{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:var(--ink-3);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.dm-scale-name{min-width:0}
.dm-scale-bar{display:inline-block;height:10px;border-radius:2px}
.dm-scale-val{color:var(--ink-3)}
.dm-shapes{display:flex;flex-wrap:wrap;gap:14px;margin-top:6px}
.dm-shape{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;color:var(--ink-3)}
.dm-shape-box{width:16px;height:16px;display:block;background:#fff;box-shadow:inset 0 0 0 1.5px #c9c9cf}
.dm-shape-label{font-size:10px;color:var(--ink-3);font-variant-numeric:tabular-nums}
.dm-demo{display:flex;flex-direction:column;gap:10px;border:1px solid var(--line);border-radius:12px;padding:14px}
.dm-demo-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.dm-modal{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:28px;background:rgba(0,0,0,.45)}
.dm-modal-card{width:min(860px,100%);max-height:84vh;display:flex;flex-direction:column;border-radius:14px;background:#fff;border:1px solid var(--line);overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.32)}
.dm-modal-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid var(--line);font-size:12.5px;color:var(--ink-3)}
.dm-modal-actions{display:flex;gap:8px}
.dm-modal-body{flex:1;min-height:0;overflow:auto;margin:0;padding:16px 18px 22px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.7;color:var(--ink);white-space:pre-wrap;word-break:break-word;overscroll-behavior:contain}
@media (max-width:1080px){.dm-detail-grid{grid-template-columns:minmax(0,1fr)}.dm-form{order:-1}}
@media (max-width:720px){.dm-seg-form{grid-template-columns:1fr 1fr}}
`

    /* -------------------------------------------------------------- apply */

    function apply(ctx) {
      runtime.ctx = ctx
      try {
        // Clicking the sidebar row while the panel already shows a style must return to the grid;
        // the host only re-selects the panel and no state change reaches us, so catch the click here.
        const onEntryClick = (event) => {
          const row = event.target && event.target.closest ? event.target.closest('button') : null
          if (row && row.querySelector('[data-dm-entry="design-md"]')) requestListView()
        }
        document.addEventListener('click', onEntryClick, true)
        ctx.effect(() => () => document.removeEventListener('click', onEntryClick, true), 'design-md entry click')

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
        locale: 'design-md',
      }, (props) => h(PanelIcon, { size: props?.size })))

      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        locale: 'design-md',
      }, () => h(Panel)))
    }

    return { name: 'dsh-design-md', inject: ['slots', 'locale', 'layout'], apply }
  },
})
