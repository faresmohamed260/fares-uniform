# Phase 8A — Free-tier staging execution

Status: **CLIENT AUTHORIZED; SUPABASE LIVE SLICE VERIFIED; VERCEL CONTROL PLANE + PROJECT SHELL VERIFIED; COMPLIANT FREE DEPLOYMENT STILL BLOCKED.**

Branch: `phase-8/commercial-staging-readiness`.

Parent contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Authorization date: 2026-09-13.

Inherited Phase 7 implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Inherited Phase 7 runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Current Phase 8 managed-database/runtime contract checkpoint: `b7a661bf70c2468b006bf971cba10172cf810e7d`.

Current Vercel control-plane checkpoint: `884aedc9465122d25639ca24954f154dfa72dc70`.

## Client authorization

The client authorized creating and mutating new isolated Fares Uniform staging resources on **Vercel** and **Supabase** for this live rehearsal, with one hard spending condition: **stay on free tiers**.

This authorization does not permit:

- upgrading Vercel or Supabase to a paid plan;
- pausing, deleting, repurposing or mutating RenderLab, SAGA, AI Studio or S.A.G.A.;
- production deployment or production cutover;
- real customer, staff, stock, order, bank or payment data;
- broad Odoo backoffice exposure;
- weakening the Phase 7 database/session/cron/WebSocket/security model.

## Provider ownership

### Vercel

Authorized team:

- name: `faresmohamed260-6733's projects`;
- team id: `team_r09C6RLmb2acHapENECQIn9T`;
- slug: `faresmohamed260-6733s-projects`;
- current plan: **Hobby**.

Existing projects `studio`, `saga` and `renderlab` remain out of scope and must not be mutated by Fares Uniform automation.

The GitHub Actions repository secret `VERCEL_TOKEN` is now configured. The client explicitly reported that the issued token has **full account control**. Hosted automation therefore treats the exact team id and exact `fares-uniform` project name as mandatory fail-closed boundaries rather than relying on token scope alone.

The new isolated project shell now exists:

- project name: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- account/team id: `team_r09C6RLmb2acHapENECQIn9T`;
- latest deployment: none at the control-plane checkpoint;
- domains: none at the control-plane checkpoint;
- Git repository link: intentionally not activated by the first control-plane run, preventing an unintended automatic deployment before the free-tier/commercial-use constraint is resolved.

Authoritative Vercel control-plane run:

- commit: `884aedc9465122d25639ca24954f154dfa72dc70`;
- workflow run: `34788971298`;
- job: `103809533700`;
- result: **SUCCESS**.

That run proved:

- the repository secret is present without printing its value;
- the token can access exactly the authorized Vercel team;
- `studio`, `saga` and `renderlab` each remain present and untouched;
- there was no pre-existing `fares-uniform` project;
- only the isolated `fares-uniform` project shell was created;
- the resulting project id/account ownership match the exact expected team;
- deployment count remained `0` after creation.

The current full-account Vercel token is broader than the eventual steady-state requirement. After project creation/bootstrap no longer requires account-wide creation privileges, replace it with the narrowest project/team-scoped token that still supports required deployment/environment operations, prove the replacement in hosted CI, then revoke the broad token. The secret value itself must never be committed or printed.

### Supabase

The original `Fares Home Lab` free account remains untouched, including:

- `AI Studio` — active, `eu-west-1`;
- `S.A.G.A.` — active, `eu-central-1`.

The earlier two-active-project free-tier blocker was resolved by using a separate Supabase account rather than pausing or repurposing either existing project.

The dedicated Fares Uniform project now exists:

- project name: `Fares Uniform`;
- project ref: `urqlxisivowkmsfisjek`;
- region: `eu-central-1`;
- provider state proven: `ACTIVE_HEALTHY`;
- session-pooler host: `aws-0-eu-central-1.pooler.supabase.com`;
- session-pooler port: `5432`;
- application database: provider-managed `postgres` database dedicated to this Fares Uniform project.

Because the entire Supabase project is isolated for Fares Uniform, the provider-managed `postgres` database is used as the application database rather than creating a second nested database. This keeps provider backup/restore and dashboard operations aligned with the managed project.

## GitHub Actions Supabase control plane

Supabase administration is performed remotely through GitHub Actions using the repository secret `SUPABASE_ACCESS_TOKEN`. The token value is not committed, printed or copied into project documentation.

The control plane proves:

- Management API project access;
- writable Management API SQL context;
- idempotent managed-database bootstrap;
- least-privileged runtime-role boundary;
- real Supavisor Session Pooler connectivity on port `5432`;
- client-side TLS requirement through `sslmode=require`;
- exact Vercel-target runtime image connectivity through the real Session Pooler.

Authoritative green run for the current managed-database/runtime contract:

- commit: `b7a661bf70c2468b006bf971cba10172cf810e7d`;
- workflow run: `34787677724`;
- job: `103806024323`;
- result: **SUCCESS**;
- elapsed job time: approximately **4m12s**.

The run builds the exact Vercel-target Odoo image with pinned Odoo SHA `1a13ceea...` and `FARES_SHA=$GITHUB_SHA`, then proves that image can authenticate through the real Supabase Session Pooler using the provider-required dotted username form.

## Managed database bootstrap state

`deploy/supabase/bootstrap.sql` is the source-controlled idempotent bootstrap authority.

The live project currently has:

- `fares_app` routine application role;
- `fares_app` still `NOLOGIN` pending atomic runtime secret injection;
- `fares_app` verified `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`, `NOINHERIT`, `NOREPLICATION`;
- `CONNECT` and `TEMPORARY` on database `postgres` for `fares_app`;
- `USAGE` and `CREATE` on schema `public` for `fares_app`;
- schema-wide `CREATE` revoked from `PUBLIC`;
- `unaccent` and `pg_trgm` installed;
- `public.fares_http_session` created for the shared PostgreSQL-backed Odoo session store;
- session table owned by the managed `postgres` bootstrap role;
- public DML revoked from the session table;
- only required `SELECT`, `INSERT`, `UPDATE`, `DELETE` privileges granted to `fares_app`.

The provider-managed writable bootstrap context is verified as role `postgres` with `CREATEDB` and `CREATEROLE` but **not** PostgreSQL superuser. Bootstrap logic therefore respects Supabase's managed-role boundary rather than assuming true superuser privileges.

## Supavisor runtime compatibility correction

Live provider proof exposed one real Phase 8 integration defect before deployment: Supavisor Session Pooler authenticates a custom role using a username such as `fares_app.urqlxisivowkmsfisjek`, while the Phase 7 entrypoint originally allowed only a bare PostgreSQL identifier.

The correction is source-controlled:

- `deploy/vercel/validation.sh` distinguishes a database identifier from a database connection username;
- direct PostgreSQL users such as `fares_app` remain valid;
- exactly one Supavisor project-ref suffix is permitted for the connection username;
- arbitrary DSN syntax, multiple suffixes, separators and injection characters remain rejected;
- `deploy/vercel/entrypoint.sh` uses the new connection-user validator;
- `Dockerfile.vercel` ships the exact helper into the non-root runtime image.

Run `34787677724` proves both the validation contract and real psycopg2 connectivity from the exact built runtime image through the Fares Uniform Session Pooler.

## Secret inventory

The no-value secret inventory is authoritative at `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

Current activation state:

- `SUPABASE_ACCESS_TOKEN`: configured and proven;
- `VERCEL_TOKEN`: configured and proven against the exact authorized team, but currently broader than desired steady-state scope;
- `fares_app`: still `NOLOGIN`;
- permanent `ODOO_DB_PASSWORD`: not generated;
- `ODOO_ADMIN_PASSWD`: not generated;
- `CRON_SECRET`: not generated;
- no Vercel runtime environment secret has been injected yet.

## RED evidence retained

Phase 8 retains failed runs that exposed provider-specific assumptions instead of hiding them:

- `34787115988` — initial temporary-role/pooler assertion failure after connectivity succeeded;
- `34787178859` — established that `pg_stat_ssl` behind Supavisor describes the pooler-to-database hop, not the client-to-pooler TLS hop;
- `34787327217` — exposed Supabase's managed non-superuser boundary for explicit `ALTER ROLE ... NOSUPERUSER/NOREPLICATION`;
- `34787368732` — bootstrap applied; verification exposed PostgreSQL `PUBLIC` pseudo-role handling;
- `34787615934` — separate cross-provider workflow failed at workflow-definition parsing before any job started and was removed after its checks were integrated into the working control-plane workflow.

Each issue was corrected at the actual failing boundary; the final integrated Supabase control-plane run and the new Vercel control-plane run are green.

## Free-tier Vercel deployment constraint

The client requirement remains **stay free**. The authorized Vercel team remains on **Hobby**. The repository's earlier provider review established that Hobby is not a valid target for the intended commercial Fares Uniform workload under Vercel's current plan terms.

For that reason the control-plane workflow intentionally stopped after creating a clean, empty project shell. It did **not**:

- link the GitHub repository;
- create a deployment;
- activate `fares_app` login;
- generate or inject permanent runtime secrets;
- assign domains;
- mutate the three existing Vercel projects.

Do not turn the empty shell into a commercial staging deployment merely to obtain a free URL. A compliant next step requires either a separately authorized Vercel plan suitable for commercial use or a documented hosting-provider decision that preserves the Phase 7 security/state/realtime contract while remaining free.

## Gate state

### Gate A — repository planning

**PASS.** Phase 8 staging-readiness and Phase 8A execution contracts are present and indexed.

### Gate B — authorization/provider ownership

**PARTIAL PASS / RESOURCE OWNERSHIP ESTABLISHED; COMPLIANT VERCEL PLAN UNRESOLVED.**

Resolved:

- live staging rehearsal authorized;
- free-tier-only spending boundary authorized;
- exact Vercel team and new isolated Fares Uniform project shell established;
- dedicated Fares Uniform Supabase project created in `eu-central-1`;
- Supabase and Vercel API automation established through GitHub Actions;
- existing unrelated Vercel/Supabase resources preserved;
- secret inventory recorded without values.

Pending:

- a Vercel plan/provider path that is both compatible with the intended commercial workload and the client's spending boundary;
- Git repository linking only after the deployment target is compliant;
- runtime secret injection and first deployment.

### Gate C — live staging technical GO

**IN PROGRESS / BLOCKED AT APPLICATION HOSTING.** The managed-database slice is live and green, including real Session Pooler/TLS connectivity from the exact Vercel-target runtime image. The complete staging gate is not green because the Vercel project shell has no deployment and the free Hobby plan remains an unresolved policy boundary.

Still required after a compliant application-hosting path is selected:

- activate `fares_app` with a generated runtime password and inject it without exposing it;
- deploy the three-service topology or an explicitly approved equivalent preserving the Phase 7 contract;
- initialize/install/upgrade the seven production addons against the managed database;
- verify database-backed attachment continuity on live replaceable compute;
- verify shared authenticated-session continuity;
- verify external authenticated cron execution and native locking;
- verify WebSocket reconnect/cursor replay;
- perform managed backup plus destructive restore rehearsal;
- establish logs/monitoring;
- perform public EN/AR smoke tests on the actual staging URL.

### Gate D — production

**NO-GO.** Unchanged. Production requires a separate authorization after live staging and the device/staff/data-cutover gates.

## Next authorized action

Do not activate permanent database/runtime credentials while no compliant application deployment target exists.

The next decision is provider-level rather than an application defect:

1. either separately authorize a Vercel plan suitable for the commercial staging workload, which is new spending authorization and must be cost-confirmed before any upgrade; or
2. keep the hard `$0` boundary and select/document an alternative host that explicitly permits the commercial staging workload while preserving the accepted stateless Odoo HTTP + evented WebSocket + managed PostgreSQL/session/cron/security behavior.

After that provider decision, resume the already-defined atomic activation sequence: generate/mask runtime secrets in hosted CI, enable `fares_app LOGIN`, inject only server-side environment values, deploy, fail closed on setup failure, then execute the remaining Gate C proofs.

Until Gate C is complete, do not use real business data and do not claim production readiness.
