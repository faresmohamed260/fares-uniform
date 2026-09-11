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

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / OPERATIONAL VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE. Phase 2A — Retail checkout/offline: COMPLETE. Phase 2B — Preorder/balance/collection: COMPLETE. Phase 2C — Retail refunds/size exchanges: COMPLETE. Phase 3A — Preorder production queue/workflow: COMPLETE. Phase 3B — Business-client enquiry/sample/order/deposit/balance/shipment: COMPLETE / AUTHORITATIVE PHASE 1–3B HOSTED GATE, REPEATABLE FIVE-ADDON UPGRADE AND EN/AR/RTL EVIDENCE PASS.**

Current branch: `phase-3b/business-client-orders`, stacked from Phase 3A closure head `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

Authoritative Phase 3B application/test SHA: **`d6efa76a99c0732423b354d2d9f787f6ccbdebec`**. Later documentation-only closure commits do not supersede that tested application authority.

Final Phase 3B hosted authority:
- workflow: `Phase 3B business clients`;
- run: `34634425338`;
- job: `103378750321`;
- result: **118 tests, 0 failures, 0 errors**;
- repeatable upgrade: `fu_core,fu_retail,fu_preorder,fu_production,fu_business` — success;
- artifact ID: `10277960160`;
- artifact: `phase3b-business-d6efa76a99c0732423b354d2d9f787f6ccbdebec`;
- digest: `sha256:109ce8fd952f8389caafaf727a75dd3a7b0aed033d1fd5cccb5c661f862281da`;
- EN/AR/RTL business enquiry, draft editor, payment and complete-delivery desktop+narrow browser evidence — pass.

No merge, production deployment or real-data migration occurred.

## Product and architecture direction

Odoo Community is the operational/domain core. Fares-owned addons extend Odoo rather than duplicating its product, POS, CRM, sales, payment or stock ledgers. Dense operational screens follow the accepted practical ERP direction; expressive 3D/physics/morphing remains for public/product-showcase surfaces where useful.

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

Complete under `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md` and `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`. Offline Cash checkout and controlled synchronization remain mandatory; InstaPay remains connectivity/confirmation bounded.

### Phase 2B — preorder, balance and partial collection

Authoritative application/test SHA `af64b858cf6f2be6a143bb19e836721abc216221`. See `docs/validation/PHASE_2B_PREORDER_COLLECTION.md`.

### Phase 2C — retail refunds and size exchanges

Authoritative application/test SHA `62369e62dd1e5d2505e089c6a5ede296a24bcb3b`; run `34596450064`, job `103253225096`, 82/82 tests plus repeatable three-addon upgrade. See `docs/validation/PHASE_2C_REFUNDS_EXCHANGES.md`.

### Phase 3A — preorder production queue/workflow

Authoritative application/test SHA `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`; run `34601274874`, job `103268897396`, 93 tests plus repeatable four-addon upgrade.

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

### Phase 3B — business-client workflow

Phase contract: `docs/phases/PHASE_3B_BUSINESS_CLIENT_ORDERS.md`.

Architecture: `docs/architecture/PHASE_3B_BUSINESS_ORDER_MODEL.md`.

Accepted policy ledger: `docs/requirements/PHASE_3B_POLICY_DECISIONS.md`.

Final validation: `docs/validation/PHASE_3B_BUSINESS_CLIENT_ORDERS.md`.

Pinned-Odoo ownership:
- native `crm.lead` owns enquiry/company/contact/meeting/design context;
- native `sale.order` / `sale.order.line` owns commercial order identity and amounts;
- native posted payment/accounting records own financial truth;
- native `stock.picking` / `stock.move` owns physical shipment truth;
- Fares code adds bounded sample/commercial/payment/release workflows, audit and security only.

Accepted commercial rules now implemented and verified:
- positive negotiated deposit required before confirmation, with no invented deposit percentage;
- Cash and positively confirmed InstaPay business payments are bounded and retry-safe;
- overpayment and posted-payment rewrite/cancellation fail closed;
- after a posted payment, Sales/BD commercial edits require Owner/Admin approval while still draft;
- paid business work cannot be cancelled until a later B2B refund/credit policy exists;
- the entire remaining balance must be settled before goods leave Fares custody;
- partial customer shipments are disabled in the MVP;
- all ordered quantities must be physically available in the single customer delivery before controlled release;
- shipment roles remain assigned-location scoped; Sales/BD cannot release stock;
- ordinary non-business sale/payment/stock paths and all earlier phases remain unaffected.

The final test-only correction at `d6efa76a...` fixed a synthetic fixture misunderstanding: the Fares `opening` stock operation is an absolute count, not an additive receipt. The three-unit shipment test now sets the final opening count to 3. Shipment logic was not weakened.

## Roadmap

1. Phase 0 discovery — complete.
2. Phase 0A hosted Odoo proof — pass.
3. Phase 0B architecture/data/UI foundation — complete.
4. Phase 1 products/stock/access — complete.
5. Phase 2A retail checkout/offline — complete.
6. Phase 2B preorder/balance/collection — complete.
7. Phase 2C consumer retail refunds/size exchanges — complete.
8. Phase 3A preorder production automation/workflow — complete.
9. Phase 3B business-client enquiry/sample/order/deposit/shipment/balance — **complete**.
10. Public catalog/enquiry and operational reports — **next bounded product work**.
11. Integrated UAT, onboarding rehearsal and explicitly authorized deployment planning.

## Immediate next action

1. Keep stacked branches/PRs unmerged until explicit authorization.
2. Treat `d6efa76a99c0732423b354d2d9f787f6ccbdebec` as the Phase 3B application authority despite later docs-only commits.
3. Preserve the completed Phase 1–3B behavior and role boundaries while starting the next roadmap slice.
4. Before implementation, split the next roadmap item into bounded contracts: public catalog/enquiry and operational reports should not be conflated if their architecture/security/evidence needs differ.
5. Reuse the existing public-catalog decisions: no public price or stock, website form + WhatsApp + phone enquiry routes, no automatic messaging implied.
6. Reuse the accepted MVP report categories—daily sales, Cash/InstaPay totals, low stock, upcoming/overdue orders and customer balances—but define exact report formulas, date semantics, role visibility and treatment of deposits/refunds before implementation where still open.
7. Continue exact-head hosted regression gates and preserve tested application SHA vs docs-only closure lineage.
8. No merge, deployment or real-data migration without explicit client authorization.

## Later explicit decisions

Resolve only when their affected work starts:
- B2B deposit refund/forfeiture and credit-note/refund policy;
- post-confirmation business-order amendment workflow;
- any future partial-shipment or customer-credit terms;
- report formulas/filters, stock-warning settings and deposit-vs-sale treatment;
- tax/legal receipt/business identity details when legally relevant;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.