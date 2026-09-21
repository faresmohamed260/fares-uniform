import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const control = "/api/fixture-public-control";

async function fixture(request: APIRequestContext) {
  const response = await request.get(control);
  expect(response.status()).toBe(200);
  return response.json() as Promise<{ available: boolean; counts: Record<string, number> }>;
}

test.beforeEach(async ({ request }) => {
  const response = await request.post(control, { data: { reset: true, available: true } });
  expect(response.status()).toBe(200);
});

test("robots and sitemap expose only canonical public routes", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain("Sitemap: https://faresuniform.uk/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const url of [
    "https://faresuniform.uk/en",
    "https://faresuniform.uk/ar",
    "https://faresuniform.uk/en/work",
    "https://faresuniform.uk/ar/work",
    "https://faresuniform.uk/en/work/harbor-house/service-program",
    "https://faresuniform.uk/ar/work/harbor-house/service-program",
    "https://faresuniform.uk/en/catalog/school-polo",
    "https://faresuniform.uk/ar/catalog/school-polo",
  ]) expect(xml).toContain(url);
  expect(xml).not.toMatch(/price|stock|inventory|private_object_key|content_hash/i);
});

test("published content is reused from cache and survives a transient upstream failure", async ({ request }) => {
  const first = await request.get("/en");
  expect(first.status()).toBe(200);
  expect(await first.text()).toContain("Harbor House");

  const second = await request.get("/en");
  expect(second.status()).toBe(200);

  const warm = await fixture(request);
  expect(warm.counts["fu/public/v2/home:en"]).toBe(1);
  expect(warm.counts["fu/public/catalog:en"]).toBe(1);

  await request.post(control, { data: { available: false } });
  await new Promise((resolve) => setTimeout(resolve, 1300));

  const stale = await request.get("/en");
  expect(stale.status()).toBe(200);
  expect(await stale.text()).toContain("Harbor House");

  await new Promise((resolve) => setTimeout(resolve, 300));
  const afterFailure = await fixture(request);
  expect(afterFailure.counts["fu/public/v2/home:en"]).toBeGreaterThan(1);
  expect(afterFailure.counts["fu/public/catalog:en"]).toBeGreaterThan(1);
});

test("route metadata remains canonical in both locales", async ({ page }) => {
  await page.goto("/ar/work/harbor-house/service-program");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/ar\/work\/harbor-house\/service-program$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/work\/harbor-house\/service-program$/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /\/ar\/work\/harbor-house\/service-program$/);
});

test("representative homepage stays inside the resource budget and below-fold media is lazy", async ({ page }) => {
  let jsBytes = 0;
  let cssBytes = 0;
  let imageBytes = 0;
  let requests = 0;

  page.on("response", async (response) => {
    requests += 1;
    const type = response.headers()["content-type"] ?? "";
    if (!/(javascript|text\/css|image\/)/i.test(type)) return;
    try {
      const bytes = (await response.body()).byteLength;
      if (/javascript/i.test(type)) jsBytes += bytes;
      else if (/text\/css/i.test(type)) cssBytes += bytes;
      else if (/image\//i.test(type)) imageBytes += bytes;
    } catch {
      // A disposed resource body is not counted against the deterministic budget.
    }
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.waitForLoadState("networkidle");

  expect(jsBytes).toBeLessThanOrEqual(700 * 1024);
  expect(cssBytes).toBeLessThanOrEqual(140 * 1024);
  expect(imageBytes).toBeLessThanOrEqual(1600 * 1024);
  expect(requests).toBeLessThanOrEqual(45);

  const images = page.locator("img");
  const count = await images.count();
  let eager = 0;
  for (let index = 0; index < count; index += 1) {
    const loading = await images.nth(index).getAttribute("loading");
    if (loading === "eager") eager += 1;
  }
  expect(eager).toBeLessThanOrEqual(1);

  const catalogImages = page.locator(".catalog-image img");
  for (let index = 0; index < await catalogImages.count(); index += 1) {
    await expect(catalogImages.nth(index)).toHaveAttribute("loading", "lazy");
  }
});
