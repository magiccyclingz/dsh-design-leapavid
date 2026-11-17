# Mercury · Mercury

Mercury feels like a private bank that happens to be a software company: quiet, precise and slightly nocturnal. The homepage lives in a deep ink-violet night (#171721). Headlines are pale lavender-white (`#ededf3`), cards sit one shade lifted (`#1e1e2a`), and product imagery glows softly out of the dark. Move to the product and pricing pages and the whole system flips to…

- 画布 canvas `#fbfcfd` · 表面 surface `#f2f2f4` · 描边 `#dddee2`
- 文字 ink `#28253b` · 次要 `#817f8c` · 强调 accent `#5266eb`（其上文字 `#ffffff`）
- 字体 display `arcadiaDisplay` 480/0px · body `arcadia`
- 圆角 card 12px / button 40px / pill 40px · 间距基准 8px

## 版式与间距
- Base unit: 8px.
- Tokens: spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 20px · spacing.xl 24px · spacing.xxl 32px ·…
- Cards pad spacing.xxl and pills pad 20px horizontally. Sections are separated by spacing.section to spacing.section-lg…
- Content is centered in a column of roughly 1100–1200px. Headlines are narrower (~600px) and centered.
- Feature cards run in 2- and 3-up grids. The pricing card is a 3-column comparison table about 900px wide.

## 该做
- Use colors.primary for the single most important action on a view, usually "Open account".
- Make secondary actions translucent pills (rounded.pill): lavender-grey or periwinkle on dark, indigo or grey-violet tints on light.
- Frame light pages with the colors.night nav and footer.
- Keep type light: typography.body-lg at 360, UI at 420, headlines at 480.

## 避免
- Separate cards from the canvas with fill (colors.lavender, colors.night-raised) rather than borders or heavy shadows.
- Center section headlines and give sections spacing.section or more of vertical space.
- Don't use more than one solid colors.primary button in a group. Everything else stays translucent.
- Don't set text in heavy bold weights. The brand never goes above 500.
