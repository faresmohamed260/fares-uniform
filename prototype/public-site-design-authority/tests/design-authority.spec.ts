import { expect, test } from "@playwright/test";

async function waitForScrollcraft(page: import("@playwright/test").Page) {
  await expect.poll(
    () => page.evaluate(() => document.documentElement.dataset.scrollcraftMounted),
    { timeout: 10_000 }
  ).toBe("true");
  await expect(page.locator("html")).toHaveClass(/sc-ready/);
}

test("desktop home uses pinned Scrollcraft engine, device variety and real review media", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await waitForScrollcraft(page);

  await expect(page.getByTestId("scrollcraft-hero")).toBeVisible();
  await expect(page.locator('img[src*="/review-media/kgc/high-summer.png"]').first()).toBeVisible();
  await expect(page.locator('img[src*="/review-media/kgc/high-summer-polo-front.png"]').first()).toBeVisible();

  await expect(page.locator('[data-sc-act="pin"]')).toHaveCount(2);
  await expect(page.locator('[data-sc-act="pan"]')).toHaveCount(2);
  expect(await page.locator("[data-sc-parallax]").count()).toBeGreaterThanOrEqual(3);
  expect(await page.locator("[data-sc-reveal]").count()).toBeGreaterThanOrEqual(1);
  expect(await page.locator("[data-sc-kinetic]").count()).toBeGreaterThanOrEqual(2);
  const deviceFamilies = await page.evaluate(() => {
    const families = new Set<string>();
    document.querySelectorAll("[data-sc-act]").forEach((el) => families.add(el.getAttribute("data-sc-act") || ""));
    if (document.querySelector("[data-sc-parallax]")) families.add("parallax");
    if (document.querySelector("[data-sc-reveal]")) families.add("reveal");
    if (document.querySelector("[data-sc-kinetic]")) families.add("kinetic");
    if (document.querySelector("[data-sc-in]")) families.add("in");
    return Array.from(families).filter(Boolean);
  });
  expect(deviceFamilies.length).toBeGreaterThanOrEqual(5);

  const spans = await page.locator('[data-sc-act="pin"], [data-sc-act="pan"]').evaluateAll((els) =>
    els.map((el) => ({ cls: el.className, span: Number(el.getAttribute("data-sc-span") || "0") }))
  );
  const seam = spans.find((item) => String(item.cls).includes("seam-handoff"));
  expect(seam?.span).toBe(3.2);
  expect(seam?.span).toBe(Math.max(...spans.map((item) => item.span)));

  const body = (await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toContain("egp");
  expect(body).not.toContain("add to cart");
  expect(body).not.toContain("in stock");

  await page.screenshot({ path: "artifacts/scrollcraft-home-desktop-top.png", fullPage: false });
});

test("Seam Handoff renders intermediate scroll states, not only endpoints", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await waitForScrollcraft(page);

  const seam = page.getByTestId("seam-handoff");
  const metrics = await seam.evaluate((el) => ({
    top: (el as HTMLElement).offsetTop,
    height: (el as HTMLElement).offsetHeight,
    viewport: window.innerHeight,
  }));

  for (const [label, progress] of [["early", 0.16], ["mid", 0.50], ["late", 0.86]] as const) {
    const y = metrics.top + progress * Math.max(metrics.height - metrics.viewport, 1);
    await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
    await page.waitForTimeout(500);
    const p = Number(await seam.evaluate((el) => getComputedStyle(el).getPropertyValue("--sc-p")));
    expect(p).toBeGreaterThan(progress - 0.08);
    expect(p).toBeLessThan(progress + 0.08);
    await page.screenshot({ path: `artifacts/seam-handoff-${label}.png`, fullPage: false });
  }

  await expect(page.getByText(/Now inspect what you saw/)).toBeVisible();
});

test("Work and project routes use truthful collection/chapter grammars", async ({ page }) => {
  await page.goto("/en/work");
  await waitForScrollcraft(page);
  await expect(page.locator(".work-object-models figure")).toHaveCount(4);
  await expect(page.getByRole("heading", { level: 1, name: /KGC/i })).toBeVisible();
  await expect(page.getByText(/fictional clients/i)).toBeVisible();
  await page.screenshot({ path: "artifacts/scrollcraft-work-desktop.png", fullPage: true });

  await page.goto("/en/work/kgc/national");
  await waitForScrollcraft(page);
  await expect(page.locator(".chapter-stage-grid figure")).toHaveCount(4);
  await expect(page.getByTestId("garment-inspector")).toBeVisible();
  await expect(page.getByText(/Your program should not look like KGC/)).toBeVisible();
  await page.screenshot({ path: "artifacts/scrollcraft-project-desktop.png", fullPage: true });
});

test("garment collection and atelier keep real front/back evidence and no fabricated explode", async ({ page }) => {
  await page.goto("/en/garments");
  await waitForScrollcraft(page);
  await expect(page.locator('img[src*="high-summer-polo-front.png"]')).toBeVisible();
  await expect(page.locator('img[src*="high-summer-polo-back.png"]')).toBeVisible();

  await page.goto("/en/garments/high-summer-polo");
  await waitForScrollcraft(page);
  const inspector = page.getByTestId("garment-inspector");
  await expect(inspector).toBeVisible();
  await expect(page.getByText(/Original photography/)).toBeVisible();
  const back = page.getByRole("button", { name: "back" });
  await back.click();
  await expect(back).toHaveAttribute("aria-pressed", "true");
  await expect(inspector.locator('img[src*="high-summer-polo-back.png"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /explode|reassemble/i })).toHaveCount(0);
  await page.screenshot({ path: "artifacts/scrollcraft-garment-desktop.png", fullPage: true });
});

test("English mobile is separately composed and menu is keyboard closable", async ({ page }) => {
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
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: "artifacts/scrollcraft-home-mobile-en.png", fullPage: true });
});

test("Arabic mobile is authored RTL and keeps the portrait design path", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");
  await waitForScrollcraft(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("مصمّم");
  await expect(page.locator(".program-rail-item")).toHaveCount(4);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: "artifacts/scrollcraft-home-mobile-ar.png", fullPage: true });
});

test("reduced motion preserves the program, garment, process and action", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await waitForScrollcraft(page);
  await expect(page.getByText("Four stages. One language that grows with them.")).toBeVisible();
  await expect(page.getByText("The garment, as it actually is.")).toBeVisible();
  await expect(page.getByText(/The image matters/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Discuss a uniform program/i }).first()).toBeVisible();
  await page.screenshot({ path: "artifacts/scrollcraft-home-reduced-motion.png", fullPage: true });
});

test("enquiry remains a quiet review-only state with preserved context", async ({ page }) => {
  await page.goto("/en/enquiry?context=kgc-national-high-summer-polo");
  await expect(page.getByText("KGC National · High · Summer · Polo")).toBeVisible();
  await page.getByRole("button", { name: /Preview submission state/i }).click();
  await expect(page.getByRole("status")).toContainText("Success state");
});

test("system surface records D-060 and pinned-engine invariants", async ({ page }) => {
  await page.goto("/en/system");
  await expect(page.getByText("D-060 / SCROLLCRAFT")).toBeVisible();
  await expect(page.getByText(/pinned Scrollcraft engine/i)).toBeVisible();
  await expect(page.getByText("No generated fake client/product imagery.")).toBeVisible();
  await expect(page.getByText("No prices or stock.")).toBeVisible();
});

test("unknown top-level paths fail as clean 404s", async ({ page }) => {
  const response = await page.goto("/favicon.ico");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/Internal Server Error/i)).toHaveCount(0);
});
