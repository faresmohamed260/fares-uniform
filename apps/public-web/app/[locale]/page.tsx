import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { createEnquiryFormToken } from "@/lib/enquiry-form-token";
import { PatternMaterialStudy } from "@/components/pattern-material-study";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { requirePublicLocale } from "@/lib/locale";
import { publicMetadata } from "@/lib/metadata";
import { getCatalog } from "@/lib/public-data";
import { getV2Home, getV2Project } from "@/lib/public-v2";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    organization?: string;
    program?: string;
    role?: string;
    look?: string;
    garment?: string;
  }>;
};

const copy = {
  en: { badge: "Uniform programs · Alexandria", hero: "Designed as one. Worn together.", sub: "Coordinated uniform programs designed and manufactured in Egypt for organizations and teams.", explore: "Explore our work", talk: "Discuss your program", selected: "Selected work", selectedTitle: "Uniform systems shaped around the people who wear them.", catalog: "Product catalog", catalogTitle: "A practical starting point for your next uniform program.", view: "View program", process: "From first idea to finished handover", steps: ["Understand the team", "Shape the design", "Review a sample", "Manufacture & deliver"], trust: "Made for teams that need consistency without losing character." },
  ar: { badge: "برامج زي موحد · الإسكندرية", hero: "مصمّم كمنظومة واحدة. يُرتدى بروح واحدة.", sub: "برامج زي موحّد متكاملة، مصمّمة ومُصنّعة في مصر للمؤسسات والفرق.", explore: "استكشف أعمالنا", talk: "ناقش برنامجك معنا", selected: "أعمال مختارة", selectedTitle: "منظومات زي تُصمَّم حول الأشخاص الذين يرتدونها.", catalog: "كتالوج المنتجات", catalogTitle: "نقطة بداية عملية لبرنامج الزي القادم.", view: "عرض البرنامج", process: "من الفكرة الأولى إلى التسليم", steps: ["نفهم الفريق", "نصوغ التصميم", "نراجع العينة", "نصنّع ونسلّم"], trust: "مصمم للفرق التي تحتاج إلى التناسق دون أن تفقد شخصيتها." },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requirePublicLocale((await params).locale);
  return publicMetadata(locale, "", locale === "ar" ? "Fares Uniform | برامج زي موحّد متكاملة" : "Fares Uniform | Coordinated uniform programs", locale === "ar" ? "تصميم وتصنيع برامج زي موحّد للمؤسسات والفرق." : "Design and manufacturing of coordinated uniform programs for organizations and teams.");
}

async function enquiryPrefill(
  locale: "en" | "ar",
  query: Awaited<Props["searchParams"]>,
) {
  if (!query.organization || !query.program) return undefined;
  const project = await getV2Project(query.organization, query.program, locale);
  if (!project) return undefined;

  const cohort = query.role
    ? project.cohorts.find((item) => item.slug === query.role)
    : undefined;
  const look = query.look
    ? project.looks.find(
        (item) =>
          item.slug === query.look &&
          (!cohort || item.cohorts.includes(cohort.slug)),
      )
    : undefined;
  const garment = query.garment
    ? project.garments.find(
        (item) =>
          item.slug === query.garment &&
          (!look || look.garments.includes(item.slug)),
      )
    : undefined;

  const context = [cohort?.label, look?.label, garment?.name].filter(Boolean).join(" · ");
  return {
    organization: project.organization.name,
    sector: project.organization.sector,
    message: context || project.program.title,
  };
}

export default async function Home({ params, searchParams }: Props) {
  const locale = requirePublicLocale((await params).locale);
  const query = await searchParams;
  const text = copy[locale];
  const formToken = createEnquiryFormToken();
  const [homeData, items, prefill] = await Promise.all([
    getV2Home(locale),
    getCatalog(locale),
    enquiryPrefill(locale, query),
  ]);
  return <>
    <SiteHeader locale={locale} />
    <main id="main-content">
      <div className="ambient" aria-hidden="true"><div className="ambient-orb orb-one" data-testid="ambient-orb"/><div className="ambient-orb orb-two"/></div>
      <section className="hero" data-testid="pattern-hero">
        <div className="hero-copy">
          <span className="pill">{text.badge}</span>
          <h1>{text.hero}</h1>
          <p>{text.sub}</p>
          <div className="hero-actions">
            <Link className="primary-button" href={`/${locale}/work`}>{text.explore}<span aria-hidden="true">↘</span></Link>
            <a className="secondary-button" href="#enquiry">{text.talk}</a>
          </div>
        </div>
        <PatternMaterialStudy />
      </section>
      <section className="work-section" aria-labelledby="selected-work-title"><span className="eyebrow">{text.selected}</span><div className="section-heading"><h2 id="selected-work-title">{text.selectedTitle}</h2><span className="section-count">0{homeData.featured_work.length}</span></div><div className="work-grid">{homeData.featured_work.map((item) => <article className="work-card" key={`${item.organization.slug}/${item.program.slug}`}><div><span className="work-meta">{item.organization.sector}</span><h3>{item.organization.name} · {item.program.title}</h3><p>{item.program.summary}</p></div><Link className="text-link" href={`/${locale}/work/${item.organization.slug}/${item.program.slug}`}>{text.view}<b aria-hidden="true">↗</b></Link></article>)}</div></section>
      <section className="catalog-section" id="catalog"><div className="section-heading"><div><span className="eyebrow">{text.catalog}</span><h2>{text.catalogTitle}</h2></div><span className="section-count">0{items.length}</span></div><div className="catalog-grid">{items.map((item, index) => <article className="catalog-card" key={item.slug}><Link href={`/${locale}/catalog/${encodeURIComponent(item.slug)}`} aria-label={`${text.view}: ${item.name}`}><div className="catalog-image">{item.image_url ? <Image src={item.image_url} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" unoptimized /> : <div className="image-placeholder"/>}<span className="card-number">0{index + 1}</span></div><div className="catalog-copy"><span className="sector">{item.sector}</span><h3>{item.name}</h3><p>{item.summary}</p><span className="text-link">{text.view}<b aria-hidden="true">↗</b></span></div></Link></article>)}</div></section>
      <section className="process-section"><div><span className="eyebrow">{locale === "ar" ? "طريقة العمل" : "How it moves"}</span><h2>{text.process}</h2></div><ol>{text.steps.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}</ol><p className="trust-line">{text.trust}</p></section>
      <EnquiryForm
        language={locale}
        initialOrganization={prefill?.organization}
        initialSector={prefill?.sector}
        initialMessage={prefill?.message}
        formToken={formToken}
      />
    </main>
    <SiteFooter locale={locale} />
  </>;
}
