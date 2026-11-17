# HP · HP

HP reads like a long-running consumer-electronics catalog crossed with an enterprise-software product page. The whole system sits on pure white ( — `#ffffff`) with thin gray panels (`#f7f7f7` / `#e8e8e8`) for alternating section bands. There is one chromatic action color — HP Electric Blue (#024ad8) — and one ink color (#1a1a1a); together…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#dfdfdf`
- 文字 ink `#1a1a1a` · 次要 `#7a7a7a` · 强调 accent `#024ad8`（其上文字 `#ffffff`）
- 字体 display `Forma DJR Micro` 500/0px · body `Forma DJR Micro`
- 圆角 card 4px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 8px. Smaller half-step at 4px. The scale is gentle — most card padding lands at 16px or 24px; section…
- Tokens (front matter): spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 20px ·…
- Section padding: spacing.section (80px) vertical between major bands on desktop; collapses to ~48px on mobile.
- Card internal padding: spacing.xl (24px) for product cards; spacing.xxl (32px) for promo strips and feature cards…
- Gutter: spacing.xl (24px) between grid columns at desktop; spacing.md (16px) on tablet/mobile.

## 该做
- Reserve colors.primary for the primary CTA, link color, and `chevron-decoration` motif — at most twice per viewport
- Set every headline in Forma DJR Micro at weight 500 with line-height 1.0 — resist the urge to bump weight at hero scale
- Use rounded.xl (16px) for cards and photo frames; rounded.md (4px) for buttons and inputs — keep the two-tier split sharp
- Pair white colors.canvas body bands with colors.cloud (`#f7f7f7`) alternating bands; let the gray do the breathing

## 避免
- Close every page rhythm with a dark-navy colors.ink slab — the "How can we help?" prelude + footer
- Set button labels in uppercase with typography.button-md (0.7px tracking) — the only place the system tracks letters
- Use Soft Lift shadow exclusively for product cards and pricing tiers — leave section bands flat
- Frame product photography inside rounded.xl containers; never use full-bleed circular masks
