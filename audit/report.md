# Coverage audit report (PLAN 16b, 16c)

**Input.** `audit/expectations.md`: 190 items, frozen and unedited. Checked against `pages/01`–`09` and `index.html` by reading the HTML source (stripped to text with section ids). Date: 2026-11-09.

**Method and limits.**
- Each item was judged against its pass criterion, not its topic.
- Every "(own calc)" number was recomputed in node, and all of them match the pages.
- `tools/links.js` reports 0 broken links and 0 missing back-links.
- No page has a static diagram (no `<svg>` or `<img>`). Schematic items pass only where an interactive model shows that geometry, which explains most of the detail-level gaps.
- Borderline PASS verdicts are marked "(weak)" in the appendix.

## 1. Summary

**Overall: 157 PASS, 13 PARTIAL, 5 MISSING, 15 DEFERRED (190 items).**
- Core: 103 PASS, 2 PARTIAL, **0 MISSING**, 10 DEFERRED.
- Detail: 54 PASS, 11 PARTIAL, 5 MISSING, 5 DEFERRED.
- Every 2022 exam item for Q1–Q4 passes. Q5 and Q6 are deferred.

P = PASS, PA = PARTIAL, M = MISSING, D = DEFERRED.

| Section | Page | Core P | Core PA | Core M | Core D | Det P | Det PA | Det M | Det D |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 (1.1.1, 1.1.2, 1.1.5) | 01 | 23 | 1 | 0 | 0 | 5 | 3 | 0 | 0 |
| 1.1.3 Direct imaging | 02 | 6 | 1 | 0 | 0 | 1 | 0 | 2 | 0 |
| 1.3 Diffraction, reciprocal lattice | 02 | 11 | 0 | 0 | 0 | 5 | 5 | 2 | 0 |
| 1.4 Binding | 03 | 10 | 0 | 0 | 0 | 2 | 1 | 0 | 0 |
| 1.5 Elasticity | 04 | 12 | 0 | 0 | 0 | 4 | 0 | 0 | 0 |
| 1.6 Lattice vibration | 05 (+06) | 5 | 0 | 0 | 0 | 9 | 2 | 0 | 0 |
| 1.7 Thermal | 06 | 7 | 0 | 0 | 0 | 7 | 0 | 1 | 0 |
| 2.1 Free electrons | 07 | 13 | 0 | 0 | 0 | 3 | 0 | 0 | 0 |
| 2.2 Boltzmann, conductivity | 08 | 6 | 0 | 0 | 0 | 4 | 0 | 0 | 0 |
| 2.4 Metals | 08 | 0 | 0 | 0 | 0 | 7 | 0 | 0 | 0 |
| 2.5 Wiedemann–Franz | 08 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| 2.6 Bands | 09 | 8 | 0 | 0 | 0 | 5 | 0 | 0 | 0 |
| 2.7.7 Thermoelectric | 08 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2.8 Magnetic | (10) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 2.9 Dielectrics | (11) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 3.1 Semiconductors (Exam Q5) | (12) | 0 | 0 | 0 | 6 | 0 | 0 | 0 | 3 |
| 3.2.2 p–n junctions (Exam Q6) | (13) | 0 | 0 | 0 | 4 | 0 | 0 | 0 | 0 |
| **Total** | | **103** | **2** | **0** | **10** | **54** | **11** | **5** | **5** |

**Deferred items** (their pages, 10–13, are not built yet):
- 2.8.1-01, 2.9-01
- 3.1.1-01, 3.1.2-01, 3.1.3-01, 3.1.4-01, 3.1.5-01/-02, 3.1.6-01/-02, 3.1.7-01
- 3.2.2-01 to -04

## 2. PARTIAL and MISSING items, with fixes

### Core
- **1.1.3-05 (Sheet 2.3a): PARTIAL.**
  - Already on the page: 02 #c-imaging has I ∝ e^{−2κd} and the feedback loop, and Model 1 plots I(d).
  - Missing: a figure of the tip and the surface.
  - Fix: add a schematic to 02 #c-imaging showing the tip apex over the surface atoms, the gap d, the bias, and the piezo feedback loop. Share the figure with the TEM column item (1.1.3-03).
- **1.1.5-03 (Sheet 1.2b): PARTIAL.**
  - Already on the page: a₁, a₂, c/a = 1.633 and the basis.
  - Missing: a₃ is never written out as a vector, and there is no hexagonal-prism view (Model 3 shows only a 2D cut).
  - Fix: in 01 #c-struct, write a₃ = (0, 0, √(8/3)a) and add an hcp prism view, or an "hcp" option in Model 1.

### Detail
- **1.1.1-01: PARTIAL.** In 01 #c-lattice, add one sentence: crystal faces meet at fixed angles because they are lattice planes, and cleavage and anisotropy follow from that.
- **1.1.1-03: PARTIAL.** In 01 #c-cell, add a 2D figure showing that two different pairs of primitive vectors (a short pair and an oblique pair) enclose the same cell area.
- **1.1.2-03: PARTIAL.** In 01 #c-rot, add a table of the allowed rotations Cₙ with their angles: C₁ 360°, C₂ 180°, C₃ 120°, C₄ 90°, C₆ 60°.
- **1.1.3-03: MISSING.** In 02 #c-imaging, add a schematic of the TEM column: gun → condenser → thin sample → objective → projector → screen.
- **1.1.3-06: MISSING.** In 02 #c-imaging, add one sentence on what TEM and STM visualise: periodic structure, defects, nanocrystals.
- **1.3.1-02: PARTIAL.** In 02 #c-bragg, add the figure of two lattice planes with the reflected rays, θ and the d sin θ path segments.
- **1.3.1-03: MISSING.** In 02 #c-bragg, add a short note on the board's CaF₂ θ–θ example: (440) is the second order of (220). Mark the angles as unverified. Low priority.
- **1.3.2-01: PARTIAL.** In 02 #c-recip, before eq. (5), add the 1D Fourier series f(x) = Σ f_k e^{ikx} with k = m·2π/a.
- **1.3.2-08: PARTIAL.** In 02 #c-bz, add the square lattice with the first and second Brillouin zones, or a "show zone 2" option in Model 2.
- **1.3.3-01: MISSING.** In 02 #c-laue, add a two-line preamble before eq. (10): the incoming EM plane wave, k = 2π/λ, A·k = 0.
- **1.3.3-02: PARTIAL.** In 02 #c-laue, add a scattering-geometry sketch: source, sample element at r, detector at r₁, with k and k′.
- **1.3.3-03: PARTIAL.** In 02 #c-laue, add one sentence explaining why the scattered amplitude is proportional to n(r): the incoming field drives each electron, which re-radiates as a dipole at the same frequency (Thomson scattering).
- **1.4.5-02: PARTIAL.** In 03 #c-hbond, add a sketch of the F⁻·H⁺·F⁻ bridge (Kittel Fig. 13).
- **1.6.1-06: PARTIAL.** In 05 #c-chain, add the phase velocity at the zone boundary: ω/k = (2/π)v_s there, while v_g = 0.
- **1.6.4-02: PARTIAL.** In 06 #c-dosint, add one plot comparing the Debye, Einstein and real (Al, schematic) densities of states.
- **1.7.1.3-02: MISSING.** In 06 #c-debye, plot a real acoustic branch against the Debye straight line ω = ck up to k_D. The dispersion code from page 05 can be reused.

## 3. Flow findings (16c)

**`tools/links.js`:**
- 0 broken links and 0 missing back-links.
- 1 excused one-way link (04 → 09).
- 21 bare cross-page links with no `#anchor`.
- `14-exam-prep.html` is linked from the nav but not built yet.

**By page:**
- **01: OK.** It follows the notes' order, with the index system at the end of 1.1.2 as on notes p5.
- **02: order OK.**
  - The worked copper exercise (a)–(c) repeats the copper parts of sheet 2.2(b)–(c). Trim it to (d)–(e), or use a different metal.
  - Five bare links.
- **03: OK.** The notes have no lecture on binding (p17 is just a "?"), so the page follows Kittel ch. 3, which matches the topic list.
- **04: OK.** The Young's modulus card, which sheet 5.1 needs but the notes don't cover, comes at the end of the path. That's acceptable.
- **05: OK.**
  - 1.6.4 (density of states) comes before 1.6.5–1.6.6, in topic-list order, although the lecture introduces it on p38. The page says so.
  - Point the four bare links to page 06 at 06 #c-dosint, #c-debye and #c-einstein.
- **06: one card is out of place.**
  - The "per volume / per crystal / per mole" units card sits between (★) and the high-T limit, which breaks the derivation. Move it to the end of 1.7.1, or make it collapsible.
  - The link to page 05 should target #c-dos.
- **07: OK.** 2.1.2 comes before 2.1.1, as in the notes.
- **08: OK.** 2.7.7 is last and marked as not lectured.
- **09: out of lecture order inside 2.6.2.**
  - The not-yet-lectured cards "Empty lattice" and "Standing waves" sit before the lectured central equation.
  - Suggested order: Bloch → central equation → empty lattice → standing waves → gap.
  - Model 6, current in a wire, overlaps the transport material on page 08. It is linked and short, so it can stay.

## 4. Top 10 fixes by exam value

Both core gaps are drilled by sheets, and neither is in the 2022 exam.

1. Page 02 #c-imaging: STM and TEM schematic, plus a sentence on what they show (1.1.3-05, -03, -06).
2. Page 01 #c-struct: write out a₃ and add an hcp prism view (1.1.5-03).
3. Page 02 #c-bragg: two-plane Bragg figure (1.3.1-02).
4. Page 02 #c-bz: square lattice with zones 1 and 2 (1.3.2-08).
5. Page 09: move the lectured central equation before the empty-lattice and standing-wave cards.
6. Page 06 #c-debye: real dispersion vs the Debye line (1.7.1.3-02).
7. Page 06 #c-dosint: Debye, Einstein and real DOS on one plot (1.6.4-02).
8. Page 02 #c-laue: EM-wave and re-radiation preamble, plus the scattering geometry (1.3.3-01, -02, -03).
9. Two one-line additions: the 1D Fourier series on page 02, and the zone-boundary phase velocity on page 05 (1.3.2-01, 1.6.1-06).
10. Add anchors to the 21 bare links, then the small items 1.1.2-03, 1.1.1-01/-03, 1.4.5-02 and 1.3.1-03.

## Appendix: PASS evidence

The per-item verdicts and evidence (page and anchor for each item) are in the audit agent's working file, `status.tsv`, in the session scratchpad. Weak passes:
- 1.1.3-01 (scattered across the page)
- 1.3.3-05
- 1.7.1.2-02
- 2.1.6-03 (uses Cu instead of Au, and mJ instead of cal)
- 2.4.1-01 (no 1/τ ∝ Σ v_F)
