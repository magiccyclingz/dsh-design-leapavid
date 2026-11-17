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

    /* ------------------------------------------------------------ strings */

    const STRINGS = {
      zh: {
        title: '设计风格库',
        subtitle: '84 套品牌设计语言 · 网页 / 幻灯片 / 海报实时渲染',
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
        subtitle: '84 brand design languages · web, slides and posters, rendered live',
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
      const display = v.displayStack || 'system-ui, sans-serif'
      const body = v.bodyStack || display
      const mono = v.monoFamily && v.monoFamily !== '—' ? v.monoFamily : 'ui-monospace, SFMono-Regular, Menlo, monospace'
      const maxStep = Math.max(...types.map((s) => Number.parseFloat(s.fontSize) || 16), 16)
      const rCard = radiusCss(U, v.radiusCard)
      const rBtn = radiusCss(U, v.radiusButton)
      const rPill = radiusCss(U, v.radiusPill)

      const sectionHead = (index, en, zh) => `
        <div style="display:flex;align-items:baseline;gap:${U(10)};margin-bottom:${U(18)}">
          <span style="font-size:${U(10)};line-height:${1};font-family:${mono};letter-spacing:.18em;text-transform:uppercase;color:${th.muted}">${String(index).padStart(2, '0')} / ${en}</span>
        </div>
        <div style="font-family:${display};font-weight:${v.displayWeight || 600};font-size:${U(19)};line-height:1.25;color:${th.ink};margin-bottom:${U(16)}">${zh}</div>`

      const section = (index, en, zh, inner) => `
        <section style="border-top:1px solid ${th.line};padding:${U(30)} 0">
          ${sectionHead(index, en, zh)}
          ${inner}
        </section>`

      const colorCells = colors.map((c) => `
        <div style="border:1px solid ${th.line};border-radius:${U(6)};overflow:hidden;background:${th.bg}">
          <div style="height:${U(46)};background:${c.hex}"></div>
          <div style="padding:${U(7)} ${U(8)}">
            <div style="font-size:${U(9.5)};line-height:${1.3};font-family:${mono};color:${th.ink}">${esc(c.name || 'token')}</div>
            <div style="font-size:${U(8.5)};line-height:${1.3};font-family:${mono};color:${th.muted}">${esc(c.hex)}</div>
          </div>
        </div>`).join('')

      const typeRows = types.map((s, i) => {
        const size = Number.parseFloat(s.fontSize) || 16
        const weight = Number.parseInt(s.fontWeight, 10) || 400
        const lh = Number.parseFloat(s.lineHeight) || 1.2
        const ls = Number.parseFloat(s.letterSpacing) || 0
        const scaled = clamp((size / maxStep) * 26, 8, 26)
        const family = s.token && /mono|code|num/i.test(s.token) ? mono : display
        return `
          <div style="display:flex;align-items:center;gap:${U(14)};padding:${U(7)} 0;border-bottom:1px solid ${th.line}">
            <span style="flex:none;width:${U(22)};font-size:${U(11)};line-height:1;font-family:${display};color:${th.muted}">Aa</span>
            <span style="flex:1;min-width:0;font-family:${family};font-weight:${weight};letter-spacing:${U(ls)};font-size:${U(scaled)};line-height:${lh};color:${th.ink};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t('typeSample'))}</span>
            <span style="flex:none;font-size:${U(8.5)};line-height:1.4;font-family:${mono};color:${th.muted};text-align:right">${s.token || `step-${i + 1}`}<br>${Math.round(size)}px / ${weight} / ${lh.toFixed(2)}</span>
          </div>`
      }).join('')

      const buttons = `
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:${U(10)}">
          <span style="background:${th.accent};color:${th.accentInk};border-radius:${rBtn};padding:${U(9)} ${U(16)};font-size:${U(11)};line-height:1.2;font-weight:600;font-family:${body}">${esc(t('demoBtn'))}</span>
          <span style="background:${th.ink};color:${th.bg};border-radius:${rBtn};padding:${U(9)} ${U(16)};font-size:${U(11)};line-height:1.2;font-weight:600;font-family:${body}">${esc(t('demoBtn2'))}</span>
          <span style="border:1px solid ${th.ink};color:${th.ink};border-radius:${rBtn};padding:${U(9)} ${U(16)};font-size:${U(11)};line-height:1.2;font-weight:500;font-family:${body}">${esc(t('demoBtn3'))}</span>
          <span style="border:1px solid ${th.line};color:${th.muted};border-radius:${rPill};padding:${U(7)} ${U(12)};font-size:${U(10)};line-height:1.2;font-weight:500;font-family:${body}">pill</span>
        </div>`

      const cards = d.cards.map((label, i) => `
        <div style="border:1px solid ${th.line};border-radius:${rCard};overflow:hidden;background:${th.bg}">
          <div style="height:${U(70)};background:linear-gradient(135deg, ${th.accent}, ${th.surface})"></div>
          <div style="padding:${U(10)} ${U(12)} ${U(13)}">
            <div style="font-size:${U(11)};line-height:1.3;font-weight:600;font-family:${body};color:${th.ink}">${esc(label)}</div>
            <div style="margin-top:${U(4)};font-size:${U(9)};line-height:1.5;font-family:${body};color:${th.muted}">${esc(t('cardBody'))}</div>
          </div>
        </div>`).join('')

      const forms = `
        <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:${U(10)}">
          <div style="border:1px solid ${th.line};border-radius:${rBtn};padding:${U(9)} ${U(11)};font-size:${U(10)};line-height:1.3;font-family:${body};color:${th.muted}">name@example.com</div>
          <div style="border:1px solid ${th.line};border-radius:${rBtn};padding:${U(9)} ${U(11)};font-size:${U(10)};line-height:1.3;font-family:${body};color:${th.muted};display:flex;justify-content:space-between">Select an option <span>▾</span></div>
          <div style="grid-column:1/-1;border:1px solid ${th.line};border-radius:${rBtn};padding:${U(10)} ${U(11)};font-size:${U(10)};line-height:1.5;font-family:${body};color:${th.muted};min-height:${U(46)}">Multi-line message…</div>
          <label style="grid-column:1/-1;display:flex;align-items:center;gap:${U(7)};font-size:${U(9.5)};line-height:1.3;font-family:${body};color:${th.muted}">
            <span style="width:${U(11)};height:${U(11)};border:1px solid ${th.line};border-radius:${U(3)};display:inline-block"></span>${esc(t('demoCheck'))}
          </label>
        </div>`

      const barFor = (index) => clamp(8 + index * 9, 8, 82)
      const spaceRows = spaces.map((s, i) => {
        const value = Number.parseFloat(s.value) || 0
        return `
          <div style="display:grid;grid-template-columns:${U(52)} 1fr ${U(44)};align-items:center;gap:${U(10)};padding:${U(3)} 0">
            <span style="font-size:${U(9)};line-height:1.3;font-family:${mono};color:${th.muted}">${esc(s.name || `space-${i}`)}</span>
            <span style="height:${U(5)};background:${alpha(th.accent, 0.85)};border-radius:2px;width:${barFor(i)}%"></span>
            <span style="font-size:${U(9)};line-height:1.3;font-family:${mono};color:${th.ink};text-align:right">${Math.round(value)}px</span>
          </div>`
      }).join('')

      const radiusCells = radii.map((r, i) => {
        const value = Number.parseFloat(r.value) || 0
        const radius = value >= 999 ? '9999px' : U(Math.min(value, 40))
        return `
          <div style="text-align:center">
            <div style="height:${U(40)};border:1px solid ${th.line};border-radius:${radius};background:${th.surface}"></div>
            <div style="margin-top:${U(5)};font-size:${U(8.5)};line-height:1.3;font-family:${mono};color:${th.muted}">${esc(r.name || `r-${i + 1}`)} · ${Math.round(value)}px</div>
          </div>`
      }).join('')

      const elevation = [0.06, 0.12, 0.2].map((strength, i) => `
        <div style="border:1px solid ${th.line};border-radius:${rCard};background:${th.bg};padding:${U(12)};box-shadow:0 ${U(2 + i * 2)} ${U(8 + i * 8)} ${alpha(th.ink, strength)}">
          <div style="font-size:${U(9)};line-height:1.4;font-family:${mono};color:${th.muted}">elevation ${i + 1}</div>
        </div>`).join('')

      return `
        <div style="background:${th.bg};color:${th.ink};font-family:${body};padding:0 ${U(40)} ${U(28)}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:${U(16)};padding:${U(16)} 0;border-bottom:1px solid ${th.line}">
            <div style="display:flex;align-items:center;gap:${U(9)}">
              <span style="width:${U(16)};height:${U(16)};border-radius:${U(4)};background:${th.accent}"></span>
              <span style="font-size:${U(11.5)};line-height:1;font-weight:600;font-family:${body};color:${th.ink}">${esc(d.brand)}</span>
            </div>
            <div style="display:flex;gap:${U(16)};font-size:${U(9.5)};line-height:1;font-family:${body};color:${th.muted}">
              ${navLinks.map((l) => `<span>${l}</span>`).join('')}
            </div>
            <span style="background:${th.accent};color:${th.accentInk};border-radius:${rPill};padding:${U(7)} ${U(13)};font-size:${U(9.5)};line-height:1;font-weight:600;font-family:${body}">Design System</span>
          </div>

          <div style="text-align:center;padding:${U(52)} 0 ${U(40)}">
            <div style="font-family:${display};font-weight:${v.displayWeight || 600};letter-spacing:${U(v.displayTracking || 0)};
              font-size:min(${U(clamp((v.displaySize || 56) * 1.15, 34, 88))}, ${U(96)});line-height:1.05;color:${th.ink}">
              Design System<br>Inspired by <span style="color:${th.accent}">${esc(d.brand)}</span>
            </div>
            <div style="margin:${U(14)} auto 0;max-width:${U(420)};font-size:${U(10.5)};line-height:1.7;font-family:${body};color:${th.muted}">${esc(d.tagline)}</div>
            <div style="margin-top:${U(18)};display:flex;justify-content:center;gap:${U(9)}">
              <span style="background:${th.accent};color:${th.accentInk};border-radius:${rBtn};padding:${U(8)} ${U(14)};font-size:${U(9.5)};line-height:1.1;font-weight:600;font-family:${body}">Open DESIGN.md</span>
              <span style="border:1px solid ${th.line};color:${th.ink};border-radius:${rBtn};padding:${U(8)} ${U(14)};font-size:${U(9.5)};line-height:1.1;font-weight:500;font-family:${body}">Dark Preview</span>
            </div>
          </div>

          ${section(1, 'COLORS', t('palette'), `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:${U(10)}">${colorCells}</div>`)}
          ${section(2, 'TYPOGRAPHY', t('typography'), typeRows)}
          ${section(3, 'BUTTONS', t('demoBtn'), buttons)}
          ${section(4, 'CARDS', t('components'), `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${U(12)}">${cards}</div>`)}
          ${section(5, 'FORMS', t('requirement'), forms)}
          ${section(6, 'SPACING', t('spaceBase'), spaceRows)}
          ${section(7, 'RADIUS', t('radiusCard'), `<div style="display:grid;grid-template-columns:repeat(${Math.max(radii.length, 1)},minmax(0,1fr));gap:${U(10)}">${radiusCells}</div>`)}
          ${section(8, 'ELEVATION', 'Elevation', `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${U(12)}">${elevation}</div>`)}

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
      const display = v.displayStack || 'system-ui, sans-serif'
      const body = v.bodyStack || display
      const title = clamp((v.displaySize || 56) * 1.55, 30, 68)
      return `
        <div style="position:relative;height:100%;background:${th.bg};color:${th.ink};font-family:${body};overflow:hidden">
          <div style="position:absolute;left:0;top:0;bottom:0;width:${US(5)};background:${th.accent}"></div>
          <div style="position:absolute;right:${US(-14)};top:${US(-30)};font-family:${display};font-weight:${v.displayWeight || 600};
            font-size:${US(260)};line-height:1;color:${alpha(th.ink, 0.07)}">01</div>
          <div style="position:relative;height:100%;box-sizing:border-box;padding:${US(30)} ${US(48)} ${US(26)} ${US(56)};display:flex;flex-direction:column">
            <div style="display:flex;justify-content:space-between;font-size:${US(9.5)};line-height:1.3;font-family:${body};letter-spacing:.14em;text-transform:uppercase;color:${th.muted}">
              <span>${esc(d.kicker)} / ${esc(t('previewSketch'))}</span>
            </div>
            <div style="flex:1;display:grid;grid-template-columns:1.15fr .85fr;gap:${US(36)};align-items:center">
              <div style="display:flex;flex-direction:column;justify-content:center;min-width:0">
                <div style="font-family:${display};font-weight:${v.displayWeight || 600};letter-spacing:${US(v.displayTracking || 0)};
                  font-size:${US(title)};line-height:1.02">${esc(d.brand)}</div>
                <div style="width:${US(64)};height:${US(3)};background:${th.accent};margin:${US(20)} 0 ${US(12)}"></div>
                <div style="font-size:${US(11)};line-height:1.6;font-family:${body};color:${th.muted};max-width:${US(430)}">${esc(d.tagline)}</div>
                <div style="margin-top:${US(18)};display:flex;flex-direction:column;gap:${US(9)}">
                  ${d.bullets.map((b) => `<div style="display:flex;align-items:center;gap:${US(9)};font-size:${US(12.5)};line-height:1.4;font-family:${body};color:${th.ink}">
                    <span style="width:${US(5)};height:${US(5)};border-radius:9999px;background:${th.accent};flex:none"></span>${esc(b)}</div>`).join('')}
                </div>
              </div>
              <div style="position:relative;aspect-ratio:4/3;border-radius:${US(6)};overflow:hidden;border:1px solid ${alpha(th.ink, 0.12)};
                background:linear-gradient(135deg, ${th.accent}, ${mix(th.accent, th.ink, 0.62)})">
                <div style="position:absolute;inset:0;background:linear-gradient(180deg, transparent 45%, ${alpha(th.ink, 0.22)})"></div>
                <div style="position:absolute;left:${US(16)};bottom:${US(14)};font-size:${US(9)};letter-spacing:.16em;text-transform:uppercase;font-family:${body};color:${alpha(th.ink, 0.72)}">visual</div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:${US(8.5)};line-height:1.3;font-family:${v.monoFamily || body};color:${th.muted}">
              <span>${esc(d.brand)} · Design System</span><span>01 / 08 · getdesign.md</span>
            </div>
          </div>
        </div>`
    }

    function posterHtml(style, mode) {
      const v = style.visual
      const base = themeOf(style, mode)
      // Posters invert a light brand (paper poster) and keep a dark brand dark.
      const th = v.darkFirst ? base : {
        bg: base.ink,
        ink: base.bg,
        muted: mix(base.bg, base.ink, 0.42),
        line: alpha(base.bg, 0.22),
        accent: base.accent,
        dark: luminance(base.ink) < 0.5,
      }
      const d = deckOf(style)
      const display = v.displayStack || 'system-ui, sans-serif'
      const body = v.bodyStack || display
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

    function Art({ style, mode, surface, clip }) {
      const spec = ART_BUILDERS[surface] || ART_BUILDERS.page
      const html = useMemo(() => spec.build(style, mode), [spec, style, mode])
      return h('div', {
        className: `dm-art ${spec.cls}${clip ? ' is-clip' : ''}`,
        style: { '--dm-art-bg': themeOf(style, mode).bg },
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
      h('div', { className: 'dm-card-art' }, h(Art, { style, mode, surface, clip: true })),
      h('div', { className: 'dm-card-body' },
        h('div', { className: 'dm-card-title' }, style.nameZh || style.displayName),
        h('div', { className: 'dm-card-meta' }, meta),
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
        h('div', { className: 'dm-detail-head' },
          h('div', { className: 'dm-detail-head-l' },
            h('button', { type: 'button', className: 'dm-ghost dm-back', onClick: onBack }, `← ${t('back')}`),
            h('div', { className: 'dm-detail-title-wrap' },
              h('h2', { className: 'dm-detail-title' }, style.nameZh || style.displayName),
              style.nameZh && style.nameZh !== style.displayName ? h('span', { className: 'dm-detail-name' }, style.displayName) : null,
              h('span', { className: 'dm-detail-cat' }, style.category),
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
            style.darkFirst && surface === 'page'
              ? h('span', { className: 'dm-note-inline' }, t('brandDark'))
              : h('div', { className: 'dm-seg dm-seg-themed' },
                ...['light', 'dark'].map((key) => h('button', {
                  key,
                  type: 'button',
                  className: `dm-seg-btn${mode === key ? ' is-on' : ''}`,
                  'aria-pressed': mode === key,
                  disabled: surface !== 'page',
                  onClick: () => setMode(key),
                }, t(`themes.${key}`))),
              ),
            h('a', {
              className: 'dm-source',
              href: style.sourceUrl || '#',
              target: '_blank',
              rel: 'noreferrer',
            }, `${t('source')} getdesign.md`),
          ),
        ),

        h('div', { className: 'dm-detail-grid', ref: gridRef },
          h('div', { className: 'dm-left' },
            h('div', { className: 'dm-preview' + (surface === 'page' ? ' is-page' : surface === 'poster' ? ' is-poster' : ' is-slides') },
              h(Art, { style, mode: surface === 'page' ? mode : 'light', surface }),
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
                specRow('Tracking', `${v.displayTracking || 0}px`),
                specRow('Leading', `${v.displayLineHeight || 1.2}`),
              ),
              h('div', { className: 'dm-types' },
                ...types.slice(0, 8).map((s, i) => {
                  const size = Number.parseFloat(s.fontSize) || 16
                  const weight = Number.parseInt(s.fontWeight, 10) || 400
                  const lh = Number.parseFloat(s.lineHeight) || 1.2
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
              catalog ? h('span', { className: 'dm-count' }, filtered.length === catalog.count ? String(catalog.count) : `${filtered.length} / ${catalog.count}`) : null,
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
            h('input', {
              className: 'dm-search',
              value: query,
              placeholder: t('search'),
              'aria-label': t('search'),
              onChange: (event) => setQuery(event.target.value),
            }),
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
      },
      h('rect', { x: 3.2, y: 3.2, width: 17.6, height: 17.6, rx: 5.2, stroke: 'currentColor', strokeWidth: 1.5 }),
      h('path', { d: 'M7.6 15.4 10.9 8l3.3 7.4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('path', { d: 'M8.6 13h4.6', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('circle', { cx: 16.4, cy: 16.2, r: 1.55, fill: 'currentColor' }),
      )
    }

    /* ---------------------------------------------------------------- css */

    const CSS = `
.dm-panel{position:relative;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);--dm-line:var(--dsw-alias-border-l1);--dm-soft:var(--dsw-alias-bg-layer-1);--dm-soft2:var(--dsw-alias-bg-layer-2);--dm-ink:var(--dsw-alias-label-primary);--dm-dim:var(--dsw-alias-label-secondary);--dm-accent:var(--dsw-alias-label-primary);--dm-on-accent:var(--dsw-alias-bg-base)}
.dm-head{flex:none;display:flex;flex-direction:column;gap:16px;padding:30px clamp(24px,3.2vw,64px) 14px}
.dm-head-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.dm-eyebrow{font-size:11.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--dm-dim);margin-bottom:10px}
.dm-h1{margin:0;font-size:clamp(28px,2.9vw,46px);font-weight:700;letter-spacing:-.032em;line-height:1.08}
.dm-sub{margin:8px 0 0;font-size:14px;line-height:1.6;color:var(--dm-dim);max-width:72ch}
.dm-head-right{display:flex;align-items:center;gap:10px;flex:none}
.dm-count{font-size:12.5px;font-variant-numeric:tabular-nums;color:var(--dm-dim);border:1px solid var(--dm-line);border-radius:7px;padding:3px 9px}
.dm-toolbar{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.dm-seg{display:inline-flex;gap:2px;padding:3px;border-radius:9px;background:var(--dm-soft2);flex:none}
.dm-seg-btn{appearance:none;border:0;background:transparent;color:var(--dm-dim);font:inherit;font-size:13px;padding:6px 15px;border-radius:7px;cursor:pointer;white-space:nowrap}
.dm-seg-btn:hover:not(:disabled){color:var(--dm-ink)}
.dm-seg-btn.is-on{background:var(--dsw-alias-bg-base);color:var(--dm-ink);box-shadow:0 1px 2px rgba(0,0,0,.14)}
.dm-seg-btn:disabled{opacity:.45;cursor:default}
.dm-seg-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-self:stretch;background:var(--dm-soft2)}
.dm-seg-form .dm-seg-btn{text-align:center}
.dm-search{flex:1;min-width:200px;box-sizing:border-box;padding:10px 14px;font-size:13.5px;border-radius:8px;border:1px solid transparent;background:var(--dm-soft);color:var(--dm-ink);outline:none}
.dm-search::placeholder{color:var(--dm-dim)}
.dm-search:focus{background:var(--dsw-alias-bg-base);border-color:var(--dm-ink);box-shadow:0 0 0 3px rgba(127,127,127,.16)}
.dm-chips{display:flex;gap:7px;flex-wrap:wrap;padding:4px clamp(24px,3.2vw,64px) 16px}
.dm-chip{appearance:none;border:1px solid var(--dm-line);background:transparent;color:var(--dm-dim);font:inherit;font-size:12.5px;padding:5px 12px;border-radius:7px;cursor:pointer;white-space:nowrap}
.dm-chip:hover{color:var(--dm-ink);border-color:var(--dm-dim)}
.dm-chip.is-on{background:var(--dm-accent);color:var(--dm-on-accent);border-color:var(--dm-accent)}
.dm-body{flex:1;min-height:0;overflow:auto;padding:22px clamp(24px,3.2vw,64px) 64px}
.dm-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(26px,2vw,42px) clamp(20px,1.8vw,34px)}
@media (min-width:1500px){.dm-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (min-width:1900px){.dm-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}
@media (max-width:900px){.dm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:620px){.dm-grid{grid-template-columns:1fr}}
.dm-card{display:flex;flex-direction:column;border:1px solid var(--dm-line);border-radius:10px;background:var(--dsw-alias-bg-base);overflow:hidden;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}
.dm-card:hover{border-color:var(--dm-dim);box-shadow:0 6px 24px rgba(0,0,0,.10)}
.dm-card:focus-visible{outline:2px solid var(--dm-ink);outline-offset:3px}
.dm-card-art{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--dm-soft2);border-bottom:1px solid var(--dm-line)}
.dm-card-body{display:flex;flex-direction:column;gap:5px;padding:15px 16px 14px}
.dm-card-title{font-size:15px;font-weight:600;letter-spacing:-.015em}
.dm-card-meta{font-size:12.5px;color:var(--dm-dim)}
.dm-card-kw{font-size:12px;color:var(--dm-dim);opacity:.9}
.dm-card-desc{margin:5px 0 0;font-size:12.5px;line-height:1.66;color:var(--dm-dim);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;min-height:calc(1.62em * 3)}
.dm-card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
.dm-dots{display:flex;gap:5px}
.dm-dot{width:10px;height:10px;border-radius:9999px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.10)}
.dm-card-go{font-size:12px;color:var(--dm-dim);opacity:0;transition:opacity .15s ease}
.dm-card:hover .dm-card-go,.dm-card:focus-visible .dm-card-go{opacity:1;color:var(--dm-ink)}
.dm-art{container-type:inline-size;width:100%;height:100%;overflow:hidden}
.dm-art.is-clip{position:absolute;inset:0}
.dm-art.is-page{padding-top:0}
.dm-empty{padding:46px 4px;color:var(--dm-dim);font-size:12.5px;line-height:1.7}
.dm-note{color:var(--dm-dim);opacity:.8}
.dm-ghost{appearance:none;border:1px solid var(--dm-line);background:transparent;color:var(--dm-dim);font:inherit;font-size:12.5px;padding:7px 13px;border-radius:7px;cursor:pointer;white-space:nowrap}
.dm-ghost:hover{color:var(--dm-ink);border-color:var(--dm-dim)}
.dm-ghost:focus-visible,.dm-seg-btn:focus-visible,.dm-chip:focus-visible,.dm-primary:focus-visible,.dm-swatch:focus-visible{outline:2px solid var(--dm-ink);outline-offset:2px}
.dm-primary{appearance:none;border:0;border-radius:8px;padding:11px 14px;font:inherit;font-size:13.5px;font-weight:600;background:var(--dm-accent);color:var(--dm-on-accent);cursor:pointer}
.dm-primary:hover{filter:brightness(1.12)}
.dm-primary:disabled{opacity:.55;cursor:default}
.dm-toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);max-width:min(420px,80%);padding:9px 14px;border-radius:8px;background:var(--dm-accent);color:var(--dm-on-accent);font-size:12px;line-height:1.5;box-shadow:0 8px 28px rgba(0,0,0,.22);z-index:20}
.dm-detail{display:flex;flex-direction:column;height:100%;min-height:0}
.dm-detail-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px clamp(24px,3.2vw,64px) 14px;border-bottom:1px solid var(--dm-line)}
.dm-detail-head-l{display:flex;align-items:center;gap:12px;min-width:0}
.dm-detail-title-wrap{display:flex;align-items:baseline;gap:8px;min-width:0;flex-wrap:wrap}
.dm-detail-title{margin:0;font-size:clamp(24px,2.4vw,34px);font-weight:700;letter-spacing:-.032em}
.dm-detail-name{font-size:13px;color:var(--dm-dim)}
.dm-detail-cat{font-size:11.5px;color:var(--dm-dim);border:1px solid var(--dm-line);border-radius:6px;padding:2px 7px}
.dm-detail-head-r{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dm-seg-themed{margin-left:2px}
.dm-note-inline{font-size:11.5px;color:var(--dm-dim);max-width:220px;line-height:1.4}
.dm-source{font-size:11.5px;color:var(--dm-dim);text-decoration:none;border-bottom:1px solid var(--dm-line);padding-bottom:1px}
.dm-source:hover{color:var(--dm-ink)}
.dm-detail-grid{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1fr) clamp(330px,23vw,430px);gap:clamp(24px,2vw,40px);padding:24px clamp(24px,3.2vw,64px) 64px;align-items:start}
.dm-left{min-width:0;display:flex;flex-direction:column;gap:8px}
.dm-preview{border:1px solid var(--dm-line);border-radius:10px;overflow:hidden;background:var(--dm-soft2)}
.dm-preview.is-page .dm-art{height:auto}
.dm-preview.is-slides .dm-art{aspect-ratio:16/9;padding:0}
.dm-preview.is-slides,.dm-preview.is-poster{background:transparent}
.dm-preview.is-poster{border:0;background:transparent}
.dm-preview.is-poster .dm-art{aspect-ratio:4/5;max-width:440px;margin:0 auto;border:1px solid var(--dm-line);border-radius:8px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12)}
.dm-preview-cap{display:flex;justify-content:space-between;gap:12px;font-size:12px;color:var(--dm-dim);margin-top:2px}
.dm-right{display:flex;flex-direction:column;gap:14px;min-width:0}
.dm-card2{border:1px solid var(--dm-line);border-radius:10px;padding:18px 18px 17px;background:var(--dsw-alias-bg-base)}
.dm-card2 h3{margin:0 0 12px;font-size:13.5px;font-weight:600;letter-spacing:-.015em}
.dm-form h3{font-size:14.5px}
.dm-form-hint{margin:0 0 12px;font-size:12.5px;line-height:1.6;color:var(--dm-dim)}
.dm-label{margin:12px 0 7px;font-size:12px;color:var(--dm-dim)}
.dm-textarea{width:100%;box-sizing:border-box;resize:vertical;min-height:88px;padding:10px 12px;font:inherit;font-size:12.5px;line-height:1.6;border-radius:8px;border:1px solid var(--dm-line);background:var(--dm-soft);color:var(--dm-ink);outline:none}
.dm-textarea:focus{border-color:var(--dm-ink);background:var(--dsw-alias-bg-base)}
.dm-check{display:flex;align-items:flex-start;gap:8px;margin:12px 0 14px;font-size:12px;line-height:1.5;color:var(--dm-dim);cursor:pointer}
.dm-check input{margin:1px 0 0;flex:none}
.dm-form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.dm-chars{margin-top:8px;font-size:11px;color:var(--dm-dim)}
.dm-back-chat{margin-top:8px;grid-column:1/-1;width:100%}
.dm-lead{margin:0 0 10px;font-size:13px;line-height:1.72;color:var(--dm-ink)}
.dm-lead.is-dim{color:var(--dm-dim)}
.dm-kv{display:flex;flex-wrap:wrap;gap:6px}
.dm-kv-cap{margin:10px 0 6px;font-size:11.5px;color:var(--dm-dim)}
.dm-tag{display:inline-flex;align-items:center;padding:5px 10px;border-radius:6px;border:1px solid var(--dm-line);font-size:11.5px;color:var(--dm-dim);background:var(--dm-soft)}
.dm-tag-ok{border-color:transparent;background:var(--dm-soft2);color:var(--dm-ink)}
.dm-tag-flat{border-color:transparent;background:transparent;padding:0;color:var(--dm-dim)}
.dm-swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px}
.dm-swatch{display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:transparent;text-align:left;cursor:pointer}
.dm-swatch-chip{height:32px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
.dm-swatch-name{font-size:10.5px;color:var(--dm-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dm-swatch-hex{font-size:10px;color:var(--dm-dim);font-variant-numeric:tabular-nums}
.dm-spec{display:flex;flex-direction:column;gap:6px;margin-bottom:10px}
.dm-spec-row{display:flex;justify-content:space-between;gap:12px;font-size:12px}
.dm-spec-label{color:var(--dm-dim)}
.dm-spec-value{color:var(--dm-ink);text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-types{display:flex;flex-direction:column;border-top:1px solid var(--dm-line)}
.dm-type-row{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--dm-line)}
.dm-type-sample{color:var(--dm-ink);line-height:1.1}
.dm-type-token{font-size:11.5px;color:var(--dm-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-type-spec{font-size:10px;color:var(--dm-dim);font-variant-numeric:tabular-nums;white-space:nowrap}
.dm-scale{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.dm-scale-row{display:grid;grid-template-columns:52px 1fr 40px;align-items:center;gap:8px;font-size:10.5px;color:var(--dm-dim)}
.dm-scale-bar{height:5px;border-radius:3px;opacity:.85}
.dm-scale-val{text-align:right;font-variant-numeric:tabular-nums;color:var(--dm-ink)}
.dm-shapes{display:flex;gap:14px}
.dm-shape{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:10px;color:var(--dm-dim)}
.dm-shape-box{width:34px;height:34px;display:inline-block}
.dm-demo{display:flex;flex-direction:column;gap:9px;padding:12px}
.dm-demo-row{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.dm-modal{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:28px;background:rgba(0,0,0,.45)}
.dm-modal-card{width:min(860px,100%);max-height:84vh;display:flex;flex-direction:column;border-radius:12px;background:var(--dsw-alias-bg-base);border:1px solid var(--dm-line);overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.32)}
.dm-modal-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 14px;border-bottom:1px solid var(--dm-line);font-size:12px;color:var(--dm-dim)}
.dm-modal-actions{display:flex;gap:8px}
.dm-modal-body{flex:1;min-height:0;overflow:auto;margin:0;padding:14px 16px 20px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.65;color:var(--dm-ink);white-space:pre-wrap;word-break:break-word;overscroll-behavior:contain}
@media (max-width:1080px){.dm-detail-grid{grid-template-columns:minmax(0,1fr)}.dm-form{order:-1}}
@media (max-width:720px){.dm-head,.dm-detail-head{padding-left:18px;padding-right:18px}.dm-chips{padding-left:18px;padding-right:18px}.dm-body,.dm-detail-grid{padding-left:18px;padding-right:18px}.dm-seg-form{grid-template-columns:1fr 1fr}}
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
