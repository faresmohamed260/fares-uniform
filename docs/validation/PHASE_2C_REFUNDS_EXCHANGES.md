# Phase 2C validation — retail refunds and size exchanges

Status: **IMPLEMENTATION ACTIVE. REFUND FOUNDATION HAS A VERIFIED GREEN CHECKPOINT; NATIVE SIZE-EXCHANGE EXECUTION AND THE CONTROLLED RETURNS WORKSPACE ARE IMPLEMENTED ON NEWER COMMITS, BUT THE CURRENT HEAD HOSTED GATE IS RED AND MUST NOT BE DESCRIBED AS VERIFIED.**

Branch: `phase-2c/refunds-exchanges`.

Pinned Odoo Community commit: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

This document owns Phase 2C hosted validation chronology and the distinction between implemented, hosted-tested, visually reviewed and phase-complete states. The phase contract remains `docs/phases/PHASE_2C_REFUNDS_EXCHANGES.md`.

## Authoritative chronology

### Verified refund-foundation checkpoint

Application SHA: **`d0a6745d3b4d19891fb7dcf034a3ffe0d903a5d1`** (`feat(refunds): add approved return foundation`).

GitHub Actions:
- workflow: `Phase 2C retail returns`;
- run: **`34588161993`**;
- job: **`103227058235`**;
- conclusion: **SUCCESS**.

Evidence established at this exact SHA:
- combined Phase 1 through Phase 2C Odoo tests passed;
- the bounded refund foundation passed its server/security/stock/payment tests;
- repeatable `fu_core,fu_retail,fu_preorder` upgrade passed;
- exact-head evidence upload passed.

This is the latest Phase 2C SHA that may currently be called an authoritative green application checkpoint.

### Native size-exchange implementation

Implementation SHA: **`f90066e2c883bfb5570b1803136fca6b1174922d`** (`feat(refunds): add native size exchange execution`).

This commit extends the return request workflow with native Odoo size-exchange execution and tests. Implemented behavior includes:
- an exchange order linked to the source POS transaction;
- return of the original positive sale line through the native refund lineage;
- a positive replacement-variant POS line;
- replacement limited to another storable variant of the same product template and unit of measure;
- live Retail Store replacement-stock availability checks;
- native POS onchange/pricelist/fiscal-position/tax pricing for the replacement line rather than a hand-coded `list_price` shortcut;
- exact positive, negative or zero exchange-difference settlement;
- Cash settlement for Cash source sales and confirmed InstaPay evidence for supported InstaPay settlement;
- mixed-method source payments remaining fail-closed;
- quarantine of the returned original variant in `Returns / Inspection`;
- exact-once/idempotent exchange execution and protected native linkage.

Representative server tests in `addons/fu_retail/tests/test_exchanges.py` cover equal-price, more-expensive and cheaper exchanges, mixed-payment rejection, same-template variant enforcement and replay safety.

This commit is newer implementation than the green refund-foundation checkpoint. It must not inherit `d0a6745d...` validation by implication.

### Controlled returns workspace

Current application HEAD before this documentation update: **`2f1df8801581ec9b622d3774d415bd0cecbe0c28`** (`feat(refunds): add controlled returns workspace`).

The commit adds the operational surface around the guarded server workflow, including:
- native backend Return / Exchange list/form/search/menu workspace;
- request submission, Manager/Owner approval, execution and rejection actions;
- source sale, policy, settlement, returned-item, inspection, audit and native-record context;
- replacement-size handling and inspection actions;
- online-required backend guard assets;
- a POS return entry override so the Fares-controlled path can replace the unrestricted native Refund entry point while server-side bypass protection remains authoritative;
- Arabic translations for the new return/exchange surface;
- additional UI/tour assets registered in `fu_retail`.

Implementation presence is not proof of runtime correctness or visual completion.

## Current red exact-head gate

GitHub Actions run **`34602380257`**, job **`103242147501`**, validates application HEAD `2f1df8801581ec9b622d3774d415bd0cecbe0c28` and concludes **FAILURE**.

Known step state:
- Checkout Fares exact head — success;
- Checkout pinned Odoo Community 19 — success;
- Set up Python — success;
- Install Odoo dependencies — success;
- **Install addons and run Phase 1 through Phase 2C tests — failure**;
- Prove repeatable addon upgrade — **skipped because the test/install step failed**;
- Summarize evidence — success;
- Upload exact-head evidence — success.

The GitHub connector did not expose the useful runtime failure text from job `103242147501` during the handoff session. Do not guess the root cause and do not repeatedly refetch the same unavailable log. The next implementation session should perform one targeted retrieval of the failing test/log evidence, then change tactics if the helper remains incomplete.

Because the current exact-head gate is red:
- `2f1df880...` is **implemented but not verified**;
- `f90066e2...` is **implemented but must not be assumed green merely because its parent checkpoint was green**;
- `d0a6745d...` remains the latest authoritative green Phase 2C checkpoint;
- Phase 2C is not complete;
- no repeatable-upgrade success, browser/UI success or visual approval may be claimed for the current HEAD.

## Remaining authoritative gates

Before Phase 2C can close:
1. retrieve/identify the exact `2f1df880...` hosted failure once and fix the underlying code/test issue rather than weakening assertions;
2. run the combined Phase 1 + Phase 2A + Phase 2B + Phase 2C test gate successfully on the new exact application SHA;
3. prove repeatable `fu_core,fu_retail,fu_preorder` upgrade on that same application SHA;
4. prove representative refund and size-exchange workflow behavior, including positive/negative/zero difference and inspection disposition;
5. verify that the unrestricted native POS Refund route is not offered as a competing staff workflow while direct native mutation remains rejected server-side;
6. pass representative English and Arabic/RTL browser paths, online/offline fail-closed behavior, keyboard focus/accessibility checks and rendered review;
7. retain screenshots/evidence and pin the final workflow run, job, artifact ID/name and digest;
8. distinguish the final tested application SHA from any later diagnostic cleanup or documentation-only SHA;
9. remove any temporary diagnostic workflow before closure;
10. do not merge, deploy or migrate real data without explicit client authorization.

## Non-negotiable validation boundaries

Do not reopen the accepted P2C-01 through P2C-07 policy unless the client changes it or authoritative evidence contradicts it. Do not build a second refund/payment/stock ledger. Do not add a generic reverse transfer on top of a native delivered POS refund. Do not weaken role, store-scope, quantity, settlement, inspection, idempotency or connectivity assertions merely to make CI green.
