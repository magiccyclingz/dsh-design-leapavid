# SpaceX · SpaceX

Spasex's design language is an exercise in negation: pure black canvas, white display type set in tight vertical leading and uppercase, full-bleed photography or autoplaying rocket-launch video as the only chrome. There is no brand color beyond black-and-white; there are no decorative shapes; there are no card grids or pricing tables on the marketing pages. Every band is a single full-viewport photograph or video…

- 画布 canvas `#000000` · 表面 surface `#111111` · 描边 `#242424`
- 文字 ink `#ffffff` · 次要 `#6b6b6b` · 强调 accent `#ffffff`（其上文字 `#101114`）
- 字体 display `D-DIN-Bold` 700/1.6px · body `D-DIN`
- 圆角 card 16px / button 32px / pill 32px · 间距基准 8px

## 版式与间距
- Base unit: 8px (with denser sub-units 4 / 12 / 16 / 18 / 24).
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 18px · spacing.xl 24px ·…
- Section padding: full-viewport bands on marketing — no internal padding above/below; the photograph IS the section.…
- Marketing pages have no container — every band is full-viewport-width, full-viewport-height (or close to it) with…
- Shop product grid: 4-up at desktop, 2-up at tablet, 1-up at mobile.

## 该做
- Use full-bleed photography or autoplaying video as the dominant decorative element on every marketing band.
- Render display tiers in uppercase D-DIN-Bold with positive 0.96–1.6px letter-spacing — the wide tracking is the signature.
- Use a single button-ghost-on-dark per band — the brand does NOT show two CTAs side by side on marketing surfaces.
- Pair every photograph with type that respects the imagery — no scrims, no gradients, no overlays. Grade the photo, not the canvas.

## 避免
- Keep nav overlay-style (transparent, white-on-image) on marketing pages.
- Don't introduce brand accent colors — black, white, and photography are the entire palette.
- Don't use drop shadows or gradient overlays on dark canvas — they fight the photography.
- Don't render display tiers in sentence-case or title-case — uppercase is the brand.
