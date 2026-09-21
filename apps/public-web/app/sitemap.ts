import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/public-data";
import { getV2Project, getV2Work } from "@/lib/public-v2";

export const dynamic = "force-dynamic";

function origin() {
  const configured = process.env.PUBLIC_SITE_ORIGIN?.trim() || "https://faresuniform.uk";
  return configured.replace(/\/+$/, "");
}

function canonical(path: string) {
  return `${origin()}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workEn, workAr, catalogEn, catalogAr] = await Promise.all([
    getV2Work("en"),
    getV2Work("ar"),
    getCatalog("en"),
    getCatalog("ar"),
  ]);

  const urls = new Set<string>([
    canonical("/en"),
    canonical("/ar"),
    canonical("/en/work"),
    canonical("/ar/work"),
  ]);

  for (const [locale, work] of [["en", workEn], ["ar", workAr]] as const) {
    for (const item of work.items) {
      const projectPath = `/${locale}/work/${item.organization.slug}/${item.program.slug}`;
      urls.add(canonical(projectPath));
      const project = await getV2Project(item.organization.slug, item.program.slug, locale);
      for (const garment of project?.garments ?? []) {
        urls.add(canonical(`${projectPath}/${garment.slug}`));
      }
    }
  }

  for (const [locale, catalog] of [["en", catalogEn], ["ar", catalogAr]] as const) {
    for (const item of catalog) {
      urls.add(canonical(`/${locale}/catalog/${item.slug}`));
    }
  }

  return [...urls].map((url) => ({
    url,
    changeFrequency: "weekly",
    priority: url.endsWith("/en") || url.endsWith("/ar") ? 1 : 0.7,
  }));
}
