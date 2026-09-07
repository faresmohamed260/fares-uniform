# Foundation architecture

Status: PHASE 0B DEVELOPER DESIGN, 2026-09-07. Technical boundaries are selected where supported by evidence; business-policy unknowns remain explicitly open.
Sources: `docs/requirements/MVP_SCOPE.md`, `docs/architecture/PLATFORM_EVALUATION.md`, `docs/validation/ODOO_PROOF.md`, `docs/phases/PHASE_0B_FOUNDATION.md`.

## 1. System shape

Fares Uniform will use a hybrid architecture rather than rebuilding a full ERP stack.

### Operational core — Odoo Community 19
Owns:
- product templates and stock-bearing variants;
- finished-garment stock and locations;
- customer records needed for operations;
- retail/business operational orders;
- recorded payment state and balances;
- Fares-owned preorder, collection and production-task extensions;
- staff authentication, server-side authorization and operational audit events.

Rules:
- Prefer project addons over edits to Odoo core.
- Keep the Phase 0A offline restore compatibility shim isolated and version-pinned until an upstream replacement is verified.
- Do not import proprietary Enterprise code into this public repository.
- Odoo PostgreSQL plus filestore remain one operational persistence boundary. Do not dual-write operational truth into another database by default.

### Public web — Vercel-targeted Next.js application
Owns:
- public brand/business presentation;
- catalog browsing without prices or stock availability;
- large-client acquisition pages;
- enquiry UI and contact routes;
- public-only SEO/content metadata.

Selected technical direction for the Phase 0B prototype:
- Next.js App Router and TypeScript;
- source-owned accessible components, preferring shadcn/ui before custom generic controls;
- Motion for deliberate spring/layout/shared-element interaction;
- semantic design tokens rather than page-specific styling.

Versions are not pinned in documentation. The actual hosted scaffold must record and test exact versions when initialized.

### Public integration boundary
The browser must not receive Odoo staff credentials or broad Odoo API capability.

Preferred flow:
1. Browser talks to the Vercel application.
2. Vercel server code calls a narrow Fares-owned Odoo public-projection addon.
3. Catalog responses contain an explicit allowlist of publishable fields only.
4. Enquiry creation accepts a dedicated validated schema and cannot invoke arbitrary models/methods.

Initial public projection must exclude at least:
- prices;
- stock quantities/availability;
- cost values;
- customer private records;
- payment/balance data;
- internal notes unless specifically marked public;
- staff/user/security data.

No direct public PostgreSQL access and no browser-to-general-Odoo-API architecture.

### Supabase and Cloudflare
- Supabase is not an operational ERP mirror. Use it later only if a specific independent capability justifies it.
- Cloudflare remains optional for DNS/proxy/media/security. Existing resources are not selected by inference.
- Public media storage/optimization remains a deployment decision; the catalog contract should not depend on one vendor-specific storage API.

## 2. Product and variant contract

The data model must support size-specific stock and production demand without hardcoding the factory's current informal naming.

### Proposed template rule
Use one Odoo `product.template` for one independently identifiable/sold/stocked garment design. A different school/client/logo/design that must never share stock or production demand should not be collapsed into the same template merely because the base garment shape is similar.

This is a developer model convention, not a claim about the factory's current paper naming. Borderline cases remain a client-review item.

### Variants
Use `product.product` variants for stock-bearing selectable attributes, with **size** required where relevant. Color can be a variant when stock/demand differs by color; do not globally force color as a variant for products where it is not meaningful.

Rules:
- Size labels are configurable data, not an enum baked into code.
- Attribute sets can vary by product family.
- Production aggregation keys must include the product template/design plus every stock-bearing attribute that must not mix, including size and color when applicable.
- Never aggregate merely on a display name string.

### Internal identification
Every stock-bearing variant requires stable unique internal identification.

Foundation rule:
- use system-managed unique `default_code`/SKU and barcode values at the variant level;
- do not encode mutable business meaning such as price, school name or location into identifiers;
- exact human-readable prefix/sequence, barcode symbology and printed label layout remain Phase 0 business/design decisions.

This allows scanners/printers to be supported by capability rather than vendor brand.

## 3. Finished-stock location contract

Confirmed physical tracked locations:
- retail store;
- storage location.

No third physical factory stock location is asserted by current discovery.

Foundation behavior:
- production task state remains distinct from stock state;
- **Finished** means factory work is complete;
- **Ready for collection** requires a recorded receipt at the store;
- tracked stock moves only when garments enter/move between defined inventory locations.

A logical `Factory Finished / Awaiting Transfer` stock location is a proposal, not a confirmed fact. Do not introduce it into production data until the physical handoff process is confirmed. The implementation must be able to add such a location later without schema redesign.

## 4. Offline POS contract

Phase 0A proved the minimum mechanism for ordinary paid sales under simulated API loss, reload and reconnect. Production architecture must preserve stronger invariants.

### Local transaction identity
Each locally created sale uses a stable UUID/idempotency identity that survives reload. Synchronization and retries must not create duplicate sale/payment/stock effects.

### States visible to staff
At minimum distinguish:
- local/pending sync;
- syncing;
- synced/confirmed by server;
- conflict/review required;
- failed/retryable.

Do not present a pending sale as centrally reconciled merely because checkout completed locally.

### Authority
- Local checkout may use the permissions cached for the enrolled device/session.
- The server revalidates queued actions on sync.
- Role revocation cannot be claimed instantaneous during an outage.
- Actor/device/time/idempotency identity must be retained for queued work.

### Conflict categories to design for
- item stock changed centrally while device was offline;
- product/price changed centrally after local sale began;
- authorization changed while offline;
- server received a transaction but client lost the acknowledgement;
- payment confirmation is missing/ambiguous;
- browser/device storage becomes unavailable.

The resolution policy for each category belongs in the retail implementation contract.

### Scope boundary
Mandatory offline checkout remains a requirement. Phase 0A has proven ordinary fully paid Cash/generic-Bank sales only. Offline behavior for preorders, balance collection, refund and exchange remains **unresolved**, not rejected. Do not silently make those workflows online-only without client confirmation.

## 5. Payment recording boundary

Initial methods: Cash and InstaPay.

InstaPay is manually confirmed by staff from the bank's mobile transaction notification. The ERP stores the staff-recorded payment and evidence metadata that the later implementation contract defines; it does not currently query a bank API.

Architecture must keep payment-method definitions extensible so card/wallet methods can be added later without branching core order logic by brand/provider.

Missing/delayed notification behavior remains a business-policy decision.

## 6. Addon ownership proposal

Keep Fares code small and domain-focused. Proposed module boundaries:
- `fu_core`: shared identifiers, audit/event utilities and common security helpers;
- `fu_retail`: preorder, collection and retail business rules that extend native POS/Sales;
- `fu_production`: demand aggregation and lightweight production tasks/status transitions;
- `fu_business`: large-client sample/order metadata when implemented;
- `fu_public_api`: explicitly allowlisted catalog projection and enquiry submission.

Do not create modules merely for folder symmetry. Split only when ownership/dependency boundaries become real.

## 7. Authorization and audit

Map the accepted role design to Odoo security groups and server-side rules. UI visibility is not permission enforcement.

Sensitive actions require attributable audit records with actor/time/target/reason/before-after where applicable, including:
- price override;
- refund/exchange approval;
- stock correction;
- production trigger/lead-time configuration;
- role changes;
- reconciliation/conflict resolution.

Posted transaction history is corrected by explicit reversal/correction, not silent deletion.

## 8. UI ownership boundary

### Public web
Can use the full React component/motion ecosystem because it does not own checkout mechanics.

### Internal ERP/POS
Stay within Odoo/Owl extension points and native services. Share visual tokens/concepts with the public site, not React component source.

The client should experience one brand system across both surfaces, but the implementation technologies remain appropriately different.

## 9. Environment and delivery boundary

Current authorized execution remains remote-only and non-production.

- GitHub branches/PRs own source review.
- GitHub Actions owns disposable build/test evidence during Phase 0B unless another remote preview service is explicitly selected.
- A future Vercel preview may be used for the public web; creating a production project/domain or paid resource needs an explicit resource decision.
- Odoo production hosting, PostgreSQL persistence, filestore, backups and observability remain deployment-phase choices.

## 10. Foundation acceptance scenarios

1. A product model can represent two designs that must not share stock, and sizes remain independently stockable/aggregatable.
2. Identifier/barcode fields stay stable even if names, prices or locations change.
3. Public catalog serialization cannot leak price/stock/private fields because those fields do not exist in its output schema.
4. A queued offline sale has stable identity and visible sync state; duplicate retry is defined as an idempotency failure, not acceptable behavior.
5. Arabic/RTL and reduced-motion are design-system behaviors rather than per-page patches.
6. Public React components and internal Owl components can look like one system without coupling their runtime implementations.

## Open decisions carried forward
- exact size/color/design rules for real product families;
- item-code/barcode/label presentation;
- factory-to-store physical staging details;
- offline preorder/collection/refund/exchange policy;
- delayed InstaPay confirmation handling;
- refund/exchange eligibility;
- business final-payment/partial-shipment rules;
- legal/tax/receipt identity;
- actual hosting/media/security providers and costs.
