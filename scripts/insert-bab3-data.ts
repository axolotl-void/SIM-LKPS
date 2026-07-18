/**
 * Script untuk insert sample data tabel BAB 3
 * Run: npx tsx scripts/insert-bab3-data.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function insertTableData(tabelKode: string, rowsData: any[]) {
  const def = await db.tabelDefinition.findUnique({ where: { kode: tabelKode } });
  if (!def) { console.error(`❌ Tabel ${tabelKode} not found`); return false; }

  const ta = await db.tahunAkademik.findFirst({ where: { isActive: true } });
  if (!ta) { console.error("❌ Tahun Akademik not found"); return false; }

  // Delete existing
  const existing = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: ta.id } },
  });
  if (existing) {
    await db.tabelLkpsRow.deleteMany({ where: { tabelLkpsId: existing.id } });
    await db.tabelLkps.delete({ where: { id: existing.id } });
  }

  // Create
  const tabelLkps = await db.tabelLkps.create({
    data: { tabelDefinitionId: def.id, tahunAkademikId: ta.id, status: "DRAFT" },
  });

  for (const row of rowsData) {
    await db.tabelLkpsRow.create({
      data: { tabelLkpsId: tabelLkps.id, rowOrder: row.rowOrder, rowData: row.rowData },
    });
  }

  console.log(`✅ ${tabelKode}: ${rowsData.length} rows inserted`);
  return true;
}

async function main() {
  console.log("📊 Inserting sample data for BAB 3...\n");

  // 3.A.1 - Sarana dan Prasarana Penelitian
  await insertTableData("3.A.1", [
    { rowOrder: 1, rowData: { jenis: "Lab Komputer", jumlah: 3, kondisi: "Baik", kapasitas: 40, linkBukti: "https://lab.ubbg.ac.id" } },
    { rowOrder: 2, rowData: { jenis: "Lab Jaringan", jumlah: 1, kondisi: "Baik", kapasitas: 30, linkBukti: "https://lab.ubbg.ac.id" } },
    { rowOrder: 3, rowData: { jenis: "Lab AI & Data Science", jumlah: 1, kondisi: "Baik", kapasitas: 25, linkBukti: "https://lab.ubbg.ac.id" } },
    { rowOrder: 4, rowData: { jenis: "Ruang Server", jumlah: 1, kondisi: "Baik", kapasitas: 10, linkBukti: "https://server.ubbg.ac.id" } },
    { rowOrder: 5, rowData: { jenis: "Perangkat IoT", jumlah: 20, kondisi: "Baik", kapasitas: 0, linkBukti: "https://iot.ubbg.ac.id" } },
  ]);

  // 3.A.2 - Penelitian DTPR (already inserted)
  await insertTableData("3.A.2", [
    { rowOrder: 1, rowData: { tahun: "TS", namaDtpr: "Dr. Muhammad Ali, M.Kom.", judulPenelitian: "Pengembangan Sistem Informasi Akademik Berbasis AI untuk Universitas di Aceh", jumlahMahasiswa: 4, jenisHibah: "N", durasi: 2, danaTs2: 50, danaTs1: 75, danaTs: 100, linkBukti: "https://simlitabmas.ristekbrin.go.id/hibah/12345" } },
    { rowOrder: 2, rowData: { tahun: "TS", namaDtpr: "Dr. Siti Aminah, M.Sc.", judulPenelitian: "Implementasi Machine Learning untuk Prediksi Kelulusan Mahasiswa", jumlahMahasiswa: 3, jenisHibah: "I", durasi: 3, danaTs2: 80, danaTs1: 120, danaTs: 150, linkBukti: "https://simlitabmas.ristekbrin.go.id/hibah/67890" } },
    { rowOrder: 3, rowData: { tahun: "TS", namaDtpr: "Ir. Budi Santoso, M.T.", judulPenelitian: "Rancang Bangun IoT untuk Smart Farming di Provinsi Aceh", jumlahMahasiswa: 5, jenisHibah: "L", durasi: 1, danaTs2: 20, danaTs1: 25, danaTs: 30, linkBukti: "https://lppm.ubbg.ac.id/penelitian/2024/budi-001" } },
    { rowOrder: 4, rowData: { tahun: "TS", namaDtpr: "Dr. Rina Wijaya, M.Si.", judulPenelitian: "Analisis Big Data untuk Pemetaan Mutu Pendidikan di Aceh", jumlahMahasiswa: 2, jenisHibah: "N", durasi: 2, danaTs2: 40, danaTs1: 60, danaTs: 80, linkBukti: "https://simlitabmas.ristekbrin.go.id/hibah/11223" } },
  ]);

  // 3.A.3 - Pengembangan DTPR
  await insertTableData("3.A.3", [
    { rowOrder: 1, rowData: { tahun: "TS", namaDtpr: "Dr. Muhammad Ali, M.Kom.", jenisPengembangan: "Tugas Belajar S3", linkBukti: "https://lppm.ubbg.ac.id/2024/ali-s3" } },
    { rowOrder: 2, rowData: { tahun: "TS", namaDtpr: "Dr. Siti Aminah, M.Sc.", jenisPengembangan: "Workshop AI Internasional", linkBukti: "https://lppm.ubbg.ac.id/2024/aminah-workshop" } },
    { rowOrder: 3, rowData: { tahun: "TS", namaDtpr: "Ir. Budi Santoso, M.T.", jenisPengembangan: "Seminar IoT Nasional", linkBukti: "https://lppm.ubbg.ac.id/2024/santoso-seminar" } },
  ]);

  // 3.C.1 - Kerjasama Penelitian
  await insertTableData("3.C.1", [
    { rowOrder: 1, rowData: { tahun: "TS", judulKerjasama: "Penelitian Kolaboratif AI", mitraKerja: "Universitas Syiah Kuala", sumber: "N", durasi: 2, danaTs2: 30, danaTs1: 45, danaTs: 60, linkBukti: "https://moa.ubbg.ac.id/2024/ai-usku" } },
    { rowOrder: 2, rowData: { tahun: "TS", judulKerjasama: "Smart City Research", mitraKerja: "Pemda Aceh", sumber: "N", durasi: 3, danaTs2: 50, danaTs1: 70, danaTs: 100, linkBukti: "https://moa.ubbg.ac.id/2024/smartcity" } },
    { rowOrder: 3, rowData: { tahun: "TS", judulKerjasama: "Agricultural IoT", mitraKerja: "FAO Indonesia", sumber: "I", durasi: 2, danaTs2: 100, danaTs1: 150, danaTs: 200, linkBukti: "https://moa.ubbg.ac.id/2024/agrifao" } },
  ]);

  // 3.C.2 - Publikasi Penelitian
  await insertTableData("3.C.2", [
    { rowOrder: 1, rowData: { tahun: "TS", namaDtpr: "Dr. Muhammad Ali, M.Kom.", judulPublikasi: "AI-Based Academic Information System for Higher Education in Indonesia", jenisPublikasi: "IB", linkBukti: "https://doi.org/10.1016/j.eswa.2024.12345" } },
    { rowOrder: 2, rowData: { tahun: "TS", namaDtpr: "Dr. Siti Aminah, M.Sc.", judulPublikasi: "Machine Learning Model for Student Graduation Prediction", jenisPublikasi: "IB", linkBukti: "https://doi.org/10.1016/j.eswa.2024.67890" } },
    { rowOrder: 3, rowData: { tahun: "TS", namaDtpr: "Ir. Budi Santoso, M.T.", judulPublikasi: "IoT Implementation for Smart Farming in Tropical Climate", jenisPublikasi: "S1", linkBukti: "https://sinta.brin.go.id/journal/detail?id=12345" } },
    { rowOrder: 4, rowData: { tahun: "TS", namaDtpr: "Dr. Rina Wijaya, M.Si.", judulPublikasi: "Big Data Analytics for Education Quality Mapping", jenisPublikasi: "S2", linkBukti: "https://sinta.brin.go.id/journal/detail?id=67890" } },
    { rowOrder: 5, rowData: { tahun: "TS", namaDtpr: "Dr. Muhammad Ali, M.Kom.", judulPublikasi: "Cloud Computing Adoption in Indonesian Universities", jenisPublikasi: "I", linkBukti: "https://doi.org/10.1000/xyz123" } },
  ]);

  // 3.C.3 - Perolehan HKI
  await insertTableData("3.C.3", [
    { rowOrder: 1, rowData: { tahun: "TS", judul: "Sistem Informasi Akademik Cerdas (SIA-Cerdas)", jenisHki: "Paten", namaDtpr: "Dr. Muhammad Ali, M.Kom.", linkBukti: "https://hki.brin.go.id/000123" } },
    { rowOrder: 2, rowData: { tahun: "TS", judul: "Aplikasi Prediksi Kelulusan Mahasiswa", jenisHki: "Hak Cipta", namaDtpr: "Dr. Siti Aminah, M.Sc.", linkBukti: "https://hki.brin.go.id/000456" } },
    { rowOrder: 3, rowData: { tahun: "TS", judul: "Prototipe IoT Smart Farming", jenisHki: "Hak Cipta", namaDtpr: "Ir. Budi Santoso, M.T.", linkBukti: "https://hki.brin.go.id/000789" } },
  ]);

  console.log("\n🎉 Semua data BAB 3 berhasil diinsert!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
