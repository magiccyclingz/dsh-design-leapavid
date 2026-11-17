# Mintlify · Mintlify

Mintlify positions itself at the intersection of polished marketing presentation and developer-grade documentation density. The home and startups pages open with cinematic atmospheric heroes — soft sky-gradient backdrops with cloud illustrations on the homepage, dark teal-to-mint gradients with a rocket launch on the startups page — that feel more like a SaaS landing aesthetic than a developer tool. Then the deeper…

- 画布 canvas `#f7f7f7` · 表面 surface `#ececec` · 描边 `#d6d6d6`
- 文字 ink `#0a0a0a` · 次要 `#8c8c8d` · 强调 accent `#0a0a0a`（其上文字 `#ffffff`）
- 字体 display `Inter` 600/-2px · body `Inter`
- 圆角 card 8px / button 6px / pill 9999px · 间距基准 8px

## 版式与间距
- Base unit: 4px (8px primary increment)
- Tokens: spacing.xxs (4px) · spacing.xs (8px) · spacing.sm (12px) · spacing.md (16px) · spacing.lg (20px) ·…
- Section rhythm: Marketing pages use spacing.section-lg (96px) between major bands; pricing comparison tightens to…
- Card internal padding: Standard spacing.xl (24px) for compact cards; spacing.xxl (32px) for pricing cards and…
- Marketing pages use a 1280px max-width with 32px gutters

## 形状
- Hero illustrations (cloud, rocket) sit on full-bleed gradient backdrops with no internal framing
- Customer logo walls use 1:1 ratio cells without rounding (logos are presented inline as wordmarks)
- Testimonial photos use 1:1 aspect with rounded.md (8px) softening

## 该做
- Reserve colors.brand-green (Mintlify mint) for accent CTAs and active state indicators only — even one accent button per viewport carries weight
- Use colors.primary (black) as the dominant CTA on light backgrounds; switch to `button-on-dark` (white pill) on dark hero bands
- Apply rounded.full to every button and pill; never soften pill corners
- Pair Inter (UI prose) with Geist Mono (code) — never introduce a third typeface

## 避免
- Use atmospheric gradient hero bands sparingly (only the homepage and startups page); keep deeper surfaces flat and dense
- Apply rounded.lg (12px) consistently on cards; use rounded.md (8px) only on compact UI like search pills and code blocks
- Keep documentation prose at typography.body-md (16px) with 1.50 line-height — never compress
- Don't use colors.brand-green on body text or large surfaces — it loses signal
