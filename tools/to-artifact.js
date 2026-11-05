// Turn an explorer page into a self-contained artifact page.
// Usage: node to-artifact.js <explorer dir> <page file> <out file>
const fs = require('fs'), path = require('path');
const [dir, page, out] = process.argv.slice(2);
let s = fs.readFileSync(path.join(dir, 'pages', page), 'utf8');
const css = fs.readFileSync(path.join(dir, 'assets/site.css'), 'utf8');
// KaTeX's stylesheet is blocked by the artifact CSP, so render math as native MathML.
let js = fs.readFileSync(path.join(dir, 'assets/common.js'), 'utf8')
  .replace('throwOnError: false,', "throwOnError: false, output: 'mathml',");
if (!js.includes("output: 'mathml'")) throw new Error('MATH_OPTS not found');

const head = s.slice(s.indexOf('<head>') + 6, s.indexOf('</head>'));
const title = head.match(/<title>[\s\S]*?<\/title>/)[0];
const fonts = head.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis[^>]*>/)[0];
const libs = [...head.matchAll(/<script defer src="(https:[^"]+)"><\/script>/g)]
  .map(m => `<script src="${m[1]}"></script>`).join('\n');
let body = s.slice(s.indexOf('<body>') + 6, s.lastIndexOf('</body>'));
// Links to other site pages don't exist in the artifact: keep their text only.
body = body.replace(/<a ([^>]*?)href="(\.\.\/)?[^"#]*\.html[^"]*"([^>]*)>([\s\S]*?)<\/a>/g, '<span $1$3>$4</span>');

fs.writeFileSync(out, `${title}
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
<style>
${css}
</style>
${libs}
<script>
${js}
</script>
${body}
`);
console.log('wrote', out, fs.statSync(out).size, 'bytes');
