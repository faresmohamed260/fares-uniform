"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Accessibility, ArrowUpRight, Languages, RotateCcw } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import type { Cohort, Locale, Look, Project } from "@/lib/projects";

const genericDetails = {
  en: [
    ["Collar & rib", "The signature collar, with integrated rib and contrasting stripes, shapes the identity of the uniform."],
    ["Main fabric", "A durable everyday textile selected for repeated wear and easy care."],
    ["Diagonal panel", "The signature panel carries program identity through a clean, continuous construction."],
    ["Embroidered badge", "The organization mark remains precise, durable and secondary to the garment."],
    ["Seam detail", "Reinforced lines support movement and a long service life."],
    ["Trousers", "A coordinated lower layer completes the uniform language and supports movement."],
  ],
  ar: [
    ["الياقة والحواف", "الياقة المميزة والحواف المتباينة ترسم هوية الزي بوضوح."],
    ["الخامة الأساسية", "نسيج عملي متين مصمم للاستخدام المتكرر وسهولة العناية."],
    ["اللوح القطري", "لوح مميز يحمل هوية البرنامج بخط بناء واضح ومتصل."],
    ["الشارة المطرزة", "تظل علامة المؤسسة دقيقة ومتينة من دون أن تطغى على القطعة."],
    ["تفاصيل الخياطة", "خطوط مدعمة تدعم الحركة وطول الاستخدام."],
    ["البنطال", "طبقة سفلية منسقة تكمل لغة الزي وتدعم الحركة."],
  ],
} as const;

const kgcDetails = {
  en: [
    ["Collar & rib", "The original front packshot records the ribbed collar and its contrasting stripe treatment."],
    ["Red body", "The original front view records the red main body without generated texture or reconstructed layers."],
    ["Diagonal panel", "The navy-and-white diagonal panel is read directly from the original packshot."],
    ["KGC badge", "The visible chest badge is shown in its recorded front placement."],
    ["Sleeve finish", "The short sleeves and cuff edges are presented from the original front view."],
    ["Front / back", "Use the view controls to compare the separately photographed original front and back packshots."],
  ],
  ar: [
    ["الياقة والحواف", "تسجل صورة الأمام الأصلية الياقة المحاكة ومعالجتها المخططة المتباينة."],
    ["الجسم الأحمر", "تعرض صورة الأمام الأصلية الجسم الأحمر من دون نسيج مولد أو طبقات معاد بناؤها."],
    ["اللوح القطري", "يظهر اللوح القطري الكحلي والأبيض مباشرة من صورة المنتج الأصلية."],
    ["شارة KGC", "تظهر شارة الصدر في موضعها المسجل في صورة الأمام."],
    ["نهاية الأكمام", "تظهر الأكمام القصيرة وحوافها من صورة الأمام الأصلية."],
    ["الأمام / الخلف", "استخدم أزرار العرض للمقارنة بين صورتي الأمام والخلف الأصليتين المنفصلتين."],
  ],
} as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

type Props = { project: Project; cohort: Cohort; look: Look; initialLocale: Locale };

export function ExplodeExperience({ project, cohort, look, initialLocale }: Props) {
  const [locale, setLocale] = useState(initialLocale);
  const [exploded, setExploded] = useState(true);
  const [back, setBack] = useState(false);
  const [openDetail, setOpenDetail] = useState(0);
  const reduced = usePrefersReducedMotion();
  const isArabic = locale === "ar";
  const isKgc = project.id === "kgc-national";
  const inspection = project.inspectionMedia?.[`${cohort.id}:${look.id}`];
  const flatMode = isKgc;
  const hasBack = Boolean(inspection?.backSrc);
  const flatFrontSrc = inspection?.frontSrc ?? project.cohortMediaSrc?.[cohort.id] ?? project.heroModelSrc ?? "";
  const flatBackSrc = inspection?.backSrc ?? flatFrontSrc;
  const syntheticAssembledSrc = look.variant === "polo" ? "/media/uniform-polo-assembled.webp" : "/media/uniform-assembled-editorial.webp";
  const syntheticExplodedSrc = look.variant === "polo" ? "/media/uniform-polo-exploded.webp" : "/media/uniform-exploded-transparent.webp";
  const activeSrc = flatMode ? (back ? flatBackSrc : flatFrontSrc) : exploded ? syntheticExplodedSrc : syntheticAssembledSrc;
  const activeDetails = flatMode ? kgcDetails[locale] : genericDetails[locale];

  const labels = isArabic
    ? {
        work: "أعمالنا", programs: "البرامج", process: "المنهج", about: "عن فارس",
        discuss: "ناقش هذا البرنامج", title: "غرض في كل طبقة.",
        intro: flatMode ? "فحص موثق يعتمد على صور KGC الأصلية للأمام والخلف من دون اختلاق طبقات بناء." : "فحص بصري لبنية نظام الزي وتفاصيله.",
        reassemble: "إعادة التجميع", explode: "فك الطبقات", front: "الأمام", back: "الخلف",
        reduced: flatMode ? "عرض مسطح موثق" : "الحركة المخفّضة: عرض الطبقات",
        note: flatMode ? "صور KGC أصلية من البيان المعتمد — عرض مسطح للأمام والخلف ولا توجد طبقات بناء مختلقة." : "نموذج تفاعلي للمراجعة — الصور التخيلية تخص النموذج غير العميل فقط.",
      }
    : {
        work: "Work", programs: "Programs", process: "Process", about: "About",
        discuss: "Discuss this program", title: "Purpose in every layer.",
        intro: flatMode ? "A documented inspection using the original KGC front and back packshots, without fabricated construction layers." : "A visual inspection of the uniform system.",
        reassemble: "Reassemble", explode: "Explode layers", front: "Front", back: "Back",
        reduced: flatMode ? "Documented flat view" : "Reduced motion: view layers",
        note: flatMode ? "Manifest-backed original KGC packshots — annotated front/back fallback with no fabricated construction layers." : "Interactive review prototype — synthetic media belongs only to the synthetic non-client fixture.",
      };

  const style = { "--explode-accent": project.skin.accent, "--explode-ink": project.skin.ink } as CSSProperties;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [locale, isArabic]);

  return (
    <main
      className="explode-experience"
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      style={style}
      data-reduced-motion={reduced}
    >
      <header className="explode-header">
        <a className="brand" href="/"><strong>FARES</strong><span>UNIFORM</span></a>
        <nav aria-label="Primary">
          <a href="/#work">{labels.work}</a>
          <a href="/#work">{labels.programs}</a>
          <a href="/#detail">{labels.process}</a>
          <a href="/#contact">{labels.about}</a>
          <button className="language-button" type="button" onClick={() => setLocale(isArabic ? "en" : "ar")}>
            <Languages aria-hidden="true" />{isArabic ? "AR / EN" : "EN / AR"}
          </button>
          <a className="explode-discuss" href="/#contact">{labels.discuss}<ArrowUpRight aria-hidden="true" /></a>
        </nav>
      </header>

      <section className="explode-grid">
        <div className="explode-intro">
          <span className="explode-kicker">{project.organization[locale]} {project.program[locale]} / {cohort.name[locale]} / {look.name[locale]}</span>
          <h1>{labels.title}</h1>
          <p>{labels.intro}</p>
          <div className="explode-controls">
            {!flatMode && (
              <button
                className="is-primary"
                type="button"
                data-testid="explode-toggle"
                onClick={() => setExploded((value) => !value)}
              >
                {exploded ? <RotateCcw aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                {exploded ? labels.reassemble : labels.explode}
              </button>
            )}
            <button data-testid="view-front" type="button" aria-pressed={!back} onClick={() => setBack(false)}>{labels.front}</button>
            <button data-testid="view-back" type="button" aria-pressed={back} disabled={flatMode && !hasBack} onClick={() => setBack(true)}>{labels.back}</button>
          </div>
          <div className="explode-reduced"><Accessibility aria-hidden="true" />{labels.reduced}</div>
          <div className="explode-meta">
            <span>{isArabic ? "الطلاب" : "People"}</span>
            <span>{isArabic ? project.cohortsLabel.ar : isKgc ? "Schools" : "Programs"}</span>
            <span>{isArabic ? "غد أكثر إشراقاً" : isKgc ? "Brighter tomorrows" : "Built to belong"}</span>
          </div>
          <p className="explode-script">{isArabic ? "" : "More than uniforms. A brighter tomorrow"}</p>
        </div>

        <motion.div
          className="explode-viewer"
          data-testid="garment-rig"
          data-inspection-mode={flatMode ? "flat" : "synthetic-exploded"}
          data-exploded={flatMode ? "false" : String(exploded)}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0.2 }}
        >
          <motion.div
            className="explode-media"
            animate={{ scaleX: 1, scale: flatMode ? 1 : exploded ? 1 : 0.82 }}
            transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={activeSrc} alt="" fill priority sizes="(max-width: 760px) 100vw, 46vw" />
          </motion.div>
          {activeDetails.map((_, index) => <span className="explode-spot" key={index}>0{index + 1}</span>)}
        </motion.div>

        <aside className="explode-details" aria-label={isArabic ? "تفاصيل القطعة" : "Garment details"}>
          <p className="explode-breadcrumb">
            <strong data-testid="explode-project">{project.organization[locale]}</strong> /
            <span data-testid="explode-cohort"> {cohort.name[locale]}</span> /
            <span data-testid="explode-look"> {look.name[locale]}</span>
          </p>
          <div className="explode-detail-list">
            {activeDetails.map(([title, body], index) => {
              const open = index === openDetail;
              return (
                <section className="explode-detail-item" key={title}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenDetail(index)}>
                    <span>0{index + 1}</span><strong>{title}</strong><em>{open ? "−" : "+"}</em>
                  </button>
                  {open && (
                    <>
                      <div className={`explode-detail-preview preview-${index}`}>
                        <Image src={activeSrc} alt="" fill sizes="320px" />
                      </div>
                      <p>{body}</p>
                    </>
                  )}
                </section>
              );
            })}
          </div>
          <div className="explode-foot-meta">
            <span>{isArabic ? "برنامج واحد. مراحل متناسقة." : isKgc ? "One program. Four stages. A stronger tomorrow." : "One system. Every role. Built to belong."}</span>
            <span>{isArabic ? "مصري الجذور. بمعايير عالمية." : "Egyptian by heritage. Global by standards."}</span>
          </div>
          <p className="explode-footnote">{labels.note}</p>
        </aside>
      </section>
    </main>
  );
}
