# ClickHouse · ClickHouse

ClickHouse's marketing surface is the highest-contrast interface in the database / data-platform category. The base atmosphere is near-pure black canvas (#0a0a0a) with electric yellow (#faff69) as the singular brand voltage. The yellow handles every primary CTA, every stat-callout number, every "GET STARTED" badge — used scarcely on individual elements but generously…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dddddd`
- 文字 ink `#0a0a0a` · 次要 `#888888` · 强调 accent `#f59e0b`（其上文字 `#ffffff`）
- 字体 display `Inter` 700/-2.5px · body `Inter`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 24px · spacing.xl 32px ·…
- Section padding: spacing.section (96px) between major bands.
- Card internal padding: spacing.xl (32px) for feature cards, pricing tiers; spacing.lg (24px) for code-window cards…
- Max content width: ~1280px centered.

## 该做
- Anchor every page on the black canvas. The yellow + black pairing is the brand voltage.
- Reserve colors.primary (yellow) for primary CTAs, stat-callout numbers, and full-bleed yellow CTA bands. The yellow's scarcity at the element level + abundance…
- Use Inter at weight 700 for every display headline, with -1 to -2.5px letter-spacing.
- Show actual SQL code blocks inside component.code-window-card — ClickHouse is a database; show the query, don't paint marketing illustrations of queries.

## 避免
- Use component.stat-callout numbers to establish credibility (community size, contributors, performance benchmarks). The yellow stat numbers are signature.
- Anchor every band with spacing.section (96px) vertical rhythm.
- Don't introduce a second brand color. ClickHouse is monochromatic + yellow.
- Don't bold display weight beyond 700 or use weight 500 for headlines. The hierarchy depends on size, not on weight gradation.
