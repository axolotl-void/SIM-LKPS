import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: 'list',
  globalSetup: './global-setup-penilaian.ts',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    actionTimeout: 8_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      // headless shell bawaan Playwright belum ter-download di mesin ini;
      // pakai Chrome sistem supaya suite bisa jalan tanpa `playwright install`.
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
