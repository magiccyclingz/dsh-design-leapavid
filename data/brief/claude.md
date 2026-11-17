# Claude · Claude

Claude.com is the warmest, most editorial interface in the AI-product category. The base atmosphere is a tinted cream canvas (#faf9f5) — distinctly warm, deliberately not the cool gray-white that every other AI brand uses. Headlines run a slab-serif display ("Copernicus" / Tiempos Headline) at weight 400 with negative letter-spacing, paired with StyreneB / Inter body sans. The…

- 画布 canvas `#faf9f5` · 表面 surface `#f0efeb` · 描边 `#dad9d5`
- 文字 ink `#141413` · 次要 `#757472` · 强调 accent `#cc785c`（其上文字 `#ffffff`）
- 字体 display `Copernicus` 400/-1.5px · body `StyreneB`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 24px · spacing.xl 32px ·…
- Section padding: spacing.section (96px) — modern-SaaS rhythm.
- Card internal padding: spacing.xl (32px) for feature cards, pricing tier cards, model comparison cards; spacing.lg…
- Callout / CTA bands: spacing.xxl (48px) inside coral callout cards; 64px inside the larger dark CTA band.

## 形状
- Simple line-art illustrations with coral + dark-navy strokes on the cream canvas
- Code editor mockups (the dominant "hero" treatment on developer-focused pages)
- Terminal output mockups with monospace text on dark

## 该做
- Anchor every page on the cream canvas. Pure white reads as "any other AI tool"; the warm tint is the brand differentiator.
- Use Copernicus serif for every display headline. Pair with StyreneB sans body. Negative letter-spacing on display sizes is non-negotiable.
- Reserve colors.primary (coral) for primary CTAs and full-bleed component.callout-card-coral moments. Don't paint accent moments coral elsewhere.
- Use component.product-mockup-card-dark and component.code-window-card to show actual Claude product chrome. Don't paint marketing illustrations of code when…

## 避免
- Pair component.feature-card (cream) with component.product-mockup-card-dark (navy) in alternating bands. The cream-to-dark rhythm is the brand's pacing…
- Use the Anthropic spike-mark glyph as the brand wordmark prefix. Never invert the mark to white-on-dark within the wordmark itself.
- Apply spacing.section (96px) between major bands.
- Don't use cool grays or pure white for canvas. Cream is the brand.
