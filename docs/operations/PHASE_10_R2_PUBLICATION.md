# Phase 10 R2 publication boundary

Status: **WORKSTREAM 10.2 GREEN.**

This runbook governs the Phase 10 private-source to public-derivative object boundary. It does not authorize public KGC/client publication, production cutover, a public custom domain or browser/storage credentials.

## Buckets

- private source/review media: `fares-uniform-media-private`;
- approved publishable derivatives: `fares-uniform-media-public`;
- backups: `fares-uniform-backups`.

The accepted proof uses only deterministic synthetic media under `phase10/synthetic/`. No real-client media participates.

## Credential boundary

The publication workflow uses the broad repository `CLOUDFLARE_API_TOKEN` only in control-plane steps that mint and revoke short-lived Cloudflare account tokens. The object data-plane step does not receive that broad token.

For each proof run, two account tokens are created with a maximum lifetime of one hour:

- private token: **Workers R2 Storage Bucket Item Read** on `fares-uniform-media-private` only;
- public token: **Workers R2 Storage Bucket Item Write** on `fares-uniform-media-public` only.

Their S3-compatible Access Key ID / Secret Access Key values are masked and runner-local. Both account tokens are explicitly revoked in an `always()` cleanup step. Secret values are never committed, printed or uploaded as evidence.

## Synthetic publication proof

Synthetic source SHA-256: `9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb`.

Private seed:
- commit `5ca8dfea51bc52160a64d1a8471c47e33b925cd6`;
- run/job `35538270515` / `106151129369`;
- object `phase10/synthetic/source/media-publication-proof-v1.svg`;
- private bucket managed `r2.dev` delivery disabled;
- private bucket custom-domain count zero;
- artifact `10613679190`, digest `sha256:8e9663769797259e1620f8fb7241447476853e379adec0f870edcf5784627003`.

Preserved narrow-credential RED:
- commit `874a32e5bc9304df8aa8b67ddda4086f24513e23`;
- run/job `35537516748` / `106149079993`;
- failed at credential preflight before public-bucket mutation because no narrow credentials existed;
- artifact `10612704649`, digest `sha256:e3e1d3b4e2db25a8b430f146ac3857609100458d6951fcc0842252747f1f96d6`.

Exact-head GREEN:
- commit `758cf5889e25e62e46db4e2c3c9cacd46105c6ab`;
- publication run/job `35538533822` / `106151844125`;
- 507-byte public object `projects/synthetic-phase10/publication-proof/media-9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb.svg`;
- read-back SHA-256, `image/svg+xml`, `public, max-age=31536000, immutable` and object metadata verified;
- private-read credential -> public bucket: HTTP `403`;
- public-write credential -> private bucket: HTTP `403`;
- broad Cloudflare token present in control-plane mint/revoke only and absent from the object data-plane step;
- both ephemeral account tokens revoked in cleanup;
- artifact `10613846012`, digest `sha256:cdead7ddffa0ba393600e2b674bd0da872ee652f0a2f2ae1f408610084905bf2`.

## Odoo publication metadata boundary

`fu.public.media` may store internal `private_object_key`, `public_object_key`, `content_hash`, source classification, credit and rights/publication state. None are serialized by the public V2 DTO.

A published media record requires:

- approved rights;
- HTTPS browser-facing URL;
- browser-facing URL not on `*.r2.cloudflarestorage.com`;
- 64-character lowercase SHA-256 content hash;
- hash-addressed public object key containing that content hash;
- positive dimensions;
- English alt text unless decorative.

Exact-head Odoo contract run `35538533842`, job `106151844070`, passed 13 post-test methods / 23 addon tests with `0 failed, 0 error(s)`, then completed the repeatable `fu_core,fu_public_api` upgrade. Artifact `10613553442` has digest `sha256:889da64179b041005c92a832dae10e818db4de394ff3b8fa01efc9c25e12ab6e`.

## Remaining publication boundary

This proof does **not** enable browser delivery for the public bucket. A stable public media origin/custom-domain and any production publication operator/runtime arrangement remain later Phase 10 / Gate D boundaries. No KGC or other real client may be promoted without explicit publication authorization.

## Failure rules

- inability to mint the required bucket-scoped account tokens: fail before mutation;
- hash mismatch: fail closed;
- cross-bucket access succeeds: fail as a privilege-boundary violation;
- private R2 S3 API hostname accepted as a public media URL: fail the Odoo contract;
- ephemeral token revocation fails: fail the hosted proof;
- never widen bucket scope or inject the broad Cloudflare token into the object data-plane step merely to obtain GREEN.
