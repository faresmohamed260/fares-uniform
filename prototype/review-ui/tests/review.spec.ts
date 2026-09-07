import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";

mkdirSync("artifacts", { recursive: true });

const captures = [
  { name: "pos-en-desktop", path: "/pos?lang=en", dir: "ltr", width: 1440, height: 1000 },
  { name: "pos-ar-mobile", path: "/pos?lang=ar", dir: "rtl", width: 390, height: 844 },
  { name: "order-en-desktop", path: "/order?lang=en", dir: "ltr", width: 1440, height: 1000 },
  { name: "order-ar-mobile", path: "/order?lang=ar", dir: "rtl", width: 390, height: 844 },
  { name: "production-en-desktop", path: "/production?lang=en", dir: "ltr", width: 1440, height: 1000 },
  { name: "production-ar-mobile", path: "/production?lang=ar", dir: "rtl", width: 390, height: 844 },
  { name: "public-en-desktop", path: "/public?lang=en", dir: "ltr", width: 1440, height: 1000 },
  { name: "public-ar-mobile", path: "/public?lang=ar", dir: "rtl", width: 390, height: 844 },
] as const;

for (const capture of captures) {
  test(`render ${capture.name}`, async ({ page }) => {
    await page.setViewportSize({ width: capture.width, height: capture.height });
    await page.goto(capture.path, { waitUntil: "networkidle" });

    await expect(page.locator("[data-surface]")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", capture.dir);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await page.screenshot({ path: `artifacts/${capture.name}.png`, fullPage: true });
  });
}

test("POS cart, payment and pending-sync state remain interactive", async ({ page }) => {
  await page.goto("/pos?lang=en", { waitUntil: "networkidle" });

  const poloCard = page.locator("button.product-card").filter({ hasText: "School Polo" }).first();
  await poloCard.click();
  const poloLine = page.locator(".cart-line").filter({ hasText: "School Polo" }).first();
  await expect(poloLine).toContainText("× 3");

  const instapay = page.getByRole("button", { name: "InstaPay" });
  await instapay.click();
  await expect(instapay).toHaveAttribute("aria-pressed", "true");

  const syncButton = page.locator("button.sync-button");
  await syncButton.click();
  await expect(syncButton).toContainText("Pending sync");
  await expect(page.locator(".offline-note")).toBeVisible();
});

test("public surface exposes no price, stock or cart language", async ({ page }) => {
  await page.goto("/public?lang=en", { waitUntil: "networkidle" });
  const publicText = await page.locator('[data-surface="public"]').innerText();
  expect(publicText).not.toMatch(/\bEGP\b|\bstock\b|add to cart/i);

  const product = page.locator("button.editorial-card").filter({ hasText: "School Polo" }).first();
  await product.click();
  await expect(page.getByText("Enquire about this uniform")).toBeVisible();
});

test("keyboard focus is visible on the checkout surface", async ({ page }) => {
  await page.goto("/pos?lang=en", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focusState = await page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active || active === document.body) return null;
    const style = getComputedStyle(active);
    return { tag: active.tagName, outlineWidth: style.outlineWidth, outlineStyle: style.outlineStyle };
  });
  expect(focusState).not.toBeNull();
  expect(focusState?.outlineStyle).not.toBe("none");
  expect(focusState?.outlineWidth).not.toBe("0px");
});

test("reduced motion is detected by the shared UI layer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/public?lang=en", { waitUntil: "networkidle" });
  await expect(page.locator(".review-root")).toHaveAttribute("data-reduced-motion", "true");
});
