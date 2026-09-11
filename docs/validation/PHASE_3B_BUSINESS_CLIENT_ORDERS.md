# Phase 3B validation — business-client workflow

Status: **POLICY-NEUTRAL FIRST SLICE VERIFIED; FULL PHASE 3B REMAINS ACTIVE/POLICY-GATED.**

Branch: `phase-3b/business-client-orders`.

Starting Phase 3A documentation lineage: `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

Authoritative Phase 3B policy-neutral application/test SHA: **`79149f901d03c92fcd5b0ea432637660a2d102cf`**.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Full Phase 3B is not closed. P3B-01 through P3B-04 remain open and commercial confirmation/payment/shipment/cancellation remain fail-closed.

## Validation ownership

This document owns the exact-hosted Phase 3B chronology and distinguishes:
- the verified policy-neutral enquiry/sample implementation;
- later policy-enabled commercial implementation;
- hosted-tested application SHAs;
- browser/rendered evidence;
- repeatable upgrade evidence;
- later documentation-only commits.

The green safe-slice result below is a verified Phase 3B milestone, not full Phase 3B closure.

## Required first-slice gate — result

The exact-head gate proves:

1. Fares Sales/BD can create an assigned business-client enquiry without gaining unrelated broad administration;
2. Cashier, Inventory Staff and Production Manager cannot create the protected business workflow merely from their existing roles;
3. design requirements and sample context remain attached to native `crm.lead` rather than a parallel CRM ledger;
4. direct write of protected sample-state/audit fields is denied;
5. valid sample transitions work and invalid transitions fail closed;
6. sample sent/approval/rejection actor and timestamps are attributable;
7. approved sample does not itself create payment, stock, picking or confirmed-sale effects;
8. native-linked draft quotation creation is denied before sample approval and allowed after approval;
9. repeated draft-quotation action is retry-safe and does not silently create duplicate commercial identities;
10. a Fares business quotation/order cannot be confirmed server-side while P3B-01 through P3B-04 remain unresolved;
11. an ordinary draft quotation cannot be relinked into the protected Fares business path to bypass the confirmation guard;
12. ordinary non-business sale behavior is not globally blocked by the Phase 3B guard;
13. Sales/BD enquiry phone/email changes stay on the business `crm.lead` and do not silently grant or exercise linked `res.partner` write authority;
14. EN/AR/RTL business workflow UI, keyboard focus and desktop/narrow rendering pass;
15. all prior Phase 1 through Phase 3A regressions remain green;
16. repeatable upgrade succeeds for `fu_core,fu_retail,fu_preorder,fu_production,fu_business` on the same database and exact application SHA.

## Authoritative green gate

Application SHA: **`79149f901d03c92fcd5b0ea432637660a2d102cf`**.

Workflow: `Phase 3B business clients`.

Run: **`34608365252`**.

Job: **`103292327204`** (`business-workflow`).

Run result: **success**.

Combined test result:

`0 failed, 0 error(s) of 104 tests when loading database 'fares_phase3b'`.

Repeatable upgrade result: **success** for `fu_core,fu_retail,fu_preorder,fu_production,fu_business` on the same database and exact application SHA. The upgrade log contains the previously known `fu_preorder/models/stock_picking.py` translation-at-import warning; all five modules load and the registry completes successfully.

Exact-head evidence artifact:
- ID: **`10267231815`**;
- name: `phase3b-business-79149f901d03c92fcd5b0ea432637660a2d102cf`;
- digest: **`sha256:be5e61300fd525ca192948ea5cb91874a0942f54fd53dcd4d2195cf68e8d7aae`**;
- created: 2026-09-11T14:14:44Z;
- expiry recorded by GitHub: 2026-09-18T14:14:43Z.

Representative Phase 3B screenshots retained in the artifact:
- `business_clients_en_desktop_20260911_141344_890603_test_business_clients_english.png`;
- `business_clients_en_narrow_reduced_20260911_141345_036852_test_business_clients_english.png`;
- `business_clients_ar_desktop_20260911_141342_593156_test_business_clients_arabic_rtl.png`;
- `business_clients_ar_narrow_reduced_20260911_141342_736294_test_business_clients_arabic_rtl.png`.

Visual review confirms:
- English desktop and narrow layouts remain usable without document-level horizontal overflow;
- Arabic desktop and narrow layouts render in Odoo RTL mode;
- critical sample action, state labels, business-form sections and the commercial-policy warning are localized;
- keyboard-focus assertion passes for the primary sample action;
- synthetic customer/enquiry fixture values remain their original test-data language and are not UI localization defects.

Both retained Phase 3B browser logs end with `test successful`. The remaining Chrome stderr messages are headless runner environment noise such as D-Bus/UPower/GCM warnings, not application JavaScript/test failures.

## Red-to-green chronology

### Contract and architecture

`e1bcfdec0b2597971af8ba2f24daf459dfa8d89d` — `docs(phase3b): define business-client order contract`.

`d27b437ebb99962bd429cf8f990b1870afdcedf2` — `docs(phase3b): record business workflow ownership`.

`e311c95592354ce696bd9b8e1123ab14eac2b6cb` — `docs(phase3b): isolate open commercial policy gates`.

`64b2046dbe41c775003ee68e53852200cfd0b971` — `docs(phase3b): authorize policy-neutral first slice`.

### Initial application — red

`97181b741d890a4823aafdef353ea672945aaa8a` — `feat(business): add policy-gated enquiry and sample workflow`.

Run `34605221838`, job `103281883338`: failed before application tests because Odoo 19 RelaxNG rejected `expand`/decorated attributes on the Phase 3B search-view `<group>`.

Artifact `10266850092`, digest `sha256:95a802dbbb3daba48320784b115e5c4de38f51543d3e62392320368b4d6d2a10` retained the failure.

### Search-view compatibility fix — red at next layer

`17e8ddcaedebd1fcfcf6ce9928733ac3b8f2497d` — `fix(business): use valid Odoo 19 search group`.

Run `34607185301`, job `103288384284`: XML/module installation advanced past the first failure, then the combined gate reported `1 failed, 6 error(s) of 103 tests`.

Artifact `10266779274`, digest `sha256:e212fdd27c6393b46c7f2b7c6b78e24e18204937871e7ee4e1ca70f6b276119c` showed two root causes:
- Sales/BD business lead creation with a linked partner and enquiry phone/email triggered native CRM inverse synchronization into `res.partner`, correctly failing because Sales/BD does not have broad contact-write authority;
- the Arabic browser test did not receive the Phase 3B view-term translations because the PO entries lacked the Odoo `model_terms:ir.ui.view,arch_db:...` source bindings used by already-green project addons.

Remote review also found an untested linkage bypass: an ordinary draft quotation could attempt to become a business quotation by writing a business `opportunity_id` in the same ORM call before the original pre-write business filter classified it.

### Narrow-boundary, localization and linkage hardening — green

`79149f901d03c92fcd5b0ea432637660a2d102cf` — `fix(business): preserve narrow sales contact boundary`.

This commit:
- suppresses native partner phone/email inverse synchronization only for bounded Sales/BD writes on Fares business leads, keeping enquiry details on `crm.lead` without granting contact mutation authority;
- adds regressions proving the linked partner remains unchanged;
- detects and denies ordinary-order relinking into a Fares business opportunity unless the internal guarded path is used;
- adds the correct Odoo view-term and selection metadata to Arabic translations;
- preserves every commercial policy guard.

Run `34608365252`, job `103292327204`: **green**, 104 tests with zero failures/errors plus successful repeatable five-addon upgrade and retained EN/AR/RTL evidence.

## Application authority vs later documentation

Treat **`79149f901d03c92fcd5b0ea432637660a2d102cf`** as the Phase 3B **policy-neutral application authority** until a later application SHA passes an equal-or-stronger Phase 1–3B gate.

Documentation-only commits made after this SHA do not become newer application proof merely by becoming branch HEAD.

## Remaining Phase 3B gate

Full Phase 3B still requires explicit resolution or explicit exclusion of:
- P3B-01 remaining-balance due point;
- P3B-02 partial-shipment policy/payment coupling;
- P3B-03 deposit amount/default/minimum rule;
- P3B-04 post-approval/deposit edits, cancellation and deposit treatment.

Until those decisions are accepted, the verified application intentionally creates no Phase 3B deposit routine, balance-due enforcement, shipment authorization or confirmed-order cancellation/refund/credit path, and business `action_confirm()` remains server-blocked.
