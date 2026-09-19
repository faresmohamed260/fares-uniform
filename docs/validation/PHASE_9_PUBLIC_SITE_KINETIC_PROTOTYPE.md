# Phase 9 validation — public-site kinetic prototype

Status: **TECHNICAL GREEN / VISUAL FIDELITY NOT YET COMPLETE / HUMAN KINETIC APPROVAL OPEN, 2026-09-18.**

Branch: `phase-9/public-site-kinetic-prototype`  
Pull request: [#7](https://github.com/faresmohamed260/fares-uniform/pull/7)  
Implementation authority: `fc6a3e4359aa9c407901fdcf58282dc64ff2d8d1`  
Production status: **NO-GO; no deployment performed.**

## Scope proved

The isolated `prototype/public-site-motion` surface proves:

- a stable Fares-led shell that is not KGC-branded;
- typed organization, program, cohort, look and garment fixtures;
- four KGC school cohorts and a distinct three-role synthetic hospitality project;
- project-scoped colors and motifs;
- shared-versus-cohort-specific garment state;
- reversible inspect, explode and reassemble behavior;
- English LTR and Arabic RTL;
- desktop and mobile compositions;
- keyboard focus, practical touch targets and no horizontal overflow;
- reduced-motion information and state parity;
- no price, stock, private Odoo route, client binary or provider dependency.

`apps/public-web`, Odoo addons, public APIs, Vercel, Supabase, Cloudflare and production were not changed.

## RED evidence and repair

Initial pull-request run `35392060535`, job `105752429801`, reached the browser gate after locked install, typecheck and production build passed. Four of five Playwright journeys passed. The reduced-motion journey failed because Motion's media hook remained false under the hosted browser's emulated `prefers-reduced-motion` state.

The test was not weakened. Commit `62c86e4ac088f7edbe9bcee412c0dbda71fb3e0d` replaced the unreliable observation with a direct, subscribed `matchMedia("(prefers-reduced-motion: reduce)")` hook. Run `35392256674`, job `105753049690`, then passed all five journeys.

The initial failure artifact is `10565994428`; its digest is `sha256:dffbc5e14c1c7e2232689f00449e4054f862c4b73d2db7c57e2cf5d234e4001e`.

## Final hosted authority

Run `35392671483`, job `105754360569`, at exact branch head `04e0036786ad23926765daefd16d80f0ad025e4e`:

- exact candidate checkout: PASS;
- locked `npm ci`: PASS;
- TypeScript typecheck: PASS;
- optimized Next.js production build: PASS;
- Chromium installation: PASS;
- Playwright: **5 passed, 0 failed**;
- artifact upload: PASS.

Final artifact:

- ID: `10566840263`;
- name: `phase9-public-site-motion-b421cd0763dd9adb0b1de33a8be8d6dd30d6bebb`;
- digest: `sha256:8d0d98d743955b551a5bee6f587b06543c7bfc2c8b6016608199950aa4a84f60`;
- retention: 14 days.

It contains:

- `phase9-desktop-en.png`;
- `phase9-desktop-en-exploded.png`;
- `phase9-mobile-en.png`;
- `phase9-mobile-ar.png`;
- five browser-interaction WebM videos;
- Playwright HTML report.

## Browser journeys

1. English desktop: select High/puffer, verify shared status, explode, capture, reassemble and check overflow.
2. Multi-organization: switch from KGC to the synthetic Harbor House fixture, verify three roles, select Kitchen/Utility and shared state.
3. Arabic mobile: verify RTL, switch organization/role, explode and check overflow.
4. English mobile: verify all key project/cohort/look/inspect/language controls retain at least 44px height and no overflow.
5. Reduced motion: emulate the OS preference, verify the page observes it, preserve explode state and retain the full layer list.

## Visual fidelity ledger

| Comparison point | Accepted concept | Hosted render | Result |
| --- | --- | --- | --- |
| Hero hierarchy | Large editorial serif headline with quiet chrome | Same hierarchy with generalized approved copy | PASS |
| Above-fold copy | Generalized Fares promise after multi-organization correction | Exact “Designed as one. Worn together.” and approved support copy | PASS |
| Color/motif | Bright paper, navy ink, KGC red/light-blue diagonals | Neutral Fares shell; KGC red/light-blue only inside its fixture | PASS |
| Work navigation | Stage/project continuity rather than generic cards | Editorial two-project rail; variable cohort and look rails | PASS |
| Inspection | Garment remains the focal object and separates into readable parts | Reversible seven-part synthetic garment study | PASS for kinetic structure |
| Responsive | Designed desktop and mobile continuation | Desktop, 390px English and 390px Arabic RTL captures | PASS |
| Motion | Transform/reassemble with reduced-motion alternative | Recorded project, cohort, look and explode/reassemble journeys; direct reduced-motion test | PASS technically |
| Media fidelity | Accepted frame used real KGC model/garment imagery | Synthetic vector garment studies only | INTENTIONAL DEVIATION — publication rights are not approved |

The static accepted concept and the hosted desktop/mobile captures were inspected side by side during validation. The first comparison proves the architecture and interaction model, but it does **not** reach the goal design yet.

Material differences that remain:

- the approved concept is photography-led; the prototype hero uses abstract planes;
- the approved concept's people/stage lineup is visual and editorial; the prototype project/cohort selection is more UI-like;
- the approved garment detail is tactile, layered product photography; the prototype uses a simplified synthetic vector study;
- the approved page carries richer material texture and image-to-type tension;
- the current motion is functionally verified, but its character still needs direct human review against the intended premium garment choreography.

These are active fidelity tasks, not accepted final deviations. Real KGC media remains rights-gated, so the next iteration must use rights-cleared or clearly synthetic high-quality editorial media without turning KGC into the global identity.

## Remaining human gate

Technical GREEN does not approve the kinetic or visual direction. The implementation must continue through repeated side-by-side comparison and correction until the approved goal design is reached. Fares then reviews the videos/captures and explicitly approves or requests changes. PR #7 remains draft. Production `apps/public-web` implementation, client-media publication and deployment remain separately gated.


## Fidelity checkpoint 2 — photography-led editorial media

Checkpoint commits:

- `cedc9c3d70e513544a61cb1869836a3be623ab6f` — added three rights-safe synthetic editorial WebP assets and integrated them into the hero, cohort story and garment-material section;
- `b6fac28680ebc40c6e36ac88ce9bd63f48e3e1a5` — corrected the comparison-discovered mobile failures by eagerly loading deep editorial media and tying the mobile cohort crop to the active cohort.

The images are synthetic review assets with no client logo, badge, real person, readable brand text or copied KGC binary. Repository sizes are approximately 94 KB for the Fares team hero, 63 KB for the cohort lineup and 74 KB for the garment detail.

Hosted authority for this checkpoint:

- run: `35395099067`;
- job: `105762011679`;
- result: locked install, typecheck, optimized build and **5/5 Playwright journeys PASS**;
- artifact: `10567363975`;
- artifact digest: `sha256:8e3fc5daf74f49fcc6fe54c9a69b1034a8a4050a2bfeb21e562fe79dffe4f0c1`.

Side-by-side comparison with the approved concept confirms the following material improvements:

- photography now leads the hero instead of abstract color planes;
- the KGC review fixture now has a visual four-cohort editorial progression;
- the lower page now carries tactile garment construction photography;
- desktop and mobile preserve the approved large-serif/garment-image tension;
- the mobile material image is visibly loaded and no longer renders as a blank frame.

The goal design is not reached yet. Active differences are:

- the hero photograph remains more boxed and smaller than the approved model-dominant composition;
- project and inspection controls still read more like a utility UI than an editorial garment story;
- the interactive explode state remains a simplified vector representation rather than tactile garment layers;
- final transition timing and settled geometry still require direct kinetic review.

The next fidelity checkpoint must correct those differences, rerender all review sizes/states and repeat the comparison before any approval claim.


## Fidelity checkpoint 3 — editorial scale, textile depth and continuity

Commits:

- `1bcb70626f8daadad7720337a8e133ba52a98bad` — expanded the hero media, removed the polite card treatment, blended its edge into the canvas and added textile light/shadow depth to interactive garment layers;
- `c05d4986b7d8fc84059520779514d7b7ddeaaa13` — added keyed garment transitions so cohort changes preserve a shared look while genuinely different looks exit and settle.

Hosted authority:

- run: `35396391616`;
- job: `105766086758`;
- result: locked install, typecheck, optimized build and **5/5 Playwright journeys PASS**;
- artifact: `10567194483`;
- digest: `sha256:0e32fd816773fe69c66138851cc920896015c04ee98c6c0d93a571bb103475ad`.

The approved concept and the new desktop/exploded renders were inspected side by side. Improvements:

- the hero photograph now dominates the right side and blends into the page edge rather than appearing as a small boxed card;
- first-viewport image/type balance is substantially closer to the approved composition;
- interactive garment parts carry directional shading and grounded depth;
- changing to a different garment has explicit origin/exit/settled states;
- changing cohort without changing a shared garment does not remount it;
- reduced-motion keeps the same states with zero-duration transitions.

Active differences remain:

- the inspection area still reads more like a design tool than the accepted editorial garment story;
- the animated vector garment and the photographic material section are not yet one continuous object;
- final timing and motion character require Fares's direct review.

The next checkpoint must integrate an assembled tactile garment into the inspection transition and repeat the hosted visual comparison.


## Fidelity checkpoint 4 — tactile assembled-to-exploded continuity

Commit:

- `b68f62355d5c9bb9afe071469f24b572f563195d` — added an optimized transparent assembled-jacket study and connected it to the reversible puffer explode/reassemble transition. The tactile image is restricted to jacket variants; unrelated organization looks retain their generic studies.

Hosted authority:

- run: `35397504763`;
- job: `105769588523`;
- result: locked install, typecheck, optimized build and **5/5 Playwright journeys PASS**;
- artifact: `10568028617`;
- digest: `sha256:d1c5ee64619258684ec5a86df0071fc670f3ed53f4e3b0ad696877654f66deba`.

The Playwright journey now proves the assembled image has loaded before triggering the explode state. Side-by-side inspection of the approved concept and fresh assembled/exploded desktop plus mobile renders confirms:

- the jacket first appears as a tactile, dimensional focal object rather than a vector diagram;
- the same inspection control reveals the construction-layer state and reverses cleanly;
- reduced motion retains both states with zero-duration transitions;
- the asset has no client logo, readable brand text or claimed production identity.

The goal design is still not complete. The principal visible gap is now the project/inspection area's utility-panel composition compared with the approved concept's quieter editorial storytelling. The next checkpoint must reduce control chrome, strengthen image/type hierarchy and then repeat hosted desktop, exploded, mobile and RTL comparison.


## Fidelity checkpoint 5 — editorial project inspection

Commit:

- `215fc4eb56b36a2c8372eb0716abdcc17a97560d` — replaced the three-column utility dashboard with a two-part editorial composition, enlarged the garment focal object, quieted selector chrome and generalized the synthetic-media disclosure.

Hosted authority:

- run: `35397983771`;
- job: `105771081853`;
- result: locked install, typecheck, optimized build and **5/5 Playwright journeys PASS**;
- artifact: `10569545805`;
- digest: `sha256:b6e1de33eb176980fe036da26420816fca9e016d81bde363f7fa087c03de373c`.

Fresh desktop assembled/exploded and English/Arabic mobile renders were inspected. The garment now owns the dominant right-hand field, the project narrative and selectors form one quiet left-hand column, and mobile/RTL continue without overflow or lost controls. The remaining visual discontinuity is the flatter synthetic exploded state compared with the assembled tactile jacket. The generic `/explodeview` route required by the approved design specification also remains to be implemented and verified.


## Fidelity checkpoint 6 — generic `/explodeview` route

Commit:

- `07851c13832b81ec80d829c8ae1f5316ebbdfc2a` — added the internal review route and generic initial-state contract for organization, program, cohort/role, look/garment and locale identifiers.

Hosted authority:

- run: `35398577951`;
- job: `105772981293`;
- result: locked install, typecheck, optimized build and **6/6 Playwright journeys PASS**;
- artifact: `10568922283`;
- digest: `sha256:941045e47b73b5d32f2fa1e0956d1da0c451ddd34aeedf02aa8bfc71d4ee238e`.

The new route journey loads `/explodeview?organization=harbor-house&program=guest-experience&role=facilities&garment=outerwear&lang=ar`, verifies RTL plus the exact organization/role/garment state, begins exploded, reassembles, checks overflow and captures `phase9-explodeview-ar.png`. This proves the route contract does not embed KGC identifiers or a four-stage assumption.

The visual compare still identifies the puffer's flat synthetic exploded parts as the largest remaining mismatch against the tactile assembled jacket. The next checkpoint must create a rights-safe transparent exploded garment treatment, integrate it only where semantically valid and repeat the full hosted comparison.


## Fidelity checkpoint 7 — tactile exploded jacket

Commit:

- `f8a93e7c5535a005304205c4f4d704025a43bb2a` — added a 125 KB rights-safe transparent exploded-jacket WebP, cross-faded it with the assembled jacket only for jacket variants, retained generic vector studies for other looks and added an image-load assertion before exploded capture.

Hosted authority:

- run: `35413696049`;
- job: `105818088484`;
- result: locked install, typecheck, optimized build and **6/6 Playwright journeys PASS**;
- artifact: `10575710100`;
- digest: `sha256:930e74d6a2b35755636dc7d5c3a8809e16edaf399a50735abaca77a56df7c08e`.

Fresh desktop assembled/exploded and English mobile renders were compared with the accepted concept. The puffer now retains real fabric, stitching, ribbing, seams, depth and matching navy/warm-white/coral/light-blue material language in both settled states. Dense frame extraction from the hosted 5.4-second desktop recording confirms the selected-look transition, tactile explode cross-fade and reassembly all reach coherent settled frames without losing controls. Reduced-motion retains immediate state parity.

This closes the largest documented material-fidelity mismatch in the prototype without using a client binary or implying that the asset represents every look. The implementation remains a synthetic review prototype. Fares's direct kinetic/design approval is still required before PR #7 can leave draft or any production `apps/public-web` work can be authorized.


## Fidelity checkpoint 8 — authorized KGC identity and campus context

Commit:

- `fc6a3e4359aa9c407901fdcf58282dc64ff2d8d1` — integrated the canonical KGC crest and campus photo as optimized project-scoped WebP assets, added localized identity metadata and verified the assets are absent from Harbor House.

Source assets:

- crest Drive ID: `110AOiPx9NtX86ig5JvpnJRlRlBP6vZgX`;
- campus Drive ID: `1r4J7nLGevkjGy9EkghM1uTP7OKnK2nQC`;
- optimized repository assets: approximately 46 KB and 285 KB respectively;
- authorization: Fares explicitly instructed their use in the approved-design implementation on 2026-09-19; the authorization is recorded as D-051 and is scoped to the Phase 9 review implementation. No deployment occurred.

Hosted authority:

- run: `35414599819`;
- job: `105820623090`;
- result: locked install, typecheck, optimized build and **6/6 Playwright journeys PASS**;
- artifact: `10575382770`;
- digest: `sha256:e0f75e7e8c34b6924754920a119affc55978cd82e3653e579fad241e9b081854`.

The hosted desktop, exploded, English mobile and Arabic RTL renders were compared with the accepted visual direction. The real campus now supplies the architectural organization context used in the approved concept, while the crest appears as a restrained project mark beside the KGC review status. Both remain below the stable Fares shell and inside the KGC project story. The campus does not overpower the cohort/garment sequence, mobile retains the hierarchy, and switching to the synthetic hospitality project removes both assets.

No other KGC/client binary was authorized or added by this checkpoint. PR #7 remains draft pending Fares's direct visual/kinetic approval; production `apps/public-web`, deployment and launch remain excluded.


## Fidelity checkpoint 9 — approved hero and editorial hierarchy recovery

Implementation commit:

- \`014d1d5ee22924dc893e8598339b0dabd1cf9670\` — restored the approved eyebrow/headline/CTA hierarchy, full-height model-over-architecture hero, narrative four-stage lineup, tighter page rhythm and project-specific story title.

Preserved RED:

- run \`35416342773\`, job \`105825655197\`;
- install, typecheck and build passed; Playwright passed 5/6;
- the only failure was an ambiguous strict locator after the hero correctly gained separate building and model images;
- failure artifact \`10575493383\`, digest \`sha256:6bc1ffb2bbd826d9d9a7894418c0ca7cf3630cb6c2c3899c2ffee539d0f7845d\`.

Locator correction and GREEN:

- \`ff3002bed802e19d7a65327dd3bbb4be0cd3062f\` targeted the composed hero container while retaining independent natural-width assertions for both project images;
- run \`35416650411\`, job \`105826491451\`;
- locked install, typecheck, optimized build and **6/6 Playwright journeys PASS**;
- artifact \`10576541169\`, digest \`sha256:55e0ca6462794a8f7b6457574af19ef7eddb7b53bc124cf211a5f49d9b5801af\`.

The normalized desktop comparison removed the earlier small generic-group hero, under-scaled navigation, UI-card cohort treatment and duplicated garment section. It also exposed two remaining material gaps: the landing inspection was still too configurator-like and \`/explodeview\` still reused the full landing page.

## Fidelity checkpoint 10 — dedicated inspector and final responsive correction

Implementation commits:

- \`94fbaed7c894e5a386fc0603ac1c4393dd93d70d\` — added a dedicated data-driven \`/explodeview\` with the approved three-part editorial composition, reversible explode/reassemble state, front/back state, localized detail accordion and project/cohort/look query contract; added deterministic KGC English/Arabic evidence captures and tightened landing rhythm;
- \`4c337238735dc42c04686eec1a12eadb6f146e92\` — kept mobile cohort/look rails in normal flow and removed the final clipped-edge responsive defect.

Intermediate GREEN:

- run \`35417207342\`, job \`105828049312\`;
- locked install, typecheck, optimized build and **7/7 Playwright journeys PASS**;
- artifact \`10575734016\`, digest \`sha256:f8e55f6d377081bed70d23e3b528950afcfa3dbd561e1c8c42d02d16ef85f9ef\`.

Final hosted authority:

- run \`35417405490\`, job \`105828588249\`;
- locked install, typecheck, optimized build and **7/7 Playwright journeys PASS**;
- artifact \`10576627116\`, digest \`sha256:fd3c21924d0beb0b7b25e3a60c23939d2f98c021e1253dffe88bb7f03611e7f4\`;
- evidence includes desktop assembled/exploded, English mobile, Arabic KGC RTL, approved-state English \`/explodeview\` and generic Arabic Harbor House \`/explodeview\`.

The final same-state comparisons cover desktop KGC, English mobile, Arabic KGC RTL and the dedicated KGC High/Summer inspector. The inspector now closely tracks the approved large-title / exploded-garment / construction-rail composition while preserving the generalized project schema. The landing retains the approved editorial hierarchy and real KGC crest/campus context. Harbor House continues to remove KGC identity assets and proves the system is not school-specific. No P0/P1/P2 visual issue remains in the reviewed states; the detailed rubric and evidence paths are in \`prototype/public-site-motion/design-qa.md\`.
