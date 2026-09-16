# Phase 2A — Retail stock checkout and offline reconciliation

Status: **ACTIVE / AUTHORIZED, 2026-09-07. IMPLEMENTATION NOT YET STARTED AT CONTRACT CREATION.**

Authorization state: after Phase 1 closure, the client instructed the developer to keep going. Under the existing MVP approval and the precedent established by D-025, this authorizes the next bounded remote implementation slice. This authorization does **not** resolve deferred preorder/refund/collection policies, approve production deployment, spend money, select real store hardware, import real business data or authorize a bank integration.

## Why Phase 2 is split

The accepted retail release includes stock sales, preorders, Cash/InstaPay, collections, refunds/exchanges and mandatory offline checkout. Some of those workflows still have explicit policy questions that must not be guessed: offline preorder/collection/refund behavior, missing/delayed InstaPay confirmation, reservation/allocation and refund/exchange eligibility.

Phase 2A therefore builds the smallest durable retail transaction foundation that is fully supported by confirmed requirements and prior proof:

**ordinary finished-stock checkout + Cash / positively confirmed InstaPay recording + durable offline reconciliation.**

Preorders, balance collection, refunds and exchanges remain required MVP work, but move to a later retail subphase after their targeted rules are resolved. This is sequencing, not scope removal.

## Goal

Turn the Phase 0A POS proof into production-owned Fares retail code that can sell Phase 1 finished-stock variants through native Odoo POS, continue ordinary checkout through short internet outages, survive browser reload, and reconcile without duplicate orders, payments or stock effects.

The cashier must always be able to distinguish a locally completed sale from one the server has actually reconciled.

## Starting evidence and inherited contracts

- Phase 1 complete: tested implementation `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`, hosted run `34110346764`.
- Product identity, permanent FU codes/barcodes, Retail Store/Storage custody and server-side role/location boundaries are inherited from Phase 1 and must not be redefined.
- Phase 0A native Odoo POS proof: implementation `1ad528e02ed1a709d34620731d182c5e1cbdebe9`, run `34068805602`, 15 tests / 0 failures / 0 errors.
- Phase 0A proved fully paid Cash and generic manual-Bank orders can be created during simulated API loss, survive offline reload in IndexedDB, reconnect and synchronize without duplicate order/payment effects when the isolated restore shim is present.
- Generic Bank in Phase 0A was not an InstaPay integration. Phase 2A uses the confirmed business practice: staff positively confirm an InstaPay payment from the bank mobile notification; no bank API is introduced.
- Foundation architecture `docs/architecture/FOUNDATION_ARCHITECTURE.md` remains authoritative for Odoo/Owl ownership, stable local transaction identity and visible sync states.
- Role design `docs/requirements/ROLES_AND_PERMISSIONS.md` remains authoritative: Cashier can create ordinary sales and record payment, but cannot mutate stock directly, approve refunds, self-elevate or administer locations.

## In scope

### 1. Production-owned retail addon

Introduce the smallest justified Fares retail addon, expected to be `fu_retail`, depending on native Odoo Point of Sale and `fu_core`.

Rules:
- extend native Odoo POS/Owl services and models; do not replace checkout with React;
- keep native `pos.order`, `pos.payment`, product and stock effects authoritative;
- do not create a parallel sales ledger or duplicate operational truth in Supabase/another database;
- do not fork Odoo core.

### 2. Productionize the isolated Odoo 19 offline-restore compatibility layer

The Phase 0A proof identified and worked around an Odoo 19 offline-startup restore defect. Phase 2A must move the necessary compatibility behavior into production-owned addon scope rather than depending on the disposable proof addon.

Requirements:
- preserve paid unsynced records already read from IndexedDB during offline startup;
- delegate to upstream Odoo behavior unchanged when online;
- keep the patch narrow, source-commented and version-pinned to the tested Odoo behavior;
- add a regression test that would fail if the upstream defect returns;
- document a retirement condition so the shim can be removed after an upstream fix is adopted and revalidated.

Do not copy proof-only factory/preorder models into production code.

### 3. Ordinary finished-stock POS sale

Use Phase 1 `product.product` variants and the Retail Store stock location.

For this slice an ordinary sale:
- contains finished-stock variants already sellable in native Odoo POS;
- may use manual code/barcode/search lookup through Odoo-native mechanisms;
- records quantities and the selling cashier/device/session identity available through the native transaction plus Fares audit additions where genuinely needed;
- creates one authoritative Odoo POS order;
- produces the native stock consequence exactly once after reconciliation;
- preserves the original transaction instead of allowing silent deletion/correction.

No preorder line, special production demand or reservation allocation is introduced here.

### 4. Initial payment methods

Support data-driven payment methods:
- Cash;
- InstaPay.

The architecture must remain extensible for later card/wallet methods without branching core order logic by provider brand.

#### Cash
Cash can complete the ordinary-sale positive path online or during an outage.

#### InstaPay positive-confirmation path
The confirmed current business process is manual bank-notification verification. Phase 2A may mark an ordinary sale paid by InstaPay only through a positive staff-confirmation interaction that indicates the bank mobile notification was observed.

At minimum preserve attributable evidence sufficient to identify the staff actor and transaction/payment being confirmed. Do not invent bank reference formats or claim bank-side verification.

Missing, delayed, contradictory or ambiguous bank notifications remain outside Phase 2A resolution. The system must not silently reinterpret an unconfirmed payment as confirmed, but the later business policy for what staff do next remains open.

### 5. Stable offline transaction identity

Each locally created ordinary sale must have a stable transaction UUID/idempotency identity that survives:
- connectivity loss;
- POS navigation;
- browser reload while offline;
- synchronization retry;
- a lost/duplicated client acknowledgement scenario represented in hosted tests.

Retrying synchronization must not create a second sale, second payment or second stock effect.

Prefer native Odoo transaction identity where it already satisfies the invariant. Add Fares-owned identity only if an evidenced gap requires it.

### 6. Visible synchronization state

Cashiers must see the distinction between local completion and central reconciliation.

At minimum support/display states equivalent to:
- **Pending sync** — sale is durable locally but not server-confirmed;
- **Syncing**;
- **Synced** — server reconciliation confirmed;
- **Review required** — server revalidation/conflict prevents automatic reconciliation;
- **Retryable failure** — synchronization failed without losing the local sale.

Names may use native Odoo terminology where clearer, but the semantic distinction is mandatory.

A receipt screen shown while offline must not imply that the central server already accepted the sale. Any Fares sync indicator must remain visible/understandable in EN and AR.

### 7. Reconciliation and conflict boundary

On reconnect the server is authoritative. It revalidates queued work rather than blindly trusting cached client state.

Phase 2A must safely classify failures that prevent automatic reconciliation; it does **not** need to invent business resolution policy for every class.

Minimum invariants:
- duplicate/replayed transaction identity is idempotent, not a second sale;
- a queued transaction that fails current server authorization is retained and surfaced for review rather than silently discarded or auto-approved;
- a server validation failure caused by changed transaction assumptions is surfaced as review/failure evidence rather than hidden;
- local data is not deleted merely because the first sync attempt fails;
- conflict/retry handling remains attributable to actor/device/transaction identity.

Exact authorization-expiry duration, price-conflict commercial treatment and stock-shortage override policy remain later retail policy unless implementation evidence proves a narrower technical rule is required now.

### 8. Security

Phase 2A extends—not replaces—the Phase 1 role model.

Minimum server-side behavior:
- Cashier can create ordinary POS sales through the authorized retail path;
- Store Manager and Owner/Admin retain appropriate oversight;
- Cashier cannot use retail endpoints/services to mutate product master, raw stock records, role/location assignments or refund/return data;
- synchronization revalidates the actor/session against current server permissions;
- offline operation may use previously cached/enrolled authorization for the bounded outage but must never be described as live server authorization;
- staff identity remains attributable on queued and reconciled transactions.

No shared administrator account is an acceptable checkout design.

### 9. Native bilingual POS UX

Internal retail UI remains Odoo/Owl-native and follows D-031/D-033:
- use maintained Odoo/Owl components and extension points before custom generic controls;
- clean, modern, practical checkout hierarchy;
- stable cart/totals/payment actions; decorative motion never delays scanning/payment;
- English + Arabic with true RTL;
- touch-friendly primary actions;
- keyboard focus smoke coverage where applicable;
- narrow layout without primary-action document overflow;
- reduced-motion behavior for any added non-essential spatial animation.

This phase may refine the native POS visual grammar needed for Fares, but does not authorize a wholesale POS rewrite.

### 10. Operational receipt boundary

The ordinary sale should reach the native receipt/confirmation surface in English and Arabic and identify the recorded payment method and synchronization status where technically appropriate.

This is an operational receipt validation only. Legal/tax invoice identity, mandatory tax fields and final printed printer layout remain later deployment/legal/hardware decisions.

## Explicitly outside Phase 2A

- preorder creation or production-demand generation;
- preorder deposit/balance accounting;
- partial preorder collection;
- reservation/allocation policy;
- refund or size-exchange execution;
- refund/exchange approval policy;
- missing/delayed/ambiguous InstaPay notification resolution;
- automated bank/API verification;
- card/wallet payments;
- manager price/discount override design unless native behavior is needed only as a test fixture;
- production task automation;
- public website ordering;
- real printer/scanner validation;
- legal/tax receipt finalization;
- real business data migration;
- production hosting/deployment.

These exclusions do not remove already accepted MVP requirements; they bound this subphase.

## Data and transaction invariants

1. Every ordinary sale has one durable transaction identity across offline reload and retry.
2. Local completion and server reconciliation are distinct observable states.
3. A replay/retry cannot create a duplicate order, payment or stock effect.
4. Native Odoo POS/order/payment/stock records remain authoritative after reconciliation.
5. Cash and InstaPay are payment-method data, not hardcoded provider branches throughout order logic.
6. InstaPay paid state in the positive path requires an attributable staff confirmation; no bank API verification is claimed.
7. A sync/revalidation failure does not silently destroy the local sale.
8. Current server authorization is checked during synchronization.
9. Posted/reconciled history is not silently rewritten or deleted.
10. Phase 1 product codes, variants, stock locations and role boundaries remain unchanged.

## Hosted validation plan

All implementation validation remains remote and must target the exact implementation head on pinned Odoo Community 19.

### Install/upgrade/regression
- install `fu_core` + the retail addon(s) against a disposable PostgreSQL database;
- retain the Phase 1 test suite green;
- retail addon install and repeatable upgrade succeed;
- compatibility shim regression is isolated and version-pinned.

### Online ordinary sale
Using synthetic Phase 1-style finished stock:
- Cashier resolves a variant through native POS lookup;
- completes one Cash sale;
- server has exactly one paid/complete POS order and expected payment record;
- Retail Store stock consequence is applied exactly once;
- retrying the same transaction identity does not duplicate effects.

### InstaPay positive path
- select InstaPay;
- require the positive manual bank-notification confirmation interaction;
- complete the sale;
- server records exactly one InstaPay payment attached to exactly one order;
- evidence remains attributable to the staff actor;
- test names/docs explicitly say this is manual confirmation, not bank integration.

### Offline Cash path
Real Odoo browser test should:
1. open native POS while initially authorized/loaded;
2. simulate API connectivity loss while retaining loaded static assets as in Phase 0A;
3. create and fully pay a synthetic Cash sale;
4. reach receipt/local completion with a visible pending-sync distinction;
5. reload while still offline;
6. restore the same paid unsynced sale from durable browser storage into the POS model;
7. reconnect;
8. synchronize/retry; and
9. prove one server order, one payment and one stock effect.

### Offline confirmed-InstaPay positive path
Repeat the same durable reload/reconnect/idempotency scenario with the positive manual-confirmation path. Do not use this case to claim handling of missing bank notifications.

### Lost acknowledgement / replay
Represent a case where the server-side transaction effect exists but the client still retries the same transaction identity. The second delivery must resolve idempotently without duplicate order/payment/stock effects.

### Authorization/review boundary
- prove an authorized Cashier positive path;
- prove direct unauthorized retail mutation/service calls are denied;
- prove a queued transaction that no longer passes current server authorization is not silently auto-reconciled or discarded;
- preserve evidence sufficient for later manager review.

### Bilingual/render evidence
Capture representative native POS evidence in EN and AR/RTL for:
- cart/payment selection;
- offline local-complete/pending-sync state;
- reconciled/synced state or equivalent visible confirmation;
- review/failure state if the implementation surfaces one in this slice.

Check agreed desktop and narrow viewport behavior, no primary-action document overflow, keyboard focus smoke and reduced motion for added non-essential spatial effects.

## Evidence outputs

Create/update:
- `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md` with exact implementation SHAs, hosted runs, failures, artifact digests and limitations;
- `PROJECT.md` current state/handoff;
- `docs/DECISIONS.md` only when evidence forces a durable decision beyond this contract;
- this contract if evidence requires a scope correction.

Retain red runs that expose real defects; do not rewrite history to show only green evidence.

## Exit criteria

Phase 2A is complete only when:
1. native Odoo POS sells Phase 1 finished-stock variants through an authorized Cashier path;
2. Cash and positively manually confirmed InstaPay ordinary sales are supported without claiming bank integration;
3. ordinary sale identity survives offline reload and synchronization retry;
4. retry/lost-ack handling cannot duplicate order, payment or stock effects under the tested boundary;
5. local/pending versus server-synced state is visible and truthful;
6. current server authorization is revalidated at sync and failed revalidation is retained for review rather than lost;
7. Phase 1 security/product/stock tests remain green;
8. representative EN/AR RTL native POS render/interaction evidence passes the hosted gate;
9. the Odoo 19 offline-restore shim is production-owned, isolated and regression-tested;
10. no preorder/refund/collection policy or production-deployment claim is smuggled into the result.

## Next retail subphase after Phase 2A

Targeted policy discovery should then resolve only the questions needed for preorder/collection/refund work, including:
- which preorder operations must function offline;
- preorder reservation/allocation semantics;
- missing/delayed InstaPay confirmation handling;
- refund/exchange eligibility and returned-stock/payment treatment;
- offline role/session expiry and manager conflict-resolution rules where still unresolved.

Full-balance-before-partial-collection (D-014) is already confirmed and must not be re-asked.

## Execution state

**ACTIVE / AUTHORIZED.** This contract exists so implementation may begin on `phase-2a/retail-checkout-offline` in the next bounded execution step. At contract creation, no Phase 2A application code has yet been added.
