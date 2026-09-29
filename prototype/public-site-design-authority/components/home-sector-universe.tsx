"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Locale } from "@/lib/locale";

const sectors = [
  { id: "education", en: "Education", ar: "التعليم", noteEn: "Schools · academies · campus teams", noteAr: "مدارس · أكاديميات · فرق الحرم", tone: "chalk" },
  { id: "hospitality", en: "Hospitality", ar: "الضيافة", noteEn: "Hotels · guest-facing teams · service", noteAr: "فنادق · فرق الضيوف · الخدمة", tone: "amber" },
  { id: "food", en: "Restaurants & Cafés", ar: "المطاعم والمقاهي", noteEn: "Front-of-house · kitchen · franchise systems", noteAr: "واجهة الخدمة · المطبخ · سلاسل الامتياز", tone: "tomato" },
  { id: "health", en: "Healthcare", ar: "الرعاية الصحية", noteEn: "Clinical · support · reception roles", noteAr: "سريري · دعم · استقبال", tone: "aqua" },
  { id: "corporate", en: "Corporate", ar: "الشركات", noteEn: "Teams · field roles · branded workwear", noteAr: "فرق · أدوار ميدانية · ملابس عمل", tone: "ink" },
  { id: "industrial", en: "Operational Workwear", ar: "ملابس العمل", noteEn: "Practical roles · durable systems · repeat orders", noteAr: "أدوار عملية · أنظمة متينة · طلبات متكررة", tone: "steel" },
] as const;

export function HomeSectorUniverse({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const sector = sectors[active];

  return (
    <section id="industries" className={`home-sector-universe tone-${sector.tone}`} data-sc-act="flow" data-sc-drift="#121312">
      <header className="sector-universe-head">
        <span className="home-chapter-label">02 / {ar ? "بيئات العمل" : "WORKING ENVIRONMENTS"}</span>
        <h2>{ar ? "هوية واحدة لا تناسب الجميع." : "One uniform language should never fit everyone."}</h2>
        <p>{ar
          ? "نفس منهج التصميم والتصنيع، لكن كل مؤسسة تحتاج لغة خاصة بها."
          : "The method can stay disciplined while the visual system changes around each organization, role and environment."}</p>
      </header>

      <div className="sector-universe-stage">
        <div className="sector-atmosphere" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sector.id}
              className="sector-atmosphere-state"
              initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 1.05, rotate: 3 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="sector-blob sector-blob-a" />
              <span className="sector-blob sector-blob-b" />
              <span className="sector-grid" />
              <span className="sector-sweep" />
              <strong>{String(active + 1).padStart(2, "0")}</strong>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sector-active-copy">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sector.id}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{ar ? "قطاع" : "SECTOR"} {String(active + 1).padStart(2, "0")}</span>
              <h3>{ar ? sector.ar : sector.en}</h3>
              <p>{ar ? sector.noteAr : sector.noteEn}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sector-index" role="tablist" aria-label={ar ? "قطاعات Fares" : "Fares sectors"}>
          {sectors.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={index === active}
              className={index === active ? "is-active" : ""}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{ar ? item.ar : item.en}</strong>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
