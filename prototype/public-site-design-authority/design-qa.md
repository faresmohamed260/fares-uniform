# Design QA

## 2026-09-29 — KGC client banner reference match

- Reference: `ChatGPT Image Sep 29, 2026, 01_22_23 AM.png` at 1672 × 941.
- Exact UI source: `e4c194e9ad2cf065edd26a112c0dcd4b8b95ffc5`.
- Protected preview: `https://fares-uniform-design-authority-364pu0cuv.vercel.app/en#work`.
- Design run/job: `36500288883` / `109189555553`; 13/13 browser tests passed.
- Design artifact: `11005250988`, `sha256:3385e0831b879b180adb20d160b317c125db16bcde79f770e0a6f3f910cfe520`.
- Full-candidate run/job: `36500146534` / `109188803076`; passed.
- Full-candidate artifact: `11005355814`, `sha256:46f9661bcc1f0bfce638029c28ee7cd4111e6d784b5ec679af8a3380fc8b3d8b`.

### Mismatch ledger

- P0: none.
- P1: resolved — crest scale/placement, copy stack, campus crop, cohort framing, and narrow navy edge match the approved composition.
- P2: resolved — handwritten notes and client conveyor remain removed; unchanged header retained.
- Responsive: verified at 1672 × 941 and 390 × 844.
- Locale: Arabic RTL verified with zero horizontal overflow.
- Motion/accessibility: reduced-motion and keyboard matrices passed in hosted CI.
- Runtime media: reference screenshot is not used; campus, crest, and student cohort remain independent browser-native layers.

Final result: passed.
## 2026-09-29 — Wide-screen scaling regression correction

- Regression evidence: user capture at `2560×1440` showed a fixed 1020px cohort container pushing the students into the right edge while the crest remained capped at 330px.
- Fix: exact UI source `a266b185999ef08646a827b5f43b07982c205a0a` removes the fixed cohort-container cap and scales the crest fluidly through 500px.
- Protected preview: `https://fares-uniform-design-authority-6po9ht03n.vercel.app/en#work`.
- Design run/job: `36507083242` / `109211047356`; 13/13 passed.
- Design artifact: `11007164440`, `sha256:88960032a4e8955ab0fa909b4947d5a84ff99be023038bb260aafc0748fb0638`.
- Full-candidate run/job: `36506931442` / `109210333127`; passed.
- Full-candidate artifact: `11007502333`, `sha256:85671f3f4ededc6bd702955d61802cc9e64866b237334c49e0f0fdf7d24e2bd8`.
- Rendered checks: `2560×1440`, `1672×941`, and `390×844`; zero horizontal overflow. One pre-existing Scrollcraft process-stage warning remains unrelated to H04.

Final result: passed.