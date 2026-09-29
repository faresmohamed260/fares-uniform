"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";
import { copy } from "@/lib/data";

export function MobileNav({ locale, alt }: { locale: Locale; alt: Locale }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const t = copy[locale];

  useEffect(() => {
    if (!open) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prior;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        className="mobile-nav-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={locale === "ar" ? "فتح القائمة" : "Open menu"}
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
      </button>

      {open && (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label={locale === "ar" ? "قائمة الموقع" : "Site menu"}>
          <div className="mobile-menu-top">
            <strong>FARES / UNIFORM</strong>
            <button ref={closeRef} type="button" onClick={close} aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}>×</button>
          </div>
          <nav aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
            <a onClick={close} href={`/${locale}/work`}><span>01</span>{t.navWork}</a>
            <a onClick={close} href={`/${locale}/garments`}><span>02</span>{t.navGarments}</a>
            <a onClick={close} href={`/${locale}#process`}><span>03</span>{t.navProcess}</a>
            <a onClick={close} href={`/${locale}/enquiry`}><span>04</span>{t.navEnquire}</a>
          </nav>
          <a className="mobile-language" href={`/${alt}`} lang={alt}>{alt === "ar" ? "العربية" : "English"}</a>
          <p>{locale === "ar" ? "معاينة تصميم محمية · لا أسعار ولا مخزون" : "Protected design review · no prices or stock"}</p>
        </div>
      )}
    </>
  );
}
