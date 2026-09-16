# Phase 2B preorder, balance and collection validation

## Scope and authority

Client direction on 2026-09-10 authorized continued remote development and hosted debugging on `phase-2b/preorder-balance-collection`, without merge. Policy decisions are recorded in [Phase 2B policy decisions](../requirements/PHASE_2B_POLICY_DECISIONS.md). The [phase contract](../phases/PHASE_2B_PREORDER_COLLECTION.md) owns the exit criteria.

**Final status on 2026-09-11: COMPLETE.** The authoritative Phase 2B application/test implementation is `af64b858cf6f2be6a143bb19e836721abc216221`. The later cleanup commit `80c41e68104e0a3274090acf190790eead1aaafc` removes only the temporary UI diagnostic workflow and must not be mistaken for a newer tested application SHA. Documentation commits after cleanup likewise do not supersede the tested application authority.

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

## Early verified server result

[Run 34407009131](https://github.com/faresmohamed260/fares-uniform/actions/runs/34407009131), job `102652293775`, tested exact implementation `afe867a742173a8801d4e30c0607a1d6fde4ed08`: **SUCCESS — 0 failures, 0 errors out of 45 tests**. The combined `fu_core, fu_retail, fu_preorder` suite and repeatable addon upgrade both pass.

The S/M test proves distinct product identities, two free units each before allocation, one requested/reserved unit per variant at the Retail Store, one free unit each afterward, D-014 rejection before full payment, partial and final physical collection, collection replay and exact completed quantities. A duplicated-S reservation is not reproduced.

Artifact `phase2b-preorder-afe867a742173a8801d4e30c0607a1d6fde4ed08`: ID `10125832168`, digest `sha256:a941dac6717f507c1e82770a86a8eac4b492d81fb66378d522055d3c9ead97d2`.

## Reservation/POS and direct-native-mutation boundary — retained red checkpoint

Boundary implementation: `dabd3edb22c25cf22acdec078d146ff7678490b7` (`test(preorder): protect reservations from POS checkout`).

This slice adds:
- a `fu_preorder` server guard before native POS stock effects so ordinary checkout cannot intentionally consume quantity already reserved as Ready for collection;
- a native POS integration regression for one unallocated unit followed by a second sale attempt against preorder-reserved stock;
- direct native-record mutation denial coverage for Cashier-level access, so the bounded preorder services do not become a back door to broad Sales/Accounting/Stock mutation.

[Run 34409189514](https://github.com/faresmohamed260/fares-uniform/actions/runs/34409189514), job `102659354063`, tested exact implementation `dabd3edb22c25cf22acdec078d146ff7678490b7`: **FAILURE — 40 tests, 1 failure, 0 errors**. Evidence upload succeeded; repeatable addon upgrade was skipped after the test step failed.

The failing regression is `TestFaresPreorderSecurityBoundary.test_native_records_still_refuse_direct_cashier_mutation`: an expected `AccessError` was not raised. The retained hosted log establishes the authorization-boundary failure but does not justify naming one specific native write as the culprit.

## Verified reservation/security checkpoint

Implementation `2816a8cbe1dce703ae0310b242d34ef92f0c6928` closed the direct-native-mutation and allocation/POS boundary.

Relevant lineage:
- `248e77e6d66fd8d2cf630b07708f32159b90bec4` adds create/write/unlink guards for linked native preorder pickings and moves. Ordinary non-elevated native mutation is denied; approved service execution remains elevated after its business checks.
- `1102cc6ddc8225dbc6a8985dfa116f3e2896f0e7` isolates the Sales Order, Sales line, payment, picking and move denial tests.
- `552ac8e3ca468a314b44c83342bfccc372b0a381`, `04164dc70b9d666543d20c698167893d0bbb5414` and `eb48586d37d994841c0a2603d8de52ddfa6f75b8` make the POS fixture deterministic, use the pinned session API and supply a self-contained synchronization payload.
- `2816a8cbe1dce703ae0310b242d34ef92f0c6928` restores the full combined validation workflow after diagnostic bisection.

[Run 34428218381](https://github.com/faresmohamed260/fares-uniform/actions/runs/34428218381), job `102717890627`, tested that exact HEAD: **SUCCESS — 0 failed, 0 errors out of 51 tests**. The hosted job log records all five isolated direct-mutation tests and `TestPreorderPOSReservationBoundary.test_pos_can_sell_only_free_stock_and_replay_cannot_consume_reservation`. The combined `/fu_core,/fu_retail,/fu_preorder` gate and repeatable addon upgrade both pass on pinned Odoo.

The current POS regression seeds two store units and reserves one: ordinary POS sells the free unit, a second sale against the reserved unit is rejected and rolled back, and replay of the first UUID keeps one order/picking while the preorder reservation remains assigned.

Artifact `phase2b-preorder-2816a8cbe1dce703ae0310b242d34ef92f0c6928`: ID `10133552960`, digest `sha256:f3913b42d90e1dfbd75102c8eadc77fa445bc6622bbe5360e42679bb67825fcb`.

## UI diagnostic chronology and final corrections — 2026-09-11

The native Phase 2B operational UI uses the existing Odoo model as authority and adds a read-only preorder workspace plus transient create, payment, readiness-allocation and collection wizards. The browser-facing online guard fails Phase 2B mutations closed during connectivity loss. Arabic translations and RTL validation are part of the exit contract.

Important UI/test lineage retained for audit:
- `a84d1d157269df270781e82b1e23649465646b17` — initial native preorder operations UI;
- `1a07f16731555b9f1188fa32c599e8b8580a228e` — UI search-control correction;
- `db3764e426711cfb4b3c6b80e4d686ff07aa4d2e` — hosted browser fixture setup runs guarded preorder operations as Owner/admin rather than weakening production authorization;
- `5bfecb5c1904354b0daf46c349ea54caee8f084c` — Odoo selection-translation occurrence metadata;
- `a0941519c268964f0b16f5c2c1451af987b0d3f9` — collection dialog footer lookup waits for `button[name="action_collect"]` instead of querying immediately after the dialog shell appears;
- `434a4f5add4f6acebae31b57a7cd7721f3c353f5` — Arabic collection header-action render synchronization;
- `09ac573b639b8d6a36fff15538b138e687313cdd` — diagnostic-only Arabic control-group comparison head.

Diagnostic run `34536257546` at `09ac573b639b8d6a36fff15538b138e687313cdd` remained red while native/core Arabic control jobs were green. Payment-Arabic failed with `Error: Record payment action missing`; collection-Arabic failed with `Error: Timed out waiting for button text: تسجيل الاستلام`. These failures established that the remaining issue was Phase 2B header method-action discovery/render synchronization rather than a generic Arabic/RTL stack failure.

### Native header-action selector correction

Commit `23e8b42032db3ce68fd8ef49eb11467cbd2720e2` (`test(preorder): wait for native header actions`) changes only `addons/fu_preorder/tests/test_ui.py`.

Pinned Odoo renders these controls as native form-header `type="action"` buttons whose semantic identity is the resolved action ID in the button `name` attribute. Browser tests therefore wait for `.o_form_statusbar button[name="<action_id>"]` and then separately assert the localized label. This removes a visible-text discovery race without weakening Arabic, keyboard-focus, online-guard or RTL assertions.

Diagnostic run `34541941315` showed payment EN/AR, allocation EN, creation EN, and native/core Arabic controls green. The collection-Arabic path then reached the semantic action selector and failed only its independent localized-label assertion, proving the selector synchronization itself was fixed.

### Arabic PO import/binding correction

The remaining localization root cause was in `addons/fu_preorder/i18n/ar.po`: translated `msgstr` values existed, but the affected entries lacked Odoo occurrence references. Odoo's PO importer iterates occurrences and binds only recognized `model`, `model_terms`, or `code` entries; unreferenced translations therefore were not imported for the runtime terms.

Commit `af64b858cf6f2be6a143bb19e836721abc216221` (`fix(preorder): bind Arabic UI translations`) adds the required occurrence metadata for preorder actions, menus, views, wizard fields, guard text and payment/collection UI strings. It does not weaken tests or alter business/security logic.

## Final authoritative Phase 2B acceptance

Authoritative application/test SHA: **`af64b858cf6f2be6a143bb19e836721abc216221`**.

[GitHub Actions run 34547236245](https://github.com/faresmohamed260/fares-uniform/actions/runs/34547236245), job `103102402060`, workflow `Phase 2B preorder balance collection`: **SUCCESS**.

GitHub records the run as `completed/success` with head SHA `af64b858cf6f2be6a143bb19e836721abc216221`. The single authoritative job is also `completed/success`. Its acceptance steps include:
- `Install addons and run Phase 1 plus Phase 2A plus Phase 2B tests` — success;
- `Prove repeatable addon upgrade` — success;
- `Summarize evidence` — success;
- `Upload exact-head evidence` — success.

The final artifact is:
- name: `phase2b-preorder-af64b858cf6f2be6a143bb19e836721abc216221`;
- artifact ID: `10179559978`;
- size: `874081` bytes;
- digest: `sha256:750edfe5938d5aa279f2eddfc16bd80504689e885b8ce32d9dd2ed94849bcb29`;
- recorded workflow head SHA: `af64b858cf6f2be6a143bb19e836721abc216221`.

This authoritative run supersedes the earlier red UI diagnostics for phase-exit purposes. The red runs remain retained above as debugging history rather than current acceptance state.

## Cleanup and application/docs lineage

After the green application proof, the temporary diagnostic workflow `.github/workflows/phase2b-ui-diagnostic.yml` was removed in commit **`80c41e68104e0a3274090acf190790eead1aaafc`** (`chore(preorder): remove UI diagnostic workflow`). That commit's direct parent is the green application SHA `af64b858cf6f2be6a143bb19e836721abc216221`.

The diagnostic workflow is absent from the current branch. The cleanup commit contains no newer application validation authority. Documentation-only closure commits after `80c41e...` likewise record evidence and project state; they do not replace `af64b858...` as the tested implementation.

## Phase result

Phase 2B exit criteria are satisfied for the approved slice:
- preorder identity/payment/balance/collection remain Odoo-authoritative and attributable;
- D-014 full-balance-before-any-collection remains server-enforced;
- partial readiness and partial collection preserve remaining quantities;
- reservation/ordinary-POS interaction and replay are covered;
- direct native mutation boundaries are enforced by hosted regressions;
- preorder creation, payment and collection remain online-only and fail closed during connectivity loss;
- representative EN and Arabic/RTL UI paths are part of the hosted acceptance work;
- Phase 1 and Phase 2A regressions remain in the combined authoritative gate;
- repeatable `fu_core + fu_retail + fu_preorder` upgrade passes;
- exact-head evidence upload passes.

**Phase 2B is closed.** No deployment, real-data migration, refund/exchange execution, bank API integration or merge occurred. Refund/exchange policy and execution remain a later retail slice. No PR merge is authorized without explicit client approval.
