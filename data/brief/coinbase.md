# Coinbase · Coinbase

Coinbase reads like an institutional financial brand that happens to trade crypto — the marketing surfaces are quiet, white-canvas, editorially-spaced, and almost monochromatic. The single brand voltage is Coinbase Blue (#0052ff), used scarcely: every primary CTA pill, the brand wordmark, and inline emphasis links. Beyond that one blue, the system is white canvas + ink + soft gray elevation…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dddddd`
- 文字 ink `#0a0b0d` · 次要 `#7c828a` · 强调 accent `#0052ff`（其上文字 `#ffffff`）
- 字体 display `Coinbase Display` 400/-2px · body `Coinbase Sans`
- 圆角 card 12px / button 100px / pill 100px · 间距基准 16px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.base 16px · spacing.md 20px · spacing.lg 24px…
- Section padding: spacing.section (96px) for every major editorial band.
- Card internal padding: spacing.xl (32px) for feature cards and product-UI mockups.
- Max content width: ~1200px centered. Hero photography full-bleed.

## 该做
- Reserve colors.primary (Coinbase Blue) for primary CTAs, wordmark, brand-glyph illustrations, inline accent links.
- Set every CTA as rounded.pill (100px); every asset glyph as rounded.full.
- Keep CoinbaseDisplay headlines at weight 400.
- Use the dark/light band rotation as page rhythm.

## 避免
- Render every numerical value in CoinbaseMono via typography.number-display.
- Pair every dark hero with a layered product-UI mockup card stack.
- Don't introduce a secondary brand color. Coinbase Blue is the only action color; trading green/red are semantic-only.
- Don't bold display copy — display sits at weight 400; bolding shifts the brand voice.
