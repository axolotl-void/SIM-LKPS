/**
 * Hapus baris dosen uji (NIDN 9999999999) dari database.
 * Dipakai setelah tests/e2e-dosen-http.mjs, karena API tidak punya route DELETE.
 *
 * Jalankan dari root repo:
 *   node --env-file=.env tests/cleanup-dosen-uji.mjs
 */
import { PrismaClient } from "@prisma/client";

const NIDN_UJI = "9999999999";
const db = new PrismaClient();

const rows = await db.dosen.findMany({ where: { nidn: NIDN_UJI } });

if (rows.length === 0) {
  console.log("Tidak ada baris uji yang tersisa. Database bersih.");
} else {
  const del = await db.dosen.deleteMany({ where: { nidn: NIDN_UJI } });
  console.log(`Menghapus ${del.count} baris uji:`);
  for (const r of rows) console.log(`  - ${r.nama} (NIDN ${r.nidn})`);
}

const total = await db.dosen.count();
console.log(`Total dosen sekarang: ${total}`);
await db.$disconnect();
