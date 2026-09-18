"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Languages, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { projects, type Locale, type Look, type Project } from "@/lib/projects";

const copy = {
  en: {
    work: "Selected work",
    approach: "Approach",
    contact: "Discuss your program",
    hero: "Designed as one. Worn together.",
    sub: "Coordinated uniform programs designed and manufactured in Egypt for organizations and teams.",
    explore: "Explore our work",
    project: "Project",
    synthetic: "Synthetic study",
    review: "Private review fixture",
    chooseLook: "Choose a look",
    inspect: "Explode garment",
    reassemble: "Reassemble",
    construction: "Construction study",
    layers: ["Silhouette", "Side panels", "Sleeves", "Collar", "Identity detail"],
    current: "Current selection",
    shared: "Shared system",
    unique: "Cohort-specific",
    note: "Synthetic vector study for motion review; not approved production media.",
  },
  ar: {
    work: "أعمال مختارة",
    approach: "منهجنا",
    contact: "ناقش برنامجك معنا",
    hero: "مصمّم كمنظومة واحدة. يُرتدى بروح واحدة.",
    sub: "برامج زي موحّد متكاملة، مصمّمة ومُصنّعة في مصر للمؤسسات والفرق.",
    explore: "استكشف أعمالنا",
    project: "المشروع",
    synthetic: "دراسة تخيلية",
    review: "نموذج مراجعة خاص",
    chooseLook: "اختر الإطلالة",
    inspect: "فكّ طبقات القطعة",
    reassemble: "إعادة التجميع",
    construction: "دراسة التكوين",
    layers: ["الشكل العام", "الألواح الجانبية", "الأكمام", "الياقة", "تفصيل الهوية"],
    current: "الاختيار الحالي",
    shared: "نظام مشترك",
    unique: "خاص بالمجموعة",
    note: "دراسة متجهية تخيلية لمراجعة الحركة وليست مادة إنتاج معتمدة.",
  },
};

const garmentLayers = [
  { id: "body", className: "layer-body", x: 0, y: 0, r: 0 },
  { id: "panel-left", className: "layer-panel layer-panel-left", x: -86, y: 10, r: -5 },
  { id: "panel-right", className: "layer-panel layer-panel-right", x: 86, y: 10, r: 5 },
  { id: "sleeve-left", className: "layer-sleeve layer-sleeve-left", x: -132, y: -10, r: -10 },
  { id: "sleeve-right", className: "layer-sleeve layer-sleeve-right", x: 132, y: -10, r: 10 },
  { id: "collar", className: "layer-collar", x: 0, y: -78, r: 0 },
  { id: "identity", className: "layer-identity", x: 0, y: 88, r: 0 },
] as const;

function firstLook(project: Project, cohortId: string) {
  const cohort = project.cohorts.find((item) => item.id === cohortId) ?? project.cohorts[0];
  return project.looks.find((look) => look.id === cohort.lookIds[0]) ?? project.looks[0];
}

function isShared(look: Look, cohortId: string) {
  return look.sharedAcross === "all" || Array.isArray(look.sharedAcross) && look.sharedAcross.includes(cohortId);
}

function GarmentStudy({ look, exploded, locale, reduced }: { look: Look; exploded: boolean; locale: Locale; reduced: boolean }) {
  return (
    <div className={`garment-rig variant-${look.variant}`} data-testid="garment-rig" data-exploded={exploded} aria-label={look.garment[locale]}>
      <div className="rig-shadow" aria-hidden="true" />
      {garmentLayers.map((layer) => (
        <motion.div
          className={`garment-layer ${layer.className}`}
          key={layer.id}
          animate={exploded ? { x: layer.x, y: layer.y, rotate: layer.r } : { x: 0, y: 0, rotate: 0 }}
          transition={{ duration: reduced ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <span />
        </motion.div>
      ))}
    </div>
  );
}

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

export function PatternExperience({ initialLocale }: { initialLocale: Locale }) {
  const reduced = usePrefersReducedMotion();
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const [cohortId, setCohortId] = useState(project.cohorts[0].id);
  const [lookId, setLookId] = useState(firstLook(project, cohortId).id);
  const [exploded, setExploded] = useState(false);
  const text = copy[locale];
  const cohort = project.cohorts.find((item) => item.id === cohortId) ?? project.cohorts[0];
  const availableLooks = useMemo(() => project.looks.filter((look) => cohort.lookIds.includes(look.id)), [project, cohort]);
  const look = availableLooks.find((item) => item.id === lookId) ?? availableLooks[0];
  const cohortIndex = project.cohorts.findIndex((item) => item.id === cohort.id);
  const cohortPosition = project.cohorts.length > 1 ? (cohortIndex / (project.cohorts.length - 1)) * 100 : 50;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  function selectProject(nextId: string) {
    const next = projects.find((item) => item.id === nextId) ?? projects[0];
    const nextCohort = next.cohorts[0];
    setProjectId(next.id);
    setCohortId(nextCohort.id);
    setLookId(firstLook(next, nextCohort.id).id);
    setExploded(false);
  }

  function selectCohort(nextId: string) {
    setCohortId(nextId);
    if (!project.cohorts.find((item) => item.id === nextId)?.lookIds.includes(lookId)) {
      setLookId(firstLook(project, nextId).id);
    }
    setExploded(false);
  }

  const style = {
    "--project-accent": project.skin.accent,
    "--project-soft": project.skin.accentSoft,
    "--project-ink": project.skin.ink,
  } as CSSProperties;

  return (
    <main className="experience" style={style} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-reduced-motion={reduced}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Fares Uniform">Fares <span>Uniform</span></a>
        <nav aria-label="Primary">
          <a href="#work">{text.work}</a>
          <a href="#approach">{text.approach}</a>
          <a className="contact-link" href="#contact">{text.contact}<ArrowUpRight aria-hidden="true" /></a>
          <button className="language-button" type="button" onClick={() => setLocale((value) => value === "en" ? "ar" : "en")} aria-label={locale === "en" ? "العربية" : "English"}>
            <Languages aria-hidden="true" />{locale === "en" ? "AR" : "EN"}
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>{text.hero}</h1>
          <p>{text.sub}</p>
          <a className="primary-action" href="#work">{text.explore}<ArrowDownRight aria-hidden="true" /></a>
        </div>
        <div className="hero-composition" aria-hidden="true" data-testid="hero-editorial">
          <Image src="/media/fares-team-editorial.webp" alt="" fill priority sizes="(max-width: 760px) 100vw, 54vw" />
          <div className="seam-line" />
          <span>FU</span>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-intro">
          <span>{text.project} 01</span>
          <h2 id="work-title">{text.work}</h2>
          <p>{locale === "ar" ? "تتغير لغة المشروع، بينما تبقى تجربة فارس ثابتة." : "The project language changes. The Fares experience stays coherent."}</p>
        </div>

        <div className="project-switcher" role="tablist" aria-label={text.work}>
          {projects.map((item, index) => (
            <button
              role="tab"
              aria-selected={item.id === project.id}
              className={item.id === project.id ? "is-active" : ""}
              key={item.id}
              onClick={() => selectProject(item.id)}
              data-testid={`project-${item.id}`}
            >
              <span>0{index + 1}</span>
              <strong>{item.organization[locale]}</strong>
              <small>{item.sector[locale]}</small>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            className="cohort-editorial"
            key={`cohort-media-${project.id}`}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.45 }}
            data-testid="cohort-editorial"
          >
            <div className="cohort-image">
              <Image
                src={project.id === "kgc-national" ? "/media/synthetic-cohort-lineup.webp" : "/media/fares-team-editorial.webp"}
                alt=""
                fill
                priority
                sizes="(max-width: 760px) 100vw, 1440px"
                style={{ objectPosition: `${cohortPosition}% center` }}
              />
            </div>
            <div className="cohort-labels">
              {project.cohorts.map((item, index) => (
                <button key={item.id} onClick={() => selectCohort(item.id)} aria-pressed={item.id === cohort.id}>
                  <span>0{index + 1}</span><strong>{item.name[locale]}</strong>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.article
            className={`project-stage motif-${project.skin.motif}`}
            key={project.id}
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -18 }}
            transition={{ duration: reduced ? 0 : 0.48 }}
          >
            <div className="project-copy">
              <span className="project-status">{project.synthetic ? text.synthetic : text.review}</span>
              <h3>{project.organization[locale]}</h3>
              <p className="program-name">{project.program[locale]}</p>
              <p>{project.summary[locale]}</p>
              <dl>
                <div><dt>{project.cohortsLabel[locale]}</dt><dd>{project.cohorts.length.toString().padStart(2, "0")}</dd></div>
                <div><dt>{locale === "ar" ? "الإطلالات" : "Looks"}</dt><dd>{project.looks.length.toString().padStart(2, "0")}</dd></div>
              </dl>
            </div>

            <div className="selector-panel">
              <div className="selector-block">
                <div className="selector-heading"><span>{project.cohortsLabel[locale]}</span><strong>{cohort.name[locale]}</strong></div>
                <div className="choice-rail" role="tablist" aria-label={project.cohortsLabel[locale]} data-testid="cohort-rail">
                  {project.cohorts.map((item) => (
                    <button role="tab" aria-selected={item.id === cohort.id} className={item.id === cohort.id ? "is-active" : ""} key={item.id} onClick={() => selectCohort(item.id)} data-testid={`cohort-${item.id}`}>
                      {item.name[locale]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="selector-block">
                <div className="selector-heading"><span>{text.chooseLook}</span><strong>{look.name[locale]}</strong></div>
                <div className="choice-rail look-rail" role="tablist" aria-label={text.chooseLook}>
                  {availableLooks.map((item) => (
                    <button role="tab" aria-selected={item.id === look.id} className={item.id === look.id ? "is-active" : ""} key={item.id} onClick={() => { setLookId(item.id); setExploded(false); }} data-testid={`look-${item.id}`}>
                      {item.name[locale]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="inspection">
              <div className="inspection-heading">
                <div><span>{text.construction}</span><h4>{look.garment[locale]}</h4></div>
                <button className="inspect-button" type="button" aria-pressed={exploded} onClick={() => setExploded((value) => !value)} data-testid="explode-toggle">
                  {exploded ? <RotateCcw aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                  {exploded ? text.reassemble : text.inspect}
                </button>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="garment-transition"
                  key={`${project.id}-${look.id}`}
                  initial={reduced ? false : { opacity: 0, y: 18, scale: 0.965 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 1.015 }}
                  transition={{ duration: reduced ? 0 : 0.46, ease: [0.22, 1, 0.36, 1] }}
                  data-testid="garment-transition"
                >
                  <GarmentStudy look={look} exploded={exploded} locale={locale} reduced={reduced} />
                </motion.div>
              </AnimatePresence>
              <div className="selection-caption">
                <span>{text.current}</span>
                <strong>{cohort.name[locale]} · {look.name[locale]}</strong>
                <em data-testid="sharing-status">{isShared(look, cohort.id) ? text.shared : text.unique}</em>
              </div>
            </div>

            <ol className="layer-list" aria-label={text.construction}>
              {text.layers.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}
            </ol>
            <p className="prototype-note">{text.note}</p>
          </motion.article>
        </AnimatePresence>
      </section>

      <section className="material-section" aria-labelledby="material-title">
        <div className="material-copy">
          <span>{locale === "ar" ? "تفاصيل أقرب" : "A closer look"}</span>
          <h2 id="material-title">{locale === "ar" ? "غرض في كل طبقة." : "Purpose in every layer."}</h2>
          <p>{locale === "ar" ? "أقمشة متينة. بناء مدروس. تفاصيل واضحة يمكن مراجعتها قبل التصنيع." : "Durable textiles. Considered construction. Clear details that can be reviewed before manufacturing."}</p>
          <ol>
            <li><b>01</b>{locale === "ar" ? "قماش أساسي متين" : "Durable main textile"}</li>
            <li><b>02</b>{locale === "ar" ? "ألواح هوية منسقة" : "Coordinated identity panels"}</li>
            <li><b>03</b>{locale === "ar" ? "خياطة وتشطيب دقيق" : "Precise seams and finishing"}</li>
          </ol>
        </div>
        <div className="material-media" data-testid="material-editorial">
          <Image src="/media/uniform-exploded-editorial.webp" alt="" fill priority sizes="(max-width: 760px) 100vw, 58vw" />
        </div>
      </section>

      <section className="approach-section" id="approach">
        <p>{locale === "ar" ? "هوية المؤسسة" : "Organization identity"}</p>
        <span aria-hidden="true">→</span>
        <p>{locale === "ar" ? "نظام الزي" : "Uniform system"}</p>
        <span aria-hidden="true">→</span>
        <p>{locale === "ar" ? "تفاصيل يمكن فحصها" : "Inspectable detail"}</p>
      </section>

      <footer id="contact">
        <strong>Fares Uniform</strong>
        <a href="mailto:hello@example.invalid">{text.contact}<ArrowUpRight aria-hidden="true" /></a>
        <span>{locale === "ar" ? "الإسكندرية · مصر" : "Alexandria · Egypt"}</span>
      </footer>
    </main>
  );
}
