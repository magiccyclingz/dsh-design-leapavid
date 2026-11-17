# Nintendo 2001 · Nintendo 2001

Nintendo.com circa 2001 is the web rendered as console hardware. Where most sites of the era reached for either grunge texture or corporate gradients, this interface builds itself out of brushed-periwinkle metal plates — every region is a discrete beveled panel, edge-lit with a brighter highlight on top and a `#3d4f97` shadow line beneath, as if stamped from the same injection-molded plastic…

- 画布 canvas `#7a8aba` · 表面 surface `#93a2cc` · 描边 `#6d79a7`
- 文字 ink `#1b1033` · 次要 `#3f3a52` · 强调 accent `#a3051d`（其上文字 `#ffffff`）
- 字体 display `Arial Black` 900/0px · body `Arial`
- 圆角 card 6px / button 4px / pill 9999px · 间距基准 4px

## 版式与间距
- Base unit: 8px (spacing.sm) — the gutter rhythm between list rows and grid cells.
- Tokens: spacing.xxs 2px · spacing.xs 4px · spacing.sm 8px · spacing.md 12px · spacing.lg 16px · spacing.xl 24px ·…
- Panels carry 12px interior padding (spacing.md); larger content modules use 16px (spacing.lg). Inter-module…
- Fixed-width canvas ~780–830px wide (a desktop-era fixed table layout, centered). No fluid scaling — the interface…
- Masthead row: Mario mascot + speech bubble (left) and search module (right) float above the chrome.

## 该做
- Build every region as a beveled plate: a colors.canvas body with a brighter top edge and a colors.chrome-indigo shadow line beneath. The "assembled…
- Reserve warm color for wayfinding only — colors.nav-gold for nav words, colors.amber for utility/badges, colors.signal for forward/Submit. Cool chrome…
- Keep structural labels uppercase Arial Bold with 0.5px tracking (typography.ui-label) — it is the silkscreen-legend voice of the whole system.
- Render hero wordmarks as outlined + drop-shadowed typography.display over full-bleed photographic fields tinted per page.

## 避免
- Use colors.carbon with halftone texture for the command layer (nav, right rail, footer) to separate "system controls" from "content."
- Let panels butt together with thin bevel seams; density is the intended texture.
- Default corners to sharp/chamfered (rounded.none); spend roundness only on the logo pill, radio dots, and circle-arrow badges.
- Don't soften every corner — turning the sharp chrome into a uniformly rounded card system erases the manufactured-faceplate identity.
