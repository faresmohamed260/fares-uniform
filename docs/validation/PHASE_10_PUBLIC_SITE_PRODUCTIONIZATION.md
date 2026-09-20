# Phase 10 validation — public-site productionization

Status: **WORKSTREAMS 10.1–10.3 GREEN — WORKSTREAM 10.4 ACTIVE; SLICE A GREEN.**

Branch: `phase-10/public-site-productionization`.

Draft review: PR #8 is stacked against `phase-9/public-site-kinetic-prototype`; PR #7 remains draft and unmerged.

Production status: **NO-GO.** Phase 10 authorization covers repository engineering, hosted CI and provider work required by the accepted contract. It does not authorize production launch/cutover, Gate D approval, public KGC/client publication, price/stock exposure or merging PR #7/#8.

## Workstream 10.1 — V2 public contract

### Preserved RED

- commit `dceb1b5f35dcd6837cf6509d6e2a24eb98b3a435` — `test: define Phase 10 V2 public contract`;
- run/job `35535262459` / `106143034778`;
- result: **RED**, `4 failed, 0 error(s) of 12 tests`;
- root cause: the contract correctly required the new public editorial graph before those models/routes existed;
- artifact `10612795839`, digest `sha256:88a248d91dacb1af36ee6458875fbfc80b8ab76e4d79218ff1c904b8a32ec6c9`.

### GREEN

Implementation commit `1d53cb0aa6d26cc8753db3af7f122fb1b5b46e3d`, run `35535480047`, job `106143624278`, passed the exact source-controlled V2 OpenAPI contract, V1 regressions and repeatable `fu_core,fu_public_api` upgrade. Odoo reported 12 post-test methods / `fu_public_api: 22 tests` and `0 failed, 0 error(s)`. Artifact `10612715734` has digest `sha256:1227670137d266e016e6c925d54d529347cf9526df0d04d228934c7f0c2974a9`.

Contract coverage includes strict EN/AR locale behavior, unpublished/unknown 404 behavior, organization/program/cohort/look/garment/media relationships, no operational IDs, no price/cost/stock, no SKU/barcode and no private R2/admin metadata in public payloads.

## Workstream 10.2 — R2 publication boundary

### Preserved provider RED

- commit `874a32e5bc9304df8aa8b67ddda4086f24513e23`;
- publication run/job `35537516748` / `106149079993`;
- result: **RED before mutation** because no narrow R2 credentials existed;
- artifact `10612704649`, digest `sha256:e3e1d3b4e2db25a8b430f146ac3857609100458d6951fcc0842252747f1f96d6`.

The broad Cloudflare token was not substituted into the object data-plane step to obtain GREEN.

### Synthetic private-source seed

Commit `5ca8dfea51bc52160a64d1a8471c47e33b925cd6`, run `35538270515`, job `106151129369`, wrote and read back the deterministic synthetic source at `phase10/synthetic/source/media-publication-proof-v1.svg`, verified SHA-256 `9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb`, and reconfirmed the private bucket has no managed public delivery or custom domain. Artifact `10613679190` has digest `sha256:8e9663769797259e1620f8fb7241447476853e379adec0f870edcf5784627003`.

### Exact-head GREEN

Implementation authority: `758cf5889e25e62e46db4e2c3c9cacd46105c6ab`.

R2 publication run `35538533822`, job `106151844125`, is **GREEN**:

- minted one-hour private-read and public-write Cloudflare account tokens scoped to exactly one R2 bucket each;
- derived masked S3 credentials on-runner;
- object data-plane step had no `CLOUDFLARE_API_TOKEN`;
- private-read credential fetched only the private source and received HTTP `403` against the public bucket;
- public-write credential wrote/read the public derivative and received HTTP `403` against the private bucket;
- public derivative was 507 bytes and hash-addressed at `projects/synthetic-phase10/publication-proof/media-9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb.svg`;
- SHA-256, content type, immutable cache control and object metadata matched;
- both ephemeral account tokens were revoked in the unconditional cleanup step;
- artifact `10613846012`, digest `sha256:cdead7ddffa0ba393600e2b674bd0da872ee652f0a2f2ae1f408610084905bf2`.

The same exact head passed Odoo public-contract run `35538533842`, job `106151844070`:

- 13 post-test methods;
- `fu_public_api: 23 tests`;
- `0 failed, 0 error(s)`;
- repeatable `fu_core,fu_public_api` upgrade GREEN;
- runtime identity `fares_sha=758cf5889e25e62e46db4e2c3c9cacd46105c6ab`, pinned Odoo `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`;
- artifact `10613553442`, digest `sha256:889da64179b041005c92a832dae10e818db4de394ff3b8fa01efc9c25e12ab6e`.

The Odoo contract now requires a hash-addressed public object identity for published media, forbids private/public R2 object identity and hashes from the public DTO, and rejects `*.r2.cloudflarestorage.com` as a browser-facing public media URL.

No KGC or other real-client asset was published. The public R2 bucket still has no browser delivery hostname/custom domain enabled by this work.

## Workstream 10.3 — production public-web foundation

### Preserved RED

- contract commit `9189c80ab8a603c19bfd735df3652e2d380220c1` — `test: define Phase 10 public foundation`;
- exact push run/job `35540594733` / `106157401728`;
- result: **RED**, five of six new browser checks failed while the existing app still lacked canonical locale routing/document attributes/production shell behavior;
- artifact `10614960527`, digest `sha256:cbb782525ab7e32eb89709fda1640a45621721b97056309f767678f1ccdd97ea`.

### Implementation and harness correction

Commit `8421610dc2cc2806a4a2a270284c888092e4d956` built the production foundation: canonical locale routes, SSR `lang`/`dir`, deterministic Inter/Noto Sans Arabic fonts, canonical/hreflang/OpenGraph metadata, Fares-led shell, branded localized routes/404, strict V2 runtime parsing and canonical work discovery. Typecheck and optimized build were GREEN. The remaining browser failure was not a product defect: the selector `getByRole("link", { name: "Explore our work" })` matched both the hero CTA and a selected-work link. Commit `4584dea94e1850a64923be1ce2e25d712e31d258` scoped the contract to the hero CTA without weakening the navigation requirement. Exact push run `35542018665` then passed 6/6 foundation checks; artifact `10614932515`, digest `sha256:d5d60cfabc38fd087590c8e24067916eaaf6a5c84e21b697609b27c6d7199ba9`.

### Exact-head GREEN

Final implementation authority: `df1d9741087466edead5c358556b91ca4371f910`.

Exact push run `35542111158`, job `106161514846`, is **GREEN**:

- locked dependency install passed;
- TypeScript typecheck passed;
- optimized Next.js production build passed;
- 6/6 Phase 10 foundation Playwright checks passed in 4.0s;
- root redirects canonically to `/en`;
- `/en` and `/ar` return server-rendered document `lang`/`dir`;
- canonical and EN/AR alternate metadata is present;
- the English homepage is Fares-led rather than KGC-led;
- keyboard focus and Arabic mobile RTL/no-overflow checks pass;
- canonical work discovery passes;
- rendered/RSC/JSON response capture remains free of price, stock, inventory, barcode, SKU, cost and EGP leakage terms;
- unknown locale/route requests fail closed;
- localized branded 404 and recoverable error boundaries are present;
- artifact `10614518679`, digest `sha256:963b9e1585202ccae9c34f15e91f3eecb3d3c53ab6c6712a0d18a0969241d9f8`.

No KGC or other real-client media was published and no production deployment/cutover occurred.

## Workstream 10.4 — Pattern in Motion production migration

### Slice A — Fares introduction + selected-work/project entry

#### Preserved RED

- contract commit `50e518e2366b4b268ca15a43dbc9f3a7687038cd` — `test: define first Pattern in Motion production slice`;
- exact push run/job `35542377221` / `106162244837`;
- typecheck and optimized production build passed before the focused browser contract;
- focused result: **4 failed, 1 passed of 5**;
- failures were the intended missing production behavior: selected-work/project cards had no canonical project destination and `/en|ar/work/harbor-house/service-program` returned 404;
- RED artifact `10615062850`, digest `sha256:63a7d3f78896f5f627766a2710a69c6c0d63c7522318c08b5ba55b4c4799b60e`, retained traces/failure captures and the committed Phase 9 landing boards.

#### GREEN

Implementation authority: `18fe61434ae5aa9781d8433e9aefc0ecfb2cd1e6` — `feat: migrate Pattern intro and project entry`.

Exact Pattern push run `35542574565`, job `106162789534`, is **GREEN**:

- locked dependency install, typecheck and optimized Next production build passed;
- 5/5 focused Playwright checks passed in 4.0s;
- Fares introduction retains the approved “Designed as one. Worn together.” hierarchy and supporting copy;
- a reduced-motion-aware Motion material-study island supplies the first bounded kinetic production element without copying the prototype architecture;
- selected work and work discovery link to canonical `/[locale]/work/[organization]/[program]` routes;
- synthetic Harbor House resolves in EN and AR, with canonical/hreflang metadata and RTL/no-overflow checks;
- unknown/unpublished project identity fails closed with 404;
- project skin comes from validated V2 `visual_skin` values through controlled CSS variables rather than organization-ID branching;
- no KGC/client asset is used or published;
- rendered/RSC/JSON response capture remains free of price, stock, inventory, barcode, SKU, cost and private publication metadata terms;
- artifact `10615636464`, digest `sha256:63d55b84618639b6a16c6cdbf96e232d68138d5e1953614a986774399161bd3e`, contains fresh EN desktop/AR mobile captures and the approved Phase 9 landing reference boards.

Companion exact foundation regression run `35542573884`, job `106162787065`, is GREEN with artifact `10614559213`, digest `sha256:c39fd9a7473a96d175e0f53acb7ab3db536b23d66d46bd135b65d9d763828aa3`.

This closes engineering acceptance for Slice A only. Final visual parity is not claimed yet; the full compare-and-correct/sign-off boundary remains open through the remaining 10.4 slices.

## Next validation boundary — Workstream 10.4 Slice B

Implement the generic cohort/role lineup and look-continuity path using V2 content capabilities, not organization identity or a fixed school-stage count. Preserve canonical EN/AR state, keyboard/touch access, no-price/no-stock/private-field boundaries and hosted rendered evidence beside the Phase 9 visual authority.

Production launch, Gate D, real-client publication and PR merges remain separately gated.
