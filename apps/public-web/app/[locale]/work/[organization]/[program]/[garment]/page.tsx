import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { requirePublicLocale } from "@/lib/locale";
import { publicMetadata } from "@/lib/metadata";
import { getV2Project, type V2ProjectResponse } from "@/lib/public-v2";
import styles from "./inspection.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; organization: string; program: string; garment: string }>;
  searchParams: Promise<{ role?: string; look?: string }>;
};

function routePath(organization: string, program: string, garment: string) {
  return `work/${encodeURIComponent(organization)}/${encodeURIComponent(program)}/${encodeURIComponent(garment)}`;
}

function programContext(project: V2ProjectResponse, role?: string, look?: string) {
  if (!role || !look) return "";
  const cohort = project.cohorts.find((item) => item.slug === role);
  const selectedLook = project.looks.find(
    (item) => item.slug === look && item.cohorts.includes(role),
  );
  if (!cohort || !selectedLook) return "";
  const params = new URLSearchParams({ role, look });
  return `?${params.toString()}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, organization, program, garment } = await params;
  const locale = requirePublicLocale(rawLocale);
  const project = await getV2Project(organization, program, locale);
  const item = project?.garments.find((candidate) => candidate.slug === garment);
  if (!project || !item) {
    return publicMetadata(
      locale,
      routePath(organization, program, garment),
      locale === "ar" ? "القطعة غير موجودة | Fares Uniform" : "Garment not found | Fares Uniform",
      locale === "ar" ? "هذه القطعة غير منشورة." : "This garment is not published.",
    );
  }
  return publicMetadata(
    locale,
    routePath(organization, program, garment),
    `${item.name} · ${project.organization.name} | Fares Uniform`,
    project.program.summary,
  );
}

export default async function GarmentInspection({ params, searchParams }: Props) {
  const { locale: rawLocale, organization, program, garment } = await params;
  const query = await searchParams;
  const locale = requirePublicLocale(rawLocale);
  const project = await getV2Project(organization, program, locale);
  if (!project) notFound();

  const item = project.garments.find((candidate) => candidate.slug === garment);
  if (!item) notFound();

  const ar = locale === "ar";
  const context = programContext(project, query.role, query.look);
  const selectedCohort = query.role
    ? project.cohorts.find((cohort) => cohort.slug === query.role)
    : undefined;
  const selectedLook = query.look && selectedCohort
    ? project.looks.find(
        (look) =>
          look.slug === query.look &&
          look.cohorts.includes(selectedCohort.slug) &&
          look.garments.includes(item.slug),
      )
    : undefined;
  const enquiryParams = new URLSearchParams({
    organization: project.organization.slug,
    program: project.program.slug,
  });
  if (selectedCohort) enquiryParams.set("role", selectedCohort.slug);
  if (selectedLook) enquiryParams.set("look", selectedLook.slug);
  enquiryParams.set("garment", item.slug);
  const enquiryHref = `/${locale}?${enquiryParams.toString()}#enquiry`;
  const programPath = `/${locale}/work/${project.organization.slug}/${project.program.slug}`;
  const alternatePath = `/work/${project.organization.slug}/${project.program.slug}/${item.slug}`;
  const layerMedia = item.media.filter((media) => media.view === "layer");
  const canExplode = item.inspection_mode === "exploded" && layerMedia.length > 0;
  const frontMedia = item.media.find((media) => media.view === "front")
    ?? item.media.find((media) => media.view === "worn")
    ?? item.media[0];
  const skin = {
    "--project-accent": project.program.visual_skin.accent,
    "--project-accent-secondary": project.program.visual_skin.accent_secondary,
  } as CSSProperties;

  return (
    <>
      <SiteHeader locale={locale} alternatePath={alternatePath} />
      <main id="main-content" style={skin}>
        <section className={styles.inspection}>
          <div className={styles.copy}>
            <Link className={styles.back} href={programPath + context}>
              <span aria-hidden="true">←</span>
              {ar ? "العودة إلى البرنامج" : "Back to program"}
            </Link>
            <span className={styles.kicker}>{project.organization.name} · {project.program.title}</span>
            <h1 data-testid="inspection-garment">{item.name}</h1>
            <p>{item.category}</p>
            <div className={styles.truth}>
              <span>{ar ? "طريقة العرض" : "Inspection mode"}</span>
              <strong>{canExplode ? (ar ? "طبقات موثقة" : "Documented layers") : (ar ? "عرض مسطح موثوق" : "Truthful flat view")}</strong>
            </div>
            <Link className="primary-button" href={enquiryHref}>
              {ar ? "ناقش هذه القطعة" : "Discuss this garment"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div
            className={styles.rig}
            data-testid="inspection-rig"
            data-inspection-mode={canExplode ? "exploded" : "flat"}
            data-exploded="false"
          >
            {frontMedia ? (
              <Image
                className={styles.media}
                src={frontMedia.url}
                alt={frontMedia.decorative ? "" : frontMedia.alt}
                fill
                sizes="(max-width: 760px) 92vw, 52vw"
                unoptimized
              />
            ) : (
              <div className={styles.flatFallback} aria-label={ar ? "عرض توضيحي للقطعة" : "Garment presentation"}>
                <span className={styles.shoulder} />
                <span className={styles.body} />
                <span className={styles.centerSeam} />
              </div>
            )}
            <span className={styles.modeTag}>{canExplode ? (ar ? "طبقات" : "Layers") : (ar ? "مسطح" : "Flat")}</span>
          </div>

          <aside className={styles.details} aria-label={ar ? "تفاصيل القطعة" : "Garment details"}>
            <span className="eyebrow">{ar ? "تفاصيل موثوقة" : "Source-truth details"}</span>
            <h2>{ar ? "نعرض فقط ما تدعمه المصادر المنشورة." : "Only what published source material supports."}</h2>
            <p>
              {ar
                ? "عندما لا تتوفر طبقات منفصلة معتمدة، تبقى القطعة في عرض مسطح بدلاً من اختراع بنية غير موثقة."
                : "When approved separated layers are unavailable, the garment stays in a flat presentation rather than inventing unsupported construction."}
            </p>
          </aside>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
