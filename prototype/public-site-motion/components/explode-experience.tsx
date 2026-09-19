"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, Languages, RotateCcw } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import type { Cohort, Locale, Look, Project } from "@/lib/projects";

const details = {
  en: [
    ["Collar & rib", "Integrated contrast trim shapes the program identity."],
    ["Main fabric", "A durable everyday textile selected for repeated wear."],
    ["Diagonal panel", "The signature construction carries identity across the range."],
    ["Identity detail", "Organization marks stay precise and secondary to the garment."],
    ["Seam detail", "Reinforced lines support movement and long service."],
    ["Trouser system", "A coordinated lower layer completes the uniform language."],
  ],
  ar: [
    ["الياقة والحواف", "حواف متباينة ومتكاملة ترسم هوية البرنامج."],
    ["الخامة الأساسية", "نسيج عملي متين مصمم للاستخدام المتكرر."],
    ["اللوح القطري", "تكوين مميز يحمل الهوية عبر المجموعة."],
    ["تفصيل الهوية", "تظهر علامة المؤسسة بدقة من دون أن تطغى على القطعة."],
    ["تفاصيل الخياطة", "خطوط مدعمة تدعم الحركة وطول الاستخدام."],
    ["نظام البنطال", "طبقة سفلية منسقة تكمل لغة الزي الموحد."],
  ],
} as const;

type Props = { project: Project; cohort: Cohort; look: Look; initialLocale: Locale };

export function ExplodeExperience({ project, cohort, look, initialLocale }: Props) {
  const [locale, setLocale] = useState(initialLocale);
  const [exploded, setExploded] = useState(true);
  const [back, setBack] = useState(false);
  const [openDetail, setOpenDetail] = useState(0);
  const isArabic = locale === "ar";
  const labels = isArabic
    ? { work: "أعمالنا", programs: "البرامج", process: "المنهج", about: "عن فارس", discuss: "ناقش هذا البرنامج", title: "غرض في كل طبقة.", intro: "فحص بصري لبنية الزي وتفاصيله.", reassemble: "إعادة التجميع", explode: "فك الطبقات", front: "الأمام", back: "الخلف", note: "نموذج تفاعلي للمراجعة — الصور التخيلية ليست أصول إنتاج معتمدة." }
    : { work: "Work", programs: "Programs", process: "Process", about: "About", discuss: "Discuss this program", title: "Purpose in every layer.", intro: "A visual inspection of the uniform system.", reassemble: "Reassemble", explode: "Explode layers", front: "Front", back: "Back", note: "Interactive review prototype — synthetic media is not approved production imagery." };
  const style = { "--explode-accent": project.skin.accent, "--explode-ink": project.skin.ink } as CSSProperties;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [locale, isArabic]);

  return (
    <main className="explode-experience" lang={locale} dir={isArabic ? "rtl" : "ltr"} style={style}>
      <header className="explode-header">
        <a className="brand" href="/"><strong>FARES</strong><span>UNIFORM</span></a>
        <nav aria-label="Primary">
          <a href="/#work">{labels.work}</a><a href="/#work">{labels.programs}</a><a href="/#approach">{labels.process}</a><a href="/#contact">{labels.about}</a>
          <button className="language-button" type="button" onClick={() => setLocale(isArabic ? "en" : "ar")}><Languages aria-hidden="true" />{isArabic ? "EN" : "AR"}</button>
          <a className="explode-discuss" href="/#contact">{labels.discuss}<ArrowUpRight aria-hidden="true" /></a>
        </nav>
      </header>

      <section className="explode-grid">
        <div className="explode-intro">
          <span className="explode-kicker">{project.program[locale]} / {cohort.name[locale]} / {look.name[locale]}</span>
          <h1>{labels.title}</h1>
          <p>{labels.intro}</p>
          <div className="explode-controls">
            <button className="is-primary" type="button" data-testid="explode-toggle" onClick={() => setExploded((value) => !value)}>{exploded ? <RotateCcw aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}{exploded ? labels.reassemble : labels.explode}</button>
            <button type="button" aria-pressed={!back} onClick={() => setBack(false)}>{labels.front}</button>
            <button type="button" aria-pressed={back} onClick={() => setBack(true)}>{labels.back}</button>
          </div>
          <div className="explode-meta"><span>People</span><span>Programs</span><span>Built to belong</span></div>
        </div>

        <motion.div className="explode-viewer" data-testid="garment-rig" data-exploded={exploded} animate={{ opacity: 1 }} initial={{ opacity: .2 }}>
          <motion.div className="explode-media" animate={{ scaleX: back ? -1 : 1, scale: exploded ? 1 : .82 }} transition={{ duration: .55, ease: [0.22,1,0.36,1] }}>
            <Image src={exploded ? "/media/uniform-exploded-editorial.webp" : "/media/uniform-assembled-editorial.webp"} alt="" fill priority sizes="(max-width: 760px) 100vw, 48vw" />
          </motion.div>
          {[1,2,3,4,5].map((item) => <span className="explode-spot" key={item}>0{item}</span>)}
        </motion.div>

        <aside className="explode-details" aria-label={isArabic ? "تفاصيل القطعة" : "Garment details"}>
          <p className="explode-breadcrumb"><strong data-testid="explode-project">{project.organization[locale]}</strong> / <span data-testid="explode-cohort">{cohort.name[locale]}</span> / <span data-testid="explode-look">{look.name[locale]}</span></p>
          <div className="explode-detail-list">
            {details[locale].map(([title, body], index) => {
              const open = index === openDetail;
              return <section className="explode-detail-item" key={title}>
                <button type="button" aria-expanded={open} onClick={() => setOpenDetail(index)}>
                  <span>0{index + 1}</span><strong>{title}</strong><em>{open ? "−" : "+"}</em>
                </button>
                {open && <>
                  <div className="explode-detail-preview"><Image src="/media/uniform-assembled-editorial.webp" alt="" fill sizes="320px" /></div>
                  <p>{body}</p>
                </>}
              </section>;
            })}
          </div>
          <p className="explode-footnote">{labels.note}</p>
        </aside>
      </section>
    </main>
  );
}
