# Platform reuse and UI direction

Status: Initial assessment, 2026-09-06. Client broadly agrees with MVP scope but requests evaluation of Odoo/reuse before choosing implementation. No platform selected.

## Initial recommendation

Evaluate Odoo Community as a reusable operational core before building custom ERP logic. Consider retained/customized native POS plus a bespoke public website. A fully custom frontend over Odoo remains possible but can recreate substantial POS, permission and offline work. Do not assume backend reuse provides frontend offline behavior.

## Evidence and limitations

- [Odoo documentation](https://www.odoo.com/documentation/19.0/) covers integrated business apps; exact Community/Enterprise coverage must be audited against our scenarios.
- [POS](https://www.odoo.com/documentation/19.0/applications/sales/point_of_sale.html) is browser-based with offline capability. Our restart/sync/partial-collection behavior is not yet tested.
- [Licenses](https://www.odoo.com/documentation/19.0/legal/licenses.html): Community uses LGPLv3; Enterprise is separately licensed. Review each adopted addon; do not publish proprietary Enterprise/third-party code in the public repo.
- [Odoo Online](https://www.odoo.com/documentation/19.0/administration/odoo_online.html) does not support custom modules. [Odoo.sh](https://www.odoo.com/documentation/19.0/administration/odoo_sh/getting_started/create.html) supports GitHub custom modules.
- [Source installation](https://www.odoo.com/documentation/19.0/administration/on_premise/source.html) requires an Odoo server and PostgreSQL. Architectural inference: Odoo needs dedicated compatible hosting; Vercel can remain the separate public frontend host, not the assumed Odoo runtime.
- [Pricing](https://www.odoo.com/pricing) and edition-specific API/module rights must be checked before selection. No prices or free-hosting guarantee are asserted.

Assessment used official search results; several full-page fetches timed out. No live product trial, edition audit or hosting validation completed.

## Candidate approaches

| Approach | Reuse benefit | Tradeoff |
| --- | --- | --- |
| Odoo native apps/POS plus custom public website | Preserves business and POS mechanics | Internal visual freedom constrained by Odoo architecture |
| Odoo backend plus completely bespoke frontend | Retains backend business logic | Rebuilds much UI, integration and offline behavior |
| Fully custom application | Maximum workflow and visual control | Most implementation and maintenance responsibility |

Investigate our size-specific batching/deadline tasks, full-balance-before-partial-collection rule, InstaPay manual recording, finished-only inventory, Arabic/English printing and permissions. Classify each as standard, configuration, addon or custom development, with evidence and cost implications.

If Odoo is chosen, prefer upstream version pinning plus repository-owned addons and deployment configuration over a large fork. Keep one authoritative operational data owner; do not duplicate inventory/payments in Supabase merely because it is available. Existing resources remain untouched.

## Client UI requirement

The client wants premium modern UI/UX, including physics-based and morphing effects inspired by polished GPT/Claude-built websites. This applies to web components generally, not only the landing page.

Developer design direction: deliberate typography, spacing, responsive composition, spring motion and shared-element/morphing transitions. Richer interactive storytelling can suit public catalog pages; internal screens should retain premium styling and useful motion while preserving fast repetitive checkout, stable input targets and readable data. Honor reduced motion, keyboard use, Arabic RTL and performance.

No component library has been selected. Evaluate maintained components compatible with the chosen frontend; React components cannot be assumed directly compatible with Odoo's frontend. Document sources, licenses and design tokens. Review representative public catalog, POS and order screens before broad implementation, with rendered responsive evidence.

## Next step

Produce a requirement-by-requirement platform fit assessment and UI prototypes/design checkpoints under a bounded phase contract. Platform choice and hosting implications precede application implementation. Reference websites/screenshots from the client can sharpen visual direction but are not required to continue evaluation.
