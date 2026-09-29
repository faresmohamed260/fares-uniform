import { EditorialFooter } from "@/components/editorial-footer";
import { ReviewForm } from "@/components/review-form";
import { copy } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function EnquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ context?: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const query = await searchParams;
  const t = copy[locale];
  const ar = locale === "ar";
  const hasContext = Boolean(query.context);

  return (
    <main id="main-content" className="enquiry-page">
      <div className="enquiry-lead">
        <span className="kicker">{ar ? "ابدأ برنامجاً" : "Start a program"}</span>
        <h1>{t.enquiryTitle}</h1>
        <p>{t.enquiryBody}</p>
        {hasContext && (
          <div className="context-ticket">
            <span>{ar ? "السياق القادم من التصفح" : "Browsing context"}</span>
            <strong>KGC National · High · Summer · Polo</strong>
            <small>{ar ? "هذا سياق مراجعة فقط؛ في الإنتاج يأتي من المشروع الحقيقي." : "Review context only; production context comes from the real project state."}</small>
          </div>
        )}
      </div>
      <ReviewForm locale={locale} />
      <aside className="enquiry-direct">
        <span>{ar ? "أو تواصل مباشرة" : "Or contact directly"}</span>
        <div><strong>WhatsApp</strong><span>{ar ? "مسار اتصال واضح" : "clear contact route"}</span></div>
        <div><strong>{ar ? "الهاتف" : "Phone"}</strong><span>{ar ? "بدون حاجز رقمي" : "no digital gate"}</span></div>
      </aside>
      <div className="enquiry-footer"><EditorialFooter locale={locale} /></div>
    </main>
  );
}
