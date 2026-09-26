import Link from "next/link";
import { alternateLocale, type PublicLocale } from "@/lib/locale";

const copy = {
  en: {
    work: "Work",
    catalog: "Programs",
    process: "Process",
    contact: "Start a project",
    language: "العربية",
    location: "Alexandria · Egypt",
    skip: "Skip to content",
  },
  ar: {
    work: "أعمالنا",
    catalog: "البرامج",
    process: "العملية",
    contact: "ابدأ مشروعًا",
    language: "English",
    location: "الإسكندرية · مصر",
    skip: "انتقل إلى المحتوى",
  },
};

export function SiteHeader({ locale, alternatePath = "" }: { locale: PublicLocale; alternatePath?: string }) {
  const text = copy[locale];
  const other = alternateLocale(locale);
  return <>
    <a className="skip-link" href="#main-content">{text.skip}</a>
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="Fares Uniform">
        <span className="brand-wordmark" aria-hidden="true">
          <strong>FARES</strong>
          <small>UNIFORM</small>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
        <Link href={`/${locale}/work`}>{text.work}</Link>
        <Link href={`/${locale}#catalog`}>{text.catalog}</Link>
        <Link href={`/${locale}#process`}>{text.process}</Link>
        <Link className="language-switch" href={`/${other}${alternatePath}`} hrefLang={other}>{text.language}</Link>
        <Link className="nav-cta" href={`/${locale}#enquiry`}>{text.contact}<span aria-hidden="true">→</span></Link>
      </nav>
      <div className="mobile-header-actions">
        <Link className="mobile-quick-cta" href={`/${locale}#enquiry`} aria-label={text.contact}><span aria-hidden="true">↗</span></Link>
        <Link className="language-switch" href={`/${other}${alternatePath}`} hrefLang={other}>{text.language}</Link>
        <details className="mobile-menu">
          <summary aria-label={locale === "ar" ? "افتح قائمة التنقل" : "Open navigation menu"}>
            <span /><span /><span />
          </summary>
          <nav className="mobile-menu-panel" aria-label={locale === "ar" ? "قائمة الموقع" : "Mobile navigation"}>
            <Link href={`/${locale}/work`}>{text.work}<span aria-hidden="true">↗</span></Link>
            <Link href={`/${locale}#catalog`}>{text.catalog}<span aria-hidden="true">↘</span></Link>
            <Link href={`/${locale}#process`}>{text.process}<span aria-hidden="true">↘</span></Link>
            <Link className="nav-cta" href={`/${locale}#enquiry`}>{text.contact}<span aria-hidden="true">→</span></Link>
          </nav>
        </details>
      </div>
    </header>
  </>;
}

export function SiteFooter({ locale }: { locale: PublicLocale }) {
  return <footer><span>Fares Uniform</span><span>{copy[locale].location}</span></footer>;
}
