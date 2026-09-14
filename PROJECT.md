# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code, hosted CI and repository documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Public presentation is a separate Next.js surface consuming only the narrow Fares public API through private service binding.
- Vercel is the current staging application platform; durable truth lives in managed backing services.
- Supabase is the selected managed PostgreSQL target for Phase 8 staging.
- Live staging work is authorized only within the accepted free-tier spending boundary.
- Production remains separately gated and is not authorized by staging work.

## Current state — 2026-09-14

**Phases 0–7 repository/CI scope are COMPLETE / VERIFIED. Phase 8 planning is complete. Phase 8A live staging execution is IN PROGRESS. The managed restore defect and private Odoo database-routing defect are fixed and regression-proven. A stale rerun that recreated the managed schema after a clean reset was traced to an old live-deploy attempt and led to reset/deployment epoch binding, managed-writer hardening, fail-closed/manual recovery, and retirement of legacy DB writers. The current managed runtime is populated and the post-deploy runtime privilege seal is GREEN. The exact public bilingual staging smoke is currently RED on a content/synthetic-fixture assertion after reaching product-detail requests. Gate C is therefore not signed off. Production remains NO-GO.**

Current branch: `phase-8/commercial-staging-readiness`.

Authoritative Phase 8 docs:

- `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md` — current gate/evidence contract;
- `docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md` — live execution/runbook;
- `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md` — secret names/purpose/custody only; never values.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Current Phase 8 evidence

### Stable provider/runtime checkpoints

- Supabase/runtime proof: commit `b7a661bf70c2468b006bf971cba10172cf810e7d`, run `34787677724`, job `103806024323` — **SUCCESS**.
- Vercel control-plane proof: commit `884aedc9465122d25639ca24954f154dfa72dc70`, run `34788971298`, job `103809533700` — **SUCCESS**.
- Restore-boundary fix: commit `06c0af27dd49375b19d00a9276e2d225bf519c5b`, GREEN run `34841523130`, job `103967384659`.
- Private DB-routing regression: RED run `34879388824`; GREEN run `34880200932`, job `104097532186`.

### Managed reset and stale-rerun incident

Bounded reset authority:

- commit `7311c0a07ea020b967240ab44a57fb7be8c190a8`;
- run `34867078825`;
- job `104053486058`;
- result **SUCCESS**;
- proved `988 → 0` app-owned relations, `fares_app` NOLOGIN, zero sessions, provider session table/extensions preserved.

The later reappearance of `988` relations was traced to old live-deploy run `34842081247`, **attempt 2**, job `104054566511`, which started roughly 64 seconds after the clean reset and restored the schema from stale workflow state. This was not unexplained Supabase drift.

Current safety model binds managed reset/deployment to an explicit epoch and rejects stale writers. Important commits include:

- `eca0732213d3a02d94ea5c80d7442d511355d0a3` — reset epoch;
- `f66fbf08566f75c587eb3ad8eca55f0e157692b4` — corrected epoch verification;
- `2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a` — interrupted-reset recovery;
- `2a74e93b1828c16839ba7cede336caa4ca374306` — live deploy bound to reset epoch;
- `3d2520840ce1cf67757fc623b2ffb9b53c17a3fd` — manual/fail-closed DB recovery;
- `9978bbaf60344e74ec48dd8537ad3e09d4258293`, `937211fbc09927a6308df0f9804e5ba3843df454`, `5a5b0c38f89890eeff6d3a911e59bd1b38ea65a0` — legacy managed writers retired.

Current epoch observed post-deploy:

`34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`

### Runtime privilege seal

- implementation commit `63303846f3e373abb323bdc969dcc9e92c56311f`;
- run `34898140110`;
- job `104160591708`;
- result **SUCCESS**.

It observed a populated runtime (`988` app-owned public relations) and then proved:

- `fares_app` remains LOGIN-enabled for the live runtime;
- schema `public` CREATE privilege is revoked from `fares_app`;
- provider-owned `fares_http_session` remains present;
- `unaccent` and `pg_trgm` remain present;
- the current deployment epoch remains present.

A future schema writer must enter the source-controlled bounded mutation path instead of leaving runtime CREATE privileges permanently enabled.

### Current public staging blocker

Exact workflow: `.github/workflows/phase8-public-staging-smoke.yml`.

- run `34899200346`;
- job `104160775144`;
- target `https://fares-uniform.vercel.app`;
- result **FAILURE**.

The exact smoke checks English/Arabic home, catalog and synthetic product-detail content before checking browser-facing Odoo-route absence and unauthenticated cron `401`.

The run reached both product-detail requests and then exited 1 before the exposure-boundary checks. The exact failed `grep` was not emitted. Therefore the immediate blocker is to identify the content/synthetic-fixture mismatch and obtain a genuine RED→GREEN public-smoke proof. Do not claim the later boundary checks passed from this run because they were not reached.

## Phase 7 architecture that remains authoritative

Source-controlled topology is in `vercel.json`:

- `public_web`: Next.js service rooted at `apps/public-web/`;
- `odoo_http`: stateless Odoo container service;
- `odoo_websocket`: separate stateless evented Odoo service;
- `public_web` reaches Odoo HTTP through private `ODOO_BASE_URL`;
- private Next.js→Odoo calls select the managed DB using server-side `X-Odoo-Database`, derived from `ODOO_DB_NAME`;
- `/websocket` is the only public rewrite to the evented service;
- `/fares/internal/cron/run` is the only public rewrite to Odoo HTTP and requires the server-side cron bearer secret;
- broad Odoo backoffice and direct `/fu/public/**` exposure are prohibited.

Correctness-critical state is externalized from replaceable Vercel compute:

- operational data: PostgreSQL;
- attachments: database-backed `ir.attachment` storage;
- authenticated sessions: shared PostgreSQL-backed server-side session store;
- built-in Odoo cron threads: disabled;
- scheduled work: authenticated external trigger using native Odoo locking;
- realtime: separate evented runtime with reconnect/cursor replay.

The Phase 6 PostgreSQL+filestore package remains a verified fallback/reference topology.

## Current provider state

### Supabase

- project ref: `urqlxisivowkmsfisjek`;
- region: `eu-central-1`;
- database: provider-managed `postgres`;
- Session Pooler: `aws-0-eu-central-1.pooler.supabase.com:5432`;
- runtime role: `fares_app`;
- runtime pooler username: `fares_app.urqlxisivowkmsfisjek`;
- TLS: `sslmode=require` minimum;
- Supavisor transaction mode: prohibited;
- provider-owned session table: `public.fares_http_session`;
- provider-owned extensions: `unaccent`, `pg_trgm`.

### Vercel

- team id: `team_r09C6RLmb2acHapENECQIn9T`;
- team slug: `faresmohamed260-6733s-projects`;
- project: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- region: `fra1`;
- Fluid compute: OFF;
- canonical staging URL: `https://fares-uniform.vercel.app`;
- public staging Vercel SSO: deliberately disabled by authorization; application routing boundaries still apply.

## Secret-management rule

**WANDA is secret-management only.** It is not general provider/deployment/database authority. The no-value inventory is `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`. Secret values never belong in source, docs, chat handoffs or logs.

## Current gate state

- **Gate A — repository planning: PASS.**
- **Gate B — staging authorization/provider ownership: PASS.**
- **Gate C — live staging technical GO: IN PROGRESS / NO-GO FOR SIGN-OFF.** Current blocker is the exact public bilingual content/fixture smoke. Remaining continuity/realtime/recovery/monitoring/business-UAT proofs follow after that is GREEN.
- **Gate D — production: NO-GO.** Separate operational/device/staff/data-cutover and explicit production authorization are required.

## Immediate next action

Do not redo Phase 7 discovery or already-proven restore/private-DB-routing work without regression evidence.

1. Reverify branch HEAD and inspect intervening commits/runs.
2. Inspect run `34899200346` / job `104160775144` and the current smoke workflow to isolate the exact failed content assertion.
3. Inspect only the minimum live staging data needed to decide whether the expected synthetic fixtures exist and match the source-controlled contract.
4. If fixture repair is required, use only clearly synthetic staging records; never real business data.
5. Make the smallest correct fix and rerun the exact public smoke, preserving the RED run.
6. Require the final smoke to reach and pass browser-facing Odoo-route absence and unauthenticated cron `401` checks.
7. Then continue Gate C: enquiry/no-price-no-stock, attachment/session continuity, cron/native locking, WebSocket replay, backup/destructive restore, monitoring/alerts, and end-to-end business-flow UAT.
8. Update the Phase 8 docs with exact new SHAs/run/job IDs after authoritative proofs.

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
16. Phase 8 commercial staging readiness — planning complete.
17. Phase 8A free-tier staging execution — **in progress; guarded runtime deployed/privilege-sealed; exact public bilingual smoke currently RED on content/fixture assertion**.
18. Production — **NO-GO** until Gate C and separate operational/cutover gates pass.

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

Implemented, hosted-tested, visually reviewed, staged and production-ready are separate states. Every implementation/deployment claim must refer to exact remote evidence. Preserve meaningful RED runs and fix the actual failing boundary rather than weakening assertions. Synthetic proof data only until real-data migration is separately authorized. Do not use a local checkout, force-push, rewrite evidence, expose broad Odoo routes, load `fu_uat` in staging/production, use transaction pooling, use provider admin for routine Odoo, or spend money without explicit approval.