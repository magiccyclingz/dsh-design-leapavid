# NVIDIA · 英伟达

NVIDIA's marketing system is built like a piece of engineering documentation that learned graphic design — every page is a structured cascade of dense, factual information arranged on a paper-white grid, framed top and bottom by deep black hero/footer chapters. There is exactly one accent color in the entire system, and it is doing all the work: NVIDIA Green (#76b900), used for every primary…

- 画布 canvas `#ffffff` · 表面 surface `#f4f4f4` · 描边 `#dbdbdb`
- 文字 ink `#000000` · 次要 `#6b6b6b` · 强调 accent `#76b900`（其上文字 `#ffffff`）
- 字体 display `NVIDIA-EMEA` 700/0px · body `NVIDIA-EMEA`
- 圆角 card 2px / button 2px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px
- Tokens (front matter): spacing.xxs (2px) · spacing.xs (4px) · spacing.sm (8px) · spacing.md (12px) · spacing.lg…
- Universal section rhythm: every page in the set uses spacing.section (64px) as the vertical gap between major…
- Hero chapter padding: 80px vertical / 48px horizontal — the largest spacing in the system, reserved for…
- Max width: ~1280px content area at desktop, with 24px gutters that grow to ~48px at ultrawide.

## 形状
- Hero imagery: full-bleed 16:9 (desktop) cropping to 4:5 portrait on mobile.
- Card imagery: 16:9 thumbnail at the top of resource cards; 1:1 square for product/SKU cards; 3:2 for editorial article cards.
- Decorative corner squares: 12×12px on standard cards, scaled to 16×16 on hero callouts.

## 该做
- Reserve colors.primary for primary CTAs, active states, decorative corner squares, and the NVIDIA wordmark itself. Treat it as a precious resource.
- Stack hero/footer chapters in colors.surface-dark and body sections in colors.canvas — alternate them in a predictable rhythm down the page.
- Anchor a component.corner-square to one corner of every reusable card. It is the system's identity tag.
- Use rounded.sm (2px) on every interactive element. Never go to 0, never go past 4.

## 避免
- Build hierarchy from font weight (400 vs 700) and size, not from color tinting. Body text stays colors.ink or colors.body regardless of context.
- Stack content sections at spacing.section (64px) rhythm with no decorative dividers between them.
- Pair component.button-primary (green fill) with component.button-outline (green border) for primary + secondary action pairs.
- Don't introduce drop shadows on cards or content surfaces. The only allowed shadow is the 5px ambient on sticky chrome.
