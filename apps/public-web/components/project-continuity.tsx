"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { PublicLocale } from "@/lib/locale";
import type { V2Look, V2ProjectResponse } from "@/lib/public-v2";
import styles from "./project-continuity.module.css";

type Props = {
  project: V2ProjectResponse;
  locale: PublicLocale;
  initialRole?: string;
  initialLook?: string;
};

function ordered<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

function looksForRole(project: V2ProjectResponse, role: string) {
  return ordered(project.looks.filter((look) => look.cohorts.includes(role)));
}

function initialState(project: V2ProjectResponse, role?: string, look?: string) {
  const cohorts = ordered(project.cohorts);
  const selectedRole = cohorts.some((item) => item.slug === role) ? role! : cohorts[0]?.slug ?? "";
  const available = looksForRole(project, selectedRole);
  const selectedLook = available.some((item) => item.slug === look) ? look! : available[0]?.slug ?? "";
  return { role: selectedRole, look: selectedLook };
}

export function ProjectContinuity({ project, locale, initialRole, initialLook }: Props) {
  const reduceMotion = useReducedMotion();
  const seeded = useMemo(() => initialState(project, initialRole, initialLook), [project, initialRole, initialLook]);
  const [role, setRole] = useState(seeded.role);
  const [look, setLook] = useState(seeded.look);
  const cohorts = useMemo(() => ordered(project.cohorts), [project]);
  const availableLooks = useMemo(() => looksForRole(project, role), [project, role]);
  const activeLook = availableLooks.find((item) => item.slug === look) ?? availableLooks[0];
  const garments = activeLook
    ? activeLook.garments
        .map((slug) => project.garments.find((garment) => garment.slug === slug))
        .filter((garment): garment is NonNullable<typeof garment> => Boolean(garment))
    : [];

  if (!cohorts.length || !project.looks.length) return null;

  function writeState(nextRole: string, nextLook: string) {
    setRole(nextRole);
    setLook(nextLook);
    const url = new URL(window.location.href);
    url.searchParams.set("role", nextRole);
    url.searchParams.set("look", nextLook);
    window.history.replaceState(null, "", url.pathname + "?" + url.searchParams.toString());
  }

  function selectRole(nextRole: string) {
    const nextLooks = looksForRole(project, nextRole);
    const preserved = nextLooks.find((item) => item.slug === look);
    writeState(nextRole, preserved?.slug ?? nextLooks[0]?.slug ?? "");
  }

  function selectLook(nextLook: V2Look) {
    if (!nextLook.cohorts.includes(role)) return;
    writeState(role, nextLook.slug);
  }

  const ar = locale === "ar";

  return (
    <section className={styles.section} aria-labelledby="continuity-title">
      <div className={styles.intro}>
        <span className="eyebrow">{ar ? "الأدوار والإطلالات" : "Roles and looks"}</span>
        <h2 id="continuity-title">
          {ar ? "منظومة واحدة تتكيّف مع العمل." : "One system, shaped around the work."}
        </h2>
        <p>
          {ar
            ? "تنتقل القطع المشتركة بين الأدوار عندما تكون جزءاً من نفس الإطلالة، وتتغير فقط العناصر التي يحتاجها الدور فعلاً."
            : "Shared garments carry across roles when they belong to the same look; only the pieces that truly change are replaced."}
        </p>
      </div>

      <div className={styles.rail} data-testid="cohort-rail" aria-label={ar ? "الأدوار" : "Roles"}>
        {cohorts.map((cohort, index) => {
          const active = cohort.slug === role;
          return (
            <button
              key={cohort.slug}
              type="button"
              data-testid={`cohort-${cohort.slug}`}
              aria-pressed={active}
              className={active ? styles.activeRole : styles.role}
              onClick={() => selectRole(cohort.slug)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{cohort.label}</strong>
              <small>{cohort.tagline}</small>
            </button>
          );
        })}
      </div>

      <div className={styles.stage}>
        <div className={styles.lookColumn}>
          <span className={styles.label}>{ar ? "الإطلالات المتاحة" : "Available looks"}</span>
          <div className={styles.looks}>
            {availableLooks.map((item) => {
              const active = item.slug === activeLook?.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  data-testid={`look-${item.slug}`}
                  aria-pressed={active}
                  className={active ? styles.activeLook : styles.look}
                  onClick={() => selectLook(item)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          className={styles.figure}
          key={`${role}:${activeLook?.slug ?? "none"}`}
          initial={reduceMotion ? false : { opacity: 0, x: ar ? -24 : 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <span className={styles.shoulder} />
          <span className={styles.body} />
          <span className={styles.seam} />
        </motion.div>

        <div className={styles.garmentColumn}>
          <span className={styles.label}>{ar ? "القطع النشطة" : "Active garments"}</span>
          <ul data-testid="active-garments">
            {garments.map((garment, index) => (
              <li key={garment.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Link
                  href={`/${locale}/work/${project.organization.slug}/${project.program.slug}/${garment.slug}?role=${role}&look=${activeLook?.slug ?? ""}`}
                >
                  <strong>{garment.name}</strong>
                  <small>{garment.category}</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
