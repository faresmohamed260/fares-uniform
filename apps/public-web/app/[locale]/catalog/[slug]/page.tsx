import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry-form";
import { createEnquiryFormToken } from "@/lib/enquiry-form-token";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { requirePublicLocale } from "@/lib/locale";
import { publicMetadata } from "@/lib/metadata";
import { getCatalogItem } from "@/lib/public-data";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = requirePublicLocale(rawLocale);
  const item = await getCatalogItem(slug, locale);
  if (!item) return publicMetadata(locale, `catalog/${slug}`, "Fares Uniform", "");
  return publicMetadata(locale, `catalog/${slug}`, `${item.name} | Fares Uniform`, item.summary);
}

export default async function CatalogDetail({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = requirePublicLocale(rawLocale);
  const item = await getCatalogItem(slug, locale);
  if (!item) notFound();
  const ar = locale === "ar";
  const formToken = createEnquiryFormToken();
  return <>
    <SiteHeader locale={locale} alternatePath={`/catalog/${encodeURIComponent(slug)}`} />
    <main id="main-content" className="detail-page"><section className="detail-hero"><div className="detail-image">{item.image_url ? <Image src={item.image_url} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized/> : <div className="image-placeholder"/>}</div><div className="detail-copy"><span className="eyebrow">{item.sector}</span><h1>{item.name}</h1><p>{item.summary}</p><a className="primary-button" href="#enquiry">{ar ? "استفسر عن هذا البرنامج" : "Enquire about this program"}<span aria-hidden="true">↘</span></a></div></section><EnquiryForm language={locale} sourceProductSlug={item.slug} formToken={formToken}/></main>
    <SiteFooter locale={locale} />
  </>;
}
