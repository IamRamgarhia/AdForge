import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // Smoke tests should not run concurrently against the same dev server.
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3005",
    headless: true,
    screenshot: "only-on-failure",
  },
  timeout: 45_000,
});
