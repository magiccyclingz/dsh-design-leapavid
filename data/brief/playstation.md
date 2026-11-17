# PlayStation · PlayStation

PlayStation's marketing system reads like a console launch trailer scrolling past the viewer in chapters. Each section is a full-bleed band — pure black , true white , or PlayStation Blue `#0070d1` — and each chapter owns one editorial moment: hero console photography, a games-coming-soon strip, the PlayStation Plus tier banner, the "30 Years of PlayStation"…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#0070d1`（其上文字 `#ffffff`）
- 字体 display `PlayStation SST` 300/-0.1px · body `PlayStation SST`
- 圆角 card 8px / button 4px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 8px (with finer 4/12px steps for tight inline gaps).
- Tokens (front matter): spacing.xxs (4px) · spacing.xs (8px) · spacing.sm (12px) · spacing.md (16px) · spacing.lg…
- Universal section rhythm: every page in the set uses spacing.section (96px) as the vertical gap between major…
- Hero band padding: 96px vertical / 48px horizontal — the largest spacing in the system, reserved for full-bleed…
- Max width: ~1280px content area for body text on desktop with 24px gutters that expand to ~48px at ultrawide. Hero…

## 形状
- Hero console render: large centered console + DualSense composition on white, ~70% width of the band, with copy slot to the left.
- Game tiles: 16:9 key art at rounded.md (8px), 4-up rail at desktop with horizontal carousel.
- Marathon game page hero: full-bleed cinematic 16:9 still with the "MARATHON" wordmark in the lower-left at light weight, brand yellow…

## 该做
- Reserve colors.primary (PlayStation Blue) for primary CTAs and the footer surface only. The blue band is precious — at most one full-bleed blue band per page.
- Reserve colors.commerce (orange) for store/buy/pre-order CTAs only. It is never used on marketing chrome or hero pills.
- Use PlayStation SST at weight 300 for display headings (54 / 44 / 35 / 28 / 22). The light weight is the brand voice.
- Stack content sections at spacing.section (96px) rhythm with the next band's surface color taking over the page edge-to-edge — no decorative dividers between…

## 避免
- Use rounded.full (9999px) on every CTA pill and rounded.md (8px) on every product card. The two-radius vocabulary is the entire shape system aside from inputs.
- Pair full-bleed game key art and console renders inside dark or light bands; let imagery occupy 60-90% of the band's vertical height.
- Use component.ps-plus-banner with the gold gradient exclusively for the PlayStation Plus tier callout — never decorate other components with the gold.
- Don't introduce drop shadows on resting cards. The system is flat-on-canvas; cards lift only on press.
