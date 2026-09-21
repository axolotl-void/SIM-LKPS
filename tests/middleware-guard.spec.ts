import { test, expect } from '@playwright/test';

/**
 * Pagar keamanan lapisan middleware.
 *
 * KENAPA SPEC INI ADA:
 * Saat pemeriksaan login dipindahkan ke `middleware.ts` (21 Sep 2026),
 * pemeriksaan itu tanpa sengaja ikut mengunci **berkas statis** di `public/`.
 * Akibatnya `/logo-ubbg.svg` dan `/images/*.webp` balas `307 → /login`,
 * sehingga logo UBBG dan seluruh gambar halaman login rusak — halaman yang
 * justru dibuka SEBELUM pengguna punya sesi.
 *
 * Bug itu lolos dari type-check, lint, dan `next build` (semuanya hijau);
 * hanya ketahuan karena rute asetnya benar-benar di-request. Spec ini menjaga
 * dua sisi sekaligus: aset tetap terbuka, tapi halaman tetap terkunci.
 */

test.describe('Pagar middleware', () => {
  test.describe('Berkas statis tetap terbuka tanpa login', () => {
    const aset = [
      '/logo-ubbg.svg',
      '/images/ubbg-campus.webp',
      '/images/ubbg-campus-mobile.webp',
      '/img/profile.webp',
    ];

    for (const url of aset) {
      test(`${url} balas 200`, async ({ request }) => {
        const res = await request.get(url, { maxRedirects: 0 });
        expect(res.status()).toBe(200);
      });
    }
  });

  test.describe('Halaman terautentikasi tetap terkunci', () => {
    const terlindungi = [
      '/dashboard',
      '/lkps/kriteria-1',
      '/led',
      '/penilaian',
      '/settings/users',
      '/master/dosen',
    ];

    for (const url of terlindungi) {
      test(`${url} dialihkan ke /login`, async ({ request }) => {
        const res = await request.get(url, { maxRedirects: 0 });
        expect(res.status()).toBe(307);
        expect(res.headers()['location']).toContain('/login');
      });
    }
  });

  test.describe('API tanpa login balas 401, bukan halaman HTML', () => {
    const api = ['/api/export/excel', '/api/master/dosen'];

    for (const url of api) {
      test(`${url} balas 401`, async ({ request }) => {
        const res = await request.get(url, { maxRedirects: 0 });
        expect(res.status()).toBe(401);
        // Harus JSON supaya pemanggil API tidak menerima HTML halaman login
        // lalu gagal mem-parse dengan pesan yang membingungkan.
        expect(res.headers()['content-type']).toContain('application/json');
      });
    }
  });

  test('halaman login sendiri tetap bisa dibuka tanpa sesi', async ({ request }) => {
    const res = await request.get('/login', { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test('header keamanan terpasang di balasan halaman', async ({ request }) => {
    const res = await request.get('/login');
    const h = res.headers();
    expect(h['x-frame-options']).toBe('DENY');
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy']).toContain('camera=()');
  });

  test('tidak membocorkan framework lewat X-Powered-By', async ({ request }) => {
    const res = await request.get('/login');
    expect(res.headers()['x-powered-by']).toBeUndefined();
  });
});
