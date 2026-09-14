# Phase 8A — Free-tier staging execution

Status: **CLIENT AUTHORIZED; PROVIDER CONTROL PLANES ESTABLISHED; RESTORE/UPGRADE/VERCEL READY PROVEN; PUBLIC APPLICATION SMOKE RED; MANAGED TARGET RESET CLEAN FOR NEXT ATTEMPT.**

Branch: `phase-8/commercial-staging-readiness`.

Parent contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Authorization date: 2026-09-13.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Production remains a separate **NO-GO** gate.

## Authorization boundary

The client authorized creation/mutation of new isolated Fares Uniform staging resources on Vercel and Supabase for this rehearsal, with one hard spending condition: **stay on free tiers**.

Not authorized:

- paid provider upgrades;
- unrelated project mutation;
- production cutover;
- real customer/staff/stock/order/bank/payment data;
- broad Odoo backoffice exposure;
- weakening the Phase 7 database/session/cron/WebSocket/security model.

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
- transaction-mode pooling: prohibited for Odoo;
- provider/bootstrap-owned session table: `fares_http_session`;
- required provider-owned extensions: `unaccent`, `pg_trgm`.

Supabase control-plane work is performed through hosted GitHub Actions using the configured `SUPABASE_ACCESS_TOKEN`. Secret values must never be committed or printed.

Current managed state after the successful bounded reset:

- `fares_app` NOLOGIN;
- zero `fares_app` sessions;
- zero app-owned public relations;
- `fares_http_session` preserved under `postgres` ownership;
- both required extensions preserved;
- role retains required CONNECT/USAGE/CREATE privileges for the next bounded activation.

### Vercel

- team: `team_r09C6RLmb2acHapENECQIn9T`;
- project: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- authorized public staging SSO state: disabled;
- retained READY deployment artifact: `dpl_9dq5Fnmetypvih4QeeCEMPZQhgdu`;
- canonical alias: `fares-uniform.vercel.app`;
- deployment metadata SHA: `6d273e4eac9cc8b89b6baf7529564b401c875047`.

The retained READY artifact is not a valid current staging runtime because the managed Odoo schema was subsequently reset and `fares_app` returned to NOLOGIN. It is retained as deployment evidence until the next controlled action decides otherwise.

## Previously established provider checkpoints

### Managed DB/runtime-image proof

- commit `b7a661bf70c2468b006bf971cba10172cf810e7d`;
- run `34787677724`;
- job `103806024323`;
- **SUCCESS**.

Proved exact project Management API access, repeatable least-privilege bootstrap, real Session Pooler connectivity on port 5432 with TLS, provider bootstrap boundaries, exact Vercel-target Odoo image build, and provider-required dotted runtime username connectivity.

### Vercel control-plane proof

- commit `884aedc9465122d25639ca24954f154dfa72dc70`;
- run `34788971298`;
- job `103809533700`;
- **SUCCESS**.

Proved exact token/team/project boundary for the isolated staging project.

## Managed restore defect — preserved RED evidence

Initial live workflow run `34821582384`, deploy job `103904147677`, failed at `Restore initialized schema into clean Supabase target`. Guard job `103905391955` succeeded.

Exact error:

- `pg_restore` attempted `COMMENT ON EXTENSION unaccent`;
- `fares_app` is not owner of provider-owned extension `unaccent`.

The old TOC filter anchored provider object names at line end even though archive owner is trailing. PostgreSQL 16.12 is pinned, so the correction remains PG16-compatible.

Provider/bootstrap entries now excluded from the restore set include public schema metadata/ACL, `unaccent`, `pg_trgm`, their comments and `fares_http_session`.

### Hosted RED to GREEN regression

- RED run `34836378096`, job `103951039660`;
- fix commit `06c0af27dd49375b19d00a9276e2d225bf519c5b`;
- GREEN run `34841523130`, job `103967384659`;
- live workflow patch commit `6d273e4eac9cc8b89b6baf7529564b401c875047`.

The GREEN regression proved the corrected provider-boundary restore and repeat seven-addon upgrade, with `fu_uat` absent and provider objects preserved.

## Corrected live deployment attempt

Workflow: `.github/workflows/phase8-vercel-live-deploy-v2.yml`.

Run `34842081247`, deploy job `104054566511`.

### Successful boundaries

The corrected attempt passed:

| Boundary | Result |
| --- | --- |
| Exact checkout / clean deployment boundary | PASS |
| Masked activation secret generation | PASS |
| Exact DB and Vercel Odoo image build | PASS |
| Local initialized application DB | PASS |
| Corrected filtered restore set | PASS |
| Bounded `fares_app` activation | PASS |
| Managed schema restore | **PASS** |
| Repeat seven-addon verification/upgrade | **PASS** |
| Required Vercel environment injection | PASS |
| No-value environment inventory verification | PASS |
| Exact isolated Vercel deployment | **PASS** |
| Vercel build and READY activation | **PASS** |
| Public application/exposure smoke | **FAIL** |

The managed restore boundary is therefore no longer the current blocker.

### Vercel build evidence

Deployment `dpl_9dq5Fnmetypvih4QeeCEMPZQhgdu` reached READY.

Build evidence included:

- Next.js production compilation and TypeScript checks passed;
- Odoo HTTP image completed all 26 container steps and pushed successfully;
- WebSocket image reused 25/26 layers and pushed successfully;
- deployment received canonical alias `fares-uniform.vercel.app`.

### Public application RED evidence

The final fail-closed validation surfaced an application/runtime defect:

- public root `/` returned 500;
- Next.js logged `Invalid catalog response`;
- private backend call `/fu/public/catalog?lang=en` reached Odoo;
- Odoo returned 404;
- Odoo had booted and loaded its registry/modules;
- the PostgreSQL-backed session store was installed;
- runtime connected through the expected Session Pooler identity.

This proves the failure was not simply the public request being stopped before the application. The expected public catalog route/runtime registration or initialization path must be diagnosed before the next clean deployment can pass.

The unsuccessful deployment attempt returned to fail-closed role state.

## Vercel public-exposure diagnosis and correction

### Exposure diagnostic — GREEN

- commit `4380972525d70d3126a56e86a6ffeff01f5887ba`;
- workflow `.github/workflows/phase8-vercel-exposure-diagnostic.yml`;
- run `34865665473`;
- job `104048749999`;
- result **SUCCESS**.

It found Vercel project SSO protection set to `all_except_custom_domains`; anonymous deployment hosts redirected to Vercel SSO.

### Authorized public-staging policy fix — GREEN

- commit `0ad8ad3d75af4a3d25df9ccf5a64a97ee9bdd92f`;
- workflow `.github/workflows/phase8-vercel-exposure-fix.yml`;
- run `34866159453`;
- job `104050408771`;
- result **SUCCESS**.

Exact evidence:

- `sso_before=all_except_custom_domains`;
- public-staging SSO changed to disabled;
- failed deployment boundary removed before the clean retry;
- `failed_deployment_removed=PASS clean_retry_boundary=true`.

This change only removes Vercel Authentication from the explicitly authorized public staging surface. It does not expose broad Odoo routes.

## Managed target reset — preserved RED to GREEN

A clean managed target is required before another exact deployment attempt.

### First owner cleanup — RED

- commit `8cc6d651096759d1212fb3249fa05f2ddc04b236`;
- workflow `.github/workflows/phase8-managed-odoo-reset.yml`;
- run `34866894850`;
- job `104052858733`;
- result **FAILURE**.

Precondition:

- `fares_app` NOLOGIN;
- sessions `0`;
- app-owned relations `988`;
- provider-owned session table preserved.

A one-transaction `DROP OWNED BY CURRENT_USER CASCADE` then failed with `ERROR: out of shared memory` and the PostgreSQL hint to increase `max_locks_per_transaction`.

The workflow's fail-closed path still disabled the temporary cleanup login.

### Bounded-lock cleanup — GREEN

- commit `7311c0a07ea020b967240ab44a57fb7be8c190a8`;
- run `34867078825`;
- job `104053486058`;
- result **SUCCESS**.

The fix generates owner-scoped DROP statements for app-owned public relations and executes them under psql autocommit so every statement has its own transaction/lock budget. Only after that large relation graph is gone does it run `DROP OWNED` for remaining routines/types/grants.

Exact final evidence:

- `owner_scoped_partial_odoo_cleanup=PASS tls=require bounded_locks=true`;
- `temporary_cleanup_login_disabled=PASS`;
- `managed_bootstrap_reapplied=PASS`;
- `rolcanlogin=false`;
- `sessions=0`;
- `app_owned_relations=0`;
- `session_table_ok=1`;
- `required_extensions=2`;
- CONNECT/USAGE/CREATE remain available for the next controlled activation;
- `managed_odoo_target_reset=PASS role=NOLOGIN app_owned_relations=0 bootstrap=preserved`.

This is the authoritative current managed baseline.

## Secret activation state

The no-value inventory remains authoritative at `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

- `SUPABASE_ACCESS_TOKEN` is configured/proven;
- `VERCEL_TOKEN` is configured/proven against the exact team;
- runtime DB/admin/cron secrets are generated and masked inside hosted CI;
- `fares_app` is currently NOLOGIN after the managed reset;
- secret values must never be reconstructed from logs or documentation.

## RED evidence retained

Meaningful RED evidence remains part of the audit trail and must not be hidden by weaker assertions:

- `34787115988` — temporary-role/pooler assertion failure after connectivity;
- `34787178859` — clarified `pg_stat_ssl` behavior behind Supavisor;
- `34787327217` — managed non-superuser boundary;
- `34787368732` — PostgreSQL `PUBLIC` pseudo-role handling;
- `34787615934` — cross-provider workflow-definition failure;
- `34821582384` — provider-owned extension metadata restore failure;
- `34836378096` — hosted regression reproducing the broken restore filter;
- `34842081247` — managed restore/upgrade/Vercel READY green but public application smoke red;
- `34866894850` — single-transaction managed reset exceeded lock budget.

Corresponding fixes are recorded above.

## Gate state

### Gate A — repository planning

**PASS.**

### Gate B — authorization/provider ownership

**PASS.**

### Gate C — live staging technical GO

**IN PROGRESS / NOT YET GO.**

Already proven:

- managed Session Pooler/TLS/dotted-user connectivity;
- least-privilege bootstrap contract;
- isolated Vercel project/control-plane boundary;
- exact image build;
- corrected provider-boundary restore;
- managed seven-addon repeat upgrade with `fu_uat` absent;
- Vercel env injection/inventory;
- Vercel deployment and READY activation;
- provider SSO diagnosis and intentional public-staging correction;
- bounded managed reset back to a clean fail-closed baseline.

Still required:

- fix/verify the private Odoo public catalog route/runtime path that returned 404;
- redeploy from the clean managed baseline;
- pass public English/Arabic home/catalog/detail/enquiry smoke;
- verify database-backed attachment continuity;
- verify shared authenticated-session continuity;
- verify external authenticated cron and native locking;
- verify WebSocket reconnect/cursor replay;
- perform managed backup + destructive restore rehearsal;
- establish logs/monitoring/alert ownership.

### Gate D — production

**NO-GO.** Production requires separate authorization after Gate C plus store-device acceptance, named staff/roles/training and real-data cutover/reconciliation gates.

## Next authorized action

Start from the current branch HEAD and the clean managed baseline established by run `34867078825`.

1. Re-read `AGENTS.md`, `PROJECT.md`, this file and the parent Phase 8 contract before mutation.
2. Verify branch HEAD and inspect any newer Action runs before writing.
3. Do **not** repeat the already-proven restore-filter investigation unless new evidence regresses it.
4. Diagnose why the private Odoo endpoint expected by `public_web`, `/fu/public/catalog?lang=en`, returned 404 in run `34842081247`. Check route registration, addon/runtime initialization and exact source/deployment boundaries. Do not expose direct `/fu/public/**` publicly as a workaround.
5. Inspect existing Phase 8 workflows first and reuse the exact-candidate hosted path rather than inventing a parallel deployment mechanism.
6. Redeploy only from a verified clean managed state, with `fares_app` temporarily activated inside the bounded workflow and fail-closed afterward on failure.
7. After public EN/AR smoke passes, complete attachment/session/cron/WebSocket/recovery/monitoring Gate C evidence.

Do not use a local project checkout or scratch source tree. Do not force-push. Preserve RED evidence. Do not load `fu_uat` in staging/production. Do not expose broad Odoo routes. Do not use transaction pooling. Do not run routine Odoo as provider admin. Do not use real business data. Do not spend money without separate explicit authorization. Production remains NO-GO.
