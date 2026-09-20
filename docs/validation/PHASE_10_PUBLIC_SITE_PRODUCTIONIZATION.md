# Phase 10 validation — public-site productionization

Status: **WORKSTREAMS 10.1–10.2 GREEN — WORKSTREAM 10.3 NEXT.**

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

## Next validation boundary — Workstream 10.3

Implement the production `apps/public-web` foundation RED -> GREEN:

- canonical `/[locale]` routing for `en|ar`;
- root document `lang` / `dir`;
- deterministic typography;
- metadata/canonical/hreflang and 404/error baseline;
- source-controlled V2 schema client;
- basic Fares-led shell;
- no price/stock/private-field leakage in rendered/RSC/network payloads;
- production build plus representative EN/AR hosted browser evidence.

Production launch, Gate D, real-client publication and PR merges remain separately gated.
