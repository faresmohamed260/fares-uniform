# Phase 3A architecture — preorder production workflow model

Status: **IMPLEMENTATION BOUNDARY DECIDED; RUNTIME VALIDATION PENDING.**

Pinned Odoo Community reference: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Phase contract: `docs/phases/PHASE_3A_PREORDER_PRODUCTION.md`.

## Question

Should Fares Uniform model the confirmed preorder-production workflow with native Odoo `mrp.production`, another generic Odoo task model, or a bounded Fares workflow model linked to existing Odoo preorder/product/stock records?

## Accepted business boundary

The current MVP deliberately tracks:

- size-specific preorder demand;
- an automatic threshold/deadline trigger;
- queued production work;
- explicit staff start (`In production`);
- explicit factory completion (`Finished`);
- later physical Retail Store readiness through the already-implemented preorder/stock workflow.

It deliberately does **not** track:

- raw materials or trims;
- work-in-progress inventory;
- Bills of Materials;
- component reservation/consumption;
- work centers/machines;
- factory-finished inventory custody.

`Finished` is therefore a workflow fact, not a stock-location event. On-hand finished stock begins only when Store or Storage records physical receipt.

## Pinned Odoo `mrp.production` findings

At the pinned Odoo Community SHA, `addons/mrp/models/mrp_production.py` shows:

- `mrp.production` requires a manufacturing operation type;
- it has required `location_src_id` (**Components Location**) and `location_dest_id` (**Finished Products Location**);
- it owns `move_raw_ids` for components and `move_finished_ids` for finished products;
- its state help explicitly says confirmed manufacturing orders trigger stock rules/component reordering and done manufacturing orders post stock moves;
- it includes BoM, component-readiness, work-order and production-location concepts that are intentionally outside the accepted Phase 3A scope.

Using `mrp.production` merely as a status tracker would therefore either:

1. manufacture stock/location semantics the client explicitly rejected, or
2. require suppressing/working around core MRP behavior so heavily that the native model would no longer be the true workflow owner.

Neither is appropriate.

## Decision

Create a new bounded addon, `fu_production`, that depends on `fu_core` and `fu_preorder` and owns only Fares-specific production workflow/audit records.

It must not own stock quants, inventory valuation, raw-material consumption or customer payment facts.

### Core models

#### `fu.production.config`

One active configuration per company:

- `company_id`;
- `quantity_threshold` — optional positive product-unit quantity; zero/unset disables only the quantity trigger;
- `lead_time_days` — positive integer, default `7`;
- audit fields for the last configuring actor/time where useful.

Mutation is restricted server-side to Owner/Admin and Production Manager.

#### `fu.production.task`

One task covers one exact `product.product` variant:

- immutable task reference;
- `company_id`;
- `product_id`;
- derived total `quantity` from task lines;
- `earliest_commitment_date`;
- trigger reason (`quantity`, `deadline`, `quantity_deadline`);
- state: `queued`, `in_production`, `finished`, `cancelled`;
- queued/started/finished/cancelled actor and timestamps;
- source task lines.

The task is workflow metadata only. State transitions create no stock moves/quants.

#### `fu.production.task.line`

Attribution record linking task coverage to an authoritative preorder line:

- `task_id`;
- `preorder_line_id` (`sale.order.line`);
- quantity covered by this task;
- related preorder/product/pickup context for display/search where useful.

Constraints must ensure:

- positive quantity;
- source line belongs to a Fares preorder;
- task product equals source line product;
- cumulative non-cancelled production-task coverage cannot exceed the source line's current production need under the Phase 3A formula.

## Production-demand formula

For an eligible preorder line:

`production_need = ordered_qty - collected_qty - ready_qty - active_task_coverage`

clamped at zero in the source line's unit of measure.

Where:

- `ordered_qty` is the authoritative preorder sale-line quantity;
- `collected_qty` and `ready_qty` come from the Phase 2B native stock-backed computations;
- `active_task_coverage` is quantity on non-cancelled production task lines.

This avoids producing quantities already physically available/allocated at the Retail Store or already handed to the customer.

## Trigger evaluation

Evaluation groups positive uncovered demand by exact product variant.

For each variant:

- quantity trigger is true only when an explicit positive configured threshold exists and aggregate uncovered demand meets/exceeds it;
- deadline trigger is true when at least one uncovered source line's preorder commitment date is within the configured lead-time horizon;
- if neither is true, no task is created;
- if one or both are true, one task snapshots the currently uncovered qualifying demand for that variant.

### Quantity snapshot rule

When a variant qualifies, include all currently uncovered demand for that variant, not only enough units to reach the threshold. This matches the existing paper process of collecting/sorting current orders into a production batch while avoiding arbitrary leftover fragmentation.

New demand arriving after task creation remains uncovered and is evaluated on a later run. Existing started/finished tasks are never silently enlarged.

## Evaluation entry points

Phase 3A should support both:

1. explicit/server method evaluation, callable by Production Manager/Owner for immediate review/testing;
2. a scheduled action, at a practical cadence, so deadline-triggered demand appears automatically even when no new preorder is created.

`fu_production` may inherit the preorder creation service to request evaluation after a new preorder is accepted. Because task creation is bounded/idempotent, retries remain safe.

## Concurrency and idempotency

Task creation must be safe under repeated or concurrent evaluation.

Required approach:

- re-read/lock relevant source preorder lines before assigning coverage;
- calculate existing non-cancelled coverage inside the protected transaction;
- create only still-uncovered positive quantities;
- never rely only on a UI-level disabled button or cron cadence for uniqueness.

A repeated evaluation with no new uncovered qualifying demand must create no new task lines/effects.

## State transition rules

### `queued -> in_production`

- Owner/Admin or Production Manager only;
- explicit action;
- record actor/time;
- idempotent replay may return existing state without duplicate audit side effects, or fail clearly according to implementation convention.

### `in_production -> finished`

- Owner/Admin or Production Manager only;
- explicit action;
- record actor/time;
- creates **no** stock move, picking, quant or factory stock location.

### Cancellation

Cancellation is a production-workflow cancellation only. It does not cancel/refund the source preorder.

For Phase 3A, cancellation is allowed only while `queued`, by Owner/Admin or Production Manager, with recorded actor/time/reason. Cancelling releases that task's production coverage so a later evaluation can cover the demand again if still needed.

Started/finished task cancellation or quantity correction is excluded until an explicit exception policy is accepted.

## Ready-for-collection boundary

Production completion and retail readiness remain deliberately separate:

1. Production task reaches `finished` at factory — workflow only.
2. Goods physically arrive at the Retail Store through the existing authorized stock receipt path.
3. Existing Phase 2B allocation reserves physically available Retail Store stock to preorder lines.
4. The preorder's native-stock-backed readiness becomes `partially_ready`/`ready`.

No Phase 3A shortcut may mark a preorder ready merely because a production task finished.

## Security boundary

- `fu.production.task` and `fu.production.config` mutation: Production Manager and Owner/Admin only.
- Other internal roles may receive read-only access only where operationally useful and data exposure remains within existing role boundaries.
- Direct create/write/unlink must not be a bypass around the transition/evaluation services.
- Production Manager must not gain broad native `stock.group_stock_user`, accounting, refund or product-master privileges through this addon.

## UI boundary

Use native Odoo views/actions/menus in a dedicated **Production** workspace:

- queue list with state, product/variant, quantity, earliest pickup and trigger badges;
- task form with source preorder-line attribution and audit fields;
- configuration action for threshold and lead time;
- explicit Start Production / Mark Finished / Cancel Queued actions;
- bilingual Arabic translations and RTL-safe native layouts.

No custom SPA or decorative 3D scene is justified for this dense operational workflow.

## Validation implications

Hosted tests must prove not only positive task creation but also absence of forbidden effects:

- no `mrp.production` record required;
- no raw/finished MRP moves;
- no new factory-finished stock location;
- no quant change when task becomes finished;
- source preorder/payment/collection behavior remains unchanged;
- existing Retail Store stock allocation is still required for `Ready for collection`.
