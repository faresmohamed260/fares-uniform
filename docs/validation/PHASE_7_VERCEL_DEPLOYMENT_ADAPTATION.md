# Phase 7 Vercel deployment-adaptation validation

Status: **ACTIVE / FIRST STATELESS-RUNTIME CANDIDATE PENDING HOSTED PROOF.**

Branch: `phase-7/vercel-deployment-adaptation`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited provider-neutral deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## First implementation slice

The first Phase 7 candidate is intentionally narrow. It does not claim full Vercel readiness yet. It proves the two durable-state assumptions that must change before Vercel can replace a volume-backed Odoo runtime:

1. Odoo binary attachments use native database storage (`ir_attachment.location = db`) instead of a local filestore.
2. Odoo HTTP sessions use a deployment-only PostgreSQL session store rather than `data_dir/sessions`.

The candidate also builds a Vercel-style `Dockerfile.vercel` runtime with:
- exact Odoo pinning;
- the same seven production addons as Phase 6;
- no declared Docker volume;
- fixed non-root runtime UID/GID `10001:10001`;
- disposable local `data_dir` under `/tmp`;
- `workers = 0` and built-in Odoo cron threads disabled for the Vercel proof;
- runtime HTTP port derived from `PORT`;
- configurable PostgreSQL SSL mode for managed-database compatibility.

## Hosted proof contract for this slice

Workflow `Phase 7 Vercel adaptation` must:
- verify no `addons` or `apps/public-web` source drift from Phase 5A;
- build exact PostgreSQL and Vercel-target Odoo images;
- prove the Odoo image declares no persistent volume;
- initialize and upgrade the seven production addons;
- prove the app database role remains non-superuser/non-createdb/non-createrole and database ownership stays outside the app role;
- configure database-backed attachments and create a synthetic binary attachment;
- authenticate through the real `/web/session/authenticate` route and persist the resulting Odoo session in PostgreSQL;
- destroy the Odoo container with no mounts and start a replacement instance;
- prove the same session cookie remains authenticated through `/web/session/get_session_info`;
- prove the binary attachment remains readable after runtime replacement;
- create a database-only logical backup, recreate the application database cleanly and restore it;
- prove the same database marker, binary attachment and authenticated session survive the database-only restore.

No session cookie, synthetic password, database dump or plaintext secret may be retained in the uploaded evidence artifact.

## Still pending after this slice

Even if the first candidate is green, Phase 7 remains open until later evidence proves:
- Vercel-triggered cron/background execution with authentication, locking/idempotency and no immortal worker assumption;
- Odoo bus/WebSocket reconnect behavior across runtime lifecycle interruption;
- final Vercel service/project configuration syntax and routing/security boundary;
- inherited regression gates required by any runtime changes;
- commercial staging remains separately authorized before real resource/account mutation.

## Production boundary

No Vercel plan upgrade, Fares Vercel project, managed production database, production secret, domain/DNS change, real business data or production deployment is authorized by this hosted proof. Production remains **NO-GO**.