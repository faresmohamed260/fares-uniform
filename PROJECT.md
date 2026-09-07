# Fares Uniform project

## Confirmed brief

- Product: ERP for the client's father's small clothing factory.
- Client: Fares. The assistant gathers requirements and develops the system.
- Project title: Fares Uniform.
- Public repository: https://github.com/faresmohamed260/fares-uniform
- Initial deployment target: Vercel for the public web application; Odoo requires a separate compatible persistent host.
- Available stack services: Supabase and Cloudflare, neither selected as an operational mirror by default.
- Source of truth: repository code and docs; no reliance on session memory or local files.
- Execution: remote only.

## Current state — 2026-09-07

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: IMPLEMENTATION FOUNDATION READY / CLIENT VISUAL REVIEW OPEN. Phase 1 — Products/stock/access: CONTRACT PREPARED / NOT ACTIVE.**

The accepted MVP boundary covers finished stock, bilingual offline POS, preorders/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics remains future work.

Phase 0A proved the Odoo Community direction at implementation `1ad528e02ed1a709d34620731d182c5e1cbdebe9`, run `34068805602`: 15/15 tests passed. Odoo remains a conditional technical GO with Fares-owned addons/UX and the isolated offline-restore compatibility shim documented in `docs/validation/ODOO_PROOF.md`.

Phase 0B formalized the hybrid architecture and design-system direction. The client rejected the first technically passing UI baseline as too custom-built and too visually restrained. The revised prebuilt-first implementation `fa9ef2413177a54e566c5505e1e858696c8a9bfb` uses actual official shadcn/Base UI primitives with RTL plus visibly stronger Motion spring/morph/shared-layout effects. Hosted run `34073833275`, job `101596052081` passed typecheck, optimized build and **15/15 browser tests**, producing a refreshed eight-screen EN/AR desktop/mobile artifact while verifying maintained primitive use, keyboard Dialog behavior, normal visible physics and exact reduced-motion suppression. See `docs/validation/UI_FOUNDATION.md`.

On 2026-09-07 the client confirmed the remaining product/stock blockers:
- school/client-specific designs are stocked as different products;
- no tracked factory-finished inventory location is useful;
- size systems vary by garment and remain configurable per product family;
- permanent sequential `FU-000001`-style variant codes are accepted.

These rules are now authoritative in `docs/requirements/PRODUCT_AND_STOCK_RULES.md` and decisions D-028/D-029.

The first production-grade contract is prepared at `docs/phases/PHASE_1_PRODUCTS_STOCK_ACCESS.md`. It is deliberately **not active** because Phase 0B still requires the client's explicit visual decision; passing screenshots/tests are not client taste approval.

Draft PR #2 (`foundation/phase-0b` → `proof/odoo-community`) remains the current foundation review branch.

One retail store, one storage location and one checkout per store are confirmed. Numeric product/transaction volumes remain unavailable and must not be invented. Launch date and service budget remain deployment-time decisions.

## Roadmap

1. Phase 0: business discovery and first-release boundary — complete.
2. Phase 0A: Odoo technical proof — pass.
3. Phase 0B: architecture/data/UI foundation — all technical/data gates ready; client visual gate open.
4. Phase 1: products, finished-stock movements, access controls and opening inventory — contract prepared; execute after visual gate.
5. Phase 2+: retail POS/preorders/payments/offline reconciliation, production/business workflows, public catalog/reports, then integrated onboarding/UAT/deployment in bounded contracts.

## Immediate next action

**Client visual review of the revised prebuilt-first/fancy-motion direction is now the only blocker before Phase 1 execution.**

Review the refreshed Phase 0B rendered direction from hosted run `34073833275` / artifact `phase0b-ui-fa9ef2413177a54e566c5505e1e858696c8a9bfb` (artifact ID `10001375991`). The previous artifact is superseded for visual review. The client should answer whether this revised direction is accepted, rejected, or accepted with specific changes.

Do not ask the client again about product-design separation, factory-finished custody, size-system variability or sequential item codes unless the client changes those decisions.

## Later explicit decisions

Resolve only when their affected phase starts:
- offline preorder/collection/refund/exchange behavior;
- missing/delayed InstaPay confirmation policy;
- refund/exchange eligibility;
- preorder reservation/allocation;
- production threshold defaults/configuration semantics;
- business final-payment/partial-shipment rules;
- tax/legal receipt identity and report formulas;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim refers to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
