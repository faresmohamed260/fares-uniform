# Phase 10 R2 publication boundary

Status: **WORKSTREAM 10.2 RED PRESERVED — EPHEMERAL NARROW-CREDENTIAL PROOF IN EXECUTION.**

This runbook governs the Phase 10 private-source to public-derivative object boundary. It does not authorize public KGC/client publication, a production cutover, a public custom domain or broad browser/storage credentials.

## Buckets

- private source/review media: `fares-uniform-media-private`;
- approved publishable derivatives: `fares-uniform-media-public`;
- backups remain separate: `fares-uniform-backups`.

The first publication proof uses only a deterministic synthetic SVG under `phase10/synthetic/`. No real client media participates.

## Credential split

The hosted proof creates short-lived **account-owned R2 API tokens** through the control plane and immediately derives their S3-compatible credentials. Each token is scoped to exactly one bucket and one permission group:

- private token: **Workers R2 Storage Bucket Item Read** on `fares-uniform-media-private` only;
- public token: **Workers R2 Storage Bucket Item Write** on `fares-uniform-media-public` only.

Each token expires within one hour and is explicitly revoked in an `always()` cleanup step. The data-plane publication step receives only the derived narrow Access Key ID / Secret Access Key values. It does not receive `CLOUDFLARE_API_TOKEN`.

The broad repository secret `CLOUDFLARE_API_TOKEN` remains control-plane only: it may mint/revoke the short-lived narrow tokens and perform provider administration, but it is not an ordinary R2 object data-plane credential and must not enter Odoo, browser code or the public Next.js runtime.

Cloudflare's current R2 authentication contract defines the R2 S3 Access Key ID as the token ID and the Secret Access Key as the SHA-256 of the token value. The S3 endpoint is `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`. Secret values are masked, runner-local, never committed and never uploaded as evidence.

## Synthetic publication proof

The one-shot seed workflow creates a fixed synthetic SVG and puts it into the private bucket through the existing control-plane credential. It reconfirms the private bucket has neither managed `r2.dev` public access nor a custom domain.

The publication workflow then:

1. resolves the current Cloudflare account-token permission groups under the control-plane credential;
2. creates one-hour bucket-scoped private-read and public-read/write account tokens;
3. derives and masks their S3 credentials without logging the token values;
4. downloads the exact hash-pinned private synthetic source through the private read-only credential;
5. writes an immutable hash-addressed object under `projects/synthetic-phase10/publication-proof/` in the public bucket through the public read/write credential;
6. reads it back and verifies SHA-256, content type, cache policy and metadata;
7. proves the private credential is denied on the public bucket;
8. proves the public credential is denied on the private bucket;
9. proves `CLOUDFLARE_API_TOKEN` is absent from the data-plane step;
10. revokes both ephemeral account tokens even if later proof steps fail;
11. uploads only non-secret evidence.

The public bucket's browser delivery hostname is intentionally not enabled by this proof. A stable public media origin/custom-domain decision remains a later publication/production boundary. Merely moving a synthetic object into the public-media bucket does not publish a real client or authorize production traffic.

## Odoo metadata boundary

`fu.public.media` keeps private/public R2 object identity and content hashes as internal publication metadata. These values are forbidden from the public V2 DTO. A published record must never serialize a private R2 S3 API endpoint as its browser-facing `url`.

## Failure handling

- Control-plane credential cannot create bucket-scoped account tokens: fail before any public-bucket mutation.
- Hash mismatch: fail closed; do not publish.
- Cross-bucket credential succeeds unexpectedly: fail as a privilege-boundary violation.
- Private R2 API URL accepted as public delivery URL: fail the Odoo contract.
- Never weaken bucket scope or add the broad Cloudflare token to the publication job to obtain GREEN.
