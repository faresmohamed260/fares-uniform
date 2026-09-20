import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const leak = /\b(price|stock|inventory|barcode|sku|cost|egp|private_object_key|content_hash|rights_state)\b/i;

async function capture(page: Page, name: string) {
  const dir = path.join(process.cwd(), "evidence", "phase10-pattern", "screenshots");
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectNoLeak(text: string) {
  expect(text).not.toMatch(leak);
}

test("Fares introduction leads into one canonical selected-work story", async ({ page }) => {
  const observed: string[] = [];
  page.on("response", async (response) => {
    const type = response.headers()["content-type"] ?? "";
    if (!/(text\/html|text\/x-component|application\/json)/i.test(type)) return;
    try {
      observed.push(await response.text());
    } catch {
      // Navigation may dispose an in-flight body; absence is not leak evidence.
    }
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designed as one. Worn together.");
  await expect(page.getByText("Coordinated uniform programs designed and manufactured in Egypt for organizations and teams.")).toBeVisible();
  await expect(page.locator(".hero").getByRole("link", { name: "Explore our work" })).toHaveAttribute("href", "/en/work");

  const selectedWork = page.locator("article").filter({ hasText: "Harbor House" });
  await expect(selectedWork).toBeVisible();
  await expect(selectedWork.getByRole("link")).toHaveAttribute(
    "href",
    "/en/work/harbor-house/service-program",
  );

  expect(await page.locator("body").innerText()).not.toContain("KGC");
  await expectNoOverflow(page);
  for (const payload of observed) await expectNoLeak(payload);
  await capture(page, "pattern-intro-en-desktop.png");
});

test("work discovery enters the canonical project route instead of a dead editorial card", async ({ page }) => {
  await page.goto("/en/work");
  const project = page.locator("article").filter({ hasText: "Harbor House" });
  await expect(project.getByRole("link")).toHaveAttribute(
    "href",
    "/en/work/harbor-house/service-program",
  );
  await project.getByRole("link").click();
  await expect(page).toHaveURL(/\/en\/work\/harbor-house\/service-program$/);
});

test("synthetic non-school project entry is canonical, generic and payload-safe", async ({ page }) => {
  const observed: string[] = [];
  page.on("response", async (response) => {
    const type = response.headers()["content-type"] ?? "";
    if (!/(text\/html|text\/x-component|application\/json)/i.test(type)) return;
    try {
      observed.push(await response.text());
    } catch {
      // Navigation can dispose a body.
    }
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto("/en/work/harbor-house/service-program");
  expect(response?.status()).toBe(200);

  await expect(page.getByTestId("project-organization")).toHaveText("Harbor House");
  await expect(page.getByTestId("project-program")).toHaveText("Service team program");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/en\/work\/harbor-house\/service-program$/,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute(
    "href",
    /\/ar\/work\/harbor-house\/service-program$/,
  );
  await expect(page.getByTestId("project-story")).toHaveAttribute("data-motif", "synthetic-line");

  const body = await page.locator("body").innerText();
  expect(body).not.toContain("KGC");
  await expectNoLeak(body);
  for (const payload of observed) await expectNoLeak(payload);
  await expectNoOverflow(page);
  await capture(page, "pattern-project-en-desktop.png");
});

test("Arabic project entry keeps the same story in canonical RTL form", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/work/harbor-house/service-program");

  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("project-organization")).toHaveText("هاربور هاوس");
  await expect(page.getByTestId("project-program")).toHaveText("برنامج فريق الخدمة");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/ar\/work\/harbor-house\/service-program$/,
  );
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute(
    "href",
    "/en/work/harbor-house/service-program",
  );
  await expectNoOverflow(page);
  await capture(page, "pattern-project-ar-mobile.png");
});

test("unknown or unpublished project identity fails closed", async ({ request }) => {
  expect((await request.get("/en/work/unknown/program")).status()).toBe(404);
  expect((await request.get("/ar/work/harbor-house/unknown")).status()).toBe(404);
});


test("generic role lineup preserves shared-look continuity without school-stage assumptions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en/work/harbor-house/service-program");

  const rail = page.getByTestId("cohort-rail");
  await expect(rail.getByRole("button")).toHaveCount(3);
  await expect(page.getByTestId("cohort-front-desk")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("look-service")).toHaveAttribute("aria-pressed", "true");

  const body = await page.locator("body").innerText();
  expect(body).not.toContain("Kindergarten");
  expect(body).not.toContain("Primary");
  expect(body).not.toContain("Middle");
  expect(body).not.toContain("High");

  await page.getByTestId("cohort-kitchen").click();
  await expect(page.getByTestId("cohort-kitchen")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("look-service")).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/role=kitchen/);
  await expect(page).toHaveURL(/look=service/);

  await page.getByTestId("cohort-facilities").click();
  await expect(page.getByTestId("cohort-facilities")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("look-utility")).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/role=facilities/);
  await expect(page).toHaveURL(/look=utility/);
  await expect(page.getByTestId("active-garments")).toContainText("Utility overshirt");

  await expectNoOverflow(page);
  await capture(page, "pattern-continuity-en-desktop.png");
});

test("addressed Arabic role/look state survives direct entry and stays RTL", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/work/harbor-house/service-program?role=facilities&look=outerwear");

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("cohort-facilities")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("look-outerwear")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("active-garments")).toContainText("سترة ميدانية");
  await expect(page).toHaveURL(/role=facilities/);
  await expect(page).toHaveURL(/look=outerwear/);

  await expectNoOverflow(page);
  await capture(page, "pattern-continuity-ar-mobile.png");
});


test("active garment enters a canonical flat inspection route with addressed context", async ({ page }) => {
  await page.goto("/en/work/harbor-house/service-program?role=facilities&look=utility");

  const garments = page.getByTestId("active-garments");
  const overshirt = garments.getByRole("link", { name: "Utility overshirt" });
  await expect(overshirt).toHaveAttribute(
    "href",
    "/en/work/harbor-house/service-program/utility-overshirt?role=facilities&look=utility",
  );

  await overshirt.click();
  await expect(page).toHaveURL(
    /\/en\/work\/harbor-house\/service-program\/utility-overshirt\?role=facilities&look=utility$/,
  );
  await expect(page.getByTestId("inspection-rig")).toHaveAttribute("data-inspection-mode", "flat");
  await expect(page.getByTestId("inspection-rig")).toHaveAttribute("data-exploded", "false");
  await expect(page.getByTestId("explode-toggle")).toHaveCount(0);
  await expect(page.getByTestId("inspection-garment")).toHaveText("Utility overshirt");
  await expect(page.getByRole("link", { name: "Back to program" })).toHaveAttribute(
    "href",
    "/en/work/harbor-house/service-program?role=facilities&look=utility",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/en\/work\/harbor-house\/service-program\/utility-overshirt$/,
  );
  await expectNoOverflow(page);
  await capture(page, "pattern-inspection-en-desktop.png");
});

test("Arabic flat inspection preserves locale, context and truthful capability", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/ar/work/harbor-house/service-program/field-jacket?role=facilities&look=outerwear",
  );

  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("inspection-garment")).toHaveText("سترة ميدانية");
  await expect(page.getByTestId("inspection-rig")).toHaveAttribute("data-inspection-mode", "flat");
  await expect(page.getByTestId("inspection-rig")).toHaveAttribute("data-exploded", "false");
  await expect(page.getByTestId("explode-toggle")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "العودة إلى البرنامج" })).toHaveAttribute(
    "href",
    "/ar/work/harbor-house/service-program?role=facilities&look=outerwear",
  );
  await expectNoOverflow(page);
  await capture(page, "pattern-inspection-ar-mobile.png");
});

test("unknown garment identity fails closed", async ({ request }) => {
  expect((await request.get("/en/work/harbor-house/service-program/not-a-garment")).status()).toBe(404);
});
