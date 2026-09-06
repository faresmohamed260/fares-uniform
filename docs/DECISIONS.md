# Decision log

## D-001 — Independent public repository
Status: Accepted by client, 2026-09-06.

Use faresmohamed260/fares-uniform, titled Fares Uniform, for the clothing-factory ERP. The client created and supplied the repository. Keep project source and documentation here.

## D-002 — Repository authority and remote-only execution
Status: Accepted by client, 2026-09-06.

Repository docs are the ground source of truth. Do not rely on session memory or local files and never work locally. Use remote source changes and hosted execution. Record client decisions so another session can resume from the repository.

## D-003 — Initial hosting and available services
Status: Accepted by client, 2026-09-06.

Vercel is the initial deployment target; Supabase and Cloudflare are available. This does not select a framework, database schema, Cloudflare product, existing resource, domain or subscription. Those decisions follow discovery.

## D-004 — Client-led discovery and documented development
Status: Accepted by client, 2026-09-06.

The assistant acts as developer and gathers information from Fares as client to make the ERP suitable to the factory. Plan and document work in the repository. Use RenderLab's work/documentation instructions as the initial process reference, with this project's explicit remote-only and repository-only rules taking precedence.

## D-005 — Marketing/exposure priorities
Status: Accepted by client, 2026-09-06.

Within marketing/exposure, prioritize attracting large clients such as international schools and franchise restaurants ordering shipments under contracts with upfront payment. Catalog browsing is second. Other discussed marketing outcomes, including online purchasing and store discovery, are lower-priority future work.

This does not place marketing above operational inventory/order tracking or POS, mandate all business clients pay upfront, or approve a particular website/CRM implementation. Detailed requirements remain in docs/requirements/DISCOVERY.md.

## D-006 — Finished-garment inventory and simple production tracking
Status: Accepted by client, 2026-09-06.

Initial inventory tracks finished clothes. Initial production tracking uses In production, Finished and Ready for collection. Material and work-in-progress stock accounting are outside the initial inventory boundary.

Automatic triggering with a user-tunable preset is requested. D-008 clarifies grouping, deadline default and task/status behavior. Quantity threshold default and authorization remain open.

## D-007 — Large-client payment workflow clarification
Status: Client clarification, 2026-09-06.

The described large-client process takes a deposit after sample approval, starts production against a delivery date, then ships and collects the remaining payment. D-005's upfront-payment preference must not be interpreted as mandatory full prepayment. Exact balance timing and payment percentages remain open.

## D-008 — Size-specific tasks and pickup lead time
Status: Accepted by client, 2026-09-06.

Aggregate demand separately per item size. Automatically create a production task when the configured quantity threshold is reached or the pickup date is seven days away, with the seven-day lead time configurable. Staff mark In production when work begins. Finished means factory completion; Ready for collection means received at the store.

The quantity threshold remains configurable but has no accepted initial value. Color/design grouping details, scheduling semantics, permissions and partial completion are still open.

## D-009 — Introduce product identification
Status: Accepted need, 2026-09-06.

The business currently has no item codes/barcodes and identifies products manually. Introduce product codes/barcodes as part of the system. Exact formats, variant model and hardware remain undecided.

## D-010 — Payments, returns and partial collection
Status: Accepted by client, 2026-09-06.

Cash and InstaPay are initial payment methods; cards and wallets are future work. Refunds, size exchanges and partial preorder collection are supported needs. Payment integrations and detailed eligibility/settlement rules are not yet selected.

## D-011 — Delegated role design
Status: Client delegation; initial developer design recorded, 2026-09-06.

The developer selects conventional roles and access boundaries. See docs/requirements/ROLES_AND_PERMISSIONS.md for the initial role matrix. This does not establish actual staff count or assignments.

## D-012 — Bilingual and hardware-independent support
Status: Accepted by client, 2026-09-06.

Support English and Arabic, including interface/receipts and appropriate text direction. Avoid hardcoded printer/scanner brands; define support by capabilities/interfaces. Actual hardware compatibility remains unverified. Offline checkout is required under D-013.

## D-013 — Mandatory offline checkout
Status: Accepted by client, 2026-09-06.

POS checkout must continue during internet outages. This requires a deliberate offline transaction and synchronization design; it does not authorize local development. D-016 records the initial operating envelope and confirmation practice; offline scope beyond checkout and detailed reconciliation rules remain open.

## D-014 — Full balance before partial collection
Status: Accepted by client, 2026-09-06.

Collect the entire remaining preorder balance before releasing even part of that order. Track remaining uncollected items independently from payment completion.

## D-015 — Catalog visibility and enquiry routes
Status: Accepted by client, 2026-09-06.

Public catalog shows neither prices nor stock availability. Provide combined website-form, WhatsApp and phone enquiry routes. Automated messaging and third-party integrations are not implied.

## D-016 — Checkout operating envelope and payment confirmation
Status: Client-confirmed operating facts, 2026-09-06.

One checkout device per store; current outages last a few hours at most. Staff use bank mobile transaction notifications for InstaPay confirmation. No automatic bank integration is selected. Missing-notification handling and synchronization conflicts remain to be specified.

## D-017 — Manual readiness notifications initially
Status: Accepted by client, 2026-09-06.

Staff notify customers manually when orders are ready. Automated customer notifications are planned future work.

## D-018 — Operational reports now, advanced analytics later
Status: Accepted by client, 2026-09-06.

MVP includes daily sales, cash/InstaPay totals, low stock, upcoming/overdue orders and customer balances. Decision-making analytics is a future feature. Exact report formulas and filters remain design work.

## D-019 — Unknown volumes and deferred budget/timing
Status: Client-confirmed, 2026-09-06.

The business is small; numeric volumes are unavailable. No launch date or monthly service budget is set; determine them before deployment. Continue planning without invented estimates or spending authorization.

## D-020 — Broad scope agreement and reuse evaluation
Status: Client direction, 2026-09-06.

Client broadly agrees with the MVP and asks whether Odoo can avoid rebuilding standard ERP functions. Evaluate reuse before choosing architecture. No Odoo adoption, hosting change or spending is approved.

## D-021 — Premium modern interactive UI
Status: Accepted client requirement, 2026-09-06.

Aim for polished modern web UI/UX with physics and morphing effects. Apply this to web components generally. Record design decisions and maintained component sources; validate representative screens, RTL, accessibility and performance. See docs/architecture/PLATFORM_EVALUATION.md for initial design direction and platform implications.

## D-022 — Odoo assessment outcome
Status: Developer recommendation, 2026-09-06; platform adoption pending.

Authorized documentation/source assessment completed. Community provides inspected core modules; recommend Community operational core, customized native POS and bespoke Vercel public frontend, conditional on hosted proof of offline correctness, workflow extensions and internal visual quality. Custom size/deadline batching and full-balance collection remain project work. No runtime tests, hosting changes or deployment occurred.

## D-023 — Hosted proof authorized
Status: Client authorization, 2026-09-06.

Client approved proceeding with the bounded hosted Odoo proof. Follow docs/phases/PHASE_0A_ODOO_PROOF.md. Disposable remote CI and prototype changes are authorized; no production deployment or final Odoo adoption is implied. Runtime evidence now belongs to docs/validation/ODOO_PROOF.md; D-022 records the earlier source-assessment state.
