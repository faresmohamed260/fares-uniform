import { AtelierInspector } from "@/components/atelier-inspector";
import { EditorialFooter } from "@/components/editorial-footer";
import { media } from "@/lib/data";
import { requireLocale } from "@/lib/locale";
import { notFound } from "next/navigation";

export default async function GarmentPage({ params }: { params: Promise<{ locale: string; garment: string }> }) {
  const { locale: rawLocale, garment } = await params;
  const locale = requireLocale(rawLocale);
  if (garment !== "high-summer-polo") notFound();
  const ar = locale === "ar";

  return (
    <main id="main-content" className="garment-atelier">
      <section className="garment-context-spread" data-sc-act="flow" data-sc-drift="#f3f0e8">
        <div className="garment-context-copy">
          <span className="micro-label">KGC NATIONAL / HIGH / SUMMER</span>
          <h1>{ar ? "من الإطلالة إلى القطعة، من دون فقد السياق." : "From worn look to garment, without losing context."}</h1>
          <p>{ar ? "هذه المعاينة تستخدم فقط الصور الحقيقية الحالية: سياق الارتداء والصورة الأمامية والخلفية المطابقتان." : "This inspection uses only the current real sources: the worn context and its matched front/back packshots."}</p>
          <a href={`/${locale}/work/kgc/national`}>{ar ? "العودة إلى البرنامج" : "Back to the program"} ↗</a>
        </div>
        <figure data-sc-reveal={ar ? "left" : "right"} data-sc-reveal-at="0.05 0.68">
          <img src={media.kgc.high} alt={ar ? "سياق ارتداء قميص High الصيفي" : "Worn context for the High summer polo"} />
          <figcaption>{ar ? "نقطة الحقيقة / إطلالة مرتداة" : "TRUTH ANCHOR / WORN LOOK"}</figcaption>
        </figure>
      </section>

      <section className="garment-technical sc-section" data-sc-act="flow" data-sc-drift="#ede9df">
        <AtelierInspector locale={locale} />
      </section>

      <section className="garment-truth-note sc-section" data-sc-act="flow">
        <span className="micro-label" data-sc-in>{ar ? "حدود الحقيقة" : "TRUTH BOUNDARY"}</span>
        <h2 data-sc-in>{ar ? "إذا لم نملك طبقة حقيقية، لا نخترعها." : "If we do not have a real layer, we do not invent one."}</h2>
        <p data-sc-in>{ar ? "يمكن إضافة عرض تركيبي حقيقي عندما تتوفر صور منفصلة أو هندسة فعلية تدعمه. حتى ذلك الوقت، التفاصيل تأتي من المصدر الفوتوغرافي نفسه." : "A true construction view can be added when separated source photography or real geometry supports it. Until then, detail comes from the photographic source itself."}</p>
        <a href={`/${locale}/enquiry?context=kgc-national-high-summer-polo`} data-sc-in>{ar ? "ابدأ من هذه القطعة" : "Start from this garment"} ↗</a>
        <EditorialFooter locale={locale} />
      </section>
    </main>
  );
}
