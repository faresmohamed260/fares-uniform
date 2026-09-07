# Representative UI concept brief

Status: READY FOR VISUAL CONCEPT GENERATION / CLIENT REVIEW, 2026-09-07.
This brief owns the visible content and information hierarchy for the Phase 0B concept pass. It uses synthetic product/order data only and does not approve final colors, typography or implementation.

## Shared visual direction
- Premium modern operational product, not a generic SaaS dashboard.
- Clean, confident, tactile surfaces with strong typography and generous but efficient spacing.
- One coherent brand system across public and internal surfaces.
- Physics/morphing cues should suggest continuity and material movement; do not make every element float or bounce.
- Internal screens prioritize speed and stable geometry. Public screens can be more expressive/editorial.
- Concept must show realistic desktop proportions and at least one narrow/mobile Arabic RTL state.
- No hero eyebrow/kicker/pill decoration unless functionally necessary.
- No fake analytics, fake customer counts, fake awards or unverifiable business claims.

## Concept A — Retail POS desktop, English
Primary job: rapid checkout.

Visible structure:
- top-left Fares Uniform wordmark;
- search / barcode-ready input;
- category/filter control kept visually quiet;
- product grid with synthetic garments and size context;
- persistent cart/order panel;
- customer/preorder affordance;
- totals and payment actions;
- connection/sync state;
- clear Cash and InstaPay payment choices;
- no card/wallet buttons in the MVP concept.

Synthetic products:
- School Polo — Navy;
- School Trousers — Charcoal;
- Chef Jacket — White;
- Restaurant Apron — Black;
- Housekeeping Shirt — Stone.

Representative cart:
- School Polo — M × 2;
- School Trousers — 12Y × 1.

Required states visible or implied:
- normal online;
- pending/offline sync must have a clear but calm system-status treatment;
- focus/selection styling must be obvious.

Do not clutter the first screen with owner analytics, production charts, marketing cards or decorative statistics.

## Concept B — Retail POS narrow, Arabic RTL
Same product language and same design system as Concept A; this is not a different theme.

Arabic UI examples:
- نقطة البيع
- بحث أو مسح الباركود
- السلة
- العميل
- الإجمالي
- نقدي
- إنستاباي
- في انتظار المزامنة
- إتمام الدفع

Requirements:
- true RTL composition;
- mixed Arabic + Latin/numeric SKU/order content remains readable;
- cart/payment is reachable without horizontal scrolling;
- sync status is visible;
- large touch targets;
- no mirrored neutral imagery.

## Concept C — Preorder/order detail
Primary job: understand money, promised date, production/readiness and collected quantities without conflating them.

Synthetic order:
- Order FU-1042;
- customer: Sara Hassan;
- pickup date: 18 Sep 2026;
- lines: School Polo M × 2, School Trousers 12Y × 1;
- total: EGP 1,350;
- paid: EGP 500;
- remaining balance: EGP 850;
- fulfillment: one polo finished, remaining pieces open;
- current production/readiness context should make clear that paid, finished and collected are separate concepts.

Required actions/affordances:
- record payment;
- view payment history;
- production/task context;
- collection state;
- clear rule message that partial collection requires the entire remaining balance first.

Avoid generic CRM timeline clutter.

## Concept D — Production queue/task
Primary job: show what the factory should act on next.

Synthetic queue examples:
- School Polo / Navy / M — threshold reached;
- School Polo / Navy / L — pickup deadline approaching;
- Chef Jacket / White / 42 — already In production.

Show:
- grouped design + size;
- quantity needed;
- trigger reason (threshold or deadline);
- nearest promised date;
- state progression: queued → In production → Finished;
- store receipt/readiness is visibly separate from factory completion.

Do not turn this into an analytics dashboard or detailed MRP machine schedule.

## Concept E — Public landing/catalog desktop, English
Primary audience: international schools, franchise restaurants and other large clients; secondary audience browses products.

Navigation:
- Uniforms
- Industries
- About
- Contact

Hero copy:
- Heading: `Uniform manufacturing for schools, restaurants and growing teams.`
- Supporting copy: `Browse our work or tell us what your organization needs. We handle custom uniform orders from sampling through production.`
- Primary action: `Request a quote`
- Secondary action: `Browse catalog`

Content direction:
- image-led uniform/product presentation;
- industries include schools, restaurants/cafes, hotels/hospitality and healthcare;
- public product cards contain names/categories/images only — no price and no stock availability;
- visible WhatsApp and phone contact route alongside enquiry form path;
- premium editorial rhythm rather than ecommerce marketplace chrome.

Do not claim certifications, export markets, turnaround times, client counts or other facts not confirmed in repository requirements.

## Concept F — Public catalog/product detail narrow, Arabic RTL
Arabic navigation/content direction consistent with Concept E.

Example strings:
- الزي المدرسي
- زي المطاعم والمقاهي
- تصفح المنتجات
- اطلب عرض سعر
- تواصل عبر واتساب
- اتصل بنا

Requirements:
- no public price/stock;
- product imagery remains prominent;
- clear enquiry action;
- elegant mobile typography and true RTL spacing/alignment;
- mixed phone numbers or garment codes remain readable.

## Motion cues to visualize
The static concept can imply these transitions without adding fake chrome:
- public product card image/shape morphs into product detail hero;
- POS cart row insertion feels spring-settled but keeps totals/actions stable;
- order row/detail uses shared context rather than a hard visual reset;
- production state progression has a restrained material/track transition;
- reduced-motion mode replaces spatial travel with immediate/fade state change.

## Concept rejection criteria
Reject the pass if:
- it looks like stock Odoo with a new color;
- it looks like a generic shadcn dashboard template;
- cards are nested inside cards everywhere;
- public site resembles an ecommerce store with price/cart patterns;
- Arabic appears as translated labels pasted into an LTR layout;
- motion is the main visual gimmick;
- checkout geometry is unstable;
- visible information conflicts with the repository requirements.
