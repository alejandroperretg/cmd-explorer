# Handoff: CMD Explorer

> **State at 2026-11-06 evening (latest, read this first):**
> - **Done, reviewed, committed:** pages 01–09, all marked ready.
> - **In final style:** 03, 04, 09. Restyle the others with `templates/RETROFIT.md`, two pages per agent: 01+02, 05+06, 07+08.
> - **May have stopped mid-run: the stress-test agent.** Its job:
>   - add `CM.stress()` to `assets/common.js`, plus `tools/stress.js`;
>   - write `audit/stress-report.md`;
>   - make a shared fix for inline MathML spilling in phone builds;
>   - stop intentional "undefined" pills from being flagged as errors.
>
>   Check `git status`. If its work is incomplete, finish it before the rollout.
> - **After the rollout:**
>   1. Run the stress test on all pages.
>   2. Republish the phone versions: bands https://claude.ai/artifact/Ph9bvTf6N3VvtzFfA8qDNY, elasticity https://claude.ai/artifact/R49kSsmzLKeZ5bq1Vhyvkq.
>   3. Run the coverage check against the frozen `audit/expectations.md`.
> - **Models still missing (PLAN 15):** 2.1.1, 2.1.2, 2.1.4 and 2.1.5 on page 07; 2.2.2 and 2.2.4 on page 08. Add them during the 07+08 restyle.
> - **Page 09 intuition models** (user clarification, 2026-11-07): they are relevant intuition for Bloch, NFE and conduction, just not in lecture order.
>   - They are being placed into 2.6.1 / 2.6.2 / 2.6.3 / Connecting ideas, with links to pages 07 and 08.
>   - Once 07 and 08 are restyled, add the reverse links on those pages (e.g. 2.1.6 → bands "E(k) with Fermi–Dirac filling", 2.2 → bands "Current in a wire").
> - **To tidy up after the restyle:**
>   - `.recap` is defined locally in page 09 (and possibly page 05). Move it into `site.css` and remove the local copies.
>   - Page 09 links to 07#sphere, 07#smear, 08#concepts, 08#m-fs and 08#m-rt. Switch these to the section ids once 07 and 08 have them, then add the reverse links on 07 and 08.
> - **Waiting:** pages 10–13 wait for lectures. GitHub comes last, and only with the user's OK.

> **2026-11-06 morning:** the original session resumed this work itself. The pedagogy and review agents were resumed there. A scheduled run that reads this should not redo items 1–2. Check `git log` first, and only take over if the original session has gone quiet.

The previous session ran out of usage on 2026-11-05 around 22:30. This file is the full state, so start here.

## Goal (set by the user)
"Make support material that spans the entirety of the syllabus and homeworks."

The course is Condensed Matter and Devices (V. Wagner, Constructor University, Fall 2026). The material is a private study site in `explorer/`. It has one page per topic, with interactive models, homework guides and exam prep.

## How to work
- **Coordinate; don't do the work yourself.** Use the `chief-of-staff` skill. Delegate building and reviewing to background subagents (`subagent_type: "claude"`, prompt starting with "First read `C:\Users\aleja\.claude\skills\chief-of-staff\library\<persona>.md` and adopt it as your role."). Run at most 3 agents at once. The user asked to keep usage low.
- **Run end to end without permission check-ins** (see the user's memory). Ask only about taste.
- **Rules:** `CONVENTIONS.md`, binding. Steps: `PLAN.md`, the first unchecked item is current. Decisions: `DECISIONS.md`. Sources per page: `sources/INDEX.md`.
- **Source ranking:** topic list → sheets → Miro → 2022 exam → the user's notes → Kittel. The notes are incomplete; Kittel is used for rigour.
- **Content inputs:** `../digest/*.md` (per-section digests with Miro sections) and `../digest/TEACHING-BRIEF.md` (exam guide, the student's past confusions).
- **Builder brief:** `templates/BRIEF.md`. Prompt each page builder with "follow BRIEF.md using NN = …" plus page-specific notes and a private scratch folder.
- **Browser testing:**
  - every agent uses its own tab (`tabs_create` + `tabId`) and its own port (`node tools/serve.js <port>`);
  - `requestAnimationFrame` doesn't run in the hidden pane, so use `CM.renderAll()`;
  - prefer text checks to screenshots.
  - **Stress test:** `node tools/stress.js --pages NN --builds --port <port>` (headless Chrome, temp profile, 320–1280 px × light/dark; exit 1 if anything is broken). Rebuild `build/cmd-NN.html` first. Findings: `audit/stress-report.md`; full JSON via `--out`; debug with `--eval "NN-build 360 dark <js>"`.
- **After a page passes review:**
  - `node tools/flip.js . NN …` switches its index card to ready and ticks `PLAN.md`;
  - then commit (real name; end the message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`);
  - nothing is ever pushed or published publicly.
- **Phone preview:**
  - `node tools/to-artifact.js . NN-slug.html build/cmd-NN.html` builds a self-contained copy, with math as MathML;
  - publish it as a *private* artifact (Artifact tool; load the artifact-design guidance via `action: "quickstart"` first).
  - The bands page is already published at https://claude.ai/artifact/Ph9bvTf6N3VvtzFfA8qDNY. Update it in place by passing that `url`, after a `read` of it. Page 04 is at https://claude.ai/artifact/R49kSsmzLKeZ5bq1Vhyvkq (still in the old scrolling-equation style).

## State at handoff
- **Done, reviewed and committed:** pages 01, 07, 08, 09. Their models are labelled by topic-list number.
- **In flight when the session stopped.** Check what landed in `pages/` and `git status`. Anything missing must be redone; agents don't survive the session.
  1. **Pedagogy design system** (user request). In `assets/site.css`:
     - `.eq` / `.eq.key` equation panels;
     - tags `.tag.hw` / `.tag.exam` / `.tag.deriv` / `.tag.lect` where an equation is introduced;
     - a reading-path box and numbered concept cards with a "Needs:" line;
     - `.takeaway`, `.trap`, `.check` (self-test `<details>`);
     - a legend.

     It should also be in `templates/topic.html` and as a "Pedagogy" rule in `CONVENTIONS.md`, then applied to `pages/09-bands.html` without touching the model code. If that's incomplete, finish it. Then rebuild and republish the bands artifact for the user to look at on their phone. The user asked for: "a clear order of reading things", equations "more visible and distinguishable from the text", highlighting "which equations are used for homework … or for exam, or which derivation is exam relevant", and "color coding and other pedagogy techniques".
  2. **Pages 02** (reciprocal lattice, §1.1.3/1.3, sheets 2 and 3.1–3.2), **05** (phonons, §1.6, sheet 6) and **06** (heat capacity, §1.7, sheet 7). These were being built in the old style.
     - **06 is built** (not yet reviewed or committed). The builder digitised the sheet 7.2 graph and found Θ_D ≈ 1800 K, about 20 % below 2250 K. It says the Θ_D presets and Ar 92 K come from text, not from Kittel Table 1. It links to `05-phonons.html`.
     - **02 is built** (not yet reviewed or committed). Unverified: Cu Kα₁ 154.06 pm, Po a = 334 pm and Si a = 543.0 pm (both from page 01), and the 12/√E rule. Judgement calls: sheet 2.2c's "Inverse Volumina" is read as V_BZ, and 2.3c shows both the non-relativistic and the relativistic λ. A dev server may still be running on port 8102; stop it.
     - **05 is built** (not yet reviewed or committed). Values read by eye or calibrated: Na ν_max ≈ 3.6 THz (from Kittel Fig. 11); Na d = 0.211 nm (from n); NaCl ω_T = 3.1e13 s⁻¹, with f = 11.1 N/m as a labelled 1D toy.
     - A review agent for 02/05/06 was started at about 22:45. If they aren't committed, rerun the review.
- **Next, in order:**
  1. Finish (1) and (2).
  2. One review pass for 02/05/06 (physics + code; Code Reviewer persona), then commit.
  3. Retrofit 01, 02, 05, 06, 07, 08 to the pedagogy system.
  4. Pages 03 (binding, sheets 3.3–4.3) and 04 (elasticity, sheet 5).
  5. PLAN item 15: models for every chapter-2 subsection. Gaps: 07 needs 2.1.2 wavefunctions, 2.1.4 total energy and 2.1.5 pressure.
- **Wait for lectures:** pages 10–13 (magnetism, dielectrics, semiconductors, p–n junctions). Lectures had reached §2.6.2. New notes arrive via GoodNotes auto-backup to Google Drive (`GoodNotes/` folder; see `../NOTES-PIPELINE.md` if it exists).
- **Style rollout (approved by the user on 2026-11-06):**
  - Follow `templates/RETROFIT.md`.
  - Page 04 was started first.
  - Then pages 01+02, 05+06 and 07+08, two pages per agent, after the stress-test agent finishes (it edits `assets/common.js` and may fix model bugs on 01, 02 and 05–09).
  - Then re-run `CM.stress()` / `tools/stress.js` on every page before republishing any phone version.
- **Coverage audit** (user request; PLAN item 16):
  - The expectation list `audit/expectations.md` was started on 2026-11-06. It is built from the topic list, the notes and the sheets, without looking at the pages.
  - Once all the pages exist, a *separate* agent checks the pages against it and writes `audit/report.md`, with a pass, partial or missing verdict and evidence for each item.
- **Last:** page 14, exam prep.
- **After everything is done** (user's idea, 2026-11-06): put the site on GitHub (account `alejandroperretg`).
  - Before any push, ask the user whether the repo should be public or private.
  - Check that no course material is included (`sources/` is gitignored), and that nothing is copied verbatim from the notes, sheets or Kittel.
  - Never push without that explicit OK.

## Linked material outside explorer/
- `../STUDY-PLAN.md`: the user's study plan.
- `../drill/`: the formula drill.
- `../miro/notes/`: the Miro board transcriptions.
