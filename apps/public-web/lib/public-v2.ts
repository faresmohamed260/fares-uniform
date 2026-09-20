import { odooPrivateFetch, odooPrivateUrl } from "./odoo-private";
import type { PublicLocale } from "./locale";

export const PUBLIC_V2_CONTRACT_VERSION = "2.0.0";

export type V2Organization = { slug: string; name: string; sector: string };
export type V2ProgramSummary = { slug: string; title: string; summary: string };
export type V2WorkSummary = { organization: V2Organization; program: V2ProgramSummary };
export type V2HomeResponse = { featured_work: V2WorkSummary[] };
export type V2WorkResponse = { items: V2WorkSummary[] };
export type V2VisualSkin = { accent: string; accent_secondary: string; motif: string };
export type V2Program = V2ProgramSummary & { brief: string; visual_skin: V2VisualSkin };
export type V2Cohort = { slug: string; label: string; tagline: string; order: number };
export type V2Look = { slug: string; label: string; cohorts: string[]; garments: string[]; order: number };
export type V2PublicMedia = {
  url: string;
  role: "hero" | "lineup" | "garment" | "detail" | "social";
  view: "worn" | "front" | "back" | "detail" | "layer";
  width: number;
  height: number;
  decorative: boolean;
  alt: string;
  caption: string;
};
export type V2Garment = {
  slug: string;
  name: string;
  category: string;
  inspection_mode: "flat" | "exploded";
  media: V2PublicMedia[];
};
export type V2ProjectResponse = {
  organization: V2Organization;
  program: V2Program;
  cohorts: V2Cohort[];
  looks: V2Look[];
  garments: V2Garment[];
  media: V2PublicMedia[];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const forbidden = new Set([
  "id", "product_id", "price", "stock", "inventory", "cost", "sku", "barcode",
  "private_object_key", "public_object_key", "content_hash", "rights_state",
  "source_classification", "credit",
]);

function exactRecord(value: unknown, keys: readonly string[], label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Invalid V2 ${label}`);
  const record = value as Record<string, unknown>;
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`Unexpected V2 ${label} keys: ${actual.join(",")}`);
  }
  return record;
}

function noPrivateKeys(value: unknown): void {
  if (Array.isArray(value)) { value.forEach(noPrivateKeys); return; }
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (forbidden.has(key)) throw new Error(`Forbidden public V2 field: ${key}`);
    noPrivateKeys(nested);
  }
}

function stringField(value: unknown, label: string, required = true) {
  if (typeof value !== "string" || (required && value.length === 0)) throw new Error(`Invalid V2 ${label}`);
  return value;
}

function slug(value: unknown, label: string) {
  const result = stringField(value, label);
  if (result.length > 120 || !slugPattern.test(result)) throw new Error(`Invalid V2 ${label}`);
  return result;
}

function integer(value: unknown, label: string, minimum = 0) {
  if (!Number.isInteger(value) || (value as number) < minimum) throw new Error(`Invalid V2 ${label}`);
  return value as number;
}

function organization(value: unknown): V2Organization {
  const r = exactRecord(value, ["slug", "name", "sector"], "organization");
  return { slug: slug(r.slug, "organization.slug"), name: stringField(r.name, "organization.name"), sector: stringField(r.sector, "organization.sector", false) };
}

function programSummary(value: unknown): V2ProgramSummary {
  const r = exactRecord(value, ["slug", "title", "summary"], "program summary");
  return { slug: slug(r.slug, "program.slug"), title: stringField(r.title, "program.title"), summary: stringField(r.summary, "program.summary", false) };
}

function workSummary(value: unknown): V2WorkSummary {
  const r = exactRecord(value, ["organization", "program"], "work summary");
  return { organization: organization(r.organization), program: programSummary(r.program) };
}

function visualSkin(value: unknown): V2VisualSkin {
  const r = exactRecord(value, ["accent", "accent_secondary", "motif"], "visual skin");
  const accent = stringField(r.accent, "visual_skin.accent");
  const accentSecondary = stringField(r.accent_secondary, "visual_skin.accent_secondary");
  if (!/^#[0-9A-Fa-f]{6}$/.test(accent) || !/^#[0-9A-Fa-f]{6}$/.test(accentSecondary)) throw new Error("Invalid V2 visual skin color");
  return { accent, accent_secondary: accentSecondary, motif: stringField(r.motif, "visual_skin.motif", false) };
}

function cohort(value: unknown): V2Cohort {
  const r = exactRecord(value, ["slug", "label", "tagline", "order"], "cohort");
  return { slug: slug(r.slug, "cohort.slug"), label: stringField(r.label, "cohort.label"), tagline: stringField(r.tagline, "cohort.tagline", false), order: integer(r.order, "cohort.order") };
}

function stringSlugs(value: unknown, label: string) {
  if (!Array.isArray(value)) throw new Error(`Invalid V2 ${label}`);
  return value.map((entry, index) => slug(entry, `${label}[${index}]`));
}

function look(value: unknown): V2Look {
  const r = exactRecord(value, ["slug", "label", "cohorts", "garments", "order"], "look");
  return { slug: slug(r.slug, "look.slug"), label: stringField(r.label, "look.label"), cohorts: stringSlugs(r.cohorts, "look.cohorts"), garments: stringSlugs(r.garments, "look.garments"), order: integer(r.order, "look.order") };
}

function media(value: unknown): V2PublicMedia {
  const r = exactRecord(value, ["url", "role", "view", "width", "height", "decorative", "alt", "caption"], "media");
  const role = stringField(r.role, "media.role");
  const view = stringField(r.view, "media.view");
  if (!["hero", "lineup", "garment", "detail", "social"].includes(role)) throw new Error("Invalid V2 media.role");
  if (!["worn", "front", "back", "detail", "layer"].includes(view)) throw new Error("Invalid V2 media.view");
  if (typeof r.decorative !== "boolean") throw new Error("Invalid V2 media.decorative");
  const url = stringField(r.url, "media.url");
  new URL(url);
  return {
    url,
    role: role as V2PublicMedia["role"],
    view: view as V2PublicMedia["view"],
    width: integer(r.width, "media.width", 1),
    height: integer(r.height, "media.height", 1),
    decorative: r.decorative,
    alt: stringField(r.alt, "media.alt", false),
    caption: stringField(r.caption, "media.caption", false),
  };
}

function garment(value: unknown): V2Garment {
  const r = exactRecord(value, ["slug", "name", "category", "inspection_mode", "media"], "garment");
  const inspection = stringField(r.inspection_mode, "garment.inspection_mode");
  if (inspection !== "flat" && inspection !== "exploded") throw new Error("Invalid V2 garment.inspection_mode");
  if (!Array.isArray(r.media)) throw new Error("Invalid V2 garment.media");
  return { slug: slug(r.slug, "garment.slug"), name: stringField(r.name, "garment.name"), category: stringField(r.category, "garment.category", false), inspection_mode: inspection, media: r.media.map(media) };
}

function parseHome(value: unknown): V2HomeResponse {
  noPrivateKeys(value);
  const r = exactRecord(value, ["featured_work"], "home response");
  if (!Array.isArray(r.featured_work)) throw new Error("Invalid V2 featured_work");
  return { featured_work: r.featured_work.map(workSummary) };
}

function parseWork(value: unknown): V2WorkResponse {
  noPrivateKeys(value);
  const r = exactRecord(value, ["items"], "work response");
  if (!Array.isArray(r.items)) throw new Error("Invalid V2 work items");
  return { items: r.items.map(workSummary) };
}

function parseProject(value: unknown): V2ProjectResponse {
  noPrivateKeys(value);
  const r = exactRecord(value, ["organization", "program", "cohorts", "looks", "garments", "media"], "project response");
  const p = exactRecord(r.program, ["slug", "title", "summary", "brief", "visual_skin"], "program");
  for (const [key, value] of Object.entries({ cohorts: r.cohorts, looks: r.looks, garments: r.garments, media: r.media })) {
    if (!Array.isArray(value)) throw new Error(`Invalid V2 project ${key}`);
  }
  return {
    organization: organization(r.organization),
    program: { ...programSummary({ slug: p.slug, title: p.title, summary: p.summary }), brief: stringField(p.brief, "program.brief", false), visual_skin: visualSkin(p.visual_skin) },
    cohorts: (r.cohorts as unknown[]).map(cohort),
    looks: (r.looks as unknown[]).map(look),
    garments: (r.garments as unknown[]).map(garment),
    media: (r.media as unknown[]).map(media),
  };
}

function fixtureWork(locale: PublicLocale): V2WorkSummary {
  return locale === "ar"
    ? { organization: { slug: "harbor-house", name: "هاربور هاوس", sector: "الضيافة" }, program: { slug: "service-program", title: "برنامج فريق الخدمة", summary: "بيانات صناعية لاختبار بنية عرض المشروعات العامة دون استخدام أصول عميل حقيقي." } }
    : { organization: { slug: "harbor-house", name: "Harbor House", sector: "Hospitality" }, program: { slug: "service-program", title: "Service team program", summary: "Synthetic content used to verify the generic public project architecture without publishing real-client media." } };
}

function providerIsFixture() {
  return process.env.FU_PUBLIC_PROVIDER === "fixture";
}

async function fetchV2(path: string, locale: PublicLocale) {
  const url = odooPrivateUrl(path);
  url.searchParams.set("lang", locale);
  const response = await odooPrivateFetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Public V2 request failed with ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

export async function getV2Home(locale: PublicLocale): Promise<V2HomeResponse> {
  if (providerIsFixture()) return parseHome({ featured_work: [fixtureWork(locale)] });
  return parseHome(await fetchV2("/fu/public/v2/home", locale));
}

export async function getV2Work(locale: PublicLocale): Promise<V2WorkResponse> {
  if (providerIsFixture()) return parseWork({ items: [fixtureWork(locale)] });
  return parseWork(await fetchV2("/fu/public/v2/work", locale));
}

export async function getV2Project(organizationSlug: string, programSlug: string, locale: PublicLocale): Promise<V2ProjectResponse | null> {
  if (providerIsFixture()) {
    if (organizationSlug !== "harbor-house" || programSlug !== "service-program") return null;
    const summary = fixtureWork(locale);
    return parseProject({
      organization: summary.organization,
      program: { ...summary.program, brief: summary.program.summary, visual_skin: { accent: "#163A5F", accent_secondary: "#A84646", motif: "synthetic-line" } },
      cohorts: [], looks: [], garments: [], media: [],
    });
  }
  const payload = await fetchV2(`/fu/public/v2/work/${encodeURIComponent(organizationSlug)}/${encodeURIComponent(programSlug)}`, locale);
  return payload ? parseProject(payload) : null;
}
