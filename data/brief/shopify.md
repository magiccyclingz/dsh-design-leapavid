# Shopify · Shopify

Shopifi runs two parallel design tracks that share typographic DNA and a single button vocabulary, but diverge in canvas polarity. The marketing track lives on (`#000000`) — full-bleed cinematic photography of merchants, giant `{typography.display-xxl}` headlines in Neue Haas Grotesk Display set at weight 330 (a thin, almost editorial cut), and a single CTA: a white-stroked black pill with…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `NeueHaasGrotesk Display` 330/1.92px · body `Inter Variable`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with denser sub-units 1, 2, 3, 4 for fine work).
- Tokens: spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 24px ·…
- Section padding: spacing.huge 64–128px on cinematic marketing pages (extreme negative space is the point)…
- Card internal padding: spacing.xxl 32px on pricing cards; spacing.xl 24px on compact tag rows.
- Cinematic hero pages use a wide max-width container (~1440–1600px) with edge-bleeding photography that escapes the…

## 该做
- Reserve colors.aloe-10 and colors.pistachio-10 for the light track only — they don't appear on cinematic black pages.
- Always use rounded.pill for buttons; never rounded.md or rounded.lg.
- Render display tiers at weight 330; bumping to 400 or 500 breaks the brand's thin-display signature.
- Use full-bleed photography on cinematic pages — let it escape the container.

## 避免
- Apply `font-feature-settings: "ss03"` globally; the stylistic set is the brand's typographic signature.
- Pair black canvas with white type and white-stroked outline pills; pair light canvas with black type and filled-black pills.
- Don't introduce a third canvas color — stick to black or light/cream. Greys, beiges, and blues are not in the system.
- Don't add drop shadows on cinematic dark cards beyond the subtle inset top-highlight; the cinematic track wants flat blackness.
