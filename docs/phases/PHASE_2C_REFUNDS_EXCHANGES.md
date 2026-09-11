# Phase 2C — Retail refunds and size exchanges

Status: **COMPLETE / AUTHORITATIVE HOSTED GATE PASS.**

Branch: `phase-2c/refunds-exchanges`.

Authoritative tested application SHA: **`62369e62dd1e5d2505e089c6a5ede296a24bcb3b`**.

Final hosted authority: workflow `Phase 2C retail returns`, run **`34596450064`**, job **`103253225096`**, conclusion **SUCCESS**. Final artifact and detailed evidence are recorded in `docs/validation/PHASE_2C_REFUNDS_EXCHANGES.md`.

This phase started from verified Phase 2B closure `5f341fb4aa5eacb12191dd41afa43c02000abcd4`. No merge, deployment or real-data migration was authorized or performed by completing Phase 2C.

## Purpose

Phase 2C implements consumer-retail refunds and size exchanges without erasing original sale/payment/stock history and without granting routine checkout staff broad native Odoo refund, accounting or stock authority.

Odoo remains the operational sales/payment/stock ledger. Fares-owned code adds the bounded request/approval/policy/store-scope/inspection/idempotency workflow around native Odoo records; it does not create a second refund/payment/stock ledger.

## Accepted policy

`docs/requirements/PHASE_2C_POLICY_DECISIONS.md` is authoritative for P2C-01 through P2C-07. Client approval was received on 2026-09-11.

The implemented policy is:
1. routine automated returns/exchanges require the original recorded retail transaction;
2. ordinary consumer retail follows the researched Egypt CPA baseline of a 14-day no-reason return/exchange path, subject to published exceptions, and a 30-day defective-goods path;
3. normal stocked school uniforms are not treated as custom merely because they carry a school/client design; genuinely made-to-special-specification compliant goods may use the published custom-goods exception;
4. Cash refunds settle as Cash;
5. InstaPay refunds/negative exchange differences require positive manually confirmed outbound bank evidence/reference; original payment history remains immutable;
6. automated Phase 2C supports a source sale paid entirely by one supported method; mixed-method allocation is deferred and fails closed;
7. size exchanges settle the exact difference: positive means collect, negative means refund under the accepted method, zero means no money movement;
8. returned garments enter non-sellable `Returns / Inspection` until explicit inspection accepts them into sellable Retail Store stock or marks them non-sellable;
9. uncollected-preorder cancellation/refund is outside Phase 2C;
10. return/exchange request, approval and execution are online-only and fail closed offline.

`docs/requirements/PHASE_2C_POLICY_RESEARCH.md` records the external consumer-policy research baseline. It is an implementation constraint, not final legal certification.

## Odoo-native technical boundary

Pinned Odoo Community commit: **`1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`**. The source analysis is `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md`.

The implemented direction preserves these boundaries:
- native POS refund lines retain original-line identity through `refunded_orderline_id` and Odoo cumulative refunded quantity;
- native POS refund quantity cannot exceed outstanding source quantity;
- a delivered POS refund owns its native return stock effect and links the return movement to the original outgoing move;
- no generic reverse transfer is layered on top of a POS refund;
- `pos.order._refund()` is used as the native construction primitive only inside the approved Fares execution context;
- a size exchange is a source-linked native return of the original variant plus a positive replacement-variant line;
- replacement pricing/tax/fiscal-position behavior is recomputed through native POS mechanics rather than a hand-coded list-price shortcut;
- Fares code owns policy eligibility, approval, store scope, settlement evidence, quarantine/inspection routing and exact-once execution.

## Delivered operator workflow

The controlled **Returns & Exchanges** workspace provides:
- source sale selection;
- refund vs size-exchange operation;
- eligibility path and reason;
- returned lines/quantities and replacement size where applicable;
- live exchange-difference preview;
- Cash/InstaPay settlement evidence fields;
- request, Manager/Owner approval, execution and rejection states;
- `Returns / Inspection` disposition;
- sellable acceptance or non-sellable classification;
- request/approval/execution actor and timestamps;
- links to native refund/exchange/quarantine records.

The routine POS native Refund entry is replaced for Fares staff with **Returns / Exchanges**. Online, the POS synchronizes pending orders and then navigates to the controlled backend workspace. Offline, the action remains in POS, shows an online-required warning and does not expose a competing native refund path.

Server-side protections remain authoritative even if the client UI is bypassed.

## Role boundary

### Cashier
- may locate the source transaction and prepare/request a return or exchange;
- cannot approve a refund/exchange;
- cannot directly create native refund/negative-line/payment/stock mutations outside an approved Fares request.

### Store Manager
- may approve and execute eligible returns/exchanges within assigned store scope;
- approval and execution remain attributable and server-checked.

### Owner / Administrator
- may approve/administer allowed actions within the accepted workflow;
- exceptional behavior still requires explicit recorded reason/evidence rather than silent mutation.

### Inventory staff
- may perform the explicit post-return inspection disposition allowed by the role design;
- cannot silently convert returned garments to sellable stock outside the accepted inspection path.

## Required invariants — delivered and tested

1. Original completed sale/payment history is never silently rewritten or deleted.
2. Every return/exchange remains linked to the source transaction and attributable to staff actions.
3. Cumulative returned/refunded quantity cannot exceed outstanding eligible quantity.
4. Replay/retry cannot duplicate refund payment, replacement issue or stock effects.
5. Returned stock remains outside sellable stock until explicit accepted inspection.
6. Non-sellable disposition remains quarantined.
7. Size exchange preserves both legs: return of the original variant and issue/sale of the replacement variant.
8. Replacement is constrained to another storable variant of the same product template/UoM and requires sufficient sellable store stock.
9. Price differences are explicit settlement effects, never hidden product-price edits.
10. Cashier cannot elevate authority through native API or offline sync payloads.
11. Store/location scope remains server-enforced.
12. Mixed-method source sales fail closed in the automated Phase 2C path.
13. Return/exchange mutation requires connectivity and cannot later replay into an unapproved mutation.

## Hosted validation closure

The final exact application SHA `62369e62dd1e5d2505e089c6a5ede296a24bcb3b` passed:
- the combined Phase 1 + Phase 2A + Phase 2B + Phase 2C hosted test gate;
- **82/82 Odoo tests with 0 failed and 0 errors**;
- repeatable `fu_core,fu_retail,fu_preorder` upgrade on the same database and application SHA;
- full/partial Cash refund and cumulative over-refund rejection;
- confirmed InstaPay refund evidence and mixed-method rejection;
- sellable and non-sellable inspection paths;
- equal-price, more-expensive and cheaper size exchanges;
- confirmed InstaPay negative exchange-difference evidence;
- replacement stock shortage and same-template enforcement;
- direct native refund/negative-line/sync bypass rejection;
- idempotent refund/exchange execution;
- controlled POS online navigation and offline fail-closed behavior;
- representative English and Arabic/RTL browser paths;
- keyboard focus and narrow/reduced-motion rendered capture.

Final run: **`34596450064`**. Final job: **`103253225096`**.

Final artifact:
- ID **`10262414135`**;
- `phase2c-returns-62369e62dd1e5d2505e089c6a5ede296a24bcb3b`;
- digest **`sha256:de110b0bd73593d7248f396acb1df35c80c5c711edac14b83773b54d86e1a475`**.

Representative retained return-workspace screenshots cover English desktop/narrow and Arabic RTL desktop/narrow. Detailed chronology, including the corrected earlier red-run association and fixes, is in the validation document.

## Explicit exclusions after closure

Phase 2C does not implement or authorize:
- mixed-method automated refund allocation;
- uncollected-preorder cancellation/refund;
- cards/wallets;
- automatic InstaPay/bank API integration;
- chargebacks;
- B2B contract return/credit policy;
- repairs/alterations or warranty workflows;
- production material/WIP returns;
- final legal/tax certification;
- production deployment or real-data migration.

These remain future bounded decisions/phases.

## Exit criteria result

Phase 2C exit criteria are satisfied for the accepted consumer-retail scope:
- P2C-01 through P2C-07 remain represented as accepted;
- statutory research is represented without claiming legal certification;
- native source history and reversal attribution are preserved;
- quantity/payment/stock effects are bounded and idempotent;
- return quarantine/inspection prevents silent sellable-stock inflation;
- exchange variant and exact-difference handling are explicit and tested;
- role/store scope and direct-mutation boundaries are server-enforced;
- connectivity behavior is explicit and tested;
- representative EN/AR/RTL UI passes;
- prior Phase 1/2A/2B regressions and repeatable upgrades remain green.

Any later documentation-only commit is closure metadata, not a newer application validation authority.