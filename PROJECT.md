# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code and documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Public presentation is a separate Next.js surface consuming only the narrow Fares public API.
- Vercel is the client-selected deployment-platform direction; durable truth lives in managed backing services.
- Supabase is the preferred managed PostgreSQL target for a future authorized commercial staging deployment.
- No live staging or production deployment is authorized yet.

## Current state — 2026-09-13

**Phases 0 through 7 repository/CI scope are COMPLETE / VERIFIED.**

Phase 7 Vercel stateless deployment adaptation is complete at implementation authority `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`. The final runtime-sensitive checkpoint is `24850acc029e0e7bbef898d6598d0d8b3f7ce733`. Documentation commits after `01ce26d...` are closure lineage only and do not replace implementation authority.

Current branch: `phase-7/vercel-deployment-adaptation`.

Authoritative business-application/test SHA remains Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Authoritative Phase 6 provider-neutral deployment-package SHA remains `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA remains `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Phase 7 final architecture

Source-controlled Vercel topology is in `vercel.json`:

- `public_web`: Next.js service rooted at `apps/public-web/`;
- `odoo_http`: stateless Odoo container service from `Dockerfile.vercel`;
- `odoo_websocket`: stateless evented Odoo container service from the same image;
- `public_web` reaches `odoo_http` through the private `ODOO_BASE_URL` service binding;
- `/websocket` is the only public rewrite to the evented service;
- `/fares/internal/cron/run` is the only public rewrite to Odoo HTTP and is protected by the server-side cron bearer secret;
- catch-all public traffic goes to `public_web`;
- broad Odoo backoffice and direct `/fu/public/**` exposure are not published by the Vercel mapping.

Vercel project environment variables are project-wide. The HTTP/WebSocket runtime distinction therefore uses the service-local binding marker `FARES_ODOO_HTTP_INTERNAL_URL` plus `deploy/vercel/runtime-mode.sh`, rather than a project-wide `ODOO_RUNTIME_MODE`. Explicit runtime-mode overrides remain available for hosted CI proof.

Correctness-critical state is externalized from Vercel compute:

- Odoo/Fares operational data: PostgreSQL;
- attachments: native database-backed `ir.attachment` storage;
- authenticated sessions: shared PostgreSQL-backed server-side session store;
- built-in Odoo cron threads: disabled;
- scheduled work: authenticated external trigger using native Odoo locking;
- realtime: separate evented runtime with shared-session/cursor reconnect and replay semantics;
- Vercel-specific recovery: database-backed application/attachment/session state plus exact Fares/Odoo/config authority.

The Phase 6 PostgreSQL+filestore package remains preserved as the verified fallback/reference topology.

## Phase 7 final evidence

### Runtime checkpoint — `24850acc029e0e7bbef898d6598d0d8b3f7ce733`

All runtime-sensitive hosted workflows passed after the final runtime-mode/service changes:

- state/session/recovery — run `34769858562`, job `103757345079`, artifact `10322245429`, digest `sha256:00da92b64a39a567a3383e02b6c443b891946bb69e51a494fa678f239003f22f`;
- external cron — run `34769858603`, job `103757345002`, artifact `10321293325`, digest `sha256:01593409ac06c49210bd6fa8b66de3de3cbdacca09f4e61727a5d67496bdc9bb`;
- WebSocket continuity — run `34769858556`, job `103757344998`, artifact `10321447830`, digest `sha256:011fe859cde5e9f1bf6014fd629162054f70070a22fc4a9687638659d8d566d5`;
- Vercel project configuration — run `34769858553` — success.

These prove no durable Odoo volume, DB-backed attachments, shared sessions, runtime replacement, database-only restore, authenticated exactly-once cron execution, and WebSocket destroy/reconnect/replay continuity after the final runtime changes.

### Final mapping/public regression — `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`

Workflow `Phase 7 Vercel project configuration`, run `34770228476` — success:

- `project-config-proof` job `103758364688`: live Vercel schema validation, exact service binding/exposure assertions, runtime-mode resolution and application-source authority pass;
- artifact `10322011069`, digest `sha256:6062aefe56ce0fb8fd633033b48f075e9cfbfe67eefb6626c09e53b91da72845`;
- `public-web-regression` job `103758364506`: locked dependency install, typecheck, production build and Playwright gate pass;
- artifact `10321902044`, digest `sha256:d2ac4b47173c334f1a61a55040d3b8d1a3056216664688e04b23a3b3ec7e9045`.

The only change from runtime checkpoint `24850acc...` to final implementation `01ce26d...` is the project-config CI workflow, so no runtime source changed after the runtime re-proof.

Full RED/GREEN chronology is authoritative in `docs/validation/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`.

## Supabase deployment rule

Supabase is the preferred managed PostgreSQL target when commercial staging is explicitly authorized. Odoo must use a PostgreSQL connection mode that preserves session semantics required by `LISTEN/NOTIFY`:

- direct PostgreSQL or Supavisor **session mode**: acceptable;
- Supavisor **transaction mode**: prohibited for Odoo;
- TLS: `sslmode=require` at minimum for live managed connectivity;
- preserve an isolated `fares` application database and least-privileged `fares_app` role where practical;
- do not grant superuser/createdb/createrole merely because PostgreSQL is managed.

No real Supabase database/resource was created or mutated by Phase 7.

## Verified inherited application authority

Phase 5A workflow `Phase 5A Arabic polish`, run `34700625051`:

- Odoo/UAT job `103571619120` — success;
- **149 tests, 0 failures, 0 errors**;
- repeatable seven-production-addon upgrade — success;
- public-web job `103571619062` — success;
- public typecheck/build and **8/8 Playwright** — success;
- open release-candidate P0/P1/P2 — **0 / 0 / 0**.

Phase 7 exact-head source-authority checks preserve `addons` and `apps/public-web` relative to that application authority except for deployment/CI-only source outside those application paths.

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
15. Phase 7 Vercel stateless deployment adaptation — **complete / verified at repository/CI level**.
16. Next live stage — **not yet authorized**: commercial Vercel staging + managed PostgreSQL/Supabase rehearsal, followed later by real device/operations/cutover proof and production only under separate authorization.

## Immediate next action

Do not redo Phase 7 discovery or reopen its green CI slices without evidence of a regression.

The next session should:

1. verify the live branch and documentation HEAD before any write;
2. read `AGENTS.md`, this file, `docs/README.md`, `docs/DECISIONS.md`, the Phase 7 contract/validation and deployment-readiness docs;
3. confirm Phase 7 closure docs are internally consistent and treat `01ce26d...` as final Phase 7 implementation authority, not later documentation commits;
4. prepare the next bounded stage around **commercial staging readiness/authorization**: actual Vercel plan/project ownership, Supabase project/database/region, secret ownership, access model, backup retention/RPO/RTO and monitoring;
5. do **not** create or mutate Vercel/Supabase resources, upgrade plans, set production secrets/domains/DNS or use real data unless the client explicitly authorizes that live stage;
6. if live staging is later authorized, use Supabase direct/session-mode PostgreSQL connectivity and immediately prove the actual managed connection, migrations/bootstrap, session/attachment continuity, cron/WebSocket behavior, backups and access boundaries before considering production.

Production remains **NO-GO**.

## Later explicit business-policy decisions

Still deferred unless their affected work starts:
- B2B deposit refund/forfeiture and credit-note/refund policy;
- post-confirmation business-order amendments;
- any future partial shipment or customer-credit terms;
- tax/legal revenue recognition/invoicing treatment;
- report exports/scheduled delivery;
- cards/wallets and bank API automation;
- automated customer notifications;
- raw-material/WIP inventory.

## Evidence policy

Implemented, hosted-tested, visually reviewed, staged and deployed are separate states. Every implementation/deployment claim must refer to exact remote evidence. Synthetic proof data only until real-data migration is separately authorized; credentials and private business records never belong in this public repository.