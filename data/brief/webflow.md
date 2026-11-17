# Webflow · Webflow

Webflow positions itself as the visual web development platform — the marketing surface reads as a confident professional product, not a tech startup. The default page is a generous white canvas () with a deep near-black `#080808` (`#080808`) for the brand's primary CTA, typography, and ink. Around this restrained primary, the brand layers a five-stop chromatic accent system —…

- 画布 canvas `#ffffff` · 表面 surface `#f6f6f6` · 描边 `#e3e3e3`
- 文字 ink `#363636` · 次要 `#8a8a8a` · 强调 accent `#080808`（其上文字 `#ffffff`）
- 字体 display `WF Visual Sans Variable` 600/-0.8px · body `WF Visual Sans Variable`
- 圆角 card 8px / button 4px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4 px (with frequent 0.4 / 0.8 sub-multiples for fine padding).
- Tokens: spacing.xxs 2 px · spacing.xs 4 px · spacing.sm 8 px · spacing.md 12 px · spacing.lg 16 px · spacing.xl 20…
- Section padding: hero / content bands use spacing.3xl 32 px gutters with generous vertical spacing.
- Card interior padding: feature and pricing cards sit at spacing.3xl 32 px.
- Marketing container is wide (effectively edge-to-edge with spacing.3xl gutters).

## 该做
- Reserve colors.primary (`#080808`) for every primary CTA, every heading, and every wordmark. Near-black is the conversion colour.
- Use the five chromatic accents (purple / pink / blue / orange / green) as full-fill category cards, NOT as button backgrounds.
- Set hero headlines in typography.display-xxl weight 600 with `-0.8 px` tracking.
- Pair the proprietary WF Visual Sans family across every typographic role.

## 避免
- Use rounded.sm 4 px for buttons, rounded.md 8 px for cards. The brand never uses pill CTAs.
- Use layered multi-stop drop-shadows on featured cards — the brand's distinctive elevation recipe.
- Don't promote button-medium weight to 700+. The brand's weight ceiling is 600.
- Don't use chromatic accents as button backgrounds. They're surface fills, not actions.
