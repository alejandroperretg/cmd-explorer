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
      linecolor: C.line, color: C.muted, tickfont: { family: MONO, size: 12 }, automargin: true }, o);
  }
  const PIT = { tickvals: [-PI, -PI / 2, 0, PI / 2, PI], ticktext: ['−π', '−π/2', '0', 'π/2', 'π'] };
  const kAx = (t, o = {}) => ax(t, Object.assign({ range: [-PI, PI], zeroline: false }, PIT, o));
  function sAx(t, o = {}) {   // 3D scene axis
    return Object.assign({ title: { text: t, font: { size: 12, color: C.fg } }, gridcolor: C.line, zerolinecolor: C.line, color: C.muted,
      showbackground: false, tickfont: { family: MONO, size: 12 } }, o);
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
  function math(el = document.body) { if (window.renderMathInElement) { window.renderMathInElement(el, MATH_OPTS); if (MATH_OPTS.output === 'mathml') splitInlineMath(el); fitEq(el); } }

  // MathML (the phone builds) cannot line-break inline math, so a long formula spills out of narrow text. Split each
  // inline formula after its top-level relations (=, <, ≈, →, …) into separate <math> pieces with a break chance
  // between them, which is where KaTeX's HTML output breaks too. A piece with no relation can still be too wide.
  const REL = /^[=<>≈≤≥≠∼≃≅≡∝→←↔⇒⇔≪≫∈⊂]$/;
  function splitInlineMath(el = document.body) {
    const NS = 'http://www.w3.org/1998/Math/MathML';
    (el.querySelectorAll ? el : document).querySelectorAll('math:not([display="block"])').forEach(m => {
      const sem = m.firstElementChild, row = sem && sem.localName === 'semantics' ? sem.firstElementChild : null;
      if (!row || row.localName !== 'mrow') return;
      const kids = [...row.children], isRel = k => k.localName === 'mo' && REL.test(k.textContent.trim());
      const cuts = kids.map((k, i) => (i > 0 && i < kids.length - 1 && isRel(k) ? i : -1)).filter(i => i >= 0);
      if (!cuts.length) return;
      const frag = document.createDocumentFragment();
      let from = 0;
      [...cuts, kids.length - 1].forEach((i, j, all) => {
        const piece = document.createElementNS(NS, 'math'), r = document.createElementNS(NS, 'mrow');
        kids.slice(from, i + 1).forEach(k => { if (isRel(k)) k.setAttribute('form', 'infix'); r.appendChild(k); });
        piece.appendChild(r); frag.appendChild(piece); from = i + 1;
        if (j < all.length - 1) frag.appendChild(document.createElement('wbr'));
      });
      m.replaceWith(frag);
    });
  }

  // Safety net for the phone builds: an inline formula (or one piece of it) still wider than its line after the split
  // scrolls inside its own span (.katex.m-scroll in site.css) instead of spilling out of the text. Re-checked on resize.
  function scrollWideInline(el = document) {
    if (MATH_OPTS.output !== 'mathml') return;
    (el.querySelectorAll ? el : document).querySelectorAll('.katex').forEach(k => {
      if (k.closest('.eq, .katex-display')) return;
      k.classList.remove('m-scroll');
      let b = k.parentElement; while (b && b !== document.body && getComputedStyle(b).display.startsWith('inline')) b = b.parentElement;
      const q = b.getBoundingClientRect(), cs = getComputedStyle(b);
      const left = q.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), right = q.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
      if ([...k.getClientRects()].some(r => r.right > right + 1 || r.left < left - 1)) k.classList.add('m-scroll');
    });
  }

  /* ---------- fit display equations to their .eq panel (safety net only) ---------- */
  // Equations are written to fit at 360 px (aligned lines). If one still overflows, shrink it to fit, never below FIT_MIN.
  // The panels never scroll. Width is measured with a Range so content overflowing on either side counts.
  const FIT_MIN = 0.85;
  function fitEq(el = document) {
    (el.querySelectorAll ? el : document).querySelectorAll('.eq > :not(.eq-head, .eq-n)').forEach(box => {
      box.style.fontSize = '';
      let scale = 1;
      for (let i = 0; i < 3; i++) {
        const avail = box.clientWidth; if (!avail) return;
        // KaTeX also emits a clipped, full-width MathML copy for screen readers; measure only the visible rendering.
        const rg = document.createRange(); rg.selectNodeContents(box.querySelector('.katex-html') || box);
        const need = Math.max(box.scrollWidth, rg.getBoundingClientRect().width);
        if (need <= avail + 1 || scale <= FIT_MIN) break;
        scale = Math.max(FIT_MIN, scale * (avail - 2) / need);
        box.style.fontSize = (scale * 100).toFixed(1) + '%';
      }
    });
    scrollWideInline(el);
  }
  let fitTimer = 0;
  addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(() => fitEq(), 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitEq());

  /* ---------- layout audit (testing aid): CM.auditLayout() should return [] at 360 and 400 px ---------- */
  // Reports elements whose content is wider than their box (scrollWidth > clientWidth + 1) and elements that spill
  // outside their parent. Plot, canvas, SVG and math internals are skipped, as are out-of-flow and hidden elements.
  // Only the innermost offender of a chain is listed, since an overflow also widens its ancestors' scrollWidth.
  function auditLayout(rootEl = document.body) {
    const SKIP_IN = '.js-plotly-plot, canvas, svg, .katex, math, select';
    const name = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).join('.') : '');
    const hits = [];
    [rootEl, ...rootEl.querySelectorAll('*')].forEach(e => {
      if (e.parentElement && e.parentElement.closest(SKIP_IN)) return;
      if (e.matches('script, style, br, option, .katex-mathml')) return;
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'absolute' || cs.position === 'fixed') return;
      const r = e.getBoundingClientRect(); if (!r.width && !r.height) return;
      if (e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 1 && !e.matches('canvas, svg, .js-plotly-plot'))
        hits.push({ el: e, sel: name(e), kind: 'content wider than box', px: e.scrollWidth - e.clientWidth });
      const p = e.parentElement;
      if (p && p !== document.documentElement) {
        const q = p.getBoundingClientRect(), out = Math.max(r.right - q.right, q.left - r.left);
        // A deliberate bleed (negative margin, e.g. plots on the smallest phones) is not a spill.
        if (out > 1 && out > Math.max(0, -parseFloat(cs.marginLeft), -parseFloat(cs.marginRight)) + 1) hits.push({ el: e, sel: name(e), kind: 'spills outside parent ' + name(p), px: Math.round(out) });
      }
    });
    const els = hits.map(h => h.el);
    return hits.filter(h => !els.some(o => o !== h.el && h.el.contains(o)))
      .map(h => ({ sel: h.sel, kind: h.kind, px: h.px, text: (h.el.textContent || '').trim().slice(0, 50), el: h.el }));
  }

  // Unique CSS selector for an element: its id, a radio's name + value, or a :nth-of-type path from the nearest id.
  function cssPath(e) {
    if (e.id) return '#' + e.id;
    if (e.matches('input[type=radio]') && e.name) return `input[name="${e.name}"][value="${e.value}"]`;
    const parts = [];
    for (; e && e.parentElement && e !== document.body; e = e.parentElement) {
      if (e.id) { parts.unshift('#' + e.id); break; }
      const same = [...e.parentElement.children].filter(x => x.tagName === e.tagName);
      parts.unshift(e.tagName.toLowerCase() + (same.length > 1 ? `:nth-of-type(${same.indexOf(e) + 1})` : ''));
    }
    return parts.join(' > ');
  }

  /* ---------- stress test (testing aid): `await CM.stress()` returns a report; runner: tools/stress.js ---------- */
  // Drives every control of every model (.bench; controls outside a bench are grouped by their section), one at a time from the defaults:
  // ranges go to min, max and midpoint, then 10 seeded random values in quick succession; radios, checkboxes and
  // selects visit every state; buttons are clicked. Then, for interactions, every slider goes to min and max under each
  // non-default state of each radio group, checkbox and select of its model. Pending renders are flushed synchronously after each step, so an
  // exception is attributed to the step that caused it. Then CM.renderAll(), the defaults are restored, and
  // CM.auditLayout() runs. Issue kinds: exception, console.error, console.warn, readout (NaN/Infinity/undefined/empty in an <output>,
  // a dl.readout value or a .tnum; NaN in other live text; pills and prose may say "undefined"),
  // plot-empty, plot-nan (all-NaN trace, ±Infinity, or non-finite axis range), plot-nan-partial (some NaN points,
  // usually deliberate line gaps; `atDefault` says whether the default state has them too), invalid-state (a model marked
  // data-state="invalid" was reached; its readouts and plots are not checked meanwhile), dead (no visible change
  // from any value; `canvas` means the model also has a canvas that may update on a later frame), not-restored.
  // Repeated issues are merged; `count` says how often one occurred. Options: { seed } for the random values.
  async function stress(opts = {}) {
    const t0 = performance.now(), issues = [], seen = new Map();
    let seed = opts.seed ?? 1, steps = 0;
    const time = { render: 0, signature: 0, check: 0 }, clock = (k, f) => { const t = performance.now(); const r = f(); time[k] += performance.now() - t; return r; };
    const rand = () => {   // mulberry32: reproducible random values
      seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    const at = { model: '', control: '', step: 'start' };
    const add = (kind, detail, extra = {}) => {
      const key = [kind, at.model, at.control, extra.sel || detail].join('|');
      if (seen.has(key)) { seen.get(key).count++; return; }
      const it = Object.assign({ kind, model: at.model, control: at.control, step: at.step, detail: String(detail).slice(0, 300), count: 1 }, extra);
      seen.set(key, it); issues.push(it);
    };
    const msg = e => (e && e.stack ? e.stack.split('\n').slice(0, 2).join(' ') : (e && e.message) || String(e));
    const onErr = ev => add('exception', msg(ev.error || ev.message));
    const onRej = ev => add('exception', 'unhandled rejection: ' + msg(ev.reason));
    const con = { error: console.error, warn: console.warn };
    const ch = new MessageChannel();
    const tick = () => new Promise(r => { ch.port1.onmessage = () => r(); ch.port2.postMessage(0); });   // yield one task
    const thumb = Object.assign(document.createElement('canvas'), { width: 64, height: 32 }).getContext('2d', { willReadFrequently: true });
    const shown = e => e.checkVisibility ? e.checkVisibility() : !!e.getClientRects().length;
    const fire = c => ['input', 'change'].forEach(t => c.dispatchEvent(new Event(t, { bubbles: true })));
    const flush = () => {   // run CM.schedule'd renders now; a render may schedule another, hence the loop
      for (let i = 0; i < 5 && pending.size; i++) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        const fs = [...pending]; pending.clear();
        fs.forEach(f => { try { f(); } catch (e) { add('exception', msg(e)); } });
      }
    };

    // Signature of what a model shows: its text (minus the tested control's own <output>), plot data and layout,
    // and optionally canvas pixels. A step "changed" the model if the signature differs before and after it.
    const f64 = new Float64Array(1), u32 = new Uint32Array(f64.buffer);
    function sig(scope, skip, withCanvas = true, noPlots = false) {
      let h = 2166136261;
      const mix = s => { s = String(s); for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); };
      const walk = (v, d) => {
        if (v == null || typeof v === 'function') return;
        if (typeof v === 'number') { f64[0] = v; h = Math.imul(h ^ u32[0], 16777619); h = Math.imul(h ^ u32[1], 16777619); return; }
        if (typeof v !== 'object') return mix(v + ';');
        if (d > 6 || v instanceof Node) return;
        if (Array.isArray(v) || ArrayBuffer.isView(v)) { for (let i = 0; i < v.length; i++) walk(v[i], d + 1); return mix('|'); }
        for (const k of Object.keys(v).sort()) if (k[0] !== '_') { mix(k); walk(v[k], d + 1); }   // sorted: Plotly may re-add keys in another order
      };
      const tw = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
      for (let n; (n = tw.nextNode());)
        if (!n.parentElement.closest('.js-plotly-plot, script, style') && !(skip && skip.contains(n))) mix(n.data);
      if (!noPlots) (scope.matches('.js-plotly-plot') ? [scope] : scope.querySelectorAll('.js-plotly-plot')).forEach(gd => { walk(gd.data, 0); walk(gd.layout, 0); });
      if (withCanvas) scope.querySelectorAll('canvas').forEach(cv => {   // a 64×32 thumbnail is enough to see a redraw
        try { thumb.clearRect(0, 0, 64, 32); thumb.drawImage(cv, 0, 0, 64, 32); mix(thumb.getImageData(0, 0, 64, 32).data.join()); } catch (e) {}
      });
      return h >>> 0;
    }
    // Per-part signatures, to say what differs when a model is not restored: its text, or which plot.
    const parts = m => [['text', sig(m.el, null, false, true)], ...[...m.el.querySelectorAll('.js-plotly-plot')].map(gd => [cssPath(gd), sig(gd, null, false)])];

    const BAD = /\bNaN\b|Infinity|\bundefined\b/;
    // A model (or any element in it) can mark a deliberate invalid state, e.g. an unstable elastic matrix:
    // <section class="bench" data-state="invalid">. Readout and plot checks skip what is inside it.
    const invalid = e => !!e.closest('[data-state="invalid"]');
    const NUM_KEYS = ['x', 'y', 'z', 'r', 'theta', 'u', 'v', 'w', 'a', 'b', 'c', 'values'];
    function check(m, atDefault) {
      if (invalid(m.el) || m.el.querySelector('[data-state="invalid"]')) add('invalid-state', m.name + ' is marked data-state="invalid"; checks skipped inside it');
      m.el.querySelectorAll('output, dl.readout dd, .tnum').forEach(o => {   // values only, not explanatory pills or prose
        if (!shown(o) || invalid(o)) return;
        const t = o.textContent.trim();
        if (!t || BAD.test(t)) add('readout', `${cssPath(o)} shows "${t}"`, { sel: cssPath(o) });
      });
      m.el.querySelectorAll('[id]:not(input, select, button, .js-plotly-plot, canvas)').forEach(o => {   // other live text: NaN only
        if (o.closest('.js-plotly-plot') || !shown(o) || invalid(o) || o.querySelector('[id]')) return;
        const t = o.textContent.trim();
        if (/\bNaN\b/.test(t)) add('readout', `${cssPath(o)} shows "${t.slice(0, 80)}"`, { sel: cssPath(o) });
      });
      m.el.querySelectorAll('.js-plotly-plot').forEach(gd => {
        const sel = cssPath(gd), L = gd.layout || {};
        if (invalid(gd)) return;
        if (!gd.data || !gd.data.length) return add('plot-empty', `${sel}: no traces`, { sel });
        let pts = 0, nan = 0, inf = 0; const allNaN = [];
        gd.data.forEach((tr, i) => {
          if (tr.visible === false) return;
          let tp = 0, tn = 0;
          const cnt = v => {
            if (typeof v === 'number') { tp++; if (Number.isNaN(v)) tn++; else if (!Number.isFinite(v)) inf++; }
            else if (v && typeof v === 'object' && (Array.isArray(v) || ArrayBuffer.isView(v))) for (let j = 0; j < v.length; j++) cnt(v[j]);
          };
          NUM_KEYS.forEach(k => cnt(tr[k]));
          pts += tp; nan += tn;
          if (tp && tn === tp) allNaN.push(i);
        });
        if (!pts && !(L.shapes || []).length && !(L.annotations || []).length) add('plot-empty', `${sel}: traces have no numeric points`, { sel });
        if (allNaN.length) add('plot-nan', `${sel}: trace ${allNaN.join(', ')} is all NaN`, { sel });
        if (inf) add('plot-nan', `${sel}: ${inf} ±Infinity values`, { sel: sel + ' inf' });
        const fl = gd._fullLayout || {};
        const axes = Object.keys(fl).filter(k => /^[xy]axis\d*$/.test(k)).map(k => [k, fl[k]])
          .concat(Object.keys(fl).filter(k => /^scene\d*$/.test(k)).flatMap(s => ['xaxis', 'yaxis', 'zaxis'].map(a => [s + '.' + a, fl[s][a]])));
        axes.forEach(([k, a]) => { if (a && a.range && !a.range.every(Number.isFinite)) add('plot-nan', `${sel}: ${k}.range is [${a.range}]`, { sel: sel + ' ' + k }); });
        if (nan && !allNaN.length) {
          if (atDefault) m.nanAtDefault.add(sel);
          add('plot-nan-partial', `${sel}: ${nan} of ${pts} values are NaN`, { sel: sel + ' partial', atDefault: m.nanAtDefault.has(sel) });
        }
      });
    }

    // Models and their controls (the nav theme toggle is not a model control).
    const CTL = 'input[type=range], input[type=radio], input[type=checkbox], select, button';
    const ctls = [...document.querySelectorAll(CTL)].filter(c => !c.matches('[data-theme-toggle]'));
    const models = [];
    ctls.forEach(c => {
      const el = c.closest('.bench') || c.closest('section, details, figure, .card') || document.body;
      let m = models.find(x => x.el === el);
      if (!m) models.push(m = { el, name: (el.id ? '#' + el.id : cssPath(el) || 'body') + (el.matches('.bench') ? '' : ' (not a .bench)'), ctls: [], dead: [], nanAtDefault: new Set(), canvas: !!el.querySelector('canvas') });
      m.ctls.push(c);
    });
    const snap = ctls.map(c => ({ c, v: c.value, k: c.checked, s: c.selectedIndex, t: c.textContent }));
    const ctlName = c => c.type === 'radio' ? `input[name="${c.name}"]` : cssPath(c) + (c.tagName === 'BUTTON' ? ` ("${c.textContent.trim().slice(0, 30)}")` : '');
    const own = c => c.id ? document.querySelector(`output[for="${c.id}"]`) : null;
    // Restore the defaults of the given controls: radios, checkboxes, selects and ranges, then toggle buttons (Play/Pause) by label.
    function restore(list) {
      const S = snap.filter(x => list.includes(x.c));
      for (const { c, v, k, s: si } of S) {
        if (c.type === 'radio') { if (k && !c.checked) c.click(); }
        else if (c.type === 'checkbox') { if (c.checked !== k) c.click(); }
        else if (c.tagName === 'SELECT') { if (c.selectedIndex !== si) { c.selectedIndex = si; fire(c); } }
        else if (c.type === 'range' && c.value !== v) { c.value = v; fire(c); }
      }
      flush();
      for (const x of S) if (x.c.tagName === 'BUTTON' && x.c.textContent !== x.t) x.c.click();
      flush();
    }

    console.error = (...a) => { add('console.error', a.map(String).join(' ')); con.error.apply(console, a); };
    console.warn = (...a) => { add('console.warn', a.map(String).join(' ')); con.warn.apply(console, a); };
    addEventListener('error', onErr); addEventListener('unhandledrejection', onRej);
    let layout = [];
    try {
      flush();
      const base = new Map(models.map(m => [m, parts(m)]));
      for (const m of models) { at.model = m.name; at.control = ''; at.step = 'default state'; check(m, true); }
      await tick();
      for (const m of models) {
        at.model = m.name;
        const groups = new Set(), quiet = [];
        // One step: act, flush renders, compare signatures (synchronously, so no animation frame runs in between).
        const step = (c, label, act) => {
          at.step = label; steps++;
          const b = clock('signature', () => sig(m.el, own(c)));
          clock('render', () => { act(); flush(); });
          const changed = clock('signature', () => sig(m.el, own(c))) !== b;
          clock('check', () => check(m, false));
          return changed;
        };
        // Each control is tested from the defaults (one at a time), so it is never judged in another control's extreme state.
        for (const c of m.ctls) {
          if (c.disabled || (c.type === 'radio' && groups.has(c.name))) continue;
          restore(m.ctls);
          at.control = ctlName(c);
          let changed = false;
          if (c.type === 'range') {
            const lo = c.min === '' ? 0 : +c.min, hi = c.max === '' ? 100 : +c.max;
            const set = v => { c.value = v; fire(c); return c.value; };
            for (const [lab, v] of [['min', lo], ['max', hi], ['midpoint', (lo + hi) / 2]])
              changed = step(c, `set to ${lab} (${v})`, () => set(v)) || changed;
            const vals = Array.from({ length: 10 }, () => lo + rand() * (hi - lo));
            changed = step(c, '10 random values', () => { at.step = `10 random values in quick succession: ${vals.map(set).join(', ')}`; }) || changed;
          } else if (c.type === 'radio') {
            groups.add(c.name);
            const grp = [...document.querySelectorAll('input[type=radio]')].filter(r => r.name === c.name);
            for (const r of grp) changed = step(c, `select value "${r.value}"`, () => r.click()) || changed;
          } else if (c.type === 'checkbox') {
            for (let i = 0; i < 2; i++) changed = step(c, `toggle ${c.checked ? 'off' : 'on'}`, () => c.click()) || changed;
          } else if (c.tagName === 'SELECT') {
            for (let i = 0; i < c.options.length; i++) changed = step(c, `choose option ${i} "${c.options[i].text}"`, () => { c.selectedIndex = i; fire(c); }) || changed;
          } else {
            changed = step(c, 'click', () => c.click());
          }
          if (!changed) (c.tagName === 'BUTTON' ? quiet : m.dead).push(c);
          await tick();   // once per control: lets async errors (rejected promises) surface while at.control still names it
        }
        // A button may do nothing in the default state (Reset, a preset equal to it): try again with every slider at its midpoint.
        for (const c of quiet) {
          at.control = ctlName(c); restore(m.ctls);
          m.ctls.filter(r => r.type === 'range').forEach(r => { r.value = ((r.min === '' ? 0 : +r.min) + (r.max === '' ? 100 : +r.max)) / 2; fire(r); });
          flush();
          if (!step(c, 'click again with every slider of the model at its midpoint', () => c.click())) m.dead.push(c);
          await tick();
        }
        restore(m.ctls);
        // Interactions: every slider at its min and max under each non-default state of each radio group, checkbox and select.
        const ranges = m.ctls.filter(c => c.type === 'range' && !c.disabled), states = [], done = new Set();
        if (ranges.length) m.ctls.forEach(c => {
          if (c.disabled || c.type === 'range' || c.tagName === 'BUTTON') return;
          if (c.type === 'radio') {
            if (done.has(c.name)) return; done.add(c.name);
            [...document.querySelectorAll('input[type=radio]')].filter(r => r.name === c.name && !snap.find(x => x.c === r).k)
              .forEach(r => states.push([`${ctlName(c)} = "${r.value}"`, () => r.click()]));
          } else if (c.type === 'checkbox') states.push([`${cssPath(c)} toggled ${c.checked ? 'off' : 'on'}`, () => c.click()]);
          else [...c.options].forEach((o, i) => { if (i !== c.selectedIndex) states.push([`${cssPath(c)} = "${o.text}"`, () => { c.selectedIndex = i; fire(c); }]); });
        });
        for (const [label, apply] of states) {
          restore(m.ctls); apply(); flush();
          for (const r of ranges) {
            at.control = ctlName(r);
            const lo = r.min === '' ? 0 : +r.min, hi = r.max === '' ? 100 : +r.max, v0 = r.value;
            step(r, `with ${label}: set to min (${lo})`, () => { r.value = lo; fire(r); });
            step(r, `with ${label}: set to max (${hi})`, () => { r.value = hi; fire(r); });
            r.value = v0; fire(r); flush();
          }
          await tick();
        }
        restore(m.ctls);
        for (const c of m.dead) {
          at.control = ctlName(c); at.step = 'all values';
          add('dead', `${ctlName(c)}: no value changed any readout, plot${m.canvas ? ' or canvas (this model has a canvas, which may update on a later frame)' : ''}`, { canvas: m.canvas });
        }
        at.control = ''; at.step = 'CM.renderAll()';
        try { renderAll(); } catch (e) { add('exception', msg(e)); }
        flush(); check(m, false); await tick();
      }

      at.model = '(restore)'; at.control = ''; at.step = 'restore defaults';
      restore(ctls);
      try { renderAll(); } catch (e) { add('exception', msg(e)); }
      flush(); await tick();
      for (const m of models) {
        const now = parts(m), diff = base.get(m).filter(([k, v], i) => !now[i] || now[i][1] !== v).map(([k]) => k);
        if (diff.length) { at.model = m.name; add('not-restored', `${m.name}: ${diff.join(', ')} differ from the default state after the restore (an animation clock, or state not tied to a control)`); }
      }
      at.model = '(page)'; at.step = 'CM.auditLayout()';
      layout = auditLayout().map(({ el, ...h }) => Object.assign(h, { path: cssPath(el) }));
    } finally {
      console.error = con.error; console.warn = con.warn;
      removeEventListener('error', onErr); removeEventListener('unhandledrejection', onRej);
      ch.port1.close();
    }
    return { page: location.pathname.split('/').pop(), width: innerWidth, height: innerHeight,
      theme: getComputedStyle(root).colorScheme || '', seed: opts.seed ?? 1, steps, ms: Math.round(performance.now() - t0),
      time: Object.fromEntries(Object.entries(time).map(([k, v]) => [k, Math.round(v)])),
      models: models.map(m => ({ name: m.name, controls: m.ctls.length })), issues, layout };
  }

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
    $, lin, setRead, setPill, schedule, fmtSlider, wire, renderAll, reduceMotion, loop, playButton, math, splitInlineMath, fitEq, auditLayout, cssPath, stress, K };
})();
