# Ollama · Ollama

Ollama's site is the most aggressively under-designed marketing surface in the AI tooling space, and that is the entire point. The home page reads like a Markdown README rendered with care: a 36px center-aligned heading sits above an inline `curl` install snippet inside a soft-gray pill, a single black "Download" CTA, and a hand-drawn llama mascot as the only ornament. Everything else — automate-your-work block…

- 画布 canvas `#ffffff` · 表面 surface `#f9f9f9` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#8f8f8f` · 强调 accent `#000000`（其上文字 `#ffffff`）
- 字体 display `SF Pro Rounded` 500/0px · body `ui-sans-serif`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with finer 2/4/6px steps available for tight inline gaps)
- Tokens (front matter): spacing.xxs (2px) · spacing.xs (4px) · spacing.sm (8px) · spacing.md (12px) · spacing.lg…
- Universal section rhythm: every page uses spacing.section (88px) as the vertical gap between major content blocks…
- Card internal padding: pricing cards sit at spacing.xxl (32px) all around; FAQ rows use spacing.lg (16px) vertical…
- Max width: ~720px content column on the home page (the whole page is laid out as a single narrow reading column…

## 形状
- The llama mascot — a hand-drawn line illustration, ~80–120px on the hero, ~32–48px when it appears as a pricing-card eyebrow icon.
- The lock icon — single stroke line drawing in the privacy section.
- macOS traffic-light dots — three filled circles at 12px (rounded.full) inside the terminal mockup card.

## 该做
- Treat the page like a Markdown document: single reading column, plenty of spacing.section air between sections, no decorative dividers.
- Use component.button-primary (black pill) for every primary action. There is no green, no blue, no brand-tinted CTA.
- Default to rounded.full for any interactive element. Cards get rounded.lg (12px) and that is the only exception.
- Use typography.display-xl SF Pro Rounded for the hero headline and typography.body-md system sans for everything else. Avoid intermediate display sizes.

## 避免
- Reserve component.pricing-card-dark (the inverted dark surface) for exactly one "look here" moment per page — never use it twice.
- Render install commands and CLI examples inside component.install-snippet or component.terminal-card with typography.code-md / typography.code-sm. Code is a…
- Keep the llama mascot the only illustration in the system. It is the brand.
- Don't introduce gradients, drop shadows, or atmospheric backgrounds. The canvas is pure colors.canvas.
