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
| [Phase 8 commercial staging readiness](phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md) | Commercial-staging ownership, live-proof and GO/NO-GO parent contract |
| [Phase 8A free-tier staging execution](phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md) | Client authorization, inspected provider state and free-tier execution blockers |
| [Onboarding rehearsal](operations/ONBOARDING_REHEARSAL.md) | Synthetic setup result and operator/client inputs still required |
| [Deployment readiness](operations/DEPLOYMENT_READINESS.md) | Go/no-go checklist and remaining live-stage decisions |

## Current authority

Completed milestones: **Phase 5A application/UAT/localization — COMPLETE / VERIFIED; Phase 6 provider-neutral deployment/readiness — COMPLETE / VERIFIED; Phase 7 Vercel stateless adaptation — COMPLETE / VERIFIED at repository/CI level; Phase 8 repository planning — COMPLETE.**

Active bounded stage: **Phase 8A free-tier staging execution — CLIENT AUTHORIZED / PROVIDER BLOCKED.**

Current branch: `phase-8/commercial-staging-readiness`.

Phase 7 final implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Phase 7 final runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Authoritative business-application/test SHA remains Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`. Its hosted gate passed **149 Odoo/UAT tests with 0 failures / 0 errors**, repeatable seven-production-addon upgrade, public typecheck/build and **8/8 Playwright**.

Authoritative Phase 6 provider-neutral deployment-package SHA remains `e337315684c62d69ad75ba56a5867098da17489c`, with exact security/persistence/backup/destructive-restore proof retained in Phase 6 validation.

## Phase 7 result

The accepted Vercel topology is source-controlled and hosted-tested:

- Next.js `public_web` service;
- stateless `odoo_http` container service;
- stateless `odoo_websocket` evented container service;
- private public-web → Odoo HTTP service binding through `ODOO_BASE_URL`;
- only `/websocket` publicly routed to the evented service;
- only authenticated `/fares/internal/cron/run` publicly routed to Odoo HTTP;
- no broad Odoo backoffice or direct public API rewrite;
- database-backed Odoo attachments;
- PostgreSQL-backed authenticated sessions;
- built-in Odoo cron disabled and external authenticated trigger proven exactly once under concurrent invocation;
- WebSocket notification delivery/replacement/reconnect/replay proven;
- database-only state backup and clean restore proven;
- final Vercel schema/topology gate and public-web regression green.

At runtime checkpoint `24850acc...`, state/session/recovery run `34769858562`, cron run `34769858603`, WebSocket run `34769858556` and project-config run `34769858553` all succeeded. Final implementation `01ce26d...` then passed final project mapping and public-web regression in run `34770228476`. The only change between those SHAs is the project-config CI workflow.

## Phase 8 / Phase 8A result so far

The Phase 8 parent contract defines the commercial staging ownership, provider proof, security and production separation gates.

The client then explicitly authorized creating new isolated Fares Uniform Vercel/Supabase staging resources using the existing RenderLab/SAGA account conventions, with a hard **free-tier-only** constraint.

Live provider inspection found:

- Vercel team `faresmohamed260-6733's projects` is on Hobby; existing projects are `studio`, `saga` and `renderlab`; no Fares Uniform project exists.
- Current Vercel terms restrict Hobby to personal/non-commercial use, so the commercial Fares Uniform staging workload was not deployed on Hobby.
- Supabase organization `Fares Home Lab` is Free; active projects are `AI Studio` in `eu-west-1` and `S.A.G.A.` in `eu-central-1`.
- A new Supabase project was quoted at **$0/month** and `eu-central-1` was selected to match S.A.G.A.
- Creation of `Fares Uniform` was rejected because the user has reached Supabase's two-active-free-project limit.
- No existing Vercel/Supabase project was mutated, paused, deleted or repurposed.

No Fares Uniform live staging resource, secret, domain or real data exists yet.

## Current gate

The codebase remains technically ready for a compliant live staging proof, but **Phase 8A is provider-blocked rather than deployed**.

To stay free:

- Supabase requires the client to explicitly choose one existing free project to pause before a new isolated Fares Uniform project can be created.
- Vercel Hobby is not a valid commercial-use target under current provider terms. A Vercel Pro upgrade would require separate spending authorization; otherwise the platform decision must change.

Production remains **NO-GO** until compliant live staging proof plus store hardware, named staff/training, real-data cutover/reconciliation, monitoring, backup/RPO/RTO, domains/access and separate production authorization are complete.
