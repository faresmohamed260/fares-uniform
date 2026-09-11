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

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / OPERATIONAL VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE. Phase 2A — Retail checkout/offline: COMPLETE. Phase 2B — Preorder/balance/collection: COMPLETE. Phase 2C — Retail refunds/size exchanges: COMPLETE. Phase 3A — Preorder production queue/workflow: COMPLETE / AUTHORITATIVE PHASE 1–3A HOSTED GATE, REPEATABLE FOUR-ADDON UPGRADE AND EN/AR/RTL EVIDENCE PASS. Phase 3B — Business-client workflow: ACTIVE / POLICY-NEUTRAL ENQUIRY+SAMPLE SLICE VERIFIED; COMMERCIAL EXECUTION STILL GATED BY P3B-01 THROUGH P3B-04.**

Current branch: `phase-3b/business-client-orders`, stacked from Phase 3A closure head `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

The authoritative Phase 3B policy-neutral application/test SHA is **`79149f901d03c92fcd5b0ea432637660a2d102cf`**. Later Phase 3B documentation-only commits do not supersede that tested application authority.

Verified Phase 3B safe-slice hosted authority:
- workflow: `Phase 3B business clients`;
- run: `34608365252`;
- job: `103292327204`;
- result: **104 tests, 0 failures, 0 errors**;
- repeatable upgrade: `fu_core,fu_retail,fu_preorder,fu_production,fu_business` — success;
- artifact ID: `10267231815`;
- artifact: `phase3b-business-79149f901d03c92fcd5b0ea432637660a2d102cf`;
- digest: `sha256:be5e61300fd525ca192948ea5cb91874a0942f54fd53dcd4d2195cf68e8d7aae`;
- EN/AR/RTL desktop+narrow browser evidence and keyboard focus — pass.

The inherited Phase 3A application authority remains `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc` for the completed production phase; Phase 3B now has its own separately verified safe-slice authority above.

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

### Verified policy-neutral milestone

Application/test SHA **`79149f901d03c92fcd5b0ea432637660a2d102cf`** delivers and proves:
- business enquiry/design/meeting notes on native CRM;
- attributable sample preparation/sent/revision/approval/rejection workflow;
- Sales/BD assigned-record scope without broad contact-write authority;
- prospect phone/email can remain on the enquiry without silently mutating linked `res.partner` records;
- native-linked draft quotation only after approved sample, retry-safe;
- server-side business-order confirmation/state escalation denial while commercial policies remain open;
- relinking an ordinary quotation into the protected business path cannot bypass the guard;
- no first-slice payment, picking or stock effect;
- ordinary non-business sale confirmation remains unaffected;
- EN/AR/RTL desktop+narrow rendering, keyboard focus and no-horizontal-overflow checks pass;
- combined Phase 1–3B regressions and repeatable five-addon upgrade pass.

The verified first slice still must not implement or imply deposits, balance-due enforcement, shipment authorization, confirmed-order cancellation/refund/credit or an invented payment term.

Open commercial decisions remain:
- **P3B-01:** remaining-balance due point;
- **P3B-02:** partial-shipment permission/payment coupling;
- **P3B-03:** deposit amount/default/minimum;
- **P3B-04:** post-approval/deposit edits/cancellation and deposit treatment.

The policy-neutral milestone is verified, but full Phase 3B remains open until these policy gates are explicitly decided or explicitly excluded with accepted fail-closed behavior and the resulting commercial path is hosted-tested.

## Roadmap

1. Phase 0 discovery — complete.
2. Phase 0A hosted Odoo proof — pass.
3. Phase 0B architecture/data/UI foundation — complete.
4. Phase 1 products/stock/access — complete.
5. Phase 2A retail checkout/offline — complete.
6. Phase 2B preorder/balance/collection — complete.
7. Phase 2C consumer retail refunds/size exchanges — complete.
8. Phase 3A preorder production automation/workflow — complete.
9. Phase 3B business-client enquiry/sample/order/deposit/shipment/balance — **active; policy-neutral safe slice verified, commercial policy gates open**.
10. Public catalog/enquiry and operational reports.
11. Integrated UAT, onboarding rehearsal and explicitly authorized deployment planning.

## Immediate next action

1. Keep stacked branches/PRs unmerged until explicit authorization.
2. Treat `79149f901d03c92fcd5b0ea432637660a2d102cf` as the Phase 3B safe-slice application authority despite later docs-only commits.
3. Preserve the verified enquiry/sample/draft-quotation behavior and role boundaries while Phase 3B remains active.
4. Resolve P3B-01 through P3B-04 explicitly before enabling commercial confirmation, deposit/payment enforcement, shipment authorization or confirmed-order cancellation behavior.
5. Once policies are accepted, implement only the resulting bounded commercial path using native Odoo sale/payment/stock truth and add direct bypass/idempotency/security regressions.
6. Run a new exact-head combined Phase 1–3B hosted gate and repeatable five-addon upgrade for the policy-enabled application SHA before full Phase 3B closure.
7. Keep documentation-only lineage separate from tested application authority.
8. Do not infer or invent open commercial policies from the historical high-level workflow.
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
