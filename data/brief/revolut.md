# Revolut · Revolut

Revolut's marketing canvas operates in a high-contrast two-mode system: a

- 画布 canvas `#ffffff` · 表面 surface `#f5f5f5` · 描边 `#dfdfe0`
- 文字 ink `#191c1f` · 次要 `#7a7b7d` · 强调 accent `#494fdf`（其上文字 `#ffffff`）
- 字体 display `Aeonik Pro` 500/-2.72px · body `Inter`
- 圆角 card 12px / button 8px / pill 9999px · 间距基准 6px

## 版式与间距
- Base unit: 4px, with the working scale on multiples of 4 / 8 / 16.
- Tokens: spacing.xxs 4px · spacing.xs 6px · spacing.sm 8px · spacing.md 14px · spacing.lg 16px · spacing.xl 24px ·…
- Section padding: spacing.section (88px) vertical between bands; spacing.band (120px) on the hero band and the closing…
- Card internal padding: spacing.xxl (32px) on component.feature-card-light, component.plan-card…
- Max content width ≈ 1200px on body sections; hero bands run full-bleed.

## 形状
- Phone mockups: 9:19.5 (vertical) with rounded.xl corners on the device chrome.
- Card mockups: 1.586:1 (credit-card aspect) with rounded.lg corners.
- Terminal/POS mockups: 4:3 with rounded.xl corners and substantial padding around the device.

## 该做
- Switch full bands between colors.canvas-dark (storytelling) and colors.canvas-light (catalogue). The two-mode rhythm is core.
- Use component.button-primary (white pill on dark) as the primary CTA on every dark hero band. It's the brand's loudest action.
- Reserve colors.primary for the featured plan card and the brand wordmark — the cobalt should feel like a deliberate stamp, not a colour theme.
- Set hero headlines in Aeonik Pro 500 at 80–136px with `lineHeight: 1.0` and large negative letter-spacing.

## 避免
- Use Inter for body, button labels, captions — never substitute Aeonik Pro for body type.
- Apply rounded.full to every button and pill; rounded.lg (20px) to feature and plan cards; rounded.md (12px) to inputs.
- Show product mockups full-bleed inside dark sections — the asset IS the section.
- Use the wide accent palette (colors.accent-teal, colors.accent-pink, colors.accent-light-green, etc.) inside product illustrations and iconography only.
