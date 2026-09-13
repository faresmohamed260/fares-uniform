# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code and documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Public presentation is a separate Next.js surface consuming only the narrow Fares public API.
- Vercel is now the client-selected deployment-platform direction, following the RenderLab/SAGA pattern: application compute on Vercel, durable truth in managed backing services.
- No production deployment is authorized yet.

## Current state — 2026-09-13

**Phase 0 Discovery: COMPLETE. Phase 0A Hosted Odoo proof: PASS. Phase 0B Foundation architecture/UX: COMPLETE. Phase 1 Products/stock/access: COMPLETE. Phase 2A Retail checkout/offline: COMPLETE. Phase 2B Preorder/balance/collection: COMPLETE. Phase 2C Retail refunds/size exchanges: COMPLETE. Phase 3A Preorder production: COMPLETE. Phase 3B Business-client workflow: COMPLETE. Phase 4A Public catalog/enquiry: COMPLETE / VERIFIED. Phase 4B Operational reporting: COMPLETE / VERIFIED. Phase 5 Integrated UAT/onboarding: COMPLETE / VERIFIED. Phase 5A Arabic launch-quality polish: COMPLETE / VERIFIED. Phase 6 Provider-neutral deployment/readiness proof: COMPLETE / VERIFIED. Phase 7 Vercel deployment adaptation: ACTIVE / AUTHORIZED — durable state/session/recovery and external cron slices are GREEN; WebSocket continuity is the current RED blocker.**

Current branch: `phase-7/vercel-deployment-adaptation`.

Latest implementation HEAD before this documentation checkpoint: `fcb811f947aa74c0370fd82b83bc0e01e962f07b` (`fix(phase7): install websocket bus dependency explicitly`).

**Authoritative business-application/test SHA remains Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.**

**Authoritative Phase 6 provider-neutral deployment-package SHA remains `e337315684c62d69ad75ba56a5867098da17489c`.**

Pinned Odoo Community SHA remains `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Verified inherited authority

### Phase 5A application authority

Workflow `Phase 5A Arabic polish`, run `34700625051`:
- Odoo/UAT job `103571619120` — success;
- **149 tests, 0 failures, 0 errors**;
- repeatable seven-production-addon upgrade — success;
- Odoo/UAT artifact `10300402418`, digest `sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`;
- public-web job `103571619062` — success;
- public `npm ci`, typecheck, production build and **8/8 Playwright** — success;
- fresh Arabic/RTL/narrow review — pass;
- open release-candidate P0/P1/P2 — **0 / 0 / 0**.

### Phase 6 deployment authority

Workflow `Phase 6 deployment readiness`, run `34726690763`, job `103641932057`, is **GREEN / VERIFIED** at deployment-package SHA `e337315684c62d69ad75ba56a5867098da17489c`.

Artifact `10307809040`, `phase6-deployment-e337315684c62d69ad75ba56a5867098da17489c`, digest `sha256:4367f4fd3085aa38b6381ef9cca0168bef0951b7e2d63cce67cd5b390fb0ae38`.

The Phase 6 proof established restrictive runtime secrets, least-privileged PostgreSQL role, blocked database-manager routes, HTTPS edge behavior, application-container replacement persistence, manifest/checksum backup verification, incomplete-set rejection, destructive clean-volume restore, fixed non-root Odoo volume ownership and restored database/attachment verification. Its RED chronology remains authoritative in `docs/validation/PHASE_6_DEPLOYMENT_READINESS.md`.

Phase 6 source-authority evidence records `application_source_diff=none` for `addons` and `apps/public-web`, so Phase 6 does not replace Phase 5A as business-application authority.

## Phase 7 — Vercel direction

The client explicitly selected **Vercel** on 2026-09-13, asking to use it like RenderLab and SAGA. This supersedes the earlier Phase 6 single-VPS/Hetzner recommendation. It does not erase the valid Phase 6 provider-neutral recovery proof.

The active contract is `docs/phases/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`; exact RED/GREEN chronology is in `docs/validation/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`.

The Vercel target is deliberately stateless:
- `apps/public-web` remains Next.js on Vercel;
- private Odoo is evaluated as a Vercel container/Service;
- PostgreSQL moves to a managed external service, with Supabase the preferred first candidate because it is already an accepted/available project service family;
- Odoo attachments use native database-backed attachment storage for the first proven topology instead of a mounted filestore;
- Odoo HTTP sessions use a shared PostgreSQL-backed server-side store;
- scheduled work uses an authenticated external trigger while built-in Odoo cron threads remain disabled;
- Odoo bus/WebSocket behavior still must be proven to reconnect safely across Vercel runtime lifecycle changes.

### Phase 7 verified progress

**Durable state/session/recovery slice — GREEN.** Exact-head implementation SHA `52bd809facb2a701e7d61db777ff018fa2f8778b`; workflow `Phase 7 Vercel adaptation`, run `34754781691`, job `103717216101`; artifact `10316318863`, digest `sha256:37bc11aff6d652b256e283a6ac9132c3ba11f023e4158da780d48ef4d9815191`.

That proof establishes no declared persistent Odoo volume, database-backed attachments, PostgreSQL-backed authenticated HTTP sessions, runtime replacement continuity, database-only backup/recreate/restore continuity, privileged ownership of the session schema, least-privileged runtime DML and built-in cron threads disabled.

**External cron/background slice — GREEN.** Exact-head implementation SHA `8719a6f868813da1f7618200e7ad1036f2214b60`; workflow `Phase 7 Vercel cron trigger`, run `34755578761`, job `103719261532`; artifact `10317405872`, digest `sha256:5fe902b2788bb35c7220a12f6add36a6544ef072a00bb20aaf4709c3474ae60c`.

That proof establishes two stateless Odoo runtimes with built-in cron disabled, rejection of unauthenticated/invalid external trigger requests and exactly-once execution of one due synthetic Odoo cron under concurrent authenticated triggers using Odoo's native locking semantics.

**Realtime/WebSocket slice — RED / ACTIVE BLOCKER.** The current implementation includes an evented WebSocket runtime mode plus continuity client/sender proof scaffolding. Diagnostic commit `8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32` preserved evented-startup evidence in run `34762055023`, job `103736500596`, artifact `10319296739`, digest `sha256:ebf065dccd4ed92bd5704129c4074a2db4a5938b99a92ceb720952aaa527e308`.

The latest candidate `fcb811f947aa74c0370fd82b83bc0e01e962f07b` explicitly installs/upgrades Odoo `bus`. Workflow `Phase 7 Vercel websocket continuity`, run `34762496143`, job `103737654226` still fails at **Start evented websocket service on its Vercel service port** after the database, production addons + `bus`, normal HTTP runtime and shared authenticated session steps all pass. Artifact `10319751894`, digest `sha256:1a48d06872914fef024e68fdaa68d421218f67f6bb1f5bb2b2ca4dc439cbf8ff`. Notification/replacement/reconnect steps are not yet reached.

The temporary diagnostic workflow `.github/workflows/phase7-diagnose-websocket.yml` remains intentionally present until the WebSocket startup issue is resolved and its exact RED evidence is no longer needed for active debugging.

The verified Compose/VPS package is **not** being deleted or retroactively reclassified. It remains the provider-neutral recovery baseline and fallback if Vercel-specific assumptions fail evidence-based validation.

## Commercial/live-resource boundary

The connected Vercel team is currently on the Hobby plan. Fares Uniform is a commercial workload. Phase 7 repository design, compatibility implementation and hosted CI are authorized, but no plan upgrade, billable Vercel project/resource, managed production database, production secret, domain/DNS mutation or real-data deployment is authorized by this provider-selection decision alone.

A real Fares staging/production deployment must use an appropriate commercial plan and requires separate explicit authorization before any purchase/account mutation.

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
- numeric real volumes and launch date remain unknown and must not be invented.

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
- Phase 6 provider-neutral deployment architecture/readiness — package `e337315684c62d69ad75ba56a5867098da17489c`; exact-head hosted security/persistence/backup/destructive-restore proof green.

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
14. Phase 6 provider-neutral deployment + synthetic restore proof — complete / verified.
15. Phase 7 Vercel stateless deployment adaptation — **active / authorized; state/session/recovery GREEN; external cron GREEN; WebSocket continuity RED**.
16. After Phase 7 exact-head proof and separate commercial/live-resource authorization: Vercel commercial staging, real backing-service rehearsal/device/operations proof, then production cutover only under separate authorization.

## Immediate next action

Continue Phase 7 from the current remote branch state, without creating live resources:
1. inspect the preserved WebSocket diagnostic evidence first — run `34762055023` / job `103736500596` / artifact `10319296739` — and the latest failed WebSocket proof run `34762496143` / job `103737654226` / artifact `10319751894`; identify the exact evented/gevent startup error rather than guessing;
2. make the narrowest deployment/runtime fix supported by that evidence and rerun `Phase 7 Vercel websocket continuity` at the exact candidate head until startup, authenticated notification, runtime replacement and reconnect/replay gates are all green;
3. once the WebSocket slice is green, remove `.github/workflows/phase7-diagnose-websocket.yml` and preserve its historical RED run/artifact in validation chronology;
4. verify the exact current Vercel Services/project configuration schema immediately before adding final service/routing/security configuration, keeping private Odoo exposure minimal and the cron boundary authenticated;
5. rerun inherited application/public gates if the final runtime/platform configuration can affect them;
6. update exact RED/GREEN evidence and close Phase 7 only when all exit criteria are exact-head green.

Do not regress or redo the already-green durable-state/session/recovery or external-cron slices unless a later change can affect them. Do not upgrade Vercel, create a paid Fares project/database, set production secrets/domains, or deploy real data while doing this.

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