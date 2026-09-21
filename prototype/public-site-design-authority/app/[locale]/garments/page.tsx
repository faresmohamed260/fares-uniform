import Link from "next/link";
import { copy, media } from "@/lib/data";
import { requireLocale } from "@/lib/locale";

export default async function GarmentsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = copy[locale];
  const ar = locale === "ar";
  return (
    <main id="main-content" className="page-shell">
      <header className="editorial-page-header garment-index-header">
        <span className="kicker">{ar ? "مكتبة القطع" : "Garment library"}</span>
        <h1>{t.garmentsTitle}</h1>
        <p>{t.garmentsBody}</p>
      </header>

      <section className="garment-library">
        <article className="garment-record">
          <Link href={`/${locale}/garments/high-summer-polo`} className="garment-record-media">
            <div><img src={media.kgc.poloFront} alt={ar ? "قميص High الصيفي - أمام" : "High summer polo — front"} /><span>{ar ? "أمام" : "Front"}</span></div>
            <div><img src={media.kgc.poloBack} alt={ar ? "قميص High الصيفي - خلف" : "High summer polo — back"} /><span>{ar ? "خلف" : "Back"}</span></div>
          </Link>
          <div className="garment-record-copy">
            <span className="kicker">KGC National · High · Summer</span>
            <h2>{ar ? "قميص أكاديمي قصير الأكمام" : "Short-sleeve academic polo"}</h2>
            <p>{ar ? "قطعة مراجعة حقيقية مرتبطة مباشرة بإطلالة المرحلة الثانوية الحالية." : "A real review garment directly matched to the current High-stage worn look."}</p>
            <Link className="inline-arrow" href={`/${locale}/garments/high-summer-polo`}>{ar ? "افحص القطعة" : "Inspect garment"}<span aria-hidden="true">↗</span></Link>
          </div>
        </article>
      </section>

      <section className="catalog-truth">
        <span>01 / 01</span>
        <div><h2>{ar ? "المكتبة تنمو مع الأدلة، لا مع الحاجة لملء الصفحة." : "The library grows with evidence, not with the need to fill a page."}</h2><p>{ar ? "ستظهر قطع أخرى عندما تصبح وسائطها الحقيقية جزءاً من بيئة المراجعة أو النشر المناسبة." : "More garments appear when their real media is available inside the appropriate review or publication boundary."}</p></div>
      </section>
    </main>
  );
}
