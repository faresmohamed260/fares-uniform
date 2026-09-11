import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const leak = /\b(price|stock|inventory|barcode|sku|cost|egp)\b/i;

async function capture(page: Page, name: string) {
  const dir = path.join(process.cwd(), "evidence", "web", "screenshots");
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

async function assertNoOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client + 1);
}

async function assertNoLeak(page: Page) {
  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(leak);
}

test("English desktop public catalog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Built to look like your team");
  await expect(page.locator(".catalog-card")).toHaveCount(3);
  await assertNoLeak(page); await assertNoOverflow(page); await capture(page, "public_en_desktop.png");
});

test("English narrow public catalog", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
  await expect(page.locator(".catalog-card")).toHaveCount(3);
  await assertNoLeak(page); await assertNoOverflow(page); await capture(page, "public_en_narrow.png");
});

test("Arabic desktop is RTL", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?lang=ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("زي يعكس هوية فريقك");
  await assertNoLeak(page); await assertNoOverflow(page); await capture(page, "public_ar_desktop.png");
});

test("Arabic narrow remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await assertNoLeak(page); await assertNoOverflow(page); await capture(page, "public_ar_narrow.png");
});

test("catalog detail and keyboard focus work", async ({ page }) => {
  await page.goto("/?lang=en");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBe("A");
  await page.getByRole("link", { name: /View program: School Polo/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "School Polo" })).toBeVisible();
  await assertNoLeak(page);
});

test("enquiry form returns a fixture reference", async ({ page }) => {
  await page.goto("/?lang=en#enquiry");
  await page.getByLabel("Your name").fill("CI Visitor");
  await page.getByLabel("Organization").fill("CI School");
  await page.getByLabel("Sector / use case").fill("Education");
  await page.getByLabel("Email").fill("ci@example.test");
  await page.getByLabel("What are you looking for?").fill("A coordinated school program.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("FUQ-CI-0001");
});

test("fixture enquiry proxy enforces the Odoo public schema", async ({ request }) => {
  const valid = {
    idempotency_key: "ci-contract-1",
    contact_name: "CI Visitor",
    organization_name: "CI School",
    phone: "",
    email: "ci@example.test",
    sector: "Education",
    message: "A coordinated school program.",
    source_product_slug: "school-polo",
    language: "en",
  };

  const accepted = await request.post("/api/enquiries", { data: valid });
  expect(accepted.status()).toBe(201);
  expect(await accepted.json()).toEqual({ status: "accepted", reference: "FUQ-CI-0001" });

  const { sector: _sector, ...withoutSector } = valid;
  const missingSector = await request.post("/api/enquiries", { data: withoutSector });
  expect(missingSector.status()).toBe(400);

  const unsupported = await request.post("/api/enquiries", { data: { ...valid, source_url: "https://example.invalid" } });
  expect(unsupported.status()).toBe(400);
});

test("reduced motion disables ambient animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?lang=en");
  const animation = await page.getByTestId("ambient-orb").evaluate((element) => getComputedStyle(element).animationName);
  expect(animation).toBe("none");
});
