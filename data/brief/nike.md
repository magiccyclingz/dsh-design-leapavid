# Nike · Nike

Nike's commerce system is built on a single, almost violently simple idea: photography speaks, the chrome doesn't. Every page reads as an athletic editorial — towering uppercase Futura display lockups (`{typography.display-campaign}`) burned into full-bleed campaign imagery, with everything else (nav, filters, buttons, cards, footer) reduced to neutral typography and pill geometry on and…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dedede`
- 文字 ink `#111111` · 次要 `#757575` · 强调 accent `#111111`（其上文字 `#ffffff`）
- 字体 display `Nike Futura ND` 500/0px · body `Helvetica Now Text Medium`
- 圆角 card 24px / button 18px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px
- Tokens (front matter): spacing.xxs (2px) · spacing.xs (4px) · spacing.sm (8px) · spacing.md (12px) · spacing.lg…
- Universal rhythm: every page in the set uses spacing.section (48px) as the vertical gap between major content…
- Card internal padding: product cards use 0px internal padding — image is full-bleed; metadata rows sit directly…
- Max width: ~1440px content area with edge gutters that grow to ~80px at 1920px (the system lets very wide viewports…

## 形状
- Product cards: consistent 1:1 square or near-square (~4:5 portrait on tall product crops), full-bleed within the card with no padding, sitting on…
- Editorial campaign hero: ~16:9 or wider cinematic crop, full-bleed across the content max-width, with the Futura display headline burned into the…
- Sport-category rail: 4:5 portrait full-bleed thumbnails with a small CTA pill anchored bottom-left.

## 该做
- Reserve typography.display-campaign exclusively for editorial campaign hero lockups — never use 96px Futura for section headers or product titles.
- Use component.button-primary (colors.ink pill) as the single primary action per viewport. Pair it at most with component.button-secondary (colors.soft-cloud…
- Stage every product photograph on colors.soft-cloud — the gray is the system's "studio."
- Keep all CTAs pill-shaped at rounded.lg (30px). Never introduce a square or rounded.sm button.

## 避免
- Use colors.sale only on price rows — never on backgrounds, badges, or chrome.
- Stack content sections at spacing.section (48px) rhythm with no decorative dividers between them; the photography's bleed-edge is the divider.
- Anchor on-image CTAs with component.button-outline-on-image (white pill) at bottom-left — the system's universal "shop this image" position.
- Don't introduce drop shadows or card elevation. Cards sit flat on the page; the only depth cue is the 1px inset hairline on sticky bars.
