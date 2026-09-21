import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  // Uji "pesan pembatas login" sengaja menghabiskan kuota percobaan gagal (10x)
  // untuk sebuah akun, jadi TIDAK boleh ikut suite ini: ia memperlambat
  // jalannya suite dan bisa bentrok dengan uji login lain. Jalankan terpisah:
  //   npx playwright test --config=tests/playwright-pesan.config.ts
  testIgnore: ['uji-pesan-pembatas.spec.ts'],
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
