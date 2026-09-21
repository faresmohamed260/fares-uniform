import { GarmentInspector } from "@/components/garment-inspector";
import { copy } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function SystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = copy[locale];
  const ar = locale === "ar";
  return (
    <main id="main-content" className="system-page">
      <header className="editorial-page-header">
        <span className="kicker">D-059</span>
        <h1>{t.systemTitlePage}</h1>
        <p>{ar ? "سطح مراجعة للمكونات والحالات الأساسية. هذه صفحة تصميم وليست صفحة إنتاج عامة." : "A browser review surface for core components and states. This is a design page, not a public production route."}</p>
      </header>

      <section className="system-block">
        <h2>{ar ? "الرموز اللونية" : "Colour roles"}</h2>
        <div className="swatches">
          <div className="swatch canvas"><span>Canvas</span><code>#F1EEE7</code></div>
          <div className="swatch paper"><span>Paper</span><code>#FBF9F3</code></div>
          <div className="swatch ink"><span>Ink</span><code>#181917</code></div>
          <div className="swatch sand"><span>Tactile</span><code>#C7BFB2</code></div>
          <div className="swatch kgc-red"><span>KGC skin</span><code>Red</code></div>
          <div className="swatch kgc-blue"><span>KGC skin</span><code>Blue</code></div>
        </div>
      </section>

      <section className="system-block">
        <h2>{ar ? "الكتابة والإيقاع" : "Type & rhythm"}</h2>
        <div className="type-specimen">
          <span>Display / 01</span>
          <strong>{ar ? "الزي يصبح نظاماً بصرياً." : "Uniform becomes a visual system."}</strong>
          <p>{ar ? "النص المقروء يبقى هادئاً، واضحاً، ولا يعتمد على الحركة." : "Reading text stays calm, clear and independent from motion."}</p>
        </div>
      </section>

      <section className="system-block">
        <h2>{ar ? "الأزرار والحالات" : "Controls & states"}</h2>
        <div className="control-row">
          <button className="button button-dark" type="button">{ar ? "إجراء أساسي" : "Primary action"}<span>↗</span></button>
          <button className="button button-ghost" type="button">{ar ? "إجراء ثانوي" : "Secondary action"}</button>
          <button className="button button-dark" disabled type="button">{ar ? "غير متاح" : "Disabled"}</button>
        </div>
      </section>

      <section className="system-block">
        <h2>{ar ? "حالة معاينة القطعة" : "Garment state"}</h2>
        <GarmentInspector locale={locale} compact />
      </section>

      <section className="system-block system-note">
        <h2>{ar ? "قواعد المراجعة" : "Review invariants"}</h2>
        <ul>
          <li>{ar ? "لا صور عملاء أو منتجات مزيفة مولّدة." : "No generated fake client/product imagery."}</li>
          <li>{ar ? "لا أسعار أو مخزون." : "No prices or stock."}</li>
          <li>{ar ? "المشروع يلوّن قصته؛ لا يلوّن هوية Fares العامة." : "Project skin colours the story; it does not become global Fares identity."}</li>
          <li>{ar ? "تقليل الحركة يحافظ على نفس المعلومات." : "Reduced motion preserves the same information."}</li>
        </ul>
      </section>
    </main>
  );
}
