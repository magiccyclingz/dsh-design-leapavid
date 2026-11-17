# Design library (dsh-design-md)

Eighty-four brand design languages taken from the open [getdesign.md](https://getdesign.md/) corpus (awesome-design-md / awesome-design-md-cn), rendered as a sidebar panel.

## What it does

- **Browse**: 84 cards with four preview surfaces — web page, dark page, slide deck (16:9), poster (3:4). Every preview is rendered live from that style's own `DESIGN.md` colors, type, radii and spacing: no screenshots, no iframes, no network requests.
- **Inspect**: design notes, the full palette (click a swatch to copy its hex), type scale, radii/spacing, keywords, best-for / avoid-for, AI checklist, a prompt recipe, and a link to the source page.
- **Generate**: choose an output, describe the work, and the panel composes a prompt (style tokens + notes + delivery requirements) into the current conversation so DSH writes `index.html` / `deck.html` / `poster.html`. Attaching the full `DESIGN.md` is optional.
- **Agent tool**: `design_md` (`list` / `get`) lets the model search the same library on its own.

## Data

- Source: `awesome-design-md-main/design-md/<slug>/DESIGN.md` (84 styles)
- Chinese metadata: `awesome-design-md-cn/data/designs.json` (74 shared styles; the 10 main-only slugs have hand-written metadata)
- Built artifacts in `data/`: `catalog.json`, `design/<slug>.md`, `brief/<slug>.md`

Rebuild with `node build/build-data.mjs`.

## Structure

- `index.js` (host): `/api/design-md` prefix route (catalog / style / brief / design / prompt) plus the `design_md` tool. Read-only.
- `client.js` (client): the `sidebar.panellist` row and the `main` panel; styles use `--dsw-alias-*` tokens; sending goes through `sessions.binding(id).session.prompt()`.
- Previews use CSS container queries (`cqw`), so one component works at 250px (card) and 760px (detail).

## Limits

- Brand fonts are not distributed: previews fall back to system sans/serif/mono stacks per style, and differentiation comes from scale, weight, tracking, hierarchy and density.
- Preview copy is placeholder (English brand name, Chinese description).
