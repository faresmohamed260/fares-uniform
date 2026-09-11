# Phase 3A — Preorder production queue and workflow

Status: **ACTIVE — EXECUTION CONTRACT ESTABLISHED; IMPLEMENTATION NOT YET VERIFIED.**

Branch: `phase-3a/preorder-production-queue`.

Starting documentation lineage: Phase 2C closure head `06ac7787392bbd63081fe22f23dcbbb603f1b398`.

Inherited application authority: Phase 2C application/test SHA `62369e62dd1e5d2505e089c6a5ede296a24bcb3b`, run `34596450064`, job `103253225096`.

No merge, deployment or real-data migration is authorized by starting this phase.

## Why this is the next bounded phase

The accepted MVP delivery order places production automation and business-order tracking after the completed retail phases. The two areas are deliberately split here so unresolved B2B final-payment and partial-shipment policy is not invented inside production work.

Phase 3A therefore covers the confirmed school/preorder production workflow only. Business-client order tracking will receive a separate Phase 3B contract.

## Inherited confirmed rules

The following are already accepted and must not be re-asked unless contradictory implementation evidence appears:

- School/client designs are distinct products when units are not interchangeable.
- Size is represented by the product variant; production demand must remain separated by variant/size.
- Preorders are used when requested school-uniform stock is unavailable.
- Every preorder records a promised pickup date.
- Demand enters production when enough orders accumulate **or** when pickup is close.
- The quantity threshold is configurable, but no numeric starting default has been accepted. Do not invent one.
- The pickup lead-time trigger is configurable; the accepted initial default is seven days.
- Automatic triggering creates a production task; it must not pretend physical production already started.
- Production Manager/staff explicitly mark **In production** when work actually begins.
- **Finished** means factory completion and is a workflow state, not a tracked factory stock location.
- **Ready for collection** means goods have physically reached the Retail Store. Existing Phase 2B store-stock allocation/readiness remains authoritative for this state.
- Raw materials, trims and work-in-progress stock accounting are outside the initial inventory boundary.
- Odoo stock records remain inventory truth; production workflow must not create a second finished-stock ledger.
- Production Manager is the bounded operational role for queue/start/completion/configuration. Owner/Admin retains full authority.
- Cashier, Inventory Staff and Sales/BD do not gain production mutation merely because they can view related preorder/product context.
- English/Arabic/RTL and the approved practical operational ERP direction continue to apply.

## Goal

Replace the factory's manual receipt-sorting trigger with an attributable, retry-safe production queue that:

1. derives unmet preorder demand from authoritative preorder lines;
2. aggregates demand separately by product variant/size;
3. triggers a queued production task when either the configured quantity threshold is reached or the configured pickup lead-time boundary is reached;
4. keeps the quantity trigger disabled until an explicit positive threshold is configured rather than guessing a default;
5. uses the accepted seven-day lead-time default until an authorized user changes it;
6. creates each production allocation exactly once under retries/concurrent evaluation;
7. records which preorder lines/quantities each production task covers;
8. lets Production Manager/Owner explicitly move a task from `queued` to `in_production` to `finished`;
9. preserves factory `finished` as workflow evidence only—no automatic factory stock quant or finished-stock location;
10. leaves physical Retail Store receipt/allocation to existing native stock flows and Phase 2B readiness semantics;
11. provides a practical bilingual production queue with overdue/near-deadline context and audit fields;
12. preserves all Phase 1–2C behavior and repeatable upgrades.

## Domain and ownership boundary

### Production task ownership

Add a bounded Fares production workflow model rather than forcing native Odoo Manufacturing Orders into a scope that intentionally excludes component/WIP accounting and factory-finished inventory.

A production task is workflow/audit metadata, not an inventory ledger. Odoo stock moves/quants remain the only finished-stock custody truth.

Each task represents one product variant and a snapshot of currently uncovered qualifying preorder demand. Task-line records attribute quantities back to source preorder lines.

### Why native `mrp.production` is not the Phase 3A authority

Pinned Odoo Community `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` shows `mrp.production` requires component and finished-product locations and owns raw/finished stock moves; its confirmed/done states explicitly reserve materials and post finished stock. That conflicts with the accepted MVP boundary where raw/WIP accounting is excluded and factory `Finished` is not inventory custody.

The exact technical analysis is recorded in `docs/architecture/PHASE_3A_PRODUCTION_MODEL.md`.

## Demand calculation

For each preorder line, production demand is based on ordered quantity that is not already physically ready/allocated at the Retail Store and not already collected, minus quantity already covered by active/completed production task lines.

The implementation must never create production demand for:
- non-preorder sale lines;
- display/note lines;
- non-storable/non-sale products;
- quantities already ready at the Retail Store;
- quantities already collected;
- quantities already covered by production tasks that are not cancelled.

Demand is aggregated by exact `product.product` variant, preserving size-specific identity.

## Trigger semantics

A variant qualifies when uncovered demand is positive and either:

1. **Quantity trigger:** a positive configured threshold exists and aggregate uncovered quantity for that exact variant is at least the threshold; or
2. **Deadline trigger:** at least one uncovered source quantity has a promised pickup date on or before `today + configured lead days`.

Configuration rules:
- `lead_time_days` defaults to **7**;
- `quantity_threshold` has **no invented default**; unset/zero means the quantity trigger is inactive while the deadline trigger remains active;
- only Owner/Admin or Production Manager may change production trigger settings;
- changes are attributable and server-authorized.

## Task creation and replay semantics

- Evaluation must be callable explicitly and by a scheduled action.
- Preorder creation may request an evaluation, but failure/retry must not duplicate task coverage.
- Each created task snapshots qualifying uncovered quantities at the time of creation.
- Later uncovered demand is evaluated independently; it may produce a later task rather than silently rewriting an already-started task.
- A source preorder line may be split across multiple production tasks over time, but cumulative non-cancelled task quantity must never exceed its then-current uncovered production demand.
- Evaluation and task creation must use server-side locking/idempotency appropriate to prevent duplicate coverage under concurrent calls.

## Task state semantics

Allowed business states:

- `queued` — automatically created demand; physical work has not been claimed to start;
- `in_production` — explicitly started by Production Manager/Owner;
- `finished` — explicitly marked complete at the factory; still not Retail Store stock;
- `cancelled` — administrative workflow cancellation only before/under separately validated conditions; cancellation does not refund/cancel the preorder and must leave an audit trail.

`Ready for collection` is **not** a production-task state. It remains the preorder/store-custody condition proven by Phase 2B after physical stock reaches the Retail Store and is allocated.

## Role boundary

### Production Manager
May:
- view the production queue and source-demand context needed for production;
- run/re-run queue evaluation;
- start queued tasks;
- mark in-production tasks finished;
- change bounded threshold/lead-time settings;
- view task audit history.

Cannot:
- mutate preorder payment history;
- collect/refund customer money;
- allocate or release Retail Store stock unless separately holding an authorized stock role;
- alter product master data;
- assign Fares roles;
- convert factory `Finished` into stock by direct quant/move mutation.

### Owner / Administrator
May perform the same Phase 3A actions and administer exceptional task correction with attributable records.

### Other roles
Cashier, Store Manager, Inventory Staff and Sales/BD may receive only the minimum read context already authorized by their existing workflows. They do not receive production task mutation unless they also hold Production Manager/Owner authority.

## UI direction

Use native Odoo list/form/search patterns and maintained controls. The production workspace should make the following visible without decorative complexity:

- task reference and state;
- exact product/variant/size context;
- total production quantity;
- earliest promised pickup date;
- trigger reason (`quantity`, `deadline`, or both where applicable);
- queued/start/finished actor and timestamps;
- source preorder lines/quantities;
- current production configuration;
- clear distinction between factory `Finished` and Retail Store `Ready for collection`.

Representative English and Arabic/RTL desktop/narrow paths, keyboard focus and reduced-motion-safe operational behavior remain required.

## Explicit exclusions

Phase 3A does not add:

- raw-material, trims or WIP inventory accounting;
- Bills of Materials or native Manufacturing Order stock posting;
- machine/workcenter scheduling;
- worker time tracking;
- factory-finished stock custody/location;
- automatic Retail Store receipt from a production task;
- preorder cancellation/refund policy;
- automatic customer notifications;
- B2B/customer-contract production orders;
- business-client partial shipment/final-payment rules;
- procurement planning;
- advanced analytics;
- deployment or real-data migration.

## Hosted validation contract

The exact-head hosted gate must prove at least:

- quantity-trigger task creation after an explicit threshold is configured;
- no quantity-trigger task before threshold configuration or below threshold;
- seven-day default deadline trigger;
- configurable lead-time behavior;
- aggregation remains separate per exact product variant/size;
- already-ready/collected quantity is excluded from production demand;
- repeated and concurrent evaluation does not duplicate task coverage;
- source attribution quantities cannot exceed uncovered preorder demand;
- queued task does not claim physical production start;
- Production Manager/Owner can start and finish tasks;
- unauthorized roles/direct ORM/API mutation are denied server-side;
- finishing a task creates no stock quant/move and no factory inventory location;
- Retail Store readiness still requires the existing Phase 2B physical-stock allocation path;
- EN/AR/RTL production UI and keyboard focus;
- Phase 1 + Phase 2A + Phase 2B + Phase 2C regressions remain green;
- repeatable upgrade succeeds for all installed Fares addons on the same exact application SHA.

## Documentation outputs

Before implementation — **this contract plus architecture analysis**:
- `docs/phases/PHASE_3A_PREORDER_PRODUCTION.md`;
- `docs/architecture/PHASE_3A_PRODUCTION_MODEL.md`;
- `docs/validation/PHASE_3A_PREORDER_PRODUCTION.md` initialized for exact-hosted chronology.

Before closure:
- exact tested application SHA, workflow run/job and evidence artifact/digest;
- failure chronology retained honestly;
- rendered EN/AR/RTL evidence reviewed;
- `PROJECT.md`, `docs/README.md` and durable decisions updated;
- tested application SHA kept distinct from later docs-only cleanup/closure commits.

## Exit criteria

Phase 3A closes only when:

1. confirmed size-specific and deadline/threshold production rules are represented without inventing a quantity default;
2. production task coverage is source-linked, bounded and retry-safe;
3. queued/start/finished states are attributable and server-authorized;
4. factory completion does not create unapproved stock custody/accounting;
5. existing Retail Store readiness/allocation remains authoritative;
6. Production Manager permissions are server-enforced and other roles cannot bypass them;
7. representative EN/AR/RTL operational UI passes;
8. all Phase 1–2C regressions remain green;
9. repeatable addon upgrade passes at the exact application SHA;
10. B2B, raw/WIP, preorder-cancellation, customer-notification and deployment policy are not smuggled into this slice.
