# Phase 9 — Public-site kinetic prototype

Status: **TECHNICAL PROTOTYPE GREEN / FIDELITY ITERATION ACTIVE / FARES KINETIC REVIEW OPEN; PRODUCTION PUBLIC-WEB AND DEPLOYMENT EXCLUDED.**

Branch: `phase-9/public-site-kinetic-prototype`.

Authorization: Fares approved starting implementation on 2026-09-18 after selecting Pattern in Motion and confirming the multi-organization boundary.

## Goal

Build a repository-backed interactive prototype that proves the accepted Pattern in Motion system can serve multiple organizations without hard-coding KGC. Close the kinetic design gate with hosted render, interaction, responsive, RTL, accessibility and reduced-motion evidence before any production `apps/public-web` rewrite is considered.

## Starting evidence

- main HEAD at authorization: `99c51502a25fbd2a5464e2c5753c655113b83c54`;
- selected specification: `docs/ui/PATTERN_IN_MOTION_DESIGN_SPEC.md`;
- durable organization-agnostic rule: D-048;
- KGC manifest: `docs/ui/KGC_MEDIA_MANIFEST.md`;
- Phase 8/8A Gate C remains PASS; production remains Gate D NO-GO.

## In scope

- isolated Next.js prototype under `prototype/public-site-motion`;
- stable Fares shell and project-scoped visual skins;
- typed organization/program/cohort/look/garment fixture model;
- KGC National as one private-review fixture, including only the explicitly authorized canonical crest and campus photo plus synthetic garment/model media;
- one clearly synthetic non-school organization;
- cohort/role and look selection with shared-versus-unique continuity;
- generic inspect, explode and reassemble interaction;
- English LTR and Arabic RTL;
- keyboard, touch-sized controls, responsive layout and reduced-motion behavior;
- hosted typecheck, production build and Playwright interaction/render evidence;
- phase validation and continuity documentation.

## Excluded

- edits to `apps/public-web` or any Odoo addon/API;
- Vercel/Supabase/provider mutation or deployment;
- use of KGC or other client media beyond the two project-scoped assets explicitly authorized in D-051;
- prices, stock, customer/private records or broad Odoo routes;
- CMS, production routing, enquiry submission integration or analytics;
- production Gate D approval.

## Design and component decisions

- the Fares shell is neutral and consistent; project colors/motifs remain local to the selected project;
- internal data uses generic `cohorts`, not fixed school stages;
- the first prototype uses synthetic vector garment studies solely to evaluate hierarchy and motion; they are not approved production media;
- the approved reference hierarchy governs the hero: project eyebrow, “Designed as one. Worn for years.” headline, paired calls to action, editorial organization imagery and restrained program metadata;
- project discovery is an editorial rail, not a marketplace card grid;
- inspection is reversible, URL-independent local prototype state;
- reduced motion converts transforms to immediate/cross-fade state changes without hiding information.

## Dependencies and architecture

Use the repository-pinned Next.js/React/Motion/Playwright dependency set already proven by the public and review surfaces. Keep state local to the prototype and fixtures static. Do not add a runtime service, database, secret or external client-media dependency.

## Data and security

All prototype records are synthetic or explicitly marked review fixtures. By D-051, the canonical KGC crest and campus photo are the only Drive binaries authorized for this Phase 9 review implementation; they are optimized, stored only under the isolated prototype and selected through project-scoped data. No KGC model/garment binary, private record or other client media is copied into GitHub. Public catalog restrictions remain unchanged.

## Hosted validation

The exact implementation commit must pass:

1. locked dependency installation;
2. TypeScript typecheck;
3. optimized Next.js production build;
4. Playwright desktop English journey;
5. project switch to the synthetic non-school fixture;
6. cohort/role and look state changes;
7. explode and reassemble behavior;
8. keyboard-visible focus;
9. Arabic RTL;
10. mobile overflow and touch target checks;
11. reduced-motion information parity;
12. screenshot artifact upload for review.

Compilation alone cannot close the kinetic gate. Fares must review the rendered motion evidence before production implementation.

## Documentation outputs

- this contract;
- `docs/validation/PHASE_9_PUBLIC_SITE_KINETIC_PROTOTYPE.md`;
- synchronized `PROJECT.md`, `docs/README.md` and decision log;
- exact commit/run/job/artifact evidence after hosted validation.

## Exit criteria

Phase 9 prototype implementation and design QA are technically GREEN at current authority `ddf9dfafcc4cf1181052cb13c5109a06bba6baf7`, hosted run `35437526328`, job `105882617664`, with 8/8 Playwright journeys passing and review artifact `10582462311` (`sha256:a49eb4a11dba73ce512074671fea75d5007e943166166c74974c32e839b2ea6b`). The side-by-side comparison record is `prototype/public-site-motion/design-qa.md`; no P0/P1/P2 visual issue remains in the reviewed desktop, mobile, RTL and dedicated `/explodeview` states. Fares’s direct kinetic approval is still required before PR #7 leaves draft. Production `apps/public-web` work and deployment remain separate approvals.
