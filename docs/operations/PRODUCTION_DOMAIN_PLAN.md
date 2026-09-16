# Production domain plan — `faresuniform.uk`

Status: **DOMAIN/PLATFORM SELECTED; DNS-TO-VERCEL WIRING NOT AUTHORIZED OR COMPLETE; PRODUCTION NO-GO.**

## Accepted architecture

- Public application runtime: Vercel project `fares-uniform`.
- Authoritative DNS and selected edge/proxy direction: Cloudflare.
- Durable managed PostgreSQL: Supabase project `urqlxisivowkmsfisjek`.
- Public domain: `faresuniform.uk`.

Cloudflare is not a replacement application database or an additional Odoo source of truth. Supabase remains the managed PostgreSQL authority, and Vercel remains the application/runtime direction.

## Read-only domain evidence

Observed on 2026-09-16 without provider mutation:

- authoritative nameservers: `grant.ns.cloudflare.com` and `paris.ns.cloudflare.com`;
- apex A/AAAA responses were Cloudflare anycast addresses, indicating the web record is proxied through Cloudflare;
- HTTPS `HEAD /` returned Cloudflare HTTP `530` with `Server: cloudflare`;
- existing non-web DNS includes mail/TXT records that must be preserved during any later change.

The public TXT/MX values are intentionally not copied into source. The `530` response means the selected domain is not yet serving the accepted Vercel application and cannot be considered production-ready.

## Guarded wiring sequence

Do not execute these steps without explicit domain/cutover authorization and exact provider access:

1. Capture a fresh Cloudflare DNS inventory and rollback record, including apex, `www`, mail and verification records, without printing sensitive values.
2. Add `faresuniform.uk` and the chosen `www` behavior to the exact Vercel project/team.
3. Use current Vercel domain inspection to obtain the project-specific verification and DNS records. Do not blindly hardcode generic A/CNAME targets.
4. Apply only the minimum required Cloudflare web-record changes while preserving mail/TXT and unrelated records.
5. Use DNS-only mode for initial ownership/origin verification unless current Vercel inspection and the accepted Cloudflare design explicitly support proxying at that step.
6. Wait for Vercel domain verification and TLS certificate issuance; verify apex/`www` redirect policy.
7. Run exact EN/AR catalog/detail/enquiry, no-price/no-stock, broad-Odoo-exposure, authenticated cron, WebSocket and runtime-error checks against the custom domain.
8. If Cloudflare proxying is enabled, verify TLS mode, cache bypass for dynamic/API/WebSocket routes, client IP/header behavior and that Vercel origin verification remains healthy.
9. Retain the existing `vercel.app` staging hostname until custom-domain rollback and observation complete.
10. Record exact DNS/Vercel identities, hosted evidence and rollback results before any production GO.

## Still required

- production Vercel plan/commercial-use suitability and spending approval;
- Cloudflare account/zone owner role and DNS-change approver;
- final apex versus `www` canonical choice;
- final Cloudflare proxied versus DNS-only policy;
- private Odoo/backoffice access method;
- production secret custody;
- explicit DNS mutation and cutover authorization;
- post-wiring GREEN evidence and final production GO.

No DNS, Cloudflare, Vercel-domain, certificate or Supabase setting was changed while creating this plan.
