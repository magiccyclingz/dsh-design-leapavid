# Resend · Resend

Resend looks like a developer tool with the typography of an editorial. Every page opens on (`#000000`), and the loudest element on the canvas is not a button or a brand stamp — it's a 96px Domaine Display serif headline ("Email for developers", "Email reimagined") with the `ss01 / ss04 / ss11` stylistic alternates engaged. That single typographic decision sets the brand tone: confident…

- 画布 canvas `#fcfdff` · 表面 surface `#f1f2f4` · 描边 `#d9dadb`
- 文字 ink `#000000` · 次要 `#6a6a6b` · 强调 accent `#ff801f`（其上文字 `#ffffff`）
- 字体 display `Domaine Display` 400/-0.96px · body `Inter`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 4px, with the working scale on multiples of 4 / 8 / 16.
- Tokens: spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 24px ·…
- Section padding: spacing.section (96px) vertical between bands; spacing.band (128px) on the hero stripe and closing…
- Card internal padding: spacing.xxl (32px) on component.feature-card, component.pricing-tier, and component.code-window.
- Max content width ≈ 1200px on body sections.

## 形状
- The system uses almost no photography. Visual interest comes from typography + atmospheric glows + code wells + the white email-card insets.
- When portraits appear (testimonial avatars), they are circular (rounded.full) at 32px, sitting inline with body copy.
- Email mockup cards run at 4:5 portrait aspect with rounded.lg corners.

## 该做
- Use colors.canvas (true black) as the default page background. Every public page lives here.
- Reserve component.button-primary (white pill) as the only solid bright surface. One per viewport at most.
- Set hero headlines in Domaine Display at 76–96px with `lineHeight: 1.0` and `ss01 / ss04 / ss11` features engaged.
- Use ABC Favorit for marketing body, Inter for UI labels, Geist Mono for code. Keep the lanes strict.

## 避免
- Build elevation from translucent-white hairlines, not drop shadows.
- Use colors.accent-*-glow tokens as low-opacity radial atmospheric washes — never as solid surfaces.
- Set buttons and inputs to rounded.md (8px); cards and code wells to rounded.lg (12px); pills and avatars to rounded.full.
- Use the white email-mockup inset sparingly — it's the only deliberately-light surface and should feel like a print pull-quote.
