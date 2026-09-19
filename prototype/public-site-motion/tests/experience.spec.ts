import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

async function capture(page: Page, name: string) {
  const dir = path.join(process.cwd(), "artifacts", "screenshots");
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test("English desktop journey explodes and reassembles a KGC garment", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designed as one. Worn for years.");
  await expect(page.getByTestId("project-kgc-national")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("hero-editorial")).toBeVisible();
  await expect(page.getByTestId("cohort-editorial").locator("img")).toBeVisible();
  const organizationLogo = page.getByTestId("organization-logo");
  const organizationLocation = page.getByTestId("organization-location").locator("img");
  await expect(organizationLogo).toBeVisible();
  await expect(organizationLocation).toBeVisible();
  await expect.poll(() => organizationLocation.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const heroModel = page.getByTestId("hero-model").locator("img");
  await expect(heroModel).toBeVisible();
  await expect.poll(() => heroModel.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByTestId("cohort-high").click();
  await page.getByTestId("look-puffer").click();
  await expect(page.getByTestId("garment-transition")).toBeVisible();
  const assembledGarment = page.getByTestId("assembled-garment").locator("img");
  await expect(assembledGarment).toBeVisible();
  await expect.poll(() => assembledGarment.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByTestId("sharing-status")).toHaveText("Shared system");
  await expect(page.getByTestId("open-explodeview")).toHaveAttribute("href", "/explodeview?organization=kgc-national&program=national&role=high&garment=puffer&lang=en");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  const tactileExplodedGarment = page.getByTestId("tactile-exploded-garment").locator("img");
  await expect(tactileExplodedGarment).toBeVisible();
  await expect.poll(() => tactileExplodedGarment.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.waitForTimeout(700);
  await capture(page, "phase9-desktop-en-exploded.png");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "false");
  await expectNoOverflow(page);
  await capture(page, "phase9-desktop-en.png");
});

test("organization switch proves a variable non-school role model", async ({ page }) => {
  await page.goto("/?lang=en");
  await page.getByTestId("project-harbor-house").click();
  await expect(page.getByText("Guest experience program")).toBeVisible();
  await expect(page.getByTestId("organization-logo")).toHaveCount(0);
  await expect(page.getByTestId("organization-location")).toHaveCount(0);
  await expect(page.getByTestId("cohort-rail").getByRole("tab")).toHaveCount(3);
  await page.getByTestId("cohort-kitchen").click();
  await page.getByTestId("look-utility").click();
  await expect(page.getByTestId("sharing-status")).toHaveText("Shared system");
  await expectNoOverflow(page);
});

test("Arabic RTL keeps the complete interaction available", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("مصمّم");
  await page.waitForTimeout(800);
  await expectNoOverflow(page);
  await capture(page, "phase9-mobile-ar.png");
  await page.getByTestId("project-harbor-house").click();
  await page.getByTestId("cohort-facilities").click();
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
});

test("mobile controls retain practical touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
  await expect(page.getByTestId("cohort-high")).toHaveAttribute("aria-selected", "true");
  const landingPolo = page.getByTestId("assembled-garment").locator("img");
  await expect(landingPolo).toBeVisible();
  await expect.poll(() => landingPolo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const controls = page.locator(".project-switcher button, .choice-rail button, .inspect-button, .language-button");
  const count = await controls.count();
  expect(count).toBeGreaterThan(5);
  for (let index = 0; index < count; index += 1) {
    const box = await controls.nth(index).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  await page.waitForTimeout(800);
  await expectNoOverflow(page);
  await capture(page, "phase9-mobile-en.png");
});

test("keyboard focus reaches and opens the selected full study", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?lang=en");
  const fullStudy = page.getByTestId("open-explodeview");
  await fullStudy.focus();
  await expect(fullStudy).toBeFocused();
  const focusStyle = await fullStudy.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: Number.parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(focusStyle.width).toBeGreaterThanOrEqual(2);
  expect(focusStyle.style).not.toBe("none");
  await capture(page, "phase9-keyboard-focus.png");
  await Promise.all([
    page.waitForURL("**/explodeview?organization=kgc-national&program=national&role=high&garment=summer&lang=en"),
    page.keyboard.press("Enter"),
  ]);
  await expect(page.getByTestId("explode-project")).toHaveText("KGC");
  await expect(page.getByTestId("explode-cohort")).toHaveText("High");
  await expect(page.getByTestId("explode-look")).toHaveText("Summer polo");
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
});

test("approved KGC explode view is a dedicated interactive inspection", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/explodeview?organization=kgc-national&program=national&role=high&garment=summer&lang=en");
  await expect(page.getByTestId("explode-project")).toHaveText("KGC");
  await expect(page.getByTestId("explode-cohort")).toHaveText("High");
  await expect(page.getByTestId("explode-look")).toHaveText("Summer polo");
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await page.waitForTimeout(500);
  await expectNoOverflow(page);
  await capture(page, "phase9-explodeview-en.png");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "false");
});

test("reduced motion preserves state and information", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?lang=en");
  await expect(page.locator("main")).toHaveAttribute("data-reduced-motion", "true");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await expect(page.getByRole("list", { name: "Construction study" }).getByRole("listitem")).toHaveCount(5);
});

test("generic explodeview accepts organization, program, role and garment state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/explodeview?organization=harbor-house&program=guest-experience&role=facilities&garment=outerwear&lang=ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("explode-project")).toHaveText("هاربور هاوس");
  await expect(page.getByTestId("explode-cohort")).toHaveText("المرافق");
  await expect(page.getByTestId("explode-look")).toHaveText("الملابس الخارجية");
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "false");
  await expectNoOverflow(page);
  await capture(page, "phase9-explodeview-ar.png");
});
