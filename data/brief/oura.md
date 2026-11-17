# Oura · Oura

Oura's web presence reads like a printed field journal that learned to breathe. The default surface is a warm paper cream (#f7f1e8) rather than white, and everything sits on it with generous air: a light, high-contrast serif for the big statements, a calm grotesque sans for everything you actually read, and full-bleed lifestyle photography that carries most of the emotional weight. Where a…

- 画布 canvas `#f7f1e8` · 表面 surface `#ede7df` · 描边 `#d8d3cb`
- 文字 ink `#1c1b1a` · 次要 `#787571` · 强调 accent `#2a72de`（其上文字 `#ffffff`）
- 字体 display `Editorial New` 300/0px · body `AkkuratLL`
- 圆角 card 12px / button 8px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 8px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 24px · spacing.xl 32px.
- Card interiors sit at spacing.lg; tight utility groupings (form padding, chip padding) at spacing.sm–spacing.md.…
- Content is center-constrained within a wide max-width, with full-bleed photography breaking out to the viewport edges.
- Card grids run 3-up (person cards, benefit trios) and 4-up (news / expert carousels), collapsing toward 1-up on narrow…

## 该做
- Reserve colors.primary strictly for the primary conversion CTA — one blue moment per view, maximum.
- Default every surface to colors.canvas (warm paper), not white. White (colors.surface) is for elevated cards and inputs, not backgrounds.
- Use colors.stone for the wordmark, secondary pills, outlines, form fills, and links — it is the workhorse neutral.
- Pair typography.display (thin serif) at large sizes with typography.body (grotesque) for reading; let scale create hierarchy.

## 避免
- Keep pills fully rounded (rounded.full) and cards softly rounded (rounded.lg); use rounded.xl only for large product imagery.
- Let the earth-tone ramps (gold, clay, olive) live in bands, illustration, and data-viz — as color-blocked sections that pace the scroll.
- Give sections large vertical breathing room; treat empty cream as structure.
- Don't use colors.primary for links, accents, icons, or decorative fills — it must stay unique to the primary CTA.
