import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "html-report", open: "never" }]]
    : [["list"], ["html", { outputFolder: "html-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    channel: "chromium",
    headless: true,
    screenshot: process.env.CI ? "off" : "only-on-failure",
    trace: process.env.CI ? "off" : "on-first-retry",
    video: process.env.CI ? "off" : "retain-on-failure",
    actionTimeout: 30000,
    navigationTimeout: 10000,
    locale: "ja-JP",
    timezoneId: "Asia/Tokyo",
    extraHTTPHeaders: {
      "x-playwright-test": "true",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
