# Coverage audit: expectation list (Condensed Matter and Devices)

Built from primary sources only. Not opened: anything in `explorer/pages/` and `digest/TEACHING-BRIEF.md`. The other `digest/*.md` files were used only to locate pages and to cross-check known slips; every notes item below comes from my own reading of the rendered page.

## Sources and how they were read

| Code | Source | How read | Weight |
|---|---|---|---|
| TL | `Condensed_Topic_List.pdf` | text layer, 3 pages | defines scope |
| HW s.p | `problems01.pdf` … `problems09.pdf`, sheet s, problem p | text layer; sheets 7 and 9 also rendered (the text layer garbles the formulas) | drills; sets "core" |
| N pNN | `Condensed Matter.pdf`, PDF page NN (55 pages: p1 is a cover pattern, p55 is blank) | every page rendered at 120 dpi; board photos on p25 and p45 re-cropped at 300+ dpi | lecture content as the student recorded it; incomplete, with slips |
| EX Qn | `Condensed Matter - 2022 Exam recovery from alumni.pdf` | text layer | examined, but this is an alumni reconstruction (question stems plus web links, some wording garbled), so it is weak evidence of exact wording |

Tier: **core** means examined (EX) or drilled by a sheet (HW), including a notes result that a sheet problem explicitly needs; the "core (via …)" note says which. **detail** means everything else.

Check values marked "(own calc)" are my own arithmetic from the data given on the sheet (or, for HW 9.1, from standard Kittel table data). They are there so an auditor can check numbers; they are not course-provided answers.

## Notation (follow the notes; Kittel differences)

- Lattice vector **R** = n1 a1 + n2 a2 + n3 a3 (Kittel: T). In the notes, **T** in R' = M R + T is a translation in a symmetry operation.
- Reciprocal lattice: b1 = 2π (a2×a3)/A with A = a1·(a2×a3), the signed cell volume. Scattering vector **K** = k' − k (Kittel: Δk). The notes' amplitude sign varies (e^{+iK·r} on p13, e^{−iK·R} on p14); it is harmless under the absolute square.
- Electron density ρ(r) (p13–14) or n(r) (p12, p23; Kittel and sheets).
- Strain: deformation matrix ε acting on column vectors, Voigt strains e1…e6 with engineering shears (e4 = ε_yz + ε_zy); stress: X_y = force in x on the plane with normal y, Voigt σ1…σ6; C = stiffness, S = C⁻¹ = compliance. Kittel transposes the ε index labels.
- Phonons: spring constant **f** (Kittel C), mass **m** (Kittel M), phonon wavevector **k** (Kittel K), displacement u_j (Kittel u_s). Θ_D and Θ_E (Kittel θ). c̄ is the branch- and orientation-averaged sound speed (Kittel uses a single v).
- Lecture u, c_v, g(ω) are **per unit volume** (1/V prefactor); Kittel's C_V and D(ω) are per crystal. Exception: the free-electron c_v on p41 is total (contains N).
- Free electrons: ε_F (boards write E_F), D(ε) = total DOS including spin, g(ε) = D/V.
- Transport: relaxation time τ (Kittel ch. 5 also uses τ for k_BT), thermal conductivity κ (Kittel K).
- Bands: ψ = u_{n,k} e^{ik·r}; Fourier coefficients C_{k−G}, potential U_G; kinetic term ε⁰_{k−G} (Kittel λ_k, C(k)).
- Numbering: the notes' section numbers differ from TL in several places (notes 1.2 = TL 1.1.3; notes 1.3.4 BZ = no TL number; notes 1.5.5 = cubic constants, 1.5.5.1 = TL 1.5.5; notes 1.7.1.4 phonon DOS = TL 1.6.4; notes 2.3.1 = TL 2.2.2; notes 2.4 = TL 2.2.3; notes 2.6.3 NFE = TL 2.6.2). The items below sit under the TL number.

---

## 1. Crystals

### 1.1 Crystal structure

#### 1.1.1 Primitive lattice

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.1.1-01 | N p2 | Motivation: macroscopic properties follow from atomic arrangement; crystal faces reflect the lattice | states that macroscopic properties and face angles reflect the periodic atomic arrangement | detail |
| 1.1.1-02 | N p2; HW 1.1; EX Q1b | Definition of a primitive (Bravais) lattice | states R = n1 a1 + n2 a2 + n3 a3 with integer n_i and linearly independent primitive translation vectors a_i (notes' R = Kittel T) | core |
| 1.1.1-03 | N p2 | Non-uniqueness of primitive vectors (2D sketch with a short pair and an oblique pair) | figure or interactive showing two different valid primitive pairs for one 2D lattice | detail |
| 1.1.1-04 | N p2–3; HW 2.2a | Primitive cell: fills space without gaps or overlap; the parallelepiped of a_i is one; one lattice point per cell; V_c = abs(a1·(a2×a3)) | states all three properties, including the triple-product volume formula | core |
| 1.1.1-05 | N p3; HW 2.2a | Wigner–Seitz cell: most compact primitive cell, made by assigning each point to its nearest lattice point; highest symmetry | defines the WS cell by the nearest-lattice-point rule and states that its volume equals V_c; a figure or perpendicular-bisector construction counts extra (the notes give no construction) | core |
| 1.1.1-06 | HW 1.1a | Base-centred cubic (extra points in the horizontal face centres) | worked answer: it is a Bravais lattice (simple tetragonal), with primitive vectors e.g. (a/2, a/2, 0), (a/2, −a/2, 0), (0, 0, a) | core |
| 1.1.1-07 | HW 1.1b | Side-centred cubic (extra points in the vertical face centres) | worked answer: not Bravais; sc with a 3-point basis, e.g. 0, (a/2, 0, a/2), (0, a/2, a/2) | core |
| 1.1.1-08 | HW 1.1c | Edge-centred cubic (extra points at nearest-neighbour midpoints) | worked answer: not Bravais; sc with a 4-point basis, e.g. 0, (a/2, 0, 0), (0, a/2, 0), (0, 0, a/2) | core |
| 1.1.1-09 | HW 2.2a | WS-cell volumes of Cr (bcc, a = 288.5 pm) and Cu (fcc, a = 361.5 pm) | worked solution using V = a³/2 (bcc) and a³/4 (fcc), reaching ≈ 1.20×10⁻²⁹ m³ (Cr) and ≈ 1.18×10⁻²⁹ m³ (Cu) (own calc) | core |
| 1.1.1-10 | EX Q1b | fcc primitive vectors | sketch plus vectors, e.g. (a/2)(0,1,1), (a/2)(1,0,1), (a/2)(1,1,0), and primitive-cell volume a³/4 | core |

#### 1.1.2 Lattice classification by symmetry

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.1.2-01 | N p3; HW 1.3 | Symmetry operation as a linear map R' = M R + T (M a 3×3 rotation, reflection or inversion matrix; T a translation) | states the form, and that M must preserve length (so rotations, inversion and their combinations); notes the notes' T is not Kittel's T | core |
| 1.1.2-02 | N p3 | Crystallographic restriction: integer image coefficients ⇔ 2cos φ is an integer (stated without proof) | states the condition and the allowed angles 0°, 60°, 90°, 120°, 180° (the notes also list 240°, 270°, 300°, which are the same operations as −120°, −90°, −60°) | detail |
| 1.1.2-03 | N p4 | Table of basic rotations C1, C2, C3, C4, C6 (360°, 180°, 120°, 90°, 60°) | table or list with angle, radians and symbol; uses C6 for the 6-fold axis (the notes' last label is hard to read and the digest reads it as "C5", a slip) | detail |
| 1.1.2-04 | N p4; HW 1.3d, 1.3f | Reflection = 180° rotation followed by inversion | states this decomposition (e.g. reflection in the xz-plane = −1 × C2 about y) | core |
| 1.1.2-05 | HW 1.3a | Matrix for a 180° rotation about x | diag(1, −1, −1) | core |
| 1.1.2-06 | HW 1.3b (first "b") | Inversion matrix | −1 (negative identity) | core |
| 1.1.2-07 | HW 1.3c (labelled a second "b" on the sheet) | 120° rotation about z | rows (−1/2, −√3/2, 0), (√3/2, −1/2, 0), (0, 0, 1) (or its transpose, with the sense stated) | core |
| 1.1.2-08 | HW 1.3d | Reflection at the xz-plane | diag(1, −1, 1) | core |
| 1.1.2-09 | HW 1.3e | 60° rotation about [111] | rows (2/3, −1/3, 2/3), (2/3, 2/3, −1/3), (−1/3, 2/3, 2/3) via Rodrigues (or the transpose for the opposite sense), with the sense stated (own calc) | core |
| 1.1.2-10 | HW 1.3f | Reflection at the (110) plane through the origin | I − 2nnᵀ with n = (1,1,0)/√2, i.e. rows (0, −1, 0), (−1, 0, 0), (0, 0, 1) | core |
| 1.1.2-11 | TL | Classification proper: 2D lattice types and 14 Bravais lattices / 7 crystal systems (absent from the notes, which stop at the restriction) | a list or figure of the Bravais lattice types grouped by crystal system | detail |

#### 1.1.3 Direct imaging of atomic structure

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.1.3-01 | N p7, N p10; HW 2.3c | de Broglie wavelength: λ = h/p; electrons (non-relativistic) λ = h/√(2mE), so λ ∝ E^(−1/2); photons E = pc, λ = c/ν | gives both the particle and the photon relation and λ ∝ E^(−1/2) for electrons | core |
| 1.1.3-02 | N p7; HW 2.3a | TEM principle: short-wavelength electrons (> 100 keV) transmitted through a thin sample; condenser, sample, objective | explains why high-energy electrons give atomic resolution and names the beam path elements | core |
| 1.1.3-03 | N p7 | TEM ray diagram (the notes have only an empty labelled box) | a figure of the TEM column (condenser, sample, objective, image) | detail |
| 1.1.3-04 | N p7–8 | The notes name TEM and SEM as the two direct-imaging options; p8 has an unlabelled SEM sketch | mentions SEM and says it is not the atomic-resolution method (TEM and STM are, per p9 and the sheet) | detail |
| 1.1.3-05 | N p9; HW 2.3a | STM principle: metal tip over the surface; the tunnelling current depends exponentially on the gap, I ∝ exp(−αx) | figure of tip and surface, plus the exponential current law and why it gives atomic resolution | core |
| 1.1.3-06 | N p9 | TEM and STM reveal periodic structure, crystal defects and nanocrystalline materials | statement of what the techniques visualise | detail |
| 1.1.3-07 | HW 2.3b(i) | κ = √(2mφ)/ħ for φ ≈ 3 eV | worked solution reaching κ ≈ 8.9×10⁹ m⁻¹ (own calc) | core |
| 1.1.3-08 | HW 2.3b(ii) | Current gain for a 0.2 nm approach | worked solution, factor exp(2κ·0.2 nm) ≈ 35 (own calc) | core |
| 1.1.3-09 | HW 2.3c(i) | λ of 250 keV electrons | worked solution: 2.45 pm non-relativistic; ≈ 2.20 pm with the relativistic correction (eU/2mc² ≈ 0.24); states which is used (own calc) | core |
| 1.1.3-10 | HW 2.3c(ii) | Compare with visible light (500 nm) | states a ratio of ~2×10⁵ and links resolution to wavelength | core |

#### 1.1.5 Simple crystal structures

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.1.5-01 | N p6, p9 | NaCl: fcc of Cl⁻ plus the same lattice shifted by half the body diagonal (Na⁺, the small ion) | describes it as fcc + 2-ion basis with the ½-body-diagonal shift | detail |
| 1.1.5-02 | N p6, p9 | CsCl: sc plus a ½-body-diagonal shift (Cs⁺, the larger ion) | describes it as sc + 2-ion basis | detail |
| 1.1.5-03 | N p6; HW 1.2b | hcp (He, Mg, Co): a1 = (a,0,0), a2 = (−a/2, √3a/2, 0), a3 = (0,0,√(8/3)a); 2-atom basis; hexagonal prism sketch | gives primitive vectors with ideal c/a = √(8/3) ≈ 1.633 and a 2-atom basis; a figure of the hexagonal prism | core |
| 1.1.5-04 | N p16; HW 1.2b | hcp basis worked "practice for exam": a = 2r, second atom at the centroid of the (0, a1, a2) triangle raised by c/2; lattice coordinates (1/3, 1/3, 1/2) | basis vector and lattice coordinates given **with the angle convention stated**: (1/3, 1/3, 1/2) holds for the 60° choice of a2 used on p16; with the 120° choice of p6 the same atom is at (2/3, 1/3, 1/2) | core |
| 1.1.5-05 | N p7, p9; HW 1.2d; HW 3.1 | Diamond / cubic ZnS: fcc plus a shift by ¼ body diagonal | describes it as fcc + 2-atom basis (0 and (a/4)(1,1,1)) | core |
| 1.1.5-06 | HW 1.2a; EX Q1c; EX Q1d | fcc coordination number and packing fraction | worked solution: CN = 12, packing fraction π√2/6 ≈ 0.740 (spheres touch along the face diagonal) | core |
| 1.1.5-07 | HW 1.2b | hcp coordination number and packing fraction | worked solution: CN = 12, packing fraction 0.740 for ideal c/a (the notes leave this unfinished on p16) | core |
| 1.1.5-08 | HW 1.2c | sc coordination number and packing fraction | worked solution: CN = 6, π/6 ≈ 0.524 | core |
| 1.1.5-09 | HW 1.2d | Diamond coordination number and packing fraction | worked solution: CN = 4, π√3/16 ≈ 0.340 (touching along ¼ body diagonal) | core |
| 1.1.5-10 | EX Q1a | General properties of the fcc lattice | conventional cell with 4 atoms, nearest-neighbour distance a/√2, CN 12, packing 0.74, primitive cell a³/4 | core |
| 1.1.5-11 | N p6, p9 (no TL number; TL skips 1.1.4, Kittel's index system) | Naming planes and directions: hkl, (hkl), {hkl}, [hkl]; plane through a1/h, a2/k, a3/l. The student's open question "what does this mean exactly?" is unanswered; a p6 box is empty | explains each bracket type (plane, family of planes, direction) and the reciprocal-intercept rule | detail |

### 1.3 Wave diffraction and reciprocal lattice

#### 1.3.1 Bragg's law

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.3.1-01 | N p10 | Extra diffraction beams appear when λ is smaller than the lattice constant | states the λ < a condition | detail |
| 1.3.1-02 | N p10 | Bragg's derivation: reflection from parallel planes spaced d; path difference 2d sin θ; boxed 2d sin θ = nλ | figure of planes with path difference, plus the boxed law | detail |
| 1.3.1-03 | N p10 | Board: CaF₂ θ–θ diffractometer; intensity vs θ with (220) near 20° and (440) near 40° (angles read off a photo, unverified) | figure of the diffractometer geometry and a peak pattern showing (440) as the second order of (220) | detail |
| 1.3.1-04 | N p10, p14 (link not made in the notes) | Equivalence of the Laue condition and Bragg's law, d_hkl = 2π/G | shows 2k·G = G² ⇒ 2d sin θ = nλ | detail |

#### 1.3.2 Reciprocal lattice

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.3.2-01 | N p12 | Fourier series of periodic functions: 1D f(x+na) = f(x) = Σ f_k e^{ikx}, k = m 2π/a; 3D n(r+R) = n(r) = Σ_G n_G e^{iG·r} | gives both the 1D and the 3D expansion and identifies k (or G) as reciprocal lattice vectors | detail |
| 1.3.2-02 | N p11; EX Q4b; HW 2.1 | Reciprocal lattice definition: e^{iG·R} = 1 for all R ⇔ G·R = 2πn; G = m1 b1 + m2 b2 + m3 b3; b_i·a_j = 2π δ_ij; b1 = 2π (a2×a3)/A cyclic, A = a1·(a2×a3) | states the defining condition, b_i·a_j = 2πδ_ij and the explicit b_i formulas | core |
| 1.3.2-03 | N p11 (board) | sc example: b_i = (2π/a) e_i; first BZ is a cube of edge 2π/a centred at 0 | worked sc example with the BZ | detail |
| 1.3.2-04 | HW 2.1 | Prove b1·(b2×b3) = (2π)³/(a1·(a2×a3)) | worked proof (write b1 via the a_i, use a vector triple product identity) | core |
| 1.3.2-05 | HW 2.2b | Reciprocal lattices of bcc (Cr) and fcc (Cu) and their BZs | worked solution: bcc → fcc reciprocal, fcc → bcc reciprocal, explicit b_i; BZ shapes (rhombic dodecahedron for bcc, truncated octahedron for fcc); a figure or 3D model of a BZ counts | core |
| 1.3.2-06 | HW 2.2c | BZ volumes ("inverse volumina", unit 1/m³) | worked solution V_BZ = (2π)³/V_c ≈ 2.07×10³¹ m⁻³ (Cr) and ≈ 2.10×10³¹ m⁻³ (Cu) (own calc) | core |
| 1.3.2-07 | N p11, p15; HW 2.2b | First Brillouin zone = WS cell of the reciprocal lattice | states the definition | core |
| 1.3.2-08 | N p15 (notes' 1.3.4, no TL number) | BZ boundaries: k·(G/2) = (G/2)² defines planes; all k on them are Bragg reflected; the planes divide k-space; higher zones (board: 2D square case, zones 1 and 2) | states the plane condition and shows a figure of at least the first two zones of a square lattice | detail |

#### 1.3.3 X-ray scattering

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.3.3-01 | N p12 | EM plane wave A = Re(A0 e^{i(k·r − ωt)}), A = E or B; k = 2π/λ; transverse A·k = 0 | gives the plane wave, the wavevector–wavelength relation and transversality | detail |
| 1.3.3-02 | N p12–13 (boards) | Scattering geometry: source, scattering event in the sample with amplitude ∝ ρ(r), detector at r1 | figure with source, sample and detector, incoming k and outgoing k' | detail |
| 1.3.3-03 | N p13 | The student's open questions: dipole radiation of the electron? What is the unit vector along E1? | addresses scattering as re-radiation by electrons driven by the incoming wave | detail |
| 1.3.3-04 | N p13; HW 3.2 | von Laue description: amplitude ∝ e^{−iωt} ∫ρ(r) e^{i(k−k')·r} d³r; intensity ∝ abs(∫ρ e^{−iK·r} d³r)² with K = k' − k | states amplitude and intensity with K defined; picks one sign convention (the notes switch signs) | core |
| 1.3.3-05 | N p14; HW 3.1 | Split the integral into cells r → R + δr; lattice sum Σ_R e^{−iK·R} times the cell integral; constructive interference ⇔ K·R = 2πN ⇔ K = G (Laue condition) | derivation reaching "K must be a reciprocal lattice vector" | core |
| 1.3.3-06 | N p14 | Elastic scattering: ω unchanged ⇒ k = k'; k' = k − G ⇒ 2k·G = G² (boxed "condition for diffraction") | derivation reaching 2k·G = G² | detail |
| 1.3.3-07 | N p15 | Laue method: white beam (notes: λ ≈ 200–500 pm, unverified), film, diffracted beams where K = G; Ewald-type sketch; open question "where is the detector?" | figure of the Laue setup or Ewald construction | detail |

#### 1.3.5 Analysis with basis

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.3.5-01 | TL (absent from the notes) | Structure factor S_G = Σ_j f_j e^{−iG·r_j} and atomic form factor f_j; scattered amplitude = N·S_G | states S_G and f_j and how they enter the intensity | core (via HW 3.1, 3.2) |
| 1.3.5-02 | HW 3.1(i) | Structure factor of the 8-atom diamond basis on an sc lattice | worked solution factorised as (fcc part) × (1 + e^{−iπ(ν1+ν2+ν3)/2}) | core |
| 1.3.5-03 | HW 3.1(ii) | Zeros of S; allowed reflections | shows reflections survive only for all ν_i odd, or all even with ν1+ν2+ν3 = 4n | core |
| 1.3.5-04 | HW 3.2; N p23 (start only) | Form factor of atomic hydrogen from n(r) = e^{−2r/a0}/(πa0³) | worked solution in spherical coordinates reaching f(K) = 16/(4 + K²a0²)² | core |

### 1.4 Crystal binding

The notes have no binding lecture: p17 is a single large "?" with an illegible mark beneath it, and p23 holds only a highlighted keyword list. Content therefore rests on TL and the sheets.

#### 1.4.1 Molecular crystals: noble gases

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.4.1-01 | N p23; TL | Keyword list: Lennard-Jones, van der Waals, dipoles, cohesive energy (marked "intuition"; no content) | explains the van der Waals (induced dipole–dipole, ∝ R⁻⁶) attraction and the R⁻¹² repulsion | core (via HW 3.3, 3.4) |
| 1.4.1-02 | HW 3.3, 3.4 | Lennard-Jones potential 4ε[(σ/R)¹² − (σ/R)⁶]; lattice sums U = 2Nε[A12(σ/R)¹² − A6(σ/R)⁶]; equilibrium U = −Nε A6²/(2A12) | gives the formula with lattice sums (fcc A12 = 12.13, A6 = 14.45) and the equilibrium energy −8.6 Nε for fcc | core |
| 1.4.1-03 | HW 3.3 | Ratio of cohesive energies bcc/fcc for Ar | worked solution reaching ≈ 0.957 (bcc A12 = 9.114, A6 = 12.253) (own calc) | core |
| 1.4.1-04 | HW 3.4(i) | H₂ cohesive energy in kJ/mol from ε = 50×10⁻²³ J, σ = 0.296 nm | worked solution that states its interpretation (the sheet does not say which structure (i) assumes; ε·N_A ≈ 0.30 kJ/mol is the bare pair scale) | core |
| 1.4.1-05 | HW 3.4(ii) | Same for an fcc crystal of spherical molecules | worked solution reaching ≈ 2.59 kJ/mol (8.6 ε N_A) and noting the gap caused by omitted quantum corrections (own calc) | core |

#### 1.4.2 Ionic crystals

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.4.2-01 | HW 4.1(i) | Madelung constant of a 1D NaCl chain | worked solution with the alternating series reaching α = 2 ln 2 ≈ 1.386 | core |
| 1.4.2-02 | HW 4.1(ii) | Cohesive energy per cell with repulsion A/Rⁿ | worked solution: equilibrium fixes A, giving U0 = −αe²/(4πε0R0)·(1 − 1/n); notes that Kittel's main text uses exponential repulsion λe^{−R/ρ} instead | core |
| 1.4.2-03 | HW 4.2 | BaO (NaCl structure, R0 = 0.276 nm): Ba⁺O⁻ vs Ba²⁺O²⁻, ionisation 5.19 and 9.96 eV, affinities 1.5 and −9.0 eV, repulsion neglected | worked solution with α_NaCl = 1.7476: Ba⁺O⁻ ≈ −5.4 eV, Ba²⁺O²⁻ ≈ −13.8 eV per molecule ⇒ divalent state predicted (own calc) | core |

#### 1.4.3 Covalent crystals

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.4.3-01 | TL; N p18 (the word "covalent crystal" in a recap, no content) | Covalent bond: electron-pair bond, spin dependence, tetrahedral sp³ in diamond, low packing, continuum between ionic and covalent | explains the pair bond and the tetrahedral diamond bonding | detail |

#### 1.4.4 Metallic crystals

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.4.4-01 | N p18, N p41 | Metals: easy model is the free electron gas; electron delocalisation stabilises metals | states that delocalised valence electrons lower the kinetic energy and bind the metal | core (via HW 4.3) |
| 1.4.4-02 | HW 4.3 | Kinetic energy gained when an electron spreads from 1 to ~9 Bohr radii (Δp Δx = ħ/2) | worked solution E = ħ²/(8mΔx²): ≈ 3.40 eV → ≈ 0.04 eV, gain ≈ 3.4 eV per electron (own calc) | core |

#### 1.4.5 Hydrogen bonding

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.4.5-01 | N p18 | H has one electron so it forms one covalent bond; with highly electronegative neighbours (F, O, N) it bridges; ~0.1 eV per bond; relevant for water, some ferroelectrics, DNA | states the ~0.1 eV scale, the F/O/N condition and the examples | detail |
| 1.4.5-02 | N p18 | HF₂⁻ ion sketch (F⁻ H⁺ F⁻), marked "clear up" | figure of the bifluoride ion bridge | detail |

### 1.5 Elastic strain

#### 1.5.1 Elastic strain in a crystal

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.5.1-01 | N p18; HW 5.1 | Strain shifts lattice positions R → R' = R + ε·R, with ε a dimensionless 3×3 deformation matrix; strained region ≫ lattice constant, so a homogeneous continuum is assumed | states the map with the correct sign ΔR = R' − R = ε·R (the notes' side note writes R − R', a slip) | core |
| 1.5.1-02 | N p18–19 | Strained axes x' = x̂ + εx̂ etc. are neither orthogonal nor unit length; for small strain, excluding pure rotation, ε_αβ = ε_βα | figure or statement of the deformed axes and the symmetry from excluding rotations | detail |
| 1.5.1-03 | N p19 | Volume change V' = x'·(y'×z') ≈ 1 + ε_xx + ε_yy + ε_zz; dilation δ = (V' − V)/V = trace | derivation reaching δ = ε_xx + ε_yy + ε_zz to first order | core (via 1.5.5) |
| 1.5.1-04 | N p19; HW 5.1, 5.2 | Voigt strain coefficients e1…e6 (1 = xx, 2 = yy, 3 = zz, 4 = yz, 5 = xz, 6 = xy); e1–e3 length changes, e4–e6 angle changes with e_xy = ε_xy + ε_yx (engineering shear) | gives the six components and the factor-2 shear convention; the index-cycling diagram counts | core |

#### 1.5.2 Stress

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.5.2-01 | N p20; HW 5.1 | Stress = force per unit area (N/m² = J/m³); nomenclature X_y = force in x on the face with normal y; 9 components | defines the components with the index meaning; a cube figure with the stress arrows counts | core |
| 1.5.2-02 | N p20; HW 5.1 | Vanishing torque ⇒ X_y = Y_x, Y_z = Z_y, Z_x = X_z ⇒ σ symmetric, 6 independent components σ1…σ6 | states the symmetry with correct pairs (the notes write "Y_x = Z_y", a slip for Y_z = Z_y) | core |

#### 1.5.3 Hooke's law

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.5.3-01 | N p21 | Spring analogy F = kx; for small deformations stress ∝ strain, σ_αβ = Σ C_αβγδ ε_γδ with a rank-4 stiffness tensor | states the tensor law and the spring analogy | detail |
| 1.5.3-02 | N p22, p24; HW 5.1 | Voigt form σ = C e (6×6, C_ij in N/m²) and e = S σ with S = C⁻¹ the compliance (m²/N); index map C_xx,xx = C11, C_xx,zz = C13, … | states both matrix forms with correct names (p25 and its board mislabel S as "stiffness"; S is compliance) | core |
| 1.5.3-03 | N p24; HW 5.1, 5.2 | Cubic symmetry: 120° rotations about body diagonals cycle x→y→z ⇒ C11 = C22 = C33, C12 = C13 = C23, C44 = C55 = C66, other entries zero | argument plus result; must include C44 (the p24 line "all others vanish" omits it; the p25 matrix has it). The notes' list of cycles is incomplete; the lecturer flagged it as unsure | core |
| 1.5.3-04 | N p25 | Cubic stiffness matrix (C11, C12, C44) and data at 300 K: Cu 1.68, 1.21, 0.75; diamond 10.8, 1.25, 5.76 | shows the matrix and the values in units of 10¹¹ N/m² (notes and board omit the 10¹¹ factor) | detail |
| 1.5.3-05 | N p25; HW 5.1 | Stiffness–compliance relations: C11 − C12 = 1/(S11 − S12), C11 + 2C12 = 1/(S11 + 2S12), C44 = 1/S44 | states all three | core |
| 1.5.3-06 | HW 5.1(i) | Young's modulus and Poisson ratio for tension along [100] | worked solution: E = (C11 − C12)(C11 + 2C12)/(C11 + C12), ν = C12/(C11 + C12) | core |
| 1.5.3-07 | HW 5.1(ii) | Same for tension along [110] (side faces (1-10) and (001)) | worked solution: 1/E = (S11 + S12)/2 + S44/4, i.e. E = 4C44(C11 − C12)(C11 + 2C12)/[2C11C44 + (C11 − C12)(C11 + 2C12)], and two different Poisson ratios for the [1-10] and [001] directions (own derivation) | core |

#### 1.5.4 Elastic energy density

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.5.4-01 | N p22, p24 (board); HW 5.2 | Work of straining: du = σ·de = (Ce)·de ⇒ u = ½ eᵀCe (J/m³); comparison with σ = Ce gives C = Cᵀ ⇒ 21 independent constants (not 36) | derivation reaching u = ½ eᵀCe, C symmetric, 21 constants | core |
| 1.5.4-02 | HW 5.2 | Stability of a cubic crystal: u > 0 for every strain (positive-definite quadratic form) | worked solution: C44 > 0, C11 − C12 > 0, C11 + 2C12 > 0 | core |

#### 1.5.5 Bulk modulus

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.5.5-01 | N p25 (board photo only; part hidden by glare) | B = −V ∂p/∂V at constant T; u = ½ B δ²; uniform dilation e1 = e2 = e3 = δ/3 ⇒ B = (C11 + 2C12)/3 | derivation reaching B = (C11 + 2C12)/3 | detail |

### 1.6 Lattice vibration

#### 1.6.1 Simple linear chain

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.6.1-01 | N p26 | Motivation: what a static lattice cannot explain (T³ specific heat, thermal expansion, T-dependent electrical conductivity, thermal conductivity of insulators, IR reflectivity of ionic crystals, sound, superconductivity) | lists most of these phenomena | detail |
| 1.6.1-02 | N p26, p28 | Adiabatic approximation: electrons ~1000× lighter and faster (notes' wording) and instantly in their ground state for any ion arrangement ⇒ U depends only on ion positions; F(R,j) = −∂U/∂r(R,j) | states the assumption and the resulting force law | detail |
| 1.6.1-03 | N p27–28 | Assumptions: mean positions ⟨r(R,j)⟩ = R + v_j; small displacements u = r − (R + v_j) with ⟨u²⟩ ≪ r_NN² ⇒ harmonic U | states both assumptions | detail |
| 1.6.1-04 | N p27–28; HW 6.2 (hint quotes it) | Simple chain: U = Σ ½ f (u_l − u_{l+1})², force, EOM, plane-wave ansatz u = u0 e^{i(kx−ωt)} ⇒ boxed ω(k) = √(4f/m) abs(sin(ka/2)) | worked derivation reaching the boxed result (the notes' p27 potential shows "+" inside the square, a slip) | core |
| 1.6.1-05 | N p29 (board) | Dispersion figure: ω(k) periodic in 2π/a, maximum √(4f/m) at ±π/a, acoustic sound branch near Γ, first BZ marked | an interactive model or figure of ω(k) over at least two zones | core (via HW 6.2) |
| 1.6.1-06 | N p29 | Phase velocity v = ω/k = λν and group velocity v_gr = dω/dk (speed of acoustic signals); at the zone boundary v = √(4f/m)·a/π and v_gr = 0 (standing wave) | gives both velocities and the zone-boundary values | detail |
| 1.6.1-07 | N p30 | Long-wavelength limit k → 0: ω = √(f/m)·a·abs(k), constant sound velocity | states the linear limit and v = a√(f/m) | detail |
| 1.6.1-08 | HW 6.1 | l-th nearest-neighbour springs f_l | worked solution reaching ω(k) = 2[Σ_l f_l sin²(lka/2)/m]^{1/2} | core |

#### 1.6.2 Linear chain with basis

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.6.2-01 | N p30 | Chain with masses m1, m2 and equal springs f; a = repeat distance (same-type atoms), j = cell index; potential, forces, EOMs; hint to scale by 1/√m | sets up both EOMs | detail |
| 1.6.2-02 | N p31 | Ansatz (u1, u2) e^{i(kx−ωt)}; dynamical matrix D with diagonal 2f/m_i and off-diagonal −f(1 + e^{∓ika})/√(m1m2); eigenvalues λ = ω² from det(D − λ1) = 0 | gives a Hermitian D (the notes show e^{ika} in both off-diagonal entries and drop f in the determinant, both slips) | detail |
| 1.6.2-03 | TL (the notes stop at the determinant) | Solution: ω² = f(1/m1 + 1/m2) ± f√[(1/m1 + 1/m2)² − 4 sin²(ka/2)/(m1m2)]; acoustic and optical branches; gap at k = π/a | gives both branches and a figure or interactive of them with the gap | detail |

#### 1.6.4 Density of states

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.6.4-01 | N p38 (notes' 1.7.1.4); HW 6.2 | Phonon DOS per volume g(ω) = Σ_s ∫ δ(ω − ω_s(k)) d³k/(2π)³ = Σ_s ∮ dS/(abs(∇_k ω_s)·(2π)³); turns the k-sum into ∫F(ω) g(ω) dω | states the δ-function and the surface-integral forms, noting g is per volume (Kittel's D(ω) is per crystal) | core |
| 1.6.4-02 | N p38 (board) | DOS figure: Debye g ∝ 3ω²/(2π²c̄³) cut off at ω_D, Einstein δ(ω − ω_E), experimental aluminium DOS | figure comparing the Debye, Einstein and real DOS | detail |
| 1.6.4-03 | HW 6.2 | 1D DOS of the simple chain | worked solution g(ω) = (2/πa)·(ω_m² − ω²)^(−1/2) per length for 0 < ω < ω_m = √(4f/m), with the divergence at ω_m (own calc) | core |

#### 1.6.5 Phonons

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.6.5-01 | N p33 | Quantised modes E_n = ħω(n + ½); crystal energy Σ_{k,s} ħω_s(k)(n_s(k) + ½); crystal momentum ħ(k + G) | states the quantisation and that phonon momentum is defined up to ħG | detail |

#### 1.6.6 Measurement of phonons

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.6.6-01 | N p33 | Inelastic neutron scattering maps the full first BZ; Raman reaches only optical phonons near k ≈ 0 | states both methods and their k-range | detail |

### 1.7 Thermal properties of solids

#### 1.7.1 Lattice specific heat (using statistical physics)

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.7.1-01 | N p33 | Canonical probabilities p_i = e^{−βE_i}/Σ e^{−βE_j}; a QM state is a set {n_s(k)} (3nN integers); partition function as a product of geometric series Z = Π_{k,s} e^{−βħω/2}/(1 − e^{−βħω}) | derivation reaching the product form of Z | detail |
| 1.7.1-02 | N p34, p36 | u = −(1/V)∂ln Z/∂β ⇒ u = u_eq + (1/V)Σ ħω_s(k)[1/(e^{βħω} − 1) + ½] (Bose–Einstein factor plus zero-point term); classical u = u_eq + 3n k_B T with n_at = Nn/V | reaches the Bose–Einstein form and names both terms | detail |
| 1.7.1-03 | N p34 (board), p36; HW 7.1 | General specific heat c_v = (∂u/∂T)_V = (k_Bβ²/V) Σ (ħω)² e^{βħω}/(e^{βħω} − 1)² (★) | states (★) | core (via HW 7.1) |
| 1.7.1-04 | N p34 (board), p36 | Sketch of c_v(T): ∝ T³ at low T, saturating at 3n k_B (Dulong–Petit) | figure or interactive of c_v(T) with both limits marked | detail |

#### 1.7.1.1 High temperature limit

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.7.1.1-01 | N p34 (board), p36 | k_BT ≫ ħω: expand x²eˣ/(eˣ − 1)² = 1 − x²/12 + … ⇒ c_v = 3Nn k_B/V + O(1/T²) quantum corrections (Dulong–Petit) | derivation reaching the Dulong–Petit value and the sign of the first correction | detail |

#### 1.7.1.2 Low temperature limit

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.7.1.2-01 | N p35, p36; HW 7.1; HW 9.1 | Only acoustic modes ω_s = c_s(k̂)k contribute; extend to infinity; ∫x³/(eˣ − 1) = π⁴/15 ⇒ boxed c_v = (2π²/5) k_B (k_BT/ħc̄)³, with 1/c̄³ = (1/3)Σ_s ∫dΩ/(4π c_s³) | derivation reaching the T³ law with c̄ defined (equivalent to Kittel's (12π⁴/5)Nk_B(T/θ)³ per crystal) | core |
| 1.7.1.2-02 | N p35 | Claim: agreement with experiment better than 1 % in alkali halides (unsourced in the notes) | mentions experimental confirmation of the T³ law | detail |
| 1.7.1.2-03 | HW 7.1 | Layer lattice with rigid interlayer coupling: in-plane motion only ⇒ 2D Debye | worked solution showing c ∝ T² | core |

#### 1.7.1.3 Intermediate temperature limit

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 1.7.1.3-01 | N p36; HW 7.2 | Debye model: 3 acoustic branches ω = c_s k; replace the BZ by a sphere of equal volume (2π)³N/V ⇒ k_D = (6π²N/V)^{1/3} | states both assumptions and k_D | core |
| 1.7.1.3-02 | N p36 (board) | Figure: real dispersion branches versus the linear Debye approximation | figure contrasting ω_s(k) with the c_s·k lines | detail |
| 1.7.1.3-03 | N p37 (board, partly shadowed); HW 7.2; HW 9.1 | ħω_D = ħc̄k_D = k_BΘ_D; c_v^Debye = 9(N/V)k_B(T/Θ_D)³ ∫₀^{Θ_D/T} x⁴eˣ/(eˣ − 1)² dx; correct high and low limits; Θ_D plays a role like ε_F for electrons; misses optical phonons | gives the Debye integral and Θ_D, shows both limits | core |
| 1.7.1.3-04 | N p37 | Einstein model: one 3-fold ω_E per atom, independent of k; c_v = (3N/V)k_B(βħω_E)² e^{βħω_E}/(e^{βħω_E} − 1)²; Θ_E = ħω_E/k_B; T ≫ Θ_E gives Dulong–Petit; T ≪ Θ_E drops exponentially (experiment: T³) | gives the formula and both limits, and states the low-T failure | detail |
| 1.7.1.3-05 | N p38 | Combined model for an n-ion basis: Debye for the 1 acoustic set, Einstein for the n − 1 optical sets; sketch | states the 1 : n − 1 weighting with a figure | detail |
| 1.7.1.3-06 | HW 7.2(i) | Estimate Θ_D of diamond from the Touloukian–Buyco log-log c_V(T) plot | worked estimate with the method stated (fit of the T³ region or match to the Debye curve; units cal g⁻¹ K⁻¹) | core |
| 1.7.1.3-07 | HW 7.2(ii) | Compare with the literature value 2250 K (simulation 2240 K) and comment | discusses why the estimate differs (Θ_D depends on T and the fit range; Debye is exact only at low T; read-off error) | core |

## 2. Electronic properties of materials

### 2.1 Free electron theory

#### 2.1.1 Boundary conditions

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.1.1-01 | N p41; EX Q2c | (i) hard walls, ψ = 0 at the box walls; (ii) periodic, ψ(x + L, y, z) = ψ(x, y, z) ⇒ k_i = 2πn_i/L ⇒ k-space volume per k-point (2π)³/V (the k-points form a simple cubic grid) | states both BCs, the quantised k and (2π)³/V | core |

#### 2.1.2 Free electron solution of Schrödinger equation

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.1.2-01 | N p39; EX Q2a | N electrons in a cube V = L³; −(ħ²/2m)∇²ψ = Eψ with p = (ħ/i)∇ | states the single-electron equation | core |
| 2.1.2-02 | N p39, p41; EX Q2b | Normalised solution ψ_k = V^(−1/2) e^{ik·r}; E_k = ħ²k²/2m; p = ħk, v = ħk/m, λ = 2π/k | gives normalisation and all four relations; for Q2b, identifies the lowest-kinetic-energy state with the BC stated (k = 0 for periodic BCs) | core |

#### 2.1.3 Filling the Fermi sphere

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.1.3-01 | N p41; EX Q2d | Fill up to k_F = (3π²N/V)^{1/3}, i.e. n = k_F³/3π² (spin factor 2 included); ε_F = ħ²k_F²/2m | derivation counting 2 × (4π/3)k_F³/((2π)³/V) = N, reaching n = k_F³/3π² | core |
| 2.1.3-02 | N p41 | DOS D(ε) = dN/dε = (V/2π²)(2m/ħ²)^{3/2}√ε = (3/2)N/ε at ε_F; g = D/V | gives D(ε) and a √ε figure | core (via HW 8.3) |
| 2.1.3-03 | HW 8.1 | Liquid ³He (spin ½, 0.081 g/cm³): Fermi energy and temperature | worked solution: n ≈ 1.62×10²⁸ m⁻³, ε_F ≈ 4.2×10⁻⁴ eV, T_F ≈ 4.9 K (own calc) | core |

#### 2.1.4 Total energy of electron gas

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.1.4-01 | N p41 | Ground-state energy U = (3/5) V n_e ε_F = (3/5)Nε_F > 0 at T = 0 | derivation or statement of 3/5 Nε_F | detail |

#### 2.1.5 Pressure of electron gas

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.1.5-01 | N p41 | p = −∂U/∂V at fixed N = (2/3)U/V > 0 even at T = 0 | derivation via U ∝ V^(−2/3) reaching (2/3)U/V | detail |

#### 2.1.6 Specific heat of electron gas

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.1.6-01 | N p41; HW 9.1 | U = ∫ f_FD ε D(ε) dε ⇒ c_v = (π²/2)(k_BT/ε_F)N k_B ∝ T for k_BT ≪ ε_F (note: total, not per volume) | states the result and why only electrons within ~k_BT of ε_F contribute | core |
| 2.1.6-02 | N p41, p42 | Metals: c_v = γT + AT³ (electrons + phonons); the notes' sketch compares the classical plateau with the linear electron term (p42 writes "γT + AT", missing the cube) | states γT + AT³ with a figure or a c/T vs T² plot | core (via HW 9.1) |
| 2.1.6-03 | N p42 (board) | Table: Na, Au, Al valence Z, n_e (10²³ cm⁻³), γ_free vs γ_exp (10⁻⁴ cal mol⁻¹ K⁻²): Na 0.265, 2.6 vs 3.5; Au 0.590, 1.5 vs 1.6; Al 1.81, ~2.2 vs 3.0 | reproduces the comparison and comments on γ_exp/γ_free (effective mass) | detail |
| 2.1.6-04 | HW 8.2 | 2D electron gas chemical potential with D = A m_e/(πħ²) | worked solution reaching μ = k_BT ln[exp(πħ²N/(m_e k_B T A)) − 1] | core |
| 2.1.6-05 | HW 8.3 | Entropy from C_V = T(∂S/∂T)_V and U = ∫ f ε D dε | worked solution reaching S = −k_B ∫ [f ln f + (1 − f) ln(1 − f)] D(ε) dε | core |
| 2.1.6-06 | HW 9.1(i) | Electron–phonon heat-capacity cross-over γT = AT³ for Cu, with data sources, assumptions and formulas stated | worked solution T* = √(γ/A), A = 12π⁴Nk_B/(5Θ_D³), sources named; ≈ 3.8 K with Kittel table data (γ = 0.695 mJ mol⁻¹ K⁻², Θ_D = 343 K) (own calc; other data shift it) | core |
| 2.1.6-07 | HW 9.1(ii) | Same for Na | worked solution as above; ≈ 1.7 K with Kittel data (γ = 1.38, Θ_D = 158 K) (own calc) | core |
| 2.1.6-08 | HW 9.1(iii) | Same for Al | worked solution as above; ≈ 7.4 K with Kittel data (γ = 1.35, Θ_D = 428 K) (own calc) | core |

### 2.2 Boltzmann equation, relaxation/collision time

#### 2.2.1 Boltzmann transport equation

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.2.1-01 | N p42 | Transport = driving force + dissipation; equilibrium f_FD(ε_n(k)); non-equilibrium f(r, k, t); backward trajectory r − v dt, k − F dt/ħ; f(r,k,t) = f(r − v dt, k − F dt/ħ, t − dt) + (∂f/∂t)_s dt ⇒ ∂f/∂t + v·∇_r f + (F/ħ)·∇_k f = (∂f/∂t)_s | derivation reaching the boxed Boltzmann equation | core (via HW 9.2) |
| 2.2.1-02 | N p42 | The scattering term contains transition probabilities ∝ abs(⟨n'k'∣H'∣nk⟩)² (H = H0 + H'), too hard in general, hence approximations | states why an approximation is needed | detail |

#### 2.2.2 Relaxation time approximation

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.2.2-01 | N p43, p45; HW 9.2(i) | (∂f/∂t)_s = −(f − f0)/τ; 1/τ = scattering rate, τ = mean time between collisions | states the ansatz **with the minus sign** (the handwritten p43 line omits it; the board and p45 have it) | core |
| 2.2.2-02 | N p43 (board) | Example: static field switched off at t = 0 ⇒ f = f0 + (f_st − f0)e^{−t/τ} | worked example with a figure of the decay | detail |
| 2.2.2-03 | HW 9.2(i) | Time-dependent homogeneous force F(t) on a free-electron metal | worked solution showing f_E(t, k) = f0(t − τ, k − τF/ħ) | core |

#### 2.2.3 Electrical conductivity

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.2.3-01 | N p43, p45 | Static E: first-order solution f_st(k) = f0(k − τ(−e)E/ħ), so the whole Fermi sphere is shifted by Δk = −eEτ/ħ | derivation of the shifted distribution | core (via HW 9.2) |
| 2.2.3-02 | N p44 | Figure: shifted Fermi sphere in (k_x, k_y), with emptied states on one side and newly occupied states on the other, plus the shifted f(k_x) step | a figure or interactive of the displaced Fermi sphere | detail |
| 2.2.3-03 | N p44, p45 (board) | j = (−e/V)·2·Σ v_k f_st(k); only states near ε_F contribute (∂f0/∂ε ≈ −δ(ε − ε_F)) ⇒ σ = ne²τ/m; mobility μ = eτ/m, σ = neμ; ρ = 1/σ; units A/(V m) and Ω m | derivation reaching σ = ne²τ/m and σ = neμ (p44 drops one factor e and the board writes σ = n·μ; both are slips) | core |
| 2.2.3-04 | HW 9.2(ii) | AC conductivity from m(d/dt + 1/τ)v = F | worked solution reaching σ(ω) = σ_DC/(1 + iωτ), with the e^{+iωt} convention stated (Kittel's e^{−iωt} gives 1 − iωτ) | core |

#### 2.2.4 Ohm's law

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.2.4-01 | N p45, p49 | Block of length L, area A: j = I/A = σE, φ(x) = −(V/L)x ⇒ V = RI with R = ρL/A (macroscopic); j = σE (microscopic) | derives the macroscopic form from the microscopic one | detail |

### 2.4 Metals

#### 2.4.1 Conductivity of metals

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.4.1-01 | N p46 | Electron–ion collisions excite phonons; at 300 K phonon scattering dominates, at low T defects dominate; 1/τ ∝ Σ·v_F (cross-section times v_F, which is T-independent) | states the scattering picture | detail |
| 2.4.1-02 | N p46, p49 | Matthiessen's rule: 1/τ = 1/τ_ph + 1/τ_i ⇒ ρ = ρ_ph(T) + ρ_i; ρ_i T-independent; ρ_ph ∝ T for T ≫ Θ_D (Σ ∝ ⟨u²⟩ ∝ k_BT), ∝ T⁵ for T ≪ Θ_D | states the rule and both power laws | detail |
| 2.4.1-03 | N p46 | Figure ρ(T): residual resistivity plus a phonon rise | a figure or interactive of ρ(T) with the residual plateau | detail |
| 2.4.1-04 | N p46 | Mean free path l = v_F τ, can be large (high-purity Cu at 4 K: l ~ 0.3 cm) | states l = v_F τ with the example | detail |

#### 2.4.2 Umklapp processes

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.4.2-01 | N p47, p49 | Electron–phonon scattering k' = k + q + G; normal process G = 0; Umklapp G ≠ 0 (board: G = −(2π/a)x̂) reverses the electron's momentum | states the conservation law and distinguishes normal from Umklapp | detail |
| 2.4.2-02 | N p47 (sketch and board) | Extended-zone figure: Fermi circles centred at 0 and 2π/a, zone boundaries at π/a and 3π/a; q must exceed a minimum, so no Umklapp at small q | figure showing the minimum q and the k + q leaving the zone and folding back | detail |
| 2.4.2-03 | N p47 | Umklapp hinders electrical and thermal conductivity; per the lecture it appears at higher T where large-q phonons exist (Kittel stresses its role at low T, frozen out only as e^{−θ_U/T}) | states the effect on conductivity; notes the difference from Kittel | detail |

### 2.5 Wiedemann–Franz law and thermal/electric conductivities

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.5-01 | N p48, p49 | Heat flux j_u = κ(−∇T); kinetic theory κ = (1/3) v C l with v = v_F, C = electron heat capacity per volume, l = v_Fτ ⇒ κ = π²k_B²nτT/(3m) | derivation reaching κ = π²nk_B²Tτ/3m | detail |
| 2.5-02 | N p48 | κ/σ = π²k_B²T/(3e²) ∝ T; Lorenz number L = π²k_B²/(3e²) | states the ratio and L (≈ 2.45×10⁻⁸ W Ω K⁻² as the numerical value, which the notes do not give) | detail |

### 2.6 Energy bands

#### 2.6.1 Bloch theorem

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.6.1-01 | N p50 | From the box picture to a periodic potential: sum of ionic Coulomb wells, U(r) = U(r + R); H = −(ħ²/2m)∇² + U(r); "Bloch electrons" | figure of the periodic potential and the Hamiltonian | detail |
| 2.6.1-02 | N p51 ("EXAM RELEVANT"); EX Q4a | Bloch theorem: ψ_{n,k}(r) = u_{n,k}(r)e^{ik·r} with u periodic ⇔ ψ(r + R) = e^{ik·R}ψ(r); band index n | states both forms and that u has the lattice period | core |
| 2.6.1-03 | N p51; EX Q4a | Bloch states are not momentum eigenstates: (ħ/i)∇ψ = ħkψ + e^{ik·r}(ħ/i)∇u; ħk is crystal momentum | shows the extra term and calls ħk crystal momentum | core |
| 2.6.1-04 | N p52; EX Q4a | k-space periodicity: k' = k + G gives the same solutions (e^{iG·R} = 1) ⇒ restrict k to the first BZ | states ψ_{k+G} ≡ ψ_k and the reduction to the first BZ | core |
| 2.6.1-05 | N p52–53 | Equation for u: (ħ²/2m)((1/i)∇ + k)²u + U u = ε_{n,k} u (★★); finite volume ⇒ discrete n; ε_{n,k} continuous in k; reduced vs repeated (redundant) zone schemes | states (★★) with U outside the ħ²/2m factor (the notes put U inside, a slip) and the discrete-n / continuous-k statement | detail |

#### 2.6.2 Nearly free electron model

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.6.2-01 | N p53 (notes' 2.6.3 "weak periodic potential") | Fourier expansion: 1D U(x) = Σ γ_n e^{i2πnx/a}; 3D U(r) = Σ_G U_G e^{iG·r}; ψ_k = Σ_G C_{k−G} e^{i(k−G)·r} | gives the expansions of U and ψ | detail |
| 2.6.2-02 | N p54 | Central equation: [ħ²(k − G)²/2m − ε]C_{k−G} + Σ_{G'} U_{G'−G} C_{k−G'} = 0, with ε⁰_{k−G} the kinetic term (Kittel: (λ_k − ε)C(k) + Σ_G U_G C(k − G) = 0; equivalent after relabelling) | states the central equation (the notes' preceding line writes −(ħ/2m)∇ for −(ħ²/2m)∇², and the second C index is unclear) | detail |
| 2.6.2-03 | N p52 (figure); EX Q4f | Band structure E(k) in the extended zone: free-electron parabola versus bands 1 and 2 with gaps at ±π/a; first BZ marked | an interactive model or figure of E(k) with the gaps at the zone boundary, overlaid on the free parabola | core |
| 2.6.2-04 | EX Q4c | Free-electron (empty-lattice) band structure along [100] folded periodically | sketch or interactive of E = ħ²(k − G)²/2m folded into the first BZ along [100] | core |
| 2.6.2-05 | EX Q4d | First two energies at k0 = (0,0,0) and k1 = (π/2a, 0, 0) in the empty lattice | worked solution E = ħ²(k − G)²/2m for the two smallest (k − G), with the lattice stated (e.g. sc: k0 → 0 and ħ²(2π/a)²/2m; k1 → ħ²(π/2a)²/2m and ħ²(3π/2a)²/2m) | core |
| 2.6.2-06 | EX Q4e; N p53 | A weak periodic potential calls for the nearly free electron approximation | names NFE and says why (U_G small compared with the kinetic energy) | core |
| 2.6.2-07 | EX Q4f; TL (the notes stop before this) | Gap at the zone boundary: two-plane-wave mixing of k and k − G gives E = ε⁰ ± abs(U_G), so E_g = 2 abs(U_G); compare with the free case | derives or states E_g = 2 abs(U_G) and compares the sketch with the free-electron one (the exam's "compare to b)" presumably means part c) | core |

#### 2.6.3 Tight binding model

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.6.3-01 | TL only | Tight binding: Bloch sum of atomic orbitals; e.g. sc s-band E(k) = E0 − α − 2γ(cos k_x a + cos k_y a + cos k_z a); bandwidth 12γ | gives a tight-binding E(k) and its bandwidth | detail |

### 2.7.7 Thermoelectric effects

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.7.7-01 | EX Q3a | Linear-response expressions for current density and energy (heat) flux in terms of E and ∇T | states j = L11E + L12(−∇T) and j_u = L21E + L22(−∇T) (or the equivalent σ, Q, Π form) | core |
| 2.7.7-02 | EX Q3b | Definitions of the Peltier coefficient Π (heat current per electric current at ∇T = 0) and the absolute thermopower Q (E = Q∇T at j = 0); Kelvin relation Π = QT | states both definitions with their conditions | core |

### 2.8 Magnetic properties

#### 2.8.1 Hamilton operator for electron in a magnetic field

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.8.1-01 | TL only | H = (p + eA)²/2m + V + spin Zeeman term; split into the paramagnetic (A·p) and diamagnetic (A²) parts | gives H with the minimal-coupling vector potential and names both parts | detail |

### 2.9 Dielectrics

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 2.9-01 | TL only (no subsections) | Polarisation P, D = ε0E + P, susceptibility and dielectric constant, local field (Clausius–Mossotti) | defines P, χ and ε_r and states the local-field relation | detail |

## 3. Semiconductor devices

### 3.1 Semiconductors

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 3.1.1-01 | TL only | Quantum theory of electrons in semiconductors (band picture: filled valence band, empty conduction band, gap E_g) | explains why a filled band does not conduct and what E_g is | detail |
| 3.1.2-01 | TL only | Band structure near the band edges and effective mass 1/m* = (1/ħ²)d²E/dk²; direct vs indirect gap | defines m* from the curvature and distinguishes direct and indirect gaps | detail |
| 3.1.3-01 | TL only | Currents in bands; holes as missing electrons with positive charge and m_h = −m*_e at the valence-band top | explains the hole concept and why a full band carries no current | detail |
| 3.1.4-01 | TL; used by EX Q5b | Effective density of states N_c = 2(m_e* k_BT/2πħ²)^{3/2} (same for N_v), n = N_c e^{−(E_c − μ)/k_BT} | gives N_c and N_v and the Boltzmann-approximation n and p | core (via EX Q5b) |
| 3.1.5-01 | EX Q5a | Intrinsic semiconductor at T = 0 | states n = 0 (full valence band, empty conduction band) | core |
| 3.1.5-02 | EX Q5b; TL | Intrinsic carrier density at 300 K: n_i = √(N_cN_v) e^{−E_g/2k_BT} (law of mass action np = n_i²) | worked value for Si (~10¹⁰ cm⁻³) with the formula | core |
| 3.1.6-01 | EX Q5c | Choice of dopant for Si to raise the electron density | names a group-V donor (P, As or Sb) and explains the extra electron and the shallow donor level | core |
| 3.1.6-02 | EX Q5d | Carrier concentrations after doping | n ≈ N_D (full ionisation), p = n_i²/N_D | core |
| 3.1.7-01 | EX Q5e; TL | Conductivity of the doped material; drift (and diffusion) current equations | σ = e(nμ_n + pμ_p) ≈ eN_Dμ_n; states the drift-diffusion current j = e(nμ_nE + D_n∇n) (and the hole analogue) | core |
| (note) | EX Q5 | The exam calls the lattice "FCC"; Si is diamond = fcc + 2-atom basis (1.1.5-05) | — | — |

### 3.2.2 P-N junctions

| ID | Source | What must be covered | Pass criterion | Tier |
|---|---|---|---|---|
| 3.2.2-01 | TL | p-n junction in equilibrium: depletion region, built-in voltage V_bi, band diagram; diode I–V (Shockley) | band-diagram figure plus V_bi and I = I_s(e^{eV/k_BT} − 1) | core (via EX Q6) |
| 3.2.2-02 | EX Q6a | Solar cell, LED and laser diode: requirements and operating conditions | SC: illumination, operation in the power-generating quadrant; LED: forward bias, radiative recombination (direct gap); LD: forward bias plus population inversion and an optical cavity (stimulated emission) | core |
| 3.2.2-03 | EX Q6b | Solar cell with V_bi = E_g: main losses | names thermalisation of above-gap photons, non-absorption of sub-gap photons, and recombination / voltage loss | core |
| 3.2.2-04 | EX Q6c | Solar-cell efficiency from a given solar spectrum | worked method: absorbed photon flux above E_g × usable energy per photon ÷ incident power (detailed-balance style) | core |

---

## Coverage counts

| TL subsection | Items | core | detail |
|---|---|---|---|
| 1.1.1 | 10 | 8 | 2 |
| 1.1.2 | 11 | 8 | 3 |
| 1.1.3 | 10 | 7 | 3 |
| 1.1.5 | 11 | 8 | 3 |
| 1.3.1 | 4 | 0 | 4 |
| 1.3.2 | 8 | 5 | 3 |
| 1.3.3 | 7 | 2 | 5 |
| 1.3.5 | 4 | 4 | 0 |
| 1.4.1 | 5 | 5 | 0 |
| 1.4.2 | 3 | 3 | 0 |
| 1.4.3 | 1 | 0 | 1 |
| 1.4.4 | 2 | 2 | 0 |
| 1.4.5 | 2 | 0 | 2 |
| 1.5.1 | 4 | 3 | 1 |
| 1.5.2 | 2 | 2 | 0 |
| 1.5.3 | 7 | 5 | 2 |
| 1.5.4 | 2 | 2 | 0 |
| 1.5.5 | 1 | 0 | 1 |
| 1.6.1 | 8 | 3 | 5 |
| 1.6.2 | 3 | 0 | 3 |
| 1.6.4 | 3 | 2 | 1 |
| 1.6.5 | 1 | 0 | 1 |
| 1.6.6 | 1 | 0 | 1 |
| 1.7.1 | 4 | 1 | 3 |
| 1.7.1.1 | 1 | 0 | 1 |
| 1.7.1.2 | 3 | 2 | 1 |
| 1.7.1.3 | 7 | 4 | 3 |
| 2.1.1 | 1 | 1 | 0 |
| 2.1.2 | 2 | 2 | 0 |
| 2.1.3 | 3 | 3 | 0 |
| 2.1.4 | 1 | 0 | 1 |
| 2.1.5 | 1 | 0 | 1 |
| 2.1.6 | 8 | 7 | 1 |
| 2.2.1 | 2 | 1 | 1 |
| 2.2.2 | 3 | 2 | 1 |
| 2.2.3 | 4 | 3 | 1 |
| 2.2.4 | 1 | 0 | 1 |
| 2.4.1 | 4 | 0 | 4 |
| 2.4.2 | 3 | 0 | 3 |
| 2.5 | 2 | 0 | 2 |
| 2.6.1 | 5 | 3 | 2 |
| 2.6.2 | 7 | 5 | 2 |
| 2.6.3 | 1 | 0 | 1 |
| 2.7.7 | 2 | 2 | 0 |
| 2.8.1 | 1 | 0 | 1 |
| 2.9 | 1 | 0 | 1 |
| 3.1.1 | 1 | 0 | 1 |
| 3.1.2 | 1 | 0 | 1 |
| 3.1.3 | 1 | 0 | 1 |
| 3.1.4 | 1 | 1 | 0 |
| 3.1.5 | 2 | 2 | 0 |
| 3.1.6 | 2 | 2 | 0 |
| 3.1.7 | 1 | 1 | 0 |
| 3.2.2 | 4 | 4 | 0 |
| **Total** | **190** | **115** | **75** |

Subsections whose only source is the topic list: 2.6.3, 2.8.1, 2.9, 3.1.1, 3.1.2, 3.1.3. 1.4.3 has only a one-word mention in the notes (p18). 3.1.4 is TL-only but is needed for EX Q5b.

Evidence gaps that an auditor should not read as "covered by the course": the notes have no binding lecture (p17 "?"), no solved two-atom chain, no NFE gap result, no structure factor, nothing past 2.6.2 (p55 blank), and missed lectures on p5, p32 and p40. Semiconductor and diode items rest only on TL and the alumni exam reconstruction.
