import { expect, test } from "@playwright/test";

test("home is populated with real review media and no storefront leakage", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Designed as one.");
  await expect(page.getByTestId("real-media-hero")).toBeVisible();
  await expect(page.locator('img[src*="/review-media/kgc/high-summer.png"]').first()).toBeVisible();
  await expect(page.locator(".hero-stage-switcher button")).toHaveCount(4);
  await expect(page.getByText("KGC National").first()).toBeVisible();

  const body = (await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toContain("egp");
  expect(body).not.toContain("add to cart");
  expect(body).not.toContain("in stock");

  await page.screenshot({ path: "artifacts/design-home-desktop-en.png", fullPage: true });
});

test("project stage selection preserves continuity into the real garment", async ({ page }) => {
  await page.goto("/en/work/kgc/national");
  await expect(page.getByRole("heading", { name: /KGC/i })).toBeVisible();

  const primary = page.getByRole("tab", { name: /Primary/i });
  await primary.click();
  await expect(primary).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Growing in one visual language.")).toBeVisible();

  const high = page.getByRole("tab", { name: /High/i });
  await high.click();
  await expect(high).toHaveAttribute("aria-selected", "true");
  await page.getByRole("link", { name: /Move from worn look to garment/i }).click();
  await expect(page).toHaveURL(/\/en\/garments\/high-summer-polo$/);

  await page.screenshot({ path: "artifacts/design-project-desktop-en.png", fullPage: true });
});

test("garment inspector is truthful front/back photography, not fabricated explode", async ({ page }) => {
  await page.goto("/en/garments/high-summer-polo");
  await expect(page.getByTestId("garment-inspector")).toBeVisible();
  await expect(page.getByText("No fabricated construction layers")).toBeVisible();
  const front = page.getByRole("button", { name: "front" }).first();
  const back = page.getByRole("button", { name: "back" }).first();
  await expect(front).toHaveAttribute("aria-pressed", "true");
  await back.click();
  await expect(back).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('img[src*="high-summer-polo-back.png"]').first()).toBeVisible();
  await expect(page.getByText(/If we don’t have a real layer/)).toBeVisible();
  const body = (await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toContain("explode");

  await page.screenshot({ path: "artifacts/design-garment-desktop-en.png", fullPage: true });
});

test("Arabic mobile is authored RTL without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("مصمّم");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('img[src*="/review-media/kgc/high-summer.png"]').first()).toBeVisible();

  await page.screenshot({ path: "artifacts/design-home-mobile-ar.png", fullPage: true });
});

test("English mobile composes independently and keeps touch targets usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const stageButtons = page.locator(".hero-stage-switcher button");
  await expect(stageButtons).toHaveCount(4);
  for (const button of await stageButtons.all()) {
    const box = await button.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: "artifacts/design-home-mobile-en.png", fullPage: true });
});

test("reduced motion preserves the complete reading path", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.getByText("One program. Four stages. A consistent identity.")).toBeVisible();
  await expect(page.getByText("From brief to handover")).toBeVisible();
  await expect(page.getByRole("link", { name: /Discuss a uniform program/i })).toBeVisible();
  await page.screenshot({ path: "artifacts/design-home-reduced-motion.png", fullPage: true });
});

test("enquiry review state preserves context and never submits", async ({ page }) => {
  await page.goto("/en/enquiry?context=kgc-national-high-summer-polo");
  await expect(page.getByText("KGC National · High · Summer · Polo")).toBeVisible();
  await page.getByRole("button", { name: /Preview submission state/i }).click();
  await expect(page.getByRole("status")).toContainText("Success state");
});

test("design system surface documents the non-fabrication invariants", async ({ page }) => {
  await page.goto("/en/system");
  await expect(page.getByRole("heading", { name: /Design system/ })).toBeVisible();
  await expect(page.getByText("No generated fake client/product imagery.")).toBeVisible();
  await expect(page.getByText("No prices or stock.")).toBeVisible();
});
