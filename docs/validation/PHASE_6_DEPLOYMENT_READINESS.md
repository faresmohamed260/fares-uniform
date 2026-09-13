# Phase 6 deployment-readiness validation

Status: **COMPLETE / VERIFIED — PROVIDER-NEUTRAL DEPLOYMENT PACKAGE AND SYNTHETIC RESTORE PROOF GREEN.**

Branch: `phase-6/deployment-readiness`.

Inherited authoritative application/test SHA: Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Authoritative Phase 6 deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c` (`fix(phase6): initialize clean Odoo volume ownership`).

## Exact green hosted proof

Workflow: `Phase 6 deployment readiness`.

Run: `34726690763` — **success**.

Job: `deployment-restore-proof`, job `103641932057` — **success**.

Artifact: `10307809040`, name `phase6-deployment-e337315684c62d69ad75ba56a5867098da17489c`, digest `sha256:4367f4fd3085aa38b6381ef9cca0168bef0951b7e2d63cce67cd5b390fb0ae38`.

The exact-head run completed every required Phase 6 step successfully:
- exact candidate checkout;
- source-authority verification;
- synthetic runtime secret/TLS creation;
- Compose rendering and secret-leak checks;
- exact PostgreSQL, Odoo and operations image builds;
- restrictive file-backed secret-access validation;
- database initialization plus install/upgrade of all seven production addons;
- edge and PostgreSQL security-boundary checks;
- synthetic database + filestore fixture creation;
- persistence across Odoo application-container replacement;
- quiesced PostgreSQL + filestore backup-set creation and verification;
- fail-closed rejection of an intentionally incomplete backup set;
- destructive `down -v` state removal and restore onto clean volumes;
- post-restore Odoo/database/filestore verification;
- final runtime evidence upload and cleanup.

## Source and runtime authority

`phase6-source-authority.txt` records:
- `fares_sha=e337315684c62d69ad75ba56a5867098da17489c`;
- `base_application_sha=cc2656d7529cfd4af396ddd0af6444a0f6600dc8`;
- `odoo_sha=1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`;
- `application_source_diff=none` for `addons` and `apps/public-web`.

Therefore Phase 6 verifies a deployment/operations package around the already-authoritative Phase 5A application. It does not create a newer business-application authority merely because the deployment-package SHA is newer.

Runtime evidence records Docker `28.0.4`, Docker Compose `v2.38.2`, PostgreSQL base `postgres:16.12-bookworm`, exact Fares PostgreSQL/Odoo images at `e337315...`, nginx `1.28-alpine`, and the exact pinned Odoo SHA.

## Secret and security proof

File-backed secret evidence:
- PostgreSQL superuser password file: `0:0:400`;
- Odoo DB password file: `0:10001:440`;
- Odoo admin password file: `0:10001:440`;
- `file_backed_secret_access=PASS`.

The workflow also verified that synthetic credential values are absent from rendered Compose evidence. Synthetic CI credentials are generated at runtime rather than committed as static password-like fixtures.

Edge/database evidence:
- `/web/database/manager` through HTTPS returns `404`;
- HTTP `/web/login` redirects with `301` to HTTPS;
- application role flags are `f|f|f` for `rolsuper|rolcreatedb|rolcreaterole`;
- database owner is `postgres`, not `fares_app`.

The proxy is attached to an externally reachable `edge` network and the isolated `backend`; Odoo and PostgreSQL remain backend-only.

## Persistence, backup and restore proof

The synthetic fixture was created through Odoo and stored in the filestore:
- seed marker: `PHASE6_SEED_OK`;
- attachment ID `520`;
- store path `a8/a84a3bb18ac388b899df99e8af3f2991c898f2a2`.

After forced application-container replacement, the same fixture returned `PHASE6_RESTORE_OK` with the same attachment/store path, proving application-container lifecycle independence.

Backup set `20260913T000159Z-e337315684c6` was created while Odoo was quiesced. Verification reported:
- `database.dump: OK`;
- `filestore.tar.gz: OK`;
- `manifest.json: OK`.

An intentionally incomplete copy with the filestore removed was rejected, recorded as `incomplete_backup_rejected=true`.

The workflow then destroyed named state volumes, recreated a clean database, verified the backup again, restored the database and filestore, initialized the fresh Odoo data-volume ownership for fixed non-root UID/GID `10001:10001`, and started Odoo/proxy successfully.

Post-restore evidence returned `PHASE6_RESTORE_OK` for the same attachment and `phase6_restore_proof=PASS`.

Final runtime state showed PostgreSQL, Odoo and nginx all healthy. The proxy published `18080:80` and `18443:443` on the disposable runner; database and Odoo remained unexposed directly.

## RED-to-green chronology

The failed candidates are retained as evidence and must not be rewritten as passing history:

1. `1892455616d7cd59e4706006b794d35df7f8f170`, run `34707428136`: PostgreSQL init could not read `/run/secrets/odoo_db_password`.
2. `8b0d1ed2fdbab21700caa2a8ace538743fa2b3ac`, run `34716292412`: the secret boundary was corrected, then PostgreSQL image validation used a login shell whose PATH did not expose the expected binary.
3. `8e08c265f3eb6b0d402d805b665b73b3458eb1f1`, run `34716792469`: PostgreSQL/Odoo initialization passed, then proxy health falsely failed because `/web/login` redirected to the intentionally blocked database-selector route.
4. `54f9e3fda7c8004925a5513e80d4112ed3636ad9`, run `34717634684` plus deterministic rerun job `103620929483`: dedicated proxy liveness passed, then edge security failed because nginx was attached only to an `internal: true` Docker network, leaving declared published ports unreachable from the host.
5. `2a09ead9d590d41c7c9301665b8ce06b64874a36`, run `34721100864`, job `103626986992`: edge/database security passed, then recovery fixture seeding failed because an Odoo shell inherited production `workers=2`; pinned Odoo 19 PreforkServer attempted to bind the already-used HTTP port before executing stdin.
6. `0854f96748d2abe91576ca18716ccfea7d2bf8dc`, run `34721615433`, job `103628442684`: one-off recovery shells used `--workers=0`; seed, replacement persistence and backup/fail-closed checks passed; clean restore then failed when least-privileged `fares_app` replayed `COMMENT ON EXTENSION pg_trgm` owned by `postgres`.
7. `1353d7656dbb98907b0b5ab0a60681c4053fd316`, run `34721930701`, job `103629305558`: restore skipped comments and completed, but the freshly recreated Odoo named-volume root was root-owned, so non-root Odoo could not create `/var/lib/odoo/sessions` and became unhealthy.
8. `e337315684c62d69ad75ba56a5867098da17489c`, run `34726690763`, job `103641932057`: the privileged operations restore boundary initializes the clean Odoo volume as fixed UID/GID `10001:10001`, preserves numeric filestore ownership and validates ownership before startup. **All Phase 6 gates GREEN.**

No security assertion was weakened to obtain the green result: secrets remain file-backed/restrictive, PostgreSQL extension/database ownership remains with `postgres`, the application role remains least privilege, Odoo remains non-root, database-management routes remain blocked, and clean restore still fails closed on invalid/incomplete backup state.

## Phase 6 conclusion

The provider-neutral repository/CI deployment package and synthetic recovery rehearsal are **VERIFIED** at deployment-package SHA `e337315684c62d69ad75ba56a5867098da17489c`.

This closes the Phase 6 repository/CI scope. It means the package is ready for provider-specific paid-staging evaluation after operator choices and explicit authorization. It does **not** mean production is deployed or production-ready in the operational sense.

## Production boundary

No production or paid staging resource was created or modified. No provider account, domain, DNS record, production certificate, live secret, real business data or real-data migration was touched.

Production remains **NO-GO** until the client/operator explicitly resolves and authorizes the remaining provider/region/budget, backup retention/RPO/RTO, paid staging, domain/DNS/TLS/access, real device, named staff/training, cutover/data, monitoring/alert ownership and launch decisions recorded in `docs/operations/DEPLOYMENT_READINESS.md`.