# Stress and readability report

Run on 2026-11-07 with `node tools/stress.js --builds` (pages 01–09 and the phone builds `build/cmd-01.html` … `cmd-09.html`; 320, 360, 400, 768 and 1280 px; light and dark; 180 runs; headless Chrome with a temporary profile, deleted afterwards). Exit code 0: **nothing is broken on any page or build.** Raw results: rerun with `--out file.json`.

**How to read this.**
- Severity:
  - *broken* means an exception, a console error, NaN, Infinity or an empty value in an `<output>` or numeric readout, an empty or NaN Plotly trace, a dead control, or a math error;
  - *unreadable* means overflow (`CM.auditLayout()`), text or labels too small, a tap target too small, low contrast, overlap, a cut-off caption, a plot outside 280 px wide to viewport height, inline math spilling, or horizontal page scroll;
  - *cosmetic* is everything else: line length, `not-restored`, `invalid-state`, `math-scroll` and load warnings.
- Thresholds: body text 15 px, labels and captions 12 px, tap targets 40 px (phones, below 768 px); contrast 4.5:1 in both themes (checked at 360 px); about 80 characters per line (flagged above 85).
- Counts are unique items. `At:` lists width plus theme (`360d` = 360 px, dark). Selectors are exact `CM.cssPath` paths.
- To reproduce, open the page at that width and theme and follow `Repro` (model → control → step). For layout items, run `CM.auditLayout()` in the console.
- To debug one page: `node tools/stress.js --pages NN --builds --eval "NN-build 360 dark <js>"`.

**Definition-of-done status** (no broken at any width; no unreadable at 360 or 400 px): **03, 04 and 09 pass**, both the pages and the builds (rechecked after the last fix). The pages awaiting restyle (01, 02, 05–08) have no broken items, but each has display equations that overflow at 360/400 px. They are listed below and **not fixed**, as briefed: the restyle rewrites them as aligned lines.

## Summary (unique items: broken / unreadable / cosmetic)

| Page | Page itself | Phone build |
|---|---|---|
| 01 | 0 / 7 / 21 | 0 / 8 / 24 |
| 02 | 0 / 24 / 39 | 0 / 27 / 38 |
| 03 | 0 / 9 / 44 | 0 / 15 / 39 |
| 04 | 0 / 12 / 32 | 0 / 17 / 33 |
| 05 | 0 / 20 / 29 | 0 / 25 / 27 |
| 06 | 0 / 23 / 22 | 0 / 24 / 21 |
| 07 | 0 / 18 / 23 | 0 / 21 / 24 |
| 08 | 0 / 20 / 28 | 0 / 21 / 22 |
| 09 | 0 / 22 / 42 | 0 / 29 / 44 |

On 03, 04 and 09 the unreadable items remaining are all at 320 px or at 768/1280 px. Most are display equations shrunk by `fitEq` to 17.4–17.9 px (under the 18 px floor) or a few px wider than their panel at 320 px, plus the 09 `#p2b` side panel described below. The per-page lists come from the full run, just before two last fixes on 09 (the fcc equation and 12 px annotations). After those fixes, a recheck of 03, 04 and 09 at 360/400 px found no unreadable items. Line length is flagged only at 768/1280 px, where prose runs about 95 characters wide.

## Fixed in this pass
- **Harness** (`assets/common.js` `CM.stress()`, `tools/stress.js`, `tools/readability.js`):
  - The equation-size check measured KaTeX's hidden screen-reader `<math>` copy (13.7 px) instead of the visible rendering (about 22 px). This gave false `eq-small` hits on every KaTeX page.
  - "not-restored" signatures depended on key order, and Plotly re-adds layout keys in a different order. Keys are now sorted.
  - `favicon.ico` 404 was reported as broken; the server now answers 204.
  - Subscripts and superscripts (also nested) are judged at the size of the text they belong to.
  - Links inside a sentence are exempt from the tap-target rule (the WCAG 2.5.8 inline exception).
  - `.step` badges count as labels.
  - `--eval` added for debugging; `NN-build` now selects a build in `--shot`/`--eval`.
  - `CM.auditLayout()` accepts a deliberate negative-margin bleed.
- **(a) Intentional invalid states.** Readouts are checked in `<output>`, `dl.readout dd` and `.tnum` only. Pills and prose may say "undefined". `data-state="invalid"` on a model or element skips its readout and plot checks and logs a cosmetic `invalid-state`. Page 04 Model 2 now marks `#m2-p3`/`#m2-pl` invalid while C is not positive definite: its 4 false "plot-empty" items are gone, and the pill "E is undefined" is not flagged.
- **(b) Inline MathML spill in the phone builds.**
  - `CM.math` splits each inline formula at its top-level relations into separate `<math>` pieces with a `<wbr>` between them.
  - A piece still wider than its line gets `.katex.m-scroll` (from `CM.fitEq`, re-checked on resize) and scrolls inside its own span, instead of spilling out of the text.
  - The stress run checks `math-spill` (unreadable), `math-scroll` (cosmetic) and `h-scroll`.
  - Page 03's build (6 spills, 147 px horizontal scroll at 360 px before) now has 0 spills and no horizontal scroll at any width.
- **Model bug (page 03 Model 2):** with CsCl at region size 1 R the "Evjen cubes, Cs on faces" readout showed `NaN`, because the first such cube is 2/√3 ≈ 1.15 R. It now shows "— (smallest is 1.15 R)". Repro before: `#model2`, select CsCl, set `#m2-L` to 1.
- **Shared readability (`assets/site.css`, phones ≤ 640 px; `assets/common.js`):**
  - body text is 15 px (cards, guides, rails, boxes, sources, reading path);
  - labels, tags and badges are at least 12 px; captions and keys are 13 px;
  - buttons, segmented radios and sliders are 40 px tap targets; reading-path links get a 40 px tap area without changing the row height;
  - long tags and legend entries wrap;
  - below 360 px, plots bleed into the bench padding so they stay at least 280 px wide;
  - Plotly tick and 3D-axis fonts went from 10–11 px to 12 px.

  These shared rules also apply to 01, 02 and 05–08; nothing page-specific was changed there.
- **Final-style pages:**
  - 03: `#m4-p` log axis shows decades only (Plotly drew minor labels at 9 px).
  - 04: `#m3-pm` labels and annotations at 12 px; Sheet 5.1 (i) and (ii) result equations restacked to fit the build at 360 px.
  - 09: plot annotations at 12 px; the fcc s-band equation written with c_i = cos(k_i a/2) on three lines to fit at 360 px.

  All rewrites are algebraically identical to the originals.
- Rebuilt `build/cmd-01.html` … `cmd-09.html`; deleted the stale `build/cmd-04-elasticity.html`.

## Top open issues
1. **Display equations overflow on 01, 02 and 05–08** (left for the restyle). They overflow by 50–400 px at 360/400 px and often at 768/1280 px too.
   - The builds also scroll horizontally at 768 px: 01 by 73 px, 02 by 155, 05 by 101, 06 by 146, 07 by 86, 08 by 167.
   - The worst are 02 `#concepts` article 1 and 3 (about 370 px), 06 article 7 (about 400 px), and the 02 Sheet 2.2 and 3.2 guide steps (310–375 px).
2. **Small plot text on pages awaiting restyle:**
   - 9 px log-axis minor labels on 06 `#cm-p2`, 07 `#co-p1` and 08 `#rt-p1` (fix: `dtick: 1`, as on 03 `#m4-p`);
   - 11 px labels on 02 `#m5-p`.

   05 `#al-cv`/`#di-cv` canvases spill 46 px out of `.chaincv` at 320/360 px.
3. **At 320 px and wide screens on the final-style pages** (outside the definition of done):
   - several display equations sit at 17.4–17.9 px after `fitEq` and overflow by 2–36 px in the builds;
   - 09 `#p2b` (the DOS side panel of the 2fr/1fr pair) is 219 px wide at 768/1280 px, by design;
   - "not-restored" remains on animated models (09 `#kwave`, `#wire`): an animation clock, not a bug.

## Per page
### 01

Broken 0 · unreadable 7 (2 at 360/400 px) · cosmetic 21

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(4) > span > span > span`: content wider than box by 191px: "2cos⁡φ∈Z ⇒ φ∈{0∘,60∘,90∘,120∘,180∘} (and their n". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(2) > span > span`: content wider than box by 71px: "bcc: a2(x^+y^−z^), a2(−x^+y^+z^), a2(x^−y^+z^)\tex". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#concepts > div > article:nth-of-type(3) > span > span > span`: content wider than box by 36px: "M=cos⁡φ 1+sin⁡φ [n^]×+(1−cos⁡φ) n^n^T.M = \cos\var". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure`: content wider than box by 14px: "How to read: axes are Cartesian x, y, z in units o". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure`: content wider than box by 14px: "How to read: axes are x, y, z (arbitrary units; th". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "00.5100.20.40.60.81x (a), face (001)y (a) ". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "scbccfcchcpdiamond00.20.40.60.8Packing fraction ". At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#model2`: #model2: #m2-cut differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 400d 400l 768d 768l 1280d 1280l.
- `line-length`: 19 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 02

Broken 0 · unreadable 24 (13 at 360/400 px) · cosmetic 39

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(1) > span > span`: content wider than box by 373px: "λ=hp,p=2meeU(non-relativistic),p=2meeU(1+eU2mec2)(". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(1) > span > span`: content wider than box by 320px: "n(r)=∑GnG eiG⋅r,eiG⋅R=1 ⇔ G⋅R=2π⋅integer for every". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(2) > span > span`: content wider than box by 367px: "b1=2πa2×a3a1⋅(a2×a3),b2=2πa3×a1a1⋅(a2×a3),b3=2πa1×". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(2) > span > span`: content wider than box by 252px: "k′=k+G ⇒ (k+G)2=k2 ⇒ 2k⋅G+G2=0 → G→−G 2k⋅G=G2.\ma". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(1) > span > span`: content wider than box by 253px: "SG=∑jfj e−iG⋅rj=∑jfj e−i2π(v1xj+v2yj+v3zj),rj=xja1". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(2) > span > span`: content wider than box by 220px: "fj=∫nj(ρ) e−iG⋅ρ dV=∫0∞4πρ2 nj(ρ) sin⁡GρGρ dρ(sphe". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(1) > span > span`: content wider than box by 73px: "F=∫n(r) e−iΔk⋅r dV=∑GnG∫ei(G−Δk)⋅r dV.F=\int n(\ma". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#hw-2-1 > details > ol > li:nth-of-type(2) > span:nth-of-type(5) > span > span`: content wider than box by 291px: "(a2×a3)⋅(b2×b3)=(a2⋅b2)(a3⋅b3)−(a2⋅b3)(a3⋅b2)=(2π)". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-2-2 > details > ol > li:nth-of-type(2) > span:nth-of-type(6) > span > span`: content wider than box by 312px: "b1=2πa(0,1,1),b2=2πa(1,0,1),b3=2πa(1,1,0),2πa=2.17". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-2-2 > details > ol > li:nth-of-type(4) > span:nth-of-type(6) > span > span`: content wider than box by 349px: "b1=2πa(−1,1,1),b2=2πa(1,−1,1),b3=2πa(1,1,−1),2πa=1". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-2-3 > details > ol > li:nth-of-type(2) > span:nth-of-type(3) > span > span`: content wider than box by 263px: "κ=2⋅9.109×10−31⋅4.81×10−191.0546×10−34 m−1=8.87×10". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-3-1 > details > ol > li:nth-of-type(2) > span:nth-of-type(2) > span > span`: content wider than box by 220px: "S=f [1+e−iπ(ν2+ν3)+e−iπ(ν1+ν3)+e−iπ(ν1+ν2)] [1+e−i". At: 320d 320l 360d 360l 400d 400l.
- `font` `#m5-p`: plot text at 11px (min 12px), e.g. "111". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0.5110​−2​110​2​10​4​Tip–sample gap d (nm)Current ". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "010020030040024681012Accelerating voltage U (kV)Wa". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure`: content wider than box by 14px: "−4−2024−6−4−20246k_x (2π/a)k_y (2π/a) How ". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: Cartesian x, y, z in Å. Blue dots are". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "How to read: Cartesian kx, ky, kz in Å⁻¹. Copper d". At: 320d 320l.
- `layout` `#model4 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "012300.20.40.60.81q (2π/a)Intensity / maximum ". At: 320d 320l.
- `layout` `#model4 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−505−10−50510Re AIm A How to read: the com". At: 320d 320l.
- `layout` `#model5 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "11122031140033142251133344053105010015000.20.40.60". At: 320d 320l.
- `layout` `#model6 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0123400.20.40.60.81r (Å)4πr² n(r) (Å⁻¹) Ho". At: 320d 320l.
- `layout` `#model6 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "051000.20.40.60.81Scattering vector K (Å⁻¹)Form fa". At: 320d 320l.
- `layout` `#hw-2-1 > details > ol > li:nth-of-type(1) > span:nth-of-type(3) > span > span`: content wider than box by 41px: "b1⋅(b2×b3)=2πV (a2×a3)⋅(b2×b3).\mathbf b_1\cdot(\m". At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#model2`: #model2: #m2-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#model1`: #model1: #m1-a, #m1-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model1: - → restore defaults. At: 320d 320l 360d 360l.
- `not-restored` `#model3`: #model3: #m3-r, #m3-k differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model3: - → restore defaults. At: 320d 320l 360d 360l.
- `not-restored` `#model4`: #model4: #m4-a, #m4-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model4: - → restore defaults. At: 320d 320l 360d 360l.
- `not-restored` `#model5`: #model5: #m5-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model5: - → restore defaults. At: 320d 320l 360d 360l.
- `not-restored` `#model4`: #model4: #m4-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model4: - → restore defaults. At: 400d 400l 768d 768l.
- `not-restored` `#model6`: #model6: #m6-n, #m6-f differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model6: - → restore defaults. At: 320d 320l 360l.
- `not-restored` `#model6`: #model6: #m6-n differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model6: - → restore defaults. At: 360d.
- `line-length`: 30 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 03

Broken 0 · unreadable 9 (0 at 360/400 px) · cosmetic 44

**Unreadable**

- `layout` `#c-vdw > div:nth-of-type(2) > span:nth-of-type(1) > span > span`: content wider than box by 6px: "ϕ(r)=4ε[(σr)12−(σr)6].\phi(r)=4\varepsilon\left[\B". At: 320d 320l.
- `layout` `#c-ionic-eq > div:nth-of-type(2) > span:nth-of-type(1) > span > span`: content wider than box by 6px: "U(R0)=−αq24πε0R0(1−1n).U(R_0)=-\frac{\alpha q^2}{4". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "11.522.5−1−0.500.511.5Distance r (σ)Pair energy φ/". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "3.544.55−100−50050Nearest-neighbour distance R (Å)". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "05101511.522.5Region size (units of R)Partial sum ". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−4−2024−4−2024x (R)y (R) How to read: the ". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0.20.30.40.50.6−20−1001020Ion spacing R (nm)Energy". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "Ionise Ba (I₁ + I₂)O + e⁻ (A₁)O⁻ + e⁻ (A₂ = −9.0)M". At: 320d 320l.
- `layout` `#model4 > div:nth-of-type(2) > figure`: content wider than box by 14px: "0510150.010.1110Size of the region Δx (Bohr radii ". At: 320d 320l.

**Cosmetic**

- `not-restored` `#model2`: #model2: #m2-pb differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#model1`: #model1: #m1-pa, #m1-pb differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model1: - → restore defaults. At: 320d 320l.
- `not-restored` `#model2`: #model2: #m2-pa, #m2-pb differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 320d 320l.
- `not-restored` `#model3`: #model3: #m3-pa, #m3-pb differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model3: - → restore defaults. At: 320d 320l.
- `not-restored` `#model4`: #model4: #m4-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model4: - → restore defaults. At: 320d 320l.
- `line-length`: 39 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 04

Broken 0 · unreadable 12 (0 at 360/400 px) · cosmetic 32

**Unreadable**

- `layout` `#c-cubic > div:nth-of-type(3) > span:nth-of-type(1) > span > span`: content wider than box by 19px: "C11−C12=1S11−S12,C11+2C12=1S11+2S12,C44=1S44;S11=C". At: 320d 320l 768d 768l.
- `layout` `#c-young > div:nth-of-type(1) > span:nth-of-type(1) > span > span`: content wider than box by 2px: "E[100]=1S11=DC11+C12,ν[100]=−S12S11=C12C11+C12.\be". At: 320d 320l.
- `layout` `#c-young > div:nth-of-type(4) > span:nth-of-type(1) > span > span`: content wider than box by 2px: "A=2C44C11−C12=2(S11−S12)S44.A=\frac{2C_{44}}{C_{11". At: 320d 320l.
- `layout` `#strain > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: the dashed grey cube is the undeforme". At: 320d 320l.
- `layout` `#strain > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "1 xx2 yy3 zz4 yz5 zx6 xy−505−10−50510Voigt compone". At: 320d 320l.
- `layout` `#young > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: the distance from the centre to the s". At: 320d 320l.
- `layout` `#young > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "[100][110][111][001]050100150200DirectionYoung's m". At: 320d 320l.
- `layout` `#stable > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "WTaCuAgAuAlKPbNiPdDiamondNaLiGeSiGaSbInSbMgONaCl−0". At: 320d 320l.
- `layout` `#stable > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−1−0.500.51−0.500.51Strain amplitude t along the e". At: 320d 320l.
- `eq-small` `#c-strain > div:nth-of-type(1)`: display equation at 17.8px (min 18px, larger than 15px body text). At: 320d 320l.
- `eq-small` `#c-young > div:nth-of-type(3)`: display equation at 17.9px (min 18px, larger than 15px body text). At: 320d 320l.
- `eq-small` `#c-young > div:nth-of-type(4)`: display equation at 17.4px (min 18px, larger than 15px body text). At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `invalid-state` `#m2-c11`: #young is marked data-state="invalid"; checks skipped inside it. Repro: #young: #m2-c11 → set to min (0.5). At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `invalid-state` `#m2-c12`: #young is marked data-state="invalid"; checks skipped inside it. Repro: #young: #m2-c12 → set to max (2). At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#strain`: #strain: #m1-p3, #m1-pb differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #strain: - → restore defaults. At: 320d 320l 360l.
- `not-restored` `#young`: #young: #m2-p3, #m2-pl differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #young: - → restore defaults. At: 320d 320l 360l.
- `not-restored` `#stable`: #stable: #m3-pm, #m3-pu differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #stable: - → restore defaults. At: 320d 320l 360l.
- `line-length`: 26 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 05

Broken 0 · unreadable 20 (8 at 360/400 px) · cosmetic 29

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(1) > span > span`: content wider than box by 202px: "U=∑j12f (uj−uj+1)2,mu¨j=−∂U∂uj=f (uj+1+uj−1−2uj).U". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(1) > span > span`: content wider than box by 151px: "m1u¨j=f (vj+vj−1−2uj),m2v¨j=f (uj+1+uj−2vj).m_1\dd". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(4) > span > span`: content wider than box by 171px: "D‾=(2fm1−f(1+e−ika)m1m2−f(1+eika)m1m22fm2),det⁡(D‾". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span > span > span`: content wider than box by 143px: "ω±2(k)=f(1m1+1m2)±f(1m1+1m2)2−4sin⁡2(ka/2)m1m2.\om". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(3) > span > span`: content wider than box by 138px: "g(ω)=2πa1ωm2−ω2(0≤ω<ωm),∫0ωmg dω=1a.g(\omega)=\fra". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(7) > span > span > span`: content wider than box by 246px: "Ek,s=ℏωs(k)(nk,s+12),E=∑k,sℏωs(k)(nk,s+12),n=0,1,2". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(3) > span > span`: content wider than box by 85px: "m1m2 ω4−2f(m1+m2) ω2+2f2(1−cos⁡ka)=0,m_1m_2\,\omeg". At: 320d 320l 360d 360l 400d 400l 768d 768l.
- `layout` `#concepts > div > article:nth-of-type(8) > span > span > span`: content wider than box by 52px: "k+G=k′±K,ℏ2k22Mn=ℏ2k′22Mn±ℏω(K).\mathbf k+\mathbf ". At: 320d 320l 360d 360l.
- `plot-size` `#di-p2`: plot is 219px wide (min 280px). At: 768d 768l 1280d 1280l.
- `plot-size` `#ds-p2`: plot is 219px wide (min 280px). At: 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(2) > span > span`: content wider than box by 28px: "ω(k)=4fm ∣sin⁡ka2∣,ωm=4f/m.\omega(k)=\sqrt{\frac{4". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(3) > span > span > span`: content wider than box by 30px: "uj′=u0 ei(k′ja−ωt)=u0 ei(kja−ωt) ei2πnj=uj,u_j'=u_". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(2) > span > span`: content wider than box by 32px: "(2f−m1ω2−f (1+e−ika)−f (1+eika)2f−m2ω2)(uv)=0.\beg". At: 320d 320l.
- `layout` `#alias > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−3π−2π−π0π2π3π00.20.40.60.81Wave vector k (units o". At: 320d 320l.
- `layout` `#diatomic > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π00.511.522.53Wave vector k (1/a)ω (10¹³". At: 320d 320l.
- `layout` `#diatomic > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "01200.511.522.53Modes per cell per 10¹³ s⁻¹ω (10¹³". At: 320d 320l.
- `layout` `#dos > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π00.20.40.60.811.2Wave vector k (1/a)ω /". At: 320d 320l.
- `layout` `#dos > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "0123400.20.40.60.811.2g(ω) · aω₁ω / ω₁ How". At: 320d 320l.
- `layout` `#neutron > div:nth-of-type(2) > figure`: content wider than box by 14px: "−10123456051015Momentum transfer q = k_i − k_f (un". At: 320d 320l.
- `plot-size` `#al-cv`: plot is 254px wide (min 280px). At: 320d 320l.

**Cosmetic**

- `not-restored` `#alias`: #alias: #al-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #alias: - → restore defaults. At: 320d 320l 360d 360l 400d.
- `not-restored` `#diatomic`: #diatomic: #di-p1, #di-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #diatomic: - → restore defaults. At: 320d 320l 360d 360l 400d.
- `not-restored` `#dos`: #dos: #ds-p1, #ds-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #dos: - → restore defaults. At: 320d 320l 360d 360l 400d.
- `not-restored` `#neutron`: #neutron: #ns-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #neutron: - → restore defaults. At: 320d 320l 360d 360l 400d.
- `line-length`: 25 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 06

Broken 0 · unreadable 23 (10 at 360/400 px) · cosmetic 22

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(1) > span > span`: content wider than box by 116px: "Z=e−βEeq∏k,s∑n=0∞e−βℏωs(k)(n+12)=e−βEeq∏k,se−βℏωs/". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(3) > span > span`: content wider than box by 125px: "cv=∂u∂T∣V=kBV∑k,sx2ex(ex−1)2,x=ℏωs(k)kBT.(⋆)c_v=\f". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span > span > span`: content wider than box by 254px: "x2ex(ex−1)2=1−x212+x4240−… ⇒ cv=3nNVkB−kB12V∑k,s". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(1) > span > span`: content wider than box by 240px: "u−u0=(kBT)4ℏ3(13∑s=13∮1cs3dΩ4π)32π2∫0∞x3 dxex−1,∫0". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(2) > span > span`: content wider than box by 272px: "cvlow=2π25 kB(kBTℏcˉ)3⟺C=12π45NkB(TΘD)3=1944 Jmol ". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(1) > span > span`: content wider than box by 193px: "4π3kD3=(2π)3VN ⇒ kD=(6π2nat)1/3,ℏωD=ℏcˉkD=kBΘD.\". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(1) > span > span`: content wider than box by 98px: "cvEinstein=3natkB (ΘE/T)2 eΘE/T(eΘE/T−1)2,kBΘE=ℏωE". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(7) > span > span > span`: content wider than box by 396px: "cv=∫0∞kB w ⁣(ℏωkBT) g(ω) dω,g(ω)=∑s∫BZd3k(2π)3 δ(ω". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `font` `#cm-p2`: plot text at 9px (min 12px), e.g. "2". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(2) > span > span`: content wider than box by 57px: "C3nNkB=1n[D(T/ΘD)+(n−1) E(T/ΘE)],\frac{C}{3nNk_B}=". At: 320d 320l 360d 360l.
- `layout` `#hw-7-2 > p:nth-of-type(1)`: content wider than box by 2px: "(i) From the specific-heat data of diamond by Toul". At: 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(2) > span > span`: content wider than box by 35px: "u=ueq+1V∑k,sℏωs(k)(1eβℏωs(k)−1+12).u=u_{eq}+\frac1". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(4) > div > span:nth-of-type(3)`: spills outside parent div.check by 7px: "V2π25kB(kBT/ℏcˉ)3/12π45NkB(T/ΘD)3V\frac{2\pi^2}{5}". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(2) > span > span`: content wider than box by 39px: "cvDebye=9 natkB(TΘD)3∫0ΘD/Tx4ex(ex−1)2 dx.c_v^{Deb". At: 320d 320l.
- `layout` `#freeze > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "05010015020000.511.522.53Phonon energy ħω (meV)g(ω". At: 320d 320l.
- `layout` `#freeze > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "051000.20.40.60.81x = ħω / k_BTPer mode (k_B or k_". At: 320d 320l.
- `layout` `#compare > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "00.511.500.20.40.60.81T / Θ_DC / (3nNk_B) ". At: 320d 320l.
- `layout` `#compare > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "0.01250.125110​−7​10​−6​10​−5​10​−4​10​−3​10​−2​10". At: 320d 320l.
- `layout` `#dims > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "50.01250.1251210​−7​10​−6​10​−5​10​−4​10​−3​10​−2​". At: 320d 320l.
- `layout` `#dims > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.510123ω / ω_Dg(ω) · ω_D / dN How to rea". At: 320d 320l.
- `layout` `#diamond > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "102510025100010​−5​2510​−4​2510​−3​2510​−2​2510​−1". At: 320d 320l.
- `layout` `#diamond > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "102510025100016001800200022002400Temperature T (K)". At: 320d 320l.
- `math-spill` `#concepts > div > article:nth-of-type(4) > div`: inline math spills 19px out of article.card div.check: "V2π25kB(kBT/ℏcˉ)3/12π45NkB(T/Θ". At: 320d 320l.

**Cosmetic**

- `not-restored` `#freeze`: #freeze: #fo-p1, #fo-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #freeze: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#compare`: #compare: #cm-p1, #cm-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #compare: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#dims`: #dims: #dd-p1, #dd-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #dims: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#diamond`: #diamond: #dm-p1, #dm-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #diamond: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `line-length`: 18 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 07

Broken 0 · unreadable 18 (8 at 360/400 px) · cosmetic 23

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(2) > span > span`: content wider than box by 209px: "ψk(r)=1V eik⋅r,εk=ℏ2k22m,p=ℏk,v=ℏkm,λ=2πk.\psi_{\m". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(1) > span > span`: content wider than box by 217px: "N=2⋅43πkF3(2π)3/V=VkF33π2 ⇒ kF=(3π2NV)1/3,εF=ℏ22". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(7) > span:nth-of-type(1) > span > span`: content wider than box by 210px: "Cel=∂U∂T=∫0∞(ε−εF) D(ε) ∂f∂T dε≈D(εF) kB2T∫−∞∞x2ex". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(2) > span > span`: content wider than box by 88px: "D(ε)=dNdε=V2π2(2mℏ2)3/2ε,D(εF)=3N2εF.D(\varepsilon". At: 320d 320l 360d 360l 400d 400l 768d 768l.
- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(1) > span > span`: content wider than box by 60px: "−ℏ22m∇2ψ(r)=ε ψ(r),∇2=∂x2+∂y2+∂z2.-\frac{\hbar^2}{". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#concepts > div > article:nth-of-type(5) > span > span > span`: content wider than box by 72px: "U0=∫0εFε D(ε) dε=3N2εF3/2∫0εFε3/2dε=35NεF,U_0=\int". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#hw-9-1 > span:nth-of-type(2) > span > span`: content wider than box by 158px: "γ=π22ZRTF,A=12π45RΘD3,T×=γA=5Z ΘD324π2 TF.\gamma=\". At: 320d 320l 360d 360l 400d 400l.
- `font` `#co-p1`: plot text at 9px (min 12px), e.g. "5". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#exam-na > p`: content wider than box by 2px: "Sodium is monovalent with conduction-electron dens". At: 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(7) > span:nth-of-type(2) > span > span`: content wider than box by 24px: "Cel=π23D(εF) kB2T=π22 NkB TTF≡γT.C_{el}=\frac{\pi^". At: 320d 320l.
- `layout` `#sphere > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: each dot is one occupied k-point, wit". At: 320d 320l.
- `layout` `#sphere > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "024680100200300400500600700800Energy ε (eV)Electro". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "00.511.5200.20.40.60.81ε / ε_FOccupation f ". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.511.5200.511.52ε / ε_FStates per energy (N/ε_F)". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "00.5100.511.5T / T_FC / (N k_B) How to rea". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(4)`: content wider than box by 14px: "00.5100.51T / T_Fμ / ε_F How to read: chem". At: 320d 320l.
- `layout` `#cross > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "512510210​−3​10​−2​10​−1​11010​2​10​3​Temperature ". At: 320d 320l.
- `layout` `#cross > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "0204000.511.522.53T² (K²)C/T (mJ mol⁻¹ K⁻²) ". At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#sphere`: #sphere: #fs-p3, #fs-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #sphere: - → restore defaults. At: 320d 320l.
- `not-restored` `#smear`: #smear: #fd-p1, #fd-p2, #fd-p3, #fd-p4 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #smear: - → restore defaults. At: 320d 320l.
- `not-restored` `#cross`: #cross: #co-p1, #co-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #cross: - → restore defaults. At: 320d 320l.
- `not-restored` `#sphere`: #sphere: #fs-p3 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #sphere: - → restore defaults. At: 360d 360l.
- `line-length`: 18 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 08

Broken 0 · unreadable 20 (7 at 360/400 px) · cosmetic 28

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(2) > span > span`: content wider than box by 113px: "j⃗=−eV 2∑k⃗v⃗k⃗fst=ne2τmE⃗⇒σ=ne2τm, ρ=1σ\vec j=\f". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#thermo > span:nth-of-type(3) > span > span`: content wider than box by 170px: "j⃗=σ(E⃗−Q∇T),j⃗u=Π j⃗−κ∇T,κ=L22−L12L21L11\vec j=\s". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(10) > span:nth-of-type(2) > span > span`: content wider than box by 269px: "Πe=−Ec−μ+32kBTe (<0),Πh=+μ−Ev+32kBTe (>0),Q=ΠT\Pi_". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span > span > span`: content wider than box by 62px: "σ(ω)=σ01+iωτ=σ0 1−iωτ1+ω2τ2,σ0=ne2τm\sigma(\omega)". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#exam-q3 > details > ol > li:nth-of-type(1) > span:nth-of-type(1) > span > span`: content wider than box by 120px: "j⃗=L11E⃗+L12(−∇T),j⃗u=L21E⃗+L22(−∇T),\vec j=L_{11}". At: 320d 320l 360d 360l 400d 400l.
- `font` `#rt-p1`: plot text at 9px (min 12px), e.g. "2". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#concepts > div > article:nth-of-type(8) > span > span > span`: content wider than box by 51px: "κel=π2nkB2Tτ3m,κelσ=π23(kBe)2T=LT\kappa_{el}=\frac". At: 320d 320l 360d 360l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(1) > span > span`: content wider than box by 13px: "fst(k⃗)=f0 ⁣(k⃗+eτE⃗ℏ),δk⃗=−eτE⃗ℏf_{st}(\vec k)=f_". At: 320d 320l.
- `layout` `#m-fs > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−101−2−1012k_x / k_Fk_y / k_FEδk How to re". At: 320d 320l.
- `layout` `#m-fs > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "01002000100200300400500time t (fs)drift speed (μm/". At: 320d 320l.
- `layout` `#m-ac > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "10​10​10​12​10​14​−1−0.500.51frequency f (Hz)σ(ω) ". At: 320d 320l.
- `layout` `#m-ac > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.511.52−1−0.500.51time t (periods 2π/ω)E/E₀ and ". At: 320d 320l.
- `layout` `#m-rt > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "125102510​2​2510​3​10​−8​10​−6​10​−4​10​−2​1temper". At: 320d 320l.
- `layout` `#m-rt > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "25102510​2​25012345temperature T (K)local exponent". At: 320d 320l.
- `layout` `#m-um > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0510−10−50510k along [110] (1/a)k ⟂ (1/a)Fermi sph". At: 320d 320l.
- `layout` `#m-um > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "5010000.20.40.60.81temperature T (K)Umklapp phonon". At: 320d 320l.
- `layout` `#m-wf > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "23456789100234345678910​3​2345678910​4​2temperatur". At: 320d 320l.
- `layout` `#m-wf > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "AgAuCdCuMoPbPtSnWZn00.511.522.53L (10⁻⁸ W Ω K⁻²) ". At: 320d 320l.
- `layout` `#m-te > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "200400600−6−4−20246temperature T (K)thermopower Q ". At: 320d 320l.
- `layout` `#m-te > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.51−20246810270280290300310320330position x (col". At: 320d 320l.

**Cosmetic**

- `not-restored` `#m-fs`: #m-fs: #fs-p1, #fs-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-fs: - → restore defaults. At: 320d 320l 360d 360l 400l.
- `not-restored` `#m-ac`: #m-ac: #ac-p1, #ac-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-ac: - → restore defaults. At: 320d 320l 360d 360l 400l.
- `not-restored` `#m-rt`: #m-rt: #rt-p1, #rt-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-rt: - → restore defaults. At: 320d 320l 360d 360l 400l.
- `not-restored` `#m-um`: #m-um: #um-p1, #um-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-um: - → restore defaults. At: 320d 320l 360d 360l 400l.
- `not-restored` `#m-wf`: #m-wf: #wf-p1, #wf-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-wf: - → restore defaults. At: 320d 320l 360d 360l 400l.
- `not-restored` `#m-te`: #m-te: #te-p1, #te-p2 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-te: - → restore defaults. At: 320d 320l 360d 360l 400l.
- `not-restored` `#m-fs`: #m-fs: #fs-p1 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-fs: - → restore defaults. At: 400d 768d 768l 1280d 1280l.
- `not-restored` `#m-um`: #m-um: #um-p1 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-um: - → restore defaults. At: 400d 768d 768l 1280d 1280l.
- `line-length`: 20 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 09

Broken 0 · unreadable 22 (0 at 360/400 px) · cosmetic 42

**Unreadable**

- `plot-size` `#p2b`: plot is 219px wide (min 280px). At: 768d 768l 1280d 1280l.
- `layout` `#c-bloch > ol > li:nth-of-type(3)`: content wider than box by 2px: "Hence c(R)=eik⋅Rc(\mathbf R)=e^{i\mathbf k\cdot\ma". At: 320d 320l.
- `layout` `#atoms > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−10−50510−12−10−8−6−4−20Position along the row (Å)". At: 320d 320l.
- `layout` `#atoms > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "11.522.53−12−10−8−6−4−20Atomic spacing (relative t". At: 320d 320l.
- `layout` `#kwave > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0102030−1−0.500.51Position along the ring (atom nu". At: 320d 320l.
- `layout` `#kwave > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π−2−1012Crystal momentum k (1/a)Energy (". At: 320d 320l.
- `layout` `#cond > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π−2−1012Crystal momentum k (1/a)Energy (". At: 320d 320l.
- `layout` `#cond > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2πCrystal momentum k (1/a)Velocity (slope". At: 320d 320l.
- `layout` `#wire > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: both panels share the same horizontal". At: 320d 320l.
- `layout` `#wire > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "2004006008000510Temperature (K)Current (e⁻/s, draw". At: 320d 320l.
- `layout` `#ek > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π−2−1012Crystal momentum k (1/a)Energy (". At: 320d 320l.
- `layout` `#ek > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.51−2−1012f(E), DOSHow to read: the same energy ". At: 320d 320l.
- `layout` `#ek > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "05001000150010​−30​10​−24​10​−18​10​−12​10​−6​Temp". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π−π−π/20π/2πkₓ (1/a)k_y (1/a)How to read". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π−4−2024kₓ (1/a) at the cutEnergy (eV)Ho". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "How to read: the same energies as the map, drawn a". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(4)`: content wider than box by 14px: "−4−2024Energy (eV)States per eV (arb.)How to read:". At: 320d 320l.
- `layout` `#fs3d > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: in a real 3D crystal, k has three com". At: 320d 320l.
- `layout` `#fs3d > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π−π−π/20π/2πkₓ (1/a)k_y (1/a)How to read". At: 320d 320l.
- `layout` `#empty > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−X−π/aΓπ/2aπ/aX051015k along [100] (X = 2π/a)Ener". At: 320d 320l.
- `layout` `#empty > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.5100.511.52x along [100] (units of a)|ψ|², plan". At: 320d 320l.
- `eq-small` `#c-empty > div:nth-of-type(3)`: display equation at 17.5px (min 18px, larger than 15px body text). At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#kwave`: #kwave: text, #sk-a differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #kwave: - → restore defaults. At: 320d 400d 768d 768l 1280d 1280l.
- `not-restored` `#wire`: #wire: text differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #wire: - → restore defaults. At: 320d 400d 768d 768l 1280d 1280l.
- `not-restored` `#fs2d`: #fs2d: #p3a differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #fs2d: - → restore defaults. At: 360d 768d 768l 1280d 1280l.
- `not-restored` `#atoms`: #atoms: #p1a, #p1b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #atoms: - → restore defaults. At: 320l 360d 360l 400l.
- `not-restored` `#kwave`: #kwave: text, #sk-a, #sk-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #kwave: - → restore defaults. At: 320l 360d 360l 400l.
- `not-restored` `#cond`: #cond: #pc-a, #pc-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #cond: - → restore defaults. At: 320l 360d 360l 400l.
- `not-restored` `#wire`: #wire: text, #sw-c differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #wire: - → restore defaults. At: 320l 360d 360l 400l.
- `not-restored` `#ek`: #ek: #p2a, #p2b, #p2c differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #ek: - → restore defaults. At: 320l 360d 360l 400l.
- `not-restored` `#fs2d`: #fs2d: #p3a, #p3b, #p3c, #p3d differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #fs2d: - → restore defaults. At: 320l 360l 400l.
- `not-restored` `#fs3d`: #fs3d: #p4a, #p4b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #fs3d: - → restore defaults. At: 320l 360l 400l.
- `not-restored` `#empty`: #empty: #el-a, #el-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #empty: - → restore defaults. At: 320l 360l 400l.
- `line-length`: 30 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 01 build

Broken 0 · unreadable 8 (2 at 360/400 px) · cosmetic 24

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(4) > span`: content wider than box by 180px: "2cos⁡φ∈Z ⇒ φ∈{0∘,60∘,90∘,120∘,180∘} (and their n". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(2)`: content wider than box by 74px: "bcc: a2(x^+y^−z^), a2(−x^+y^+z^), a2(x^−y^+z^)\tex". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#concepts > div > article:nth-of-type(3) > span`: content wider than box by 27px: "M=cos⁡φ 1+sin⁡φ [n^]×+(1−cos⁡φ) n^n^T.M = \cos\var". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure`: content wider than box by 14px: "How to read: axes are Cartesian x, y, z in units o". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure`: content wider than box by 14px: "How to read: axes are x, y, z (arbitrary units; th". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "00.5100.20.40.60.81x (a), face (001)y (a) ". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "scbccfcchcpdiamond00.20.40.60.8Packing fraction ". At: 320d 320l.
- `h-scroll` `html`: page scrolls horizontally by 73px at 768px. At: 768d 768l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#model2`: #model2: #m2-cut differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 400l 768d 768l 1280d 1280l.
- `not-restored` `#model1`: #model1: #m1-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model1: - → restore defaults. At: 400d.
- `not-restored` `#model3`: #model3: #m3-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model3: - → restore defaults. At: 400d.
- `not-restored` `#model2`: #model2: #m2-cut, #m2-bar differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 400d.
- `line-length`: 19 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 02 build

Broken 0 · unreadable 27 (15 at 360/400 px) · cosmetic 38

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 367px: "λ=hp,p=2meeU(non-relativistic),p=2meeU(1+eU2mec2)(". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(1)`: content wider than box by 312px: "n(r)=∑GnG eiG⋅r,eiG⋅R=1 ⇔ G⋅R=2π⋅integer for every". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(2)`: content wider than box by 359px: "b1=2πa2×a3a1⋅(a2×a3),b2=2πa3×a1a1⋅(a2×a3),b3=2πa1×". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(2)`: content wider than box by 189px: "k′=k+G ⇒ (k+G)2=k2 ⇒ 2k⋅G+G2=0 → G→−G 2k⋅G=G2.\ma". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(1)`: content wider than box by 263px: "SG=∑jfj e−iG⋅rj=∑jfj e−i2π(v1xj+v2yj+v3zj),rj=xja1". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(2)`: content wider than box by 207px: "fj=∫nj(ρ) e−iG⋅ρ dV=∫0∞4πρ2 nj(ρ) sin⁡GρGρ dρ(sphe". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#hw-2-1 > details > ol > li:nth-of-type(2)`: content wider than box by 304px: "Apply the identity with A=a2, B=a3, C=b2, D=b3: ". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-2-2 > details > ol > li:nth-of-type(2)`: content wider than box by 317px: "(b) Cr, bcc. a1=a2(−1,1,1), a2=a2(1,−1,1), a3=a2(1". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-2-2 > details > ol > li:nth-of-type(4)`: content wider than box by 374px: "(b) Cu, fcc. a1=a2(0,1,1), a2=a2(1,0,1), a3=a2(1,1". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-2-3 > details > ol > li:nth-of-type(2)`: content wider than box by 270px: "(b)(i) ϕ=3×1.602×10−19 J =4.81×10−19=4.81\times10^". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-3-1 > details > ol > li:nth-of-type(2)`: content wider than box by 258px: "(i) S=f∑je−i2π(ν1xj+ν2yj+ν3zj) factorises: ". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-3-2 > details > ol > li:nth-of-type(2) > span:nth-of-type(1) > span`: content wider than box by 103px: "fK=∫0∞4πr2 e−2r/a0πa03 sin⁡KrKr dr=4Ka03∫0∞r e−βrs". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-3-2 > details > ol > li:nth-of-type(3) > span > span`: content wider than box by 362px: "∫0∞r e−βrsin⁡Kr dr=Im∫0∞r e−(β−iK)rdr=Im1(β−iK)2=I". At: 320d 320l 360d 360l 400d 400l.
- `font` `#m5-p`: plot text at 11px (min 12px), e.g. "111". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(1)`: content wider than box by 59px: "F=∫n(r) e−iΔk⋅r dV=∑GnG∫ei(G−Δk)⋅r dV.F=\int n(\ma". At: 320d 320l 360d 360l.
- `h-scroll` `html`: page scrolls horizontally by 155px at 768px. At: 768d 768l 1280d 1280l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0.5110​−2​110​2​10​4​Tip–sample gap d (nm)Current ". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "010020030040024681012Accelerating voltage U (kV)Wa". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure`: content wider than box by 14px: "−4−2024−6−4−20246k_x (2π/a)k_y (2π/a) How ". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: Cartesian x, y, z in Å. Blue dots are". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "How to read: Cartesian kx, ky, kz in Å⁻¹. Copper d". At: 320d 320l.
- `layout` `#model4 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "012300.20.40.60.81q (2π/a)Intensity / maximum ". At: 320d 320l.
- `layout` `#model4 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−505−10−50510Re AIm A How to read: the com". At: 320d 320l.
- `layout` `#model5 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "11122031140033142251133344053105010015000.20.40.60". At: 320d 320l.
- `layout` `#model6 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0123400.20.40.60.81r (Å)4πr² n(r) (Å⁻¹) Ho". At: 320d 320l.
- `layout` `#model6 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "051000.20.40.60.81Scattering vector K (Å⁻¹)Form fa". At: 320d 320l.
- `layout` `#hw-2-1 > details > ol > li:nth-of-type(1)`: content wider than box by 35px: "Let V=a1⋅(a2×a3) (signed cell volume). Then b1=2πV". At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#model2`: #model2: #m2-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#model1`: #model1: #m1-a, #m1-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model1: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#model3`: #model3: #m3-r, #m3-k differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model3: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#model4`: #model4: #m4-a, #m4-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model4: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#model5`: #model5: #m5-p differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model5: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#model6`: #model6: #m6-n, #m6-f differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model6: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `math-scroll` `#hw-3-2 > details > ol > li:nth-of-type(2)`: inline math scrolls inside its span (103px hidden) in article.hw li: "fK=∫0∞4πr2 e−2r/a0πa03 sin⁡KrK". At: 320d 320l 360d 360l 400d 400l.
- `math-scroll` `#hw-3-2 > details > ol > li:nth-of-type(3)`: inline math scrolls inside its span (362px hidden) in article.hw li: "∫0∞r e−βrsin⁡Kr dr=Im∫0∞r e−(β". At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#model4`: #model4: #m4-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model4: - → restore defaults. At: 768d 768l.
- `line-length`: 28 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 03 build

Broken 0 · unreadable 15 (0 at 360/400 px) · cosmetic 39

**Unreadable**

- `layout` `#c-cohesive > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 31px: "Ecoh=E(free neutral atoms)−E(crystal).\begin{align". At: 320d 320l 768d 768l.
- `layout` `#c-lj > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 23px: "Utot(R)=2Nε[A12(σR)12−A6(σR)6],An=∑j′ pj−n.\begin{". At: 320d 320l 768d 768l.
- `layout` `#c-madelung > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 36px: "α=2(1−12+13−14+…)=2ln⁡2=1.386,\begin{aligned}\alph". At: 320d 320l 768d 768l.
- `layout` `#c-ionic-eq > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 31px: "UtotN=zλe−R/ρ−αq24πε0RorUtotN=zARn−αq24πε0R.\begin". At: 320d 320l 768d 768l.
- `layout` `#c-vdw > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 14px: "ΔU=−ℏω08(2e24πε0CR3)2=−AR6.\begin{aligned}\Delta U". At: 320d 320l.
- `layout` `#c-ionic-eq > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 5px: "U(R0)=−αq24πε0R0(1−1n).U(R_0)=-\frac{\alpha q^2}{4". At: 320d 320l.
- `layout` `#c-hbond > div > span:nth-of-type(1)`: content wider than box by 5px: "EH≈0.1 eV=9.6 kJ/mol≈kB×1160 K.\begin{aligned}E_{\". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "11.522.5−1−0.500.511.5Distance r (σ)Pair energy φ/". At: 320d 320l.
- `layout` `#model1 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "3.544.55−100−50050Nearest-neighbour distance R (Å)". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "05101511.522.5Region size (units of R)Partial sum ". At: 320d 320l.
- `layout` `#model2 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−4−2024−4−2024x (R)y (R) How to read: the ". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0.20.30.40.50.6−20−1001020Ion spacing R (nm)Energy". At: 320d 320l.
- `layout` `#model3 > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "Ionise Ba (I₁ + I₂)O + e⁻ (A₁)O⁻ + e⁻ (A₂ = −9.0)M". At: 320d 320l.
- `layout` `#model4 > div:nth-of-type(2) > figure`: content wider than box by 14px: "0510150.010.1110Size of the region Δx (Bohr radii ". At: 320d 320l.
- `layout` `#exam-x > details > ol > li:nth-of-type(4) > span:nth-of-type(5) > span`: content wider than box by 21px: "B≈75ε/σ3=75×2.25×10−21/(0.365×10−9)3=3.5". At: 320d 320l.

**Cosmetic**

- `not-restored` `#model2`: #model2: #m2-pb differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #model2: - → restore defaults. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `math-scroll` `#exam-x > details > ol > li:nth-of-type(4)`: inline math scrolls inside its span (21px hidden) in article.hw li: "B≈75ε/σ3=75×2.25×10−21/(0.365×". At: 320d 320l.
- `line-length`: 37 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 04 build

Broken 0 · unreadable 17 (0 at 360/400 px) · cosmetic 33

**Unreadable**

- `layout` `#c-strain > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 36px: "R→R′=R+ε‾‾ R,ε‾‾=(εxxεxyεxzεyxεyyεyzεzxεzyεzz),∣εα". At: 320d 320l 768d 768l.
- `layout` `#c-voigt > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 26px: "e1=εxx,e4=εyz+εzy,e2=εyy,e5=εzx+εxz,e3=εzz,e6=εxy+". At: 320d 320l 768d 768l.
- `layout` `#c-cubic > div:nth-of-type(3) > span:nth-of-type(1)`: content wider than box by 23px: "C11−C12=1S11−S12,C11+2C12=1S11+2S12,C44=1S44;S11=C". At: 320d 320l 768d 768l.
- `layout` `#c-young > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 29px: "E[100]=1S11=DC11+C12,ν[100]=−S12S11=C12C11+C12.\be". At: 320d 320l 768d 768l.
- `layout` `#c-young > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 32px: "1E(n^)=S11−2(S11−S12−12S44)×(n12n22+n22n32+n32n12)". At: 320d 320l 768d 768l.
- `layout` `#c-young > div:nth-of-type(4) > span:nth-of-type(1)`: content wider than box by 15px: "A=2C44C11−C12=2(S11−S12)S44.A=\frac{2C_{44}}{C_{11". At: 320d 320l 768d 768l.
- `layout` `#c-voigt > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 16px: "V′=x′⋅(y′×z′)=det⁡(1+ε‾‾)=1+tr⁡ε‾‾+O(ε2),δ≡V′−VV=ε". At: 320d 320l.
- `layout` `#c-stress > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 15px: "σ1=Xx,σ4=Yz=Zy,σ2=Yy,σ5=Zx=Xz,σ3=Zz,σ6=Xy=Yx.\begi". At: 320d 320l.
- `layout` `#c-cubic > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 18px: "u=12C11(e12+e22+e32)+12C44(e42+e52+e62)+C12(e2e3+e". At: 320d 320l.
- `layout` `#c-bulk > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 14px: "u=12C11⋅3 δ29+C12⋅3 δ29=C11+2C126 δ2≡12B δ2.\begin". At: 320d 320l.
- `layout` `#c-young > div:nth-of-type(3) > span`: content wider than box by 15px: "1E[110]=12(S11+S12+12S44).\frac1{E_{[110]}}=\tfrac". At: 320d 320l.
- `layout` `#strain > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: the dashed grey cube is the undeforme". At: 320d 320l.
- `layout` `#strain > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "1 xx2 yy3 zz4 yz5 zx6 xy−505−10−50510Voigt compone". At: 320d 320l.
- `layout` `#young > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: the distance from the centre to the s". At: 320d 320l.
- `layout` `#young > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "[100][110][111][001]050100150200DirectionYoung's m". At: 320d 320l.
- `layout` `#stable > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "WTaCuAgAuAlKPbNiPdDiamondNaLiGeSiGaSbInSbMgONaCl−0". At: 320d 320l.
- `layout` `#stable > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−1−0.500.51−0.500.51Strain amplitude t along the e". At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `invalid-state` `#m2-c11`: #young is marked data-state="invalid"; checks skipped inside it. Repro: #young: #m2-c11 → set to min (0.5). At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `invalid-state` `#m2-c12`: #young is marked data-state="invalid"; checks skipped inside it. Repro: #young: #m2-c12 → set to max (2). At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#strain`: #strain: #m1-p3, #m1-pb differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #strain: - → restore defaults. At: 320d 360l 400l.
- `not-restored` `#young`: #young: #m2-p3, #m2-pl differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #young: - → restore defaults. At: 320d 360l 400l.
- `not-restored` `#stable`: #stable: #m3-pm, #m3-pu differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #stable: - → restore defaults. At: 320d 360l 400l.
- `not-restored` `#strain`: #strain: #m1-p3 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #strain: - → restore defaults. At: 320l.
- `line-length`: 26 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 05 build

Broken 0 · unreadable 25 (12 at 360/400 px) · cosmetic 27

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 209px: "U=∑j12f (uj−uj+1)2,mu¨j=−∂U∂uj=f (uj+1+uj−1−2uj).U". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(1)`: content wider than box by 154px: "m1u¨j=f (vj+vj−1−2uj),m2v¨j=f (uj+1+uj−2vj).m_1\dd". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(3)`: content wider than box by 93px: "m1m2 ω4−2f(m1+m2) ω2+2f2(1−cos⁡ka)=0,m_1m_2\,\omeg". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(4)`: content wider than box by 179px: "D‾=(2fm1−f(1+e−ika)m1m2−f(1+eika)m1m22fm2),det⁡(D‾". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span`: content wider than box by 147px: "ω±2(k)=f(1m1+1m2)±f(1m1+1m2)2−4sin⁡2(ka/2)m1m2.\om". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(3)`: content wider than box by 147px: "g(ω)=2πa1ωm2−ω2(0≤ω<ωm),∫0ωmg dω=1a.g(\omega)=\fra". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(7) > span`: content wider than box by 259px: "Ek,s=ℏωs(k)(nk,s+12),E=∑k,sℏωs(k)(nk,s+12),n=0,1,2". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(2)`: content wider than box by 55px: "(2f−m1ω2−f (1+e−ika)−f (1+eika)2f−m2ω2)(uv)=0.\beg". At: 320d 320l 360d 360l.
- `layout` `#concepts > div > article:nth-of-type(8) > span`: content wider than box by 42px: "k+G=k′±K,ℏ2k22Mn=ℏ2k′22Mn±ℏω(K).\mathbf k+\mathbf ". At: 320d 320l 360d 360l.
- `layout` `#al-cv`: spills outside parent div.chaincv by 46px: "". At: 320d 320l 360d 360l.
- `layout` `#di-cv`: spills outside parent div.chaincv by 46px: "". At: 320d 320l 360d 360l.
- `layout` `#hw-6-1 > details > ol > li:nth-of-type(2) > span > span`: content wider than box by 48px: "Fn=−∂U∂un=−∑l>0fl[(un−un+l)+(un−un−l)]=∑l>0fl(un+l". At: 320d 320l 360d 360l.
- `plot-size` `#di-p2`: plot is 219px wide (min 280px). At: 768d 768l 1280d 1280l.
- `plot-size` `#ds-p2`: plot is 219px wide (min 280px). At: 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(2)`: content wider than box by 32px: "ω(k)=4fm ∣sin⁡ka2∣,ωm=4f/m.\omega(k)=\sqrt{\frac{4". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(3) > span`: content wider than box by 39px: "uj′=u0 ei(k′ja−ωt)=u0 ei(kja−ωt) ei2πnj=uj,u_j'=u_". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(1)`: content wider than box by 18px: "g(ω)=∑s∫1.BZd3k(2π)3 δ(ω−ωs(k)),g(\omega)=\sum_s\i". At: 320d 320l.
- `layout` `#alias > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−3π−2π−π0π2π3π00.20.40.60.81Wave vector k (units o". At: 320d 320l.
- `layout` `#diatomic > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π00.511.522.53Wave vector k (1/a)ω (10¹³". At: 320d 320l.
- `layout` `#diatomic > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "01200.511.522.53Modes per cell per 10¹³ s⁻¹ω (10¹³". At: 320d 320l.
- `layout` `#dos > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π00.20.40.60.811.2Wave vector k (1/a)ω /". At: 320d 320l.
- `layout` `#dos > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "0123400.20.40.60.811.2g(ω) · aω₁ω / ω₁ How". At: 320d 320l.
- `layout` `#neutron > div:nth-of-type(2) > figure`: content wider than box by 14px: "−10123456051015Momentum transfer q = k_i − k_f (un". At: 320d 320l.
- `layout` `#hw-6-1 > details > ol > li:nth-of-type(1) > span:nth-of-type(8) > span`: content wider than box by 4px: "12fl(un−un+l)2+12fl(un−l−un)2\;\tfrac12f_l(u_n-u_{". At: 320d 320l.
- `h-scroll` `html`: page scrolls horizontally by 101px at 768px. At: 768d 768l.

**Cosmetic**

- `math-scroll` `#hw-6-1 > details > ol > li:nth-of-type(2)`: inline math scrolls inside its span (48px hidden) in article.hw li: "Fn=−∂U∂un=−∑l>0fl[(un−un+l)+(u". At: 320d 320l 360d 360l.
- `math-scroll` `#hw-6-1 > details > ol > li:nth-of-type(1)`: inline math scrolls inside its span (4px hidden) in article.hw li: "12fl(un−un+l)2+12fl(un−l−un)2\". At: 320d 320l.
- `line-length`: 25 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 06 build

Broken 0 · unreadable 24 (11 at 360/400 px) · cosmetic 21

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 142px: "Z=e−βEeq∏k,s∑n=0∞e−βℏωs(k)(n+12)=e−βEeq∏k,se−βℏωs/". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(3)`: content wider than box by 133px: "cv=∂u∂T∣V=kBV∑k,sx2ex(ex−1)2,x=ℏωs(k)kBT.(⋆)c_v=\f". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span`: content wider than box by 247px: "x2ex(ex−1)2=1−x212+x4240−… ⇒ cv=3nNVkB−kB12V∑k,s". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(1)`: content wider than box by 235px: "u−u0=(kBT)4ℏ3(13∑s=13∮1cs3dΩ4π)32π2∫0∞x3 dxex−1,∫0". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(4) > span:nth-of-type(2)`: content wider than box by 254px: "cvlow=2π25 kB(kBTℏcˉ)3⟺C=12π45NkB(TΘD)3=1944 Jmol ". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(1)`: content wider than box by 184px: "4π3kD3=(2π)3VN ⇒ kD=(6π2nat)1/3,ℏωD=ℏcˉkD=kBΘD.\". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(7) > span`: content wider than box by 436px: "cv=∫0∞kB w ⁣(ℏωkBT) g(ω) dω,g(ω)=∑s∫BZd3k(2π)3 δ(ω". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(1)`: content wider than box by 82px: "cvEinstein=3natkB (ΘE/T)2 eΘE/T(eΘE/T−1)2,kBΘE=ℏωE". At: 320d 320l 360d 360l 400d 400l 768d 768l.
- `layout` `#hw-7-1 > details > ol > li:nth-of-type(3) > span:nth-of-type(4) > span`: content wider than box by 125px: "u−u0=∑s(kBT)32π ℏ2cs2∫0∞x2dxex−1=∑s(kBT)32π ℏ2cs2⋅". At: 320d 320l 360d 360l 400d 400l.
- `font` `#cm-p2`: plot text at 9px (min 12px), e.g. "2". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#concepts > div > article:nth-of-type(6) > span:nth-of-type(2)`: content wider than box by 54px: "C3nNkB=1n[D(T/ΘD)+(n−1) E(T/ΘE)],\frac{C}{3nNk_B}=". At: 320d 320l 360d 360l.
- `h-scroll` `html`: page scrolls horizontally by 146px at 768px. At: 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(1) > span:nth-of-type(2)`: content wider than box by 39px: "u=ueq+1V∑k,sℏωs(k)(1eβℏωs(k)−1+12).u=u_{eq}+\frac1". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(4) > div > span:nth-of-type(3) > span`: content wider than box by 18px: "V2π25kB(kBT/ℏcˉ)3/12π45NkB(T/ΘD)3V\frac{2\pi^2}{5}". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(5) > span:nth-of-type(2)`: content wider than box by 34px: "cvDebye=9 natkB(TΘD)3∫0ΘD/Tx4ex(ex−1)2 dx.c_v^{Deb". At: 320d 320l.
- `layout` `#freeze > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "05010015020000.511.522.53Phonon energy ħω (meV)g(ω". At: 320d 320l.
- `layout` `#freeze > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "051000.20.40.60.81x = ħω / k_BTPer mode (k_B or k_". At: 320d 320l.
- `layout` `#compare > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "00.511.500.20.40.60.81T / Θ_DC / (3nNk_B) ". At: 320d 320l.
- `layout` `#compare > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "0.01250.125110​−7​10​−6​10​−5​10​−4​10​−3​10​−2​10". At: 320d 320l.
- `layout` `#dims > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "50.01250.1251210​−7​10​−6​10​−5​10​−4​10​−3​10​−2​". At: 320d 320l.
- `layout` `#dims > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.510123ω / ω_Dg(ω) · ω_D / dN How to rea". At: 320d 320l.
- `layout` `#diamond > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "102510025100010​−5​2510​−4​2510​−3​2510​−2​2510​−1". At: 320d 320l.
- `layout` `#diamond > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "102510025100016001800200022002400Temperature T (K)". At: 320d 320l.
- `layout` `#hw-7-1 > details > ol > li:nth-of-type(1) > span:nth-of-type(3) > span`: content wider than box by 5px: "u−u0=∑s=12∫d2k(2π)2ℏcskeℏcsk/kBT−1\displaystyle u-". At: 320d 320l.

**Cosmetic**

- `math-scroll` `#hw-7-1 > details > ol > li:nth-of-type(3)`: inline math scrolls inside its span (125px hidden) in article.hw li: "u−u0=∑s(kBT)32π ℏ2cs2∫0∞x2dxex". At: 320d 320l 360d 360l 400d 400l.
- `math-scroll` `#concepts > div > article:nth-of-type(4) > div`: inline math scrolls inside its span (18px hidden) in article.card div.check: "V2π25kB(kBT/ℏcˉ)3/12π45NkB(T/Θ". At: 320d 320l.
- `math-scroll` `#hw-7-1 > details > ol > li:nth-of-type(1)`: inline math scrolls inside its span (5px hidden) in article.hw li: "u−u0=∑s=12∫d2k(2π)2ℏcskeℏcsk/k". At: 320d 320l.
- `line-length`: 18 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 07 build

Broken 0 · unreadable 21 (9 at 360/400 px) · cosmetic 24

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(2)`: content wider than box by 194px: "ψk(r)=1V eik⋅r,εk=ℏ2k22m,p=ℏk,v=ℏkm,λ=2πk.\psi_{\m". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(1)`: content wider than box by 206px: "N=2⋅43πkF3(2π)3/V=VkF33π2 ⇒ kF=(3π2NV)1/3,εF=ℏ22". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(7) > span:nth-of-type(1)`: content wider than box by 190px: "Cel=∂U∂T=∫0∞(ε−εF) D(ε) ∂f∂T dε≈D(εF) kB2T∫−∞∞x2ex". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(2)`: content wider than box by 78px: "D(ε)=dNdε=V2π2(2mℏ2)3/2ε,D(εF)=3N2εF.D(\varepsilon". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#concepts > div > article:nth-of-type(5) > span`: content wider than box by 61px: "U0=∫0εFε D(ε) dε=3N2εF3/2∫0εFε3/2dε=35NεF,U_0=\int". At: 320d 320l 360d 360l 768d 768l.
- `layout` `#hw-8-3 > p:nth-of-type(1) > span:nth-of-type(2) > span`: content wider than box by 84px: "S=−kB∫0∞[fFDln⁡fFD+(1−fFD)ln⁡(1−fFD)]D(ε)dε". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#hw-9-1 > span:nth-of-type(2)`: content wider than box by 125px: "γ=π22ZRTF,A=12π45RΘD3,T×=γA=5Z ΘD324π2 TF.\gamma=\". At: 320d 320l 360d 360l 400d 400l.
- `font` `#co-p1`: plot text at 9px (min 12px), e.g. "5". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#concepts > div > article:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 53px: "−ℏ22m∇2ψ(r)=ε ψ(r),∇2=∂x2+∂y2+∂z2.-\frac{\hbar^2}{". At: 320d 320l 360d 360l.
- `h-scroll` `html`: page scrolls horizontally by 86px at 768px. At: 768d 768l 1280d 1280l.
- `layout` `#sphere > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: each dot is one occupied k-point, wit". At: 320d 320l.
- `layout` `#sphere > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "024680100200300400500600700800Energy ε (eV)Electro". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "00.511.5200.20.40.60.81ε / ε_FOccupation f ". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.511.5200.511.52ε / ε_FStates per energy (N/ε_F)". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "00.5100.511.5T / T_FC / (N k_B) How to rea". At: 320d 320l.
- `layout` `#smear > div:nth-of-type(2) > figure:nth-of-type(4)`: content wider than box by 14px: "00.5100.51T / T_Fμ / ε_F How to read: chem". At: 320d 320l.
- `layout` `#cross > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "512510210​−3​10​−2​10​−1​11010​2​10​3​Temperature ". At: 320d 320l.
- `layout` `#cross > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "0204000.511.522.53T² (K²)C/T (mJ mol⁻¹ K⁻²) ". At: 320d 320l.
- `layout` `#hw-8-1 > details > div:nth-of-type(2) > span:nth-of-type(2) > span`: content wider than box by 28px: "7.02eV×(1.617/8.45)2/3×me/m3=4.24×10−4". At: 320d 320l.
- `layout` `#hw-8-3 > details > ol > li:nth-of-type(2) > span:nth-of-type(4) > span`: content wider than box by 14px: "∂S∂T=kB∫dsdf∂f∂TD dε=1T∫(ε−μ)∂f∂TD dε". At: 320d 320l.
- `layout` `#hw-8-3 > details > div:nth-of-type(1) > span:nth-of-type(1) > span`: content wider than box by 27px: "S=−kB∫0∞[fln⁡f+(1−f)ln⁡(1−f)]Ddε". At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `math-scroll` `#hw-8-3 > p:nth-of-type(1)`: inline math scrolls inside its span (84px hidden) in article.hw p.ask: "S=−kB∫0∞[fFDln⁡fFD+(1−fFD)ln⁡(". At: 320d 320l 360d 360l 400d 400l.
- `math-scroll` `#hw-8-1 > details > div:nth-of-type(2)`: inline math scrolls inside its span (28px hidden) in article.hw div.check: "7.02eV×(1.617/8.45)2/3×me/m3=4". At: 320d 320l.
- `math-scroll` `#hw-8-3 > details > ol > li:nth-of-type(2)`: inline math scrolls inside its span (14px hidden) in article.hw li: "∂S∂T=kB∫dsdf∂f∂TD dε=1T∫(ε−μ)∂". At: 320d 320l.
- `math-scroll` `#hw-8-3 > details > div:nth-of-type(1)`: inline math scrolls inside its span (27px hidden) in article.hw div.result: "S=−kB∫0∞[fln⁡f+(1−f)ln⁡(1−f)]D". At: 320d 320l.
- `not-restored` `#sphere`: #sphere: #fs-p3 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #sphere: - → restore defaults. At: 320l.
- `line-length`: 18 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 08 build

Broken 0 · unreadable 21 (6 at 360/400 px) · cosmetic 22

**Unreadable**

- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(2)`: content wider than box by 97px: "j⃗=−eV 2∑k⃗v⃗k⃗fst=ne2τmE⃗⇒σ=ne2τm, ρ=1σ\vec j=\f". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#thermo > span:nth-of-type(3)`: content wider than box by 154px: "j⃗=σ(E⃗−Q∇T),j⃗u=Π j⃗−κ∇T,κ=L22−L12L21L11\vec j=\s". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#concepts > div > article:nth-of-type(10) > span:nth-of-type(2)`: content wider than box by 275px: "Πe=−Ec−μ+32kBTe (<0),Πh=+μ−Ev+32kBTe (>0),Q=ΠT\Pi_". At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `layout` `#exam-q3 > details > ol > li:nth-of-type(1)`: content wider than box by 120px: "(a) In linear response each flux depends on both f". At: 320d 320l 360d 360l 400d 400l.
- `font` `#rt-p1`: plot text at 9px (min 12px), e.g. "2". At: 320d 320l 360d 360l 400d 400l.
- `layout` `#concepts > div > article:nth-of-type(5) > span`: content wider than box by 59px: "σ(ω)=σ01+iωτ=σ0 1−iωτ1+ω2τ2,σ0=ne2τm\sigma(\omega)". At: 320d 320l 360d 360l.
- `layout` `#concepts > div > article:nth-of-type(3) > span:nth-of-type(1)`: content wider than box by 23px: "fst(k⃗)=f0 ⁣(k⃗+eτE⃗ℏ),δk⃗=−eτE⃗ℏf_{st}(\vec k)=f_". At: 320d 320l.
- `layout` `#concepts > div > article:nth-of-type(8) > span`: content wider than box by 40px: "κel=π2nkB2Tτ3m,κelσ=π23(kBe)2T=LT\kappa_{el}=\frac". At: 320d 320l.
- `layout` `#m-fs > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−101−2−1012k_x / k_Fk_y / k_FEδk How to re". At: 320d 320l.
- `layout` `#m-fs > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "01002000100200300400500time t (fs)drift speed (μm/". At: 320d 320l.
- `layout` `#m-ac > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "10​10​10​12​10​14​−1−0.500.51frequency f (Hz)σ(ω) ". At: 320d 320l.
- `layout` `#m-ac > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.511.52−1−0.500.51time t (periods 2π/ω)E/E₀ and ". At: 320d 320l.
- `layout` `#m-rt > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "125102510​2​2510​3​10​−8​10​−6​10​−4​10​−2​1temper". At: 320d 320l.
- `layout` `#m-rt > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "25102510​2​25012345temperature T (K)local exponent". At: 320d 320l.
- `layout` `#m-um > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0510−10−50510k along [110] (1/a)k ⟂ (1/a)Fermi sph". At: 320d 320l.
- `layout` `#m-um > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "5010000.20.40.60.81temperature T (K)Umklapp phonon". At: 320d 320l.
- `layout` `#m-wf > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "23456789100234345678910​3​2345678910​4​2temperatur". At: 320d 320l.
- `layout` `#m-wf > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "AgAuCdCuMoPbPtSnWZn00.511.522.53L (10⁻⁸ W Ω K⁻²) ". At: 320d 320l.
- `layout` `#m-te > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "200400600−6−4−20246temperature T (K)thermopower Q ". At: 320d 320l.
- `layout` `#m-te > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.51−20246810270280290300310320330position x (col". At: 320d 320l.
- `h-scroll` `html`: page scrolls horizontally by 167px at 768px. At: 768d 768l.

**Cosmetic**

- `not-restored` `#m-fs`: #m-fs: #fs-p1 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-fs: - → restore defaults. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#m-um`: #m-um: #um-p1 differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #m-um: - → restore defaults. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `line-length`: 20 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

### 09 build

Broken 0 · unreadable 29 (0 at 360/400 px) · cosmetic 44

**Unreadable**

- `layout` `#c-gap > div:nth-of-type(3) > span:nth-of-type(1)`: content wider than box by 31px: "ε±=εˉ±(Δ/2)2+∣UG∣2εˉ=12(εk0+εk−G0)Δ=εk0−εk−G0\begi". At: 320d 320l 768d 768l.
- `layout` `#c-tb > div:nth-of-type(4) > span:nth-of-type(1)`: content wider than box by 16px: "εk=−α−2γ (cos⁡kxa+cos⁡kya+cos⁡kza)m∗=ℏ22γa2\begin{". At: 320d 320l 768d 768l.
- `plot-size` `#p2b`: plot is 219px wide (min 280px). At: 768d 768l 1280d 1280l.
- `layout` `#c-implies > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 20px: "Hk unk(r)=εnk unk(r)Hk=ℏ22m(1i∇+k)2+U(r)\begin{ali". At: 320d 320l.
- `layout` `#c-empty > div:nth-of-type(3) > span:nth-of-type(1)`: content wider than box by 8px: "ε=ℏ22m[(k−Gx)2+Gy2+Gz2]\varepsilon=\frac{\hbar^2}{". At: 320d 320l.
- `layout` `#c-empty > details > p > span:nth-of-type(2) > span`: content wider than box by 10px: "G=2πa(±1,0,0),(0,±1,0),(0,0,±1)". At: 320d 320l.
- `layout` `#c-central > div:nth-of-type(1) > span:nth-of-type(1)`: content wider than box by 20px: "U(r)=∑GUG eiG⋅rψk(r)=∑GCk−G ei(k−G)⋅r\begin{aligne". At: 320d 320l.
- `layout` `#c-central > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 8px: "(εk−G0−ε) Ck−G+∑G′UG′−G Ck−G′=0\begin{aligned}&\bi". At: 320d 320l.
- `layout` `#c-gap > div:nth-of-type(2) > span:nth-of-type(1)`: content wider than box by 11px: "(εk0UGUG∗εk−G0)(CkCk−G)=ε(CkCk−G)\begin{aligned}&\". At: 320d 320l.
- `layout` `#atoms > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−10−50510−12−10−8−6−4−20Position along the row (Å)". At: 320d 320l.
- `layout` `#atoms > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "11.522.53−12−10−8−6−4−20Atomic spacing (relative t". At: 320d 320l.
- `layout` `#kwave > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "0102030−1−0.500.51Position along the ring (atom nu". At: 320d 320l.
- `layout` `#kwave > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π−2−1012Crystal momentum k (1/a)Energy (". At: 320d 320l.
- `layout` `#cond > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π−2−1012Crystal momentum k (1/a)Energy (". At: 320d 320l.
- `layout` `#cond > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2πCrystal momentum k (1/a)Velocity (slope". At: 320d 320l.
- `layout` `#wire > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: both panels share the same horizontal". At: 320d 320l.
- `layout` `#wire > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "2004006008000510Temperature (K)Current (e⁻/s, draw". At: 320d 320l.
- `layout` `#ek > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π−2−1012Crystal momentum k (1/a)Energy (". At: 320d 320l.
- `layout` `#ek > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.51−2−1012f(E), DOSHow to read: the same energy ". At: 320d 320l.
- `layout` `#ek > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "05001000150010​−30​10​−24​10​−18​10​−12​10​−6​Temp". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−π−π/20π/2π−π−π/20π/2πkₓ (1/a)k_y (1/a)How to read". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π−4−2024kₓ (1/a) at the cutEnergy (eV)Ho". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(3)`: content wider than box by 14px: "How to read: the same energies as the map, drawn a". At: 320d 320l.
- `layout` `#fs2d > div:nth-of-type(2) > figure:nth-of-type(4)`: content wider than box by 14px: "−4−2024Energy (eV)States per eV (arb.)How to read:". At: 320d 320l.
- `layout` `#fs3d > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "How to read: in a real 3D crystal, k has three com". At: 320d 320l.
- `layout` `#fs3d > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "−π−π/20π/2π−π−π/20π/2πkₓ (1/a)k_y (1/a)How to read". At: 320d 320l.
- `layout` `#empty > div:nth-of-type(2) > figure:nth-of-type(1)`: content wider than box by 14px: "−X−π/aΓπ/2aπ/aX051015k along [100] (X = 2π/a)Ener". At: 320d 320l.
- `layout` `#empty > div:nth-of-type(2) > figure:nth-of-type(2)`: content wider than box by 14px: "00.5100.511.52x along [100] (units of a)|ψ|², plan". At: 320d 320l.
- `layout` `#hw-x-3 > details > ol > li:nth-of-type(2) > span:nth-of-type(1) > span`: content wider than box by 15px: "εk=−α−2γ(cos⁡kxa+cos⁡kya+cos⁡kza)". At: 320d 320l.

**Cosmetic**

- `load-warning` `-`: log-warning: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/can. At: 320d 320l 360d 360l 400d 400l 768d 768l 1280d 1280l.
- `not-restored` `#atoms`: #atoms: #p1a, #p1b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #atoms: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#kwave`: #kwave: text, #sk-a, #sk-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #kwave: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#cond`: #cond: #pc-a, #pc-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #cond: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#wire`: #wire: text, #sw-c differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #wire: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#ek`: #ek: #p2a, #p2b, #p2c differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #ek: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#fs2d`: #fs2d: #p3a, #p3b, #p3c, #p3d differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #fs2d: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#fs3d`: #fs3d: #p4a, #p4b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #fs3d: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#empty`: #empty: #el-a, #el-b differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #empty: - → restore defaults. At: 320d 320l 360d 360l 400d 400l.
- `not-restored` `#kwave`: #kwave: text, #sk-a differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #kwave: - → restore defaults. At: 768d 768l 1280d 1280l.
- `not-restored` `#wire`: #wire: text differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #wire: - → restore defaults. At: 768d 768l 1280d 1280l.
- `not-restored` `#fs2d`: #fs2d: #p3a differ from the default state after the restore (an animation clock, or state not tied to a control). Repro: #fs2d: - → restore defaults. At: 768d 768l 1280d 1280l.
- `math-scroll` `#c-empty > details > p`: inline math scrolls inside its span (10px hidden) in details.check p: "G=2πa(±1,0,0),(0,±1,0),(0,0,±1". At: 320d 320l.
- `math-scroll` `#hw-x-3 > details > ol > li:nth-of-type(2)`: inline math scrolls inside its span (15px hidden) in article.hw li: "εk=−α−2γ(cos⁡kxa+cos⁡kya+cos⁡k". At: 320d 320l.
- `line-length`: 30 text blocks over about 85 characters per line, all at 768/1280 px (e.g. `main > header > p:nth-of-type(1)`: about 95 characters per line at 16.8px (aim for at most about 80)).

