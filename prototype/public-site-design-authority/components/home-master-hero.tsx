"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import type { Locale } from "@/lib/locale";

export function HomeMasterHero({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 90, damping: 20, mass: 0.7 });
  const fieldX = useTransform(sx, [-1, 1], [-18, 18]);
  const fieldY = useTransform(sy, [-1, 1], [-14, 14]);
  const orbitX = useTransform(sx, [-1, 1], [12, -12]);
  const orbitY = useTransform(sy, [-1, 1], [8, -8]);

  function pointer(event: MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  return (
    <section
      className="home-master-hero"
      data-sc-act="pin"
      data-sc-span="1.65"
      data-sc-drift="#f2efe9"
      data-testid="homepage-master-hero"
      onMouseMove={pointer}
      onMouseLeave={() => { px.set(0); py.set(0); }}
    >
      <div data-sc-stage className="home-master-stage">
        <div className="home-hero-grid" aria-hidden="true" />
        <motion.div className="home-hero-field" style={reduce ? undefined : { x: fieldX, y: fieldY }} aria-hidden="true">
          <img src="/design-media/master-brand-field.svg" alt="" />
        </motion.div>
        <motion.div className="home-hero-orbit" style={reduce ? undefined : { x: orbitX, y: orbitY }} aria-hidden="true">
          <span className="orbit-ring orbit-ring-a" />
          <span className="orbit-ring orbit-ring-b" />
          <span className="orbit-dot orbit-dot-a" />
          <span className="orbit-dot orbit-dot-b" />
        </motion.div>

        <div className="home-hero-kicker">
          <span>FARES / ALEXANDRIA</span>
          <span>{ar ? "تصميم · تصنيع · برامج زي" : "DESIGN · MANUFACTURE · UNIFORM PROGRAMS"}</span>
        </div>

        <h1 className="home-hero-title">
          <span data-sc-cue="0.02 0.74">{ar ? "زي موحّد" : "Uniforms"}</span>
          <span data-sc-cue="0.08 0.82">{ar ? "لأماكن" : "for places"}</span>
          <em data-sc-cue="0.14 0.90">{ar ? "تعمل." : "that work."}</em>
        </h1>

        <div className="home-hero-intro" data-sc-cue="0.12 0.95">
          <p>{ar
            ? "تصمّم Fares وتصنّع برامج زي للمؤسسات عبر التعليم والضيافة والمطاعم والرعاية الصحية والشركات."
            : "Fares designs and manufactures uniform programs for organizations across education, hospitality, food service, healthcare and corporate teams."}</p>
          <div>
            <a className="home-hero-primary" href={`/${locale}/enquiry`}>
              {ar ? "ناقش برنامج الزي" : "Discuss a uniform program"} <span>↗</span>
            </a>
            <a className="home-hero-secondary" href="#industries">
              {ar ? "استكشف القطاعات" : "Explore industries"} <span>↓</span>
            </a>
          </div>
        </div>

        <div className="home-hero-axis" aria-hidden="true">
          <span>01</span><i /><strong>{ar ? "هوية" : "IDENTITY"}</strong><i /><strong>{ar ? "وظيفة" : "FUNCTION"}</strong><i /><strong>{ar ? "صناعة" : "MAKE"}</strong>
        </div>
        <div className="home-hero-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
