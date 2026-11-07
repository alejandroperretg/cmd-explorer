// Stress and readability test for the explorer pages, in headless Chrome. No dependencies (Node 22+, Chrome).
// Usage: node tools/stress.js [options]
//   --pages 01,05        pages to test (default: every pages/NN-*.html)
//   --builds             also test the phone builds build/cmd-NN.html. Make them first:
//                          node tools/to-artifact.js . 05-phonons.html build/cmd-05.html
//   --only-builds        test the phone builds only
//   --widths 360,400     default 320,360,400,768,1280
//   --themes dark        default light,dark (prefers-color-scheme; the saved nav choice is cleared)
//   --jobs 3             pages tested in parallel
//   --out results.json   full results (default: stress-results.json in the OS temp folder)
//   --shot "05 360 dark #al-cv out.png"   screenshot one element (page, width, theme, selector, file), then exit; 05-build = phone build
//   --eval "05 360 dark <js>"             print the value of a JS expression in the loaded page, then exit (debugging)
//   --port 8790          static server port; Chrome's debugging port is port + 1. CHROME=path overrides the browser.
// Each page is reloaded for every width × theme. Then `await CM.stress()` (assets/common.js) and
// CMReadability (tools/readability.js) run in it. Severity: broken = crash, NaN, dead control or math error;
// unreadable = overflow, overlap, too small, low contrast; cosmetic = the rest. Font size and tap targets are
// checked below 768 px only; contrast once per theme, at 360 px. Phone builds are served inside a minimal
// document skeleton (doctype, charset, viewport meta), as the artifact host does.
// A model that deliberately reaches an invalid state (e.g. an unstable matrix) marks it with data-state="invalid" on the
// .bench or the affected element; its readouts and plots are then not checked and the state is listed as cosmetic.
// Exit code: 1 if anything is broken, else 0. The server, Chrome and its temporary profile are always cleaned up.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const PORT = +arg('port', 8790), DPORT = PORT + 1, JOBS = +arg('jobs', 3);
const WIDTHS = String(arg('widths', '320,360,400,768,1280')).split(',').map(Number);
const THEMES = String(arg('themes', 'light,dark')).split(',');
const HEIGHT = { 320: 568, 360: 740, 400: 860, 768: 1024, 1280: 800 };
const OUT = arg('out', path.join(os.tmpdir(), 'stress-results.json'));
const CHROME = process.env.CHROME || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => fs.existsSync(p));
const READ_JS = fs.readFileSync(path.join(__dirname, 'readability.js'), 'utf8');

const allPages = fs.readdirSync(path.join(ROOT, 'pages')).filter(f => /^\d\d-.*\.html$/.test(f)).sort();
const want = arg('pages') ? String(arg('pages')).split(',') : null;
const pages = allPages.filter(f => !want || want.includes(f.slice(0, 2)));
const targets = [];
if (!arg('only-builds')) pages.forEach(f => targets.push({ name: f.slice(0, 2), url: `/pages/${f}`, build: false }));
if (arg('builds') || arg('only-builds')) pages.forEach(f => {
  const b = `build/cmd-${f.slice(0, 2)}.html`;
  if (fs.existsSync(path.join(ROOT, b))) targets.push({ name: f.slice(0, 2) + ' build', url: '/' + b, build: true });
  else console.warn(`missing ${b}: run node tools/to-artifact.js . ${f} ${b}`);
});

// ---------- static server (as tools/serve.js; refuses sources/; wraps phone builds in a skeleton) ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const SKELETON = '<!doctype html>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n';
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  if (rel === '/favicon.ico') { res.writeHead(204); return res.end(); }   // Chrome asks for it; the site has none
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) || /^[\\/]sources([\\/]|$)/.test(rel)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    if (/^[\\/]build[\\/].*\.html$/.test(rel) && !/^\s*<!doctype/i.test(data.toString('utf8', 0, 64))) data = Buffer.concat([Buffer.from(SKELETON), data]);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

// ---------- Chrome DevTools Protocol over one browser connection, flattened sessions ----------
class CDP {
  constructor(url) { this.url = url; this.id = 0; this.pend = new Map(); this.subs = new Set(); }
  open() {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pend.has(m.id)) { const p = this.pend.get(m.id); this.pend.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
      else this.subs.forEach(f => f(m));
    };
    return new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((res, rej) => this.pend.set(id, { res, rej }));
  }
  once(pred, ms, what) {   // resolve on the first event matching pred; reject after ms (a guard, not a wait)
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.subs.delete(f); rej(new Error('timeout: ' + what)); }, ms);
      const f = m => { if (pred(m)) { clearTimeout(t); this.subs.delete(f); res(m); } };
      this.subs.add(f);
    });
  }
}
const guard = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout: ' + what)), ms))]);

async function newTab(cdp) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', newWindow: true });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  const logs = [];
  cdp.subs.add(m => {
    if (m.sessionId !== sessionId) return;
    if (m.method === 'Runtime.exceptionThrown') logs.push({ level: 'exception', text: (m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text });
    if (m.method === 'Runtime.consoleAPICalled' && /error|warning|assert/.test(m.params.type))
      logs.push({ level: m.params.type, text: m.params.args.map(a => a.value ?? a.description).join(' ') });
    if (m.method === 'Log.entryAdded' && m.params.entry.level !== 'verbose' && m.params.entry.level !== 'info')
      logs.push({ level: 'log-' + m.params.entry.level, text: m.params.entry.text + (m.params.entry.url ? ' ' + m.params.entry.url : '') });
  });
  await s('Page.enable'); await s('Runtime.enable'); await s('Log.enable');
  await s('Emulation.setFocusEmulationEnabled', { enabled: true });
  await s('Page.addScriptToEvaluateOnNewDocument', { source: "try { localStorage.removeItem('cm-theme') } catch (e) {}" });
  const ev = async (expression, ms = 180000) => {
    const r = await guard(s('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }), ms, expression.slice(0, 40));
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text);
    return r.result.value;
  };
  return { s, sessionId, targetId, logs, ev };
}

const READY = `(async () => {
  await document.fonts.ready;
  for (let i = 0; i < 3; i++) await new Promise(r => { requestAnimationFrame(() => r()); setTimeout(r, 250); });
  return { cm: !!window.CM, stress: !!(window.CM && CM.stress), plotly: !!window.Plotly };
})()`;

async function load(tab, cdp, t, width, theme) {
  const height = HEIGHT[width] || 900, mobile = width < 768;
  await tab.s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await tab.s('Emulation.setTouchEmulationEnabled', { enabled: mobile });
  await tab.s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
  tab.logs.length = 0;
  const loaded = cdp.once(m => m.sessionId === tab.sessionId && m.method === 'Page.loadEventFired', 60000, 'load ' + t.url);
  await tab.s('Page.navigate', { url: `http://127.0.0.1:${PORT}${t.url}` });
  await loaded;
  return tab.ev(READY, 30000);
}

async function runOne(tab, cdp, t, width, theme) {
  const run = { page: t.name, build: t.build, width, theme, stress: null, read: null, load: [], error: null };
  try {
    const ready = await load(tab, cdp, t, width, theme);
    run.load = tab.logs.splice(0);
    if (!ready.stress) throw new Error('CM.stress missing (page did not load common.js?) ' + JSON.stringify(ready));
    run.stress = await tab.ev('CM.stress()');
    run.after = tab.logs.splice(0).filter(l => l.level === 'exception');   // async errors that escaped the report
    await tab.ev(READ_JS + '; 0');
    run.read = await tab.ev(`CMReadability(${JSON.stringify({ phone: width < 768, contrast: width === 360, tokens: width === 360 && t.name === targets[0].name })})`, 60000);
  } catch (e) { run.error = e.message; }
  return run;
}

// ---------- severity ----------
const SEV = { exception: 'broken', 'console.error': 'broken', readout: 'broken', 'plot-empty': 'broken', 'plot-nan': 'broken', dead: 'broken',
  'math-error': 'broken', 'math-missing': 'broken', 'raw-tex': 'broken', 'load-error': 'broken', runner: 'broken',
  layout: 'unreadable', font: 'unreadable', tap: 'unreadable', contrast: 'unreadable', overlap: 'unreadable', 'plot-size': 'unreadable',
  'caption-cut': 'unreadable', 'eq-small': 'unreadable', 'math-spill': 'unreadable', 'h-scroll': 'unreadable', 'math-scroll': 'cosmetic', 'invalid-state': 'cosmetic',
  'console.warn': 'cosmetic', 'plot-nan-partial': 'cosmetic', 'not-restored': 'cosmetic', 'overlap-inline': 'cosmetic', 'line-length': 'cosmetic', 'load-warning': 'cosmetic' };
function items(run) {
  const L = [];
  if (run.error) L.push({ kind: 'runner', sel: '', detail: run.error });
  for (const l of run.load) L.push({ kind: /exception|error/.test(l.level) ? 'load-error' : 'load-warning', sel: '', detail: `${l.level}: ${l.text}`.slice(0, 300) });
  for (const l of run.after || []) L.push({ kind: 'exception', sel: '', detail: 'async: ' + l.text.slice(0, 300) });
  if (run.stress) {
    for (const i of run.stress.issues) {
      const kind = i.kind === 'dead' && i.canvas ? 'dead' : i.kind;
      L.push({ kind, sel: i.control || i.sel || i.model, detail: i.detail, repro: `${i.model}: ${i.control || '-'} → ${i.step}`, count: i.count });
    }
    for (const h of run.stress.layout) L.push({ kind: 'layout', sel: h.path, detail: `${h.kind} by ${h.px}px: "${h.text}"` });
  }
  if (run.read) for (const i of run.read.issues) L.push({ kind: i.kind, sel: i.sel, detail: i.detail, n: i.n, group: i.key });
  return L.map(x => Object.assign(x, { sev: SEV[x.kind] || 'cosmetic' }));
}

function summarize(runs) {
  const byPage = new Map();
  for (const r of runs) {
    const p = byPage.get(r.page) || { page: r.page, combos: {}, unique: new Map() };
    byPage.set(r.page, p);
    const its = items(r), c = { broken: 0, unreadable: 0, cosmetic: 0 };
    for (const it of its) {
      c[it.sev]++;
      const key = [it.sev, it.kind, it.group || it.sel + '|' + it.detail.replace(/\d+(\.\d+)?/g, '#')].join('|');
      const u = p.unique.get(key) || Object.assign({}, it, { where: [] });
      u.where.push(`${r.width}${r.theme[0]}`); p.unique.set(key, u);
    }
    p.combos[`${r.width} ${r.theme}`] = c;
  }
  return [...byPage.values()].map(p => ({ page: p.page, combos: p.combos, items: [...p.unique.values()] }));
}

// ---------- main ----------
let chrome, profile;
async function main() {
  if (!CHROME) throw new Error('Chrome not found; set CHROME=path');
  await new Promise((res, rej) => { server.once('error', rej); server.listen(PORT, '127.0.0.1', res); });
  profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cmd-stress-'));
  chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DPORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--mute-audio',
    '--enable-unsafe-swiftshader', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'],
  { stdio: 'ignore' });
  let ver;
  for (let i = 0; i < 80 && !ver; i++) {   // poll until the debugging endpoint answers
    try { ver = await (await fetch(`http://127.0.0.1:${DPORT}/json/version`)).json(); } catch { await new Promise(r => setTimeout(r, 250)); }
  }
  if (!ver) throw new Error('Chrome did not start');
  const cdp = new CDP(ver.webSocketDebuggerUrl); await cdp.open();

  const shot = arg('shot');
  if (typeof shot === 'string') {   // "05 360 dark #sel out.png"
    const [pg, w, th, ...rest] = shot.split(' '); const file = rest.pop(), sel = rest.join(' ');
    const t = targets.find(x => x.name === pg.replace('-build', ' build')) || targets.find(x => x.name.startsWith(pg));   // 04-build = the phone build
    const tab = await newTab(cdp); await load(tab, cdp, t, +w, th);
    const box = await tab.ev(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.scrollIntoView({ block: 'center' });
      const r = e.getBoundingClientRect(); return { x: Math.max(0, r.left - 8), y: Math.max(0, r.top + scrollY - 8), width: Math.min(innerWidth, r.width + 16), height: r.height + 16 }; })()`);
    const r = await tab.s('Page.captureScreenshot', { format: 'png', clip: Object.assign(box, { scale: 1 }), captureBeyondViewport: true });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64')); console.log('wrote', file);
    return 0;
  }
  const evl = arg('eval');
  if (typeof evl === 'string') {   // "05 360 dark <expression>": print the JSON value of an expression in the loaded page, then exit
    const [pg, w, th, ...rest] = evl.split(' ');
    const t = targets.find(x => x.name === pg.replace('-build', ' build')) || targets.find(x => x.name.startsWith(pg));   // 04-build = the phone build
    const tab = await newTab(cdp); await load(tab, cdp, t, +w, th);
    console.log(JSON.stringify(await tab.ev(rest.join(' ')), null, 1));
    return 0;
  }

  const jobs = []; for (const t of targets) for (const w of WIDTHS) for (const th of THEMES) jobs.push({ t, w, th });
  const runs = []; let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(Array.from({ length: Math.min(JOBS, targets.length) }, async () => {
    const tab = await newTab(cdp);
    while (next < jobs.length) {
      const j = jobs[next++];
      const r = await runOne(tab, cdp, j.t, j.w, j.th); runs.push(r);
      process.stdout.write(`\r${++done}/${jobs.length} runs (${Math.round((Date.now() - t0) / 1000)} s)   `);
    }
    await cdp.send('Target.closeTarget', { targetId: tab.targetId }).catch(() => {});
  }));
  console.log();
  const order = t => targets.findIndex(x => x.name === t);
  runs.sort((a, b) => order(a.page) - order(b.page) || a.width - b.width || a.theme.localeCompare(b.theme));
  const sum = summarize(runs).sort((a, b) => order(a.page) - order(b.page));
  fs.writeFileSync(OUT, JSON.stringify({ when: new Date().toISOString(), widths: WIDTHS, themes: THEMES, summary: sum, runs }, null, 1));

  // Printed summary: unique issues per page and severity, then the unique items (most widespread first).
  const n = (p, s) => p.items.filter(i => i.sev === s).length;
  console.log('\npage        broken  unreadable  cosmetic   (unique items; per width/theme counts in the JSON)');
  for (const p of sum) console.log(`${p.page.padEnd(10)}  ${String(n(p, 'broken')).padStart(6)}  ${String(n(p, 'unreadable')).padStart(10)}  ${String(n(p, 'cosmetic')).padStart(8)}`);
  for (const p of sum) {
    const its = p.items.filter(i => i.sev !== 'cosmetic').sort((a, b) => (a.sev > b.sev ? 1 : -1) || b.where.length - a.where.length);
    if (!its.length) continue;
    console.log(`\n== ${p.page}`);
    its.slice(0, 25).forEach(i => console.log(`  [${i.sev}] ${i.kind} ${i.sel}  ${i.detail.slice(0, 160)}${i.repro ? '\n      repro: ' + i.repro.slice(0, 200) : ''}\n      at: ${i.where.join(' ')}`));
    if (its.length > 25) console.log(`  … ${its.length - 25} more in ${OUT}`);
  }
  console.log('\nfull results:', OUT);
  return sum.some(p => n(p, 'broken')) ? 1 : 0;
}

async function cleanup() {
  server.close();
  if (chrome && chrome.exitCode === null) {
    const gone = new Promise(r => chrome.once('exit', r));
    try { const v = await (await fetch(`http://127.0.0.1:${DPORT}/json/version`)).json(); const c = new CDP(v.webSocketDebuggerUrl); await c.open(); c.send('Browser.close').catch(() => {}); } catch { chrome.kill(); }
    await guard(gone, 10000, 'chrome exit').catch(() => chrome.kill('SIGKILL'));
  }
  if (profile) try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); } catch (e) { console.warn('could not delete', profile, e.message); }
}
process.on('SIGINT', () => cleanup().then(() => process.exit(130)));
main().then(async code => { await cleanup(); process.exit(code); }, async e => { console.error(e); await cleanup(); process.exit(2); });
