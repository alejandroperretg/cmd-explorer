# Conventions for topic pages

**Files.** One page per topic: `pages/<NN>-<slug>.html` (slugs in `PLAN.md`). Start by copying `templates/topic.html`; keep its head, nav and the six sections in order: Overview → Concepts → Interactive models → Homework guides → Exam angle → Sources. Edit only your own page. Leave `index.html` alone: pages are built in parallel, so the coordinator switches each card to ready after its review. Do not edit `assets/` — if you need a shared helper or style, say so in your report. Inputs and page refs: `sources/INDEX.md`.

**Sources, in order of trust** (for what the course covers and how it states it): topic list → homework sheets → Miro boards → 2022 exam → lecture notes → Kittel.
- What each source is for:
  - topic list and 2022 exam: which topics get examined;
  - sheets: the material, the difficulty level, and what the exam will focus on;
  - lecture notes: notation;
  - Kittel: rigour.
- The topic list defines the scope. Every subsection it lists for your section gets a Concepts entry, even when no other source covers it.
- The lecture notes are incomplete (lectures were missed) and contain errors (see `../digest/`). Use them for the lecturer's notation, never as the only basis for a claim.
- Follow Kittel more closely (user request, 2026-11-10): for each lectured section, include Kittel's standard concepts, named schemes and key figures for it (e.g. extended / reduced / periodic zone schemes for bands), even when the lecture skips or only mentions them. Keep the lecture's order and notation, and tag such material "Kittel §…" so it's clear it goes beyond the notes.
- Kittel fills gaps and is the check on physics. When a course source disagrees with Kittel on physics, flag it in an `.assume` box rather than silently picking one.

**Physics.** Notation follows the sheets where they set one (e.g. $\sigma(\omega)=\sigma_0/(1+i\omega\tau)$ on sheet 9.2), otherwise Kittel 8th-ed. notation and sign conventions (e.g. $\mathbf a_i$, $\mathbf b_i$ with $\mathbf a_i\cdot\mathbf b_j = 2\pi\delta_{ij}$, $\mathbf G$, $\omega(k)$, $D(\varepsilon)$, $k_B$, $\varepsilon_F$). SI units throughout; write $\hbar$ explicitly (no $\hbar = 1$ in text; if a model uses scaled units, say so in its caption). Use eV or meV for energies where Kittel does, with the conversion shown once. Constants: `CM.K` (CODATA 2018, SI).

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

**Pedagogy.** Markup for each element is in `templates/topic.html`; page 09 is the reference.
- Every display equation is in an `.eq` panel (optional `.eq-head` label, optional `.eq-n` number). Use `.eq.key` for must-know results only (a few per page).
- Every equation or derivation that a sheet problem or exam question uses is tagged where it is introduced: `.tag.hw` ("Sheet 8.2", linked to the guide), `.tag.exam` ("Exam Q4c", linked to the exam answer), `.tag.deriv` (a derivation the exam needs reproduced). Tags must match what the sheet or exam actually asks. `.tag.lect` marks material not yet lectured.
- **The Concepts are organised by topic-list section, never 1, 2, 3** (user request, 2026-11-06).
  - Each topic-list subsection, e.g. 2.6.1 Bloch theorem, is a section in topic-list order.
  - The heading starts with the number: `<span class="step">2.6.1</span> Bloch theorem`.
  - Each section opens with two short lines, *What this covers* and *Why it matters* (for the exam, the homework and later topics), and then teaches the content.
  - Extra cards that aren't in the topic list sit inside the nearest subsection, labelled e.g. `2.6.2 · Empty lattice`.
  - The reading path uses the same numbers: `<li data-sec="2.6.1">`.
  - A `.needs` line links to prerequisite sections by number.
- Concept cards in reading order (`.step`), with a `.needs` line linking to prerequisite cards.
- **Follow the lecture flow** (user request, 2026-11-07).
  - The order, the build-up and the motivation within a page follow how the lectures develop the topic: the notes' order and the topic-list order. A curiosity-driven or textbook order never decides the structure.
  - Material that doesn't fit the lecture flow (e.g. the original video-based bands models) goes after the lecture content, under "Going further", or into the section where the lectures need it.
- **Duplication and cross-links.**
  - Don't duplicate material across pages. A short recap (a few lines plus at most one key equation) is welcome where a section depends on an earlier one. Mark it `.recap`, opening with `<b>Recap from <a>X.Y.Z Title</a>.</b>` linking to the full treatment.
  - Every forward or backward dependency has a link in both directions, e.g. "used in 2.6.2 →" and "← from 1.3.2", so reading through the site is smooth. A cross-page prerequisite goes in the card's `.needs` line as "← from X.Y.Z"; any other such line is a `p.fwd` (`.fwd` also works on an inline span). Both `.recap` and `.fwd` are styled in `site.css`; don't restyle them locally. Check with `node tools/links.js` (0 broken, 0 missing back-links).
  - Never re-derive at length what another page already teaches. Link to it instead.
- **Formulas must stand out.** Display equations use `.eq`, which is larger than body text (set in `site.css`). Don't shrink them, and don't put a central result inline when it deserves a panel. Every card has at least one `details.check` and ends with a `.takeaway`. Add a `.trap` where there is a common mistake.
- **Motivation.** Each topic-list section opens with a `.hook` ("Where you meet this.": a concrete, checked real-world payoff, warm and direct, no hype) and ends with a `.cannow` ("You can now …", naming the exam part or sheet problem it unlocks).
- Every page has a reading path (`.path`, with the legend) between the header and the Overview, listing the cards in order with a rough time each and where the models and guides fit.

**Correctness.**
- Every numeric claim (results, readouts, captions, "typical value" statements) is checked independently: a `node -e` computation, a second formula or limit, or a comparison with a Kittel table. Write how in the guide's *Sanity check* line, or in a one-line JS comment next to a model's numbers.
- Homework guides reproduce the sheet's given data exactly (check against the PDF, not the text dump: the dump drops Greek letters and exponents). Anything not on the sheet (material data, approximations, a reading of an ambiguous statement) goes in an `.assume` box with its source.
- Explain in your own words. Do not copy more than a sentence from Kittel, the notes, the sheets or the Miro transcriptions, and never link to `sources/` or the course PDFs (they are not published).

**Definition of done** (tick all before reporting):
- [ ] Served with `node tools/serve.js` and opened: no console errors or warnings from page code.
- [ ] Every control visibly changes its plot or readout.
- [ ] At 360 px and 400 px width: no horizontal page scroll, equations never scroll (long ones are written as aligned lines), and `CM.auditLayout()` returns [] at 360 px and 400 px, in light and dark.
- [ ] Readable in light and dark (nav "Dark/Light" button), plots re-themed.
- [ ] `CM.stress()` passes. Build the phone copy (`node tools/to-artifact.js . NN-slug.html build/cmd-NN.html`), then run `node tools/stress.js --pages NN --builds`. It runs `CM.stress()` and the readability checks in headless Chrome at 320, 360, 400, 768 and 1280 px, in light and dark. Pass means no "broken" items at any width or theme, and no "unreadable" items at 360 px or 400 px.
- [ ] Every numeric claim checked, with the method stated as above.
- [ ] Every topic-list subsection of the section has a Concepts entry.
- [ ] Interactive models are organised by topic-list number. Each model's eyebrow starts with the subsection number it serves, e.g. `2.1.1 · Boundary conditions`. Chapter 2 gets at least one model per subsection (the user's emphasis). Chapters 1 and 3 get one per section at minimum.
- [ ] Every sheet problem for the topic (see `PLAN.md`) has a guide. The exam angle is filled: the exam is mostly exercises with some theory, in the pattern of 2022, so include at least one exam-style exercise with a worked solution.
- [ ] Do not edit `index.html` or tick `PLAN.md`. Both happen after review.
- [ ] Testing in the browser pane: other agents share it, so open your own tab (`tabs_create`), pass its `tabId` on every call, and serve on your own port (`node tools/serve.js <port>`).
