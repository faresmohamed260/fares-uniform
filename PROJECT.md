# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code and documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Public presentation is a separate Next.js surface consuming only the narrow Fares public API.
- Vercel remains the selected application-platform direction for the current staging work unless the client changes the provider decision; durable truth lives in managed backing services.
- Supabase is the selected managed PostgreSQL target for Phase 8 staging.
- Live staging resource creation is authorized only within the accepted free-tier spending boundary.
- Production remains separately gated and is not authorized by staging work.

## Current state — 2026-09-14

**Phases 0 through 7 repository/CI scope are COMPLETE / VERIFIED. Phase 8 planning is complete. Phase 8A live staging execution is IN PROGRESS: the dedicated Supabase project/bootstrap/real Session Pooler proof is GREEN, and the Vercel token/control plane plus isolated `fares-uniform` project shell are GREEN. The project shell intentionally has no deployment because the authorized Vercel team is still on Hobby while the client requires staying free; the compliant application-hosting path is now the active blocker. Production remains NO-GO.**

Current branch: `phase-8/commercial-staging-readiness`.

Phase 8 planning contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Active Phase 8A execution/status contract: `docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md`.

Staging secret inventory: `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

Current managed-database/runtime contract checkpoint: `b7a661bf70c2468b006bf971cba10172cf810e7d`.

Current Phase 8 Supabase proof: workflow run `34787677724`, job `103806024323` — **SUCCESS**.

Current Vercel control-plane checkpoint: `884aedc9465122d25639ca24954f154dfa72dc70`.

Current Vercel control-plane proof: workflow run `34788971298`, job `103809533700` — **SUCCESS**.

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

A dedicated Fares Uniform Supabase project exists on a separate account. The earlier free-project-cap issue in the account containing `AI Studio` and `S.A.G.A.` was resolved without pausing, deleting or repurposing either existing project.

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

- `fares_app` created least-privileged and still `NOLOGIN` pending atomic application-host activation;
- `fares_app` verified non-superuser, non-createdb, non-createrole, non-replication and noinherit;
- required database/schema grants only;
- `CREATE` revoked from `PUBLIC` on schema `public`;
- `unaccent` and `pg_trgm` installed;
- `public.fares_http_session` created and owned by managed `postgres`;
- public session-table DML revoked;
- required session-table DML granted to `fares_app`.

The managed bootstrap context is provider role `postgres` with `CREATEDB` and `CREATEROLE` but not true PostgreSQL superuser; bootstrap code must respect that provider boundary.

## Phase 8A Vercel live control plane

The repository secret `VERCEL_TOKEN` is configured and was proven through hosted CI against the exact authorized team. The client reported that the issued token has full-account control, so automation is deliberately constrained by exact team/project assertions rather than trusting token scope.

Authorized team:

- team id: `team_r09C6RLmb2acHapENECQIn9T`;
- slug: `faresmohamed260-6733s-projects`;
- name: `faresmohamed260-6733's projects`;
- plan: Hobby.

New isolated project shell:

- name: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- account/team id: `team_r09C6RLmb2acHapENECQIn9T`;
- deployment count at proof: `0`;
- latest deployment: none;
- domains: none;
- Git link: intentionally not activated yet.

Run `34788971298`, job `103809533700`, at `884aedc...` proves the token/team boundary, preserves `studio`, `saga` and `renderlab`, creates only the new shell and verifies no deployment mutation occurred.

The full-account token is broader than desired steady-state scope. Once provider setup no longer needs account-wide project-creation privileges, replace it with the narrowest project/team-scoped token that still supports the required env/deployment operations and revoke the broad token only after the replacement passes hosted CI.

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
- **Gate B — authorization/provider ownership: PARTIAL PASS.** Supabase and the isolated Vercel project shell/control plane are established, but the Vercel Hobby/free commercial-use constraint leaves the compliant application-hosting path unresolved.
- **Gate C — live staging technical GO: IN PROGRESS / BLOCKED AT APPLICATION HOSTING.** Managed-database/bootstrap/runtime-image connectivity is green; there is intentionally no live Vercel deployment yet.
- **Gate D — production: NO-GO.** Production requires separate authorization after staging plus device/staff/data-cutover gates.

## Immediate next action

Do not redo Phase 7 discovery or reopen inherited green slices without evidence of a regression. Do not activate permanent runtime credentials while no compliant application deployment target exists.

The next decision is provider-level:

1. separately authorize a Vercel plan suitable for the commercial staging workload, which is a new spending authorization and must be cost-confirmed before any upgrade; or
2. keep the hard `$0` boundary and select/document an alternative host that permits the intended commercial staging workload while preserving the stateless Odoo HTTP + evented WebSocket + managed PostgreSQL/session/cron/security contract.

After that provider decision, resume through hosted automation:

1. generate and mask the `fares_app` runtime password, Odoo master secret and cron secret in the hosted runner;
2. atomically enable `LOGIN` for `fares_app` and inject only required server-side environment variables;
3. deploy the approved hosting topology;
4. fail closed by rotating/disabling any newly activated runtime credential if provider setup aborts before a usable deployment exists;
5. run the complete managed staging proof: seven addons, attachment/session continuity, cron, WebSocket replay, managed backup/destructive restore, monitoring/logs and EN/AR staging smoke.

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
17. Phase 8A free-tier staging execution — **in progress; Supabase + Vercel project shell/control plane green, deployment target policy unresolved**.
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