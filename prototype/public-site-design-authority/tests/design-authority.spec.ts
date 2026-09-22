import { expect, test } from "@playwright/test";

async function waitForScrollcraft(page: import("@playwright/test").Page) {
  await expect.poll(
    () => page.evaluate(() => document.documentElement.dataset.scrollcraftMounted),
    { timeout: 10_000 }
  ).toBe("true");
  await expect(page.locator("html")).toHaveClass(/sc-ready/);
}

test("desktop homepage is Fares-first, broad, graphic and free of storefront leakage", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await waitForScrollcraft(page);

  const hero = page.getByTestId("homepage-master-hero");
  await expect(hero).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Uniforms");
  await expect(hero.locator('img[src="/design-media/master-brand-field.svg"]')).toBeVisible();
  await expect(page.locator(".home-sector-universe")).toBeVisible();
  await expect(page.locator(".sector-index button")).toHaveCount(6);

  expect(await hero.locator('img[src*="kgc"]').count()).toBe(0);
  expect(await hero.innerText()).not.toContain("KGC");

  const body = (await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toContain("egp");
  expect(body).not.toContain("add to cart");
  expect(body).not.toContain("in stock");

  await page.screenshot({ path: "artifacts/d061-home-desktop-top.png", fullPage: false });
});

test("sector universe morphs between six business environments", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const buttons = page.locator(".sector-index button");
  await expect(buttons).toHaveCount(6);

  await buttons.nth(2).hover();
  await expect(buttons.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".home-sector-universe")).toHaveClass(/tone-tomato/);
  await expect(page.locator(".sector-active-copy")).toContainText("Restaurants & Cafés");

  await buttons.nth(4).focus();
  await expect(buttons.nth(4)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".home-sector-universe")).toHaveClass(/tone-ink/);
  await expect(page.locator(".sector-active-copy")).toContainText("Corporate");

  await page.screenshot({ path: "artifacts/d061-sector-universe.png", fullPage: false });
});

test("system chapter explains identity to manufacturing with real Scrollcraft timing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await waitForScrollcraft(page);

  const system = page.locator(".home-system-chapter");
  await expect(system).toHaveAttribute("data-sc-act", "pin");
  await expect(system).toHaveAttribute("data-sc-span", "2.05");
  await expect(system.locator('img[src="/design-media/pattern-paper.svg"]')).toBeVisible();
  await expect(system.locator(".system-word")).toHaveCount(5);

  const metrics = await system.evaluate((el) => ({
    top: (el as HTMLElement).offsetTop,
    height: (el as HTMLElement).offsetHeight,
    viewport: window.innerHeight,
  }));
  const y = metrics.top + 0.56 * Math.max(metrics.height - metrics.viewport, 1);
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await page.waitForTimeout(400);
  const progress = Number(await system.evaluate((el) => getComputedStyle(el).getPropertyValue("--sc-p")));
  expect(progress).toBeGreaterThan(0.48);
  expect(progress).toBeLessThan(0.64);
  await page.screenshot({ path: "artifacts/d061-system-mid.png", fullPage: false });
});

test("KGC appears only as contained Selected Work and routes deeper", async ({ page }) => {
  await page.goto("/en");
  const selected = page.locator(".home-selected-work");
  await expect(selected).toContainText("SELECTED WORK");
  await expect(selected).toContainText("KGC NATIONAL");
  await expect(selected.locator('img[src*="kgc-building.webp"]')).toBeVisible();
  await expect(selected.locator('img[src*="/review-media/kgc/high-summer.png"]')).toBeVisible();
  await expect(selected.getByRole("link", { name: /Explore the project/i })).toHaveAttribute("href", "/en/work/kgc/national");

  const beforeSelected = await page.evaluate(() => {
    const selected = document.querySelector(".home-selected-work");
    const root = document.querySelector(".fares-homepage");
    if (!selected || !root) return "";
    let text = "";
    for (const child of Array.from(root.children)) {
      if (child === selected) break;
      text += (child.textContent || "") + "\n";
    }
    return text;
  });
  expect(beforeSelected).not.toContain("KGC");
});

test("garment universe remains catalog-like without becoming ecommerce", async ({ page }) => {
  await page.goto("/en");
  const universe = page.locator(".home-garment-universe");
  await expect(universe).toContainText("GARMENT UNIVERSE");
  await expect(universe.locator(".garment-category-word")).toHaveCount(8);
  await expect(universe.locator('img[src*="high-summer-polo-front.png"]')).toBeVisible();
  await expect(universe.getByRole("link", { name: /Explore garments/i })).toHaveAttribute("href", "/en/garments");
});

test("manufacturing and craft chapters provide substance after the visual acts", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".home-process-ledger article")).toHaveCount(6);
  await expect(page.locator(".home-process")).toContainText("DESIGN TO MANUFACTURING");
  await expect(page.locator(".home-craft")).toContainText("MATERIAL / DETAIL");
  await expect(page.locator(".home-craft-index > div")).toHaveCount(4);
});

test("English mobile is separately composed, interactive and has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await waitForScrollcraft(page);

  const trigger = page.getByRole("button", { name: "Open menu" });
  const box = await trigger.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site menu" })).toHaveCount(0);

  await expect(page.locator(".sector-index button")).toHaveCount(6);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.screenshot({ path: "artifacts/d061-home-mobile-en.png", fullPage: true });
});

test("Arabic mobile is RTL, broad-brand and free of horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");
  await waitForScrollcraft(page);

  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("زي موحّد");
  await expect(page.locator(".sector-index button")).toHaveCount(6);
  await expect(page.locator(".home-selected-work")).toContainText("KGC");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.screenshot({ path: "artifacts/d061-home-mobile-ar.png", fullPage: true });
});

test("reduced motion preserves the complete homepage hierarchy and actions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await waitForScrollcraft(page);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Uniforms");
  await expect(page.getByText("One uniform language should never fit everyone.")).toBeVisible();
  await expect(page.getByText("A uniform is not one item. It is a system.")).toBeVisible();
  await expect(page.locator(".home-selected-work")).toContainText("KGC NATIONAL");
  await expect(page.getByText(/Identity starts as an idea/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Discuss a uniform program/i }).first()).toBeVisible();

  await page.screenshot({ path: "artifacts/d061-home-reduced-motion.png", fullPage: true });
});

test("deep routes remain reachable while D-061 approval is homepage-only", async ({ page }) => {
  await page.goto("/en/work");
  await expect(page.getByRole("heading", { level: 1, name: /KGC/i })).toBeVisible();
  await page.goto("/en/garments");
  await expect(page.locator('img[src*="high-summer-polo-front.png"]')).toBeVisible();
  await page.goto("/en/enquiry");
  await expect(page.getByRole("button", { name: /Preview submission state/i })).toBeVisible();
});
