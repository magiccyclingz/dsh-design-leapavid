# Mistral AI · Mistral

Mistral AI carries itself with a singular, almost cinematographic visual signature — the homepage opens with "Frontier AI. In your hands." rendered in elegant near-serif display type over a photographic mountain landscape bathed in mustard-orange sunset light. Below the hero, every page closes with the same recognizable element: a horizontal "sunset stripe" gradient band running red→orange→yellow→cream that wraps…

- 画布 canvas `#fafafa` · 表面 surface `#f0f0f0` · 描边 `#dbdbdb`
- 文字 ink `#1f1f1f` · 次要 `#7b7b7b` · 强调 accent `#fa520f`（其上文字 `#ffffff`）
- 字体 display `PP Editorial Old` 400/-1.5px · body `Inter`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 4px (8px primary increment)
- Tokens: spacing.xxs (4px) · spacing.xs (8px) · spacing.sm (12px) · spacing.md (16px) · spacing.lg (20px) ·…
- Section rhythm: Marketing pages use spacing.section-lg (96px); content pages tighten to spacing.section (64px)
- Card internal padding: spacing.xl (24px) for compact cards; spacing.xxl (32px) for feature panels and form panels
- Marketing pages use 1280px max-width with 32px gutters

## 形状
- Hero photography is full-bleed atmospheric mountain-sunset imagery with no internal framing
- IDE/code mockups render with rounded.lg (12px) corners on dark canvas
- Customer logos wall presents wordmarks inline at consistent 60–80px height

## 该做
- Reserve colors.primary (saturated orange) for primary CTAs and active states only
- Use the sunset stripe band at the foot of every page — it's the brand's most recognizable signature
- Pair PP Editorial Old (display) with Inter (UI) — never substitute either with a generic alternative
- Apply rounded.md (8px) to buttons and rounded.lg (12px) to cards consistently

## 避免
- Use cream-yellow surfaces (#fff8e0) for form panels, feature cards, and footer
- Anchor heroes with photographic mountain-sunset imagery (or its visual equivalent — atmospheric gradient sky)
- Use stat-display token (PP Editorial 56px) for stat callouts to maintain editorial character
- Don't use pill-shaped buttons (rounded.full) — Mistral's geometry is sober and editorial, not playful
