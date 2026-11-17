# Composio · Composio

Composio's marketing site reads like a serious developer-infrastructure brand — closer to Vercel or Stripe Docs in atmosphere than to a typical AI-tools startup. The base canvas is a near-black `#0f0f0f` (#0f0f0f) holding white type and a single voltage of deep electric blue (#0007cd) carrying every primary CTA, brand wordmark, and atmospheric spotlight glow that backs the homepage…

- 画布 canvas `#0f0f0f` · 表面 surface `#1a1a1a` · 描边 `#2f2f2f`
- 文字 ink `#f5f5f5` · 次要 `#888888` · 强调 accent `#2c32d4`（其上文字 `#ffffff`）
- 字体 display `abcDiatype` 500/-2.16px · body `abcDiatype`
- 圆角 card 8px / button 9999px / pill 9999px · 间距基准 16px

## 版式与间距
- Base unit: 4px.
- Tokens: spacing.xxs 4px · spacing.xs 8px · spacing.sm 12px · spacing.base 16px · spacing.md 20px · spacing.lg 24px…
- Section padding: spacing.section (96px) for major bands.
- Max content width: ~1200px.
- Editorial body: 12-column grid.

## 该做
- Reserve colors.primary for primary CTAs, wordmark, and spotlight glows.
- Use rounded.md (8px) for every CTA — not full pills.
- Use brightness-step ladder for elevation; avoid drop shadows.
- Pair every hero with a centered radial blue spotlight glow.

## 避免
- Render code, CLI commands in JetBrains Mono via typography.code.
- Use the 2×2 terminal-mockup grid as the homepage hero anchor.
- Don't introduce a secondary brand color. Cyan and violet are illustrative-only.
- Don't use full pills on CTAs.
