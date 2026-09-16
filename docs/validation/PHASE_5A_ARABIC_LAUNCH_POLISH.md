# Phase 5A validation — Arabic launch-quality polish

Status: **COMPLETE / VERIFIED, 2026-09-12.**

Branch: `phase-5a/arabic-launch-polish`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

**Authoritative Phase 5A application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.** Documentation-only commits after this SHA do not supersede it.

## Exact-head hosted gate

Workflow `Phase 5A Arabic polish`, run **`34700625051`**, tested exact SHA `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Odoo/UAT job **`103571619120` — SUCCESS**:
- seven production addons plus test-only `fu_uat` installed together;
- **149 tests, 0 failures, 0 errors**;
- `fu_uat`: 9 tests;
- `TestFaresPhase5AArabicLaunchPolish.test_preorder_connectivity_and_cancel_are_fully_arabic`: successful;
- repeatable upgrade of `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`: successful; final log reached `Modules loaded.`;
- artifact **`10300402418`**, `phase5a-odoo-uat-cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, digest `sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`.

Public-web job **`103571619062` — SUCCESS**:
- exact-head checkout, `npm ci`, typecheck and production build: success;
- Playwright: **8/8 passed** in 6.3s;
- artifact **`10300486494`**, `phase5a-web-cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, digest `sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`.

Runtime evidence: Python 3.12.14, Chrome 152.0.7977.82, rtlcss 4.3.0, Node 22.23.2, Next.js 16.3.4 and Playwright 1.63.0. These are evidence only, not production commitments.

## Arabic regression coverage

The same-SHA browser contracts prove:
- preorder Arabic connectivity heading/state, offline fail-closed behavior, reconnect recovery, localized cancel action, keyboard focus and RTL;
- returns/exchanges Arabic Source Order/Store Location/Operation/Eligibility Path/Reason/state/help coverage with known English fragments forbidden;
- production Arabic Trigger Reason/Queued by and related audit labels with known English fragments forbidden;
- inherited bilingual/RTL/narrow/reduced-motion workflows remain green;
- reporting/public behavior remains unchanged and green.

## Fresh manual screenshot review

Successful-run evidence was downloaded for inspection only. Reviewed:
- `phase5a_preorder_ar_desktop_20260912_150136_826868_test_preorder_connectivity_and_cancel_are_fully_arabic.png`;
- `phase5a_preorder_ar_narrow_reduced_20260912_150136_936681_test_preorder_connectivity_and_cancel_are_fully_arabic.png`;
- `returns_exchange_ar_narrow_reduced_20260912_145848_032261_test_returns_exchange_arabic_rtl_online_guard.png`;
- `production_queue_ar_narrow_reduced_20260912_150102_693591_test_production_queue_arabic_rtl.png`;
- `reporting_dashboard_ar_narrow_reduced_20260912_150124_159810_test_reporting_dashboard_arabic_rtl_visual_contract.png`;
- public `public_ar_narrow.png`.

Manual result: **PASS.** Targeted Fares-owned labels/help/connectivity text is Arabic; RTL/narrow layouts are coherent; reporting/public Arabic remain usable. English fixture values such as `WH/Retail Store`, synthetic product names and `Administrator` are data values rather than the UI-label defect targeted by `P2-001`.

## Defect register

`P2-001 — partial English labels/help on selected internal Arabic forms`: **RESOLVED / CLOSED by Phase 5A authority `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.**

Open P0: **0**. Open P1: **0**. Open P2: **0**.

## Red candidate chronology

`f5e2f03b92fc54aa433ba3ad3753bd68fb885030`, run `34699969872`, remains **RED / NON-AUTHORITATIVE**. Its Odoo gate ended **1 failed, 0 errors of 149 tests** because the new test attempted keyboard focus while the preorder Create action was deliberately disabled offline. Arabic content and offline fail-closed assertions had already passed. Because the test stage failed, the repeatable upgrade did not run.

The final SHA `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` only corrects test sequencing: reconnect, verify enabled state, then assert focus and RTL. It does not alter the localization implementation.

## Deployment boundary

No merge, production deployment, live domain/DNS change, secret/resource mutation, paid-resource creation or real-data migration occurred. Production remains **NO-GO** until the unresolved production-specific items in `docs/operations/DEPLOYMENT_READINESS.md` are explicitly decided/proven and deployment is separately authorized.
