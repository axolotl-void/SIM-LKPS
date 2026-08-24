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

  // 1b. Seed Operator + Pimpinan users (for E2E test multi-role login)
  const operatorPassword = await bcrypt.hash("Operator@2026!", 12);
  const operator = await db.user.upsert({
    where: { email: "operator@ubbg.ac.id" },
    update: { role: Role.OPERATOR, isActive: true },
    create: {
      name: "Operator LKPS",
      email: "operator@ubbg.ac.id",
      password: operatorPassword,
      role: Role.OPERATOR,
      isActive: true,
    },
  });
  console.log(`  ✅ Operator user: ${operator.email}`);

  const pimpinanPassword = await bcrypt.hash("Pimpinan@2026!", 12);
  const pimpinan = await db.user.upsert({
    where: { email: "pimpinan@ubbg.ac.id" },
    update: { role: Role.PIMPINAN, isActive: true },
    create: {
      name: "Pimpinan Prodi",
      email: "pimpinan@ubbg.ac.id",
      password: pimpinanPassword,
      role: Role.PIMPINAN,
      isActive: true,
    },
  });
  console.log(`  ✅ Pimpinan user: ${pimpinan.email}`);

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
        tahun: "2026/2027",
        semester: "Ganjil",
        prodiId: prodi.id,
      },
    },
    update: {},
    create: {
      tahun: "2026/2027",
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
        { key: "unitKerja", label: "Unit Kerja", type: "text", required: true },
        { key: "namaKetua", label: "Nama Pejabat", type: "text", required: true },
        { key: "periodeJabatan", label: "Periode Jabatan", type: "text", required: true },
        { key: "pendidikanTerakhir", label: "Pendidikan Terakhir", type: "text", required: true },
        { key: "jabatanFungsional", label: "Jabatan Fungsional", type: "text", required: false },
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
        { key: "jenisPenggunaan", label: "Jenis Penggunaan", type: "text", required: true },
        { key: "nominal", label: "Jumlah (jt)", type: "number", required: true },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
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
    {
      kode: "2.A.1", bab: 2, urutan: 1,
      nama: "Data Mahasiswa",
      kolomDefinitions: [
        { key: "ts_label", label: "Tahun", type: "text", required: true },
        { key: "pendaftar", label: "Pendaftar", type: "number", required: true },
        { key: "dayaTampung", label: "Daya Tampung", type: "number", required: true },
        { key: "lulusSeleksi", label: "Lulus Seleksi", type: "number", required: false },
        { key: "mabaRegulerDiterima", label: "Maba Reguler Diterima", type: "number", required: false },
        { key: "mabaRegulerAfirmasi", label: "Maba Reguler Afirmasi", type: "number", required: false },
        { key: "mabaRegulerKhusus", label: "Maba Reguler Khusus", type: "number", required: false },
        { key: "mabaRplDiterima", label: "Maba RPL Diterima", type: "number", required: false },
        { key: "mabaRplAfirmasi", label: "Maba RPL Afirmasi", type: "number", required: false },
        { key: "mabaRplKhusus", label: "Maba RPL Khusus", type: "number", required: false },
        { key: "aktifRegulerJumlah", label: "Aktif Reguler", type: "number", required: false },
        { key: "aktifRegulerAfirmasi", label: "Aktif Reguler Afirmasi", type: "number", required: false },
        { key: "aktifRegulerKhusus", label: "Aktif Reguler Khusus", type: "number", required: false },
        { key: "aktifRplJumlah", label: "Aktif RPL", type: "number", required: false },
        { key: "aktifRplAfirmasi", label: "Aktif RPL Afirmasi", type: "number", required: false },
        { key: "aktifRplKhusus", label: "Aktif RPL Khusus", type: "number", required: false },
        { key: "calonKebutuhanKhusus", label: "Calon Kebutuhan Khusus", type: "number", required: false },
      ],
    },
    {
      kode: "2.A.2", bab: 2, urutan: 2,
      nama: "Keragaman Asal Mahasiswa",
      kolomDefinitions: [
        { key: "asalMahasiswa", label: "Asal Mahasiswa", type: "text", required: true },
        { key: "nominal", label: "Jumlah", type: "number", required: true },
        { key: "linkBukti", label: "Link Bukti", type: "text", required: false },
      ],
    },
    {
      kode: "2.A.3", bab: 2, urutan: 3,
      nama: "Kondisi Jumlah Mahasiswa",
      kolomDefinitions: [
        { key: "kategori", label: "Kategori", type: "text", required: true },
        { key: "nominal", label: "Jumlah", type: "number", required: true },
      ],
    },
    {
      kode: "2.B.1", bab: 2, urutan: 4,
      nama: "Isi Pembelajaran",
      kolomDefinitions: [
        { key: "kodeMk", label: "Kode MK", type: "text", required: true },
        { key: "namaMk", label: "Nama Mata Kuliah", type: "text", required: true },
        { key: "semester", label: "Semester", type: "number", required: true },
        { key: "sks", label: "SKS", type: "number", required: true },
        { key: "pl01", label: "PL01", type: "boolean" },
        { key: "pl02", label: "PL02", type: "boolean" },
        { key: "pl03", label: "PL03", type: "boolean" },
        { key: "pl04", label: "PL04", type: "boolean" },
        { key: "pl05", label: "PL05", type: "boolean" },
      ],
    },
    {
      kode: "2.B.2", bab: 2, urutan: 5,
      nama: "Pemetaan CPL dan Profil Lulusan",
      kolomDefinitions: [
        { key: "kodeCpl", label: "Kode CPL", type: "text", required: true },
        { key: "pl01", label: "PL01", type: "boolean" },
        { key: "pl02", label: "PL02", type: "boolean" },
        { key: "pl03", label: "PL03", type: "boolean" },
        { key: "pl04", label: "PL04", type: "boolean" },
        { key: "pl05", label: "PL05", type: "boolean" },
      ],
    },
    {
      kode: "2.B.3", bab: 2, urutan: 6,
      nama: "Peta Pemenuhan CPL",
      kolomDefinitions: [
        { key: "kodeCpl", label: "Kode CPL", type: "text", required: true },
        { key: "rumusanCpl", label: "Rumusan CPL", type: "textarea", required: true },
        { key: "kodeCpmk", label: "Kode CPMK", type: "text", required: true },
        { key: "rumusanCpmk", label: "Rumusan CPMK", type: "textarea", required: true },
        { key: "mataKuliah", label: "Mata Kuliah (Kode)", type: "text", required: true },
      ],
    },
    {
      kode: "2.B.4", bab: 2, urutan: 7,
      nama: "Rata-rata Masa Tunggu Lulusan",
      kolomDefinitions: [
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "jumlahLulusan", label: "Jumlah Lulusan", type: "number", required: true },
        { key: "jumlahTerlacak", label: "Jumlah Terlacak", type: "number", required: false },
        { key: "rataRata", label: "Rata-rata Masa Tunggu (bulan)", type: "number", required: true },
      ],
    },
    {
      kode: "2.B.5", bab: 2, urutan: 8,
      nama: "Kesesuaian Bidang Kerja Lulusan",
      kolomDefinitions: [
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "jumlahLulusan", label: "Jumlah Lulusan", type: "number", required: true },
        { key: "jumlahTerlacak", label: "Jumlah Terlacak", type: "number", required: false },
        { key: "profesiInfokom", label: "Profesi Infokom", type: "number", required: false },
        { key: "profesiNonInfokom", label: "Profesi Non Infokom", type: "number", required: false },
        { key: "nasional", label: "Nasional", type: "number", required: false },
        { key: "internasional", label: "Internasional", type: "number", required: false },
        { key: "wirausaha", label: "Wirausaha", type: "number", required: false },
      ],
    },
    {
      kode: "2.B.6", bab: 2, urutan: 9,
      nama: "Kepuasan Pengguna Lulusan",
      kolomDefinitions: [
        { key: "labelKemampuan", label: "Aspek Kemampuan", type: "text", required: true },
        { key: "kemampuan", label: "Key", type: "text", required: false },
        { key: "sangatBaik", label: "Sangat Baik (%)", type: "number", required: false },
        { key: "baik", label: "Baik (%)", type: "number", required: false },
        { key: "cukup", label: "Cukup (%)", type: "number", required: false },
        { key: "kurang", label: "Kurang (%)", type: "number", required: false },
        { key: "rencanaTindakLanjut", label: "Rencana Tindak Lanjut", type: "textarea", required: false },
      ],
    },
    {
      kode: "2.C", bab: 2, urutan: 10,
      nama: "Fleksibilitas Proses Pembelajaran",
      kolomDefinitions: [
        { key: "label", label: "Label", type: "text", required: true },
        { key: "key", label: "Key", type: "text", required: false },
        { key: "ts", label: "Jumlah TS", type: "number", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    {
      kode: "2.D", bab: 2, urutan: 11,
      nama: "Rekognisi dan Apresiasi Kompetensi Lulusan",
      kolomDefinitions: [
        { key: "label", label: "Label", type: "text", required: true },
        { key: "key", label: "Key", type: "text", required: false },
        { key: "jenis", label: "Jenis", type: "text", required: false },
        { key: "ts", label: "Jumlah TS", type: "number", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    // BAB 3 — Penelitian
    {
      kode: "3.A.1", bab: 3, urutan: 1,
      nama: "Sarana dan Prasarana Penelitian",
      kolomDefinitions: [
        { key: "namaPrasarana", label: "Nama Prasarana", type: "text", required: true },
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "status", label: "Status (M/W)", type: "select", required: true, options: ["M", "W"] },
        { key: "dayaTampung", label: "Daya Tampung", type: "number", required: false },
        { key: "luasRuang", label: "Luas Ruang (m²)", type: "number", required: false },
        { key: "perangkat", label: "Perangkat", type: "textarea", required: false },
        { key: "publicDomain", label: "Lisensi (P/T)", type: "select", required: false, options: ["P", "T"] },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    {
      kode: "3.A.2", bab: 3, urutan: 2,
      nama: "Penelitian DTPR, Hibah, dan Pembiayaan",
      kolomDefinitions: [
        { key: "namaDtpr", label: "Nama DTPR (Ketua)", type: "text", required: true },
        { key: "judulPenelitian", label: "Judul Penelitian", type: "text", required: true },
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "jumlahMahasiswa", label: "Jumlah Mahasiswa", type: "number", required: false },
        { key: "jenisHibah", label: "Jenis Hibah", type: "select", required: true, options: ["L", "N", "I"] },
        { key: "durasi", label: "Durasi (tahun)", type: "number", required: false },
        { key: "danaTs2", label: "Dana TS-2 (jt)", type: "number", required: false },
        { key: "danaTs1", label: "Dana TS-1 (jt)", type: "number", required: false },
        { key: "danaTs", label: "Dana TS (jt)", type: "number", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    {
      kode: "3.A.3", bab: 3, urutan: 3,
      nama: "Pengembangan DTPR di Bidang Penelitian",
      kolomDefinitions: [
        { key: "namaDtpr", label: "Nama DTPR", type: "text", required: true },
        { key: "jenisPengembangan", label: "Jenis Pengembangan", type: "text", required: true },
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    {
      kode: "3.C.1", bab: 3, urutan: 4,
      nama: "Kerja Sama Penelitian",
      kolomDefinitions: [
        { key: "judulKerjasama", label: "Judul Kerjasama", type: "text", required: true },
        { key: "mitraKerja", label: "Mitra Kerja", type: "text", required: true },
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "sumber", label: "Sumber Dana", type: "select", required: true, options: ["L", "N", "I"] },
        { key: "durasi", label: "Durasi (tahun)", type: "number", required: false },
        { key: "danaTs2", label: "Dana TS-2 (jt)", type: "number", required: false },
        { key: "danaTs1", label: "Dana TS-1 (jt)", type: "number", required: false },
        { key: "danaTs", label: "Dana TS (jt)", type: "number", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    {
      kode: "3.C.2", bab: 3, urutan: 5,
      nama: "Publikasi Penelitian",
      kolomDefinitions: [
        { key: "namaDtpr", label: "Nama DTPR", type: "text", required: true },
        { key: "judulPublikasi", label: "Judul Publikasi", type: "text", required: true },
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "jenisPublikasi", label: "Jenis Publikasi", type: "select", required: true, options: ["S1", "S2", "S3", "Prosiding"] },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    {
      kode: "3.C.3", bab: 3, urutan: 6,
      nama: "Perolehan HKI Penelitian",
      kolomDefinitions: [
        { key: "namaDtpr", label: "Nama DTPR", type: "text", required: true },
        { key: "judul", label: "Judul HKI", type: "text", required: true },
        { key: "jenisHki", label: "Jenis HKI", type: "text", required: true },
        { key: "tahun", label: "Tahun", type: "text", required: true },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    // BAB 4 — Pengabdian
    { kode: "4.A.1", bab: 4, urutan: 1, nama: "Sarana dan Prasarana PkM",
      kolomDefinitions: [
        { key: "namaPrasarana", label: "Nama Prasarana", type: "text", required: true },
        { key: "dayaTampung", label: "Daya Tampung", type: "number", required: false },
        { key: "luasRuang", label: "Luas Ruang (m²)", type: "number", required: false },
        { key: "status", label: "Kepemilikan (M/W)", type: "select", required: true, options: ["M", "W"] },
        { key: "publicDomain", label: "Lisensi (P/T)", type: "select", required: false, options: ["P", "T"] },
        { key: "perangkat", label: "Perangkat", type: "textarea", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    { kode: "4.A.2", bab: 4, urutan: 2, nama: "PkM DTPR, Hibah, dan Pembiayaan",
      kolomDefinitions: [
        { key: "namaDtpr", label: "Nama DTPR (Ketua)", type: "text", required: true },
        { key: "judulPkm", label: "Judul PkM", type: "text", required: true },
        { key: "jumlahMahasiswa", label: "Jumlah Mahasiswa Terlibat", type: "number", required: false },
        { key: "jenisHibah", label: "Jenis Hibah", type: "select", required: true, options: ["L", "N", "I"] },
        { key: "durasi", label: "Durasi (tahun)", type: "number", required: false },
        { key: "danaTs2", label: "Dana TS-2 (jt)", type: "number", required: false },
        { key: "danaTs1", label: "Dana TS-1 (jt)", type: "number", required: false },
        { key: "danaTs", label: "Dana TS (jt)", type: "number", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    { kode: "4.C.1", bab: 4, urutan: 3, nama: "Kerja Sama PkM",
      kolomDefinitions: [
        { key: "judulKerjasama", label: "Judul Kerjasama", type: "text", required: true },
        { key: "mitraKerja", label: "Mitra Kerja", type: "text", required: true },
        { key: "sumber", label: "Sumber Dana", type: "select", required: true, options: ["L", "N", "I"] },
        { key: "durasi", label: "Durasi (tahun)", type: "number", required: false },
        { key: "danaTs2", label: "Dana TS-2 (jt)", type: "number", required: false },
        { key: "danaTs1", label: "Dana TS-1 (jt)", type: "number", required: false },
        { key: "danaTs", label: "Dana TS (jt)", type: "number", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    { kode: "4.C.2", bab: 4, urutan: 4, nama: "Diseminasi Hasil PkM",
      kolomDefinitions: [
        { key: "namaDtpr", label: "Nama DTPR (Ketua)", type: "text", required: true },
        { key: "judul", label: "Judul", type: "text", required: true },
        { key: "diseminasi", label: "Diseminasi Hasil PkM", type: "select", required: true, options: ["L", "N", "I"] },
        { key: "ts2", label: "TS-2", type: "number", required: false },
        { key: "ts1", label: "TS-1", type: "number", required: false },
        { key: "ts", label: "TS", type: "number", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    { kode: "4.C.3", bab: 4, urutan: 5, nama: "Perolehan HKI PkM",
      kolomDefinitions: [
        { key: "judul", label: "Judul HKI", type: "text", required: true },
        { key: "jenisHki", label: "Jenis HKI", type: "text", required: true },
        { key: "namaDtpr", label: "Nama DTPR", type: "text", required: true },
        { key: "ts2", label: "Tahun Perolehan TS-2", type: "checkbox", required: false },
        { key: "ts1", label: "Tahun Perolehan TS-1", type: "checkbox", required: false },
        { key: "ts", label: "Tahun Perolehan TS", type: "checkbox", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    // BAB 5 — Tata Kelola
    { kode: "5.1", bab: 5, urutan: 1, nama: "Sistem Tata Kelola",
      kolomDefinitions: [
        { key: "jenisTataKelola", label: "Jenis Tata Kelola", type: "text", required: true },
        { key: "namaSistem", label: "Nama Sistem Informasi", type: "text", required: true },
        { key: "akses", label: "Akses", type: "select", required: true, options: ["Lokal", "Internet"] },
        { key: "unitPengelola", label: "Unit Kerja/SDM Pengelola", type: "text", required: true },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    { kode: "5.2", bab: 5, urutan: 2, nama: "Sarana dan Prasarana Pendidikan",
      kolomDefinitions: [
        { key: "namaPrasarana", label: "Nama Prasarana", type: "text", required: true },
        { key: "dayaTampung", label: "Daya Tampung", type: "number", required: false },
        { key: "luasRuang", label: "Luas Ruang (m²)", type: "number", required: false },
        { key: "status", label: "Kepemilikan (M/W)", type: "select", required: true, options: ["M", "W"] },
        { key: "publicDomain", label: "Lisensi (P/T)", type: "select", required: false, options: ["P", "T"] },
        { key: "perangkat", label: "Perangkat", type: "textarea", required: false },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    // BAB 6 — Visi dan Misi
    { kode: "6.1", bab: 6, urutan: 1, nama: "Visi Misi Tujuan",
      kolomDefinitions: [
        { key: "kategori", label: "Kategori", type: "select", required: true, options: ["VISI", "MISI"] },
        { key: "pt", label: "Perguruan Tinggi (PT)", type: "textarea", required: true },
        { key: "upps", label: "Fakultas (UPPS)", type: "textarea", required: true },
        { key: "ps", label: "Program Studi (PS)", type: "textarea", required: true },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
    { kode: "6.2", bab: 6, urutan: 2, nama: "Strategi Pencapaian",
      kolomDefinitions: [
        { key: "nomor", label: "No", type: "number", required: true },
        { key: "strategi", label: "Strategi Pencapaian", type: "textarea", required: true },
        { key: "sasaran", label: "Sasaran", type: "textarea", required: true },
        { key: "indikator", label: "Indikator Kinerja", type: "textarea", required: true },
        { key: "target", label: "Target", type: "text", required: true },
        { key: "linkBukti", label: "Link Bukti", type: "url", required: false },
      ],
    },
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
