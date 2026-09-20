import Link from "next/link";
import { alternateLocale, type PublicLocale } from "@/lib/locale";

const copy = {
  en: { work: "Work", catalog: "Catalog", contact: "Start a project", language: "العربية", location: "Alexandria · Egypt", skip: "Skip to content" },
  ar: { work: "أعمالنا", catalog: "الكتالوج", contact: "ابدأ مشروعًا", language: "English", location: "الإسكندرية · مصر", skip: "انتقل إلى المحتوى" },
};

export function SiteHeader({ locale, alternatePath = "" }: { locale: PublicLocale; alternatePath?: string }) {
  const text = copy[locale];
  const other = alternateLocale(locale);
  return <>
    <a className="skip-link" href="#main-content">{text.skip}</a>
    <header className="site-header">
      <Link className="brand" href={`/${locale}`}><span className="brand-mark" aria-hidden="true">FU</span><span>Fares Uniform</span></Link>
      <nav aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
        <Link href={`/${locale}/work`}>{text.work}</Link>
        <Link href={`/${locale}#catalog`}>{text.catalog}</Link>
        <Link className="nav-cta" href={`/${locale}#enquiry`}>{text.contact}</Link>
        <Link className="language-switch" href={`/${other}${alternatePath}`} hrefLang={other}>{text.language}</Link>
      </nav>
    </header>
  </>;
}

export function SiteFooter({ locale }: { locale: PublicLocale }) {
  return <footer><span>Fares Uniform</span><span>{copy[locale].location}</span></footer>;
}
