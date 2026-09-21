import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

async function capture(page: Page, name: string) {
  const dir = path.join(process.cwd(), "evidence", "phase10-full-candidate", "screenshots");
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

async function noOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

test("candidate EN desktop renders the Fares-led production home", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designed as one. Worn together.");
  expect(await page.locator("body").innerText()).not.toContain("KGC");
  await noOverflow(page);
  await capture(page, "candidate-en-desktop.png");
});

test("candidate AR mobile renders canonical RTL without visual overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("مصمّم كمنظومة واحدة");
  await noOverflow(page);
  await capture(page, "candidate-ar-mobile.png");
});

test("candidate flat inspector remains source-truthful and contextual", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en/work/harbor-house/service-program/field-jacket?role=facilities&look=outerwear");
  await expect(page.getByTestId("inspection-garment")).toHaveText("Field jacket");
  await expect(page.getByTestId("inspection-rig")).toHaveAttribute("data-inspection-mode", "flat");
  await expect(page.getByRole("link", { name: "Discuss this garment" })).toBeVisible();
  await noOverflow(page);
  await capture(page, "candidate-flat-inspector.png");
});

test("candidate reduced-motion path retains project information and actions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/work/harbor-house/service-program?role=facilities&look=outerwear");
  await expect(page.getByTestId("project-continuity")).toHaveAttribute("data-reduced-motion", "true");
  await expect(page.getByTestId("active-garments")).toContainText("Field jacket");
  await expect(page.getByRole("link", { name: "Discuss this look" })).toBeVisible();
  await noOverflow(page);
  await capture(page, "candidate-reduced-motion-mobile.png");
});
