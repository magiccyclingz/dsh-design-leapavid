# SAP · SAP

SAP's web surface is built like an application frame rather than a marketing site. A 60px bar in `#f5f6f7` sits across the top, and on any product or services page a second rail drops beneath it carrying a breadcrumb and a row of tabs. That two-storey chrome is the first thing the design commits to: before a visitor reads a headline they have been told where they are in a very large catalogue, and the page…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#0057d2`（其上文字 `#ffffff`）
- 字体 display `72 Brand Variable` 700/0px · body `72 Brand Variable`
- 圆角 card 8px / button 4px / pill 9999px · 间距基准 3px

## 版式与间距
- Base unit: 8px, with a fine sub-step at the small end for control padding.
- Tokens: spacing.xxs 2px · spacing.xs 3px · spacing.sm 8px · spacing.md 9px · spacing.lg 10px · spacing.xl 12px ·…
- Controls sit at the tight end: component.button-primary pads `12px 14px` and component.button-outline `8px 9px`. The…

## 该做
- Keep colors.primary for things that act — buttons, inline links, the active tab — and let everything else stay neutral.
- Separate sections with a full-width band rather than a border or a shadow. The bands are this layout's punctuation.
- Run every band square. rounded.none at full width is what makes a zone read as a zone.
- Use the weight axis at small sizes. typography.list-item at 350 and typography.nav-link at 400 are the same size on purpose.

## 避免
- Set headings in true colors.ink black and step body copy down into colors.ink-body slate. The hue shift carries the hierarchy.
- Keep the chrome in colors.ink-nav grey so navigation stays visually distinct from content text.
- Cap controls at rounded.md and media at rounded.lg.
- Let the product illustrations carry the shadows. Floating UI cards inside an image are depicting an interface, not decorating a section.
