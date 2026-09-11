# Phase 4A validation — public catalog and enquiry

Status: **ACTIVE — NOT YET VERIFIED.**

Branch: `phase-4a/public-catalog-enquiry`.

Starting Phase 3B documentation lineage: `cb42c8017629d8d5011df82bf6033b91a25f91ac`.

Inherited Phase 3B application authority: `d6efa76a99c0732423b354d2d9f787f6ccbdebec`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Validation ownership

This document owns:
- Phase 4A red/green chronology;
- exact Odoo/public-web implementation SHAs;
- combined Phase 1–4A Odoo test evidence;
- repeatable six-addon upgrade evidence;
- Next.js type/build/browser evidence;
- EN/AR/RTL desktop+narrow rendered evidence;
- public no-price/no-stock/private-data assertions;
- later documentation-only closure lineage.

No Phase 4A implementation is authoritative until an exact application SHA satisfies both the Odoo and web gates below.

## Required Odoo gate

Combined addon set:
`fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api`.

Required assertions:
1. publication defaults false;
2. only Owner/Admin can mutate Fares public publication metadata;
3. published record validation requires safe public fields;
4. public catalog list/detail serializes only the exact allowlist;
5. price, cost, stock, location, customer, payment and staff fields are absent from serializer results;
6. unpublished/missing slugs fail closed without private-record enumeration;
7. image route never exposes an unpublished/private record;
8. public enquiry input uses a strict key/type/length allowlist;
9. enquiry requires organization/contact context and at least phone or email;
10. source product, when supplied, must be currently published;
11. exact idempotent retry creates one intake record;
12. same key with different data fails closed;
13. successful enquiry creates no sale, payment or stock effects;
14. public enquiry records remain append-only and are readable only by authorized staff roles;
15. all inherited Phase 1–3B regressions remain green;
16. repeatable six-addon upgrade succeeds on the same exact application SHA.

## Required public-web gate

Application root: `apps/public-web`.

Required hosted steps:
1. clean install from committed lockfile;
2. TypeScript check;
3. production Next.js build;
4. browser tests in explicit fixture mode;
5. English LTR landing/catalog/detail/enquiry desktop+narrow;
6. Arabic RTL landing/catalog/detail/enquiry desktop+narrow;
7. keyboard focus/navigation on primary controls and form;
8. reduced-motion layout/interaction still usable;
9. no document-level horizontal overflow;
10. catalog data and rendered pages contain no price/stock/availability/internal ERP controls;
11. enquiry client validates required values and handles accepted/error responses;
12. contact phone/WhatsApp actions are absent when runtime values are unset and present only when explicitly configured;
13. representative screenshots/logs retained as exact-head evidence.

## Red-to-green chronology

### Contract

`ec01f782166805dd5dfdcb40b5fc4245b32ec7f0` — `docs(phase4a): define public catalog and enquiry contract`.

### Architecture

`ef7f483706318afb0e525140965b6c3994cb0f90` — `docs(phase4a): record public integration architecture`.

### Application implementation

Pending.

## Closure rule

Phase 4A remains active until one exact implementation SHA passes the complete Odoo and public-web gate, retained evidence is reviewed, and later closure documentation records that application SHA without treating docs-only commits as newer application proof.
