# Phase 2A — Retail checkout/offline validation

Status: **ACTIVE / NOT YET COMPLETE**

Last updated: 2026-09-08.

This file records hosted evidence for `phase-2a/retail-checkout-offline`. Red runs are retained as evidence and must not be described as green.

## Implemented foundation

Production addon: `addons/fu_retail`.

Implemented and previously hosted-green slices include:
- native Odoo POS/Owl ordinary finished-stock checkout foundation;
- Cash payment path;
- data-driven positive manual bank-notification confirmation used for the current InstaPay process; this is not a bank integration;
- production-owned Odoo 19 offline-restore compatibility shim;
- offline paid-order reload/reconnect for Cash and confirmed-InstaPay;
- replay/idempotency coverage using native Odoo transaction identity;
- truthful pending-sync receipt semantics, including Arabic/RTL coverage;
- server-side Fares role revalidation during POS synchronization;
- revoked-role backend rejection while retaining the native unsynced transaction boundary.

## Key hosted evidence

### Initial foundation red

Implementation `2536048faa24092688bf370bb961079db4a95246`.

Run `34113544496`, job `101715004026`: **FAILED**. The failure was isolated to a backend test-fixture API mismatch, not accepted as a green implementation result.

Artifact `phase2a-retail-2536048faa24092688bf370bb961079db4a95246`, ID `10015519526`, digest `sha256:5e9f8ee86e0ec5d5731d68a26b25c3c1f65ee797ed87004f3a5eec8a764a06a5`.

### First trustworthy green foundation

Implementation `70a8bf2908e2a3965dddbf28a5d7c7b55959bb1b`.

Diagnostic run `34117789110`: all six isolated slices passed.

Normal combined run `34117789248`, job `101728550021`: **SUCCESS**, including combined `fu_core + fu_retail` tests and repeatable addon upgrade.

### Authorization/revalidation slice

Implementation `46a1c773...` (`feat(retail): revalidate checkout role on sync`) was hosted-green in both the isolated diagnostic workflow and the normal combined Phase 2A workflow. This established current-server-role revalidation for synchronization while retaining least-privilege role mapping.

The exact full SHA/run IDs should be re-read from GitHub before being copied into release evidence rather than inferred from this abbreviated note.

### Review-required slice — currently red

Implementation `88f433107ae9a2f6b0038098c254093bc7a360d7` added a durable local review classification keyed by native order UUID, receipt `Review required` presentation, Arabic copy and a revoked-cashier browser scenario. The design keeps the actual order/payment/stock data in Odoo's native model/IndexedDB rather than introducing a parallel ledger.

Diagnostic run `34217932758`: seven slices passed and only `Revoked cashier review-required retention` failed. Review artifact:
- ID `10052664245`;
- name `phase2a-diagnostic-review-88f433107ae9a2f6b0038098c254093bc7a360d7`;
- digest `sha256:77bced3211aad487634d1a67b149dd27f08c2b0e08759b2088cb10b26ac4ab39`.

The failure was therefore isolated to the new browser review-required path; existing install, backend, InstaPay UI, offline Cash, Arabic Cash, offline confirmed-InstaPay and retained Phase 1 regression slices stayed green in that diagnostic run.

### Current diagnostic head

Current branch head at this update: `66dfdcc879e51e7275e581ee6bbe9ff1dd4e1423` (`test(retail): isolate review marker before receipt render`). Its parent is diagnostic-observability commit `a4297435c67a1ec2fb901f443b6c82217aa653ef`.

Hosted runs at exact head `66dfdcc...`:
- diagnostic run `34219258246`: **FAILED**;
- normal Phase 2A run `34219258288`: **FAILED**.

This head is diagnostic, not a validated implementation head. Do not broaden production changes until the failed revoked-cashier browser path is classified from hosted evidence.

## Remaining Phase 2A work

Before Phase 2A can close:
1. classify and fix the isolated revoked-cashier browser `Review required` failure without regressing already-green slices;
2. prove that failed current authorization leaves the native local sale durable and visibly review-required;
3. complete the mandatory visible state model: `Syncing` and `Retryable failure` are still explicit contract requirements in addition to Pending sync / Synced / Review required;
4. add/confirm explicit exact-once stock-effect evidence for retry/lost-ack behavior;
5. keep Phase 1 security/product/stock regressions green;
6. capture representative EN/AR RTL hosted evidence for the final state model;
7. run the normal combined exact-head gate and repeatable upgrade successfully;
8. remove temporary diagnostic workflow only in a validated series;
9. update this validation record with exact final SHAs, run/job IDs, artifact digests and limitations;
10. create/update the stacked Phase 2A draft PR only after the implementation evidence is trustworthy.

## Guardrails

- Native Odoo `pos.order`, `pos.payment` and stock effects remain authoritative.
- Do not create a parallel sales/sync ledger.
- Network/transient failure must remain retryable; semantic/server rejection must not be silently auto-approved.
- No preorder, collection, refund/exchange, missing-InstaPay-notification or bank-API policy is decided here.
- No production-readiness or deployment claim is authorized by this evidence.
