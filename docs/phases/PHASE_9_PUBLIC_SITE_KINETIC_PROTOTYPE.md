# Phase 9 — Public-site kinetic prototype

Status: **TECHNICAL GREEN / PRESERVED-BOARD VISUAL PARITY ITERATION ACTIVE; PRODUCTION PUBLIC-WEB AND DEPLOYMENT EXCLUDED.**

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
- KGC National as one private-review fixture using original manifest-backed KGC media under D-053;
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
- use of KGC media outside the D-053 manifest-backed review set, or use of any other client media without explicit authorization;
- prices, stock, customer/private records or broad Odoo routes;
- CMS, production routing, enquiry submission integration or analytics;
- production Gate D approval.

## Design and component decisions

- the Fares shell is neutral and consistent; project colors/motifs remain local to the selected project;
- internal data uses generic `cohorts`, not fixed school stages;
- KGC uses original manifest-backed review media only; synthetic model/garment media remains permitted for the clearly synthetic Harbor House fixture and other explicitly synthetic non-client studies;
- the approved reference hierarchy governs the hero: project eyebrow, “Designed as one. Worn for years.” headline, paired calls to action, editorial organization imagery and restrained program metadata;
- project discovery is an editorial rail, not a marketplace card grid;
- inspection is reversible, URL-independent local prototype state;
- reduced motion converts transforms to immediate/cross-fade state changes without hiding information.

## Dependencies and architecture

Use the repository-pinned Next.js/React/Motion/Playwright dependency set already proven by the public and review surfaces. Keep state local to the prototype and fixtures static. Phase 9 does not select a production media-storage/CDN/CMS architecture. Google Drive is the audited source location for the existing KGC originals, not an approved runtime asset service. GitHub must not become the client-media warehouse. Do not infer Cloudflare R2, Supabase Storage or another production service without a separate architecture decision.

### Review-only KGC media staging

For D-053 hosted review, the narrow delivery mechanism is **ephemeral runner-only staging from the private Google Drive source**. Git history stores only the manifest file IDs, filenames and implementation references. A GitHub-hosted Phase 9 runner authenticates with the review-only secret `PHASE9_KGC_REVIEW_GOOGLE_CREDENTIALS`, downloads only the six exact files below into ignored `public/review-media/kgc/` paths, renders/tests the prototype, and discards the runner. The original binaries are not committed, deployed, or used as a production runtime service. The script emits only filenames, byte counts and SHA-256 provenance into the review artifact.

| Review use | Drive file ID | Runner-only path |
| --- | --- | --- |
| Kindergarten / Summer worn anchor | `1-7KJddf0GBi48waU0zOfb_qQpF7FApmm` | `kindergarten-summer.png` |
| Primary / Summer worn anchor | `1I5xEnC_plLnTwVnqBdrcja9l9lkSpVDa` | `primary-summer.png` |
| Middle / Summer worn anchor | `1le12chTbBteOrrVIxy0D3hWUsGioY-xC` | `middle-summer.png` |
| High / Summer worn anchor | `1x69utNsIog_mDU1KV-BrZ7yrIhDAyGwV` | `high-summer.png` |
| High / Summer polo front packshot | `17z5LpOTT0-RqoxvKoa82LEb3E6SA3G1c` | `high-summer-polo-front.png` |
| High / Summer polo back packshot | `14oTbQ4pyLzxu-2LKs6eZamSqQiasHozV` | `high-summer-polo-back.png` |

The review identity must have no broader Drive access than necessary for those files and should be revoked after this review gate. Missing/invalid credentials or inaccessible files fail the workflow closed before build/render. This is a Phase 9 implementation detail, not a production media architecture decision.

## Data and security

All prototype records are synthetic or explicitly marked review fixtures. D-053 supersedes D-051's narrow KGC-media limit for this isolated review: original KGC worn/model anchors, matched/used packshots, crest and campus recorded in `docs/ui/KGC_MEDIA_MANIFEST.md` are authorized as KGC visual truth. Synthetic KGC people/garments and fabricated KGC construction layers are prohibited. The manifest remains an inventory/provenance map, not a runtime-storage contract. Do not infer that the originals belong in GitHub or that Google Drive should serve the public site. Public catalog restrictions remain unchanged.

## Hosted validation

The exact implementation commit must pass:

1. locked dependency installation;
2. TypeScript typecheck;
3. optimized Next.js production build;
4. Playwright desktop English journey;
5. project switch to the synthetic non-school fixture;
6. cohort/role and look state changes;
7. D-048 annotated original front/back behavior for KGC where no truthful exploded layers exist, plus explode/reassemble behavior for the synthetic Harbor House fixture;
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

Phase 9 remains technically GREEN while preserved-board parity iteration is active. Current rendered implementation authority `5826645eb17fb87cfe2399f34e439bf3bf52b74c`, run `35461716041`, job `105946646432`, passes 8/8 Playwright journeys; artifact `10590260486` (`sha256:1b727fbc5dcd2daa07f192e110b5b33882c3cdf1b04c66bd84f261ae92a7b343`) is the latest verified render authority before the D-053 media-policy correction. Fares instructed the implementation to keep iterating until it matches those boards and to keep authoritative docs current during the loop. PR #7 remains draft. Production `apps/public-web` work and deployment remain separate approvals.
