import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "resilience-seo.spec.ts",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-report-resilience", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "node tests/mock-odoo.mjs",
      url: "http://127.0.0.1:4188/__control/stats",
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: "npm run start -- -p 4174",
      url: "http://127.0.0.1:4174/en",
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        PUBLIC_SITE_ORIGIN: "https://faresuniform.uk",
        ODOO_BASE_URL: "http://127.0.0.1:4188",
        ODOO_DB_NAME: "phase10-fixture",
        FU_PUBLIC_REVALIDATE_SECONDS: "1",
        FU_ENQUIRY_FORM_SECRET: "phase10-resilience-fixture-secret",
      },
    },
  ],
});
