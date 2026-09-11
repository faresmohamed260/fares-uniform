# Fares Uniform project

## Confirmed brief

- Product: ERP for the client's father's small clothing factory.
- Client: Fares. The assistant gathers requirements and develops the system.
- Project title: Fares Uniform.
- Public repository: https://github.com/faresmohamed260/fares-uniform
- Source of truth: repository code and docs; no reliance on session memory or local project files.
- Execution: remote only through GitHub/hosted CI.
- Initial public-web deployment target: Vercel; Odoo requires a separate compatible persistent host.
- Available stack services: Supabase and Cloudflare, neither selected as an operational mirror by default.

## Current state — 2026-09-11

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / OPERATIONAL VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE. Phase 2A — Retail checkout/offline: COMPLETE. Phase 2B — Preorder/balance/collection: COMPLETE. Phase 2C — Retail refunds/size exchanges: COMPLETE. Phase 3A — Preorder production queue/workflow: COMPLETE / AUTHORITATIVE PHASE 1–3A HOSTED GATE, REPEATABLE FOUR-ADDON UPGRADE AND EN/AR/RTL EVIDENCE PASS. Phase 3B — Business-client workflow: ACTIVE / POLICY-NEUTRAL ENQUIRY+SAMPLE SLICE AUTHORIZED; COMMERCIAL EXECUTION STILL GATED BY P3B-01 THROUGH P3B-04.**

Current branch: `phase-3b/business-client-orders`, stacked from Phase 3A closure head `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

The authoritative Phase 3A application/test SHA remains **`ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`**. Phase 3B does not inherit that green status; its own application SHA must pass a new combined hosted gate.

Final Phase 3A hosted authority:
- workflow: `Phase 3A preorder production`;
- run: `34601274874`;
- job: `103268897396`;
- result: 93 tests, 0 failures, 0 errors;
- repeatable upgrade: `fu_core,fu_retail,fu_preorder,fu_production` — success;
- artifact ID: `10264163466`;
- artifact: `phase3a-production-ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`;
- digest: `sha256:0e94e65beaa25c92c27337c200186dd765c2a5f1c1ee9b5735130a0fc60770d5`.

No merge, production deployment or real-data migration occurred.

## Product and architecture direction

Odoo Community is the operational/domain core. Fares-owned addons extend Odoo rather than duplicating its CRM, sales, payment or stock ledgers. Dense operational screens follow the accepted practical ERP direction; expressive 3D/physics/morphing remains for public/product-showcase surfaces where useful.

Confirmed product/stock rules remain:
- school/client-specific designs are distinct stocked products when units are not interchangeable;
- no tracked factory-finished stock location is needed initially;
- size systems vary by garment/product family and remain configurable;
- permanent sequential variant codes use `FU-000001` style;
- one retail store and one storage location are currently confirmed;
- one checkout device per store is the current operating envelope;
- Cash and InstaPay are current payment methods; cards/wallets are future work;
- public catalog exposes neither price nor stock;
- numeric volumes, launch date and service budget remain unknown and must not be invented.

## Completed implementation phases

### Phase 1 — products, finished stock and access
Authoritative tested application: `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`. See `docs/validation/PHASE_1_PRODUCTS_STOCK.md`.

### Phase 2A — ordinary retail checkout/offline
Complete under `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md` and `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`.

### Phase 2B — preorder, balance and partial collection
Authoritative application/test SHA `af64b858cf6f2be6a143bb19e836721abc216221`. See `docs/validation/PHASE_2B_PREORDER_COLLECTION.md`.

### Phase 2C — retail refunds and size exchanges
Authoritative application/test SHA `62369e62dd1e5d2505e089c6a5ede296a24bcb3b`; run `34596450064`, job `103253225096`, 82/82 tests plus repeatable three-addon upgrade. See `docs/validation/PHASE_2C_REFUNDS_EXCHANGES.md`.

### Phase 3A — preorder production queue/workflow

Authoritative application/test SHA **`ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`**.

Delivered:
- exact product-variant/size demand aggregation;
- configurable quantity threshold with no invented positive default;
- configurable lead time with accepted default seven days;
- source-linked queued production tasks with bounded/idempotent coverage;
- explicit `queued -> in_production -> finished` transitions;
- Production Manager/Owner server authorization and audit;
- no stock move/quant/factory location created by factory `Finished`;
- Phase 2B Retail Store receipt/allocation remains authoritative for Ready for collection;
- EN/AR/RTL desktop/narrow browser evidence and keyboard focus.

## Active Phase 3B — business-client workflow

Phase contract: `docs/phases/PHASE_3B_BUSINESS_CLIENT_ORDERS.md`.

Architecture: `docs/architecture/PHASE_3B_BUSINESS_ORDER_MODEL.md`.

Policy ledger: `docs/requirements/PHASE_3B_POLICY_DECISIONS.md`.

Validation chronology: `docs/validation/PHASE_3B_BUSINESS_CLIENT_ORDERS.md`.

Pinned-Odoo ownership decision:
- native `crm.lead` owns enquiry/company/contact/meeting/notes;
- native `sale.order` through `sale_crm` owns the later commercial order identity;
- native payments/accounting remain financial truth;
- native stock pickings/moves remain shipment truth;
- Fares code adds only design/sample workflow, role/security boundaries and guarded transitions.

The policy-neutral first slice may implement:
- business enquiry/design/meeting notes;
- sample workflow and attributable approval/rejection;
- Sales/BD own/assigned-record scope;
- native-linked draft quotation after sample approval;
- server-side confirmation guard while commercial policies remain open;
- EN/AR/RTL UI plus combined hosted regressions/upgrade.

The first slice must not implement or imply deposits, balance-due enforcement, shipment authorization, confirmed-order cancellation/refund/credit or an invented payment term.

Open commercial decisions remain:
- **P3B-01:** remaining-balance due point;
- **P3B-02:** partial-shipment permission/payment coupling;
- **P3B-03:** deposit amount/default/minimum;
- **P3B-04:** post-approval/deposit edits/cancellation and deposit treatment.

A green first-slice gate will be a verified Phase 3B milestone, not full Phase 3B closure.

## Roadmap

1. Phase 0 discovery — complete.
2. Phase 0A hosted Odoo proof — pass.
3. Phase 0B architecture/data/UI foundation — complete.
4. Phase 1 products/stock/access — complete.
5. Phase 2A retail checkout/offline — complete.
6. Phase 2B preorder/balance/collection — complete.
7. Phase 2C consumer retail refunds/size exchanges — complete.
8. Phase 3A preorder production automation/workflow — complete.
9. Phase 3B business-client enquiry/sample/order/deposit/shipment/balance — **active; safe slice first**.
10. Public catalog/enquiry and operational reports.
11. Integrated UAT, onboarding rehearsal and explicitly authorized deployment planning.

## Immediate next action

1. Keep stacked branches/PRs unmerged until explicit authorization.
2. Treat `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc` as Phase 3A application authority; do not promote Phase 3B docs to application proof.
3. Implement `fu_business` only inside the committed policy-neutral first-slice boundary.
4. Prove Sales/BD scope, sample transition audit, draft-quotation gating and direct confirmation denial server-side.
5. Add representative EN/AR/RTL desktop/narrow browser evidence.
6. Run an exact-head combined Phase 1–3B-safe-slice hosted gate and repeatable five-addon upgrade.
7. Record red/green chronology honestly and preserve tested application SHA separately from docs-only commits.
8. Do not implement P3B-01 through P3B-04 by assumption.
9. No merge, deployment or real-data migration without explicit client authorization.

## Later explicit decisions

Resolve only when their affected work starts:
- Phase 3B P3B-01 through P3B-04;
- B2B return/credit policy;
- report definitions, stock-warning settings and deposit-vs-sale treatment;
- tax/legal receipt/business identity details when legally relevant;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
