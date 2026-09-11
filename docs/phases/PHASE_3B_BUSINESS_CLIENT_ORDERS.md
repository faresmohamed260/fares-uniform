# Phase 3B — Business-client enquiry, sample, order, shipment and balance tracking

Status: **ACTIVE — EXPANDED POLICY-NEUTRAL ENQUIRY/SAMPLE/DRAFT-DETAIL SLICE VERIFIED; COMMERCIAL EXECUTION REMAINS GATED BY P3B-01 THROUGH P3B-04.**

Branch: `phase-3b/business-client-orders`.

Starting lineage: Phase 3A closure head `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

Verified expanded policy-neutral application authority: **`70e8c4d781106d894ded5a506c05b8c789ca9e05`**, workflow `Phase 3B business clients`, run `34617949241`, job `103324461450`.

No merge, deployment or real-data migration is authorized by this milestone.

## Why this is the next bounded phase

The accepted MVP includes business-client tracking after production automation. Current large-client practice is known at a high level:

1. client contacts the business;
2. a meeting gathers design/details;
3. the factory prepares and sends samples;
4. approved samples lead to a deposit;
5. production proceeds against a delivery date;
6. goods are shipped and the remaining payment is collected.

The repository deliberately deferred final-payment timing, partial-shipment behavior, deposit amount/default and change/cancellation rules to this phase. Those choices affect stock release, customer balance and financial authorization, so they remain explicit policy gates rather than guessed defaults.

The user's instruction to continue development authorized policy-neutral work covering enquiry/design/sample workflow and preparation of a native-linked draft quotation. That boundary now also includes controlled candidate item, quantity, unit-price, customer-reference and promised-delivery details on the native draft quotation. The expanded slice is hosted-tested and verified. It does not select any commercial policy outcome. Business-order confirmation, payment/deposit, shipment and cancellation remain server-blocked until the relevant policies are accepted.

## Confirmed inherited rules

- Business clients include schools, restaurants, cafes, hotels, hospitals and other organizations.
- Some business clients buy available stock; not every business order is made-to-order.
- Sales/Business Development owns enquiry/contact, draft quotation/contract, sample progress and business-order tracking.
- Large-client workflow uses a **deposit after sample approval**; D-005 must not be interpreted as mandatory full prepayment.
- Exact deposit percentage is not fixed and must not be invented.
- A delivery date is tracked.
- Cash and InstaPay are currently supported payment methods; cards/wallets remain future work.
- InstaPay continues to mean positive manual confirmation from the bank notification, not bank API automation.
- Odoo-native sale, payment and stock records remain operational truth; do not create a second order/payment/shipment ledger.
- Finished stock is tracked only at Retail Store/Storage custody. Factory `Finished` remains workflow-only.
- Public catalog never exposes price or stock.
- English/Arabic/RTL, named accounts, server-side authorization and attributable history remain mandatory.
- Owner/Admin retains broad authority; Sales/BD receives only bounded business-workflow permissions and does not gain stock/payment-verification/contact-admin/role-admin authority by implication.

## Full Phase 3B goal

Replace paper/manual large-client follow-up with an attributable Odoo-owned workflow that can eventually:

1. capture business enquiry and customer/contact identity;
2. record meeting/design requirements and notes;
3. track samples through preparation/sent/approval/rejection/revision;
4. convert an approved commercial agreement into one authoritative native business sale/order identity;
5. record agreed item variants, quantities and authorized commercial terms;
6. record deposit events without rewriting posted payment history;
7. track agreed delivery date and remaining customer balance;
8. track shipment through native Odoo stock records rather than custom shipment ledgers;
9. expose sample/commercial, payment and shipment state as separate dimensions;
10. preserve actor/time attribution and bounded role permissions;
11. remain compatible with later operational reports/public enquiry handoff;
12. preserve every Phase 1–3A invariant and repeatable upgrades.

## Verified expanded policy-neutral slice

The hosted-tested slice delivers:

- a dedicated Fares business-client enquiry workspace based on native `crm.lead`;
- company/contact, design and meeting/enquiry context without creating a parallel CRM ledger;
- sample states `not_started`, `preparing`, `sent`, `revision`, `approved`, `rejected`;
- controlled, attributable sample state transitions;
- Sales/BD own/assigned-record scope plus Owner/Admin authority;
- bounded Sales/BD enquiry phone/email handling that does not silently write the linked `res.partner`;
- creation of one native **draft** quotation linked through `sale.order.opportunity_id` only after sample approval;
- retry-safe draft-quotation creation;
- protection against relinking an ordinary quotation into the business path;
- a guarded transient draft editor for candidate product, quantity, unit price, customer reference and promised delivery date;
- native `sale.order` / `sale.order.line` remain the commercial draft truth; no duplicate Fares order-line ledger is introduced;
- Sales/BD native quotation/line ACLs remain read-only outside the guarded editor;
- repeated draft-detail save replaces candidate lines rather than duplicating them;
- server-side fail-closed confirmation guard for Fares business quotations/orders while P3B-01 through P3B-04 remain unresolved;
- no draft editor or sample action creates payment, stock, picking, shipment-authorization or confirmation effects;
- bilingual EN/AR/RTL operational UI including localized draft-editor title/actions, keyboard checks and desktop/narrow evidence;
- full Phase 1–3B policy-neutral regression and repeatable five-addon upgrade proof.

The verified slice creates **no** Phase 3B deposit/payment, balance-due enforcement, shipment authorization, confirmed-order cancellation/refund/credit or invented payment term.

Exact evidence is owned by `docs/validation/PHASE_3B_BUSINESS_CLIENT_ORDERS.md`.

## Domain ownership

Pinned-Odoo assessment is authoritative in `docs/architecture/PHASE_3B_BUSINESS_ORDER_MODEL.md`.

Reuse:
- `crm.lead` for enquiry/company/contact/meeting/notes;
- `res.partner` for customer identity;
- `sale.order` / `sale.order.line` for draft and later agreed commercial order identity;
- native accounting/payment records for later deposits/balances;
- native `stock.picking` / `stock.move` for later physical shipment.

Fares-owned code adds only missing workflow metadata, authorization and guarded transitions. It must not duplicate order totals, payment history, delivered quantities or stock custody as independent truth fields.

## State separation

Commercial/sample progress, payment state and physical shipment state remain separate dimensions. Do not collapse them into one misleading status.

At minimum staff must distinguish:
- enquiry/design discussion;
- sample preparing/sent/revision/approved/rejected;
- commercial quotation/order draft/agreed;
- deposit/balance state when later enabled;
- delivery deadline state;
- shipment state derived from native stock operations when later enabled;
- settlement state derived from authoritative payments when later enabled.

Phase 3B must not silently reuse school-preorder production semantics for all B2B orders because some business clients buy available stock.

## Role boundary

### Sales / Business Development

Verified policy-neutral authority:
- create/update assigned business enquiries;
- record design/meeting notes;
- progress sample workflow through controlled actions;
- prepare a native-linked draft quotation after sample approval;
- prepare candidate product/quantity/unit-price, customer-reference and promised-delivery details through the guarded draft editor;
- view the minimum linked quotation state required for follow-up.

Must not gain by Phase 3B role alone:
- broad contact-record mutation merely because an enquiry references a customer;
- broad native `sale.order` / `sale.order.line` mutation outside the guarded editor;
- direct stock mutation/shipment validation;
- Cash/InstaPay verification or posting;
- business-order confirmation while policy gates are open;
- posted-payment rewrite/cancellation;
- product-master mutation;
- refund/credit approval;
- user/role administration.

### Owner / Administrator

May perform the bounded policy-neutral workflow and view all business enquiries. Later exceptional commercial authority still follows accepted policies rather than bypassing them silently.

### Other roles

Cashier, Inventory Staff and Production Manager receive no business enquiry/sample/draft-editor mutation merely from existing roles.

## Connectivity/offline boundary

No business-client workflow has an accepted offline requirement. Phase 3B mutations are online-only and fail closed when the server is unavailable. This does not alter mandatory ordinary POS offline behavior from Phase 2A.

## Commercial policy gates

The authoritative open-policy ledger is `docs/requirements/PHASE_3B_POLICY_DECISIONS.md`.

### P3B-01 — Remaining-balance due point — OPEN

Need an explicit rule for when remaining balance becomes mandatory. Until resolved, no shipment/balance enforcement is implemented.

### P3B-02 — Partial shipments — OPEN

Need an explicit rule for whether partial shipment is allowed and how it interacts with payment. Until resolved, no Fares business shipment authorization is implemented.

### P3B-03 — Deposit rule — OPEN

Need an explicit negotiated/default/minimum rule. No amount or percentage is currently accepted. Until resolved, no Phase 3B deposit routine is implemented.

### P3B-04 — Change/cancellation after approval/deposit — OPEN

Need explicit edit/cancellation/deposit-treatment rules. Until resolved, no confirmed-order cancellation/refund/credit behavior is implemented.

## Explicit exclusions until separately authorized

- B2B refund/credit-note policy;
- automated legal/electronic contracts/signatures;
- credit limits/scoring or invented automated payment terms;
- legal/tax finalization beyond selected Odoo mechanics;
- automated bank integration;
- cards/wallets;
- raw/WIP inventory;
- procurement planning;
- automated customer messaging;
- public online purchasing;
- production deployment or real-data migration.

## Hosted validation contract — policy-neutral slice

The expanded policy-neutral gate is **satisfied** at application SHA `70e8c4d781106d894ded5a506c05b8c789ca9e05`.

The exact-head gate proved:
- Sales/BD can create/progress allowed assigned enquiry/design/sample records;
- unauthorized roles cannot mutate protected business workflow through ORM/API;
- direct protected sample-state/audit writes are denied;
- Sales/BD lead contact details do not silently mutate linked partner records;
- sample approval is attributable and separate from order/payment/shipment state;
- draft quotation is denied before approval and linked natively after approval;
- repeated draft-quotation action is retry-safe;
- candidate draft details can be prepared through the guarded editor without granting broad sale-order mutation;
- draft-editor repeated save is replacement-safe and has no payment/picking/confirmation effects;
- ordinary quotation relinking into a business opportunity is denied outside the guarded path;
- Fares business quotation/order `action_confirm()` fails closed while commercial policy gates remain open;
- ordinary non-business sale behavior remains unaffected;
- EN/AR/RTL representative business/editor UI, localized Arabic title/actions, keyboard focus and desktop/narrow rendering pass;
- all Phase 1–3A regressions remain green;
- repeatable upgrade succeeds for `fu_core,fu_retail,fu_preorder,fu_production,fu_business` on the same exact application SHA.

## Exit criteria

### Expanded policy-neutral verification milestone — COMPLETE

Application/test authority: **`70e8c4d781106d894ded5a506c05b8c789ca9e05`**.

Run `34617949241`, job `103324461450`: **108 tests, 0 failures, 0 errors**, successful repeatable five-addon upgrade, retained English and Arabic/RTL desktop/narrow enquiry and draft-editor evidence.

Artifact: `10271630267`, `phase3b-business-70e8c4d781106d894ded5a506c05b8c789ca9e05`, digest `sha256:a466f88680fa7faf39c52cd63a9d60cda122ad966bf9ea9f9290fa4a0d2b9444`.

This milestone does **not** close Phase 3B.

### Full Phase 3B closure — OPEN

Phase 3B closes only when P3B-01 through P3B-04 are explicitly decided or explicitly excluded with an agreed fail-closed behavior, all accepted commercial/payment/shipment rules are server-enforced, role boundaries and EN/AR/RTL are proven, prior regressions remain green, and repeatable upgrades pass on the exact later application SHA.
