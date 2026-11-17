# WIRED · WIRED

Wired is the flagship technology-magazine brand under Condé Nast — and the web surface refuses to dress itself as a SaaS marketing site. The page is unmistakably an editorial product: a white canvas, a strict black wordmark in the brand's proprietary `WiredDisplay` (a tall, narrow, high-contrast serif used at 64 px), and stacked story cards that read as a printed magazine grid ported to the screen. There is no…

- 画布 canvas `#ffffff` · 表面 surface `#f9f9f9` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#909090` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `WiredDisplay` 400/-0.5px · body `Apercu`
- 圆角 card 12px / button 8px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4 px.
- Tokens: spacing.xxs 2 px · spacing.xs 4 px · spacing.sm 8 px · spacing.md 12 px · spacing.lg 16 px · spacing.xl 20…
- Section padding: hero / story grid use spacing.4xl 48 px top/bottom on desktop.
- Story row padding: spacing.lg 16 px vertical between bylined story rows.
- Marketing content uses a wide container (~1400 px max).

## 形状
- Cover stories: 16:9 hero, edge-to-edge.
- Secondary story cards: 4:3 thumbnails.
- Article body images: native aspect, full column width.

## 该做
- Reserve colors.primary black for the wordmark, every CTA, and the footer fill. The brand IS the strict black-on-white duet.
- Set hero headlines in typography.display-hero (WiredDisplay 64 px weight 400). The proprietary serif IS the brand's typographic signature.
- Use rounded.none 0 px on every button and form input. The brand reads as a printed magazine — square corners are non-negotiable.
- Pair WiredDisplay (serif display) with BreveText (serif body) and Apercu (sans labels). Three faces, three roles.

## 避免
- Render story rows with colors.hairline 1 px dividers — the brand's only elevation cue.
- Don't introduce a chromatic brand accent. The link blue is reserved for inline body links inside articles only.
- Don't round button corners. The brand never softens its rectangular geometry.
- Don't drop a soft drop-shadow on cards. Surface contrast and hairlines carry elevation.
