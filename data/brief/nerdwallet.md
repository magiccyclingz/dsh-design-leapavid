# NerdWallet · NerdWallet

NerdWallet is a comparison engine wearing an editorial coat, and the design reflects both halves. Article pages open on a wide `#008254` gradient band carrying a white headline, a byline row and a set of trust badges — the only place the brand raises its voice. Everything below that band drops to and `#f7f7f7`, where dense rate tables and product cards do the actual work. The…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#008254`（其上文字 `#ffffff`）
- 字体 display `Gotham` 700/0px · body `Gotham`
- 圆角 card 6px / button 4px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 8px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 20px · spacing.xl 24px ·…
- spacing.md is the universal control padding — both button-primary and button-secondary use a flat 16px on all sides…
- button-outline breaks that pattern with `8px 16px`, making it visibly shorter than the filled buttons beside it.

## 该做
- Spend colors.primary on actions and active states only — buttons, rating stars, active tabs, in-body links.
- Reach for the mint ladder (colors.mint-50 → colors.mint-200) when a section needs separation; it is the system's substitute for elevation.
- Keep controls at rounded.xs and cards at rounded.lg; save rounded.xxxl for decorative panels and photo frames.
- Separate table rows with a single colors.hairline rule and no vertical dividers.

## 避免
- Use the lime family for emphasis that has to survive on a green ground, where colors.primary would disappear.
- Set headings in colors.ink pure black and body copy at weight 300 — the weight gap is the hierarchy.
- Give every comparison figure a typography.caption label above it in colors.body, never inline.
- Open editorial pages with hero-band and then drop immediately to a light canvas; do not carry the green further down.
