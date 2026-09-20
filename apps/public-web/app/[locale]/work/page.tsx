import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { requirePublicLocale } from "@/lib/locale";
import { publicMetadata } from "@/lib/metadata";
import { getV2Work } from "@/lib/public-v2";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requirePublicLocale((await params).locale);
  return publicMetadata(locale, "work", locale === "ar" ? "أعمالنا | Fares Uniform" : "Selected work | Fares Uniform", locale === "ar" ? "برامج زي موحّد منشورة ومعتمدة من Fares Uniform." : "Published uniform programs and selected work from Fares Uniform.");
}

export default async function WorkPage({ params }: Props) {
  const locale = requirePublicLocale((await params).locale);
  const data = await getV2Work(locale);
  const ar = locale === "ar";
  return <>
    <SiteHeader locale={locale} alternatePath="/work" />
    <main id="main-content">
      <section className="work-page-title"><span className="eyebrow">{ar ? "Fares Uniform · أعمالنا" : "Fares Uniform · Work"}</span><h1>{ar ? "أعمال مختارة" : "Selected work"}</h1><p>{ar ? "برامج زي موحّد منظّمة حول الجهة والبرنامج والأشخاص والملابس، دون بيانات تجارية أو تشغيلية." : "Uniform programs organized around the organization, program, people and garments, presented through the narrow public editorial boundary."}</p></section>
      <section className="work-section" aria-label={ar ? "المشروعات المنشورة" : "Published projects"}><div className="work-grid">{data.items.map((item) => <article className="work-card" key={`${item.organization.slug}/${item.program.slug}`}><div><span className="work-meta">{item.organization.sector}</span><h2>{item.organization.name}</h2><h3>{item.program.title}</h3></div><p>{item.program.summary}</p></article>)}</div></section>
    </main>
    <SiteFooter locale={locale} />
  </>;
}
