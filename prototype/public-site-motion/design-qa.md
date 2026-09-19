# Phase 9 design QA — Pattern in Motion

Final result: passed

## Compared sources

| Surface | Approved reference | Reference pixels | Hosted implementation | Implementation pixels | State |
|---|---|---:|---|---:|---|
| Desktop landing | \`exec-7e78b237-351a-430a-ac94-f9308628f2a8.png\` | 811 × 1939 | artifact \`10576627116/artifacts/screenshots/phase9-desktop-en.png\` | 1440 × 3651 | English, KGC, High + puffer settled after interaction |
| Mobile landing | \`exec-760ae055-2c0c-4dae-ab62-b373a6c2e6a8.png\` | 853 × 1844 | artifact \`10576627116/artifacts/screenshots/phase9-mobile-en.png\` | 390 × 3067 | English, KGC initial state |
| Mobile RTL | \`exec-3847698c-10e1-4f0c-b9f6-302e7e26a688.png\` | 853 × 1844 | artifact \`10576627116/artifacts/screenshots/phase9-mobile-ar.png\` | 390 × 3062 | Arabic RTL, KGC initial state |
| Garment inspector | \`exec-e4072d4b-d668-433b-a15e-f79d6f7e9681.png\` | 1487 × 1058 | artifact \`10576627116/artifacts/screenshots/phase9-explodeview-en.png\` | 1440 × 1080 | English, KGC / High / Summer, exploded |

Hosted screenshots use Playwright viewports 1440 × 1000 for desktop and 390 × 844 for mobile at device scale factor 1. Full-page capture accounts for the taller landing implementation: it includes the complete generalized cohort/look controls, footer and interaction evidence, while the approved mobile references are shorter presentation boards.

Local normalized comparison outputs used during review:

- \`phase9-qa-approved-v-current.jpg\` — approved desktop beside checkpoint 8;
- \`phase9-qa-approved-v-checkpoint9.jpg\` — approved desktop beside the corrected landing;
- \`phase9-qa-mobile-en.jpg\` and \`phase9-qa-mobile-ar.jpg\` — same-width mobile comparisons;
- \`phase9-qa-explode-approved-v-checkpoint10.jpg\` — approved inspector beside the hosted dedicated inspector.

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

- P1: \`/explodeview\` still reused the full landing page and did not match the approved dedicated construction experience.
- P2: mobile project controls stacked too deeply.
- P2: Arabic evidence captured a different organization, making it invalid for direct visual comparison.

### Checkpoint 10 correction

A dedicated generalized inspector now reproduces the approved three-part structure: oversized editorial statement, central exploded garment with numbered points, and an accordion construction rail. Reassemble, explode, front/back, locale, organization/program/cohort/look query state and reduced-motion behavior remain interactive. Landing mobile controls were compressed into touch-safe horizontal rails; English and Arabic captures now use the same KGC state. A final hosted rerender removed clipped control rails.

## Final rubric

- composition: passed — stable Fares shell, split editorial hero, narrative cohort progression, large inspection field and dedicated three-part inspector;
- typography: passed — approved high-contrast serif scale, compact uppercase metadata and restrained sans-serif controls;
- color: passed — neutral Fares paper/ink system with KGC color confined to the KGC project skin;
- spacing and geometry: passed — desktop rhythm and mobile containment reviewed at the hosted viewports;
- imagery: passed — authorized KGC crest and campus are project-scoped; synthetic model/garment studies remain labeled and Harbor House removes KGC identity;
- interaction and motion: passed — project, cohort/role, look, explode/reassemble, front/back, detail accordion, RTL and reduced-motion states are preserved;
- responsive and accessibility: passed — no horizontal overflow, practical touch targets, keyboard-visible controls, semantic headings/tabs/buttons and information parity;
- generalization: passed — KGC is a fixture, not the shell; Harbor House proves a non-school role model and generic URL state.

Intentional constraints are not defects: the approved references are visual direction rather than production client photography; synthetic garment/model media remain clearly disclosed, and production \`apps/public-web\` plus deployment are outside Phase 9.

## Hosted authority

- implementation: \`4c337238735dc42c04686eec1a12eadb6f146e92\`;
- workflow run: \`35417405490\`;
- job: \`105828588249\`;
- result: locked install, typecheck, optimized build and 7/7 Playwright journeys passed;
- artifact: \`10576627116\`;
- digest: \`sha256:fd3c21924d0beb0b7b25e3a60c23939d2f98c021e1253dffe88bb7f03611e7f4\`;
- browser plugin: not available in this session; hosted Playwright supplied the rendered and interaction evidence.
