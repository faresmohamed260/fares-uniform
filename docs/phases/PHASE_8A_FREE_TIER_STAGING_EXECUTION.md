# Phase 8A — Free-tier staging execution

Status: **CLIENT AUTHORIZED; GUARDED RESET/DEPLOY PATH HARDENED; MANAGED RUNTIME POPULATED AND PRIVILEGE-SEALED; EXACT PUBLIC BILINGUAL SMOKE RED ON CONTENT/FIXTURE ASSERTION; GATE C IN PROGRESS.**

Branch: `phase-8/commercial-staging-readiness`.

Parent contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Authorization date: 2026-09-13.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Production remains a separate **NO-GO** gate.

## Authorization boundary

The client authorized creation/mutation of new isolated Fares Uniform staging resources on Vercel and Supabase for this rehearsal, with a hard spending condition: **stay on free tiers**.

Not authorized: paid provider upgrades, unrelated project mutation, production cutover, real business data, broad Odoo backoffice exposure, transaction-mode pooling, or weakening the Phase 7 database/session/cron/WebSocket/security model.

## Live resources

### Supabase

- project: `Fares Uniform`;
- ref: `urqlxisivowkmsfisjek`;
- region: `eu-central-1`;
- database: provider-managed `postgres`;
- Session Pooler: `aws-0-eu-central-1.pooler.supabase.com:5432`;
- runtime role: `fares_app`;
- pooler username: `fares_app.urqlxisivowkmsfisjek`;
- TLS: `sslmode=require`;
- transaction-mode pooling: prohibited;
- provider-owned session table: `public.fares_http_session`;
- required provider-owned extensions: `unaccent`, `pg_trgm`.

Current post-deploy state is populated, not reset-clean. Runtime privilege-seal run `34898140110` / job `104160591708` observed `988` app-owned public relations, the provider session table, both required extensions, and the active deployment epoch. It then revoked `CREATE` on schema `public` from `fares_app` while leaving runtime LOGIN enabled.

### Vercel

- team: `team_r09C6RLmb2acHapENECQIn9T`;
- project: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- region: `fra1`;
- Fluid compute: OFF;
- authorized public staging SSO state: disabled;
- canonical staging URL used by the exact smoke: `https://fares-uniform.vercel.app`.

A historical READY deployment artifact remains useful evidence (`dpl_9dq5Fnmetypvih4QeeCEMPZQhgdu`, SHA `6d273e4eac9cc8b89b6baf7529564b401c875047`) but is **not** current deployment authority; the current execution contract is the epoch-bound guarded workflow plus post-deploy evidence.

## Established provider checkpoints

### Managed DB/runtime-image proof

- commit `b7a661bf70c2468b006bf971cba10172cf810e7d`;
- run `34787677724`;
- job `103806024323`;
- **SUCCESS**.

Proved exact Management API access, least-privilege bootstrap, real Session Pooler connectivity with TLS, exact Vercel-target Odoo image and provider-required dotted runtime username.

### Vercel control-plane proof

- commit `884aedc9465122d25639ca24954f154dfa72dc70`;
- run `34788971298`;
- job `103809533700`;
- **SUCCESS**.

Proved exact token/team/project boundary for the isolated staging project.

## Restore boundary — preserved RED→GREEN

Initial run `34821582384`, deploy job `103904147677`, failed because `pg_restore` attempted to mutate provider-owned extension metadata. Guard job `103905391955` disabled the runtime role.

The PG16-compatible TOC filter was fixed at commit `06c0af27dd49375b19d00a9276e2d225bf519c5b`.

- RED regression: run `34836378096`, job `103951039660`;
- GREEN regression: run `34841523130`, job `103967384659`.

The GREEN proof restores the application-owned set and performs a repeat seven-addon upgrade with `fu_uat` absent while preserving provider-owned schema/extension/session objects.

## Private public-API database selection — preserved RED→GREEN

The managed application database is literally named `postgres`. Odoo anonymous DB autodiscovery excludes that maintenance DB name, so old private calls without explicit DB selection reached nodb routing and returned 404 for `/fu/public/catalog`.

The fix is server-side only: private Next.js→Odoo calls add `X-Odoo-Database: postgres`, derived from `ODOO_DB_NAME`. Browser-facing routing remains unchanged and direct `/fu/public/**` stays unexposed.

- RED run `34879388824`;
- GREEN run `34880200932`, job `104097532186`;
- implementation commits `8db0cd6ae35228ffee08ae00a17b504556cc9929`, `3fc780a92a6a7d339b3ff62ff35443e8f000c3f6`, `b2ed30127d239719af1df01a0aa6fc8c0391f2cc`, `8720e9c32c1bfffeb02af90ceca2b9db7a218aee`.

Do not reopen this diagnosis unless new evidence regresses it.

## Managed reset history and stale-rerun provenance

### Bounded reset

The first reset (`8cc6d651096759d1212fb3249fa05f2ddc04b236`, run `34866894850`, job `104052858733`) exceeded `max_locks_per_transaction` via a large single `DROP OWNED` transaction.

The bounded reset (`7311c0a07ea020b967240ab44a57fb7be8c190a8`, run `34867078825`, job `104053486058`) succeeded by dropping app-owned relations one-at-a-time under autocommit, proving `988 → 0` relations, `fares_app` NOLOGIN, zero sessions, and preservation of provider objects.

### Why the schema came back after reset

The recreated `988` relations were traced to a stale rerun, not provider drift:

- reset completed around `2026-09-14 16:13:47 UTC`;
- old live-deploy run `34842081247`, attempt 2, started around `16:14:51 UTC`;
- deploy job `104054566511`;
- stale head SHA `6d273e4eac9cc8b89b6baf7529564b401c875047`.

That rerun passed the old clean-boundary preflight, activated `fares_app`, restored the schema and ran the repeat seven-addon upgrade. GitHub reruns retain old run identity, so filtering only by original creation time hid this execution initially.

This is preserved provenance evidence. Do not rerun an old live-deploy run as a retry mechanism.

## Current managed-writer safety model

The reset/deploy lifecycle is now generation-bound rather than merely clean-boundary-bound.

Relevant hardening:

- `b859fc1a9774470581819918740f56b5fba1855e` — RED stale-writer evidence;
- `b8335abc9ecb7ef5e04d42fda85b52bfe3545260` — writer guard regression;
- `41ff0bf1b2b9d2bb084a362941522e9c4a0d17d4`, `970a39698cd95e01b799854d7444435655a3c7dc` — managed mutation hardening;
- `eca0732213d3a02d94ea5c80d7442d511355d0a3` — reset creates/seals deployment epoch;
- `f66fbf08566f75c587eb3ad8eca55f0e157692b4` — epoch verification correction;
- `2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a` — interrupted reset recovery;
- `2a74e93b1828c16839ba7cede336caa4ca374306` — live deploy bound to reset epoch;
- `3d2520840ce1cf67757fc623b2ffb9b53c17a3fd` — DB recovery manual/fail-closed;
- `9978bbaf60344e74ec48dd8537ad3e09d4258293`, `937211fbc09927a6308df0f9804e5ba3843df454`, `5a5b0c38f89890eeff6d3a911e59bd1b38ea65a0` — legacy DB writers retired.

Current epoch observed by the privilege seal:

`34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`

Managed writers must continue to share the guarded mutation discipline, prove the current epoch immediately before writes, and fail closed on unsuccessful execution. Recovery is deliberate/manual, not an implicit background writer.

## Runtime privilege seal — GREEN

Commit `63303846f3e373abb323bdc969dcc9e92c56311f` added the post-deploy privilege seal.

Hosted proof:

- run `34898140110`;
- job `104160591708`;
- **SUCCESS**.

Pre-seal state:

- `rolcanlogin=true`;
- `can_create_public=true`;
- `app_owned_relations=988`;
- provider session table and both required extensions present;
- epoch table/current epoch present.

Post-seal state:

- `rolcanlogin=true`;
- `can_create_public=false`;
- `app_owned_relations=988`;
- provider boundary preserved;
- epoch preserved.

This is the current runtime privilege posture. A future schema-writing operation must explicitly enter its bounded writer path instead of depending on permanent schema CREATE permission.

## Exact public staging smoke — RED

Workflow: `.github/workflows/phase8-public-staging-smoke.yml`.

Current run:

- run `34899200346`;
- job `104160775144`;
- target `https://fares-uniform.vercel.app`;
- result **FAILURE**.

The workflow validates exact content for:

- English home `/`;
- Arabic home `/ar`;
- English catalog `/catalog`;
- Arabic catalog `/ar/catalog`;
- English synthetic product detail `/catalog/SYN-EN-001`;
- Arabic synthetic product detail `/ar/catalog/SYN-AR-001`;
- then browser-facing Odoo-route absence and unauthenticated cron `401`.

The current run reached both product-detail requests, then exited 1 before the exposure-boundary checks. The failing `grep` is not identified in the log. Therefore this run proves reachability through those requests but **does not** prove the exact content contract or the final exposure assertions.

Immediate task: identify the exact failed assertion. Check whether the intended synthetic staging fixture is present and whether its English/Arabic strings/SKUs match the source-controlled smoke. If data repair is required, use only clearly synthetic staging records and delete only those records. Do not weaken an assertion merely to obtain GREEN.

## Secret-management boundary

`docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md` is authoritative for names/purpose/custody only.

**WANDA is secret-management only.** Do not treat it as general deployment, database mutation, Vercel, Supabase or GitHub control-plane authority. No secret values belong in repository docs or logs.

## Gate state

- **Gate A — repository planning: PASS.**
- **Gate B — authorization/provider ownership: PASS.**
- **Gate C — live staging technical GO: IN PROGRESS / NOT YET GO.** Guarded reset/deploy, provider restore, private DB routing and runtime privilege seal are GREEN; exact public bilingual smoke is currently RED on content/fixture validation.
- **Gate D — production: NO-GO.** Separate operational, device/staff/data-cutover and explicit production authorization are still required.

## Next authorized execution sequence

1. Re-read `AGENTS.md`, `PROJECT.md`, this file, the parent Phase 8 contract and secret inventory.
2. Reverify branch HEAD and inspect any intervening commits/workflow runs before mutation.
3. Inspect run `34899200346` / job `104160775144` and the current smoke workflow to isolate the exact failed `grep`/fixture expectation.
4. Inspect live staging data only as necessary and without exposing or documenting secret values. Use synthetic data only.
5. Make the smallest source-controlled or synthetic-fixture correction that satisfies the intended product contract; preserve the current RED run.
6. Rerun the exact public staging smoke and require all English/Arabic content and exposure-boundary assertions to pass.
7. After public smoke is GREEN, complete remaining Gate C proof: enquiry/no-price-no-stock, attachment/session continuity, external cron/native locking, WebSocket reconnect/cursor replay, managed backup/destructive restore, monitoring/alerts, and the end-to-end business UAT scenarios.
8. Update Phase 8 docs with exact new SHAs/run/job IDs after each authoritative proof.

Do not use a local/scratch source checkout. Do not force-push or rewrite evidence. Do not load `fu_uat` in staging/production. Do not expose `/fu/public/**` directly. Do not use transaction pooling. Do not use provider admin as routine Odoo runtime. Do not use real business data. Do not spend money without explicit approval. Production remains NO-GO.