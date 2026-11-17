# Sentry · Sentry

Sentri's design language reads like a debugging console wearing a leather jacket. The home and product surfaces sit on a near-black violet midnight ( / ), strewn with starfield textures and floating sticker-style mascots — astronauts, monsters, traffic cones — that puncture the seriousness of an observability product. Headlines run in a chunky proprietary display…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f5` · 描边 `#dedde0`
- 文字 ink `#150f23` · 次要 `#77747f` · 强调 accent `#150f23`（其上文字 `#ffffff`）
- 字体 display `Sentri Display` 700/0px · body `Rubik`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px
- Tokens: spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 24px ·…
- Section padding: spacing.section 96px between major page bands on desktop, collapsing to spacing.xxl 32px–48px on…
- Card internal padding: spacing.xxl 32px on pricing cards and large feature cards; spacing.lg 16px on compact…
- Form field padding: spacing.sm 8px vertical, spacing.md 12px horizontal — matches the text-input token directly.

## 该做
- Reserve colors.accent-lime for keyword-highlight chips inside display headlines and the footer squiggle divider — never use it as a button background, never as…
- Pair every `button-primary` with typography.button-cap in uppercase with 0.2px tracking — the cadence is part of the brand, not a stylistic option.
- Treat the dark canvas (colors.surface-canvas-dark) and light canvas (colors.surface-canvas-light) as two complete worlds — let one own marketing/feature pages…
- Use sticker mascots to break section boundaries — let them overlap, tilt, and float; constraining them inside cards drains their personality.

## 避免
- Use `card-pricing-featured` (dark inverted tier) instead of an accent-bordered light tier for the featured pricing column.
- Default body line-height to 1.5 on functional UI surfaces and 2.0 on marketing surfaces — the difference is intentional.
- Don't introduce additional accent colors beyond colors.accent-lime and colors.accent-pink — adding teal, orange, or yellow dilutes the violet-and-lime…
- Don't apply drop shadows to cards on dark canvas — depth comes from texture and illustration, not from light-on-dark shadows that would muddy the violet.
