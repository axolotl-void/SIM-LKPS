import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed Admin User
  const hashedPassword = await bcrypt.hash("Admin@2026!", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@ubbg.ac.id" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@ubbg.ac.id",
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  // 2. Seed Program Studi
  const prodi = await db.prodi.upsert({
    where: { kode: "55201" },
    update: {},
    create: {
      nama: "Ilmu Komputer",
      jenjang: "S1",
      kode: "55201",
      fakultas: "Fakultas Keguruan dan Ilmu Pendidikan",
    },
  });
  console.log(`  ✅ Prodi: ${prodi.nama} (${prodi.kode})`);

  // 3. Seed Tahun Akademik
  const ta = await db.tahunAkademik.upsert({
    where: {
      tahun_semester_prodiId: {
        tahun: "2024/2025",
        semester: "Ganjil",
        prodiId: prodi.id,
      },
    },
    update: {},
    create: {
      tahun: "2024/2025",
      semester: "Ganjil",
      isActive: true,
      prodiId: prodi.id,
    },
  });
  console.log(`  ✅ Tahun Akademik: ${ta.tahun} ${ta.semester}`);

  // 4. Seed 31 Tabel Definitions
  const tabelDefinitions = [
    // BAB 1 — Tata Pamong
    {
      kode: "1.A.1", bab: 1, urutan: 1,
      nama: "Pimpinan dan Tupoksi UPPS dan PS",
      kolomDefinitions: [
        { key: "no", label: "No", type: "number", required: true },
        { key: "nama", label: "Nama", type: "text", required: true },
        { key: "nidn", label: "NIDN", type: "text", required: true },
        { key: "jabatan", label: "Jabatan", type: "text", required: true },
        { key: "tupoksi", label: "Tupoksi", type: "textarea", required: true },
      ],
    },
    {
      kode: "1.A.2", bab: 1, urutan: 2,
      nama: "Sumber Pendanaan UPPS/PS",
      kolomDefinitions: [
        { key: "no", label: "No", type: "number", required: true },
        { key: "sumber_dana", label: "Sumber Dana", type: "text", required: true },
        { key: "jumlah_ts2", label: "Jumlah (TS-2)", type: "currency", required: true },
        { key: "jumlah_ts1", label: "Jumlah (TS-1)", type: "currency", required: true },
        { key: "jumlah_ts", label: "Jumlah (TS)", type: "currency", required: true },
      ],
    },
    {
      kode: "1.A.3", bab: 1, urutan: 3,
      nama: "Penggunaan Dana UPPS/PS",
      kolomDefinitions: [
        { key: "no", label: "No", type: "number", required: true },
        { key: "jenis_penggunaan", label: "Jenis Penggunaan", type: "text", required: true },
        { key: "jumlah_ts2", label: "Jumlah (TS-2)", type: "currency", required: true },
        { key: "jumlah_ts1", label: "Jumlah (TS-1)", type: "currency", required: true },
        { key: "jumlah_ts", label: "Jumlah (TS)", type: "currency", required: true },
      ],
    },
    {
      kode: "1.A.4", bab: 1, urutan: 4,
      nama: "Rata-rata Beban DTPR per Semester (EWMP) pada TS",
      kolomDefinitions: [
        { key: "no", label: "No", type: "number", required: true },
        { key: "nama_dosen", label: "Nama Dosen", type: "text", required: true },
        { key: "nidn", label: "NIDN", type: "text", required: true },
        { key: "pendidikan", label: "Pendidikan (sks)", type: "number", required: true },
        { key: "penelitian", label: "Penelitian (sks)", type: "number", required: true },
        { key: "pkm", label: "PkM (sks)", type: "number", required: true },
        { key: "tugas_tambahan", label: "Tugas Tambahan (sks)", type: "number", required: false },
        { key: "total", label: "Total (sks)", type: "number", required: true },
      ],
    },
    {
      kode: "1.A.5", bab: 1, urutan: 5,
      nama: "Kualifikasi Tenaga Kependidikan",
      kolomDefinitions: [
        { key: "no", label: "No", type: "number", required: true },
        { key: "jenis_tendik", label: "Jenis Tenaga Kependidikan", type: "text", required: true },
        { key: "jumlah", label: "Jumlah", type: "number", required: true },
        { key: "kualifikasi", label: "Kualifikasi Pendidikan", type: "text", required: true },
        { key: "unit_kerja", label: "Unit Kerja", type: "text", required: true },
      ],
    },
    {
      kode: "1.B", bab: 1, urutan: 6,
      nama: "Unit SPMI dan SDM",
      kolomDefinitions: [
        { key: "no", label: "No", type: "number", required: true },
        { key: "aspek", label: "Aspek", type: "text", required: true },
        { key: "deskripsi", label: "Deskripsi", type: "textarea", required: true },
      ],
    },
    // BAB 2 — Pendidikan
    { kode: "2.A.1", bab: 2, urutan: 1, nama: "Data Mahasiswa", kolomDefinitions: [] },
    { kode: "2.A.2", bab: 2, urutan: 2, nama: "Keragaman Asal Mahasiswa", kolomDefinitions: [] },
    { kode: "2.A.3", bab: 2, urutan: 3, nama: "Kondisi Jumlah Mahasiswa", kolomDefinitions: [] },
    { kode: "2.B.1", bab: 2, urutan: 4, nama: "Isi Pembelajaran", kolomDefinitions: [] },
    { kode: "2.B.2", bab: 2, urutan: 5, nama: "Pemetaan CPL dan Profil Lulusan", kolomDefinitions: [] },
    { kode: "2.B.3", bab: 2, urutan: 6, nama: "Peta Pemenuhan CPL", kolomDefinitions: [] },
    { kode: "2.B.4", bab: 2, urutan: 7, nama: "Rata-rata Masa Tunggu Lulusan", kolomDefinitions: [] },
    { kode: "2.B.5", bab: 2, urutan: 8, nama: "Kesesuaian Bidang Kerja Lulusan", kolomDefinitions: [] },
    { kode: "2.B.6", bab: 2, urutan: 9, nama: "Kepuasan Pengguna Lulusan", kolomDefinitions: [] },
    { kode: "2.C", bab: 2, urutan: 10, nama: "Fleksibilitas Proses Pembelajaran", kolomDefinitions: [] },
    { kode: "2.D", bab: 2, urutan: 11, nama: "Rekognisi dan Apresiasi Kompetensi Lulusan", kolomDefinitions: [] },
    // BAB 3 — Penelitian
    { kode: "3.A.1", bab: 3, urutan: 1, nama: "Sarana dan Prasarana Penelitian", kolomDefinitions: [] },
    { kode: "3.A.2", bab: 3, urutan: 2, nama: "Penelitian DTPR, Hibah, dan Pembiayaan", kolomDefinitions: [] },
    { kode: "3.A.3", bab: 3, urutan: 3, nama: "Pengembangan DTPR di Bidang Penelitian", kolomDefinitions: [] },
    { kode: "3.C.1", bab: 3, urutan: 4, nama: "Kerja Sama Penelitian", kolomDefinitions: [] },
    { kode: "3.C.2", bab: 3, urutan: 5, nama: "Publikasi Penelitian", kolomDefinitions: [] },
    { kode: "3.C.3", bab: 3, urutan: 6, nama: "Perolehan HKI Penelitian", kolomDefinitions: [] },
    // BAB 4 — Pengabdian
    { kode: "4.A.1", bab: 4, urutan: 1, nama: "Sarana dan Prasarana PkM", kolomDefinitions: [] },
    { kode: "4.A.2", bab: 4, urutan: 2, nama: "PkM DTPR, Hibah, dan Pembiayaan", kolomDefinitions: [] },
    { kode: "4.C.1", bab: 4, urutan: 3, nama: "Kerja Sama PkM", kolomDefinitions: [] },
    { kode: "4.C.2", bab: 4, urutan: 4, nama: "Diseminasi Hasil PkM", kolomDefinitions: [] },
    { kode: "4.C.3", bab: 4, urutan: 5, nama: "Perolehan HKI PkM", kolomDefinitions: [] },
    // BAB 5 — Tata Kelola
    { kode: "5.1", bab: 5, urutan: 1, nama: "Sistem Tata Kelola", kolomDefinitions: [] },
    { kode: "5.2", bab: 5, urutan: 2, nama: "Sarana dan Prasarana Pendidikan", kolomDefinitions: [] },
    // BAB 6 — Visi dan Misi
    { kode: "6", bab: 6, urutan: 1, nama: "Kesesuaian Visi dan Misi", kolomDefinitions: [] },
  ];

  for (const def of tabelDefinitions) {
    await db.tabelDefinition.upsert({
      where: { kode: def.kode },
      update: { nama: def.nama, kolomDefinitions: def.kolomDefinitions },
      create: def,
    });
  }
  console.log(`  ✅ Tabel Definitions: ${tabelDefinitions.length} tabel LKPS`);

  console.log("\n🎉 Seeding complete!");
  console.log("   Admin login: admin@ubbg.ac.id / Admin@2026!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
