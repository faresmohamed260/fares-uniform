# Phase 3B validation — business-client workflow

Status: **COMPLETE — POLICY-ENABLED COMMERCIAL EXECUTION VERIFIED.**

Branch: `phase-3b/business-client-orders`.

Starting Phase 3A documentation lineage: `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

Authoritative Phase 3B application/test SHA: **`d6efa76a99c0732423b354d2d9f787f6ccbdebec`**.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

P3B-01 through P3B-04 are accepted in `docs/requirements/PHASE_3B_POLICY_DECISIONS.md` and are implemented for the bounded MVP business-client path. B2B refunds/credits, post-confirmation commercial amendments, partial shipments, customer credit terms, cards/wallets, bank API automation, deployment and real-data migration remain excluded.

## Validation ownership

This document owns the exact hosted Phase 3B chronology and distinguishes:
- the earlier policy-neutral enquiry/sample/draft-detail milestone;
- the accepted commercial policy decisions;
- the policy-enabled payment/confirmation/shipment implementation;
- red-run causes and fixes;
- the final hosted-tested application authority;
- later documentation-only closure commits.

## Accepted commercial rules proven

The final gate proves the following server-side behavior:

1. business-client enquiry/design/sample work remains on native `crm.lead` with bounded Sales/BD scope;
2. draft commercial identity remains native `sale.order` / `sale.order.line` and is created only after sample approval;
3. a negotiated positive business payment is required before commercial confirmation;
4. no fixed/default deposit percentage is invented;
5. payment recording is retry-safe and cannot overpay the order;
6. InstaPay requires positive staff confirmation of the observed bank notification when its journal is configured that way;
7. Sales/BD cannot spoof internal execution context to bypass protected writes;
8. after any posted business payment, Sales/BD commercial edits are denied;
9. Owner/Admin may make a controlled post-payment draft commercial change with actor/time attribution;
10. after commercial confirmation, the Fares workflow does not permit commercial-line mutation;
11. draft cancellation is allowed only before money is recorded;
12. once money is recorded, cancellation/payment rewrite is blocked rather than inventing refund, forfeiture or credit behavior;
13. the entire remaining balance must be zero before customer shipment release;
14. partial customer shipment/backorder release is blocked for this MVP;
15. every ordered quantity must be physically available in the single customer delivery before release;
16. Sales/BD cannot validate/release the shipment;
17. Inventory Staff / Store Manager shipment execution remains bounded to assigned Fares stock-location scope;
18. Owner/Admin authority on shared native models does not accidentally narrow authority for existing multi-role users;
19. ordinary non-business sale/payment/stock behavior remains unaffected;
20. all prior Phase 1 through Phase 3A regressions remain green;
21. EN/AR/RTL business enquiry, draft-editor, payment and delivery UI checks pass on desktop and narrow layouts;
22. repeatable upgrade succeeds for `fu_core,fu_retail,fu_preorder,fu_production,fu_business` on the same database and exact application SHA.

## Final authoritative green gate

Application SHA: **`d6efa76a99c0732423b354d2d9f787f6ccbdebec`**.

Workflow: `Phase 3B business clients`.

Run: **`34634425338`**.

Job: **`103378750321`** (`business-workflow`).

Run result: **success**.

Combined test result:

`0 failed, 0 error(s) of 118 tests when loading database 'fares_phase3b'`.

Repeatable upgrade result: **success** for `fu_core,fu_retail,fu_preorder,fu_production,fu_business` on the same database and exact application SHA. The retained upgrade log contains the already-known `fu_preorder` translation-at-import diagnostic; all five Fares addons load and the Odoo registry completes successfully.

Exact-head evidence artifact:
- ID: **`10277960160`**;
- name: `phase3b-business-d6efa76a99c0732423b354d2d9f787f6ccbdebec`;
- digest: **`sha256:109ce8fd952f8389caafaf727a75dd3a7b0aed033d1fd5cccb5c661f862281da`**;
- created: 2026-09-11T18:45:56Z;
- expiry recorded by GitHub: 2026-09-18T18:45:54Z.

Retained runtime evidence:
- Fares head `d6efa76a99c0732423b354d2d9f787f6ccbdebec`;
- Odoo head `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`;
- Python 3.12.14;
- Google Chrome 152.0.7977.82;
- rtlcss 4.3.0.

Representative final Phase 3B screenshots include:
- `business_clients_en_desktop_20260911_184451_111244_test_business_clients_english.png`;
- `business_clients_ar_desktop_20260911_184448_239272_test_business_clients_arabic_rtl.png`;
- `business_draft_editor_en_desktop_20260911_184518_192528_test_business_draft_editor_english.png`;
- `business_draft_editor_ar_desktop_20260911_184515_455645_test_business_draft_editor_arabic_rtl.png`;
- `business_payment_en_desktop_20260911_184531_834548_test_business_payment_english.png`;
- `business_payment_en_narrow_reduced_20260911_184531_978704_test_business_payment_english.png`;
- `business_payment_ar_desktop_20260911_184529_072581_test_business_payment_arabic_rtl.png`;
- `business_payment_ar_narrow_reduced_20260911_184529_225624_test_business_payment_arabic_rtl.png`;
- `business_delivery_en_desktop_20260911_184504_679276_test_business_delivery_english.png`;
- `business_delivery_en_narrow_reduced_20260911_184504_830154_test_business_delivery_english.png`;
- `business_delivery_ar_desktop_20260911_184502_223980_test_business_delivery_arabic_rtl.png`;
- `business_delivery_ar_narrow_reduced_20260911_184502_360965_test_business_delivery_arabic_rtl.png`.

Manual review of the final evidence confirms usable desktop/narrow payment and delivery layouts, Arabic RTL rendering, localized payment/release controls and warnings, and no application JavaScript/test exception. The browser logs end with `test successful`; remaining Chrome stderr is ordinary headless-runner environment noise.

## Red-to-green chronology

### Policy-neutral foundation and verified milestone

`e1bcfdec0b2597971af8ba2f24daf459dfa8d89d` — defined the Phase 3B business-client contract.

The policy-neutral enquiry/sample/draft-detail work was ultimately verified at application SHA **`70e8c4d781106d894ded5a506c05b8c789ca9e05`**, run `34617949241`, job `103324461450`, with **108 tests, 0 failures, 0 errors**, a successful five-addon repeatable upgrade, and artifact `10271630267` / digest `sha256:a466f88680fa7faf39c52cd63a9d60cda122ad966bf9ea9f9290fa4a0d2b9444`.

That milestone intentionally did not enable payment/confirmation/shipment until the client resolved P3B-01 through P3B-04.

### Commercial policies accepted

`cc0a52361b1e0c87ebc94a2059aa8ae973b453d4` — `docs(phase3b): accept commercial execution policies`.

The accepted rules require full balance before shipment, prohibit partial customer shipment in MVP, use a freely negotiated positive deposit up to the order total, require Owner/Admin approval for post-payment draft commercial changes, and fail closed on cancellation once money exists.

### First policy-enabled implementation — red

`57c36661e38f100217f8cd1b3dd6cacc17731411` — `feat(business): enable approved commercial execution`.

Run **`34627489784`**, job **`103356009123`**: combined tests failed with **1 failure and 21 errors of 118 tests**; repeatable upgrade was correctly skipped.

Artifact:
- ID `10274817487`;
- name `phase3b-business-57c36661e38f100217f8cd1b3dd6cacc17731411`;
- digest `sha256:d2359527cf9d2593b1a6c01c2dbe1ab90accc858aec17d107b9d488b99dcdef4`.

The broad regression root cause was record-rule composition on shared native stock models: the new Owner/Admin rules used a business-only domain. Existing synthetic retail users that also carry Owner/Admin therefore lost ordinary stock visibility through the intersection of applicable global/group rules. The established Fares convention is that Owner/Admin rules on shared native models are non-restrictive; operational stock roles carry the bounded location domain.

The same run also exposed two test-layer issues: stale ORM reservation cache after a deliberately rejected shipment attempt, and a brittle English browser assertion against the `Stock scope` group heading rather than stable location fields.

### Owner/multi-role and test hardening — second red

`a26e1dce5e451a5114e05e8425b69ddc64a30cd1` — `fix(business): preserve owner and stock workflow scope`.

This narrow follow-up:
- restored non-restrictive Owner/Admin rules on shared native models;
- retained bounded assigned-location scope for operational stock roles;
- invalidated picking/move cache after the expected failed reservation savepoint;
- replaced the brittle delivery group-heading assertion with stable stock-location field presence.

No accepted payment or shipment policy was weakened.

Run **`34632722124`**, job **`103373201310`** then improved to **0 failures and 1 error of 118 tests**; the repeatable upgrade was again correctly skipped.

Artifact:
- ID `10277746414`;
- digest `sha256:952dbc10f1d0d6c7450f48d120ab85a4bba18fd8acf59b3ae9aa51d1aef38699`.

The only remaining error was `test_full_balance_and_full_stock_are_required_for_complete_shipment`: after proving release failed at one unit of stock, the test called the Fares `opening` stock operation with quantity `2` and expected it to add two units.

### Opening-count fixture correction — final green

Remote source inspection of `fu.stock.movement.request` proved that the `opening` operation is an **absolute inventory count**, not an additive receipt. Therefore the test had left on-hand stock at 2 against ordered demand 3; the production code correctly refused release.

`d6efa76a99c0732423b354d2d9f787f6ccbdebec` — `test(business): seed full shipment stock count` changed only the final synthetic opening count from `2` to `3`.

The one-line test correction does not alter application, security, payment or shipment behavior. It makes the fixture actually represent the accepted condition “all three ordered units are physically available.”

Run `34634425338`, job `103378750321`: **green, 118 tests, 0 failures, 0 errors**, followed by a successful repeatable five-addon upgrade and retained EN/AR/RTL evidence.

## Application authority vs closure documentation

Treat **`d6efa76a99c0732423b354d2d9f787f6ccbdebec`** as the Phase 3B **application authority**.

Any later documentation-only closure commits on `phase-3b/business-client-orders` do not become newer application proof merely by becoming branch HEAD.

## Remaining exclusions

Phase 3B closure does not authorize or define:
- B2B deposit refund/forfeiture policy;
- B2B credit notes/refunds;
- post-confirmation commercial amendment workflow;
- partial customer shipment/backorders;
- customer credit terms or pay-after-delivery terms;
- cards/wallets;
- automated bank integration;
- raw/WIP inventory or procurement planning;
- automated customer messaging;
- public online purchasing;
- production deployment or real-data migration.

Those remain later bounded work.