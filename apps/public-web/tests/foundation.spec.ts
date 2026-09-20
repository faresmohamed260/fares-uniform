import { expect, test, type APIResponse, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const leak = /\b(price|stock|inventory|barcode|sku|cost|egp)\b/i;

async function capture(page: Page, name: string) {
  const dir = path.join(process.cwd(), "evidence", "phase10-foundation", "screenshots");
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

async function assertNoOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client + 1);
}

async function assertNoLeakText(text: string) {
  expect(text).not.toMatch(leak);
}

async function assertSsrLocale(response: APIResponse, locale: "en" | "ar", dir: "ltr" | "rtl") {
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(`<html lang="${locale}" dir="${dir}"`);
  await assertNoLeakText(html);
}

test("root redirects to the canonical English locale", async ({ request }) => {
  const response = await request.get("/", { maxRedirects: 0 });
  expect([307, 308]).toContain(response.status());
  const location = response.headers().location;
  expect(location).toBeTruthy();
  expect(new URL(location!, "http://127.0.0.1:4173").pathname).toBe("/en");
});

test("English and Arabic locale attributes are server-rendered", async ({ request }) => {
  await assertSsrLocale(await request.get("/en"), "en", "ltr");
  await assertSsrLocale(await request.get("/ar"), "ar", "rtl");
});

test("English foundation is Fares-led, canonical and keyboard usable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Designed as one. Worn together.");
  await expect(page.getByRole("link", { name: "Fares Uniform" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute("href", /\/ar$/);

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();

  const body = await page.locator("body").innerText();
  await assertNoLeakText(body);
  expect(body).not.toContain("KGC");
  await assertNoOverflow(page);
  await capture(page, "foundation_en_desktop.png");
});

test("Arabic foundation is canonical RTL without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");

  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("مصمّم كمنظومة واحدة");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/ar$/);
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");

  await assertNoLeakText(await page.locator("body").innerText());
  await assertNoOverflow(page);
  await capture(page, "foundation_ar_mobile.png");
});

test("work discovery uses a canonical locale route and keeps public payload clean", async ({ page }) => {
  const observed: string[] = [];
  page.on("response", async (response) => {
    const type = response.headers()["content-type"] ?? "";
    if (!/(text\/html|text\/x-component|application\/json)/i.test(type)) return;
    try {
      observed.push(await response.text());
    } catch {
      // A navigation can dispose an in-flight body; absence is not evidence of a leak.
    }
  });

  await page.goto("/en");
  await page.locator(".hero").getByRole("link", { name: "Explore our work" }).click();
  await expect(page).toHaveURL(/\/en\/work$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Selected work");
  await assertNoOverflow(page);

  for (const payload of observed) await assertNoLeakText(payload);
});

test("unknown locale and unknown localized route fail closed", async ({ request }) => {
  expect((await request.get("/fr")).status()).toBe(404);
  expect((await request.get("/en/does-not-exist")).status()).toBe(404);
});
