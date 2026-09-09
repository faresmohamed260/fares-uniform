# Phase 2A — Retail checkout/offline validation

Status: **COMPLETE / HOSTED TECHNICAL GATES PASS**

Last updated: 2026-09-09.

This file records hosted evidence for `phase-2a/retail-checkout-offline`. Red runs are retained as evidence and are not described as green. Application implementation evidence and later CI/documentation-only closure commits are distinguished explicitly.

## Validated scope

Production addon: `addons/fu_retail`.

Phase 2A now validates the bounded contract for ordinary finished-stock checkout:
- native Odoo POS/Owl checkout using Phase 1 product variants and stock custody;
- Cash payment;
- positive manual bank-notification confirmation for InstaPay, with no bank API or claim of bank-side verification;
- production-owned Odoo 19 offline-restore compatibility shim;
- paid offline sale persistence across browser reload;
- native Odoo UUID transaction identity across reload, retry and replay;
- reconnect/reconciliation for Cash and positively confirmed InstaPay;
- truthful visible states: Pending sync, Syncing, Synced, Review required and Retryable failure;
- English and Arabic/RTL receipt-state behavior;
- current Fares role revalidation on synchronization;
- revoked-role semantic rejection retained locally for Review required;
- transient transport failure retained locally as Retryable failure;
- exact-once server order/payment/stock effects under retry and lost-ack replay;
- retained Phase 1 product, stock and security regressions;
- repeatable `fu_core` + `fu_retail` addon upgrade.

Native Odoo `pos.order`, `pos.payment`, product and stock records remain authoritative. Fares does not introduce a parallel sales or offline ledger.

## Authoritative final evidence

### Application implementation checkpoint

Application/test implementation: `d8e5ffbac2dddcdc6776a708e079ab7b24f38497` (`test(retail): prove same-uuid lost-ack replay`).

Normal run `34298578791`: **SUCCESS**.
- combined Phase 1 + Phase 2A tests passed;
- browser Cash, confirmed-InstaPay, Arabic/RTL and review paths passed;
- repeatable addon upgrade passed.

Artifact:
- name: `phase2a-retail-d8e5ffbac2dddcdc6776a708e079ab7b24f38497-no-failure-signature`;
- ID: `10084165232`;
- digest: `sha256:2569cdd306a5f3802fcdde6f37137dfc54183f58ebbd22b046fbc2152439dddd`.

Diagnostic run `34298578820`: **SUCCESS** for all eight isolated slices:
1. install `fu_core + fu_retail`;
2. backend payment confirmation;
3. InstaPay cancel/confirm UI;
4. offline Cash reload/reconnect;
5. Arabic offline Cash;
6. offline confirmed-InstaPay reload/reconnect;
7. revoked-cashier Review-required retention;
8. retained Phase 1 `fu_core` regression.

The temporary diagnostic workflow was retained until these isolated paths were green, then retired during closeout.

### Clean normal-workflow checkpoint

CI-cleanup head `6113edcf8d7f27c69e85f4061e0dc6d31b09cc46` removed temporary combined-failure parsing while leaving the authoritative gate intact.

Run `34300005169`: **SUCCESS**.

Artifact:
- name: `phase2a-retail-6113edcf8d7f27c69e85f4061e0dc6d31b09cc46`;
- ID: `10084660295`;
- digest: `sha256:53cadf02a4d1b5720c8a674c01e2b151d46b680f36f44a12e76ba5ec979077f4`.

### Final post-diagnostic closeout gate

The standalone diagnostic workflow was removed at `538b65ea581e67b40d396a0a60960c9b94382921` after its purpose was exhausted.

Final authoritative validation head: `dcdfd827a740ecff4a0f3be99077ed820694607b` (`ci(retail): validate post-diagnostic closeout head`). No application code changed after `d8e5ff...`; this head exists to prove the cleaned normal workflow alone remains sufficient after diagnostic retirement.

Run `34356830980`, job `102483531903`: **SUCCESS**.
- combined `/fu_core,/fu_retail` test gate: PASS;
- repeatable `-u fu_core,fu_retail` upgrade: PASS;
- exact-head evidence upload: PASS.

Artifact:
- name: `phase2a-retail-dcdfd827a740ecff4a0f3be99077ed820694607b`;
- ID: `10106267198`;
- digest: `sha256:753732d04f42ecc74f65e89eb755a3994147b96640d1c227fde435d56fe54dea`.

Documentation commits after `dcdf...` are closure/handoff commits and must not be substituted for this tested validation SHA.

## Key invariants proven

### Durable offline identity and restore

The browser paths start online with an authorized POS, enter simulated connectivity loss, complete a paid local sale, reach a truthful local/Pending receipt, reload while offline and rehydrate the same native paid order by UUID from durable browser storage.

`addons/fu_retail/static/src/offline_restore_patch.js` is an isolated compatibility boundary pinned to Odoo Community SHA `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`. It documents the upstream `PosData.missingRecursive()` offline-startup defect and delegates unchanged to upstream behavior when online. Retirement condition is explicit: remove the patch only after an adopted upstream revision no longer drops the already-read local record map and the hosted offline-reload regression passes with the patch removed.

The real Cash and confirmed-InstaPay offline-reload browser tests are direct regressions for this boundary: they fail if the paid IndexedDB order cannot rehydrate into the POS model after offline reload.

### Visible reconciliation states

Receipt precedence is truthful and mutually exclusive:
1. Synced;
2. Review required;
3. Syncing;
4. Retryable failure;
5. Pending sync.

`Syncing` is derived from native Odoo `syncingOrders` keyed by native order UUID. Fares does not own a second synchronization queue.

Review and Retryable markers are classification-only UI metadata keyed by the native order UUID. They do not duplicate order, payment or stock truth.

### Retryable versus semantic rejection

A transport interruption represented by Odoo `ConnectionLostError` after a synchronization attempt that starts online is classified Retryable. The native paid order remains local, the classification survives an intentionally offline reload, and successful native reconciliation clears the marker.

An already-offline local checkout remains Pending rather than being mislabeled Retryable.

A current-server authorization rejection is semantic, not transient: the order remains local and unsynced, is marked Review required, is not silently approved, and does not create an authoritative server paid order.

### Lost acknowledgement and exact-once stock

The final browser harness represents a real lost-ack boundary:
- first `pos.order.sync_from_ui` delivery reaches Odoo and succeeds server-side;
- the successful client acknowledgement is deliberately lost;
- the native local transaction remains retryable;
- the same native UUID is delivered again;
- Odoo resolves the replay idempotently.

Server assertions require exactly:
- one paid POS order;
- one payment;
- one done stock picking;
- one stock move for the sold product;
- executed `stock.move.quantity` equal to the sold POS line quantity.

Therefore the tested replay/lost-ack boundary cannot duplicate order, payment or stock quantity effects.

## Retained defect history

Red evidence is intentionally preserved in GitHub Actions history.

- `2536048faa24092688bf370bb961079db4a95246`, run `34113544496`, job `101715004026`: initial foundation failure caused by a backend fixture/API mismatch.
- `88f433107ae9a2f6b0038098c254093bc7a360d7`, diagnostic run `34217932758`: seven neighboring slices green; new revoked-cashier Review browser path red. Artifact ID `10052664245`, digest `sha256:77bced3211aad487634d1a67b149dd27f08c2b0e08759b2088cb10b26ac4ab39`.
- Diagnostic heads `a4297435c67a1ec2fb901f443b6c82217aa653ef` and `66dfdcc879e51e7275e581ee6bbe9ff1dd4e1423`; runs `34219258246` and `34219258288` remained red while the browser failure was classified.
- Later Retryable-state attempts exposed two test/model races: known-offline checkout could be mislabeled Retryable while Odoo network state lagged, and legitimate automatic recovery could erase Retryable before reload evidence. Those attempts were not treated as green checkpoints. The final classifier/test boundary is validated by the green heads above.

This history is evidence of defects discovered and corrected; it is not release evidence.

## Exit-criteria review

Phase 2A contract exit criteria are satisfied under the tested technical boundary:
- authorized native Odoo ordinary checkout: PASS;
- Cash and positively manually confirmed InstaPay: PASS;
- stable offline transaction identity through reload/retry: PASS;
- retry/lost-ack exact-once order/payment/stock effects: PASS;
- truthful local versus central reconciliation state: PASS;
- current-role revalidation and durable Review-required rejection: PASS;
- Phase 1 regressions: PASS;
- representative EN/AR RTL browser behavior: PASS;
- Odoo 19 restore shim production-owned, pinned, isolated and regression-tested: PASS;
- no deferred preorder/refund/collection/deployment policy introduced: PASS.

## Explicit limitations / non-claims

Phase 2A completion does **not** mean production deployment readiness and does not resolve later retail policy. This phase does not implement or approve:
- preorder creation, deposit/balance collection or reservation/allocation;
- refunds or exchanges;
- missing, delayed, contradictory or ambiguous InstaPay notification handling;
- bank API verification;
- card or wallet payments;
- legal/tax receipt finalization;
- real printer/scanner validation;
- real business-data migration;
- production hosting/resources, budget or launch timing.

The next retail work must resolve only the targeted policies needed by preorder/collection/refund behavior. Full-balance-before-partial-collection remains the already-confirmed D-014 rule and must not be re-asked.
