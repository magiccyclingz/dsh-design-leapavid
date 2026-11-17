# Replicate · Replicate

Replicate is a developer-tools platform with the soul of an art zine. The public marketing surfaces sit on a warm cream canvas (#f9f7f3) rather than the white-or-near-black default of typical AI infrastructure sites, and that single decision colours everything else: photography reads as editorial, code wells read as printed pull-quotes, and the brand orange (#ea2804)…

- 画布 canvas `#f9f7f3` · 表面 surface `#efedea` · 描边 `#dbd9d5`
- 文字 ink `#202020` · 次要 `#7b7a79` · 强调 accent `#ea2804`（其上文字 `#ffffff`）
- 字体 display `rb-freigeist-neue` 700/-3px · body `basier-square`
- 圆角 card 10px / button 6px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4px, with the working scale on multiples of 4 / 8 / 16.
- Tokens: spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 24px ·…
- Section padding: spacing.section (96px) vertical between full-width bands; spacing.band (160px) when a band needs extra…
- Card internal padding: spacing.lg (16px) on component.model-card, spacing.xxl (32px) on component.pricing-tier.
- Max content width ≈ 1280px on body sections, 1440px on hero bands which run full-bleed.

## 形状
- Model thumbnails: square (1:1) with rounded.md corners, full-bleed image to the card edge.
- Hero example outputs: 4:3 or 16:9 with rounded.md corners.
- Contributor avatars: circular (rounded.full), 40px on home, 32px in card metadata.

## 该做
- Use colors.canvas (cream) as the default page background. White (colors.surface-card) appears only on individual cards, inputs, and the hero illustration…
- Reserve colors.primary for the primary CTA, the home hero band, and inline links — three roles, nothing else.
- Set every interactive element to rounded.full — buttons, inputs, badges, avatars, pills.
- Step content cards up to rounded.md (10px) or rounded.lg (16px) — never sharp corners.

## 避免
- Open hero bands with typography.display-xxl (128px) and typography.display-xl (72px) at `lineHeight: 1.0` with negative letter-spacing.
- Use `rb-freigeist-neue` for all display, `basier-square` for UI/body, `jetbrains-mono` for code. Keep the lanes strict.
- Render code in component.code-block with a colors.surface-dark background — code is print, not an inline grey box.
- Pair photography with rounded.md corners and full-bleed crop inside cards.
