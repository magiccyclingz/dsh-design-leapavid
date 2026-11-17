# Meta · Meta

Meta's commerce surfaces (homepage, Quest configurator, Ray-Ban product detail, prescription page) read as a confident hardware merchandiser. The brand voice is photography-first: large, full-bleed product imagery dominates above-the-fold real estate, with white space and tight typographic hierarchy carrying the rest. The system has a recognizable dual-CTA pattern — a black pill-shaped primary on marketing surfaces…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#dfdfe0`
- 文字 ink `#1c1e21` · 次要 `#7b7d7e` · 强调 accent `#0064e0`（其上文字 `#ffffff`）
- 字体 display `Optimistic VF` 500/0px · body `Optimistic VF`
- 圆角 card 6px / button 4px / pill 100px · 间距基准 16px

## 版式与间距
- Base unit: 4px increment with 8px as the dominant primary step.
- Tokens: spacing.xxs (4px) · spacing.xs (8px) · spacing.sm (10px) · spacing.md (12px) · spacing.base (16px) ·…
- Section rhythm: Marketing sections separate at spacing.section-lg (80px); product detail sections compress to…
- Card internal padding: Standard spacing.xxl (32px); icon-feature tiles compress to spacing.xl (24px); promo-strip…
- Marketing page max-width sits around 1280px with 32–48px gutters.

## 形状
- Product hero photography sits in rounded.xxxl (32px) frames more often than rectangles.
- Color/material swatches are perfect circles (rounded.circle, 32px diameter, 2px white border ring when selected).
- Square product thumbnails (`aspect-ratio: 1/1`) use rounded.xl rounding.

## 该做
- Reserve colors.primary (cobalt) for buy-now CTAs only — its visual weight is meaningful precisely because it doesn't appear on marketing pages.
- Use colors.ink-button (black) for marketing-surface primary CTAs. Pair with colors.button-secondary ghost outline for the secondary action.
- Apply rounded.full to every button, every category pill, every badge, every chip — buttons are NEVER squared in Meta's system.
- Apply rounded.xxxl to photographic product cards and rounded.xl to icon-feature tiles to maintain the visible card-hierarchy contrast.

## 避免
- Switch on `ss01, ss02` together for any Optimistic VF heading. Never one stylistic set without the other.
- Use the 300-weight typography.heading-md for editorial subheads — it creates the brand's signature visual rhythm against the 500-weight displays.
- Don't use colors.primary (cobalt) for marketing-surface primary buttons — it conflicts with Meta's brand-history positioning of black-CTA-on-white-canvas…
- Don't introduce additional accent colors beyond cobalt + Oculus purple. The hardware brand is deliberately monochromatic outside its product photography.
