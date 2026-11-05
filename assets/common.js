/* CMD Explorer — shared helpers, exposed as window.CM.
   Extracted from the original bands.html. Depends only on Plotly (loaded before this file).
   Usage in a page (inside DOMContentLoaded, see templates/topic.html):
     const { $, C, ax, kAx, layout, CFG, hline, vline, rgba } = CM;
     function render1() { ... Plotly.react('p1', traces, layout({ xaxis: ax('x (nm)') }), CFG); }
     CM.wire({ m1: render1 });   // every <input type=range id="m1-..."> re-renders render1
*/
(() => {
  const PI = Math.PI;
  const MONO = '"IBM Plex Mono", ui-monospace, Consolas, monospace';

  /* ---------- theme tokens ---------- */
  // C is one object, refreshed in place, so `const { C } = CM` stays valid after theme changes.
  const C = {};
  function readTheme() {
    const s = getComputedStyle(document.documentElement), g = n => s.getPropertyValue(n).trim();
    Object.assign(C, { fg: g('--fg'), muted: g('--muted'), line: g('--line'), occ: g('--occ'), emp: g('--emp'), ef: g('--ef'),
      panel: g('--panel'), bg: g('--bg'), accent: g('--accent'),
      scale: [0, 1, 2, 3, 4].map(i => [i / 4, g('--s' + i)]) });
    return C;
  }
  function rgba(hex, a) {
    let h = hex.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  }

  /* ---------- Plotly layout helpers ---------- */
  function ax(title, o = {}) {
    return Object.assign({ title: { text: title, font: { size: 12, color: C.fg } }, gridcolor: C.line, zerolinecolor: C.line,
      linecolor: C.line, color: C.muted, tickfont: { family: MONO, size: 11 }, automargin: true }, o);
  }
  const PIT = { tickvals: [-PI, -PI / 2, 0, PI / 2, PI], ticktext: ['−π', '−π/2', '0', 'π/2', 'π'] };
  const kAx = (t, o = {}) => ax(t, Object.assign({ range: [-PI, PI], zeroline: false }, PIT, o));
  function sAx(t, o = {}) {   // 3D scene axis
    return Object.assign({ title: { text: t, font: { size: 11, color: C.fg } }, gridcolor: C.line, zerolinecolor: C.line, color: C.muted,
      showbackground: false, tickfont: { family: MONO, size: 10 } }, o);
  }
  const sKAx = t => sAx(t, Object.assign({ range: [-PI, PI] }, PIT));
  function layout(o = {}) {
    return Object.assign({ margin: { l: 56, r: 12, t: 8, b: 44 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: '"IBM Plex Sans", system-ui, sans-serif', size: 12, color: C.fg }, showlegend: false, hovermode: 'closest',
      hoverlabel: { font: { family: MONO, size: 11 } } }, o);
  }
  const CFG = { displayModeBar: false, responsive: true };
  const hline = (y, color, dash = 'dash') => ({ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: y, y1: y, line: { color, width: 2, dash } });
  const vline = (x, color, dash = 'dash') => ({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: x, x1: x, line: { color, width: 2, dash } });

  /* ---------- small utilities ---------- */
  const $ = id => document.getElementById(id);
  const lin = (a, b, n) => Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
  function setRead(id, rows) { $(id).innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join(''); }
  function setPill(id, [cls, text]) { const p = $(id); p.className = 'pill ' + cls; p.textContent = text; }

  /* ---------- render scheduling + slider wiring ---------- */
  const pending = new Set(); let raf = 0;
  function schedule(fn) { pending.add(fn); if (!raf) raf = requestAnimationFrame(() => { raf = 0; const fs = [...pending]; pending.clear(); fs.forEach(f => f()); }); }

  // Slider output text: data-pi="1" → "0.25π/a"; else value.toFixed(data-fmt) + data-unit.
  function fmtSlider(el) {
    const v = +el.value;
    return el.dataset.pi ? (v === 0 ? '0' : v.toFixed(2) + 'π') + '/a' : v.toFixed(+(el.dataset.fmt || 0)) + (el.dataset.unit || '');
  }
  const renderers = [];
  function renderAll() { readTheme(); renderers.forEach(f => f()); }
  let themeHooked = false;
  // R maps an id prefix to a render function. Every range input whose id is "<prefix>-<anything>"
  // updates its <output for=id> and schedules R[prefix]. Calls renderAll once and re-renders on theme change.
  function wire(R) {
    document.querySelectorAll('input[type=range]').forEach(el => {
      const fn = R[el.id.split('-')[0]];
      if (!fn || el.dataset.wired) return;
      el.dataset.wired = '1';
      const out = document.querySelector(`output[for="${el.id}"]`);
      const upd = () => { if (out) out.textContent = fmtSlider(el); };
      upd();
      el.addEventListener('input', () => { upd(); schedule(fn); });
    });
    Object.values(R).forEach(f => { if (!renderers.includes(f)) renderers.push(f); });
    renderAll();
    if (!themeHooked) {
      themeHooked = true;
      matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderAll);
      new MutationObserver(renderAll).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  /* ---------- animation ---------- */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // loop(step, { el }) calls step(dt, t) every frame (dt in s, capped at 0.05) while playing and while el is on screen.
  // Starts paused when the user asks for reduced motion. Returns { playing, play(), pause(), toggle() }.
  function loop(step, opts = {}) {
    const ctl = { playing: !reduceMotion, visible: true, t: 0,
      play() { ctl.playing = true; }, pause() { ctl.playing = false; }, toggle() { ctl.playing = !ctl.playing; } };
    if (opts.el && 'IntersectionObserver' in window)
      new IntersectionObserver(es => es.forEach(e => { ctl.visible = e.isIntersecting; })).observe(opts.el);
    let prev = null;
    function frame(ts) {
      const dt = prev === null ? 0 : Math.min(0.05, (ts - prev) / 1000); prev = ts;
      if (ctl.playing && ctl.visible) { ctl.t += dt; step(dt, ctl.t); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return ctl;
  }
  // playButton(button, ctl, note): toggles ctl, keeps the label "Play"/"Pause"; reveals `note` while paused for reduced motion.
  function playButton(btn, ctl, note) {
    const sync = () => { btn.textContent = ctl.playing ? 'Pause' : 'Play'; };
    if (note && reduceMotion) note.hidden = false;
    sync(); btn.addEventListener('click', () => { ctl.toggle(); sync(); if (note) note.hidden = true; });
  }

  /* ---------- math (KaTeX auto-render) ---------- */
  const MATH_OPTS = { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
    throwOnError: false, ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'output'] };
  // Call CM.math(el) after inserting HTML that contains $...$ (static page text is rendered automatically).
  function math(el = document.body) { if (window.renderMathInElement) window.renderMathInElement(el, MATH_OPTS); }

  /* ---------- theme toggle (nav button with data-theme-toggle) ---------- */
  const root = document.documentElement;
  try { const t = localStorage.getItem('cm-theme'); if (t === 'light' || t === 'dark') root.dataset.theme = t; } catch (e) {}
  function initThemeToggle() {
    document.querySelectorAll('[data-theme-toggle]').forEach(b => {
      const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      const sync = () => { b.textContent = dark() ? 'Light' : 'Dark'; };
      sync();
      b.addEventListener('click', () => {
        root.dataset.theme = dark() ? 'light' : 'dark';
        try { localStorage.setItem('cm-theme', root.dataset.theme); } catch (e) {}
        sync();
      });
    });
  }

  /* ---------- physical constants (SI, CODATA 2018) ---------- */
  const K = { h: 6.62607015e-34, hbar: 1.054571817e-34, e: 1.602176634e-19, me: 9.1093837015e-31, kB: 1.380649e-23,
    kBeV: 8.617333262e-5, eps0: 8.8541878128e-12, NA: 6.02214076e23, a0: 5.29177210903e-11, c: 299792458, u: 1.66053906660e-27 };

  readTheme();
  document.addEventListener('DOMContentLoaded', () => { initThemeToggle(); math(); });

  window.CM = { PI, MONO, C, readTheme, rgba, ax, kAx, sAx, sKAx, PIT, layout, CFG, hline, vline,
    $, lin, setRead, setPill, schedule, fmtSlider, wire, renderAll, reduceMotion, loop, playButton, math, K };
})();
