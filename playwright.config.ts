import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4173);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const IS_CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  retries: IS_CI ? 2 : 0,
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER ?? "npm run dev -- --host --port 4173",
    url: BASE_URL,
    reuseExistingServer: !IS_CI,
    timeout: 120_000,
    stderr: "pipe",
  },
  use: {
    baseURL: BASE_URL,
    headless: !process.env.PLAYWRIGHT_HEADED,
    trace: IS_CI ? "retain-on-failure" : "on-first-retry",
    video: IS_CI ? "retain-on-failure" : "off",
    screenshot: "only-on-failure",
    locale: "pt-BR",
  },
  projects: [
    {
      name: "chromium",
      use: devices["Desktop Chrome"],
    },
    {
      name: "firefox",
      use: devices["Desktop Firefox"],
    },
    {
      name: "webkit",
      use: devices["Desktop Safari"],
    },
  ],
});
