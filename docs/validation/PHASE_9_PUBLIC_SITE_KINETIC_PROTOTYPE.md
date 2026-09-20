# Phase 9 validation — public-site kinetic prototype

Status: **TECHNICAL GREEN / PRESERVED-BOARD VISUAL PARITY ITERATION ACTIVE, 2026-09-19.**

Branch: `phase-9/public-site-kinetic-prototype`  
Pull request: [#7](https://github.com/faresmohamed260/fares-uniform/pull/7)  
Implementation authority: `534bd40744a4cfcab835a5334d4d8d12165158d8`  
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
- no price, stock, private Odoo route, unauthorized client binary or provider dependency.

`apps/public-web`, Odoo addons, public APIs, Vercel, Supabase, Cloudflare and production were not changed.

## RED evidence and repair

Initial pull-request run `35392060535`, job `105752429801`, reached the browser gate after locked install, typecheck and production build passed. Four of five Playwright journeys passed. The reduced-motion journey failed because Motion's media hook remained false under the hosted browser's emulated `prefers-reduced-motion` state.

The test was not weakened. Commit `62c86e4ac088f7edbe9bcee412c0dbda71fb3e0d` replaced the unreliable observation with a direct, subscribed `matchMedia("(prefers-reduced-motion: reduce)")` hook. Run `35392256674`, job `105753049690`, then passed all five journeys.

The initial failure artifact is `10565994428`; its digest is `sha256:dffbc5e14c1c7e2232689f00449e4054f862c4b73d2db7c57e2cf5d234e4001e`.

## Initial hosted authority

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


## Fidelity checkpoint 11 — tactile High/Summer landing study

Implementation:

- \`af727a44ca4c6f7c9c35f27b6b09bd2a7441c80c\` added rights-safe synthetic assembled and exploded short-sleeve polo studies, made KGC High/Summer the initial landing story to match the approved reference, and asserted that the photographic polo asset loads before mobile evidence capture;
- \`7028413639d15c8e799dbcc9b035280b35bf00b8\` converted mobile cohort/look choices from clipped horizontal rails to compact grids and enlarged the product study;
- \`b41304524571a7d53d7b83b870b0ce2a5d197017\` preserved the enlarged editorial image while keeping decorative garment layers out of the pointer hit-test path and setting a true 46px minimum mobile control height.

Synthetic asset provenance:

- assembled generation source: \`exec-0a0efe29-573f-4acd-99f6-63093aa650fd.png\`;
- exploded generation source: \`exec-0cba5d38-5a75-44c2-beaa-b32efa8f2815.png\`;
- optimized repository assets: \`public/media/uniform-polo-assembled.webp\` (900 × 1125, approximately 73 KB, alpha) and \`public/media/uniform-polo-exploded.webp\` (900 × 1125, approximately 110 KB, alpha);
- prompt intent: premium top-down editorial product studies of a logo-free navy / warm-white / coral / pale-blue diagonal polo and navy trousers, with realistic weave, seams and transparent alpha;
- these are synthetic review assets, not KGC binaries or approved production imagery. The authorized KGC crest remains a separate project identity asset.

Preserved RED:

- commit \`7028413639d15c8e799dbcc9b035280b35bf00b8\`;
- run \`35436343480\`, job \`105879528344\`;
- install, typecheck and build passed; Playwright passed 5/7;
- one touch target measured \`43.9998779296875px\` against the 44px requirement, and the enlarged decorative polo intercepted the reduced-motion explode-button click;
- failure artifact \`10581444477\`, digest \`sha256:520c71ecedfa7f1dede0af9808452defdd997f772057960d7dda24e47aab0bef\`.

Final GREEN:

- run \`35436536705\`, job \`105880045006\`;
- locked install, typecheck, optimized build and **7/7 Playwright journeys PASS**;
- artifact \`10581199723\`, digest \`sha256:ddd4d16d53c2ea64a9d686948217418fb04d90de89bfed90962ddcd1bd66b959\`.

The hosted English and Arabic mobile renders now open on the High/Summer story, keep all four stages and five looks visible in touch-safe grids, and give the tactile assembled polo primary visual weight. The normalized English mobile comparison is \`phase9-qa-mobile-en-checkpoint11.jpg\`. No production or client garment binary was added.

## Fidelity checkpoint 12 — selected-state journey into `/explodeview`

Implementation:

- `56a375e5e9119ddfca48706ed4d0d6a20a1c566e` added a localized “Open full study” control beside the reversible inline explode action;
- the link carries the current generic organization, program, cohort/role, look/garment and locale identifiers into `/explodeview`;
- the desktop journey asserts the exact KGC / National / High / Puffer / English URL after changing selection;
- `fe22ce27e24a42e9fd3bda7fb8b3d8c9b1773cfe` established the inspection heading as the interaction plane and excluded decorative garment containers from pointer hit testing.

Preserved RED:

- run `35436976803`, job `105881198791`;
- install, typecheck and build passed; Playwright passed 6/7;
- Arabic RTL switching reached Harbor House / Facilities, but the decorative garment transition intercepted the explode-button click after scrolling;
- failure artifact `10582511516`, digest `sha256:8526be8f418a10d792c83bc508d6585ee54235fbe4c25c6a0e42e06c90c7c746`.

Final GREEN:

- run `35437169562`, job `105881692438`;
- locked install, typecheck, optimized build and **7/7 Playwright journeys PASS**;
- artifact `10582307477`, digest `sha256:a63887642a22b5bfb44e10c5bce9b6c978408be9dd10a91c3db5a0c34bbf8e63`.

The landing and dedicated inspector now form one continuous generalized interaction instead of separate demonstrations. KGC and Harbor House selections produce their own query-backed inspection state without embedding school-only assumptions. The hosted mobile evidence keeps both “Open full study” and “Explode garment” visible and operable.

## Fidelity checkpoint 13 — keyboard-visible full-inspector journey

Commit:

- `ddf9dfafcc4cf1181052cb13c5109a06bba6baf7` adds a keyboard-only hosted journey for the selected-state inspector bridge.

Hosted authority:

- run `35437526328`, job `105882617664`;
- locked install, typecheck, optimized build and **8/8 Playwright journeys PASS**;
- artifact `10582462311`, digest `sha256:a49eb4a11dba73ce512074671fea75d5007e943166166c74974c32e839b2ea6b`;
- new evidence `phase9-keyboard-focus.png` captures the focused “Open full study” control.

The journey focuses the link without a pointer, verifies a visible computed outline of at least 2px, activates it with Enter, verifies the exact KGC / National / High / Summer / English URL, and confirms the destination inspector opens with matching project, cohort and look in exploded state. This closes the previously implied keyboard-visible-focus criterion with direct hosted evidence.

## Documentation-head revalidation — final review artifact

Documentation-only head `e9951dbecacaa7669661264973c075ffe8d5c66a` did not change prototype behavior. Exact-head run `35438249057`, job `105884508653`, repeated the locked install, TypeScript typecheck, optimized production build and **8/8 Playwright journeys PASS**.

Artifact `10583416164` (digest `sha256:9d7ac43d2bf54eacacbe7fc7e81531d2f917589c899dfb11e84aaaec8f759cd6`) contains the fresh desktop assembled/exploded views, English mobile, Arabic RTL mobile, English and Arabic dedicated inspectors, keyboard-focus capture and the eight interaction videos. The evidence was re-inspected after download: the reviewed states remain consistent with the passed design QA record and preserve the synthetic-media disclosure and organization-scoped KGC identity.

This revalidation confirms the final reviewed prototype evidence remained intact through the documentation normalization. Fares's direct kinetic approval remains open; PR #7 stays draft and no production deployment or provider mutation is authorized.


## Fidelity checkpoint 14 — approved pre-implementation boards preserved

Fares explicitly requested that the approved pre-implementation designs from the design conversation be committed to the repository as durable reference assets.

The four original PNG boards are preserved byte-for-byte under `docs/ui/assets/approved-pattern-in-motion/`:

- desktop landing — 811 × 1939, SHA-256 `63760bc5c69ac7dbf32e3fbe086e19706b494b6b7e75c80f99b61592308f5d3f`;
- English mobile landing — 853 × 1844, SHA-256 `adc39408ae007fc301a427b8035a9a5041e812c0e74463135db155b4283ff9e8`;
- Arabic RTL mobile landing — 853 × 1844, SHA-256 `83f756f7344de335f99de671af9015e86e4bd9a6e27c66b3c5880ecc8f9fde11`;
- garment inspector — 1487 × 1058, SHA-256 `3056c8e4ef51f2d06802c0c72f8126daf696cc0501ae5b6948e74972dfcde046`.

The assets are documentation/reference evidence, not runtime or production media. They do not replace the organization-agnostic D-048/D-052 contracts, authorize publication, or broaden the authorized KGC binary set. `design-qa.md` now links directly to the versioned boards so future compare-and-correct work does not depend on ephemeral conversation storage. No prototype source, production surface, provider or deployment changed.


## Fidelity checkpoints 15–21 — preserved-board parity loop reopened

Fares explicitly instructed the Phase 9 implementation to continue iterating until the rendered prototype matches the four committed pre-implementation boards and to keep the authoritative documentation synchronized during that work.

The loop now uses one review artifact containing both the immutable boards and current hosted screenshots. Workflow commit `a23358c633440f1f65af70822e04ff52532c6dd9` added the approved boards to the artifact bundle without changing runtime asset paths. Run `35451336893`, job `105918904003`, passed the full hosted gate and artifact `10585749486` retained the side-by-side evidence.

Commit `3a592f5c8541587916728f2635a8d21842a3e738` restructured the isolated prototype around the board composition rather than the earlier utility-panel layout: editorial model-over-campus hero, diagonal textile ribbons, four-stage strip, closer-look garment composition, compact footer and dedicated three-column inspector. Run `35452015164`, job `105920708573`, passed all hosted checks; artifact `10587231958` has digest `sha256:04a13385102769475240347fd2aee983c8a763915e1f1f7dd6e128ae2898dee5`.

Subsequent parity corrections refined RTL hero geometry, inspector collar presentation, mobile clipping/overlap and desktop hero proportions through commits `c00ad4d7681a4c4e3176c631c3cf56ff126bf474`, `f68cd55a1ab71db33739894cb9afcb957c123dbe`, `d90056580811b81a205efdc64c7cbd48e5b6f9e5`, `b85fa5d225c967fd4605376ccb14940e9e902392`, `96dd67dade752b9b1ffcb2e67ed78df5627f2494` and `a7778a8acefe5359ffe08c0d881212d2bb060736`.

Current exact-head hosted authority:
- commit: `a7778a8acefe5359ffe08c0d881212d2bb060736`;
- run: `35453953867`;
- job: `105925846734`;
- locked install, typecheck, optimized build and **8/8 Playwright journeys: PASS**;
- artifact: `10586969715`;
- artifact digest: `sha256:c17e2f5d5924b1e496a87afdffaf90a8d41f1607739857271f0e10028b164f43`;
- current captures: desktop 1440×3438, English mobile 390×2279, Arabic mobile 390×2029, English inspector 1440×1109.

The implementation is materially closer to the approved boards but the parity loop remains open by instruction; technical GREEN is not being used as a substitute for visual completion. PR #7 stays draft. No production deployment, provider mutation or production `apps/public-web` change is authorized.


## Fidelity checkpoints 24–27 — direct board-scale correction

Fares instructed the loop to continue without stopping on technical GREEN and to keep the authoritative docs synchronized as the visual work proceeds.

Checkpoint 24 (`865cf0b031218a92846e44d011377b64d5b9e282`) increased the model/type overlap, shifted the textile ribbons toward the approved composition and attempted a more layered garment study. Hosted run `35460740204`, job `105944024049`, passed the full gate with artifact `10589399065` (`sha256:a380acfb898e7ecdea36a353048faf739fcaa4f6f05d2336dd3c274bb5f6e6f8`).

Checkpoint 25 (`57f6e53c89b693ee4cce7d553ff805ecf30ae376`) exposed that the experimental clipped-image garment stack looked mechanically broken in the hosted render. That visual regression was not accepted merely because CI was GREEN. Run `35461007209`, job `105944743976`, preserved the evidence in artifact `10589249693` (`sha256:daaac1c43a39ce5d26c3b73886b4760d79a51dcc8a9148e76e30560115ef8501`).

Checkpoint 26 (`0b247b95f9c93c360847e2c9e75645c372f9ac1f`) removed the broken stack, restored the clean tactile exploded study and corrected the KGC stage crop logic so review media remains girls-only instead of exposing the mixed-gender synthetic source. Run `35461207448`, job `105945289302`, passed; artifact `10589734370` has digest `sha256:9c48aa4a3ccc8ebd40fa4426a6188b91ca661b6eb604044198c500e9bc103bd1`.

Checkpoint 27 is the current verified visual authority:
- commit: `534bd40744a4cfcab835a5334d4d8d12165158d8`;
- run: `35461456159`;
- job: `105945954701`;
- locked install, typecheck, optimized production build and **8/8 Playwright journeys: PASS**;
- artifact: `10588974373`;
- artifact digest: `sha256:e8ac425d156ad26e8935f132679d0b4db8b079ceb04e698eb7f997aa3922a1ee`;
- current captures: desktop `1440×3378`, English mobile `390×1800`, Arabic mobile `390×1727`, English inspector `1440×1109`.

Checkpoint 27 further matched the approved desktop scale, kept the English and Arabic model crops closer to the boards, removed the duplicated High-stage crop in favor of the dedicated synthetic High model, and increased the inspector/title hierarchy. The parity loop remains open: remaining visible differences are being corrected rather than reclassified as acceptable deviations. PR #7 stays draft; production remains excluded.


## Checkpoint 29 — Phase 9 scope/media-policy reconciliation

Fares clarified the active Phase 9 goal after D-053: continue matching the approved Pattern in Motion boards using the **original KGC assets as KGC visual truth**, while keeping the work inside the existing isolated prototype boundary.

This clarification deliberately does **not** create a production media-storage architecture. It does not authorize or select Google Drive as a runtime asset service, GitHub as a client-photo store, Cloudflare R2, Supabase Storage, a CMS or a new ingestion platform. Google Drive remains the audited source location for the current KGC originals, and `docs/ui/KGC_MEDIA_MANIFEST.md` remains the source/provenance map.

The next implementation checkpoint must:
- make only the exact original KGC assets required by the approved review states available to the isolated hosted prototype through a narrowly documented review-only mechanism;
- replace synthetic KGC hero, stage, garment and inspector imagery with original manifest-backed media;
- use the D-048 annotated flat/front-back fallback wherever truthful exploded construction media does not exist;
- keep Harbor House clearly synthetic and prove the generalization boundary;
- rerun the hosted 8-journey gate and compare fresh desktop, English mobile, Arabic RTL and inspector captures directly with the four approved boards;
- keep PR #7 draft and leave `apps/public-web`, provider architecture and deployment untouched.

The last rendered implementation authority before this reconciliation remains `5826645eb17fb87cfe2399f34e439bf3bf52b74c`, run `35461716041`, job `105946646432`, artifact `10590260486` (`sha256:1b727fbc5dcd2daa07f192e110b5b33882c3cdf1b04c66bd84f261ae92a7b343`). The later D-053 documentation commit is policy lineage, not a new rendered-design authority.


## Checkpoint 30 — D-053 original-media implementation and fail-closed hosted boundary

Implementation commit `b97126216d0792739ee30f280167eb896a12c4b8` replaced the default KGC High/Summer review path with manifest-backed original-media references and removed the historical synthetic KGC substitutes from that path. The four KGC stage cards now resolve to their original Summer worn/model anchors, the hero resolves to the original High/Summer worn anchor, and the High/Summer garment story resolves to the matched original front packshot. The dedicated KGC inspector uses the D-048 annotated flat-view fallback with the separately photographed original front/back packshots; it no longer fabricates exploded construction or mirrors a synthetic image. Harbor House retains the explicitly synthetic explode/reassemble path.

The review-only delivery mechanism is intentionally narrow: `scripts/stage-kgc-review-media.mjs` downloads exactly six D-053 Drive file IDs to ignored runner-only `public/review-media/kgc/` paths, emits filename/byte-count/SHA-256 provenance, and never commits or deploys those originals. The workflow fails closed when the review credential is absent. No Google Drive runtime delivery, GitHub client-photo library, R2, Supabase Storage, CMS or production ingestion decision was introduced.

First exact-head RED evidence:
- implementation commit: `b97126216d0792739ee30f280167eb896a12c4b8`;
- run: `35517884607`;
- job: `106096788537`;
- exact checkout/toolchain: PASS;
- private KGC media staging: **FAIL**, because `PHASE9_KGC_REVIEW_GOOGLE_CREDENTIALS` was empty;
- install/typecheck/build/render: skipped by the early fail-closed gate;
- no synthetic fallback or public file sharing occurred.

Commit `788d73c1f2341113c68ab3c8ef036c9e5589c3eb` moved the private-media gate after build so code validation remains available without weakening the privacy boundary. Fresh exact branch-head evidence:
- run: `35517923107`;
- job: `106096886755`;
- checkout: PASS;
- locked install: PASS;
- TypeScript typecheck: PASS;
- optimized Next.js production build: PASS;
- private KGC media staging: **FAIL**, solely because `PHASE9_KGC_REVIEW_GOOGLE_CREDENTIALS` is not configured;
- Chromium and rendered Playwright journeys: skipped;
- approved reference-board staging/evidence upload: PASS.

The current external blocker is therefore explicit and narrow: a disposable review identity must be able to read only the six Drive originals listed in the Phase 9 contract, and its service-account JSON must be stored as GitHub Actions secret `PHASE9_KGC_REVIEW_GOOGLE_CREDENTIALS`. Until that exists, there is no valid D-053 rendered authority and no side-by-side board parity claim. The last rendered authority remains `5826645eb17fb87cfe2399f34e439bf3bf52b74c` / run `35461716041`, which is historical pre-D-053 evidence only. PR #7 stays draft and production remains excluded.
