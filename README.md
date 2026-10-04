<h1 align="center">Fares Uniform</h1>

<p align="center">
  A bilingual, operations-first platform for uniform retail, preorders, production, business clients, and a public catalog—built on Odoo Community with a separate Next.js customer experience.
</p>

<p align="center">
  <a href="https://fares-uniform.vercel.app"><strong>View staging</strong></a>
  · <a href="PROJECT.md">Current handoff</a>
  · <a href="docs/README.md">Documentation</a>
  · <a href="docs/requirements/DISCOVERY.md">Business requirements</a>
</p>

<p align="center">
  <img alt="Odoo Community" src="https://img.shields.io/badge/Odoo-Community-714B67?logo=odoo&logoColor=white" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white" />
  <img alt="Arabic and English" src="https://img.shields.io/badge/i18n-Arabic%20%2B%20English-0F4C3A" />
  <img alt="Status" src="https://img.shields.io/badge/Status-Staging%20verified-F2B134" />
</p>

> **Release status:** Phases 0–8 are integrated on main; live staging Gate C is accepted and monitored. **Production remains NO-GO** until the separately governed Gate D decisions and final production authorization are complete. The public staging environment contains synthetic data only.

## Why this project exists

Fares Uniform serves schools, restaurants, cafés, hotels, hospitals, industrial teams, and retail customers. The operation needs one coherent system for finished garments, sizes, deposits, partial collection, factory demand, business orders, staff roles, and bilingual customer communication—without replacing proven ERP accounting and inventory logic with a fragile custom ledger.

The solution is deliberately hybrid:

- **Odoo Community + Fares addons** own operational truth.
- **Next.js public web** owns the customer-facing catalog and enquiry experience.
- **PostgreSQL/Supabase** provides the managed staging database and durable session/attachment boundary.
- **Vercel** hosts the isolated staging topology and public surface.
- **GitHub Actions** provides exact-head tests, deployment gates, recovery proof, and scheduled observability.

## Business capabilities

| Area | Verified repository scope |
| --- | --- |
| Products and stock | Finished garments, variants/sizes, sequential product identity, Store/Storage custody, and role-aware movement. |
| Retail checkout | Ordinary POS flow with offline operation and authorization revalidation. |
| School preorders | Deposits, balances, size-specific demand, full-balance-before-collection, and partial collection. |
| Returns and exchanges | Consumer retail correction paths with explicit policy boundaries. |
| Production demand | Queueing and handoff for preorder-driven manufacturing needs. |
| Business clients | Sample, quotation, deposit, production/delivery, shipment, balance, and operational reporting flows. |
| Public catalog | Bilingual catalog/program pages and a privacy-safe enquiry path. |
| Reporting | Operational reports required for the first release; advanced analytics remain later work. |
| Access and localization | Delegated roles, location boundaries, English/Arabic, RTL, and hardware-independent operation. |

Procurement planning, Purchase/MRP, and stock valuation layers are outside the accepted first-release scope.

## System shape

~~~mermaid
flowchart TB
    WEB["Next.js public web: catalog, programs, enquiries"]
    EDGE["Vercel routing boundary"]
    HTTP["Stateless Odoo HTTP"]
    WS["Stateless Odoo WebSocket"]
    DB["Managed PostgreSQL: ERP, sessions, attachments"]
    CRON["Authenticated external cron"]
    ADDONS["Fares addons"]

    WEB --> EDGE
    EDGE --> HTTP
    EDGE --> WS
    EDGE --> CRON
    HTTP --> ADDONS
    WS --> DB
    CRON --> DB
    ADDONS --> DB
~~~

Broad Odoo backoffice routing is intentionally prohibited. Browser traffic never calls private /fu/public/** APIs directly; the Next.js surface reaches Odoo server-to-server. WebSocket continuity uses reconnect and cursor replay rather than instance affinity.

## Fares addon suite

| Addon | Responsibility |
| --- | --- |
| fu_core | Shared product identity, roles, locations, and foundational policy |
| fu_retail | Retail/POS behavior and stock custody |
| fu_preorder | School preorder, payments, balances, and collection |
| fu_production | Production-demand handoff and readiness |
| fu_business | Business-client samples, quotations, deposits, and delivery |
| fu_public_api | Bounded private API used by the public web |
| fu_reporting | First-release operational reporting |
| fu_uat | Synthetic test-only fixtures; never loaded in staging or production |

## Public experience

The staging site currently exposes a bilingual, organization-agnostic uniform-program experience with catalog discovery and enquiry. Its selected future design system, **Pattern in Motion**, separates a stable Fares shell from data-driven client/project skins.

KGC National is a validation fixture—not the permanent identity of the homepage. Client imagery, logos, and private business records must not enter this public repository without explicit publication rights.

## Verification and release methodology

The project is developed entirely through remote GitHub operations and hosted services.

1. Discover the real workflow before selecting modules or schemas.
2. Record accepted requirements, exceptions, decisions, and open questions.
3. Merge an execution-ready phase contract before implementation.
4. Validate exact commits through hosted Odoo, browser, security, persistence, and recovery checks.
5. Use synthetic data and prove cleanup/non-interference.
6. Keep implemented, verified, staging-deployed, and production-approved as separate states.
7. Require explicit production authorization; staging success is not a production cutover.

Current staging evidence includes:

- 149 Odoo tests and a repeatable seven-addon upgrade.
- 8/8 public browser checks.
- Live public enquiry, authenticated session/attachment continuity, and WebSocket cursor replay.
- Authenticated external cron locking with no duplicate execution.
- Managed backup/export and destructive restore into an isolated disposable target.
- Production-model synthetic UAT across stock, real POS sync, preorders, business orders, payments, delivery, and reporting.
- Scheduled observability over deployment identity, errors, HTTP 5xx, database seals, cron health, and recovery authority.

Exact runs, SHAs, cleanup evidence, and limitations live in [PROJECT.md](PROJECT.md) and the validation documents.

## Technology

- **ERP:** Odoo Community 19 with seven production Fares addons
- **Public web:** Next.js 16, React 19, TypeScript, Tailwind CSS, Base UI/shadcn patterns, Motion
- **Database:** PostgreSQL 17 on isolated Supabase staging with TLS and a least-privileged runtime role
- **Hosting:** Vercel, separate stateless HTTP/WebSocket services, external authenticated cron
- **Quality:** Odoo tests, Playwright, type checking, Arabic/RTL checks, deployment/recovery/security proofs
- **Operations:** GitHub-hosted CI, scheduled staging observability, documented rollback and recovery

## Repository map

| Path | Owns |
| --- | --- |
| addons | Fares Odoo modules and server-enforced business policy |
| apps/public-web | Bilingual customer-facing Next.js application |
| deploy | Container and deployment topology |
| docs/requirements | Confirmed workflows, rules, exceptions, and unknowns |
| docs/phases | Phase contracts and exit evidence |
| docs/validation | Exact test, staging, integration, and repair evidence |
| docs/operations | Deployment, secrets, observability, recovery, and production planning |
| docs/ui | Public/ERP interface direction and design decisions |
| proof | Early technical proof material retained for evidence |

## Development

All project work must follow the repository’s [remote-only rule](AGENTS.md). Do not clone, edit, build, or test project files in a local or scratch workspace. Use focused GitHub branches and pull requests; use hosted CI/services for execution and verification.

For public-web commands and environment requirements, follow the current phase and operations documentation rather than inventing local values. Credentials and real customer, staff, stock, order, bank, or payment data never belong in source, issues, screenshots, logs, or fixtures.

## Documentation

Start with:

1. [Development and agent instructions](AGENTS.md)
2. [Current project handoff](PROJECT.md)
3. [Documentation index](docs/README.md)
4. [Durable decision log](docs/DECISIONS.md)
5. [Discovery and business requirements](docs/requirements/DISCOVERY.md)
6. [Phase 8 commercial staging contract](docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md)
7. [Phase 8A live staging execution](docs/phases/PHASE_8A_FREE_TIER_STAGING_EXECUTION.md)
8. [Deployment readiness](docs/operations/DEPLOYMENT_READINESS.md)
9. [Production-domain plan](docs/operations/PRODUCTION_DOMAIN_PLAN.md)

## Roadmap

The integrated first-release scope is technically accepted in staging. Remaining work is governance and production readiness: provider plan/spending, final Cloudflare policy, owner roles, physical/private operational evidence, real-data migration decisions, and an explicit final production GO.

The selected public-site direction still requires a reviewable organization-agnostic kinetic prototype before production implementation or deployment.

---

<p align="center">
  <strong>Uniform programs built around how teams actually work.</strong>
</p>
