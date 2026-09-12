# Phase 6 deployment architecture

Status: **ACTIVE RECOMMENDATION / PROVIDER NOT SELECTED, 2026-09-12.**

Inherited application authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

This document turns the deployment-readiness checklist into a concrete technical recommendation. It is not authorization to buy or create infrastructure.

## Constraints from the accepted system

- Fares is a small business; numeric production load and launch date remain unknown.
- Odoo Community is the private operational/domain authority.
- The seven production addons are `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.
- The public site is a separate Next.js surface and remains Vercel-targeted.
- Odoo state is not only PostgreSQL: the matching Odoo filestore is part of recoverable state.
- The public browser must never receive broad Odoo/database credentials.
- One store/device is currently confirmed, and offline checkout already has an application-level design.
- Production hosting, budget, RPO/RTO, retention, domains, secrets and real cutover ownership are not accepted yet.

## Recommended initial topology

Pending client approval, use a **single x86-64 Linux VPS in an EU region for the private Odoo runtime**, with:

1. reverse proxy / TLS termination;
2. Odoo 19 application container built from the pinned upstream Odoo SHA plus this repository's seven production addons;
3. PostgreSQL 16 on the same private host for the initial small-business scale;
4. persistent database and Odoo filestore volumes independent of the Odoo application image/container lifecycle;
5. scheduled consistent backup sets copied off-host to an S3-compatible object store;
6. provider-native VM backup/snapshot enabled only as a secondary recovery layer;
7. firewall exposing only required ingress; database port is not public;
8. public Next.js hosted separately on Vercel and using only the existing narrow Fares public API boundary;
9. production and staging kept as separate databases/filestores/secrets and, before launch, preferably separate server instances.

This minimizes moving parts and cost while preserving a migration path: PostgreSQL can later move to a managed database or separate host without changing the Fares domain model, and Odoo can be vertically resized before horizontal complexity is introduced.

## Why one VPS first

A split managed architecture can reduce some database operations work, but it does not remove the Odoo filestore problem. The application still needs durable filesystem storage and a coordinated restore story across database + filestore. At the confirmed current scale, paying for a managed application service, managed database and persistent disk creates more cost and more cross-service recovery coordination before there is evidence that the extra isolation is needed.

The one-VPS design is acceptable only with:
- off-host backups;
- a rehearsed clean-host restore;
- infrastructure reproducibility from the repository;
- monitoring and alert ownership;
- a documented replacement-host procedure.

The VPS itself is therefore replaceable compute, not the only copy of business state.

## Dated provider comparison

Pricing below is a planning snapshot from official provider pages checked on **2026-09-12** and must be rechecked before purchase. Taxes, IPv4 and optional add-ons may change totals.

### Hetzner Cloud — current leading recommendation

Official June 2026 pricing for Germany/Finland lists:
- CPX22: 2 vCPU, 4 GB RAM, 80 GB NVMe; **EUR 19.49 / USD 22.99 per month** excluding IPv4/VAT as applicable;
- CPX32: 4 vCPU, 8 GB RAM, 160 GB NVMe; **EUR 35.49 / USD 41.99 per month** excluding IPv4/VAT as applicable.

Hetzner's EU cloud instances include large traffic allowances; provider backups are seven rolling server-disk backup slots and cost 20% of the server price. Hetzner documents that backups/snapshots copy the server disk but do not include attached Volumes, which is one reason provider snapshots must not replace application-aware database+filestore backups.

Planning fit:
- **CPX22** is the minimum sensible small staging / low-load candidate.
- **CPX32** is the preferred initial production sizing candidate because Odoo multiprocess workers, PostgreSQL, reverse proxy and backup jobs share memory. This is a sizing recommendation, not a purchase decision.
- Germany is the preferred region candidate for Egypt/EU-facing use unless measured latency or business/legal requirements support another region.

Sources checked:
- https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/
- https://docs.hetzner.com/cloud/billing/faq/
- https://docs.hetzner.com/cloud/servers/backups-snapshots/overview/

### DigitalOcean — strong simpler alternative

Current Basic Droplet pricing lists:
- 2 vCPU / 4 GB / 80 GB at **USD 24/month**;
- 4 vCPU / 8 GB / 160 GB at **USD 48/month**.

Managed PostgreSQL starts around **USD 15/month** for 1 GB / 1 vCPU, but using it still leaves Odoo filestore persistence and cross-system restore coordination to solve. A single Droplet therefore remains the simpler comparable topology, while managed PostgreSQL is an optional later migration when the operating budget justifies it.

Planning fit:
- slightly more expensive than Hetzner at comparable VM sizes;
- broad documentation and managed-database path can reduce future operations work;
- good fallback if Hetzner account/region/support constraints are unacceptable.

Sources checked:
- https://www.digitalocean.com/pricing/droplets
- https://www.digitalocean.com/pricing/managed-databases

### Render — not preferred for initial Odoo production

Current pricing lists a 1 CPU / 2 GB web service at **USD 25/month**, a 1 CPU / 2 GB PostgreSQL instance at **USD 40/month**, and persistent disks at **USD 0.25/GB-month**. Paid PostgreSQL includes point-in-time recovery, and persistent disks have daily snapshots, but Odoo still spans database + filestore and a disk-backed service becomes another separately restored state component.

Planning fit:
- operationally convenient in some respects;
- substantially higher baseline cost for this workload;
- split recovery surfaces add complexity for a small initial deployment;
- therefore not recommended unless the client values managed-service convenience over the cost difference.

Sources checked:
- https://render.com/pricing
- https://render.com/docs/disks
- https://render.com/docs/postgresql-backups

## Off-host backup target recommendation

Cloudflare R2 is already an available service family for the project and is the preferred object-store candidate **pending bucket/credential approval**.

Current Standard storage pricing checked 2026-09-12 is **USD 0.015/GB-month**, with no egress charge; request charges still apply. The deployment package must stay S3-compatible so R2 can be replaced without changing the backup format.

Source checked:
- https://developers.cloudflare.com/r2/pricing/

## Odoo production configuration baseline

Odoo 19 official deployment guidance requires or strongly recommends the following for an internet-facing production setup, and Phase 6 templates must implement them without embedding secrets:

- HTTPS termination at a reverse proxy;
- `proxy_mode = True` only when behind that proxy;
- a fixed database selection using `db_name`/`dbfilter`;
- `list_db = False` / `--no-database-list` after the single environment database is configured;
- blocking database-manager routes at the proxy;
- a PostgreSQL application user that is not a superuser and does not have broad database-creation authority;
- multiprocess workers for production Linux deployments, with worker count and memory limits sized to actual resources;
- websocket routing through the proxy when multiprocess mode requires the gevent endpoint.

Source checked:
- https://www.odoo.com/documentation/19.0/administration/on_premise/deploy.html

## Proposed runtime layout

Repository deployment assets should converge on a layout equivalent to:

```text
Internet / private operators
        |
   HTTPS reverse proxy
        |
   +----+--------------------------+
   |                               |
Internal Odoo UI            narrow public API
   |                               |
   +----------- Odoo 19 -----------+
                  |
             PostgreSQL 16
                  |
      persistent DB data volume

Odoo persistent filestore volume
                  |
      consistent backup-set job
           /                \
   pg_dump/archive      filestore archive
           \                /
          manifest + checksums
                  |
      S3-compatible off-host storage
```

The public Next.js app remains a separate Vercel deployment and must not share the private database or filesystem.

## Backup consistency model

For the simple single-node topology, the preferred first implementation is a short quiesced application capture:
1. stop or pause Odoo application workers so no new Odoo writes occur;
2. create a PostgreSQL logical backup using the PostgreSQL client tools;
3. archive the matching Odoo filestore;
4. write a manifest containing backup-set ID, Fares SHA, pinned Odoo SHA, database name, timestamps and checksums;
5. restart Odoo;
6. upload the completed set off-host;
7. verify remote object presence/checksums.

This favors correctness over zero-downtime complexity for the initial small-business deployment. The exact maintenance window, backup frequency, retention, production RPO and production RTO remain proposals until explicitly accepted.

## Restore model

A restore must be rehearsable onto an empty host/environment:
1. verify the manifest and all checksums;
2. confirm expected Fares/Odoo version metadata;
3. initialize a clean PostgreSQL target and clean filestore target;
4. restore the database;
5. restore the matching filestore;
6. start the exact application image/SHA;
7. run database/module health checks plus a stored-attachment read test;
8. only then expose the restored service.

Provider snapshots may accelerate full-host recovery but do not replace this proof.

## Secrets and network model

No secrets belong in Git-tracked `.env` files. Templates may declare variable names only.

Expected runtime secret classes:
- PostgreSQL application password;
- Odoo master/admin database-management secret even though manager routes are disabled;
- public API server-side credential if required by the existing contract;
- object-store access key/secret;
- proxy/DNS provider credentials only when automation is explicitly approved.

The PostgreSQL port stays private. The reverse proxy is the only normal internet ingress. Exact domain names, Cloudflare proxy/Access policy, TLS ownership and Vercel environment values remain undecided.

## Environment separation

At minimum:
- **CI proof:** ephemeral synthetic state only; no paid infrastructure required.
- **Staging:** separate database, filestore, secrets and public integration endpoints; paid creation requires explicit approval.
- **Production:** separate state/secrets and real data; creation/cutover requires explicit deployment authorization.

Production backups must never be restored over staging in a way that exposes private customer/business data to broader users without an explicit sanitized-data procedure.

## Decision still required from client/operator

Before any provider resource is created, explicitly accept or change:
- hosting provider and region;
- initial server size / monthly budget ceiling;
- whether provider-native backups are enabled as the secondary layer;
- S3-compatible backup provider/bucket ownership;
- backup frequency and retention;
- RPO/RTO targets;
- paid staging lifetime/strategy;
- domain/DNS/TLS and internal-access model;
- secret owners;
- monitoring/alert owner;
- real device, staff and cutover plan.

Until those choices are accepted, this document is a technical recommendation and production remains **NO-GO**.
