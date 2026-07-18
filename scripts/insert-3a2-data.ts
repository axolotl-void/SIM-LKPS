/**
 * Script untuk insert sample data tabel 3.A.2 Penelitian DTPR
 * Run: npx tsx scripts/insert-3a2-data.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("📊 Inserting sample data for 3.A.2...\n");

  // Get prodi
  const prodi = await db.prodi.findUnique({ where: { kode: "55201" } });
  if (!prodi) { console.error("❌ Prodi not found"); return; }
  console.log(`✅ Prodi: ${prodi.nama}`);

  // Get tahun akademik active
  const ta = await db.tahunAkademik.findFirst({
    where: { prodiId: prodi.id, isActive: true },
  });
  if (!ta) { console.error("❌ Tahun Akademik not found"); return; }
  console.log(`✅ Tahun Akademik: ${ta.tahun} ${ta.semester}`);

  // Get tabel definition 3.A.2
  const def = await db.tabelDefinition.findUnique({ where: { kode: "3.A.2" } });
  if (!def) { console.error("❌ Tabel definition 3.A.2 not found"); return; }
  console.log(`✅ Tabel Definition: ${def.kode} - ${def.nama}`);

  // Delete existing data if any
  const existingLkps = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: def.id,
        tahunAkademikId: ta.id,
      },
    },
    include: { rows: true },
  });

  if (existingLkps) {
    console.log("⚠️  Deleting existing data...");
    await db.tabelLkpsRow.deleteMany({ where: { tabelLkpsId: existingLkps.id } });
    await db.tabelLkps.delete({ where: { id: existingLkps.id } });
  }

  // Create TabelLkps instance
  const tabelLkps = await db.tabelLkps.create({
    data: {
      tabelDefinitionId: def.id,
      tahunAkademikId: ta.id,
      status: "DRAFT",
    },
  });
  console.log(`✅ Created TabelLkps: ${tabelLkps.id}`);

  // Create rows
  const rows = [
    {
      id: "sample-3a2-1",
      rowOrder: 1,
      rowData: {
        tahun: "TS",
        namaDtpr: "Dr. Muhammad Ali, M.Kom.",
        judulPenelitian: "Pengembangan Sistem Informasi Akademik Berbasis AI untuk Universitas di Aceh",
        jumlahMahasiswa: 4,
        jenisHibah: "N",
        durasi: 2,
        danaTs2: 50,
        danaTs1: 75,
        danaTs: 100,
        linkBukti: "https://simlitabmas.ristekbrin.go.id/hibah/12345",
      },
    },
    {
      id: "sample-3a2-2",
      rowOrder: 2,
      rowData: {
        tahun: "TS",
        namaDtpr: "Dr. Siti Aminah, M.Sc.",
        judulPenelitian: "Implementasi Machine Learning untuk Prediksi Kelulusan Mahasiswa",
        jumlahMahasiswa: 3,
        jenisHibah: "I",
        durasi: 3,
        danaTs2: 80,
        danaTs1: 120,
        danaTs: 150,
        linkBukti: "https://simlitabmas.ristekbrin.go.id/hibah/67890",
      },
    },
    {
      id: "sample-3a2-3",
      rowOrder: 3,
      rowData: {
        tahun: "TS",
        namaDtpr: "Ir. Budi Santoso, M.T.",
        judulPenelitian: "Rancang Bangun IoT untuk Smart Farming di Provinsi Aceh",
        jumlahMahasiswa: 5,
        jenisHibah: "L",
        durasi: 1,
        danaTs2: 20,
        danaTs1: 25,
        danaTs: 30,
        linkBukti: "https://lppm.ubbg.ac.id/penelitian/2024/budi-001",
      },
    },
    {
      id: "sample-3a2-4",
      rowOrder: 4,
      rowData: {
        tahun: "TS",
        namaDtpr: "Dr. Rina Wijaya, M.Si.",
        judulPenelitian: "Analisis Big Data untuk Pemetaan Mutu Pendidikan di Aceh",
        jumlahMahasiswa: 2,
        jenisHibah: "N",
        durasi: 2,
        danaTs2: 40,
        danaTs1: 60,
        danaTs: 80,
        linkBukti: "https://simlitabmas.ristekbrin.go.id/hibah/11223",
      },
    },
  ];

  for (const row of rows) {
    await db.tabelLkpsRow.create({
      data: {
        tabelLkpsId: tabelLkps.id,
        rowOrder: row.rowOrder,
        rowData: row.rowData,
      },
    });
  }

  console.log(`\n✅ Berhasil insert ${rows.length} data penelitian!`);
  console.log("\n📋 Data:");
  rows.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.rowData.namaDtpr} (${r.rowData.judulPenelitian.substring(0, 40)}...)`);
  });
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
