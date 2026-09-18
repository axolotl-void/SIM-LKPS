import { PrismaClient } from '@prisma/client';

/**
 * Bersihkan state penilaian di DB uji sebelum suite jalan.
 *
 * PENGAMAN: hanya boleh jalan kalau DATABASE_URL menunjuk ke localhost.
 * Tanpa penjagaan ini, menjalankan suite tanpa override DATABASE_URL akan
 * menghapus skor di DB produksi (Neon) — karena `.env` proyek menunjuk ke sana.
 */
export default async function globalSetup() {
  const url = process.env.DATABASE_URL ?? '';
  const lokal = /@(localhost|127\.0\.0\.1|host\.docker\.internal)[:/]/.test(url);

  if (!lokal) {
    const host = url.replace(/\/\/[^@]*@/, '//').split('/')[2] ?? '(kosong)';
    throw new Error(
      `Suite penilaian butuh DB uji lokal, tapi DATABASE_URL menunjuk ke "${host}".\n` +
        `Jalankan dengan:\n` +
        `  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sim_lkps_uji" \\\n` +
        `    npx playwright test --config=tests/playwright.config.ts\n` +
        `Ditolak demi keamanan: langkah ini menghapus skor penilaian.`,
    );
  }

  const prisma = new PrismaClient();
  try {
    await prisma.skorPenilaian.deleteMany();
    await prisma.penilaianSesi.deleteMany();
  } finally {
    await prisma.$disconnect();
  }
}
