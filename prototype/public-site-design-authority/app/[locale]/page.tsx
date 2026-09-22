import { EditorialFooter } from "@/components/editorial-footer";
import { HomeMasterHero } from "@/components/home-master-hero";
import { HomeSectorUniverse } from "@/components/home-sector-universe";
import { media, processSteps } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

const garmentCategories = [
  ["Shirts / Polos", "قمصان / بولو"],
  ["Trousers / Skirts", "بناطيل / تنانير"],
  ["Jackets / Outerwear", "جاكيتات / ملابس خارجية"],
  ["Hospitality", "ضيافة"],
  ["Medical", "طبي"],
  ["Chef / Kitchen", "شيف / مطبخ"],
  ["Sports / PE", "رياضة"],
  ["Workwear", "ملابس عمل"],
] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const ar = locale === "ar";

  return (
    <main id="main-content" className="fares-homepage">
      <span data-sc-progress className="home-global-progress" aria-hidden="true" />
      <HomeMasterHero locale={locale} />
      <HomeSectorUniverse locale={locale} />

      <section className="home-system-chapter" data-sc-act="pin" data-sc-span="2.05" data-sc-drift="#ece7dd">
        <div data-sc-stage className="home-system-stage">
          <div className="home-system-paper" aria-hidden="true">
            <img src="/design-media/pattern-paper.svg" alt="" />
          </div>
          <div className="home-system-heading">
            <span className="home-chapter-label">03 / {ar ? "ما الذي نصمّمه فعلاً" : "WHAT WE ACTUALLY DESIGN"}</span>
            <h2>{ar ? "الزي ليس قطعة. هو نظام." : "A uniform is not one item. It is a system."}</h2>
          </div>

          <div className="home-system-steps">
            <div className="system-word word-identity" data-sc-cue="0.02 0.30">
              <span>01</span><strong>{ar ? "هوية" : "Identity"}</strong><small>{ar ? "كيف يجب أن تبدو المؤسسة؟" : "What should the organization feel like?"}</small>
            </div>
            <div className="system-word word-roles" data-sc-cue="0.22 0.50">
              <span>02</span><strong>{ar ? "أدوار" : "Roles"}</strong><small>{ar ? "من سيرتدي ماذا؟" : "Who needs to wear what?"}</small>
            </div>
            <div className="system-word word-function" data-sc-cue="0.42 0.70">
              <span>03</span><strong>{ar ? "وظيفة" : "Function"}</strong><small>{ar ? "كيف يجب أن يعمل الزي؟" : "How must the uniform work?"}</small>
            </div>
            <div className="system-word word-garment" data-sc-cue="0.62 0.90">
              <span>04</span><strong>{ar ? "قطع" : "Garments"}</strong><small>{ar ? "ما القطع التي تكوّن النظام؟" : "Which pieces make the system?"}</small>
            </div>
            <div className="system-word word-make" data-sc-cue="0.80">
              <span>05</span><strong>{ar ? "تصنيع" : "Make"}</strong><small>{ar ? "كيف يصبح التصميم واقعاً متناسقاً؟" : "How does the design become repeatable reality?"}</small>
            </div>
          </div>

          <div className="home-system-orbit" aria-hidden="true">
            <span className="orbit-core" />
            <span className="orbit-loop loop-a" />
            <span className="orbit-loop loop-b" />
            <span className="orbit-loop loop-c" />
          </div>
        </div>
      </section>

      <section className="home-selected-work" data-sc-act="flow" data-sc-drift="#142b49">
        <header className="selected-work-head">
          <span className="home-chapter-label">04 / {ar ? "عمل مختار" : "SELECTED WORK"}</span>
          <p>{ar
            ? "مشروع واحد حقيقي أفضل من شبكة مليئة بعملاء خياليين."
            : "One real project says more than a grid padded with fictional clients."}</p>
        </header>

        <div className="selected-work-stage">
          <div className="selected-work-campus" data-sc-parallax="-0.035">
            <img src={media.kgc.campus} alt={ar ? "مبنى KGC في الإسكندرية" : "KGC campus in Alexandria"} />
          </div>
          <figure className="selected-work-model" data-sc-parallax="0.055">
            <img src={media.kgc.high} alt={ar ? "إطلالة KGC للمرحلة الثانوية" : "KGC High-stage uniform look"} />
          </figure>
          <div className="selected-work-crest"><img src={media.kgc.logo} alt="" /></div>
          <div className="selected-work-copy" data-sc-in>
            <span>KGC NATIONAL / EDUCATION</span>
            <h2>{ar ? "هوية مدرسية تمتد عبر مراحل مختلفة." : "One school identity, carried across different stages."}</h2>
            <p>{ar
              ? "KGC هو مثال حقيقي على كيف يتحول برنامج زي إلى نظام متناسق، من الشخص إلى القطعة."
              : "KGC is one real example of a uniform program behaving as a coordinated system, from wearer to garment."}</p>
            <a href={`/${locale}/work/kgc/national`}>{ar ? "استكشف المشروع" : "Explore the project"} <i>↗</i></a>
          </div>
          <div className="selected-work-tag" aria-hidden="true">01 / REAL PROJECT</div>
        </div>
      </section>

      <section className="home-garment-universe" data-sc-act="pan" data-sc-span="1.85" data-sc-drift="#f6f2eb">
        <div data-sc-stage className="garment-universe-stage">
          <header>
            <span className="home-chapter-label">05 / {ar ? "عالم القطع" : "GARMENT UNIVERSE"}</span>
            <h2>{ar ? "البرنامج يتكوّن من قطع. لكن القطع لا تقود البرنامج." : "Programs are made of garments. Garments do not lead the program."}</h2>
            <a href={`/${locale}/garments`}>{ar ? "استكشف القطع" : "Explore garments"} ↗</a>
          </header>

          <div className="garment-universe-rail" data-sc-pan="0.035">
            <article className="garment-object-example">
              <span>REAL GARMENT / 01</span>
              <img src={media.kgc.poloFront} alt={ar ? "قميص بولو حقيقي للمراجعة" : "Real review polo garment"} />
              <small>{ar ? "مثال حقيقي للمراجعة" : "Real review example"}</small>
            </article>

            {garmentCategories.map(([en, arabic], index) => (
              <div className="garment-category-word" key={en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{ar ? arabic : en}</strong>
              </div>
            ))}

            <div className="garment-universe-end">
              <p>{ar
                ? "لا أسعار ولا مخزون على هذه الصفحة. الهدف هو فهم ما يمكن أن يتكوّن منه برنامج الزي."
                : "No prices or stock here. The point is to understand the vocabulary a uniform program can be built from."}</p>
              <a href={`/${locale}/garments`}>{ar ? "افتح مكتبة القطع" : "Open garment library"} ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="home-process" data-sc-act="flow" data-sc-drift="#111210">
        <div className="home-process-graphic" aria-hidden="true">
          <span className="process-arc arc-a" />
          <span className="process-arc arc-b" />
          <span className="process-cross cross-a" />
          <span className="process-cross cross-b" />
          <span className="process-coordinate">31.2001° N / 29.9187° E</span>
        </div>
        <header data-sc-in>
          <span className="home-chapter-label">06 / {ar ? "من الفكرة إلى التصنيع" : "DESIGN TO MANUFACTURING"}</span>
          <h2>{ar ? "الهوية تبدأ فكرة. يجب أن تنتهي كشيء يمكن تكراره." : "Identity starts as an idea. It has to end as something repeatable."}</h2>
        </header>
        <div className="home-process-ledger" data-sc-stagger="70">
          {[...processSteps,
            { number: "06", title: { en: "Support", ar: "دعم" }, copy: { en: "Keep the program usable when teams, sizes and reorder needs change.", ar: "نحافظ على قابلية استخدام البرنامج عندما تتغير الفرق والمقاسات وطلبات الإعادة." } }
          ].map((step) => (
            <article key={step.number} data-sc-in>
              <span>{step.number}</span>
              <h3>{step.title[locale]}</h3>
              <p>{step.copy[locale]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-craft" data-sc-act="flow" data-sc-drift="#d8c6b4">
        <div className="home-craft-field" aria-hidden="true">
          <span className="craft-fiber fiber-a" />
          <span className="craft-fiber fiber-b" />
          <span className="craft-fiber fiber-c" />
          <span className="craft-light" />
        </div>
        <div className="home-craft-copy" data-sc-in>
          <span className="home-chapter-label">07 / {ar ? "المادة والتفاصيل" : "MATERIAL / DETAIL"}</span>
          <h2>{ar ? "التفاصيل ليست زينة. هي ما يجعل الزي قابلاً للاستخدام." : "Detail is not decoration. It is what makes a uniform usable."}</h2>
          <p>{ar
            ? "اختيار القماش، موضع العلامة، المقاس، التشطيب، والطريقة التي تتكرر بها القطعة داخل البرنامج — كلها جزء من التصميم."
            : "Fabric choice, identity placement, fit, finish and how a garment repeats across a program are all part of the design problem."}</p>
        </div>
        <div className="home-craft-index">
          <div><span>01</span><strong>{ar ? "قماش" : "Fabric"}</strong></div>
          <div><span>02</span><strong>{ar ? "هوية" : "Identity application"}</strong></div>
          <div><span>03</span><strong>{ar ? "مقاس" : "Fit / sizing"}</strong></div>
          <div><span>04</span><strong>{ar ? "تشطيب" : "Finish"}</strong></div>
        </div>
      </section>

      <section className="home-close" data-sc-act="flow" data-sc-drift="#f2efe9">
        <div className="home-close-graphic" aria-hidden="true"><span /><span /><span /></div>
        <span className="home-chapter-label" data-sc-in>08 / {ar ? "ابدأ من فريقك" : "START WITH YOUR TEAM"}</span>
        <h2 data-sc-in>{ar ? "ما الذي يجب أن يرتديه فريقك — ولماذا؟" : "What should your team wear — and why?"}</h2>
        <p data-sc-in>{ar
          ? "ابدأ بالمؤسسة والأدوار والعمل الفعلي. بعدها نصل إلى القطع."
          : "Start with the organization, the roles and the real work. The garments come after."}</p>
        <div className="home-close-actions" data-sc-in>
          <a href={`/${locale}/enquiry`} className="home-close-primary">{ar ? "ناقش برنامج الزي" : "Discuss a uniform program"} <span>↗</span></a>
          <a href={`/${locale}/garments`} className="home-close-secondary">{ar ? "تصفح القطع" : "Browse garments"} <span>↗</span></a>
        </div>
        <EditorialFooter locale={locale} />
      </section>
    </main>
  );
}
