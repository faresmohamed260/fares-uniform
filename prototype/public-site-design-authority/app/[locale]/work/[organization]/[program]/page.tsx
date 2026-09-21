import Link from "next/link";
import { ProgramStage } from "@/components/program-stage";
import { GarmentInspector } from "@/components/garment-inspector";
import { media } from "@/lib/data";
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
    <main id="main-content" className="project-page">
      <section className="project-hero">
        <div className="project-hero-bg"><img src={media.kgc.campus} alt={ar ? "مبنى KGC في الإسكندرية" : "KGC campus in Alexandria"} /></div>
        <div className="project-hero-copy">
          <div className="project-label"><img src={media.kgc.logo} alt="" /><span>{ar ? "مشروع مراجعة حقيقي" : "Real-media review project"}</span></div>
          <span className="kicker">{ar ? "التعليم · البرنامج الوطني" : "Education · National program"}</span>
          <h1>KGC<br/>National</h1>
          <p>{ar ? "هوية مدرسية تتطور عبر أربع مراحل من دون أن تفقد الإحساس بأنها برنامج واحد." : "A school identity that evolves across four stages without losing the sense of one coordinated program."}</p>
        </div>
        <figure className="project-hero-model"><img src={media.kgc.high} alt={ar ? "إطلالة المرحلة الثانوية الصيفية" : "High-stage summer uniform look"} /><figcaption>High · Summer</figcaption></figure>
      </section>

      <ProgramStage locale={locale} />

      <section className="project-garment-handoff">
        <div className="handoff-copy">
          <span className="kicker">{ar ? "من الشخص إلى القطعة" : "Wearer → garment"}</span>
          <h2>{ar ? "لا تتوقف القصة عندما نعزل المنتج." : "The story doesn’t reset when the garment is isolated."}</h2>
          <p>{ar ? "الإطلالة هي نقطة الحقيقة. القطعة المعزولة تكشف الشكل والتفاصيل من دون تحويل الصفحة إلى متجر." : "The worn look remains the truth anchor. The isolated garment reveals form and detail without turning the page into a storefront."}</p>
        </div>
        <GarmentInspector locale={locale} />
      </section>

      <section className="project-next">
        <div><span className="kicker">{ar ? "سياق محفوظ" : "Context preserved"}</span><h2>{ar ? "KGC · National · High · Summer" : "KGC · National · High · Summer"}</h2></div>
        <Link className="button button-dark" href={`/${locale}/enquiry?context=kgc-national-high-summer`}>{ar ? "ناقش برنامجاً مشابهاً" : "Discuss a related program"}<span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}
