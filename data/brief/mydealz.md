# mydealz · mydealz

mydealz is a deals-community feed running at maximum density: a single cool-gray canvas (`#f3f5f7`) stacked with hundreds of white deal cards (), each one a compact bundle of thumbnail, title, price, and social signals. The design's whole job is to make that firehose scannable, and it does it with one confident brand green (`#30a83c`) — the color of every price, every "Zum Deal"…

- 画布 canvas `#f3f5f7` · 表面 surface `#e8eaec` · 描边 `#d1d3d4`
- 文字 ink `#000000` · 次要 `#898b8d` · 强调 accent `#30a83c`（其上文字 `#ffffff`）
- 字体 display `Averta CY` 700/0px · body `Averta CY`
- 圆角 card 8px / button 4px / pill 540px · 间距基准 4px

## 版式与间距
- Base unit: 8px
- Tokens (front matter): spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px ·…
- Cards pad spacing.lg; card rows stack with spacing.sm–spacing.md gaps for maximum density.

## 该做
- Reserve colors.primary green for actions and prices — it is the single thread tying the feed together.
- Keep the `temperature-control` pairing intact: colors.cold down, colors.hot up and temperature — it's the brand's signature.
- Pill every button, chip, search, and the temperature control to rounded.full; keep content cards at rounded.md.
- Put savings in the colors.discount-surface mint badge beside the green price.

## 避免
- Hold typography to Averta CY 500 / 700; bold every price and temperature.
- Separate cards with colors.hairline borders and the colors.canvas gutter, not heavy shadows.
- Don't recolor prices or primary actions away from colors.primary green.
- Don't split the temperature pairing or recolor the vote arrows — cold is blue, hot is red, always.
