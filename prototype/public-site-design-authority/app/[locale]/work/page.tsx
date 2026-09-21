import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { copy, media, sectors, stages } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function WorkIndex({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = copy[locale];
  return (
    <main id="main-content" className="page-shell">
      <header className="editorial-page-header">
        <span className="kicker">{locale === "ar" ? "أرشيف العمل" : "Work archive"}</span>
        <h1>{t.workTitle}</h1>
        <p>{t.workBody}</p>
      </header>

      <section className="work-feature">
        <div className="work-feature-media">
          <img src={media.kgc.campus} alt={locale === "ar" ? "مبنى KGC" : "KGC campus"} />
          <div className="work-model-strip">{stages.map(stage => <img key={stage.id} src={stage.image} alt="" />)}</div>
        </div>
        <div className="work-feature-copy">
          <div className="work-meta"><span>01</span><strong>{locale === "ar" ? "التعليم" : "Education"}</strong></div>
          <img className="work-logo" src={media.kgc.logo} alt="" />
          <h2>KGC National</h2>
          <p>{locale === "ar" ? "منظومة زي مدرسي بأربع مراحل، مع إطلالات حقيقية حالية للمراجعة واستمرارية من الشخص إلى القطعة." : "A four-stage school uniform program with current real review looks and continuity from wearer to garment."}</p>
          <Link className="button button-dark" href={`/${locale}/work/kgc/national`}>{locale === "ar" ? "استكشف المشروع" : "Explore project"}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="work-capabilities">
        <Reveal>
          <span className="kicker">{locale === "ar" ? "مساحة النمو" : "Capability index"}</span>
          <h2>{locale === "ar" ? "لا نخترع أرشيفاً لإكمال الشبكة." : "We don’t invent an archive to fill a grid."}</h2>
          <p>{locale === "ar" ? "تظهر المشاريع هنا عندما تتوفر مادة حقيقية وحق مراجعة أو نشر واضح. وحتى ذلك الوقت، تبقى القطاعات لغة قدرة فقط." : "Projects appear here when real material and a clear review/publication basis exist. Until then, sectors remain capability vocabulary only."}</p>
        </Reveal>
        <div className="sector-lines compact">
          {sectors.map((sector, index) => <div key={sector.en}><span>0{index + 1}</span><strong>{sector[locale]}</strong></div>)}
        </div>
      </section>
    </main>
  );
}
