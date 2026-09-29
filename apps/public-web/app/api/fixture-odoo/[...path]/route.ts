import { recordPublicCacheFixtureRead } from "@/lib/public-cache-fixture";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function allowed() {
  return process.env.FU_PUBLIC_PROVIDER === "cache-fixture";
}

function work(locale: "en" | "ar") {
  return locale === "ar"
    ? {
        organization: { slug: "harbor-house", name: "هاربور هاوس", sector: "الضيافة" },
        program: {
          slug: "service-program",
          title: "برنامج فريق الخدمة",
          summary: "بيانات صناعية لاختبار بنية عرض المشروعات العامة دون استخدام أصول عميل حقيقي.",
        },
      }
    : {
        organization: { slug: "harbor-house", name: "Harbor House", sector: "Hospitality" },
        program: {
          slug: "service-program",
          title: "Service team program",
          summary: "Synthetic content used to verify the generic public project architecture without publishing real-client media.",
        },
      };
}

function catalog(locale: "en" | "ar") {
  return locale === "ar"
    ? [
        { slug: "school-polo", name: "قميص بولو مدرسي", summary: "برنامج زي يومي متين.", sector: "التعليم", image_url: null },
        { slug: "chef-jacket", name: "جاكيت شيف", summary: "برنامج مطبخ أنيق.", sector: "الضيافة", image_url: null },
        { slug: "hospitality-shirt", name: "قميص ضيافة", summary: "زي خدمة راقٍ.", sector: "الفنادق والخدمة", image_url: null },
      ]
    : [
        { slug: "school-polo", name: "School Polo", summary: "A durable everyday uniform program.", sector: "Education", image_url: null },
        { slug: "chef-jacket", name: "Chef Jacket", summary: "A polished kitchen program.", sector: "Hospitality", image_url: null },
        { slug: "hospitality-shirt", name: "Hospitality Shirt", summary: "A refined service uniform.", sector: "Hotels & service", image_url: null },
      ];
}

function project(locale: "en" | "ar") {
  const summary = work(locale);
  const ar = locale === "ar";
  return {
    organization: summary.organization,
    program: {
      ...summary.program,
      brief: summary.program.summary,
      visual_skin: { accent: "#163A5F", accent_secondary: "#A84646", motif: "synthetic-line" },
    },
    cohorts: [
      { slug: "front-desk", label: ar ? "الاستقبال" : "Front desk", tagline: ar ? "الترحيب بالضيوف" : "Guest arrival and reception", order: 0 },
      { slug: "kitchen", label: ar ? "المطبخ" : "Kitchen", tagline: ar ? "عمل جماعي سريع" : "Fast daily movement and teamwork", order: 1 },
      { slug: "facilities", label: ar ? "المرافق" : "Facilities", tagline: ar ? "طبقات عملية" : "Practical field layers", order: 2 },
    ],
    looks: [
      { slug: "service", label: ar ? "طقم الخدمة" : "Service set", cohorts: ["front-desk", "kitchen"], garments: ["service-shirt", "tailored-trouser"], order: 0 },
      { slug: "utility", label: ar ? "طقم العمل" : "Utility set", cohorts: ["facilities"], garments: ["utility-overshirt", "work-trouser"], order: 1 },
      { slug: "outerwear", label: ar ? "الطبقة الخارجية" : "Outerwear", cohorts: ["facilities"], garments: ["field-jacket", "work-trouser"], order: 2 },
    ],
    garments: [
      { slug: "service-shirt", name: ar ? "قميص خدمة" : "Service shirt", category: ar ? "قميص" : "Shirt", inspection_mode: "flat", media: [] },
      { slug: "tailored-trouser", name: ar ? "بنطال رسمي" : "Tailored trouser", category: ar ? "بنطال" : "Trouser", inspection_mode: "flat", media: [] },
      { slug: "utility-overshirt", name: ar ? "قميص عمل خارجي" : "Utility overshirt", category: ar ? "طبقة عمل" : "Work layer", inspection_mode: "flat", media: [] },
      { slug: "work-trouser", name: ar ? "بنطال عمل" : "Work trouser", category: ar ? "بنطال" : "Trouser", inspection_mode: "flat", media: [] },
      { slug: "field-jacket", name: ar ? "سترة ميدانية" : "Field jacket", category: ar ? "سترة" : "Jacket", inspection_mode: "flat", media: [] },
    ],
    media: [],
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (!allowed()) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const rawPath = (await params).path.join("/");
  const url = new URL(request.url);
  const locale = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  const key = `${rawPath}:${locale}`;
  if (!recordPublicCacheFixtureRead(key)) {
    return NextResponse.json({ error: "fixture_unavailable" }, { status: 503 });
  }

  if (rawPath === "fu/public/v2/home") return NextResponse.json({ featured_work: [work(locale)] });
  if (rawPath === "fu/public/v2/work") return NextResponse.json({ items: [work(locale)] });
  if (rawPath === "fu/public/v2/work/harbor-house/service-program") return NextResponse.json(project(locale));
  if (rawPath === "fu/public/catalog") return NextResponse.json({ items: catalog(locale) });
  if (rawPath.startsWith("fu/public/catalog/")) {
    const slug = decodeURIComponent(rawPath.slice("fu/public/catalog/".length));
    const item = catalog(locale).find((entry) => entry.slug === slug);
    return item ? NextResponse.json(item) : NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}
