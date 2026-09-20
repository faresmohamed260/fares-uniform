"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Languages, Menu, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { projects, type Locale, type Look, type Project } from "@/lib/projects";

const copy = {
  en: {
    work: "Work",
    programs: "Programs",
    process: "Process",
    about: "About",
    start: "Start a project",
    contact: "Discuss your uniform",
    explore: "See the KGC program",
    genericExplore: "Explore this program",
    stageHeading: "One program · four stages",
    detailKicker: "A closer look",
    detailBody: "Original KGC packshots preserve the exact polo silhouette, diagonal color blocking, crest placement and separately photographed front and back views.",
    genericDetailBody: "A coordinated uniform system shaped around the people, roles and daily work it supports.",
    look: "Other looks",
    footerLine: "Egyptian by heritage. Global by standards.",
    footerLink: "Explore our program",
    motto: "One program. Four stages. A stronger tomorrow.",
    genericMotto: "One system. Every role. Built to belong.",
    heroTitle: "Designed as one. Worn for years.",
    heroSub: "A coordinated uniform program for every stage. One identity, thoughtfully designed and manufactured in Egypt for schools and institutions.",
    genericTitle: "Designed as one. Built to belong.",
    genericSub: "Coordinated uniform programs designed and manufactured in Egypt for organizations and teams.",
    script: "More than uniforms. A brighter tomorrow",
    side: "Egyptian expertise for a brighter tomorrow",
  },
  ar: {
    work: "أعمالنا",
    programs: "البرامج",
    process: "المنهج",
    about: "عن فارس",
    start: "ابدأ مشروعاً",
    contact: "ناقش برنامجك معنا",
    explore: "استكشف برنامج KGC",
    genericExplore: "استكشف هذا البرنامج",
    stageHeading: "برنامج واحد · أربع مراحل",
    detailKicker: "نظرة أقرب",
    detailBody: "تحافظ صور KGC الأصلية على شكل البولو وتوزيع الألوان القطري وموضع الشارة وصورتي الأمام والخلف المنفصلتين.",
    genericDetailBody: "نظام زي متناسق مصمم حول الأشخاص والأدوار والعمل اليومي الذي يخدمه.",
    look: "إطلالات أخرى",
    footerLine: "مصري الجذور. بمعايير عالمية.",
    footerLink: "استكشف برنامجنا",
    motto: "برنامج واحد. أربع مراحل. غد أقوى.",
    genericMotto: "نظام واحد. لكل دور. صُمم للانتماء.",
    heroTitle: "هوية واحدة. ترافقهم لسنوات.",
    heroSub: "برنامج زي موحّد لكل مرحلة، مصمّم بعناية ومُصنّع في مصر للمدارس والمؤسسات.",
    genericTitle: "هوية واحدة. صُممت للانتماء.",
    genericSub: "برامج زي موحد متكاملة، مصممة ومصنعة في مصر للمؤسسات والفرق.",
    script: "",
    side: "طلاب اليوم. مستقبل أكثر إشراقاً.",
  },
} as const;

const detailLabels = {
  en: ["Collar & rib", "Main fabric", "Diagonal panel", "Embroidered badge", "Seam detail", "Trousers"],
  ar: ["الياقة والحواف", "الخامة الأساسية", "اللوح القطري", "الشارة المطرزة", "تفاصيل الخياطة", "البنطال"],
} as const;

const kgcDetailLabels = {
  en: ["Collar & rib", "Red body", "Diagonal panel", "KGC badge", "Sleeve finish", "Front / back"],
  ar: ["الياقة والحواف", "الجسم الأحمر", "اللوح القطري", "شارة KGC", "نهاية الأكمام", "الأمام / الخلف"],
} as const;

function firstLook(project: Project, cohortId: string) {
  const cohort = project.cohorts.find((item) => item.id === cohortId) ?? project.cohorts[0];
  return project.looks.find((look) => look.id === cohort.lookIds[0]) ?? project.looks[0];
}

function isShared(look: Look, cohortId: string) {
  return look.sharedAcross === "all" || (Array.isArray(look.sharedAcross) && look.sharedAcross.includes(cohortId));
}

type PatternExperienceProps = {
  initialLocale: Locale;
  initialProjectId?: string;
  initialCohortId?: string;
  initialLookId?: string;
};

export function PatternExperience({
  initialLocale,
  initialProjectId,
  initialCohortId,
  initialLookId,
}: PatternExperienceProps) {
  const seededProject = projects.find((item) => item.id === initialProjectId) ?? projects[0];
  const defaultCohort = seededProject.id === "kgc-national"
    ? seededProject.cohorts.find((item) => item.id === "high") ?? seededProject.cohorts[0]
    : seededProject.cohorts[0];
  const seededCohort = seededProject.cohorts.find((item) => item.id === initialCohortId) ?? defaultCohort;
  const seededLook = seededProject.looks.find(
    (item) => item.id === initialLookId && seededCohort.lookIds.includes(item.id),
  ) ?? firstLook(seededProject, seededCohort.id);

  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [cohortId, setCohortId] = useState(seededCohort.id);
  const [lookId, setLookId] = useState(seededLook.id);
  const [menuOpen, setMenuOpen] = useState(false);

  const project = seededProject;
  const text = copy[locale];
  const cohort = project.cohorts.find((item) => item.id === cohortId) ?? project.cohorts[0];
  const isKgc = project.id === "kgc-national";
  const availableLooks = project.looks.filter(
    (item) => cohort.lookIds.includes(item.id) && (!isKgc || item.id === "summer"),
  );
  const look = availableLooks.find((item) => item.id === lookId) ?? availableLooks[0];
  const heroTitle = isKgc ? text.heroTitle : text.genericTitle;
  const heroSub = isKgc ? text.heroSub : text.genericSub;
  const heroAction = isKgc ? text.explore : text.genericExplore;
  const detailBody = isKgc ? text.detailBody : text.genericDetailBody;
  const detailMotto = isKgc ? text.motto : text.genericMotto;
  const stageSource = "/media/fares-team-editorial.webp";
  const kgcInspection = project.inspectionMedia?.[`${cohort.id}:${look.id}`];
  const detailMediaSrc = isKgc
    ? kgcInspection?.frontSrc ?? project.cohortMediaSrc?.[cohort.id] ?? project.heroModelSrc ?? ""
    : look.variant === "polo"
      ? "/media/uniform-polo-exploded.webp"
      : "/media/uniform-exploded-transparent.webp";
  const activeDetailLabels = isKgc ? kgcDetailLabels[locale] : detailLabels[locale];
  const inspectorHref = "/explodeview?organization=" + project.id + "&program=" + project.programId + "&role=" + cohort.id + "&garment=" + look.id + "&lang=" + locale;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  function selectCohort(nextId: string) {
    const nextCohort = project.cohorts.find((item) => item.id === nextId) ?? project.cohorts[0];
    setCohortId(nextCohort.id);
    if (!nextCohort.lookIds.includes(lookId)) {
      setLookId(firstLook(project, nextCohort.id).id);
    } else if (isKgc) {
      setLookId("summer");
    }
  }

  const style = {
    "--project-accent": project.skin.accent,
    "--project-soft": project.skin.accentSoft,
    "--project-ink": project.skin.ink,
    "--stage-count": project.cohorts.length,
  } as CSSProperties;

  return (
    <main className={`experience ${isKgc ? "kgc-project" : "generic-project"}`} style={style} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Fares Uniform">
          <strong>FARES</strong><span>UNIFORM</span>
        </a>
        <nav aria-label="Primary">
          <a href="#work">{text.work}</a>
          <a href="#work">{text.programs}</a>
          <a href="#detail">{text.process}</a>
          <a href="#contact">{text.about}</a>
          <button
            className="language-button"
            type="button"
            onClick={() => setLocale((value) => value === "en" ? "ar" : "en")}
            aria-label={locale === "en" ? "العربية" : "English"}
          >
            <Languages aria-hidden="true" />{locale === "en" ? "EN / AR" : "AR / EN"}
          </button>
          <a className="contact-link" href="#contact">{text.start}<ArrowUpRight aria-hidden="true" /></a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </nav>
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#work" onClick={() => setMenuOpen(false)}>{text.work}</a>
            <a href="#detail" onClick={() => setMenuOpen(false)}>{text.process}</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>{text.contact}</a>
          </div>
        )}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="hero-eyebrow">{project.heroEyebrow[locale]}</span>
          <h1>{heroTitle}</h1>
          <p>{heroSub}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#work">{heroAction}<ArrowDownRight aria-hidden="true" /></a>
            <a className="secondary-action" href="#contact">{text.contact}<ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className="hero-meta">
            <span>{locale === "ar" ? "الطلاب" : "People"}</span>
            <span>{locale === "ar" ? project.cohortsLabel.ar : isKgc ? "Schools" : "Programs"}</span>
            <span>{locale === "ar" ? "غد أكثر إشراقاً" : isKgc ? "Brighter tomorrows" : "Built to belong"}</span>
          </div>
        </div>

        <div className="hero-visual" data-testid="hero-editorial">
          {project.identity && (
            <div className="hero-building" data-testid="organization-location">
              <Image src={project.identity.locationSrc} alt={project.identity.locationAlt[locale]} fill priority sizes="58vw" />
            </div>
          )}
          <div className="hero-ribbons" aria-hidden="true"><span /><span /><span /></div>
          {project.heroModelSrc ? (
            <motion.div
              className="hero-model"
              data-testid="hero-model"
              initial={{ opacity: 0, x: locale === "ar" ? -28 : 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={project.heroModelSrc} alt="" fill priority sizes="(max-width: 760px) 78vw, 48vw" />
            </motion.div>
          ) : (
            <div className="hero-generic">
              <Image src="/media/fares-team-editorial.webp" alt="" fill priority sizes="58vw" />
            </div>
          )}
          {text.script && <p className="hero-script">{text.script}</p>}
          <p className="hero-side-note">{text.side}</p>
        </div>
      </section>

      <section className="stage-story" id="work" aria-label={project.cohortsLabel[locale]}>
        {isKgc && <h2 className="stage-heading">{text.stageHeading}</h2>}
        <div className={"stage-grid stage-count-" + project.cohorts.length} role="tablist" data-testid="cohort-rail">
          {project.cohorts.map((item, index) => {
            const active = item.id === cohort.id;
            const stageImage = isKgc ? project.cohortMediaSrc?.[item.id] ?? project.heroModelSrc ?? "" : stageSource;
            const position = isKgc ? 50 : project.cohorts.length > 1 ? (index / (project.cohorts.length - 1)) * 100 : 50;
            return (
              <button
                className={"stage-card " + (active ? "is-active" : "")}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectCohort(item.id)}
                key={item.id}
                data-testid={"cohort-" + item.id}
              >
                <span className="stage-photo">
                  <Image src={stageImage} alt="" fill sizes="25vw" style={{ objectPosition: String(position) + "% 22%" }} />
                </span>
                <span className="stage-label">
                  <strong>{item.name[locale]}</strong>
                  <small>{item.tagline[locale]}</small>
                  <i aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="detail-story" id="detail">
        <div className="detail-copy">
          <span className="detail-kicker">{text.detailKicker}</span>
          <h2>{project.storyTitle[locale]}</h2>
          <p>{detailBody}</p>
          <a className="detail-action" data-testid="open-explodeview" href={inspectorHref}>
            {isKgc ? (locale === "ar" ? "استكشف زي " + cohort.name.ar : "Explore the " + cohort.name.en + " uniform") : heroAction}
            <ArrowUpRight aria-hidden="true" />
          </a>

          <details className="look-menu">
            <summary>{text.look} · {look.name[locale]}</summary>
            <div>
              {availableLooks.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={item.id === look.id ? "is-active" : ""}
                  onClick={() => setLookId(item.id)}
                  data-testid={"look-" + item.id}
                >
                  {item.name[locale]}
                </button>
              ))}
            </div>
          </details>

          <div className="detail-motto">
            <span aria-hidden="true" />
            <p>{detailMotto}</p>
          </div>
        </div>

        <div
          className="detail-visual"
          data-testid="garment-rig"
          data-inspection-mode={isKgc ? "flat" : "synthetic-exploded"}
          data-exploded={isKgc ? "false" : "true"}
        >
          <motion.div
            className="detail-garment"
            key={project.id + "-" + look.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={detailMediaSrc} alt="" fill priority sizes="(max-width: 760px) 100vw, 64vw" />
          </motion.div>
          <ol className="detail-callouts" aria-label={locale === "ar" ? "تفاصيل القطعة" : "Garment details"}>
            {activeDetailLabels.map((label, index) => (
              <li key={label}><span>0{index + 1}</span><strong>{label}</strong></li>
            ))}
          </ol>
          <span className="sharing-note" data-testid="sharing-status">
            {isShared(look, cohort.id) ? (locale === "ar" ? "نظام مشترك" : "Shared system") : (locale === "ar" ? "خاص بالمجموعة" : "Cohort-specific")}
          </span>
        </div>
      </section>

      <footer className="editorial-footer" id="contact">
        <strong className="footer-brand">FARES UNIFORM</strong>
        <span className="footer-rule" aria-hidden="true" />
        <p>{text.footerLine}</p>
        <a href="#work">{text.footerLink}<ArrowUpRight aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
