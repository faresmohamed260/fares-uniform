# Phase 10 — Public-site productionization

Status: **AUTHORIZED / ACTIVE — WORKSTREAMS 10.1–10.3 GREEN; WORKSTREAM 10.4 ACTIVE (SLICES A–C GREEN).**

Authorization: Fares accepted this productionization plan on 2026-09-20 and authorized Phase 10 repository engineering, hosted CI and provider work required by this contract. Production launch/cutover, Gate D approval, real-client publication, price/stock exposure and merging PR #7 remain separately gated.

Active branch: `phase-10/public-site-productionization`, stacked on the unmerged Phase 9 branch.

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

- Phase 9 audit/documentation HEAD at Phase 10 branch-off: `168aea8b9d21b8ed9db38083bf4c13f0933a418b`;
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

## Target route contract

- `/[locale]`;
- `/[locale]/work`;
- `/[locale]/work/[organization]/[program]`;
- `/[locale]/work/[organization]/[program]/[garment]`;
- stockless catalog routes remain separately available where useful.

Supported locales initially: `en`, `ar`.

Unknown published content must 404; no silent fallback to another organization.

## V2 content contract

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
Status: **GREEN.** Preserved RED commit `dceb1b5f35dcd6837cf6509d6e2a24eb98b3a435` failed as intended before the V2 editorial models existed; implementation commit `1d53cb0aa6d26cc8753db3af7f122fb1b5b46e3d` passed exact-head run `35535480047`, job `106143624278`, including V1+V2 addon tests and a repeatable public-addon upgrade. Exact evidence is recorded in `docs/validation/PHASE_10_PUBLIC_SITE_PRODUCTIONIZATION.md`.

The accepted sequence remains the rule for later contract extensions: write exact tests first, preserve meaningful RED, then implement the smallest Odoo public editorial/serializer boundary needed to make those tests GREEN.

Required evidence:
- exact addon tests;
- no price/stock/internal IDs;
- V1 remains GREEN.

### 10.2 R2 publication boundary RED -> GREEN
Status: **GREEN.**

Preserved provider RED: commit `874a32e5bc9304df8aa8b67ddda4086f24513e23`, run `35537516748`, job `106149079993`, failed closed before public-bucket mutation because no narrow R2 credentials existed.

Synthetic private-source seed: commit `5ca8dfea51bc52160a64d1a8471c47e33b925cd6`, run `35538270515`, job `106151129369`, proved exact source hash and retained no public delivery endpoint on the private bucket.

Exact-head GREEN: commit `758cf5889e25e62e46db4e2c3c9cacd46105c6ab`, publication run `35538533822` / job `106151844125`, plus V1+V2 contract run `35538533842` / job `106151844070`. The hosted proof used one-hour bucket-scoped account tokens, asserted cross-bucket `403` denial both ways, verified the hash-addressed synthetic public derivative, kept the broad Cloudflare token out of the data-plane step, revoked both narrow tokens, and preserved private/public storage metadata as non-serialized Odoo publication state.

KGC and other real-client publication remain unauthorized. The public bucket still has no browser delivery hostname/custom domain selected by this proof.

### 10.3 Public foundation RED -> GREEN
Status: **GREEN.**

Preserved RED: commit `9189c80ab8a603c19bfd735df3652e2d380220c1`, push run `35540594733`, job `106157401728`, failed five of six new browser requirements before the production locale foundation existed.

Implementation commit `8421610dc2cc2806a4a2a270284c888092e4d956` added canonical `/[locale]` routing, server-rendered EN/AR document language/direction, deterministic Inter/Noto Sans Arabic typography, metadata/canonical/hreflang, a Fares-led production shell, V2 runtime schema validation, work discovery and branded 404 handling. A test-harness-only ambiguity between two valid “Explore our work” links was corrected by commit `4584dea94e1850a64923be1ce2e25d712e31d258`, whose exact push run `35542018665` passed all six browser checks.

Final authority `df1d9741087466edead5c358556b91ca4371f910` adds the localized recoverable error boundary. Exact push run `35542111158`, job `106161514846`, passed typecheck, optimized production build and 6/6 Playwright checks. Artifact `10614518679`, digest `sha256:963b9e1585202ccae9c34f15e91f3eecb3d3c53ab6c6712a0d18a0969241d9f8`.

Evidence covers EN/AR SSR document attributes, canonical/hreflang, keyboard focus, Arabic mobile/no horizontal overflow, Fares-led home, canonical work discovery, fail-closed unknown routes and no price/stock/private-field leakage in rendered/RSC/JSON response bodies. Production remains unlaunched.

### 10.4 Pattern in Motion migration loop
Status: **ACTIVE. Functional migration Slices A–D are GREEN; final visual compare-and-correct remains open.**

Preserved RED: commit `50e518e2366b4b268ca15a43dbc9f3a7687038cd`, run `35542377221`, job `106162244837`, failed 4/5 focused migration checks because project cards did not resolve to canonical project routes and the generic project route did not yet exist. RED artifact `10615062850`, digest `sha256:63a7d3f78896f5f627766a2710a69c6c0d63c7522318c08b5ba55b4c4799b60e`.

Slice A implementation: commit `18fe61434ae5aa9781d8433e9aefc0ecfb2cd1e6`. Exact Pattern run `35542574565`, job `106162789534`, passed typecheck, optimized build and 5/5 Playwright checks. Artifact `10615636464`, digest `sha256:63d55b84618639b6a16c6cdbf96e232d68138d5e1953614a986774399161bd3e`, stages the current EN desktop and AR mobile captures beside the approved Phase 9 landing boards. Foundation regression run `35542573884`, job `106162787065`, is also GREEN.

The production slice is Fares-led and organization-agnostic, uses a bounded Motion material-study client island with reduced-motion handling, adds canonical `/[locale]/work/[organization]/[program]` routes, applies validated V2 visual-skin data through controlled CSS variables, and uses only the synthetic non-school Harbor House fixture. KGC remains unpublished and no client-ID branching was introduced. Final visual parity remains open while later 10.4 slices are migrated and compared.

Slice B — generic cohort/role lineup + look continuity — is also **GREEN**. Preserved RED commit `f653e64915c4a233ccaec8019f7a3ad38b2f68e6`, run/job `35542784351` / `106163354327`, failed only the two new continuity checks (5 existing checks remained GREEN). Implementation `0eda6bcd6611b8790081ea90491c339efe1fa1b4` passed exact Pattern run/job `35543416489` / `106165042260` with 7/7 checks and foundation regression `35543416418` / `106165042091`. The component is driven entirely by V2 cohorts/looks/garments, preserves shared looks only where declared by the contract, keeps role/look state addressable in the URL, and proves a three-role non-school fixture in EN desktop and AR mobile.

Slice C — garment detail/inspection — is **GREEN**. Preserved RED commit `0e6ee64bed055e1b333d25bec8fa005c3209760c`, run/job `35543546283` / `106165415096`, kept all eight prior checks GREEN and failed only the two new inspection journeys. Implementation `204b7ce0bf82e1f6a32fbb739ac93e3559598324` passed exact Pattern run/job `35543688161` / `106165752586` with 10/10 checks and foundation regression `35543688160` / `106165752798`. Garment URLs preserve valid role/look context, unknown garments fail closed, and the inspection rig falls back to flat presentation unless both `inspection_mode=exploded` and published layer media are present. This intentionally preserves the D-053 source-truth rule.

Slice D — contextual enquiry handoff — is **GREEN**. Preserved RED commit `670b37261ae7904214d88f6b9b217b783c897726`, run/job `35543839523` / `106166197034`, kept 10/10 prior migration checks GREEN while the two new context-handoff journeys failed because the links and form prefill did not yet exist. Implementation `ea13f40a7897b51994066e2a0be011e559d3056d` passed exact Pattern run/job `35544749528` / `106168556671` with 12/12 checks and exact foundation regression `35544749469` / `106168556339` with 6/6 checks. Project/look and garment views now carry only validated public slugs to the homepage; the server resolves those slugs through the V2 public project contract and prefills the existing organization, sector and message fields. The enquiry POST schema was not expanded, `source_product_slug` remains empty for showcase-context enquiries, and Odoo idempotency behavior is untouched.

Port one scene/component at a time:
1. Fares introduction — **GREEN**;
2. selected work/project entry — **GREEN**;
3. cohort/role lineup — **GREEN**;
4. look continuity — **GREEN**;
5. garment inspection — **GREEN (truthful flat fallback; exploded only when published layer capability exists)**;
6. contextual enquiry — **GREEN**.

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

- accepted Phase 10 authorization and any subsequent durable architecture decisions;
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
