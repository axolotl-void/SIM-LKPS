import { test, expect, chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'admin@ubbg.ac.id';
const TEST_PASSWORD = 'Admin@2026!';

// Helper function
async function loginAndTest(page: any, path: string, name: string) {
  await page.goto(`${BASE_URL}${path}`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
  console.log(`✓ ${name} loaded`);
}

// BAB 1 Tests
test('1.A.1 - Page loads', async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/');
  await loginAndTest(page, '/lkps/bab-1/tabel-1a1', '1.A.1 - Pimpinan Tupoksi');
  await browser.close();
});

test('1.A.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-1/tabel-1a2', '1.A.2 - Sumber Pendanaan');
});

test('1.A.3 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-1/tabel-1a3', '1.A.3 - Penggunaan Dana');
});

test('1.A.4 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-1/tabel-1a4', '1.A.4 - Beban DTPR');
});

test('1.A.5 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-1/tabel-1a5', '1.A.5 - Kualifikasi Tendik');
});

test('1.B - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-1/tabel-1b', '1.B - Unit SPMI');
});

test('2.A.1 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2a1', '2.A.1 - Data Mahasiswa');
});

test('2.A.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2a2', '2.A.2 - Keragaman Asal');
});

test('2.A.3 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2a3', '2.A.3 - Kondisi Jumlah');
});

test('2.B.1 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2b1', '2.B.1 - Isi Pembelajaran');
});

test('2.B.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2b2', '2.B.2 - Pemetaan CPL');
});

test('2.B.3 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2b3', '2.B.3 - Peta Pemenuhan CPL');
});

test('2.B.4 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2b4', '2.B.4 - Masa Tunggu');
});

test('2.B.5 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2b5', '2.B.5 - Kesesuaian Kerja');
});

test('2.B.6 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2b6', '2.B.6 - Kepuasan Pengguna');
});

test('2.C - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2c', '2.C - Fleksibilitas');
});

test('2.D - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-2/tabel-2d', '2.D - Rekognisi');
});

test('3.A.1 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-3/tabel-3a1', '3.A.1 - Sarana Penelitian');
});

test('3.A.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-3/tabel-3a2', '3.A.2 - Penelitian DTPR');
});

test('3.A.3 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-3/tabel-3a3', '3.A.3 - Pengembangan DTPR');
});

test('3.C.1 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-3/tabel-3c1', '3.C.1 - Kerja Sama');
});

test('3.C.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-3/tabel-3c2', '3.C.2 - Publikasi');
});

test('3.C.3 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-3/tabel-3c3', '3.C.3 - HKI');
});

test('4.A.1 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-4/tabel-4a1', '4.A.1 - Sarana PkM');
});

test('4.A.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-4/tabel-4a2', '4.A.2 - PkM DTPR');
});

test('4.C.1 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-4/tabel-4c1', '4.C.1 - Kerja Sama PkM');
});

test('4.C.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-4/tabel-4c2', '4.C.2 - Diseminasi');
});

test('4.C.3 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-4/tabel-4c3', '4.C.3 - HKI PkM');
});

test('5.1 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-5/tabel-51', '5.1 - Sistem Tata Kelola');
});

test('5.2 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-5/tabel-52', '5.2 - Sarana Prasarana');
});

test('6 - Page loads', async ({ page }) => {
  await loginAndTest(page, '/lkps/bab-5/tabel-6', '6 - Visi Misi');
});
