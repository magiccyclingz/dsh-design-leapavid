# Raycast · Raycast

Raycast's marketing site reads like an extended product screenshot. The chrome IS the in-product command palette at marketing scale: pure near-black canvas (#07080a), hairline 1px borders (#242728), command-palette-style cards with rounded corners between 6 and 16px, Inter typography with the ss03 stylistic set enabled site-wide (a single character — the alternate…

- 画布 canvas `#07080a` · 表面 surface `#15171c` · 描边 `#2a2b2c`
- 文字 ink `#ffffff` · 次要 `#6b6b6b` · 强调 accent `#a1131a`（其上文字 `#ffffff`）
- 字体 display `Inter` 600/0px · body `Inter`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with 2/4/12px steps for tight inline gaps).
- Tokens (front matter): spacing.xxs (2px) · spacing.xs (4px) · spacing.sm (8px) · spacing.md (12px) · spacing.lg…
- Universal section rhythm: every page in the set uses spacing.section (96px) as the vertical gap between major…
- Max width: ~1240px content area at desktop with 24px gutters (~48px at ultrawide). Hero command-palette mockups run…
- Store extension grid: 2-up at desktop with rows of 2 cards stacked, collapsing to 1-up at mobile. Each card is a…

## 形状
- Command-palette mockups — full-fidelity Raycast UI screenshots at 16:9 or 4:3 aspect inside rounded.xl (16px) containers.
- App icon tiles — 48–64px square at rounded.md (8px), displaying real app icons.
- Avatar circles — 32–40px at rounded.full for in-extension author attribution.

## 该做
- Render the entire site in one continuous dark mode. There is no light variant in the system.
- Use colors.primary (white pill) for every primary CTA. There is no second primary color — white IS the brand action.
- Build elevation from the surface-color ladder (colors.canvas → colors.surface → colors.surface-elevated → colors.surface-card), never from drop shadows.
- Enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on the body element. The ss03 alternate `g` is part of the brand identity.

## 避免
- Anchor a component.command-palette-card mockup as the hero's load-bearing visual. Real Raycast UI is the brand.
- Use component.keycap glyphs inline to indicate keyboard shortcuts. Subtle key-bg gradient (colors.key-bg-start → colors.key-bg-end) is the brand's only "depth"…
- Reserve colors.hero-stripe-start → colors.hero-stripe-end red gradient for the hero band exactly once per page. Never repeat the stripe gradient deeper in the…
- Use saturated category accents (colors.accent-yellow, colors.accent-red, colors.accent-green, colors.accent-blue) only inside extension and feature…
