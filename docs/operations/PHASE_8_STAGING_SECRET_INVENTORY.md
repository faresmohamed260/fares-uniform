# Phase 8 staging secret inventory

Status: **ACTIVE / VALUES MUST NEVER ENTER SOURCE OR LOGS.**

This document records secret **names, purpose, custody and rotation procedure only** for the authorized Phase 8 staging rehearsal. It never records secret values.

## Control-plane credentials

| Name | Purpose | Current injection point | Custody / owner | Rotation / revocation |
| --- | --- | --- | --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Supabase Management API control plane for the dedicated Fares Uniform project | GitHub Actions repository secret | Client account owner; consumed only by hosted CI | Replace the GitHub secret first, verify a green control-plane run, then revoke the old Supabase token. |
| `VERCEL_TOKEN` | Vercel control plane for the Fares Uniform project | GitHub Actions repository secret | Client Vercel account owner; consumed only by hosted CI | Current token is broader than desired steady-state scope. After bootstrap work no longer needs that breadth, replace it with the narrowest project/team-scoped token that still supports required deployment/env operations, verify hosted automation, then revoke the broad token. |

Control-plane tokens are never injected into browser code or Odoo runtime.

## Vercel project runtime configuration

The following values belong only to the isolated `fares-uniform` Vercel project. Secret values are generated in hosted automation immediately before a bounded activation attempt and are masked before any use.

| Name | Secret? | Purpose | Target | Rotation / recovery rule |
| --- | --- | --- | --- | --- |
| `ODOO_DB_HOST` | No | Supabase Session Pooler host | Server runtime | Provider endpoint change requires Vercel env update and redeploy. |
| `ODOO_DB_PORT` | No | Supabase Session Pooler port (`5432`) | Server runtime | Change only with an explicitly re-proven connection class. |
| `ODOO_DB_NAME` | No | Dedicated project's application database (`postgres`) | Server runtime | Database move requires a separate migration/restore proof. |
| `ODOO_DB_USER` | No | Supavisor connection username for `fares_app` (`fares_app.<project-ref>`) | Server runtime | Role rename requires DB grants and connection proof before redeploy. |
| `ODOO_DB_SSLMODE` | No | Enforces managed PostgreSQL TLS (`require` minimum) | Server runtime | Must not be weakened below the live Phase 8 contract without a new security decision. |
| `ODOO_DB_PASSWORD` | **Yes** | Password for least-privileged `fares_app` runtime role | Generated/masked in hosted CI; Vercel sensitive env only after managed DB verification passes | Generate/rotate in hosted CI; update Supabase role and Vercel env atomically. If deployment aborts before a usable runtime exists, disable/rotate the credential rather than leave an orphan login active. |
| `ODOO_ADMIN_PASSWD` | **Yes** | Odoo database-manager/master secret required by runtime configuration | Generated/masked in hosted CI; Vercel sensitive env only after managed DB verification passes | Generate in hosted CI; rotate by Vercel env update + redeploy. Never expose through browser/public API. |
| `CRON_SECRET` | **Yes** | Bearer credential for `/fares/internal/cron/run` | Generated/masked in hosted CI; Vercel sensitive env and scheduler only after managed DB verification passes | Rotate runtime and scheduler atomically, then verify invalid/old credentials fail closed. |
| `FARES_SESSION_STORE` | No | Forces PostgreSQL-backed authenticated session store | Server runtime | Must remain `postgres` for the accepted stateless topology. |

Platform/service-local bindings are **not** project secrets and must not be manually duplicated as broad environment variables:

- `ODOO_BASE_URL` is the private `public_web` → `odoo_http` service binding;
- `FARES_ODOO_HTTP_INTERNAL_URL` is the service-local WebSocket runtime marker/binding;
- `PORT` is provider-supplied;
- runtime-mode resolution is source-controlled and must not be replaced with a project-wide secret.

## Explicitly prohibited additions

Do not add these merely because Supabase/Vercel commonly expose them:

- browser Supabase anon/publishable keys when the browser does not use Supabase directly;
- `SUPABASE_SERVICE_ROLE_KEY`;
- Supavisor transaction-pooler credentials;
- a broad `DATABASE_URL` containing credentials;
- credentials belonging to unrelated projects;
- real customer, staff, stock, order, bank or payment data.

## Current activation state — 2026-09-14

- `SUPABASE_ACCESS_TOKEN`: configured and proven by hosted CI.
- `VERCEL_TOKEN`: configured and proven against the exact authorized Vercel team in run `34788971298` / job `103809533700`.
- Vercel project `fares-uniform` exists as `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`.
- Live-deployment run `34821582384` generated fresh ephemeral `ODOO_DB_PASSWORD`, `ODOO_ADMIN_PASSWD` and `CRON_SECRET` values inside the hosted runner and masked them before use.
- The same run temporarily enabled `fares_app LOGIN` for the bounded managed-restore attempt.
- The managed restore then failed before Vercel runtime environment injection or deployment.
- Fail-closed guard job `103905391955` succeeded and disabled the managed runtime role after the unsuccessful deploy job.
- Because Vercel environment injection was skipped, the ephemeral runtime secrets generated by this attempt were not activated in the Vercel project by that run.
- A direct Vercel project check after the run still showed zero deployments.

Do not reuse or attempt to recover the failed run's ephemeral values. A corrected retry must generate a fresh masked set and repeat the same bounded activation/fail-closed discipline.

Production secrets remain out of scope. A staging secret becoming active does not authorize production reuse.
