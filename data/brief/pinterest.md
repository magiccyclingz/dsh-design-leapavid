# Pinterest · Pinterest

Pinterest's marketing system is built around a single instructional principle: get out of the photograph's way. The chrome is a quiet warm-cream neutral palette (`#fbfbf9`, `#f6f6f3`, ) carrying typography in Pinterest's proprietary Pin Sans face, with Pinterest Red (#e60023) reserved exclusively for the "Sign up" CTA, the active-tab indicator, and…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#e60023`（其上文字 `#ffffff`）
- 字体 display `Pin Sans` 600/-1.2px · body `Pin Sans`
- 圆角 card 16px / button 8px / pill 9999px · 间距基准 6px

## 版式与间距
- Base unit: 8px (with finer 4/6/7px steps available for tight inline gaps in pill buttons and chips).
- Tokens (front matter): spacing.xxs (4px) · spacing.xs (6px) · spacing.sm (8px) · spacing.md (12px) · spacing.lg…
- Universal section rhythm: every page in the set uses spacing.section (64px) as the vertical gap between major…
- Modal padding: component.modal-card uses 32px internal padding (spacing.xxl) on all sides.
- Max width: ~1280px content area at desktop with 24px gutters (~48px at ultrawide).

## 形状
- Pin imagery: mixed aspect ratios — square (1:1), portrait (3:4, 2:3, 4:5), and rare landscape — preserved at their natural ratio inside…
- Category tile thumbnails: square (1:1) with rounded.md corners.
- Avatar circles: 32–48px at rounded.full for in-pin attribution and profile chips.

## 该做
- Reserve colors.primary (Pinterest Red) for primary CTAs, the active-tab indicator, and the brand wordmark only. It is never decorative.
- Use rounded.md (16px) on every interactive element and standard card; reserve rounded.lg (32px) for large pin cards and modals; reserve rounded.full for…
- Stage every pin image inside a component.pin-card with no internal padding — the photograph IS the card.
- Stack content sections at spacing.section (64px) rhythm; tighten pin grids to spacing.sm (8px) gutters so imagery effectively touches.

## 避免
- Use component.pin-overlay-pill to anchor a search-term tag in the corner of a category-tile pin photograph — the system's signature decorative gesture.
- Build hierarchy from font weight (400 → 600 → 700) and size, not from color tinting. Body stays colors.body regardless of section context.
- Apply -1.2px letter-spacing on typography.display-xl and typography.heading-xl. The negative tracking is part of the brand voice.
- Don't use sharp-cornered buttons or cards. There are no rounded.none interactive elements in the system.
