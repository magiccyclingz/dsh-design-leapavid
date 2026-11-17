# Apple · 苹果

Apple's web presence is a masterclass in reverent product photography framed by near-invisible UI. Every page is a stack of edge-to-edge product "tiles" — alternating light and dark canvases, each centered on a hero headline, a one-line tagline, two tiny blue pill CTAs, and an impossibly crisp product render. Nothing competes with the product. Typography is confident but quiet; color is either pure white, an…

- 画布 canvas `#ffffff` · 表面 surface `#fafafc` · 描边 `#dfdfe0`
- 文字 ink `#1d1d1f` · 次要 `#7e7e7e` · 强调 accent `#0066cc`（其上文字 `#ffffff`）
- 字体 display `SF Pro Display` 600/-0.28px · body `SF Pro Text`
- 圆角 card 11px / button 9999px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 8px. Sub-base values (2, 4, 5, 6, 7) are used for tight typographic adjustments; structural layout snaps…
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 17px · spacing.lg 24px · spacing.xl 32px ·…
- Section vertical padding: spacing.section (80px) inside a product tile; tiles stack edge-to-edge with 0 gap (the…
- Card padding: spacing.lg (24px) inside utility grid cards.
- Button padding: 8–11px vertical, 15–22px horizontal.

## 形状
- Hero imagery: full-bleed, 21:9 or taller on the homepage; 16:9 on environment and shop pages. Product renders are photographic-realistic, often…
- Product renders: PNG/WebP with transparency; rest on a surface tile and pick up the system shadow.
- Accessory grid: square 1:1 crops at rounded.lg (18px) radius, light neutral backgrounds, product centered with 20–40px internal padding.

## 该做
- Use colors.primary (Action Blue #0066cc) for every interactive element — links, pill CTAs, focus signals — and nothing else. The single accent is…
- Set headlines in typography.hero-display or typography.display-lg with negative letter-spacing (`-0.28 → -0.374px`) to get the signature "Apple tight" cadence.
- Run body copy at typography.body (17px / 400 / 1.47 / -0.374px) — not 16px. The extra pixel defines the brand's reading pace.
- Alternate component.product-tile-light (or parchment) and component.product-tile-dark for full-bleed section rhythm. The color change IS the divider.

## 避免
- Reserve rounded.pill for the primary blue CTA and any other element that should read as an "action" (configurator chips, search input, sticky bar CTA).
- Apply the single product-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) only to product renders resting on a surface — never on cards, buttons, or text.
- Use `transform: scale(0.95)` as the active/press state on every button — it's the system-wide micro-interaction.
- Keep the global nav colors.surface-black (true black) — it's the only place pure black appears on most pages.
