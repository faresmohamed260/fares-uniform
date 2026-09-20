# Pattern in Motion — reusable public-site design specification

**Status:** selected visual direction / kinetic design gate  
**Selected by:** Fares, 2026-09-18  
**Corrected boundary:** multi-organization system confirmed by Fares, 2026-09-18  
**Reference workflow:** GPT-6 Astra “10K Websites” process, adapted to Fares Uniform  
**Production status:** not approved for implementation or deployment

## 1. Selection receipt and boundary

Fares selected the second concept direction, **Pattern in Motion**, then explicitly confirmed that it must serve the complete Fares Uniform client portfolio rather than become a KGC-specific website. KGC National is the first complete media and interaction validation case. It is not the Fares brand, the default homepage identity, or a fixed content model.

The selected direction is a bright editorial system in which uniform construction, coordinated groups and institutional identity drive the motion. Project-specific colors, seams, stripes, checks, piping or other garment details may influence an individual project story, but they must never be promoted into permanent Fares-wide chrome unless separately approved as Fares brand language.

This specification authorizes the next kinetic prototype/review work only. It does not authorize production source changes, deployment, public publication of client media, provider mutation or Gate D closure.

Concept frames containing KGC model imagery are not committed to this public repository because publication rights are not established. The canonical KGC source references remain in the [KGC National media manifest](KGC_MEDIA_MANIFEST.md); no KGC binary is copied into GitHub.

## 2. Creative thesis

**Designed as one. Worn together.**

A uniform program is shown as a coordinated system: organization, people, roles, garments, details and use contexts move as one visual story. The page changes composition as the visitor moves through it; it does not become a stack of unrelated sections or generic cards.

Emotional target:

- bright, calm and credible at rest;
- authored and memorable during product transitions;
- precise enough for an institutional buyer;
- recognizably about garments before long copy is read;
- flexible enough for schools, teams and other organizations without pretending they share one visual identity.

## 3. Two-tier visual system

### 3.1 Stable Fares shell

The global site shell belongs to Fares Uniform and remains consistent across projects:

- warm neutral canvas and dark editorial typography;
- restrained navigation, language switch, enquiry entry and accessibility controls;
- stable spacing, type scale, focus treatment and motion timing;
- Fares capability, manufacturing and service story;
- no client logo, client palette or client garment motif used as the global brand.

Exact Fares brand tokens remain governed by the repository design system and later approval. This document does not invent a permanent palette.

### 3.2 Project skin

Each approved client program may supply a temporary project skin:

- organization name and logo, when publication is permitted;
- project accent palette;
- garment-derived motif such as a seam, stripe, check, panel, piping or block;
- cohort/role labels and ordering;
- project-specific photography and garment details;
- motion grammar derived from the selected garment construction.

The project skin is scoped to that project story. Leaving the project returns the visitor to the stable Fares shell.

## 4. Reusable content and data contract

The experience must be driven by structured content rather than route-specific markup. At minimum, a published project record supports:

| Field | Purpose |
| --- | --- |
| organization | Client name, slug, approved logo and publication state |
| sector | Discovery/filter context; vocabulary is editorially governed |
| program | One organization may have multiple uniform programs |
| cohorts | Generic ordered audience groups: stages, departments, roles or teams |
| looks | Coordinated outfits attached to one or more cohorts |
| garments | Garment identity, category, season/use context and available views |
| media | Model anchors, packshots, details and stable source references |
| visual_skin | Approved accents, motif and project-scoped motion behavior |
| sharing | Shared-across-cohorts rules for garments or complete looks |
| rights | Publication status for client name, logo, people, locations and media |
| enquiry_context | Organization/program/garment context passed into enquiry |

“Cohort” is the internal generic term. Public labels adapt to the organization: for example stages, departments, roles or teams. No component may assume there are exactly four cohorts or that they are educational stages.

## 5. Information architecture

1. **Fares capability hero** — organization-agnostic promise and material-led motion.
2. **Selected work** — curated, rights-approved projects and programs.
3. **Project introduction** — organization, need, program and approved identity.
4. **Coordinated lineup** — relevant cohorts/roles shown as one system.
5. **Look selection** — season or use-context transitions.
6. **Garment inspection** — model-to-packshot continuity.
7. **Exploded view** — construction/details where source media supports it.
8. **Reassembly** — parts return to the complete coordinated look.
9. **Contextual enquiry** — selected project/program/garment is preserved.

The homepage must not default to KGC or any one client. It may feature KGC only as one rights-approved selected-work entry.

## 6. Visual Story

### Scene A — Fares introduction

A restrained Fares-led hero opens on a coordinated set of garment forms or an abstract construction study. The approved line is:

> Designed as one. Worn together.

Supporting copy:

> Coordinated uniform programs designed and manufactured in Egypt for organizations and teams.

Primary actions:

- Explore our work
- Discuss your program

### Scene B — organization and program discovery

Approved projects move into view as editorial stories, not marketplace tiles. The visitor can enter by organization, sector or program without exposing price or stock.

### Scene C — coordinated people

Within a project, the relevant cohorts/roles form one lineup. The number and labels come from the project record. Shared garments can visually persist across multiple people while unique garments change.

### Scene D — garment continuity

Selecting a person/look moves from the worn anchor to its matched garment views. Packshots are never presented as current merely because a file exists; they must be associated with an authoritative model anchor or explicitly approved independently.

### Scene E — inspect and reassemble

The chosen garment opens into construction layers, detail callouts or an annotated flat view. Reassembly returns the parts to the complete look and then to the coordinated group.

### Scene F — enquiry handoff

The final enquiry carries the organization, program, cohort, look and garment context when present, while remaining usable from the Fares-level homepage.

## 7. KGC as the first validation case

KGC exercises the reusable schema as follows:

| Generic field | KGC National value |
| --- | --- |
| organization | KGC |
| program | National |
| cohorts | Kindergarten, Primary, Middle, High |
| authoritative media | five worn/model anchors per cohort |
| shared looks | sports/training suit across all cohorts; navy puffer across all cohorts |
| shared garment | plain navy hoodie across Kindergarten and Primary |
| unique identity | stage polos; Middle and High hoodie designs |
| seasonal rule | short-sleeve polo = summer; long-sleeve polo = winter |
| packshot rule | use only visually matched packshots; keep extra/unmatched assets unassigned |
| publication | gated; no public binary use until rights are approved |

The KGC diagonal polo language may shape the KGC project skin and its transitions. It must not appear as the permanent Fares motif and must not constrain future organizations.

## 8. Generic layer contract

Every inspectable garment uses only layers supported by approved media. The contract allows:

- silhouette/body;
- front and back panels;
- sleeves, collar, hood, waistband or cuffs as applicable;
- project-specific color/pattern panels;
- closure, pocket and trim details;
- approved identity marks;
- annotation anchors for material or construction details.

The implementation must not fabricate unseen construction. When true isolated layers or sufficient views do not exist, the experience falls back to an annotated flat view rather than inventing an exploded object.

## 9. Interaction choreography

- Project entry loads the organization/program skin without changing global navigation behavior.
- Cohort/role changes preserve any garments declared shared across those cohorts.
- Look changes replace only the garments that actually differ.
- Selection state is addressable and survives navigation into inspection.
- Explode separates supported layers along a readable axis; labels never obscure the garment.
- Reassemble reverses the same geometry instead of cutting to an unrelated image.
- Pointer, keyboard, touch and reduced-motion paths reach the same information.
- Motion duration stays subordinate to browsing and enquiry; no transition blocks the visitor.

## 10. Route and state model

`/explodeview` is a generic internal review route, not a KGC route. Its state accepts organization, program, cohort/role, look and garment identifiers. KGC National/High may be loaded as a review fixture, but no identifier or four-stage assumption may be embedded in the component contract.

A future public URL may use a structure such as `/work/[organization]/[program]/[garment]`; the final production route remains an implementation decision.

## 11. Responsive, Arabic and accessibility treatment

Mobile changes composition rather than shrinking desktop:

- one clear garment/person focus at a time;
- thumb-reachable cohort/look control;
- inspection labels that expand without covering the product;
- persistent but unobtrusive enquiry access;
- no required hover interaction.

Arabic is authored, not mirrored mechanically:

- logical CSS properties and full RTL flow;
- typography and line lengths tuned for Arabic;
- directional garment motion reversed only when it improves reading order;
- numerals and product codes remain legible in mixed-direction content.

Approved generalized Arabic framing:

- `مصمّم كمنظومة واحدة. يُرتدى بروح واحدة.`
- `برامج زي موحّد متكاملة، مصمّمة ومُصنّعة في مصر للمؤسسات والفرق.`
- `استكشف أعمالنا`
- `ناقش برنامجك معنا`

KGC-specific names and stage copy belong only inside the KGC project.

## 12. Reduced-motion and fallback behavior

With reduced motion:

- scroll choreography becomes discrete state changes;
- continuity is communicated by ordering, labels and cross-fades;
- exploded layers may use an accessible stepper/list;
- no information is hidden behind animation completion.

If WebGL or advanced transforms are unavailable, the experience uses semantic images, CSS transforms and annotated views. Core discovery and enquiry remain fully functional.

## 13. Media and publication governance

Every organization receives its own manifest or equivalent source dossier. It must record stable source references, asset type, organization, program, cohort/role, look, garment, view, sharing, match status, confidence/source and publication rights.

Rules:

- model/worn anchors define a current coordinated look unless another authority is documented;
- packshots require a visual or documented association;
- extra/unmatched assets stay explicitly unassigned;
- a technical ability to access a file is not publication permission;
- client logo, people, location and garment imagery each retain their own approval state;
- large media binaries stay outside GitHub and are referenced by stable IDs/links.

## 14. Kinetic prototype acceptance

The review prototype must prove the reusable system, not only the KGC scene:

1. Fares-led, organization-agnostic homepage state.
2. Entry into a selected organization/program.
3. Data-driven cohort/role lineup with no fixed count.
4. Shared-versus-unique garment continuity.
5. Generic inspect/explode/reassemble state.
6. One complete KGC National fixture using manifest-backed original private review media under D-053.
7. At least one clearly synthetic non-school fixture to expose school-specific assumptions.
8. English desktop, English mobile and Arabic RTL mobile.
9. Keyboard, touch and reduced-motion paths.
10. No prices, stock, private Odoo routes or unapproved client media.

Acceptance is a design-review gate only. Production code, deployment and client-media publication remain separately authorized.

## 15. Remaining approvals

Still required before public implementation or launch:

- final Fares brand tokens and production component mapping;
- rights-approved project selection and copy;
- client name/logo/model/location/media permissions per project;
- final public route and CMS/content ownership;
- production implementation approval;
- deployment and Gate D approval.
