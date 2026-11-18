#!/usr/bin/env node
/**
 * Builds the plugin data set from the upstream design-md corpus:
 *   - awesome-design-md-main  (84 DESIGN.md, MIT, (c) 2026 VoltAgent)
 *   - zh-lexicon.json         (self-authored brand names / category labels)
 *
 * Chinese copy is generated here from each style's own tokens — no third-party
 * Chinese text is read or redistributed.
 *
 * Output (inside the plugin package):
 *   data/design/<slug>.md   full DESIGN.md (agent + panel spec viewer)
 *   data/catalog.json       normalized, render-ready style catalog
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
const PROJECTS = path.resolve(pkgRoot, '..');
const MAIN_ROOT = process.env.DESIGN_MD_MAIN || path.join(PROJECTS, 'awesome-design-md-main', 'design-md');
const OUT_DATA = path.join(pkgRoot, 'data');
const OUT_DESIGN = path.join(OUT_DATA, 'design');

/* ------------------------------------------------------------------ yaml */

const indentOf = (line) => (line.match(/^\s*/) || [''])[0].length;

function stripComment(raw) {
  const text = String(raw);
  let quote = '';
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      out += ch;
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; out += ch; continue; }
    if (ch === '#' && out.trim() !== '' && /\s/.test(out[out.length - 1] || '')) break;
    out += ch;
  }
  return out;
}

function parseScalar(raw) {
  const v = String(raw).trim();
  if (v === '') return '';
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

function parseMap(lines, start, indent) {
  const obj = {};
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }
    const ind = indentOf(line);
    if (ind < indent) break;
    if (ind > indent) { i += 1; continue; }
    const m = line.match(/^\s*([^:][^:]*?):\s*(.*)$/);
    if (!m) { i += 1; continue; }
    const key = m[1].trim().replace(/^["']|["']$/g, '');
    const rest = m[2];
    if (rest.trim() === '') {
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j += 1;
      if (j < lines.length && indentOf(lines[j]) > ind) {
        const [value, next] = parseBlock(lines, j, indentOf(lines[j]));
        obj[key] = value;
        i = next;
      } else {
        obj[key] = '';
        i = j;
      }
      continue;
    }
    if (/^[|>][+-]?$/.test(rest.trim())) {
      const folded = rest.trim().startsWith('>');
      let j = i + 1;
      const buf = [];
      while (j < lines.length && (lines[j].trim() === '' || indentOf(lines[j]) > ind)) {
        buf.push(lines[j].trim());
        j += 1;
      }
      obj[key] = buf.join(folded ? ' ' : '\n').trim();
      i = j;
      continue;
    }
    let value = rest.trim();
    let j = i + 1;
    while (j < lines.length && lines[j].trim() && indentOf(lines[j]) > ind && !/^\s*[A-Za-z0-9_."'-]+:(\s|$)/.test(lines[j])) {
      value += ` ${lines[j].trim()}`;
      j += 1;
    }
    obj[key] = parseScalar(stripComment(value));
    i = j;
  }
  return [obj, i];
}

function parseBlock(lines, start, indent) {
  if (/^\s*-\s/.test(lines[start])) {
    const arr = [];
    let i = start;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i += 1; continue; }
      const ind = indentOf(line);
      if (ind < indent) break;
      const m = line.match(/^\s*-\s+(.*)$/);
      if (!m) break;
      const rest = m[1];
      if (/^[^\s:]+:\s/.test(rest) || /^"[^"]+":\s/.test(rest)) {
        const itemLines = [`${' '.repeat(ind + 2)}${rest}`];
        let j = i + 1;
        while (j < lines.length && lines[j].trim() && indentOf(lines[j]) > ind) {
          itemLines.push(lines[j]);
          j += 1;
        }
        arr.push(parseMap(itemLines, 0, ind + 2)[0]);
        i = j;
      } else {
        arr.push(parseScalar(rest));
        i += 1;
      }
    }
    return [arr, i];
  }
  return parseMap(lines, start, indent);
}

function parseFrontMatter(text) {
  const m = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: String(text) };
  const lines = m[1].split(/\r?\n/);
  let start = 0;
  while (start < lines.length && !lines[start].trim()) start += 1;
  if (start >= lines.length) return { data: {}, body: text.slice(m[0].length) };
  const [data] = parseBlock(lines, start, indentOf(lines[start]));
  return { data, body: text.slice(m[0].length) };
}

/* ----------------------------------------------------------------- color */

function normalizeHex(value) {
  if (typeof value !== 'string') return '';
  const m = value.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (!m) return '';
  const hex = m[1];
  if (hex.length === 3) return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase();
  return `#${hex.slice(0, 6)}`.toLowerCase();
}

function toRgb(hex) {
  const v = normalizeHex(hex);
  if (!v) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(v.slice(1, 3), 16),
    g: parseInt(v.slice(3, 5), 16),
    b: parseInt(v.slice(5, 7), 16),
  };
}

function luminance(hex) {
  const { r, g, b } = toRgb(hex);
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function saturation(hex) {
  const { r, g, b } = toRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function mix(hexA, hexB, weight) {
  const a = toRgb(hexA);
  const b = toRgb(hexB);
  const w = Math.max(0, Math.min(1, weight));
  const to = (x, y) => Math.round(x * (1 - w) + y * w).toString(16).padStart(2, '0');
  return `#${to(a.r, b.r)}${to(a.g, b.g)}${to(a.b, b.b)}`;
}

function contrastText(hex) {
  return luminance(hex) > 0.45 ? '#101114' : '#ffffff';
}

function relLum(hex) { return luminance(hex); }

const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

function contrastRatio(hexA, hexB) {
  const a = relLum(hexA) + 0.05;
  const b = relLum(hexB) + 0.05;
  return a > b ? a / b : b / a;
}

/** Push `color` toward `toward` until it reads against `against`. */
function ensureContrast(color, against, target, toward) {
  let out = normalizeHex(color) || toward;
  for (let step = 0; step < 14; step += 1) {
    if (contrastRatio(out, against) >= target) return out;
    out = mix(out, toward, 0.18);
  }
  return out;
}

const GENERIC_FALLBACK = {
  sans: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

/** Append a generic family when the stack has none (browsers otherwise fall back to serif). */
function withFallback(stack, fontClass) {
  const value = String(stack || '').trim();
  if (!value) return GENERIC_FALLBACK[fontClass] || GENERIC_FALLBACK.sans;
  if (/serif|sans-serif|monospace|system-ui|cursive|fantasy/i.test(value)) return value;
  return `${value}, ${GENERIC_FALLBACK[fontClass] || GENERIC_FALLBACK.sans}`;
}

/* ------------------------------------------------------------- normalize */

const pick = (list, names) => {
  for (const name of names) {
    const hit = list.find((c) => c.name.toLowerCase().replace(/[_\s]/g, '-') === name);
    if (hit) return hit;
  }
  return null;
};

function normalizeColors(raw) {
  const out = [];
  const seen = new Set();
  for (const [name, value] of Object.entries(raw || {})) {
    const hex = normalizeHex(value);
    const text = typeof value === 'string' ? value.trim() : '';
    if (!hex && !text) continue;
    const key = hex || `${name}:${text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name, hex, raw: text });
  }
  return out;
}

function normalizeTypography(raw) {
  const out = [];
  for (const [token, value] of Object.entries(raw || {})) {
    if (!value || typeof value !== 'object') continue;
    out.push({
      token,
      fontFamily: String(value.fontFamily || ''),
      fontSize: String(value.fontSize || ''),
      fontWeight: String(value.fontWeight || ''),
      lineHeight: String(value.lineHeight || ''),
      letterSpacing: String(value.letterSpacing || ''),
    });
  }
  return out;
}

const pxNumber = (value) => {
  const m = String(value || '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
};

const shortFamily = (family) => {
  const first = String(family || '').split(',')[0].trim().replace(/^["']|["']$/g, '');
  return first || 'Inter';
};

function spaceBaseOf(map) {
  const nums = Object.entries(map || {})
    .map(([name, value]) => ({ name: String(name).toLowerCase(), px: pxNumber(value) }))
    .filter((entry) => entry.px > 0);
  const base = nums.find((entry) => /base|unit/.test(entry.name) && entry.px <= 16);
  if (base) return base.px;
  const xs = nums.find((entry) => entry.name === 'xs' && entry.px <= 16)
    || nums.find((entry) => /^(sm|xxs)$/.test(entry.name) && entry.px <= 16)
    || nums.find((entry) => entry.px >= 4 && entry.px <= 16);
  return xs ? xs.px : 8;
}

function buildVisual({ colors, typography, radius, spacing, hints = {} }) {
  const hexes = colors.filter((c) => c.hex);
  const primaryCandidates = ['primary', 'brand-primary', 'brand', 'accent', 'action', 'primary-action', 'primary-focus', 'accent-primary', 'interactive', 'primary-color'];
  const accentHit = pick(hexes, primaryCandidates);
  const saturated = [...hexes]
    .filter((c) => saturation(c.hex) > 0.28 && relLum(c.hex) > 0.04 && relLum(c.hex) < 0.72)
    .sort((a, b) => saturation(b.hex) * (1 - Math.abs(relLum(b.hex) - 0.3)) - saturation(a.hex) * (1 - Math.abs(relLum(a.hex) - 0.3)));
  const accent = (accentHit && relLum(accentHit.hex) < 0.9 ? accentHit.hex : '') || saturated[0]?.hex || '';

  const canvasHit = pick(hexes, ['canvas', 'background', 'bg', 'page', 'surface-base', 'base', 'surface', 'canvas-white', 'paper', 'background-primary']);
  const lightHexes = hexes.filter((c) => relLum(c.hex) > 0.82).sort((a, b) => relLum(b.hex) - relLum(a.hex));
  const canvas = (canvasHit && relLum(canvasHit.hex) > 0.6 ? canvasHit.hex : '') || lightHexes[0]?.hex || '#ffffff';

  const inkHit = pick(hexes, ['ink', 'text', 'foreground', 'body', 'ink-primary', 'text-primary', 'label', 'content', 'fg']);
  const darkHexes = hexes.filter((c) => relLum(c.hex) < 0.24).sort((a, b) => relLum(a.hex) - relLum(b.hex));
  const ink = (inkHit && relLum(inkHit.hex) < 0.4 ? inkHit.hex : '') || darkHexes[0]?.hex || '#101114';

  const surfaceHit = pick(hexes, ['surface', 'surface-1', 'surface-tile', 'card', 'panel', 'surface-pearl', 'surface-muted', 'background-subtle', 'bg-subtle']);
  const surface = (surfaceHit && relLum(surfaceHit.hex) > 0.7 ? surfaceHit.hex : '') || mix(canvas, ink, 0.045);

  const mutedHit = pick(hexes, ['muted', 'text-muted', 'secondary', 'ink-muted', 'body-muted', 'subtle', 'neutral', 'gray']);
  const muted = (mutedHit && relLum(mutedHit.hex) > 0.2 && relLum(mutedHit.hex) < 0.75 ? mutedHit.hex : '') || mix(ink, canvas, 0.42);

  const darkHit = pick(hexes, ['surface-black', 'surface-dark', 'surface-inverse', 'night', 'black', 'surface-tile-1', 'dark', 'ink']);
  const darkCanvas = (darkHit && relLum(darkHit.hex) < 0.16 ? darkHit.hex : '') ||
    (darkHexes.length && relLum(darkHexes[0].hex) < 0.14 ? darkHexes[0].hex : '#0d0f13');
  const darkSurface = mix(darkCanvas, '#ffffff', 0.07);
  const onDark = pick(hexes, ['on-dark', 'body-on-dark', 'on-primary', 'inverse', 'white']);
  const darkInk = (onDark && relLum(onDark.hex) > 0.75 ? onDark.hex : '') ||
    hexes.filter((c) => relLum(c.hex) > 0.9)[0]?.hex || '#f4f5f7';

  const display = [...typography]
    .filter((t) => pxNumber(t.fontSize) >= 28)
    .sort((a, b) => pxNumber(b.fontSize) - pxNumber(a.fontSize))[0];
  const body = typography.find((t) => /^(body|base|paragraph|text|copy)$/i.test(t.token)) ||
    [...typography].filter((t) => pxNumber(t.fontSize) >= 14 && pxNumber(t.fontSize) <= 18)
      .sort((a, b) => pxNumber(a.fontSize) - pxNumber(b.fontSize))[0] ||
    typography[0];
  const mono = typography.find((t) => /mono|code|code-|monospace/i.test(`${t.token} ${t.fontFamily}`));

  const radiusMap = Object.fromEntries(radius.map((r) => [r.name, r.value]));
  const radiusCard = radiusMap.md || radiusMap.lg || radiusMap.sm || radiusMap.lg || '12px';
  const radiusPill = radiusMap.pill || radiusMap.full || radiusMap['2xl'] || '9999px';
  const radiusButton = radiusMap.pill ? radiusMap.pill : radiusMap.sm || radiusMap.md || '8px';

  const spacingMap = Object.fromEntries(spacing.map((s) => [s.name, s.value]));

  const darkFirst = hints.darkFirst ?? (relLum(canvas) < 0.3 && relLum(ink) > 0.6);
  const visual = {
    accent: accent || hints.accent || (relLum(ink) > 0.6 ? ink : '#111111'),
    accentText: contrastText(accent || hints.accent || ink),
    canvas,
    canvasAlt: mix(canvas, ink, 0.03),
    surface,
    ink,
    muted,
    hairline: mix(canvas, ink, 0.12),
    darkCanvas,
    darkSurface,
    darkInk,
    darkMuted: mix(darkInk, darkCanvas, 0.42),
    displayFamily: shortFamily(display?.fontFamily),
    displayStack: display?.fontFamily || 'Inter, system-ui, sans-serif',
    displayWeight: display?.fontWeight || '700',
    displaySize: pxNumber(display?.fontSize) || 56,
    displayTracking: display?.letterSpacing || '0',
    displayLineHeight: display?.lineHeight || '1.05',
    bodyFamily: shortFamily(body?.fontFamily),
    bodyStack: body?.fontFamily || 'Inter, system-ui, sans-serif',
    bodySize: pxNumber(body?.fontSize) || 16,
    monoFamily: shortFamily(mono?.fontFamily) || 'SF Mono',
    radiusCard,
    radiusPill,
    radiusButton,
    space: spacingMap,
    spaceBase: spaceBaseOf(spacingMap),
    darkFirst,
  };

  for (const key of ['accent', 'canvas', 'canvasAlt', 'surface', 'ink', 'muted', 'hairline', 'darkCanvas', 'darkSurface', 'darkInk', 'darkMuted', 'radiusCard', 'radiusPill', 'radiusButton']) {
    if (typeof hints[key] === 'string' && hints[key]) visual[key] = hints[key];
  }
  if (visual.darkFirst) {
    visual.darkCanvas = hints.canvas || visual.canvas;
    visual.canvas = hints.canvas || visual.canvas;
    visual.canvasAlt = mix(visual.canvas, visual.ink, 0.05);
    visual.surface = hints.surface || visual.surface;
    visual.darkInk = hints.ink || visual.ink;
  } else if (hints.canvas) {
    visual.canvas = hints.canvas;
    visual.canvasAlt = mix(hints.canvas, visual.ink, 0.04);
  }
  if (hints.ink) visual.ink = hints.ink;
  if (hints.muted) visual.muted = hints.muted;
  visual.hairline = mix(visual.canvas, visual.ink, 0.14);
  visual.darkMuted = mix(visual.darkInk, visual.darkCanvas, 0.42);
  visual.accentText = contrastText(visual.accent);
  return sanitizeVisual(visual);
}

/**
 * Rendering-side hygiene: the raw DESIGN.md tables carry values that are meant
 * for a 1400px page (display 96px) or describe a dark-mode token (muted
 * #cccccc on white). Clamp them so every style renders legibly in a 260px card
 * as well as in the detail view.
 */
function sanitizeVisual(visual) {
  const fontClass = visual.fontClass || 'sans';
  const size = clampNumber(pxNumber(visual.displaySize) || 56, 30, 112);
  visual.displaySize = Math.round(size);

  const rawLine = String(visual.displayLineHeight ?? '1.05');
  let ratio = /px\s*$/i.test(rawLine) ? pxNumber(rawLine) / size : Number.parseFloat(rawLine);
  if (!Number.isFinite(ratio) || ratio <= 0) ratio = 1.08;
  visual.displayLineHeight = String(Math.round(clampNumber(ratio, 0.96, 1.36) * 100) / 100);

  const tracking = clampNumber(pxNumber(visual.displayTracking) || 0, -0.055 * size, 0.02 * size);
  visual.displayTracking = `${Math.round(tracking * 100) / 100}px`;

  visual.bodySize = Math.round(clampNumber(pxNumber(visual.bodySize) || 16, 13, 19));
  visual.displayStack = withFallback(visual.displayStack, fontClass);
  visual.bodyStack = withFallback(visual.bodyStack, fontClass);

  visual.muted = ensureContrast(visual.muted, visual.canvas, 3.1, visual.ink);
  visual.darkMuted = ensureContrast(visual.darkMuted, visual.darkCanvas, 3.1, visual.darkInk);
  visual.accent = ensureContrast(visual.accent, visual.canvas, 2.1, visual.ink);
  visual.accentText = contrastText(visual.accent);
  visual.hairline = ensureContrast(mix(visual.canvas, visual.ink, 0.14), visual.canvas, 1.16, visual.ink);
  if (contrastRatio(visual.surface, visual.canvas) < 1.03) {
    visual.surface = mix(visual.canvas, visual.ink, 0.045);
  }
  if (contrastRatio(visual.darkSurface, visual.darkCanvas) < 1.03) {
    visual.darkSurface = mix(visual.darkCanvas, '#ffffff', 0.06);
  }
  return visual;
}


/* ------------------------------------------------- markdown-only corpus */

const cleanCell = (value) => String(value || '')
  .replace(/`/g, '')
  .replace(/\((?:est\.|approx\.?|as [^)]*)\)/gi, '')
  .replace(/\s+/g, ' ')
  .trim();

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'step';

const rowCells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

function extractMarkdownColors(md) {
  const found = [];
  const seen = new Set();
  const add = (name, hex) => {
    const h = normalizeHex(hex);
    if (!h || seen.has(h)) return;
    seen.add(h);
    found.push({ name: cleanCell(name), hex: h, raw: h });
  };
  for (const m of md.matchAll(/([A-Z][A-Za-z0-9+&'’/ .-]{1,30}?)\s*\(\s*`?#([0-9a-fA-F]{6})`?\s*\)/g)) add(m[1], `#${m[2]}`);
  for (const m of md.matchAll(/`#([0-9a-fA-F]{6})`\s*\(([^)]{2,40})\)/g)) add(m[2], `#${m[1]}`);

  const freq = new Map();
  for (const m of md.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    const hex = `#${m[1].toLowerCase()}`;
    freq.set(hex, (freq.get(hex) || 0) + 1);
  }
  for (const [hex] of [...freq].sort((a, b) => b[1] - a[1])) {
    if (found.length >= 24) break;
    if (seen.has(hex)) continue;
    const light = relLum(hex);
    const sat = saturation(hex);
    const name = light > 0.9 ? 'canvas' : light < 0.16 ? 'ink' : sat > 0.42 ? `accent-${found.length + 1}` : `neutral-${found.length + 1}`;
    add(name, hex);
  }
  return { colors: found, freq };
}

function extractMarkdownTypography(md) {
  const lines = md.split(/\r?\n/);
  const steps = [];
  const families = [...md.matchAll(/-\s*\*\*[^*]+\*\*:\s*`([^`]+)`/g)]
    .map((m) => m[1].trim())
    .filter((name) => /^[A-Za-z0-9][A-Za-z0-9 +&'._-]{1,39}$/.test(name) && !/[#():;]|px|rgba|hsla|opacity|solid|ease/i.test(name));
  const fallbackFamily = families[0] || '';

  for (let i = 0; i < lines.length - 1; i += 1) {
    if (!/^\s*\|/.test(lines[i])) continue;
    if (!/^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) continue;
    const header = rowCells(lines[i]).map((h) => h.toLowerCase());
    const sizeIdx = header.findIndex((h) => /size|scale/.test(h));
    const fontIdx = header.findIndex((h) => /font/.test(h));
    const weightIdx = header.findIndex((h) => /weight/.test(h));
    const lineIdx = header.findIndex((h) => /line/.test(h));
    const trackIdx = header.findIndex((h) => /letter|tracking/.test(h));

    for (let j = i + 2; j < lines.length; j += 1) {
      const line = lines[j];
      if (!/^\s*\|/.test(line)) break;
      const cells = rowCells(line);
      if (!cells.length) continue;
      const sizeRaw = sizeIdx >= 0 ? cells[sizeIdx] : cells.find((c) => /\d+(\.\d+)?\s*px/.test(c));
      const sizeMatch = String(sizeRaw || '').match(/(\d+(?:\.\d+)?)\s*px/);
      if (!sizeMatch) continue;
      const token = slugify(cleanCell(cells[0]));
      if (!token || steps.some((s) => s.token === token)) continue;
      steps.push({
        token,
        fontFamily: fontIdx >= 0 ? cleanCell(cells[fontIdx]) || fallbackFamily : fallbackFamily,
        fontSize: `${sizeMatch[1]}px`,
        fontWeight: weightIdx >= 0 ? cleanCell(cells[weightIdx]).replace(/[^\d].*$/, '') || cleanCell(cells[weightIdx]) : '',
        lineHeight: lineIdx >= 0 ? cleanCell(cells[lineIdx]) : '',
        letterSpacing: trackIdx >= 0 ? cleanCell(cells[trackIdx]) : '',
      });
    }
    i = Math.min(lines.length - 2, i + 2);
  }
  return steps;
}

function extractMarkdownRadius(md) {
  const values = new Set();
  for (const m of md.matchAll(/(?:border-)?radius[^0-9\n]{0,30}(\d+(?:\.\d+)?)\s*px/gi)) values.add(Number(m[1]));
  const all = [...values].filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  const small = all.filter((v) => v < 100).slice(0, 6);
  const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const out = small.map((v, i) => ({ name: names[i] || `r${i}`, value: `${v}px` }));
  const pill = all.filter((v) => v >= 100).pop();
  out.push({ name: 'pill', value: pill ? `${pill}px` : '9999px' });
  return out;
}

function extractMarkdownSpacing(md) {
  const values = new Set();
  for (const m of md.matchAll(/\b(\d{1,3})px\b/g)) {
    const n = Number(m[1]);
    if (n >= 2 && n <= 128 && n % 2 === 0) values.add(n);
  }
  return [...values].sort((a, b) => a - b).slice(0, 10).map((v) => ({ name: `s${v}`, value: `${v}px` }));
}

function extractMarkdownTokens(md) {
  const { colors, freq } = extractMarkdownColors(md);
  const typography = extractMarkdownTypography(md);
  const darkHits = [...freq].filter(([hex]) => relLum(hex) < 0.12).reduce((n, [, c]) => n + c, 0);
  const lightHits = [...freq].filter(([hex]) => relLum(hex) > 0.9).reduce((n, [, c]) => n + c, 0);
  return {
    colors: Object.fromEntries(colors.map((c) => [c.name || c.hex, c.hex])),
    colorList: colors,
    typography: Object.fromEntries(typography.map((t) => [t.token, t])),
    typographyList: typography,
    rounded: Object.fromEntries(extractMarkdownRadius(md).map((r) => [r.name, r.value])),
    spacing: Object.fromEntries(extractMarkdownSpacing(md).map((s) => [s.name, s.value])),
    darkFirst: darkHits > lightHits,
    darkHits,
    lightHits,
  };
}


/* ------------------------------------------------- style brief & font class */

const trim = (text, max) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max).replace(/[,;:\s]+\S*$/, '')}…` : t;
};

function mdSections(markdown) {
  const out = new Map();
  let current = null;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (heading) {
      current = heading[1].toLowerCase();
      out.set(current, []);
      continue;
    }
    if (current) out.get(current).push(line);
  }
  return out;
}

function paragraphs(lines = []) {
  const blocks = [];
  let buf = [];
  for (const line of lines) {
    if (!line.trim()) { if (buf.length) { blocks.push(buf.join(' ')); buf = []; } continue; }
    if (/^#{3,}\s/.test(line) || /^[-*|]/.test(line)) { if (buf.length) { blocks.push(buf.join(' ')); buf = []; } continue; }
    buf.push(line.trim());
  }
  if (buf.length) blocks.push(buf.join(' '));
  return blocks;
}

function bullets(lines = []) {
  const out = [];
  for (const line of lines) {
    const m = /^\s*[-*]\s+(.+)$/.exec(line);
    if (m) out.push(m[1].replace(/`\{[^}]+\}`/g, (x) => x.replace(/[`{}]/g, '')).trim());
  }
  return out;
}

function detectFontClass(markdown, family, typography = []) {
  const fam = String(family || '').toLowerCase();
  const stacks = typography.map((t) => String(t?.fontFamily || ''));
  const own = stacks.find((stack) => stack.replace(/['"]/g, '').split(',')[0].trim().toLowerCase() === fam)
    || stacks.find((stack) => fam && stack.toLowerCase().includes(fam.split(' ')[0]))
    || '';
  const tokens = own.toLowerCase().replace(/["']/g, '').split(',').map((x) => x.trim());
  if (tokens.includes('monospace') || tokens.includes('ui-monospace') || tokens.includes('mono')) return 'mono';
  if (tokens.includes('sans-serif') || tokens.includes('ui-sans-serif') || tokens.includes('system-ui') || tokens.includes('sans')) return 'sans';
  if (tokens.includes('serif') || tokens.includes('ui-serif')) return 'serif';
  if (/mono|berkeley|code pro|sf mono|jetbrains/i.test(fam)) return 'mono';
  if (/editorial new|domaine|copernicus|tiempos|georgia|times|playfair|garamond|canela|freight|recoleta|ogg|lyon|sectra|signifier|spectral|tobias|serif/i.test(fam)) return 'serif';
  return 'sans';
}

function buildBrief(style, markdown) {
  const sections = mdSections(markdown);
  const overview = paragraphs(sections.get('overview') || [])[0] || style.descriptionEn || '';
  const layoutBullets = bullets(sections.get('layout') || []).slice(0, 5);
  const shapeBullets = bullets(sections.get('shapes') || []).slice(0, 3);
  const dos = bullets(sections.get("do's and don'ts") || []).slice(0, 4);
  const donts = bullets(sections.get("do's and don'ts") || []).slice(4, 8);
  const v = style.visual;
  const lines = [`# ${style.displayName} · ${style.nameZh}`, ''];
  if (overview) lines.push(trim(overview, 420), '');
  lines.push(`- 画布 canvas \`${v.canvas}\` · 表面 surface \`${v.surface}\` · 描边 \`${v.hairline}\``);
  lines.push(`- 文字 ink \`${v.ink}\` · 次要 \`${v.muted}\` · 强调 accent \`${v.accent}\`（其上文字 \`${v.accentText}\`）`);
  lines.push(`- 字体 display \`${v.displayFamily}\` ${v.displayWeight}/${v.displayTracking} · body \`${v.bodyFamily}\``);
  lines.push(`- 圆角 card ${v.radiusCard} / button ${v.radiusButton} / pill ${v.radiusPill} · 间距基准 ${v.spaceBase || 8}px`);
  lines.push('');
  if (layoutBullets.length) {
    lines.push('## 版式与间距', ...layoutBullets.map((b) => `- ${trim(b, 120)}`), '');
  }
  if (shapeBullets.length) {
    lines.push('## 形状', ...shapeBullets.map((b) => `- ${trim(b, 150)}`), '');
  }
  if (dos.length) lines.push('## 该做', ...dos.map((b) => `- ${trim(b, 160)}`), '');
  if (donts.length) lines.push('## 避免', ...donts.map((b) => `- ${trim(b, 160)}`), '');
  const hexOf = (name) => {
    const hit = style.colors.find((c) => c.name.toLowerCase() === String(name).toLowerCase());
    return hit ? hit.hex : '';
  };
  const resolved = lines.join('\n')
    .replace(/`\{colors\.([a-z0-9_-]+)\}`/gi, (whole, name) => {
      const hex = hexOf(name);
      return hex ? `\`${hex}\`` : '';
    })
    .replace(/\{colors\.([a-z0-9_-]+)\}/gi, (whole, name) => hexOf(name));
  const plain = resolved
    .replace(/\(\s*`?(#[0-9a-fA-F]{3,8})`?\s*[—–-]\s*`?\1`?\s*\)/g, '($1)')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\u2060/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n');
  return `${plain.trim()}\n`;
}

/* ------------------------------------------------------- 中文文案生成（自建） */

const CATS = {
  '品牌官网': {
    use: ['品牌官网首页', '营销落地页', '产品详情页'],
    avoid: ['强表格化后台', '高密度数据看板'],
    check: ['首屏只留一个主张与一个主 CTA', '用图片与留白做节奏，不靠彩色分区', '标题字距按品牌负值收紧，正文保持可读'],
  },
  'AI 产品': {
    use: ['产品官网', '模型能力介绍页', '开发者文档入口'],
    avoid: ['重型企业后台', '强表格化审批界面'],
    check: ['首屏讲清能做什么，而不是罗列参数', '能力区块用同一套卡片节奏，不堆渐变', '交互示例优先于大段说明文字'],
  },
  '开发工具': {
    use: ['开发者官网', '文档站', '代码示例与 API 页'],
    avoid: ['重营销大图页', '儿童化插画风格'],
    check: ['代码块用等宽字体并给出真实示例', '导航保留文档层级与搜索入口', '强调色只用于链接、选中态与复制按钮'],
  },
  '金融科技': {
    use: ['产品官网', '定价与费率页', '行情与控制台外壳'],
    avoid: ['社交化营销页', '游戏化抽奖页'],
    check: ['数字使用等宽或表格数字，右对齐', '强调色只给主 CTA 与关键指标', '深色界面下描边与次级文字要重新算对比'],
  },
  '效率协作': {
    use: ['产品官网', '功能与工作流页', '控制台外壳'],
    avoid: ['强装饰性海报页', '高饱和游戏化界面'],
    check: ['信息密度优先，卡片间距保持稳定节奏', '图标与文字同级，不抢主标', '空状态与加载态一并设计'],
  },
  '内容平台': {
    use: ['内容首页', '栏目与信息流', '文章详情页'],
    avoid: ['强表单后台', '企业审批界面'],
    check: ['标题层级清晰，正文行宽控制在 68ch 以内', '图片与文字的比例固定，避免每屏一个样', '强调色只用于分类标签与阅读态'],
  },
  '内容与建站': {
    use: ['产品官网', '模板与案例市场', '编辑与预览页'],
    avoid: ['重资产后台', '强表格化报表页'],
    check: ['模板卡片的预览比例统一', '首屏给出一键开始，不铺垫长文案', '深浅主题切换时保持同一套层级'],
  },
  '精选风格': {
    use: ['产品官网', '品牌页面', '落地页实验'],
    avoid: ['复杂企业后台', '多角色权限界面'],
    check: ['保留一个记忆点即可，不要同时用三种装饰', '排版节奏优先于插画', '配色控制在主色加中性色'],
  },
};

const hueLabel = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
  if (!m) return '中性色';
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (l < 0.16) return '近黑';
  if (s < 0.14) return '中性灰';
  let h = 0;
  if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  if (h < 18 || h >= 345) return '红';
  if (h < 42) return '橙';
  if (h < 62) return '琥珀黄';
  if (h < 88) return '柠檬黄';
  if (h < 148) return '草绿';
  if (h < 188) return '青绿';
  if (h < 214) return '湖蓝';
  if (h < 248) return '靛蓝';
  if (h < 284) return '紫罗兰';
  if (h < 318) return '洋红';
  return '玫红';
};

const DISPLAY_EX = {
  'x.ai': 'xAI', 'opencode.ai': 'OpenCode', 'together.ai': 'Together AI', 'mistral.ai': 'Mistral',
  'linear.app': 'Linear', 'bmw-m': 'BMW M', 'dell-1996': 'Dell 1996', 'nintendo-2001': 'Nintendo 2001',
  'theverge': 'The Verge', 'wired': 'WIRED', 'mongodb': 'MongoDB', 'nerdwallet': 'NerdWallet',
  'aljazeera': 'Al Jazeera', 'elevenlabs': 'ElevenLabs', 'minimax': 'MiniMax', 'hashicorp': 'HashiCorp',
  'posthog': 'PostHog', 'clickhouse': 'ClickHouse', 'ibm': 'IBM', 'hp': 'HP', 'sap': 'SAP', 'dji': 'DJI',
  'nvidia': 'NVIDIA', 'runwayml': 'Runway', '1win': '1win',
  'bmw': 'BMW', 'spacex': 'SpaceX', 'playstation': 'PlayStation', 'voltagent': 'VoltAgent',
  'mydealz': 'mydealz', 'jobright': 'Jobright',
};

const displayOf = (slug) => DISPLAY_EX[slug] ||
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

let LEX = { names: {}, categories: {} };

function zhMeta({ slug, displayName, visual, index }) {
  const category = LEX.categories[slug] || '精选风格';
  const nameZh = LEX.names[slug] || displayName;
  const preset = CATS[category] || CATS['精选风格'];

  const dark = Boolean(visual.darkFirst);
  const canvasTone = dark ? '近黑画布' : relLum(visual.canvas) > 0.93 ? '纯白画布' : '浅灰画布';
  const accent = hueLabel(visual.accent);
  const fontTone = visual.fontClass === 'serif' ? '衬线' : visual.fontClass === 'mono' ? '等宽' : '无衬线';
  const weightTone = visual.displayWeight >= 700 ? '重字重' : visual.displayWeight <= 400 ? '轻字重' : '中字重';
  const radiusTone = visual.radiusCard >= 20 ? '大圆角' : visual.radiusCard >= 8 ? '中等圆角' : '近直角';
  const densityTone = visual.spaceBase <= 8 ? '高信息密度' : '留白舒展';
  const contrastTone = contrastRatio(visual.ink, visual.canvas) >= 12 ? '强对比' : '柔和对比';

  const [use0, use1] = preset.use;
  const summaries = [
    `${canvasTone}打底、${accent}作唯一强调的${category}语言：${fontTone}标题配${weightTone}，${radiusTone}，${densityTone}。适合${use0}与${use1}。`,
    `${canvasTone} + ${accent}单点强调，${fontTone}标题${weightTone}拉出层级，${radiusTone}配合${densityTone}；做${use0}时落地门槛低，也扛得住${use1}。`,
    `一套克制的${category}方案：${canvasTone}、${accent}点缀、${fontTone}${weightTone}标题，${radiusTone}与${densityTone}构成节奏，常用于${use0}。`,
  ];
  const rc = Number.parseFloat(visual.radiusCard) || 0;
  const sb = visual.spaceBase || 8;
  const positionings = [
    `${displayName} 的辨识度来自${accent}的使用比例与${fontTone}标题的${weightTone}；其余交给${canvasTone}与${contrastTone}，卡片圆角 ${rc}px、间距基数 ${sb}px。`,
    `和同类${category}相比，${displayName} 更依赖${densityTone}和${radiusTone}而不是堆装饰；${accent}只出现在要你看的地方，圆角 ${rc}px。`,
    `${displayName} 的骨架是${contrastTone}加${fontTone}标题，${radiusTone}（${rc}px）收口，间距以 ${sb}px 为基数；改动时先守住${accent}的用量。`,
    `${displayName} 不靠插图讲故事：${canvasTone}、${fontTone}${weightTone}标题、${densityTone}，${accent}负责指路；这套尺度落在 ${rc}px 圆角与 ${sb}px 间距上。`,
    `${displayName} 的克制体现在取舍上——只留一个强调色（${accent}）、一套${fontTone}字阶、一档${radiusTone}；信息靠${contrastTone}与${densityTone}分层。`,
  ];

  const tagsZh = [...new Set([
    canvasTone, `${accent}强调`, `${fontTone}标题`, weightTone, radiusTone, densityTone,
  ])].slice(0, 6);

  return {
    nameZh,
    category,
    summaryZh: summaries[index % summaries.length],
    positioningZh: positionings[index % positionings.length],
    styleKeywords: [`${accent}强调`, `${fontTone}标题`, radiusTone, densityTone, dark ? '深色底' : '浅色底'].slice(0, 5),
    tagsZh,
    useCases: preset.use,
    bestFor: [use0, use1, dark ? '深色产品界面' : '浅色内容页'],
    avoidFor: preset.avoid,
    aiChecklist: preset.check,
    recommendedPromptZh: `参考 ${nameZh}（${slug}）的视觉语言做一套中文界面：保留${canvasTone}、${accent}强调、${fontTone}${weightTone}标题与${radiusTone}；把标题长度、正文行高和信息密度调整到适合中文阅读，不要引入未列出的颜色。`,
  };
}

/* ------------------------------------------------------------------- main */

const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const exists = async (file) => fs.access(file).then(() => true, () => false);

async function main() {
  const extra = await readJson(path.join(here, 'extra-metadata.json'));
  const overrides = await readJson(path.join(here, 'overrides.json'));
  const copy = await readJson(path.join(here, 'copy-overrides.json'));
  LEX = await readJson(path.join(here, 'zh-lexicon.json'));

  const slugs = (await fs.readdir(MAIN_ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();

  await fs.mkdir(OUT_DESIGN, { recursive: true });
  await fs.mkdir(path.join(OUT_DATA, 'brief'), { recursive: true });

  const styles = [];
  const zhStyles = styles;
  const missing = [];

  for (const slug of slugs) {
    const designFile = path.join(MAIN_ROOT, slug, 'DESIGN.md');
    if (!(await exists(designFile))) { missing.push(slug); continue; }
    const markdown = await fs.readFile(designFile, 'utf8');
    const { data } = parseFrontMatter(markdown);
    const hasFrontMatterTokens = Boolean(data.colors && Object.keys(data.colors).length);
    const mdTokens = hasFrontMatterTokens ? null : extractMarkdownTokens(markdown);

    const colors = hasFrontMatterTokens ? normalizeColors(data.colors) : (mdTokens.colorList || []);
    const typography = hasFrontMatterTokens ? normalizeTypography(data.typography) : (mdTokens.typographyList || []);
    const radius = hasFrontMatterTokens
      ? Object.entries(data.rounded || data.radius || {}).map(([name, value]) => ({ name, value: String(value) }))
      : Object.entries(mdTokens.rounded).map(([name, value]) => ({ name, value }));
    const spacing = hasFrontMatterTokens
      ? Object.entries(data.spacing || {}).map(([name, value]) => ({ name, value: String(value) }))
      : Object.entries(mdTokens.spacing).map(([name, value]) => ({ name, value }));
    const visual = buildVisual({ colors, typography, radius, spacing, hints: overrides[slug] || {} });

    const local = extra[slug] || null;
    const hand = copy[slug] || null;
    const displayName = local?.displayName || displayOf(slug);
    const zh = zhMeta({ slug, displayName, visual, index: zhStyles.length });

    await fs.writeFile(path.join(OUT_DESIGN, `${slug}.md`), markdown, 'utf8');

    const style = {
      slug,
      displayName,
      nameZh: local?.nameZh || zh.nameZh,
      category: local?.category || zh.category,
      group: 'reference',
      summaryZh: hand?.summaryZh || local?.summaryZh || zh.summaryZh,
      positioningZh: hand?.positioningZh || local?.positioningZh || zh.positioningZh,
      descriptionEn: String(data.description || '').trim(),
      styleKeywords: local?.styleKeywords || zh.styleKeywords,
      tagsZh: local?.tagsZh || zh.tagsZh,
      useCases: local?.useCases || zh.useCases,
      bestFor: local?.bestFor || zh.bestFor,
      avoidFor: local?.avoidFor || zh.avoidFor,
      aiChecklist: local?.aiChecklist || zh.aiChecklist,
      recommendedPromptZh: local?.recommendedPromptZh || zh.recommendedPromptZh,
      updatedAt: '',
      sourceUrl: `https://getdesign.md/${slug}/design-md`,
      designFile: `data/design/${slug}.md`,
      colors,
      typography,
      radius,
      spacing,
      visual,
      componentCount: Object.keys(data.components || {}).length,
    };

    style.visual.fontClass = overrides[slug]?.fontClass || detectFontClass(markdown, visual.displayFamily, typography);
    style.visual = sanitizeVisual(style.visual);
    style.briefFile = `data/brief/${slug}.md`;
    await fs.writeFile(path.join(OUT_DATA, 'brief', `${slug}.md`), buildBrief(style, markdown), 'utf8');
    styles.push(style);
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    source: {
      main: 'awesome-design-md-main/design-md',
      license: 'MIT © 2026 VoltAgent — see THIRD-PARTY-NOTICES.md',
      count: styles.length,
    },
    styles,
  };

  await fs.writeFile(path.join(OUT_DATA, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

  console.log(`styles: ${styles.length}`);
  console.log(`skipped: ${missing.length ? missing.join(', ') : 'none'}`);
  console.log('zh copy: generated from tokens (no third-party Chinese text)');
  console.log(`color tokens: ${styles.reduce((n, s) => n + s.colors.length, 0)}, type steps: ${styles.reduce((n, s) => n + s.typography.length, 0)}`);
  const noAccent = styles.filter((s) => s.visual.accent === '#3b5bdb').map((s) => s.slug);
  console.log(`fallback accent: ${noAccent.length ? noAccent.join(', ') : 'none'}`);
  const report = styles.map((s) => {
    const v = s.visual;
    const show = (hex) => `${hex}${relLum(hex) < 0.35 ? '·D' : relLum(hex) > 0.85 ? '·L' : ''}`;
    return [s.slug.padEnd(18), (v.darkFirst ? 'DARK ' : '     '), show(v.canvas).padEnd(12), show(v.ink).padEnd(12), show(v.accent).padEnd(12), v.displayFamily.slice(0, 16).padEnd(17), String(s.colors.length).padStart(3), String(s.typography.length).padStart(3)].join(' ');
  });
  await fs.writeFile(path.join(here, 'report.txt'), `slug               mode  canvas      ink         accent      display-font      C   T\n${report.join('\n')}\n`, 'utf8');
  console.log(`catalog bytes: ${(await fs.stat(path.join(OUT_DATA, 'catalog.json'))).size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
