# Phase 10 — Public-site productionization

Status: **AUTHORIZED / ACTIVE — WORKSTREAMS 10.1–10.8 GREEN; ENGINEERING RENDERED COMPARE-AND-CORRECT COMPLETE; FARES VISUAL ACCEPTANCE NEXT.**

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
Status: **GREEN.**

Preserved RED: commit `fda94d17891a662cabee45838284196583b41442`, run/job `35544957759` / `106169106750`, passed 1/4 focused checks and failed three real accessibility/motion gaps: a 40px mobile skip target, reduced-motion preference not reaching the Motion material island, and the synthetic flat garment fallback lacking an accessible image role. RED artifact `10616451586`, digest `sha256:d328c59136d4a24e75649f4256135eb4754923d5bbf4f84408f02421b1227602`.

Implementation `c0163d43d6003dd56c8431e1f865a1524c9e5646` passes exact accessibility run/job `35545089864` / `106169454594` with 4/4 checks. It adds a browser-native reduced-motion preference bridge, reduced-motion state evidence on project continuity, practical 44px+ touch targets for the affected navigation/garment interactions, a named image role for the degraded flat garment fallback, EN/AR keyboard activation checks, focus-visible evidence, no-overflow checks and a deterministic semantic scan for duplicate IDs, missing image alt attributes, positive tabindex and unnamed controls. Artifact `10616402000`, digest `sha256:b1972ebd65d745607616a44bf3756a92f1d72e8e47d8367641f41984fdf0a6f3`.

Exact regressions remain GREEN: Pattern run/job `35545089857` / `106169454628` (12/12; artifact `10616327131`, digest `sha256:d907acab5200b4151830968189e3a4c4380ec90b46f724480b808f5840c34a5a`) and foundation run/job `35545089859` / `106169454615` (6/6; artifact `10616716330`, digest `sha256:6700fa4128038edb75ca7ffb332cdaf9e67b08ddb182ddcb8d518452ce5e5c8d`).

### 10.6 Enquiry integration
Status: **GREEN.**

Preserved RED: contract commit `f333b7789cb9812a2ed51fe0c69c81b938b7c9af`, run/job `35545407380` / `106170291685`, failed all six hardening journeys before the route had the required form-proof/body/rate/timeout/privacy boundary. RED artifact `10616432546`, digest `sha256:35012b9563f518dccea76d2d670507a2859f18dfb0120d998b65a170b6b3ac31`.

Implementation `fbb6183f4e09dcc2885d16d4b3c502abe8d91109` added the intended controls but run/job `35545612786` / `106170837881` passed only 3/6 and exposed the reverse-proxy origin mismatch. Test authority `0ef73122ae4d952bf4b21dbef2ecd1fcb58a6951` retained that RED through browser-origin probes. Final fix `408a381032736b62ab44d4eefd31782839c68512` validates the browser Origin against trusted forwarded host/proto headers.

Exact final enquiry run/job `35545824164` / `106171404548` passes 6/6 checks. Artifact `10616248547`, digest `sha256:d86381373a2bca8306bcad6e935740f680f48988db740f652de8234ea9580130`.

The GREEN boundary includes a signed short-lived same-origin form proof, unchanged nine-field public intake schema, 16 KiB maximum JSON body, stable public errors, 8-second Odoo upstream timeout, a fail-closed per-runtime rate safety net with `Retry-After`, and privacy-safe event/status logging. Odoo idempotency and append-only semantics remain unchanged.

Same-SHA public regressions are GREEN: Pattern `35545824166` / `106171404365`, foundation `35545824177` / `106171404378`, accessibility/motion `35545824174` / `106171404358`.

### 10.7 Cache, resilience, SEO and performance
Status: **GREEN.**

Meaningful product RED: commit `93e3731825f307b5d865f660121a62adedaf1348`, run/job `35547637216` / `106176328338`, passed typecheck/build, route metadata and resource-budget checks while failing two required behaviors: `robots.txt` returned 404 and the representative homepage made two upstream reads instead of one cached read. Artifact `10617840194`, digest `sha256:0d5440c53ff623ebc8a27d7909d5c0381d5f80c701a241c47bc4676c879ea188`.

Implementation `b19d4bc375c9cfc02bd5d8cd1ba21ab642fbaa5b` added public-content `unstable_cache` revalidation plus sitemap/robots. Fixture-state corrections `29df2262c34348686538caf91a085a9b75ff1f8b` and `30005261389023eb13e8dbef914326f5781ab916` made the cross-route-worker resilience proof deterministic and forced cache expiry before the synthetic upstream failure.

Exact application authority: commit `30005261389023eb13e8dbef914326f5781ab916`, run/job `35549416991` / `106181267052`, **4/4 GREEN**. Evidence proves:
- read-only V1/V2 public content is reused from cache and revalidated;
- the last published response remains available when revalidation receives a synthetic upstream 503;
- canonical robots/sitemap and EN/AR route metadata are present;
- representative mobile homepage stays within the source-controlled JS/CSS/image/request budget;
- catalog images remain lazy and no more than one image may be eager;
- artifact `10617014586`, digest `sha256:90c8571accd3c0abbcf4ec9b4a9df25b60f3e1aa7e3fc88fb1c7f1be939f92de`.

Browser-media authority: provider RED `164beaad01d2c30bbbcc232ddf940e7614cace93`, run/job `35549546604` / `106181611340`, failed because `media.faresuniform.uk` was not configured. Final provider authority `c41a5afcfcf2801a230ce46aa1b1c8d06134fddc`, run/job `35549656743` / `106181910393`, is GREEN: `media.faresuniform.uk` is attached only to `fares-uniform-media-public`; public `r2.dev` delivery remains disabled; the public bucket inventory contains only the deterministic synthetic publication object; exact SHA/cache metadata and Cloudflare HIT/REVALIDATED behavior were verified; private bucket custom-domain count remains zero and managed public delivery remains disabled; the ephemeral public-read token was revoked. Artifact `10617767603`, digest `sha256:b0c7f20c7618155dea0798c7f2c943e92837772196449456db9fd39b5529978a`.

No real-client publication was authorized or performed.

### 10.8 Full hosted candidate
Status: **GREEN at the hosted engineering boundary.**

Preserved RED: contract commit `633523683f73a6a74e75577ce01582350268fcf4`, push run/job `35566791616` / `106230128427`. The source/static-quality gate, typecheck, optimized build and all six functional/browser matrices were already GREEN; the job failed only while staging visual-authority evidence because the workflow referenced nonexistent `approved-desktop-inspector.png`. RED artifact `10624089408`, digest `sha256:cec4c3be7260b68c4746ec1b7543d0060e2da8219a6339ade4a553ae5af620ee`.

Workflow correction `0f5f3528a4eb67953bcb14c5740433a2e2d2bb80` replaced that stale filename with the committed `approved-garment-inspector.png`. Cleanup authority `cef36c8f3acec7748ffeb3d955ad1186edf8b57f` removed a redundant resilience harness without changing the production implementation.

Exact full-candidate push run/job `35609594487` / `106365093566` is GREEN:
- source/static-quality gate passed;
- TypeScript typecheck passed;
- optimized production build passed;
- foundation 6/6;
- Pattern migration 12/12;
- accessibility/motion 4/4;
- enquiry hardening 6/6;
- full-candidate rendered journeys 4/4;
- cache/SEO/resilience/performance 4/4;
- Phase 9 desktop landing, EN mobile landing, AR mobile landing and garment-inspector authority boards were staged beside current production captures;
- artifact `10643791534`, digest `sha256:e5cd1f2cb3bbd0efc09a109a73e0f51b58f8788f5223d267e816b29048c902ff`.

This closes Workstream 10.8 engineering validation. It does **not** assert Fares's visual-parity acceptance.

### Rendered compare-and-correct checkpoint
Status: **ENGINEERING PARITY CORRECTION COMPLETE / FARES ACCEPTANCE PENDING.**

The latest compare/correct sequence is:
- `5b1929abb6bca3ce695a12e25bf0b11d07027587` — corrected the production shell, editorial geometry, homepage/project/catalog/process composition and truthful garment-inspector visual treatment against the Phase 9 Pattern in Motion authority without importing KGC-specific branching or the prototype checkpoint cascade;
- `7d756ae904fd3c34364cc17cf9120db22a7c0281` — restored a dedicated mobile Pattern navigation surface;
- `ae7f2230b9255cd3d5c3272f767744534762df23` — retained the mobile project/enquiry CTA semantics after the navigation correction.

Exact latest-head full-candidate push run/job `35615691978` / `106385683974` is GREEN at `ae7f2230b9255cd3d5c3272f767744534762df23`. Artifact `10646012719`, digest `sha256:46991f2354ffe7cd285b99aeac5502c4c958ab4702a501e876d2cde1d08c8c4c`, stages the corrected production captures beside the preserved Phase 9 desktop, EN mobile, AR mobile and garment-inspector authority boards. Same-head Pattern, foundation, accessibility/motion, enquiry and cache/SEO push workflows are all GREEN.

This satisfies the engineering compare-and-correct requirement. Exit criterion 10 remains open until Fares explicitly accepts the rendering.

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
