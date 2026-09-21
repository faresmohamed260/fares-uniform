"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { copy, stages } from "@/lib/data";
import type { Locale } from "@/lib/locale";

export function ProgramHero({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState("high");
  const active = stages.find((stage) => stage.id === activeId) ?? stages[3];

  return (
    <section className="hero-stage" aria-labelledby="home-hero-title">
      <div className="hero-editorial">
        <span className="kicker">{t.heroKicker}</span>
        <h1 id="home-hero-title">
          <span>{t.heroTitleA}</span>
          <em>{t.heroTitleB}</em>
        </h1>
        <p className="hero-deck">{t.heroBody}</p>
        <div className="hero-links">
          <Link className="button button-dark" href={`/${locale}/work`}>
            {t.heroPrimary}<span aria-hidden="true">↘</span>
          </Link>
          <a className="button button-ghost" href="#process">{t.heroSecondary}</a>
        </div>
        <div className="hero-proof">
          <span>{t.proof}</span>
          <strong>KGC National</strong>
          <small>{locale === "ar" ? "وسائط مراجعة حقيقية" : "real review media"}</small>
        </div>
      </div>

      <div className="hero-media" data-testid="real-media-hero">
        <div className="hero-index" aria-hidden="true">
          <strong>{active.number}</strong><span>/04</span>
        </div>
        <div className="hero-photo-stage">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.figure
              key={active.id}
              className="hero-active-photo"
              initial={reduce ? false : { opacity: 0, scale: 0.96, x: locale === "ar" ? -20 : 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 1.02, x: locale === "ar" ? 20 : -20 }}
              transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.8 }}
            >
              <img src={active.image} alt={active.name[locale]} />
              <figcaption>
                <span>{active.name[locale]}</span>
                <strong>{active.line[locale]}</strong>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className="hero-thread" aria-hidden="true"><span/><span/></div>
        </div>

        <div className="hero-stage-switcher" aria-label={locale === "ar" ? "اختر المرحلة" : "Choose stage"}>
          {stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              className={stage.id === active.id ? "is-active" : ""}
              aria-pressed={stage.id === active.id}
              onClick={() => setActiveId(stage.id)}
            >
              <span>{stage.number}</span>
              <img src={stage.image} alt="" />
              <strong>{stage.name[locale]}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
