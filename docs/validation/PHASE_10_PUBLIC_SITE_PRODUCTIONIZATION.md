# Phase 10 validation — public-site productionization

Status: **WORKSTREAM 10.1 GREEN — WORKSTREAM 10.2 NEXT.**

Branch: `phase-10/public-site-productionization`.

Draft review: PR #8 is stacked against `phase-9/public-site-kinetic-prototype`; PR #7 remains draft and unmerged.

Production status: **NO-GO.** Phase 10 authorization covers repository engineering, hosted CI and provider work required by the accepted contract; it does not authorize production launch/cutover, Gate D approval, public KGC/client publication, price/stock exposure or merging PR #7.

## Workstream 10.1 — V2 public contract

The V2 contract is source-controlled in `contracts/public-api-v2.openapi.json` and covers exact public home/work/project response shapes, strict EN/AR locale behavior, organization/program/cohort/look/garment/media relationships, strict publication filtering and unknown/unpublished slug fail-closed behavior.

The implementation adds dedicated Odoo editorial/publication models while keeping operational `product.template` truth separate. Public serializers expose only allowlisted public slugs/content/media. Tests explicitly seed operational price, SKU and private R2 object-key values and prove they do not cross the public boundary. Rights-private media and draft records are absent. V1 catalog/enquiry tests run in the same addon test suite.

### Preserved RED

- contract commit: `dceb1b5f35dcd6837cf6509d6e2a24eb98b3a435` — `test: define Phase 10 V2 public contract`;
- run: `35535262459`;
- job: `106143034778`;
- result: **RED**, `4 failed, 0 error(s) of 12 tests`;
- root cause: the contract tests correctly required `fu.public.organization` and the new public editorial graph before those models/routes existed;
- V1 test cases still executed in the same run;
- artifact: `10612795839`;
- digest: `sha256:88a248d91dacb1af36ee6458875fbfc80b8ab76e4d79218ff1c904b8a32ec6c9`.

The RED assertions were not weakened or removed.

### Exact-head GREEN

- implementation commit: `1d53cb0aa6d26cc8753db3af7f122fb1b5b46e3d` — `feat: implement V2 public editorial boundary`;
- exact push run: `35535480047`;
- job: `106143624278`;
- result: **GREEN**;
- runtime evidence recorded `fares_sha=1d53cb0aa6d26cc8753db3af7f122fb1b5b46e3d` and pinned Odoo `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`;
- Odoo executed 12 post-test methods, reported `fu_public_api: 22 tests`, and finished `0 failed, 0 error(s)`;
- the same job then completed a repeatable `fu_core,fu_public_api` upgrade;
- artifact: `10612715734`;
- digest: `sha256:1227670137d266e016e6c925d54d529347cf9526df0d04d228934c7f0c2974a9`.

Contract assertions cover:

- exact V2 home/work/project payload keys;
- strict `en|ar` locale requirement;
- unpublished/unknown organization-program paths fail closed;
- draft cohorts/garments/programs are absent;
- rights-private media is absent;
- no internal database IDs or operational product IDs;
- no price/cost/stock fields;
- no SKU/barcode;
- no private R2 object keys or rights/admin publication metadata;
- V1 public catalog/enquiry regressions remain GREEN.

A later PR-triggered integration run may use GitHub's synthetic merge SHA; it is supplementary only. The exact-head push run above is the Workstream 10.1 implementation authority.

## Next validation boundary — Workstream 10.2

Use synthetic media first to prove:

- private R2 source objects cannot be addressed through public DTOs;
- only rights/publication-approved derivatives can enter the public bucket;
- narrow purpose-specific data-plane credentials work;
- ordinary public-web runtime does not require the broad `CLOUDFLARE_API_TOKEN`;
- browser-visible output contains no R2 credentials/private keys.

Do not use KGC or another real client for the first publication proof without explicit publication approval.
