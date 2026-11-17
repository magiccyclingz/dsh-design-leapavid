import json, pathlib

root = pathlib.Path(__file__).resolve().parents[2]
catalog = json.loads((root / 'data/catalog.json').read_text())

HTML = r'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>设计风格库 · 提案 v2</title>
<style>
  :root{
    --ink:#1e1e1e; --ink-2:#4d4d4d; --ink-3:#8c8c8c; --line:#e6e6e6; --line-2:#f0f0f0;
    --bg:#ffffff; --bg-2:#f5f5f5; --accent:#000000; --accent-dark:#333333; --radius:10px;
    --shadow:0 1px 2px rgba(0,0,0,.05),0 10px 30px -20px rgba(0,0,0,.25);
    --serif:-apple-system,BlinkMacSystemFont,"Inter","Helvetica Neue","PingFang SC",system-ui,sans-serif;
  }
  *{box-sizing:border-box}
  html,body{margin:0;background:var(--bg);color:var(--ink);
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue","PingFang SC","Hiragino Sans GB",system-ui,sans-serif;
    -webkit-font-smoothing:antialiased}
  a{color:inherit}
  .wrap{width:100%;max-width:none;margin:0;padding:0 clamp(20px,3.2vw,64px)}
  /* ── top bar ── */
  .top{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.86);backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--line)}
  .top-in{display:flex;align-items:center;gap:18px;height:52px}
  .mark{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:600;letter-spacing:.01em}
  .mark i{width:22px;height:22px;border-radius:6px;display:block;background:conic-gradient(from 210deg,#f24e1e,#ff7262 18%,#a259ff 42%,#1abcfe 64%,#0acf83 84%,#f24e1e)}
  .top nav{display:flex;gap:20px;font-size:13px;color:var(--ink-2);margin-left:14px}
  .top nav b{color:var(--ink);font-weight:500}
  .top .right{margin-left:auto;display:flex;gap:10px;align-items:center}
  .ghost{font-size:12.5px;padding:7px 13px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink-2);cursor:pointer}
  .ghost:hover{color:var(--ink);border-color:#d4d4d6}
  .primary{font-size:12.5px;padding:9px 16px;border:0;border-radius:8px;background:var(--accent);color:#fff;font-weight:600;cursor:pointer}
  /* ── hero heading ── */
  .hero{padding:clamp(36px,4vw,72px) 0 26px}
  .kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:600}
  h1{font-size:clamp(34px,3.6vw,58px);line-height:1.06;letter-spacing:-.032em;margin:14px 0 14px;font-weight:700}
  .lede{font-size:15.5px;line-height:1.6;color:var(--ink-2);max-width:72ch;margin:0}
  /* ── controls ── */
  .controls{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:22px 0 14px;border-bottom:1px solid var(--line)}
  .seg{display:inline-flex;background:#f0f0f0;border-radius:8px;padding:3px;gap:2px}
  .seg button{appearance:none;border:0;background:transparent;font:inherit;font-size:12.5px;color:var(--ink-2);padding:6px 14px;border-radius:8px;cursor:pointer;transition:background .15s,color .15s}
  .seg button.on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.12)}
  .search{flex:1;min-width:220px;display:flex;align-items:center;gap:8px;background:#f5f5f5;border-radius:8px;padding:10px 14px;border:1px solid transparent}
  .search:focus-within{border-color:#000;background:#fff;box-shadow:0 0 0 3px rgba(0,0,0,.10)}
  .search svg{width:14px;height:14px;color:var(--ink-3)}
  .search input{border:0;background:transparent;outline:none;font:inherit;font-size:13px;width:100%;color:var(--ink)}
  .count{font-size:12.5px;color:var(--ink-3);font-variant-numeric:tabular-nums}
  .chips{display:flex;gap:8px;overflow-x:auto;padding:14px 0 4px;scrollbar-width:none}
  .chips::-webkit-scrollbar{display:none}
  .chip{white-space:nowrap;font-size:12.5px;padding:6px 12px;border-radius:7px;border:1px solid var(--line);color:var(--ink-2);background:#fff;cursor:pointer}
  .chip:hover{color:var(--ink)}
  .chip.on{background:var(--ink);border-color:var(--ink);color:#fff;font-weight:600}
  /* ── grid ── */
  .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(26px,2vw,44px) clamp(20px,1.8vw,36px);padding:34px 0 90px}
  @media (max-width: 1180px){ .grid{grid-template-columns:repeat(2,minmax(0,1fr))} }
  @media (max-width: 720px){ .grid{grid-template-columns:1fr} }
  @media (min-width: 1440px){ .grid{grid-template-columns:repeat(4,minmax(0,1fr))} }
  @media (min-width: 1900px){ .grid{grid-template-columns:repeat(5,minmax(0,1fr))} }
  .card{cursor:pointer;min-width:0}
  .frame{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;transition:box-shadow .2s,transform .2s,border-color .2s}
  .card:hover .frame{box-shadow:var(--shadow);transform:translateY(-2px);border-color:#dcdcdf}
  .frame .art{display:block}
  .meta{display:flex;align-items:baseline;gap:8px;margin-top:15px}
  .name{font-size:16.5px;font-weight:600;letter-spacing:-.01em;margin:0}
  .cat{font-size:12px;color:var(--ink-3)}
  .sub{font-size:12.5px;color:var(--ink-3);margin:3px 0 0}
  .card{container-type:inline-size}
  .desc{font-size:13px;line-height:1.62;color:var(--ink-2);margin:9px 0 0;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;
    -webkit-line-clamp:4;line-clamp:4;min-height:calc(1.62em * 3)}
  @container (min-width: 340px){ .desc{-webkit-line-clamp:3;line-clamp:3} }
  @container (min-width: 460px){ .desc{-webkit-line-clamp:2;line-clamp:2} }
  .dots{display:flex;gap:5px;margin-top:12px}
  .dots i{width:13px;height:13px;border-radius:4px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.10)}
  /* ── preview canvases ── */
  .art{position:relative;width:100%;overflow:hidden;container-type:inline-size;background:var(--dm-bg)}
  .art-web{aspect-ratio:16/10}
  .art-slides{aspect-ratio:16/9}
  .art-poster{aspect-ratio:4/5}
  .art-web .hero2{container-type:inline-size}
  @container (max-width: 460px){ .hero2{grid-template-columns:1fr!important} .hero-media{display:none!important} }
  /* ── detail ── */
  .detail{padding:26px 0 90px;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:38px;align-items:start}
  .back{font-size:12.5px;color:var(--ink-2);background:none;border:1px solid var(--line);border-radius:999px;padding:6px 13px;cursor:pointer}
  .d-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:18px 0 20px}
  .d-head h2{font-size:clamp(28px,2.4vw,38px);letter-spacing:-.03em;margin:0;font-weight:700}
  .d-head p{margin:6px 0 0;font-size:13px;color:var(--ink-3)}
  .theme{display:inline-flex;background:#f0f0f0;border-radius:8px;padding:3px;gap:2px}
  .theme button{appearance:none;border:0;background:transparent;font:inherit;font-size:12px;padding:5px 12px;border-radius:7px;color:var(--ink-2);cursor:pointer}
  .theme button.on{background:#fff;color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,.08)}
  .big-frame{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff}
  .sec{margin-top:34px;padding-top:26px;border-top:1px solid var(--line)}
  .sec h3{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:600;margin:0 0 14px}
  .sec p{font-size:14px;line-height:1.72;color:var(--ink-2);margin:0 0 10px;max-width:68ch}
  .pal{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .sw{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff}
  .sw .chipc{height:58px}
  .sw .nm{padding:8px 11px 10px;display:flex;justify-content:space-between;gap:8px;font-size:11.5px;color:var(--ink-2)}
  .sw .nm b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sw .nm span{font-variant-numeric:tabular-nums;color:var(--ink-3)}
  .type-row{display:flex;align-items:center;gap:16px;padding:9px 0;border-bottom:1px solid var(--line-2)}
  .type-row .aa{width:52px;flex:none;line-height:1;color:var(--ink)}
  .type-row .tk{font-size:12.5px;color:var(--ink);width:150px;flex:none}
  .type-row .vm{font-size:12px;color:var(--ink-3);font-variant-numeric:tabular-nums;margin-left:auto}
  .tags2{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
  .tag2{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:#fff}
  .tag2 span:last-child{color:var(--ink);font-variant-numeric:tabular-nums}
  .tag2 span:first-child{color:var(--ink-3)}
  .side{position:sticky;top:78px;border:1px solid var(--line);border-radius:18px;padding:20px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)}
  .side h4{margin:0 0 4px;font-size:14px;font-weight:600}
  .side .hint{font-size:12px;color:var(--ink-3);margin:0 0 16px;line-height:1.55}
  .lbl{font-size:11.5px;color:var(--ink-3);margin:14px 0 7px;letter-spacing:.04em}
  .side textarea{width:100%;min-height:92px;resize:vertical;border:1px solid var(--line);border-radius:10px;padding:10px 11px;font:inherit;font-size:12.5px;line-height:1.6;outline:none;color:var(--ink)}
  .side textarea:focus{border-color:#c9c9cf}
  .pillbar{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
  .pillbar button{font:inherit;font-size:12px;padding:8px 0;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink-2);cursor:pointer}
  .pillbar button.on{background:var(--ink);border-color:var(--ink);color:#fff}
  .send{width:100%;margin-top:16px;padding:10px 0;border:0;border-radius:999px;background:var(--accent);color:#fff;font:inherit;font-size:13px;font-weight:500;cursor:pointer}
  .send2{width:100%;margin-top:8px;padding:9px 0;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink-2);font:inherit;font-size:12.5px;cursor:pointer}
  .hidden{display:none!important}
  .note{font-size:12px;color:var(--ink-3);text-align:center;padding:26px 0 0}

  /* ── detail v3 ── */
  .d-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
  .d-note{font-size:11.5px;color:var(--ink-3)}
  .detail2{display:grid;grid-template-columns:minmax(0,1fr) clamp(340px,24vw,460px);gap:clamp(24px,2vw,40px);align-items:stretch;padding-bottom:70px}
  .d-left{min-width:0;align-self:stretch}
  .preview-hold{position:static}
  .cap{font-size:11.5px;color:var(--ink-3);margin-top:10px;display:flex;justify-content:space-between;gap:10px}
  .page-frame{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden;
    box-shadow:0 1px 2px rgba(0,0,0,.03)}
  .page-frame .art-web{aspect-ratio:auto}
  .frame-hint{color:var(--ink-3)}
  .d-right{display:flex;flex-direction:column;gap:14px}
  .card2{border:1px solid var(--line);border-radius:10px;padding:20px 22px;background:#fff}
  .card2 h3{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);font-weight:600;margin:0 0 12px}
  .card2 p{font-size:13px;line-height:1.7;color:var(--ink);margin:0 0 8px}
  .card2 p.dim{color:var(--ink-2)}
  .kv{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
  .kv span{font-size:11.5px;padding:4px 10px;border-radius:6px;background:#f5f5f5;color:var(--ink-2)}
  .kv span.ok{background:#f0f0f0;color:#1e1e1e}
  .kv span.no{background:#f3f3f3;color:#8c8c8c}
  .pal2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .sw2{display:grid;grid-template-columns:20px 1fr;grid-template-rows:auto auto;column-gap:8px;align-items:center}
  .sw2 i{width:20px;height:20px;border-radius:6px;grid-row:1 / span 2;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
  .sw2 b{font-size:11.5px;font-weight:500;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sw2 code{font-size:10.5px;color:var(--ink-3);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  .row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--line-2);font-size:12.5px}
  .row .k{color:var(--ink-3)}
  .row .v{color:var(--ink);text-align:right}
  .row .v.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px}
  .type-wrap{margin-top:12px}
  .type-row{display:flex;align-items:center;gap:12px;padding:6px 0;border-bottom:1px solid var(--line-2)}
  .type-row .aa{width:44px;flex:none;line-height:1;color:var(--ink)}
  .type-row .tk{font-size:11.5px;color:var(--ink-2);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .type-row .vm{font-size:10.5px;color:var(--ink-3);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:nowrap}
  .scale-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
  .scale-row span{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:var(--ink-3);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  .scale-row i{display:inline-block;height:10px;background:#e8e8ec;border-radius:2px}
  .scale-row i.rad{width:16px;height:16px;background:#fff;box-shadow:inset 0 0 0 1.5px #c9c9cf}
  .sheet{border:1px solid var(--line);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px}
  .sheet-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .sheet-card{padding:10px}
  .sheet-input{padding:8px 12px;font-size:11.5px}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .form-card{border-color:#dcdce2}
  .lbl{font-size:11px;color:var(--ink-3);margin:12px 0 6px;letter-spacing:.04em}
  .form-card textarea{width:100%;min-height:84px;resize:vertical;border:1px solid var(--line);border-radius:10px;padding:9px 11px;font:inherit;font-size:12.5px;line-height:1.6;outline:none;color:var(--ink)}
  .form-card textarea:focus{border-color:#c9c9cf}
  .send{width:100%;margin-top:12px;padding:10px 0;border:0;border-radius:8px;background:var(--accent);color:#fff;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
  .send2{width:100%;margin-top:8px;padding:9px 0;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink-2);font:inherit;font-size:12px;cursor:pointer}
  @media (max-width:1080px){ .detail2{grid-template-columns:1fr} .preview-hold{position:static} }
</style>
</head>
<body>
<div class="top"><div class="wrap top-in">
  <div class="mark"><i></i>Design MD</div>
  <nav><b>风格库</b><span>案例</span><span>规范</span></nav>
  <div class="right">
    <button class="ghost">文档</button>
    <button class="primary">开始设计</button>
  </div>
</div></div>

<main id="app"></main>
<script>
const DATA = __DATA__;
const T = {
  web: { label: '网页', cls: 'art-web' },
  slides: { label: '幻灯片', cls: 'art-slides' },
  poster: { label: '海报', cls: 'art-poster' },
};
const state = { view: 'list', slug: null, surface: 'web', theme: 'light', query: '', cat: null };

const q = new URLSearchParams(location.search);
if (q.get('slug')) { state.view = 'detail'; state.slug = q.get('slug'); }
if (q.get('surface')) state.surface = q.get('surface');

/* ───────── tokens ───────── */
const hex = (h) => { const s = String(h || '#000').replace('#',''); const n = s.length===3 ? s.split('').map(c=>c+c).join('') : s.padEnd(6,'0').slice(0,6); return [0,2,4].map(i=>parseInt(n.slice(i,i+2),16)); };
const rgb = (a) => `rgb(${a.map(v=>Math.round(v)).join(',')})`;
const mix = (a,b,t) => rgb(hex(a).map((v,i)=>v+(hex(b)[i]-v)*t));
const alpha = (c,a) => { const [r,g,b] = hex(c); return `rgba(${r},${g},${b},${a})`; };
const lum = (c) => { const [r,g,b] = hex(c).map(v=>{v/=255; return v<=.03928? v/12.92 : Math.pow((v+.055)/1.055,2.4)}); return .2126*r+.7152*g+.0722*b; };

function theme(s, kind, mode) {
  const v = s.visual;
  if (kind === 'poster') {
    if (v.darkFirst) return { bg: v.darkCanvas, surface: v.darkSurface, ink: v.darkInk, muted: v.darkMuted, line: mix(v.darkCanvas, v.darkInk, .18), accent: v.accent, accentInk: v.accentText, dark: true };
    return { bg: v.ink, surface: mix(v.ink, v.canvas, .08), ink: v.canvas, muted: mix(v.canvas, v.ink, .34), line: mix(v.ink, v.canvas, .22), accent: v.accent, accentInk: v.accentText, dark: true };
  }
  if (kind === 'slides') return { bg: v.canvas, surface: mix(v.canvas, v.ink, .04), ink: v.ink, muted: v.muted, line: v.hairline, accent: v.accent, accentInk: v.accentText, dark: false };
  const dark = mode === 'dark' || v.darkFirst;
  if (dark) return { bg: v.darkCanvas, surface: v.darkSurface, ink: v.darkInk, muted: v.darkMuted, line: mix(v.darkCanvas, v.darkInk, .16), accent: v.accent, accentInk: v.accentText, dark: true };
  return { bg: v.canvas, surface: v.surface, ink: v.ink, muted: v.muted, line: v.hairline, accent: v.accent, accentInk: v.accentText, dark: false };
}

const radius = (val) => { const t = String(val||''); return /^9{3,}/.test(t) ? '9999px' : t; };
const px = (val, base) => `${(parseFloat(val)||0)/base*100}cqw`;

function copy(s) {
  const title = s.displayName;
  const hero = title;
  const cards = (s.useCases && s.useCases.length ? s.useCases : s.tagsZh || ['产品', '方案', '支持']).slice(0, 3);
  return {
    brand: title,
    nav: ['产品', '方案', '定价'],
    kicker: s.category,
    hero,
    lede: (s.summaryZh || s.descriptionEn || '').split('；')[0],
    tagline: (s.styleKeywords || []).slice(0, 3).join(' · '),
    cta: '开始使用',
    cta2: '了解更多',
    cards,
    cardBody: '按这套版式排布的模块说明与要点。',
    learn: '了解更多 →',
    slideKicker: s.category + ' / 设计规范',
    slideTitle: title,
    slideSub: (s.styleKeywords || []).slice(0, 3).join(' · '),
    bullets: (s.useCases && s.useCases.length ? s.useCases : s.styleKeywords || []).slice(0, 3),
    posterKicker: (s.styleKeywords || [])[0] || s.category,
    posterTitle: title,
    posterSub: (s.styleKeywords || []).slice(1, 3).join(' · '),
    posterLede: (s.summaryZh || '').split('；')[0],
    footnote: 'DESIGN.md · ' + (s.category || ''),
    links: ['隐私', '条款', '联系'],
  };
}

/* ───────── preview renderers ───────── */
function webArt(s, mode) {
  const th = theme(s, 'web', mode);
  const v = s.visual, c = copy(s);
  const u = (n) => px(n, 1180);
  const pal = (s.colors || []).filter((x) => x.hex);
  const typ = (s.typography || []).slice(0, 6);
  const radii = (s.radius || []).slice(0, 5);
  const spaces = Object.entries(v.space || {}).slice(0, 7);
  const rb = radius(v.radiusButton), rp = radius(v.radiusPill), rc = radius(v.radiusCard);
  const soft = mix(th.bg, th.ink, .04);
  const shadow = (k) => `0 ${u(2 * k)} ${u(8 * k)} ${alpha(th.ink, .06 + k * .03)}`;
  const label = (n, name) => `<div style="font-family:${v.monoFamily || 'ui-monospace'};font-size:${u(10)};letter-spacing:.09em;text-transform:uppercase;color:${th.muted};margin-bottom:${u(6)}">${n} / ${name}</div>`;
  const h2 = (t) => `<div style="font-family:${v.displayStack};font-size:${u(26)};font-weight:${v.displayWeight};letter-spacing:${v.displayTracking};line-height:1.15;color:${th.ink}">${t}</div>`;
  const section = (id, inner) => `<div id="${id}" style="max-width:${u(1100)};margin:0 auto;padding:${u(40)} ${u(28)};border-top:1px solid ${th.line};background:${th.bg}">${inner}</div>`;

  const swatches = pal.slice(0, 12).map((x) => `<div style="border:1px solid ${th.line};border-radius:${rc};overflow:hidden;background:${th.surface}">
      <div style="height:${u(56)};background:${x.hex};border-bottom:1px solid ${th.line}"></div>
      <div style="padding:${u(9)} ${u(10)}">
        <div style="font-size:${u(11)};font-weight:600;color:${th.ink}">${x.name}</div>
        <div style="font-family:${v.monoFamily || 'ui-monospace'};font-size:${u(10)};color:${th.muted};margin-top:${u(2)}">${x.hex}</div>
      </div>
    </div>`).join('');

  const typeRows = typ.map((t) => `<div style="padding-bottom:${u(12)};margin-bottom:${u(14)};border-bottom:1px solid ${th.line}">
      <div style="font-family:${t.fontFamily || v.displayStack};font-size:${u(Math.min(34, (parseFloat(t.fontSize) || 24) * .62))};font-weight:${t.fontWeight || 400};line-height:1.15;letter-spacing:${t.letterSpacing || 0};color:${th.ink}">设计系统 Design System</div>
      <div style="font-family:${v.monoFamily || 'ui-monospace'};font-size:${u(10)};color:${th.muted};margin-top:${u(6)}">${t.token} · ${[t.fontSize, t.fontWeight, t.lineHeight].filter(Boolean).join(' / ')}</div>
    </div>`).join('');

  const btns = [['主要按钮', `background:${th.accent};color:${th.accentInk}`, rb], ['次要按钮', `background:${th.ink};color:${th.bg}`, rb], ['描边按钮', `border:1px solid ${th.line};color:${th.ink}`, rb], ['标签胶囊', `background:${th.surface};color:${th.muted}`, rp]]
    .map(([t, style, r]) => `<div style="text-align:center"><span style="display:inline-flex;align-items:center;height:${u(34)};padding:0 ${u(16)};border-radius:${r};font-size:${u(11.5)};font-weight:600;${style}">${t}</span></div>`).join('');

  const cards = (c.cards).map((t, i) => `<div style="border:1px solid ${th.line};border-radius:${rc};overflow:hidden;background:${th.surface};box-shadow:${shadow(1)}">
      <div style="height:${u(84)};background:linear-gradient(135deg,${th.accent},${th.surface})"></div>
      <div style="padding:${u(12)}">
        <div style="font-size:${u(12.5)};font-weight:600;color:${th.ink}">${t}</div>
        <div style="font-size:${u(10.5)};line-height:1.55;color:${th.muted};margin-top:${u(5)}">${c.cardBody}</div>
      </div>
    </div>`).join('');

  const formEl = (inner, extra) => `<div style="height:${u(30)};display:flex;align-items:center;padding:0 ${u(11)};border:1px solid ${th.line};border-radius:${rp === '9999px' ? u(8) : rp};background:${th.bg};font-size:${u(11)};color:${th.muted};${extra || ''}">${inner}</div>`;

  const spacingBars = spaces.map(([k, val]) => `<div style="display:flex;align-items:center;gap:${u(10)};margin-bottom:${u(7)}">
      <span style="width:${u(34)};font-family:${v.monoFamily || 'ui-monospace'};font-size:${u(9.5)};color:${th.muted}">${k}</span>
      <span style="height:${u(9)};width:${u(Math.min(180, Math.max(4, (parseFloat(val) || 4) * 2.4)))};background:${alpha(th.accent, .55)};border-radius:${u(2)}"></span>
      <span style="font-family:${v.monoFamily || 'ui-monospace'};font-size:${u(9.5)};color:${th.muted}">${val}</span>
    </div>`).join('');

  const radiusBoxes = radii.map((r) => `<div style="text-align:center">
      <div style="height:${u(52)};border:1px solid ${th.line};border-radius:${radius(r.value) === '9999px' ? '9999px' : u(Math.min(26, parseFloat(r.value) || 4))};background:${th.surface}"></div>
      <div style="font-family:${v.monoFamily || 'ui-monospace'};font-size:${u(9.5)};color:${th.muted};margin-top:${u(5)}">${r.name} ${r.value}</div>
    </div>`).join('');

  const elev = [1, 2, 3].map((k) => `<div style="height:${u(64)};border-radius:${rc};border:1px solid ${th.line};background:${th.bg};box-shadow:${shadow(k)};display:flex;align-items:center;justify-content:center;font-size:${u(10.5)};color:${th.muted}">elevation ${k}</div>`).join('');

  return `<div class="art art-web" style="--dm-bg:${th.bg};background:${th.bg};color:${th.ink};font-family:${v.bodyStack}">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:${u(16)};padding:${u(12)} ${u(28)};border-bottom:1px solid ${th.line}">
      <div style="display:flex;align-items:center;gap:${u(9)}">
        <span style="width:${u(16)};height:${u(16)};border-radius:${u(4)};background:${th.accent};display:inline-block"></span>
        <span style="font-size:${u(12)};font-weight:700">${c.brand}</span>
      </div>
      <div style="display:flex;gap:${u(14)};font-size:${u(10.5)};color:${th.muted}">${['Colors','Typography','Buttons','Cards','Forms','Spacing','Radius','Elevation'].map((n) => `<span>${n}</span>`).join('')}</div>
      <span style="display:inline-flex;align-items:center;height:${u(24)};padding:0 ${u(11)};border-radius:${rp};background:${th.accent};color:${th.accentInk};font-size:${u(10)};font-weight:700">Design System</span>
    </div>

    <div style="text-align:center;padding:${u(46)} ${u(28)} ${u(38)}">
      <div style="font-family:${v.displayStack};font-weight:${v.displayWeight};letter-spacing:${v.displayTracking};line-height:1.02;
        font-size:min(${px((v.displaySize || 48) * 1.3, 1180)}, 54px);color:${th.ink}">Design System<br>Inspired by <span style="color:${th.accent}">${c.brand}</span></div>
      <div style="max-width:${u(520)};margin:${u(14)} auto ${u(18)};font-size:${u(12.5)};line-height:1.6;color:${th.muted}">${c.lede}</div>
      <div style="display:flex;justify-content:center;gap:${u(9)}">
        <span style="display:inline-flex;align-items:center;height:${u(30)};padding:0 ${u(15)};border-radius:${rb};background:${th.accent};color:${th.accentInk};font-size:${u(11)};font-weight:600">Open DESIGN.md</span>
        <span style="display:inline-flex;align-items:center;height:${u(30)};padding:0 ${u(15)};border-radius:${rb};border:1px solid ${th.line};color:${th.ink};font-size:${u(11)}">${mode === 'dark' ? 'Light' : 'Dark'} Preview</span>
      </div>
    </div>

    ${section('colors', label('01', 'Colors') + h2('Color Palette') + `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:${u(10)};margin-top:${u(16)}">${swatches}</div>`)}
    ${section('typography', label('02', 'Typography') + h2('Type Scale') + `<div style="margin-top:${u(16)}">${typeRows}</div>`)}
    ${section('buttons', label('03', 'Buttons') + h2('Buttons') + `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:${u(10)};margin-top:${u(16)}">${btns}</div>`)}
    ${section('cards', label('04', 'Cards') + h2('Cards') + `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:${u(12)};margin-top:${u(16)}">${cards}</div>`)}
    ${section('forms', label('05', 'Forms') + h2('Forms') + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:${u(10)};margin-top:${u(16)}">${formEl('name@example.com')}${formEl('Select an option  ▾')}${formEl('Multi-line message…', `height:${u(58)};align-items:flex-start;padding-top:${u(9)}`)}${formEl(`<span style="display:inline-flex;align-items:center;gap:${u(7)}"><span style="width:${u(11)};height:${u(11)};border-radius:${u(3)};background:${th.accent};display:inline-block"></span>记住我</span>`)}</div>`)}
    ${section('spacing', label('06', 'Spacing') + h2('Spacing Scale') + `<div style="margin-top:${u(16)}">${spacingBars}</div>`)}
    ${section('radius', label('07', 'Radius') + h2('Radius Scale') + `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:${u(10)};margin-top:${u(16)}">${radiusBoxes}</div>`)}
    ${section('elevation', label('08', 'Elevation') + h2('Elevation') + `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:${u(14)};margin-top:${u(16)}">${elev}</div>`)}

    <div style="border-top:1px solid ${th.line};padding:${u(18)} ${u(28)};display:flex;justify-content:space-between;font-size:${u(10)};color:${th.muted}">
      <span>${c.brand} · design tokens from DESIGN.md</span><span>awesome-design-md</span>
    </div>
  </div>`;
}

function slidesArt(s) {
  const th = theme(s, 'slides'), v = s.visual, c = copy(s);
  const u = (n) => px(n, 1280);
  return `<div class="art art-slides" style="background:${th.bg};color:${th.ink};font-family:${v.bodyStack};position:relative;overflow:hidden">
    <div style="position:absolute;right:${u(-16)};top:${u(-34)};font-family:${v.displayStack};font-weight:${v.displayWeight};
      font-size:${u(300)};line-height:1;color:${alpha(th.ink,.07)};pointer-events:none">01</div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:${u(6)};background:${th.accent}"></div>
    <div style="position:relative;display:flex;flex-direction:column;height:100%;padding:${u(36)} ${u(56)} ${u(30)} ${u(64)}">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:${u(10.5)};letter-spacing:.14em;text-transform:uppercase;color:${th.muted}">
        <span>${c.slideKicker}</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
        <div style="font-family:${v.displayStack};font-weight:${v.displayWeight};letter-spacing:${v.displayTracking};font-size:min(${px(v.displaySize*1.7,1280)}, 64px);line-height:${v.displayLineHeight||1.05}">${c.slideTitle}</div>
        <div style="width:${u(64)};height:${u(3)};background:${th.accent};margin:${u(22)} 0 ${u(14)}"></div>
        <div style="font-size:${u(13)};color:${th.muted};letter-spacing:.02em">${c.slideSub}</div>
        <div style="display:flex;flex-direction:column;gap:${u(11)};margin-top:${u(26)}">
          ${c.bullets.map(b=>`<div style="display:flex;align-items:center;gap:${u(12)};font-size:${u(15)};color:${th.ink}">
            <span style="width:${u(6)};height:${u(6)};border-radius:50%;background:${th.accent};flex:none"></span>${b}</div>`).join('')}
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${th.line};padding-top:${u(12)};font-size:${u(10)};color:${th.muted}">
        <span>${c.brand} · Design System</span><span>01 / 08 · getdesign.md</span>
      </div>
    </div>
  </div>`;
}

function posterArt(s) {
  const th = theme(s, 'poster'), v = s.visual, c = copy(s);
  const u = (n) => px(n, 900);
  return `<div class="art art-poster" style="background:${th.bg};color:${th.ink};font-family:${v.bodyStack}">
    <div style="display:flex;flex-direction:column;height:100%;padding:${u(38)} ${u(42)}">
      <div style="display:flex;justify-content:space-between;font-size:${u(10)};letter-spacing:.18em;text-transform:uppercase;color:${th.muted}">
        <span style="color:${th.accent}">${c.posterKicker}</span><span>2026</span>
      </div>
      <div style="flex:1"></div>
      <div style="display:flex;flex-direction:column;justify-content:flex-end">
        <div style="font-family:${v.displayStack};font-weight:${v.displayWeight};text-transform:uppercase;letter-spacing:${v.displayTracking};
          font-size:min(${px(v.displaySize*2.5,900)}, 84px);line-height:.96">${c.posterTitle}</div>
        <div style="width:100%;height:${u(2)};background:${th.accent};margin:${u(22)} 0 ${u(16)}"></div>
        <div style="font-size:${u(12.5)};line-height:1.6;color:${th.muted};max-width:${u(330)}">${c.posterSub || c.posterLede}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;font-size:${u(9.5)};letter-spacing:.1em;text-transform:uppercase;color:${th.muted}">
        <span>${c.footnote}</span><span style="color:${th.accent}">●</span>
      </div>
    </div>
  </div>`;
}

function art(s, surface, mode) {
  if (surface === 'slides') return slidesArt(s);
  if (surface === 'poster') return posterArt(s);
  return webArt(s, mode);
}

/* ───────── list ───────── */
function filtered() {
  const qq = state.query.trim().toLowerCase();
  return DATA.styles.filter((s) => {
    if (state.cat && s.category !== state.cat) return false;
    if (!qq) return true;
    const hay = [s.slug, s.displayName, s.nameZh, s.category, s.summaryZh, ...(s.tagsZh||[]), ...(s.styleKeywords||[]), ...(s.useCases||[])].join(' ').toLowerCase();
    return hay.includes(qq);
  });
}

function renderList() {
  const items = filtered();
  const cats = [...new Set(DATA.styles.map(s=>s.category))];
  document.getElementById('app').innerHTML = `
  <div class="wrap">
    <div class="hero">
      <div class="kicker">Design Library</div>
      <h1>84 套品牌设计语言</h1>
      <p class="lede">每一套都由该品牌 DESIGN.md 的 token 现场渲染 —— 不是截图，是同一套颜色、字体与间距在网页、幻灯片、海报三种载体上的真实投影。挑一套，写清楚你要做什么。</p>
    </div>
    <div class="controls">
      <div class="seg">${Object.entries(T).map(([k,v])=>`<button data-surface="${k}" class="${state.surface===k?'on':''}">${v.label}</button>`).join('')}</div>
      <div class="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="q" placeholder="搜索品牌、风格关键词、适用场景" value="${state.query.replace(/"/g,'&quot;')}">
      </div>
      <div class="count">${items.length} / ${DATA.styles.length}</div>
    </div>
    <div class="chips">
      <button class="chip ${state.cat===null?'on':''}" data-cat="">全部</button>
      ${cats.map(c=>`<button class="chip ${state.cat===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}
    </div>
    <div class="grid">
      ${items.map(s=>`
        <div class="card" data-slug="${s.slug}">
          <div class="frame">${art(s, state.surface, 'light')}</div>
          <div class="meta"><h3 class="name">${s.nameZh === s.displayName ? s.displayName : s.nameZh}</h3><span class="cat">${s.category}</span></div>
          <p class="sub">${s.displayName === s.nameZh ? '' : s.displayName + ' · '}${(s.styleKeywords||[]).slice(0,2).join(' / ')}</p>
          <p class="desc">${s.summaryZh || ''}</p>
          <div class="dots">${[s.visual.canvas, s.visual.accent, s.visual.ink, s.visual.surface].map(c=>`<i style="background:${c}"></i>`).join('')}</div>
        </div>`).join('')}
    </div>
    <div class="note">提案预览 · 数据与真实插件一致（catalog.json v${DATA.generatedAt || ''}）</div>
  </div>`;
  document.querySelectorAll('[data-surface]').forEach(el=>el.onclick=()=>{ state.surface = el.dataset.surface; renderList() });
  document.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{ state.cat = el.dataset.cat || null; renderList() });
  document.querySelectorAll('.card').forEach(el=>el.onclick=()=>{ state.slug = el.dataset.slug; state.view='detail'; location.hash = el.dataset.slug; renderDetail() });
  const inp = document.getElementById('q');
  inp.oninput = () => { state.query = inp.value; renderList(); const i2 = document.getElementById('q'); i2.focus(); i2.setSelectionRange(i2.value.length, i2.value.length) };
}

function specRow(k, v, mono) {
  return `<div class="row"><span class="k">${k}</span><span class="v${mono?' mono':''}">${v}</span></div>`;
}

function typeScale(s) {
  const typ = (s.typography || []).slice(0, 10);
  const top = Math.max(16, ...typ.map(t => parseFloat(t.fontSize) || 0));
  return typ.map(t => `<div class="type-row">
    <span class="aa" style="font-family:${t.fontFamily || s.visual.displayStack};font-size:${Math.min(30, Math.max(10, (parseFloat(t.fontSize)||16)/top*26))}px;font-weight:${t.fontWeight||400}">Aa</span>
    <span class="tk">${t.token}</span>
    <span class="vm">${[t.fontSize, t.fontWeight, t.lineHeight, t.letterSpacing].filter(Boolean).join(' / ')}</span>
  </div>`).join('');
}

function componentSheet(s, mode) {
  const th = theme(s, 'web', mode), v = s.visual;
  const r = radius(v.radiusCard), rb = radius(v.radiusButton), rp = radius(v.radiusPill);
  return `<div class="sheet" style="background:${th.bg};border-color:${th.line}">
    <div class="sheet-row">
      <span style="background:${th.accent};color:${th.accentInk};border-radius:${rb};padding:8px 16px;font-size:12px">主要按钮</span>
      <span style="border:1px solid ${th.line};color:${th.ink};border-radius:${rb};padding:8px 16px;font-size:12px">次要按钮</span>
      <span style="background:${th.surface};color:${th.muted};border-radius:${rp};padding:5px 12px;font-size:11px">标签胶囊</span>
    </div>
    <div class="sheet-card" style="border:1px solid ${th.line};border-radius:${r};background:${th.surface}">
      <div style="height:44px;border-radius:${radius(v.radiusCard)};background:linear-gradient(135deg,${alpha(th.accent,.28)},${alpha(th.accent,.06)})"></div>
      <div style="font-size:12px;font-weight:600;color:${th.ink};margin-top:8px">卡片标题</div>
      <div style="font-size:11px;color:${th.muted};margin-top:3px;line-height:1.5">卡片说明文字，随品牌字号与行高。</div>
    </div>
    <div class="sheet-input" style="border:1px solid ${th.line};border-radius:${radius(v.radiusPill) === '9999px' ? '10px' : r};background:${th.bg};color:${th.muted}">输入框占位文本</div>
  </div>`;
}

function renderDetail() {
  const s = DATA.styles.find(x => x.slug === state.slug) || DATA.styles[0];
  const v = s.visual;
  const darkOnly = !!v.darkFirst;
  const mode = darkOnly ? 'dark' : state.theme;
  const pal = (s.colors || []).filter(c => c.hex).slice(0, 14);
  const radii = (s.radius || []).slice(0, 6);
  const spaces = Object.entries(v.space || {}).slice(0, 8);
  const tags = [...new Set([...(s.bestFor || []), ...(s.useCases || [])])].slice(0, 6);
  document.getElementById('app').innerHTML = `
  <div class="wrap">
    <div style="padding-top:20px"><button class="back" id="back">← 返回列表</button></div>
    <div class="d-head">
      <div>
        <h2>${s.nameZh}${s.nameZh === s.displayName ? '' : ` <span style="color:var(--ink-3);font-weight:400;font-size:19px">${s.displayName}</span>`}</h2>
        <p>${s.category} · 来源 getdesign.md/${s.slug} · ${pal.length} 个色值 · ${(s.typography||[]).length} 级字号</p>
      </div>
      <div class="d-actions">
        <div class="seg">${Object.entries(T).map(([k, x]) => `<button data-surface="${k}" class="${state.surface === k ? 'on' : ''}">${x.label}</button>`).join('')}</div>
        ${darkOnly ? '<span class="d-note">该品牌本身为深色，无浅色版本</span>' : `<div class="theme">
          <button data-mode="light" class="${mode === 'light' ? 'on' : ''}">浅色</button>
          <button data-mode="dark" class="${mode === 'dark' ? 'on' : ''}">深色</button>
        </div>`}
      </div>
    </div>

    <div class="detail2">
      <div class="d-left">
        <div class="preview-hold">
          ${state.surface === 'web'
            ? `<div class="page-frame">${webArt(s, mode)}</div>`
            : `<div class="big-frame" style="${state.surface === 'poster' ? 'max-width:460px' : ''}">${art(s, state.surface, mode)}</div>`}
          <div class="cap"><span>由 DESIGN.md 的 token 现场渲染，不是截图。</span>
            <span class="frame-hint">${state.surface === 'web' ? '完整页面 · 8 个区块' : '示意排版'}</span></div>
        </div>
      </div>

      <div class="d-right">
        <section class="card2 form-card">
          <h3>用这套风格生成</h3>
          <p class="dim">提示词会带上完整 token 与交付规范。</p>
          <div class="lbl">产出形态</div>
          <div class="pillbar">${Object.entries(T).map(([k, x]) => `<button class="${state.surface === k ? 'on' : ''}" data-surface="${k}">${x.label}</button>`).join('')}</div>
          <div class="lbl">需求描述</div>
          <textarea placeholder="例如：做一个 AI 笔记产品的官网首页，首屏突出卖点，带三栏功能区和定价表。"></textarea>
          <button class="send">发送到当前会话</button>
          <div class="two"><button class="send2">复制提示词</button><button class="send2">查看 DESIGN.md</button></div>
        </section>
        <section class="card2">
          <h3>适合 · 避免</h3>
          <div class="kv">${(s.bestFor || []).slice(0, 4).map(t => `<span class="ok">${t}</span>`).join('')}</div>
          <div class="kv">${(s.avoidFor || []).slice(0, 3).map(t => `<span class="no">${t}</span>`).join('')}</div>
        </section>
        <section class="card2">
          <h3>视觉风格</h3>
          <p>${s.summaryZh || ''}</p>
          <p class="dim">${s.positioningZh || ''}</p>
          <div class="kv">${tags.map(t => `<span>${t}</span>`).join('')}</div>
        </section>

        <section class="card2">
          <h3>配色</h3>
          <div class="pal2">${pal.map(c => `<div class="sw2"><i style="background:${c.hex}"></i><b>${c.name}</b><code>${c.hex}</code></div>`).join('')}</div>
        </section>

        <section class="card2">
          <h3>排版要求</h3>
          ${specRow('展示字体', v.displayFamily + (v.fontClass ? ' · ' + v.fontClass : ''))}
          ${specRow('正文字体', v.bodyFamily + ' · ' + (v.bodySize || 16) + 'px')}
          ${specRow('展示字号 / 行高', (v.displaySize || 40) + 'px / ' + (v.displayLineHeight || 1.2), true)}
          ${specRow('字距', v.displayTracking || '0', true)}
          ${specRow('等宽字体', v.monoFamily || '—')}
          <div class="type-wrap">${typeScale(s)}</div>
        </section>

        <section class="card2">
          <h3>形状与间距</h3>
          ${specRow('卡片圆角', prettyRadius(v.radiusCard), true)}
          ${specRow('按钮圆角', prettyRadius(v.radiusButton), true)}
          ${specRow('胶囊圆角', prettyRadius(v.radiusPill), true)}
          ${specRow('间距基数', (v.spaceBase || 8) + 'px', true)}
          <div class="scale-row">${spaces.map(([k, val]) => `<span><i style="width:${Math.min(28, Math.max(3, (parseFloat(val)||4)/2))}px"></i>${k} ${val}</span>`).join('')}</div>
          ${radii.length ? `<div class="scale-row">${radii.map(r0 => `<span><i class="rad" style="border-radius:${radius(r0.value) === '9999px' ? '9999px' : Math.min(12, parseFloat(r0.value) || 2) + 'px'}"></i>${r0.name} ${r0.value}</span>`).join('')}</div>` : ''}
        </section>

        <section class="card2">
          <h3>组件样例</h3>
          ${componentSheet(s, mode)}
        </section>


      </div>
    </div>
  </div>`;

  const pf = document.querySelector('.page-frame');
  if (pf) pf.scrollTop = 0;
  document.getElementById('back').onclick = () => { state.view = 'list'; location.hash = ''; renderList() };
  document.querySelectorAll('.d-actions .seg button, .pillbar button').forEach(b => b.onclick = () => { state.surface = b.dataset.surface; renderDetail() });
  document.querySelectorAll('.d-actions .theme button').forEach(b => b.onclick = () => { state.theme = b.dataset.mode; renderDetail() });
}

function prettyRadius(val) {
  const t = String(val || '');
  if (/^9{3,}/.test(t)) return '全圆角';
  return t || '—';
}

state.view === 'detail' ? renderDetail() : renderList();
</script>
</body>
</html>'''

out = HTML.replace('__DATA__', json.dumps({'generatedAt': catalog.get('generatedAt'), 'styles': catalog['styles']}, ensure_ascii=False, separators=(',', ':')))
path = root / 'build/mockups/v2.html'
path.write_text(out)
print('wrote', path, len(out))
