# Stripe · Stripe

Stripi's design language opens with the gradient mesh. A wide horizontal band of pastel cream, sherbet orange, lavender, electric indigo, and ruby pink occupies the upper third of nearly every marketing page — the brand's instantly-recognizable atmospheric backdrop. Type and product UI mockups float above it on (white), with the gradient acting as both decoration and visual anchor. The lower…

- 画布 canvas `#ffffff` · 表面 surface `#f4f5f6` · 描边 `#dde0e4`
- 文字 ink `#0d253d` · 次要 `#73818e` · 强调 accent `#533afd`（其上文字 `#ffffff`）
- 字体 display `sohne-var` 300/-1.4px · body `sohne-var`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with 2 / 4 / 12 sub-tokens for fine work).
- Tokens: spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 24px ·…
- Section padding: 64–96px on marketing surfaces; 32–48px on dashboard / product surfaces.
- Card internal padding: 32px on feature cards; 24px on dashboard mockups.
- Marketing pages center in a ~1200px container with the gradient mesh extending edge-to-edge above.

## 该做
- Reserve colors.primary for filled CTAs and inline link emphasis — it should appear sparingly, one filled button per band.
- Apply the gradient mesh to every marketing hero; bare-canvas heroes feel off-brand.
- Render display tiers at weight 300 with negative letter-spacing — the thin tracking is the typographic signature.
- Use `font-feature-settings: "tnum"` on every money / numeric cell.

## 避免
- Apply `font-feature-settings: "ss01"` globally on the body element.
- Pair every feature explanation with a composited product UI mockup; the brand's argument is "look at the actual product."
- Don't bump display weight above 300 — at 400 the brand's editorial air collapses.
- Don't add new accent colors outside the documented gradient stops (cream / orange / lavender / indigo / ruby / magenta).
