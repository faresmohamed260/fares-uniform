import Link from "next/link";
import { GarmentInspector } from "@/components/garment-inspector";
import { media } from "@/lib/data";
import { requireLocale } from "@/lib/locale";
import { notFound } from "next/navigation";

export default async function GarmentPage({ params }: { params: Promise<{ locale: string; garment: string }> }) {
  const { locale: rawLocale, garment } = await params;
  const locale = requireLocale(rawLocale);
  if (garment !== "high-summer-polo") notFound();
  const ar = locale === "ar";

  return (
    <main id="main-content" className="garment-page">
      <header className="garment-hero">
        <div className="garment-hero-copy">
          <span className="kicker">KGC National · High · Summer</span>
          <h1>{ar ? "قميص أكاديمي قصير الأكمام" : "Short-sleeve academic polo"}</h1>
          <p>{ar ? "معاينة تعتمد فقط على الصورة الحقيقية من الأمام والخلف وسياق الارتداء المطابق." : "An inspection grounded only in the real front/back packshots and their matched worn context."}</p>
          <Link className="inline-arrow" href={`/${locale}/work/kgc/national`}>{ar ? "العودة إلى البرنامج" : "Back to the program"}<span aria-hidden="true">↗</span></Link>
        </div>
        <figure className="garment-worn-anchor">
          <img src={media.kgc.high} alt={ar ? "سياق ارتداء قميص High الصيفي" : "Worn context for the High summer polo"} />
          <figcaption>{ar ? "نقطة الحقيقة · إطلالة مرتداة" : "Truth anchor · worn look"}</figcaption>
        </figure>
      </header>

      <section className="full-inspection">
        <GarmentInspector locale={locale} />
      </section>

      <section className="inspection-method">
        <span className="kicker">{ar ? "حدود الحقيقة" : "Truth boundary"}</span>
        <div>
          <h2>{ar ? "إذا لم نملك طبقة حقيقية، لا نخترعها." : "If we don’t have a real layer, we don’t invent one."}</h2>
          <p>{ar ? "هذا التصميم يستخدم انتقالات وتكبيرات وتعليقات فوق الصور الأصلية فقط. يمكن لاحقاً إضافة انفجار حقيقي للقطعة عندما تتوفر صور أو هندسة فعلية تدعمه." : "This design uses transitions, crops and annotations over the original photography only. A true exploded construction view can be added later when real separated media or geometry supports it."}</p>
        </div>
      </section>

      <section className="project-next">
        <div><span className="kicker">{ar ? "هل نبدأ من هنا؟" : "Start from this context"}</span><h2>{ar ? "من قطعة محددة إلى برنامج كامل." : "From one garment to a complete program."}</h2></div>
        <Link className="button button-dark" href={`/${locale}/enquiry?context=kgc-national-high-summer-polo`}>{ar ? "ناقش برنامجك" : "Discuss your program"}<span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}
