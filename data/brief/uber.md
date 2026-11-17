# Uber · Uber

Uber is a transportation-and-delivery super-app — ride, eats, freight, the whole urban logistics layer — and the brand's web surface signals that scale through restraint: no third colour, no accent palette, no illustration that fights the headline. The page is structurally a black-and-white duet, where black `#000000` is the conversion anchor (every CTA pill, every nav login button, the footer fill) and…

- 画布 canvas `#ffffff` · 表面 surface `#f8f8f8` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#858585` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `UberMove` 700/0px · body `UberMoveText`
- 圆角 card 8px / button 999px / pill 999px · 间距基准 6px

## 版式与间距
- Base unit: 4 px. Most captured values are multiples of 4 with a few 6-px sub-multiples (10, 14) inside button…
- Tokens: spacing.xxs 4 px · spacing.xs 6 px · spacing.sm 8 px · spacing.md 12 px · spacing.lg 16 px · spacing.xl 20…
- Section padding: marketing bands sit at spacing.3xl 32 px top/bottom on tighter pages and `{spacing.3xl}…
- Card interior padding: content cards sit at spacing.2xl 24 px; the ride-request form uses spacing.lg 16 px to keep…
- Inline gap: button rows, category chip rows, app-store pill rows use spacing.md 12 px between siblings.

## 形状
- Editorial illustrations: 4:3 landscape inside promo cards; 16:9 for full-width showcase frames.
- Driver / rider portraits: 4:5 portrait crop; framed by rounded.xl 16 px card chrome.
- Annual showcase image: 2:3 portrait at desktop, scaling to 4:3 at mobile. The image fills the card; the headline overlays the bottom.

## 该做
- Reserve colors.primary (`#000000`) for every primary CTA pill. One black pill per visible viewport is the brand's whole conversion story.
- Use rounded.pill 999 px on every interactive element (buttons, chips, app pills). The pill IS the brand's geometric signature.
- Render cards in rounded.xl 16 px — promo cards, content cards, the ride-request form card, the annual-showcase card all share this radius.
- Set every headline in typography.display-* weight 700 in sentence-case. The display face never carries body copy.

## 避免
- Use polarity-flipped black promo bands mid-page to break up white-on-white rhythm. The polarity shift IS the depth cue.
- Anchor every promo card with a 4:3 editorial illustration; never use generic stock imagery.
- Don't introduce a second brand accent colour (orange, blue, green). The brand's entire UI is black-and-white plus grayscale; new accents flatten the system.
- Don't render the primary CTA as a rounded.xl rectangle except inside the larger ride-request flow (where `button-large-rounded` is the documented exception).
