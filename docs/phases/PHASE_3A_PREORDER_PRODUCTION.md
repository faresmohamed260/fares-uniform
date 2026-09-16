# Phase 3A — Preorder production queue and workflow

Status: **COMPLETE — AUTHORITATIVE PHASE 1–3A HOSTED GATE PASS; REPEATABLE UPGRADE PASS; EN/AR/RTL EVIDENCE REVIEWED, 2026-09-11.**

Branch: `phase-3a/preorder-production-queue`.

Starting documentation lineage: Phase 2C closure head `06ac7787392bbd63081fe22f23dcbbb603f1b398`.

Authoritative Phase 3A **application/test** SHA: `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`.

No merge, deployment or real-data migration was authorized or performed.

## Why this was a separate production slice

The accepted MVP places production automation and business-client order tracking after the completed retail phases. Phase 3A covers the confirmed school/preorder production workflow only, so unresolved B2B final-payment and partial-shipment policy is not invented inside production work.

Business-client order tracking remains a separate Phase 3B contract.

## Confirmed rules preserved

- School/client designs remain distinct products when units are not interchangeable.
- Size is represented by product variant; production demand remains separated by exact variant/size.
- Preorders are the source demand for unavailable school-uniform stock.
- Every preorder has a promised pickup date.
- Demand enters the production queue when enough orders accumulate **or** pickup is close.
- Quantity threshold is configurable; no positive default was accepted, so `0` means the quantity trigger is inactive.
- Pickup lead-time trigger is configurable and defaults to the accepted **seven days**.
- Automatic triggering creates a **queued** production task; it does not claim work already started.
- Production Manager/Owner explicitly mark **In production** when work begins and **Finished** at factory completion.
- Factory `Finished` is workflow state only, not inventory custody.
- `Ready for collection` still means goods have physically reached the Retail Store and been allocated through the Phase 2B stock/readiness path.
- Raw materials, trims and WIP stock accounting remain outside the initial inventory boundary.
- Odoo stock moves/quants remain finished-stock truth; production workflow does not create a competing ledger.
- Cashier, Inventory Staff and Sales/BD do not gain production mutation merely through related product/preorder visibility.
- English/Arabic/RTL and the approved practical operational ERP direction continue to apply.

## Delivered behavior

The `fu_production` addon provides a bounded production workflow and audit layer linked to authoritative preorder/product/stock records.

It delivers:

1. unmet production demand derived from authoritative preorder lines;
2. exact product-variant/size aggregation;
3. quantity-threshold triggering only after an explicit positive threshold is configured;
4. seven-day default deadline triggering with configurable lead time;
5. source-linked task lines recording the preorder quantities covered by each task;
6. exclusion of quantities already Ready for collection, collected, or already covered by non-cancelled production work;
7. transaction locking and cumulative-coverage guards preventing duplicate/over-covered demand;
8. explicit `queued -> in_production -> finished` workflow with actor/timestamp attribution;
9. queued cancellation with a required reason and later demand re-evaluation without cancelling/refunding the preorder;
10. Production Manager/Owner-only mutation and configuration boundaries enforced server-side;
11. no production stock move, quant or factory-finished location created by workflow completion;
12. bilingual native-Odoo production queue/settings UI with desktop/narrow, keyboard-focus and Arabic/RTL proof.

## Ownership boundary

### Why Phase 3A does not use native `mrp.production` as its authority

Pinned Odoo Community `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` shows that native manufacturing orders own component/finished stock locations and raw/finished stock moves. Confirmed/done manufacturing semantics are therefore coupled to material reservation and stock posting.

That conflicts with the accepted Fares MVP boundary where raw/WIP accounting is excluded and factory `Finished` is not inventory custody.

Phase 3A therefore uses a bounded Fares production workflow model for demand/task state while retaining Odoo stock records as the only finished-stock custody truth. The detailed assessment is in `docs/architecture/PHASE_3A_PRODUCTION_MODEL.md`.

## Demand and trigger semantics

For each preorder line, production demand is the ordered quantity that is not already collected, not already physically ready/allocated at the Retail Store, and not already covered by a non-cancelled production task.

Demand is ignored for non-preorder lines, display/note lines, and non-storable/non-sale products. It is aggregated by exact `product.product` variant.

A variant qualifies when uncovered demand is positive and either:

- **Quantity trigger:** configured threshold is positive and aggregate uncovered quantity reaches it; or
- **Deadline trigger:** at least one uncovered source line has pickup date on or before evaluation time plus configured lead days.

Configuration remains:

- `quantity_threshold = 0` by default — no guessed positive threshold;
- `lead_time_days = 7` by default;
- only Owner/Admin or Production Manager may change production configuration.

## Replay, coverage and state invariants

- Repeated evaluation cannot duplicate already-covered source quantity.
- A source preorder line may be covered across multiple tasks over time, but cumulative non-cancelled task quantity cannot exceed currently eligible uncovered demand.
- Cancelled queued work releases its coverage for later evaluation while preserving its audit record.
- A queued task means only that demand has been scheduled.
- `In production` must be explicitly started by an authorized production operator.
- `Finished` must be explicitly recorded from `In production` and remains workflow-only.
- `Ready for collection` is never inferred from production task completion.

## Role boundary

### Production Manager

May:
- view production queue/source-demand context;
- run queue evaluation;
- start queued tasks;
- mark in-production tasks finished;
- cancel queued tasks under the bounded workflow;
- change quantity/lead-time settings;
- view task audit information.

Cannot by Phase 3A authority alone:
- mutate preorder payments;
- collect/refund customer money;
- allocate/release Retail Store stock;
- alter product master data;
- assign Fares roles;
- turn factory `Finished` into inventory by direct stock mutation.

### Owner / Administrator

May perform the same Phase 3A operations under owner authority.

Other roles do not receive production mutation unless they separately hold Production Manager/Owner authority.

## Explicit exclusions retained

Phase 3A does not add:

- raw-material, trims or WIP inventory accounting;
- Bills of Materials or native Manufacturing Order stock posting;
- workcenter/machine scheduling or worker-time tracking;
- factory-finished stock custody/location;
- automatic Retail Store receipt from a production task;
- preorder cancellation/refund policy;
- automatic customer notifications;
- B2B/customer-contract production orders;
- business-client partial shipment/final-payment rules;
- procurement planning or advanced analytics;
- deployment or real-data migration.

## Hosted validation and final authority

The authoritative application SHA is **`ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`**.

GitHub Actions workflow `Phase 3A preorder production`, run **`34601274874`**, job **`103268897396`**: **SUCCESS**.

The exact-head combined Phase 1 through Phase 3A gate passed **93 tests with 0 failures and 0 errors**. The same database and SHA then passed the repeatable upgrade for `fu_core,fu_retail,fu_preorder,fu_production`.

Final artifact:

- ID **`10264163466`**;
- name `phase3a-production-ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`;
- digest **`sha256:0e94e65beaa25c92c27337c200186dd765c2a5f1c1ee9b5735130a0fc60770d5`**.

Representative English and Arabic/RTL desktop/narrow production screenshots were manually reviewed. The browser paths passed keyboard focus and RTL checks and ended in `test successful`; no application JavaScript/test exception was observed. Headless Chrome emitted only expected CI environment noise such as D-Bus/UPower/GCM messages.

Detailed red/green chronology and screenshot names are retained in `docs/validation/PHASE_3A_PREORDER_PRODUCTION.md`.

## Exit criteria

Phase 3A closes because:

1. size-specific threshold/deadline production rules are represented without inventing a quantity default;
2. task coverage is source-linked, bounded and retry-safe;
3. queued/start/finished state changes are attributable and server-authorized;
4. factory completion does not create unapproved stock custody/accounting;
5. existing Retail Store readiness/allocation remains authoritative;
6. Production Manager permissions are server-enforced;
7. representative EN/AR/RTL operational UI passes;
8. all Phase 1–2C regressions remain green in the combined gate;
9. repeatable four-addon upgrade passes at the exact application SHA;
10. B2B, raw/WIP, preorder-cancellation, customer-notification and deployment policy remain outside this slice.

**All Phase 3A exit criteria for the approved bounded scope are satisfied.**

Later documentation-only closure commits on this branch must remain distinguishable from the tested application SHA above.