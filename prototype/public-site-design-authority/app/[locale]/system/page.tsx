import { AtelierInspector } from "@/components/atelier-inspector";
import { EditorialFooter } from "@/components/editorial-footer";
import { requireLocale } from "@/lib/locale";

export default async function SystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const ar = locale === "ar";

  return (
    <main id="main-content" className="system-page">
      <header className="editorial-page-header">
        <span className="kicker">D-060 / SCROLLCRAFT</span>
        <h1>{ar ? "نظام التصميم وحالات المراجعة" : "Design system / review states"}</h1>
        <p>{ar ? "هذه الصفحة تعرض المواد الأساسية للسلطة التصميمية الجديدة: الهوية المحايدة لـ Fares، جلد المشروع، الحالات التفاعلية وحدود الحقيقة." : "This page exposes the new design-authority primitives: neutral Fares shell, project skin, interactive states and truth boundaries."}</p>
      </header>

      <section className="system-block">
        <h2>{ar ? "الأرضية والجلد" : "Canvas & project skin"}</h2>
        <div className="swatches">
          <div className="swatch canvas"><span>Fares canvas</span><code>#F3F0E8</code></div>
          <div className="swatch paper"><span>Paper</span><code>#FAF8F2</code></div>
          <div className="swatch ink"><span>Ink</span><code>#171714</code></div>
          <div className="swatch sand"><span>Brass / tactile</span><code>#AA956A</code></div>
          <div className="swatch kgc-red"><span>KGC skin</span><code>#B6322A</code></div>
          <div className="swatch kgc-blue"><span>KGC skin</span><code>#BCD8E7</code></div>
        </div>
      </section>

      <section className="system-block">
        <h2>{ar ? "الكتابة والإيقاع" : "Type & rhythm"}</h2>
        <div className="type-specimen">
          <span>Pattern Assembly / 01</span>
          <strong>{ar ? "الزي يصبح نظاماً بصرياً." : "Uniform becomes a visual system."}</strong>
          <p>{ar ? "العرض يستخدم Bodoni Moda للإنجليزية وNoto Sans Arabic للعربية مع Manrope للنصوص والأدوات." : "The review uses Bodoni Moda for English display, Noto Sans Arabic for Arabic, and Manrope for text and controls."}</p>
        </div>
      </section>

      <section className="system-block">
        <h2>{ar ? "معاينة القطعة" : "Garment inspection state"}</h2>
        <AtelierInspector locale={locale} />
      </section>

      <section className="system-block system-note">
        <h2>{ar ? "ثوابت السلطة" : "Authority invariants"}</h2>
        <ul>
          <li>{ar ? "محرك Scrollcraft المثبت هو آلية الحركة الأساسية." : "The pinned Scrollcraft engine is the primary motion mechanism."}</li>
          <li>{ar ? "لا صور عملاء أو منتجات مزيفة مولّدة." : "No generated fake client/product imagery."}</li>
          <li>{ar ? "لا أسعار أو مخزون." : "No prices or stock."}</li>
          <li>{ar ? "جلد المشروع لا يتحول إلى هوية Fares العامة." : "Project skin never becomes the global Fares identity."}</li>
          <li>{ar ? "تقليل الحركة يحافظ على نفس المعلومات." : "Reduced motion preserves the same information."}</li>
        </ul>
      </section>

      <EditorialFooter locale={locale} />
    </main>
  );
}
