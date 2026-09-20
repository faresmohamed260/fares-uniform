# Phase 10 R2 publication boundary

Status: **WORKSTREAM 10.2 RED CONTRACT — NARROW CREDENTIAL PROOF PENDING.**

This runbook governs the Phase 10 private-source to public-derivative object boundary. It does not authorize public KGC/client publication, a production cutover, a public custom domain or broad browser/storage credentials.

## Buckets

- private source/review media: `fares-uniform-media-private`;
- approved publishable derivatives: `fares-uniform-media-public`;
- backups remain separate: `fares-uniform-backups`.

The first publication proof uses only a deterministic synthetic SVG under `phase10/synthetic/`. No real client media participates.

## Credential split

Ordinary publication proof must use S3-compatible R2 credentials scoped to one required bucket and operation class:

- `R2_PRIVATE_MEDIA_READ_ACCESS_KEY_ID` / `R2_PRIVATE_MEDIA_READ_SECRET_ACCESS_KEY`: **Object Read**, bucket `fares-uniform-media-private` only;
- `R2_PUBLIC_MEDIA_RW_ACCESS_KEY_ID` / `R2_PUBLIC_MEDIA_RW_SECRET_ACCESS_KEY`: **Object Read & Write**, bucket `fares-uniform-media-public` only.

The broad repository secret `CLOUDFLARE_API_TOKEN` is not an ordinary data-plane credential. It may be used by the one-shot synthetic seed/control-plane proof and existing provider administration only. It must not be injected into the narrow publication job, Odoo, browser code or the public Next.js runtime.

Cloudflare documents bucket-scoped R2 API tokens for S3 clients, and the S3 endpoint is `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`. Secret values are never committed or logged.

## Synthetic publication proof

The one-shot seed workflow creates a fixed synthetic SVG and puts it into the private bucket through the existing control-plane credential. It reconfirms the private bucket has neither managed `r2.dev` public access nor a custom domain.

The publication workflow then:

1. requires all four narrow credential secrets before mutation;
2. downloads the exact hash-pinned private synthetic source through the private read-only credential;
3. writes an immutable hash-addressed object under `projects/synthetic-phase10/publication-proof/` in the public bucket through the public read/write credential;
4. reads it back and verifies SHA-256, content type, cache policy and metadata;
5. proves the private credential is denied on the public bucket;
6. proves the public credential is denied on the private bucket;
7. proves `CLOUDFLARE_API_TOKEN` is absent from the publication job;
8. uploads only non-secret evidence.

The public bucket's browser delivery hostname is intentionally not enabled by this proof. A stable public media origin/custom-domain decision remains a later publication/production boundary. Merely moving a synthetic object into the public-media bucket does not publish a real client or authorize production traffic.

## Odoo metadata boundary

`fu.public.media` keeps private/public R2 object identity and content hashes as internal publication metadata. These values are forbidden from the public V2 DTO. A published record must never serialize a private R2 S3 API endpoint as its browser-facing `url`.

## Failure handling

- Missing narrow secrets: fail before any public-bucket mutation.
- Hash mismatch: fail closed; do not publish.
- Cross-bucket credential succeeds unexpectedly: fail as a privilege-boundary violation.
- Private R2 API URL accepted as public delivery URL: fail the Odoo contract.
- Never weaken bucket scope or add the broad Cloudflare token to the publication job to obtain GREEN.
