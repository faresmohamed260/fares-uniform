# Public site showcase and historical-work requirements

Status: **CLIENT-AUTHORIZED PUBLIC-SITE CONTENT/DESIGN REQUIREMENT, 2026-09-17.**

Owner documents:
- [Public site redesign governance](PUBLIC_SITE_REDESIGN_GOVERNANCE.md)
- [Public site research and reference matrix](PUBLIC_SITE_RESEARCH_AND_REFERENCE_MATRIX.md)

This document adds a first-class requirement to the public-site redesign: Fares Uniform must present real work delivered for different clients and organizations over the years, with enough verified context to show the relationship between the organization, its operational needs, the uniform program, and the resulting garments.

This is a public marketing/content requirement. It does not authorize exposing private Odoo CRM, customer, sales, payment, stock, employee, contact or contract data. It does not authorize publishing a real client name, logo, photograph, testimonial, project detail or commercial claim until that public use is explicitly approved and its source/rights are known.

## 1. Purpose

The showcase should answer a prospective organization's practical questions:

- Has Fares Uniform solved a need similar to ours before?
- What kinds of organizations and staff roles has Fares worked with?
- How does one client's identity become a coordinated set of garments rather than a single generic item?
- What design, fabric, branding, fit and role-specific choices were made?
- What does the finished work actually look like up close?
- Can Fares move from brief to sample to a coherent delivered program?

The showcase is evidence of design/manufacturing capability, not a logo wall.

## 2. Public information model

### Organization / client profile

For every publishable organization, maintain a source-backed public dossier with only approved facts:

- public organization name;
- approved logo/brand mark and usage source or permission state;
- sector, e.g. school, hospitality, restaurant/cafe, hospital/medical, corporate, retail or other;
- city/country when appropriate and publicly verifiable;
- official website/public profile URL;
- short factual description of what the organization does;
- relationship year or year range only when verified and approved;
- project/program scope that Fares actually supplied;
- wearer roles or departments covered, when approved;
- public brand constraints or identity cues relevant to the design;
- source URLs and last-verification date for externally researched facts;
- publication approval state.

Do not infer a business relationship merely because a logo, garment or name appears in old files. Fares must confirm the relationship before the site presents it as historical work.

### Showcase / project record

Each client project should support:

- project title and organization;
- year or period, if approved;
- concise brief/problem statement;
- staff roles / intended use;
- product/garment set;
- visual identity and functional constraints;
- design/sample/refinement story where known;
- material, trim, embroidery/print and construction notes only when verified;
- approved manufacturing/delivery/process narrative;
- links to individual garment views;
- approved photography/media;
- public outcome/proof only when it can be sourced and published truthfully;
- enquiry CTA that carries the project/program context forward.

Do not invent project volume, order value, delivery speed, satisfaction scores, testimonials, awards, certifications, outcomes or commercial terms.

### Media record

Every real showcase asset should track:

- source/original file;
- real historical photo vs newly photographed product vs synthetic concept;
- client/project/product association;
- rights/permission state;
- photographer/source credit if required;
- original and delivery dimensions;
- intended crop/aspect roles;
- English and Arabic alt/caption copy;
- retouch/background-removal state;
- publication approval state.

Synthetic design concepts must never be presented as documentary evidence of a historical Fares project.

## 3. Information architecture

The redesign should explore a coherent public hierarchy such as:

- `/work` or `/clients` — historical work archive with year/sector/program discovery;
- `/work/[slug]` — organization/project case-study story;
- `/showcase/[slug]` — immersive garment/program showcase where a dedicated interaction warrants its own route;
- catalog/program detail — links to relevant approved historical examples rather than duplicating them.

Exact route names remain a design/architecture decision; the content relationships are the requirement.

The visitor must be able to move naturally between:

**organization → program/project → garment/role → construction/detail → enquiry**.

The selected organization/project/garment context should survive into the enquiry experience rather than resetting to a generic form.

## 4. Historical-work experience

Do not reduce years of work to a horizontal strip of logos.

Concepts should explore:

- a year/era timeline where projects become the visual milestones;
- sector-led discovery for schools, hospitality, restaurants/cafes, medical and other organizations;
- a client case opening into a coordinated lineup of the roles/garments Fares supplied;
- transitions from the organization's identity/context into the garment program;
- archive photography used deliberately when it is the truthful historical record;
- modern clean product views where a physical sample is still available to re-photograph.

A visitor should understand both **who the work was for** and **what Fares actually made**.

## 5. Product photography standard

For products that can be photographed now, prefer a repeatable controlled capture set:

1. clean front view;
2. clean back view;
3. side or 3/4 view when silhouette matters;
4. close fabric/material view;
5. embroidery/print/logo-placement close-up;
6. construction/trim detail: collar, cuff, pocket, seam, fastening or equivalent;
7. optional on-person/context image when rights and model consent are clear;
8. clean isolated cutout with accurate edges when a layered/spatial composition needs it.

Photography should use controlled neutral lighting, consistent color, useful safe margins and enough resolution for large displays. The product color, branding and construction must remain truthful.

AI may assist with background cleanup, dust/crease cleanup, crop extension or presentation assets only when the result does not alter the garment's real design. Do not generate a cleaner fictional replacement and present it as the historical product.

If only low-quality archival photographs survive, either present them honestly as archive material, recover/re-photograph a physical sample, or omit the visual claim until adequate evidence exists.

## 6. Showcase and exploded-product views

The public redesign should support a premium product-inspection language. Three levels are acceptable depending on available evidence.

### A. Photographic layered garment view

Preferred when real product photography exists but a full 3D model does not.

Possible layers:
- exterior front/back;
- fabric/material swatch;
- lining or inner layer where present;
- embroidery/print/branding application;
- collar/cuff/trim;
- pocket/fastening;
- role-specific feature.

Layers may separate spatially on scroll, drag, pointer or an explicit `Explode` control, then reassemble. The layers must be based on the real garment.

### B. Real 3D/component view

Use when a real model can be created from the garment/sample or a sufficiently accurate source asset exists. Rotation, material response, camera presets, exploded pieces and reassembly may be used when they add understanding.

Do not claim physical or construction accuracy beyond the source model.

### C. Clearly labelled illustrative explainer

When exact geometry cannot be measured but an educational diagram is useful, a stylized exploded illustration may show conceptual layers or feature locations. It must be labelled and art-directed as an illustration rather than presented as a measured digital twin.

## 7. Annotation rules

Interactive labels may explain only verified product facts, for example:

- fabric/material and weight where known;
- embroidery/print method and placement;
- collar/cuff/trim choice;
- pocket or fastening function;
- lining/layering;
- role/use-case reason;
- fit or movement consideration;
- care/performance property only when supported.

Keep labels as semantic DOM content rather than text baked permanently into generated imagery. Support EN/AR, RTL, selection, zoom and assistive technologies.

## 8. Interaction and accessibility

A premium showcase may use scroll choreography, pointer depth, 3D rotation or physically legible explode/reassemble motion, but:

- every gesture has a tap/click and keyboard equivalent unless the gesture is non-essential decoration;
- labels and controls remain keyboard reachable with visible focus;
- product facts remain readable without WebGL;
- `prefers-reduced-motion` receives a composed static/layered plate or ordinary product-detail flow;
- touch does not depend on hover;
- loading failure retains useful product media and content;
- animation never blocks the enquiry action;
- do not expose price or stock.

## 9. Client-data and publication gate

Before a real client/project goes live, record approval for the exact public material being used:

- organization name;
- logo/brand usage;
- relationship/project description;
- dates/years;
- product photographs;
- contextual/team photography;
- testimonials/quotes if any;
- outcome claims;
- external source attribution where needed.

Private operational records remain private even when the organization itself is public.

## 10. Research workflow for real organizations

The next content-research pass requires Fares to supply or authorize an initial list of historical client/organization names and, where available, the raw photos/files associated with each.

For every supplied name, research should prefer:

1. the organization's official website and official public profiles;
2. authoritative public institutional/business sources where needed;
3. reputable secondary sources only for context that cannot be established officially.

Produce a source-backed dossier and clearly separate:

- **public organization facts**;
- **Fares relationship/project facts supplied or verified by Fares**;
- **unknowns requiring confirmation**;
- **publishable vs private material**.

Do not use web research to invent or infer the Fares relationship.

## 11. Design requirement for the next concept round

Every full public-site concept must now demonstrate all of the following, not only a generic catalog:

- historical-client/work discovery;
- at least one complete organization/project story using synthetic/redacted placeholder identity until real publication approval exists;
- coordinated product/role lineup;
- a clean hero product view;
- at least one believable exploded/layered or technical showcase state;
- product annotations;
- transition into enquiry with selected context;
- desktop, mobile, Arabic RTL and reduced-motion equivalents.

These concept placeholders must be visibly synthetic/demo content until real client records are approved for public use.
