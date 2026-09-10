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

## Current verified reservation/security checkpoint

Remote branch verified on 2026-09-10: `phase-2b/preorder-balance-collection`, exact implementation HEAD `2816a8cbe1dce703ae0310b242d34ef92f0c6928`. GitHub's default branch remains `main` at `0e75d9a067eb741d77fdac1de03bc6c17fc80858`; it is not the active Phase 2B implementation branch.

The active branch is 11 commits ahead of prior documentation handoff `65bba31aa53f374acb1e99b508db64cd61b15972`. Current remote source and hosted logs supersede that stale red handoff:
- `248e77e6d66fd8d2cf630b07708f32159b90bec4` adds create/write/unlink guards for linked native preorder pickings and moves. Ordinary non-elevated native mutation is denied; approved service execution remains elevated after its business checks.
- `1102cc6ddc8225dbc6a8985dfa116f3e2896f0e7` isolates the Sales Order, Sales line, payment, picking and move denial tests.
- `552ac8e3ca468a314b44c83342bfccc372b0a381`, `04164dc70b9d666543d20c698167893d0bbb5414` and `eb48586d37d994841c0a2603d8de52ddfa6f75b8` make the POS fixture deterministic, use the pinned session API and supply a self-contained synchronization payload.
- `2816a8cbe1dce703ae0310b242d34ef92f0c6928` restores the full combined validation workflow after diagnostic bisection.

[Run 34428218381](https://github.com/faresmohamed260/fares-uniform/actions/runs/34428218381), [job 102717890627](https://github.com/faresmohamed260/fares-uniform/actions/runs/34428218381/job/102717890627), tested that exact HEAD: **SUCCESS — 0 failed, 0 errors out of 51 tests**. The hosted job log explicitly records all five isolated direct-mutation tests and `TestPreorderPOSReservationBoundary.test_pos_can_sell_only_free_stock_and_replay_cannot_consume_reservation`. The combined `/fu_core,/fu_retail,/fu_preorder` gate and repeatable addon upgrade both pass on pinned Odoo `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

The current POS regression seeds two store units and reserves one: ordinary POS sells the free unit, a second sale against the reserved unit is rejected and rolled back, and replay of the first UUID keeps one order/picking while the preorder reservation remains assigned. This is the actual current fixture, superseding the older three-unit description above.

Artifact `phase2b-preorder-2816a8cbe1dce703ae0310b242d34ef92f0c6928`: ID `10133552960`, digest `sha256:f3913b42d90e1dfbd75102c8eadc77fa445bc6622bbe5360e42679bb67825fcb`. Run/job metadata, decoded hosted logs, workflow source and artifact metadata were reviewed remotely. Earlier diagnostic failures remain in GitHub history; the narrower green diagnostic run `34427854358` is not the full-gate authority.

## UI implementation and hosted diagnostic checkpoint — 2026-09-11

The native Phase 2B operational UI is implemented. It uses the existing Odoo model as authority and adds a read-only preorder workspace plus transient create, payment, readiness-allocation and collection wizards. The browser-facing online guard fails Phase 2B mutations closed during connectivity loss. Arabic translations and RTL validation remain part of the exit contract.

Important UI/test lineage retained for audit:
- `a84d1d157269df270781e82b1e23649465646b17` — initial native preorder operations UI;
- `1a07f16731555b9f1188fa32c599e8b8580a228e` — UI search-control correction;
- `db3764e426711cfb4b3c6b80e4d686ff07aa4d2e` — hosted browser fixture setup runs guarded preorder operations as Owner/admin rather than weakening production authorization;
- `5bfecb5c1904354b0daf46c349ea54caee8f084c` — Odoo selection-translation occurrence metadata;
- `a0941519c268964f0b16f5c2c1451af987b0d3f9` — collection dialog footer lookup waits for `button[name="action_collect"]` instead of querying immediately after the dialog shell appears;
- `434a4f5add4f6acebae31b57a7cd7721f3c353f5` — later Arabic collection header-action render synchronization;
- `09ac573b639b8d6a36fff15538b138e687313cdd` — current pre-documentation diagnostic head, adding Arabic control-group comparisons. This is diagnostic-only and is not a green application authority.

The latest hosted diagnostic run is [34536257546](https://github.com/faresmohamed260/fares-uniform/actions/runs/34536257546) at exact head `09ac573b639b8d6a36fff15538b138e687313cdd`: **FAILURE**.

Current method/control evidence:
- `UI method core-stock-ar`, job `103068451701`: **SUCCESS**;
- `UI method core-product-ar`, job `103068452590`: **SUCCESS**;
- `UI method payment-ar`, job `103068452209`: **FAILURE**;
- `UI method collection-ar`, job `103068452331`: **FAILURE**.

The completed payment-Arabic job log establishes the exact browser error: **`Error: Record payment action missing`**. The page is loaded in Arabic (`ar_001`), the `fu_preorder` Arabic catalog is loaded, the order form satisfies the ready condition and the failure occurs before the payment dialog opens, when the test searches rendered buttons by visible Arabic text. This is not evidence of a generic Arabic/RTL failure: the current run's native/core Arabic stock/product controls pass.

Payment diagnostic artifact `phase2b-ui-method-payment-ar-09ac573b639b8d6a36fff15538b138e687313cdd`: ID `10175619112`, digest `sha256:10e9d1e429e09fca0fdc22816d0194095b584c89dc265ecf859f800c2edcd766`.

The exact current `collection-ar` failure has **not yet been recorded here**. The next session must fetch job `103068452331` once and use that actual log; do not assume it matches payment merely because both jobs are red.

### Conclusions that must not be reopened without contradictory evidence

Previous hosted isolation already showed that Arabic selection metadata and the rendered partial-collection state work, the collection dialog can open, and the awaited collection dialog footer control was a real synchronization correction. The current control-group evidence additionally shows that native/core Arabic control rendering works. Therefore do not return to repeated PO translation edits, generic RTL theories, or the already-fixed immediate-dialog-footer query as default explanations.

The active problem is now **Phase 2B header method-action discovery/render synchronization**. Inspect how the buttons defined by the Phase 2B native view are rendered by pinned Odoo 19. Prefer a stable semantic/action selector or a deliberate render wait to visible-text-only discovery, while preserving a separate assertion that the presented label is correctly Arabic. Keep the keyboard-focus and RTL capture assertions; a test synchronization fix must not weaken localization or accessibility coverage.

## Remaining phase gates

Phase 2B remains incomplete. The next technical sequence is:
1. read `collection-ar` job `103068452331` once and record its exact current failure;
2. inspect the actual rendered/defined payment and collection header actions against pinned Odoo 19 and apply the smallest evidence-supported synchronization/selector fix;
3. rerun the affected hosted UI methods until payment/collection pass without weakening Arabic-label, keyboard-focus, online-guard or RTL assertions;
4. rerun the authoritative combined `/fu_core,/fu_retail,/fu_preorder` Phase 1 + Phase 2A + Phase 2B gate at one exact application SHA;
5. require the repeatable `fu_core + fu_retail + fu_preorder` addon upgrade to pass;
6. require final hosted screenshot/evidence artifact upload;
7. remove the temporary Phase 2B diagnostic workflow after it is no longer needed;
8. update this validation record and the phase/project status with the exact tested application SHA, run, job, artifact, digest and screenshot paths before marking Phase 2B complete.

The fully verified server/security authority remains `2816a8cbe1dce703ae0310b242d34ef92f0c6928`, run `34428218381`, job `102717890627`. Later UI/diagnostic commits do not supersede that authority until the complete acceptance gate passes. Documentation commits after the diagnostic head likewise do not represent a newer tested application implementation. No deployment, real data migration, refund/exchange behavior or merge occurred.
