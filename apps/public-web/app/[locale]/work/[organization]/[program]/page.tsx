import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ProjectContinuity } from "@/components/project-continuity";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { requirePublicLocale } from "@/lib/locale";
import { publicMetadata } from "@/lib/metadata";
import { getV2Project } from "@/lib/public-v2";
import styles from "./project-story.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; organization: string; program: string }>;
  searchParams: Promise<{ role?: string; look?: string }>;
};

function routePath(organization: string, program: string) {
  return `work/${encodeURIComponent(organization)}/${encodeURIComponent(program)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, organization, program } = await params;
  const locale = requirePublicLocale(rawLocale);
  const project = await getV2Project(organization, program, locale);
  if (!project) {
    return publicMetadata(
      locale,
      routePath(organization, program),
      locale === "ar" ? "المشروع غير موجود | Fares Uniform" : "Project not found | Fares Uniform",
      locale === "ar" ? "هذا المشروع غير منشور." : "This project is not published.",
    );
  }
  return publicMetadata(
    locale,
    routePath(organization, program),
    `${project.organization.name} · ${project.program.title} | Fares Uniform`,
    project.program.summary,
  );
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const { locale: rawLocale, organization, program } = await params;
  const query = await searchParams;
  const locale = requirePublicLocale(rawLocale);
  const project = await getV2Project(organization, program, locale);
  if (!project) notFound();

  const ar = locale === "ar";
  const path = `/work/${project.organization.slug}/${project.program.slug}`;
  const skin = {
    "--project-accent": project.program.visual_skin.accent,
    "--project-accent-secondary": project.program.visual_skin.accent_secondary,
  } as CSSProperties;

  return (
    <>
      <SiteHeader locale={locale} alternatePath={path} />
      <main id="main-content" style={skin}>
        <section
          className={styles.story}
          data-testid="project-story"
          data-motif={project.program.visual_skin.motif}
        >
          <div className={styles.copy}>
            <Link className={styles.back} href={`/${locale}/work`}>
              <span aria-hidden="true">←</span>
              {ar ? "كل الأعمال" : "All work"}
            </Link>
            <span className={styles.sector}>{project.organization.sector}</span>
            <h1 data-testid="project-organization">{project.organization.name}</h1>
            <p className={styles.program} data-testid="project-program">{project.program.title}</p>
            <p className={styles.summary}>{project.program.brief || project.program.summary}</p>
            <div className={styles.actions}>
              <a className="primary-button" href={`/${locale}#enquiry`}>
                {ar ? "ناقش برنامجك معنا" : "Discuss your program"}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className={styles.visual} aria-hidden="true">
            <span className={styles.panelOne} />
            <span className={styles.panelTwo} />
            <span className={styles.seam} />
            <strong>FU</strong>
          </div>
        </section>

        <ProjectContinuity
          project={project}
          locale={locale}
          initialRole={query.role}
          initialLook={query.look}
        />

        <section className={styles.note} aria-label={ar ? "عن هذا العرض" : "About this presentation"}>
          <span className="eyebrow">{ar ? "منظومة قابلة للتوسع" : "A scalable system"}</span>
          <p>
            {ar
              ? "تتغير هوية المشروع داخل هذا النطاق فقط، بينما تظل تجربة Fares والتنقل وبنية البيانات ثابتة."
              : "The project identity changes inside this story only; the Fares shell, navigation and public-data boundary stay stable."}
          </p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
