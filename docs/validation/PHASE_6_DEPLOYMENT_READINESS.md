# Phase 6 deployment-readiness validation

Status: **ACTIVE / RED FIRST CANDIDATE — NOT VERIFIED.**

Branch: `phase-6/deployment-readiness`.

Inherited authoritative application/test SHA: Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## First Phase 6 implementation candidate

Candidate SHA: `1892455616d7cd59e4706006b794d35df7f8f170` (`feat(phase6): add reproducible deployment restore proof`).

This candidate adds the provider-neutral deployment/operations package and CI rehearsal, but it is **RED / NON-AUTHORITATIVE**. It must not replace the Phase 5A application authority.

Hosted workflow: `Phase 6 deployment readiness`, run `34707428136`.

Job: `deployment-restore-proof`, job `103589908228` — **failure**.

Artifact: `10302037411`, name `phase6-deployment-1892455616d7cd59e4706006b794d35df7f8f170`, digest `sha256:22092c659bd7d7ef83ff6d7cff7a83badb57fc7dc71071d9e431881f8e3dfe92`.

## What passed before the failure

The run completed these steps successfully before stopping:
- exact candidate checkout;
- exact-head/source-authority verification;
- synthetic runtime secret/TLS preparation;
- Compose rendering and secret-leak check;
- exact Odoo and operations image builds.

The uploaded source-authority evidence records:
- `fares_sha=1892455616d7cd59e4706006b794d35df7f8f170`;
- `base_application_sha=cc2656d7529cfd4af396ddd0af6444a0f6600dc8`;
- `odoo_sha=1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`;
- `application_source_diff=none` for `addons` and `apps/public-web`.

The deployment image evidence also confirms `wkhtmltopdf 0.12.6.1 (with patched qt)` and `rtlcss 4.3.0`. The runtime evidence records Docker `28.0.4`, Docker Compose `v2.38.2`, PostgreSQL image `postgres:16.12-bookworm`, and nginx image `nginx:1.28-alpine`.

## Exact failure boundary

The failing workflow step is **Initialize database and production addons**.

The uploaded PostgreSQL log shows the init hook reaching `deploy/postgres/init/10-fares.sh` and exiting with:

`Database password file is not readable`

The database container subsequently starts with the initialized cluster, but the Fares application role/database initialization did not complete. Odoo addon installation therefore did not begin successfully.

This is currently classified as a **deployment secret-access/permissions defect in the Phase 6 package**, not an Odoo application regression. The candidate uses a file-backed Compose secret at `/run/secrets/odoo_db_password`; the init hook explicitly requires that path to be readable. The next correction must make the secret readable to the PostgreSQL initialization hook without exposing the secret through rendered Compose output or logs.

The earlier idea that this was Odoo runtime/source drift is superseded by the uploaded run evidence. The deployment Dockerfile already fetches and checks out exact Odoo SHA `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Steps skipped because of the failure

The run did **not** prove any of the following yet:
- edge/database security boundaries;
- synthetic database + filestore recovery fixture;
- persistence across application-container replacement;
- coordinated database + filestore backup-set creation;
- incomplete-set fail-closed behavior;
- clean-volume destruction/restore;
- restored database fact + stored-file verification.

Those steps were skipped after initialization failed and must remain unclaimed until a later exact-head green run executes them.

## Next correction contract

The next session should:
1. re-fetch the live branch and verify no newer work exists;
2. inspect `deploy/postgres/init/10-fares.sh`, `deploy/compose.yml`, the workflow secret-file creation, and the current Compose file-secret ownership/permissions behavior;
3. make the narrowest fix that lets the PostgreSQL init hook read the application DB password while keeping secrets absent from source, rendered Compose evidence and logs;
4. preserve exact Odoo SHA pinning and the inherited Phase 5A application source unchanged unless evidence proves an application change is required;
5. rerun the Phase 6 workflow at the exact corrected HEAD;
6. only after a green run, inspect all security/persistence/backup/restore outputs and record the exact authority/artifact evidence.

Do not mask the failure by broadening database privileges, embedding passwords in environment-rendered evidence, weakening production secret handling, or bypassing the initialization/security checks.

## Production boundary

No production or paid staging resource was created or modified. No domain, DNS, certificate, provider secret, real business data or real-data migration was touched.

Production deployment remains **NO-GO**. A future green Phase 6 repository/CI proof would only make the package ready for provider-specific paid-staging evaluation under separate authorization.
