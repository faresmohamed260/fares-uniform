export type PublicLanguage = "en" | "ar";

export type PublicCatalogItem = {
  slug: string;
  name: string;
  summary: string;
  sector: string;
  image_url: string | null;
};

const catalogKeys = ["slug", "name", "summary", "sector", "image_url"] as const;

const fixtures: Record<PublicLanguage, PublicCatalogItem[]> = {
  en: [
    { slug: "school-polo", name: "School Polo", summary: "A durable everyday uniform program shaped for busy school communities.", sector: "Education", image_url: "/api/catalog-image/school-polo" },
    { slug: "chef-jacket", name: "Chef Jacket", summary: "A polished kitchen program designed for movement, consistency and team identity.", sector: "Hospitality", image_url: "/api/catalog-image/chef-jacket" },
    { slug: "hospitality-shirt", name: "Hospitality Shirt", summary: "A refined service uniform built around comfort and a coherent guest-facing identity.", sector: "Hotels & service", image_url: "/api/catalog-image/hospitality-shirt" },
  ],
  ar: [
    { slug: "school-polo", name: "قميص بولو مدرسي", summary: "برنامج زي يومي متين مصمم ليناسب حركة واحتياجات المجتمعات المدرسية.", sector: "التعليم", image_url: "/api/catalog-image/school-polo" },
    { slug: "chef-jacket", name: "جاكيت شيف", summary: "برنامج مطبخ أنيق مصمم للحركة والتناسق وهوية الفريق.", sector: "الضيافة", image_url: "/api/catalog-image/chef-jacket" },
    { slug: "hospitality-shirt", name: "قميص ضيافة", summary: "زي خدمة راقٍ يركز على الراحة وهوية متماسكة أمام الضيوف.", sector: "الفنادق والخدمة", image_url: "/api/catalog-image/hospitality-shirt" },
  ],
};

function assertCatalogItem(value: unknown): PublicCatalogItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid public catalog item");
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  const expected = [...catalogKeys].sort();
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    throw new Error(`Unexpected public catalog keys: ${keys.join(",")}`);
  }
  if (typeof record.slug !== "string" || typeof record.name !== "string" || typeof record.summary !== "string" || typeof record.sector !== "string" || !(typeof record.image_url === "string" || record.image_url === null)) {
    throw new Error("Invalid public catalog field type");
  }
  return record as PublicCatalogItem;
}

function normalizeImage(item: PublicCatalogItem): PublicCatalogItem {
  return { ...item, image_url: item.image_url ? `/api/catalog-image/${encodeURIComponent(item.slug)}` : null };
}

function providerIsFixture() {
  return process.env.FU_PUBLIC_PROVIDER === "fixture";
}

function odooBaseUrl() {
  const raw = process.env.ODOO_BASE_URL;
  if (!raw) throw new Error("ODOO_BASE_URL is required outside fixture mode");
  return raw.endsWith("/") ? raw : `${raw}/`;
}

async function fetchJson(path: string, language: PublicLanguage) {
  const url = new URL(path.replace(/^\//, ""), odooBaseUrl());
  url.searchParams.set("lang", language);
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Public catalog request failed with ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

export async function getCatalog(language: PublicLanguage): Promise<PublicCatalogItem[]> {
  if (providerIsFixture()) return fixtures[language].map(assertCatalogItem);
  const payload = await fetchJson("/fu/public/catalog", language);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Invalid catalog response");
  const record = payload as Record<string, unknown>;
  if (Object.keys(record).length !== 1 || !Array.isArray(record.items)) throw new Error("Unexpected catalog response shape");
  return record.items.map(assertCatalogItem).map(normalizeImage);
}

export async function getCatalogItem(slug: string, language: PublicLanguage): Promise<PublicCatalogItem | null> {
  if (providerIsFixture()) return fixtures[language].find((item) => item.slug === slug) ?? null;
  const payload = await fetchJson(`/fu/public/catalog/${encodeURIComponent(slug)}`, language);
  return payload ? normalizeImage(assertCatalogItem(payload)) : null;
}
