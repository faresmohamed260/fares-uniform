# Documentation index

Read these documents from GitHub at the beginning of work. Repository code/docs are authoritative; chat memory is secondary.

| Document | Owns |
| --- | --- |
| [AGENTS.md](../AGENTS.md) | Mandatory work, continuity and validation rules |
| [PROJECT.md](../PROJECT.md) | Current state, roadmap and session handoff |
| [Decision log](DECISIONS.md) | Accepted decisions, recommendations and supersession |
| [Discovery](requirements/DISCOVERY.md) | Confirmed business requirements and historical discovery |
| [First-release scope](requirements/MVP_SCOPE.md) | Accepted MVP boundary and deferred decisions |
| [Roles and permissions](requirements/ROLES_AND_PERMISSIONS.md) | Role/access design |
| [Product and finished-stock rules](requirements/PRODUCT_AND_STOCK_RULES.md) | Product/design/size/code/location/movement foundation |
| [Phase 0](phases/PHASE_0_DISCOVERY.md) | Discovery closure |
| [Foundation architecture](architecture/FOUNDATION_ARCHITECTURE.md) | System ownership/data/offline/integration contracts |
| [Design system](ui/DESIGN_SYSTEM.md) | UI/RTL/accessibility direction |
| [Phase 0A hosted proof](phases/PHASE_0A_ODOO_PROOF.md) | Odoo proof contract |
| [Odoo proof evidence](validation/ODOO_PROOF.md) | Hosted proof evidence |
| [Phase 0B foundation](phases/PHASE_0B_FOUNDATION.md) | Foundation contract |
| [Phase 0B UI evidence](validation/UI_FOUNDATION.md) | Hosted frontend evidence |
| [Phase 1 contract](phases/PHASE_1_PRODUCTS_STOCK_ACCESS.md) | Products/stock/access |
| [Phase 1 validation](validation/PHASE_1_PRODUCTS_STOCK.md) | Phase 1 evidence |
| [Phase 2A contract](phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md) | Retail checkout/offline |
| [Phase 2A validation](validation/PHASE_2A_RETAIL_CHECKOUT.md) | Phase 2A evidence |
| [Phase 2B contract](phases/PHASE_2B_PREORDER_COLLECTION.md) | Preorder/balance/collection |
| [Phase 2B architecture](architecture/PHASE_2B_PREORDER_MODEL.md) | Preorder model boundary |
| [Phase 2B policy](requirements/PHASE_2B_POLICY_DECISIONS.md) | Accepted Phase 2B policy |
| [Phase 2B validation](validation/PHASE_2B_PREORDER_COLLECTION.md) | Phase 2B evidence |
| [Phase 2C contract](phases/PHASE_2C_REFUNDS_EXCHANGES.md) | Retail refunds/exchanges |
| [Phase 2C policy](requirements/PHASE_2C_POLICY_DECISIONS.md) | Accepted Phase 2C policy |
| [Phase 2C architecture](architecture/PHASE_2C_REFUND_RETURN_MODEL.md) | Refund/return model |
| [Phase 2C validation](validation/PHASE_2C_REFUNDS_EXCHANGES.md) | Phase 2C evidence |
| [Phase 3A contract](phases/PHASE_3A_PREORDER_PRODUCTION.md) | Production workflow |
| [Phase 3A architecture](architecture/PHASE_3A_PRODUCTION_MODEL.md) | Production model |
| [Phase 3A validation](validation/PHASE_3A_PREORDER_PRODUCTION.md) | Phase 3A evidence |
| [Phase 3B contract](phases/PHASE_3B_BUSINESS_CLIENT_ORDERS.md) | Business-client workflow |
| [Phase 3B architecture](architecture/PHASE_3B_BUSINESS_ORDER_MODEL.md) | CRM/Sales/payment/stock ownership |
| [Phase 3B policy](requirements/PHASE_3B_POLICY_DECISIONS.md) | Accepted commercial policy |
| [Phase 3B validation](validation/PHASE_3B_BUSINESS_CLIENT_ORDERS.md) | Phase 3B evidence |
| [Phase 4A public catalog/enquiry contract](phases/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md) | **Completed** public catalog, enquiry and public-web scope |
| [Phase 4A public integration architecture](architecture/PHASE_4A_PUBLIC_INTEGRATION.md) | Final Odoo/Next.js boundary, DTO and enquiry schemas |
| [Phase 4A validation](validation/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md) | Final exact-head server/web evidence, chronology and authority |
| [Phase 4B operational reporting contract](phases/PHASE_4B_OPERATIONAL_REPORTING.md) | **Completed / verified** operational-reporting definitions, role/security boundaries and exit criteria |
| [Phase 4B reporting architecture](architecture/PHASE_4B_REPORTING_MODEL.md) | Live Odoo source models, reporting service and low-stock threshold boundary |
| [Phase 4B validation](validation/PHASE_4B_OPERATIONAL_REPORTING.md) | Final exact-head Odoo/web evidence, red-to-green chronology, artifacts and manual EN/AR dashboard review |

Current completed product milestone: **Phase 4B operational reporting — COMPLETE / VERIFIED**.

Authoritative Phase 4B application/test SHA: `29b2589e7e71271071f97c9de57dfb97b49b100d`. Exact-head run `34696367320` passed the combined seven-addon Odoo suite with **144 tests, 0 failures, 0 errors**, the repeatable seven-addon upgrade, public-web typecheck/build and **8/8 Playwright tests**. Odoo artifact `10299505013` has digest `sha256:428d0f0211a229bd85d35df8444295c2658fb397ce0c910af7302765d4eb543d`; web artifact `10298334239` has digest `sha256:2683575631b5efa75c8db33e3f76f91a64412563d4083f85f491012b8415b13d`.

Manual review of the final English desktop/narrow and Arabic RTL desktop/narrow reporting captures passed. The full Arabic offline-sync disclosure is localized, the title/breadcrumb is localized without `fu.reporting.dashboard,<id>` leakage, RTL is correct, report timezone/as-of context remains visible, and the browser contract confirms keyboard focus plus no document-level horizontal overflow.

Later documentation-only closure commits do not supersede application authority `29b2589e7e71271071f97c9de57dfb97b49b100d`.

Next product-level work is integrated UAT/onboarding rehearsal and explicitly authorized deployment planning. No merge or production deployment is authorized by Phase 4B closure.
