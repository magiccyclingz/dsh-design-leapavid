# Oracle · 甲骨文

Oracle's web system is unusual for an enterprise brand in that it barely uses colour at all. The page ground is a six-step ladder of warm neutrals that runs from pure white through three off-whites to a warm near-black, and that ladder does almost all the structural work. Sections are distinguished from one another not by cards or rules or shadows but by which rung of the ladder they sit on, stacked full-bleed and…

- 画布 canvas `#ffffff` · 表面 surface `#f5f4f4` · 描边 `#dedede`
- 文字 ink `#161513` · 次要 `#787776` · 强调 accent `#312d2a`（其上文字 `#ffffff`）
- 字体 display `Georgia` 400/0px · body `Oracle Sans`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 10px

## 版式与间距
- Base unit: 8px, though the working steps are finer at the small end and jump hard at the large end.
- Tokens: spacing.xs 10px · spacing.sm 12px · spacing.md 16px · spacing.lg 18px · spacing.xl 20px · spacing.xxl 24px…
- spacing.section is the universal rhythm constant. Every full-width section on every page is padded `48px 0`, which is…
- spacing.xxxl is the grid gutter and the corporate index card interior; spacing.xxl is the product card interior.
- Button padding is a fixed `10px 16px` everywhere, and headings carry an 18px bottom margin.

## 该做
- Build page structure from the neutral ladder. Moving a section one rung is the system's way of saying "new region".
- Keep colors.brand-mark on the wordmark and nowhere else. Its scarcity is what gives it weight.
- Run every action through colors.primary at rounded.xs with `10px 16px` padding, whatever the context.
- Flip polarity rather than changing colour when an action lands on a dark band — use components.button-primary-inverse.

## 避免
- Hold spacing.section at 48px on every full-width band; the uniform rhythm is what makes the small tonal steps legible.
- Let weight carry hierarchy. The 400-to-800 jump between body and heading is the system's main structural signal.
- Keep letter-spacing at zero on every role, at every size.
- Deploy chromatic colour only at whole-band scale, as components.section-band-teal or components.section-band-forest.
