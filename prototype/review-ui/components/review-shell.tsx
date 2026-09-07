"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export type ReviewSurface = "pos" | "order" | "production" | "public";
type Lang = "en" | "ar";

type Product = {
  id: string;
  en: string;
  ar: string;
  variantEn: string;
  variantAr: string;
  tone: "navy" | "charcoal" | "white" | "black" | "stone";
  kind: "top" | "trouser" | "jacket" | "apron";
  price: number;
};

type CartLine = {
  id: string;
  productId: string;
  en: string;
  ar: string;
  variantEn: string;
  variantAr: string;
  qty: number;
  price: number;
};

const products: Product[] = [
  { id: "polo", en: "School Polo", ar: "قميص بولو مدرسي", variantEn: "Navy · M", variantAr: "كحلي · M", tone: "navy", kind: "top", price: 350 },
  { id: "trousers", en: "School Trousers", ar: "بنطلون مدرسي", variantEn: "Charcoal · 12Y", variantAr: "فحمي · 12Y", tone: "charcoal", kind: "trouser", price: 650 },
  { id: "chef", en: "Chef Jacket", ar: "جاكيت شيف", variantEn: "White · 42", variantAr: "أبيض · 42", tone: "white", kind: "jacket", price: 720 },
  { id: "apron", en: "Restaurant Apron", ar: "مريلة مطعم", variantEn: "Black · One size", variantAr: "أسود · مقاس واحد", tone: "black", kind: "apron", price: 280 },
  { id: "housekeeping", en: "Housekeeping Shirt", ar: "قميص هاوس كيبنج", variantEn: "Stone · L", variantAr: "حجري · L", tone: "stone", kind: "top", price: 410 },
];

const initialCart: CartLine[] = [
  { id: "line-polo", productId: "polo", en: "School Polo", ar: "قميص بولو مدرسي", variantEn: "Navy · M", variantAr: "كحلي · M", qty: 2, price: 350 },
  { id: "line-trousers", productId: "trousers", en: "School Trousers", ar: "بنطلون مدرسي", variantEn: "Charcoal · 12Y", variantAr: "فحمي · 12Y", qty: 1, price: 650 },
];

function text(lang: Lang, en: string, ar: string) {
  return lang === "ar" ? ar : en;
}

function money(lang: Lang, value: number) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon directional-icon">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d="M20 7v5h-5M4 17v-5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.2 12a6.5 6.5 0 0 0-10.9-4.7L5 9M5.8 12a6.5 6.5 0 0 0 10.9 4.7L19 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProductArt({ kind, tone }: Pick<Product, "kind" | "tone">) {
  return (
    <div className="product-art" data-tone={tone}>
      <svg viewBox="0 0 180 150" aria-hidden="true">
        {kind === "trouser" ? (
          <path d="M58 24h64l-7 100-22-2-3-57-4 57-22 2z" />
        ) : kind === "apron" ? (
          <>
            <path d="M72 25c4-13 32-13 36 0l4 18 18 11-19 74H69L50 54l18-11z" />
            <path d="M74 23c9 10 23 10 32 0" className="garment-line" />
          </>
        ) : (
          <>
            <path d="M60 34 78 22h24l18 12 27 18-15 25-16-10v62H64V67L48 77 33 52z" />
            {kind === "jacket" && <path d="M90 25v104M83 52h14" className="garment-line" />}
          </>
        )}
      </svg>
    </div>
  );
}

function SurfaceHeader({ lang, title, subtitle, status }: { lang: Lang; title: string; subtitle: string; status?: string }) {
  return (
    <header className="surface-header">
      <div className="brand-lockup" aria-label="Fares Uniform">
        <span className="brand-mark">FU</span>
        <span>Fares Uniform</span>
      </div>
      <div className="surface-title-block">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {status && <div className="surface-status">{status}</div>}
      <a className="language-link" href={`?lang=${lang === "ar" ? "en" : "ar"}`}>{lang === "ar" ? "EN" : "ع"}</a>
    </header>
  );
}

function PosSurface({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  const [query, setQuery] = useState("");
  const [offline, setOffline] = useState(lang === "ar");
  const [payment, setPayment] = useState<"cash" | "instapay">("cash");
  const [mobilePane, setMobilePane] = useState<"products" | "cart">(lang === "ar" ? "cart" : "products");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) => `${product.en} ${product.ar} ${product.variantEn} ${product.variantAr}`.toLowerCase().includes(normalized));
  }, [query]);

  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  function addProduct(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (existing) {
        return current.map((line) => line.productId === product.id ? { ...line, qty: line.qty + 1 } : line);
      }
      return [...current, {
        id: `line-${product.id}`,
        productId: product.id,
        en: product.en,
        ar: product.ar,
        variantEn: product.variantEn,
        variantAr: product.variantAr,
        qty: 1,
        price: product.price,
      }];
    });
  }

  return (
    <div className="surface surface-pos" data-surface="pos">
      <SurfaceHeader
        lang={lang}
        title={text(lang, "Point of sale", "نقطة البيع")}
        subtitle={text(lang, "Fast checkout with visible sync state", "دفع سريع مع حالة مزامنة واضحة")}
        status={offline ? text(lang, "Pending sync", "في انتظار المزامنة") : text(lang, "Online · synced", "متصل · تمت المزامنة")}
      />

      <div className="mobile-pane-switch" role="group" aria-label={text(lang, "Checkout view", "عرض نقطة البيع")}>
        <button className={mobilePane === "products" ? "is-active" : ""} onClick={() => setMobilePane("products")}>{text(lang, "Products", "المنتجات")}</button>
        <button className={mobilePane === "cart" ? "is-active" : ""} onClick={() => setMobilePane("cart")}>{text(lang, "Cart & payment", "السلة والدفع")}</button>
      </div>

      <div className="pos-layout">
        <section className={`pos-products ${mobilePane === "cart" ? "mobile-hidden" : ""}`} aria-label={text(lang, "Products", "المنتجات")}>
          <div className="pos-toolbar">
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">{text(lang, "Search or scan barcode", "بحث أو مسح الباركود")}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text(lang, "Search or scan barcode", "بحث أو مسح الباركود")} />
            </label>
            <button className="quiet-button" type="button">{text(lang, "All uniforms", "كل الزي")}</button>
          </div>
          <div className="product-grid">
            {filtered.map((product) => (
              <motion.button
                layout
                key={product.id}
                className="product-card"
                onClick={() => addProduct(product)}
                whileTap={reduced ? undefined : { scale: 0.985 }}
                transition={{ type: "spring", stiffness: 520, damping: 35 }}
              >
                <ProductArt kind={product.kind} tone={product.tone} />
                <span className="product-copy">
                  <strong>{text(lang, product.en, product.ar)}</strong>
                  <span>{text(lang, product.variantEn, product.variantAr)}</span>
                </span>
                <span className="add-hint">{text(lang, "Add", "أضف")}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <aside className={`cart-panel ${mobilePane === "products" ? "mobile-hidden" : ""}`} aria-label={text(lang, "Cart", "السلة")}>
          <div className="cart-heading">
            <div>
              <span className="eyeline">{text(lang, "Current order", "الطلب الحالي")}</span>
              <h2>{text(lang, "Cart", "السلة")}</h2>
            </div>
            <button className={`sync-button ${offline ? "is-offline" : ""}`} onClick={() => setOffline((value) => !value)} type="button">
              <SyncIcon />
              <span>{offline ? text(lang, "Pending sync", "في انتظار المزامنة") : text(lang, "Synced", "متزامن")}</span>
            </button>
          </div>

          <div className="customer-row">
            <span>{text(lang, "Customer", "العميل")}</span>
            <button type="button">{text(lang, "Walk-in · change", "عميل مباشر · تغيير")}</button>
          </div>

          <div className="cart-lines">
            <AnimatePresence initial={false}>
              {cart.map((line) => (
                <motion.div
                  layout
                  key={line.id}
                  className="cart-line"
                  initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ type: "spring", stiffness: 430, damping: 34 }}
                >
                  <div>
                    <strong>{text(lang, line.en, line.ar)}</strong>
                    <span>{text(lang, line.variantEn, line.variantAr)}</span>
                  </div>
                  <span className="quantity" dir="ltr">× {line.qty}</span>
                  <strong className="line-total">{money(lang, line.price * line.qty)}</strong>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="cart-summary">
            <div><span>{text(lang, "Subtotal", "المجموع الفرعي")}</span><strong>{money(lang, total)}</strong></div>
            <div className="grand-total"><span>{text(lang, "Total", "الإجمالي")}</span><strong>{money(lang, total)}</strong></div>
          </div>

          <fieldset className="payment-methods">
            <legend>{text(lang, "Payment", "الدفع")}</legend>
            <button type="button" aria-pressed={payment === "cash"} className={payment === "cash" ? "is-selected" : ""} onClick={() => setPayment("cash")}>
              <span>{text(lang, "Cash", "نقدي")}</span><span className="selection-dot" />
            </button>
            <button type="button" aria-pressed={payment === "instapay"} className={payment === "instapay" ? "is-selected" : ""} onClick={() => setPayment("instapay")}>
              <span>{text(lang, "InstaPay", "إنستاباي")}</span><span className="selection-dot" />
            </button>
          </fieldset>

          <button className="primary-action" type="button">
            <span>{text(lang, "Complete payment", "إتمام الدفع")}</span>
            <ArrowIcon />
          </button>
          {offline && <p className="offline-note">{text(lang, "This sale will stay on this device until the server confirms synchronization.", "سيظل هذا البيع محفوظًا على هذا الجهاز حتى يؤكد الخادم المزامنة.")}</p>}
        </aside>
      </div>
    </div>
  );
}

function OrderSurface({ lang }: { lang: Lang }) {
  const orderLines = [
    { en: "School Polo", ar: "قميص بولو مدرسي", variantEn: "Navy · M", variantAr: "كحلي · M", ordered: 2, finished: 1, collected: 0 },
    { en: "School Trousers", ar: "بنطلون مدرسي", variantEn: "Charcoal · 12Y", variantAr: "فحمي · 12Y", ordered: 1, finished: 0, collected: 0 },
  ];

  return (
    <div className="surface surface-order" data-surface="order">
      <SurfaceHeader lang={lang} title={text(lang, "Preorder FU-1042", "طلب مسبق FU-1042")} subtitle={text(lang, "Sara Hassan · pickup 18 Sep 2026", "سارة حسن · الاستلام 18 سبتمبر 2026")} status={text(lang, "Balance due", "رصيد مستحق")} />

      <div className="order-layout">
        <section className="order-main">
          <div className="order-overview">
            <div className="money-block">
              <span>{text(lang, "Order total", "إجمالي الطلب")}</span>
              <strong>{money(lang, 1350)}</strong>
            </div>
            <div className="money-block is-paid">
              <span>{text(lang, "Paid", "المدفوع")}</span>
              <strong>{money(lang, 500)}</strong>
            </div>
            <div className="money-block is-balance">
              <span>{text(lang, "Remaining balance", "الرصيد المتبقي")}</span>
              <strong>{money(lang, 850)}</strong>
            </div>
          </div>

          <div className="policy-callout">
            <div className="policy-symbol">!</div>
            <div>
              <strong>{text(lang, "Full remaining balance is required before any partial collection.", "يجب سداد الرصيد المتبقي بالكامل قبل استلام أي جزء من الطلب.")}</strong>
              <span>{text(lang, "Payment completion and collection quantities are tracked separately.", "اكتمال الدفع وكميات الاستلام يتم تتبعهما بشكل منفصل.")}</span>
            </div>
            <button type="button">{text(lang, "Record payment", "تسجيل دفعة")}</button>
          </div>

          <section className="line-section" aria-labelledby="order-lines-title">
            <div className="section-heading">
              <div><span className="eyeline">{text(lang, "Fulfillment", "التنفيذ")}</span><h2 id="order-lines-title">{text(lang, "Items and quantities", "الأصناف والكميات")}</h2></div>
              <button className="quiet-button" type="button">{text(lang, "Payment history", "سجل الدفعات")}</button>
            </div>
            <div className="order-line-table" role="table">
              <div className="order-line table-head" role="row">
                <span role="columnheader">{text(lang, "Item", "الصنف")}</span>
                <span role="columnheader">{text(lang, "Ordered", "المطلوب")}</span>
                <span role="columnheader">{text(lang, "Finished", "منتهي")}</span>
                <span role="columnheader">{text(lang, "Collected", "تم الاستلام")}</span>
              </div>
              {orderLines.map((line) => (
                <div className="order-line" role="row" key={line.en}>
                  <span role="cell"><strong>{text(lang, line.en, line.ar)}</strong><small>{text(lang, line.variantEn, line.variantAr)}</small></span>
                  <span role="cell" dir="ltr">{line.ordered}</span>
                  <span role="cell" dir="ltr">{line.finished}</span>
                  <span role="cell" dir="ltr">{line.collected}</span>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="order-side">
          <div className="state-rail">
            <span className="eyeline">{text(lang, "Production & readiness", "الإنتاج والجاهزية")}</span>
            <h2>{text(lang, "Separate operational states", "حالات تشغيلية منفصلة")}</h2>
            {[
              [text(lang, "Production task", "مهمة الإنتاج"), text(lang, "In production", "قيد الإنتاج"), "active"],
              [text(lang, "Factory completion", "اكتمال المصنع"), text(lang, "1 of 3 pieces finished", "تم إنهاء 1 من 3 قطع"), "partial"],
              [text(lang, "Store receipt", "استلام المتجر"), text(lang, "Not yet ready for collection", "غير جاهز للاستلام بعد"), "pending"],
              [text(lang, "Customer collection", "استلام العميل"), text(lang, "0 of 3 collected", "تم استلام 0 من 3"), "pending"],
            ].map(([label, value, state]) => (
              <div className="state-step" data-state={state} key={label}>
                <span className="state-node" />
                <div><strong>{label}</strong><span>{value}</span></div>
              </div>
            ))}
          </div>
          <div className="order-meta">
            <span>{text(lang, "Promise date", "تاريخ الوعد")}</span><strong>18 Sep 2026</strong>
            <span>{text(lang, "Customer", "العميل")}</span><strong>{text(lang, "Sara Hassan", "سارة حسن")}</strong>
            <span>{text(lang, "Contact", "التواصل")}</span><strong dir="ltr">+20 10 0000 0000</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProductionSurface({ lang }: { lang: Lang }) {
  const queue = [
    { itemEn: "School Polo", itemAr: "قميص بولو مدرسي", detailEn: "Navy · M", detailAr: "كحلي · M", qty: 18, reasonEn: "Threshold reached", reasonAr: "تم بلوغ حد الكمية", date: "14 Sep", stateEn: "Queued", stateAr: "في قائمة الانتظار", state: "queued" },
    { itemEn: "School Polo", itemAr: "قميص بولو مدرسي", detailEn: "Navy · L", detailAr: "كحلي · L", qty: 7, reasonEn: "Pickup deadline approaching", reasonAr: "موعد الاستلام يقترب", date: "11 Sep", stateEn: "Queued", stateAr: "في قائمة الانتظار", state: "urgent" },
    { itemEn: "Chef Jacket", itemAr: "جاكيت شيف", detailEn: "White · 42", detailAr: "أبيض · 42", qty: 12, reasonEn: "Work started", reasonAr: "بدأ العمل", date: "16 Sep", stateEn: "In production", stateAr: "قيد الإنتاج", state: "active" },
  ];

  return (
    <div className="surface surface-production" data-surface="production">
      <SurfaceHeader lang={lang} title={text(lang, "Production queue", "قائمة الإنتاج")} subtitle={text(lang, "Act on demand, deadlines and real work state", "العمل حسب الطلب والمواعيد وحالة التنفيذ الفعلية")} status={text(lang, "3 active groups", "3 مجموعات نشطة")} />
      <div className="production-board">
        <div className="production-intro">
          <div><span className="eyeline">{text(lang, "Today", "اليوم")}</span><h2>{text(lang, "What needs action next", "ما يحتاج إلى إجراء الآن")}</h2></div>
          <div className="legend"><span><i data-state="queued" />{text(lang, "Queued", "قيد الانتظار")}</span><span><i data-state="active" />{text(lang, "In production", "قيد الإنتاج")}</span><span><i data-state="finished" />{text(lang, "Finished", "منتهي")}</span></div>
        </div>
        <div className="queue-list" role="table">
          <div className="queue-row queue-head" role="row">
            <span role="columnheader">{text(lang, "Design / size", "التصميم / المقاس")}</span>
            <span role="columnheader">{text(lang, "Needed", "المطلوب")}</span>
            <span role="columnheader">{text(lang, "Trigger", "سبب التشغيل")}</span>
            <span role="columnheader">{text(lang, "Nearest promise", "أقرب موعد")}</span>
            <span role="columnheader">{text(lang, "State", "الحالة")}</span>
          </div>
          {queue.map((row) => (
            <motion.div layout className="queue-row" role="row" key={`${row.itemEn}-${row.detailEn}`}>
              <span role="cell"><strong>{text(lang, row.itemEn, row.itemAr)}</strong><small>{text(lang, row.detailEn, row.detailAr)}</small></span>
              <span role="cell" className="qty-cell" dir="ltr">{row.qty}</span>
              <span role="cell"><span className={`reason-tag ${row.state === "urgent" ? "is-urgent" : ""}`}>{text(lang, row.reasonEn, row.reasonAr)}</span></span>
              <span role="cell" dir="ltr">{row.date}</span>
              <span role="cell"><span className="status-track"><i data-state={row.state === "active" ? "active" : "queued"} /><strong>{text(lang, row.stateEn, row.stateAr)}</strong></span></span>
            </motion.div>
          ))}
        </div>
        <div className="handoff-note">
          <div><strong>{text(lang, "Factory completion is not store readiness.", "اكتمال المصنع لا يعني الجاهزية في المتجر.")}</strong><span>{text(lang, "Ready for collection is recorded only after the store receives the finished garments.", "يتم تسجيل جاهز للاستلام فقط بعد استلام المتجر للملابس المنتهية.")}</span></div>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
}

function PublicSurface({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const publicProducts = products.slice(0, 4);

  return (
    <div className="surface public-site" data-surface="public">
      <header className="public-nav">
        <div className="brand-lockup public-brand"><span className="brand-mark">FU</span><span>Fares Uniform</span></div>
        <nav aria-label={text(lang, "Primary", "الرئيسية")}>
          <a href="#catalog">{text(lang, "Uniforms", "الزي")}</a>
          <a href="#industries">{text(lang, "Industries", "القطاعات")}</a>
          <a href="#about">{text(lang, "About", "من نحن")}</a>
          <a href="#contact">{text(lang, "Contact", "تواصل")}</a>
        </nav>
        <a className="public-cta" href="#contact">{text(lang, "Request a quote", "اطلب عرض سعر")}</a>
        <a className="language-link" href={`?lang=${lang === "ar" ? "en" : "ar"}`}>{lang === "ar" ? "EN" : "ع"}</a>
      </header>

      <main>
        <section className="public-hero" id="about">
          <div className="hero-copy">
            <h1>{text(lang, "Uniform manufacturing for schools, restaurants and growing teams.", "تصنيع الزي للمدارس والمطاعم والفرق المتنامية.")}</h1>
            <p>{text(lang, "Browse our work or tell us what your organization needs. We handle custom uniform orders from sampling through production.", "تصفح أعمالنا أو أخبرنا بما تحتاجه مؤسستك. نتعامل مع طلبات الزي المخصص من العينة وحتى الإنتاج.")}</p>
            <div className="hero-actions">
              <a className="primary-action" href="#contact"><span>{text(lang, "Request a quote", "اطلب عرض سعر")}</span><ArrowIcon /></a>
              <a className="text-link" href="#catalog">{text(lang, "Browse catalog", "تصفح المنتجات")}<ArrowIcon /></a>
            </div>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <motion.div className="hero-panel hero-panel-main" animate={reduced ? undefined : { y: [0, -7, 0], rotate: [0, -0.6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <ProductArt kind="jacket" tone="white" />
              <span>{text(lang, "Hospitality", "الضيافة")}</span>
            </motion.div>
            <div className="hero-panel hero-panel-side"><ProductArt kind="top" tone="navy" /><span>{text(lang, "Schools", "المدارس")}</span></div>
            <div className="hero-fabric" />
          </div>
        </section>

        <section className="industry-strip" id="industries" aria-label={text(lang, "Industries", "القطاعات")}>
          {[text(lang, "Schools", "المدارس"), text(lang, "Restaurants & cafés", "المطاعم والمقاهي"), text(lang, "Hotels & hospitality", "الفنادق والضيافة"), text(lang, "Healthcare", "الرعاية الصحية")].map((item) => <span key={item}>{item}</span>)}
        </section>

        <section className="catalog-section" id="catalog">
          <div className="catalog-heading"><div><span className="eyeline">{text(lang, "Selected uniforms", "نماذج مختارة")}</span><h2>{text(lang, "Built around the team wearing it", "تصميم يناسب الفريق الذي يرتديه")}</h2></div><p>{text(lang, "Explore representative product families, then contact us to discuss your organization’s design and quantities.", "استكشف نماذج من فئات المنتجات ثم تواصل معنا لمناقشة تصميم مؤسستك والكميات المطلوبة.")}</p></div>
          <div className="editorial-grid">
            {publicProducts.map((product, index) => (
              <button className={`editorial-card card-${index + 1}`} key={product.id} onClick={() => setSelected(product)} type="button">
                <motion.div layoutId={`product-media-${product.id}`} className="editorial-media" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                  <ProductArt kind={product.kind} tone={product.tone} />
                </motion.div>
                <span className="editorial-copy"><strong>{text(lang, product.en, product.ar)}</strong><span>{text(lang, "View details", "عرض التفاصيل")}</span></span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div className="product-detail" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: 10 }}>
                <motion.div layoutId={`product-media-${selected.id}`} className="detail-media"><ProductArt kind={selected.kind} tone={selected.tone} /></motion.div>
                <div className="detail-copy"><span className="eyeline">{text(lang, "Product family", "فئة المنتج")}</span><h3>{text(lang, selected.en, selected.ar)}</h3><p>{text(lang, "Discuss colors, sizing and organization-specific design details with our team before production.", "ناقش الألوان والمقاسات وتفاصيل التصميم الخاصة بمؤسستك مع فريقنا قبل الإنتاج.")}</p><a className="primary-action" href="#contact"><span>{text(lang, "Enquire about this uniform", "استفسر عن هذا الزي")}</span><ArrowIcon /></a></div>
                <button className="detail-close" onClick={() => setSelected(null)} type="button" aria-label={text(lang, "Close product details", "إغلاق تفاصيل المنتج")}>×</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy"><span className="eyeline">{text(lang, "Start a conversation", "ابدأ المحادثة")}</span><h2>{text(lang, "Tell us what your team needs.", "أخبرنا بما يحتاجه فريقك.")}</h2><p>{text(lang, "Share the organization, uniform type and approximate quantities. Our team can continue by phone, WhatsApp or the enquiry form.", "شارك اسم المؤسسة ونوع الزي والكميات التقريبية. يمكن لفريقنا المتابعة عبر الهاتف أو واتساب أو نموذج الاستفسار.")}</p><div className="contact-routes"><a href="#contact">{text(lang, "WhatsApp", "واتساب")}</a><a href="#contact">{text(lang, "Phone", "اتصل بنا")}</a></div></div>
          <form className="enquiry-form" onSubmit={(event) => event.preventDefault()}>
            <label><span>{text(lang, "Organization", "المؤسسة")}</span><input name="organization" placeholder={text(lang, "School, restaurant, hotel…", "مدرسة، مطعم، فندق…")} /></label>
            <label><span>{text(lang, "What do you need?", "ماذا تحتاج؟")}</span><textarea name="need" rows={4} placeholder={text(lang, "Uniform type, quantities and design notes", "نوع الزي والكميات وملاحظات التصميم")} /></label>
            <button className="primary-action" type="submit"><span>{text(lang, "Send enquiry", "إرسال الاستفسار")}</span><ArrowIcon /></button>
          </form>
        </section>
      </main>
    </div>
  );
}

export function ReviewShell({ surface, lang }: { surface: ReviewSurface; lang: Lang }) {
  const reduced = Boolean(useReducedMotion());
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [dir, lang]);

  return (
    <div className="review-root" dir={dir} lang={lang} data-reduced-motion={reduced ? "true" : "false"}>
      {surface === "pos" && <PosSurface lang={lang} reduced={reduced} />}
      {surface === "order" && <OrderSurface lang={lang} />}
      {surface === "production" && <ProductionSurface lang={lang} />}
      {surface === "public" && <PublicSurface lang={lang} reduced={reduced} />}
    </div>
  );
}
