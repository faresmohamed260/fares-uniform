# Phase 6 — Deployment architecture and readiness proof

Status: **ACTIVE / AUTHORIZED, 2026-09-12. First implementation candidate RED / NOT VERIFIED.**

Branch: `phase-6/deployment-readiness`.

Starting documentation lineage: `83c10179bb4c4ae6424fb3ff1d76b2cae5bd5234`.

Inherited authoritative Phase 5A application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Authorization: after Phase 5A closure the client instructed the developer to keep going. This authorizes bounded deployment-readiness planning, provider-neutral deployment packaging, hosted CI validation and synthetic/non-production restore rehearsals that do not create paid or live cloud resources. It does **not** authorize production deployment, merge, paid-resource creation, production/staging account mutation, domains/DNS, certificates, secrets, real staff/customer/bank/inventory data or real-data migration.

## Goal

Turn the verified release candidate into a reproducible, provider-neutral deployment package and prove its persistence/backup/restore mechanics in hosted CI so that the remaining production choices are concrete and reviewable instead of being invented during cutover.

Phase 6 is intentionally split into two boundaries:
1. **Repository/CI work now:** architecture, deployment configuration, backup/restore tooling and synthetic hosted proof.
2. **Operator-selected infrastructure later:** provider/account, paid staging, domains, secrets, real devices, staff, data cutover, monitoring, budget and launch timing require explicit client/operator decisions before any live mutation.

## In scope

1. Record a deployment architecture recommendation and dated provider comparison without treating a recommendation as provider selection.
2. Add a provider-neutral Linux container deployment package for the seven production addons against the pinned Odoo 19 source authority.
3. Preserve PostgreSQL and the Odoo filestore independently from container/image lifecycle.
4. Configure production-safe Odoo defaults in templates: fixed database targeting/filtering, no database list/manager exposure, reverse-proxy mode, HTTPS expectation, non-superuser database application account and production multiprocess settings sized by environment variables rather than hardcoded to one server.
5. Provide health checks and restart-safe service ordering.
6. Provide backup tooling that creates one backup set containing a PostgreSQL logical backup plus the matching Odoo filestore while application writes are quiesced for consistency.
7. Support an S3-compatible offsite backup target by environment configuration; Cloudflare R2 is the current preferred available object-store candidate but no bucket/credential/resource is selected or created in this phase.
8. Provide restore tooling that restores database + filestore as one set and fails closed on missing/mismatched metadata.
9. Add hosted CI that builds the deployment image/package, initializes synthetic Odoo state, creates a backup, destroys/replaces that state, restores into a clean target, and proves application/database/filestore recovery without paid infrastructure.
10. Keep public Next.js production targeting on the already accepted Vercel direction; Phase 6 may document required environment boundaries but must not create or mutate a Vercel production project.
11. Update `docs/operations/DEPLOYMENT_READINESS.md` with evidence as gates are genuinely proven.

## Explicitly out of scope

- selecting a paid hosting provider without explicit client acceptance;
- provisioning Hetzner, DigitalOcean, Render, Vercel, Cloudflare or any other live resource;
- purchasing services or domains;
- production or paid staging deployment;
- adding production secrets to GitHub or source;
- changing business workflows, schemas, ACLs or public DTO/enquiry contracts;
- changing the authoritative Phase 5A application behavior merely to make deployment easier;
- real opening-stock/customer/order/staff data import;
- actual store scanner/printer/browser acceptance, which requires the real device/operator environment;
- silently choosing production RPO/RTO, backup retention, launch date or budget.

## Architecture decision status

`docs/architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md` records the current recommendation and alternatives.

Current recommendation, **pending client acceptance**:
- one small x86-64 EU Linux VPS for initial Odoo + PostgreSQL + persistent filestore, because the confirmed business is small and the architecture avoids paying for multiple managed services before load evidence requires them;
- a reverse proxy/TLS edge in front of Odoo;
- off-host backup copies in an S3-compatible object store;
- public Next.js remains separately deployable to Vercel and receives only the existing narrow Fares public API contract;
- production and staging must be separate state/security boundaries even if they use the same provider.

Hetzner Cloud currently leads the cost/value comparison for the VPS role, with DigitalOcean as the simpler/more expensive alternative and Render as a higher-cost split-state alternative. This is a recommendation only, not a provider decision.

## Data and recovery rules

The database and filestore form one recoverable application state. A backup/restore claim is invalid if only one is restored.

Repository tooling must:
- assign a backup-set identifier/timestamp shared by database, filestore and manifest;
- record application SHA, pinned Odoo SHA, database name and checksums in the manifest;
- quiesce Odoo application workers during the consistency-critical capture window in the simple single-node design;
- never embed object-store credentials in source or logs;
- verify archive/checksum integrity before restore;
- restore into a clean target in CI and run a post-restore smoke query/application check;
- keep provider-native VM snapshots as a secondary recovery layer only, not as the sole database+filestore backup authority.

Production backup frequency/retention and RPO/RTO remain **UNDECIDED** until the client/operator accepts targets. Phase 6 CI proves mechanics, not production policy.

## Security boundary

The deployment package must follow Odoo 19 production guidance:
- HTTPS at the reverse proxy;
- `proxy_mode = True` only behind that proxy;
- fixed `db_name`/`dbfilter` for the environment;
- `list_db = False` and blocked database-management routes;
- PostgreSQL application user is not a superuser and does not receive broad database-creation authority;
- secrets come from runtime secret stores/environment injection;
- no broad Odoo or database credential reaches the public browser;
- the existing Fares public allowlist/API boundary remains unchanged.

## Current implementation candidate and hosted evidence

Implementation candidate `1892455616d7cd59e4706006b794d35df7f8f170` adds the provider-neutral deployment package, Compose topology, PostgreSQL/Odoo/nginx configuration, backup/restore tooling, synthetic recovery fixtures and workflow `Phase 6 deployment readiness`.

Hosted run `34707428136`, job `103589908228`, is **RED / NON-AUTHORITATIVE**.

Successful pre-failure steps:
- exact-head checkout and source-authority verification;
- verification that `addons` and `apps/public-web` have no diff from inherited Phase 5A authority `cc2656d...`;
- exact pinned Odoo SHA `1a13ceea...` recorded;
- synthetic secret/TLS preparation;
- Compose render validation without secret leakage;
- exact Odoo and operations image builds.

The run fails at **Initialize database and production addons**. The uploaded PostgreSQL log shows `deploy/postgres/init/10-fares.sh` exiting with `Database password file is not readable` while reading `/run/secrets/odoo_db_password`.

The later edge/database security, recovery fixture, container-replacement persistence, backup-set creation, incomplete-set rejection, clean restore and restored-file/database verification steps were all skipped and are **not proven**.

Artifact `10302037411`, `phase6-deployment-1892455616d7cd59e4706006b794d35df7f8f170`, digest `sha256:22092c659bd7d7ef83ff6d7cff7a83badb57fc7dc71071d9e431881f8e3dfe92`, preserves the RED evidence.

This failure is classified as a Phase 6 deployment secret-access/permissions defect. It is not evidence of an application regression. The earlier Odoo-source-drift hypothesis is superseded by the artifact: the deployment Dockerfile and source-authority evidence already pin exact Odoo SHA `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

See `docs/validation/PHASE_6_DEPLOYMENT_READINESS.md` for the detailed evidence and continuation contract.

## Validation contract

Before Phase 6 repository/CI work can be called verified:
1. deployment package builds from exact Fares SHA and pinned Odoo SHA in hosted CI;
2. seven production addons install successfully in the packaged environment;
3. Odoo starts behind the configured proxy boundary and passes a health/smoke check;
4. PostgreSQL and filestore persistence survive application-container replacement;
5. synthetic backup produces database, filestore and manifest/checksum evidence;
6. restore into a clean target succeeds from that backup set;
7. restored database facts and at least one stored attachment/blob are proven readable after restore;
8. a mismatched/incomplete backup set is rejected by tests;
9. the inherited 149-test application/UAT gate and 8/8 public regression remain authoritative or are rerun if Phase 6 changes application/runtime behavior affecting them;
10. no paid/live resource or real data is used.

The first candidate proves only item 1 through image-build/source-authority scope. Items 2–8 remain unproven because database initialization failed before those steps could execute.

## Documentation outputs

- this phase contract;
- `docs/architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md`;
- deployment/backup/restore operational runbook once implementation exists;
- `docs/validation/PHASE_6_DEPLOYMENT_READINESS.md` for RED/green hosted evidence;
- updated `PROJECT.md`, `docs/README.md` and `docs/operations/DEPLOYMENT_READINESS.md`;
- a durable decision-log entry only when an actual provider/topology/RPO/RTO choice is accepted or when Phase 6 closes.

## Immediate continuation

The next implementation change must stay narrow:
1. verify the current remote branch/HEAD before writing;
2. correct the PostgreSQL init access to `/run/secrets/odoo_db_password` while keeping the password out of source, Compose-rendered evidence and logs;
3. preserve the exact Odoo pin and inherited application source unless new evidence requires a runtime/application change;
4. rerun the workflow on the exact corrected HEAD;
5. only claim the later security/persistence/backup/restore gates if they actually execute and pass.

Do not work around the failure by embedding plaintext credentials in Compose environment output, broadening database privileges, disabling the init/security checks or creating live infrastructure.

## Exit criteria

Phase 6 repository/CI scope is COMPLETE / VERIFIED only when the provider-neutral package and synthetic restore rehearsal are exact-head green and documented. Production deployment remains **NO-GO** after that unless the client separately accepts provider/account/budget, RPO/RTO and retention, paid staging, domain/DNS/secrets, real device/staff/data-cutover/monitoring ownership and explicitly authorizes the next live step.
