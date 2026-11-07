// Readability checks for one explorer page, run in the browser at the current width and theme.
// tools/stress.js injects this file; it can also be pasted into a browser console. Then:
//   CMReadability({ phone: true, contrast: true, tokens: true })  ->  { issues: [...], tokens: [...] }
// Checks (thresholds below): text size, line length, tap targets, contrast, text overlap, plot size,
// cut-off figure captions, equation size, inline math spilling out of its text (MathML in the phone builds cannot
// line-break), horizontal page scroll, math errors and unrendered TeX. Closed <details> are opened
// for the checks and closed again. Issues are grouped by rule (nearest classed ancestor + element), so
// `n` is the number of elements with the same problem, `key` the grouping rule and `sel` one exact example.
window.CMReadability = function (opts = {}) {
  const MIN_BODY = 15, MIN_LABEL = 12, MAX_CPL = 85, MIN_TAP = 40, MIN_CONTRAST = 4.5, MIN_PLOT_W = 280, MIN_EQ = 18;
  const phone = opts.phone ?? innerWidth < 768;
  const out = new Map();
  const add = (kind, key, sel, detail) => {
    const k = kind + '|' + key, o = out.get(k);
    if (o) o.n++; else out.set(k, { kind, key, sel, detail, n: 1 });
  };
  const path = e => (window.CM && CM.cssPath ? CM.cssPath(e) : e.tagName.toLowerCase());
  const cls = x => x.tagName.toLowerCase() + (typeof x.className === 'string' && x.className.trim() ? '.' + x.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const rule = e => {
    let a = e.parentElement;
    while (a && a !== document.body && !(typeof a.className === 'string' && a.className.trim())) a = a.parentElement;
    return (a && a !== document.body ? cls(a) + ' ' : '') + cls(e);
  };
  const shown = e => (e.checkVisibility ? e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : !!e.getClientRects().length);
  const SKIP = 'script, style, noscript, template, .js-plotly-plot, canvas, svg, .katex, math, select, option';
  const LABEL = 'figcaption, label, legend, dt, dd, output, button, summary, th, caption, small, sub, sup, nav, .eyebrow, .tag, .tags, ' +
    '.pill, .needs, .legend, .keys, .note, .meta, .chain, .min, .then, .eq-head, .eq-label, .eq-n, .readout, .tnum, .num, .seg, .btns, .hw h4, .step';

  const opened = [...document.querySelectorAll('details:not([open])')];
  opened.forEach(d => { d.open = true; });
  scrollTo(0, 0);
  try {
    const texts = [];
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT,
      { acceptNode: n => (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP) ? 1 : 3) });
    for (let n; (n = tw.nextNode());) if (shown(n.parentElement)) texts.push(n);
    const owners = [...new Set(texts.map(n => n.parentElement))];
    const sample = el => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);

    // ---- colours ----
    const rgb = s => {
      let m = s.match(/rgba?\(([^)]+)\)/);
      if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
      m = s.match(/color\(srgb ([^)]+)\)/);
      if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] ?? 1]; }
      return null;
    };
    const lum = ([r, g, b]) => { const f = v => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const over = (top, bot) => [0, 1, 2].map(i => top[i] * top[3] + bot[i] * (1 - top[3])).concat(1);
    const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
    const bgCache = new Map();
    function bgOf(e) {   // composite of the background colours behind e; null if a background image is involved
      if (bgCache.has(e)) return bgCache.get(e);
      const layers = []; let img = false;
      for (let x = e; x; x = x.parentElement) {
        const cs = getComputedStyle(x);
        if (cs.backgroundImage !== 'none') { img = true; break; }
        const c = rgb(cs.backgroundColor);
        if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
      }
      let b = [255, 255, 255, 1];
      for (let i = layers.length - 1; i >= 0; i--) b = over(layers[i], b);
      const r = img ? null : b; bgCache.set(e, r); return r;
    }
    function contrast(el, cs, what) {
      const fg = rgb(cs.color), bg = bgOf(el);
      if (!fg || !bg) return;
      const f = over(fg, bg), r = ratio(f, bg);
      if (r < MIN_CONTRAST) add('contrast', rule(el) + what + hex(f) + hex(bg), path(el), `${r.toFixed(2)}:1, ${hex(f)} on ${hex(bg)}${what} (min ${MIN_CONTRAST}:1), e.g. "${sample(el)}"`);
    }

    // ---- text size, contrast, line length ----
    const charW = new Map(), ctx = document.createElement('canvas').getContext('2d');
    const SAMPLE = 'The electrons in a metal fill states up to the Fermi energy, so only those near it can move.';
    for (const el of owners) {
      const cs = getComputedStyle(el), fs = parseFloat(el.matches('sub, sup') ? getComputedStyle(el.parentElement.closest(':not(sub, sup)')).fontSize : cs.fontSize);   // sub/sup: judged at the text they belong to
      if (phone) {
        const lab = !!el.closest(LABEL), min = lab ? MIN_LABEL : MIN_BODY;
        if (fs < min - 0.05) add('font', rule(el) + fs, path(el), `${lab ? 'label/caption' : 'body text'} at ${fs}px (min ${min}px), e.g. "${sample(el)}"`);
      }
      if (opts.contrast) contrast(el, cs, '');
    }
    if (opts.contrast || phone) {
      for (const el of document.body.querySelectorAll('*')) {   // text from ::before / ::after (badges, labels)
        if (el.closest(SKIP)) continue;
        for (const ps of ['::before', '::after']) {
          const cs = getComputedStyle(el, ps), c = cs.content;
          if (!c || c === 'none' || c === 'normal' || !/[A-Za-z0-9]/.test(c) || !shown(el)) continue;
          const fs = parseFloat(cs.fontSize);
          if (phone && fs < MIN_LABEL - 0.05) add('font', rule(el) + ps + fs, path(el) + ps, `label ${c.slice(0, 30)} at ${fs}px (min ${MIN_LABEL}px)`);
          if (opts.contrast && rgb(cs.backgroundColor) && rgb(cs.backgroundColor)[3] > 0) {
            const f = rgb(cs.color), b = over(rgb(cs.backgroundColor), bgOf(el) || [255, 255, 255, 1]), r = ratio(over(f, b), b);
            if (r < MIN_CONTRAST) add('contrast', rule(el) + ps, path(el) + ps, `${r.toFixed(2)}:1, ${hex(f)} on ${hex(b)} in ${ps} ${c.slice(0, 30)}`);
          } else if (opts.contrast) contrast(el, cs, ' ' + ps);
        }
      }
    }
    for (const el of document.querySelectorAll('p, li, dd, figcaption, blockquote, td, .takeaway, .trap, .check, .assume, .result, .hook, .cannow, .note, .try, .lead')) {
      if (!shown(el) || (el.textContent || '').trim().length < 90 || el.closest(SKIP)) continue;
      const cs = getComputedStyle(el), font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if (!charW.has(font)) { ctx.font = font; charW.set(font, ctx.measureText(SAMPLE).width / SAMPLE.length); }
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), cpl = Math.round(w / charW.get(font));
      if (cpl > MAX_CPL) add('line-length', rule(el) + Math.round(cpl / 10), path(el), `about ${cpl} characters per line at ${cs.fontSize} (aim for at most about 80)`);
    }

    // ---- tap targets (phone) ----
    if (phone) {
      const TAP = 'button, .btn, input[type=range], select, label:has(input[type=radio]), label:has(input[type=checkbox]), .path a';
      for (const el of document.querySelectorAll(TAP)) {
        if (!shown(el) && !el.matches('label')) continue;
        if (el.matches('a') && [...el.parentElement.childNodes].some(n => n.nodeType === 3 && n.data.trim())) continue;   // a link inside a sentence (WCAG 2.5.8 inline exception)
        const h = el.getBoundingClientRect().height;
        if (h && h < MIN_TAP) add('tap', rule(el) + Math.round(h), path(el), `${el.matches('input[type=range]') ? 'slider' : el.matches('label') ? 'radio/checkbox label' : el.matches('.path a') ? 'reading-path link' : 'button'} is ${Math.round(h)}px tall (min ${MIN_TAP}px)`);
      }
    }

    // ---- overlap: text line boxes against each other and against controls, plots, canvases and math ----
    const boxes = [];
    for (const n of texts) {
      const r = document.createRange(); r.selectNodeContents(n);
      for (const q of r.getClientRects()) if (q.width > 1 && q.height > 1) boxes.push({ r: q, el: n.parentElement, node: n });
    }
    document.querySelectorAll('input:not([type=hidden]), button, select, canvas, img, .js-plotly-plot, .katex, math').forEach(e => {
      if ((e.parentElement && e.parentElement.closest('.katex, math, .js-plotly-plot')) || !shown(e)) return;
      // Inline math can wrap: use its per-line boxes, not the union box.
      for (const q of e.matches('.katex, math') ? e.getClientRects() : [e.getBoundingClientRect()]) if (q.width > 1 && q.height > 1) boxes.push({ r: q, el: e });
    });
    const blockOf = e => { for (let x = e; x; x = x.parentElement) if (!getComputedStyle(x).display.startsWith('inline')) return x; return document.body; };
    const posd = e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === 'absolute' || p === 'fixed' || p === 'sticky') return true; } return false; };
    boxes.sort((a, b) => a.r.top - b.r.top);
    const active = [];
    for (const b of boxes) {
      for (let i = active.length - 1; i >= 0; i--) if (active[i].r.bottom <= b.r.top + 2) active.splice(i, 1);
      for (const a of active) {
        const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (ix <= 2 || iy <= 2 || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        if (posd(a.el) || posd(b.el)) continue;
        const same = blockOf(a.el) === blockOf(b.el);
        add(same ? 'overlap-inline' : 'overlap', rule(a.el) + ' x ' + rule(b.el), path(b.el),
          `"${sample(b.node ? b.node.parentElement : b.el)}" (${rule(b.el)}) overlaps "${sample(a.node ? a.node.parentElement : a.el)}" (${rule(a.el)}, ${path(a.el)}) by ${Math.round(ix)}×${Math.round(iy)}px`);
      }
      active.push(b);
    }

    // ---- plots: width and height ----
    document.querySelectorAll('.js-plotly-plot, figure canvas').forEach(e => {
      if (!shown(e)) return;
      const q = e.getBoundingClientRect();
      if (q.width < MIN_PLOT_W) add('plot-size', rule(e) + 'w', path(e), `plot is ${Math.round(q.width)}px wide (min ${MIN_PLOT_W}px)`);
      if (q.height > innerHeight) add('plot-size', rule(e) + 'h', path(e), `plot is ${Math.round(q.height)}px tall, taller than the ${innerHeight}px viewport`);
    });

    // ---- text inside plots (Plotly SVG: tick labels, axis titles, annotations), phone only ----
    if (phone) document.querySelectorAll('.js-plotly-plot').forEach(gd => {
      if (!shown(gd)) return;
      gd.querySelectorAll('text').forEach(t => {
        const fs = parseFloat(t.style.fontSize || getComputedStyle(t).fontSize);
        if (t.textContent.trim() && fs < MIN_LABEL - 0.05) add('font', 'plot text ' + fs, path(gd), `plot text at ${fs}px (min ${MIN_LABEL}px), e.g. "${t.textContent.trim().slice(0, 20)}"`);
      });
    });

    // ---- figure captions cut off ----
    document.querySelectorAll('figcaption').forEach(fc => {
      if (!shown(fc)) return;
      const cs = getComputedStyle(fc), r = fc.getBoundingClientRect();
      if (fc.scrollHeight > fc.clientHeight + 1 || fc.scrollWidth > fc.clientWidth + 1 || cs.textOverflow === 'ellipsis' || cs.webkitLineClamp !== 'none' && cs.webkitLineClamp)
        add('caption-cut', path(fc), path(fc), `caption content is larger than its box (${fc.scrollWidth}×${fc.scrollHeight} in ${fc.clientWidth}×${fc.clientHeight})`);
      for (let a = fc.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
        const q = a.getBoundingClientRect();
        if (r.bottom > q.bottom + 1 || r.right > q.right + 1 || r.left < q.left - 1 || r.top < q.top - 1)
          add('caption-cut', path(fc) + path(a), path(fc), `caption is clipped by ${path(a)} (overflow ${s.overflowX}/${s.overflowY})`);
      }
    });

    // ---- equations: size, errors, unrendered TeX ----
    document.querySelectorAll('.eq').forEach(eq => {
      if (!shown(eq)) return;
      // The visible rendering: KaTeX's HTML (its .katex-mathml copy is a clipped screen-reader duplicate), else MathML.
      const m = eq.querySelector('.katex-display > .katex') || eq.querySelector('math[display="block"]:not(.katex-mathml math)') || eq.querySelector('.katex, math');
      if (!m) return add('math-missing', path(eq), path(eq), 'equation panel has no rendered math');
      const fs = parseFloat(getComputedStyle(m).fontSize), q = m.getBoundingClientRect();
      if (!q.height) add('math-missing', path(eq), path(eq), 'rendered equation has zero height');
      if (fs < MIN_EQ - 0.05) add('eq-small', rule(eq) + fs, path(eq), `display equation at ${fs.toFixed(1)}px (min ${MIN_EQ}px, larger than ${MIN_BODY}px body text)`);
    });
    document.querySelectorAll('math:not([display="block"]), .katex').forEach(m => {
      if (m.closest('.eq, .katex-display') || (m.parentElement && m.parentElement.closest('.katex, math')) || !shown(m)) return;
      const fs = parseFloat(getComputedStyle(m).fontSize), p = m.parentElement, lab = !!p.closest(LABEL), min = lab ? MIN_LABEL : MIN_BODY;
      if (phone && fs < min - 0.05) add('eq-small', rule(p) + fs, path(p), `inline math at ${fs.toFixed(1)}px in ${lab ? 'a label/caption' : 'body text'} (min ${min}px), e.g. "${sample(p)}"`);
    });
    // Inline math wider than its text block (MathML in the phone builds cannot line-break), and horizontal page scroll.
    document.querySelectorAll('math:not([display="block"]), .katex').forEach(m => {
      if (m.closest('.eq, .katex-display') || (m.parentElement && m.parentElement.closest('.katex, math')) || !shown(m)) return;
      const b = blockOf(m.parentElement), q = b.getBoundingClientRect(), cs = getComputedStyle(b);
      const left = q.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), right = q.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
      const over = Math.max(0, ...[...m.getClientRects()].map(r => Math.max(r.right - right, left - r.left)));
      if (m.matches('.m-scroll') && m.scrollWidth > m.clientWidth + 1) add('math-scroll', path(b), path(b), `inline math scrolls inside its span (${m.scrollWidth - m.clientWidth}px hidden) in ${rule(b)}: "${sample(m).slice(0, 30)}"`);
      if (over > 1) add('math-spill', path(b) + Math.round(over), path(b), `inline math spills ${Math.round(over)}px out of ${rule(b)}: "${sample(m).slice(0, 30)}"`);
    });
    const hs = document.documentElement.scrollWidth - innerWidth;
    if (hs > 1) add('h-scroll', 'page', 'html', `page scrolls horizontally by ${hs}px at ${innerWidth}px`);
    document.querySelectorAll('.katex-error, merror').forEach(e => add('math-error', path(e), path(e), `math error: ${(e.getAttribute('title') || e.textContent).slice(0, 120)}`));
    for (const n of texts) {
      if (n.parentElement.closest('code, pre, kbd')) continue;
      const m = n.data.match(/\\[a-zA-Z]{2,}|\$[^$\s][^$]*[\\^_{][^$]*\$/);
      if (m) add('raw-tex', path(n.parentElement) + m[0], path(n.parentElement), `unrendered TeX "${m[0].slice(0, 40)}" in "${sample(n.parentElement)}"`);
    }

    // ---- token contrast table (current theme) ----
    let tokens;
    if (opts.tokens) {
      const s = getComputedStyle(document.documentElement), v = n => rgb(`rgb(${parseInt(s.getPropertyValue(n).trim().slice(1, 3), 16)}, ${parseInt(s.getPropertyValue(n).trim().slice(3, 5), 16)}, ${parseInt(s.getPropertyValue(n).trim().slice(5, 7), 16)})`);
      // Text token -> the backgrounds site.css puts it on (from its color:/background: rules).
      const PAIRS = [['--fg', ['--bg', '--panel', '--eq-bg', '--eq-key-bg', '--b-hook-bg', '--b-take-bg', '--b-trap-bg', '--b-check-bg']],
        ['--muted', ['--bg', '--panel', '--eq-bg']], ['--accent', ['--bg', '--panel']], ['--occ', ['--bg', '--panel']],
        ['--emp', ['--bg', '--panel']], ['--ef', ['--bg', '--panel']], ['--eq-key', ['--eq-key-bg', '--eq-bg']],
        ['--t-exam', ['--t-exam-bg']], ['--t-hw', ['--t-hw-bg']], ['--t-deriv', ['--t-deriv-bg']], ['--t-lect', ['--t-lect-bg']],
        ['--b-take', ['--b-take-bg', '--panel']], ['--b-trap', ['--b-trap-bg']], ['--b-check', ['--b-check-bg', '--bg']],
        ['--panel', ['--accent', '--fg', '--eq-key', '--b-take', '--occ']]];
      tokens = PAIRS.flatMap(([f, bs]) => bs.map(b => ({ fg: f, bg: b, ratio: +ratio(v(f), v(b)).toFixed(2) })));
    }
    return { url: location.pathname, width: innerWidth, height: innerHeight, issues: [...out.values()], tokens };
  } finally {
    opened.forEach(d => { d.open = false; });
  }
};
