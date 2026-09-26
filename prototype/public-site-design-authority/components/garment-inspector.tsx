"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { media } from "@/lib/data";
import type { Locale } from "@/lib/locale";

type View = "front" | "back";
type Detail = "collar" | "diagonal" | "hem";

const detailCopy = {
  en: {
    collar: ["Collar & neckline", "Visible rib/collar construction is inspected directly from the source packshot."],
    diagonal: ["Diagonal identity panel", "The red/white diagonal is treated as project identity, not global Fares branding."],
    hem: ["Body & hem", "Proportion and finish are shown photographically without inventing hidden construction."],
  },
  ar: {
    collar: ["الياقة وخط الرقبة", "تتم معاينة بناء الياقة الظاهر مباشرة من صورة القطعة الأصلية."],
    diagonal: ["لوحة الهوية القطرية", "يُعامل الخط الأحمر والأبيض كهوية للمشروع وليس كهوية عامة لـ Fares."],
    hem: ["الجسم والحافة", "تُعرض النسب والتشطيب فوتوغرافياً من دون اختلاق بناء داخلي غير ظاهر."],
  },
} as const;

export function GarmentInspector({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>("front");
  const [detail, setDetail] = useState<Detail>("diagonal");
  const src = view === "front" ? media.kgc.poloFront : media.kgc.poloBack;

  return (
    <div className={compact ? "inspector inspector-compact" : "inspector"} data-testid="garment-inspector">
      <div className="inspector-toolbar">
        <div>
          <span className="kicker">{locale === "ar" ? "معاينة فوتوغرافية مسطحة" : "Flat photographic inspection"}</span>
          <strong>{locale === "ar" ? "قميص High الصيفي" : "High summer polo"}</strong>
        </div>
        <div className="segmented" aria-label={locale === "ar" ? "زاوية القطعة" : "Garment view"}>
          {(["front", "back"] as View[]).map((option) => (
            <button key={option} aria-pressed={view === option} onClick={() => setView(option)}>
              {locale === "ar" ? (option === "front" ? "أمام" : "خلف") : option}
            </button>
          ))}
        </div>
      </div>

      <div className="inspector-body">
        <div className="inspector-media">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={view}
              src={src}
              alt={locale === "ar" ? `قميص High الصيفي - ${view === "front" ? "أمام" : "خلف"}` : `High summer polo — ${view}`}
              initial={reduce ? false : { opacity: 0, rotate: view === "front" ? -1.5 : 1.5, scale: 0.98 }}
              animate={{ opacity: 1, rotate: 0, scale: detail === "diagonal" ? 1.035 : 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 160, damping: 25 }}
            />
          </AnimatePresence>
          <div className={`inspection-marker marker-${detail}`} aria-hidden="true"><span/></div>
          <div className="inspection-truth">
            <span aria-hidden="true">◎</span>
            {locale === "ar" ? "لا توجد طبقات تصنيع مفبركة" : "No fabricated construction layers"}
          </div>
        </div>

        <div className="detail-rail">
          {(Object.keys(detailCopy[locale]) as Detail[]).map((key, index) => (
            <button key={key} className={detail === key ? "is-active" : ""} onClick={() => setDetail(key)}>
              <span>0{index + 1}</span>
              <span><strong>{detailCopy[locale][key][0]}</strong><small>{detailCopy[locale][key][1]}</small></span>
            </button>
          ))}
          {!compact && (
            <div className="worn-context">
              <img src={media.kgc.high} alt="" />
              <div>
                <span>{locale === "ar" ? "سياق الارتداء" : "Worn context"}</span>
                <strong>KGC National · High · Summer</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
