# Phase 8 staging observability

Status: **HOSTED TECHNICAL PROOF GREEN; DEFAULT-BRANCH SCHEDULE ACTIVATION DEFERRED TO RELEASE INTEGRATION; PRODUCTION OWNER/RETENTION POLICY OPEN.**

Authoritative proof: workflow source `9d65d93c8ce7ff638de61dd4c8c15f2d7c879215`, run `35071292407`, job `104713180912`.

## Scope

This document owns the Phase 8 staging monitoring, alert transport, privacy/redaction and ownership-role contract. It does not assign real staff, define production escalation policy, approve paid observability products or change the Gate D production boundary.

The monitored staging identity remains:

- Vercel project `fares-uniform`, project id `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`, team `team_r09C6RLmb2acHapENECQIn9T`;
- deployed application SHA `2a74e93b1828c16839ba7cede336caa4ca374306`;
- READY deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg`;
- canonical public URL `https://fares-uniform.vercel.app`;
- Supabase project ref `urqlxisivowkmsfisjek`;
- database epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`.

## Monitoring surfaces

### Vercel

Vercel runtime logs are queried only for aggregate one-hour error/fatal and HTTP 5xx counts. The workflow does not echo runtime message bodies, stack traces, request payloads, IP addresses or other raw log records into Actions evidence.

The first GREEN run observed:

- runtime error/fatal count: `0`;
- HTTP 5xx count: `0`;
- exact immutable deployment: READY;
- immutable English public surface: HTTP `200` with the fixed synthetic catalog fixture;
- canonical Arabic catalog detail: HTTP `200`;
- unauthenticated cron boundary: HTTP `401`;
- broad `/web/login`: HTTP `404`;
- direct `/fu/public/catalog`: HTTP `404`.

Vercel's project alert-rule API was accessible and returned one existing project rule. The Phase 8 proof does not rely on the unknown semantics or recipients of that existing rule; the source-controlled GitHub issue transport below is the proved staging failure sink.

### Supabase/PostgreSQL

The workflow uses the already-proven Supabase Management API read-only query path. It verifies aggregate operational invariants only:

- exact deployment epoch;
- `fares_app` LOGIN enabled while superuser/CREATEDB/CREATEROLE/REPLICATION/INHERIT remain false;
- schema `public` CREATE remains revoked;
- exactly `988` app-owned public relations;
- provider-owned `fares_http_session` remains present with runtime SELECT/INSERT/UPDATE/DELETE and zero PUBLIC grants;
- `unaccent` and `pg_trgm` remain present;
- `fu_uat` remains absent;
- attachment location remains `db`;
- the fixed synthetic enquiry remains exactly once;
- the known ordinary due-cron backlog remains visible as `19` rows and is not executed, disabled, postponed or rescheduled;
- active cron rows with `failure_count > 0` remain `0`;
- run-scoped cron-locking synthetic residue remains `0`;
- idle-in-transaction sessions older than five minutes remain `0`.

Supabase Cloud Reports/logs remain the provider-side inspection surface for database CPU, memory, connections, disk, API and Realtime errors. The free-tier report window is provider-controlled; no paid telemetry upgrade is authorized by this proof.

### Recovery health

The monitor also requires the latest managed backup/restore workflow result on this branch to remain the exact GREEN recovery authority `01824eba60dc55382a614178df3edd4d88997f61` / run `35068971581`.

## Alert transport and ownership

Current staging owner labels are roles, not invented people:

- `technical-operations-owner` — provider/runtime/database/recovery failures;
- `business-operations-owner` — business-process follow-up once a technical alert affects operations.

On a monitoring failure, the workflow creates or updates one privacy-safe GitHub issue titled `[staging alert] Fares Uniform Phase 8 observability`. It includes only the failed run URL, source SHA, owner-role labels and the fact that production remains NO-GO.

Run `35071292407` self-tested the issue transport by creating synthetic issue `#5` and immediately closing it. Repository read-back confirms issue `#5` is closed with `state_reason=completed` and contains no raw logs, customer data, secrets, request bodies, database rows, SQL text or staff names.

## Privacy and redaction

Monitoring evidence must remain metadata-only. Do not emit or persist in Actions summaries, GitHub alert issues or documentation:

- secret/token/password values;
- runtime log message bodies or stack traces unless a separately bounded diagnostic is required and reviewed for redaction;
- HTTP request bodies, cookies, authorization headers or client IP addresses;
- customer/staff identities, contact details or business records;
- database row payloads;
- SQL query text from live diagnostics.

Prefer counts, status codes, booleans, fixed synthetic identifiers, exact source/deployment identities and provider object ownership facts.

## Cadence boundary

`.github/workflows/phase8-staging-observability.yml` contains a twice-hourly schedule plus push/manual triggers. GitHub scheduled workflows execute only from the repository default branch. The active Phase 8 work remains isolated on `phase-8/commercial-staging-readiness`, so **the GitHub recurring schedule is not yet active**.

Until a separately authorized release-integration change places this workflow on the default branch, current evidence is push/manual hosted proof combined with native Vercel/Supabase provider observability. Do not claim that GitHub Actions is continuously polling staging before that integration occurs.

This limitation does not authorize an early merge merely to activate scheduling. Release-stack reconciliation remains a separate reviewable task.

## Production boundary

Gate D still requires named human owners, notification recipients, escalation procedure, production log/alert retention, backup retention, RPO/RTO and explicit production GO. The staging proof intentionally does not invent those choices.
