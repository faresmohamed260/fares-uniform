import Link from "next/link";
import { GarmentInspector } from "@/components/garment-inspector";
import { ProgramHero } from "@/components/program-hero";
import { Reveal } from "@/components/reveal";
import { copy, media, processSteps, sectors, stages } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = copy[locale];

  return (
    <main id="main-content">
      <ProgramHero locale={locale} />

      <section className="program-principle">
        <Reveal className="principle-lead">
          <span className="kicker">{t.systemKicker}</span>
          <h2>{t.systemTitle}</h2>
          <p>{t.systemBody}</p>
        </Reveal>
        <div className="principle-grid">
          {[
            [locale === "ar" ? "هوية" : "Identity", locale === "ar" ? "ألوان وتفاصيل ونبرة تخص المؤسسة." : "Colour, detail and tone that belong to the organization."],
            [locale === "ar" ? "أشخاص" : "People", locale === "ar" ? "الأدوار والمراحل تُرى كفريق واحد." : "Roles and stages are seen as one coordinated team."],
            [locale === "ar" ? "استمرارية" : "Continuity", locale === "ar" ? "الإطلالة والقطعة والتفاصيل تبقى مترابطة." : "Worn look, garment and detail stay visually connected."],
          ].map(([title, body], index) => (
            <Reveal className="principle-item" delay={index * 0.06} key={title}>
              <span>0{index + 1}</span><h3>{title}</h3><p>{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="selected-project" aria-labelledby="selected-project-title">
        <div className="project-backdrop">
          <img src={media.kgc.campus} alt={locale === "ar" ? "مبنى KGC في الإسكندرية" : "KGC campus in Alexandria"} />
          <div className="project-backdrop-shade" />
          <div className="project-identity">
            <img src={media.kgc.logo} alt="" />
            <span>KGC · National</span>
          </div>
        </div>
        <div className="project-story-card">
          <span className="kicker">{t.selectedWork}</span>
          <h2 id="selected-project-title">{t.selectedWorkTitle}</h2>
          <p>{t.selectedWorkBody}</p>
          <div className="stage-miniatures" aria-label={locale === "ar" ? "المراحل الأربع" : "Four stages"}>
            {stages.map((stage) => <img key={stage.id} src={stage.image} alt={stage.name[locale]} />)}
          </div>
          <Link className="button button-paper" href={`/${locale}/work/kgc/national`}>{t.viewProject}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="garment-continuity">
        <Reveal className="continuity-copy">
          <span className="kicker">{t.garmentKicker}</span>
          <h2>{t.garmentTitle}</h2>
          <p>{t.garmentBody}</p>
          <Link className="inline-arrow" href={`/${locale}/garments/high-summer-polo`}>{t.inspect}<span aria-hidden="true">↗</span></Link>
        </Reveal>
        <Reveal className="continuity-inspector" delay={0.08}><GarmentInspector locale={locale} compact /></Reveal>
      </section>

      <section className="process" id="process" aria-labelledby="process-title">
        <Reveal className="process-heading">
          <span className="kicker">{t.processKicker}</span>
          <h2 id="process-title">{t.processTitle}</h2>
        </Reveal>
        <div className="process-list">
          {processSteps.map((step, index) => (
            <Reveal key={step.number} className="process-row" delay={index * 0.035}>
              <span>{step.number}</span>
              <h3>{step.title[locale]}</h3>
              <p>{step.copy[locale]}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sector-breadth">
        <div className="sector-intro">
          <span className="kicker">{t.sectorsKicker}</span>
          <h2>{t.sectorsTitle}</h2>
        </div>
        <div className="sector-lines">
          {sectors.map((sector, index) => (
            <div key={sector.en}><span>0{index + 1}</span><strong>{sector[locale]}</strong><i aria-hidden="true">↗</i></div>
          ))}
        </div>
        <p className="truth-note">{locale === "ar" ? "هذه قطاعات قدرة وليست ادعاءات بوجود عملاء منشورين." : "These are capability sectors, not claims of published client work."}</p>
      </section>

      <section className="closing-cta">
        <span className="closing-index">05</span>
        <div>
          <h2>{t.closingTitle}</h2>
          <p>{t.closingBody}</p>
        </div>
        <Link className="button button-dark" href={`/${locale}/enquiry`}>{t.closingCta}<span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}
