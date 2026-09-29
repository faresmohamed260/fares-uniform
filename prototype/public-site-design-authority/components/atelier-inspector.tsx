"use client";

import { useState } from "react";
import { media } from "@/lib/data";
import type { Locale } from "@/lib/locale";

type View = "front" | "back";
type Focus = "silhouette" | "panel" | "collar";

export function AtelierInspector({ locale }: { locale: Locale }) {
  const [view, setView] = useState<View>("front");
  const [focus, setFocus] = useState<Focus>("panel");
  const ar = locale === "ar";
  const src = view === "front" ? media.kgc.poloFront : media.kgc.poloBack;

  const labels = {
    silhouette: ar ? "النسبة والشكل" : "Proportion / silhouette",
    panel: ar ? "لوحة الهوية القطرية" : "Diagonal identity panel",
    collar: ar ? "الياقة وخط الرقبة" : "Collar / neckline",
  };

  return (
    <section className="atelier-inspector" data-testid="garment-inspector">
      <div className="atelier-header">
        <div>
          <span className="micro-label">KGC NATIONAL / HIGH / SUMMER</span>
          <h2>{ar ? "القطعة كما هي فعلاً." : "The garment, as it actually is."}</h2>
        </div>
        <div className="view-switch" aria-label={ar ? "زاوية القطعة" : "Garment view"}>
          {(["front", "back"] as View[]).map((option) => (
            <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)}>
              {ar ? (option === "front" ? "أمام" : "خلف") : option}
            </button>
          ))}
        </div>
      </div>

      <div className="atelier-stage">
        <div className="atelier-grid" aria-hidden="true" />
        <div className={`atelier-object focus-${focus}`}>
          <img src={src} alt={ar ? `قميص High الصيفي - ${view === "front" ? "أمام" : "خلف"}` : `High summer polo — ${view}`} />
          <div className="focus-ring" aria-hidden="true" />
        </div>
        <div className="atelier-measure measure-a" aria-hidden="true"><span>01</span></div>
        <div className="atelier-measure measure-b" aria-hidden="true"><span>02</span></div>
        <p className="truth-chip">{ar ? "صورة أصلية · لا طبقات تصنيع مفبركة" : "Original photography · no fabricated construction layers"}</p>
      </div>

      <div className="atelier-notes">
        {(Object.keys(labels) as Focus[]).map((key, index) => (
          <button key={key} type="button" aria-pressed={focus === key} onClick={() => setFocus(key)}>
            <span>0{index + 1}</span>
            <strong>{labels[key]}</strong>
          </button>
        ))}
        <p>{ar ? "المعاينة تقتصر على التفاصيل المرئية في الوسائط الحقيقية الحالية. عندما تتوفر طبقات أو هندسة فعلية، يمكن للمنظومة أن تضيف عرضاً تركيبياً حقيقياً." : "Inspection is limited to evidence visible in the current real media. If true separated layers or geometry become available, the system can add a real construction view."}</p>
      </div>
    </section>
  );
}
