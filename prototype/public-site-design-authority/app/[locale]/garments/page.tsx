import { EditorialFooter } from "@/components/editorial-footer";
import { media } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function GarmentsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const ar = locale === "ar";

  return (
    <main id="main-content" className="garment-collection">
      <section className="collection-object-one" data-sc-act="flow" data-sc-drift="#f3f0e8">
        <span className="collection-index">01 / 01</span>
        <div className="collection-view collection-front" data-sc-parallax="-0.04">
          <img src={media.kgc.poloFront} alt={ar ? "قميص High الصيفي - أمام" : "High summer polo — front"} />
          <span>{ar ? "أمام" : "FRONT"}</span>
        </div>
        <div className="collection-view collection-back" data-sc-parallax="0.045">
          <img src={media.kgc.poloBack} alt={ar ? "قميص High الصيفي - خلف" : "High summer polo — back"} />
          <span>{ar ? "خلف" : "BACK"}</span>
        </div>
        <div className="collection-label">
          <span className="micro-label">KGC NATIONAL / HIGH / SUMMER</span>
          <h1>{ar ? "قميص أكاديمي قصير الأكمام" : "Short-sleeve academic polo"}</h1>
          <dl>
            <div><dt>{ar ? "السياق" : "Context"}</dt><dd>High / Summer</dd></div>
            <div><dt>{ar ? "المادة" : "Media"}</dt><dd>{ar ? "أصلية للمراجعة" : "Original review source"}</dd></div>
            <div><dt>{ar ? "التوفر" : "Views"}</dt><dd>Front / Back</dd></div>
          </dl>
          <a href={`/${locale}/garments/high-summer-polo`}>{ar ? "افحص القطعة" : "Inspect garment"} ↗</a>
        </div>
      </section>

      <section className="collection-rule sc-section" data-sc-act="flow">
        <span className="micro-label" data-sc-in>02 / {ar ? "قاعدة المجموعة" : "COLLECTION RULE"}</span>
        <h2 data-sc-in>{ar ? "المكتبة تنمو مع الأدلة، لا مع الحاجة لملء شبكة." : "The collection grows with evidence, not with the need to fill a grid."}</h2>
        <p data-sc-in>{ar ? "لن نعرض قطعة أخرى حتى تكون وسائطها الحقيقية وسياقها وحقوق استخدامها واضحة." : "Another garment does not appear until its real media, program context and review/publication basis are clear."}</p>
        <EditorialFooter locale={locale} />
      </section>
    </main>
  );
}
