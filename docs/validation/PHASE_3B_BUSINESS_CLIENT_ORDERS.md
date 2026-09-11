# Phase 3B validation — business-client workflow

Status: **ACTIVE — POLICY-NEUTRAL FIRST SLICE NOT YET VERIFIED.**

Branch: `phase-3b/business-client-orders`.

Starting Phase 3A documentation lineage: `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

Inherited last green application authority: Phase 3A SHA `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`, workflow `Phase 3A preorder production`, run `34601274874`, job `103268897396`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Validation ownership

This document owns the exact-hosted Phase 3B chronology and must distinguish:
- policy-neutral enquiry/sample implementation;
- later policy-enabled commercial implementation;
- hosted-tested application SHAs;
- browser/rendered evidence;
- repeatable upgrade evidence;
- later documentation-only commits.

A safe-slice green result does not close full Phase 3B while P3B-01 through P3B-04 remain open.

## Required first-slice gate

The first authoritative `fu_business` SHA must pass a hosted exact-head gate on pinned Odoo Community 19 proving at least:

1. Fares Sales/BD can create an assigned business-client enquiry without gaining unrelated broad administration;
2. Cashier, Inventory Staff and Production Manager cannot create or mutate the protected business workflow;
3. design requirements and sample context remain attached to native `crm.lead` rather than a parallel CRM ledger;
4. direct write of protected sample-state/audit fields is denied;
5. valid sample transitions work and invalid transitions fail closed;
6. sample sent/approval/rejection actor and timestamps are attributable;
7. approved sample does not itself create payment, stock, picking or confirmed sale effects;
8. native-linked draft quotation creation is denied before sample approval and allowed after approval;
9. repeated draft-quotation action is retry-safe and does not silently create duplicate commercial identities;
10. a Fares business quotation/order cannot be confirmed server-side while P3B-01 through P3B-04 remain unresolved;
11. ordinary non-business sale behavior is not globally blocked by the Phase 3B guard;
12. EN/AR/RTL business workflow UI, keyboard focus and desktop/narrow rendering pass;
13. all prior Phase 1 through Phase 3A regressions remain green;
14. repeatable upgrade succeeds for `fu_core,fu_retail,fu_preorder,fu_production,fu_business` on the same database and exact application SHA.

## Evidence to pin

For every authoritative run record:
- application SHA;
- workflow/run/job IDs;
- tests/failures/errors;
- repeatable-upgrade conclusion;
- artifact ID/name/digest;
- representative screenshot names;
- browser-console outcome;
- red-run chronology/root-cause fixes;
- docs-only lineage separately from tested application authority.

## Chronology

### Phase 3B contract

`e1bcfdec0b2597971af8ba2f24daf459dfa8d89d` — `docs(phase3b): define business-client order contract`.

Defines the confirmed business-client workflow and preserves P3B-01 through P3B-04 as unresolved commercial policy gates.

### Pinned-Odoo architecture

`d27b437ebb99962bd429cf8f990b1870afdcedf2` — `docs(phase3b): record business workflow ownership`.

Selects native `crm.lead` as enquiry/contact truth, native `sale.order` via `sale_crm` as later commercial truth, and native sale-stock pickings as later shipment truth. Defines the policy-neutral sample/quotation slice and mandatory confirmation guard.

### Commercial policy ledger

`e311c95592354ce696bd9b8e1123ab14eac2b6cb` — `docs(phase3b): isolate open commercial policy gates`.

Keeps remaining-balance timing, partial shipments, deposit rule and post-approval change/cancellation treatment open while explicitly permitting the pre-commercial enquiry/sample slice.

No Phase 3B application implementation or runtime validation has been completed yet.
