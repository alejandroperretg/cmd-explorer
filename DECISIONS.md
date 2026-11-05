# Decisions

**Static HTML, no build step, no framework.** Each page is a single HTML file that loads `assets/site.css` and `assets/common.js`. Agents can work on one file each and the site opens from any static server.
Rejected: a static-site generator or bundler (a toolchain to install, and one more thing to break for parallel agents).

**Libraries from jsdelivr, pinned:** Plotly 2.35.2 (as in the original bands.html), KaTeX 0.16.11 + auto-render, Google Fonts (Archivo, IBM Plex Sans/Mono). Nothing vendored.
Rejected: vendoring into `assets/` (adds 4 MB to the repo; the original page already relied on the CDN). The site therefore needs internet access.

**One global `window.CM`, all scripts `defer`, page code in `DOMContentLoaded`.** The helpers come straight from bands.html. `CM.C` is mutated in place so destructured references stay valid after a theme change.
Rejected: ES modules (break on `file://`); blocking scripts in `<head>` (the 3.5 MB Plotly bundle would hold up first paint).

**Bands page ported, not rewritten.** Only these were swapped for the shared versions: the helper definitions, the slider/theme wiring (`CM.wire`) and the inline CSS. Bench headings became h3, under the new "Interactive models" h2. The model code is byte-identical.
Rejected: refactoring the models onto `CM.loop` (risk with no gain).

**Worked solutions inside `<details>`.** The method shows by default, while steps, result and sanity check open on click, so a student can try the problem first.
Rejected: everything open (spoils the attempt). Assumed without asking the user; easy to change in the template.

**Source dumps gitignored, served as 403.** `sources/` holds lecturer and student material; `.gitignore` excludes it and `tools/serve.js` refuses it, so nothing that is only found locally can leak into the published site.

**Source hierarchy set by the user:** topic list → sheets → Miro → 2022 exam → lecture notes → Kittel. The topic list defines scope, and the notes are incomplete because lectures were missed. The exam is exercise-oriented with some theory, and is expected to resemble 2022.
Rejected: the scaffold's original lecture-notes-first index and Kittel-first notation. Kittel remains the check on physics correctness.

**Topic split as briefed (14 pages).** The sources confirm it. Sheet 3 is split across 02 (3.1, 3.2) and 03 (3.3, 3.4), and sheet 9 across 07 (9.1) and 08 (9.2). Direct imaging (syllabus 1.1.3, notes "1.2", sheet 2.3) sits with diffraction in 02 because the sheet and notes group it there.
