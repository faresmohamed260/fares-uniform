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

**Phase 0 Discovery: COMPLETE. Phase 0A Hosted Odoo proof: PASS. Phase 0B Foundation architecture/UX: COMPLETE. Phase 1 Products/stock/access: COMPLETE. Phase 2A Retail checkout/offline: COMPLETE. Phase 2B Preorder/balance/collection: COMPLETE. Phase 2C Retail refunds/size exchanges: COMPLETE. Phase 3A Preorder production: COMPLETE. Phase 3B Business-client workflow: COMPLETE. Phase 4A Public catalog/enquiry: COMPLETE / VERIFIED. Phase 4B Operational reporting: COMPLETE / VERIFIED. Phase 5 Integrated UAT/onboarding: COMPLETE / VERIFIED. Phase 5A Arabic launch-quality polish: COMPLETE / VERIFIED. Phase 6 Deployment architecture/readiness proof: ACTIVE / AUTHORIZED.**

Current branch: `phase-6/deployment-readiness`.

**Authoritative application/test SHA remains Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.** Phase 6 documentation/configuration work must not be mistaken for newer application authority unless exact-head hosted evidence explicitly proves a new runtime candidate.

Final Phase 5A authority remains:
- workflow `Phase 5A Arabic polish`, run `34700625051`;
- Odoo/UAT job `103571619120` — success;
- **149 tests, 0 failures, 0 errors**;
- repeatable seven-production-addon upgrade — success;
- Odoo/UAT artifact `10300402418`, digest `sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`;
- public-web job `103571619062` — success;
- public `npm ci`, typecheck, production build and **8/8 Playwright** — success;
- web artifact `10300486494`, digest `sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`;
- fresh Arabic/RTL/narrow review — pass;
- open release-candidate P0/P1/P2 — **0 / 0 / 0**.

No merge, production deployment, real-data migration, live domain/DNS change, secret/resource mutation or paid-resource creation has occurred.

## Active Phase 6 boundary

The client instructed continued development after Phase 5A. The bounded next work is `docs/phases/PHASE_6_DEPLOYMENT_READINESS.md`.

Phase 6 may:
- document and compare deployment architecture/provider options;
- add provider-neutral deployment configuration, backup/restore tooling and hosted CI proof;
- use synthetic data and disposable GitHub-hosted runners;
- prove database + filestore backup/restore mechanics without live cloud infrastructure.

Phase 6 may **not** create paid/live staging or production resources, mutate Vercel/Cloudflare/hosting accounts, purchase domains, add real secrets, migrate real data, or deploy production without separate explicit authorization.

## Deployment architecture recommendation — pending client acceptance

`docs/architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md` records the current technical recommendation, not a provider selection.

Recommended initial shape:
- one small x86-64 EU Linux VPS for Odoo + PostgreSQL + persistent Odoo filestore;
- reverse proxy/TLS in front of Odoo;
- database and filestore stored outside the application image/container lifecycle;
- coordinated database+filestore backup sets copied off-host to an S3-compatible object store;
- provider-native VM backups/snapshots as a secondary layer, never the sole recovery authority;
- public Next.js remains separate and Vercel-targeted;
- production and staging remain separate state/security boundaries.

Dated 2026-09-12 provider research currently puts Hetzner Cloud first on cost/value, DigitalOcean as a simpler/more expensive alternative, and Render as a materially more expensive split-state option for this small initial deployment. **No provider is selected yet.**

## Product and architecture direction

Odoo Community remains private operational truth. Fares addons preserve native product/POS/CRM/sale/payment/stock ownership. Public browser code receives only the frozen allowlisted public projection/enquiry contract.

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

The accepted MVP release scenarios remain proven together and the current release candidate has no known P0/P1/P2 application defect. Phase 6 is therefore an operations/deployment-proof phase, not a feature phase.

Application readiness and production readiness remain separate. Production stays **NO-GO** until the deployment-specific gates are explicitly selected/proven.

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
13. Phase 5A Arabic launch-quality polish — complete / verified.
14. Phase 6 deployment architecture + provider-neutral package + synthetic restore proof — **active / authorized**.
15. After explicit client/operator choices: paid staging, provider-specific restore/device/operations proof, then production cutover only under separate authorization.

## Immediate next action

Implement Phase 6 repository/CI scope:
1. provider-neutral container packaging for pinned Odoo + seven production addons;
2. production-safe Odoo/proxy configuration templates without secrets;
3. persistent database/filestore boundaries;
4. consistent backup-set + restore tooling;
5. hosted CI backup/restore rehearsal with synthetic data, including stored-file recovery and incomplete-set failure tests;
6. document exact evidence.

Do not create live or paid resources while doing this.

## Decisions still required before live infrastructure

Client/operator must explicitly accept or change:
- hosting provider and region;
- initial server size and budget ceiling;
- provider-native backup choice;
- object-store bucket/provider ownership;
- backup frequency/retention and RPO/RTO;
- paid staging strategy;
- domain/DNS/TLS/internal-access model;
- secret owners;
- real store browser/scanner/printer validation;
- named staff/training/recovery ownership;
- opening-data/cutover method;
- monitoring/logging/alert ownership;
- launch timing.

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

Implemented, hosted-tested, visually reviewed, staged and deployed are separate states. Every implementation/deployment claim must refer to exact remote evidence. Synthetic proof data only until real-data migration is separately authorized; credentials and private business records never belong in this public repository.
