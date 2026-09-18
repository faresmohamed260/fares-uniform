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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designed as one. Worn together.");
  await expect(page.getByTestId("project-kgc-national")).toHaveAttribute("aria-selected", "true");
  await page.getByTestId("cohort-high").click();
  await page.getByTestId("look-puffer").click();
  await expect(page.getByTestId("sharing-status")).toHaveText("Shared system");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "false");
  await expectNoOverflow(page);
  await capture(page, "phase9-desktop-en.png");
});

test("organization switch proves a variable non-school role model", async ({ page }) => {
  await page.goto("/?lang=en");
  await page.getByTestId("project-harbor-house").click();
  await expect(page.getByText("Guest experience program")).toBeVisible();
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
  await page.getByTestId("project-harbor-house").click();
  await page.getByTestId("cohort-facilities").click();
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await expectNoOverflow(page);
  await capture(page, "phase9-mobile-ar.png");
});

test("mobile controls retain practical touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
  const controls = page.locator(".project-switcher button, .choice-rail button, .inspect-button, .language-button");
  const count = await controls.count();
  expect(count).toBeGreaterThan(5);
  for (let index = 0; index < count; index += 1) {
    const box = await controls.nth(index).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  await expectNoOverflow(page);
  await capture(page, "phase9-mobile-en.png");
});

test("reduced motion preserves state and information", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?lang=en");
  await expect(page.locator("main")).toHaveAttribute("data-reduced-motion", "true");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await expect(page.getByRole("list", { name: "Construction study" }).getByRole("listitem")).toHaveCount(5);
});
