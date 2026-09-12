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

**Phase 0 Discovery: COMPLETE. Phase 0A Hosted Odoo proof: PASS. Phase 0B Foundation architecture/UX: COMPLETE. Phase 1 Products/stock/access: COMPLETE. Phase 2A Retail checkout/offline: COMPLETE. Phase 2B Preorder/balance/collection: COMPLETE. Phase 2C Retail refunds/size exchanges: COMPLETE. Phase 3A Preorder production: COMPLETE. Phase 3B Business-client workflow: COMPLETE. Phase 4A Public catalog/enquiry: COMPLETE / VERIFIED. Phase 4B Operational reporting: COMPLETE / VERIFIED. Phase 5 Integrated UAT/onboarding: COMPLETE / VERIFIED. Phase 5A Arabic launch-quality polish: COMPLETE / VERIFIED.**

Current branch: `phase-5a/arabic-launch-polish`.

**Authoritative Phase 5A application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.** Later documentation-only commits do not supersede this tested authority.

Final Phase 5A hosted authority:
- workflow `Phase 5A Arabic polish`, run `34700625051`;
- Odoo/UAT job `103571619120` — success;
- combined result: **149 tests, 0 failures, 0 errors**;
- repeatable upgrade of `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting` — success;
- Odoo/UAT artifact `10300402418`, digest `sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`;
- public-web job `103571619062` — success;
- public `npm ci`, typecheck and production build — success;
- public Playwright — **8/8 passed**;
- web artifact `10300486494`, digest `sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`;
- fresh manual Arabic/RTL/narrow evidence review — pass;
- `P2-001` — **RESOLVED / CLOSED**;
- open release-candidate P0/P1/P2 defects — **0 / 0 / 0**.

The earlier candidate `f5e2f03b92fc54aa433ba3ad3753bd68fb885030` / run `34699969872` is permanently red and non-authoritative because its new test attempted focus while the action was deliberately disabled offline. The final SHA changes only that test sequence and leaves the localization implementation intact.

No merge, production deployment, real-data migration, live domain/DNS change, secret/resource mutation or paid-resource creation occurred.

## Product and architecture direction

Odoo Community remains private operational truth. Fares addons preserve native product/POS/CRM/sale/payment/stock ownership. Public browser code receives only the frozen allowlisted public projection/enquiry contract; Phase 5A did not broaden the anonymous surface.

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
- Phase 5A Arabic launch-quality polish — application/test `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`; 149 tests + repeatable seven-production-addon upgrade + 8/8 public Playwright + fresh Arabic/RTL manual evidence; P2-001 closed.

Detailed contracts/evidence remain in `docs/phases/`, `docs/validation/` and `docs/operations/`; this file is the current handoff, not a replacement for those records.

## Release-readiness conclusion

The accepted MVP release scenarios remain proven together, and Phase 5A closes the final known release-candidate localization finding without changing workflow/security/public contracts. The test-only `fu_uat` addon remains evidence infrastructure only and is not part of the seven-production-addon upgrade authority.

Application release-candidate defect counts are P0 **0**, P1 **0**, P2 **0**. This is not the same as production deployment readiness.

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
12. Phase 5 integrated UAT/onboarding — complete / verified.
13. Phase 5A Arabic launch-quality polish — **complete / verified**.
14. Resolve production-specific deployment inputs, prove staging/restore/device/operations readiness, then stage/deploy only under explicit authorization.

## Immediate next action

Production deployment is **NO-GO** because production-specific choices/proofs remain unresolved, not because of an open application P0/P1/P2. Start from `docs/operations/DEPLOYMENT_READINESS.md` and resolve hosting/persistence, PostgreSQL + filestore backup/restore and RPO/RTO, staging and secret ownership, Vercel production/domain/DNS, real store browser/scanner/printer compatibility, named staff/training, opening-data/cutover ownership, monitoring, budget and launch timing.

Do not invent those choices. Do not create production resources, mutate DNS/domains/secrets, migrate real data, merge or deploy without explicit authorization.

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
