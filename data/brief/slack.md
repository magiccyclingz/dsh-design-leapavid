# Slack · Slack

Slacc's design language centers on a deep aubergine primary (`#4a154b`) — the brand's most enduring visual asset — applied as the dominant button color, the footer band, the featured pricing tier, and the brand wordmark. Around that aubergine the system stages an unusually delicate ecosystem: cream-lavender hero canvases with soft pastel-mesh gradients (peachy oranges, lavenders, dusty greens) that pulse…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#dfdfdf`
- 文字 ink `#1d1d1d` · 次要 `#7c7c7c` · 强调 accent `#4a154b`（其上文字 `#ffffff`）
- 字体 display `Salesforce-Avant-Garde` 700/-0.77px · body `Salesforce-Sans`
- 圆角 card 8px / button 90px / pill 90px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with 4 / 12 / 16 / 20 / 24 / 28 sub-tokens for fine vertical rhythm).
- Tokens: spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 20px · spacing.xxl 24px ·…
- Section padding: 64–96px on marketing surfaces; tightens to 48px on transactional pages.
- Card internal padding: 32px on pricing cards; 48px on aubergine band cards.
- Marketing pages center in a ~1240px container with edge-bleeding pastel-mesh gradients escaping the container.

## 该做
- Reserve colors.primary aubergine for filled CTAs, the featured pricing tier, and the closing aubergine band — it's the brand's chromatic monotheism.
- Use rounded.pill (90px) for every button across the system — never a rounded-rectangle button.
- Pair display tiers with negative letter-spacing (`-0.768px` at 64px); the proprietary face needs the tracking pull.
- Compose hero bands with pastel-mesh gradient backdrop + floating product UI mockup; the gradient is the depth.

## 避免
- Use colors.link-blue for inline links — it's the only chromatic departure from aubergine and is part of the brand voice.
- Don't add a third accent color to the system — the aubergine + blue link combination is exhaustive.
- Don't shrink button padding below `14px 28px` — the over-padded pill is part of the brand feel.
- Don't render display tiers at default tracking (0) — without negative letter-spacing the headlines read loose and unedited.
