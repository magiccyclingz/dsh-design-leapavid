# Renault · 雷诺

Renault's Turkish marketing surfaces are unapologetically high-contrast: a white canvas for browsing, a black canvas for product storytelling, and a single Sunlight Yellow accent (#ffed00) reserved for the most consequential actions. The brand's modernised flat diamond logo sets the tone — geometric, confident, slightly industrial — and the system follows suit. Square corners dominate…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#e0e0e0`
- 文字 ink `#222222` · 次要 `#7f7f7f` · 强调 accent `#b6aa0b`（其上文字 `#ffffff`）
- 字体 display `NouvelR` 700/0px · body `NouvelR`
- 圆角 card 4px / button 46px / pill 46px · 间距基准 8px

## 版式与间距
- Base unit: 4px, with the working scale built on multiples of 4 and 8.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 20px · spacing.xl 24px ·…
- Section padding (full-bleed band → next band): spacing.section (80px) on desktop, collapsing to spacing.xxxl (40px) on…
- Promo-tile internal padding: spacing.xxl (32px) all sides on desktop.
- Configurator row vertical padding: spacing.xl (24px) top/bottom with hairline divider between rows.

## 形状
- Vehicle photography is always square-cornered (rounded.none). No rounded vehicle hero shots, no soft-edged car cards.
- Aspect ratios cluster around 16:9 (hero bands), 1:1 (square promo tiles), and 4:3 (vehicle range cards). Lifestyle imagery sometimes runs…
- Avatars and small profile cues — when present — use rounded.full circles to contrast with the otherwise square geometry.

## 该做
- Reserve colors.primary exclusively for primary CTAs, "yeni"/"NEW" badges, and at most one accent promo tile per band — component.promo-tile-yellow is…
- Pair colors.primary only with colors.on-primary text. Yellow + white is forbidden.
- Set everything in NouvelR — no secondary serif, no script, no decorative italic.
- Hold display headlines at typography.display-xl weight 700 with `lineHeight: 0.95` so they stack tightly on multi-line wraps.

## 避免
- Use rounded.xs (2px) on every standard button — the near-flat corner is part of the brand.
- Switch full bands between colors.canvas and colors.surface-dark for storytelling rhythm. Avoid mid-greys as section backgrounds.
- Show vehicle photography full-bleed inside component.vehicle-card with copy stacked beneath, never overlaid.
- Use component.sub-nav-pill (rounded.pill) only for sub-nav and small filter rows — never for primary CTAs.
