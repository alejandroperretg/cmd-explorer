// Internal link checker and cross-page dependency graph. No dependencies.
// Usage: node tools/links.js [--list]
//   Checks every pages/NN-*.html (and index.html for broken anchors only).
//   broken:     "#id" or "NN-page.html#id" whose page or id does not exist (exit 1).
//   back-links: page A links to page B, but B has no link back to A ("used in →" / "← from") (exit 1).
//   bare:       a cross-page link without an #anchor (warning). Links to pages not built yet are listed as pending.
//   --list      also print every internal link.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), pdir = path.join(root, 'pages');
const pages = fs.readdirSync(pdir).filter(f => /^\d\d-.*\.html$/.test(f)).sort();
const ids = {}, links = {};
const read = f => fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
for (const p of pages) {
  const s = read(path.join(pdir, p));
  ids[p] = new Set([...s.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  links[p] = [...s.matchAll(/href="([^"]*)"/g)].map(m => m[1]).filter(h => !/[${}+]/.test(h));
}
const broken = [], pending = new Set(), bare = [], edges = {};
function check(from, href, base) {
  let m, page, id;
  if (href.startsWith('#')) { page = base; id = href.slice(1); }
  else if ((m = href.match(/^(?:pages\/)?(\d\d-[\w-]+\.html)(?:#(.*))?$/))) { page = m[1]; id = m[2]; }
  else return null; // external, ../index.html, assets
  if (!ids[page]) { if (id) broken.push(`${from}: ${href} (no such page)`); else pending.add(page); return null; }
  if (id && !ids[page].has(id)) broken.push(`${from}: ${href}`);
  return { page, id };
}
for (const p of pages) {
  for (const h of links[p]) {
    if (process.argv.includes('--list')) console.log(`${p}  ${h}`);
    const t = check(p, h, p);
    if (!t || t.page === p) continue;
    (edges[p] ||= {})[t.page] = (edges[p][t.page] || 0) + 1;
    if (!t.id) bare.push(`${p}: ${h}`);
  }
}
const idx = read(path.join(root, 'index.html'));
ids['index.html'] = new Set([...idx.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
for (const [, h] of idx.matchAll(/href="([^"]*)"/g)) if (h.startsWith('pages/') || h.startsWith('#')) check('index.html', h, 'index.html');
// Justified one-way links (no concept dependency): "from → to": reason.
const EXCEPT = { '04-elasticity.html → 09-bands.html': 'data note: lattice constant taken from page 09' };
const missing = [], excused = [];
for (const a in edges) for (const b in edges[a]) if (!(edges[b] && edges[b][a])) (EXCEPT[`${a} → ${b}`] ? excused : missing).push(`${a} → ${b} (${edges[a][b]} links), no link back`);

console.log('Dependency graph (links per page pair):');
for (const a of pages) console.log(`  ${a.slice(0, 2)} → ${Object.entries(edges[a] || {}).map(([b, n]) => `${b.slice(0, 2)}×${n}`).join(' ') || '-'}`);
const show = (t, l) => { console.log(`\n${t}: ${l.length}`); l.forEach(x => console.log('  ' + x)); };
show('Broken links', broken);
show('Missing back-links', missing);
show('Excused one-way links (EXCEPT)', excused);
show('Bare cross-page links (no #anchor)', bare);
if (pending.size) console.log(`\nPending pages (not built yet): ${[...pending].join(', ')}`);
process.exit(broken.length || missing.length ? 1 : 0);
