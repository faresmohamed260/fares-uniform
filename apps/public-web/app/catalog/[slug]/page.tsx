import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentLocale } from "@/components/document-locale";
import { EnquiryForm } from "@/components/enquiry-form";
import { getCatalogItem, type PublicLanguage } from "@/lib/public-data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };

export default async function CatalogDetail({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const language: PublicLanguage = query.lang === "ar" ? "ar" : "en";
  const item = await getCatalogItem(slug, language);
  if (!item) notFound();
  const ar = language === "ar";
  return <main lang={language} dir={ar ? "rtl" : "ltr"} className="detail-page"><DocumentLocale language={language}/><header className="site-header"><Link className="brand" href={`/?lang=${language}`}><span className="brand-mark">FU</span><span>Fares Uniform</span></Link><nav><Link href={`/?lang=${language}#catalog`}>{ar ? "العودة للكتالوج" : "Back to catalog"}</Link><Link className="language-switch" href={`/catalog/${encodeURIComponent(slug)}?lang=${ar ? "en" : "ar"}`}>{ar ? "EN" : "العربية"}</Link></nav></header><section className="detail-hero"><div className="detail-image">{item.image_url ? <Image src={item.image_url} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized/> : <div className="image-placeholder"/>}</div><div className="detail-copy"><span className="eyebrow">{item.sector}</span><h1>{item.name}</h1><p>{item.summary}</p><a className="primary-button" href="#enquiry">{ar ? "استفسر عن هذا البرنامج" : "Enquire about this program"}<span aria-hidden="true">↘</span></a></div></section><EnquiryForm language={language} sourceProductSlug={item.slug}/><footer><span>Fares Uniform</span><span>{ar ? "الإسكندرية · مصر" : "Alexandria · Egypt"}</span></footer></main>;
}
