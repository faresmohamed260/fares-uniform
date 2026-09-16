# Phase 4B validation — operational reporting

Status: **COMPLETE / VERIFIED, 2026-09-12.**

Branch: `phase-4b/operational-reporting`.

Starting documentation lineage: `93e371b663b4013604e78b3ec6d952d3c6eca6ab`.

Inherited Phase 4A application authority: `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

**Authoritative Phase 4B application/test SHA: `29b2589e7e71271071f97c9de57dfb97b49b100d`.**

Later documentation-only commits do not supersede that tested application authority.

## Final exact-head closure authority — 2026-09-12

Exact-head workflow run `34696367320` on application SHA `29b2589e7e71271071f97c9de57dfb97b49b100d` is the Phase 4B closure gate.

Odoo job `103560475350` — **SUCCESS**:
- combined Phase 1–4B seven-addon suite: **144 tests, 0 failures, 0 errors**;
- exact addon set: `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`;
- repeatable seven-addon upgrade on the same database/SHA: **SUCCESS** (`Modules loaded.` observed after the upgrade run);
- strengthened Arabic dashboard assertion passed, including the full localized offline-sync disclosure body;
- Odoo artifact ID `10299505013`, name `phase4b-odoo-29b2589e7e71271071f97c9de57dfb97b49b100d`, digest `sha256:428d0f0211a229bd85d35df8444295c2658fb397ce0c910af7302765d4eb543d`.

Public-web job `103560475255` — **SUCCESS**:
- exact-head checkout: success;
- typecheck: success;
- production build: success;
- Playwright: **8/8 passed**;
- web artifact ID `10298334239`, name `phase4b-web-29b2589e7e71271071f97c9de57dfb97b49b100d`, digest `sha256:2683575631b5efa75c8db33e3f76f91a64412563d4083f85f491012b8415b13d`.

The retained Odoo evidence artifact was downloaded and manually reviewed rather than relying on green CI alone. The four required reporting captures were:
- `reporting_dashboard_en_desktop_20260912_133247_327096_test_reporting_dashboard_english_visual_contract.png`;
- `reporting_dashboard_en_narrow_reduced_20260912_133247_473411_test_reporting_dashboard_english_visual_contract.png`;
- `reporting_dashboard_ar_desktop_20260912_133244_868562_test_reporting_dashboard_arabic_rtl_visual_contract.png`;
- `reporting_dashboard_ar_narrow_reduced_20260912_133245_004841_test_reporting_dashboard_arabic_rtl_visual_contract.png`.

Manual review result: **PASS**. It explicitly confirmed:
- the complete Arabic offline-sync disclosure body is visible and Arabic, not merely its label;
- the Arabic disclosure label is localized;
- report title and visible breadcrumb/display name are localized and do not leak `fu.reporting.dashboard,<id>`;
- Arabic desktop and narrow captures are genuinely RTL;
- report sections and the refresh action are localized;
- report timezone and operational `as_of` context are visible;
- narrow layouts wrap the disclosure and report fields usefully without a visually broken layout;
- English desktop/narrow captures remain intact;
- the same passing browser contract verifies refresh keyboard focus and rejects document-level horizontal overflow, including narrow mode;
- reduced-motion capture is retained for both narrow layouts.

### Localization blocker root cause and forward fix

The final blocker was not the Arabic browser session, static view translation, or missing RTL. Pinned Odoo 19 loads Python-code translations into its Python translation map only for PO entries marked `#. odoo-python`. The `fu_reporting` Arabic PO entries had code references but were missing that Odoo 19 metadata, so the dynamic `sync_notice` value stayed English even while static XML labels localized correctly.

The final forward-fix sequence was:
- `298e8c1a92238c017b6a1b575c3638a8d4bfe363` — translated the sync notice at compute time; exact-head run `34695542745` remained red with the same Arabic disclosure-body assertion, proving that literal placement alone was insufficient;
- `b2a130278751882754205053461d7eea5bb7e991` — used Odoo's explicit environment translation API for the computed notice;
- `29b2589e7e71271071f97c9de57dfb97b49b100d` — added the required Odoo 19 `#. odoo-python` metadata to the Python translation entries. This is the authoritative tested application SHA.

The strengthened browser assertion was never weakened, replaced with browser-only hardcoded Arabic, or bypassed.

## Earlier validation chronology

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

### Strengthened-contract red candidate

Application candidate `c25c03dad84ecc113cf2dd0299dfb27cba89b41e`, after localization/title polish `d37500f61e3b23b0b71f78ec3376f85a49c57f45`, was intentionally held to the strengthened Arabic disclosure contract.

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

## Exact-head hosted gate

The Phase 4B workflow runs against `${{ github.sha }}` and retains evidence for the exact tested commit.

Combined addon set:
`fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.

The final authority proves:
- exact-head checkout;
- pinned Odoo exact SHA;
- all inherited Phase 1–4A Odoo tests;
- Phase 4B direct server/formula/security tests;
- Phase 4B browser/UI evidence;
- repeatable seven-addon upgrade on the same database;
- Phase 4A public-web `npm ci`, typecheck, production build and Playwright gate on the same Fares SHA;
- retained logs/screenshots/runtime metadata.

A setup/runner failure is not automatically an application regression. Red chronology is retained above and classified from evidence.

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

Direct ORM/service calls prove:
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

Existing operational ACLs were not weakened and broad accounting/stock groups were not granted just to read reports.

## Public-boundary regression

Phase 4A remains inherited authority. Same-SHA public-web gate continues proving:
- exact five-field catalog DTO;
- enquiry allowlist including required sector and no `source_url`;
- no price/stock/customer/payment/staff/reporting leakage;
- fixture provider and production schema validation remain aligned.

No Phase 4B model/service became an anonymous `/fu/public/*` route.

## Browser / visual evidence

Real Odoo Chrome `browser_js`/hosted screenshot capture follows the existing Fares evidence pattern.

Final retained screenshots include:
- English desktop dashboard;
- Arabic RTL desktop dashboard;
- English narrow/reduced-motion dashboard;
- Arabic RTL narrow/reduced-motion dashboard.

Browser assertions cover:
- localized report title/metric labels;
- true RTL in Arabic;
- visible report date/timezone/as-of context;
- visible and fully localized offline-unsynced disclosure, including the Arabic disclosure body rather than only its label;
- gross/refund/net labels not collapsed into one ambiguous number;
- keyboard focus on refresh/filter/drill-through controls where present;
- reduced-motion compatibility for added non-essential motion;
- no document-level horizontal overflow at representative narrow width;
- no report controls/content visible to a denied role through ordinary navigation.

The four final reporting captures were manually inspected before closure. Manual review also confirmed no internal transient model identifier in the visible title/breadcrumb.

## Performance/shape checks

Tests prove bounded page-size validation and deterministic ordering for list results. No unrealistic production volume benchmark is claimed because production volume remains unknown.

Implementation review avoids speculative warehouse/pre-aggregation infrastructure. A measured performance benchmark remains deferred until real volume exists.

## Evidence outputs

Closure authority:
- authoritative Phase 4B application SHA: `29b2589e7e71271071f97c9de57dfb97b49b100d`;
- workflow run: `34696367320`;
- Odoo job: `103560475350`;
- public-web job: `103560475255`;
- tests: **144 tests, 0 failures, 0 errors**;
- repeatable seven-addon upgrade: **success**;
- public web: typecheck/build success, **8/8 Playwright passed**;
- Odoo artifact: `10299505013`, digest `sha256:428d0f0211a229bd85d35df8444295c2658fb397ce0c910af7302765d4eb543d`;
- web artifact: `10298334239`, digest `sha256:2683575631b5efa75c8db33e3f76f91a64412563d4083f85f491012b8415b13d`;
- manual four-capture review: **PASS**.

Later docs-only closure commits do not supersede the tested application SHA.

## Exit rule

**SATISFIED.** Phase 4B is COMPLETE / VERIFIED against exact application SHA `29b2589e7e71271071f97c9de57dfb97b49b100d`, hosted run `34696367320`, the retained Odoo/web artifacts above, and manual inspection of all four final reporting captures. No merge, deployment, production-resource mutation or real-data migration occurred as part of closure.
