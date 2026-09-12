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
| [Phase 5 integrated UAT/onboarding contract](phases/PHASE_5_INTEGRATED_UAT_ONBOARDING.md) | Completed/verified joined release acceptance and exit criteria |
| [Phase 5 validation](validation/PHASE_5_INTEGRATED_UAT.md) | Exact-head UAT evidence, scenario matrix, artifacts, manual review and Phase 5 defect register |
| [Phase 5A Arabic launch-quality polish](phases/PHASE_5A_ARABIC_LAUNCH_POLISH.md) | Completed/verified closure of the remaining Arabic launch-quality finding |
| [Phase 5A validation](validation/PHASE_5A_ARABIC_LAUNCH_POLISH.md) | Exact-head 149-test/public/manual evidence and P2-001 closure |
| [Phase 6 deployment-readiness contract](phases/PHASE_6_DEPLOYMENT_READINESS.md) | Active bounded deployment packaging, persistence and restore-proof scope |
| [Phase 6 deployment architecture](architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md) | Provider comparison, recommended topology, persistence/security/backup model and unresolved operator choices |
| [Phase 6 validation](validation/PHASE_6_DEPLOYMENT_READINESS.md) | Exact RED/green hosted deployment-package evidence, artifact authority and continuation boundary |
| [Onboarding rehearsal](operations/ONBOARDING_REHEARSAL.md) | Synthetic setup result plus operator/client inputs still required |
| [Deployment readiness](operations/DEPLOYMENT_READINESS.md) | Provider-neutral launch go/no-go checklist and rollback baseline |

Current completed product milestone: **Phase 5A Arabic launch-quality polish — COMPLETE / VERIFIED**.

Current active milestone: **Phase 6 deployment architecture and readiness proof — ACTIVE / AUTHORIZED; first implementation candidate RED / NOT VERIFIED** on branch `phase-6/deployment-readiness`.

Authoritative application/test SHA remains Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`. Exact-head run `34700625051` passed **149 Odoo/UAT tests with 0 failures / 0 errors**, the repeatable seven-production-addon upgrade, public typecheck/build and **8/8 Playwright tests**.

Odoo/UAT artifact `10300402418` has digest `sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`; web artifact `10300486494` has digest `sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`.

Phase 6 implementation candidate `1892455616d7cd59e4706006b794d35df7f8f170` added the provider-neutral deployment/restore package. Workflow run `34707428136`, job `103589908228`, is RED: source authority, Compose rendering and image builds passed, but PostgreSQL initialization stopped in `deploy/postgres/init/10-fares.sh` because `/run/secrets/odoo_db_password` was not readable. Later security/persistence/backup/restore checks were skipped. Artifact `10302037411` has digest `sha256:22092c659bd7d7ef83ff6d7cff7a83badb57fc7dc71071d9e431881f8e3dfe92`.

The current correction target is the Compose/PostgreSQL secret-access boundary. Preserve exact Odoo SHA `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` and the Phase 5A application source while making the init hook able to consume the DB password without exposing it in source, rendered Compose output or logs.

Phase 6 is allowed to add provider-neutral deployment/configuration/backup/restore tooling and prove it in hosted CI with synthetic data. The current architecture document recommends an initial single EU VPS for Odoo + PostgreSQL + persistent filestore with off-host S3-compatible backups, while retaining Vercel for the public Next.js surface. Dated provider research currently favors Hetzner Cloud on cost/value, but **no provider/resource is selected or authorized**.

Production deployment remains **NO-GO**. Paid staging/production resources, domains/DNS/TLS, secrets, real device acceptance, real staff/data cutover, monitoring ownership, production backup retention/RPO/RTO, budget and launch timing still require explicit client/operator decisions and separate live-deployment authorization.
