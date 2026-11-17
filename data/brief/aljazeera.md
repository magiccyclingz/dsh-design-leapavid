# Al Jazeera · 半岛电视台

Al Jazeera's news surface is a printing press, not a product. The page is flat paper packed edge-to-edge with photography and dense Roboto headline stacks; there are no shadows, no tonal card fills, no decorative gradients — hierarchy is carried entirely by type weight, rules, and the discipline of the grid. Against that severity the brand signs itself with a single saturated orange: the…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#fa9000`（其上文字 `#ffffff`）
- 字体 display `Roboto` 700/0px · body `Roboto`
- 圆角 card 10px / button 4px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px with tight 2/4px steps for chrome and metadata.
- Tokens (front matter): spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px ·…
- News density keeps gaps small — spacing.sm-spacing.lg between cards; the newsletter card pads at spacing.xl; network…
- The front page runs a packed 1100px multi-column news grid: lead story + secondary column + rail, then full-width bands…
- Live blogs run a single reading column with a right rail; updates stack as timestamped blocks.

## 形状
- Article grids: square-cornered 16:9 and 4:3 crops, packed edge to edge.
- Video carousel: portrait cards at rounded.md.
- Thumb rows: small 130×87 stills at rounded.md beside typography.headline-sm links.

## 该做
- Keep colors.primary to identity duty — the logo block and the eyebrow bar — and let black pills carry every action.
- Reserve colors.live-red strictly for live/breaking state: badges, bands, timeline dots.
- Open every editorial section with the `section-eyebrow-lockup` (orange bar + 300-weight uppercase label).
- Keep the news surface flat: hairline rules and weight contrast, never shadows or tonal cards.

## 避免
- Run photography dense and square in article grids; save rounded.md for carousels and thumbs.
- On network pages, keep the gilded family — colors.gold rules, colors.amber active links — over the dark colors.network-canvas.
- Use the wide Roboto weight spread deliberately: 300 eyebrows, 700 headlines, 900 urgent labels.
- Don't fill buttons or links with colors.primary — orange interaction chrome breaks the marker-pen rule.
