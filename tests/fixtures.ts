import { Page, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Akun untuk uji E2E.
 *
 * Sandi dibaca dari variabel lingkungan, TIDAK ditulis di berkas ini — repo ini
 * publik, dan sandi yang tertulis di kode akan terbaca siapa pun yang membuka
 * GitHub. Lihat `tests/.env.test.example` untuk cara mengisinya.
 *
 * Nilai cadangan di bawah hanya dipakai kalau variabelnya tidak diisi, dan
 * sengaja dibuat tidak cocok dengan akun produksi mana pun.
 */
const SANDI_UJI = {
  ADMIN: process.env.TEST_ADMIN_PASSWORD ?? '',
  OPERATOR: process.env.TEST_OPERATOR_PASSWORD ?? '',
  PIMPINAN: process.env.TEST_PIMPINAN_PASSWORD ?? '',
} as const;

/**
 * Pastikan sandi uji sudah diisi sebelum suite dijalankan.
 *
 * Lebih baik gagal cepat dengan pesan jelas daripada menjalankan puluhan
 * skenario yang semuanya gagal login dengan pesan yang membingungkan.
 */
function wajibAda(nama: string, nilai: string, peran: string): string {
  if (!nilai) {
    throw new Error(
      `\n${nama} belum diisi.\n\n` +
        `Suite E2E butuh sandi akun uji. Buat berkas tests/.env.test dari\n` +
        `tests/.env.test.example, lalu isi:\n\n` +
        `  TEST_ADMIN_PASSWORD="sandi-akun-admin-di-DB-UJI"\n\n` +
        `Penting: uji dijalankan terhadap DATABASE_URL yang menunjuk DB uji\n` +
        `(lihat tests/global-setup-penilaian.ts), bukan DB produksi.\n` +
        `(peran yang diminta: ${peran})\n`
    );
  }
  return nilai;
}

export const ROLES = {
  get ADMIN() {
    return { email: 'admin@ubbg.ac.id', password: wajibAda('TEST_ADMIN_PASSWORD', SANDI_UJI.ADMIN, 'ADMIN') };
  },
  get OPERATOR() {
    return { email: 'operator@ubbg.ac.id', password: wajibAda('TEST_OPERATOR_PASSWORD', SANDI_UJI.OPERATOR, 'OPERATOR') };
  },
  get PIMPINAN() {
    return { email: 'pimpinan@ubbg.ac.id', password: wajibAda('TEST_PIMPINAN_PASSWORD', SANDI_UJI.PIMPINAN, 'PIMPINAN') };
  },
} as const;

export type RoleKey = keyof typeof ROLES;

export const STORAGE_BY_ROLE: Record<RoleKey, string> = {
  ADMIN: path.join(__dirname, '.auth', 'admin.json'),
  OPERATOR: path.join(__dirname, '.auth', 'operator.json'),
  PIMPINAN: path.join(__dirname, '.auth', 'pimpinan.json'),
};

/**
 * Login via UI and wait for redirect to dashboard.
 */
export async function login(page: Page, role: RoleKey): Promise<void> {
  const { email, password } = ROLES[role];
  // Clear any leaked session/cookies from prior test in this worker
  await page.context().clearCookies();
  try {
    await page.evaluate(() => {
      window.sessionStorage.clear();
      window.localStorage.clear();
    });
  } catch {
    /* navigated pages may refuse storage access — safe to ignore */
  }
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Auth.js redirects server-side; wait until URL leaves /login
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 20_000 });
}

/**
 * Quick health check: page renders, no Next.js error overlay.
 */
export async function expectHealthyPage(page: Page): Promise<void> {
  await expect(page.locator('body')).toBeVisible();
  // nextjs-portal exists unconditionally in dev mode; only fail when actually open
  const errorOverlay = page.locator('nextjs-portal[open]');
  await expect(errorOverlay).toHaveCount(0);
}