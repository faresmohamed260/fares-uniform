# Phase 6 — Deployment architecture and readiness proof

Status: **COMPLETE / VERIFIED, 2026-09-13. PROVIDER-NEUTRAL PACKAGE AND SYNTHETIC RESTORE PROOF GREEN.**

Branch: `phase-6/deployment-readiness`.

Starting documentation lineage: `83c10179bb4c4ae6424fb3ff1d76b2cae5bd5234`.

Inherited authoritative Phase 5A application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Verified Phase 6 deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c`.

Authorization remains bounded: Phase 6 covered provider-neutral deployment packaging, hosted CI and synthetic recovery rehearsal only. It did not authorize production deployment, paid-resource creation, provider/account mutation, domains/DNS, live certificates/secrets, real business data or real-data migration.

## Goal — achieved

Phase 6 turned the verified Phase 5A release candidate into a reproducible provider-neutral deployment package and proved its persistence, security, backup and clean-restore mechanics in hosted CI without creating live infrastructure.

The exact green proof is workflow `Phase 6 deployment readiness`, run `34726690763`, job `103641932057`, at deployment-package SHA `e337315684c62d69ad75ba56a5867098da17489c`.

Artifact `10307809040`, `phase6-deployment-e337315684c62d69ad75ba56a5867098da17489c`, digest `sha256:4367f4fd3085aa38b6381ef9cca0168bef0951b7e2d63cce67cd5b390fb0ae38`, contains the final evidence.

## Completed repository/CI scope

The verified package now provides:
1. exact Fares/Odoo image provenance with Odoo pinned to `1a13ceea...`;
2. PostgreSQL 16, Odoo 19 and nginx Compose packaging;
3. fixed-database targeting/filtering, `list_db=False`, reverse-proxy mode and production multiprocess configuration;
4. HTTPS edge behavior and blocked `/web/database` routes;
5. least-privileged application DB role with `postgres` retaining database/extension ownership;
6. restrictive file-backed runtime secrets without plaintext credentials in source/rendered Compose evidence;
7. separate persistent PostgreSQL and Odoo-data volumes;
8. fixed non-root Odoo runtime UID/GID `10001:10001`;
9. a privileged operations-only restore boundary that initializes fresh Odoo-volume ownership while keeping Odoo itself non-root;
10. coordinated quiesced PostgreSQL + filestore backup sets with manifest/checksums;
11. fail-closed backup verification and incomplete-set rejection;
12. clean-target restore that preserves numeric filestore ownership;
13. synthetic hosted proof of application-container replacement persistence and destructive `down -v` recovery;
14. S3-compatible upload tooling/configuration without selecting or creating an object-store resource.

No application feature source changed in Phase 6. Final source-authority evidence records `application_source_diff=none` for `addons` and `apps/public-web` relative to Phase 5A `cc2656d...`.

## Architecture status

The provider-neutral recommendation remains:
- one small x86-64 EU Linux VPS initially hosting private Odoo + PostgreSQL + persistent filestore;
- reverse proxy/TLS in front of Odoo;
- coordinated database+filestore backup sets copied off-host to S3-compatible object storage;
- provider-native VM backup/snapshot as a secondary layer only;
- public Next.js remains separately deployable to Vercel through the narrow Fares public API contract;
- production and staging remain separate state/security boundaries.

Dated 2026-09-12 research still puts Hetzner Cloud first on cost/value, DigitalOcean as the principal simpler/more-expensive VPS alternative, and Render as a materially more expensive split-state alternative. **No provider, region, server size, budget or live resource has been accepted by the client.**

## Data and recovery rules — verified mechanically

The database and filestore remain one recoverable application state. The hosted proof verified:
- a common backup-set identifier and timestamp;
- application SHA, Odoo SHA, database name and checksums in the manifest;
- Odoo quiescence during coordinated capture;
- checksum/manifest validation before restore;
- rejection when a required filestore component is removed;
- database + filestore restore onto freshly recreated volumes;
- restored database marker and stored attachment bytes through Odoo after recovery.

Final backup set: `20260913T000159Z-e337315684c6`.

Production backup frequency, retention and RPO/RTO remain **UNDECIDED**. Phase 6 proves mechanics, not production policy.

## Security boundary — verified

Final evidence proves:
- PostgreSQL superuser secret mode `0400`, root-owned;
- Odoo DB/admin secret mode `0440`, readable by fixed group `10001` only as designed;
- app role flags `f|f|f` for superuser/createdb/createrole;
- database owner `postgres`;
- HTTPS database-manager route returns `404`;
- HTTP login route redirects `301` to HTTPS;
- nginx is on external `edge` plus isolated `backend` networks;
- Odoo and PostgreSQL stay backend-only;
- restored Odoo data remains owned by fixed non-root runtime identity `10001:10001`.

The fixes retained least privilege instead of granting `fares_app` database/extension ownership or making production Odoo run as root.

## Validation history

Phase 6 intentionally preserved its RED chronology. The sequence was:
- unreadable file-backed DB secret;
- PostgreSQL login-shell validation PATH mismatch;
- proxy healthcheck following an application redirect into a deliberately blocked route;
- host edge ports unavailable because nginx was attached only to an internal network;
- one-off Odoo shell inheriting prefork workers and binding the already-used HTTP port;
- least-privileged restore replaying extension comments owned by `postgres`;
- clean named-volume root ownership preventing non-root Odoo from creating runtime directories;
- final exact-head green at `e337315...`.

Detailed SHAs/run IDs and evidence are in `docs/validation/PHASE_6_DEPLOYMENT_READINESS.md`.

## Exit criteria

- [x] deployment package builds from exact Fares SHA and pinned Odoo SHA in hosted CI;
- [x] seven production addons install/upgrade successfully in the packaged environment;
- [x] Odoo starts behind the proxy and passes health/security checks;
- [x] PostgreSQL and filestore persist across application-container replacement;
- [x] coordinated synthetic database + filestore backup set is created and verified;
- [x] incomplete backup set is rejected;
- [x] destructive clean-volume restore succeeds;
- [x] restored database fact and stored attachment are verified through Odoo;
- [x] Phase 5A application source remains unchanged and authoritative;
- [x] no paid/live resource or real data is used.

**Phase 6 repository/CI scope is COMPLETE / VERIFIED.**

## Production boundary and next stage

Production remains **NO-GO**. A green Phase 6 package means only that the repository package is ready for provider-specific paid-staging evaluation after explicit client/operator choices.

Before any live mutation, the client/operator must explicitly accept or change:
- hosting provider and region;
- initial server size and budget ceiling;
- provider-native backup layer;
- off-host object-store ownership;
- backup frequency/retention and RPO/RTO;
- paid staging strategy;
- domain/DNS/TLS/internal-access model;
- secret ownership/rotation;
- actual store browser/scanner/printer compatibility;
- named staff, role/location assignments, training and escalation ownership;
- opening-data/cutover procedure;
- monitoring/logging/alerts;
- launch timing.

Provider-specific staging, account/resource creation, live secrets, real data and production cutover require separate explicit authorization.