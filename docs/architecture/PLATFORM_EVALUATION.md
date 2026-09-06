# Odoo fit assessment and UI direction

Status: DOCUMENTATION / COMMUNITY SOURCE ASSESSMENT COMPLETE, 2026-09-06. Recommendation only; no runtime trial, platform adoption, provisioning or deployment.
Client authorized this assessment with "go ahead" after the proposed feature-by-feature evaluation.

## Recommendation

Use Odoo Community as the leading candidate for the operational core, retain and customize its POS, and build a bespoke public frontend on Vercel. Proceed to a bounded hosted proof of fit before final adoption. This is a conditional recommendation, not a claim that every requirement already works.

Avoid rebuilding the entire POS in React initially: that sacrifices reuse of frontend payment, receipt, offline and order behavior. Preserve the client's premium internal UI target through Odoo-native customization, subject to a rendered design checkpoint. If that checkpoint fails, reconsider the architecture explicitly.

## Evidence method

Inspected public Odoo 19.0 source at commit **1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf** through GitHub, with official documentation. This is the observed assessment baseline, not an immutable deployment selection.

Read manifests for stock, point_of_sale, pos_sale, sale_management, crm, mrp and web. All declare LGPL-3 and exist in Community source. This verifies module availability, not runtime correctness or every feature marketed under the app name.

Official website full-page fetches repeatedly timed out. POS overview, shop features and payment-method documentation were instead read from the official odoo/documentation repository, 19.0 branch. Other cited documentation was examined through official search excerpts. No third-party addon has been selected or audited.

## Requirement fit matrix

Legend: Standard = reusable native foundation; Configure = setup needed; Extend = project code needed or conservatively budgeted; Prove = runtime verification required. Classifications are engineering assessment, not measured completion.

| Requirement | Classification | Reuse and remaining work |
| --- | --- | --- |
| Finished garments, sizes/colors | Standard + Configure | Product/variant and stock models; define client/school design identity and size labels. Do not mix distinct designs when batching. [S1] |
| One store and storage location | Standard + Configure | Locations, receipts, transfers and stock adjustments; map physical factory completion to stock movements. [S1] |
| Codes, barcode scan and labels | Standard + Configure + Prove | Product/barcode infrastructure and label report entries exist. Define code issuance and printer layout; barcode scanning does not imply every Enterprise warehouse-scanning feature is included. [S1,S2,S8] |
| Ordinary POS sale and receipt | Standard + Configure | Community POS foundation and stock-account dependencies; retain native mechanics. [S2] |
| Cash and manually confirmed InstaPay | Configure + Prove | Named payment methods/journals provide a recording foundation. Staff confirmation evidence and missing notification handling need definition; no automatic bank integration claimed. [S5] |
| Offline checkout | Standard foundation + Prove | Official POS overview supports temporary outages. Must prove queued sale persistence, offline reload/reopen, retry and conflict behavior on the chosen revision. Not equivalent to offline back-office ERP. [S2,S4] |
| Preorder with deposit/pickup date | Standard foundation + Extend + Prove | POS–Sales supports partial down payments/full settlement; Ship Later supports deferred delivery. Factory pickup receipts and unified balance/collection workflow need adaptation. Do not treat Ship Later as identical to collection. [S3,S4] |
| Full balance before partial pickup | Extend + Prove | Explicit business validation plus independent collected quantities; native down payments alone do not establish this policy. [S3,S4] |
| Refund and size exchange | Standard foundation + Configure + Extend as needed | Return/refund foundation exists; approval rules, exchange pricing and stock disposition need a defined workflow and tests. Offline returns are not assumed. [S1,S2] |
| Size-specific accumulated demand OR seven-day deadline | Extend | Native min/max forecast-stock replenishment is different from aggregating unfulfilled customer demand by size and pickup deadline. Add idempotent task creation and preserve order allocation. [S6] |
| In production / Finished / Ready for collection | Extend | Prefer a lightweight production-task addon linked to native stock moves for finished-only MVP. Do not require raw-material BoMs merely to gain statuses. MRP is available if future needs justify it. [S1,S7] |
| Large-client enquiry/order lifecycle | Standard + Configure + Extend | CRM/Sales foundation; sample approval details and manufacturing linkage need small extensions. Preserve deposit and final balance semantics. [S3,S7] |
| Owner reports | Standard foundation + Extend | POS reporting files exist; consolidate payments, sales, low stock, due dates and balances using precise definitions. No assumption that an Enterprise dashboard is included. [S2] |
| Role/location permissions | Standard framework + Extend + Prove | Existing module security declarations; custom roles, restrictions, audit and offline revalidation need explicit implementation. [S1,S2] |
| English/Arabic | Standard localization foundation + Prove | Language support exists; review actual app translations, custom strings, RTL and printed Arabic on selected interfaces. [S9] |
| Brand-independent hardware | Configure + Prove | Keyboard-emulating scanners and browser receipt printing offer a practical baseline. Direct/silent printer integration has specific compatibility requirements. [S8] |
| Public catalog without prices/stock | Custom frontend + narrow integration | Public allowlist projection; no internal prices/stock in page data, APIs or metadata. Website form creates restricted enquiry records; WhatsApp/phone links initially. |
| Premium physics/morphing UI | Extend native UI + custom public frontend | Native Odoo uses Owl; React components are not drop-in Odoo components. Rendered approval is essential. [S10,S11] |

## Proposed architecture and ownership

- Odoo Community: operational products, stock, customers, orders, recorded payments and task extensions. Database plus filestore form the operational persistence boundary.
- Vercel: bespoke public website/catalog. Server-side integration exposes only publishable fields and tightly constrained enquiry submission.
- Supabase: no operational mirror by default. Reusing Odoo means we do not need to duplicate stock or balances here; any separate use needs a concrete reason.
- Cloudflare: potential DNS/proxy/media role remains optional; current resources are not selected or mutated.
- GitHub: our addons, frontend, tests, source pins, remote deployment configuration and authoritative docs. Prefer addons over editing/forking core.
- Odoo hosting requires a compatible persistent server, PostgreSQL and filestore; Vercel is not the proposed Odoo host. This is an architectural inference from Odoo's server deployment model. [S12]
- Avoid direct public database access and dual writes. Website failures must not block store operation.

Important dependency finding: Community point_of_sale depends on stock_account and other core modules. Excluding a full accounting product from MVP does not mean Odoo can run POS without its supporting accounting models. Configure the minimum valid journals/accounts while keeping irrelevant operational screens out of the staff workflow. [S2]

## Edition, licensing and cost boundary

Community is a viable starting point because inspected modules are LGPL-3. Preserve applicable notices and inspect licenses of every dependency/addon. Proprietary Enterprise code must not be copied into the public repository. [S13]

Odoo Online excludes custom modules, so it is unsuitable for the proposed custom batch/collection addons. Odoo.sh or another compatible cloud host are alternatives; Odoo.sh commercial subscription/hosting and external API plan terms must be checked for the chosen offer. Do not apply hosted-plan assumptions blindly to self-hosted Community. [S14]

No per-user Enterprise subscription is proposed for this Community candidate, but hosting, backups, upgrades, implementation and addon maintenance still cost effort/money. No subscription or server has been purchased. Exact cost comparison remains pending resource selection; current assessment does not guarantee free deployment.

## Premium UI plan

Public website candidate: React with maintained accessible primitives and Motion spring/layout/shared-element transitions. Motion documents these capabilities; no dependency version or paid component is selected. [S11]

Internal ERP/POS candidate: Odoo-native Owl components, custom styles/tokens and selected framework-compatible motion. Do not mount a parallel React checkout or replace Odoo services merely to reuse a visual demo.

Proposed checkpoints:
1. Catalog: product-card-to-detail morphing, deliberate image layout and responsive typography.
2. POS: polished product grid/cart, responsive panels and restrained feedback without delaying scan/payment entry.
3. Order/production: clear timeline, stable task interactions and contextual details.

All three must meet the same brand quality. Review desktop/narrow, Arabic RTL, keyboard focus, reduced motion and actual checkout responsiveness. Fancy public pages do not compensate for an unapproved internal interface. If matching the target requires invasive core patches, treat that as an architectural cost and reconsider.

## Proof-of-fit gates before adoption

This assessment did not execute tests. The next bounded contract should provide a hosted disposable Community environment with synthetic data and no production integrations, then:
- Install pinned Community modules without an Enterprise dependency.
- Sell a variant, print a receipt, return/exchange, and reconcile stock/payment totals.
- Collect a deposit, complete full settlement, release part of an order and keep remaining quantities owed.
- Disconnect POS, sell, reload/reopen, reconnect repeatedly and prove no lost/duplicate transactions. Exercise pending transactions across a few hours, delayed bank confirmation and conflicting online stock changes.
- Demonstrate one minimal batching/collection extension, including duplicate trigger runs.
- Render a styled POS and order view in English/Arabic with compatible barcode input/browser printing.
- Verify public projection excludes private fields and enquiry input cannot write arbitrary ERP records.
- Review persistence/backup requirements and concrete host costs before selecting deployment.

Exit: clear pass/fail evidence and bounded remaining work, plus client visual acceptance. Failure of offline correctness, required workflow extension seams or internal visual fit triggers a revised recommendation.

## Sources

- S1: [Community Inventory manifest](https://github.com/odoo/odoo/blob/1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf/addons/stock/__manifest__.py).
- S2: [Community POS manifest](https://github.com/odoo/odoo/blob/1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf/addons/point_of_sale/__manifest__.py).
- S3: [Community POS–Sales manifest](https://github.com/odoo/odoo/blob/1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf/addons/pos_sale/__manifest__.py).
- S4: [Official POS overview source](https://github.com/odoo/documentation/blob/19.0/content/applications/sales/point_of_sale.rst), [shop features source](https://github.com/odoo/documentation/blob/19.0/content/applications/sales/point_of_sale/shop.rst).
- S5: [Official payment-method source](https://github.com/odoo/documentation/blob/19.0/content/applications/sales/point_of_sale/payment_methods.rst).
- S6: [Reordering rules](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/warehouses_storage/replenishment/reordering_rules.html).
- S7: Community [Sales](https://github.com/odoo/odoo/blob/1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf/addons/sale_management/__manifest__.py), [CRM](https://github.com/odoo/odoo/blob/1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf/addons/crm/__manifest__.py), [MRP](https://github.com/odoo/odoo/blob/1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf/addons/mrp/__manifest__.py).
- S8: [Scanner compatibility](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/barcode/setup/device_troubleshooting.html), [receipts](https://www.odoo.com/documentation/19.0/applications/sales/point_of_sale/use/receipts.html).
- S9: [Languages](https://www.odoo.com/documentation/19.0/applications/general/users/language.html).
- S10: [Owl components](https://www.odoo.com/documentation/19.0/developer/reference/frontend/owl_components.html).
- S11: [Motion layout animations](https://motion.dev/docs/react-layout-animations), [spring/layout introduction](https://motion.dev/docs/react).
- S12: [Source installation](https://www.odoo.com/documentation/19.0/administration/on_premise/source.html).
- S13: [Odoo licenses](https://www.odoo.com/documentation/19.0/legal/licenses.html).
- S14: [Odoo Online](https://www.odoo.com/documentation/19.0/administration/odoo_online.html), [pricing](https://www.odoo.com/pricing), [API terms](https://www.odoo.com/documentation/19.0/developer/reference/external_api.html).
