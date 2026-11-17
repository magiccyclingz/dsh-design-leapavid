# OpenCode · OpenCode

OpenCode's marketing site is rendered entirely in Berkeley Mono — every word on the page, from the 38px hero headline down to the 14px footer fine print, sits in the same monospaced face. The visual identity comes from that single typographic decision: the page reads like a manpage or a static-site README, complete with bracketed `[+]` / `[-]` / `[x]` ASCII markers used in place of icons or bullets, and a wordmark…

- 画布 canvas `#fdfcfc` · 表面 surface `#f5f4f4` · 描边 `#e3e2e2`
- 文字 ink `#424245` · 次要 `#919092` · 强调 accent `#201d1d`（其上文字 `#ffffff`）
- 字体 display `Berkeley Mono` 700/0px · body `Berkeley Mono`
- 圆角 card 4px / button 4px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with finer 1/2/4px steps available for tight inline gaps).
- Tokens (front matter): spacing.xxs (1px) · spacing.xs (4px) · spacing.sm (8px) · spacing.md (12px) · spacing.lg…
- Universal section rhythm: every page in the set uses spacing.section (96px) as the vertical gap between major…
- Section internal padding: content rows inside a section sit at spacing.lg (16px) vertical with no horizontal…
- Max width: ~960px content column for body sections; the dark hero TUI mockup is full-bleed within an outer ~1100px…

## 形状
- ASCII block-pixel wordmark in the nav and hero TUI mockup.
- Inline ASCII charts inside the stat-block section — abstract sparse-line and dotted plots without specific data points.
- Avatar dots (~32px) inside testimonial rows on `/zen` — flat colored circles in rounded.full.

## 该做
- Render every text role in Berkeley Mono. The single-font decision is the entire identity.
- Keep colors.canvas (`#fdfcfc`) as the only body background. Don't introduce gray section bands.
- Use ASCII bracket markers (`[+]`, `[-]`, `[x]`, `+`, `−`) as bullets, toggles, and section glyphs. They are the brand's only iconography.
- Anchor the dark component.hero-tui-mockup exactly once per landing page as the hero centerpiece. Never use the dark surface for body content.

## 避免
- Reserve colors.accent (Apple Blue) and the rest of the semantic ramp for in-TUI states; marketing chrome stays monochrome.
- Use rounded.sm (4px) on every interactive element and rounded.none (0px) on every container.
- Stack content sections at spacing.section (96px) rhythm with only 1px colors.hairline rules between them.
- Don't introduce a sans-serif body font, a display face, or an italic style. Berkeley Mono carries everything.
