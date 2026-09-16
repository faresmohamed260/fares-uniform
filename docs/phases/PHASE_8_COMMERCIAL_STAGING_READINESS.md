# Phase 8 — Commercial staging readiness

Status: **LIVE STAGING AUTHORIZED; FIXTURE/PUBLIC CONTINUITY/RECOVERY GREEN; GATE C IN PROGRESS; PRODUCTION NO-GO.**

Branch: `phase-8/commercial-staging-readiness`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Live execution detail is owned by `docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md`.

Gate A and Gate B are PASS. Gate C remains in progress. Current repair results and next actions are owned by `PROJECT.md` and `docs/validation/PHASE_8_HANDOFF_REPAIR.md`; the checkpoints below preserve their original evidence.

## Goal and authorization boundary

Move the verified repository/CI state into an explicitly authorized staging rehearsal on Vercel plus managed PostgreSQL/Supabase while preserving Phase 7 security, state, recovery and exposure boundaries.

Staging work is authorized only on the isolated Fares Uniform resources and only within the accepted free-tier spending boundary. It does not authorize paid upgrades, unrelated-provider mutation, production cutover, real customer/staff/stock/order/bank/payment data, broad Odoo backoffice exposure, or weakening server-side roles, offline correctness, database boundaries, session semantics or recovery requirements.

Production requires a separate Gate D authorization.

## Inherited architecture that remains authoritative

- `public_web` is the Vercel-native Next.js public surface.
- `odoo_http` and `odoo_websocket` are separate stateless Odoo compute services.
- Browser traffic never calls `/fu/public/**` directly; Next.js reaches Odoo privately.
- `/websocket` is the only intended public evented-service rewrite.
- `/fares/internal/cron/run` is the only intended public Odoo HTTP rewrite and remains bearer-authenticated.
- Broad Odoo backoffice exposure remains prohibited.
- Attachments and authenticated sessions are PostgreSQL-backed.
- Built-in Odoo cron threads remain disabled.
- WebSocket continuity relies on reconnect/cursor replay rather than instance affinity.
- Production addons are `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.
- `fu_uat` is test-only and must never be loaded in staging/production.

The Phase 6 PostgreSQL+filestore package remains the fallback/reference topology.

## Current provider ownership

| Item | Current state |
| --- | --- |
| Vercel plan | free-tier boundary; no paid upgrade authorized |
| Vercel project | isolated `fares-uniform`, project id `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`, team `team_r09C6RLmb2acHapENECQIn9T`, region `fra1` |
| Vercel exposure | public staging SSO disabled by explicit authorization; broad Odoo routing remains prohibited |
| Supabase project | isolated `Fares Uniform`, ref `urqlxisivowkmsfisjek`, region `eu-central-1` |
| Database | provider-managed `postgres` database dedicated to this project |
| Routine DB role | least-privileged `fares_app` |
| Connection class | Supavisor Session Pooler `aws-0-eu-central-1.pooler.supabase.com:5432`, client `sslmode=require`; transaction pooling prohibited |
| Provider-owned session table | `public.fares_http_session`, owned by `postgres` |
| Required extensions | `unaccent`, `pg_trgm`, provider-owned and preserved |
| Runtime schema state | populated: latest privilege-seal precondition observed `988` app-owned public relations |
| Runtime role lease | LOGIN is enabled for the deployed runtime, but `CREATE` on schema `public` is revoked after deployment |
| Secret custody | names/purpose only in `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`; WANDA is secret-management only; values stay out of source/logs |

## Provider-boundary restore — preserved RED→GREEN

The first live deployment attempt failed in run `34821582384`, deploy job `103904147677`, because `pg_restore` attempted `COMMENT ON EXTENSION unaccent` while `fares_app` did not own that provider object. Fail-closed guard job `103905391955` succeeded.

The PG16-compatible restore filter was corrected to exclude provider/bootstrap-owned public schema metadata/ACL, `unaccent`, `pg_trgm`, their comments and `fares_http_session`.

Evidence:

- hosted RED regression: run `34836378096`, job `103951039660`;
- fix commit `06c0af27dd49375b19d00a9276e2d225bf519c5b`;
- hosted GREEN regression: run `34841523130`, job `103967384659`.

The GREEN regression proved provider-boundary restore plus repeat full seven-addon upgrade with `fu_uat` absent and provider-owned objects intact.

## Private Odoo database routing — preserved RED→GREEN

The old public root failure was traced to the managed Odoo database literally being named `postgres`. Anonymous Odoo DB autodiscovery excludes the maintenance database name `postgres`, so a request without an explicit DB selection entered nodb routing and the installed custom route `/fu/public/catalog` was unavailable.

The accepted architecture does **not** expose `/fu/public/**` directly. Instead, private Next.js→Odoo requests add `X-Odoo-Database: postgres`, derived from server-side `ODOO_DB_NAME`.

Relevant commits:

- `e3b23394fb8db7e457e7248e2dd7841a7f58d5e2` — initial RED regression;
- `8539ead6e8dcd18bb08a1e5dab46273454c1a4d6` — refined RED regression;
- `8db0cd6ae35228ffee08ae00a17b504556cc9929` — private Odoo request helper;
- `3fc780a92a6a7d339b3ff62ff35443e8f000c3f6` — public data path migrated;
- `b2ed30127d239719af1df01a0aa6fc8c0391f2cc` — catalog image proxy migrated;
- `8720e9c32c1bfffeb02af90ceca2b9db7a218aee` — enquiry route migrated.

Evidence:

- RED run `34879388824`;
- GREEN run `34880200932`, job `104097532186`.

The GREEN regression proves 404 without DB selection, 200 with the private DB header, and the expected private Next.js request contract.

## Managed reset and the stale-rerun incident

### Bounded reset proof

A first owner cleanup (`8cc6d651096759d1212fb3249fa05f2ddc04b236`, run `34866894850`, job `104052858733`) failed with PostgreSQL `out of shared memory` because one `DROP OWNED` transaction exceeded the lock budget.

The bounded-lock fix (`7311c0a07ea020b967240ab44a57fb7be8c190a8`, run `34867078825`, job `104053486058`) dropped app-owned public relations one at a time under autocommit, then cleaned remaining grants/routines/types. It proved:

- `988` app-owned relations → `0`;
- `fares_app` NOLOGIN;
- zero `fares_app` sessions;
- `fares_http_session` preserved under `postgres` ownership;
- both required extensions preserved.

### Why `988` relations reappeared

They were not unexplained Supabase drift. A rerun of the older live-deploy workflow recreated them immediately after the clean reset:

- clean reset completed around `2026-09-14 16:13:47 UTC`;
- old live-deploy run `34842081247`, **attempt 2**, started around `16:14:51 UTC`;
- deploy job `104054566511`;
- stale workflow head SHA `6d273e4eac9cc8b89b6baf7529564b401c875047`.

That stale rerun saw the clean boundary, activated `fares_app`, restored the schema and performed the seven-addon repeat upgrade before later failing at the then-old public runtime check. A later read-only diagnostic showed the recreated schema and active Odoo queries.

Root cause: the old clean-boundary preflight proved database cleanliness but did not bind a deployment to the **current reset generation**. GitHub reruns preserve an older run identity and can start after a newer reset.

## Managed-writer hardening now in force

The deployment/reset path was hardened instead of relying on timing:

- `b859fc1a9774470581819918740f56b5fba1855e` — preserved RED stale-writer evidence;
- `b8335abc9ecb7ef5e04d42fda85b52bfe3545260` — writer guard regression;
- `41ff0bf1b2b9d2bb084a362941522e9c4a0d17d4` and `970a39698cd95e01b799854d7444435655a3c7dc` — mutation/writer hardening;
- `eca0732213d3a02d94ea5c80d7442d511355d0a3` — reset sealed with deployment epoch;
- `f66fbf08566f75c587eb3ad8eca55f0e157692b4` — corrected epoch verification;
- `2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a` — interrupted managed reset recovery;
- `2a74e93b1828c16839ba7cede336caa4ca374306` — live deploy bound to reset epoch;
- `3d2520840ce1cf67757fc623b2ffb9b53c17a3fd` — DB recovery manual and fail-closed;
- `9978bbaf60344e74ec48dd8537ad3e09d4258293`, `937211fbc09927a6308df0f9804e5ba3843df454`, `5a5b0c38f89890eeff6d3a911e59bd1b38ea65a0` — legacy managed DB writers retired.

The current reset epoch observed by the post-deploy privilege seal is:

`34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`

A stale live-deploy rerun must not be allowed to write merely because the database happens to be clean. Reset/deploy writers must continue to validate the current epoch immediately before managed mutation and remain fail-closed.

## Runtime database privilege seal — GREEN

Commit `63303846f3e373abb323bdc969dcc9e92c56311f` introduced post-deploy schema privilege sealing. Temporary validation was later removed after proof.

Hosted evidence:

- workflow run `34898140110`;
- job `104160591708`;
- result **SUCCESS**.

Precondition observed:

- `rolcanlogin=true`;
- `app_owned_relations=988`;
- `session_table_ok=1`;
- `required_extensions=2`;
- deployment epoch table present with the current epoch above.

The seal then revoked `CREATE` on schema `public` from `fares_app` and proved:

- `fares_app` LOGIN remains enabled for runtime;
- `CREATE` on `public` is false;
- populated application schema remains intact;
- provider-owned session table remains intact;
- current deployment epoch remains intact.

This is the current least-privilege runtime posture. Future reset/upgrade/deploy workflows must explicitly acquire the bounded write lease they need rather than leaving schema-creation rights permanently enabled.

## Public staging repair evidence

The September 14 content failure (run `34899200346`, job `104160775144`) is historical RED evidence. Later exact immutable smoke run `34964093451` isolated missing fixture visibility. Native fixture repair is GREEN at `a2315605154b2739ff43f0d360fdd1cbe51e40e0`, run `34982822944`, job `104427222729`, with sealed privileges and provider boundary preserved.

Exact public smoke is GREEN at `289731278043c2b01cf1305e2580fa6c02a66819`, run `34988776192`, job `104447664334`: EN/AR home/catalog/detail and exposure boundary (`401` unauthenticated cron; `404` broad login/direct Odoo catalog).

Live bounded enquiry proof is GREEN at workflow source `cc056ee19ece534990b2d8885b6bd843e4324fbc`, run `34990008655`, job `104451908443`. Through immutable deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg` it proved first acceptance `201`, exact replay `200`, conflicting replay `409`, injected `price`/`stock` rejection `400`, exact public response keys, EN/AR rendered no-leak checks, exactly one matching persisted enquiry and zero sale/payment/stock deltas. The deployment epoch, 988-relation application boundary, provider session table/extensions, absent `fu_uat` and revoked schema `CREATE` remained intact.

Live attachment/authenticated-session continuity is GREEN at workflow source `f3c8243d034d4cd6f15e2187d12957bf704a8f9e`, run `35005403008`, job `104503776621`. Two fresh exact-image, no-mount runtimes proved that one authenticated session UID and exact database-backed attachment survive complete runtime replacement. Provider-owned session state retained effective exact runtime DML, PUBLIC remained revoked, schema `CREATE` remained false, and sale/payment/stock deltas were zero.

External cron/native locking is GREEN at workflow source `59d9553a1f14b6f4a1136ae4089d5289dcefd0e1`, run `35026879234`, job `104575905196`. A bounded transaction quarantined all active ordinary cron rows without changing them; pinned Odoo `SKIP LOCKED` processing executed the synthetic job exactly once under concurrent authenticated triggers. Cleanup and exact ordinary cron/trigger snapshots passed with zero business deltas and the privilege/provider seal intact.

Live WebSocket reconnect/cursor replay is GREEN at workflow source `96e456412495f5b0cb1bb6c20ef00422ed633337`, run `35029061502`, job `104583000465`. It proved authenticated delivery, complete evented-runtime destruction, publication during absence, fresh-runtime replay from the saved cursor without duplication, shared PostgreSQL-session continuity, complete synthetic cleanup and zero business/ordinary-cron deltas.

## Managed backup/export and isolated destructive recovery — GREEN

Workflow source `01824eba60dc55382a614178df3edd4d88997f61` is GREEN in run `35068971581`, job `104705729018`. It exported the populated managed `public` schema with PostgreSQL 17.6 tooling, restored only into a disposable hosted PostgreSQL target, repeated the exact seven-addon upgrade, verified recovered application/attachment/session/business facts, exact durable `ir_cron` count, the provider/runtime privilege seal and an unchanged managed source, then cleaned up. GitHub reports zero retained workflow artifacts for the run.

Preserved RED run `35062507713`, job `104685620618`, isolated the only remaining failure to a raw `ir_cron_trigger` count equality after every other recovery boundary passed. Pinned Odoo source confirms `ir_cron_trigger` is a mutable scheduler wake-up queue, while `ir_cron` holds durable schedule definitions. Commit `01824eba60dc55382a614178df3edd4d88997f61` records the exact trigger set directly from the restored archive before the seven-addon upgrade and then proves the full archive-restored set survives, no orphan trigger exists and durable `ir_cron` still matches exactly. Upgrade-created trigger rows are legitimate and may increase the queue. Managed-source postflight also runs independently of target assertion failures.

The connector did not expose sealed stdout for final run `35068971581`; current backup byte/hash/list-count values are intentionally omitted rather than copied from an older run.

See [repair evidence](../validation/PHASE_8_HANDOFF_REPAIR.md) for current evidence, and [PROJECT.md](../../PROJECT.md) for current next actions. Do not diagnose the superseded September 14 grep, the resolved ordinary-cron backlog, or raw cross-time `ir_cron_trigger` count equality as the current blocker.

## Secret-management boundary

The no-value inventory remains `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

**WANDA is secret-management only.** It is not general deployment, database-mutation or provider-control-plane authority. GitHub-hosted workflows and the explicitly scoped provider connectors remain the execution/evidence plane for deployment and database operations. Secret values must never be reconstructed from logs or committed to documentation.

## Gate state

### Gate A — repository planning

**PASS.**

### Gate B — staging authorization/provider ownership

**PASS.** Isolated free-tier resources and required control-plane credentials are established.

### Gate C — live staging technical GO

**IN PROGRESS / NO-GO FOR STAGING SIGN-OFF.**

Currently proven:

- managed Session Pooler/TLS/dotted-user connectivity;
- least-privilege bootstrap boundary;
- corrected provider-boundary restore;
- repeat seven-addon upgrade with `fu_uat` absent;
- private Next.js→Odoo explicit DB selection;
- stale-rerun root cause and reset-epoch protection;
- retirement/manual fail-closed treatment of legacy DB writers;
- managed schema repopulation under the guarded path;
- post-deploy runtime privilege seal;
- isolated Vercel project and public staging SSO policy;
- bounded live synthetic enquiry intake, idempotent replay/conflict behavior, exact public response allowlist, EN/AR no-price/no-stock rendering and zero operational side effects;
- database-backed attachment and authenticated-session continuity across complete runtime replacement;
- bounded external cron/native-locking proof without mutating the ordinary backlog;
- authenticated WebSocket replacement/reconnect/cursor replay continuity;
- managed backup/export plus destructive restore only on a disposable target, repeat seven-addon upgrade, recovered state/privilege proof and zero retained workflow artifacts.

Current exact live evidence is recorded in `docs/validation/PHASE_8_HANDOFF_REPAIR.md`.

Still required for Gate C:

- logs/monitoring/alert ownership and privacy/redaction rules;
- business UAT path for company → branch → warehouse → POS session → order → payment → posting → stock/cash/evidence, plus reorder/supplier/FIFO/credit-customer and offline/outbox/IPC scenarios.

### Gate D — production

**NO-GO.** Production additionally requires store-device acceptance, named staff/roles/training, separately authorized real-data cutover/reconciliation, production domains/secrets/access, backup retention and RPO/RTO decisions, monitoring owners, launch/spending authorization and an explicit client production GO.

## Immediate continuation

Follow [PROJECT.md](../../PROJECT.md) for the ordered current tasks and [repair evidence](../validation/PHASE_8_HANDOFF_REPAIR.md) for exact runs. Reverify branch HEAD before every write. Establish hosted logs/monitoring/alerts with ownership-role and privacy/redaction rules, then complete live synthetic business-flow evidence before staging sign-off. Gate D remains separately authorized.

Remote GitHub/hosted execution only. No force-push, stale writer rerun, real data, `fu_uat`, direct `/fu/public/**`, transaction pooling, routine provider-admin Odoo, paid upgrade or production cutover.