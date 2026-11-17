# Figma · Figma

Figma's marketing canvas is, at the system level, an editor-clean black-and-white frame. The chrome — top nav, body type, footer, primary CTA — is monochrome. Headlines are oversized `{typography.display-xl}` set in `figmaSans` with aggressive negative tracking, body copy hovers around weight 320–340 of the same variable family, and small mono `{typography.eyebrow}` and `{typography.caption}` labels (figmaMono…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `figmaSans` 340/-1.72px · body `figmaSans`
- 圆角 card 8px / button 50px / pill 50px · 间距基准 8px

## 版式与间距
- Base unit: 8px.
- Tokens (front matter): spacing.hair 1px · spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px ·…
- Section interior padding: spacing.xxl (48px) on color-block sections.
- Card interior padding: spacing.lg (24px) on pricing cards and template tiles.
- Form input padding: spacing.sm 12px vertical · 14px horizontal.

## 形状
- Image frames use rounded.md (8px) — generous enough to feel friendly, conservative enough to read as editorial.
- Template thumbnails on the home grid sit in rounded.md tiles with spacing.md interior padding around the embedded preview.
- FigJam pastel sticky-note component thumbnails preserve a small rounded.sm corner that mimics actual sticky paper.

## 该做
- Reserve colors.primary for genuine primary CTAs and selected states (e.g., `pricing-tab-selected`). Don't use it as a decorative accent.
- When introducing a story section, choose one color block from the colors.block-* family and let it span full content width with rounded.lg corners and…
- Keep type in `figmaSans` at variable weights — pick from 320, 330, 340, 480, 540, 700 to express hierarchy. Avoid intermediate weights outside this set.
- Use `figmaMono` only for eyebrows and captions, always uppercase, with the documented positive letter-spacing.

## 避免
- Compose every CTA as a pill (rounded.pill) and every icon button as a circle (rounded.full).
- Allow the page to return to white canvas between every two color blocks so each block reads as deliberate.
- Pair `button-primary` and `button-secondary` whenever a section needs both a primary action and a sales / secondary action — the black-and-white pair is the…
- Don't introduce mid-gray text. Body hierarchy comes from `figmaSans` weight, not from opacity.
