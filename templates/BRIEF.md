# Page-builder brief (shared)

You are building one topic page of this study site. Your page number NN is given in your prompt.

Read these first, in this order:
1. `CONVENTIONS.md`. Its rules and definition of done are binding, including the source ranking and the rule that models are labelled by topic-list number.
2. `PLAN.md`, item NN. Its "Done when" line is your acceptance test.
3. `templates/topic.html`. Copy it to start your page. `pages/07-free-electron-gas.html` and `pages/01-crystal-structure.html` are reviewed examples you can copy patterns from.
4. `sources/INDEX.md`, row NN. It lists the sheet problems, Kittel chapter, Miro boards and exam questions for your page.
5. `../digest/<section>.md`, including its Miro section, and `../digest/TEACHING-BRIEF.md` for your section and §4. Section 4 covers how this student learns.

PDFs (`problemsNN.pdf`, `kittel.pdf`, the exam) are in `..`. Check every number the sheet gives against the PDF itself, not against the text dumps.

Rules for this build:
- Workspace:
  - Serve on port 81NN: `node tools/serve.js 81NN`.
  - Open your own browser tab with `tabs_create` and pass its `tabId` on every call.
  - `requestAnimationFrame` doesn't run in the hidden pane, so test with `CM.renderAll()`.
  - Check with `get_page_text` and the console. Take at most one screenshot per model.
- Your scratch folder is given in your prompt.
- There is no Python on PATH. Use node, or `uv run python`.
- Edit only `pages/NN-<slug>.html`. Don't commit.
- Keep usage low:
  - Don't re-read sources you've already read.
  - Don't extract Kittel images unless a number depends on them.
- Link to existing pages instead of re-deriving their content:
  - 01: lattices and primitive vectors.
  - 07: Fermi gas.
  - 08: transport.
  - 09: Bloch's theorem and bands.

Report in at most 8 lines:
- the definition-of-done checklist;
- the models you built, by topic number;
- any numbers you couldn't verify;
- anything you need added to `assets/`.
