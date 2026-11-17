# HashiCorp · HashiCorp

HashiCorp's marketing canvas is a near-black ground that serves a multi-product portfolio without ever feeling generic. The dominant surface is (pure black) layered with `#15181e` charcoal cards and 1px translucent gray hairlines. The chrome is monochrome — white pill-rounded buttons (`{components.button-primary}`), white type, gray secondary type — but the system is held together by a…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#787a7f` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `hashicorpSans` 700/-2.5px · body `hashicorpSans`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 8px (the primary increments are 4 / 8 / 12 / 16 / 24 / 32 / 48).
- Tokens (front matter): spacing.hair 1px · spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px ·…
- Card interior padding: spacing.lg 24px on product cards; spacing.xl 32px on pricing cards; spacing.xxl 48px on CTA…
- Button padding: 10px vertical · 18px horizontal on components.button-primary.
- Universal rhythm constant: spacing.section (96px) vertical gap between major sections.

## 形状
- Product 3D illustrations use full-bleed within their container — no rounded inner mask.
- Logo chips in the customer marquee sit on rounded.sm 6px tiles with 1px hairline.
- Resource thumbnails use rounded.lg 12px corners.

## 该做
- Reserve colors.canvas (black) and colors.surface-1 (charcoal) as the system's two anchor surfaces. Every band of the page is one or the other.
- When introducing a section about a specific HashiCorp product, use that product's colors.product-* token consistently — for the section pill, the CTA button…
- Use rounded.md 8px on CTA buttons; HashiCorp's brand reads as engineered, not consumer.
- Pair tight display line-heights (1.17–1.21) with relaxed body line-heights (1.50–1.71). The contrast IS the brand voice.

## 避免
- Use the eyebrow typography (typography.eyebrow, uppercase, 0.6px tracking) above every meaningful section.
- Use surface lift (canvas → surface-1 → surface-2) to express hierarchy on dark.
- Reserve product-chromatic cards for product identity; keep generic feature cards on colors.surface-1.
- Don't ship a light-mode marketing page. HashiCorp's marketing brand IS dark.
