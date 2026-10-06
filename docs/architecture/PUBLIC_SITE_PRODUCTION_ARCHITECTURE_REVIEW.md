# Public site production architecture review

Status: **ARCHITECTURE AUDIT COMPLETE / REMEDIATION PLAN PROPOSED / NO PRODUCTION RUNTIME CHANGE AUTHORIZED**, 2026-09-20.

Audit baseline:
- active branch: `phase-9/public-site-kinetic-prototype`;
- audited branch HEAD: `257a26dcf2c9b42e718238023b0264c6f30fda2a`;
- current rendered visual authority: `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256`;
- final Phase 9 render run/job: `35529953588` / `106128675433`, 8/8 Playwright journeys GREEN;
- final Phase 9 artifact: `10610259627`, digest `sha256:852ddd4842b562d18bc233bcc0e1db9df8a1497053e98aa5c5974738966971ac`;
- current `main`: `99c51502a25fbd2a5464e2c5753c655113b83c54`;
- latest observed scheduled staging-health run on that `main`: `35525992249`, GREEN.

This review is intentionally impartial. It does not treat the visually successful Phase 9 prototype as production architecture merely because its hosted checks are GREEN. It also does not reopen the accepted visual goal. The purpose is to preserve the accepted Pattern in Motion experience while removing prototype-only implementation debt before production integration.

## 1. Non-negotiable goal preserved

The target remains:

- a premium, modern, kinetic Fares Uniform public experience rather than a generic ecommerce or SaaS template;
- Fares-led and organization-agnostic, with real client/project skins as data rather than hard-coded site identities;
- photography/material-led storytelling, meaningful morphing/physics where it improves continuity, and restrained chrome;
- first-class English and Arabic RTL;
- keyboard, touch and reduced-motion parity;
- no public price or stock exposure;
- contextual enquiry as the conversion path;
- Odoo Community as operational/domain truth rather than a duplicated commerce database;
- Vercel as the public application runtime;
- Cloudflare R2 as the selected object-storage layer;
- Supabase PostgreSQL as the current Odoo durable database boundary;
- truthful media/publication controls: original client media only when approved, no fabricated KGC construction;
- production remains NO-GO until the separate release/Gate D boundary is satisfied.

The remediation plan must improve engineering quality without flattening the approved visual concept into a conventional catalog template.

## 2. What is already architecturally healthy

Several foundations should be retained rather than rewritten:

1. **Narrow public boundary.** `fu_public_api` exposes allowlisted public routes and the browser does not receive broad Odoo/database credentials.
2. **No price/stock public DTO.** The existing Phase 4A five-field catalog serializer is deliberately narrow and has contract tests.
3. **Private service binding.** Next.js calls Odoo server-side through the Vercel service boundary; broad Odoo routes are not rewritten publicly.
4. **Operational truth stays in Odoo.** The website is not a second stock/order/payment ledger.
5. **Idempotent enquiry intake.** Odoo uses a company-scoped idempotency key plus transaction advisory locking.
6. **Bilingual and interaction evidence exists.** English desktop/mobile, Arabic RTL, keyboard and reduced-motion paths are already part of hosted validation.
7. **R2 is now explicit.** Public, private and backup buckets exist; the six Phase 9 KGC review originals were migrated with hash verification.
8. **Media truth rules are strong.** D-053 prevents invented KGC client media; D-048 provides a truthful flat-view fallback.
9. **Visual authority is preserved.** The approved Pattern in Motion boards and final rendered evidence give a concrete fidelity target for refactoring.

The correct next step is therefore **productionization by controlled migration**, not a ground-up redesign.

## 3. Executive assessment

The current repository contains **two different public-site architectures**:

- `apps/public-web` is the actual production-oriented Next.js surface. It owns the narrow Odoo integration, enquiry form and deployed routing, but its UI/content model is the older simple catalog.
- `prototype/public-site-motion` is the accepted visual/interaction direction. It proves the desired experience, but it is a static review application with hard-coded fixture logic and no production content or conversion integration.

The most important conclusion is:

> **Do not copy or rename the prototype into production. Port the approved visual system into `apps/public-web` after correcting the content, routing, media, security, accessibility and styling architecture.**

Promoting the prototype wholesale would preserve appearance but also preserve several unusual and fragile patterns that are acceptable only in an isolated design proof.

## 4. Findings

Severity definitions:
- **BLOCKER** — must be corrected before the approved prototype can replace the current public site.
- **HIGH** — should be corrected during productionization; leaving it creates material security, accessibility, maintainability, SEO or resilience risk.
- **MEDIUM** — not an immediate blocker, but should be resolved before calling the public implementation production-ready.
- **LOW** — repository/maintenance cleanup that should happen with the migration.

### PS-A01 — Two independent Next.js public applications — BLOCKER

Evidence:
- production target: `apps/public-web`;
- visual prototype: `prototype/public-site-motion`;
- both have independent `package.json`, lockfile, tsconfig, Next config and Playwright config;
- dependency sets are nearly duplicated.

Why this is problematic:
- it creates two frontend authorities;
- production fixes can miss the prototype and design fixes can miss production;
- a long-lived fork guarantees visual, security and dependency drift.

Required correction:
- `apps/public-web` remains the single production application;
- Phase 9 remains visual/reference evidence;
- migrate accepted components/behavior into `apps/public-web` section by section;
- after exact production parity is proven, remove/archive executable prototype source while retaining the boards, validation history and artifact IDs.

### PS-A02 — Production data contract cannot express the approved experience — BLOCKER

Evidence:
- Phase 4A production DTO is exactly `slug,name,summary,sector,image_url`;
- Pattern in Motion requires organization, program, cohorts/roles, looks, garments, media, visual skin, sharing, rights and enquiry context;
- `prototype/public-site-motion/lib/projects.ts` supplies these concepts only as static TypeScript fixtures.

Impact:
- the approved site cannot be populated from the production backend without either hard-coding client stories into frontend source or inventing a second ad-hoc data source.

Required correction:
- add a versioned public-content contract rather than stretching the five-field product DTO;
- keep the Phase 4A V1 catalog contract intact during migration;
- introduce a V2 public editorial/showcase model and exact allowlisted serializer.

### PS-A03 — The supposedly generic prototype contains organization-ID branching — BLOCKER

Evidence from the audited source:
- `pattern-experience.tsx`: 19 `isKgc` references and explicit `kgc-national` checks;
- `explode-experience.tsx`: inspection mode is derived from `project.id === "kgc-national"`;
- `globals.css`: 66 `.kgc-project` selectors;
- KGC is restricted to Summer in component logic even though the fixture contains other looks.

The most serious example is `flatMode = isKgc`. Inspection capability is therefore derived from the client identity instead of the media/garment capability. A future real non-KGC client without separated layers would incorrectly fall into the synthetic exploded path.

Required correction:
- no production component branches on an organization slug/ID;
- inspection mode comes from garment/media capability data;
- hero, stage labels, detail labels, look availability and skin variants come from validated project content;
- synthetic/real is media-level metadata, not an organization-name heuristic.

### PS-A04 — The prototype homepage defaults to KGC, contrary to the approved goal — BLOCKER

Evidence:
- `app/page.tsx` falls back to `projects[0]`;
- `projects[0]` is KGC;
- the Pattern in Motion specification explicitly requires a Fares-led, organization-agnostic homepage and says the homepage must not default to one client.

Required correction:
- production root route is a Fares capability/selected-work entry;
- KGC, once publication rights are approved, is one selected-work route/card, not the global identity;
- no client logo/color/motif leaks into the Fares shell.

### PS-A05 — Review query parameters are not a production route/state architecture — HIGH

Evidence:
- review route accepts aliases such as `cohort|role` and `look|garment`;
- invalid organization/program state silently falls back to the first project;
- cohort/look changes are local state and do not update the landing URL;
- language toggling changes DOM/client state but not the URL;
- project selection is seeded once and cannot be changed through a real discovery route.

Impact:
- refresh/share/back behavior is inconsistent;
- a malformed URL can display a different organization rather than 404;
- canonical SEO URLs cannot be defined reliably.

Required correction:
- adopt one canonical route vocabulary;
- strict server-side slug resolution; unknown published records return 404;
- use route segments for locale/project identity and only bounded search parameters for temporary interaction state;
- update URL state when a shareable cohort/look state changes.

### PS-A06 — The entire showcase is a client component and imports all project fixtures — HIGH

`PatternExperience` is `"use client"` and directly imports `projects`. This means all fixture content needed by that module becomes client-side application data rather than only the selected published project.

Risks:
- unnecessary hydration and JS;
- future unpublished/draft content could be exposed if the same pattern is retained;
- SEO/server rendering is weaker than necessary.

Required correction:
- fetch/validate one published DTO on the server;
- render static shell/story content as Server Components;
- hydrate only bounded client islands such as cohort/look selection, garment viewer, mobile navigation and enquiry form;
- never ship the complete editorial database to the browser.

### PS-A07 — CSS is an append-only visual patch history, not a maintainable style architecture — HIGH

Measured audit facts for `prototype/public-site-motion/app/globals.css`:
- 2,915 lines / about 64 KB;
- 16 checkpoint override blocks (including two “Checkpoint 30” blocks);
- 30 media-query blocks;
- 16 separate `max-width: 760px` blocks;
- 12 separate `min-width: 1121px` blocks;
- 19 `!important` declarations;
- 144 explicit `[dir="rtl"]` selectors;
- 37 `left:` and 73 `right:` declarations versus very limited logical inset usage.

This history was useful for converging visually, but promoting it would create a brittle cascade where later patches silently depend on earlier mistakes.

Required correction:
- freeze the final screenshots as regression authority;
- rewrite the final settled styles into semantic tokens plus component-scoped styles;
- use logical properties by default;
- consolidate responsive behavior into one intentional breakpoint strategy;
- remove checkpoint override blocks and `!important` patches after parity is reproduced.

### PS-A08 — “Project skin” is mostly nominal rather than functional — HIGH

Evidence:
- the component sets `--project-accent` and `--project-soft`;
- the stylesheet does not use either variable;
- the global `--red` token is referenced repeatedly;
- there are many KGC-specific selectors and no equivalent generic project selector system.

Required correction:
- define a small controlled public skin contract: accent, accent-soft, ink, motif and allowed layout/motion variants;
- map those values to semantic CSS variables;
- component geometry must not depend on client ID;
- arbitrary CMS CSS is prohibited.

### PS-A09 — Locale handling is client-mutated and non-canonical — BLOCKER

Both current public apps render root `<html lang="en">`. Arabic state is then applied with a client `useEffect` or only on nested `<main>`.

Problems:
- first server response has the wrong document language/direction for Arabic;
- refresh after an in-page language toggle can revert because the query URL is stale;
- canonical/hreflang routing is poor;
- accessibility tools and crawlers see inconsistent document metadata.

Required correction:
- canonical locale route segments, e.g. `/en/...` and `/ar/...`;
- server-render `<html lang dir>` from the locale segment;
- language switch is a link to the equivalent canonical route;
- no document-direction mutation as the primary locale mechanism.

### PS-A10 — Typography is not deterministic — HIGH

The approved prototype uses:
- `"Iowan Old Style", "Baskerville", "Times New Roman", serif`;
- `Inter, "Segoe UI", Tahoma, Arial, "Noto Sans Arabic", sans-serif`.

These fonts vary by OS and many visitors will not have the preferred faces. The same composition can therefore wrap and feel materially different across Windows, Android, iOS and Linux.

Required correction:
- choose licensed/load-tested Latin and Arabic families during productionization;
- load them deterministically with `next/font` or approved self-hosted assets;
- preserve the approved high-contrast editorial hierarchy and Arabic legibility;
- record font licensing and fallback behavior.

### PS-A11 — Custom controls do not consistently follow the project's prebuilt-first accessibility rule — HIGH

Examples:
- stage cards use `role="tab"` but do not implement normal tab keyboard arrow/roving-tabindex behavior or a real tabpanel contract;
- mobile navigation is a custom conditional `div` without dialog/sheet focus containment, Escape handling or `aria-controls`;
- inspector accordion behavior is hand-built.

Required correction:
- use Base UI or another approved maintained primitive for Tabs, Sheet/Dialog and Accordion where semantics fit;
- custom editorial layout can wrap those primitives;
- do not use ARIA roles unless the full keyboard contract is implemented.

### PS-A12 — Reduced-motion handling is incomplete for JS-driven landing motion — HIGH

The stylesheet globally shortens CSS transition/animation duration under `prefers-reduced-motion`, and the inspector has a JS media-query hook. The landing Motion components, however, do not use Motion's reduced-motion state directly.

Required correction:
- use one shared reduced-motion mechanism (prefer Motion's maintained reduced-motion hook/config for Motion components);
- define static/cross-fade variants for every signature transition;
- test the landing itself in reduced-motion mode, not only the inspector.

### PS-A13 — The approved prototype does not contain the actual enquiry conversion flow — BLOCKER

The production app has `EnquiryForm`; the prototype does not. “Start a project” and “Discuss your uniform” currently resolve to a footer anchor, not a real conversion form.

This is directly contrary to the main marketing goal: exposure should lead to a qualified enquiry.

Required correction:
- integrate the existing proven enquiry behavior into the accepted Pattern in Motion composition;
- preserve project/program/cohort/look/garment context when the visitor opens/submits the form;
- enquiry must remain usable before/without heavy motion.

### PS-A14 — Enquiry context is too product-centric for the approved project model — HIGH

Current contract carries only optional `source_product_slug`. The approved experience needs organization/program/garment context.

Required correction:
- V2 enquiry uses public slugs only, never internal IDs;
- validate selected organization/program/garment against published public content;
- preserve current idempotency and append-only Odoo behavior;
- do not auto-create sales/payment/stock operations.

### PS-A15 — SEO/discoverability architecture is below production standard — HIGH

Current state:
- only generic static title/description;
- no locale-specific metadata;
- no canonical links or hreflang;
- no `robots.ts`, `sitemap.ts`, OpenGraph route metadata or structured Fares organization/service data;
- review query URLs are not canonical content routes.

Required correction:
- generate metadata server-side per locale and published route;
- canonical + EN/AR alternates;
- sitemap contains only published public routes;
- review/private routes excluded from indexing;
- OpenGraph imagery uses publication-approved media only;
- structured data contains only verified claims.

### PS-A16 — Production pages are force-dynamic and coupled to live Odoo on every request — HIGH

`apps/public-web` marks home and detail routes `force-dynamic`; catalog GETs use `cache: "no-store"`. Marketing/public content changes infrequently, so this is unusually expensive and makes public availability depend on live Odoo response latency.

Required correction:
- Odoo remains source of truth;
- cache the read-only public projection in Next's server data cache/ISR with a short, documented revalidation window;
- retain stale published content if regeneration fails;
- enquiry POST remains uncached;
- use explicit upstream timeouts and safe retry rules.

### PS-A17 — Media ownership is split between three incompatible paths — BLOCKER

Current paths:
- legacy production: Odoo `image_1920` -> Odoo HTTP -> Next API image proxy -> browser;
- Phase 9 review: private R2 -> hosted runner -> local review path;
- approved architecture: R2 is now the selected object store.

The legacy route also buffers the complete upstream image with `arrayBuffer()` and production pages mark those images `unoptimized`.

Required correction:
- private R2 stores source/review originals;
- publication approval promotes/copies a web-ready derivative to the public R2 bucket;
- public browser receives only a stable public media URL, ideally under `media.faresuniform.uk`;
- Next Image handles responsive delivery using an approved remote pattern;
- remove the Odoo binary image proxy after the V2 media path is verified.

### PS-A18 — Rights/publication state is documented but absent from the runtime content model — BLOCKER

The design specification requires rights/publication governance. `projects.ts` contains only a project-level `synthetic` flag and direct media paths. It has no per-media rights state, source type, dimensions, alt/caption, credit, publication status or verification metadata.

Required correction:
- rights are enforced server-side in Odoo/editorial models;
- only approved media appears in public DTOs;
- public DTO must not expose private rights notes;
- media records carry localized alt text and stable object identity.

### PS-A19 — Broad Cloudflare credential is used as routine R2 data-plane access — HIGH

The repository secret `CLOUDFLARE_API_TOKEN` is intentionally broad and currently used by the Phase 9 workflow to download six private R2 objects. That is acceptable only as a temporary review/control-plane arrangement.

Required correction before production:
- broad token becomes control-plane-only;
- create narrow R2 S3-compatible credentials for review read, publication write and backup write as separate scopes where needed;
- public media delivery uses no secret in browser/runtime;
- retire the permanent write-side bootstrap workflow after provider state is documented, or convert it to an explicitly manual/audited provider operation.

### PS-A20 — Enquiry abuse/error handling needs a production boundary — HIGH

Current positives: field allowlist, lengths, idempotency and append-only Odoo model.

Current gaps:
- public Next route reads the full JSON body before an explicit body-size cap;
- no bot/honeypot/challenge control;
- no explicit server timeout;
- upstream error payload is forwarded to the browser;
- Odoo returns `str(ValidationError)` as a public message.

Required correction:
- enforce a small request-body limit before parsing;
- stable public error codes/messages only;
- explicit timeout;
- idempotent retry policy for safe transient failures;
- add a low-friction anti-bot boundary (Turnstile or another accepted equivalent) and/or rate limit before production;
- log privacy-safe request outcome, not submitted message content.

### PS-A21 — Contract definitions are manually duplicated across Python, TypeScript and prototype types — HIGH

The current five-field DTO is manually validated in TypeScript and separately implemented in Odoo. That was manageable for Phase 4A; the V2 project graph is too rich for informal duplication.

Required correction:
- source-control a versioned OpenAPI/JSON Schema public contract;
- Python serializers and TypeScript runtime validation are tested against that contract;
- fixture providers run through the same validator;
- contract breaking changes require a new version.

### PS-A22 — Important media lacks a production alt-text model — MEDIUM

Several central model/garment images are rendered with `alt=""`. Some may be intentionally decorative, but the data model cannot distinguish decorative media from meaningful product/client evidence.

Required correction:
- each public media record declares decorative vs informative;
- informative media has EN/AR alt text;
- inspection view announces front/back and current garment context.

### PS-A23 — No production error/loading/degraded-media experience — MEDIUM

Neither current app has a deliberate public `error.tsx`, loading state or production-specific not-found experience. Invalid prototype routes silently fall back.

Required correction:
- branded 404;
- bounded loading/skeleton only where server rendering cannot remove it;
- recoverable public data error state;
- media failure retains copy and enquiry path.

### PS-A24 — No explicit performance budget/gate — MEDIUM

Current evidence proves function and visual fidelity, but not a defined resource/performance budget. The prototype also marks more than the true first-viewport media as `priority`.

Required correction:
- only true LCP/critical assets receive high priority;
- lazy-load below-fold media and heavy interaction code;
- define and measure mobile resource/bundle/image budgets before production sign-off;
- add deterministic CI checks and/or Lighthouse-style evidence after the architecture is stable.

### PS-A25 — Dependency/tooling hygiene is weak — MEDIUM

Both frontend packages include Base UI, Tailwind, CVA, `cn`, shadcn, tw-animate, Motion and Lucide, while the accepted prototype primarily uses Motion/Lucide/custom CSS and production uses little of this stack. The prototype has Tailwind packages but no PostCSS config. Neither package defines a lint script.

Required correction:
- choose the actual production component/styling strategy first;
- remove unused runtime dependencies;
- keep generator/CLI packages out of production dependencies;
- add ESLint/static-quality checks to CI;
- do not add another animation library unless an approved interaction needs it.

### PS-A26 — Dead historical media remains in executable prototype source — LOW

At audit time, at least these committed prototype files are not referenced by the active source:
- `kgc-hero-model.webp`;
- `synthetic-cohort-lineup.webp`;
- `uniform-exploded-editorial.webp`.

Required correction:
- remove unused executable media during prototype retirement;
- preserve provenance/evidence in docs/history rather than carrying dead binaries forward.

### PS-A27 — Existing tests should be expanded for production failure modes — MEDIUM

Current tests are strong for visual state and basic no-leak behavior, but productionization needs additional checks:
- hidden/RSC/network payloads contain no price/stock/private fields;
- strict invalid-route 404 behavior;
- automated accessibility scan on representative EN/AR pages;
- tab/menu/accordion keyboard semantics;
- actual landing reduced-motion behavior;
- SEO canonical/hreflang/sitemap/robots;
- media rights/public/private path separation;
- upstream failure/cache behavior;
- enquiry body limits/anti-bot/error sanitization.

### PS-A28 — Release-control items remain external blockers — GATE, not a frontend defect

D-046/Gate D already records unresolved production release controls. The architecture refactor must not silently treat code completion as production GO. Commercial Vercel plan/spending, production secret custody, release-control policy, publication rights and explicit launch authorization remain separate gates.

## 5. Recommended target architecture

```text
Browser
  |
  v
Vercel / apps/public-web
  |-- Server Components: Fares shell, homepage, work/project copy, SEO
  |-- Client islands: mobile nav, cohort/look continuity, garment inspector, enquiry form
  |-- /api/enquiries: bounded validation + anti-bot + stable public errors
  |
  +---- cached private service call ----> Odoo /fu/public/v2/*
  |                                      |
  |                                      +-- operational product truth
  |                                      +-- public editorial models
  |                                      +-- publication/rights rules
  |                                      +-- append-only enquiries
  |
  +---- public media URLs -----------> media.faresuniform.uk / R2 public bucket

Editorial/media control plane
  Odoo publication record
      |
      +-- private source object -> R2 private bucket
      +-- rights-approved web derivative -> R2 public bucket

Backups remain separate in fares-uniform-backups.
```

Key principle: **Odoo owns what may be published; R2 owns the bytes; Next.js owns presentation/cache; the browser receives only already-public DTOs and media.**

## 6. Target public content model

Do not use `product.template` as the entire marketing CMS. Keep operational product truth there, but add dedicated public editorial entities that may optionally link to operational products.

Recommended internal Odoo model graph:

- `fu.public.organization`
  - public slug/name/sector;
  - approved identity references;
  - publication state.
- `fu.public.program` or project
  - organization;
  - public slug/title/summary/brief;
  - visual skin;
  - ordering;
  - publication state.
- `fu.public.cohort`
  - generic audience group: stage/role/team/department;
  - localized name/tagline/order.
- `fu.public.look`
  - season/use-context;
  - cohort associations;
  - ordered garment relationships.
- `fu.public.garment`
  - public slug/name/category;
  - optional `product.template` link;
  - inspection capability;
  - verified annotation facts.
- `fu.public.media`
  - organization/program/garment relationship;
  - media role/view;
  - R2 object key;
  - dimensions/hash;
  - real/archive/synthetic source classification;
  - EN/AR alt/caption;
  - credit if required;
  - publication/rights state.

The public serializer excludes internal IDs, rights notes, private R2 keys, price, stock, cost, barcode, supplier/customer and operational state.

A real content-management need is therefore met inside the existing Odoo authority instead of introducing a headless CMS by default. A separate CMS may be reconsidered later only if editorial workflow proves Odoo inadequate.

## 7. Target public API contract

Keep existing V1 endpoints working during migration.

Proposed V2 boundary:

- `GET /fu/public/v2/home?lang=en|ar`
  - Fares capability copy plus selected published work references.
- `GET /fu/public/v2/work?lang=en|ar`
  - published organization/program summaries.
- `GET /fu/public/v2/work/<organization>/<program>?lang=en|ar`
  - one complete published project DTO.
- retain or version the stockless catalog as a separate browse surface rather than conflating operational products with client case studies.
- `POST /fu/public/v2/enquiries`
  - current fields plus optional validated public organization/program/garment context.

Contract rules:
- exact allowlist;
- no internal database IDs;
- no price/stock;
- no private media keys;
- runtime schema validation in Next;
- shared source-controlled schema and cross-runtime contract tests;
- fixture mode cannot bypass validation.

## 8. Target route model

Recommended canonical public routes:

```text
/en
/ar

/[locale]/work
/[locale]/work/[organization]/[program]
/[locale]/work/[organization]/[program]/[garment]

/[locale]/catalog
/[locale]/catalog/[slug]
```

Cohort/look selection may use bounded canonical search parameters when it is truly state rather than content identity, e.g. `?cohort=high&look=summer`.

Rules:
- unknown locale/organization/program/garment => 404;
- no aliases like `role|cohort` or `look|garment` in production;
- language switch keeps equivalent route/state;
- homepage is Fares-led;
- project route can preserve immersive Pattern in Motion behavior;
- `/explodeview` remains a prototype/review route and is not the production URL.

## 9. Target frontend structure

Recommended shape inside `apps/public-web`:

```text
app/
  [locale]/
    layout.tsx
    page.tsx
    work/
      page.tsx
      [organization]/
        [program]/
          page.tsx
          [garment]/page.tsx
    catalog/
      page.tsx
      [slug]/page.tsx
  api/
    enquiries/route.ts
  robots.ts
  sitemap.ts

components/
  shell/
  work/
  garment/
  enquiry/
  ui/

lib/
  public-api/
  i18n/
  media/
  seo/

styles/
  tokens.css
  globals.css
```

Implementation rules:
- Server Components first;
- small client islands only where interaction requires state;
- Base UI/approved primitive for generic controls;
- Motion remains the default expressive runtime;
- bespoke editorial composition uses component-scoped CSS and semantic variables;
- do not force Tailwind or another library merely because it is installed;
- one coherent styling strategy, not Tailwind + global patch CSS + component overrides simultaneously.

## 10. Target media lifecycle

### Private source
`fares-uniform-media-private`
- originals;
- review-only client media;
- no public domain;
- narrow read/write credentials only.

### Publication
A media record cannot be public until its publication/rights state permits it.

When approved:
1. produce/select a web-ready derivative;
2. copy it to `fares-uniform-media-public` under an immutable/hash-versioned key;
3. store the public object identity and dimensions in Odoo;
4. public DTO returns only the public URL/metadata.

Suggested public key shape:

```text
projects/<organization>/<program>/<media-id>-<hash>.<ext>
```

### Public delivery
- attach a dedicated media hostname such as `media.faresuniform.uk` only when publication is authorized;
- long immutable cache headers for hash-versioned assets;
- Next Image remote pattern limited to the exact media hostname;
- browser never receives R2 secret credentials.

### Preview
Vercel preview/review may use server-side narrow private-read access. Private URLs must not be serialized into public HTML/RSC/client JS.

## 11. Cache and resilience model

GET public content:
- server-side private Odoo call;
- Next server cache/ISR with a documented short revalidation interval initially;
- stale published page remains usable if a revalidation attempt fails;
- explicit request timeout;
- no browser-to-Odoo dependency.

Enquiry POST:
- `no-store`;
- explicit timeout;
- same idempotency key retained for safe retry;
- stable public error mapping.

Do not create a second permanent content database merely to gain caching.

## 12. Security/hardening plan

Before production:
- broad Cloudflare token removed from ordinary data-plane workflow use;
- narrow R2 credentials by purpose;
- public/private bucket assertions in CI;
- request body cap on enquiry;
- anti-bot boundary;
- stable error codes;
- security headers/CSP appropriate to Vercel + media domain;
- strict route validation;
- no private R2 key or unpublished record in browser/RSC payload;
- existing no-price/no-stock contract expanded to V2;
- production secret ownership/rotation remains Gate D.

## 13. SEO and localization plan

- server-rendered locale segment controls document `lang` and `dir`;
- localized metadata per route;
- canonical URLs and EN/AR alternates;
- sitemap generated from published records only;
- robots policy excludes preview/review;
- publication-approved OpenGraph media;
- deterministic Latin/Arabic fonts;
- Arabic copy remains authored, not machine-mirrored layout text;
- logical CSS properties are the default.

## 14. Accessibility plan

- real Tabs or ordinary buttons; never partial ARIA patterns;
- Sheet/Dialog primitive for mobile navigation;
- accessible Accordion or native details where appropriate;
- informative media receives localized alt text;
- front/back inspection state announced;
- pointer, keyboard and touch parity;
- Motion reduced-motion variants, not only blanket CSS duration overrides;
- automated accessibility scan plus existing manual keyboard/screenshot evidence.

## 15. Performance plan

Preserve expressive design while making it cheap when idle:
- Server Components for static story/content;
- client islands for interaction;
- one primary animation runtime unless a specific approved scene justifies another;
- only LCP media is eager/high-priority;
- below-fold images lazy;
- R2 web-ready masters plus responsive Next Image delivery;
- heavy 3D/video/image-sequence systems remain optional and isolated;
- set measurable mobile image/JS/performance budgets before final production acceptance;
- test low-capability/reduced-motion fallback.

The goal is **not** “remove motion for performance.” The goal is “make the signature motion isolated, interruptible and measurable.”

## 16. Migration plan

### Workstream 0 — freeze evidence and accept architecture
No runtime changes.
- preserve `4120c33…` artifact as visual authority;
- accept/revise this review;
- explicitly approve Phase 10 before implementation.

### Workstream 1 — contract and content foundation
- define V2 JSON/OpenAPI schema;
- add Odoo public editorial models and publication constraints;
- add V2 serializers/tests;
- keep V1 catalog/enquiry operational;
- no visual cutover.

Exit: synthetic V2 project proves organization/program/cohort/look/garment/media relationships with zero forbidden fields.

### Workstream 2 — R2 least privilege and publication lifecycle
- create narrow private-read, publication-write and backup credentials as needed;
- broad Cloudflare token becomes control-plane-only;
- implement media metadata and private->public promotion proof;
- keep KGC private until explicit publication approval;
- decide media hostname only when public publishing is authorized.

Exit: a synthetic asset can move from private review to public derivative without exposing source credentials or private objects.

### Workstream 3 — production frontend foundation
Inside `apps/public-web`:
- canonical locale routes;
- deterministic fonts;
- metadata/sitemap/robots/security headers;
- public API V2 client and runtime schema validation;
- server-component shell;
- semantic tokens/component-scoped styling;
- accessible navigation primitives;
- error/not-found/loading boundaries.

Exit: Fares-led EN/AR shell works without KGC and with JS-disabled/degraded media still retaining content/enquiry access.

### Workstream 4 — port Pattern in Motion, do not rewrite it
- reproduce the approved desktop/mobile/RTL composition in production components;
- remove all organization-ID branches;
- use capability-driven garment inspection;
- implement selected-work discovery;
- contextual URL state;
- retain Motion and accepted physical/kinetic behavior;
- direct compare-and-correct against Phase 9 authority after each migration slice.

Exit: production `apps/public-web` matches the approved visual authority at required states without importing the prototype's checkpoint CSS debt.

### Workstream 5 — integrate conversion and operational boundary
- integrate enquiry form into the accepted composition;
- carry organization/program/garment context;
- body cap, timeout, stable errors, anti-bot;
- retain Odoo idempotency/append-only behavior;
- preserve WhatsApp/phone where configured.

Exit: contextual enquiry GREEN in EN/AR; no sale/payment/stock side effect.

### Workstream 6 — hardening
- accessibility scans and manual keyboard/touch;
- landing reduced motion;
- hidden payload no-leak checks;
- cache/failure tests;
- SEO tests;
- media publication/private-path tests;
- performance/resource budget evidence;
- mobile EN/AR visual evidence.

Exit: no unresolved production-blocking finding from this review.

### Workstream 7 — controlled cutover preparation
- remove unused dependencies/dead prototype media;
- retire prototype executable code only after production parity evidence exists;
- update staging observability for new canonical routes;
- deploy to an authorized preview/staging boundary;
- Fares performs final visual/kinetic review;
- Gate D/production GO remains separate.

## 17. Things explicitly not recommended

To preserve the main goal and avoid architecture drift:

- do **not** replace Odoo with a new CMS/database merely to serve the website;
- do **not** turn Supabase into a duplicate public product/project source of truth;
- do **not** publish KGC/private media simply because it now exists in R2;
- do **not** keep two long-lived public Next.js apps;
- do **not** carry the 2,915-line checkpoint CSS directly into production;
- do **not** remove the kinetic/morphing goal in the name of simplification;
- do **not** add GSAP, Lenis, Three.js, WebGL or another animation runtime before a specific approved interaction requires it;
- do **not** make the homepage a KGC microsite;
- do **not** expose price/stock to make the site feel more “catalog-like”;
- do **not** ship broad Cloudflare credentials in browser/runtime code;
- do **not** treat CI GREEN as human design approval or production GO.

## 18. Acceptance boundary for this architecture review

This document is a recommendation and implementation plan, not production authorization.

The audit is complete when:
- repository index links this review;
- the proposed Phase 10 contract reflects the workstreams above;
- PROJECT.md points to this review as the next planning authority;
- no production runtime source was changed by the audit;
- current Phase 9 GREEN evidence remains intact.

Implementation begins only after Fares accepts or revises the proposed plan.
