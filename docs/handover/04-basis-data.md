# Basis Data SIM-LKPS

Semua data aplikasi disimpan di **PostgreSQL**. Saat aplikasi berjalan di
internet, database itu dikelola layanan **Neon**. Saat dijalankan di komputer
sendiri, database itu ada di dalam **Docker**.

Pengelolaan database memakai alat bernama **Prisma**. Alat ini punya satu berkas
penting: `prisma/schema.prisma` — di situ tertulis **semua tabel dan kolom yang
ada di sistem**.

---

> ## ⚠️ BACA INI DULU SEBELUM MENGUBAH TABEL
>
> Proyek ini **tidak memakai sistem migrasi bertahap**. Perubahan susunan tabel
> dilakukan dengan perintah `prisma db push`, yang langsung menyamakan database
> dengan berkas `schema.prisma`.
>
> **Artinya: apa pun yang tidak tertulis di `schema.prisma` akan dihapus.**
>
> Sebelum menjalankan `prisma db push` ke database sungguhan, **selalu
> cadangkan dulu** (lihat [`06-operasi-rutin.md`](./06-operasi-rutin.md)).
>
> Untuk memeriksa apa yang akan terjadi **tanpa benar-benar mengubah apa pun**,
> jalankan dari akar repo:
>
> ```bash
> pnpm prisma migrate diff \
>   --from-schema-datasource prisma/schema.prisma \
>   --to-schema-datamodel prisma/schema.prisma \
>   --script > /tmp/rencana.sql
> ```
>
> Lalu **baca isi `/tmp/rencana.sql`**. Kalau di situ ada tulisan `DROP` atau
> `DELETE`, berhenti dan tanyakan dulu — itu berarti ada data yang akan hilang.

---

## Gambaran: 23 tabel dalam 5 kelompok

| Kelompok | Tabel | Isinya |
|---|---|---|
| **Akun & keamanan** | `User`, `Account`, `Session`, `VerificationToken` | Siapa yang boleh masuk |
| **Data induk** | `Prodi`, `TahunAkademik`, `Dosen`, `Tendik`, `Mahasiswa`, `MataKuliah` | Data acuan yang dipakai berulang |
| **LKPS** | `TabelDefinition`, `TabelLkps`, `TabelLkpsRow` | 32 tabel data angka |
| **LED** | `LedBagian`, `LedIsian`, `LedEvidence` | 92 bagian narasi |
| **Penilaian** | `ButirPenilaian`, `PenilaianSesi`, `SkorPenilaian` | 82 butir dan skornya |
| **Pendukung** | `Evidence`, `ValidationHistory`, `AuditLog`, `Notification` | Berkas bukti, riwayat, catatan |

---

## Kelompok 1 — Akun & keamanan

### `User` — pengguna aplikasi

| Kolom | Isinya |
|---|---|
| `email` | Alamat email untuk masuk (harus unik) |
| `name` | Nama yang tampil |
| `passwordHash` | Kata sandi yang sudah diacak — **tidak pernah disimpan apa adanya** |
| `role` | Peran: `ADMIN`, `OPERATOR`, atau `PIMPINAN` |
| `isActive` | Kalau `false`, tidak bisa masuk |
| `lastLoginAt` | Waktu terakhir masuk |

> **Kata sandi tidak bisa dibaca siapa pun**, termasuk admin. Kalau pengguna
> lupa sandinya, yang bisa dilakukan adalah **mengatur ulang**, bukan melihat.

### `Account`, `Session` — urusan teknis login

Dua tabel ini dipakai otomatis oleh sistem login. **Jangan diubah atau dihapus
isinya** — bisa membuat semua orang terlempar keluar.

---

## Kelompok 2 — Data induk

### `Dosen` — daftar dosen

| Kolom | Isinya |
|---|---|
| `nama` | Nama lengkap beserta gelar |
| `nidn` | Nomor Induk Dosen Nasional (harus angka) |
| `jabatanFungsional` | Asisten Ahli, Lektor, Lektor Kepala, Guru Besar |
| `jenisKelamin` | `L` atau `P` |
| `isActive` | Kalau `false`, tidak muncul di daftar pilihan |

> **Yang penting diketahui:** tabel LKPS **tidak menyimpan hubungan** ke tabel
> dosen. Nama dosen yang dipilih tersimpan sebagai **teks biasa** di dalam isi
> tabel. Artinya:
>
> - Menghapus atau mengubah data dosen **tidak merusak** isian LKPS yang sudah ada
> - Tapi perubahan nama dosen **tidak otomatis** ikut berubah di tabel LKPS

### `Mahasiswa`, `MataKuliah`, `Prodi`, `Tendik`

Struktur serupa. Yang perlu diperhatikan: **`Prodi` hanya berisi satu baris** —
identitas program studi itu sendiri.

### `TahunAkademik` — tahun ajaran

| Kolom | Isinya |
|---|---|
| `tahun` | Contoh: `2025/2026` |
| `semester` | `GANJIL` atau `GENAP` |
| `isActive` | **Hanya satu baris yang boleh `true`** |

> Tahun akademik yang aktif menentukan data mana yang ditampilkan di seluruh
> aplikasi. Salah menandai akan membuat aplikasi terlihat "kosong" padahal
> datanya ada.

---

## Kelompok 3 — Tabel LKPS

Tiga tabel ini bekerja sama:

```
TabelDefinition          TabelLkps                TabelLkpsRow
(apa tabelnya)           (satu tabel milik        (satu baris isian
                         satu tahun akademik)     di dalamnya)

kode: "1.A.1"      ──▶   tabelDefinitionId
nama: "Visi Misi"        tahunAkademikId    ──▶   rowData: { ... }
kolomDefinitions: [...]                            (isinya bebas/bebas)
```

### `TabelDefinition` — daftar 32 tabel

| Kolom | Isinya |
|---|---|
| `kode` | Kode tabel, contoh `1.A.1` |
| `nama` | Nama tabel |
| `kriteria` | Nomor kriteria (1–6) |
| `urutan` | Urutan tampil |
| `kolomDefinitions` | **Susunan kolom tabel, disimpan sebagai data** |
| `deskripsi` | **Kosong semua** — deskripsi sebenarnya ada di berkas halaman |

> **Jumlah barisnya harus 32.** Kalau hitungannya berbeda, jangan buru-buru
> mengira ada yang salah: pernah ada baris nyasar dengan kode `"6"` yang membuat
> hitungannya jadi 33. **Sumber kebenaran adalah `prisma/seed.ts`.**

### `TabelLkpsRow` — isi baris tabel

Kolom `rowData` menyimpan isian dalam bentuk catatan bebas, bukan kolom-kolom
terpisah. Keuntungannya: menambah kolom baru **tidak perlu** mengubah susunan
tabel database.

### `TabelLkps` — status per tabel

Mencatat status pengajuan (`DRAFT`, `DIAJUKAN`, `DISETUJUI`, …) untuk setiap
tabel pada setiap tahun akademik.

---

## Kelompok 4 — LED (narasi)

### `LedBagian` — daftar 92 bagian

| Kolom | Isinya |
|---|---|
| `kode` | Contoh `BAB1.A`, `BAB2.K1.1.A` |
| `bab` | `BAB1`, `BAB2`, atau `BAB3` |
| `judul` | Judul bagian |
| `petunjuk` | Petunjuk pengisian |
| `jenis` | `NARASI`, `KRITERIA`, `SUPLEMEN`, atau `IDENTITAS` |
| `tahapPpepp` | Penetapan / Pelaksanaan / Evaluasi / Pengendalian / Peningkatan |
| `urutan` | Urutan tampil |

Pembagian 92 bagian: **17 bagian umum + 75 butir kriteria**.

Daftar ini berasal dari `prisma/seed-data/led-bagian.json`.

### `LedIsian` — narasi yang ditulis pengguna

| Kolom | Isinya |
|---|---|
| `konten` | Isi narasi (boleh berisi penanda Markdown) |
| `status` | `KOSONG`, `DRAFT`, `LENGKAP`, `DIAJUKAN`, `DISETUJUI` |
| `jumlahKarakter` | Panjang narasi, untuk perhitungan halaman |
| `updatedById` | Siapa terakhir mengubah |

Satu baris `LedIsian` = satu bagian untuk satu tahun akademik.

### `LedEvidence` — berkas bukti per bagian

Menyimpan catatan berkas (nama, ukuran, jenis) dan tautan. Berkas aslinya ada
di penyimpanan terpisah, bukan di database.

---

## Kelompok 5 — Matriks penilaian

### `ButirPenilaian` — daftar 82 butir

| Kolom | Isinya |
|---|---|
| `kode` | Contoh `2.1.A` |
| `kriteria` | Nomor kriteria |
| `elemenPenilaian` | Apa yang dinilai |
| `deskriptor` | Penjelasan tiap tingkat skor |
| `skor1` … `skor4` | Penjelasan skor 1 sampai 4 |
| `syaratUnggul` | Syarat khusus untuk bisa meraih Unggul |
| `bobot` | Bobot butir |
| `jenis` | `INPUT`, `PROSES`, atau `OUTPUT` |

**Dua angka yang harus selalu benar:**

- Jumlah baris = **82**
- Total semua `bobot` = **400**

Kalau salah satu meleset, proses pengisian **gagal dengan sengaja** — itu
memang pengamanan, bukan kerusakan.

> Ada catatan penting soal bobot: dokumen instrumen menulis komposisi
> INPUT/PROSES/OUTPUT sebagai 60,0 / 120,0 / 220,0, tapi penjumlahan butir yang
> sebenarnya menghasilkan **60,5 / 120,0 / 219,5**. Selisih 0,5 itu berasal dari
> butir `1.1.B` yang ditulis berbeda antara tabel rincian dan tabel rekapitulasi
> di dokumen instrumen. Yang dipakai adalah angka yang membuat totalnya tepat
> 400. **Ini keterbatasan dokumen instrumen, bukan kesalahan pengisian data.**

### `PenilaianSesi` dan `SkorPenilaian`

`PenilaianSesi` adalah wadah penilaian untuk satu tahun akademik, dengan status
terkunci atau tidak. `SkorPenilaian` menyimpan skor tiap butir (1–4) beserta
siapa yang menilai.

---

## Kelompok 6 — Pendukung

### `AuditLog` — siapa mengubah apa

| Kolom | Isinya |
|---|---|
| `userId` | Siapa yang mengubah |
| `action` | Jenis tindakan |
| `entity` | Data apa yang diubah |
| `changes` | Rincian sebelum dan sesudah |
| `createdAt` | Kapan |

> Ini jawaban untuk pertanyaan "kok data ini berubah padahal saya tidak
> menyentuhnya". **Ini juga cara membuktikan bahwa perubahan itu sah.**
>
> Perbaikan yang dilakukan **langsung di database tidak tercatat di sini** —
> itulah salah satu alasan memperbaiki lewat aplikasi selalu lebih baik.

### `ValidationHistory` — riwayat persetujuan

Mencatat setiap perpindahan status: dari `DRAFT` ke `DIAJUKAN`, dari `DIAJUKAN`
ke `DISETUJUI`, dan seterusnya — beserta alasan penolakan kalau ada.

### `Notification` — pemberitahuan

Pesan yang muncul di ikon lonceng.

---

## Melihat isi database

### Cara aman — lewat alat bawaan

```bash
pnpm prisma studio
```

Terbuka di browser. Bisa melihat dan mengubah data secara langsung.

> **Hati-hati:** perubahan yang dilakukan di sini **tidak tercatat di AuditLog**
> dan **tidak melewati pemeriksaan izin**. Gunakan hanya untuk melihat, atau
> untuk memperbaiki data yang memang darurat.

### Cara langsung — dengan perintah SQL

Untuk database di Docker:

```bash
docker exec sim-lkps-db psql -U postgres -d sim_lkps -c "select count(*) from dosen;"
```

Ganti `sim_lkps` dengan `sim_lkps_uji` untuk database uji.

---

## Mengisi banyak data sekaligus

Cara tercepat untuk memasukkan banyak baris (misalnya seluruh daftar dosen
kampus) adalah menulis skrip sekali pakai. Contoh pola:

```javascript
// simpan sebagai _isi-dosen.mjs, jalankan, lalu hapus
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const data = [
  { nama: "Nama Dosen, M.Kom.", nidn: "0000000001", jabatanFungsional: "Asisten Ahli", jenisKelamin: "L" },
  // ... tambahkan yang lain
];

for (const d of data) {
  await db.dosen.create({ data: d });
}
console.log(`Selesai: ${data.length} dosen ditambahkan`);
await db.$disconnect();
```

Menjalankannya:

```bash
pnpm tsx _isi-dosen.mjs
```

> **Pastikan `DATABASE_URL` menunjuk ke database yang benar sebelum
> menjalankannya.** Untuk memeriksa tanpa mengubah apa pun, ganti
> `create` menjadi `count`.

> **Jangan mengarang NIDN.** Kalau datanya belum ada di sumber resmi, tinggalkan
> kosong atau tandai dengan jelas. Data ini masuk ke laporan akreditasi dan
> **tidak akan terlihat sebagai data palsu** oleh sistem.

---

## Pencadangan dan pemulihan

### Mencadangkan seluruh database

```bash
docker exec sim-lkps-db pg_dump -U postgres -d sim_lkps > cadangan-$(date +%F).sql
```

Berkas `cadangan-2026-09-20.sql` akan terbentuk. **Simpan di dua tempat
berbeda.**

### Mengembalikan dari cadangan

> ⚠️ **Ini menimpa seluruh data yang ada sekarang.**

```bash
docker exec -i sim-lkps-db psql -U postgres -d sim_lkps < cadangan-2026-09-20.sql
```

### Mencadangkan data lewat aplikasi

Cara ini lebih aman untuk keperluan laporan, karena hasilnya bisa dibuka di
Excel. Buka aplikasi → **Laporan** → unduh Excel.

Untuk data induk (dosen, mahasiswa, mata kuliah), ekspor bisa dilakukan lewat
halaman masing-masing di menu **Master Data**.

---

## Kamus singkatan

| Singkatan | Artinya |
|---|---|
| `id` | Nomor unik setiap baris |
| `createdAt` | Waktu baris dibuat |
| `updatedAt` | Waktu baris terakhir diubah |
| `isActive` | Penanda aktif/tidak |
| `DRAFT` | Masih disusun |
| `DIAJUKAN` | Sudah diajukan, menunggu persetujuan |
| `DISETUJUI` | Sudah disetujui |
| `rowData` | Isian satu baris tabel, disimpan bebas |
| `konten` | Isi narasi |
