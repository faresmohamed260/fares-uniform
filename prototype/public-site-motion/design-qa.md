# Phase 9 design QA — Pattern in Motion

Final result: passed

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
- imagery: passed — authorized KGC crest and campus are project-scoped; synthetic model/garment studies remain labeled and Harbor House removes KGC identity;
- interaction and motion: passed — project, cohort/role, look, explode/reassemble, front/back, detail accordion, RTL and reduced-motion states are preserved;
- responsive and accessibility: passed — no horizontal overflow, practical touch targets, keyboard-visible controls, semantic headings/tabs/buttons and information parity;
- generalization: passed — KGC is a fixture, not the shell; Harbor House proves a non-school role model and generic URL state.

Intentional constraints are not defects: the approved references are visual direction rather than production client photography; synthetic garment/model media remain clearly disclosed, and production `apps/public-web` plus deployment are outside Phase 9.

## Hosted authority

- implementation: `ddf9dfafcc4cf1181052cb13c5109a06bba6baf7`;
- workflow run: `35437526328`;
- job: `105882617664`;
- result: locked install, typecheck, optimized build and 8/8 Playwright journeys passed;
- artifact: `10582462311`;
- digest: `sha256:a49eb4a11dba73ce512074671fea75d5007e943166166c74974c32e839b2ea6b`;
- documentation-only head `e9951dbecacaa7669661264973c075ffe8d5c66a` was independently revalidated by run `35438249057`, job `105884508653`, with 8/8 journeys and artifact `10583416164` (`sha256:9d7ac43d2bf54eacacbe7fc7e81531d2f917589c899dfb11e84aaaec8f759cd6`); PR #7 tracks the newest exact-head evidence;
- browser plugin: not available in this session; hosted Playwright supplied the rendered and interaction evidence.
