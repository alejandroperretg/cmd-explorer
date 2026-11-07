# Plan

One item per topic page. The first unchecked item is the current step (pages can be built in parallel, one agent per page).
Every page must also meet the definition of done in `CONVENTIONS.md`. Inputs per page: `sources/INDEX.md`.

- [x] **00 Scaffold**: shared assets, template, index, conventions, source index, ported bands page.
  Done when: `node tools/serve.js` serves index and `pages/09-bands.html` with no console errors; 400 px without horizontal scroll.
  Result: done 2026-11-05. All 16 bands plots render, theme toggle re-themes plots, 400 px OK on index, template and bands page, `/sources/` returns 403.

- [x] **01 Crystal structure & symmetry** (`pages/01-crystal-structure.html`; §1.1; Kittel ch. 1)
  Done when: guides for sheet 1.1 (Bravais lattices a–c), 1.2 (packing fraction fcc/hcp/sc/diamond), 1.3 (six symmetry matrices); exam Q1 (fcc) covered; models include a lattice + primitive-vector viewer and a packing-fraction model.
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **02 Reciprocal lattice, diffraction & imaging** (`pages/02-reciprocal-lattice.html`; §1.1.3, 1.3; Kittel ch. 2)
  Done when: guides for 2.1 (b₁·(b₂×b₃) proof), 2.2 (Cr bcc / Cu fcc Wigner–Seitz and BZ volumes), 2.3 (STM κ and current factor, TEM wavelength at 250 kV), 3.1 (diamond structure factor), 3.2 (hydrogen form factor); models include real ↔ reciprocal lattice and a structure-factor/form-factor plot.
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **03 Crystal binding** (`pages/03-crystal-binding.html`; §1.4; Kittel ch. 3)
  Done when: guides for 3.3 (Ar bcc/fcc cohesive-energy ratio), 3.4 (solid H₂), 4.1 (1D NaCl Madelung constant), 4.2 (BaO, Ba⁺O⁻ vs Ba²⁺O²⁻), 4.3 (metallic-bond kinetic energy); models include Lennard-Jones and Madelung-sum convergence.
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **04 Elasticity** (`pages/04-elasticity.html`; §1.5; Kittel ch. 3)
  Done when: guides for 5.1 (E and ν along [100] and [110] in terms of Cᵢⱼ), 5.2 (cubic stability criteria); models include a strain-tensor deformation view and directional Young's modulus with Cu/Al/Si presets.
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **05 Phonons** (`pages/05-phonons.html`; §1.6; Kittel ch. 4)
  Done when: guides for 6.1 (l-th neighbour dispersion), 6.2 (1D density of states); models include monatomic and diatomic chain dispersion with an animated chain and D(ω).
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **06 Lattice heat capacity** (`pages/06-heat-capacity.html`; §1.7; Kittel ch. 5)
  Done when: guides for 7.1 (layer lattice C ∝ T²), 7.2 (Debye temperature of diamond from the graph, vs 2250 K); models compare Einstein, Debye and Dulong–Petit and show the T³ regime.
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **07 Free electron gas** (`pages/07-free-electron-gas.html`; §2.1; Kittel ch. 6)
  Done when: guides for 8.1 (liquid ³He ε_F, T_F), 8.2 (2D chemical potential), 8.3 (entropy of the electron gas), 9.1 (electron/phonon C crossover for Cu, Na, Al with data sources); exam Q2 covered; models include Fermi sphere filling and Fermi–Dirac smearing.
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **08 Transport** (`pages/08-transport.html`; §2.2–2.5, 2.7.7; Kittel ch. 6, App. F, ch. 8)
  Done when: guides for 9.2 (non-equilibrium distribution, AC conductivity σ(ω) = σ₀/(1 + iωτ) with the sheet's sign convention); concepts cover Boltzmann/relaxation time, Drude, Umklapp, Wiedemann–Franz, Peltier/Seebeck; exam Q3 covered; models include a shifted Fermi sphere and σ(ω).
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [x] **09 Energy bands: extend** (`pages/09-bands.html`; §2.6; Kittel ch. 7)
  Done when: Concepts cover Bloch theorem, empty lattice, nearly free electrons, tight binding; a new model shows empty-lattice bands along [100] in the reduced zone and the gap opening with a weak potential U_G; exam Q4 (a–f) answered; the seven existing models still work unchanged.
  Result: built and reviewed 2026-11-05 (physics + code PASS).

- [ ] **10 Magnetic properties** (`pages/10-magnetism.html`; §2.8; Kittel ch. 11)
  Done when: concepts derive the Hamiltonian of an electron in a field (p → p + eA, Zeeman term) and the dia-/paramagnetic terms; at least one model; content checked against the lecture notes once they cover §2.8 (not yet in notes).

- [ ] **11 Dielectrics** (`pages/11-dielectrics.html`; §2.9; Kittel ch. 16)
  Done when: concepts cover polarization, local field, Clausius–Mossotti, polarizability; at least one model; checked against the notes once they cover §2.9.

- [ ] **12 Semiconductors** (`pages/12-semiconductors.html`; §3.1; Kittel ch. 8)
  Done when: concepts cover effective mass, holes, effective DOS, intrinsic and doped carrier densities, drift–diffusion currents; exam Q5 (a–e) answered for Si; models include n(T) with doping and the Fermi-level position.

- [ ] **13 p–n junction & devices** (`pages/13-pn-junction.html`; §3.2; Kittel ch. 17)
  Done when: concepts cover the junction band diagram, built-in voltage, depletion width, diode equation, solar cell / LED / laser diode; exam Q6 (a–c) answered including a solar-cell efficiency estimate; models include a band diagram vs bias and an I–V curve.

- [ ] **15 Models by topic number** (after the pages exist; user request).
  - Done when every page meets the topic-number model rule in `CONVENTIONS.md`. Fill gaps on built pages, e.g. 07 needs 2.1.2 wavefunctions in a box vs on a ring, 2.1.4 total energy and 2.1.5 pressure; 08 needs 2.2.1 the shifted distribution, 2.5 κ/σT and 2.7.7 Peltier/Seebeck.
  - Done also when `index.html` lists every model under its topic-list number.

- [ ] **16 Coverage audit** (user request; two separate agents, so the check isn't biased).
  - (a) Expectation list, `audit/expectations.md`. Built from the topic list, the user's notes and sheets 1–9 only, without opening `pages/`. Every item has an ID, its source and a pass criterion.
  - (b) After the pages are done, a second agent checks every item against `pages/` and writes `audit/report.md` with pass, partial or missing for each item, with evidence.
  - (c) The checker also reviews the reading flow (user request, 2026-11-07):
    - Does each page follow the lecture order and motivation, as in the notes?
    - Are there unnecessary duplicates across pages?
    - Does every cross-page dependency have a recap or link in both directions?
    - Is there curiosity material (e.g. page 09's original video-based models) that breaks the lecture flow?
  - Done when every item has a verdict and every missing item is fixed or listed in PLAN.

- [ ] **14 Exam prep** (`pages/14-exam-prep.html`; all sections)
  Done when: each 2022 exam question (Q1–Q6) has a short model answer linking to the topic page that covers it; build last, after 01–13.
