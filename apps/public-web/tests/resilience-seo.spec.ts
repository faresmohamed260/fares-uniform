import { expect, test, type Page } from "@playwright/test";

const MOCK = "http://127.0.0.1:4188";

async function setFailure(page: Page, enabled: boolean) {
  const response = await page.request.get(`${MOCK}/__control/fail?enabled=${enabled ? "1" : "0"}`);
  expect(response.ok()).toBeTruthy();
}

test.beforeEach(async ({ page }) => {
  const response = await page.request.get(`${MOCK}/__control/reset`);
  expect(response.ok()).toBeTruthy();
});

test("published work survives a transient upstream outage from the public cache", async ({ page }) => {
  const first = await page.goto("/en/work");
  expect(first?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Selected work");
  await expect(page.getByText("Harbor House")).toBeVisible();

  await page.waitForTimeout(1200);
  await setFailure(page, true);

  const stale = await page.reload({ waitUntil: "domcontentloaded" });
  expect(stale?.status()).toBe(200);
  await expect(page.getByText("Harbor House")).toBeVisible();

  await page.waitForTimeout(400);
  const retained = await page.reload({ waitUntil: "domcontentloaded" });
  expect(retained?.status()).toBe(200);
  await expect(page.getByText("Harbor House")).toBeVisible();
});

test("robots and sitemap expose canonical public routes only", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain("Disallow: /api/");
  expect(robotsText).toContain("Sitemap: https://faresuniform.uk/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of [
    "https://faresuniform.uk/en",
    "https://faresuniform.uk/ar",
    "https://faresuniform.uk/en/work",
    "https://faresuniform.uk/ar/work",
    "https://faresuniform.uk/en/work/harbor-house/service-program",
    "https://faresuniform.uk/ar/work/harbor-house/service-program",
    "https://faresuniform.uk/en/catalog/chef-jacket",
    "https://faresuniform.uk/ar/catalog/chef-jacket",
  ]) {
    expect(xml).toContain(`<loc>${route}</loc>`);
  }
  expect(xml).not.toMatch(/\/api\//);
  expect(xml).not.toMatch(/private|stock|price|barcode|sku/i);
});

test("representative home stays inside the Phase 10 browser resource budget", async ({ page }) => {
  const bytes = { js: 0, css: 0, image: 0, font: 0, other: 0 };
  page.on("response", async (response) => {
    if (!response.ok()) return;
    try {
      const body = await response.body();
      const type = response.headers()["content-type"] || "";
      if (/javascript/i.test(type)) bytes.js += body.byteLength;
      else if (/text\/css/i.test(type)) bytes.css += body.byteLength;
      else if (/image\//i.test(type)) bytes.image += body.byteLength;
      else if (/font|woff/i.test(type)) bytes.font += body.byteLength;
      else bytes.other += body.byteLength;
    } catch {
      // Redirects/streamed bodies can be unavailable; they do not weaken counted assets.
    }
  });

  await page.goto("/en", { waitUntil: "networkidle" });
  const eagerImages = await page.locator('img[loading="eager"]').count();
  expect(eagerImages).toBeLessThanOrEqual(1);

  expect(bytes.js).toBeLessThanOrEqual(850 * 1024);
  expect(bytes.css).toBeLessThanOrEqual(220 * 1024);
  expect(bytes.image).toBeLessThanOrEqual(2.5 * 1024 * 1024);
  expect(bytes.font).toBeLessThanOrEqual(700 * 1024);
  expect(bytes.js + bytes.css + bytes.image + bytes.font).toBeLessThanOrEqual(4 * 1024 * 1024);
});

test("canonical and hreflang metadata remains stable through cached content", async ({ page }) => {
  await page.goto("/ar/work/harbor-house/service-program");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://faresuniform.uk/ar/work/harbor-house/service-program",
  );
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    "href",
    "https://faresuniform.uk/en/work/harbor-house/service-program",
  );
});
