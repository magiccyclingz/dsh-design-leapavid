# Bugatti · 布加迪

Bugatti's marketing surface is the most austere interface in luxury automotive: a near-pure black canvas (#000000) holding white uppercase letterspaced display type and full-bleed automotive photography. The system has no accent color, no surface card decoration, no shadows, no gradients, no chrome — only photography, typography, and the brand wordmark. Every other luxury auto site in…

- 画布 canvas `#000000` · 表面 surface `#141414` · 描边 `#242424`
- 文字 ink `#ffffff` · 次要 `#999999` · 强调 accent `#d4a017`（其上文字 `#ffffff`）
- 字体 display `Bugatti Display` 400/1.28px · body `Bugatti Display`
- 圆角 card 12px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 24px · spacing.xl 40px ·…
- Section padding: spacing.section (120px) — longer than most marketing sites because Bugatti's bands are mostly…
- Card internal padding: spacing.lg (24px) for newsroom and content cards; spacing.md (16px) for the career callout…
- Gutters: spacing.xl (40px) between cards in 2-up grids — wider than typical because Bugatti's grids are sparse.

## 该做
- Anchor every page with full-bleed automotive photography. The cars are the brand voltage; chrome backs off entirely.
- Keep all display headlines in UPPERCASE Bugatti Display with 2-4px letter-spacing. The wordmark gets 6px.
- Use Bugatti Display for headlines, Bugatti Text Regular (serif!) for body, Bugatti Monospace for buttons + captions + nav. The trinity is unbreakable.
- Keep component.button-primary transparent with a 1px white outline. The transparent pill IS the brand button.

## 避免
- Use weight 400 everywhere. Bold breaks the brand voice — the system has no bold weight role.
- Use spacing.section (120px) between major editorial bands. The whitespace is part of the brand.
- Reserve colors.link (#c3d9f3) for inline anchor links only. It's the system's only non-monochrome color.
- Don't introduce any accent color outside colors.link. Bugatti's brand discipline is total monochrome + photography. Adding a brand-blue or brand-red breaks the…
