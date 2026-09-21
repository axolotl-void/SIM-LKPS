/** @type {import('@playwright/test').PlaywrightTestConfig} */
// Uji khusus: memastikan PESAN pembatas login sampai ke layar pengguna.
// Dijalankan terpisah karena mengubah hitungan di tabel login_attempt.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['uji-pesan-pembatas.spec.ts'],
  globalSetup: './global-setup-pesan.ts',
  timeout: 40_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off',
    screenshot: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
});
