# Production domain plan — `faresuniform.uk`

Status: **CUSTOM-DOMAIN TECHNICAL WIRING GREEN; PRODUCTION NO-GO.**

## Accepted architecture

- Public application runtime: Vercel project `fares-uniform`, project id `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`.
- Authoritative DNS and selected edge/proxy direction: Cloudflare.
- Durable managed PostgreSQL: Supabase project `urqlxisivowkmsfisjek`.
- Canonical public hostname: `faresuniform.uk`; `www.faresuniform.uk` permanently redirects to the apex.

Cloudflare is not an application database or an additional Odoo source of truth. Supabase remains the managed PostgreSQL authority, and Vercel remains the application/runtime direction.

## Completed technical wiring evidence

After explicit client authorization on 2026-09-16:

1. The existing Cloudflare zone inventory was reviewed before mutation. It contained 59 records.
2. `faresuniform.uk` and `www.faresuniform.uk` were added to the exact Vercel project/team.
3. Vercel returned project-specific CNAME target `35dfccfeeca04397.vercel-dns-017.com` for both hostnames.
4. Only the existing apex and `www` web records were changed in Cloudflare. Both now use that target in DNS-only mode. Mail, TXT and unrelated records were preserved.
5. Vercel reports **Valid Configuration** for both hostnames and completed TLS certificate issuance.
6. `https://faresuniform.uk/` returns HTTP `200` from Vercel with HSTS.
7. `https://www.faresuniform.uk/` returns HTTP `308` to `https://faresuniform.uk/`.
8. English and Arabic home, catalog and synthetic detail rendering passed on the custom domain with no price or stock fields exposed.

The connected immutable application remains `2a74e93b1828c16839ba7cede336caa4ca374306`. The wiring did not redeploy the application, mutate Supabase/Odoo data, execute ordinary cron, expose broad Odoo routes, use real customer data or authorize production cutover.

## Operating and rollback boundary

- Keep the `vercel.app` hostname available while the custom-domain path remains under observation.
- Do not enable the Cloudflare proxy by inference. A later proxy decision must verify TLS mode, dynamic/API/WebSocket cache bypass, client-IP/header behavior and continued Vercel origin health.
- Before any further apex/`www` change, capture the current two-record state and provider status so it can be restored exactly.
- Do not publish private Odoo/backoffice access through the public hostname.

## Still required for Gate D

- production Vercel plan/commercial-use suitability, region and spending approval;
- named Cloudflare account/zone owner, DNS-change approver and certificate owner roles;
- final Cloudflare DNS-only versus proxied policy;
- private Odoo/backoffice access method and owner;
- production secret custody and rotation;
- remaining GD-03 through GD-09 decisions and evidence;
- accepted release-control boundary for deferred GD-10;
- explicit production launch authorization and final GO.

Technical custom-domain wiring is GREEN. It is not evidence that the current synthetic staging content is production-ready, and it does not authorize real data or customer use.