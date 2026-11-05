# Conventions for topic pages

**Files.** One page per topic: `pages/<NN>-<slug>.html` (slugs in `PLAN.md`). Start by copying `templates/topic.html`; keep its head, nav and the six sections in order: Overview → Concepts → Interactive models → Homework guides → Exam angle → Sources. Edit only your own page, plus your own card in `index.html` (turn the `<div class="topic planned">` into `<a class="topic" href="pages/…">` and set its pill to `<span class="pill built">ready</span>`). Do not edit `assets/` — if you need a shared helper or style, say so in your report. Inputs and page refs: `sources/INDEX.md`.

**Physics.** Kittel 8th-ed. notation and sign conventions (e.g. $\mathbf a_i$, $\mathbf b_i$ with $\mathbf a_i\cdot\mathbf b_j = 2\pi\delta_{ij}$, $\mathbf G$, $\omega(k)$, $D(\varepsilon)$, $k_B$, $\varepsilon_F$). SI units throughout; write $\hbar$ explicitly (no $\hbar = 1$ in text; if a model uses scaled units, say so in its caption). Use eV or meV for energies where Kittel does, with the conversion shown once. Constants: `CM.K` (CODATA 2018, SI).

**Math.** KaTeX: `$…$` inline, `$$…$$` display. A literal dollar sign must be `\$`. Text inserted by JS is not auto-rendered: call `CM.math(el)` after setting `innerHTML`. Readouts and slider outputs use plain Unicode (`ε`, `ħ`, `k_F`), not KaTeX.

**Design.**
- Use the tokens and classes in `assets/site.css` only. No new colors, fonts, shadows or CSS frameworks. Colors in JS come from `CM.C` (`occ` copper = filled/primary, `emp` blue = empty/secondary, `ef` green = marker/level/Fermi, `muted`, `line`, `fg`, `scale` for heatmaps). A tiny page-local `<style>` for layout is acceptable; colors in it must be `var(--…)`.
- Models use the bench layout: `.bench` → `.rail` (eyebrow, h3, text, `.ctls`, `.state`, `.try`) + `.plots` (figures).
- Charts: Plotly 2.35.2 (already in the head) via `CM.layout`, `CM.ax`, `CM.kAx`, `CM.CFG`. Animations: `<canvas>` + `CM.loop(step, { el })` + `CM.playButton(btn, ctl, note)`.
- Every plot or canvas has a `<figcaption>` beginning `<b>How to read:</b>`, saying what the axes are, what each mark means and what to look for.
- Models open in a realistic, interesting state (real material values where possible, e.g. Cu, Si, NaCl), not at zero or at a degenerate limit.
- Respect reduced motion: animations start paused when `CM.reduceMotion` is true (`CM.loop` does this), with the "Paused because your system asks for reduced motion" note.
- Sliders: `<input type="range" id="<prefix>-<name>" data-fmt="2" data-unit=" eV">` (or `data-pi="1"` for k in π/a) plus `<output for="…">`. All inputs of one model share a prefix; call `CM.wire({ prefix: renderFn, … })` once. The render function reads all its inputs and redraws, and must also work when called again on a theme change.
- Page script goes inside `document.addEventListener('DOMContentLoaded', …)` (the libraries load with `defer`).

**Correctness.**
- Every numeric claim (results, readouts, captions, "typical value" statements) is checked independently: a `node -e` computation, a second formula or limit, or a comparison with a Kittel table. Write how in the guide's *Sanity check* line, or in a one-line JS comment next to a model's numbers.
- Homework guides reproduce the sheet's given data exactly (check against the PDF, not the text dump: the dump drops Greek letters and exponents). Anything not on the sheet (material data, approximations, a reading of an ambiguous statement) goes in an `.assume` box with its source.
- Explain in your own words. Do not copy more than a sentence from Kittel, the notes, the sheets or the Miro transcriptions, and never link to `sources/` or the course PDFs (they are not published).

**Definition of done** (tick all before reporting):
- [ ] Served with `node tools/serve.js` and opened: no console errors or warnings from page code.
- [ ] Every control visibly changes its plot or readout.
- [ ] At 400 px width: no horizontal page scroll (`document.documentElement.scrollWidth <= 400`); long equations scroll inside their own box.
- [ ] Readable in light and dark (nav "Dark/Light" button), plots re-themed.
- [ ] Every numeric claim checked, with the method stated as above.
- [ ] Every sheet problem for the topic (see `PLAN.md`) has a guide; the exam angle is filled.
- [ ] Page linked from `index.html` (card switched to ready). Do not tick `PLAN.md`; the reviewer does that after checking.
