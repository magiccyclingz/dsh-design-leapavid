# Supabase · Supabase

Supabaze's design language is engineered for clarity above all else. The marketing surfaces sit on (pure white), with text rendered in `#171717` (`#171717` — near-black, never pure black). Across the entire system the only consistent chromatic event is the emerald green primary (#3ecf8e) — used as the filled CTA, occasional accent dot, and the signature highlight…

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#dfdfdf`
- 文字 ink `#171717` · 次要 `#787878` · 强调 accent `#37ae79`（其上文字 `#ffffff`）
- 字体 display `Circular` 500/-1.92px · body `Circular`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with 2 / 4 / 12 sub-tokens for fine work).
- Tokens: spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 24px ·…
- Section padding: 64–96px on marketing surfaces.
- Card internal padding: 32px on feature/pricing cards.
- Marketing pages center in a ~1280px container with no edge-bleed; the brand keeps content inside the box.

## 该做
- Reserve colors.primary emerald for filled CTAs and the wordmark accent — it should appear sparingly.
- Render display tiers at weight 500 with negative letter-spacing — the engineered tightness is part of the brand.
- Use rounded.sm 6px for buttons — square-ish radii, never pill-shaped.
- Composite product UI mockups inside rounded.lg containers with subtle Level 2 shadows.

## 避免
- Use near-black colors.ink on the emerald button (not white) — the green reads as "lit" with dark type, which is the brand's idiosyncratic choice.
- Apply system mono for every code block.
- Don't introduce additional accent colors as system colors — purples, yellows, and pinks belong inside chart points and integration logos only.
- Don't bump display weight above 500 — the brand's calibrated mid-weight breaks at 600+.
