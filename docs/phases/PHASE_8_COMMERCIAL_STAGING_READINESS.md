# Phase 8 — Commercial staging readiness

Status: **REPOSITORY CONTRACT COMPLETE; LIVE STAGING AUTHORIZED; GATE C TECHNICAL EXECUTION IN PROGRESS.**

Branch: `phase-8/commercial-staging-readiness`.

Starting documentation HEAD: `9186b3556fb4a6a54d4580f9ea037cb2c33b2451`.

Inherited Phase 7 implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Inherited Phase 7 runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited Phase 6 provider-neutral deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Live execution status is owned by `docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md`. As of 2026-09-14, Gate A and Gate B are PASS; Gate C is in progress and currently RED at the managed schema-restore boundary in workflow run `34821582384`; Gate D production remains NO-GO.

## Goal

Define the smallest complete contract for moving from the verified repository/CI state to an explicitly authorized staging rehearsal on Vercel with managed PostgreSQL/Supabase, while preserving every Phase 7 security, state, recovery and exposure boundary.

This phase separates three states that must not be conflated:

1. repository readiness and planning;
2. an explicitly authorized live staging rehearsal;
3. a separately authorized production cutover.

Phase 8 does not reopen completed Phase 7 engineering without new regression evidence.

## Authorization boundary

The repository-only planning work was completed first. The client subsequently authorized the live Phase 8A staging rehearsal on new isolated Vercel and Supabase resources with a hard **free-tier-only** spending boundary.

That staging authorization does **not** authorize:

- upgrading or purchasing a Vercel/Supabase plan without a new explicit spending authorization;
- mutating unrelated provider projects;
- production deployment or production cutover;
- real customer, staff, stock, order, bank or payment data;
- weakening server-side roles, public API allowlists, offline checkout correctness, database privilege boundaries or minimal public routing.

Production always requires a separate Gate D authorization.

## Inherited technical baseline

Phase 8 starts from the verified Phase 7 topology and does not redesign it by default:

- `public_web` is the Vercel-native Next.js public service;
- `odoo_http` is a stateless Odoo container service;
- `odoo_websocket` is a separate stateless evented Odoo service;
- public web reaches Odoo HTTP through the private `ODOO_BASE_URL` service binding;
- `/websocket` is the only public evented-service rewrite;
- `/fares/internal/cron/run` is the only public Odoo HTTP rewrite and remains bearer-authenticated;
- broad Odoo backoffice and direct `/fu/public/**` routes remain unexposed;
- attachments and authenticated sessions are PostgreSQL-backed;
- built-in Odoo cron threads remain disabled;
- WebSocket continuity relies on reconnect/cursor replay rather than instance affinity;
- the seven production addons remain `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`;
- `fu_uat` remains test-only.

The Phase 6 PostgreSQL+filestore package remains the verified fallback/reference topology.

## Commercial staging ownership record

Current live staging ownership is recorded without secret values:

| Item | Current state |
| --- | --- |
| Vercel plan | Existing free-tier boundary; no paid upgrade authorized |
| Vercel project | isolated `fares-uniform`, project id `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`, team `team_r09C6RLmb2acHapENECQIn9T` |
| Supabase project | isolated `Fares Uniform`, project ref `urqlxisivowkmsfisjek`, region `eu-central-1` |
| Database | provider-managed `postgres` database dedicated to this Supabase project |
| Routine DB role | least-privileged `fares_app` |
| Connection class | Supavisor Session Pooler `aws-0-eu-central-1.pooler.supabase.com:5432`, client `sslmode=require` |
| Privileged bootstrap | provider-managed `postgres` bootstrap/control-plane context; separate from routine runtime |
| Secret custody | no-value inventory in `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`; values remain in provider/GitHub secret stores only |
| Domains/DNS/TLS | staging deployment not yet reached; record concrete runtime ownership when Gate C reaches the live URL |
| Monitoring/alerts | still required before Gate C GO |
| Backup/recovery | managed/destructive restore rehearsal still required before Gate C GO |

Credentials and private business data never belong in this repository.

## Managed PostgreSQL/Supabase contract

Supabase is the selected managed PostgreSQL target for the current staging rehearsal.

Odoo connectivity requirements remain non-negotiable unless a later architecture decision replaces them with equal proof:

- direct PostgreSQL or Supavisor **session mode** is acceptable;
- Supavisor **transaction mode is prohibited** for Odoo because realtime bus behavior requires PostgreSQL session semantics including `LISTEN/NOTIFY`;
- live managed connectivity uses TLS with `sslmode=require` at minimum;
- the routine Odoo role must not receive superuser, createdb or createrole merely because the provider is managed;
- privileged bootstrap is separate from routine application runtime;
- the shared `fares_http_session` table is created/owned at the bootstrap boundary and routine runtime receives only required DML;
- database-backed attachment mode remains required for the Vercel topology unless separately migrated and re-proven.

Live proof has already established the Session Pooler/TLS/dotted-user compatibility boundary. The current Gate C failure is later in the sequence: restoring the initialized application schema into the managed target.

## Staging and production separation

Staging and production must have separate durable state and secrets. A staging GO does not authorize production.

At minimum, the live design must demonstrate that:

- staging cannot write to a future production database;
- production credentials are not available to preview/staging browser code or CI;
- staging cron credentials are distinct from production credentials;
- staging operational/admin accounts are not silently reused as production routine accounts;
- real production data is not copied into staging unless a later explicit migration/privacy decision authorizes and sanitizes it;
- environment ownership and teardown responsibility are known.

## Secrets and rotation

The no-value staging secret inventory is `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

It covers:

- Odoo database host/port/name/user/password;
- Odoo master/admin password;
- external cron bearer secret;
- Vercel/Supabase control-plane credentials required by the operational workflow.

The current live workflow generates fresh runtime secrets inside hosted CI, masks them before use and activates the routine database role only inside a bounded attempt. If the attempt fails before a usable deployment exists, a separate fail-closed guard disables the managed runtime role. Public browser code must never receive broad Odoo/database credentials.

## Managed backup and restore rehearsal

Phase 7 synthetic database-only recovery is necessary but not sufficient for production.

Before Gate C GO, the staging rehearsal must:

1. record the actual managed backup/export capability used for staging;
2. create an independent recoverable database backup/export suitable for the selected topology;
3. verify that application data, database-backed attachments and intended recoverable session state are included;
4. perform a destructive restore rehearsal into a clean staging recovery boundary;
5. verify recovered application facts, attachment content and session/re-authentication expectations;
6. record measured recovery evidence without exposing secrets or real private data;
7. decide production backup frequency/retention and explicit RPO/RTO before production GO.

No production RPO/RTO value is invented by this contract.

The current managed `pg_restore` failure in run `34821582384` is part of schema activation, not the later Gate C backup/destructive-restore rehearsal. It must be fixed first without weakening the recovery contract.

## Monitoring, logging and alert ownership

Before Gate C GO, select and record:

- public-site availability/error monitoring;
- Odoo HTTP and WebSocket health/error monitoring;
- PostgreSQL availability/connection/storage alerts;
- cron trigger failure and overdue-job visibility;
- backup/restore failure alerts;
- public enquiry delivery/failure monitoring;
- log retention period and privacy/redaction rules;
- named owner/escalation path for each alert class.

Logs and evidence must not retain credentials, bank details or unnecessary customer/staff personal data.

## Domain, TLS and internal-access model

Before exposing a staging URL, record:

- intended staging hostname and DNS owner;
- certificate/TLS termination owner;
- whether internal/backoffice access is private, allowlisted or otherwise restricted;
- how the public Next.js surface reaches private Odoo HTTP;
- confirmation that broad Odoo HTTP/backoffice and direct `/fu/public/**` exposure remain absent;
- confirmation that `/websocket` and authenticated cron remain the only intended public Odoo-facing paths from the Phase 7 mapping.

Any broader Odoo exposure requires a separate architecture/security decision and dedicated proof.

## Live staging validation contract

The staging rehearsal must prove the following against the **actual** Vercel + managed PostgreSQL/Supabase resources.

### Database/bootstrap

- direct or session-mode PostgreSQL connectivity succeeds with TLS;
- transaction-mode pooling is not used;
- privileged bootstrap completes separately from routine Odoo runtime;
- routine application role remains non-superuser/non-createdb/non-createrole;
- seven production addons install/upgrade successfully;
- `fu_uat` is absent from staging/production addon loading.

The current workflow already proves exact-image build, local initialized seven-addon install/upgrade and filtered restore-set creation. It is currently RED while restoring that initialized schema into the managed target. The failed restore can leave partial objects, so the target must be inspected/cleaned before retrying.

### State and replacement

- create synthetic staging application facts and a database-backed attachment;
- create an authenticated session through the shared PostgreSQL session store;
- replace/redeploy stateless Odoo compute;
- prove application, attachment and expected authenticated-session continuity or documented re-authentication behavior;
- prove no correctness-critical durable state depends on local Vercel filesystem state.

### External cron

- built-in Odoo cron threads remain disabled;
- unauthenticated/invalid trigger requests fail closed;
- the configured live scheduler invokes the authenticated cron boundary;
- concurrent/overlapping valid invocation does not duplicate the bounded due job;
- alerting/ownership for trigger failure is verified.

### WebSocket/realtime

- authenticated notification delivery succeeds through the real staging route;
- the evented service is replaced/redeployed;
- notification publication while the old evented runtime is absent is exercised where safely possible;
- reconnect with shared session/cursor state delivers only unseen notification state without duplicating previously consumed state.

### Public EN/AR smoke

On the actual staging URL verify, at minimum:

- English public home/catalog/detail/enquiry paths;
- Arabic/RTL equivalents;
- no public price or stock leakage;
- website enquiry submission with synthetic data;
- WhatsApp/phone presentation remains correct where configured;
- narrow/mobile layout and reduced-motion behavior;
- no browser-visible broad Odoo/database credential;
- broad Odoo backoffice/direct public API routes remain unavailable through the public mapping.

## Store device acceptance

Production remains NO-GO until the actual store environment is checked. Record real device/browser versions only after the client/operator supplies them.

Acceptance must cover:

- checkout browser compatibility;
- scanner input behavior without brand-specific application assumptions;
- receipt/label printer capability and physical output dimensions;
- IndexedDB/offline paid-order persistence on the real checkout browser/device;
- outage operation and later synchronization;
- operator recovery for sync/payment/stock discrepancies.

Synthetic CI does not replace this physical-device gate.

## Staff, roles and training

Before production GO:

- named staff accounts are prepared without shared routine-admin use;
- role/location assignments are reviewed against `docs/requirements/ROLES_AND_PERMISSIONS.md`;
- relevant owner/manager/cashier/inventory/production/sales staff complete workflow training;
- a named recovery/escalation owner exists for payment, sync and stock discrepancies;
- backup/restore and deployment ownership are named.

## Real-data cutover and reconciliation

Real data remains prohibited until separately authorized.

Before production cutover, define and approve:

- product master/variant/size/code review;
- opening-stock count method and responsible people;
- treatment of open preorders, business orders and balances;
- cutover freeze/snapshot timing;
- import/manual-entry ownership;
- post-cutover reconciliation checks and sign-off;
- rollback/no-go procedure if reconciliation fails.

No real customer, staff, bank, payment, stock or order records belong in repository examples or hosted synthetic CI.

## GO / NO-GO gates

### Gate A — repository planning complete

**PASS.** The contract is present, indexed and internally consistent with Phase 7/deployment-readiness authority.

### Gate B — staging authorization/provider ownership

**PASS.** The client authorized the bounded staging rehearsal; isolated Vercel and Supabase resources and the required control-plane credentials are established. Passing Gate B authorizes staging resource work only, not production.

### Gate C — live staging technical GO

**IN PROGRESS / CURRENTLY RED AT MANAGED SCHEMA RESTORE.**

GO only after exact live evidence passes:

- managed DB TLS/direct-or-session-mode connectivity;
- bootstrap/least-privilege checks;
- managed seven-addon install/upgrade;
- state/attachment/session replacement proof;
- external cron proof;
- WebSocket replacement/replay proof;
- managed backup/destructive restore rehearsal;
- monitoring/logging ownership;
- public EN/AR staging smoke and exposure checks.

Current candidate `a75131b7c8ad3060ba2ab4e805916dc1d0ad4ff2`, run `34821582384`, deploy job `103904147677` failed at `Restore initialized schema into clean Supabase target` after all prior build/local-initialization/restore-set/role-activation steps passed. Fail-closed guard job `103905391955` succeeded and disabled the managed runtime role. Vercel environment injection/deployment were skipped; a direct Vercel query after the run showed zero deployments.

Any unresolved P0/P1 security/correctness failure is NO-GO.

### Gate D — production authorization

Production remains **NO-GO** until, in addition to Gate C:

- store browser/scanner/printer/offline acceptance is complete;
- named staff/roles/training are complete;
- real-data cutover/reconciliation plan is approved and separately authorized;
- production secrets/domains/DNS/TLS/access are approved;
- production backup retention and RPO/RTO are explicitly decided;
- monitoring/log retention/alert owners are named;
- launch timing and production spending are explicitly authorized;
- the client gives a separate production GO.

Staging success never implies Gate D.

## Evidence and validation discipline

- Every implementation/deployment claim must identify the exact Fares SHA and pinned Odoo SHA in use.
- Preserve meaningful RED evidence; do not weaken assertions to obtain green status.
- Use synthetic/redacted proof data until real-data migration is separately authorized.
- Credentials and private records must not appear in repository files, GitHub logs, screenshots or uploaded evidence.
- Provider/runtime behavior must be checked against the actual authorized staging resources; Phase 7 synthetic CI cannot be relabeled as live-provider proof.
- Documentation-only changes require read-back/link/consistency validation; they do not require rerunning completed application/runtime suites unless source changes or new evidence indicates regression.

## Immediate continuation

The planning contract itself is complete. The next execution step is not a new provider decision; it is the current Gate C technical failure:

1. inspect the exact restore failure from run `34821582384` / job `103904147677`;
2. inspect the managed Supabase schema/ownership state for partial restore residue;
3. return the managed target to the defined clean boundary without weakening least privilege or deleting unrelated provider-managed objects;
4. fix the source-controlled restore path at the actual failing object/ownership/ACL/extension boundary;
5. rerun hosted CI from an exact new candidate;
6. after managed restore/repeat-upgrade is green, proceed to Vercel environment injection/deployment and remaining Gate C live proofs.

Do not retry the same failed restore blindly. Do not use a local project checkout. Do not force-push. Preserve RED evidence. No paid spend, real business data or production deployment is authorized by this contract.
