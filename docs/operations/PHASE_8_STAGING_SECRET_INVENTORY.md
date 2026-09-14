# Phase 8 staging secret inventory

Status: **ACTIVE / VALUES MUST NEVER ENTER SOURCE OR LOGS.**

This document records secret **names, purpose, custody and rotation procedure only** for the authorized Phase 8 staging rehearsal. It never records secret values.

## Secret-management authority

**WANDA is secret-management only.** It may be used for secret custody/injection workflows where explicitly configured, but it is not general deployment, database-mutation, Vercel, Supabase or GitHub control-plane authority. Deployment and managed-database actions remain source-controlled, hosted-CI operations with exact project/epoch assertions and fail-closed behavior.

Never copy secret values from a secret manager into this repository, chat handoff, workflow output or documentation. Never reconstruct masked values from logs.

## Control-plane credentials

| Name | Purpose | Current injection point | Custody / owner | Rotation / revocation |
| --- | --- | --- | --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Supabase Management API control plane for the dedicated Fares Uniform project | GitHub Actions repository secret / approved secret-management path | Client account owner; consumed only by hosted automation | Replace the stored secret, verify a green exact-project control-plane run, then revoke the old token. |
| `VERCEL_TOKEN` | Vercel control plane for the isolated Fares Uniform project | GitHub Actions repository secret / approved secret-management path | Client Vercel account owner; consumed only by hosted automation | Replace with the narrowest team/project scope that supports required deployment/env operations, verify hosted automation, then revoke the old token. |

Control-plane tokens are never injected into browser code or Odoo runtime. Exact Vercel team/project and Supabase project-ref assertions remain mandatory even when credential custody changes.

## Vercel project runtime configuration

The following values belong only to the isolated `fares-uniform` Vercel project.

| Name | Secret? | Purpose | Target | Rotation / recovery rule |
| --- | --- | --- | --- | --- |
| `ODOO_DB_HOST` | No | Supabase Session Pooler host | Server runtime | Provider endpoint change requires Vercel env update and redeploy. |
| `ODOO_DB_PORT` | No | Session Pooler port (`5432`) | Server runtime | Change only with an explicitly re-proven connection class. |
| `ODOO_DB_NAME` | No | Dedicated application DB (`postgres`) | Server runtime | Database move requires separate migration/restore proof. Also drives the private `X-Odoo-Database` selection used by Next.js→Odoo requests. |
| `ODOO_DB_USER` | No | Supavisor runtime username (`fares_app.<project-ref>`) | Server runtime | Role rename requires grants and connection proof before redeploy. |
| `ODOO_DB_SSLMODE` | No | Enforces managed PostgreSQL TLS (`require` minimum) | Server runtime | Must not be weakened without a new security decision. |
| `ODOO_DB_PASSWORD` | **Yes** | Password for least-privileged `fares_app` | Generated/rotated through the approved hosted secret path; Vercel sensitive env | Rotate DB role and Vercel env atomically. If deployment fails before a usable runtime, fail closed rather than leave an orphan credential active. |
| `ODOO_ADMIN_PASSWD` | **Yes** | Odoo database-manager/master secret required by runtime configuration | Approved secret-management path; Vercel sensitive env | Rotate by Vercel env update + redeploy. Never expose through browser/public API. |
| `CRON_SECRET` | **Yes** | Bearer credential for `/fares/internal/cron/run` | Approved secret-management path; Vercel sensitive env and scheduler | Rotate runtime and scheduler atomically, then prove old/invalid credentials fail closed. |
| `FARES_SESSION_STORE` | No | Forces PostgreSQL-backed authenticated sessions | Server runtime | Must remain `postgres` for the accepted stateless topology. |

Platform/service-local bindings are **not** project secrets and must not be manually duplicated as broad environment variables:

- `ODOO_BASE_URL` is the private `public_web` → `odoo_http` service binding;
- `FARES_ODOO_HTTP_INTERNAL_URL` is the service-local WebSocket runtime marker/binding;
- `PORT` is provider-supplied;
- Vercel system metadata is provider-owned metadata, not a secret value to copy into the project inventory;
- runtime-mode resolution is source-controlled and must not be replaced with a project-wide secret.

## Explicitly prohibited additions

Do not add these merely because Supabase/Vercel commonly expose them:

- browser Supabase anon/publishable keys when the browser does not use Supabase directly;
- `SUPABASE_SERVICE_ROLE_KEY`;
- Supavisor transaction-pooler credentials;
- a broad `DATABASE_URL` containing credentials;
- unrelated-project credentials;
- real customer, staff, stock, order, bank or payment data.

## Current activation state — 2026-09-14

- `SUPABASE_ACCESS_TOKEN` is configured and proven for the exact project control-plane path.
- `VERCEL_TOKEN` is configured and proven against team `team_r09C6RLmb2acHapENECQIn9T` and project `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`.
- Runtime DB/admin/cron secret values are not documented here and must not be recovered from historical workflow logs.
- The current managed schema is populated after the fresh guarded deployment path.
- Runtime privilege-seal run `34898140110` / job `104160591708` proved `fares_app` is LOGIN-enabled for runtime while `CREATE` on schema `public` is revoked.
- The current deployment epoch observed by that seal is `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`.
- A future reset/restore/upgrade must use the source-controlled bounded writer path and current epoch checks; it must not simply broaden runtime privileges permanently.
- Public smoke run `34899200346` failed on a content/fixture assertion after reaching product-detail requests. This does not authorize secret rotation, exposure changes or a weaker provider boundary.

## Fail-closed rule

Any unsuccessful managed-database mutation/deployment must terminate `fares_app` sessions and remove/disable the temporary write/login lease required by that operation according to the current workflow contract. Recovery is explicit/manual where the hardened workflows require it. Stale workflow reruns are not a valid recovery mechanism.

Production secrets remain out of scope. A staging secret becoming active does not authorize production reuse.