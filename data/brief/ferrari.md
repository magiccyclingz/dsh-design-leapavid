# Ferrari · 法拉利

Ferrari's marketing site reads as cinematic editorial — closer to a luxury-magazine spread than a typical car-OEM site. The base canvas is near-black ( — #181818) holding pure white display type; white-canvas bands appear only inside specific editorial contexts (preowned listings, pricing tables, dealer surfaces). The single brand voltage is Rosso Corsa (#da291c), the…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#dfdfdf`
- 文字 ink `#181818` · 次要 `#797979` · 强调 accent `#da291c`（其上文字 `#ffffff`）
- 字体 display `FerrariSans` 500/-1.6px · body `FerrariSans`
- 圆角 card 6px / button 4px / pill 9999px · 间距基准 16px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxxs 4px · spacing.xxs 8px · spacing.xs 16px · spacing.sm 24px · spacing.md 32px · spacing.lg 48px…
- Section padding: spacing.xxl (96px) for major bands; spacing.super (128px) reserved for hero band depth.
- Max content width: ~1280px on editorial bands. Hero photography goes full-bleed.
- Editorial body: 12-column grid.

## 该做
- Reserve colors.primary (Rosso Corsa) for primary CTAs, the Cavallino mark, and F1 race-position highlights.
- Set every CTA at rounded.none (0px sharp corners) — the brand's signature precision.
- Render CTA labels in uppercase with 1.4px tracking via typography.button.
- Pair every hero with a full-bleed cinematic photograph — the photograph IS the depth.

## 避免
- Use the explicit 8px spacing ladder (`xxxs` through `super`) rather than ad-hoc px values.
- Keep display weight at 500 — never bold.
- Don't introduce a saturated brand color other than Rosso Corsa.
- Don't use rounded or pill CTAs — sharp 0px corners are the brand button.
