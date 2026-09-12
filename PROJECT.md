# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code and documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Public presentation is a separate Next.js surface consuming only the narrow Fares public API.
- No production deployment is authorized yet.

## Current state — 2026-09-12

**Phase 0 Discovery: COMPLETE. Phase 0A Hosted Odoo proof: PASS. Phase 0B Foundation architecture/UX: COMPLETE. Phase 1 Products/stock/access: COMPLETE. Phase 2A Retail checkout/offline: COMPLETE. Phase 2B Preorder/balance/collection: COMPLETE. Phase 2C Retail refunds/size exchanges: COMPLETE. Phase 3A Preorder production: COMPLETE. Phase 3B Business-client workflow: COMPLETE. Phase 4A Public catalog/enquiry: COMPLETE / VERIFIED. Phase 4B Operational reporting: COMPLETE / VERIFIED. Phase 5 Integrated UAT/onboarding: COMPLETE / VERIFIED.**

Current branch: `phase-5/integrated-uat-onboarding`.

**Authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.** Later documentation-only commits do not supersede this tested authority.

Final Phase 5 hosted authority:
- workflow: `Phase 5 integrated UAT`, run `34698087230`;
- Odoo/UAT job `103564935283` — success;
- combined result: **148 tests, 0 failures, 0 errors**;
- repeatable upgrade of `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting` — success;
- Odoo/UAT artifact `10298859526`, digest `sha256:510f57a2f1b8c6cfc9b6627c086240b1e03a069112c8780c0cc51bb78f28c0c5`;
- public-web job `103564935388` — success;
- public typecheck/build — success;
- public Playwright — **8/8 passed**;
- web artifact `10298634549`, digest `sha256:cabf625930954e29dfd413cbfc24c5c5c4cf95713c15cd754bc3e64b0f44dc5f`;
- manual representative EN/AR/RTL/narrow evidence review — release-usable/pass, with one documented P2 partial-internal-Arabic-label localization finding;
- open P0/P1 UAT defects — **0**.

No merge, production deployment, real-data migration, live domain/DNS change, secret/resource mutation or paid-resource creation occurred.

## Product and architecture direction

Odoo Community remains private operational truth. Fares addons preserve native product/POS/CRM/sale/payment/stock ownership. Public browser code receives only the frozen allowlisted public projection/enquiry contract; Phase 5 did not broaden the anonymous surface.

Confirmed product/stock rules remain:
- school/client-specific designs are distinct stocked products when units are not interchangeable;
- sizes remain configurable per product family;
- permanent variant codes use `FU-000001` style;
- one Retail Store and one Storage location are currently confirmed;
- Cash and InstaPay are current payment methods; cards/wallets are future work;
- public catalog exposes neither price nor stock;
- production Finished remains workflow state until physical Store/Storage receipt;
- numeric real volumes, service budget and launch date remain unknown and must not be invented.

## Authoritative completed phases

- Phase 1 products/stock/access — application `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`.
- Phase 2B preorder/balance/collection — application `af64b858cf6f2be6a143bb19e836721abc216221`.
- Phase 2C retail refunds/size exchanges — application `62369e62dd1e5d2505e089c6a5ede296a24bcb3b`; 82 tests + repeatable three-addon upgrade.
- Phase 3A preorder production — application `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`; 93 tests + repeatable four-addon upgrade.
- Phase 3B business-client workflow — application `d6efa76a99c0732423b354d2d9f787f6ccbdebec`; 118 tests + repeatable five-addon upgrade.
- Phase 4A public catalog/enquiry — application `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`; 132 Odoo tests + repeatable six-addon upgrade + 8/8 public Playwright.
- Phase 4B operational reporting — application `29b2589e7e71271071f97c9de57dfb97b49b100d`; 144 Odoo tests + repeatable seven-addon upgrade + 8/8 public Playwright + manual reporting review.
- Phase 5 integrated UAT/onboarding — application/UAT `5d23e56e72122014a7f886ee7f4ec24d3153c78a`; 148 tests + repeatable seven-production-addon upgrade + 8/8 public Playwright + integrated/manual release evidence.

Detailed contracts/evidence remain in `docs/phases/`, `docs/validation/` and `docs/operations/`; this file is the current handoff, not a replacement for those records.

## Phase 5 release-readiness conclusion

The nine accepted MVP release scenarios are proven together on the authoritative Phase 5 SHA: product/stock custody, retail/offline, preorder/production/collection, controlled returns/exchanges, B2B lifecycle, public catalog/enquiry, reporting and role/security boundaries.

The test-only `fu_uat` addon is evidence infrastructure only and is not part of the seven-production-addon upgrade authority.

Synthetic onboarding was rehearsed and documented. The system supports configurable company/location/user/product/payment/preorder/public/reporting setup without encoding real business-specific values into source.

One non-blocking finding remains: `P2-001`, selected English field/help labels on otherwise usable RTL internal Arabic forms. It is launch-quality polish, not a data/security/workflow blocker.

## Roadmap

1. Phase 0 discovery — complete.
2. Phase 0A hosted Odoo proof — pass.
3. Phase 0B architecture/data/UI foundation — complete.
4. Phase 1 products/stock/access — complete.
5. Phase 2A retail checkout/offline — complete.
6. Phase 2B preorder/balance/collection — complete.
7. Phase 2C consumer retail refunds/size exchanges — complete.
8. Phase 3A preorder production — complete.
9. Phase 3B business-client workflow — complete.
10. Phase 4A public catalog/enquiry — complete / verified.
11. Phase 4B operational reporting — complete / verified.
12. Phase 5 integrated UAT/onboarding/deployment-readiness planning — **complete / verified**.
13. Resolve production-specific deployment inputs, optional P2 launch polish, then stage/deploy only under explicit authorization.

## Immediate next action

Production deployment is currently **NO-GO**, not because of an application P0/P1, but because deployment-specific choices/proofs remain unresolved. Start from `docs/operations/DEPLOYMENT_READINESS.md` and resolve hosting/persistence, database+filestore restore proof, environment/secrets ownership, real store device/browser/scanner/printer compatibility, named staff/training, real opening-data/cutover responsibility, monitoring ownership, budget and launch timing.

Do not create production resources, mutate DNS/domains/secrets, migrate real data, merge or deploy without explicit authorization.

## Later explicit business-policy decisions

Still deferred unless their affected work starts:
- B2B deposit refund/forfeiture and credit-note/refund policy;
- post-confirmation business-order amendments;
- any future partial shipment or customer-credit terms;
- tax/legal revenue recognition/invoicing treatment;
- report exports/scheduled delivery;
- cards/wallets and bank API automation;
- automated customer notifications;
- raw-material/WIP inventory.

## Evidence policy

Implemented, hosted-tested, visually reviewed, merged and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
