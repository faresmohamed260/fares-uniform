import type { ReactNode } from "react";
import { copy } from "@/lib/data";
import { otherLocale, type Locale } from "@/lib/locale";
import { MobileNav } from "./mobile-nav";
import { BrandWordmark } from "./brand-wordmark";

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = copy[locale];
  const alt = otherLocale(locale);

  return (
    <>
      <a className="skip-link" href="#main-content">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      <header className="site-bar">
        <a className="fares-mark" href={`/${locale}`} aria-label="Fares Uniform home">
          <BrandWordmark />
        </a>
        <nav className="desktop-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
          <a href={`/${locale}/work`}>{t.navWork}</a>
          <a href={`/${locale}/garments`}>{t.navGarments}</a>
          <a href={`/${locale}#process`}>{t.navProcess}</a>
        </nav>
        <div className="desktop-actions">
          <a className="locale-switch" href={`/${alt}`} lang={alt}>{alt.toUpperCase()}</a>
          <a className="site-action" href={`/${locale}/enquiry`}>{t.navEnquire}<span aria-hidden="true">↗</span></a>
        </div>
        <MobileNav locale={locale} alt={alt} />
      </header>
      <div className="review-badge">{t.reviewLabel}</div>
      {children}
    </>
  );
}
