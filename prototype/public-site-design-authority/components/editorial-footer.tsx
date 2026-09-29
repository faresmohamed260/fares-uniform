import type { Locale } from "@/lib/locale";

export function EditorialFooter({ locale, inverted = false }: { locale: Locale; inverted?: boolean }) {
  const ar = locale === "ar";
  return (
    <footer className={inverted ? "editorial-footer is-inverted" : "editorial-footer"}>
      <div className="footer-mark"><span>FARES</span><small>UNIFORM</small></div>
      <div className="footer-meta">
        <span>{ar ? "الإسكندرية · مصر" : "Alexandria · Egypt"}</span>
        <span>{ar ? "مراجعة تصميم فقط" : "Design review only"}</span>
        <span>{ar ? "لا أسعار · لا مخزون" : "No price · no stock"}</span>
      </div>
      <a href={`/${locale}/system`}>{ar ? "نظام التصميم" : "Design system"} ↗</a>
    </footer>
  );
}
