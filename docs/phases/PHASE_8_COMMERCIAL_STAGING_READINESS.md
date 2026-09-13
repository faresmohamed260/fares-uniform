# Phase 8 — Commercial staging readiness

Status: **EXECUTION-READY REPOSITORY CONTRACT; LIVE COMMERCIAL STAGING NOT AUTHORIZED.**

Branch: `phase-8/commercial-staging-readiness`.

Starting documentation HEAD: `9186b3556fb4a6a54d4580f9ea037cb2c33b2451`.

Inherited Phase 7 implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Inherited Phase 7 runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited Phase 6 provider-neutral deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Goal

Define the smallest complete contract for moving from the verified repository/CI state to a separately authorized **commercial staging rehearsal** on Vercel with managed PostgreSQL/Supabase, while preserving every Phase 7 security, state, recovery and exposure boundary.

This phase separates three states that must not be conflated:

1. repository readiness and planning;
2. an explicitly authorized live staging rehearsal;
3. a separately authorized production cutover.

Phase 8 does not reopen completed Phase 7 engineering without new regression evidence.

## Authorization boundary

The repository-only work in this contract is authorized. It may document decisions, templates, evidence requirements, ownership fields, validation steps and GO/NO-GO gates.

Until the client gives a new explicit live-stage authorization, Phase 8 must **not**:

- upgrade or purchase a Vercel plan;
- create or mutate a commercial Fares Vercel project;
- create or mutate a Supabase project/database;
- add real runtime secrets or credentials;
- configure production/staging domains, DNS or certificates;
- use real customer, staff, stock, order, bank or payment data;
- perform a staging or production cutover;
- weaken server-side roles, public API allowlists, offline checkout correctness, database privilege boundaries or minimal public routing.

If execution reaches one of those boundaries, stop and record the exact client authorization/resource choice required.

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

Before live staging can be authorized, the following must be explicitly recorded. Unknown values stay **TBD** rather than being inferred.

| Item | Required record | Current state |
| --- | --- | --- |
| Vercel commercial plan | plan/tier suitable for the commercial workload, billing owner, spending authorization | TBD / not authorized |
| Vercel project | Fares-owned project/team, project owner/admin, staging purpose/lifetime | not created by this phase |
| Supabase project | project owner/admin, billing owner, selected region | TBD / not created |
| Database | isolated `fares` application database or accepted equivalent | planned, not created |
| Routine DB role | least-privileged `fares_app` or accepted equivalent | required |
| Privileged bootstrap identity | named operational owner for schema/bootstrap/restore work | TBD |
| Domains/DNS/TLS | owner, staging hostname, DNS/certificate responsibility | TBD |
| Monitoring/alerts | owner for uptime, errors, DB health, backup and enquiry delivery | TBD |
| Secret custody | owner(s) for Vercel, database, Odoo admin and cron secrets | TBD |
| Backup/recovery | provider retention, independent export policy, RPO/RTO and restore owner | TBD |

A provider account/resource identifier may be recorded after authorization, but credentials and secret values never belong in this public repository.

## Managed PostgreSQL/Supabase contract

Supabase remains the preferred managed PostgreSQL target for the first authorized staging rehearsal.

Odoo connectivity requirements are non-negotiable unless a later architecture decision replaces them with equal proof:

- direct PostgreSQL or Supavisor **session mode** is acceptable;
- Supavisor **transaction mode is prohibited** for Odoo because realtime bus behavior requires PostgreSQL session semantics including `LISTEN/NOTIFY`;
- live managed connectivity uses TLS with `sslmode=require` at minimum;
- the routine Odoo role must not receive superuser, createdb or createrole merely because the provider is managed;
- privileged bootstrap is separate from routine application runtime;
- the shared `fares_http_session` table is created/owned at the bootstrap boundary and routine runtime receives only required DML;
- database-backed attachment mode remains required for the Vercel topology unless separately migrated and re-proven.

The staging rehearsal must record the actual endpoint class used (direct or session pool), region, TLS mode and database/role ownership without recording secret values.

## Staging and production separation

Staging and production must have separate durable state and secrets. A staging GO does not authorize production.

At minimum, the live design must demonstrate that:

- staging cannot write to the production database;
- production credentials are not available to preview/staging browser code or CI;
- staging cron credentials are distinct from production credentials;
- staging operational/admin accounts are not silently reused as production routine accounts;
- real production data is not copied into staging unless a later explicit migration/privacy decision authorizes and sanitizes it;
- environment ownership and teardown responsibility are known.

## Secrets and rotation

Before staging deployment, create a secret inventory by **name/purpose/owner only**. Do not record values.

The inventory must cover at least:

- Odoo database host/port/name/user/password;
- Odoo master/admin password;
- external cron bearer secret;
- any Vercel/Supabase deployment credentials required by the chosen operational workflow;
- domain/DNS credentials if applicable.

For every secret, record injection location, who may rotate it, expected rotation/revocation procedure and what runtime must be restarted/redeployed after rotation. Public browser code must never receive broad Odoo/database credentials.

## Managed backup and restore rehearsal

Phase 7 synthetic database-only recovery is necessary but not sufficient for production.

The first authorized managed staging rehearsal must:

1. record the actual Supabase/provider backup capability and retention selected for staging;
2. create an independent recoverable database backup/export suitable for the selected topology;
3. verify that application data, database-backed attachments and intended recoverable session state are included;
4. perform a destructive restore rehearsal into a clean staging recovery target or otherwise isolated clean restore boundary;
5. verify the recovered application facts, attachment content and session/re-authentication expectations;
6. record measured recovery evidence without exposing secrets or real private data;
7. decide production backup frequency/retention and explicit RPO/RTO before production GO.

No production RPO/RTO value is invented by this contract.

## Monitoring, logging and alert ownership

Before staging GO, select and record:

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

Once live commercial staging is explicitly authorized, prove the following against the **actual** Vercel + managed PostgreSQL/Supabase resources.

### Database/bootstrap

- direct or session-mode PostgreSQL connectivity succeeds with TLS;
- transaction-mode pooling is not used;
- privileged bootstrap completes separately from routine Odoo runtime;
- routine application role remains non-superuser/non-createdb/non-createrole;
- seven production addons install/upgrade successfully;
- `fu_uat` is absent from production addon loading.

### State and replacement

- create synthetic staging application facts and a database-backed attachment;
- create an authenticated session through the shared PostgreSQL session store;
- replace/redeploy stateless Odoo compute;
- prove application, attachment and expected authenticated-session continuity or the documented re-authentication behavior;
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
- reconnect with shared session/cursor state delivers only unseen notification state without duplicating previously consumed notification state.

### Public EN/AR smoke

On the actual staging URL verify, at minimum:

- English public home/catalog/detail/enquiry paths;
- Arabic/RTL equivalents;
- no public price or stock leakage;
- website enquiry submission path with synthetic data;
- WhatsApp/phone presentation remains correct where configured;
- narrow/mobile layout and reduced-motion behavior;
- no browser-visible broad Odoo/database credential;
- broad Odoo backoffice/direct public API routes remain unavailable through the public mapping.

## Store device acceptance

Production remains NO-GO until the actual store environment is checked. Record the real device/browser versions only after the client/operator supplies them.

Acceptance must cover:

- checkout browser compatibility;
- scanner input behavior without brand-specific application assumptions;
- receipt/label printer capability and physical output dimensions;
- IndexedDB/offline paid-order persistence on the real checkout browser/device;
- outage operation and later synchronization;
- operator recovery path for sync/payment/stock discrepancies.

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

GO when this contract is present, indexed and internally consistent with Phase 7 and deployment-readiness authority.

This gate authorizes **planning only**.

### Gate B — commercial staging authorization

NO-GO until the client explicitly authorizes the live staging rehearsal and resolves at least:

- commercial Vercel plan/team/project and billing owner;
- Supabase project/region/billing owner;
- staging lifetime/purpose;
- named secret/operations owners;
- permission to create/mutate the required staging resources.

Passing Gate B authorizes staging resource work only, not production.

### Gate C — live staging technical GO

GO only after exact live evidence passes:

- managed DB TLS/direct-or-session-mode connectivity;
- bootstrap/least-privilege checks;
- seven-addon install/upgrade;
- state/attachment/session replacement proof;
- external cron proof;
- WebSocket replacement/replay proof;
- managed backup/destructive restore rehearsal;
- monitoring/logging ownership;
- public EN/AR staging smoke and exposure checks.

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
- Documentation-only changes require read-back/link/consistency validation; they do not require rerunning the completed Phase 7 application/runtime suites unless source changes or new evidence indicates regression.

## Exit criteria

Phase 8 repository-planning scope is complete when:

1. this contract is registered in `docs/README.md`;
2. `PROJECT.md` identifies Phase 8 as the active bounded stage;
3. Phase 7 implementation/runtime authorities remain unchanged;
4. live-resource and production authorization boundaries remain explicit;
5. no application/runtime source is changed merely to create this plan.

The **next execution step after repository planning** is not automatic deployment. It is an explicit client decision on whether to authorize commercial staging and, if yes, the concrete Vercel/Supabase ownership and billing choices required by Gate B.
