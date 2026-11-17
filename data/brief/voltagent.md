# VoltAgent · VoltAgent

Voltagent is an AI agent engineering platform built for developers, and the brand wears that audience proudly: a near-black (`#101010`) page background that runs edge-to-edge with no light-mode counterpart, a single electric-green accent (`#00d992` `#00d992`) reserved for CTAs, status pills, and the brand lightning glyph, and a typography system that pairs sentence-case Inter with SF Mono…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dedede`
- 文字 ink `#101010` · 次要 `#747474` · 强调 accent `#03b57b`（其上文字 `#ffffff`）
- 字体 display `Inter` 400/-0.65px · body `Inter`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4 px; small 5 / 6.4 px values appear inside code-mockup line-height compensation.
- Tokens: spacing.xxs 2 px · spacing.xs 4 px · spacing.sm 8 px · spacing.md 12 px · spacing.lg 16 px · spacing.xl 20…
- Section padding: hero + content bands use spacing.5xl 48 px top/bottom.
- Card interior padding: feature cards sit at spacing.2xl 24 px.
- Marketing container centres at roughly 1200 – 1400 px; content stays edge-to-edge in colour with horizontal gutters of…

## 该做
- Reserve colors.primary (`#00d992`) for every primary CTA, the lightning logo glyph, and live-status indicators. The green is the brand's centre of gravity.
- Use the dark colors.canvas (`#101010`) as the only page surface. There is no light-mode rhythm.
- Build cards with 1 px colors.hairline borders, not shadows. Hairlines on dark IS the brand's elevation system.
- Pair Inter (sentence-case) with SF Mono (inline code, command snippets). Every uppercase moment uses Inter at weight 600 with `2.52 px` tracking — not a…

## 避免
- Use rounded.sm 6 px for buttons, rounded.md 8 px for cards, rounded.pill 9999 px only for inline status tags.
- Don't introduce a light-mode counterpart. The brand is dark-canvas only.
- Don't use the primary green as a body-text fill. It's CTA-only.
- Don't drop a soft drop-shadow on cards. The brand uses hairlines + occasional glow, never material shadows.
