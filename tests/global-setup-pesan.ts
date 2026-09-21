/**
 * Persiapan sebelum uji "pesan pembatas login".
 *
 * Uji itu sengaja menghabiskan kuota percobaan gagal (10x) untuk sebuah akun.
 * Kalau hitungan dari jalan sebelumnya tidak dibersihkan, uji berikutnya
 * langsung menemukan keadaan terkunci dan bisa lulus/gagal secara palsu.
 * Jadi hitungan dibersihkan dulu.
 *
 * PENGAMAN: hanya boleh jalan di database LOKAL. Uji ini tidak boleh menyentuh
 * database produksi. Kalau DATABASE_URL bukan localhost, proses dihentikan.
 */
import { PrismaClient } from '@prisma/client';

export default async function globalSetup() {
  const url = process.env.DATABASE_URL ?? '';

  const lokal =
    url.includes('localhost') || url.includes('127.0.0.1') || url.includes('::1');

  if (!lokal) {
    throw new Error(
      'Uji pembatas login DIBATALKAN: DATABASE_URL bukan database lokal. ' +
        'Uji ini menambah dan menghapus baris di tabel login_attempt, jadi ' +
        'hanya boleh dijalankan pada DB uji. Jalankan dengan:\n' +
        '  DATABASE_URL="postgresql://postgres:...@localhost:5432/sim_lkps_uji" \\\n' +
        '    npx playwright test --config=tests/playwright-pesan.config.ts'
    );
  }

  const db = new PrismaClient();
  try {
    const dihapus = await db.loginAttempt.deleteMany({});
    console.log(`[pesan-pembatas] hitungan login dibersihkan: ${dihapus.count} baris`);
  } finally {
    await db.$disconnect();
  }
}
