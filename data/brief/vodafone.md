# Vodafone · 沃达丰

Vodafone is a global telecom super-brand and its web surface delivers exactly that posture: heroic editorial photography, occasionally cropping a portrait so tight only an eye line and a phone hand are visible, with a single colossal uppercase headline floating on top in the brand's proprietary heavy display weight. The page reads like a campaign poster more than a corporate site, then breaks into a calmer content…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#e0e1e1`
- 文字 ink `#25282b` · 次要 `#818284` · 强调 accent `#e60000`（其上文字 `#ffffff`）
- 字体 display `Vodafone` 800/-1px · body `Vodafone`
- 圆角 card 6px / button 6px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4 px (mostly multiples of 4; a few 5/7 px appear inside icon-padding compensation).
- Tokens: spacing.xxs 2 px · spacing.xs 4 px · spacing.sm 8 px · spacing.md 12 px · spacing.lg 16 px · spacing.xl 20…
- Section padding: hero bands and content bands use spacing.3xl 32 px gutters; vertical spacing inside hero is fluid…
- Card interior padding: story cards use spacing.lg 16 px around image + headline.
- Inline gap: button rows and chip rows use spacing.md 12 px between siblings.

## 形状
- Hero portraits: edge-to-edge 16:9 or 4:3 with no internal frame.
- Story-card thumbnails: 16:9 landscape inside rounded.card chrome.
- Speechmark logo orb: square with rounded.sm corners (visually a tilted-square mark; the SVG mark itself fills the orb).

## 该做
- Reserve colors.primary Vodafone Red for primary CTAs and the `speechmark-logo-orb`. Every conversion target uses the red pill.
- Set hero headlines in typography.display-hero weight 800 UPPERCASE with tight `-1px` tracking. That stencil look IS the brand voice.
- Use rounded.pill-lg 60 px on every interactive pill. The brand never uses square corners on CTAs.
- Cycle page surfaces in colors.ink dark hero → colors.canvas light content → colors.ink footer. Surface contrast is the depth cue.

## 避免
- Pair editorial portrait photography with the massive display headline overlay — that combination IS the brand's signature.
- Render the speechmark logo orb at consistent size relative to surrounding content — it's the brand's centre of gravity on every page.
- Don't introduce a second accent colour. The brand operates with red + ink + grayscale only.
- Don't render headlines in sentence case at hero scale. Hero display IS uppercase weight 800.
