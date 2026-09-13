# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code and documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Public presentation is a separate Next.js surface consuming only the narrow Fares public API.
- Vercel remains the selected application-platform direction for the current staging work; durable truth lives in managed backing services.
- Supabase is the selected managed PostgreSQL target for Phase 8 staging.
- Live staging resource creation is authorized only within the accepted free-tier spending boundary.
- Production remains separately gated and is not authorized by staging work.

## Current state — 2026-09-14

**Phases 0 through 7 repository/CI scope are COMPLETE / VERIFIED. Phase 8 planning is complete. Phase 8A live staging execution is IN PROGRESS: the dedicated Supabase project, bootstrap and real Session Pooler/runtime-image proof are GREEN; the Fares Uniform Vercel project and complete live Gate C rehearsal are still pending. Production remains NO-GO.**

Current branch: `phase-8/commercial-staging-readiness`.

Phase 8 planning contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Active Phase 8A execution/status contract: `docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md`.

Current managed-database/runtime contract checkpoint: `b7a661bf70c2468b006bf971cba10172cf810e7d`.

Current Phase 8 Supabase proof: workflow run `34787677724`, job `103806024323` — **SUCCESS**.

Inherited authorities remain:

- Phase 7 Vercel stateless adaptation implementation: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`;
- Phase 7 final runtime-sensitive checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- Phase 6 provider-neutral deployment package: `e337315684c62d69ad75ba56a5867098da17489c`;
- Phase 5A business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`;
- pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

The Phase 5A application authority remains green at **149 tests, 0 failures, 0 errors**, repeatable seven-production-addon upgrade, public typecheck/build and **8/8 Playwright**, with open release-candidate P0/P1/P2 at **0 / 0 / 0**.

## Phase 7 architecture that remains authoritative

Source-controlled topology is in `vercel.json`:

- `public_web`: Next.js service rooted at `apps/public-web/`;
- `odoo_http`: stateless Odoo container service from `Dockerfile.vercel`;
- `odoo_websocket`: separate stateless evented Odoo container service from the same image;
- `public_web` reaches Odoo HTTP through private service binding `ODOO_BASE_URL`;
- `/websocket` is the only public rewrite to the evented service;
- `/fares/internal/cron/run` is the only public rewrite to Odoo HTTP and requires the server-side cron bearer secret;
- catch-all public traffic goes to `public_web`;
- broad Odoo backoffice and direct `/fu/public/**` exposure are absent.

Correctness-critical state is externalized from Vercel compute:

- operational data: PostgreSQL;
- attachments: native database-backed `ir.attachment` storage;
- authenticated sessions: shared PostgreSQL-backed server-side session store;
- built-in Odoo cron threads: disabled;
- scheduled work: authenticated external trigger using native Odoo locking;
- realtime: separate evented runtime with reconnect/cursor replay;
- recovery authority: database-backed application/attachment/session state plus exact Fares/Odoo/config authority.

The Phase 6 PostgreSQL+filestore package remains preserved as a verified fallback/reference topology.

## Phase 8A Supabase live state

A dedicated Fares Uniform Supabase project now exists on a separate account. The earlier free-project-cap issue in the account containing `AI Studio` and `S.A.G.A.` is resolved without pausing, deleting or repurposing either existing project.

Live target:

- project: `Fares Uniform`;
- project ref: `urqlxisivowkmsfisjek`;
- region: `eu-central-1`;
- provider status: `ACTIVE_HEALTHY`;
- Session Pooler: `aws-0-eu-central-1.pooler.supabase.com:5432`;
- application database: the dedicated project's provider-managed `postgres` database;
- routine runtime role: `fares_app`;
- runtime pooler username after activation: `fares_app.urqlxisivowkmsfisjek`;
- live TLS rule: `sslmode=require` minimum;
- Supavisor transaction mode remains prohibited for Odoo.

Supabase is administered through GitHub Actions using repository secret `SUPABASE_ACCESS_TOKEN`. The token itself must never be committed or printed.

`deploy/supabase/bootstrap.sql` is the idempotent managed-database bootstrap authority. Current live state includes:

- `fares_app` created least-privileged and currently `NOLOGIN` pending atomic Vercel activation;
- `fares_app` verified non-superuser, non-createdb, non-createrole, non-replication and noinherit;
- required database/schema grants only;
- `CREATE` revoked from `PUBLIC` on schema `public`;
- `unaccent` and `pg_trgm` installed;
- `public.fares_http_session` created and owned by managed `postgres`;
- public session-table DML revoked;
- required session-table DML granted to `fares_app`.

The managed bootstrap context is provider role `postgres` with `CREATEDB` and `CREATEROLE` but not true PostgreSQL superuser; bootstrap code must respect that provider boundary.

## Phase 8A provider/runtime proof

Phase 8 live provider work exposed and corrected a real Supavisor compatibility issue: the original Phase 7 entrypoint allowed only a bare PostgreSQL identifier for `ODOO_DB_USER`, while Supavisor Session Pooler requires a custom-role connection username with one project-ref suffix.

Current correction:

- `deploy/vercel/validation.sh` keeps database identifiers strict while allowing exactly one Supavisor `.<project-ref>` suffix for the connection username;
- unsafe separators, arbitrary DSN syntax and multiple suffixes remain rejected;
- `deploy/vercel/entrypoint.sh` uses the connection-user validator;
- `Dockerfile.vercel` ships the validation helper into the exact non-root runtime image.

Authoritative run `34787677724` / job `103806024323` at checkpoint `b7a661bf...` proves:

- GitHub Actions PAT access to the exact Fares Uniform Supabase project;
- writable Management API SQL context;
- repeatable bootstrap and least-privilege ACLs;
- real Session Pooler connectivity on port `5432` using client `sslmode=require`;
- temporary provider-issued CLI role is non-superuser/non-createdb/non-createrole;
- exact Vercel-target runtime image builds successfully with pinned Odoo/Fares authority;
- exact runtime image can connect with psycopg2 through the real Session Pooler using the dotted username form.

RED evidence is retained in the Phase 8A status contract rather than rewritten as green history.

## Phase 8A gate state

- **Gate A — repository planning: PASS.**
- **Gate B — authorization/provider ownership: PARTIAL PASS.** Supabase ownership/control plane is established; Fares Uniform Vercel project creation is pending.
- **Gate C — live staging technical GO: IN PROGRESS.** Managed-database/bootstrap/runtime-image connection slice is green; actual live Vercel service deployment and end-to-end proofs remain.
- **Gate D — production: NO-GO.** Production requires separate authorization after staging plus device/staff/data-cutover gates.

## Immediate next action

Do not redo Phase 7 discovery or reopen inherited green slices without evidence of a regression.

The next external prerequisite is a Vercel API token stored only as a GitHub Actions repository secret. After that, continue through hosted automation:

1. verify the token is scoped to the intended Vercel team and fail closed on any mismatch;
2. create/link only the new `fares-uniform` Vercel project; never mutate `studio`, `saga` or `renderlab`;
3. generate and mask the `fares_app` runtime password, Odoo master secret and cron secret in the hosted runner;
4. atomically enable `LOGIN` for `fares_app` and inject required server-side Vercel environment variables;
5. deploy the authorized Phase 8 branch;
6. fail closed by rotating/disabling any newly activated runtime credential if provider setup aborts before a usable deployment exists;
7. run the complete managed staging proof: seven addons, attachment/session continuity, cron, WebSocket replay, managed backup/destructive restore, monitoring/logs and EN/AR staging smoke.

Do not add generic browser Supabase keys, `SUPABASE_SERVICE_ROLE_KEY`, transaction-pooler credentials or a broad `DATABASE_URL` unless an explicit source change requires them. `ODOO_BASE_URL`, `FARES_ODOO_HTTP_INTERNAL_URL`, `PORT` and runtime mode are platform/service-binding concerns and must not be manually overridden as project secrets.

## Product and architecture rules that remain authoritative

- School/client-specific designs are distinct stocked products when units are not interchangeable.
- Sizes are configurable per product family; do not hardcode one global size enum.
- Permanent system-managed variant codes use `FU-000001` style.
- Current physical finished-stock locations are Retail Store and Storage.
- Factory `Finished` is workflow state, not a tracked factory-finished inventory location.
- Cash and InstaPay are current payment methods; cards/wallets remain future work.
- Public catalog exposes neither price nor stock.
- Offline checkout remains mandatory and fail-closed where online-only operations are required.
- Server-side role/location enforcement remains authoritative.
- Numeric production volume, production budget and launch date remain unknown and must not be invented.

## Roadmap status

1. Phase 0 discovery — complete.
2. Phase 0A hosted Odoo proof — complete / pass.
3. Phase 0B foundation — complete.
4. Phase 1 products/stock/access — complete.
5. Phase 2A retail checkout/offline — complete.
6. Phase 2B preorder/balance/collection — complete.
7. Phase 2C retail refunds/size exchanges — complete.
8. Phase 3A preorder production — complete.
9. Phase 3B business-client workflow — complete.
10. Phase 4A public catalog/enquiry — complete / verified.
11. Phase 4B operational reporting — complete / verified.
12. Phase 5 integrated UAT/onboarding — complete / verified.
13. Phase 5A Arabic launch-quality polish — complete / verified.
14. Phase 6 provider-neutral deployment/restore proof — complete / verified.
15. Phase 7 Vercel stateless deployment adaptation — complete / verified at repository/CI level.
16. Phase 8 commercial staging readiness — repository planning complete.
17. Phase 8A free-tier staging execution — **in progress; Supabase live slice green, Vercel project pending**.
18. Production — **NO-GO** until live staging and separate operational/cutover authorization gates pass.

## Later explicit business-policy decisions

Still deferred unless their affected work starts:

- B2B deposit refund/forfeiture and credit-note/refund policy;
- post-confirmation business-order amendments;
- future partial shipment or customer-credit terms;
- tax/legal revenue recognition/invoicing treatment;
- report exports/scheduled delivery;
- cards/wallets and bank API automation;
- automated customer notifications;
- raw-material/WIP inventory.

## Evidence policy

Implemented, hosted-tested, visually reviewed, staged and deployed are separate states. Every implementation/deployment claim must refer to exact remote evidence. Synthetic proof data only until real-data migration is separately authorized; credentials and private business records never belong in this public repository.
