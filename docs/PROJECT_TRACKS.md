# Fares Uniform delivery tracks

This document is the authoritative **scope split and checklist index** for the two independent delivery tracks in the Fares Uniform project.

It does not replace `PROJECT.md`. `PROJECT.md` owns the current branch, verified state, active next action and session handoff. Phase and validation documents own exact implementation evidence. This document prevents public-site work and ERP/Odoo production work from being mixed into one checklist.

## Track A — Public website

### Purpose

The public website is the customer-facing Next.js surface for:

- the Fares brand and company presentation;
- client/project showcases such as KGC;
- garment/product catalog browsing;
- English and Arabic/RTL presentation;
- the approved Pattern in Motion experience;
- contextual public enquiries.

The production application is `apps/public-web`. The Phase 9 kinetic prototype remains visual/reference evidence until production parity is proven.

Odoo provides only the narrow approved public/editorial API. The public website must not expose price, stock, private ERP records, internal operational IDs or storage/admin metadata.

### Completed foundation

- [x] Phase 9 Pattern in Motion visual authority established.
- [x] KGC original assets audited and the authorized review subset stored privately in R2.
- [x] Synthetic non-school fixture retained for generalization proof.
- [x] Cloudflare R2 selected and private/public/backup buckets created.
- [x] Phase 10 V2 organization/program/cohort/look/garment/media public contract implemented.
- [x] V1 public contract retained.
- [x] No-price/no-stock/private-field serializer boundary proven.
- [x] Private-to-public R2 publication boundary proven with synthetic media.
- [x] Short-lived bucket-scoped R2 publication credentials and cross-bucket denial proven.

### Remaining public-site checklist

#### A1 — Production public-web foundation

- [x] Canonical `/en` and `/ar` routing.
- [x] Server-rendered document `lang` and `dir`.
- [x] Deterministic production typography.
- [x] Canonical URLs, hreflang and metadata baseline.
- [x] Branded 404/error/loading/degraded-content behavior.
- [x] Source-controlled V2 client/runtime validation.
- [x] Base Fares-led shell/navigation/footer.
- [x] Keyboard/focus and no-horizontal-overflow baseline.
- [x] Hosted production build and EN/AR browser evidence.
- [x] Rendered/RSC/network proof that price, stock and private fields remain absent.

#### A2 — Pattern in Motion production migration

- [x] Fares introduction/home experience.
- [x] Work/client/project discovery.
- [x] Organization/program routes.
- [x] Cohort/role progression.
- [x] Complete-look continuity.
- [x] Garment detail and inspection.
- [ ] Contextual transitions and motion.
- [x] Mobile and Arabic RTL interaction.
- [x] Remove prototype-only KGC branching and fixed-count assumptions.
- [x] Drive capabilities from content, not organization identity.
- [ ] Compare every cohesive slice against the Phase 9 visual authority.

#### A3 — KGC and future client publication

- [ ] Bind KGC organization/program/cohort/look/garment records to the V2 content model.
- [ ] Produce/approve final public derivatives from authorized originals.
- [ ] Validate English copy, Arabic copy and accessibility text.
- [ ] Confirm per-media rights/publication flags.
- [ ] Obtain explicit KGC public-publication authorization before publication.
- [ ] Publish only approved derivatives to public R2.
- [ ] Verify KGC through generic production routes/components.
- [ ] Reuse the same data-driven flow for future clients without code branching.

KGC review assets already exist, but **review use is not public-publication authorization**.

#### A4 — Product catalog and enquiry

- [ ] Final production catalog presentation.
- [ ] Garment/product detail routes.
- [ ] EN/AR catalog content and missing-media fallbacks.
- [ ] Preserve strict no-price/no-stock behavior.
- [ ] Catalog/project/garment-to-enquiry context.
- [ ] EN and AR enquiry journeys.
- [ ] Request-size, timeout, anti-bot/rate and stable-error boundaries.
- [ ] Preserve Odoo idempotency and append-only enquiry behavior.

#### A5 — Public media, resilience, SEO and quality

- [ ] Select/configure the stable browser-facing public media origin/custom domain.
- [ ] Keep private originals inaccessible.
- [ ] Verify public cache headers and responsive image delivery.
- [ ] Cache/revalidate published public content.
- [ ] Retain stale published content during transient Odoo failure.
- [ ] Sitemap, robots, canonical, hreflang and route metadata.
- [ ] Keyboard, focus, touch-target and automated accessibility proof.
- [ ] Reduced-motion parity.
- [ ] Desktop/mobile/Arabic RTL rendered evidence.
- [ ] Performance/resource budget evidence.
- [ ] Full Playwright production journeys.
- [ ] Retire obsolete executable prototype code only after parity is proven.

### Public-site completion boundary

The public website is implementation-complete only when `apps/public-web` contains the accepted Fares-led Pattern in Motion experience, generic client/project content works through V2, catalog/enquiry are production-integrated, EN/AR/accessibility/performance gates pass, public media uses the approved R2 path, no price/stock/private ERP data leaks, and exact hosted evidence is recorded.

Implementation-complete still does not equal production launch.

---

## Track B — ERP / Odoo

### Purpose

The ERP/Odoo track is the internal operational system for:

- retail POS and offline operation;
- inventory and stock custody;
- preorders, deposits, balances and collection;
- returns/exchanges;
- production queues;
- B2B/client orders;
- role-based access;
- reporting;
- sessions, attachments, cron, WebSocket continuity;
- backup/recovery and production operations.

Odoo Community remains the operational/domain core. Fares addons extend Odoo rather than duplicating native product, POS, CRM, sales, payment and stock truth unless an explicit architecture decision says otherwise.

### Completed engineering/staging foundation

- [x] Phases 0–7 implementation completed within repository/CI scope.
- [x] Products, stock and access control.
- [x] Retail POS and offline-capable checkout architecture.
- [x] Preorder/deposit/balance/collection workflows.
- [x] Returns/exchanges.
- [x] Production queues.
- [x] B2B/client order workflow.
- [x] Operational reporting.
- [x] English/Arabic launch-quality regression coverage.
- [x] Stateless Vercel/Odoo adaptation.
- [x] PostgreSQL-backed sessions and attachments.
- [x] External cron and native locking proof.
- [x] WebSocket replacement/replay proof.
- [x] Managed backup/export and isolated destructive restore proof.
- [x] Live production-model synthetic business UAT.
- [x] Phase 8 Gate C staging technical acceptance PASS.
- [x] Phase 0–8 release integration merged to `main`.
- [x] Default-branch staging observability schedule active.

### Remaining ERP/Odoo checklist

#### B1 — Gate D and production ownership

- [ ] Close remaining Gate D decisions.
- [ ] Define/approve production operating and spending plan.
- [ ] Assign named technical-operations owner.
- [ ] Assign named business-operations owner.
- [ ] Assign DNS/certificate owner.
- [ ] Assign private-access/secrets owner.
- [ ] Define escalation responsibilities.
- [ ] Approve production release-control boundary.

#### B2 — Production infrastructure and operations

- [ ] Final Cloudflare proxy policy.
- [ ] Final production DNS/private-access policy.
- [ ] Production environment/secret ownership review.
- [ ] Production database operational policy.
- [ ] Backup retention, RPO/RTO and restore responsibility.
- [ ] Production monitoring and alert recipients.
- [ ] Deployment/recovery escalation procedure.
- [ ] Review the known ordinary Odoo cron set and decide which jobs/schedules are appropriate for production without mutating staging merely to clear backlog.

#### B3 — Real business configuration/data onboarding

Real operational data remains unauthorized until explicitly approved.

- [ ] Decide initial product/inventory migration method.
- [ ] Load/verify actual products, variants and sizes.
- [ ] Establish real Store and Storage stock.
- [ ] Decide whether any historical customer/order data is migrated.
- [ ] Create actual staff users and assign real roles.
- [ ] Configure production POS instances.
- [ ] Configure real payment methods, including cash and current InstaPay process.
- [ ] Validate real operational reports.

#### B4 — Store hardware and workflow rehearsal

- [ ] Receipt format and EN/AR behavior.
- [ ] Generic scanner test.
- [ ] Generic printer test.
- [ ] Actual-device offline/reconnect/sync test.
- [ ] Cashier rehearsal.
- [ ] Manager rehearsal.
- [ ] Retail sale.
- [ ] Refund/exchange.
- [ ] Preorder/deposit/balance/collection.
- [ ] Production-order flow.
- [ ] Store/Storage transfer.
- [ ] B2B quotation/sample/deposit/production/delivery/final-payment flow.
- [ ] Owner reporting rehearsal.

No hardware brand becomes a source-code dependency.

#### B5 — Production recovery, security and observability

- [ ] Establish production backup schedule and retention.
- [ ] Production restore/runbook rehearsal.
- [ ] Confirm recovery-time expectations.
- [ ] Final user-role matrix and unused-account review.
- [ ] Production secret audit.
- [ ] Public-route/backoffice exposure audit.
- [ ] Database privilege audit.
- [ ] Production error/database/cron/backup/deployment alerting.

#### B6 — Final ERP production gate

- [ ] Final Gate D review.
- [ ] Exact integrated production candidate.
- [ ] Fresh hosted CI on that exact candidate.
- [ ] Final staging rehearsal.
- [ ] Approved rollback plan.
- [ ] Explicit production authorization from Fares.
- [ ] Production deployment.
- [ ] Real staff onboarding.
- [ ] Authorized initial data/stock load.
- [ ] First controlled live transaction.
- [ ] Post-launch verification.

### ERP completion boundary

Core ERP engineering and Gate C staging acceptance are substantially complete. Remaining ERP work is primarily Gate D closure, production operations/ownership, real-business configuration and controlled launch readiness. Production remains NO-GO until Gate D and explicit client authorization are satisfied.

---

## Continuation rule

At the start of every session:

1. read `AGENTS.md`, `PROJECT.md`, this document, `docs/README.md`, `docs/DECISIONS.md`, and the relevant active phase/operations/validation documents;
2. verify remote branch/HEAD and newer hosted evidence;
3. identify which track the current request belongs to;
4. continue only that track unless Fares explicitly asks to work across both.

For an unqualified “continue” request, `PROJECT.md` decides the active next action. Do not infer that public-site Phase 10 work advances ERP Gate D, or that ERP production-readiness work authorizes public-site publication/launch.
