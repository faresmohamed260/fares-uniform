import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const API = "/api/enquiries";
const ORIGIN = "http://127.0.0.1:4173";

function payload(overrides: Record<string, unknown> = {}) {
  return {
    idempotency_key: "phase10-hardening-001",
    contact_name: "Synthetic Buyer",
    organization_name: "Synthetic Organization",
    phone: "01000000000",
    email: "",
    sector: "Hospitality",
    message: "Synthetic enquiry hardening proof.",
    source_product_slug: "",
    language: "en",
    ...overrides,
  };
}

async function formToken(page: Page) {
  await page.goto("/en");
  const form = page.locator("form.enquiry-form");
  await expect(form).toHaveAttribute("data-form-token", /.+/);
  return (await form.getAttribute("data-form-token"))!;
}

function guardedHeaders(token: string, ip = "198.51.100.20") {
  return {
    "Content-Type": "application/json",
    "Origin": ORIGIN,
    "X-Fares-Enquiry-Token": token,
    "X-Forwarded-For": ip,
  };
}

async function post(
  request: APIRequestContext,
  token: string,
  body: Record<string, unknown>,
  ip = "198.51.100.20",
  extraHeaders: Record<string, string> = {},
) {
  return request.post(API, {
    headers: { ...guardedHeaders(token, ip), ...extraHeaders },
    data: body,
  });
}

test("enquiry boundary fails closed without same-origin form proof", async ({ request }) => {
  const response = await request.post(API, {
    headers: { "Content-Type": "application/json", "Origin": ORIGIN },
    data: payload(),
  });
  expect(response.status()).toBe(403);
  expect(await response.json()).toEqual({ error: "request_forbidden" });
  expect(response.headers()["cache-control"]).toContain("no-store");
});

test("browser form sends the unchanged nine-field intake with a form proof header", async ({ page }) => {
  await page.goto("/en?organization=harbor-house&program=service-program&role=facilities&look=outerwear#enquiry");
  const form = page.locator("form.enquiry-form");
  await expect(form).toHaveAttribute("data-form-token", /.+/);

  await page.getByLabel("Your name").fill("Synthetic Browser Buyer");
  await page.getByLabel("Phone").fill("01000000000");

  const requestPromise = page.waitForRequest(
    (candidate) => candidate.url().endsWith(API) && candidate.method() === "POST",
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const outgoing = await requestPromise;

  expect(outgoing.headers()["x-fares-enquiry-token"]).toBeTruthy();
  const body = outgoing.postDataJSON() as Record<string, unknown>;
  expect(Object.keys(body).sort()).toEqual([
    "contact_name",
    "email",
    "idempotency_key",
    "language",
    "message",
    "organization_name",
    "phone",
    "sector",
    "source_product_slug",
  ]);
});

test("request parsing is content-type and body-size bounded before business processing", async ({ page, request }) => {
  const token = await formToken(page);

  const wrongType = await request.post(API, {
    headers: {
      ...guardedHeaders(token, "198.51.100.21"),
      "Content-Type": "text/plain",
    },
    data: JSON.stringify(payload({ idempotency_key: "phase10-hardening-type" })),
  });
  expect(wrongType.status()).toBe(415);
  expect(await wrongType.json()).toEqual({ error: "unsupported_media_type" });

  const oversized = await post(
    request,
    token,
    payload({
      idempotency_key: "phase10-hardening-large",
      message: "x".repeat(20_000),
    }),
    "198.51.100.22",
  );
  expect(oversized.status()).toBe(413);
  expect(await oversized.json()).toEqual({ error: "request_too_large" });
});

test("per-runtime rate safety net fails closed with a stable 429", async ({ page, request }) => {
  const token = await formToken(page);
  const ip = "198.51.100.73";

  for (let index = 0; index < 5; index += 1) {
    const response = await post(
      request,
      token,
      payload({ idempotency_key: `phase10-rate-${index}` }),
      ip,
    );
    expect(response.status()).toBe(201);
  }

  const limited = await post(
    request,
    token,
    payload({ idempotency_key: "phase10-rate-blocked" }),
    ip,
  );
  expect(limited.status()).toBe(429);
  expect(await limited.json()).toEqual({ error: "rate_limited" });
  expect(Number(limited.headers()["retry-after"])).toBeGreaterThan(0);
});

test("upstream timeout and outage map to stable public errors", async ({ page, request }) => {
  const token = await formToken(page);

  const timeout = await post(
    request,
    token,
    payload({ idempotency_key: "phase10-timeout" }),
    "198.51.100.30",
    { "X-Fares-CI-Upstream": "timeout" },
  );
  expect(timeout.status()).toBe(504);
  expect(await timeout.json()).toEqual({ error: "service_timeout" });

  const unavailable = await post(
    request,
    token,
    payload({ idempotency_key: "phase10-unavailable" }),
    "198.51.100.31",
    { "X-Fares-CI-Upstream": "unavailable" },
  );
  expect(unavailable.status()).toBe(503);
  expect(await unavailable.json()).toEqual({ error: "service_unavailable" });
});

test("validation stays stable and route logging is privacy-safe", async ({ page, request }) => {
  const token = await formToken(page);
  const invalid = await post(
    request,
    token,
    payload({ idempotency_key: "phase10-invalid", unexpected: "private-value" }),
    "198.51.100.32",
  );
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toEqual({ error: "invalid_request" });

  const source = await readFile(
    path.join(process.cwd(), "app", "api", "enquiries", "route.ts"),
    "utf8",
  );
  const consoleLines = source
    .split("\n")
    .filter((line) => /console\.(log|warn|error|info)/.test(line));

  expect(consoleLines.length).toBeGreaterThan(0);
  for (const line of consoleLines) {
    expect(line).not.toMatch(
      /contact_name|organization_name|phone|email|message|source_product_slug|JSON\.stringify\s*\(\s*validation|request\.json|body|payload/i,
    );
  }
  expect(source).toContain("AbortSignal.timeout");
});
