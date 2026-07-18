/**
 * Script untuk insert sample data BAB 1 & 2
 * Run: npx tsx scripts/insert-bab12-data.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function insertTableData(tabelKode: string, rowsData: any[]) {
  const def = await db.tabelDefinition.findUnique({ where: { kode: tabelKode } });
  if (!def) { console.error(`❌ Tabel ${tabelKode} not found`); return false; }

  const ta = await db.tahunAkademik.findFirst({ where: { isActive: true } });
  if (!ta) { console.error("❌ Tahun Akademik not found"); return false; }

  const existing = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: ta.id } },
  });
  if (existing) {
    await db.tabelLkpsRow.deleteMany({ where: { tabelLkpsId: existing.id } });
    await db.tabelLkps.delete({ where: { id: existing.id } });
  }

  const tabelLkps = await db.tabelLkps.create({
    data: { tabelDefinitionId: def.id, tahunAkademikId: ta.id, status: "DRAFT" },
  });

  for (const row of rowsData) {
    await db.tabelLkpsRow.create({
      data: { tabelLkpsId: tabelLkps.id, rowOrder: row.rowOrder, rowData: row.rowData },
    });
  }

  console.log(`✅ ${tabelKode}: ${rowsData.length} rows`);
  return true;
}

async function main() {
  console.log("📊 Inserting sample data for BAB 1 & 2...\n");

  // 1.A.1 - Pimpinan dan Tupoksi
  await insertTableData("1.A.1", [
    { rowOrder: 1, rowData: { no: 1, nama: "Prof. Dr. H. Abdullah, M.Si.", nidn: "0011123301", jabatan: "Ketua UPPS", tupoksi: "Memimpin dan mengkoordinasikan seluruh kegiatan UPPS untuk pencapaian visi dan misi Program Studi" } },
    { rowOrder: 2, rowData: { no: 2, nama: "Dr. Muhammad Ali, M.Kom.", nidn: "0022234402", jabatan: "Sekretaris UPPS", tupoksi: "Mengkoordinasikan administrasi dan dokumentasi UPPS" } },
    { rowOrder: 3, rowData: { no: 3, nama: "Dr. Siti Aminah, M.Sc.", nidn: "0033345503", jabatan: "Koordinator Bidang Akademik", tupoksi: "Mengkoordinasikan kegiatan akademik dan kurikulum" } },
    { rowOrder: 4, rowData: { no: 4, nama: "Ir. Budi Santoso, M.T.", nidn: "0044456604", jabatan: "Koordinator Bidang Penelitian", tupoksi: "Mengkoordinasikan kegiatan penelitian dan publikasi" } },
  ]);

  // 1.A.2 - Sumber Pendanaan
  await insertTableData("1.A.2", [
    { rowOrder: 1, rowData: { no: 1, sumber_dana: "Dana Pendanaan Pendidikan (DPP)", jumlah_ts2: 500000000, jumlah_ts1: 550000000, jumlah_ts: 600000000 } },
    { rowOrder: 2, rowData: { no: 2, sumber_dana: "Dana Hibah Penelitian", jumlah_ts2: 100000000, jumlah_ts1: 150000000, jumlah_ts: 200000000 } },
    { rowOrder: 3, rowData: { no: 3, sumber_dana: "Dana Pengabdian Masyarakat", jumlah_ts2: 50000000, jumlah_ts1: 60000000, jumlah_ts: 75000000 } },
  ]);

  // 1.A.3 - Penggunaan Dana
  await insertTableData("1.A.3", [
    { rowOrder: 1, rowData: { no: 1, jenis_penggunaan: "Gaji Dosen & Tendik", jumlah_ts2: 300000000, jumlah_ts1: 320000000, jumlah_ts: 350000000 } },
    { rowOrder: 2, rowData: { no: 2, jenis_penggunaan: "Operasional Pendidikan", jumlah_ts2: 150000000, jumlah_ts1: 170000000, jumlah_ts: 180000000 } },
    { rowOrder: 3, rowData: { no: 3, jenis_penggunaan: "Pengembangan Penelitian", jumlah_ts2: 80000000, jumlah_ts1: 100000000, jumlah_ts: 120000000 } },
    { rowOrder: 4, rowData: { no: 4, jenis_penggunaan: "Infrastruktur & Peralatan", jumlah_ts2: 70000000, jumlah_ts1: 80000000, jumlah_ts: 95000000 } },
  ]);

  // 1.A.5 - Kualifikasi Tendik
  await insertTableData("1.A.5", [
    { rowOrder: 1, rowData: { no: 1, jenis_tendik: "Admin Akademik", jumlah: 2, kualifikasi: "S1", unit_kerja: "Bagian Akademik" } },
    { rowOrder: 2, rowData: { no: 2, jenis_tendik: "Teknisi Lab", jumlah: 3, kualifikasi: "D3/S1", unit_kerja: "Lab Komputer" } },
    { rowOrder: 3, rowData: { no: 3, jenis_tendik: "Admin Keuangan", jumlah: 1, kualifikasi: "S1", unit_kerja: "Bagian Keuangan" } },
    { rowOrder: 4, rowData: { no: 4, jenis_tendik: "Pustakawan", jumlah: 1, kualifikasi: "S1", unit_kerja: "Perpustakaan" } },
  ]);

  // 2.A.2 - Keragaman Asal Mahasiswa
  await insertTableData("2.A.2", [
    { rowOrder: 1, rowData: { asalMahasiswa: "Aceh", nominal: 85, linkBukti: "https://pmbmandiri.ubbg.ac.id" } },
    { rowOrder: 2, rowData: { asalMahasiswa: "Sumatera Utara", nominal: 12, linkBukti: "https://pmbmandiri.ubbg.ac.id" } },
    { rowOrder: 3, rowData: { asalMahasiswa: "Sumatera Barat", nominal: 5, linkBukti: "https://pmbmandiri.ubbg.ac.id" } },
    { rowOrder: 4, rowData: { asalMahasiswa: "Riau", nominal: 3, linkBukti: "https://pmbmandiri.ubbg.ac.id" } },
    { rowOrder: 5, rowData: { asalMahasiswa: "Lainnya", nominal: 5, linkBukti: "https://pmbmandiri.ubbg.ac.id" } },
  ]);

  // 2.A.3 - Kondisi Jumlah Mahasiswa
  await insertTableData("2.A.3", [
    { rowOrder: 1, rowData: { kategori: "Total Mahasiswa Aktif", nominal: 110 } },
    { rowOrder: 2, rowData: { kategori: "Mahasiswa Lulus TS", nominal: 25 } },
    { rowOrder: 3, rowData: { kategori: "Mahasiswa Baru TS", nominal: 30 } },
  ]);

  // 2.B.1 - Isi Pembelajaran (sample MK)
  await insertTableData("2.B.1", [
    { rowOrder: 1, rowData: { kodeMk: "IK101", namaMk: "Algoritma dan Pemrograman", semester: 1, sks: 4, pl01: true, pl02: true, pl03: false, pl04: false, pl05: false } },
    { rowOrder: 2, rowData: { kodeMk: "IK102", namaMk: "Struktur Data", semester: 2, sks: 4, pl01: true, pl02: true, pl03: false, pl04: false, pl05: false } },
    { rowOrder: 3, rowData: { kodeMk: "IK201", namaMk: "Basis Data", semester: 3, sks: 3, pl01: true, pl02: false, pl03: true, pl04: false, pl05: false } },
    { rowOrder: 4, rowData: { kodeMk: "IK301", namaMk: "Machine Learning", semester: 5, sks: 3, pl01: false, pl02: true, pl03: false, pl04: true, pl05: true } },
    { rowOrder: 5, rowData: { kodeMk: "IK401", namaMk: "Skripsi", semester: 8, sks: 6, pl01: true, pl02: true, pl03: true, pl04: true, pl05: true } },
  ]);

  console.log("\n🎉 Data BAB 1 & 2 berhasil diinsert!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
