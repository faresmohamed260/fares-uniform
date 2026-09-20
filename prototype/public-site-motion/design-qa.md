# Phase 9 design QA — Pattern in Motion

Current result: functional/accessibility GREEN; preserved-board visual parity iteration ACTIVE

## Compared sources

| Surface | Approved reference | Reference pixels | Hosted implementation | Implementation pixels | State |
|---|---|---:|---|---:|---|
| Desktop landing | [`approved-desktop-landing.png`](../../docs/ui/assets/approved-pattern-in-motion/approved-desktop-landing.png) | 811 × 1939 | artifact `10582462311/artifacts/screenshots/phase9-desktop-en.png` | 1440 × 3651 | English, KGC, High + puffer settled after interaction |
| Mobile landing | [`approved-mobile-landing-en.png`](../../docs/ui/assets/approved-pattern-in-motion/approved-mobile-landing-en.png) | 853 × 1844 | artifact `10582462311/artifacts/screenshots/phase9-mobile-en.png` | 390 × 3145 | English, KGC High / Summer initial state |
| Mobile RTL | [`approved-mobile-landing-ar.png`](../../docs/ui/assets/approved-pattern-in-motion/approved-mobile-landing-ar.png) | 853 × 1844 | artifact `10582462311/artifacts/screenshots/phase9-mobile-ar.png` | 390 × 3112 | Arabic RTL, KGC High / Summer initial state |
| Garment inspector | [`approved-garment-inspector.png`](../../docs/ui/assets/approved-pattern-in-motion/approved-garment-inspector.png) | 1487 × 1058 | artifact `10582462311/artifacts/screenshots/phase9-explodeview-en.png` | 1440 × 1080 | English, KGC / High / Summer, exploded |

The four approved boards are now preserved byte-for-byte under `docs/ui/assets/approved-pattern-in-motion/`. Their source identifiers, dimensions, byte counts and SHA-256 checksums are recorded in that directory's README. They are design-review authority only: they are not runtime assets, publication approval or a KGC-only shell contract.

Hosted screenshots use Playwright viewports 1440 × 1000 for desktop and 390 × 844 for mobile at device scale factor 1. Full-page capture accounts for the taller landing implementation: it includes the complete generalized cohort/look controls, footer and interaction evidence, while the approved mobile references are shorter presentation boards.

Local normalized comparison outputs used during review:

- `phase9-qa-approved-v-current.jpg` — approved desktop beside checkpoint 8;
- `phase9-qa-approved-v-checkpoint9.jpg` — approved desktop beside the corrected landing;
- `phase9-qa-mobile-en.jpg` and `phase9-qa-mobile-ar.jpg` — same-width mobile comparisons;
- `phase9-qa-explode-approved-v-checkpoint10.jpg` — approved inspector beside the hosted dedicated inspector.

## Comparison history

### Checkpoint 8 findings

- P1: hero used a small generic group instead of one dominant model over architectural context.
- P1: approved eyebrow, headline and paired CTA hierarchy were missing.
- P2: project/cohort area read as selector UI instead of an editorial progression.
- P2: duplicate garment storytelling made the page substantially longer.
- P2: Fares wordmark/navigation scale was too quiet.

### Checkpoint 9 correction

The hero gained the approved hierarchy, real KGC campus context, one dominant rights-safe model, scaled wordmark/navigation and the four-stage narrative. The duplicate section was removed. A RED run caused only by a now-ambiguous hero image locator was preserved and corrected without weakening the separate image-load assertions.

Remaining comparison findings:

- P1: `/explodeview` still reused the full landing page and did not match the approved dedicated construction experience.
- P2: mobile project controls stacked too deeply.
- P2: Arabic evidence captured a different organization, making it invalid for direct visual comparison.

### Checkpoint 10 correction

A dedicated generalized inspector now reproduces the approved three-part structure: oversized editorial statement, central exploded garment with numbered points, and an accordion construction rail. Reassemble, explode, front/back, locale, organization/program/cohort/look query state and reduced-motion behavior remain interactive. Landing mobile controls were compressed into touch-safe horizontal rails; English and Arabic captures now use the same KGC state. A final hosted rerender removed clipped control rails.

### Checkpoint 11 correction

The landing’s initial KGC story now matches the approved High/Summer focus. A logo-free synthetic assembled/exploded polo pair replaces the flat vector garment, retaining truthful disclosure and keeping the authorized KGC crest separate. Mobile stage and look controls are fully visible, touch-safe grids. The first grid/enlargement attempt preserved a RED browser run: a subpixel 44px miss and decorative-image pointer interception. Both root causes were fixed in CSS without weakening the tests.

### Checkpoint 12 correction

The landing now exposes a selected-state bridge to the dedicated inspector. Its URL is built from generic project data and carries organization, program, cohort/role, look/garment and locale state. The first hosted attempt preserved a RED Arabic interaction where decorative media intercepted the control; the final implementation explicitly separates visual and interactive hit planes.

### Checkpoint 13 keyboard proof

`phase9-keyboard-focus.png` records a clear focus-visible outline on the selected-state “Open full study” link. The hosted keyboard journey activates the link with Enter and verifies that the exact High/Summer state reaches the exploded inspector.

## Final rubric

- composition: passed — stable Fares shell, split editorial hero, narrative cohort progression, large inspection field and dedicated three-part inspector;
- typography: passed — approved high-contrast serif scale, compact uppercase metadata and restrained sans-serif controls;
- color: passed — neutral Fares paper/ink system with KGC color confined to the KGC project skin;
- spacing and geometry: passed — desktop rhythm and mobile containment reviewed at the hosted viewports;
- imagery: REOPENED — D-053 now requires original manifest-backed KGC media for KGC client data; Harbor House remains synthetic;
- interaction and motion: passed — project, cohort/role, look, explode/reassemble, front/back, detail accordion, RTL and reduced-motion states are preserved;
- responsive and accessibility: passed — no horizontal overflow, practical touch targets, keyboard-visible controls, semantic headings/tabs/buttons and information parity;
- generalization: passed — KGC is a fixture, not the shell; Harbor House proves a non-school role model and generic URL state.

Current synthetic KGC garment/model studies are no longer an acceptable final Phase 9 substitution after D-053. They are historical prototype evidence only. Production `apps/public-web`, production media-storage architecture and deployment remain outside Phase 9.

## Current hosted authority

- implementation commit: `5826645eb17fb87cfe2399f34e439bf3bf52b74c`;
- run: `35461716041`;
- job: `105946646432`;
- artifact: `10590260486`;
- digest: `sha256:1b727fbc5dcd2daa07f192e110b5b33882c3cdf1b04c66bd84f261ae92a7b343`;
- 8/8 Playwright journeys PASS.

The artifact contains the four approved reference boards under `artifacts/reference/` beside the fresh implementation captures under `artifacts/screenshots/`. This is now the required review shape for every parity checkpoint.

## Active parity ledger

The earlier technical/accessibility findings remain closed. Visual parity is intentionally reopened by Fares's instruction. The current implementation now follows the same major composition sequence as the references: editorial Fares header, overlapping model/campus hero with red-white-blue textile ribbons, four-stage narrative, closer-look garment construction story, compact footer and dedicated three-column inspector.

The compare-and-correct loop remains active. No statement in this document should be read as permission to stop on CI GREEN alone; hosted visual evidence must continue to be compared directly with the preserved boards until the implementation is judged to match them. PR #7 remains draft and production remains excluded.


## Checkpoint 27 comparison note

The current hosted evidence is materially closer to the committed boards than checkpoint 21: the desktop hero model and serif headline occupy more of the first composition, the mobile EN/AR crops now read as the same authored poster rather than a generic responsive page, the stage sequence is constrained to girls-only KGC review media, and the inspector preserves the three-column title/object/detail-rail structure.

Open visual work remains visible and intentional: the desktop textile ribbons still intrude farther into the copy field than the reference, the High stage portrait needs a tighter editorial crop, the first inspector detail crop still reads more diagrammatically than the approved textile macro, and the landing garment study remains cleaner/more separated than the folded tactile reference. Those are the next compare-and-correct targets.


## Checkpoint 29 handoff note — original KGC media, no storage redesign

D-053 changes the visual-content rule for KGC: the next parity iteration must use the original KGC media catalogued in `docs/ui/KGC_MEDIA_MANIFEST.md` rather than synthetic KGC substitutes.

This is not authorization to redesign production media infrastructure. The Phase 9 prototype must not turn GitHub into a client-image warehouse, must not serve the public runtime from Google Drive, and must not invent a Cloudflare R2/Supabase Storage/CMS decision. If the hosted review needs a delivery path for the small subset visible in the approved boards, that is a narrow Phase 9 implementation detail and must remain review-scoped unless separately promoted by an architecture decision.

The next visual loop starts with the exact KGC assets required for the approved High/Summer hero, four-stage progression and inspector, replaces the synthetic KGC imagery, uses truthful flat/front-back annotation when no real exploded layers exist, then reruns the same preserved-board comparison. Harbor House remains the synthetic non-school proof.
