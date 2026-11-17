# Vercel · Vercel

Vercel is a developer-platform brand — the page is a deployment dashboard's marketing surface, written for engineers who already know the syntax. It earns that posture with one of the cleanest stark systems on the web: near-white `#fafafa` body background, ink-near-black text, a 200-step gray scale that gives every divider, border, and disabled state its own deliberate step. The only…

- 画布 canvas `#ffffff` · 表面 surface `#f7f7f7` · 描边 `#e6e6e6`
- 文字 ink `#4d4d4d` · 次要 `#8b8b8b` · 强调 accent `#171717`（其上文字 `#ffffff`）
- 字体 display `Geist` 600/-2.4px · body `Geist`
- 圆角 card 8px / button 100px / pill 100px · 间距基准 8px

## 版式与间距
- Base unit: 4 px. The brand's `--geist-space` token is exactly 4 px and every captured value is a multiple of 4.
- Tokens: spacing.xxs 4 px · spacing.xs 8 px · spacing.sm 12 px · spacing.md 16 px · spacing.lg 24 px · spacing.xl 32…
- Section padding: marketing bands use spacing.4xl to spacing.5xl top/bottom. Hero bands stretch to spacing.section…
- Card interior padding: marketing cards sit at spacing.lg to spacing.xl; template-grid cards stay tighter at…
- Inline gap: button rows, nav rows, and chip rows use spacing.sm to spacing.md between siblings. The brand's…

## 形状
- Mesh gradient: full-bleed 2-D atmospheric backdrop, never cropped to a frame; treated as the page's wallpaper.
- Customer logos: monochrome SVG, consistent 24 px height in a flex row.
- Code editor mockup: 16:10 dark rectangle, rounded.md corners.

## 该做
- Reserve colors.primary (`#171717`) for primary CTAs across the page. Black ink IS the conversion target.
- Use rounded.pill 100 px for every marketing-scale CTA and rounded.sm 6 px for nav-scale buttons. The two pill scales coexist deliberately.
- Set every headline in typography.display-* weight 600, sentence-case, often period-terminated. Aggressive negative tracking is part of the voice.
- Use the brand mesh gradient as atmospheric decoration at hero scale only — never miniaturise it to an icon, never reduce to a single colour.

## 避免
- Layer stacked shadows (multiple small offsets with inset hairline) rather than single heavy drops. The brand's elevation is calmer than Material.
- Cycle page surfaces in colors.canvas-soft → colors.canvas → colors.primary polarity-flipped bands; the dark band IS the depth cue.
- Set every code block and technical eyebrow in typography.code / typography.caption-mono. Mono is the voice of the platform.
- Don't introduce a sixth accent colour. The brand operates with ink + gray + the four-pair gradient palette; new accents flatten the voice.
