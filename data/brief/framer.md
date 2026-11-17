# Framer · Framer

Framer's marketing canvas is a near-pure black artboard. The dominant surface is `#090909` — almost pure black with a faint warmth — and on top of it sits oversized white display type set in GT Walsheim Medium with letter-spacing pulled to extreme negative values (-5.5px on the 110px display, -4.25px on the 85px hero). The page reads like a poster: one assertive statement per band, generous breathing…

- 画布 canvas `#090909` · 表面 surface `#161616` · 描边 `#2b2b2b`
- 文字 ink `#ffffff` · 次要 `#999999` · 强调 accent `#0099ff`（其上文字 `#ffffff`）
- 字体 display `GT Walsheim Framer Medium` 500/-5.5px · body `Inter Variable`
- 圆角 card 10px / button 100px / pill 100px · 间距基准 8px

## 版式与间距
- Base unit: 5px (Framer uses non-standard 5/10/15/20/30 increments rather than the more common 4/8/16/24).
- Tokens (front matter): spacing.hair 1px · spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 15px ·…
- Card interior padding: spacing.lg 20px on pricing cards; spacing.xl 30px on gradient spotlight cards.
- Pill button padding: 10px vertical · 15px horizontal — components.button-primary.
- Section padding (vertical): roughly spacing.section 96px on home; tighter (~64px) on pricing comparison.

## 形状
- Embedded site mockups (browser-chromed previews of Framer-built sites) sit in rounded.xl 20px tiles with spacing.md 15px interior padding.
- Gradient spotlight cards use rounded.xxl 30px corners — softer than the 20px content cards by design, to make them feel like atmospheric panels…
- Icon glyphs and sub-nav glyphs render in rounded.full circles at 32–40px sizes.

## 该做
- Reserve colors.primary (white) and colors.canvas (near-black) as the system's two anchor surfaces. Every band of the page chooses one or the other.
- Push display-size letter-spacing aggressively negative — typography.display-xxl at -5.5px is the brand signature, not a stylistic accident.
- Use colors.accent-blue only for hyperlinks, focus rings, and selected indicators. Never as a background or button fill.
- Drop one or two `gradient-spotlight-card` variants into a card grid; they are the brand's atmosphere device. Don't overdo it — three or more in the same…

## 避免
- Compose every CTA as a pill (rounded.pill); secondary actions live as charcoal pills, never as bordered ghost buttons.
- Keep body type Inter Variable with character variants `cv01`, `cv05`, `cv09`, `cv11`, `ss03`, `ss07` enabled — the brand voice depends on them.
- Use surface lift (canvas → surface-1 → surface-2) to mark hierarchy on dark, not opacity changes on white type.
- Don't ship a light-mode marketing page. Framer's identity is dark.
