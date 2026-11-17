# DJI · 大疆

DJI's site works like a brightly lit product showroom. The page is a white canvas () tiled edge to edge with studio photography: a full-height hero carousel of a single hero product over dark or sky backdrops, then a two-up grid of square-cornered product tiles separated by thin white gutters, each tile a soft grey render of a drone, gimbal or microphone with its name set as large, light-weight…

- 画布 canvas `#ffffff` · 表面 surface `#f6f8f9` · 描边 `#e1e1e1`
- 文字 ink `#262626` · 次要 `#818181` · 强调 accent `#0070d5`（其上文字 `#ffffff`）
- 字体 display `Open Sans` 600/-1.44px · body `Open Sans`
- 圆角 card 8px / button 100px / pill 100px · 间距基准 8px

## 版式与间距
- Base unit: 4px, mostly in 8px steps.
- Tokens (front matter): spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.md 16px · spacing.lg 20px ·…
- Product tiles are separated by spacing.md white gutters; option cards pad spacing.xl; the feature-link band pads…
- Home and category tiles run full width minus a small outer gutter, two-up below the hero; editorial and field cards run…
- The comparison table is four columns; explore and support cards are two-up inside a 1200px container.

## 该做
- Let product photography fill square, gutter-separated tiles; keep text centred above the render.
- Use colors.primary (brand site) or colors.store-blue (store) for every primary action, always as a pill.
- Pair a filled blue pill with a 1px colors.ink outline pill for the secondary action.
- Use white `button-hero-ghost` pills over dark hero photography.

## 避免
- Set all text in Open Sans with slight negative tracking, and use the ink opacity steps (colors.ink, colors.ink-secondary, colors.ink-tertiary) for hierarchy.
- Mark product rank with a small `tier-eyebrow` in colors.tier-orange.
- In the store, group choices into rounded.sm option cards and show selection with a 2px colors.store-blue ring.
- Close pages with the colors.footer footer on the brand site and colors.canvas-soft in the store.
