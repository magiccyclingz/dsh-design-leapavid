# Cal · Cal

Cal.com's marketing surface is a clean, friendly modern-SaaS interface — white canvas (#ffffff) with black primary CTAs (#111111), custom Cal Sans display typography, and `#f5f5f5` (#f5f5f5) light-gray cards holding product UI fragments. The system reads as confidently engineered without trying to impress — every band has clear hierarchy, generous…

- 画布 canvas `#ffffff` · 表面 surface `#f6f6f7` · 描边 `#e3e4e7`
- 文字 ink `#374151` · 次要 `#8b919a` · 强调 accent `#111111`（其上文字 `#ffffff`）
- 字体 display `Cal Sans` 600/-2px · body `Inter`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 24px · spacing.xl 32px ·…
- Section padding: spacing.section (96px) — the universal vertical rhythm between editorial bands.
- Card internal padding: spacing.xl (32px) for feature cards and pricing tier cards; spacing.lg (24px) for…
- Gutters: spacing.lg (24px) between cards in 3-up grids; spacing.md (16px) inside footer columns.

## 该做
- Reserve colors.primary (#111111) for primary CTAs and h1/h2 type. Cal.com's button is near-black, not blue.
- Use Cal Sans for every display headline. Pair with Inter body. Never blur the boundary.
- Apply negative letter-spacing on display sizes (-0.5 to -2px). Cal Sans without it reads as off-brand.
- Use component.feature-card (light gray) and component.product-mockup-card (white with chrome) deliberately — the gray cards signal "abstract feature claim"…

## 避免
- Embed real product UI fragments inside marketing cards. Don't paint marketing illustrations of the product when you can show the product itself.
- Keep avatar circles at 36px, perfect circles, sometimes with pastel fills. Avatars are the only place where badge pastels appear.
- Use component.nav-pill-group for grouped sub-nav segments. The pill-in-pill treatment is signature.
- End every page with the dark footer. The light-to-dark transition is part of the editorial rhythm.
