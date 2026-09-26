import { AtelierInspector } from "@/components/atelier-inspector";
import { EditorialFooter } from "@/components/editorial-footer";
import { media, stages } from "@/lib/data";
import { requireLocale } from "@/lib/locale";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; organization: string; program: string }>;
}) {
  const { locale: rawLocale, organization, program } = await params;
  const locale = requireLocale(rawLocale);
  if (organization !== "kgc" || program !== "national") notFound();
  const ar = locale === "ar";

  return (
    <main id="main-content" className="chaptered-project">
      <section className="project-title-page">
        <div className="project-title-folio"><span>01</span><strong>{ar ? "مشروع / تعليم" : "PROJECT / EDUCATION"}</strong></div>
        <img src={media.kgc.logo} alt="" />
        <h1>KGC<br/>National</h1>
        <p>{ar ? "هوية مدرسية تتطور عبر أربع مراحل من دون أن تفقد الإحساس بأنها برنامج واحد." : "A school identity that evolves across four stages without losing the sense of one coordinated program."}</p>
        <span className="title-page-year">ALEXANDRIA / REVIEW 2026</span>
      </section>

      <section className="project-chapter project-chapter-context sc-section" data-sc-act="flow" data-sc-drift="#f3f0e8">
        <aside><span>02</span><strong>{ar ? "المؤسسة" : "ORGANIZATION"}</strong></aside>
        <figure data-sc-reveal={ar ? "right" : "left"} data-sc-reveal-at="0.08 0.70">
          <img src={media.kgc.campus} alt={ar ? "مبنى KGC في الإسكندرية" : "KGC campus in Alexandria"} />
          <figcaption>KGC / ALEXANDRIA</figcaption>
        </figure>
        <div className="project-chapter-copy" data-sc-in>
          <h2>{ar ? "ابدأ بالمكان والناس قبل القطعة." : "Start with the place and people before the garment."}</h2>
          <p>{ar ? "البرنامج ليس مجموعة قمصان متشابهة. هو لغة بصرية يجب أن تبقى مفهومة عبر العمر والمرحلة والاستخدام اليومي." : "The program is not a pile of similar shirts. It is a visual language that needs to survive age, stage and daily use."}</p>
        </div>
      </section>

      <section className="project-chapter project-chapter-stages" data-sc-act="flow" data-sc-drift="#eef0ee">
        <aside><span>03</span><strong>{ar ? "البرنامج" : "PROGRAM"}</strong></aside>
        <header data-sc-in>
          <h2>{ar ? "أربع مراحل، من دون أربع هويات منفصلة." : "Four stages, without four disconnected identities."}</h2>
        </header>
        <div className="chapter-stage-grid">
          {stages.map((stage, index) => (
            <figure key={stage.id} data-sc-in>
              <img src={stage.image} alt={stage.name[locale]} />
              <figcaption><span>0{index + 1}</span><strong>{stage.name[locale]}</strong><small>{stage.line[locale]}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="project-continuity-spread sc-section" data-sc-act="flow" data-sc-drift="#f3f0e8">
        <aside><span>04</span><strong>{ar ? "الاستمرارية" : "CONTINUITY"}</strong></aside>
        <div className="continuity-worn" data-sc-reveal="up" data-sc-reveal-at="0.08 0.70">
          <img src={media.kgc.high} alt={ar ? "إطلالة High الصيفية" : "High summer worn look"} />
          <span>{ar ? "سياق الارتداء" : "WORN"}</span>
        </div>
        <div className="continuity-line" aria-hidden="true" />
        <div className="continuity-garment" data-sc-reveal="up" data-sc-reveal-at="0.22 0.86">
          <img src={media.kgc.poloFront} alt={ar ? "قميص High الصيفي" : "High summer polo"} />
          <span>{ar ? "القطعة نفسها" : "GARMENT"}</span>
        </div>
        <div className="continuity-copy" data-sc-in>
          <h2>{ar ? "لا نعيد تشغيل القصة عندما نصل إلى المنتج." : "The story does not restart when we reach the product."}</h2>
          <p>{ar ? "القطعة المعزولة يجب أن تظل مرتبطة بالشخص والمرحلة والبرنامج الذي جاءت منه." : "The isolated garment stays connected to the wearer, stage and program it came from."}</p>
        </div>
      </section>

      <section className="project-inspection-chapter sc-section" data-sc-act="flow" data-sc-drift="#ede9df">
        <aside><span>05</span><strong>{ar ? "المعاينة" : "INSPECTION"}</strong></aside>
        <AtelierInspector locale={locale} />
      </section>

      <section className="project-colophon sc-section" data-sc-act="flow" data-sc-drift="#142b49">
        <span className="micro-label" data-sc-in>06 / {ar ? "التالي" : "NEXT"}</span>
        <h2 data-sc-in>{ar ? "برنامجك لن يبدو مثل KGC. وهذه هي الفكرة." : "Your program should not look like KGC. That is the point."}</h2>
        <p data-sc-in>{ar ? "نبني منظومة حول مؤسستك، لا نعيد استخدام هوية مشروع سابق." : "We build the system around your organization instead of recycling a previous client identity."}</p>
        <a href={`/${locale}/enquiry?context=kgc-national-high-summer`} data-sc-in>{ar ? "ناقش برنامجك" : "Discuss your program"} ↗</a>
        <EditorialFooter locale={locale} inverted />
      </section>
    </main>
  );
}
