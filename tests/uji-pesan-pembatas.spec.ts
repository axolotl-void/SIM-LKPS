import { test, expect } from '@playwright/test';

/**
 * Memastikan pesan pembatas login SAMPAI KE LAYAR, bukan cuma dikembalikan API.
 *
 * KENAPA TERPISAH:
 * Uji ini menambah hitungan gagal pada tabel `login_attempt` untuk sebuah akun.
 * Kalau digabung ke suite utama, akun admin bisa terkunci dan menumbangkan uji
 * lain. Di sini sengaja memakai email yang TIDAK ADA supaya akun asli aman.
 *
 * KENAPA PERLU:
 * Blokir di lapisan API sudah terbukti (Location berisi
 * `code=terlalu_banyak_percobaan`). Tapi pengguna tidak memakai API langsung —
 * mereka memakai form yang lewat Server Action. Kalau rantai `cause` tidak
 * tertelusuri di sana, pengguna akan melihat "Email atau kata sandi tidak
 * sesuai" dan terus mencoba, persis yang tidak boleh terjadi saat terkunci.
 *
 * CATATAN PENTING (pelajaran saat menulis uji ini):
 * Banner galat TIDAK hilang di antara percobaan — React hanya mengganti
 * isinya. Menunggu `toBeVisible()` saja lalu membaca teks menghasilkan teks
 * BASI dari percobaan sebelumnya, sehingga uji lolos/gagal secara palsu.
 * Karena itu setiap klik ditunggu sampai respons server-nya benar-benar
 * kembali sebelum banner dibaca.
 */
test.describe('Pesan pembatas login di layar', () => {
  test('setelah 10 percobaan gagal, form menampilkan pesan terkunci', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('/login');
    await expect(page.locator('input[name="email"]')).toBeVisible();

    const email = 'uji-pesan-pembatas-tidak-ada@contoh.invalid';
    const sandi = page.locator('input[name="password"]');
    const tombol = page.locator('form button[type="submit"]');
    const banner = page.locator('form [role="alert"]');

    let terlihatPesanKunci = false;
    let percobaan = 0;

    // Batas per-akun 10; beri ruang sampai 14 supaya percobaan ke-11 yang
    // ditolak (bukan dicatat gagal) tetap teramati.
    for (let i = 1; i <= 14; i++) {
      // Kalau tombol sudah mati, UI sudah dalam keadaan terkunci.
      if (await tombol.isDisabled()) {
        terlihatPesanKunci = (await banner.innerText())
          .toLowerCase()
          .includes('terlalu banyak percobaan');
        break;
      }

      await page.locator('input[name="email"]').fill(email);
      await sandi.fill(`sandi-ngawur-${i}`);

      // Tunggu respons Server Action yang BENAR-BENAR kembali, supaya
      // banner tidak dibaca sebelum diperbarui.
      const respons = page.waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/login'),
        { timeout: 30_000 }
      );
      await tombol.click();
      await respons;
      percobaan = i;

      await expect(banner).toBeVisible({ timeout: 30_000 });
      const teks = (await banner.innerText()).toLowerCase();

      if (teks.includes('terlalu banyak percobaan')) {
        terlihatPesanKunci = true;
        // Pesannya harus memberi tahu berapa lama menunggu, bukan sekadar "salah".
        expect(teks).toMatch(/menit|detik/);
        // Tombol dinonaktifkan supaya pengguna tidak menambah percobaan.
        await expect(tombol).toBeDisabled();
        break;
      }
    }

    expect(
      percobaan,
      'Uji harus benar-benar mencoba beberapa kali sebelum menyimpulkan'
    ).toBeGreaterThanOrEqual(10);

    expect(
      terlihatPesanKunci,
      'Setelah 10 percobaan gagal, form harus menampilkan pesan terkunci, bukan "sandi salah"'
    ).toBe(true);
  });
});
