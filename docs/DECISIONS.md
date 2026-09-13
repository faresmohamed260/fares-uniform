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

## D-033 — Modern practical operational ERP visual direction
Status: Accepted by client, 2026-09-07; supersedes D-032 for dense operational ERP surfaces.

The client clarified that the earlier 3D-first correction was being judged on a dashboard and approved a **modern, practical operational ERP** direction instead. Dashboard, POS, Products, Production, Sales Orders and Customers should use a clean contemporary SaaS visual language: strong information hierarchy, restrained depth/shadow, legible tables/cards, clear status semantics, touch-friendly POS controls and bilingual EN/AR structure. These dense work surfaces must not be turned into cinematic 3D scenes or futuristic demo interfaces.

D-032 remains useful for **expressive surfaces**, not as the default composition for dense ERP work. Rich 3D, real physics and morphing are still desired for the public/marketing site, product showcase/detail and carefully chosen low-frequency transitions where they improve the experience without harming business-task clarity. Operational motion may use polished springs/shared-layout continuity, but scanning, checkout, stock work and data-heavy screens remain stable and practical.

D-031 remains mandatory: use maintained prebuilt components before custom generic controls. The client-approved concept board is represented durably by this decision and `docs/ui/DESIGN_SYSTEM.md`; the generated conversation image itself is not runtime evidence.

## D-034 — Phase 2B policy closure and development continuation
Status: Accepted policies recorded 2026-09-09; explicit development continuation 2026-09-10.

[Phase 2B policy decisions](requirements/PHASE_2B_POLICY_DECISIONS.md) closes P2B-01 through P2B-05: preorder creation, additional payments and collection require connectivity; any positive payment up to the remaining balance is allowed; stock is allocated only when physically available at the Retail Store; ready subsets may be collected after the whole balance is settled.

The client explicitly instructed continued development on the existing Phase 2B branch using repository docs and exact-head hosted CI. This authorizes the narrow evidence-supported fixture/compatibility corrections and continued validation. It does not authorize a merge or production deployment. Current evidence belongs in `docs/validation/PHASE_2B_PREORDER_COLLECTION.md`.

## D-035 — Phase 2C consumer-retail return/exchange closure authority
Status: Evidence-backed project state, 2026-09-11; accepted P2C policy remains unchanged.

Phase 2C closes for the accepted consumer-retail scope at application/test SHA **`62369e62dd1e5d2505e089c6a5ede296a24bcb3b`**. GitHub Actions workflow `Phase 2C retail returns`, run **`34596450064`**, job **`103253225096`**, passed the combined Phase 1 through Phase 2C hosted gate with **82/82 tests, 0 failures and 0 errors**, then passed the repeatable `fu_core,fu_retail,fu_preorder` upgrade on the same database and application SHA.

The exact-head evidence artifact is ID **`10262414135`**, name `phase2c-returns-62369e62dd1e5d2505e089c6a5ede296a24bcb3b`, digest **`sha256:de110b0bd73593d7248f396acb1df35c80c5c711edac14b83773b54d86e1a475`**. Representative English and Arabic/RTL desktop/narrow browser evidence, keyboard focus, controlled POS online navigation and offline fail-closed behavior passed and are retained in the artifact.

Treat `62369e62...` as the Phase 2C **application authority**. Later closure-documentation commits on `phase-2c/refunds-exchanges` do not become newer application proof merely by being branch HEAD.

The completed design preserves the accepted P2C-01 through P2C-07 policy and native Odoo ownership: original sale/payment history remains immutable, refunds/exchanges are source-linked, cumulative quantity is bounded, Cash/confirmed-InstaPay settlement is attributable, mixed-method allocation fails closed, returned stock is quarantined until explicit inspection disposition, size exchanges preserve both native legs and exact difference settlement, and request/approval/execution fail closed offline. Routine staff use the controlled Fares Returns & Exchanges path; direct native refund/negative-line/sync mutation remains denied server-side outside an approved request.

This decision does not authorize mixed-method refund allocation, preorder cancellation/refund, cards/wallets, B2B return policy, automatic bank integration, legal/tax finalization, merge, production deployment or real-data migration. Those remain later bounded decisions.

## D-036 — Phase 3A preorder-production closure authority
Status: Evidence-backed project state, 2026-09-11; inherited production/business policy remains unchanged.

Phase 3A closes for the accepted bounded preorder-production scope at application/test SHA **`ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`**. GitHub Actions workflow `Phase 3A preorder production`, run **`34601274874`**, job **`103268897396`**, passed the combined Phase 1 through Phase 3A hosted gate with **93 tests, 0 failures and 0 errors**, then passed the repeatable `fu_core,fu_retail,fu_preorder,fu_production` upgrade on the same database and exact application SHA.

The exact-head evidence artifact is ID **`10264163466`**, name `phase3a-production-ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`, digest **`sha256:0e94e65beaa25c92c27337c200186dd765c2a5f1c1ee9b5735130a0fc60770d5`**. Representative English and Arabic/RTL desktop/narrow production views, keyboard focus and reduced-motion layout evidence passed and were manually reviewed. Production browser logs ended with successful test markers and no application JavaScript/test exception; only expected headless Chrome environment noise was present.

Treat `ff12c22e...` as the Phase 3A **application authority**. Later closure-documentation commits on `phase-3a/preorder-production-queue` do not become newer application proof merely by being branch HEAD.

The completed design preserves D-006, D-008 and D-029: production demand is grouped by exact variant/size; a positive configured quantity threshold or the configurable seven-day deadline boundary creates queued production work; Production Manager/Owner explicitly starts and finishes tasks; cumulative non-cancelled source coverage is bounded and retry-safe; factory `Finished` remains workflow-only; and `Ready for collection` still requires physical Retail Store stock/allocation under Phase 2B.

Native Odoo `mrp.production` is deliberately not the Phase 3A authority because the accepted MVP excludes raw-material/WIP and factory-finished inventory accounting while pinned native MRP owns component/finished stock moves and locations. Odoo stock records remain the sole finished-stock custody truth.

This decision does not authorize a positive default quantity threshold, raw/WIP inventory, Bills of Materials, automatic Retail Store receipt, preorder cancellation/refund, B2B final-payment/partial-shipment behavior, customer notification automation, merge, deployment or real-data migration. Those remain later bounded decisions.

## D-037 — Phase 4B operational-reporting closure authority
Status: Evidence-backed project state, 2026-09-12; inherited reporting/public/security policy remains unchanged.

Phase 4B closes for the accepted operational-reporting scope at application/test SHA **`29b2589e7e71271071f97c9de57dfb97b49b100d`**. GitHub Actions workflow `Phase 4B operational reporting`, run **`34696367320`**, Odoo job **`103560475350`**, passed the combined Phase 1 through Phase 4B hosted gate with **144 tests, 0 failures and 0 errors**, then passed the repeatable `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting` upgrade on the same database and exact application SHA.

The same-SHA public-web job **`103560475255`** passed typecheck, production build and **8/8 Playwright tests**, preserving the Phase 4A anonymous/public boundary. The final Odoo artifact is ID **`10299505013`**, name `phase4b-odoo-29b2589e7e71271071f97c9de57dfb97b49b100d`, digest **`sha256:428d0f0211a229bd85d35df8444295c2658fb397ce0c910af7302765d4eb543d`**. The web artifact is ID **`10298334239`**, name `phase4b-web-29b2589e7e71271071f97c9de57dfb97b49b100d`, digest **`sha256:2683575631b5efa75c8db33e3f76f91a64412563d4083f85f491012b8415b13d`**.

Manual inspection of the retained English desktop/narrow and Arabic RTL desktop/narrow reporting captures passed. The full Arabic offline-sync disclosure body and label are localized; the title/breadcrumb is localized with no `fu.reporting.dashboard,<id>` leakage; RTL is genuine; report sections/refresh/timezone/as-of remain usable; narrow/reduced-motion evidence is sound; and the passing browser contract proves keyboard focus plus no document-level horizontal overflow.

The red chronology remains authoritative evidence of the quality gate: candidate `89378db5b0fa5b9624a96a34b9648de2d9e2f86a` was automated-green but manually rejected; candidate `c25c03dad84ecc113cf2dd0299dfb27cba89b41e` intentionally failed the strengthened Arabic disclosure assertion; the final fix uses Odoo 19 Python-translation metadata (`#. odoo-python`) and environment translation rather than weakening the assertion or hardcoding browser-only Arabic.

Treat `29b2589e7e71271071f97c9de57dfb97b49b100d` as the Phase 4B **application authority**. All later Phase 4B closure-documentation commits, including this decision-log commit, are documentation lineage only and do not become newer application proof merely by being branch HEAD.

This decision does not authorize merge, production deployment, domain/secret/resource mutation, real-data migration, advanced analytics/BI, report exports/scheduled delivery, cards/wallets, bank API integration, or any deferred B2B/refund/accounting policy. Integrated UAT/onboarding rehearsal and any deployment planning remain separate, explicitly authorized work.

## D-038 — Phase 5 integrated UAT/onboarding closure authority
Status: Evidence-backed project state, 2026-09-12; inherited MVP, security, public and operational policies remain unchanged.

Phase 5 closes at authoritative application/UAT SHA **`5d23e56e72122014a7f886ee7f4ec24d3153c78a`**. GitHub Actions workflow `Phase 5 integrated UAT`, run **`34698087230`**, Odoo/UAT job **`103564935283`**, passed the combined inherited plus integrated gate with **148 tests, 0 failures and 0 errors**. The same database then passed the repeatable upgrade of the seven production addons `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`; the test-only `fu_uat` addon remains evidence infrastructure and is not production upgrade authority.

The same-SHA public-web job **`103564935388`** passed locked dependency install, typecheck, production build and **8/8 Playwright tests**, preserving the accepted public allowlists and EN/AR browser behavior. The final Odoo/UAT artifact is ID **`10298859526`**, name `phase5-odoo-uat-5d23e56e72122014a7f886ee7f4ec24d3153c78a`, digest **`sha256:510f57a2f1b8c6cfc9b6627c086240b1e03a069112c8780c0cc51bb78f28c0c5`**. The web artifact is ID **`10298634549`**, name `phase5-web-5d23e56e72122014a7f886ee7f4ec24d3153c78a`, digest **`sha256:cabf625930954e29dfd413cbfc24c5c5c4cf95713c15cd754bc3e64b0f44dc5f`**.

Manual inspection of representative stock, preorder/collection, returns/exchange, business-client, production, reporting and public EN/AR desktop/narrow evidence passed release usability, RTL, narrow-layout, public-isolation and reporting-disclosure checks. One inherited finding remains open as **P2-001**: selected field/help labels on some internal Arabic forms still render in English. This is a documented localization-quality item with no data, authorization or core-workflow impact. Open P0: **0**. Open P1: **0**. Open P2: **1**.

The synthetic onboarding rehearsal is complete and proves configurable store/storage, named roles/location scopes, product-size/variant identity, attributable opening and transfer stock, Cash/InstaPay classification, preorder-production configuration, public catalog/enquiry and reporting/role smoke paths without hardcoding real business-specific values into source.

Treat `5d23e56e72122014a7f886ee7f4ec24d3153c78a` as the Phase 5 **application/UAT authority**. Documentation-only closure commits after it, including `dba56ab30b8fd6b93a51500ebeb86278d1af96bc` and this decision-log commit, are documentation lineage only and do not become newer application proof merely by being branch HEAD.

Phase 5 closure does **not** authorize merge, production deployment, live cutover, paid resources, domain/DNS/certificate or secret changes, real-data migration, cards/wallets, bank API automation, advanced analytics/BI, scheduled report delivery, raw-material/WIP inventory, or deferred commercial/accounting policies. Production remains **NO-GO** until the unchecked production-specific hosting/persistence, restore, hardware, staff, cutover, monitoring, budget and launch decisions in `docs/operations/DEPLOYMENT_READINESS.md` are explicitly resolved and deployment is separately authorized.

## D-039 — Phase 5A Arabic launch-quality closure authority
Status: Evidence-backed project state, 2026-09-12; inherited MVP, security, public, operational and deployment boundaries remain unchanged.

Phase 5A closes at authoritative application/test SHA **`cc2656d7529cfd4af396ddd0af6444a0f6600dc8`**. GitHub Actions workflow `Phase 5A Arabic polish`, run **`34700625051`**, Odoo/UAT job **`103571619120`**, passed the combined inherited plus Arabic-polish gate with **149 tests, 0 failures and 0 errors**. The same database then passed the repeatable upgrade of the seven production addons `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`; `fu_uat` remains test-only evidence infrastructure.

The same-SHA public-web job **`103571619062`** passed locked dependency install, typecheck, production build and **8/8 Playwright tests**. The Odoo/UAT artifact is ID **`10300402418`**, name `phase5a-odoo-uat-cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, digest **`sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`**. The web artifact is ID **`10300486494`**, name `phase5a-web-cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, digest **`sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`**.

Fresh manual review of successful-run preorder, returns, production, reporting and public Arabic desktop/narrow/reduced-motion evidence passed. `P2-001` is **RESOLVED / CLOSED**. English that remains visible in the reviewed internal captures is synthetic fixture/data content such as location, product or user values rather than the targeted Fares-owned label/help/connectivity text. Open release-candidate P0: **0**. P1: **0**. P2: **0**.

The first implementation candidate `f5e2f03b92fc54aa433ba3ad3753bd68fb885030`, run `34699969872`, remains **RED / NON-AUTHORITATIVE**: its Odoo gate ended `1 failed, 0 error(s) of 149 tests` because the new browser test tried to focus Create while it was intentionally offline and disabled. Required Arabic and offline fail-closed assertions had already passed, and the repeatable upgrade was not reached. Final authority `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` corrects only the test sequencing after reconnect; the localization implementation is unchanged.

Treat `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` as the Phase 5A **application/test authority**. Later closure-documentation commits, including this decision-log commit, are documentation lineage only and do not become newer application proof merely by being branch HEAD. Phase 5A does not change business logic, permissions, the anonymous/public contract or deployment configuration.

Phase 5A closure does **not** authorize merge, production deployment, live cutover, paid resources, domain/DNS/certificate or secret changes, or real-data migration. Production remains **NO-GO** until the unchecked production-specific requirements in `docs/operations/DEPLOYMENT_READINESS.md` are explicitly resolved/proven and deployment is separately authorized.

## D-040 — Phase 6 provider-neutral deployment-readiness closure authority
Status: Evidence-backed project state, 2026-09-13; application authority and production authorization remain unchanged.

Phase 6 repository/CI scope closes at deployment-package SHA **`e337315684c62d69ad75ba56a5867098da17489c`**. GitHub Actions workflow `Phase 6 deployment readiness`, run **`34726690763`**, job **`103641932057`**, completed every required package, security, persistence, backup, destructive clean-volume restore and post-restore application check successfully.

The exact-head evidence artifact is ID **`10307809040`**, name `phase6-deployment-e337315684c62d69ad75ba56a5867098da17489c`, digest **`sha256:4367f4fd3085aa38b6381ef9cca0168bef0951b7e2d63cce67cd5b390fb0ae38`**. Source-authority evidence records Phase 5A application/test SHA `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, exact Odoo SHA `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`, and `application_source_diff=none` for `addons` and `apps/public-web`.

The green proof preserves the intended security model rather than weakening it: file-backed secrets remain restrictive, `fares_app` is not superuser/createdb/createrole, database/extension ownership remains with `postgres`, database-management routes remain blocked, Odoo remains fixed non-root UID/GID `10001:10001`, and only the operations restore boundary initializes ownership of a newly recreated Odoo data volume. Coordinated PostgreSQL+filestore backup verification, incomplete-set rejection, application-container replacement persistence, destructive `down -v` recovery and restored attachment/database facts all pass.

The retained RED chronology—unreadable DB secret, PostgreSQL validation PATH, proxy liveness redirect, internal-only edge networking, prefork shell bind, extension-comment ownership and fresh-volume ownership—is part of the validation evidence and must not be rewritten as green history. See `docs/validation/PHASE_6_DEPLOYMENT_READINESS.md`.

Treat `e337315684c62d69ad75ba56a5867098da17489c` as the Phase 6 **deployment-package authority**, not a new business-application authority. Phase 5A `cc2656d...` remains the business-application/test authority because Phase 6 exact-head evidence proves no application-source diff.

Phase 6 closure means the provider-neutral package is ready for provider-specific paid-staging evaluation after explicit operator choices. It **does not** select a hosting provider/region/server/budget, production backup retention/RPO/RTO, object-store resource, paid staging model, domain/DNS/TLS/access, secret owners, store hardware, named staff, real-data cutover, monitoring ownership or launch timing. It does not authorize paid/live resource creation, account mutation, production deployment, real secrets, real data or production cutover. Production remains **NO-GO** until those items are explicitly resolved and the next live stage is separately authorized.

## D-041 — Vercel selected as deployment-platform direction
Status: Accepted by client, 2026-09-13; supersedes the Phase 6 single-VPS/Hetzner recommendation but does not supersede Phase 6 validation evidence.

The client instructed the project to **use Vercel, like RenderLab and SAGA**. Treat Vercel as the selected deployment-platform direction for Fares Uniform. Do not continue designing the intended production architecture around Hetzner, DigitalOcean, Render or another VPS provider unless later evidence or a new client decision changes this direction.

The selected pattern is Vercel application/runtime deployment with durable state in managed backing services rather than local container disks. `apps/public-web` remains Vercel-native. Private Odoo is to be adapted and proven as a stateless Vercel container/Service candidate; managed PostgreSQL is external, with Supabase the preferred first candidate because it is already an accepted/available project service family. Odoo attachments should first be proven using native database-backed storage, filesystem-backed HTTP sessions must be replaced with a shared server-side store, scheduled work must not rely on an immortal local cron process, and Odoo bus/WebSocket behavior must tolerate runtime replacement/reconnect.

This decision does not invalidate deployment-package authority `e337315684c62d69ad75ba56a5867098da17489c`. The Phase 6 Compose/VPS package and its PostgreSQL+filestore recovery proof remain a verified provider-neutral baseline/fallback. Phase 7 must prove the Vercel-specific state model before any recovery assumption is changed.

The currently connected Vercel team is on Hobby and Fares Uniform is a commercial workload. This decision authorizes repository/CI Vercel adaptation work only; it does **not** authorize upgrading the Vercel plan, purchasing services, creating paid staging/production resources, configuring production secrets/domains/DNS, creating a real managed database, migrating real data or cutting over production. Those live/account mutations require separate explicit authorization.