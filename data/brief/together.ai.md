# Together AI · Together AI

Together AI is an AI cloud-infrastructure platform — model inference, GPU clusters, fine-tuning, all the plumbing that makes "the AI native cloud" deliverable to a developer team — and the brand's web surface signals exactly that posture: a near-black hero on top, a long ribbon of white technical content in the middle, and a single recurring piece of brand chrome — a three-color orange-magenta-periwinkle gradient…

- 画布 canvas `#ffffff` · 表面 surface `#fafafa` · 描边 `#dddddd`
- 文字 ink `#0d0d0d` · 次要 `#868686` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `The Future` 500/-1.92px · body `The Future`
- 圆角 card 8px / button 4px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4 px. Almost every captured value is a multiple of 4, with two exceptions (7.2 px, 55.2 px) that are…
- Tokens: spacing.xxs 2 px · spacing.xs 4 px · spacing.sm 8 px · spacing.md 12 px · spacing.lg 16 px · spacing.xl 20…
- Section padding: marketing bands use spacing.section 80 px top/bottom on desktop. The hero and the "research" dark…
- Card interior padding: research cards and testimonial cards sit at spacing.2xl 24 px interior; the stat-card tiles…
- Inline gap: button + nav rows use spacing.md 12 px between siblings; chip groups use spacing.sm 8 px.

## 形状
- Hero ribbon: SVG gradient, free-form; no aspect-ratio constraint.
- Customer logos: vector, rendered grayscale at consistent height (~24 px) in a wrapping flex row.
- Testimonial portraits: 1:1 square crop with hard-edge corners — no avatar pill.

## 该做
- Reserve colors.primary (`#000000`) for every primary CTA. One black pill per visible viewport — that consistency is the brand's whole conversion story.
- Set every section eyebrow and button label in typography.mono-caps-button / typography.mono-caps-eyebrow — uppercase mono, positive tracking.
- Pair the brand gradient (colors.accent-orange → colors.accent-magenta → colors.accent-periwinkle) at hero scale only. The gradient is the brand chrome; never…
- Cycle page surfaces in the colors.canvas-dark → colors.canvas → colors.canvas-dark rhythm; the dark-light contrast carries elevation more than any shadow.

## 避免
- Use rounded.sm 4 px as the canonical card / button radius across the system; reserve rounded.full for the single floating chat-launcher orb.
- Render the giant `together.ai` wordmark banner at the bottom of every long page in typography.display-xxl, tinted toward colors.hairline so it reads as a…
- Don't introduce a fifth accent colour. The three-stop gradient + mint pill is the entire decorative palette; new accents flatten the brand.
- Don't set body paragraphs in the mono face. The mono is for labels only; long-form mono reads as a console log, not as marketing copy.
