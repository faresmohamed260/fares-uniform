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
- the premium kinetic public-site experience, designed and approved through the repo-first browser-native workflow;
- contextual public enquiries.

The production application is `apps/public-web`. Under D-059, the Phase 9 kinetic prototype and PNG boards are historical creative/reference evidence only; they are not implementation specifications. Current visual authority must be an explicitly Fares-approved browser-native Git commit produced under `docs/ui/REPO_FIRST_UI_UX_WORKFLOW.md`.

Odoo provides only the narrow approved public/editorial API. The public website must not expose price, stock, private ERP records, internal operational IDs or storage/admin metadata.

### Completed foundation

- [x] Phase 9 Pattern in Motion concept boards/prototype preserved as historical design evidence (superseded as implementation authority by D-059).
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

#### A2 — Repo-first browser-native UI/UX authority and production integration

Historical Phase 10 engineering migration remains GREEN, but its screenshot-parity acceptance model was superseded by D-059 before client visual approval. The first D-059 browser candidate (`fd973244...`) was then explicitly rejected by Fares on 2026-09-22. D-060 requires a clean Scrollcraft/Astra-workflow rebuild; there is currently no approved UI design SHA.

- [x] Fares introduction/home technical surface.
- [x] Work/client/project discovery and generic organization/program routes.
- [x] Cohort/role, complete-look, garment detail and inspection behavior.
- [x] Contextual transitions, mobile and Arabic RTL behavior.
- [x] Remove prototype-only KGC branching and fixed-count assumptions.
- [x] Drive capabilities from content, not organization identity.
- [x] Preserve the old Phase 9 board/prototype comparison as historical evidence only.
- [x] Define/update UX, information-architecture and page contracts in the repo.
- [x] Define the D-060 Scrollcraft brief, Pain/Person/Promise, concrete reference board, Pattern Assembly grammar, feeling curve, peak, signature move and scroll score.
- [x] Pin the upstream Scrollcraft and Astra 10K workflow sources by exact commit.
- [ ] Rebuild the browser review surface using the pinned Scrollcraft engine rather than the rejected generic Motion layout.
- [ ] Compose responsive EN/AR/RTL review pages with separate mobile art direction.
- [ ] Implement the Seam Handoff peak and required device variety with reduced-motion parity.
- [ ] Obtain Fares's explicit approval of an exact Git commit as the current UI authority.
- [ ] Reconcile/promote production UI from that coded authority without screenshot-to-code reverse engineering.
- [ ] Prove implementation fidelity and regressions with hosted browser tests/screenshots on the exact implementation SHA.

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
- [x] Catalog/project/garment-to-enquiry context.
- [x] EN and AR enquiry journeys.
- [x] Request-size, timeout, anti-bot/rate and stable-error boundaries.
- [x] Preserve Odoo idempotency and append-only enquiry behavior.

#### A5 — Public media, resilience, SEO and quality

- [x] Select/configure the stable browser-facing public media origin/custom domain.
- [x] Keep private originals inaccessible.
- [ ] Verify public cache headers and responsive image delivery.
- [x] Cache/revalidate published public content.
- [x] Retain stale published content during transient Odoo failure.
- [x] Sitemap, robots, canonical, hreflang and route metadata.
- [x] Keyboard, focus, touch-target and automated accessibility proof.
- [x] Reduced-motion parity.
- [x] Desktop/mobile/Arabic RTL rendered evidence.
- [x] Performance/resource budget evidence.
- [x] Full Playwright production journeys.
- [ ] Retire obsolete executable prototype code only after parity is proven.

### Public-site completion boundary

The public website is implementation-complete only when `apps/public-web` contains the Fares-approved browser-native UI authority produced under D-059, generic client/project content works through V2, catalog/enquiry are production-integrated, EN/AR/accessibility/performance gates pass, public media uses the approved R2 path, no price/stock/private ERP data leaks, and exact hosted evidence is recorded.

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
