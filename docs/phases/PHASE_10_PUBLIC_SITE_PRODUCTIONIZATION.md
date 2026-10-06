# Phase 10 — Public-site productionization

Status: **PROPOSED / NOT YET AUTHORIZED FOR IMPLEMENTATION.**

Proposed branch after Phase 9 closure: `phase-10/public-site-productionization`.

Primary architecture authority: `docs/architecture/PUBLIC_SITE_PRODUCTION_ARCHITECTURE_REVIEW.md`.

## Goal

Move the approved Pattern in Motion experience into the real `apps/public-web` production surface without carrying prototype-only architecture debt.

The phase must preserve the premium kinetic visual goal while making the implementation:
- organization-agnostic;
- content-driven;
- server-rendered where appropriate;
- EN/AR canonical and SEO-ready;
- accessible and reduced-motion complete;
- R2-backed with publication/rights controls;
- context-aware for enquiry;
- resilient when Odoo or media is temporarily degraded;
- strictly free of public price/stock/private ERP data.

## Starting evidence

- Phase 9 current documentation HEAD: `257a26dcf2c9b42e718238023b0264c6f30fda2a`;
- Phase 9 rendered implementation authority: `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256`;
- render run/job: `35529953588` / `106128675433`;
- artifact: `10610259627`, digest `sha256:852ddd4842b562d18bc233bcc0e1db9df8a1497053e98aa5c5974738966971ac`;
- current production/integration `main`: `99c51502a25fbd2a5464e2c5753c655113b83c54`;
- R2 D-054 bootstrap/migration evidence is recorded in `docs/DECISIONS.md`;
- production `apps/public-web` and Phase 4A public Odoo boundary remain unchanged by Phase 9.

Before implementation starts, refresh all identities above from GitHub and use newer verified evidence if present.

## Client goal that may not be weakened

- Fares-led premium fashion/manufacturing presentation;
- Pattern in Motion visual hierarchy and meaningful physical/morphing interaction;
- multi-organization project skins;
- English + Arabic RTL;
- truthful original client media only when approved;
- contextual enquiry;
- no prices/stock;
- organization/project/garment continuity;
- usable touch/keyboard/reduced-motion paths.

Architecture cleanup is not permission to turn the site into a conventional card-grid catalog.

## In scope

1. V2 public editorial/showcase models and exact API contract in `fu_public_api`.
2. R2 media metadata/publication lifecycle and narrow credentials.
3. Canonical locale/public routes in `apps/public-web`.
4. Server Component + client-island frontend structure.
5. Semantic tokens and component-scoped production styling.
6. Maintained accessible primitives for generic controls.
7. Port of the approved Pattern in Motion visual/interaction system.
8. Contextual enquiry integration and abuse/error hardening.
9. SEO, metadata, sitemap/robots and deterministic typography.
10. Cache/resilience behavior for read-only public content.
11. Expanded contract/security/accessibility/performance/rendered validation.
12. Retirement of obsolete prototype executable code only after parity is proven.

## Explicitly excluded

- production launch/cutover;
- Gate D approval;
- publishing KGC or another client without explicit rights/publication approval;
- price or stock exposure;
- ecommerce checkout;
- replacing Odoo with a separate CMS/database;
- analytics/decision dashboards;
- Cloudflare apex proxy changes;
- unrelated ERP/POS redesign;
- WebGL/Three.js/GSAP/Lenis adoption without a separately justified approved interaction;
- real customer/private operational data in tests or screenshots.

## Architecture rules

### Single frontend
`apps/public-web` is the only production public application. `prototype/public-site-motion` is a visual reference until migration closes.

### Odoo owns public editorial truth
Dedicated public models own approved organization/program/cohort/look/garment/media metadata. Operational `product.template` remains operational truth and may be linked where appropriate.

### R2 owns media bytes
Private originals stay private. Only rights-approved web derivatives move to the public bucket. Browser code never receives storage credentials.

### Next owns presentation/cache
Next server code consumes exact V2 DTOs through the private Odoo binding and caches read-only published content. Browser code receives only selected public content.

### Interaction is capability-driven
No component may branch on `kgc-national`, another organization slug, a fixed cohort count, or “real client vs synthetic” inferred from identity. Inspection mode and motion behavior come from validated capabilities.

## Proposed route contract

- `/[locale]`;
- `/[locale]/work`;
- `/[locale]/work/[organization]/[program]`;
- `/[locale]/work/[organization]/[program]/[garment]`;
- stockless catalog routes remain separately available where useful.

Supported locales initially: `en`, `ar`.

Unknown published content must 404; no silent fallback to another organization.

## Proposed V2 content contract

The source-controlled schema must cover:
- organization;
- program/project;
- generic cohort;
- look;
- garment;
- media;
- controlled visual skin;
- sharing/continuity;
- inspection capability;
- public enquiry context.

Internal rights/admin data is not serialized to the browser. Public media DTOs include only approved URL, role/view, dimensions and localized accessibility copy.

## Execution sequence

### 10.1 Contract RED -> GREEN
Write contract tests first for the desired V2 payload, forbidden fields, locale behavior, publication state and strict unknown-slug behavior.

Then implement the smallest Odoo public editorial model/serializer needed to make those tests GREEN.

Required evidence:
- exact addon tests;
- no price/stock/internal IDs;
- V1 remains GREEN.

### 10.2 R2 publication boundary RED -> GREEN
Prove with synthetic media:
- private object cannot be addressed through public DTO;
- approved derivative can be promoted to public bucket;
- public DTO contains only public media metadata;
- narrow credentials work;
- broad Cloudflare token is not needed by ordinary public-web runtime.

Do not use KGC as the first publication proof unless publication rights have been explicitly approved.

### 10.3 Public foundation RED -> GREEN
Implement canonical locale routing, root document language/direction, fonts, metadata, error/404, schema client and basic Fares shell.

Required evidence:
- EN/AR SSR document attributes;
- canonical/hreflang;
- no horizontal overflow;
- keyboard/focus;
- no price/stock in rendered/RSC/network payload;
- production build.

### 10.4 Pattern in Motion migration loop
Port one scene/component at a time:
1. Fares introduction;
2. selected work/project entry;
3. cohort/role lineup;
4. look continuity;
5. garment inspection;
6. contextual enquiry.

After each cohesive slice:
- hosted render;
- side-by-side compare to Phase 9 authority;
- correct material visual/motion differences;
- no direct copy of checkpoint override CSS.

### 10.5 Accessibility and motion hardening
- maintained Tabs/Sheet/Accordion semantics;
- Motion reduced-motion variants;
- touch targets;
- EN/AR keyboard paths;
- media alt state;
- low-capability/degraded-media fallback.

### 10.6 Enquiry integration
Preserve current Odoo idempotency and append-only rules while adding validated public context.

Add:
- bounded body size;
- stable public error mapping;
- timeout;
- anti-bot/rate boundary;
- privacy-safe logging.

### 10.7 Cache, resilience, SEO and performance
- read-only public content cached/revalidated;
- stale published content survives transient Odoo failure;
- sitemap/robots/metadata;
- resource/performance evidence;
- only critical media eager;
- public R2 media caching verified.

### 10.8 Full hosted candidate
Run the full productionization matrix on one exact SHA.

Minimum representative journeys:
- Fares homepage EN desktop;
- Fares homepage AR mobile;
- work discovery;
- one real rights-approved project or synthetic publication-safe fixture;
- non-school fixture;
- cohort/look continuity;
- flat inspection;
- exploded inspection where real/synthetic approved layers support it;
- keyboard navigation;
- reduced motion;
- enquiry EN;
- enquiry AR;
- invalid route/404;
- upstream public-content failure/cached fallback.

## Validation required before phase closure

- Odoo addon tests + upgrade;
- public API V1 regression;
- V2 contract tests;
- Next typecheck;
- lint/static checks;
- optimized production build;
- Playwright interaction suite;
- automated accessibility scan on representative routes;
- no-price/no-stock/private-field payload checks;
- public/private media separation proof;
- SEO route/metadata checks;
- cache/failure behavior;
- rendered desktop/mobile/RTL/inspector evidence;
- direct compare-and-correct against the accepted Phase 9 visual authority;
- exact artifact/run/job/SHA recorded in validation docs.

## Documentation outputs

- accepted architecture decision(s) after Fares approves this plan;
- V2 public contract/schema;
- updated public integration architecture;
- R2 media publication/operations contract;
- Phase 10 validation;
- synchronized PROJECT.md and decision log;
- migration/rollback notes for the public-web cutover.

## Exit criteria

Phase 10 may be called implementation-complete only when:
1. `apps/public-web` contains the approved experience and production integration;
2. there is no organization-ID branching in generic public components;
3. homepage is Fares-led;
4. EN/AR canonical routing/SEO is correct;
5. production content is driven by validated published DTOs;
6. media comes through the approved R2 publication path;
7. public data and browser payloads expose no price/stock/private records;
8. enquiry is contextual, hardened and Odoo-idempotent;
9. accessibility/reduced-motion/performance gates pass;
10. rendered parity is accepted by Fares;
11. obsolete prototype executable code is retired or explicitly retained only for evidence;
12. all exact hosted evidence is recorded.

Phase 10 completion still does **not** equal production launch. Deployment/cutover requires its own explicit authorization and remaining Gate D closure.
