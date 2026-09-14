# Phase 8 — Commercial staging readiness

Status: **REPOSITORY CONTRACT COMPLETE; LIVE STAGING AUTHORIZED; GATE C TECHNICAL EXECUTION IN PROGRESS; CURRENT MANAGED TARGET RESET TO A CLEAN FAIL-CLOSED BASELINE.**

Branch: `phase-8/commercial-staging-readiness`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Live execution detail is owned by `docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md`.

As of 2026-09-14, Gate A and Gate B are PASS. Gate C has advanced materially: the provider-boundary restore defect is fixed and regression-proven, a corrected live attempt restored and upgraded the seven production addons successfully, and Vercel reached READY. The live public smoke then failed closed because the public Next.js surface received a 404 from Odoo for `/fu/public/catalog?lang=en`, producing a root 500. Subsequent work diagnosed and disabled Vercel SSO for the authorized public staging boundary and returned the managed database to a clean fail-closed baseline. Gate D production remains NO-GO.

## Goal

Move the verified repository/CI state into an explicitly authorized staging rehearsal on Vercel plus managed PostgreSQL/Supabase while preserving the Phase 7 security, state, recovery and exposure boundaries.

This phase keeps three states separate:

1. repository readiness;
2. an explicitly authorized live staging rehearsal;
3. separately authorized production cutover.

Staging success never authorizes production.

## Authorization boundary

The client authorized work on new isolated Fares Uniform staging resources on Vercel and Supabase with a hard **free-tier-only** spending boundary.

This authorization does not permit:

- any paid Vercel or Supabase upgrade without new explicit approval;
- mutation of unrelated provider projects;
- production deployment or cutover;
- real customer, staff, stock, order, bank or payment data;
- broad Odoo backoffice exposure;
- weakening server-side roles, public-route allowlists, offline checkout correctness, database privilege boundaries, session semantics or recovery requirements.

Production requires a separate Gate D authorization.

## Inherited technical baseline

The Phase 7 topology remains authoritative unless a later decision replaces it with equal proof:

- `public_web` is the Vercel-native Next.js public service;
- `odoo_http` is stateless Odoo HTTP compute;
- `odoo_websocket` is separate stateless evented Odoo compute;
- public web reaches Odoo HTTP through the private `ODOO_BASE_URL` service binding;
- `/websocket` is the only intended public evented-service rewrite;
- `/fares/internal/cron/run` is the only intended public Odoo HTTP rewrite and remains bearer-authenticated;
- broad Odoo backoffice and direct `/fu/public/**` routes remain unexposed through the public mapping;
- attachments and authenticated sessions are PostgreSQL-backed;
- built-in Odoo cron threads remain disabled;
- WebSocket continuity relies on reconnect/cursor replay rather than instance affinity;
- production addons are `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`;
- `fu_uat` is test-only and must never be loaded in staging/production.

The Phase 6 PostgreSQL+filestore package remains the fallback/reference topology.

## Current provider ownership

| Item | Current state |
| --- | --- |
| Vercel plan | free-tier boundary; no paid upgrade authorized |
| Vercel project | isolated `fares-uniform`, project id `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`, team `team_r09C6RLmb2acHapENECQIn9T` |
| Vercel exposure | Vercel SSO deliberately disabled for the authorized public staging boundary; broad Odoo routing remains prohibited |
| Supabase project | isolated `Fares Uniform`, ref `urqlxisivowkmsfisjek`, region `eu-central-1` |
| Database | provider-managed `postgres` database dedicated to this project |
| Routine DB role | least-privileged `fares_app` |
| Connection class | Supavisor Session Pooler `aws-0-eu-central-1.pooler.supabase.com:5432`, client `sslmode=require` |
| Provider bootstrap | separate provider-managed bootstrap/control-plane context; not routine Odoo runtime |
| Current managed app state | clean baseline: `fares_app` NOLOGIN, zero app-owned public relations, provider bootstrap preserved |
| Provider-owned session table | `fares_http_session`, owned by `postgres`, preserved across reset |
| Required extensions | `unaccent` and `pg_trgm`, provider-owned and preserved |
| Secret custody | no-value inventory in `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`; values stay in provider/GitHub secret stores |
| Monitoring/alerts | still required before Gate C GO |
| Backup/recovery | managed backup + destructive restore rehearsal still required before Gate C GO |

A READY Vercel deployment artifact from the corrected live attempt still exists (`dpl_9dq5Fnmetypvih4QeeCEMPZQhgdu`, alias `fares-uniform.vercel.app`, workflow/deployment SHA `6d273e4eac9cc8b89b6baf7529564b401c875047`). It is evidence, **not a currently valid staging runtime**, because the managed application schema was subsequently reset and `fares_app` returned to NOLOGIN.

## Managed PostgreSQL/Supabase contract

Supabase is the selected managed PostgreSQL staging target.

Non-negotiable runtime requirements:

- direct PostgreSQL or Supavisor **session mode** is acceptable;
- Supavisor **transaction mode is prohibited** because Odoo realtime behavior requires PostgreSQL session semantics, including `LISTEN/NOTIFY`;
- managed connectivity uses TLS with `sslmode=require` at minimum;
- routine Odoo uses `fares_app` and must not receive superuser, createdb or createrole;
- privileged bootstrap remains separate from routine runtime;
- `fares_http_session` remains bootstrap/provider-owned and routine runtime receives only required DML;
- database-backed attachments remain required for the Vercel topology unless explicitly migrated and re-proven.

Live proof has established Session Pooler/TLS/dotted-user compatibility from the exact runtime image.

## Provider-boundary restore defect — RED to GREEN

The first live deployment attempt failed in run `34821582384`, deploy job `103904147677`, at `Restore initialized schema into clean Supabase target`. Fail-closed guard job `103905391955` succeeded.

Exact RED cause:

- `pg_restore` attempted `COMMENT ON EXTENSION unaccent`;
- PostgreSQL rejected it because `fares_app` is not the owner of provider-owned extension `unaccent`.

The old `pg_restore -l` filter incorrectly assumed object names were at the end of TOC lines; the archive owner is actually trailing, so provider-owned entries survived. PostgreSQL 16.12 is pinned, so the fix had to remain PG16-compatible rather than relying on PG17 `--exclude-extension`.

The corrected TOC-descriptor filter excludes provider/bootstrap entries including:

- `SCHEMA - public`;
- `COMMENT - SCHEMA public`;
- `ACL - SCHEMA public`;
- `EXTENSION - unaccent`;
- `EXTENSION - pg_trgm`;
- extension comments;
- `fares_http_session`.

Evidence:

- initial hosted regression RED: run `34836378096`, job `103951039660`;
- corrected regression commit `06c0af27dd49375b19d00a9276e2d225bf519c5b`;
- corrected hosted regression GREEN: run `34841523130`, job `103967384659`;
- live workflow patch commit `6d273e4eac9cc8b89b6baf7529564b401c875047`.

The corrected hosted regression proved provider-boundary restore plus a repeat full seven-addon upgrade while keeping `fu_uat` absent and provider-owned objects intact.

## Corrected live attempt — managed restore and Vercel READY

Corrected live workflow run `34842081247`, deploy job `104054566511`, advanced through the previously failing boundary.

GREEN before the public smoke:

- exact candidate/boundary assertions;
- exact database and Vercel Odoo images;
- local initialized application database;
- corrected filtered restore set;
- bounded activation of `fares_app`;
- managed schema restore;
- repeat seven-addon verification/upgrade;
- required Vercel runtime environment injection and no-value inventory verification;
- exact Vercel deployment;
- Vercel build/containers and READY activation.

The deployment reached READY as `dpl_9dq5Fnmetypvih4QeeCEMPZQhgdu` with production alias `fares-uniform.vercel.app`. Its metadata recorded workflow/deployment SHA `6d273e4eac9cc8b89b6baf7529564b401c875047` and pinned Odoo SHA `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

The final step `Verify READY deployment and minimal public exposure` remained correctly fail-closed and failed at the application smoke boundary.

### Public-runtime RED evidence

Runtime evidence showed the request reached the application runtime; this was not merely an upstream Vercel-authentication failure:

- public root `/` returned HTTP 500;
- Next.js reported `Invalid catalog response`;
- public web called Odoo at `/fu/public/catalog?lang=en`;
- Odoo returned HTTP 404;
- Odoo itself booted, loaded its registry/modules and installed the PostgreSQL-backed session store.

The fail-closed path subsequently returned `fares_app` to NOLOGIN.

This 404/root-500 remains unresolved application/runtime evidence that must be addressed before a new clean staging deployment can pass Gate C public smoke.

## Vercel exposure-policy diagnosis and correction

A separate provider diagnostic preserved the distinction between Vercel authentication and application routing.

Diagnostic commit `4380972525d70d3126a56e86a6ffeff01f5887ba`, run `34865665473`, job `104048749999` — **GREEN** — found project SSO protection configured as `all_except_custom_domains`; anonymous deployment hosts redirected to Vercel SSO.

Public-staging policy correction commit `0ad8ad3d75af4a3d25df9ccf5a64a97ee9bdd92f`, run `34866159453`, job `104050408771` — **GREEN** — intentionally disabled Vercel Authentication for this explicitly authorized public staging surface and removed the failed deployment boundary before a clean retry.

This change authorizes only the intended public Next.js staging surface. It does not authorize broad Odoo/backoffice exposure.

## Managed staging reset — RED to GREEN

After the failed public runtime attempt, the managed target was deliberately returned to a clean staging baseline.

### First reset attempt — RED

Commit `8cc6d651096759d1212fb3249fa05f2ddc04b236`, run `34866894850`, job `104052858733`.

Precondition was correct: `fares_app` NOLOGIN, zero sessions, `988` app-owned relations, provider-owned `fares_http_session` intact.

The single-transaction `DROP OWNED BY CURRENT_USER CASCADE` failed with:

- `ERROR: out of shared memory`;
- hint to increase `max_locks_per_transaction`.

The cleanup guard still disabled the temporary login, preserving fail-closed state.

### Bounded-lock reset — GREEN

Commit `7311c0a07ea020b967240ab44a57fb7be8c190a8`, run `34867078825`, job `104053486058` — **SUCCESS**.

The fix drops app-owned public relations one at a time under psql autocommit, bounding locks per transaction, then uses `DROP OWNED` only for the remaining routines/types/grants.

Final proof:

- `owner_scoped_partial_odoo_cleanup=PASS tls=require bounded_locks=true`;
- `managed_bootstrap_reapplied=PASS`;
- `fares_app` `rolcanlogin=false`;
- app sessions `0`;
- app-owned public relations `0`;
- `fares_http_session` preserved under `postgres` ownership;
- both required extensions preserved;
- routine role retains required CONNECT/USAGE/CREATE privileges for the next bounded activation;
- `managed_odoo_target_reset=PASS role=NOLOGIN app_owned_relations=0 bootstrap=preserved`.

This is the **current managed-database baseline** for the next attempt.

## Secrets and role activation

The no-value secret inventory remains `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

Runtime secrets are generated/masked inside hosted CI. `fares_app` may be temporarily enabled only inside the bounded deployment/reset workflow and must return to NOLOGIN on an unsuccessful attempt. Secret values must never be reconstructed from logs or committed to documentation.

## Remaining Gate C proof contract

The next clean staging attempt must first resolve the public-runtime catalog failure without weakening exposure boundaries. After the exact deployment is usable, Gate C still requires:

- live public English/Arabic home/catalog/detail/enquiry smoke;
- no public price or stock leakage;
- synthetic enquiry submission;
- broad Odoo backoffice/direct public API routes unavailable from the public mapping;
- database-backed attachment continuity across replaceable compute;
- shared authenticated-session continuity or explicitly documented re-authentication behavior;
- external authenticated cron with built-in cron disabled and native overlap locking proven;
- WebSocket reconnect/cursor replay across replacement;
- managed backup/export plus destructive restore rehearsal;
- logs/monitoring/alert ownership and privacy/redaction rules.

Store-device acceptance, staff/training and real-data cutover remain later Gate D prerequisites and cannot be replaced by synthetic CI.

## GO / NO-GO gates

### Gate A — repository planning

**PASS.**

### Gate B — staging authorization/provider ownership

**PASS.** Isolated free-tier staging resources and required control-plane credentials are established.

### Gate C — live staging technical GO

**IN PROGRESS / NO-GO FOR STAGING SIGN-OFF.**

The managed restore boundary is no longer the blocker. Current authoritative state is:

- restore filter regression: GREEN;
- managed restore: GREEN on corrected live attempt;
- managed seven-addon repeat upgrade: GREEN;
- Vercel environment/deployment: GREEN;
- Vercel READY: GREEN;
- public application smoke: RED (`/fu/public/catalog?lang=en` returned 404; root returned 500);
- Vercel SSO diagnosis/correction: GREEN;
- managed staging reset back to clean baseline: GREEN;
- remaining continuity/realtime/recovery/monitoring/EN-AR proofs: not yet complete.

Any unresolved P0/P1 security or correctness failure remains NO-GO.

### Gate D — production

**NO-GO.** Production additionally requires store-device acceptance, named staff/roles/training, separately authorized real-data cutover/reconciliation, production domains/secrets/access, backup retention and RPO/RTO decisions, monitoring owners, launch/spending authorization and an explicit client production GO.

## Immediate continuation

Start from branch `phase-8/commercial-staging-readiness` and re-read the current repository state before mutation.

1. Treat run `34842081247` as preserved mixed evidence: managed restore/upgrade/Vercel READY passed; final public smoke failed.
2. Treat run `34867078825` as the current managed baseline authority: clean target, `fares_app` NOLOGIN, zero app-owned relations, bootstrap preserved.
3. Diagnose the expected public catalog route/runtime registration and data initialization path that caused `/fu/public/catalog?lang=en` to return 404. Do not expose direct `/fu/public/**` publicly to work around it.
4. Inspect existing Phase 8 workflows before inventing a new deploy/proof path; reuse the source-controlled exact-candidate workflow where possible.
5. Perform the next deployment from the clean managed baseline with hosted CI only and preserve new RED evidence if it fails.
6. When public EN/AR smoke is green, finish the remaining Gate C attachment/session/cron/WebSocket/recovery/monitoring proofs.

Do not use a local project checkout. Do not force-push. Do not load `fu_uat` in staging/production. Do not use transaction pooling. Do not run routine Odoo as provider admin. Do not use real business data. Do not spend money without new explicit authorization. Production remains NO-GO.
