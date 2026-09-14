# Phase 8A — Free-tier staging execution

Status: **CLIENT AUTHORIZED; PROVIDER CONTROL PLANES ESTABLISHED; LIVE DEPLOYMENT WORKFLOW IN PROGRESS; CURRENT RED BOUNDARY IS MANAGED SCHEMA RESTORE.**

Branch: `phase-8/commercial-staging-readiness`.

Parent contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Authorization date: 2026-09-13.

Inherited Phase 7 implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Inherited Phase 7 runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Managed-database/runtime contract checkpoint: `b7a661bf70c2468b006bf971cba10172cf810e7d`.

Vercel control-plane checkpoint: `884aedc9465122d25639ca24954f154dfa72dc70`.

Current live-deployment candidate: `a75131b7c8ad3060ba2ab4e805916dc1d0ad4ff2`.

## Authorization boundary

The client authorized creating and mutating new isolated Fares Uniform staging resources on **Vercel** and **Supabase** for this rehearsal, with one hard spending condition: **stay on free tiers**.

This authorization does not permit:

- upgrading Vercel or Supabase to a paid plan;
- pausing, deleting, repurposing or mutating unrelated Vercel/Supabase projects;
- production deployment or production cutover;
- real customer, staff, stock, order, bank or payment data;
- broad Odoo backoffice exposure;
- weakening the Phase 7 database/session/cron/WebSocket/security model.

Production remains a separate NO-GO gate.

## Provider ownership and live resources

### Supabase

The dedicated Fares Uniform project is isolated from unrelated projects.

- project name: `Fares Uniform`;
- project ref: `urqlxisivowkmsfisjek`;
- region: `eu-central-1`;
- Session Pooler host: `aws-0-eu-central-1.pooler.supabase.com`;
- Session Pooler port: `5432`;
- application database: provider-managed `postgres` database in the dedicated project;
- routine runtime role: `fares_app`;
- runtime pooler username: `fares_app.urqlxisivowkmsfisjek`;
- TLS: `sslmode=require` minimum;
- Supavisor transaction mode: prohibited for Odoo.

Supabase administration is performed through GitHub Actions using repository secret `SUPABASE_ACCESS_TOKEN`. The token value must never be committed or printed.

`deploy/supabase/bootstrap.sql` remains the source-controlled idempotent bootstrap authority. The routine role remains least-privileged and must not receive superuser, createdb or createrole.

### Vercel

Authorized isolated target:

- team id: `team_r09C6RLmb2acHapENECQIn9T`;
- project name: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`.

Repository secret `VERCEL_TOKEN` is configured and proven against the exact authorized team. Exact team/project fail-closed assertions remain mandatory because the current token is broader than desired steady-state scope. Existing unrelated Vercel projects remain out of scope.

A direct Vercel project check after the current failed deployment workflow still returned **0 deployments**. The workflow did not reach environment injection or deployment.

## Previously verified green provider slices

### Supabase/runtime-image proof

Authoritative run:

- commit: `b7a661bf70c2468b006bf971cba10172cf810e7d`;
- workflow run: `34787677724`;
- job: `103806024323`;
- result: **SUCCESS**.

It proves:

- Management API access to the exact Fares Uniform Supabase project;
- writable managed bootstrap context;
- repeatable least-privilege bootstrap;
- real Supavisor **Session Pooler** connectivity on port `5432` with client `sslmode=require`;
- provider-managed bootstrap-role constraints;
- exact Vercel-target Odoo image build using pinned Odoo/Fares authority;
- psycopg2 connectivity from that exact runtime image using the provider-required dotted runtime username.

### Vercel control-plane proof

Authoritative run:

- commit: `884aedc9465122d25639ca24954f154dfa72dc70`;
- workflow run: `34788971298`;
- job: `103809533700`;
- result: **SUCCESS**.

It proves the token/team boundary, creates only the isolated `fares-uniform` project shell and leaves unrelated Vercel projects untouched.

## Provider compatibility corrections already completed

Live provider proof exposed a real Supavisor compatibility issue: the original Phase 7 entrypoint allowed only a bare PostgreSQL identifier for `ODOO_DB_USER`, while Supavisor Session Pooler requires a custom-role connection username such as `fares_app.<project-ref>`.

The correction is source-controlled:

- `deploy/vercel/validation.sh` keeps database identifiers strict while allowing exactly one Supavisor project-ref suffix for the connection username;
- direct PostgreSQL usernames remain valid;
- arbitrary DSN syntax, multiple suffixes, separators and injection characters remain rejected;
- `deploy/vercel/entrypoint.sh` uses the connection-user validator;
- `Dockerfile.vercel` ships the helper into the exact non-root runtime image.

The integrated Supabase proof above verifies this against the real Session Pooler.

## Current live deployment workflow

Current source-controlled workflow: `.github/workflows/phase8-vercel-live-deploy-v2.yml`.

Current candidate:

- commit: `a75131b7c8ad3060ba2ab4e805916dc1d0ad4ff2`;
- commit message: `ci(phase8): restore clean managed schema and deploy Vercel staging`;
- workflow run: `34821582384`.

The workflow is deliberately fail-closed. It starts by asserting a clean managed boundary and zero Vercel deployments, generates fresh masked activation secrets, builds exact images, creates an exact initialized application database, exports a filtered restore set, activates `fares_app` only for the bounded attempt, restores into the managed target, repeats application verification, then only after that is green proceeds to Vercel environment injection/deployment and runtime verification.

### Run `34821582384` step result

Deploy job: `103904147677` — **FAILURE**.

| Step | Result |
| --- | --- |
| Checkout exact candidate | PASS |
| Verify exact clean deployment boundary | PASS |
| Generate and mask fresh activation secrets | PASS |
| Build exact database and Vercel Odoo images | PASS |
| Build exact initialized application database locally | PASS |
| Create filtered restore set | PASS |
| Activate least-privileged managed runtime role | PASS |
| Restore initialized schema into clean Supabase target | **FAIL** |
| Verify managed state and repeat seven-addon upgrade | SKIPPED |
| Inject required Vercel runtime environment only | SKIPPED |
| Verify Vercel environment inventory without values | SKIPPED |
| Deploy exact candidate to isolated Vercel project | SKIPPED |
| Verify READY deployment and minimal public exposure | SKIPPED |
| Cleanup local bootstrap resources | PASS |

The successful local initialized-database step includes installation/upgrade of the seven production addons and asserts that `fu_uat` is not installed. The restore-set creation also completed successfully. Therefore the current RED boundary is specifically the managed restore, not image build, local Odoo initialization or restore-set generation.

### Fail-closed guard

Separate job: `103905391955` — **SUCCESS**.

Its `Disable managed runtime role after unsuccessful deployment` step passed after the deploy job failed. The failed attempt therefore did not leave the routine managed role intentionally active.

The start-of-run clean-boundary proof does **not** prove the managed schema is still clean after the failed `pg_restore`. PostgreSQL restore can create some objects before a later statement fails. The next session must inspect the managed schema/ownership state and restore it to the defined clean boundary before retrying.

A direct Vercel project query after the run reported zero deployments, consistent with deployment steps being skipped.

## Secret activation state

The no-value secret inventory is authoritative at `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

Current state:

- `SUPABASE_ACCESS_TOKEN`: configured and proven;
- `VERCEL_TOKEN`: configured and proven against the exact authorized team;
- the current live workflow generated fresh ephemeral `ODOO_DB_PASSWORD`, `ODOO_ADMIN_PASSWD` and `CRON_SECRET` values inside hosted CI and masked them;
- `fares_app` was temporarily enabled for the bounded restore attempt and the fail-closed guard subsequently disabled it after failure;
- Vercel runtime environment injection was skipped, so this run did not activate those generated values in the Vercel project;
- secret values must never be reconstructed from logs or documentation.

## RED evidence retained

Phase 8 keeps provider-specific failures as evidence instead of hiding them:

- `34787115988` — initial temporary-role/pooler assertion failure after connectivity succeeded;
- `34787178859` — established that `pg_stat_ssl` behind Supavisor describes the pooler-to-database hop rather than client-to-pooler TLS;
- `34787327217` — exposed the managed non-superuser boundary for explicit role alteration;
- `34787368732` — bootstrap verification exposed PostgreSQL `PUBLIC` pseudo-role handling;
- `34787615934` — cross-provider workflow definition failed before any job started; its useful checks were integrated into the working control plane;
- `34821582384` — current live-deployment candidate reached managed role activation and then failed at `Restore initialized schema into clean Supabase target`; Vercel deployment was not reached; fail-closed guard succeeded.

Do not convert these to green history by weakening assertions.

## Gate state

### Gate A — repository planning

**PASS.** Phase 8 contracts are present, indexed and aligned with inherited Phase 7 authority.

### Gate B — authorization/provider ownership

**PASS.** The staging rehearsal is authorized within the free-only boundary and isolated Supabase/Vercel resources plus required control-plane credentials are established.

### Gate C — live staging technical GO

**IN PROGRESS / RED AT MANAGED SCHEMA RESTORE.**

Already established:

- real managed Session Pooler/TLS connectivity from the exact runtime image;
- source-controlled least-privilege bootstrap contract;
- exact isolated Vercel project/control-plane boundary;
- exact-image build inside the current live workflow;
- local exact initialized application database with seven production addons and `fu_uat` absent;
- filtered restore-set creation;
- bounded runtime-role activation plus independent fail-closed disabling after failure.

Still required:

- diagnose and fix the managed schema restore failure;
- inspect/clean any partial restore residue before rerun;
- repeat managed seven-addon verification/upgrade after restore;
- inject only required Vercel runtime environment values;
- create and verify a READY staging deployment;
- verify minimal public exposure;
- verify database-backed attachment continuity on replaceable compute;
- verify shared authenticated-session continuity;
- verify external authenticated cron and native locking;
- verify WebSocket reconnect/cursor replay;
- perform managed backup plus destructive restore rehearsal;
- establish logs/monitoring ownership;
- perform public English/Arabic staging smoke tests.

### Gate D — production

**NO-GO.** Production requires separate authorization after Gate C plus store-device, named staff/training and real-data cutover/reconciliation gates.

## Next authorized action

Continue from candidate `a75131b7c8ad3060ba2ab4e805916dc1d0ad4ff2`, run `34821582384`, deploy job `103904147677` and fail-closed guard job `103905391955`.

1. Read the exact failed restore output if available and inspect the current managed Supabase schema/ownership state.
2. Determine the exact object/ownership/ACL/extension conflict. Do not retry unchanged and do not bypass it by running routine Odoo as the provider admin role.
3. Restore the managed target to the workflow's defined clean boundary, preserving provider-managed objects and the `fares_http_session` bootstrap contract.
4. Fix the restore workflow at the actual failing boundary and add/adjust hosted assertions that would catch the regression.
5. Rerun hosted CI from the new exact candidate.
6. After managed restore and repeat seven-addon upgrade are green, allow the same bounded workflow to proceed to Vercel environment injection, deployment and runtime proof.
7. Then complete the remaining Gate C continuity/realtime/recovery/monitoring/EN-AR smoke evidence.

Do not use a local project checkout or scratch source tree. Do not force-push. Preserve RED evidence. Do not load `fu_uat` in production/staging runtime. Do not expose broad Odoo routes. Do not use transaction pooling. Do not use real business data. Do not spend money without a separate explicit authorization. Production remains NO-GO until separately authorized.
