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

test("approved English desktop landing keeps the High Summer story", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designed as one. Worn for years.");
  await expect(page.getByTestId("cohort-high")).toHaveAttribute("aria-selected", "true");

  const heroModel = page.getByTestId("hero-model").locator("img");
  const location = page.getByTestId("organization-location").locator("img");
  await expect(heroModel).toBeVisible();
  await expect(location).toBeVisible();
  await expect.poll(() => heroModel.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect.poll(() => location.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

  await expect(page.getByTestId("open-explodeview")).toHaveAttribute(
    "href",
    "/explodeview?organization=kgc-national&program=national&role=high&garment=summer&lang=en",
  );
  await expectNoOverflow(page);
  await page.waitForTimeout(600);
  await capture(page, "phase9-desktop-en.png");
});

test("query-driven hospitality fixture proves the non-school model", async ({ page }) => {
  await page.goto("/?organization=harbor-house&program=guest-experience&role=kitchen&garment=utility&lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designed as one. Built to belong.");
  await expect(page.getByTestId("organization-location")).toHaveCount(0);
  await expect(page.getByTestId("cohort-rail").getByRole("tab")).toHaveCount(3);
  await expect(page.getByTestId("cohort-kitchen")).toHaveAttribute("aria-selected", "true");
  await page.locator(".look-menu summary").click();
  await page.getByTestId("look-service").click();
  await expect(page.getByTestId("open-explodeview")).toHaveAttribute(
    "href",
    "/explodeview?organization=harbor-house&program=guest-experience&role=kitchen&garment=service&lang=en",
  );
  await expectNoOverflow(page);
});

test("Arabic RTL matches the approved mirrored landing direction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("هوية واحدة. ترافقهم لسنوات.");
  await expect(page.getByTestId("cohort-high")).toHaveAttribute("aria-selected", "true");
  await expectNoOverflow(page);
  await page.waitForTimeout(600);
  await capture(page, "phase9-mobile-ar.png");
});

test("mobile approved landing keeps practical touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
  const controls = page.locator(".stage-card, .primary-action, .secondary-action, .language-button, .menu-button, .detail-action");
  const count = await controls.count();
  expect(count).toBeGreaterThan(7);
  for (let index = 0; index < count; index += 1) {
    const box = await controls.nth(index).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  await expectNoOverflow(page);
  await page.waitForTimeout(600);
  await capture(page, "phase9-mobile-en.png");
});

test("keyboard focus opens the selected full study", async ({ page }) => {
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

test("approved KGC inspector explodes and reassembles the Summer polo", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/explodeview?organization=kgc-national&program=national&role=high&garment=summer&lang=en");
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  const garment = page.getByTestId("garment-rig").locator("img").first();
  await expect(garment).toBeVisible();
  await expect.poll(() => garment.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expectNoOverflow(page);
  await page.waitForTimeout(500);
  await capture(page, "phase9-explodeview-en.png");

  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "false");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
});

test("reduced motion preserves inspector state and information", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/explodeview?organization=kgc-national&program=national&role=high&garment=summer&lang=en");
  await expect(page.locator("main")).toHaveAttribute("data-reduced-motion", "true");
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await page.getByTestId("explode-toggle").click();
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "false");
  await expect(page.getByRole("complementary").getByRole("button")).toHaveCount(6);
});

test("generic Arabic inspector accepts organization role and garment state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/explodeview?organization=harbor-house&program=guest-experience&role=facilities&garment=outerwear&lang=ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("explode-project")).toHaveText("هاربور هاوس");
  await expect(page.getByTestId("explode-cohort")).toHaveText("المرافق");
  await expect(page.getByTestId("explode-look")).toHaveText("الملابس الخارجية");
  await expect(page.getByTestId("garment-rig")).toHaveAttribute("data-exploded", "true");
  await expectNoOverflow(page);
  await capture(page, "phase9-explodeview-ar.png");
});
