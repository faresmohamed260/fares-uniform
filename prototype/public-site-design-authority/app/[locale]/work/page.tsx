import { EditorialFooter } from "@/components/editorial-footer";
import { media, sectors, stages } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function WorkIndex({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const ar = locale === "ar";

  return (
    <main id="main-content" className="work-collection">
      <section className="work-object-one" data-sc-act="flow" data-sc-drift="#142b49">
        <div className="work-object-bg" data-sc-parallax="-0.05"><img src={media.kgc.campus} alt="" /></div>
        <div className="work-object-copy">
          <span className="micro-label">01 / {ar ? "التعليم" : "EDUCATION"}</span>
          <img src={media.kgc.logo} alt="" className="work-object-logo" />
          <h1>KGC<br/>National</h1>
          <dl>
            <div><dt>{ar ? "البرنامج" : "Program"}</dt><dd>National</dd></div>
            <div><dt>{ar ? "المراحل" : "Stages"}</dt><dd>04</dd></div>
            <div><dt>{ar ? "الحالة" : "Status"}</dt><dd>{ar ? "وسائط مراجعة حقيقية" : "Real review media"}</dd></div>
          </dl>
          <a href={`/${locale}/work/kgc/national`}>{ar ? "ادخل البرنامج" : "Enter the program"} <span>↗</span></a>
        </div>
        <div className="work-object-models" aria-label={ar ? "مراحل KGC الأربع" : "Four KGC stages"}>
          {stages.map((stage, index) => (
            <figure key={stage.id} data-sc-parallax={index % 2 ? "0.035" : "-0.025"}>
              <img src={stage.image} alt={stage.name[locale]} />
              <figcaption><span>0{index + 1}</span>{stage.name[locale]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="work-folio sc-section" data-sc-act="flow" data-sc-drift="#f3f0e8">
        <header data-sc-in>
          <span className="micro-label">02 / {ar ? "فهرس القدرة" : "CAPABILITY INDEX"}</span>
          <h2>{ar ? "الأرشيف لا يحتاج إلى عملاء خياليين ليبدو كاملاً." : "The archive does not need fictional clients to feel complete."}</h2>
          <p>{ar ? "المشروع الحقيقي يظهر كقصة كاملة. القطاعات الأخرى تبقى لغة قدرة إلى أن تتوفر مادة حقيقية وحقوق واضحة." : "A real project appears as a complete story. Other sectors remain capability vocabulary until real material and a clear rights basis exist."}</p>
        </header>
        <div className="work-folio-list" data-sc-stagger="65">
          {sectors.map((sector, index) => (
            <div key={sector.en} data-sc-in><span>0{index + 1}</span><strong>{sector[locale]}</strong><small>{index === 0 ? (ar ? "مشروع مراجعة حالي" : "current review project") : (ar ? "قدرة" : "capability")}</small></div>
          ))}
        </div>
      </section>

      <section className="work-colophon sc-section" data-sc-act="flow">
        <span className="micro-label" data-sc-in>03 / {ar ? "قاعدة الأرشيف" : "ARCHIVE RULE"}</span>
        <p data-sc-in>{ar ? "كل اسم، كل صورة، وكل نتيجة هنا يجب أن تستند إلى عمل حقيقي قابل للمراجعة." : "Every name, image and outcome here must be backed by real, reviewable work."}</p>
        <a href={`/${locale}/enquiry`} data-sc-in>{ar ? "ناقش برنامجاً جديداً" : "Discuss a new program"} ↗</a>
        <EditorialFooter locale={locale} />
      </section>
    </main>
  );
}
