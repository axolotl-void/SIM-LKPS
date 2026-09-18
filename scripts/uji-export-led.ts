/**
 * Uji integrasi export LED: tarik data dari DB uji, bangun dokumen nyata,
 * lalu periksa ukurannya. Jalankan manual:
 *
 *   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sim_lkps_uji" \
 *     npx tsx scripts/uji-export-led.ts
 *
 * Catatan: jalur PDF TIDAK jalan lewat `tsx` — tsconfig memakai
 * `"jsx": "preserve"` (khas Next.js), dan tsx mengompilasi JSX-nya jadi
 * `React.createElement` tanpa mengimpor React. Next.js/SWC tidak punya masalah
 * itu. Untuk menguji PDF, pakai route HTTP-nya (lihat `tests/export-led.spec.ts`).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { db } from "@/lib/db";
import { buildLedDocx } from "@/lib/export/led-docx";
import { buildLedPdf } from "@/lib/export/led-pdf";
import { siapkanExportLed } from "@/lib/utils/led-export-query";

const KELUARAN = "/tmp/simlkps-export-led";

async function main() {
  mkdirSync(KELUARAN, { recursive: true });

  const ctx = await siapkanExportLed();
  if (!ctx) throw new Error("tidak ada tahun akademik aktif");

  console.log(`prodi          : ${ctx.prodi.nama} (${ctx.prodi.jenjang})`);
  console.log(`tahun akademik : ${ctx.tahunAkademik.tahun} ${ctx.tahunAkademik.semester}`);
  console.log(`bagian total   : ${ctx.pra.jumlahBagian}`);
  console.log(`bagian kosong  : ${ctx.pra.jumlahKosong}`);
  console.log(`karakter       : ${ctx.pra.totalKarakter}`);
  console.log(`estimasi       : ${ctx.pra.estimasiHalaman} halaman`);
  console.log(`dicetak        : ${ctx.bagianCetak.length} bagian`);

  const meta = {
    perguruanTinggi: "Universitas Bina Bangsa Getsempena",
    prodi: ctx.prodi.nama,
    jenjang: ctx.prodi.jenjang,
    tahun: ctx.tahunAkademik.tahun,
    semester: ctx.tahunAkademik.semester,
  };

  // ── DOCX
  const docx = await buildLedDocx(ctx.bagianCetak, meta);
  const pathDocx = `${KELUARAN}/led.docx`;
  writeFileSync(pathDocx, docx);
  console.log(`\ndocx : ${pathDocx} (${docx.length} byte)`);

  // ── PDF
  const pdf = await buildLedPdf(ctx.bagianCetak, meta);
  const pathPdf = `${KELUARAN}/led.pdf`;
  writeFileSync(pathPdf, pdf);
  console.log(`pdf  : ${pathPdf} (${pdf.length} byte)`);

  // ── isi bagian kosong (uji jalur "[belum diisi]")
  const adaKosong = ctx.bagian.filter((b) => !(b.isian?.konten ?? "").trim()).length;
  console.log(`\nbagian kosong di DB: ${adaKosong}`);

  await db.$disconnect();
}

main().catch(async (e) => {
  console.error("GAGAL:", e);
  await db.$disconnect();
  process.exit(1);
});
