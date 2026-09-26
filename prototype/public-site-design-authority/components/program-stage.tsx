"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { media, stages } from "@/lib/data";
import type { Locale } from "@/lib/locale";

export function ProgramStage({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState("high");
  const active = stages.find((stage) => stage.id === activeId) ?? stages[3];

  return (
    <section className="cohort-experience" aria-labelledby="cohort-title">
      <div className="cohort-heading">
        <span className="kicker">{locale === "ar" ? "منظومة المراحل" : "Program continuity"}</span>
        <h2 id="cohort-title">{locale === "ar" ? "أربع مراحل. لغة واحدة تتطور معها." : "Four stages. One language that grows with them."}</h2>
        <p>{locale === "ar" ? "الصور أدناه هي نقاط ارتكاز حقيقية من برنامج KGC الوطني الحالي للمراجعة." : "The images below are real worn/model anchors from the current KGC National review set."}</p>
      </div>

      <div className="cohort-layout">
        <div className="cohort-rail" role="tablist" aria-label={locale === "ar" ? "مراحل البرنامج" : "Program stages"}>
          {stages.map((stage) => (
            <button
              key={stage.id}
              role="tab"
              aria-selected={active.id === stage.id}
              className={active.id === stage.id ? "is-active" : ""}
              onClick={() => setActiveId(stage.id)}
            >
              <span>{stage.number}</span>
              <strong>{stage.name[locale]}</strong>
              <small>{stage.line[locale]}</small>
            </button>
          ))}
        </div>

        <div className="cohort-focus">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={active.id}
              initial={reduce ? false : { opacity: 0, clipPath: "inset(6% 6% 6% 6% round 1.5rem)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0rem)" }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={active.image} alt={active.name[locale]} />
            </motion.figure>
          </AnimatePresence>
          <div className="cohort-focus-copy">
            <span>{active.number} / 04</span>
            <h3>{active.name[locale]}</h3>
            <p>{active.line[locale]}</p>
            {active.id === "high" ? (
              <Link className="inline-arrow" href={`/${locale}/garments/high-summer-polo`}>
                {locale === "ar" ? "انتقل من الإطلالة إلى القطعة" : "Move from worn look to garment"} <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              <span className="media-note">{locale === "ar" ? "إطلالة صيفية حقيقية للمراجعة" : "Real Summer review look"}</span>
            )}
          </div>
          <img className="cohort-crest" src={media.kgc.logo} alt={locale === "ar" ? "شعار KGC" : "KGC crest"} />
        </div>
      </div>
    </section>
  );
}
