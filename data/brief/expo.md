# Expo · Expo

Expo's marketing site reads like a quietly-confident React-Native developer platform. The base canvas is pure white (#ffffff) with a soft sky-blue gradient atmospheric wash behind the hero band. Near-black ink `#171717` (#171717) carries body and display alike. The single brand voltage is pure black (#000000) for primary CTAs — minimal and editorial-feeling.…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#dfdfdf`
- 文字 ink `#171717` · 次要 `#828282` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `Inter` 600/-1.92px · body `Inter`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 16px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.base 16px · spacing.md 20px · spacing.lg 24px…
- Section padding: 96px.
- Max content width: ~1200px.
- Editorial body: 12-column grid.

## 该做
- Reserve colors.primary (black) for primary CTAs.
- Use colors.text-link (blue) for inline body links only — never on CTAs or buttons.
- Set every CTA at rounded.md (8px) — developer dialect.
- Use Inter at weight 600 for display, 400 for body.

## 避免
- Render every code surface in JetBrains Mono.
- Pair the hero with the device-mockup composite — it's the page chrome.
- Don't introduce a saturated brand action color. Black is the only CTA fill.
- Don't use blue (colors.text-link) on a CTA. Inline links only.
