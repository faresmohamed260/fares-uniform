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

The quantity threshold remains configurable but has no accepted initial value. Scheduling semantics, permissions and partial completion are still open. Product/design identity is clarified by D-028.

## D-009 — Introduce product identification
Status: Accepted need, 2026-09-06; format clarified by D-028.

The business currently has no item codes or barcodes and identifies products manually. Introduce product codes/barcodes as part of the system.

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
Status: Developer recommendation, 2026-09-06; superseded for runtime status by D-024.

Authorized documentation/source assessment completed. Community provides inspected core modules; recommend Community operational core, customized native POS and bespoke Vercel public frontend, conditional on hosted proof of offline correctness, workflow extensions and internal visual quality. Custom size/deadline batching and full-balance collection remain project work. No runtime tests, hosting changes or deployment occurred at the time of this decision.

## D-023 — Hosted proof authorized
Status: Client authorization, 2026-09-06.

Client approved proceeding with the bounded hosted Odoo proof. Follow docs/phases/PHASE_0A_ODOO_PROOF.md. Disposable remote CI and prototype changes are authorized; no production deployment or final Odoo adoption is implied. Runtime evidence belongs to docs/validation/ODOO_PROOF.md.

## D-024 — Phase 0A technical proof outcome
Status: Evidence-backed developer decision, 2026-09-07; client visual approval still open.

The hosted Odoo Community proof passed 15/15 bounded tests at implementation commit `1ad528e02ed1a709d34620731d182c5e1cbdebe9` in run `34068805602`. Treat Odoo Community as a conditional technical GO for the tested ERP/domain-core scope, not as an unchanged turnkey solution.

The proof found an Odoo 19.0 offline-startup restore defect: paid unsynced orders can exist safely in IndexedDB but be skipped during offline model hydration. Keep the fix isolated in a Fares addon compatibility shim and retire it only after an upstream fix is adopted and revalidated. Do not fork Odoo core for this issue.

The proof's bilingual/RTL/responsive compatibility passed its bounded checks, but its visual styling is not the final premium UI and has not received client design approval.

## D-025 — Phase 0B foundation continuation
Status: Client continuation authorization, 2026-09-07.

After receiving the Phase 0A result, the client instructed the developer to "keep going." Continue with the bounded Phase 0B architecture/data/UI foundation contract in `docs/phases/PHASE_0B_FOUNDATION.md`. This authorizes remote foundation work within the already accepted MVP direction; it does not silently resolve listed business-policy unknowns, authorize paid resources or authorize production deployment.

## D-026 — Hybrid system ownership
Status: Developer architecture decision under Phase 0B, 2026-09-07; production resource selection remains open.

Use Odoo Community as the operational/domain persistence core and a separate Vercel-targeted Next.js public application. Public browser code does not receive broad Odoo credentials or direct database access; a narrow Fares-owned projection/enquiry API provides allowlisted integration. Do not mirror operational stock/orders/balances into Supabase by default.

Keep internal POS on Odoo/Owl mechanics and extensions. Public React code and internal Owl code share design-system concepts/tokens, not runtime components.

## D-027 — UI component and motion strategy
Status: Developer design-system decision under Phase 0B, 2026-09-07; final visual palette/type/preset remains client-reviewable.

For the public web prototype, prefer maintained source-owned shadcn/ui components before custom generic controls and use Motion for deliberate spring/layout/shared-element transitions. For internal ERP/POS, use Odoo/Owl components and extension points rather than a React checkout rewrite.

Physics/morphing is purposeful, interruptible and non-blocking. Checkout speed wins over decorative motion; reduced-motion, Arabic RTL, keyboard focus and narrow layouts are mandatory review dimensions. Final colors, typography and rendered visual direction remain unapproved until the client reviews representative evidence.

## D-028 — Product identity, sizes and sequential item codes
Status: Accepted by client, 2026-09-07.

School/client-specific designs are stocked as different products rather than generic base garments awaiting later branding. Keep design/client identity at the product-template boundary when units are not interchangeable.

Size systems differ depending on the garment. Size values and attribute sets are configurable per product family; do not hardcode one global size enum.

Use permanent system-managed sequential variant item codes such as `FU-000001`. School, design, size, color, price and location remain separate fields instead of encoded business meaning inside the SKU.

## D-029 — No tracked factory-finished stock location
Status: Accepted by client, 2026-09-07.

The client does not need inventory visibility such as "25 finished pieces still at the factory." Keep `Finished` as a production workflow state and track finished on-hand inventory only when Store or Storage records physical receipt. Do not create a `Factory Finished / Awaiting Transfer` inventory location in the initial model.

`Ready for collection` still requires receipt at the Retail Store.

## D-030 — Phase 0 discovery closure
Status: Evidence-backed project state, 2026-09-07.

Phase 0 business discovery is complete for the accepted first-release boundary. Representative workflows, roles, operating constraints and acceptance scenarios are documented; the client broadly accepted the MVP direction and subsequently confirmed the product/stock choices blocking the first implementation slice.

Remaining policy questions are explicitly deferred to the implementation phases they affect. Their existence does not reopen Phase 0 unless new information changes the accepted release boundary.

## D-031 — Prebuilt-first UI and conspicuous physics/morphing
Status: Accepted by client, 2026-09-07.

Prioritize maintained prebuilt components over hand-built generic UI to reduce interaction, accessibility and styling defects. For the public Next.js application, use official shadcn/Base UI components (or an equally maintained component source that better fits a documented need) before creating a generic control. For internal Odoo/POS, use maintained native Odoo/Owl components and extension points before custom generic widgets.

Custom code should primarily compose Fares-specific workflows, domain presentation and motion around those maintained primitives. A custom generic primitive requires a documented gap showing why an existing maintained component is unsuitable. Do not build a second generic component library merely to support animation.

The client explicitly rejected the first technically passing Phase 0B review baseline as insufficient because it relied too heavily on custom UI and its Motion effects were too subtle. Representative visual work must visibly demonstrate the requested modern physics/morphing language—such as spring state transitions, shared-element morphs and ambient/hero shape morphing—rather than merely installing an animation dependency or adding tiny tap effects. Transaction-critical motion remains non-blocking/predictable and `prefers-reduced-motion` support is mandatory.

## D-032 — Spatial 3D UI is part of the design, not decoration
Status: Accepted by client, 2026-09-07.

The client rejected the revised `fa9ef241...` Phase 0B visual direction as still too basic. A technically passing flat 2D interface with stronger Motion is not sufficient. The approved target requirement is now a **spatial, 3D-first visual language with real physics and morphing behaviors**.

Representative concepts must use meaningful 3D elements, depth, material/lighting, camera or parallax response and physically legible state changes. Physics should include real behavior where appropriate—such as inertia, spring/damping, collision or magnetic snapping—not only CSS transforms that imitate depth. Morphing should preserve object/state continuity across meaningful transitions rather than relying on ordinary fades/slides.

3D must participate in the workflow: products, cart/order state, production queues or public catalog presentation should behave like tangible spatial objects or surfaces. A flat dashboard with a decorative Three.js blob/background does not satisfy this requirement.

Prebuilt-first still governs ordinary controls. Buttons, fields, dialogs, tabs, menus, forms and accessibility infrastructure remain maintained components. Custom 3D/physics scene code is acceptable only for spatial behavior that ordinary maintained UI primitives do not provide, and should itself prefer maintained scene/physics abstractions where possible.

Transaction-critical flows must remain immediate and usable without the 3D interaction path. Barcode scanning/payment cannot be blocked by cinematic motion; every physics-only gesture needs an accessible maintained-control equivalent. Reduced-motion, low-performance and WebGL-unavailable fallbacks must preserve the workflow and information hierarchy.

The current visual baselines are historical technical evidence only. Phase 0B visual approval remains open until a new spatial concept is explicitly accepted. See `docs/ui/SPATIAL_CONCEPT_BRIEF.md`.
