# DSH-Design-LeapAvid

Eighty-four brand design languages taken from the open awesome-design-md corpus (MIT), rendered as a sidebar panel; the Chinese copy for each style is written in-repo from its tokens.

## What it does

- **Browse**: 84 cards with two carriers — web page (the full reference page, all eight sections, anchor links jump between sections) and slide deck (16:9, five pages per style). Both follow the light / dark toggle; dark-first brands only offer their native dark version. Cards are starred from the corner, and the chip row leads with two views: “★ Favourites N” and “Recent N”. Previews are lazy-rendered — roughly the first eight draw immediately, the rest stay as two-tone skeletons until they scroll near.
- **Inspect**: design notes, the full palette (click a swatch to copy its hex), type scale, radii/spacing, keywords, best-for / avoid-for, AI checklist and a prompt recipe. The footer strip shows four “similar styles” (distance over canvas lightness, hue, radii, spacing, type class and polarity) — one click switches to that style.
- **Generate**: pick the carrier, an optional page structure (any / landing / pricing / dashboard / blog), describe the work, and the panel composes a prompt (tokens + notes + structure outline + delivery rules) into the current conversation so DSH writes a single `index.html` or `deck.html`. Attaching the full `DESIGN.md` is optional. After sending, “Iterate” pre-fills a follow-up that passes the previous file back to the host so DSH edits in place instead of rewriting.
- **Export tokens**: copy CSS custom properties, download a W3C `tokens.json`, or copy a Tailwind `theme.extend` snippet.
- **Agent tool**: `design_md` (`list` / `get`) lets the model search the same library on its own.

## Data

- Source: `awesome-design-md-main/design-md/<slug>/DESIGN.md` (84 styles, MIT)
- Chinese copy: generated in this repo — `build/zh-lexicon.json` (brand names, category labels) + `build/copy-overrides.json` (84 hand-written summaries and positioning lines); no third-party Chinese text is copied
- Built artifacts in `data/`: `catalog.json`, `design/<slug>.md`, `brief/<slug>.md`

Rebuild with `node build/build-data.mjs`.

## Structure

- `index.js` (host): `/api/design-md` prefix routes (catalog / style / brief / design / prompt) plus the `design_md` tool. Read-only, never writes to the workspace.
- `client.js` (client): registers the `sidebar.panellist` icon and the `main` panel; the panel is React rendered with `--dsw-alias-*` theme tokens; sending goes through `sessions.binding(id).session.prompt()` into the current conversation.
- Previews use CSS container queries (`cqw`) so the same renderer holds up in a 250px card and a 760px detail frame.

## Known limits

- Brand fonts (Sohne, Copernicus, SF Pro …) are not bundled; previews fall back to system sans/serif/mono and rely on size, weight, tracking and density to convey the style.
- Preview copy is placeholder content, not real project copy.
