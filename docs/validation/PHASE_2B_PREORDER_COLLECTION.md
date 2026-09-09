# Phase 2B preorder, balance and collection validation

## Scope and authority

Client direction on 2026-09-10 authorizes continued remote development and hosted debugging on `phase-2b/preorder-balance-collection`, without merge. Policy decisions are recorded in [Phase 2B policy decisions](../requirements/PHASE_2B_POLICY_DECISIONS.md). The [phase contract](../phases/PHASE_2B_PREORDER_COLLECTION.md) still owns full exit criteria.

## Original hosted failure

Implementation: `9e8119721246fec1d3f5ee2dc2ec1cdf78e9d317`.
[Run 34401548535](https://github.com/faresmohamed260/fares-uniform/actions/runs/34401548535), job `102634388671`: failure.

The actual hosted result is **0 failed, 2 errors out of 45 tests**, not the prior conversation's 37/38 description. Both failing preorder tests stop in `_seed_store` at `fu.stock.movement.request._fu_validate_business_contract`: `Opening counts require a batch reference.` Repeatable upgrade was skipped.

This run does not reach the purported duplicate-S reservation failure. No such traceback is established by the available branch run history.

## Evidence-supported correction and trace

Correction head: `1642eee39a11ffd83305cb9f56e2bb5aae7119fe`.

Only `addons/fu_preorder/tests/test_preorder.py` changes:
- provide the required synthetic opening-count batch reference;
- assert two distinct fixture variants and one sale line for each;
- assert two free units per variant at the Retail Store before allocation;
- assert one stock move per sale line, matching product and source location;
- assert each move requests/reserves one unit and leaves one unit free.

At this fixture correction head, production allocation code is unchanged. The static trace is:
1. the template creates S/M variants; the preorder payload uses their distinct IDs;
2. `fu_create_preorder` copies each requested product ID into its native sale line;
3. `fu_allocate_ready` creates moves using each line's product ID, quantity and store source;
4. pinned Odoo `stock.move._prepare_merge_moves_distinct_fields` includes product ID;
5. `stock.move._action_assign` passes each move's product/source through `_update_reserved_quantity_vals`;
6. `stock.quant._get_gather_domain` filters by exact product ID and source location/subtree.

Pinned Odoo remains `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`. No core fork or speculative variant/allocator rewrite was made.

## Follow-up hosted failure and compatibility correction

[Run 34406519921](https://github.com/faresmohamed260/fares-uniform/actions/runs/34406519921), job `102650688899`, tested fixture head `1642eee39a11ffd83305cb9f56e2bb5aae7119fe`: **0 failures, 1 error out of 45 tests**. The fixture/product/line/free-stock assertions pass. Allocation then stops at native move creation with `ValueError: Invalid field 'name' in 'stock.move'`.

Correction `afe867a742173a8801d4e30c0607a1d6fde4ed08` removes only the unsupported `name` key from the move-create payload. Pinned Odoo owns move descriptions; product ID, quantities, source/destination and preorder linkage are preserved. This is an Odoo 19 compatibility correction, not a reservation-policy change.

## Verified hosted result

[Run 34407009131](https://github.com/faresmohamed260/fares-uniform/actions/runs/34407009131), job `102652293775`, tested exact implementation `afe867a742173a8801d4e30c0607a1d6fde4ed08`: **SUCCESS — 0 failures, 0 errors out of 45 tests**. The combined `fu_core, fu_retail, fu_preorder` suite and repeatable addon upgrade both pass.

The S/M test proves distinct product identities, two free units each before allocation, one requested/reserved unit per variant at the Retail Store, one free unit each afterward, D-014 rejection before full payment, partial and final physical collection, collection replay and exact completed quantities. A duplicated-S reservation is not reproduced.

Artifact `phase2b-preorder-afe867a742173a8801d4e30c0607a1d6fde4ed08`: ID `10125832168`, digest `sha256:a941dac6717f507c1e82770a86a8eac4b492d81fb66378d522055d3c9ead97d2`.

Subsequent documentation-only commits do not represent newer tested application code. No merge or deployment occurred.

## Reservation/POS and direct-native-mutation boundary — red checkpoint

Boundary implementation: `dabd3edb22c25cf22acdec078d146ff7678490b7` (`test(preorder): protect reservations from POS checkout`).

This slice adds:
- a `fu_preorder` server guard before native POS stock effects so ordinary checkout cannot intentionally consume quantity already reserved as Ready for collection;
- a native POS integration regression for one unallocated unit followed by a second sale attempt against two preorder-reserved units;
- direct native-record mutation denial coverage for Cashier-level access, so the bounded preorder services do not become a back door to broad Sales/Accounting/Stock mutation.

[Run 34409189514](https://github.com/faresmohamed260/fares-uniform/actions/runs/34409189514), job `102659354063`, tested exact implementation `dabd3edb22c25cf22acdec078d146ff7678490b7`: **FAILURE — 40 tests, 1 failure, 0 errors**. Evidence upload succeeded; repeatable addon upgrade was skipped after the test step failed.

The failing regression is `TestFaresPreorderSecurityBoundary.test_native_records_still_refuse_direct_cashier_mutation`: an expected `AccessError` was not raised. The retained hosted log establishes the authorization-boundary failure but, from the available excerpt, does not justify naming one specific native write as the culprit. The next change must identify the exact bypass and close it without weakening the test or granting broad native Sales/Accounting/Stock mutation rights.

Because the exact-head gate is red, this run does **not** validate the new reservation-versus-POS guard as complete even though that guard is present in the code. Keep the last green server checkpoint `afe867a742173a8801d4e30c0607a1d6fde4ed08` distinct from this newer red application/test checkpoint.

## Remaining phase gates

Phase 2B remains incomplete. First close the direct native-mutation authorization gap and rerun the exact-head hosted Phase 2B gate so the same run proves the reservation-versus-ordinary-POS boundary and repeatable addon upgrade. After that server/security boundary is green, continue the phase contract's bounded native preorder UI plus EN/AR RTL rendered/interaction validation. No deployment, real data migration, refund/exchange behavior or merge is implied.
