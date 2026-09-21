import { AtelierInspector } from "@/components/atelier-inspector";
import { EditorialFooter } from "@/components/editorial-footer";
import { media, processSteps, sectors, stages } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const ar = locale === "ar";

  return (
    <main id="main-content" className="pattern-assembly">
      <span data-sc-progress className="stitch-progress" aria-hidden="true" />
      <div className="sc-grain" aria-hidden="true" />

      <section className="assembly-hero" data-sc-act="flow" data-sc-drift="#f3f0e8" data-testid="scrollcraft-hero">
        <div className="hero-context-plane" data-sc-parallax="-0.06" aria-hidden="true">
          <img src={media.kgc.campus} alt="" />
        </div>
        <div className="hero-garment-plane" data-sc-parallax="0.08" aria-hidden="true">
          <img src={media.kgc.poloFront} alt="" />
        </div>
        <div className="hero-type-plane">
          <span className="micro-label" data-sc-in>{ar ? "برامج زي موحّد · الإسكندرية" : "Uniform programs · Alexandria"}</span>
          <h1>
            <span className="hero-line hero-line-back" data-sc-in>{ar ? "مصمّم" : "Designed"}</span>
            <span className="hero-line hero-line-front" data-sc-in>{ar ? "كمنظومة واحدة." : "as one."}</span>
            <em data-sc-in>{ar ? "يُرتدى بروح واحدة." : "Worn together."}</em>
          </h1>
          <div className="hero-brief" data-sc-in>
            <p>{ar ? "تصمّم Fares وتصنّع برامج زي متكاملة حول هوية المؤسسة وأفرادها والعمل الذي يقومون به فعلاً." : "Fares designs and manufactures coordinated uniform programs around the identity, people and real work of an organization."}</p>
            <a href={`/${locale}/enquiry`}>{ar ? "ناقش برنامج الزي" : "Discuss a uniform program"} <span>↗</span></a>
          </div>
        </div>
        <figure className="hero-person-plane" data-sc-parallax="-0.13">
          <img src={media.kgc.high} alt={ar ? "إطلالة KGC للمرحلة الثانوية الصيفية" : "KGC High summer uniform look"} />
          <figcaption><span>04</span><strong>KGC / HIGH / SUMMER</strong></figcaption>
        </figure>
        <svg className="hero-stitch" viewBox="0 0 1000 900" aria-hidden="true">
          <path d="M40 700 C260 610 320 250 520 300 S760 690 960 120" pathLength="1" />
        </svg>
        <div className="hero-proof-line" aria-hidden="true"><span>REAL REVIEW MEDIA</span><span>01 / 08</span></div>
      </section>

      <section className="identity-act" data-sc-act="pin" data-sc-span="1.7" data-sc-drift="#11110f">
        <div data-sc-stage className="identity-stage">
          <div className="identity-index"><span>02</span><strong>{ar ? "قبل القطعة" : "Before the garment"}</strong></div>
          <div className="identity-copy">
            <p data-sc-cue="0.02 0.32">{ar ? "الزي يبدأ من هوية المؤسسة." : "A uniform starts with the organization."}</p>
            <p data-sc-cue="0.26 0.59">{ar ? "ثم الأشخاص والأدوار والحركة." : "Then the people, roles and movement."}</p>
            <p data-sc-cue="0.53 0.86">{ar ? "بعدها فقط تصبح القطعة جزءاً من نظام." : "Only then does a garment become part of a system."}</p>
            <p data-sc-cue="0.80" data-sc-kinetic="words">{ar ? "هوية ← أشخاص ← إطلالة ← قطعة" : "Identity → people → look → garment"}</p>
          </div>
          <div className="identity-objects" aria-hidden="true">
            <img className="identity-campus" data-sc-cue="0.02 0.33" src={media.kgc.campus} alt="" />
            <img className="identity-person" data-sc-cue="0.27 0.62" src={media.kgc.high} alt="" />
            <img className="identity-garment" data-sc-cue="0.56" src={media.kgc.poloFront} alt="" />
          </div>
          <span className="identity-stitch" aria-hidden="true" />
        </div>
      </section>

      <section className="program-pan" data-sc-act="pan" data-sc-span="2.4" data-sc-drift="#142b49" aria-labelledby="program-pan-title">
        <div data-sc-stage className="program-pan-stage">
          <div className="program-pan-title">
            <span className="micro-label">KGC NATIONAL / {ar ? "برنامج واحد" : "ONE PROGRAM"}</span>
            <h2 id="program-pan-title">{ar ? "أربع مراحل. لغة واحدة تتطور معها." : "Four stages. One language that grows with them."}</h2>
          </div>
          <div className="program-rail" data-sc-pan="0.03">
            {stages.map((stage, index) => (
              <article className="program-rail-item" key={stage.id}>
                <span className="rail-number">0{index + 1}</span>
                <figure>
                  <img src={stage.image} alt={stage.name[locale]} />
                </figure>
                <div>
                  <strong>{stage.name[locale]}</strong>
                  <p>{stage.line[locale]}</p>
                </div>
              </article>
            ))}
            <article className="program-rail-end">
              <img src={media.kgc.logo} alt="" />
              <span>{ar ? "برنامج حقيقي للمراجعة" : "Real program / review scope"}</span>
              <a href={`/${locale}/work/kgc/national`}>{ar ? "ادخل المشروع" : "Enter the project"} ↗</a>
            </article>
          </div>
        </div>
      </section>

      <section className="quiet-transition sc-section" data-sc-act="flow" data-sc-drift="#f3f0e8">
        <div className="quiet-transition-inner">
          <span className="micro-label" data-sc-in>04 / {ar ? "الانتقال" : "HANDOFF"}</span>
          <p data-sc-in>{ar ? "الإطلالة ليست صورة نهائية. إنها نقطة الحقيقة التي تقودنا إلى القطعة نفسها." : "The worn look is not the end image. It is the truth anchor that leads us to the garment itself."}</p>
          <div className="quiet-image" data-sc-reveal={ar ? "right" : "left"} data-sc-reveal-at="0.12 0.78">
            <img src={media.kgc.high} alt="" />
          </div>
        </div>
      </section>

      <section className="seam-handoff" data-sc-act="pin" data-sc-span="3.2" data-sc-drift="#f7f5ef" data-testid="seam-handoff">
        <div data-sc-stage className="seam-stage">
          <div className="seam-meta"><span>05</span><strong>{ar ? "ذروة التجربة" : "THE HANDOFF"}</strong></div>

          <div className="seam-copy seam-copy-a" data-sc-cue="0.02 0.32">
            <span className="micro-label">{ar ? "سياق الارتداء" : "WORN CONTEXT"}</span>
            <h2>{ar ? "ابدأ بالشخص." : "Start with the person."}</h2>
          </div>
          <div className="seam-copy seam-copy-b" data-sc-cue="0.37 0.68">
            <span className="micro-label">{ar ? "نفس البرنامج" : "SAME PROGRAM"}</span>
            <h2>{ar ? "اتبع خط القطعة." : "Follow the garment."}</h2>
          </div>
          <div className="seam-copy seam-copy-c" data-sc-cue="0.70">
            <span className="micro-label">{ar ? "القطعة الحقيقية" : "THE REAL GARMENT"}</span>
            <h2>{ar ? "الآن افحص ما رأيته." : "Now inspect what you saw."}</h2>
          </div>

          <figure className="handoff-worn">
            <img src={media.kgc.high} alt={ar ? "إطلالة KGC High الصيفية" : "KGC High summer worn look"} />
            <figcaption>KGC / HIGH / SUMMER</figcaption>
          </figure>
          <figure className="handoff-garment">
            <img src={media.kgc.poloFront} alt={ar ? "قميص KGC High الصيفي من الأمام" : "KGC High summer polo front"} />
            <figcaption>{ar ? "الصورة الأصلية · أمام" : "ORIGINAL PACKSHOT / FRONT"}</figcaption>
          </figure>

          <svg className="seam-signature" viewBox="0 0 1600 900" aria-hidden="true">
            <path d="M80 720 C380 680 480 240 780 330 C1010 398 1035 710 1510 120" pathLength="1" />
          </svg>
          <span className="seam-node seam-node-a" aria-hidden="true" />
          <span className="seam-node seam-node-b" aria-hidden="true" />

          <a className="seam-inspect-link" href="#inspection">{ar ? "افحص القطعة" : "Inspect the garment"} <span>↘</span></a>
        </div>
      </section>

      <div id="inspection" className="inspection-chapter sc-section" data-sc-act="flow" data-sc-drift="#ede9df">
        <AtelierInspector locale={locale} />
      </div>

      <section id="process" className="process-chapter sc-section" data-sc-act="flow" data-sc-drift="#0e0f0f">
        <div className="process-intro" data-sc-in>
          <span className="micro-label">06 / {ar ? "المادة" : "SUBSTANCE"}</span>
          <h2>{ar ? "الصورة مهمة. ما وراءها أهم." : "The image matters. What holds it together matters more."}</h2>
        </div>
        <div className="process-ledger" data-sc-stagger="75">
          {processSteps.map((step) => (
            <article key={step.number} data-sc-in>
              <span>{step.number}</span>
              <h3>{step.title[locale]}</h3>
              <p>{step.copy[locale]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="capability-pan" data-sc-act="pan" data-sc-span="1.6" data-sc-drift="#d8d0c2">
        <div data-sc-stage className="capability-stage">
          <div className="capability-heading">
            <span className="micro-label">07 / {ar ? "المدى" : "RANGE"}</span>
            <h2>{ar ? "نظام واحد. مؤسسات مختلفة. لا هوية عامة." : "One system. Different organizations. Never one generic identity."}</h2>
          </div>
          <div className="capability-rail" data-sc-pan="0.03">
            {sectors.map((sector, index) => (
              <div className="capability-item" key={sector.en}>
                <span>0{index + 1}</span>
                <strong>{sector[locale]}</strong>
              </div>
            ))}
            <div className="capability-truth">
              <span>{ar ? "قطاعات قدرة" : "CAPABILITY, NOT FICTIONAL CLIENTS"}</span>
              <p>{ar ? "تظهر المشاريع عندما تتوفر مادة حقيقية وحق مراجعة أو نشر واضح." : "Projects enter the archive only when real material and a clear review/publication basis exist."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="assembly-close sc-section" data-sc-act="flow" data-sc-drift="#f3f0e8">
        <div className="close-stitch" aria-hidden="true" />
        <span className="micro-label" data-sc-in>08 / {ar ? "الخطوة التالية" : "COMMITMENT"}</span>
        <h2 data-sc-cue="0.10" data-sc-kinetic="lines">{ar ? "ابدأ بفريقك. لا بقالب جاهز." : "Start with your team. Not a template."}</h2>
        <p data-sc-in>{ar ? "أخبرنا بمن سيرتدي الزي، أين يعمل، وما الذي يجب أن يظل مميزاً لهويتكم." : "Tell us who will wear it, where they work, and what must remain unmistakably yours."}</p>
        <a className="close-action" href={`/${locale}/enquiry`} data-sc-in>{ar ? "ناقش برنامج الزي" : "Discuss a uniform program"} <span>↗</span></a>
        <EditorialFooter locale={locale} />
      </section>
    </main>
  );
}
