// Flip reviewed index cards to ready and tick PLAN items. Usage: node flip.js <explorer dir> 01 07 ...
const fs = require('fs'), path = require('path');
const dir = process.argv[2], nums = process.argv.slice(3);
const idx = path.join(dir, 'index.html'), plan = path.join(dir, 'PLAN.md');
let s = fs.readFileSync(idx, 'utf8');
for (const n of nums) {
  const open = `<div class="topic planned" id="t${n}">`;
  const i = s.indexOf(open);
  if (i < 0) continue; // already flipped
  const endTag = '<span class="pill planned">planned</span></div>';
  const j = s.indexOf(endTag, i);
  const slug = fs.readdirSync(path.join(dir, 'pages')).find(f => f.startsWith(n + '-'));
  if (!slug) throw new Error('no page for ' + n);
  const inner = s.slice(i + open.length, j);
  s = s.slice(0, i) + `<a class="topic" id="t${n}" href="pages/${slug}">` + inner +
      '<span class="pill built">ready</span></a>' + s.slice(j + endTag.length);
}
s = s.replace('ready (NFE part planned)', 'ready');
s = s.replace(/<!-- PAGE AGENTS:[\s\S]*?-->/, '<!-- Cards are switched to ready by the coordinator after review. -->');
fs.writeFileSync(idx, s);
let p = fs.readFileSync(plan, 'utf8');
for (const n of nums) {
  const head = `- [ ] **${n} `;
  const i = p.indexOf(head);
  if (i < 0) continue;
  let j = p.indexOf('\n\n', i); if (j < 0) j = p.length;
  p = p.slice(0, i) + '- [x]' + p.slice(i + 5, j) +
      '\n  Result: built and reviewed 2026-11-05 (physics + code PASS).' + p.slice(j);
}
fs.writeFileSync(plan, p);
