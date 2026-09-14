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
| [Phase 2C validation](validation/PHASE_2C_REFUNDS_EXCHANGES.md) | Refund/exchange evidence |
| [Phase 3A contract](phases/PHASE_3A_PREORDER_PRODUCTION.md) | Production workflow |
| [Phase 3A architecture](architecture/PHASE_3A_PRODUCTION_MODEL.md) | Production model |
| [Phase 3A validation](validation/PHASE_3A_PREORDER_PRODUCTION.md) | Production evidence |
| [Phase 3B contract](phases/PHASE_3B_BUSINESS_CLIENT_ORDERS.md) | Business-client workflow |
| [Phase 3B architecture](architecture/PHASE_3B_BUSINESS_ORDER_MODEL.md) | CRM/Sales/payment/stock ownership |
| [Phase 3B policy](requirements/PHASE_3B_POLICY_DECISIONS.md) | Accepted commercial policy |
| [Phase 3B validation](validation/PHASE_3B_BUSINESS_CLIENT_ORDERS.md) | Business-client evidence |
| [Phase 4A public catalog/enquiry](phases/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md) | Completed public catalog/enquiry scope |
| [Phase 4A public integration](architecture/PHASE_4A_PUBLIC_INTEGRATION.md) | Odoo/Next.js DTO/enquiry boundary |
| [Phase 4A validation](validation/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md) | Public server/web authority and evidence |
| [Phase 4B operational reporting](phases/PHASE_4B_OPERATIONAL_REPORTING.md) | Completed reporting definitions/security |
| [Phase 4B reporting architecture](architecture/PHASE_4B_REPORTING_MODEL.md) | Reporting source/service/config boundary |
| [Phase 4B validation](validation/PHASE_4B_OPERATIONAL_REPORTING.md) | Reporting authority/manual evidence |
| [Phase 5 integrated UAT/onboarding](phases/PHASE_5_INTEGRATED_UAT_ONBOARDING.md) | Joined release acceptance/exit criteria |
| [Phase 5 validation](validation/PHASE_5_INTEGRATED_UAT.md) | Exact-head UAT/manual evidence and defect register |
| [Phase 5A Arabic launch polish](phases/PHASE_5A_ARABIC_LAUNCH_POLISH.md) | Arabic launch-quality closure |
| [Phase 5A validation](validation/PHASE_5A_ARABIC_LAUNCH_POLISH.md) | 149-test/public/manual evidence and localization closure |
| [Phase 6 deployment-readiness](phases/PHASE_6_DEPLOYMENT_READINESS.md) | Provider-neutral packaging/persistence/restore proof |
| [Phase 6 deployment architecture](architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md) | Provider-neutral baseline and Vercel supersession/history |
| [Phase 6 validation](validation/PHASE_6_DEPLOYMENT_READINESS.md) | Exact RED-to-green deployment-package evidence |
| [Phase 7 Vercel adaptation](phases/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md) | Completed stateless Vercel/Odoo repository/CI contract |
| [Phase 7 validation](validation/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md) | State/session/cron/WebSocket/project-map RED-to-green evidence |
| [Phase 8 commercial staging readiness](phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md) | Staging ownership, live-proof and GO/NO-GO parent contract |
| [Phase 8A free-tier staging execution](phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md) | Live Supabase/Vercel execution status, RED-to-green provider evidence and remaining Gate C work |
| [Phase 8 staging secret inventory](operations/PHASE_8_STAGING_SECRET_INVENTORY.md) | Staging secret names/purpose/custody/rotation without secret values |
| [Onboarding rehearsal](operations/ONBOARDING_REHEARSAL.md) | Synthetic setup result and operator/client inputs still required |
| [Deployment readiness](operations/DEPLOYMENT_READINESS.md) | Go/no-go checklist and remaining live-stage decisions |

## Current authority — 2026-09-14

Completed milestones: **Phase 5A application/UAT/localization — COMPLETE / VERIFIED; Phase 6 provider-neutral deployment/readiness — COMPLETE / VERIFIED; Phase 7 Vercel stateless adaptation — COMPLETE / VERIFIED at repository/CI level; Phase 8 repository planning — COMPLETE.**

Active bounded stage: **Phase 8A free-tier staging execution — IN PROGRESS. Isolated Supabase and Vercel control planes are established. The current live-deployment workflow is RED at managed schema restore, before Vercel environment injection/deployment. Production remains NO-GO.**

Current branch: `phase-8/commercial-staging-readiness`.

Current live-deployment candidate: `a75131b7c8ad3060ba2ab4e805916dc1d0ad4ff2`.

Current live-deployment run: `34821582384`.

- deploy job `103904147677`: **FAILURE** at `Restore initialized schema into clean Supabase target`;
- fail-closed guard job `103905391955`: **SUCCESS**, including runtime-role disable after the failed attempt.

Before the failure, the run passed the clean-boundary assertion, generated/masked fresh activation secrets, built the exact database and Vercel Odoo images, built the exact initialized local application database with all seven production addons and `fu_uat` absent, created the filtered restore set and activated the bounded least-privileged managed runtime role.

The managed restore failure caused all later Vercel environment/deployment/READY steps to be skipped. A direct Vercel project check after the run still showed **0 deployments**. Because `pg_restore` can leave partial schema objects before an error, the managed Supabase schema must be inspected before the next retry rather than assumed clean.

Earlier green live-provider authorities remain:

- managed-database/runtime checkpoint `b7a661bf70c2468b006bf971cba10172cf810e7d` — run `34787677724`, job `103806024323` — **SUCCESS**;
- Vercel control-plane checkpoint `884aedc9465122d25639ca24954f154dfa72dc70` — run `34788971298`, job `103809533700` — **SUCCESS**.

Inherited authorities remain:

- Phase 7 final implementation: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`;
- Phase 7 runtime checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- Phase 6 deployment package: `e337315684c62d69ad75ba56a5867098da17489c`;
- Phase 5A application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, with **149 tests / 0 failures / 0 errors**, repeatable seven-addon upgrade, public typecheck/build and **8/8 Playwright**.

## Phase 8A live provider state

Dedicated Supabase target:

- project ref `urqlxisivowkmsfisjek`;
- region `eu-central-1`;
- Session Pooler `aws-0-eu-central-1.pooler.supabase.com:5432`;
- provider-managed `postgres` application database;
- routine role `fares_app`;
- connection username `fares_app.urqlxisivowkmsfisjek`;
- `sslmode=require` minimum;
- transaction pooling prohibited for Odoo.

Dedicated Vercel target:

- project `fares-uniform`;
- project id `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- team id `team_r09C6RLmb2acHapENECQIn9T`;
- current deployment count after the failed restore attempt: `0`.

The provider control-plane credentials remain server-side GitHub Actions secrets and must never be committed or printed. Existing unrelated provider projects remain out of scope.

## Current gate

- Gate A repository planning: **PASS**.
- Gate B authorization/provider ownership: **PASS**.
- Gate C live staging technical proof: **IN PROGRESS / RED AT MANAGED SCHEMA RESTORE**.
- Gate D production: **NO-GO**.

Immediate continuation is to inspect the exact managed `pg_restore` failure and current schema/ownership state, clean any partial restore residue without weakening least privilege, fix the source-controlled restore path, rerun hosted CI, and only after restore/repeat-upgrade is green proceed to Vercel environment injection/deployment and the remaining attachment/session/cron/WebSocket/backup/monitoring/EN-AR smoke proof.

Do not rerun the same failing restore blindly. Do not use a local project checkout. Do not force-push. Preserve RED evidence. Production remains **NO-GO** until Gate C plus store hardware, named staff/training, real-data cutover/reconciliation and separate production authorization are complete.
