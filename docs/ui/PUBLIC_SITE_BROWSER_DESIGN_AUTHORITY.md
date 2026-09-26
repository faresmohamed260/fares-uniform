# Public-site browser design authority — UX contract

**Status:** active design contract / D-059  
**Client authorization:** Fares, 2026-09-21  
**Implementation boundary:** browser-native design review only; production `apps/public-web` remains unchanged until explicit design approval.

## Product outcome

The public site must make a serious prospective organization understand that Fares Uniform designs and manufactures **coordinated uniform programs**, not isolated commodity garments. Large-client credibility is first; useful garment/catalog discovery is second; enquiry is the conversion.

The experience must feel like a premium editorial presentation coming to life while remaining immediately understandable, fast, bilingual, accessible and truthful.

## Creative system

Carry forward the context that produced Pattern in Motion without copying its generated pixels:

- tactile materials and garment construction lead;
- bright, calm, editorial composition at rest;
- meaningful depth and occlusion between media, type and material planes;
- quiet global chrome;
- typography supplies much of the premium character;
- important objects transform/persist rather than repeatedly disappearing;
- physical response is reserved for physical ideas such as garments, fabric and imagery;
- cinematic chapters alternate with quiet reading intervals;
- motion never hides information, blocks navigation or replaces semantic structure;
- the Fares shell is neutral and reusable; client/project colour/motif stays inside that project;
- no bento-grid/SaaS/template/ecommerce-marketplace visual language.

## Information architecture

### Global
- Home
- Work
- Garments
- About / capability content inside Home initially
- Enquiry
- EN / AR switch

### Home
1. Fares proposition: **Designed as one. Worn together.**
2. Kinetic coordinated-garment/model composition using current review-authorized real media.
3. Selected work: KGC National as the current truthful populated project.
4. Program principle: identity → people/roles → looks → garments.
5. Garment continuity/inspection preview.
6. Manufacturing relationship: understand → design → sample/refine → manufacture → handover.
7. Sector breadth expressed as truthful capability labels, not invented client case studies.
8. Enquiry entry.

### Work
- editorial archive/discovery surface;
- real approved/review-authorized projects appear as stories, not marketplace cards;
- sectors may be shown as discovery vocabulary even when no publishable project media exists;
- no invented logos, clients, outcomes or claims.

### Project
Generic route model:
`organization -> program -> cohort/role -> look -> garment -> enquiry`.

KGC National is the first populated proof case:
- organization identity/context;
- four real worn/model stage anchors;
- selection preserves continuity;
- High/Summer transitions into the real front/back polo views;
- no fabricated construction layers.

### Garments
- browsing is image-led and editorial;
- no price or stock;
- current review shows only garment records with truthful current media;
- unavailable media does not get replaced with generated fake products.

### Garment detail / inspector
- worn context and isolated garment remain connected;
- front/back switch;
- annotations/details use real visible evidence only;
- if no real separated layer exists, use a **flat photographic inspection** with spatial callout choreography rather than an invented exploded garment;
- enquiry carries visible human-readable context.

### Enquiry
- calm, high-trust finish;
- organization/program/role/look/garment context remains visible when present;
- ordinary direct contact remains available;
- no motion blocks form completion.

## Fares shell

The global shell is intentionally neutral so project skins can change without turning one client into the Fares brand.

Direction for review:
- warm chalk/ivory canvas;
- near-black editorial ink;
- restrained warm neutral secondary ink;
- thin hairline structure;
- large high-contrast display typography paired with a clean Arabic-capable sans/system stack for the first coded review;
- no permanent KGC red/light-blue/navy in global chrome.

KGC project skin may use its real red/light-blue/navy diagonal language only within the KGC story.

## Responsive contract

### Desktop
- wide editorial compositions, asymmetry and meaningful overlap;
- media may span/bleed across the grid;
- navigation remains stable;
- pointer response is bounded and optional.

### Mobile
- design is recomposed, not shrunk;
- one primary media/garment focus at a time;
- horizontal rails only when their affordance is obvious and there is an equivalent direct selection path;
- touch targets >=44px where practical;
- no essential hover behavior.

### Arabic RTL
- authored composition rather than mechanical screenshot mirroring;
- logical properties;
- Arabic display hierarchy tuned independently;
- client Latin marks such as KGC stay readable;
- directional choreography reverses only when it improves reading/meaning.

### Reduced motion
- same hierarchy and information;
- no scroll trapping, large spatial travel, parallax or pointer-follow loops;
- state changes become direct or short fades;
- inspection remains fully usable.

## Review-content contract

The design review must be content-complete enough to judge the real experience.

Current real review-authorized media used by the design:
- KGC Kindergarten Summer worn/model anchor;
- KGC Primary Summer worn/model anchor;
- KGC Middle Summer worn/model anchor;
- KGC High Summer worn/model anchor;
- KGC High Summer polo front packshot;
- KGC High Summer polo back packshot;
- authorized KGC crest/logo;
- authorized KGC campus exterior.

These remain review-scoped. Their appearance in a protected preview is **not public publication permission**.

Do not use:
- generated fake client people;
- generated fake client garments;
- fabricated exploded layers;
- fictional logos presented as customers;
- fake metrics/testimonials/certifications/order outcomes.

When a future sector or state lacks real media, the design remains typographic/material-led or uses a clearly neutral structural placeholder; it does not fabricate evidence.

## Current approval candidate

**Exact browser-design candidate:** `fd9732444005bbacc9a2b596e1a8dd6a0464b9eb`  
**Hosted validation:** push run `35664989280`, job `106548611626` — GREEN.  
**Evidence artifact:** `10669270272` — contains browser screenshots/test evidence and real-review-media provenance.  
**Protected Vercel project:** `fares-uniform-design-authority` / `prj_NihDUJroYCeAqi6OF8aVAuxi94w0`.  
**Exact protected preview deployment:** `dpl_BXFdJMmRzYSd37AuxFeY9MECgefN` at `fares-uniform-design-authority-hu9hhps4k.vercel.app`.

Hosted evidence proves:
- locked install, TypeScript and optimized production build GREEN;
- the eight browser-design journeys GREEN;
- current real review assets staged from the existing private/review sources rather than committed into Git;
- English desktop, English mobile, Arabic RTL mobile and reduced-motion review states exercised;
- KGC High worn context -> real front/back polo inspection works without fabricated construction layers;
- unknown/invalid locale paths resolve as clean 404s rather than application errors;
- Vercel Authentication is explicitly enforced with `ssoProtection.deploymentType=all`;
- anonymous access returns a redirect to Vercel authentication, not the review content;
- the approval candidate is a **preview** deployment, not a production deployment;
- the real `fares-uniform` Vercel project, public domain, public R2 publication boundary, PR state and production launch remain unchanged.

This is the first D-059 browser-native design candidate that is ready for Fares's visual review. It is **not approved until Fares explicitly approves this exact design SHA**. Any visual changes requested during review create a new candidate SHA and require the same hosted design gate again.

## Approval contract

Fares approves the final interactive review by exact Git SHA. The approved SHA must include:
- Home desktop/mobile;
- Work/project route;
- Garment library/detail/inspection;
- Enquiry;
- English and Arabic RTL;
- reduced-motion behavior;
- component/state review route;
- current real review assets.

Only after that approval may production `apps/public-web` be reconciled/promoted from the approved coded authority.
