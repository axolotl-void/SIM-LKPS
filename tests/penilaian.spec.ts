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

async function tungguHidrasi(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.querySelector('nextjs-portal') !== null, null, {
    timeout: 30_000,
  });
}

async function expectSehat(page: Page) {
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('nextjs-portal[open]')).toHaveCount(0);
}

test.describe.configure({ mode: 'serial' });

test('1. dashboard penilaian: gauge, status, 82 butir terkelompok', async ({ page }) => {
  await login(page);
  await page.goto('/penilaian');
  await expectSehat(page);

  // gauge nilai akhir + label simulasi
  await expect(page.getByText('Prediksi Status Akreditasi')).toBeVisible();
  await expect(page.getByText('Penilaian Mandiri (simulasi)', { exact: false })).toBeVisible();

  // syarat Unggul terlihat
  await expect(page.getByText(/Rerata C1–C3 ≥ 3,20/)).toBeVisible();
  await expect(page.getByText(/Setiap butir C1–C3 ≥ 3,00/)).toBeVisible();

  // 9 kriteria (KE, PU, C1..C6, SUP) muncul di rincian
  const rincian = page.locator('section, div').filter({ hasText: 'Rincian per Kriteria' }).first();
  for (const k of ['CE', 'PU', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'SUP']) {
    await expect(rincian.getByText(k, { exact: true }).first()).toBeVisible();
  }

  // belum ada yang dinilai → 0/82, status Tidak Terakreditasi
  await expect(page.getByText('0/82').first()).toBeVisible();
  await expect(page.getByText('Tidak Terakreditasi')).toBeVisible();
});

test('2. halaman kriteria C2 menampilkan 20 butir', async ({ page }) => {
  await login(page);
  await page.goto('/penilaian/kriteria/C2');
  await expectSehat(page);
  await expect(page.getByRole('heading', { name: /Relevansi Pendidikan/ })).toBeVisible();
  await expect(page.getByText('0/20 butir dinilai')).toBeVisible();
});

test('3. isi satu skor → tersimpan & rerata kriteria berubah', async ({ page }) => {
  await login(page);
  await page.goto('/penilaian/kriteria/C2');
  await expectSehat(page);
  await tungguHidrasi(page);

  // klik tombol skor 4 pada butir pertama
  const baris = page.locator('li').filter({ hasText: 'bobot' }).first();
  await baris.getByRole('radio', { name: /^4 —/ }).click();
  await expect(page.getByText('tersimpan').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('1/20 butir dinilai')).toBeVisible({ timeout: 20_000 });

  // bertahan setelah reload
  await page.reload();
  await expectSehat(page);
  await expect(page.getByText('1/20 butir dinilai')).toBeVisible();
});

test('4. halaman detail butir: deskriptor 4 level + skor', async ({ page }) => {
  await login(page);
  await page.goto('/penilaian/kriteria/C1');
  await expectSehat(page);

  // buka butir pertama lewat chip kode
  const chip = page.locator('a[href^="/penilaian/butir/"]').first();
  const kode = (await chip.textContent())?.trim() ?? '';
  await chip.click();
  await page.waitForURL('**/penilaian/butir/**');
  await expectSehat(page);

  await expect(page.getByText('Elemen Penilaian')).toBeVisible();
  await expect(page.getByText('Deskriptor 4 Level')).toBeVisible();
  for (const l of ['Kurang', 'Cukup', 'Baik', 'Sangat Baik']) {
    await expect(page.getByText(l, { exact: true }).first()).toBeVisible();
  }

  // beri skor 2 langsung dari halaman detail
  await page.getByRole('radio', { name: /^2 —/ }).click();
  await expect(page.getByText('tersimpan').first()).toBeVisible({ timeout: 20_000 });

  await page.reload();
  await expectSehat(page);
  await expect(page.getByRole('radio', { name: /^2 —/ })).toHaveAttribute('aria-checked', 'true');
});

test('5. kriteria kunci C1 menandai butir penghambat Unggul', async ({ page }) => {
  await login(page);
  await page.goto('/penilaian');
  await expectSehat(page);
  // butir C2 (test 3) & C1 (test 4) sudah dinilai → penghambat muncul
  await expect(page.getByText('Penghambat gelar Unggul')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('2/82').first()).toBeVisible();
});

test('6. finalisasi terkunci selama masih ada butir kosong', async ({ page }) => {
  await login(page);
  await page.goto('/penilaian');
  await expectSehat(page);

  const tombol = page.getByRole('button', { name: 'Finalisasi' });
  await expect(tombol).toBeDisabled();
  await expect(page.getByText(/butir belum dinilai — finalisasi terkunci/)).toBeVisible();
});

test('7. PIMPINAN hanya bisa membaca (tombol finalisasi tidak ada)', async ({ page }) => {
  await login(page, 'pimpinan@ubbg.ac.id', PIMPINAN_PASSWORD);
  await page.goto('/penilaian');
  await expectSehat(page);
  await expect(page.getByText('hanya bisa membaca hasil penilaian', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Finalisasi' })).toHaveCount(0);

  // di halaman kriteria, tombol skor disabled
  await page.goto('/penilaian/kriteria/C2');
  await expectSehat(page);
  await expect(page.getByRole('radio').first()).toBeDisabled();
});

test('9. finalisasi: 82 butir skor 4 → nilai 400 → Unggul → terkunci', async ({ page }) => {
  await login(page);

  // Isi semua 82 butir lewat DB (jauh lebih cepat daripada klik 82×),
  // lalu uji alur finalisasi + pembacaan hasil di UI.
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const ta = await prisma.tahunAkademik.findFirst({ where: { isActive: true } });
    expect(ta, 'tahun akademik aktif harus ada').toBeTruthy();
    let sesi = await prisma.penilaianSesi.findFirst({ where: { tahunAkademikId: ta!.id } });
    if (!sesi) {
      sesi = await prisma.penilaianSesi.create({ data: { tahunAkademikId: ta!.id } });
    }
    // bersihkan sisa skor test sebelumnya supaya semuanya benar-benar 4
    await prisma.skorPenilaian.deleteMany({ where: { penilaianSesiId: sesi.id } });
    const butir: { id: string }[] = await prisma.butirPenilaian.findMany({ select: { id: true } });
    await prisma.skorPenilaian.createMany({
      data: butir.map((b) => ({ penilaianSesiId: sesi!.id, butirPenilaianId: b.id, skor: 4 })),
      skipDuplicates: true,
    });
  } finally {
    await prisma.$disconnect();
  }

  await page.goto('/penilaian');
  await expectSehat(page);
  await expect(page.getByText('82/82').first()).toBeVisible();
  await expect(page.getByText('400', { exact: true })).toBeVisible();
  await expect(page.getByText(/Unggul \(berlaku 5 tahun\)/)).toBeVisible();

  // finalisasi → status tersimpan + skor terkunci
  await page.getByRole('button', { name: 'Finalisasi' }).click();
  await expect(page.getByText(/Penilaian sudah difinalisasi dengan nilai akhir/)).toBeVisible({
    timeout: 20_000,
  });

  // halaman kriteria jadi read-only
  await page.goto('/penilaian/kriteria/C2');
  await expectSehat(page);
  await expect(page.getByRole('radio').first()).toBeDisabled();

  // buka kembali → bisa diedit lagi
  await page.goto('/penilaian');
  await page.getByRole('button', { name: 'Buka kembali' }).click();
  await expect(page.getByRole('button', { name: 'Finalisasi' })).toBeVisible({ timeout: 20_000 });

  await page.goto('/penilaian/kriteria/C2');
  await expectSehat(page);
  await expect(page.getByRole('radio').first()).toBeEnabled();
});

test('8. kode kriteria tak dikenal → halaman 404 bertema', async ({ page }) => {
  await login(page);
  await page.goto('/penilaian/kriteria/XX');
  // Next.js selalu balas 200 untuk notFound() di route dinamis (streaming),
  // jadi yang diuji adalah UI-nya, bukan status code: tidak ada crash/gauge.
  await expect(page.getByRole('heading', { name: /Data yang Anda cari tidak ada/ })).toBeVisible();
  await expect(page.getByText('404 — Halaman tidak ditemukan')).toBeVisible();
  await expect(page.getByText('Prediksi Status Akreditasi')).toHaveCount(0);
});
