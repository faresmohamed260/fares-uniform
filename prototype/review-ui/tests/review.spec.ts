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
    await expect(page.locator(".review-root")).toHaveAttribute("data-component-foundation", "shadcn-base-ui");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: `artifacts/${capture.name}.png`, fullPage: true });
  });
}

test("POS uses maintained primitives and keeps checkout state interactive", async ({ page }) => {
  await page.goto("/pos?lang=en", { waitUntil: "networkidle" });
  await expect(page.locator('[data-slot="input"]')).toHaveCount(1);
  expect(await page.locator('[data-slot="button"]').count()).toBeGreaterThan(5);
  expect(await page.locator('[data-slot="card"]').count()).toBeGreaterThan(3);

  await page.getByTestId("pos-product-polo").click();
  await expect(page.getByTestId("cart-line-polo")).toContainText("× 3");

  const instapay = page.getByTestId("payment-instapay");
  await instapay.click();
  await expect(instapay).toHaveAttribute("aria-pressed", "true");
  await expect(instapay.locator('[data-motion="payment-shared-highlight"]')).toBeVisible();

  await page.getByTestId("pos-sync-toggle").click();
  await expect(page.getByTestId("pos-sync-toggle")).toContainText("Pending sync");
  await expect(page.getByTestId("offline-note")).toBeVisible();
});

test("mobile POS uses the maintained Tabs primitive", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pos?lang=en", { waitUntil: "networkidle" });
  await expect(page.locator('[data-slot="tabs"]')).toBeVisible();
  await page.getByRole("tab", { name: "Cart & payment" }).click();
  await expect(page.getByTestId("pos-cart")).toBeVisible();
});

test("public catalog has no price or stock language and opens maintained Dialog", async ({ page }) => {
  await page.goto("/public?lang=en", { waitUntil: "networkidle" });
  const publicText = await page.locator('[data-surface="public"]').innerText();
  expect(publicText).not.toMatch(/\bEGP\b|\bstock\b|add to cart/i);
  await page.getByTestId("public-product-polo").click();
  await expect(page.getByTestId("public-product-dialog")).toBeVisible();
  await expect(page.getByText("Enquire about this uniform")).toBeVisible();
  await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible();
  await expect(page.locator('[data-motion="shared-product-morph"]')).toBeVisible();
});

test("catalog dialog is keyboard dismissible", async ({ page }) => {
  await page.goto("/public?lang=en", { waitUntil: "networkidle" });
  await page.getByTestId("public-product-polo").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("public-product-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("public-product-dialog")).toBeHidden();
});

test("keyboard focus remains visibly styled", async ({ page }) => {
  await page.goto("/pos?lang=en", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focusState = await page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active || active === document.body) return null;
    const style = getComputedStyle(active);
    return { tag: active.tagName, outlineWidth: style.outlineWidth, outlineStyle: style.outlineStyle, boxShadow: style.boxShadow };
  });
  expect(focusState).not.toBeNull();
  expect(focusState?.outlineStyle === "none" && focusState?.boxShadow === "none").toBe(false);
});

test("normal motion produces visible physics transform", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/public?lang=en", { waitUntil: "networkidle" });
  const orb = page.locator('[data-motion="morph-orb"]');
  await expect(orb).toBeVisible();
  await page.waitForTimeout(350);
  const transform = await orb.evaluate((element) => getComputedStyle(element).transform);
  expect(transform).not.toBe("none");
});

test("reduced motion suppresses spatial physics", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/public?lang=en", { waitUntil: "networkidle" });
  await expect(page.locator(".review-root")).toHaveAttribute("data-reduced-motion", "true");
  const transform = await page.locator('[data-motion="morph-orb"]').evaluate((element) => getComputedStyle(element).transform);
  expect(transform).toBe("none");
});
