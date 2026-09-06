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

POS checkout must continue during internet outages. This requires a deliberate offline transaction and synchronization design; it does not authorize local development. Offline scope beyond checkout, payment confirmation and device/concurrency limits remain open.

## D-014 — Full balance before partial collection
Status: Accepted by client, 2026-09-06.

Collect the entire remaining preorder balance before releasing even part of that order. Track remaining uncollected items independently from payment completion.

## D-015 — Catalog visibility and enquiry routes
Status: Accepted by client, 2026-09-06.

Public catalog shows neither prices nor stock availability. Provide combined website-form, WhatsApp and phone enquiry routes. Automated messaging and third-party integrations are not implied.
