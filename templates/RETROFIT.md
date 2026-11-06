# Style retrofit brief (shared)

Bring an existing page up to the current Pedagogy rules in `CONVENTIONS.md`. The reference pages are `pages/09-bands.html` and `pages/03-crystal-binding.html`: copy their patterns.

The content is already reviewed. Keep the physics, numbers, guides and model code as they are. Only change structure, wording around the content, and markup.

For each page:
1. **Sections by topic-list number.** Regroup the Concepts into the topic-list subsections for this page (see `sources/INDEX.md`).
   - Each section has a heading `<span class="step">X.Y.Z</span> Title`.
   - Each section opens with a `.hook` ("Where you meet this": one concrete real-world payoff), then *What this covers* and *Why it matters*.
   - Each section ends with `.cannow` ("You can now…", naming the sheet problem or exam part it unlocks).
   - Extra cards sit inside the nearest subsection, labelled `X.Y.Z · Name`.
   - No plain 1, 2, 3 numbering anywhere.
2. **Reading path and legend.** Add a `.path` with `<li data-sec="X.Y.Z">` entries and the legend.
   - The legend shows the page's real tags, not the template's example.
   - `.needs` links point to section numbers.
3. **Equations.**
   - Put every display equation in an `.eq` panel; use `.eq.key` for the few must-know results.
   - Break long equations with `\begin{aligned}`, or split them into two panels, so that no equation needs horizontal scrolling at 360 px.
   - Promote central results that are currently inline.
4. **Usage tags** where an equation or derivation is introduced:
   - `.tag.hw` (sheet problem, linked to its guide);
   - `.tag.exam` (2022 exam part);
   - `.tag.deriv` (derivation the exam needs);
   - `.tag.lect` (not yet lectured).

   The tags must match what the sheet or exam actually asks.
5. **Study blocks.** Every card ends with a `.takeaway`. Every card has at least one `details.check` self-test. Add a `.trap` where students commonly go wrong.

Verify before reporting:
- `CM.auditLayout()` returns `[]` at 360 and 400 px, in light and dark.
- If `CM.stress()` exists in `assets/common.js`, it reports no broken items.
- There are no console errors from page code, and every control still works (test with `CM.renderAll()`).
- Rebuild the phone version with `node tools/to-artifact.js . NN-slug.html build/cmd-NN.html` and run `CM.auditLayout()` on it at 360 px.

Workspace:
- Serve on your own port: `node tools/serve.js <port>`.
- The browser pane has a tab limit. Check `tabs_context`, reuse or close tabs, or use headless Chrome.
- Stop servers and browsers when done.
- Take at most 2 screenshots per page.

Rules:
- Edit only your assigned pages. Don't edit `assets/`, `index.html` or `PLAN.md`, and don't commit.
- If you need a shared style, say so in your report.

Report in at most 6 lines per page:
- the sections created;
- the audit and stress results;
- anything you couldn't fix.
