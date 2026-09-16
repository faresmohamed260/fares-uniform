# Phase 5A — Arabic launch-quality polish

Status: **COMPLETE / VERIFIED, 2026-09-12.**

Branch: `phase-5a/arabic-launch-polish`.

Starting documentation lineage: `70a6c39570df50d8460715daf173ad3ce0fd2f48`.

Inherited authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

**Authoritative Phase 5A application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.** Later documentation-only commits do not supersede this tested authority.

Authorization: after Phase 5 closure the client instructed the developer to keep going. The bounded work was the documented `P2-001` launch-quality localization debt. This did **not** authorize production deployment, merge, live resources, DNS, secrets or real-data migration.

## Goal and result

Phase 5A closed `P2-001` by localizing the Fares-owned Arabic labels/help/state/connectivity text exposed by the Phase 5 manual review while preserving every accepted workflow, role/security boundary, public API allowlist, offline rule and production-addon ownership contract.

Result: **PASS / P2-001 CLOSED.** Open release-candidate P0: **0**. P1: **0**. P2: **0**.

## Implemented scope

The exact application lineage at `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`:
- supplements `fu_preorder`, `fu_retail` and `fu_production` Arabic translations using Odoo 19 `i18n_extra` loading rather than hardcoded browser-only Arabic;
- localizes the Fares preorder/return online-guard heading and state messaging;
- localizes the preorder cancel action and the affected return/production labels/help/state text;
- strengthens Arabic browser contracts so the known English fragments fail the suite if they regress;
- adds a narrow Phase 5A UAT browser assertion for preorder connectivity/cancel/reconnect/focus/RTL;
- keeps `fu_uat` test-only and keeps the seven production addons as upgrade authority;
- changes no business policy, role/ACL boundary, public DTO/enquiry schema, deployment configuration or live resource.

## Exact-head closure authority

GitHub Actions workflow `Phase 5A Arabic polish`, run **`34700625051`**, tested exact Fares SHA `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` against pinned Odoo `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Odoo/UAT job **`103571619120` — SUCCESS**:
- seven production addons plus test-only `fu_uat` installed together;
- combined inherited + Phase 5A result: **149 tests, 0 failures, 0 errors**;
- `fu_uat`: **9 tests**; the new `TestFaresPhase5AArabicLaunchPolish.test_preorder_connectivity_and_cancel_are_fully_arabic` completed successfully;
- repeatable upgrade of production addons `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`: **SUCCESS** on the same database/SHA; final upgrade log reached `Modules loaded.`;
- Odoo/UAT artifact ID **`10300402418`**, name `phase5a-odoo-uat-cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, digest **`sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`**.

Public-web job **`103571619062` — SUCCESS**:
- exact-head checkout: success;
- `npm ci`: success;
- typecheck: success;
- production build: success;
- Playwright: **8/8 passed** in 6.3s;
- web artifact ID **`10300486494`**, name `phase5a-web-cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, digest **`sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`**.

Runtime evidence records Python 3.12.14, Chrome 152.0.7977.82 and rtlcss 4.3.0 for Odoo evidence; Node 22.23.2, Next.js 16.3.4 and Playwright 1.63.0 for the public fixture-provider gate. These are evidence, not production-version commitments.

## Manual green-run evidence review

Fresh evidence from the successful run was downloaded only for inspection. Representative captures manually reviewed include:
- `phase5a_preorder_ar_desktop_20260912_150136_826868_test_preorder_connectivity_and_cancel_are_fully_arabic.png`;
- `phase5a_preorder_ar_narrow_reduced_20260912_150136_936681_test_preorder_connectivity_and_cancel_are_fully_arabic.png`;
- `returns_exchange_ar_narrow_reduced_20260912_145848_032261_test_returns_exchange_arabic_rtl_online_guard.png`;
- `production_queue_ar_narrow_reduced_20260912_150102_693591_test_production_queue_arabic_rtl.png`;
- `reporting_dashboard_ar_narrow_reduced_20260912_150124_159810_test_reporting_dashboard_arabic_rtl_visual_contract.png`;
- public `public_ar_narrow.png`.

Manual result: **PASS.** The preorder connectivity heading/state and cancel action are Arabic; return labels such as source sale/store location/operation/eligibility path/reason and state are Arabic; production trigger/queue/audit labels are Arabic; RTL and narrow/reduced-motion composition remains coherent; reporting remains localized and usable; and the public Arabic surface remains clean. English visible in the selected internal captures is synthetic fixture data such as `WH/Retail Store`, product/user values or identifiers, not the known Fares-owned UI labels covered by `P2-001`.

## Red chronology retained

Candidate `f5e2f03b92fc54aa433ba3ad3753bd68fb885030`, run `34699969872`, is permanently **RED / NON-AUTHORITATIVE**. Its public job passed, but its Odoo/UAT gate ended `1 failed, 0 error(s) of 149 tests` because the newly added test attempted to focus the preorder Create action while the test had intentionally put the browser offline and disabled that action. Required Arabic/forbidden-English assertions and offline fail-closed checks had already passed. The seven-addon repeatable upgrade was therefore not reached.

`cc2656d7529cfd4af396ddd0af6444a0f6600dc8` changes only that test sequence: reconnect online, confirm the action re-enables, then assert keyboard focus and RTL. The localization implementation itself is unchanged from the first candidate.

## Exit conclusion

All Phase 5A exit criteria are satisfied:
- `P2-001` closed by exact-head hosted evidence;
- known Fares-owned English fragments are removed from the targeted Arabic screens;
- inherited Odoo/UAT gate is green at 149 tests;
- repeatable seven-production-addon upgrade is green;
- public regression remains 8/8;
- representative fresh Arabic evidence was manually inspected;
- no new P0/P1/P2 release-candidate defect was found;
- no merge, deployment, live-resource mutation or real-data migration occurred.

Production remains **NO-GO**. The next boundary is production-specific readiness in `docs/operations/DEPLOYMENT_READINESS.md`: hosting/persistence, backup/restore/RPO/RTO, staging and secrets, Vercel/domain/DNS choices, real store hardware, named staff/training, opening-data/cutover ownership, monitoring, budget and launch timing require explicit operator/client decisions and separate deployment authorization.
