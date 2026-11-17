# IBM · IBM

IBM's marketing system is a faithful application of Carbon Design System — IBM's open-source enterprise design system. The dominant surface is pure white with `#f4f4f4` light gray for elevation, charcoal `#161616` (#161616) for text, and IBM Blue `#0f62fe` (#0f62fe) as the single brand accent.

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dedede`
- 文字 ink `#161616` · 次要 `#787878` · 强调 accent `#0f62fe`（其上文字 `#ffffff`）
- 字体 display `IBM Plex Sans` 300/-0.5px · body `IBM Plex Sans`
- 圆角 card 6px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 4px (Carbon's signature 4-pixel grid).
- Tokens (front matter): spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 24px ·…
- Card interior padding: spacing.lg 24px on feature cards; spacing.xl 32px on product cards; spacing.xxl 48px on hero…
- Button padding: 12px vertical · 16px horizontal — Carbon spec.
- Form input padding: 11px vertical · 16px horizontal.

## 形状
- IBM uses photography (people, hardware, sports cars) and abstract illustration (geometric mesh, dotted patterns) interchangeably.
- Image frames are flat — no rounded corners.
- Customer logo tiles sit on rounded.none 0px tiles with thin 1px borders.

## 该做
- Use rounded.none 0px on every CTA, card, input, and container. The flat-square aesthetic is the brand.
- Pair Plex Sans weight 300 for display sizes (42px+) with weight 400 for body. Resist the urge to bold the headline.
- Reserve colors.primary IBM Blue for primary CTAs, links, focused-input underlines, and CTA banner. Do not use it as a card background or eyebrow color.
- Apply `letter-spacing: 0.16px` to body sizes. It's a Carbon precision detail and part of the typographic voice.

## 避免
- Use surface change (`canvas` → `surface-1`) and 1px hairlines for card hierarchy. Skip drop shadows.
- Stick to sentence case for eyebrows and section labels — Carbon resists all-caps tracking.
- Invert to colors.inverse-canvas only at the footer; the rest of the page stays light.
- Don't round corners on buttons, cards, or inputs. Even 4px rounded corners break the Carbon look.
