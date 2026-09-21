import { defineConfig } from "@playwright/test";

const serverEnv: Record<string, string> = {
  FU_PUBLIC_PROVIDER: process.env.FU_PUBLIC_PROVIDER ?? "fixture",
  PUBLIC_SITE_ORIGIN: process.env.PUBLIC_SITE_ORIGIN ?? "https://faresuniform.uk",
};
for (const name of ["ODOO_BASE_URL", "ODOO_DB_NAME", "PUBLIC_CACHE_REVALIDATE_SECONDS"]) {
  const value = process.env[name];
  if (value) serverEnv[name] = value;
}

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: "npm run start -- -p 4173",
    url: "http://127.0.0.1:4173/en",
    reuseExistingServer: false,
    timeout: 120_000,
    env: serverEnv,
  },
});
