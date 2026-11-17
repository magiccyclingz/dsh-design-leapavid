# PostHog · PostHog

PostHog's marketing system is built on the visual contradiction at the heart of the brand: a serious open-source product analytics platform rendered as if it were a friendly engineering sketchbook. The chrome runs on a warm cream canvas (#eeefe9) — not white — and every page is dotted with hand-drawn hedgehog mascots in lab coats, lounge chairs, terminals, and reading glasses, scattered across…

- 画布 canvas `#eeefe9` · 表面 surface `#e7e8e2` · 描边 `#d7d9d2`
- 文字 ink `#4d4f46` · 次要 `#85867e` · 强调 accent `#d8960d`（其上文字 `#ffffff`）
- 字体 display `IBM Plex Sans Variable` 700/0px · body `IBM Plex Sans Variable`
- 圆角 card 6px / button 4px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (with finer 2/4/6px steps for tight inline gaps in callout banners and pill buttons).
- Tokens (front matter): spacing.xxs (2px) · spacing.xs (4px) · spacing.sm (8px) · spacing.md (12px) · spacing.lg…
- Universal section rhythm: every page in the set uses spacing.section (80px) as the vertical gap between major…
- Max width: ~1280px content area at desktop with 24px gutters (~48px at ultrawide). Doc article body sits at ~720px…
- Marketing card grid: 4-up at desktop, 3-up at 1024px, 2-up at 768px, 1-up at 480px. Cards preserve a fixed 1:1 or…

## 形状
- Hedgehog character illustrations — flat-color cartoon hedgehogs ranging from ~80px (in-card mascot) to ~240px (hero illustration). Always at…
- Outline product icons in the doc sidebar — 20–24px rounded-square illustrations.
- Inline emoji at 14–16px inside callout banners (💡 ✅ ⚠️ 📘) — used as functional iconography rather than decoration.

## 该做
- Use colors.canvas (cream — `#eeefe9`) as the page body. Never substitute pure white as the canvas.
- Reserve colors.primary (yellow-orange) for the primary CTA pill only. The "Get started — free" treatment is the brand's anchor.
- Render the brand wordmark with the hedgehog illustration alongside it, not as a stand-alone wordmark. The hedgehog IS the brand identity.
- Use IBM Plex Sans Variable across every text role — body 400, emphasis 600/700, display 800.

## 避免
- Stack content sections at spacing.section (80px) rhythm with no decorative dividers between them; let the cream canvas continue uninterrupted.
- Use component.banner-tip-blue / `-green` / `-red` / `-purple` only inside doc article body for tip/warning/note panels — keep marketing chrome out of the…
- Pair every code sample with the dark component.code-block surface; inline `<code>` chips use component.inline-code (cream surface-soft chip).
- Anchor a hedgehog mascot illustration in feature tile margins on home and workflows pages — the system's signature decoration.
