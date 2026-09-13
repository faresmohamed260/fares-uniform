# Phase 8A — Free-tier staging execution

Status: **CLIENT AUTHORIZED; SUPABASE CONTROL PLANE + MANAGED CONNECTION VERIFIED; VERCEL LIVE PROJECT PENDING.**

Branch: `phase-8/commercial-staging-readiness`.

Parent contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Authorization date: 2026-09-13.

Inherited Phase 7 implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Inherited Phase 7 runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Current Phase 8 managed-database/runtime contract checkpoint: `b7a661bf70c2468b006bf971cba10172cf810e7d`.

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

Authorized team: `faresmohamed260-6733's projects`.

Current plan: **Hobby**.

Existing projects `studio`, `saga` and `renderlab` remain out of scope and must not be mutated by Fares Uniform automation.

No Fares Uniform Vercel project exists at this checkpoint. Vercel project creation/linking, secret injection and first live deployment are the next provider actions.

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
- `fares_app` initially `NOLOGIN` pending atomic Vercel secret injection;
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

## RED evidence retained

Phase 8 retains failed runs that exposed provider-specific assumptions instead of hiding them:

- `34787115988` — initial temporary-role/pooler assertion failure after connectivity succeeded;
- `34787178859` — established that `pg_stat_ssl` behind Supavisor describes the pooler-to-database hop, not the client-to-pooler TLS hop;
- `34787327217` — exposed Supabase's managed non-superuser boundary for explicit `ALTER ROLE ... NOSUPERUSER/NOREPLICATION`;
- `34787368732` — bootstrap applied; verification exposed PostgreSQL `PUBLIC` pseudo-role handling;
- `34787615934` — separate cross-provider workflow failed at workflow-definition parsing before any job started and was removed after its checks were integrated into the working control-plane workflow.

Each issue was corrected at the actual failing boundary; the final integrated control-plane run is green.

## Gate state

### Gate A — repository planning

**PASS.** Phase 8 staging-readiness and Phase 8A execution contracts are present and indexed.

### Gate B — authorization/provider ownership

**PARTIAL PASS / VERCEL RESOURCE PENDING.**

Resolved:

- live staging rehearsal authorized;
- free-tier-only spending boundary authorized;
- intended Vercel team identified;
- dedicated Fares Uniform Supabase project created in `eu-central-1`;
- Supabase Management API automation established through GitHub Actions;
- existing unrelated Vercel/Supabase resources preserved.

Pending:

- Fares Uniform Vercel project creation/linking;
- Vercel runtime secret injection and first deployment.

### Gate C — live staging technical GO

**IN PROGRESS.** The managed-database slice is now live and green, including real Session Pooler/TLS connectivity from the exact Vercel-target runtime image. The complete staging gate is not yet green because no live Fares Uniform Vercel deployment exists.

Still required after Vercel creation:

- activate `fares_app` with a generated runtime password and inject it without exposing it;
- deploy the three-service Vercel topology;
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

Establish the Vercel API control plane through a repository Actions secret, then create only the new `fares-uniform` project in the authorized Vercel team. The deployment workflow must fail closed and must not mutate `studio`, `saga` or `renderlab`.

Once Vercel API access is available, the preferred activation sequence is atomic/fail-closed:

1. verify the Vercel token and exact team ownership;
2. create/link the new Fares Uniform project without touching existing projects;
3. generate new runtime database/Odoo/cron secrets inside the hosted runner and mask them before use;
4. enable `LOGIN` for `fares_app` with the generated password through the Supabase Management API;
5. inject only the required server-side values into the new Vercel project;
6. deploy the authorized Phase 8 branch;
7. if provider setup fails before a usable deployment exists, rotate/disable the new runtime credential rather than leaving an orphan credential active;
8. execute the remaining Gate C proofs.

Until Gate C is complete, do not use real business data and do not claim production readiness.
