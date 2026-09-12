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
| [Foundation architecture](architecture/FOUNDATION_ARCHITECTURE.md) | System ownership/data/offline/integration contracts |
| [Design system](ui/DESIGN_SYSTEM.md) | UI/RTL/accessibility direction |
| [Phase 0](phases/PHASE_0_DISCOVERY.md) | Discovery closure |
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
| [Phase 4A public catalog/enquiry contract](phases/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md) | Completed public catalog/enquiry scope |
| [Phase 4A public integration architecture](architecture/PHASE_4A_PUBLIC_INTEGRATION.md) | Odoo/Next.js DTO/enquiry boundary |
| [Phase 4A validation](validation/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md) | Final server/web authority and evidence |
| [Phase 4B operational reporting contract](phases/PHASE_4B_OPERATIONAL_REPORTING.md) | Completed operational-reporting definitions and security boundaries |
| [Phase 4B reporting architecture](architecture/PHASE_4B_REPORTING_MODEL.md) | Reporting source/service/config boundary |
| [Phase 4B validation](validation/PHASE_4B_OPERATIONAL_REPORTING.md) | Final reporting authority and manual evidence |
| [Phase 5 integrated UAT/onboarding contract](phases/PHASE_5_INTEGRATED_UAT_ONBOARDING.md) | **Completed / verified** joined release acceptance and exit criteria |
| [Phase 5 validation](validation/PHASE_5_INTEGRATED_UAT.md) | Exact-head UAT evidence, scenario matrix, artifacts, manual review and defect register |
| [Onboarding rehearsal](operations/ONBOARDING_REHEARSAL.md) | Synthetic setup result plus operator/client inputs still required |
| [Deployment readiness](operations/DEPLOYMENT_READINESS.md) | Provider-neutral launch go/no-go checklist and rollback baseline |

Current completed product milestone: **Phase 5 integrated UAT/onboarding — COMPLETE / VERIFIED**.

Authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`. Exact-head run `34698087230` passed **148 Odoo/UAT tests with 0 failures / 0 errors**, the repeatable seven-production-addon upgrade, public typecheck/build and **8/8 Playwright tests**.

Odoo/UAT artifact `10298859526` has digest `sha256:510f57a2f1b8c6cfc9b6627c086240b1e03a069112c8780c0cc51bb78f28c0c5`; web artifact `10298634549` has digest `sha256:cabf625930954e29dfd413cbfc24c5c5c4cf95713c15cd754bc3e64b0f44dc5f`.

Manual representative EN/AR/RTL/narrow evidence review passed release usability, public isolation and reporting disclosure. One documented P2 launch-quality finding remains: selected internal Arabic field/help labels still render in English. There are no open P0/P1 UAT defects.

Later documentation-only closure commits do not supersede authority `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.

Production deployment remains **NO-GO** pending explicit production-specific choices/proofs in `operations/DEPLOYMENT_READINESS.md`; Phase 5 does not authorize merge, deployment, live resource mutation or real-data migration.
