# Warp · Warp

Warp is an "agentic development environment" — a terminal application that wraps an AI agent — and its marketing site mirrors the product's posture: a single dark band running the entire page, warmer than pure black ( `#2b2622` carries a hint of brown-beige from the brand's oklch-defined warmth value), with copy set almost entirely in Inter. The page reads more like a developer's reading-mode editor…

- 画布 canvas `#2b2622` · 表面 surface `#383330` · 描边 `#48433f`
- 文字 ink `#f7f5f0` · 次要 `#aea69c` · 强调 accent `#f7f5f0`（其上文字 `#101114`）
- 字体 display `Inter` 400/-1.6px · body `Inter`
- 圆角 card 4px / button 9999px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4 px (with occasional 10 px and 6 px values for button padding).
- Tokens: spacing.xxs 2 px · spacing.xs 4 px · spacing.sm 8 px · spacing.md 10 px · spacing.lg 16 px · spacing.xl 24…
- Section padding: hero / content bands use spacing.5xl 96 px on desktop.
- Card interior: cards sit at spacing.xl 24 px.
- Marketing content centres at roughly 1200 px width.

## 形状
- Terminal mockups: ~3:2 inside rounded.md card chrome.
- Partner logos: monochrome SVGs at consistent 24 px height inside tile cards.
- Testimonial portraits: 1:1 square inside rounded.md.

## 该做
- Reserve colors.primary off-white for primary CTA pills and default text. There is no chromatic accent.
- Use tight rounded.sm 3 px or rounded.md 4 px button radii. The brand never uses generous pills for CTAs.
- Set hero headlines in Inter weight 400 with `-1.6 px` tracking. The brand reads as quietly confident.
- Pair Inter (sentence-case) with DM Mono (code blocks, terminal mockups).

## 避免
- Keep the warm-dark canvas tone — pure black breaks the brand's identity.
- Don't introduce a chromatic brand accent. The off-white-on-warm-dark IS the brand's voice.
- Don't render the hero headline in heavy weight (700+). The brand's display is intentionally light.
- Don't use generous pill CTAs. The brand's button radius is 3-4 px, almost rectangular.
