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

**Phases 0 through 7 repository/CI scope are COMPLETE / VERIFIED. Phase 8 planning is complete. Phase 8A live staging execution is IN PROGRESS. The isolated Supabase target, Supavisor Session Pooler contract, Vercel control plane and isolated `fares-uniform` project are established. The first current live-deployment workflow candidate reached exact-image build, local seven-addon initialization, restore-set creation and temporary least-privileged runtime-role activation, then failed while restoring the initialized schema into the clean managed Supabase target. Vercel runtime environment injection and deployment were not reached. The fail-closed guard subsequently disabled the managed runtime role. Production remains NO-GO.**

Current branch: `phase-8/commercial-staging-readiness`.

Phase 8 planning contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Active Phase 8A execution/status contract: `docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md`.

Staging secret inventory: `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.

### Current live execution evidence

- managed-database/runtime contract checkpoint: `b7a661bf70c2468b006bf971cba10172cf810e7d`;
- Supabase proof: workflow run `34787677724`, job `103806024323` — **SUCCESS**;
- Vercel control-plane checkpoint: `884aedc9465122d25639ca24954f154dfa72dc70`;
- Vercel control-plane proof: workflow run `34788971298`, job `103809533700` — **SUCCESS**;
- current live-deployment candidate: `a75131b7c8ad3060ba2ab4e805916dc1d0ad4ff2`;
- current live-deployment workflow run: `34821582384`;
- deploy job `103904147677` — **FAILURE** at `Restore initialized schema into clean Supabase target`;
- fail-closed guard job `103905391955` — **SUCCESS**, including `Disable managed runtime role after unsuccessful deployment`.

Run `34821582384` proved, before the restore failure:

- the deployment boundary started clean and `fares_app` started `NOLOGIN`;
- fresh activation secrets were generated and masked in hosted CI;
- the exact database image and exact Vercel Odoo image built successfully;
- the exact initialized application database built locally and the seven production addons installed/upgraded with `fu_uat` absent;
- the filtered restore set was created successfully;
- the managed `fares_app` role was activated only for the bounded attempt.

The same run did **not** prove Vercel environment injection, a Vercel deployment, a READY runtime or staging smoke because those steps were skipped after the managed restore failed. A direct Vercel project check after the run still showed zero deployments. The failed restore may have partially changed the managed `public` schema, so the next session must inspect/clean the managed target before retrying rather than assuming it is pristine.

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

## Phase 8A live provider state

### Supabase

The dedicated Fares Uniform project is isolated from unrelated projects.

- project: `Fares Uniform`;
- project ref: `urqlxisivowkmsfisjek`;
- region: `eu-central-1`;
- Session Pooler: `aws-0-eu-central-1.pooler.supabase.com:5432`;
- application database: provider-managed `postgres` database in the dedicated project;
- routine runtime role: `fares_app`;
- runtime pooler username: `fares_app.urqlxisivowkmsfisjek`;
- live TLS rule: `sslmode=require` minimum;
- Supavisor transaction mode remains prohibited for Odoo.

`deploy/supabase/bootstrap.sql` remains the idempotent managed-database bootstrap authority. The routine role must remain non-superuser/non-createdb/non-createrole and is enabled only inside a bounded activation attempt. The failed run's guard successfully disabled the role after the restore error.

The managed target was verified clean at the start of run `34821582384`. Because `pg_restore` can apply objects before a later error, its post-failure schema state is **not assumed clean** and must be inspected before the next attempt.

### Vercel

Authorized isolated project:

- name: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- team id: `team_r09C6RLmb2acHapENECQIn9T`.

Repository secret `VERCEL_TOKEN` is proven against the exact authorized team. Exact team/project assertions remain mandatory because the current control-plane token is broader than desired steady-state scope.

The current live-deployment attempt never reached Vercel environment injection or deployment. A direct Vercel project check after run `34821582384` returned **0 deployments**. Existing unrelated Vercel projects remain out of scope and must not be mutated.

## Phase 8A provider/runtime corrections already completed

Live provider work exposed and corrected a real Supavisor compatibility issue: the original Phase 7 entrypoint allowed only a bare PostgreSQL identifier for `ODOO_DB_USER`, while Supavisor Session Pooler requires a custom-role connection username with one project-ref suffix.

Current correction:

- `deploy/vercel/validation.sh` keeps database identifiers strict while allowing exactly one Supavisor `.<project-ref>` suffix for the connection username;
- unsafe separators, arbitrary DSN syntax and multiple suffixes remain rejected;
- `deploy/vercel/entrypoint.sh` uses the connection-user validator;
- `Dockerfile.vercel` ships the validation helper into the exact non-root runtime image.

Authoritative run `34787677724` / job `103806024323` proves real Session Pooler connectivity and the exact Vercel-target image with the dotted username form.

The current live-deployment workflow also now builds an initialized application database, creates a filtered restore set, activates the managed role only for the bounded attempt and has a separate fail-closed guard that disables the runtime role when deployment does not complete.

## Phase 8A gate state

- **Gate A — repository planning: PASS.**
- **Gate B — authorization/provider ownership: PASS.** Isolated free-tier Supabase and Vercel resources plus the required control-plane credentials are established for this staging rehearsal.
- **Gate C — live staging technical GO: IN PROGRESS / RED AT MANAGED SCHEMA RESTORE.** The current workflow fails at the managed `pg_restore` boundary before Vercel environment injection/deployment. This is now the immediate technical blocker.
- **Gate D — production: NO-GO.** Production requires separate authorization after staging plus device/staff/data-cutover gates.

## Immediate next action

Do not redo Phase 7 discovery or reopen inherited green slices without regression evidence. Do not assume the managed Supabase schema is clean after the failed restore.

Continue from run `34821582384` and candidate `a75131b7c8ad3060ba2ab4e805916dc1d0ad4ff2`:

1. inspect the exact `pg_restore` failure from job `103904147677` and the current managed Supabase schema/ownership state;
2. identify the specific object/ownership/ACL/extension conflict instead of retrying the same restore blindly;
3. restore the managed target to the workflow's defined clean boundary without weakening least privilege or deleting unrelated provider-managed objects;
4. fix the source-controlled restore path and add/adjust hosted assertions that reproduce the failure boundary;
5. rerun hosted CI from an exact new candidate;
6. once managed restore and repeat seven-addon upgrade are green, continue to Vercel environment injection, deployment, READY/minimal-exposure proof and the remaining Gate C attachment/session/cron/WebSocket/backup/monitoring/EN-AR smoke evidence.

No paid upgrade is authorized. No production deployment is authorized. No real business data is authorized.

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
17. Phase 8A free-tier staging execution — **in progress; provider/control planes established, current live-deployment workflow RED at managed schema restore before Vercel deployment**.
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

Implemented, hosted-tested, visually reviewed, staged and deployed are separate states. Every implementation/deployment claim must refer to exact remote evidence. Synthetic proof data only until real-data migration is separately authorized; credentials and private business records never belong in this public repository. Meaningful RED evidence is retained and fixed at the actual failing boundary rather than hidden by weakening assertions.