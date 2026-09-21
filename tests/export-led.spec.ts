import { test, expect, Page } from '@playwright/test';

const EMAIL = 'admin@ubbg.ac.id';
const PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? '';
const PIMPINAN_PASSWORD = process.env.TEST_PIMPINAN_PASSWORD ?? '';

async function login(page: Page, email = EMAIL, password = PASSWORD) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 30_000 });
}

async function expectSehat(page: Page) {
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('nextjs-portal[open]')).toHaveCount(0);
}

test.describe.configure({ mode: 'serial' });

// bersihkan narasi uji supaya suite lain (led.spec.ts) melihat state kosong lagi
test.afterAll(async () => {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const ta = await prisma.tahunAkademik.findFirst({ where: { isActive: true } });
    const bg = await prisma.ledBagian.findUnique({ where: { kode: 'BAB2.A' } });
    if (ta && bg) {
      await prisma.ledIsian.deleteMany({
        where: { tahunAkademikId: ta.id, ledBagianId: bg.id },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

test('1. halaman export LED: pra-export check + tombol unduh', async ({ page }) => {
  await login(page);
  await page.goto('/led/export');
  await expectSehat(page);

  await expect(page.getByRole('heading', { name: 'Export Dokumen LED' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pemeriksaan Pra-Export' })).toBeVisible();

  // statistik wajib ada
  await expect(page.getByText('Bagian terisi')).toBeVisible();
  await expect(page.getByText('Estimasi halaman')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export Dokumen' })).toBeVisible();

  // LED di DB uji hampir kosong → peringatan bagian kosong muncul
  await expect(page.getByText(/bagian belum diisi/)).toBeVisible();
});

test('2. dialog export menampilkan ringkasan + dua format', async ({ page }) => {
  await login(page);
  await page.goto('/led/export');
  await expectSehat(page);

  await page.getByRole('button', { name: 'Export Dokumen' }).click();

  await expect(page.getByRole('heading', { name: 'Export Laporan Evaluasi Diri' })).toBeVisible();
  await expect(page.getByText('A4 · Arial 11 · spasi 1,15')).toBeVisible();
  await expect(page.getByText('Unduh Word (.docx)')).toBeVisible();
  await expect(page.getByText('Unduh PDF')).toBeVisible();

  // tutup
  await page.getByRole('button', { name: 'Tutup' }).click();
  await expect(page.getByRole('heading', { name: 'Export Laporan Evaluasi Diri' })).toHaveCount(0);
});

test('3. route Word menghasilkan .docx valid (ZIP + Arial + A4)', async ({ page }) => {
  await login(page);
  const res = await page.request.get('/api/export/led/word');

  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('wordprocessingml.document');
  expect(res.headers()['content-disposition']).toMatch(/LED_.*\.docx/);

  const buf = await res.body();
  expect(buf.length).toBeGreaterThan(5000);
  // .docx = arsip ZIP → magic "PK"
  expect(buf.subarray(0, 2).toString('latin1')).toBe('PK');
});

test('4. route PDF menghasilkan PDF valid', async ({ page }) => {
  await login(page);
  const res = await page.request.get('/api/export/led/pdf');

  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
  expect(res.headers()['content-disposition']).toMatch(/LED_.*\.pdf/);

  const buf = await res.body();
  expect(buf.length).toBeGreaterThan(1000);
  // header PDF
  expect(buf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
});

test('5. export tanpa login ditolak 401', async ({ page }) => {
  const res = await page.request.get('/api/export/led/word');
  expect([401, 403]).toContain(res.status());
});

test('6. PIMPINAN punya report.export → boleh unduh', async ({ page }) => {
  await login(page, 'pimpinan@ubbg.ac.id', PIMPINAN_PASSWORD);
  const res = await page.request.get('/api/export/led/word');
  expect(res.status()).toBe(200);
});

test('7. narasi terisi ikut tercetak di dokumen', async ({ page }) => {
  await login(page);

  // tulis narasi ke satu bagian lewat DB uji
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  const TAJS = 'NARASI UJI EKSPORT: program studi menerapkan budaya mutu.';
  try {
    const ta = await prisma.tahunAkademik.findFirstOrThrow({ where: { isActive: true } });
    const bg = await prisma.ledBagian.findUniqueOrThrow({ where: { kode: 'BAB2.A' } });
    await prisma.ledIsian.upsert({
      where: { ledBagianId_tahunAkademikId: { ledBagianId: bg.id, tahunAkademikId: ta.id } },
      create: {
        ledBagianId: bg.id,
        tahunAkademikId: ta.id,
        konten: TAJS,
        status: 'DRAFT',
        jumlahKarakter: TAJS.length,
      },
      update: { konten: TAJS, status: 'DRAFT', jumlahKarakter: TAJS.length },
    });
  } finally {
    await prisma.$disconnect();
  }

  const res = await page.request.get('/api/export/led/word');
  expect(res.status()).toBe(200);
  const buf = await res.body();

  // .docx itu ZIP; narasi harus ada di dalam document.xml yang ter-deflate.
  const { execFileSync } = await import('node:child_process');
  const { writeFileSync, mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');

  const dir = mkdtempSync(join(tmpdir(), 'led-docx-'));
  const file = join(dir, 'led.docx');
  writeFileSync(file, buf);

  const xml = execFileSync('unzip', ['-p', file, 'word/document.xml'], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });

  expect(xml).toContain('NARASI UJI EKSPORT');
  expect(xml).toContain('LAPORAN EVALUASI DIRI');
  // format wajib: Arial + spasi 1,15 (line=276 twips)
  expect(xml).toContain('Arial');
  expect(xml).toContain('w:line="276"');
  // ukuran A4 (11906 x 16838 twip)
  expect(xml).toContain('w:w="11906"');
  expect(xml).toContain('w:h="16838"');

  // halaman export sekarang melaporkan bagian terisi
  await page.goto('/led/export');
  await expectSehat(page);
  await expect(page.getByText(/1\/92/)).toBeVisible({ timeout: 15_000 });
});
