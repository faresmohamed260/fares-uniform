# Phase 8A — Free-tier staging execution

Status: **LIVE STAGING AUTHORIZED; FIXTURE/PUBLIC CONTINUITY/RECOVERY/OBSERVABILITY/BUSINESS UAT GREEN; GATE C PASS; PRODUCTION NO-GO.**

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
- canonical staging URL (smoke resolves the immutable deployment URL): `https://fares-uniform.vercel.app`.

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

## Public staging repair evidence

The September 14 content failure (run `34899200346`, job `104160775144`) is historical RED evidence. Later exact immutable smoke run `34964093451` isolated missing fixture visibility. Native fixture repair is GREEN at `a2315605154b2739ff43f0d360fdd1cbe51e40e0`, run `34982822944`, job `104427222729`, with sealed privileges and provider boundary preserved.

Exact public smoke is GREEN at `289731278043c2b01cf1305e2580fa6c02a66819`, run `34988776192`, job `104447664334`: EN/AR home/catalog/detail and exposure boundary (`401` unauthenticated cron; `404` broad login/direct Odoo catalog).

Live bounded enquiry proof is GREEN at workflow source `cc056ee19ece534990b2d8885b6bd843e4324fbc`, run `34990008655`, job `104451908443`. The immutable deployment returned `201` for the first synthetic submission, `200` with the same reference for exact replay, `409` for a conflicting replay and `400` for injected `price`/`stock` fields. Public responses retained their exact allowlist, EN/AR rendered enquiry surfaces contained no forbidden commercial/inventory wording, exactly one matching enquiry persisted, sale/payment/stock counts did not change, and the runtime/provider privilege seal remained intact.

Live attachment/authenticated-session continuity is GREEN at workflow source `f3c8243d034d4cd6f15e2187d12957bf704a8f9e`, run `35005403008`, job `104503776621`. The exact deployed image proved a database-backed attachment and authenticated session survive complete runtime replacement with no mounts, while the epoch/provider/privilege seal and zero sale/payment/stock deltas remained intact.

External cron/native locking is GREEN at workflow source `59d9553a1f14b6f4a1136ae4089d5289dcefd0e1`, run `35026879234`, job `104575905196`. The hosted proof transaction-locked the diagnosed ordinary backlog without mutation, exercised pinned Odoo `SKIP LOCKED` processing concurrently, executed the synthetic job exactly once, removed all synthetic state, and retained exact ordinary-cron/trigger snapshots plus the provider/privilege seal.

Live WebSocket reconnect/cursor replay is GREEN at workflow source `96e456412495f5b0cb1bb6c20ef00422ed633337`, run `35029061502`, job `104583000465`. A shared authenticated session survived complete evented-runtime replacement; the notification committed during absence replayed exactly once from the saved cursor. Synthetic identity/session/bus cleanup and all database/provider seals passed.

## Managed backup/export and isolated destructive recovery — GREEN

Workflow source `01824eba60dc55382a614178df3edd4d88997f61` is GREEN in run `35068971581`, job `104705729018`, against immutable application SHA `2a74e93b1828c16839ba7cede336caa4ca374306` and epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`.

The workflow exported the managed `public` schema with PostgreSQL `17.6-bookworm` tooling, filtered provider-owned schema/extension/session definitions while preserving provider session data, built the exact deployed application image, destructively recreated only a disposable hosted PostgreSQL target, restored the archive there, repeated the seven-production-addon upgrade, and resealed provider/runtime privilege boundaries. Recovered application facts, attachment/session/business counts, exact durable `ir_cron` count, privilege seal and managed-source postflight all passed. Cleanup passed and GitHub reports zero retained workflow artifacts, so the backup archive was not retained by Actions.

Preserved RED run `35062507713`, job `104685620618`, proved every recovery boundary except an exact `ir_cron_trigger` count equality. Inspection of pinned Odoo source established that `ir_cron_trigger` is a mutable scheduler wake-up queue: Odoo inserts trigger rows, removes due triggers during cron processing and garbage-collects stale/inactive trigger rows. Durable schedules live in `ir_cron`.

Commit `01824eba60dc55382a614178df3edd4d88997f61` therefore anchors queue continuity to the restored archive itself: immediately after `pg_restore`, before the seven-addon upgrade, it records the complete restored trigger set; post-upgrade it requires every archive-restored trigger to remain, requires zero orphan triggers and permits legitimate newly created trigger rows. The durable `ir_cron` count remains exact source-to-target. Managed-source postflight now runs even when a target assertion fails. This corrects the recovery invariant rather than weakening it.

The GitHub connector did not expose sealed stdout for final run `35068971581`; current backup byte/hash/list-count values are therefore intentionally not asserted in source documentation from an older run.

## Hosted staging observability — GREEN technical proof

Workflow source `9d65d93c8ce7ff638de61dd4c8c15f2d7c879215` is GREEN in run `35071292407`, job `104713180912`, against immutable application SHA `2a74e93b1828c16839ba7cede336caa4ca374306`, deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg` and the current database epoch.

It verified immutable/canonical EN/AR public health, unauthenticated cron `401`, broad Odoo login/direct public API `404`, zero Vercel runtime error/fatal records and zero HTTP 5xx in the one-hour window. Vercel's project alert-rule API was available and returned one existing project rule, but its uninspected semantics/recipients are not relied upon as the staging failure sink.

The Supabase/PostgreSQL monitor retained the exact epoch, role/provider/session/extension/attachment privilege seal, the fixed synthetic enquiry, the known 19 ordinary due crons without executing or rescheduling them, zero active cron failure counts, zero proof residue and zero idle-in-transaction sessions older than five minutes. Latest managed recovery was required to remain run `35068971581` / success.

A privacy-safe GitHub issue sink is the source-controlled alert transport. Run `35071292407` created and immediately closed synthetic issue `#5`, proving issue creation/closure without raw logs, request bodies, customer/database records, SQL text, secret values or staff names. Owner labels are roles only: `technical-operations-owner` and `business-operations-owner`.

`.github/workflows/phase8-staging-observability.yml` includes a twice-hourly schedule and now exists on default branch `main` after PR #6, so recurring GitHub staging polling is active. Manual default-branch run `35099333740`, job `104804477793`, is GREEN at merge commit `29a6835f1e542119f50aa800ddec7fe57f1cf704`. Production human owners, recipients/escalation and retention remain Gate D.

See `docs/operations/PHASE_8_STAGING_OBSERVABILITY.md` for the operational contract and [repair evidence](../validation/PHASE_8_HANDOFF_REPAIR.md) for exact hosted evidence.

## Secret-management boundary

`docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md` is authoritative for names/purpose/custody only.

**WANDA is secret-management only.** Do not treat it as general deployment, database mutation, Vercel, Supabase or GitHub control-plane authority. No secret values belong in repository docs or logs.

## Gate state

- **Gate A — repository planning: PASS.**
- **Gate B — authorization/provider ownership: PASS.**
- **Gate C — live staging technical GO: PASS.** Guarded reset/deploy, provider restore, private DB routing, runtime privilege seal, fixture/public rendering, public enquiry/no-leak proof, attachment/authenticated-session continuity, cron locking, WebSocket replay, managed recovery, observability and live production-model business UAT are GREEN. Final UAT authority: `48316711e4939e4a2e99f2708093930d430cf602`, run `35081126154`, job `104745121818`.
- **Gate D — production: NO-GO.** Separate operational, device/staff/data-cutover, named monitoring ownership/retention and explicit production authorization are still required.

## Next authorized execution sequence

Follow [PROJECT.md](../../PROJECT.md) for the ordered current tasks and [repair evidence](../validation/PHASE_8_HANDOFF_REPAIR.md) for exact runs. Reverify branch HEAD before every write. Gate C needs no further business-flow proof under the accepted first-release boundary; Purchase/MRP/procurement planning is out of scope for this staging gate. Release integration is complete through merged PR #6. Gate D remains separately authorized and production remains NO-GO.

Remote GitHub/hosted execution only. No force-push, stale writer rerun, real data, `fu_uat`, direct `/fu/public/**`, transaction pooling, routine provider-admin Odoo, paid upgrade or production cutover.
