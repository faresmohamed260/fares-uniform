# Phase 2C validation — retail refunds and size exchanges

Status: **COMPLETE / AUTHORITATIVE HOSTED GATE PASS.**

Branch: `phase-2c/refunds-exchanges`.

Pinned Odoo Community commit: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

This document owns Phase 2C hosted validation chronology and the distinction between implemented, hosted-tested, visually reviewed and documentation-only states. The phase contract is `docs/phases/PHASE_2C_REFUNDS_EXCHANGES.md`.

## Final application authority

Authoritative tested application SHA: **`62369e62dd1e5d2505e089c6a5ede296a24bcb3b`** (`test(refunds): cover exchange stock and InstaPay evidence`).

GitHub Actions:
- workflow: **`Phase 2C retail returns`**;
- run: **`34596450064`**;
- job: **`103253225096`** (`returns-foundation`);
- conclusion: **SUCCESS**;
- run attempt: `1`;
- exact workflow head: `62369e62dd1e5d2505e089c6a5ede296a24bcb3b`.

Final exact-head artifact:
- artifact ID: **`10262414135`**;
- name: **`phase2c-returns-62369e62dd1e5d2505e089c6a5ede296a24bcb3b`**;
- digest: **`sha256:de110b0bd73593d7248f396acb1df35c80c5c711edac14b83773b54d86e1a475`**;
- created: `2026-09-11T12:01:38Z`;
- retained evidence includes `install-and-tests.log`, `upgrade.log`, `summary.md`, browser logs and rendered screenshots.

The application SHA above is the Phase 2C runtime authority. Later documentation-only commits do not replace it and must not be described as separately tested application heads.

## Final hosted gate result

The exact-head hosted run passed every required workflow step:
- Checkout Fares exact head — success;
- Checkout pinned Odoo Community 19 — success;
- Python/dependency setup — success;
- **Install addons and run Phase 1 through Phase 2C tests — success**;
- **Prove repeatable addon upgrade — success**;
- Summarize evidence — success;
- Upload exact-head evidence — success.

The retained Odoo result is:

`0 failed, 0 error(s) of 82 tests when loading database 'fares_phase2c'`

The same database then completed a repeatable `-u fu_core,fu_retail,fu_preorder` upgrade successfully on the same Fares application SHA and the same pinned Odoo SHA.

No temporary diagnostic workflow remains in the Phase 2C closure path.

## Business/security scenarios proved

Hosted tests at the final application SHA prove the accepted P2C-01 through P2C-07 policy without weakening assertions:

- Cashier can prepare/request a return or exchange, while Manager/Owner approval remains required for approval/execution boundaries;
- Store Manager scope is enforced server-side and an unscoped manager is denied;
- 14-day no-reason and 30-day defective-item eligibility paths are enforced;
- genuinely made-to-special-specification goods are excluded only from the no-reason path under the accepted exception boundary;
- original POS sale/payment history remains immutable and reversal records remain source-linked;
- direct native `pos.order._refund()`, native `refund()` and unauthorized negative/refunded-line mutation are rejected outside an approved Fares request;
- UI/native-sync bypass payloads for refund/negative lines are rejected server-side;
- full Cash refund uses native Odoo refund lineage, same-method settlement and exactly one native return stock effect;
- partial Cash refund is native/source-linked and cumulative refund quantity cannot exceed the outstanding source quantity;
- repeated execution is idempotent and does not duplicate payment or stock effects;
- InstaPay refund requires positive manually confirmed outbound evidence/reference and records the attributable confirmation;
- mixed-method source payments fail closed rather than inventing an allocation rule;
- returned garments land in `Returns / Inspection` and remain outside sellable stock until disposition;
- explicit sellable acceptance moves the returned quantity back to Retail Store exactly once;
- explicit non-sellable disposition remains quarantined and is idempotent;
- equal-price size exchange creates native return + replacement lineage with zero settlement movement;
- more-expensive Cash exchange collects the exact positive difference;
- cheaper Cash exchange refunds the exact negative difference;
- cheaper InstaPay exchange rejects missing manual evidence and accepts/records confirmed outbound evidence;
- replacement is limited to another storable variant of the same product template/UoM;
- replacement stock shortage is rejected before execution;
- mixed-payment exchange remains fail-closed;
- exchange replay cannot duplicate replacement, payment or stock effects.

## Controlled operator surface

Phase 2C uses a bounded **Returns & Exchanges** workspace instead of exposing native POS Refund as a competing routine staff workflow.

Hosted proof covers:
- backend list/form/search/menu registration;
- source transaction, operation, eligibility, reason, settlement, returned-item, inspection, audit and native-record context;
- editable draft source/line selection;
- live exchange-difference preview;
- POS `Returns / Exchanges` entry replacing the routine native Refund control;
- server-side direct-mutation denial remaining authoritative even if a client attempts to bypass the UI.

The final POS tour proves the online staff path leaves the standalone POS shell only after pending-order synchronization succeeds and opens the controlled backend workspace. The offline tour proves the action remains in POS, does not expose the native Ticket/Refund path, and shows `Returns and exchanges require an online connection.`

## Browser, RTL, keyboard and rendered evidence

Representative hosted Chrome paths passed for English and Arabic/RTL, including online/offline disable/recover behavior and keyboard focus on the primary return action.

Final retained return-workspace screenshots include:
- `returns_exchange_en_desktop_20260911_120044_841200_test_returns_exchange_english_online_guard.png`;
- `returns_exchange_en_narrow_reduced_20260911_120044_967812_test_returns_exchange_english_online_guard.png`;
- `returns_exchange_ar_desktop_20260911_120042_674460_test_returns_exchange_arabic_rtl_online_guard.png`;
- `returns_exchange_ar_narrow_reduced_20260911_120042_800596_test_returns_exchange_arabic_rtl_online_guard.png`.

Rendered review confirms the controlled return form remains usable at desktop and narrow widths and the Arabic path renders RTL. The retained Chrome logs show the tours/browser assertions succeeding; the visible `ERROR` lines are headless-runner D-Bus/GCM environment noise, not application JavaScript/test failures.

## Corrected failure chronology

The prior handoff incorrectly associated job `103242147501` with run `34602380257`. GitHub identifies that job under **run `34592940939`**, which is the red hosted run for application SHA `2f1df8801581ec9b622d3774d415bd0cecbe0c28`.

The useful retained artifact from that run showed the two new POS tours failed before exercising business behavior because Odoo tour helpers returning arrays had been inserted as single steps. Commit **`8c657d6f6b836d543007647c834429727986d972`** (`fix(refunds): flatten POS return tour steps`) corrected the tour composition.

Run **`34595185551`**, job **`103249180876`**, then reached the real navigation behavior and exposed two separate assumptions:
- backend `action.doAction(...)` cannot mount the ordinary backend list inside the standalone POS shell;
- the Odoo control-buttons popup closes on bubbled button click, so the offline test must not require that popup to remain open.

Commit **`4353c6c206b63697a3c2054bf976dc2fa01cfe28`** (`fix(refunds): redirect POS returns to backend workspace`) changed the online flow to synchronize pending POS orders and then navigate to `/odoo/action-fu_retail.action_fu_retail_return_requests`, matching pinned Odoo's standalone-POS-to-backend behavior. Commit **`e2a984ec6b473dfcd001de4569a1ccda4fb4fd61`** updated the tours to prove unload/navigation online and fail-closed retention offline.

Final closure coverage was then strengthened without relaxing policy through:
- **`543e613c1eef11c1384ac7579a7763c120c29171`** — partial/cumulative over-refund and non-sellable inspection tests;
- **`62369e62dd1e5d2505e089c6a5ede296a24bcb3b`** — replacement-stock shortage and InstaPay exchange-difference evidence tests.

The final exact-head run is green, so the older red runs remain historical diagnostic evidence only.

## Closure boundaries

Phase 2C is closed for the accepted consumer-retail scope. Closure does **not** authorize or imply:
- mixed-method automated refund allocation;
- uncollected-preorder cancellation/refund;
- cards/wallets;
- automatic InstaPay/bank API integration;
- B2B contract returns/credit policy;
- chargebacks, repairs, warranty workflows or production-material returns;
- final legal/tax certification;
- merge of stacked branches;
- production deployment or real-data migration.

No merge, deployment or production migration occurred during Phase 2C validation.