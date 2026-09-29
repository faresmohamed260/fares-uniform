import { expect, test, type Locator, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

async function capture(page: Page, name: string) {
  const dir = path.join(process.cwd(), "evidence", "phase10-accessibility", "screenshots");
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

async function expectTouchTarget(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

test("mobile controls keep keyboard focus and practical touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/work/harbor-house/service-program?role=facilities&look=outerwear");

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expectTouchTarget(skip);

  const kitchen = page.getByTestId("cohort-kitchen");
  await kitchen.focus();
  await page.keyboard.press("Enter");
  await expect(kitchen).toHaveAttribute("aria-pressed", "true");

  const facilities = page.getByTestId("cohort-facilities");
  await facilities.focus();
  await page.keyboard.press("Enter");
  await expect(facilities).toHaveAttribute("aria-pressed", "true");

  const outerwear = page.getByTestId("look-outerwear");
  await outerwear.focus();
  await page.keyboard.press("Enter");
  await expect(outerwear).toHaveAttribute("aria-pressed", "true");

  const focusStyle = await outerwear.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: Number.parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(focusStyle.width).toBeGreaterThanOrEqual(2);
  expect(focusStyle.style).not.toBe("none");

  await expectTouchTarget(page.getByRole("link", { name: "Start a project" }));
  await expectTouchTarget(page.getByRole("link", { name: "العربية" }));
  for (const control of await page.getByTestId("cohort-rail").getByRole("button").all()) {
    await expectTouchTarget(control);
  }
  for (const control of await page.locator('[data-testid^="look-"]').all()) {
    if (await control.isVisible()) await expectTouchTarget(control);
  }
  for (const link of await page.getByTestId("active-garments").getByRole("link").all()) {
    await expectTouchTarget(link);
  }
  await expectTouchTarget(page.getByRole("link", { name: "Discuss this look" }));

  await expectNoOverflow(page);
  await capture(page, "accessibility-touch-en-mobile.png");
});

test("reduced motion keeps the same public information and interaction state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");

  await expect(page.getByTestId("pattern-material-study")).toHaveAttribute("data-reduced-motion", "true");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designed as one. Worn together.");

  await page.goto("/en/work/harbor-house/service-program");
  const continuity = page.getByTestId("project-continuity");
  await expect(continuity).toHaveAttribute("data-reduced-motion", "true");

  await page.getByTestId("cohort-facilities").click();
  await page.getByTestId("look-outerwear").click();
  await expect(page.getByTestId("active-garments")).toContainText("Field jacket");
  await expect(page.getByRole("link", { name: "Discuss this look" })).toBeVisible();

  await expectNoOverflow(page);
  await capture(page, "accessibility-reduced-motion-en.png");
});

test("Arabic keyboard path reaches the same role, look and enquiry state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/work/harbor-house/service-program");

  const facilities = page.getByTestId("cohort-facilities");
  await facilities.focus();
  await page.keyboard.press("Enter");
  await expect(facilities).toHaveAttribute("aria-pressed", "true");

  const outerwear = page.getByTestId("look-outerwear");
  await outerwear.focus();
  await page.keyboard.press("Enter");
  await expect(outerwear).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("link", { name: "ناقش هذه الإطلالة" })).toBeVisible();

  await expectNoOverflow(page);
  await capture(page, "accessibility-keyboard-ar-mobile.png");
});

test("degraded garment presentation has an accessible fallback and semantic scan stays clean", async ({ page }) => {
  await page.goto("/en/work/harbor-house/service-program/field-jacket?role=facilities&look=outerwear");

  await expect(page.getByRole("img", { name: "Garment presentation" })).toBeVisible();
  await expect(page.getByTestId("inspection-rig")).toHaveAttribute("data-inspection-mode", "flat");

  const report = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll<HTMLElement>("[id]")).map((node) => node.id);
    const duplicates = ids.filter((id, index) => id && ids.indexOf(id) !== index);
    const missingAlt = Array.from(document.querySelectorAll("img:not([alt])")).map((node) => node.outerHTML);
    const positiveTabindex = Array.from(document.querySelectorAll<HTMLElement>("[tabindex]"))
      .filter((node) => Number(node.getAttribute("tabindex")) > 0)
      .map((node) => node.outerHTML);
    const unnamed = Array.from(document.querySelectorAll<HTMLElement>("a,button,input,textarea,select"))
      .filter((node) => {
        if (node.getAttribute("aria-label")?.trim()) return false;
        if (node.getAttribute("aria-labelledby")?.trim()) return false;
        if (node.matches("input,textarea,select")) {
          if (node.closest("label")?.textContent?.trim()) return false;
          const id = node.id;
          if (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent?.trim()) return false;
          return true;
        }
        return !(node.textContent ?? "").trim();
      })
      .map((node) => node.outerHTML);
    return { duplicates: [...new Set(duplicates)], missingAlt, positiveTabindex, unnamed };
  });

  expect(report).toEqual({
    duplicates: [],
    missingAlt: [],
    positiveTabindex: [],
    unnamed: [],
  });
});
