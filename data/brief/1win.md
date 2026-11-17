# 1win · 1win

1win is a crypto casino and sportsbook that runs almost entirely on a near-black canvas (#141415), a flat, slightly cool dark field that lets thousands of vibrant game thumbnails do the shouting. The chrome around the content is deliberately quiet: dark-grey surfaces (#2e3035), faint translucent hairlines, and off-white text (#f0f2f5). Against that restraint…

- 画布 canvas `#141415` · 表面 surface `#2e3035` · 描边 `#333334`
- 文字 ink `#f0f2f5` · 次要 `#9aa1b1` · 强调 accent `#00b24b`（其上文字 `#ffffff`）
- 字体 display `Inter` 800/0px · body `Inter`
- 圆角 card 8px / button 6px / pill 999px · 间距基准 4px

## 版式与间距
- Base unit: 8px.
- Tokens (front matter): spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px ·…
- Controls run tight — spacing.sm×spacing.md (8×12px) is the recurring button padding; cards and panels use…

## 该做
- Reserve colors.primary (green) for primary actions — Registration, confirm, place-bet — and colors.secondary (blue) for secondary actions, links, and…
- Build depth with the surface ladder (colors.canvas → colors.surface) plus a faint colors.hairline edge; avoid heavy shadows.
- Set every label in Inter 600+ (typography.body / typography.caption); use the 800 weight for headlines and bonus figures.
- Let game and promo artwork supply the color — keep the surrounding chrome monochrome dark.

## 避免
- Use rounded.lg–rounded.xl on buttons, rounded.card (16px) on tiles/cards/panels, and rounded.full on pills and badges.
- Pair accent fills with colors.on-primary (white) text for legibility.
- Don't promote game-tile or bonus-banner gradient colors (the purples, reds, violets, ambers) into the UI palette — they are content, not chrome.
- Don't add a third structural accent; the system is green + blue only.
