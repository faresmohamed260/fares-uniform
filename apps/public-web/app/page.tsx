import Image from "next/image";
import Link from "next/link";
import { DocumentLocale } from "@/components/document-locale";
import { EnquiryForm } from "@/components/enquiry-form";
import { getCatalog, type PublicLanguage } from "@/lib/public-data";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ lang?: string }> };

const copy = {
  en: { nav: "Catalog", contact: "Start a project", badge: "Uniform programs · Alexandria", hero: "Built to look like your team — and work like one.", sub: "From school communities to hospitality teams, we turn identity, fit and daily use into a coherent uniform program.", explore: "Explore programs", talk: "Start a conversation", collection: "Selected programs", collectionTitle: "A clearer starting point for your next uniform.", view: "View program", process: "From first idea to finished handover", steps: ["Understand the team", "Shape the design", "Review a sample", "Manufacture & deliver"], trust: "Made for teams that need consistency without losing character." },
  ar: { nav: "الكتالوج", contact: "ابدأ مشروعًا", badge: "برامج زي موحد · الإسكندرية", hero: "زي يعكس هوية فريقك ويواكب طريقة عمله.", sub: "من المدارس إلى فرق الضيافة، نحول الهوية والمقاس والاستخدام اليومي إلى برنامج زي متكامل وواضح.", explore: "استكشف البرامج", talk: "ابدأ الحديث", collection: "برامج مختارة", collectionTitle: "نقطة بداية أوضح لزي فريقك القادم.", view: "عرض البرنامج", process: "من الفكرة الأولى إلى التسليم", steps: ["نفهم الفريق", "نصوغ التصميم", "نراجع العينة", "نصنّع ونسلّم"], trust: "مصمم للفرق التي تحتاج إلى التناسق دون أن تفقد شخصيتها." },
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const language: PublicLanguage = params.lang === "ar" ? "ar" : "en";
  const text = copy[language];
  const items = await getCatalog(language);
  const dir = language === "ar" ? "rtl" : "ltr";
  const whatsapp = process.env.PUBLIC_WHATSAPP_URL;
  const phone = process.env.PUBLIC_PHONE_HREF;
  return (
    <main lang={language} dir={dir}>
      <DocumentLocale language={language} />
      <div className="ambient" aria-hidden="true"><div className="ambient-orb orb-one" data-testid="ambient-orb"/><div className="ambient-orb orb-two"/></div>
      <header className="site-header"><Link className="brand" href={`/?lang=${language}`}><span className="brand-mark">FU</span><span>Fares Uniform</span></Link><nav><a href="#catalog">{text.nav}</a><a className="nav-cta" href="#enquiry">{text.contact}</a><Link className="language-switch" href={`/?lang=${language === "ar" ? "en" : "ar"}`}>{language === "ar" ? "EN" : "العربية"}</Link></nav></header>
      <section className="hero"><div className="hero-copy"><span className="pill">{text.badge}</span><h1>{text.hero}</h1><p>{text.sub}</p><div className="hero-actions"><a className="primary-button" href="#catalog">{text.explore}<span aria-hidden="true">↘</span></a><a className="secondary-button" href="#enquiry">{text.talk}</a></div></div><div className="hero-art" aria-hidden="true"><div className="fabric-card fabric-a"><span>01</span></div><div className="fabric-card fabric-b"><span>FU</span></div><div className="fabric-line"/></div></section>
      <section className="catalog-section" id="catalog"><div className="section-heading"><div><span className="eyebrow">{text.collection}</span><h2>{text.collectionTitle}</h2></div><span className="section-count">0{items.length}</span></div><div className="catalog-grid">{items.map((item, index) => <article className="catalog-card" key={item.slug}><Link href={`/catalog/${encodeURIComponent(item.slug)}?lang=${language}`} aria-label={`${text.view}: ${item.name}`}><div className="catalog-image">{item.image_url ? <Image src={item.image_url} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" unoptimized /> : <div className="image-placeholder"/>}<span className="card-number">0{index + 1}</span></div><div className="catalog-copy"><span className="sector">{item.sector}</span><h3>{item.name}</h3><p>{item.summary}</p><span className="text-link">{text.view}<b aria-hidden="true">↗</b></span></div></Link></article>)}</div></section>
      <section className="process-section"><div><span className="eyebrow">{language === "ar" ? "طريقة العمل" : "How it moves"}</span><h2>{text.process}</h2></div><ol>{text.steps.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}</ol><p className="trust-line">{text.trust}</p></section>
      <EnquiryForm language={language} />
      {(whatsapp || phone) && <aside className="direct-contact" aria-label={language === "ar" ? "تواصل مباشر" : "Direct contact"}>{whatsapp && <a href={whatsapp} rel="noreferrer">WhatsApp ↗</a>}{phone && <a href={phone}>{language === "ar" ? "اتصل بنا" : "Call us"} ↗</a>}</aside>}
      <footer><span>Fares Uniform</span><span>{language === "ar" ? "الإسكندرية · مصر" : "Alexandria · Egypt"}</span></footer>
    </main>
  );
}
