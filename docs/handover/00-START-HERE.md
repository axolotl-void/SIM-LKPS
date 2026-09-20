# Serah Terima SIM-LKPS

**Sistem Informasi Manajemen Laporan Kinerja Program Studi**
Program Studi Ilmu Komputer — Universitas Bina Bangsa Getsempena

| | |
|---|---|
| **Alamat aplikasi** | https://lkps.zegika.com |
| **Repositori kode** | https://github.com/axolotl-void/SIM-LKPS |
| **Pengembang** | Yogi Prasetya Sadewa |
| **Kontak** | yogiprasetya907@gmail.com · https://yogi.zegika.com |
| **Tanggal dokumen** | 20 September 2026 |
| **Versi aplikasi** | 0.1.0 |

---

## Untuk siapa dokumen ini

Dokumen ini ditulis untuk **tim BTIK** atau siapa pun yang nanti melanjutkan
SIM-LKPS, terutama kalau pengembang aslinya sudah tidak lagi berada di kampus.

Kamu **tidak perlu bisa Node.js untuk memakai dokumen ini.** Sebagian besar
pekerjaan perawatan (mengganti teks, menambah pengguna, mengisi data, mengganti
logo) bisa dilakukan dengan mengikuti langkah-langkah di
[`03-ubah-fitur-ini.md`](./03-ubah-fitur-ini.md) tanpa menulis kode sama sekali.

Bagian yang butuh pemahaman teknis diberi tanda **[BUTUH PROGRAMMER]** supaya
kamu tahu kapan harus memanggil orang yang mengerti Node.js.

---

## Isi dokumen

| Berkas | Isi | Untuk siapa |
|---|---|---|
| **00-START-HERE.md** | Berkas yang sedang kamu baca | Semua |
| **01-cara-menjalankan.md** | Menyalakan aplikasi di komputer sendiri | Staf TI |
| **02-arsitektur.md** | Bagian-bagian sistem dan siapa bicara dengan siapa | Staf TI |
| **03-ubah-fitur-ini.md** | Resep praktis: "mau ubah X, buka mana" | Semua |
| **04-basis-data.md** | Tabel database dan artinya | Staf TI / programmer |
| **05-akun-dan-keamanan.md** | Akun, peran, kata sandi, kunci rahasia | Staf TI |
| **06-operasi-rutin.md** | Pencadangan, pembaruan, penanganan gangguan | Staf TI |
| **07-pertanyaan-lanjutan.md** | Jawaban pertanyaan teknis umum | Programmer |
| **referensi/** | Satu halaman penjelasan per berkas kode (263 berkas) | Programmer |

---

## Tiga menit: apa aplikasi ini

SIM-LKPS dipakai Program Studi Ilmu Komputer untuk menyusun berkas akreditasi.
Di dalamnya ada **tiga bagian besar**, sesuai instrumen akreditasi
**LAM INFOKOM 2.1**:

### 1. LKPS — 32 tabel data

Angka-angka kinerja program studi: jumlah dosen, mahasiswa, kerja sama,
penelitian, pengabdian, dan seterusnya. Dibagi menjadi enam kriteria.

Dibuka di: **Instrumen LKPS** pada menu kiri.

### 2. LED — Laporan Evaluasi Diri

Narasi tertulis. Ada **92 bagian** yang harus diisi, tersusun jadi BAB I sampai
BAB III, mengikuti siklus **PPEPP** (Penetapan, Pelaksanaan, Evaluasi,
Pengendalian, Peningkatan).

Dibuka di: **Instrumen LED** pada menu kiri.

### 3. Matriks Penilaian

Alat hitung mandiri. Ada **82 butir penilaian** dengan bobot total **400 poin**.
Aplikasi bisa memperkirakan status akreditasi (Unggul / Baik Sekali / Baik)
berdasarkan skor yang dimasukkan.

Dibuka di: **Penilaian → Matriks Penilaian** pada menu kiri.

---

## Pengguna dan perannya

Ada tiga jenjang akses:

| Peran | Bisa apa | Tidak bisa apa |
|---|---|---|
| **ADMIN** | Semua: kelola pengguna, data induk, finalisasi penilaian | — |
| **OPERATOR** | Mengisi tabel, menulis narasi LED, mengajukan validasi | Mengelola pengguna, finalisasi penilaian |
| **PIMPINAN** | Melihat semua, menyetujui, memvalidasi, mengunduh laporan | Mengubah isi |

Akun bawaan saat aplikasi dipasang pertama kali:

```
Email    : admin@ubbg.ac.id
Sandi    : SANDI_LAMA_ADMIN_DIHAPUS
```

> **PENTING: ganti kata sandi ini sebelum aplikasi dipakai sungguhan.**
> Caranya ada di [`05-akun-dan-keamanan.md`](./05-akun-dan-keamanan.md).

---

## Bagian mana yang perlu dipanggil programmer

**Bisa dikerjakan staf TI tanpa programmer:**

- Mengganti teks, judul, dan label di halaman
- Mengganti logo dan warna
- Menambah / menghapus pengguna
- Mengisi dan memperbaiki data induk (dosen, mahasiswa, mata kuliah)
- Mencadangkan dan memulihkan data
- Mengubah jumlah tabel atau isi pilihan pada daftar

**Butuh programmer (Node.js):**

- Menambah modul atau halaman baru
- Mengubah cara data dihitung
- Menambah jenis laporan ekspor baru
- Memperbarui ke versi kerangka kerja yang lebih baru
- Memperbaiki kesalahan pada halaman yang tidak bisa dibuka

**Butuh orang yang paham server:**

- Mengubah nama domain
- Memindahkan database ke server kampus
- Mengatur ulang penyimpanan berkas bukti

---

## Kalau pengembang sudah tidak ada

Tiga hal yang membuat aplikasi ini bisa dilanjutkan tanpa pengembang aslinya:

1. **Kodenya terbuka dan terdokumentasi.** Repositori GitHub bisa diakses
   siapa pun yang diberi izin. Setiap berkas kode punya halaman penjelasan di
   folder `referensi/`.

2. **Tidak ada layanan berbayar rahasia.** Aplikasi hanya memakai layanan yang
   akunnya bisa dipindahkan: Vercel (hosting), Neon (database), Cloudflare R2
   (penyimpanan berkas). Semuanya bisa didaftarkan ulang dengan email kampus.

3. **Data bisa diambil kapan saja.** Isi database bisa diekspor ke berkas
   standar (Excel/CSV) tanpa perlu aplikasi ini hidup.

> **Tindakan yang disarankan kampus:** segera setelah dokumen ini diserahkan,
> pindahkan kepemilikan akun Vercel, Neon, dan Cloudflare ke **email resmi
> program studi atau universitas** — bukan email pribadi mahasiswa. Caranya ada
> di [`05-akun-dan-keamanan.md`](./05-akun-dan-keamanan.md).

---

## Peta cepat berkas kode

Untuk gambaran besar, ini urutan berkas dari yang paling sering perlu diubah:

| Mau ubah apa | Berkas |
|---|---|
| Tampilan menu kiri | `components/layout/sidebar.tsx` |
| Nama dan logo aplikasi | `components/layout/header.tsx` |
| Halaman muka (dasbor) | `app/(dashboard)/dashboard/page.tsx` |
| Isi tabel LKPS | `components/tables/tabel-<kode>-client.tsx` |
| Aturan izin per peran | `lib/utils/permissions.ts` |
| Susunan kolom tabel database | `prisma/schema.prisma` |
| Daftar 32 tabel LKPS | `prisma/seed.ts` |
| Daftar 92 bagian LED | `prisma/seed-data/led-bagian.json` |
| Kalimat pesan galat | dicari langsung dengan `grep` |

Penjelasan lengkap tiap baris di tabel ini ada di `referensi/` dan
`03-ubah-fitur-ini.md`.

---

## Istilah yang dipakai

Supaya tidak bingung saat membaca dokumen lain atau berkomunikasi dengan
programmer:

| Istilah | Artinya |
|---|---|
| **LKPS** | Laporan Kinerja Program Studi — isinya angka |
| **LED** | Laporan Evaluasi Diri — isinya narasi |
| **PPEPP** | Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan |
| **Kriteria** | Kelompok besar instrumen (1 sampai 6) — dulu disebut "BAB" |
| **Butir** | Satuan penilaian terkecil, contoh `2.1.A` |
| **Repo** | Repositori — tempat kode disimpan di GitHub |
| **Deploy** | Proses memindahkan kode ke server supaya bisa diakses publik |
| **Database** | Tempat semua data disimpan |
| **Migrasi** | Perubahan susunan tabel di database |
| **Env / variabel lingkungan** | Pengaturan rahasia (kata sandi database, kunci API) yang tidak ditulis di kode |
| **Server Action** | Kode yang berjalan di server saat pengguna menekan tombol |
| **Client Component** | Kode yang berjalan di browser pengguna |

---

## Mulai dari mana

- Baru pertama kali melihat proyek ini → lanjut ke **01-cara-menjalankan.md**
- Mau langsung mengubah sesuatu → **03-ubah-fitur-ini.md**
- Perlu paham bagian teknisnya → **02-arsitektur.md** lalu **04-basis-data.md**
- Aplikasi sedang bermasalah → **06-operasi-rutin.md**, bagian Penanganan Gangguan
