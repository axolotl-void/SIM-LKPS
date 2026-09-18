/**
 * Entry point khusus modul LED + Matriks Penilaian.
 *
 * Dipakai untuk mengisi DB yang SUDAH ADA ISINYA tanpa menjalankan ulang
 * seluruh seed LKPS. Semua operasi `upsert` — idempoten, tidak menghapus apa pun.
 *
 *   pnpm tsx prisma/seed-modul-baru.ts
 */

import { PrismaClient } from "@prisma/client";
import { seedLedDanPenilaian } from "./seed-led";

const db = new PrismaClient();

console.log("🌱 Seed modul LED + Matriks Penilaian (LAM INFOKOM 2.1)");

seedLedDanPenilaian(db)
  .then(() => {
    console.log("\n🎉 Selesai. Tidak ada data lama yang dihapus.");
  })
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
