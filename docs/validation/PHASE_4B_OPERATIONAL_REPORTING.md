# Phase 4B validation — operational reporting

Status: **IMPLEMENTED / FINAL EXACT-HEAD VALIDATION BLOCKED.**

Branch: `phase-4b/operational-reporting`.

Starting documentation lineage: `93e371b663b4013604e78b3ec6d952d3c6eca6ab`.

Inherited Phase 4A application authority: `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

No Phase 4B application SHA is authoritative yet.

## Current evidence checkpoint — 2026-09-12

### Earlier red chronology

- `7b0848b1d9f4d0ba070d87008551f70307b4e106`, run `34656263696`: initial Phase 4B implementation. Odoo job `103449247069` failed because the reporting functional fixture inherited `CommonPosTest`'s newly created company without running Fares initial Store/Storage configuration; the first Odoo 19 browser assertions also assumed section strings that were not visibly rendered. Public-web regression passed.
- hardening through `d2be0fb71631a91ecdf08bdb26a788daa381630a` and `670d610ae768fc3b71d5d65f3487540f903fd705` corrected the fixture, current-company dashboard binding, low-stock rule scoping and visible headings. Run `34662913308`, Odoo job `103468970933`, remained red during the stabilization sequence; it is not authority.

### Automated-green candidate rejected by manual evidence review

Application candidate `89378db5b0fa5b9624a96a34b9648de2d9e2f86a` passed workflow run `34687529585`:
- combined Odoo Phase 1–4B suite: **144 tests, 0 failures, 0 errors**;
- repeatable seven-addon upgrade: success;
- same-SHA public web: success;
- Odoo artifact ID `10296400661`, digest `sha256:28251dc1267969ebb71e2796044ecf5cd9667d6c159a793397256651c6798e42`;
- web artifact ID `10295763728`, digest `sha256:edff729f2f0ae1a16503b6133a76e83a50e8633ff0ae49322a8196b689799608`.

It was **not promoted** because required manual screenshot inspection found two quality defects despite the green automation:
1. Arabic desktop/narrow dashboard captures had true RTL and localized labels, but the dynamic offline-sync disclosure body remained English.
2. The transient dashboard breadcrumb/title exposed the internal model-style name `fu.reporting.dashboard,<id>`.

### Current exact-head candidate

Latest application candidate before this documentation update: `c25c03dad84ecc113cf2dd0299dfb27cba89b41e`.

Relevant commits:
- `d37500f61e3b23b0b71f78ec3376f85a49c57f45` — `fix(phase4b): localize dashboard notice and title`;
- `c25c03dad84ecc113cf2dd0299dfb27cba89b41e` — `test(phase4b): require localized sync disclosure`.

Exact-head workflow run `34693847763`:
- Odoo job `103553817598` — **FAILURE** during `Install addons and run Phase 1 through Phase 4B tests`;
- Odoo result: **144 tests, 1 failure, 0 errors**;
- exact failing test: `TestFaresReportingBilingualUI.test_reporting_dashboard_arabic_rtl_visual_contract`;
- browser error: **`Localized offline synchronization body missing`**;
- expected Arabic body: `تستبعد إجماليات الخادم معاملات نقطة البيع غير المتصلة التي لم تتم مزامنتها بعد؛ وتظهر في التقارير بعد تسويتها على الخادم.`;
- English visual contract passed in the same run;
- repeatable seven-addon upgrade was skipped because the preceding Odoo test step failed;
- Odoo artifact ID `10297943331`, name `phase4b-odoo-c25c03dad84ecc113cf2dd0299dfb27cba89b41e`, digest `sha256:730ad8d9e45a14fe90c40da742c5e90ff4e7a3e2514cd2125ce1a2151ab1f442`.

Same-SHA public-web job `103553817709` — **SUCCESS**:
- typecheck: success;
- production build: success;
- Playwright: **8/8 passed**;
- artifact ID `10297457260`, name `phase4b-web-c25c03dad84ecc113cf2dd0299dfb27cba89b41e`, digest `sha256:4cc54cce46c7a7f7275a0d0e03f30d3861df96ba34060ee27175b79d46fcd9be`.

### Remaining closure work

1. Diagnose the actual language-context/rendering path for the dynamic `sync_notice` value; do not weaken the Arabic assertion or hardcode browser-only text just to make CI green.
2. Apply the narrow evidence-backed forward fix while preserving formulas, security boundaries and Phase 4A public isolation.
3. Rerun the full exact-head hosted workflow on the new application SHA.
4. Require **all** of the following on that same SHA: 144-or-newer combined Odoo tests with 0 failures/0 errors, repeatable seven-addon upgrade, public-web typecheck/build/8-test Playwright regression.
5. Download and manually inspect the final four dashboard captures: English desktop, English narrow/reduced-motion, Arabic RTL desktop, Arabic RTL narrow/reduced-motion. Confirm the complete Arabic sync-disclosure body, localized title/breadcrumb with no internal `fu.reporting.dashboard,<id>` leakage, true RTL, localized sections/actions, keyboard-focus assertion and no viewport overflow.
6. Only after those checks pass, promote the exact tested application SHA, mark Phase 4B COMPLETE/VERIFIED, update project/index/validation evidence, and append the Phase 4B closure decision after re-reading live `docs/DECISIONS.md`. A later docs-only closure commit must not supersede the application authority.

## Exact-head hosted gate

The Phase 4B workflow must run against `${{ github.sha }}` and retain evidence for the exact tested commit.

Combined addon set:
`fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.

The gate must prove:
- exact-head checkout;
- pinned Odoo exact SHA;
- all inherited Phase 1–4A Odoo tests;
- Phase 4B direct server/formula/security tests;
- Phase 4B browser/UI evidence;
- repeatable seven-addon upgrade on the same database;
- Phase 4A public-web `npm ci`, typecheck, production build and Playwright gate on the same Fares SHA;
- retained logs/screenshots/runtime metadata.

A setup/runner failure is not automatically an application regression. Preserve red chronology and classify failures from evidence.

## Formula regression matrix

### Daily sales
Create deterministic completed POS transactions and prove:
- positive sale contributes to gross and net on `date_order` local day;
- completed native refund contributes to refund magnitude and reduces net on its own refund-order day;
- original sale remains unchanged;
- draft/unpaid/cancelled POS orders are excluded;
- preorder deposits and B2B deposits do not alter daily POS sales;
- location filter excludes another store/config;
- cross-company records are excluded.

### Cash / InstaPay movement
Prove:
- positive Cash POS payment -> Cash inflow;
- negative Cash refund POS payment -> Cash outflow/refund and lower net;
- confirmed InstaPay POS payment -> InstaPay inflow;
- InstaPay refund -> InstaPay outflow/refund;
- cash-change `is_change=True` is excluded;
- valid posted preorder Cash/InstaPay payments are included on `account.payment.date`;
- valid posted B2B Cash/InstaPay payments are included for Owner/Admin;
- Store Manager does not receive B2B movement;
- cancelled/rejected/unposted account payments are excluded;
- an otherwise-valid non-Cash/non-InstaPay method increments the other/unclassified signal rather than silently entering a requested bucket.

### Low stock
Prove:
- no warning rule means no warning;
- Owner/Admin can configure a non-negative threshold;
- unauthorized role cannot create/change the rule through ORM/service;
- native available quantity above threshold is not low;
- quantity equal to threshold is low;
- quantity below threshold is low;
- reservation reduces available quantity and may trigger warning without changing physical on-hand quantity;
- Returns / Inspection cannot be configured/reported as a normal stock-warning location;
- Store Manager sees only assigned-store warning rows;
- current-company boundary holds.

### Upcoming / overdue
Preorder fixtures prove:
- open incomplete future pickup -> upcoming;
- open incomplete past pickup -> overdue;
- fully collected -> neither;
- cancelled -> neither;
- assigned-store scope enforced.

Business fixtures prove for Owner/Admin:
- confirmed unshipped future delivery -> upcoming;
- confirmed unshipped past delivery -> overdue;
- completed controlled customer shipment -> neither;
- draft unpaid quotation -> neither;
- Store Manager receives no B2B deadline rows.

### Customer balances
Prove:
- preorder balance equals existing live amount-total minus valid posted payments;
- additional deposit reduces balance without changing daily POS sales;
- fully paid preorder disappears from positive-balance rows;
- confirmed B2B balance uses existing live business payment logic;
- B2B draft with recorded money may appear; unpaid draft quotation does not;
- Store Manager gets assigned-store preorder balances only;
- Owner/Admin gets current-company preorder + B2B rows;
- different currencies are kept as distinct row currencies and not blindly summed.

## Timezone/day-boundary regression

Use a synthetic company timezone different from UTC and create events around local midnight. Prove half-open local-day boundaries classify:
- POS order `date_order`;
- POS payment `payment_date`;
correctly.

Prove unset company timezone reports explicit UTC fallback.

`account.payment.date` is a Date and must be selected by exact report date, independent of viewer timezone.

## Security regression

Direct ORM/service calls must prove:
- Owner/Admin positive access;
- Store Manager positive assigned-store access;
- Store Manager crafted unassigned location rejected;
- Store Manager B2B reporting excluded;
- Cashier denied;
- Inventory Staff denied;
- Production Manager denied;
- Sales/BD denied;
- role-less user denied;
- low-stock rule mutation Owner/Admin-only;
- public/anonymous user cannot access internal reporting service/action.

Do not weaken existing operational ACLs or grant broad accounting/stock groups just to read reports.

## Public-boundary regression

Phase 4A remains inherited authority. Same-SHA public-web gate must continue proving:
- exact five-field catalog DTO;
- enquiry allowlist including required sector and no `source_url`;
- no price/stock/customer/payment/staff/reporting leakage;
- fixture provider and production schema validation remain aligned.

No Phase 4B model/service becomes an anonymous `/fu/public/*` route.

## Browser / visual evidence

Use real Odoo Chrome `browser_js`/hosted screenshot capture following existing Fares patterns.

Retain representative screenshots for:
- English desktop dashboard;
- Arabic RTL desktop dashboard;
- English narrow dashboard;
- Arabic RTL narrow dashboard.

Browser assertions must cover:
- localized report title/metric labels;
- true RTL in Arabic;
- visible report date/timezone/as-of context;
- visible and fully localized offline-unsynced disclosure, including the Arabic disclosure body rather than only its label;
- gross/refund/net labels not collapsed into one ambiguous number;
- keyboard focus on refresh/filter/drill-through controls where present;
- reduced-motion compatibility for any added non-essential motion;
- no document-level horizontal overflow at representative narrow width;
- no report controls/content visible to a denied role through ordinary navigation.

Screenshots must be manually inspected before closure; a green `browser_js` exit alone is insufficient. Manual review must also reject internal transient model identifiers in the visible title/breadcrumb.

## Performance/shape checks

Tests should prove bounded page-size validation and deterministic ordering for list results. Avoid asserting unrealistically large synthetic volumes; no production volume is known.

Review implementation for obvious N+1 query patterns in warning/order/balance loops. A measured performance benchmark is not required until real volume exists.

## Evidence outputs

Final closure must record:
- authoritative Phase 4B application SHA;
- workflow run and job IDs;
- total test counts/failures/errors;
- exact addon upgrade result;
- artifact IDs/digests;
- representative screenshot names and manual review result;
- any red-to-green chronology and whether each red was application, contract, fixture or runner/setup failure;
- limitations/deferred behavior.

Later docs-only closure commits must not supersede the tested application SHA.

## Exit rule

Do not mark Phase 4B complete until the contract in `docs/phases/PHASE_4B_OPERATIONAL_REPORTING.md` is fully represented by exact-head hosted evidence and inspected artifacts. The latest exact-head candidate `c25c03dad84ecc113cf2dd0299dfb27cba89b41e` is **not** authority because its Arabic visual contract is red and its repeatable upgrade therefore did not run. No merge/deployment/real-data migration is part of this validation contract.
