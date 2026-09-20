# Phase 9 — Public-site kinetic prototype

Status: **D-054 R2-BACKED D-053 RENDER GREEN; 8/8 HOSTED JOURNEYS PASS; PRESERVED-BOARD IMPLEMENTATION READY FOR FARES SIGN-OFF; PRODUCTION PUBLIC-WEB AND DEPLOYMENT EXCLUDED.**

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

Use the repository-pinned Next.js/React/Motion/Playwright dependency set already proven by the public and review surfaces. Keep state local to the prototype and fixtures static. D-054 now selects Cloudflare R2 as the project object-storage layer while Google Drive remains the audited source/archive location for the existing KGC originals. GitHub remains source/evidence storage rather than a client-media warehouse. D-054 does not move Odoo database-backed attachments out of Supabase PostgreSQL, and production public delivery still requires a separately approved narrow data-plane credential and publication policy.

### Review-only KGC media staging

For D-053 hosted review, the six approved originals live privately under `fares-uniform-media-private/kgc/review/`. The GitHub-hosted runner downloads only those exact objects into ignored `public/review-media/kgc/` paths, validates expected byte counts and SHA-256 hashes, renders/tests the prototype, and discards the runner. The originals are never committed to Git and the private bucket has no public `r2.dev` endpoint or custom domain.

| Review use | Drive source ID | Private R2 object | Runner-only file |
| --- | --- | --- | --- |
| Kindergarten / Summer worn anchor | `1-7KJddf0GBi48waU0zOfb_qQpF7FApmm` | `kgc/review/kindergarten-summer.png` | `kindergarten-summer.png` |
| Primary / Summer worn anchor | `1I5xEnC_plLnTwVnqBdrcja9l9lkSpVDa` | `kgc/review/primary-summer.png` | `primary-summer.png` |
| Middle / Summer worn anchor | `1le12chTbBteOrrVIxy0D3hWUsGioY-xC` | `kgc/review/middle-summer.png` | `middle-summer.png` |
| High / Summer worn anchor | `1x69utNsIog_mDU1KV-BrZ7yrIhDAyGwV` | `kgc/review/high-summer.png` | `high-summer.png` |
| High / Summer polo front packshot | `17z5LpOTT0-RqoxvKoa82LEb3E6SA3G1c` | `kgc/review/high-summer-polo-front.png` | `high-summer-polo-front.png` |
| High / Summer polo back packshot | `14oTbQ4pyLzxu-2LKs6eZamSqQiasHozV` | `kgc/review/high-summer-polo-back.png` | `high-summer-polo-back.png` |

Bootstrap run `35525401012` / job `106116558010` verified the private R2 boundary. Transfer run `35528055553` / job `106123589186` verified the six exact objects. Temporary ingest infrastructure was removed by run `35528399852` / job `106124509690`. The broad `CLOUDFLARE_API_TOKEN` is currently confined to hosted provider/review staging; before production GO, production object access must use a narrow R2 credential limited to the required bucket and operations.

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

Current exact rendered authority is `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256`. Push run `35529953588`, job `106128675433`, passes locked install, TypeScript typecheck, optimized production build, private R2 media staging and **8/8 Playwright journeys**. Review artifact `10610259627` has digest `sha256:852ddd4842b562d18bc233bcc0e1db9df8a1497053e98aa5c5974738966971ac` and contains the four immutable reference boards beside fresh desktop, English mobile, Arabic RTL and inspector captures.

The compare-and-correct implementation loop is complete at the engineering boundary: the final captures preserve the approved hierarchy and geometry while using D-053 original KGC media. The approved boards' invented/folded/exploded KGC construction imagery is intentionally not reproduced where no real separated source layers exist; D-048/D-053 require the annotated original front/back fallback instead. Harbor House still proves the synthetic explode/reassemble path and generalized organization model.

All technical, responsive, RTL, keyboard, touch-target, reduced-motion and source-truth checks are GREEN. Fares's explicit visual approval remains the final human gate before any production public-site implementation is authorized. PR #7 remains draft. Production `apps/public-web`, public KGC publication, deployment and Gate D are separate approvals.
