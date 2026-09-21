import { test, expect, Page } from '@playwright/test';

const EMAIL = 'admin@ubbg.ac.id';
const PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? '';

async function login(page: Page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 });
}

async function expectSehat(page: Page) {
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('nextjs-portal[open]')).toHaveCount(0);
}

/**
 * Tunggu React selesai hidrasi.
 *
 * `nextjs-portal` baru disuntik dev-overlay SETELAH hidrasi. Tanpa ini,
 * `fill()` bisa jalan di atas DOM pra-hidrasi: select-all belum terpasang,
 * jadi teks baru MENEMPEL ke teks lama. Itu artefak tes, bukan bug aplikasi.
 */
async function tungguHidrasi(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.querySelector('nextjs-portal') !== null, null, {
    timeout: 30_000,
  });
}

test('1. Ringkasan LED tampil dengan 6 kartu', async ({ page }) => {
  await login(page);
  await page.goto('/led');
  await expectSehat(page);
  // header breadcrumb juga pakai <h1>; ambil hero-nya (nth(1))
  await expect(page.getByRole('heading', { name: 'Laporan Evaluasi Diri', level: 1 }).nth(1)).toBeVisible();
  // label tiap kartu ada di dalam link kartunya (scope ke <main> supaya sidebar tidak ikut)
  const main = page.locator('main');
  for (const judul of [
    'Pendahuluan',
    'Kondisi Eksternal',
    'Profil UPPS & Program Studi',
    'Kriteria 1–6',
    'Suplemen Program Studi',
    'Penutup',
  ]) {
    await expect(main.getByRole('heading', { name: judul, level: 3 })).toBeVisible();
  }
});

test('2. BAB I menampilkan 3 butir dan editor', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-1');
  await expectSehat(page);
  await expect(page.getByText('Dasar Penyusunan')).toBeVisible();
  await expect(page.getByText('Tim Penyusun dan Tanggung Jawabnya')).toBeVisible();
  await expect(page.getByText('Mekanisme Kerja Penyusunan LED')).toBeVisible();
  await expect(page.locator('textarea').first()).toBeVisible();
});

test('3. Profil UPPS menampilkan 8 sub-bagian', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-2/profil');
  await expectSehat(page);
  for (const t of [
    'Sejarah Unit Pengelola Program Studi',
    'Visi, Misi, Tujuan, Strategi, dan Tata Nilai',
    'Organisasi dan Tata Kerja',
    'Mahasiswa dan Lulusan',
    'Dosen dan Tenaga Kependidikan',
    'Keuangan, Sarana, dan Prasarana',
    'Sistem Penjaminan Mutu',
  ]) {
    await expect(page.getByText(t, { exact: false }).first()).toBeVisible();
  }
  await expect(page.locator('textarea')).toHaveCount(8);
});

test('4. Suplemen menampilkan 4 bagian', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-2/suplemen');
  await expectSehat(page);
  await expect(page.getByText('Mata Kuliah Inti/Khas Ilmu Komputer')).toBeVisible();
  await expect(page.locator('textarea')).toHaveCount(4);
});

test('5. Kriteria 1 punya accordion 5 tahap PPEPP', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-2/kriteria/1');
  await expectSehat(page);
  for (const t of ['Penetapan', 'Pelaksanaan', 'Evaluasi', 'Pengendalian', 'Peningkatan']) {
    await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
  }
  // 10 butir kriteria 1 = 10 editor
  await expect(page.locator('textarea')).toHaveCount(10);
});

test('6. Pemilih kriteria pindah ke Kriteria 2', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-2/kriteria/1');
  await page.getByRole('link', { name: 'K2', exact: true }).click();
  await page.waitForURL('**/led/bab-2/kriteria/2');
  await expectSehat(page);
  await expect(page.getByText('Relevansi Pendidikan').first()).toBeVisible();
});

test('7. Simpan narasi → status otomatis Draft', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-1');
  await expectSehat(page);
  await tungguHidrasi(page);

  const ta = page.locator('textarea').first();
  const teks = `## Uji otomatis\n\nNarasi uji ${Date.now()}.`;
  await ta.click();
  await ta.press('Meta+a');
  await ta.press('Delete');
  await ta.fill(teks);
  await expect(ta).toHaveValue(teks);

  // autosave 2s + round-trip
  await expect(page.getByText(/Tersimpan \d{2}\.\d{2}/)).toBeVisible({ timeout: 30_000 });

  // server menyimpan: cek setelah reload
  await page.reload();
  await expectSehat(page);
  await tungguHidrasi(page);
  await expect(page.locator('textarea').first()).toHaveValue(teks);
});

test('8. Pratinjau Markdown merender heading', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-1');
  await expectSehat(page);
  await page.getByRole('button', { name: /Pratinjau/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Uji otomatis' }).first()).toBeVisible();
});

test('10. Bukti pendukung bisa ditambah & dihapus', async ({ page }) => {
  await login(page);
  await page.goto('/led/bab-3');
  await expectSehat(page);
  await tungguHidrasi(page);

  const nama = `Bukti uji ${Date.now()}`;
  await page.getByRole('button', { name: 'Tambah' }).first().click();
  await page.getByPlaceholder('Nama berkas, mis. RPS Algoritma 2025').first().fill(nama);
  await page.getByPlaceholder('https://tautan-berkas-atau-dokumen').first().fill('https://example.com/bukti.pdf');
  await page.getByRole('button', { name: 'Simpan bukti' }).first().click();

  await expect(page.getByText(nama)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/Bukti Pendukung \(\d+\)/).first()).toBeVisible();

  // bertahan setelah reload = benar tersimpan di server
  await page.reload();
  await expectSehat(page);
  await expect(page.getByText(nama)).toBeVisible();

  // hapus baris itu saja (state DB bisa punya bukti lain dari run sebelumnya)
  const baris = page.locator('li', { hasText: nama });
  await baris.locator('button[title="Hapus bukti"]').click();
  await expect(page.getByText(nama)).toHaveCount(0, { timeout: 20_000 });
});

test('11. Pimpinan hanya bisa baca (tanpa textarea & tombol tambah)', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'pimpinan.uji@ubbg.ac.id');
  await page.fill('input[type="password"]', process.env.TEST_PIMPINAN_PASSWORD ?? '');
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 });

  await page.goto('/led/bab-1');
  await expectSehat(page);
  await expect(page.getByText('Hanya baca').first()).toBeVisible();
  await expect(page.getByText('Peran PIMPINAN hanya bisa membaca LED.', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Simpan bukti/ })).toHaveCount(0);

  // editor tetap tampil tapi readonly
  const ta = page.locator('textarea').first();
  await expect(ta).toHaveAttribute('readonly', '');
});
