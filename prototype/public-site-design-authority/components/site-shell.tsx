import Link from "next/link";
import type { ReactNode } from "react";
import { copy } from "@/lib/data";
import { otherLocale, type Locale } from "@/lib/locale";

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = copy[locale];
  const alt = otherLocale(locale);
  return (
    <>
      <a className="skip-link" href="#main-content">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      <header className="site-header">
        <Link className="wordmark" href={`/${locale}`} aria-label="Fares Uniform home">
          <span className="wordmark-main">FARES</span>
          <span className="wordmark-sub">UNIFORM</span>
        </Link>
        <nav aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
          <Link href={`/${locale}/work`}>{t.navWork}</Link>
          <Link href={`/${locale}/garments`}>{t.navGarments}</Link>
          <Link href={`/${locale}#process`}>{t.navProcess}</Link>
        </nav>
        <div className="header-actions">
          <Link className="language-link" href={`/${alt}`} lang={alt}>{alt.toUpperCase()}</Link>
          <Link className="header-cta" href={`/${locale}/enquiry`}>{t.navEnquire}<span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <div className="review-ribbon"><span>{t.reviewLabel}</span></div>
      {children}
      <footer className="site-footer">
        <div><strong>FARES UNIFORM</strong><span>{locale === "ar" ? "الإسكندرية · مصر" : "Alexandria · Egypt"}</span></div>
        <div className="footer-links">
          <Link href={`/${locale}/system`}>{locale === "ar" ? "نظام المراجعة" : "Review system"}</Link>
          <Link href={`/${locale}/enquiry`}>{t.navEnquire}</Link>
        </div>
        <p>{locale === "ar" ? "معاينة تصميم فقط · لا أسعار ولا مخزون" : "Design review only · no prices or stock"}</p>
      </footer>
    </>
  );
}
