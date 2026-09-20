<!-- =========================================================== -->
<!-- BERKAS INI DIHASILKAN OTOMATIS — JANGAN DISUNTING LANGSUNG  -->
<!-- Ubah kode, lalu jalankan: node scripts/generate-readme.mjs    -->
<!-- Teks naratif ada di: scripts/readme/narasi.mjs               -->
<!-- =========================================================== -->

<p align="center">
  <img src=".github/assets/banner.svg" alt="SIM-LKPS" width="100%">
</p>

<p align="center">
  <strong>Sistem Informasi Manajemen Laporan Kinerja Program Studi</strong><br>
  Aplikasi web untuk 32 tabel LKPS, LED, dan Matriks Penilaian<br>
  Program Studi Ilmu Komputer — Universitas Bina Bangsa Getsempena
</p>

<p align="center">
  <a href="#daftar-isi">Daftar Isi</a> ·
  <a href="docs/handover/00-START-HERE.md">Panduan Serah Terima</a> ·
  <a href="https://github.com/axolotl-void/SIM-LKPS/issues">Laporkan Masalah</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma 6">
  <img src="https://img.shields.io/badge/Auth.js-000?logo=auth.js&logoColor=white" alt="Auth.js v5">
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind 4">
  <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare R2">
  <img src="https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white" alt="Vercel">
</p>

<br>

> **Catatan tentang berkas ini.** README ini dihasilkan dari kode yang
> benar-benar ada di repo. Angka, nama kolom, daftar halaman, dan daftar
> komponen di sini dihitung langsung dari sumbernya, bukan ditulis manual.
> Kalau kode berubah, jalankan `node scripts/generate-readme.mjs`.

> **Untuk tim kampus.** Kalau kamu baru pertama kali membuka proyek ini dan
> bukan programmer, mulai dari **[Panduan Serah Terima](docs/handover/00-START-HERE.md)**
> — bahasanya lebih sederhana dan urutannya jelas.

---

<a id="daftar-isi"></a>

## Daftar Isi


| # | Bab | Isinya |
|---|---|---|
| 1 | [Pengenalan](#1-pengenalan) | Aplikasi ini untuk apa dan masalah apa yang diselesaikan |
| 2 | [Ikhtisar Sistem](#2-ikhtisar-sistem) | Tiga modul utama dan bagaimana mereka terhubung |
| 3 | [Arsitektur](#3-arsitektur) | Bagian-bagian sistem, alur permintaan, dan alasan tiap keputusan |
| 4 | [Teknologi yang Dipakai](#4-teknologi-yang-dipakai) | Setiap pustaka, versinya, dan kenapa dipilih |
| 5 | [Struktur Folder](#5-struktur-folder) | Peta seluruh folder dan berkas di proyek |
| 6 | [Daftar Tabel LKPS](#6-daftar-tabel-lkps) | Seluruh 32 tabel LKPS beserta 202 kolomnya — apa yang harus diisi di tiap kolom |
| 7 | [Format Isian dan Tipe Kolom](#7-format-isian-dan-tipe-kolom) | Arti tiap tipe kolom, cara pengisiannya, dan kesalahan yang sering terjadi |
| 8 | [Skema Basis Data](#8-skema-basis-data) | Seluruh 23 tabel beserta 200 kolom datanya, apa artinya, dan bagaimana berhubungan |
| 9 | [Referensi Halaman](#9-referensi-halaman) | Seluruh 73 halaman: alamat, berkas, data yang diambil, dan komponennya |
| 10 | [API dan Server Action](#10-api-dan-server-action) | 9 titik akhir API dan 9 berkas server action |
| 11 | [Referensi Komponen](#11-referensi-komponen) | Seluruh 68 komponen tampilan, dikelompokkan per folder |
| 12 | [Modul LED](#12-modul-led) | Seluruh 92 bagian narasi, susunannya, dan cara dokumen dihasilkan |
| 13 | [Rincian Tiap Bagian LED](#13-rincian-tiap-bagian-led) | Susunan 92 bagian dari tiga bab LED, beserta batas halamannya |
| 14 | [Modul Matriks Penilaian](#14-modul-matriks-penilaian) | Rumus perhitungan dan seluruh 82 butir beserta bobotnya |
| 15 | [Penjelasan Lengkap Tiap Butir Penilaian](#15-penjelasan-lengkap-tiap-butir-penilaian) | Deskriptor dan keempat tingkat skor untuk seluruh 82 butir — dipakai saat menilai |
| 16 | [Pustaka Internal](#16-pustaka-internal) | 37 berkas di folder lib/: perkakas, hitungan, dan penyusun dokumen |
| 17 | [Panduan Pengembangan](#17-panduan-pengembangan) | Perintah, konvensi penamaan, dan cara menambah fitur |
| 18 | [Pengujian](#18-pengujian) | Dua lapis pengujian dan apa saja yang ditutup |
| 19 | [Deploy dan Operasi](#19-deploy-dan-operasi) | Menaikkan perubahan, memantau, dan merawat |
| 20 | [Pemecahan Masalah](#20-pemecahan-masalah) | Gejala, sebab, dan penanganan — dari kejadian nyata |
| 21 | [Konvensi dan Aturan Tetap](#21-konvensi-dan-aturan-tetap) | Aturan yang tidak boleh dilanggar beserta alasannya |
| 22 | [Utang Teknis](#22-utang-teknis) | Yang belum beres, disertai alamat berkasnya |
| 23 | [Indeks Seluruh Berkas](#23-indeks-seluruh-berkas) | Peta semua berkas: mana dijelaskan di bab mana |
| 24 | [Penutup](#24-penutup) | Ringkasan angka dan cara menjaga dokumen ini tetap benar |
**Ringkasan angka:**

- `23` tabel database · `200` kolom · `7` pilihan nilai tetap
- `32` tabel LKPS · `92` bagian LED · `82` butir penilaian (bobot 400)
- `73` halaman · `9` titik akhir API · `68` komponen

---

<a id="1-pengenalan"></a>

## 1. Pengenalan

Aplikasi ini untuk apa dan masalah apa yang diselesaikan

SIM-LKPS adalah aplikasi web untuk menyusun **Laporan Kinerja Program Studi (LKPS)**
dan **Laporan Evaluasi Diri (LED)** — dua dokumen yang wajib disiapkan program
studi saat mengajukan akreditasi.

Aplikasi ini dipakai di Program Studi Ilmu Komputer, Universitas Bina Bangsa
Getsempena, mengikuti instrumen **LAM INFOKOM 2.1**.

### Masalah yang diselesaikan

Sebelum ada aplikasi ini, penyusunan LKPS dan LED dikerjakan dengan cara yang
rapuh:

- **Berkas Excel tersebar.** Tiap kriteria punya berkasnya sendiri, sering
  berupa salinan yang diedit bergantian. Tidak ada yang tahu versi mana yang
  terbaru.
- **Penomoran tabel mudah kacau.** Instrumen memakai kode berlapis seperti
  `2.B.3`. Menyalin baris antar berkas mudah membuat kode dan isinya tidak lagi
  sepadan.
- **Riwayat perubahan hilang.** Kalau sebuah angka berubah, tidak ada catatan
  siapa yang mengubah, kapan, dan dari nilai berapa. Saat asesor menanyakan
  dasar sebuah angka, jawabannya sering hanya "yang mengisi sudah lulus".
- **Berkas bukti terpisah dari datanya.** Dokumen pendukung disimpan di folder
  sendiri, sehingga sulit memastikan tabel mana yang belum punya bukti.
- **Narasi LED dan tabel LKPS tidak terhubung.** Padahal keduanya menceritakan
  hal yang sama dari sudut berbeda — satu dengan angka, satu dengan penjelasan.

Aplikasi ini menyatukan semuanya: data, narasi, bukti, riwayat, dan hasil ekspor
dalam satu tempat.

### Dua dokumen yang dikelola

**LKPS — Laporan Kinerja Program Studi.** Berisi angka. Terdiri dari 32 tabel
yang dikelompokkan ke dalam enam kriteria. Contoh isinya: profil dosen, kegiatan
pendidikan, penelitian, pengabdian, kerja sama. Inilah bagian "apa yang sudah
dilakukan".

**LED — Laporan Evaluasi Diri.** Berisi narasi. Terdiri dari 92 bagian yang
tersusun sebagai BAB I sampai BAB III, mengikuti siklus **PPEPP**
(Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan). Inilah bagian
"sejauh mana capaiannya dan apa yang diperbaiki".

Keduanya diatur juga oleh **Matriks Penilaian** berisi 82 butir dengan bobot
total 400, yang dipakai untuk menghitung capaian dan memperkirakan peringkat
akreditasi.

### Untuk siapa aplikasi ini

| Pemakai | Kebutuhan utama |
|---|---|
| **Operator LKPS** | Mengisi tabel, menulis narasi, mengunggah bukti |
| **Pimpinan prodi** | Melihat capaian, memvalidasi, mengunduh laporan |
| **Administrator** | Mengelola pengguna, data induk, dan pengaturan tahun akademik |
| **Asesor / penguji** | Membaca laporan hasil ekspor |

### Batasan yang disengaja

Beberapa hal sengaja **tidak** dikerjakan, dan itu perlu diketahui sebelum
mengusulkan penambahan:

- **Tidak ada mode luring.** Aplikasi butuh sambungan internet. Sinkronisasi
  luring akan jauh lebih rumit daripada manfaatnya untuk pemakaian di kampus.
- **Tidak ada penyuntingan bersamaan secara langsung.** Kalau dua orang membuka
  tabel yang sama, yang menyimpan terakhir menang. Untuk tim kecil ini memadai.
- **Tidak ada tanda tangan digital.** Pengesahan tetap dilakukan dengan tanda
  tangan basah pada hasil cetak.
- **Tidak terhubung ke PDDIKTI.** Pengisian tetap manual; integrasi otomatis
  belum diperlukan.


---

<a id="2-ikhtisar-sistem"></a>

## 2. Ikhtisar Sistem

Tiga modul utama dan bagaimana mereka terhubung

### Tiga modul utama

Aplikasi terbagi menjadi tiga modul yang bisa dipakai berdiri sendiri, tetapi
saling melengkapi.

#### LKPS — data angka (32 tabel)

Ini modul paling awal dan paling banyak dipakai. Tiap tabel menempati halaman
sendiri dengan alamat yang kodenya sesuai instrumen, misalnya
`/lkps/kriteria-2/tabel-2b3`. Isinya baris demi baris yang bisa ditambah,
diubah, dan dihapus.

Tiap tabel punya **kolom sendiri** yang berbeda-beda. Kolom itulah yang
menentukan apa yang boleh diisi — dan karena tiap tabel berbeda, komponen
tampilannya pun dibuat terpisah. Pilihan ini dijelaskan di bab 18.

Satu tabel melewati **alur status berjenjang**:

```
DRAFT ──ajukan──▶ DIAJUKAN ──setujui──▶ DISETUJUI
                     │
                     ├──tolak──▶ DITOLAK ──perbaiki──┐
                     │                               │
                     └──revisi─▶ DIREVISI ───────────┘
```

Setiap perpindahan status dicatat, termasuk siapa yang melakukannya dan
komentarnya.

#### LED — narasi (92 bagian)

Modul ini mengelola dokumen naratif. Tiap bagian punya editor teks dengan
pratinjau, dan beberapa bagian punya batas halaman sesuai ketentuan instrumen.

Narasi disimpan dalam format Markdown sederhana, lalu diubah menjadi dokumen
Word atau PDF dengan tata letak sesuai **Lampiran 2** instrumen: kertas A4,
huruf Arial 11, spasi 1,15.

#### Matriks Penilaian (82 butir)

Modul ini menghitung capaian. Tiap butir punya empat tingkat skor beserta
deskriptornya, dan bobotnya sendiri. Nilai akhir dihitung dengan rumus:

```
nilai = Σ (skor butir × bobot butir) / 4
```

Hasilnya dipetakan ke peringkat akreditasi. Karena angka ini menentukan, ada
**kunci finalisasi** — setelah difinalkan, nilai tidak bisa diubah lagi.

### Bagaimana ketiganya terhubung

```
       32 tabel LKPS                 92 bagian LED
      (angka terukur)               (narasi penjelasan)
             │                              │
             └──────────┬───────────────────┘
                        ▼
              82 butir penilaian
             (menghitung capaian)
                        │
                        ▼
              Skor → Peringkat akreditasi
```

Idealnya isi LED merujuk ke angka di tabel LKPS, dan penilaian merujuk ke
keduanya. Aplikasi menyediakan tempat untuk semuanya dalam satu sistem, supaya
rujukan itu tidak terputus.


---

<a id="3-arsitektur"></a>

## 3. Arsitektur

Bagian-bagian sistem, alur permintaan, dan alasan tiap keputusan

### Bentuk umum

Aplikasi ini adalah aplikasi web biasa dengan arsitektur tiga lapis:

```
┌─────────────────────────────────────────────────────────────┐
│  PERAMBAN                                                   │
│  Halaman React yang sudah dirender + potongan interaktif     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  VERCEL — menjalankan Next.js 15                            │
│                                                             │
│  • Server Component   menyiapkan data sebelum halaman dikirim│
│  • Server Action      memproses perubahan data               │
│  • Route Handler      menangani unduhan berkas & API         │
│  • Middleware         memeriksa status login                 │
└───────────┬─────────────────────────────────┬───────────────┘
            │                                 │
            ▼                                 ▼
┌───────────────────────────┐   ┌─────────────────────────────┐
│  NEON POSTGRES            │   │  CLOUDFLARE R2              │
│  Seluruh data: pengguna,  │   │  Berkas bukti pendukung      │
│  tabel, narasi, nilai,    │   │  (dokumen, gambar)           │
│  catatan audit            │   │                              │
└───────────────────────────┘   └─────────────────────────────┘
```

### Empat lapis yang perlu dipahami

**Lapis 1 — Peramban.** Sebagian besar halaman dikirim dalam keadaan sudah
jadi. Peramban hanya menjalankan potongan yang memang butuh interaksi: editor
narasi, pengunggah berkas, pilihan dosen, tombol simpan.

**Lapis 2 — Server Next.js.** Di sinilah keputusan diambil. Ada dua jenis
berkas yang penting:

- `page.tsx` — menyiapkan data lalu mengirim tampilan. Berjalan di server.
- `actions.ts` — memproses perubahan. Juga berjalan di server.

Karena keduanya di server, **pemeriksaan izin dilakukan di sini**, bukan di
tampilan. Ini penting: menyembunyikan tombol tidak menghentikan siapa pun yang
tahu alamatnya.

**Lapis 3 — Basis data.** PostgreSQL yang dikelola Neon. Semua akses lewat
Prisma, sehingga bentuk tabel di kode dan di database selalu sinkron.

**Lapis 4 — Penyimpanan berkas.** Berkas bukti disimpan di Cloudflare R2.
Penyimpanan ini kompatibel dengan protokol S3, dan aplikasi mengaksesnya
memakai pustaka klien MinIO. Jadi "MinIO" di kode adalah **nama alatnya**, bukan
tempat penyimpanannya.

### Perjalanan satu permintaan

Contoh: pengguna menyimpan narasi LED.

1. Pengguna selesai mengetik; editor menunggu **1,2 detik** tanpa ketikan baru.
2. Editor mengirim narasi ke server action `simpanNarasi`.
3. Server memeriksa **apakah pengguna masih login** dan **punya izin
   `led.update`**.
4. Server menyimpan isinya ke tabel `led_isian`, sekaligus mencatat ke
   `AuditLog`.
5. Server menyuruh Next menyegarkan halaman terkait.
6. Editor menampilkan lencana **"Tersimpan HH.MM"**.

Kalau langkah 3 gagal, penyimpanan ditolak dan pengguna melihat pesan.
Kalau sambungan putus di tengah, editor mencoba lagi.

### Keputusan arsitektur, dan alasannya

Beberapa pilihan di sini tidak biasa. Masing-masing punya alasan:

**Memakai App Router, bukan Pages Router.** App Router memungkinkan komponen
server, sehingga data diambil langsung di server tanpa perantara API. Ini
mengurangi satu lapis yang harus dijaga.

**Memakai server action, bukan API untuk perubahan data.** Server action
terhubung langsung ke komponen yang memakainya, jadi tidak perlu menyepakati
bentuk permintaan dan jawaban secara manual.

**Tabel LKPS memakai kolom JSON, bukan kolom nyata per field.** Tiap dari 32
tabel punya susunan kolom berbeda, dan susunannya bisa berubah mengikuti
instrumen. Kalau tiap field jadi kolom database sendiri, setiap perubahan
instrumen berarti mengubah struktur database. Konsekuensinya: isi kolom JSON
tidak bisa dicari langsung lewat SQL biasa.

**Nama dosen disimpan sebagai teks, bukan kaitan ke tabel dosen.** Tabel LKPS
harus tetap bisa diisi walaupun data induk dosen belum lengkap. Konsekuensinya:
mengganti nama di data induk tidak otomatis memperbarui isian yang sudah ada.

**Aplikasi tidak menyimpan berkas di dalam database.** Berkas bisa besar, dan
database tidak dirancang untuk itu. Yang disimpan di database hanya keterangan
berkasnya; isinya di R2.

### Siklus penyimpanan dan penyegaran

Next.js punya perilaku bawaan yang penting dipahami: setelah server action
selesai, halaman yang terpengaruh harus **disegarkan** supaya data baru muncul.
Ini dilakukan dengan `revalidatePath`.

Ada jebakannya: kalau menyegarkan dengan lingkup terlalu luas, seluruh kerangka
halaman ikut dipasang ulang — termasuk menu samping — dan animasinya terputar
dari awal. Pengguna melihatnya sebagai "menu terus menyegarkan diri".

Karena itu setiap modul punya **fungsi penyegaran sendiri** (`revalidateLed`,
`revalidatePenilaian`) yang menyebut halaman spesifik satu per satu. Jangan
memakai lingkup `"layout"` kecuali benar-benar perlu — alasannya ada di bab 18.


---

<a id="4-teknologi-yang-dipakai"></a>

## 4. Teknologi yang Dipakai

Setiap pustaka, versinya, dan kenapa dipilih

Semua pilihan di bawah ini sudah dipakai di kode, bukan rencana.

### Kerangka kerja dan bahasa

| Teknologi | Versi | Dipakai untuk | Berkas kunci |
|---|---|---|---|
| **Next.js** | 15 | Kerangka kerja utama, App Router | `next.config.ts`, `app/` |
| **React** | 19 | Komponen tampilan | `components/`, `app/` |
| **TypeScript** | 5 | Bahasa, mode ketat | `tsconfig.json` |
| **Tailwind CSS** | 4 | Gaya tampilan | `app/globals.css` |
| **Framer Motion** | 11 | Animasi perpindahan dan masuk | `components/layout/` |

**Kenapa TypeScript mode ketat.** Instrumen akreditasi memakai kode berlapis
dan tipe data yang mirip, misalnya kode tabel `2.B.3` dan kode butir `2.B.3`.
Kesalahan kecil seperti itu sulit terlihat saat membaca, tetapi mudah tertangkap
pemeriksa tipe.

**Catatan Tailwind v4 yang penting:** tidak ada berkas `tailwind.config`. Semua
token warna dan ukuran didefinisikan di blok `@theme` di dalam
`app/globals.css`. Akibatnya **kelas yang tidak terdaftar di sana tidak
menghasilkan gaya apa pun — tanpa pesan kesalahan**. Ini pernah terjadi: kelas
`text-3xs` dipakai di puluhan berkas padahal tidak pernah ada di tema. Ukuran
mikro yang benar di proyek ini adalah `text-[10px]`.

### Basis data dan otentikasi

| Teknologi | Versi | Dipakai untuk |
|---|---|---|
| **PostgreSQL** | 16 | Basis data utama |
| **Neon** | — | Pengelola basis data saat berjalan di internet |
| **Prisma** | 6 | Penghubung kode ke basis data |
| **Auth.js (NextAuth)** | 5 | Login dan sesi pemakaian |

**Kenapa Prisma tanpa folder migrasi.** Proyek ini menyamakan struktur database
memakai `prisma db push`, bukan sistem migrasi bertahap. Konsekuensinya perlu
dipahami betul dan dijelaskan terpisah di bab 16.

### Penyimpanan berkas

| Teknologi | Dipakai untuk |
|---|---|
| **Cloudflare R2** | Menyimpan berkas bukti di produksi |
| **MinIO SDK** | Pustaka yang dipakai kode untuk mengaksesnya |
| **MinIO (lokal)** | Penyimpanan tiruan untuk pengembangan |

Penyimpanan R2 memakai protokol yang sama dengan S3, sehingga pustaka klien
MinIO bisa dipakai apa adanya. Karena itu di kode akan ditemukan nama
`lib/minio.ts` dan variabel `MINIO_*`.

### Tampilan dan bentuk data

| Teknologi | Dipakai untuk |
|---|---|
| **Lucide React** | Kumpulan ikon |
| **Zod** | Memeriksa bentuk data sebelum disimpan |
| **React Hook Form** | Mengelola isian formulir |

### Ekspor dokumen

| Teknologi | Dipakai untuk | Berkas |
|---|---|---|
| **ExcelJS** | Ekspor tabel ke Excel | `lib/export/excel.ts` |
| **docx** | Ekspor ke Word | `lib/export/word.ts`, `led-docx.ts` |
| **@react-pdf/renderer** | Ekspor ke PDF | `lib/export/pdf.tsx`, `led-pdf.tsx` |

### Pengujian

| Teknologi | Dipakai untuk | Jumlah |
|---|---|---|
| **Vitest** | Uji cepat per fungsi | 79 uji |
| **Playwright** | Uji dari sisi pengguna | 79 skenario |

### Perkakas pengembangan

| Perkakas | Dipakai untuk |
|---|---|
| **pnpm** | Memasang paket — **bukan npm** |
| **ESLint** | Memeriksa mutu kode |
| **Docker** | Menjalankan database dan penyimpanan di komputer sendiri |
| **tsx** | Menjalankan skrip TypeScript langsung |

### Yang sengaja tidak dipakai

| Tidak dipakai | Alasan |
|---|---|
| **Redux / Zustand** | Keadaan aplikasi cukup sederhana; cukup keadaan lokal per komponen |
| **tRPC / GraphQL** | Server action sudah memadai dan lebih sedikit lapisannya |
| **shadcn/ui** | Sempat direncanakan, tetapi komponennya akhirnya ditulis sendiri supaya seragam dengan gaya proyek |
| **Prisma Migrate** | Proyek sudah berjalan dengan `db push` sejak awal (lihat bab 16) |
| **Sistem tema berbasis variabel** | Tidak bisa dipakai karena satu variabel warna dipakai untuk latar sekaligus teks (lihat bab 18) |


---

<a id="5-struktur-folder"></a>

## 5. Struktur Folder

Peta seluruh folder dan berkas di proyek

### Gambaran tingkat atas

```
sim-lkps/
├── app/                    Halaman dan API (App Router)
├── components/             Komponen tampilan
├── lib/                    Logika, perkakas, ekspor
├── prisma/                 Bentuk tabel + data awal
├── scripts/                Skrip bantu (termasuk generator README ini)
├── tests/                  Pengujian otomatis
├── docs/                   Dokumentasi
├── public/                 Berkas statis
└── [berkas konfigurasi]
```

### `app/` — halaman dan API

Folder ini mengikuti aturan Next.js App Router: **susunan folder = alamat URL**.

Dua hal yang sering membingungkan saat pertama membaca:

**Tanda kurung berarti tidak masuk URL.** Folder bernama `(auth)` dan
`(dashboard)` hanya untuk mengelompokkan tata letak.

| Alamat berkas | URL yang dihasilkan |
|---|---|
| `app/(auth)/login/page.tsx` | `/login` |
| `app/(dashboard)/led/page.tsx` | `/led` |

**Nama berkas menentukan perannya.**

| Nama berkas | Perannya |
|---|---|
| `page.tsx` | Halaman yang bisa dibuka |
| `layout.tsx` | Pembungkus yang tetap terpasang antar halaman |
| `route.ts` | Titik akhir API |
| `loading.tsx` | Tampilan sementara saat halaman dimuat |
| `error.tsx` | Tampilan saat halaman gagal dimuat |
| `not-found.tsx` | Tampilan saat alamat tidak ada |

### `components/` — komponen tampilan

| Folder | Jumlah | Isinya |
|---|---|---|
| `tables/` | 36 berkas | Tampilan tiap tabel LKPS (satu berkas per tabel) |
| `led/` | 11 berkas | Editor narasi, kartu kemajuan, daftar bukti |
| `layout/` | 6 berkas | Menu samping, kepala halaman, tombol mode gelap |
| `shared/` | 5 berkas | Pemilih dosen, kotak pencarian, dan sejenisnya |
| `forms/` | 4 berkas | Formulir data induk |
| `penilaian/` | 4 berkas | Matriks penilaian dan kartu skor |
| `ui/` | 1 berkas | Layar pemuatan |

### `lib/` — logika

| Folder | Jumlah | Isinya |
|---|---|---|
| `utils/` | 13 berkas | Hitungan murni: nilai, kemajuan, izin, format |
| `actions/` | 9 berkas | Server action: satu berkas per bidang |
| `export/` | 7 berkas | Penyusun dokumen Excel, Word, PDF |
| `validations/` | 2 berkas | Pemeriksaan bentuk data dengan Zod |
| `config/` | 1 berkas | Tetapan tetap |
| `types/` | 1 berkas | Tipe bersama |
| akar `lib/` | 4 berkas | `auth.ts`, `db.ts`, `minio.ts`, dan lain-lain |

**Pemisahan yang penting dipahami:** hitungan murni diletakkan di `lib/utils/`,
bukan di dalam server action. Alasannya bisa diuji tanpa perlu database. Contoh:
`lib/utils/penilaian.ts` menghitung nilai akhir dari sekumpulan skor — fungsi
itu bisa dipanggil langsung di uji.

### `prisma/` — basis data

| Berkas | Isinya |
|---|---|
| `schema.prisma` | Bentuk 23 tabel dan 7 pilihan nilai tetap |
| `seed.ts` | Data awal: 32 tabel LKPS, pengguna bawaan, data induk |
| `seed-modul-baru.ts` | Data awal modul LED dan Matriks Penilaian |
| `seed-data/led-bagian.json` | 92 bagian LED |
| `seed-data/butir-penilaian.json` | 82 butir penilaian |

### `tests/` — pengujian

| Bagian | Isinya |
|---|---|
| `*.test.ts`, `unit/` | Uji cepat per fungsi (Vitest) |
| `*.spec.ts` | Uji dari sisi pengguna (Playwright) |
| `fixtures.ts` | Alat bantu login untuk uji |
| `playwright.config.ts` | Tetapan Playwright |
| `global-setup-penilaian.ts` | Pembersih data sebelum uji berjalan |

### Pohon lengkap


### Pohon berkas tingkat atas

```
sim-lkps/
├── app/
│   └── 73 halaman, 9 titik akhir API
├── components/
│   └── 68 komponen
├── lib/
│   └── 37 berkas logika
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── seed-data/
├── scripts/
│   ├── generate-readme.mjs
│   └── readme/
├── tests/
│   ├── unit/
│   └── *.spec.ts
├── docs/
│   └── handover/
└── public/
```

---

<a id="6-daftar-tabel-lkps"></a>

## 6. Daftar Tabel LKPS

Seluruh 32 tabel LKPS beserta 202 kolomnya — apa yang harus diisi di tiap kolom

LKPS memuat **32 tabel** dengan total **202 kolom**.
Susunannya dibaca dari `prisma/seed.ts` — berkas itulah sumber kebenaran
jumlah tabel, bukan hitungan langsung di database.

### Sebaran tabel per kriteria

| Kriteria | Tabel | Kode tabel |
|---|---:|---|
| [Kriteria 1](#kriteria-1) | 6 | `1.A.1`, `1.A.2`, `1.A.3`, `1.A.4`, `1.A.5`, `1.B` |
| [Kriteria 2](#kriteria-2) | 11 | `2.A.1`, `2.A.2`, `2.A.3`, `2.B.1`, `2.B.2`, `2.B.3`, `2.B.4`, `2.B.5`, `2.B.6`, `2.C`, `2.D` |
| [Kriteria 3](#kriteria-3) | 6 | `3.A.1`, `3.A.2`, `3.A.3`, `3.C.1`, `3.C.2`, `3.C.3` |
| [Kriteria 4](#kriteria-4) | 5 | `4.A.1`, `4.A.2`, `4.C.1`, `4.C.2`, `4.C.3` |
| [Kriteria 5](#kriteria-5) | 2 | `5.1`, `5.2` |
| [Kriteria 6](#kriteria-6) | 2 | `6.1`, `6.2` |
| **Total** | **32** | |

### Ringkasan seluruh tabel

| Kode | Kriteria | Nama | Jumlah kolom |
|---|---:|---|---:|
| [`1.A.1`](#tabel-lkps-1a1) | 1 | Pimpinan dan Tupoksi UPPS dan PS | 6 |
| [`1.A.2`](#tabel-lkps-1a2) | 1 | Sumber Pendanaan UPPS/PS | 5 |
| [`1.A.3`](#tabel-lkps-1a3) | 1 | Penggunaan Dana UPPS/PS | 3 |
| [`1.A.4`](#tabel-lkps-1a4) | 1 | Rata-rata Beban DTPR per Semester (EWMP) pada TS | 8 |
| [`1.A.5`](#tabel-lkps-1a5) | 1 | Kualifikasi Tenaga Kependidikan | 5 |
| [`1.B`](#tabel-lkps-1b) | 1 | Unit SPMI dan SDM | 3 |
| [`2.A.1`](#tabel-lkps-2a1) | 2 | Data Mahasiswa | 17 |
| [`2.A.2`](#tabel-lkps-2a2) | 2 | Keragaman Asal Mahasiswa | 3 |
| [`2.A.3`](#tabel-lkps-2a3) | 2 | Kondisi Jumlah Mahasiswa | 2 |
| [`2.B.1`](#tabel-lkps-2b1) | 2 | Isi Pembelajaran | 9 |
| [`2.B.2`](#tabel-lkps-2b2) | 2 | Pemetaan CPL dan Profil Lulusan | 6 |
| [`2.B.3`](#tabel-lkps-2b3) | 2 | Peta Pemenuhan CPL | 5 |
| [`2.B.4`](#tabel-lkps-2b4) | 2 | Rata-rata Masa Tunggu Lulusan | 4 |
| [`2.B.5`](#tabel-lkps-2b5) | 2 | Kesesuaian Bidang Kerja Lulusan | 8 |
| [`2.B.6`](#tabel-lkps-2b6) | 2 | Kepuasan Pengguna Lulusan | 7 |
| [`2.C`](#tabel-lkps-2c) | 2 | Fleksibilitas Proses Pembelajaran | 4 |
| [`2.D`](#tabel-lkps-2d) | 2 | Rekognisi dan Apresiasi Kompetensi Lulusan | 5 |
| [`3.A.1`](#tabel-lkps-3a1) | 3 | Sarana dan Prasarana Penelitian | 8 |
| [`3.A.2`](#tabel-lkps-3a2) | 3 | Penelitian DTPR, Hibah, dan Pembiayaan | 10 |
| [`3.A.3`](#tabel-lkps-3a3) | 3 | Pengembangan DTPR di Bidang Penelitian | 4 |
| [`3.C.1`](#tabel-lkps-3c1) | 3 | Kerja Sama Penelitian | 9 |
| [`3.C.2`](#tabel-lkps-3c2) | 3 | Publikasi Penelitian | 5 |
| [`3.C.3`](#tabel-lkps-3c3) | 3 | Perolehan HKI Penelitian | 5 |
| [`4.A.1`](#tabel-lkps-4a1) | 4 | Sarana dan Prasarana PkM | 7 |
| [`4.A.2`](#tabel-lkps-4a2) | 4 | PkM DTPR, Hibah, dan Pembiayaan | 9 |
| [`4.C.1`](#tabel-lkps-4c1) | 4 | Kerja Sama PkM | 8 |
| [`4.C.2`](#tabel-lkps-4c2) | 4 | Diseminasi Hasil PkM | 7 |
| [`4.C.3`](#tabel-lkps-4c3) | 4 | Perolehan HKI PkM | 7 |
| [`5.1`](#tabel-lkps-51) | 5 | Sistem Tata Kelola | 5 |
| [`5.2`](#tabel-lkps-52) | 5 | Sarana dan Prasarana Pendidikan | 7 |
| [`6.1`](#tabel-lkps-61) | 6 | Visi Misi Tujuan | 5 |
| [`6.2`](#tabel-lkps-62) | 6 | Strategi Pencapaian | 6 |

### Penjelasan tiap tabel

Tiap tabel di bawah ini punya halamannya sendiri. Kolom yang bertanda
**wajib** harus diisi sebelum baris bisa disimpan; yang tidak wajib boleh
dikosongkan.


<a id="kriteria-1"></a>

### Kriteria 1


<a id="tabel-lkps-1a1"></a>

#### Tabel `1.A.1` — Pimpinan dan Tupoksi UPPS dan PS

| | |
|---|---|
| **Kode** | `1.A.1` |
| **Kriteria** | 1 |
| **Urutan** | 1 |
| **Jumlah kolom** | 6 |
| **Halaman** | `/lkps/kriteria-1/tabel-1a1` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Unit Kerja | `unitKerja` | teks pendek | **ya** |
| 2 | Nama Pejabat | `namaKetua` | teks pendek | **ya** |
| 3 | Periode Jabatan | `periodeJabatan` | teks pendek | **ya** |
| 4 | Pendidikan Terakhir | `pendidikanTerakhir` | teks pendek | **ya** |
| 5 | Jabatan Fungsional | `jabatanFungsional` | teks pendek | tidak |
| 6 | Tupoksi | `tupoksi` | teks panjang | **ya** |

**Yang perlu diperhatikan:**

- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-1a2"></a>

#### Tabel `1.A.2` — Sumber Pendanaan UPPS/PS

| | |
|---|---|
| **Kode** | `1.A.2` |
| **Kriteria** | 1 |
| **Urutan** | 2 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-1/tabel-1a2` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | No | `no` | angka | **ya** |
| 2 | Sumber Dana | `sumber_dana` | teks pendek | **ya** |
| 3 | Jumlah (TS-2) | `jumlah_ts2` | nilai uang | **ya** |
| 4 | Jumlah (TS-1) | `jumlah_ts1` | nilai uang | **ya** |
| 5 | Jumlah (TS) | `jumlah_ts` | nilai uang | **ya** |

**Yang perlu diperhatikan:**

- Ada kolom bernilai uang — masukkan angka saja, tanpa titik atau tanda rupiah.


<a id="tabel-lkps-1a3"></a>

#### Tabel `1.A.3` — Penggunaan Dana UPPS/PS

| | |
|---|---|
| **Kode** | `1.A.3` |
| **Kriteria** | 1 |
| **Urutan** | 3 |
| **Jumlah kolom** | 3 |
| **Halaman** | `/lkps/kriteria-1/tabel-1a3` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Jenis Penggunaan | `jenisPenggunaan` | teks pendek | **ya** |
| 2 | Jumlah (jt) | `nominal` | angka | **ya** |
| 3 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


<a id="tabel-lkps-1a4"></a>

#### Tabel `1.A.4` — Rata-rata Beban DTPR per Semester (EWMP) pada TS

| | |
|---|---|
| **Kode** | `1.A.4` |
| **Kriteria** | 1 |
| **Urutan** | 4 |
| **Jumlah kolom** | 8 |
| **Halaman** | `/lkps/kriteria-1/tabel-1a4` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | No | `no` | angka | **ya** |
| 2 | Nama Dosen | `nama_dosen` | teks pendek | **ya** |
| 3 | NIDN | `nidn` | teks pendek | **ya** |
| 4 | Pendidikan (sks) | `pendidikan` | angka | **ya** |
| 5 | Penelitian (sks) | `penelitian` | angka | **ya** |
| 6 | PkM (sks) | `pkm` | angka | **ya** |
| 7 | Tugas Tambahan (sks) | `tugas_tambahan` | angka | tidak |
| 8 | Total (sks) | `total` | angka | **ya** |

**Yang perlu diperhatikan:**

- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-1a5"></a>

#### Tabel `1.A.5` — Kualifikasi Tenaga Kependidikan

| | |
|---|---|
| **Kode** | `1.A.5` |
| **Kriteria** | 1 |
| **Urutan** | 5 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-1/tabel-1a5` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | No | `no` | angka | **ya** |
| 2 | Jenis Tenaga Kependidikan | `jenis_tendik` | teks pendek | **ya** |
| 3 | Jumlah | `jumlah` | angka | **ya** |
| 4 | Kualifikasi Pendidikan | `kualifikasi` | teks pendek | **ya** |
| 5 | Unit Kerja | `unit_kerja` | teks pendek | **ya** |


<a id="tabel-lkps-1b"></a>

#### Tabel `1.B` — Unit SPMI dan SDM

| | |
|---|---|
| **Kode** | `1.B` |
| **Kriteria** | 1 |
| **Urutan** | 6 |
| **Jumlah kolom** | 3 |
| **Halaman** | `/lkps/kriteria-1/tabel-1b` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | No | `no` | angka | **ya** |
| 2 | Aspek | `aspek` | teks pendek | **ya** |
| 3 | Deskripsi | `deskripsi` | teks panjang | **ya** |


<a id="kriteria-2"></a>

### Kriteria 2


<a id="tabel-lkps-2a1"></a>

#### Tabel `2.A.1` — Data Mahasiswa

| | |
|---|---|
| **Kode** | `2.A.1` |
| **Kriteria** | 2 |
| **Urutan** | 1 |
| **Jumlah kolom** | 17 |
| **Halaman** | `/lkps/kriteria-2/tabel-2a1` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Tahun | `ts_label` | teks pendek | **ya** |
| 2 | Pendaftar | `pendaftar` | angka | **ya** |
| 3 | Daya Tampung | `dayaTampung` | angka | **ya** |
| 4 | Lulus Seleksi | `lulusSeleksi` | angka | tidak |
| 5 | Maba Reguler Diterima | `mabaRegulerDiterima` | angka | tidak |
| 6 | Maba Reguler Afirmasi | `mabaRegulerAfirmasi` | angka | tidak |
| 7 | Maba Reguler Khusus | `mabaRegulerKhusus` | angka | tidak |
| 8 | Maba RPL Diterima | `mabaRplDiterima` | angka | tidak |
| 9 | Maba RPL Afirmasi | `mabaRplAfirmasi` | angka | tidak |
| 10 | Maba RPL Khusus | `mabaRplKhusus` | angka | tidak |
| 11 | Aktif Reguler | `aktifRegulerJumlah` | angka | tidak |
| 12 | Aktif Reguler Afirmasi | `aktifRegulerAfirmasi` | angka | tidak |
| 13 | Aktif Reguler Khusus | `aktifRegulerKhusus` | angka | tidak |
| 14 | Aktif RPL | `aktifRplJumlah` | angka | tidak |
| 15 | Aktif RPL Afirmasi | `aktifRplAfirmasi` | angka | tidak |
| 16 | Aktif RPL Khusus | `aktifRplKhusus` | angka | tidak |
| 17 | Calon Kebutuhan Khusus | `calonKebutuhanKhusus` | angka | tidak |


<a id="tabel-lkps-2a2"></a>

#### Tabel `2.A.2` — Keragaman Asal Mahasiswa

| | |
|---|---|
| **Kode** | `2.A.2` |
| **Kriteria** | 2 |
| **Urutan** | 2 |
| **Jumlah kolom** | 3 |
| **Halaman** | `/lkps/kriteria-2/tabel-2a2` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Asal Mahasiswa | `asalMahasiswa` | teks pendek | **ya** |
| 2 | Jumlah | `nominal` | angka | **ya** |
| 3 | Link Bukti | `linkBukti` | teks pendek | tidak |

**Yang perlu diperhatikan:**

- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


<a id="tabel-lkps-2a3"></a>

#### Tabel `2.A.3` — Kondisi Jumlah Mahasiswa

| | |
|---|---|
| **Kode** | `2.A.3` |
| **Kriteria** | 2 |
| **Urutan** | 3 |
| **Jumlah kolom** | 2 |
| **Halaman** | `/lkps/kriteria-2/tabel-2a3` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Kategori | `kategori` | teks pendek | **ya** |
| 2 | Jumlah | `nominal` | angka | **ya** |


<a id="tabel-lkps-2b1"></a>

#### Tabel `2.B.1` — Isi Pembelajaran

| | |
|---|---|
| **Kode** | `2.B.1` |
| **Kriteria** | 2 |
| **Urutan** | 4 |
| **Jumlah kolom** | 9 |
| **Halaman** | `/lkps/kriteria-2/tabel-2b1` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Kode MK | `kodeMk` | teks pendek | **ya** |
| 2 | Nama Mata Kuliah | `namaMk` | teks pendek | **ya** |
| 3 | Semester | `semester` | angka | **ya** |
| 4 | SKS | `sks` | angka | **ya** |
| 5 | PL01 | `pl01` | boolean | tidak |
| 6 | PL02 | `pl02` | boolean | tidak |
| 7 | PL03 | `pl03` | boolean | tidak |
| 8 | PL04 | `pl04` | boolean | tidak |
| 9 | PL05 | `pl05` | boolean | tidak |

**Yang perlu diperhatikan:**

- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-2b2"></a>

#### Tabel `2.B.2` — Pemetaan CPL dan Profil Lulusan

| | |
|---|---|
| **Kode** | `2.B.2` |
| **Kriteria** | 2 |
| **Urutan** | 5 |
| **Jumlah kolom** | 6 |
| **Halaman** | `/lkps/kriteria-2/tabel-2b2` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Kode CPL | `kodeCpl` | teks pendek | **ya** |
| 2 | PL01 | `pl01` | boolean | tidak |
| 3 | PL02 | `pl02` | boolean | tidak |
| 4 | PL03 | `pl03` | boolean | tidak |
| 5 | PL04 | `pl04` | boolean | tidak |
| 6 | PL05 | `pl05` | boolean | tidak |


<a id="tabel-lkps-2b3"></a>

#### Tabel `2.B.3` — Peta Pemenuhan CPL

| | |
|---|---|
| **Kode** | `2.B.3` |
| **Kriteria** | 2 |
| **Urutan** | 6 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-2/tabel-2b3` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Kode CPL | `kodeCpl` | teks pendek | **ya** |
| 2 | Rumusan CPL | `rumusanCpl` | teks panjang | **ya** |
| 3 | Kode CPMK | `kodeCpmk` | teks pendek | **ya** |
| 4 | Rumusan CPMK | `rumusanCpmk` | teks panjang | **ya** |
| 5 | Mata Kuliah (Kode) | `mataKuliah` | teks pendek | **ya** |


<a id="tabel-lkps-2b4"></a>

#### Tabel `2.B.4` — Rata-rata Masa Tunggu Lulusan

| | |
|---|---|
| **Kode** | `2.B.4` |
| **Kriteria** | 2 |
| **Urutan** | 7 |
| **Jumlah kolom** | 4 |
| **Halaman** | `/lkps/kriteria-2/tabel-2b4` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Tahun | `tahun` | teks pendek | **ya** |
| 2 | Jumlah Lulusan | `jumlahLulusan` | angka | **ya** |
| 3 | Jumlah Terlacak | `jumlahTerlacak` | angka | tidak |
| 4 | Rata-rata Masa Tunggu (bulan) | `rataRata` | angka | **ya** |


<a id="tabel-lkps-2b5"></a>

#### Tabel `2.B.5` — Kesesuaian Bidang Kerja Lulusan

| | |
|---|---|
| **Kode** | `2.B.5` |
| **Kriteria** | 2 |
| **Urutan** | 8 |
| **Jumlah kolom** | 8 |
| **Halaman** | `/lkps/kriteria-2/tabel-2b5` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Tahun | `tahun` | teks pendek | **ya** |
| 2 | Jumlah Lulusan | `jumlahLulusan` | angka | **ya** |
| 3 | Jumlah Terlacak | `jumlahTerlacak` | angka | tidak |
| 4 | Profesi Infokom | `profesiInfokom` | angka | tidak |
| 5 | Profesi Non Infokom | `profesiNonInfokom` | angka | tidak |
| 6 | Nasional | `nasional` | angka | tidak |
| 7 | Internasional | `internasional` | angka | tidak |
| 8 | Wirausaha | `wirausaha` | angka | tidak |


<a id="tabel-lkps-2b6"></a>

#### Tabel `2.B.6` — Kepuasan Pengguna Lulusan

| | |
|---|---|
| **Kode** | `2.B.6` |
| **Kriteria** | 2 |
| **Urutan** | 9 |
| **Jumlah kolom** | 7 |
| **Halaman** | `/lkps/kriteria-2/tabel-2b6` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Aspek Kemampuan | `labelKemampuan` | teks pendek | **ya** |
| 2 | Key | `kemampuan` | teks pendek | tidak |
| 3 | Sangat Baik (%) | `sangatBaik` | angka | tidak |
| 4 | Baik (%) | `baik` | angka | tidak |
| 5 | Cukup (%) | `cukup` | angka | tidak |
| 6 | Kurang (%) | `kurang` | angka | tidak |
| 7 | Rencana Tindak Lanjut | `rencanaTindakLanjut` | teks panjang | tidak |


<a id="tabel-lkps-2c"></a>

#### Tabel `2.C` — Fleksibilitas Proses Pembelajaran

| | |
|---|---|
| **Kode** | `2.C` |
| **Kriteria** | 2 |
| **Urutan** | 10 |
| **Jumlah kolom** | 4 |
| **Halaman** | `/lkps/kriteria-2/tabel-2c` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Label | `label` | teks pendek | **ya** |
| 2 | Key | `key` | teks pendek | tidak |
| 3 | Jumlah TS | `ts` | angka | tidak |
| 4 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


<a id="tabel-lkps-2d"></a>

#### Tabel `2.D` — Rekognisi dan Apresiasi Kompetensi Lulusan

| | |
|---|---|
| **Kode** | `2.D` |
| **Kriteria** | 2 |
| **Urutan** | 11 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-2/tabel-2d` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Label | `label` | teks pendek | **ya** |
| 2 | Key | `key` | teks pendek | tidak |
| 3 | Jenis | `jenis` | teks pendek | tidak |
| 4 | Jumlah TS | `ts` | angka | tidak |
| 5 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


<a id="kriteria-3"></a>

### Kriteria 3


<a id="tabel-lkps-3a1"></a>

#### Tabel `3.A.1` — Sarana dan Prasarana Penelitian

| | |
|---|---|
| **Kode** | `3.A.1` |
| **Kriteria** | 3 |
| **Urutan** | 1 |
| **Jumlah kolom** | 8 |
| **Halaman** | `/lkps/kriteria-3/tabel-3a1` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama Prasarana | `namaPrasarana` | teks pendek | **ya** |
| 2 | Tahun | `tahun` | teks pendek | **ya** |
| 3 | Status (M/W) | `status` | pilihan | **ya** |
| 4 | Daya Tampung | `dayaTampung` | angka | tidak |
| 5 | Luas Ruang (m²) | `luasRuang` | angka | tidak |
| 6 | Perangkat | `perangkat` | teks panjang | tidak |
| 7 | Lisensi (P/T) | `publicDomain` | pilihan | tidak |
| 8 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-3a2"></a>

#### Tabel `3.A.2` — Penelitian DTPR, Hibah, dan Pembiayaan

| | |
|---|---|
| **Kode** | `3.A.2` |
| **Kriteria** | 3 |
| **Urutan** | 2 |
| **Jumlah kolom** | 10 |
| **Halaman** | `/lkps/kriteria-3/tabel-3a2` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama DTPR (Ketua) | `namaDtpr` | teks pendek | **ya** |
| 2 | Judul Penelitian | `judulPenelitian` | teks pendek | **ya** |
| 3 | Tahun | `tahun` | teks pendek | **ya** |
| 4 | Jumlah Mahasiswa | `jumlahMahasiswa` | angka | tidak |
| 5 | Jenis Hibah | `jenisHibah` | pilihan | **ya** |
| 6 | Durasi (tahun) | `durasi` | angka | tidak |
| 7 | Dana TS-2 (jt) | `danaTs2` | angka | tidak |
| 8 | Dana TS-1 (jt) | `danaTs1` | angka | tidak |
| 9 | Dana TS (jt) | `danaTs` | angka | tidak |
| 10 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-3a3"></a>

#### Tabel `3.A.3` — Pengembangan DTPR di Bidang Penelitian

| | |
|---|---|
| **Kode** | `3.A.3` |
| **Kriteria** | 3 |
| **Urutan** | 3 |
| **Jumlah kolom** | 4 |
| **Halaman** | `/lkps/kriteria-3/tabel-3a3` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama DTPR | `namaDtpr` | teks pendek | **ya** |
| 2 | Jenis Pengembangan | `jenisPengembangan` | teks pendek | **ya** |
| 3 | Tahun | `tahun` | teks pendek | **ya** |
| 4 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-3c1"></a>

#### Tabel `3.C.1` — Kerja Sama Penelitian

| | |
|---|---|
| **Kode** | `3.C.1` |
| **Kriteria** | 3 |
| **Urutan** | 4 |
| **Jumlah kolom** | 9 |
| **Halaman** | `/lkps/kriteria-3/tabel-3c1` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Judul Kerjasama | `judulKerjasama` | teks pendek | **ya** |
| 2 | Mitra Kerja | `mitraKerja` | teks pendek | **ya** |
| 3 | Tahun | `tahun` | teks pendek | **ya** |
| 4 | Sumber Dana | `sumber` | pilihan | **ya** |
| 5 | Durasi (tahun) | `durasi` | angka | tidak |
| 6 | Dana TS-2 (jt) | `danaTs2` | angka | tidak |
| 7 | Dana TS-1 (jt) | `danaTs1` | angka | tidak |
| 8 | Dana TS (jt) | `danaTs` | angka | tidak |
| 9 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


<a id="tabel-lkps-3c2"></a>

#### Tabel `3.C.2` — Publikasi Penelitian

| | |
|---|---|
| **Kode** | `3.C.2` |
| **Kriteria** | 3 |
| **Urutan** | 5 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-3/tabel-3c2` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama DTPR | `namaDtpr` | teks pendek | **ya** |
| 2 | Judul Publikasi | `judulPublikasi` | teks pendek | **ya** |
| 3 | Tahun | `tahun` | teks pendek | **ya** |
| 4 | Jenis Publikasi | `jenisPublikasi` | pilihan | **ya** |
| 5 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-3c3"></a>

#### Tabel `3.C.3` — Perolehan HKI Penelitian

| | |
|---|---|
| **Kode** | `3.C.3` |
| **Kriteria** | 3 |
| **Urutan** | 6 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-3/tabel-3c3` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama DTPR | `namaDtpr` | teks pendek | **ya** |
| 2 | Judul HKI | `judul` | teks pendek | **ya** |
| 3 | Jenis HKI | `jenisHki` | teks pendek | **ya** |
| 4 | Tahun | `tahun` | teks pendek | **ya** |
| 5 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="kriteria-4"></a>

### Kriteria 4


<a id="tabel-lkps-4a1"></a>

#### Tabel `4.A.1` — Sarana dan Prasarana PkM

| | |
|---|---|
| **Kode** | `4.A.1` |
| **Kriteria** | 4 |
| **Urutan** | 1 |
| **Jumlah kolom** | 7 |
| **Halaman** | `/lkps/kriteria-4/tabel-4a1` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama Prasarana | `namaPrasarana` | teks pendek | **ya** |
| 2 | Daya Tampung | `dayaTampung` | angka | tidak |
| 3 | Luas Ruang (m²) | `luasRuang` | angka | tidak |
| 4 | Kepemilikan (M/W) | `status` | pilihan | **ya** |
| 5 | Lisensi (P/T) | `publicDomain` | pilihan | tidak |
| 6 | Perangkat | `perangkat` | teks panjang | tidak |
| 7 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-4a2"></a>

#### Tabel `4.A.2` — PkM DTPR, Hibah, dan Pembiayaan

| | |
|---|---|
| **Kode** | `4.A.2` |
| **Kriteria** | 4 |
| **Urutan** | 2 |
| **Jumlah kolom** | 9 |
| **Halaman** | `/lkps/kriteria-4/tabel-4a2` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama DTPR (Ketua) | `namaDtpr` | teks pendek | **ya** |
| 2 | Judul PkM | `judulPkm` | teks pendek | **ya** |
| 3 | Jumlah Mahasiswa Terlibat | `jumlahMahasiswa` | angka | tidak |
| 4 | Jenis Hibah | `jenisHibah` | pilihan | **ya** |
| 5 | Durasi (tahun) | `durasi` | angka | tidak |
| 6 | Dana TS-2 (jt) | `danaTs2` | angka | tidak |
| 7 | Dana TS-1 (jt) | `danaTs1` | angka | tidak |
| 8 | Dana TS (jt) | `danaTs` | angka | tidak |
| 9 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-4c1"></a>

#### Tabel `4.C.1` — Kerja Sama PkM

| | |
|---|---|
| **Kode** | `4.C.1` |
| **Kriteria** | 4 |
| **Urutan** | 3 |
| **Jumlah kolom** | 8 |
| **Halaman** | `/lkps/kriteria-4/tabel-4c1` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Judul Kerjasama | `judulKerjasama` | teks pendek | **ya** |
| 2 | Mitra Kerja | `mitraKerja` | teks pendek | **ya** |
| 3 | Sumber Dana | `sumber` | pilihan | **ya** |
| 4 | Durasi (tahun) | `durasi` | angka | tidak |
| 5 | Dana TS-2 (jt) | `danaTs2` | angka | tidak |
| 6 | Dana TS-1 (jt) | `danaTs1` | angka | tidak |
| 7 | Dana TS (jt) | `danaTs` | angka | tidak |
| 8 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


<a id="tabel-lkps-4c2"></a>

#### Tabel `4.C.2` — Diseminasi Hasil PkM

| | |
|---|---|
| **Kode** | `4.C.2` |
| **Kriteria** | 4 |
| **Urutan** | 4 |
| **Jumlah kolom** | 7 |
| **Halaman** | `/lkps/kriteria-4/tabel-4c2` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama DTPR (Ketua) | `namaDtpr` | teks pendek | **ya** |
| 2 | Judul | `judul` | teks pendek | **ya** |
| 3 | Diseminasi Hasil PkM | `diseminasi` | pilihan | **ya** |
| 4 | TS-2 | `ts2` | angka | tidak |
| 5 | TS-1 | `ts1` | angka | tidak |
| 6 | TS | `ts` | angka | tidak |
| 7 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-4c3"></a>

#### Tabel `4.C.3` — Perolehan HKI PkM

| | |
|---|---|
| **Kode** | `4.C.3` |
| **Kriteria** | 4 |
| **Urutan** | 5 |
| **Jumlah kolom** | 7 |
| **Halaman** | `/lkps/kriteria-4/tabel-4c3` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Judul HKI | `judul` | teks pendek | **ya** |
| 2 | Jenis HKI | `jenisHki` | teks pendek | **ya** |
| 3 | Nama DTPR | `namaDtpr` | teks pendek | **ya** |
| 4 | Tahun Perolehan TS-2 | `ts2` | centang | tidak |
| 5 | Tahun Perolehan TS-1 | `ts1` | centang | tidak |
| 6 | Tahun Perolehan TS | `ts` | centang | tidak |
| 7 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="kriteria-5"></a>

### Kriteria 5


<a id="tabel-lkps-51"></a>

#### Tabel `5.1` — Sistem Tata Kelola

| | |
|---|---|
| **Kode** | `5.1` |
| **Kriteria** | 5 |
| **Urutan** | 1 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-5/tabel-51` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Jenis Tata Kelola | `jenisTataKelola` | teks pendek | **ya** |
| 2 | Nama Sistem Informasi | `namaSistem` | teks pendek | **ya** |
| 3 | Akses | `akses` | pilihan | **ya** |
| 4 | Unit Kerja/SDM Pengelola | `unitPengelola` | teks pendek | **ya** |
| 5 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="tabel-lkps-52"></a>

#### Tabel `5.2` — Sarana dan Prasarana Pendidikan

| | |
|---|---|
| **Kode** | `5.2` |
| **Kriteria** | 5 |
| **Urutan** | 2 |
| **Jumlah kolom** | 7 |
| **Halaman** | `/lkps/kriteria-5/tabel-52` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Nama Prasarana | `namaPrasarana` | teks pendek | **ya** |
| 2 | Daya Tampung | `dayaTampung` | angka | tidak |
| 3 | Luas Ruang (m²) | `luasRuang` | angka | tidak |
| 4 | Kepemilikan (M/W) | `status` | pilihan | **ya** |
| 5 | Lisensi (P/T) | `publicDomain` | pilihan | tidak |
| 6 | Perangkat | `perangkat` | teks panjang | tidak |
| 7 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.
- Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.


<a id="kriteria-6"></a>

### Kriteria 6


<a id="tabel-lkps-61"></a>

#### Tabel `6.1` — Visi Misi Tujuan

| | |
|---|---|
| **Kode** | `6.1` |
| **Kriteria** | 6 |
| **Urutan** | 1 |
| **Jumlah kolom** | 5 |
| **Halaman** | `/lkps/kriteria-6/tabel-61` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | Kategori | `kategori` | pilihan | **ya** |
| 2 | Perguruan Tinggi (PT) | `pt` | teks panjang | **ya** |
| 3 | Fakultas (UPPS) | `upps` | teks panjang | **ya** |
| 4 | Program Studi (PS) | `ps` | teks panjang | **ya** |
| 5 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


<a id="tabel-lkps-62"></a>

#### Tabel `6.2` — Strategi Pencapaian

| | |
|---|---|
| **Kode** | `6.2` |
| **Kriteria** | 6 |
| **Urutan** | 2 |
| **Jumlah kolom** | 6 |
| **Halaman** | `/lkps/kriteria-6/tabel-62` |

**Kolom yang harus diisi:**

| # | Label kolom | Kunci data | Tipe | Wajib |
|---:|---|---|---|---|
| 1 | No | `nomor` | angka | **ya** |
| 2 | Strategi Pencapaian | `strategi` | teks panjang | **ya** |
| 3 | Sasaran | `sasaran` | teks panjang | **ya** |
| 4 | Indikator Kinerja | `indikator` | teks panjang | **ya** |
| 5 | Target | `target` | teks pendek | **ya** |
| 6 | Link Bukti | `linkBukti` | tautan | tidak |

**Yang perlu diperhatikan:**

- Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.
- Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.


---

<a id="7-format-isian-dan-tipe-kolom"></a>

## 7. Format Isian dan Tipe Kolom

Arti tiap tipe kolom, cara pengisiannya, dan kesalahan yang sering terjadi

Tiap kolom di tabel LKPS punya tipe. Tipe itu menentukan bentuk isian yang
muncul dan bagaimana isinya diperiksa sebelum disimpan.


### Daftar tipe kolom

| Tipe | Wujud isian | Cara mengisi | Contoh benar |
|---|---|---|---|
| `text` | teks pendek | Ketik langsung | `Sumber Dana PNBP` |
| `textarea` | teks panjang | Ketik bebas, boleh panjang | `Program studi menyelenggarakan…` |
| `number` | angka | Angka saja, **tanpa titik pemisah** | `12` |
| `currency` | nilai uang | Angka saja, **tanpa titik atau tanda rupiah** | `45000000` |
| `url` | tautan | Tempelkan alamat lengkap, diawali `http` | `https://contoh.ac.id/bukti.pdf` |
| `date` | tanggal | Pilih dari kalender | `2026-09-21` |
| `select` | pilihan | Pilih salah satu | `Ya` |
| `checkbox` | centang | Centang kalau ya | ☑ |
| `email` | alamat surel | Ketik alamat surel lengkap | `nama@ubbg.ac.id` |


### Kesalahan pengisian yang sering terjadi

| Yang ditulis | Kenapa salah | Yang benar |
|---|---|---|
| `Rp 45.000.000` | Tanda rupiah dan titik bukan angka | `45000000` |
| `45.000.000` | Titik dibaca sebagai pemisah desimal | `45000000` |
| `www.contoh.ac.id` | Tautan tanpa awalan tidak bisa dibuka | `https://www.contoh.ac.id` |
| `21 September 2026` | Bukan bentuk tanggal yang dikenali | Pilih lewat kalender |
| `-` atau `N/A` di kolom wajib | Kolom wajib tidak boleh kosong | Isi dengan data sebenarnya, atau kosongkan setelah data tersedia |
| Angka dengan spasi `45 000` | Spasi bukan bagian dari angka | `45000` |


### Kolom yang terhubung ke data induk dosen

Beberapa kolom nama dosen tidak diketik bebas, melainkan dipilih dari daftar
yang berasal dari data induk dosen. Ketentuannya:

| Keadaan | Yang terjadi |
|---|---|
| Data induk sudah lengkap | Nama bisa dicari berdasarkan nama atau NIDN |
| Nama tidak ada di daftar | **Masih bisa diketik manual** — muncul penanda bahwa namanya tidak ada di data induk |
| Data induk diganti namanya | Isian lama **tidak ikut berubah** — nama tersimpan sebagai teks |

> Konsekuensi terakhir itu disengaja, supaya pengisian tabel tidak tersandera
> kelengkapan data induk. Tapi artinya: kalau ada dosen berganti nama, isian
> lama perlu diperiksa terpisah.


### Cara memastikan isian tersimpan

Setelah menekan simpan, ada dua tanda yang perlu diperiksa:

1. **Pesan berhasil** muncul di layar
2. **Muat ulang halaman** (tekan F5), lalu pastikan isian masih ada

Kalau isinya hilang setelah dimuat ulang, artinya penyimpanan gagal meski
tidak ada pesan galat. Yang perlu diperiksa: sambungan internet, dan apakah
sesi login masih aktif.


---

<a id="8-skema-basis-data"></a>

## 8. Skema Basis Data

Seluruh 23 tabel beserta 200 kolom datanya, apa artinya, dan bagaimana berhubungan

Basis data memuat **23 tabel** dengan total **200 kolom data**,
**53 relasi** antar tabel, dan **7 pilihan nilai tetap**.
Daftar di bawah dibaca langsung dari `prisma/schema.prisma`.

**Kolom data vs relasi.** Kolom data menyimpan isi sebenarnya (teks, angka,
tanggal). Relasi tidak menyimpan isi — ia hanya penunjuk ke baris di tabel
lain, dan yang tersimpan di database adalah id baris yang ditunjuk. Jadi kalau
ditotal, ada 253 bidang di seluruh tabel:
**200 kolom data** + **53 relasi**.

### Ringkasan tabel

| Tabel | Kolom | Relasi | Kegunaan |
|---|---:|---:|---|
| [`User`](#tabel-user) | 9 | 12 | Relations Modul LED + Penilaian (LAM INFOKOM 2.1) |
| [`Account`](#tabel-account) | 12 | 1 | Kaitan akun login (dipakai Auth.js) |
| [`Session`](#tabel-session) | 4 | 1 | Sesi login yang sedang aktif |
| [`VerificationToken`](#tabel-verificationtoken) | 3 | 0 | Token verifikasi milik Auth.js |
| [`Prodi`](#tabel-prodi) | 8 | 1 | Data program studi |
| [`TahunAkademik`](#tabel-tahunakademik) | 7 | 4 | Modul LED + Penilaian (LAM INFOKOM 2.1) |
| [`Dosen`](#tabel-dosen) | 11 | 0 | Data induk dosen |
| [`Tendik`](#tabel-tendik) | 10 | 0 | Data induk tenaga kependidikan |
| [`Mahasiswa`](#tabel-mahasiswa) | 9 | 0 | Data induk mahasiswa |
| [`MataKuliah`](#tabel-matakuliah) | 9 | 0 | Data induk mata kuliah |
| [`TabelDefinition`](#tabel-tabeldefinition) | 9 | 1 | Daftar 32 tabel LKPS beserta susunan kolomnya |
| [`TabelLkps`](#tabel-tabellkps) | 9 | 8 | Satu baris untuk tiap tabel LKPS per tahun akademik |
| [`TabelLkpsRow`](#tabel-tabellkpsrow) | 6 | 1 | Isi baris tabel LKPS (disimpan sebagai JSON) |
| [`Evidence`](#tabel-evidence) | 12 | 2 | Bukti pendukung untuk tabel LKPS |
| [`ValidationHistory`](#tabel-validationhistory) | 5 | 3 | Riwayat perpindahan status tabel |
| [`AuditLog`](#tabel-auditlog) | 10 | 1 | Catatan siapa mengubah apa |
| [`Notification`](#tabel-notification) | 7 | 2 | Pemberitahuan untuk pengguna |
| [`LedBagian`](#tabel-ledbagian) | 12 | 2 | Daftar 92 bagian narasi LED |
| [`LedIsian`](#tabel-ledisian) | 8 | 5 | Isi narasi tiap bagian LED |
| [`LedEvidence`](#tabel-ledevidence) | 10 | 2 | Bukti pendukung untuk bagian LED |
| [`ButirPenilaian`](#tabel-butirpenilaian) | 15 | 2 | Daftar 82 butir penilaian beserta bobotnya |
| [`PenilaianSesi`](#tabel-penilaiansesi) | 8 | 2 | Satu sesi penilaian |
| [`SkorPenilaian`](#tabel-skorpenilaian) | 7 | 3 | Skor tiap butir dalam sebuah sesi penilaian |


### Pilihan nilai tetap (enum)

Nilai yang hanya boleh dipilih dari daftar tertentu. Dipakai database untuk menolak nilai yang tidak dikenal.

| Enum | Jumlah nilai | Nilai yang boleh |
|---|---:|---|
| `Role` | 3 | `ADMIN`, `OPERATOR`, `PIMPINAN` |
| `TabelStatus` | 5 | `DRAFT`, `DIAJUKAN`, `DIREVISI`, `DISETUJUI`, `DITOLAK` |
| `ValidationAction` | 4 | `SUBMIT`, `APPROVE`, `REJECT`, `REVISE` |
| `NotificationType` | 4 | `INFO`, `WARNING`, `SUCCESS`, `ERROR` |
| `LedJenis` | 4 | `NARASI // isian teks/markdown`, `KRITERIA // 6 kriteria PPEPP`, `SUPLEMEN // 4 bagian suplemen prodi`, `IDENTITAS // identitas pengusul / tim penyusun` |
| `LedStatus` | 5 | `KOSONG`, `DRAFT`, `LENGKAP`, `DIAJUKAN`, `DISETUJUI` |
| `JenisPenilaian` | 3 | `INPUT // I`, `PROSES // P`, `OUTPUT // O` |


### Penjelasan tiap tabel


<a id="tabel-user"></a>

#### Tabel `User`

Relations Modul LED + Penilaian (LAM INFOKOM 2.1)

**Kegunaan.** Akun pengguna aplikasi

**Kolom (9):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `name` | `String` |  |
| `email` | `String` | Harus unik |
| `emailVerified` | `DateTime?` | Boleh kosong |
| `password` | `String` | bcrypt hashed |
| `image` | `String?` | Boleh kosong |
| `isActive` | `Boolean` | Bawaan: true |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (12):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `role` | satu `Role` | Satu baris ini terkait satu baris di sana |
| `accounts` | banyak `Account` | Satu baris ini punya banyak baris di sana |
| `sessions` | banyak `Session` | Satu baris ini punya banyak baris di sana |
| `auditLogs` | banyak `AuditLog` | Satu baris ini punya banyak baris di sana |
| `notifications` | banyak `Notification` | Satu baris ini punya banyak baris di sana |
| `submittedTabels` | banyak `TabelLkps` | Satu baris ini punya banyak baris di sana |
| `validatedTabels` | banyak `TabelLkps` | Satu baris ini punya banyak baris di sana |
| `validationHistory` | banyak `ValidationHistory` | Satu baris ini punya banyak baris di sana |
| `uploadedEvidence` | banyak `Evidence` | Satu baris ini punya banyak baris di sana |
| `ledIsianUpdated` | banyak `LedIsian` | Satu baris ini punya banyak baris di sana |
| `ledEvidenceUploaded` | banyak `LedEvidence` | Satu baris ini punya banyak baris di sana |
| `skorDinilai` | banyak `SkorPenilaian` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.user.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.user.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-account"></a>

#### Tabel `Account`

**Kegunaan.** Kaitan akun login (dipakai Auth.js)

**Kolom (12):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `userId` | `String` |  |
| `type` | `String` |  |
| `provider` | `String` |  |
| `providerAccountId` | `String` |  |
| `refresh_token` | `String?` | Boleh kosong |
| `access_token` | `String?` | Boleh kosong |
| `expires_at` | `Int?` | Boleh kosong |
| `token_type` | `String?` | Boleh kosong |
| `scope` | `String?` | Boleh kosong |
| `id_token` | `String?` | Boleh kosong |
| `session_state` | `String?` | Boleh kosong |

**Hubungan ke tabel lain (1):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `user` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.account.findMany({
  take: 10,
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.account.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-session"></a>

#### Tabel `Session`

**Kegunaan.** Sesi login yang sedang aktif

**Kolom (4):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `sessionToken` | `String` | Harus unik |
| `userId` | `String` |  |
| `expires` | `DateTime` |  |

**Hubungan ke tabel lain (1):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `user` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.session.findMany({
  take: 10,
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.session.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-verificationtoken"></a>

#### Tabel `VerificationToken`

**Kegunaan.** Token verifikasi milik Auth.js

**Kolom (3):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `identifier` | `String` |  |
| `token` | `String` | Harus unik |
| `expires` | `DateTime` |  |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.verificationToken.findMany({
  take: 10,
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.verificationToken.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-prodi"></a>

#### Tabel `Prodi`

**Kegunaan.** Data program studi

**Kolom (8):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `nama` | `String` | "Ilmu Komputer" |
| `jenjang` | `String` | "S1" |
| `kode` | `String` | "55201" |
| `fakultas` | `String` | "Fakultas Keguruan dan Ilmu Pendidikan" |
| `isActive` | `Boolean` | Bawaan: true |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (1):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `tahunAkademik` | banyak `TahunAkademik` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.prodi.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.prodi.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-tahunakademik"></a>

#### Tabel `TahunAkademik`

Modul LED + Penilaian (LAM INFOKOM 2.1)

**Kegunaan.** Daftar tahun akademik; satu ditandai aktif

**Kolom (7):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `tahun` | `String` | "2024/2025" |
| `semester` | `String` | "Ganjil" \| "Genap" |
| `isActive` | `Boolean` | Bawaan: false |
| `prodiId` | `String` |  |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (4):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `prodi` | satu `Prodi` | Satu baris ini terkait satu baris di sana |
| `tabelLkps` | banyak `TabelLkps` | Satu baris ini punya banyak baris di sana |
| `ledIsian` | banyak `LedIsian` | Satu baris ini punya banyak baris di sana |
| `penilaianSesi` | banyak `PenilaianSesi` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.tahunAkademik.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.tahunAkademik.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-dosen"></a>

#### Tabel `Dosen`

**Kegunaan.** Data induk dosen

**Kolom (11):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `nidn` | `String` | Harus unik |
| `nama` | `String` |  |
| `jabatanFungsional` | `String?` | "Lektor", "Lektor Kepala", "Guru Besar" |
| `pendidikanTerakhir` | `String` | "S2", "S3" |
| `bidangKeahlian` | `String?` | Boleh kosong |
| `status` | `String` | "Tetap" \| "Tidak Tetap" |
| `jenisKelamin` | `String` | "L" \| "P" |
| `isActive` | `Boolean` | Bawaan: true |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.dosen.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.dosen.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-tendik"></a>

#### Tabel `Tendik`

**Kegunaan.** Data induk tenaga kependidikan

**Kolom (10):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `nip` | `String` | Harus unik |
| `nama` | `String` |  |
| `jabatan` | `String?` | Boleh kosong |
| `pendidikanTerakhir` | `String` |  |
| `status` | `String` | Bawaan: "Aktif" |
| `jenisKelamin` | `String` |  |
| `isActive` | `Boolean` | Bawaan: true |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.tendik.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.tendik.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-mahasiswa"></a>

#### Tabel `Mahasiswa`

**Kegunaan.** Data induk mahasiswa

**Kolom (9):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `nim` | `String` | Harus unik |
| `nama` | `String` |  |
| `angkatan` | `Int` | 2020, 2021, ... |
| `status` | `String` | "Aktif", "Cuti", "Lulus", "DO" |
| `jenisKelamin` | `String` |  |
| `isActive` | `Boolean` | Bawaan: true |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.mahasiswa.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.mahasiswa.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-matakuliah"></a>

#### Tabel `MataKuliah`

**Kegunaan.** Data induk mata kuliah

**Kolom (9):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `kode` | `String` | Harus unik |
| `nama` | `String` |  |
| `sks` | `Int` |  |
| `semester` | `Int` | 1-8 |
| `kategori` | `String?` | "Wajib", "Pilihan" |
| `isActive` | `Boolean` | Bawaan: true |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.mataKuliah.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.mataKuliah.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-tabeldefinition"></a>

#### Tabel `TabelDefinition`

**Kegunaan.** Daftar 32 tabel LKPS beserta susunan kolomnya

**Kolom (9):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `kode` | `String` | "1.A.1", "2.B.3", etc. |
| `nama` | `String` | "Pimpinan dan Tupoksi UPPS dan PS" |
| `bab` | `Int` | 1-6 |
| `urutan` | `Int` | Urutan dalam BAB |
| `deskripsi` | `String?` | Boleh kosong |
| `kolomDefinitions` | `Json` | Array of column definitions |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (1):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `tabelLkps` | banyak `TabelLkps` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.tabelDefinition.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.tabelDefinition.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-tabellkps"></a>

#### Tabel `TabelLkps`

**Kegunaan.** Satu baris untuk tiap tabel LKPS per tahun akademik

**Kolom (9):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `tabelDefinitionId` | `String` |  |
| `tahunAkademikId` | `String` |  |
| `submittedById` | `String?` | Boleh kosong |
| `submittedAt` | `DateTime?` | Boleh kosong |
| `validatedById` | `String?` | Boleh kosong |
| `validatedAt` | `DateTime?` | Boleh kosong |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (8):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `status` | satu `TabelStatus` | Satu baris ini terkait satu baris di sana |
| `tabelDefinition` | satu `TabelDefinition` | Satu baris ini terkait satu baris di sana |
| `tahunAkademik` | satu `TahunAkademik` | Satu baris ini terkait satu baris di sana |
| `submittedBy` | satu `User` | Satu baris ini terkait satu baris di sana |
| `validatedBy` | satu `User` | Satu baris ini terkait satu baris di sana |
| `rows` | banyak `TabelLkpsRow` | Satu baris ini punya banyak baris di sana |
| `evidence` | banyak `Evidence` | Satu baris ini punya banyak baris di sana |
| `validationHistory` | banyak `ValidationHistory` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.tabelLkps.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.tabelLkps.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-tabellkpsrow"></a>

#### Tabel `TabelLkpsRow`

**Kegunaan.** Isi baris tabel LKPS (disimpan sebagai JSON)

**Kolom (6):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `tabelLkpsId` | `String` |  |
| `rowOrder` | `Int` |  |
| `rowData` | `Json` | Dynamic column data |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (1):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `tabelLkps` | satu `TabelLkps` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.tabelLkpsRow.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.tabelLkpsRow.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-evidence"></a>

#### Tabel `Evidence`

**Kegunaan.** Bukti pendukung untuk tabel LKPS

**Kolom (12):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `tabelLkpsId` | `String` |  |
| `filename` | `String` | Original filename (for uploaded files) or "Link Drive" for links |
| `minioKey` | `String?` | Object key in MinIO (null for links) |
| `mimeType` | `String?` | "application/pdf", "image/jpeg", etc. (null for links) |
| `size` | `Int?` | File size in bytes (null for links) |
| `linkUrl` | `String?` | External URL (Google Drive, image URL, etc.) |
| `version` | `Int` | Bawaan: 1 |
| `description` | `String?` | Boleh kosong |
| `uploadedById` | `String` |  |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (2):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `tabelLkps` | satu `TabelLkps` | Satu baris ini terkait satu baris di sana |
| `uploadedBy` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.evidence.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.evidence.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-validationhistory"></a>

#### Tabel `ValidationHistory`

**Kegunaan.** Riwayat perpindahan status tabel

**Kolom (5):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `tabelLkpsId` | `String` |  |
| `userId` | `String` |  |
| `comment` | `String?` | Boleh kosong |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |

**Hubungan ke tabel lain (3):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `action` | satu `ValidationAction` | Satu baris ini terkait satu baris di sana |
| `tabelLkps` | satu `TabelLkps` | Satu baris ini terkait satu baris di sana |
| `user` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.validationHistory.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.validationHistory.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-auditlog"></a>

#### Tabel `AuditLog`

**Kegunaan.** Catatan siapa mengubah apa

**Kolom (10):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `userId` | `String?` | Boleh kosong |
| `action` | `String` | "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT" |
| `entity` | `String` | "User", "TabelLkps", "Dosen", etc. |
| `entityId` | `String?` | ID of affected entity |
| `oldValue` | `Json?` | Previous value |
| `newValue` | `Json?` | New value |
| `ipAddress` | `String?` | Boleh kosong |
| `userAgent` | `String?` | Boleh kosong |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |

**Hubungan ke tabel lain (1):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `user` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.auditLog.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.auditLog.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-notification"></a>

#### Tabel `Notification`

**Kegunaan.** Pemberitahuan untuk pengguna

**Kolom (7):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `userId` | `String` |  |
| `title` | `String` |  |
| `message` | `String` |  |
| `isRead` | `Boolean` | Bawaan: false |
| `link` | `String?` | URL to navigate to |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |

**Hubungan ke tabel lain (2):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `type` | satu `NotificationType` | Satu baris ini terkait satu baris di sana |
| `user` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.notification.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.notification.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-ledbagian"></a>

#### Tabel `LedBagian`

**Kegunaan.** Daftar 92 bagian narasi LED

**Kolom (12):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `kode` | `String` | "BAB1.A", "BAB2.C.1.1.A", "BAB2.D.1" |
| `bab` | `String` | "I" \| "II" \| "III" |
| `bagian` | `String` | "A" \| "B" \| "C" \| "D" \| "-" |
| `subBagian` | `String?` | Boleh kosong |
| `judul` | `String` |  |
| `petunjuk` | `String?` | teks panduan asli dari instrumen PDF |
| `kriteria` | `Int?` | 1-6 untuk KRITERIA |
| `tahapPpepp` | `String?` | "PENETAPAN" \| "PELAKSANAAN" \| ... untuk KRITERIA |
| `subButir` | `String?` | "A" \| "B" \| "C" \| "D" |
| `urutan` | `Int` |  |
| `batasHalaman` | `Int?` | maks halaman per bagian (Lampiran 2) |

**Hubungan ke tabel lain (2):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `jenis` | satu `LedJenis` | Satu baris ini terkait satu baris di sana |
| `isian` | banyak `LedIsian` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.ledBagian.findMany({
  take: 10,
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.ledBagian.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-ledisian"></a>

#### Tabel `LedIsian`

**Kegunaan.** Isi narasi tiap bagian LED

**Kolom (8):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `ledBagianId` | `String` |  |
| `tahunAkademikId` | `String` |  |
| `konten` | `String` | Markdown |
| `jumlahKarakter` | `Int` | Bawaan: 0 |
| `updatedById` | `String?` | Boleh kosong |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (5):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `status` | satu `LedStatus` | Satu baris ini terkait satu baris di sana |
| `ledBagian` | satu `LedBagian` | Satu baris ini terkait satu baris di sana |
| `tahunAkademik` | satu `TahunAkademik` | Satu baris ini terkait satu baris di sana |
| `updatedBy` | satu `User` | Satu baris ini terkait satu baris di sana |
| `evidence` | banyak `LedEvidence` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.ledIsian.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.ledIsian.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-ledevidence"></a>

#### Tabel `LedEvidence`

**Kegunaan.** Bukti pendukung untuk bagian LED

**Kolom (10):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `ledIsianId` | `String` |  |
| `filename` | `String` |  |
| `minioKey` | `String?` | Boleh kosong |
| `mimeType` | `String?` | Boleh kosong |
| `size` | `Int?` | Boleh kosong |
| `linkUrl` | `String?` | Boleh kosong |
| `keterangan` | `String?` | Boleh kosong |
| `uploadedById` | `String` |  |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |

**Hubungan ke tabel lain (2):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `ledIsian` | satu `LedIsian` | Satu baris ini terkait satu baris di sana |
| `uploadedBy` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.ledEvidence.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.ledEvidence.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-butirpenilaian"></a>

#### Tabel `ButirPenilaian`

**Kegunaan.** Daftar 82 butir penilaian beserta bobotnya

**Kolom (15):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `kode` | `String` | "1.1.A", "2.2.D", "6.3", "SUP.3" |
| `kriteria` | `String` | "KE" \| "PU" \| "C1".."C6" \| "SUP" |
| `namaKriteria` | `String` |  |
| `tahapPpepp` | `String?` | Boleh kosong |
| `subButir` | `String?` | "A" \| "B" \| "C" \| "D" |
| `elemenPenilaian` | `String` |  |
| `deskriptor` | `String` |  |
| `skor1` | `String` |  |
| `skor2` | `String` |  |
| `skor3` | `String` |  |
| `skor4` | `String` |  |
| `syaratUnggul` | `String?` | Boleh kosong |
| `bobot` | `Float` | 2,0 - 30,0 |
| `urutan` | `Int` |  |

**Hubungan ke tabel lain (2):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `jenis` | satu `JenisPenilaian` | Satu baris ini terkait satu baris di sana |
| `skor` | banyak `SkorPenilaian` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.butirPenilaian.findMany({
  take: 10,
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.butirPenilaian.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-penilaiansesi"></a>

#### Tabel `PenilaianSesi`

**Kegunaan.** Satu sesi penilaian

**Kolom (8):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `tahunAkademikId` | `String` |  |
| `catatan` | `String?` | Boleh kosong |
| `finalisasi` | `Boolean` | Bawaan: false |
| `nilaiAkhir` | `Float?` | Boleh kosong |
| `statusPrediksi` | `String?` | "TIDAK_TERAKREDITASI" \| "TERAKREDITASI" \| "UNGGUL_3TH" \| "UNGGUL_5TH" |
| `createdAt` | `DateTime` | Diisi otomatis saat dibuat |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (2):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `tahunAkademik` | satu `TahunAkademik` | Satu baris ini terkait satu baris di sana |
| `skor` | banyak `SkorPenilaian` | Satu baris ini punya banyak baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.penilaianSesi.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.penilaianSesi.findUnique({
  where: { id: "..." },
});
```


<a id="tabel-skorpenilaian"></a>

#### Tabel `SkorPenilaian`

**Kegunaan.** Skor tiap butir dalam sebuah sesi penilaian

**Kolom (7):**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `String` | Kunci utama |
| `penilaianSesiId` | `String` |  |
| `butirPenilaianId` | `String` |  |
| `skor` | `Int?` | 1-4, null = belum dinilai |
| `catatanBukti` | `String?` | Boleh kosong |
| `dinilaiOlehId` | `String?` | Boleh kosong |
| `updatedAt` | `DateTime` |  |

**Hubungan ke tabel lain (3):**

| Kolom | Menunjuk ke | Artinya |
|---|---|---|
| `penilaianSesi` | satu `PenilaianSesi` | Satu baris ini terkait satu baris di sana |
| `butirPenilaian` | satu `ButirPenilaian` | Satu baris ini terkait satu baris di sana |
| `dinilaiOleh` | satu `User` | Satu baris ini terkait satu baris di sana |

**Contoh mengaksesnya:**

```ts
// Mengambil daftar
const daftar = await db.skorPenilaian.findMany({
  take: 10,
});

// Mengambil satu baris berdasarkan kunci utama
const satu = await db.skorPenilaian.findUnique({
  where: { id: "..." },
});
```


---

<a id="9-referensi-halaman"></a>

## 9. Referensi Halaman

Seluruh 73 halaman: alamat, berkas, data yang diambil, dan komponennya

Ada **73 halaman** di aplikasi ini. Tiap halaman menempati satu
berkas `page.tsx`. Daftar di bawah dibaca langsung dari isi folder `app/`.


### Daftar seluruh halaman

| Alamat | Berkas | Baris | Judul |
|---|---|---:|---|
| [`/login`](#halaman-login)` | `app/(auth)/login/page.tsx` | 89 | Masuk - SIM-LKPS |
| [`/dashboard`](#halaman-dashboard)` | `app/(dashboard)/dashboard/page.tsx` | 167 | Dashboard |
| [`/developer`](#halaman-developer)` | `app/(dashboard)/developer/page.tsx` | 140 | Tentang Developer |
| [`/evidence`](#halaman-evidence)` | `app/(dashboard)/evidence/page.tsx` | 60 | Bukti Pendukung \| SIM-LKPS |
| [`/forbidden`](#halaman-forbidden)` | `app/(dashboard)/forbidden/page.tsx` | 21 | — |
| [`/laporan`](#halaman-laporan)` | `app/(dashboard)/laporan/page.tsx` | 107 | Laporan LKPS |
| [`/led/bab-1`](#halaman-ledbab-1)` | `app/(dashboard)/led/bab-1/page.tsx` | 46 | LED — BAB I Pendahuluan |
| [`/led/bab-2/kondisi-eksternal`](#halaman-ledbab-2kondisi-eksternal)` | `app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx` | 42 | LED — Kondisi Eksternal |
| [`/led/bab-2/kriteria/[nomor]`](#halaman-ledbab-2kriterianomor)` | `app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx` | 82 | LED — Kriteria |
| [`/led/bab-2`](#halaman-ledbab-2)` | `app/(dashboard)/led/bab-2/page.tsx` | 139 | LED — BAB II Laporan Evaluasi Diri |
| [`/led/bab-2/profil`](#halaman-ledbab-2profil)` | `app/(dashboard)/led/bab-2/profil/page.tsx` | 48 | LED — Profil UPPS & Program Studi |
| [`/led/bab-2/suplemen`](#halaman-ledbab-2suplemen)` | `app/(dashboard)/led/bab-2/suplemen/page.tsx` | 45 | LED — Suplemen Program Studi |
| [`/led/bab-3`](#halaman-ledbab-3)` | `app/(dashboard)/led/bab-3/page.tsx` | 42 | LED — BAB III Penutup |
| [`/led/export`](#halaman-ledexport)` | `app/(dashboard)/led/export/page.tsx` | 218 | Export LED |
| [`/led`](#halaman-led)` | `app/(dashboard)/led/page.tsx` | 219 | Laporan Evaluasi Diri |
| [`/lkps/kriteria-1`](#halaman-lkpskriteria-1)` | `app/(dashboard)/lkps/kriteria-1/page.tsx` | 186 | Kriteria 1 — Budaya Mutu |
| [`/lkps/kriteria-1/tabel-1a1`](#halaman-lkpskriteria-1tabel-1a1)` | `app/(dashboard)/lkps/kriteria-1/tabel-1a1/page.tsx` | 135 | Tabel 1.A.1 — Pimpinan dan Tupoksi UPPS dan PS |
| [`/lkps/kriteria-1/tabel-1a2`](#halaman-lkpskriteria-1tabel-1a2)` | `app/(dashboard)/lkps/kriteria-1/tabel-1a2/page.tsx` | 137 | Tabel 1.A.2 — Sumber Pendanaan UPPS/PS |
| [`/lkps/kriteria-1/tabel-1a3`](#halaman-lkpskriteria-1tabel-1a3)` | `app/(dashboard)/lkps/kriteria-1/tabel-1a3/page.tsx` | 225 | Tabel 1.A.3 — Penggunaan Dana UPPS/PS |
| [`/lkps/kriteria-1/tabel-1a4`](#halaman-lkpskriteria-1tabel-1a4)` | `app/(dashboard)/lkps/kriteria-1/tabel-1a4/page.tsx` | 165 | Tabel 1.A.4 — Rata-rata Beban DTPR per Semester (EWMP) |
| [`/lkps/kriteria-1/tabel-1a5`](#halaman-lkpskriteria-1tabel-1a5)` | `app/(dashboard)/lkps/kriteria-1/tabel-1a5/page.tsx` | 160 | Tabel 1.A.5 — Kualifikasi Tenaga Kependidikan |
| [`/lkps/kriteria-1/tabel-1b`](#halaman-lkpskriteria-1tabel-1b)` | `app/(dashboard)/lkps/kriteria-1/tabel-1b/page.tsx` | 160 | Tabel 1.B — Unit SPMI dan SDM |
| [`/lkps/kriteria-2`](#halaman-lkpskriteria-2)` | `app/(dashboard)/lkps/kriteria-2/page.tsx` | 191 | Kriteria 2 — Relevansi Pendidikan |
| [`/lkps/kriteria-2/tabel-2a1`](#halaman-lkpskriteria-2tabel-2a1)` | `app/(dashboard)/lkps/kriteria-2/tabel-2a1/page.tsx` | 165 | Tabel 2.A.1 — Data Mahasiswa |
| [`/lkps/kriteria-2/tabel-2a2`](#halaman-lkpskriteria-2tabel-2a2)` | `app/(dashboard)/lkps/kriteria-2/tabel-2a2/page.tsx` | 107 | Tabel 2.A.2 — Keragaman Asal Mahasiswa |
| [`/lkps/kriteria-2/tabel-2a3`](#halaman-lkpskriteria-2tabel-2a3)` | `app/(dashboard)/lkps/kriteria-2/tabel-2a3/page.tsx` | 104 | Tabel 2.A.3 — Kondisi Jumlah Mahasiswa |
| [`/lkps/kriteria-2/tabel-2b1`](#halaman-lkpskriteria-2tabel-2b1)` | `app/(dashboard)/lkps/kriteria-2/tabel-2b1/page.tsx` | 66 | Tabel 2.B.1 — Isi Pembelajaran |
| [`/lkps/kriteria-2/tabel-2b2`](#halaman-lkpskriteria-2tabel-2b2)` | `app/(dashboard)/lkps/kriteria-2/tabel-2b2/page.tsx` | 63 | Tabel 2.B.2 — Pemetaan CPL dan PL |
| [`/lkps/kriteria-2/tabel-2b3`](#halaman-lkpskriteria-2tabel-2b3)` | `app/(dashboard)/lkps/kriteria-2/tabel-2b3/page.tsx` | 63 | Tabel 2.B.3 — Peta Pemenuhan CPL |
| [`/lkps/kriteria-2/tabel-2b4`](#halaman-lkpskriteria-2tabel-2b4)` | `app/(dashboard)/lkps/kriteria-2/tabel-2b4/page.tsx` | 204 | Tabel 2.B.4 — Rata-rata Masa Tunggu Lulusan |
| [`/lkps/kriteria-2/tabel-2b5`](#halaman-lkpskriteria-2tabel-2b5)` | `app/(dashboard)/lkps/kriteria-2/tabel-2b5/page.tsx` | 136 | Tabel 2.B.5 — Kesesuaian Bidang Kerja Lulusan |
| [`/lkps/kriteria-2/tabel-2b6`](#halaman-lkpskriteria-2tabel-2b6)` | `app/(dashboard)/lkps/kriteria-2/tabel-2b6/page.tsx` | 98 | Tabel 2.B.6 — Kepuasan Pengguna Lulusan |
| [`/lkps/kriteria-2/tabel-2c`](#halaman-lkpskriteria-2tabel-2c)` | `app/(dashboard)/lkps/kriteria-2/tabel-2c/page.tsx` | 134 | Tabel 2.C — Fleksibilitas Dalam Proses Pembelajaran |
| [`/lkps/kriteria-2/tabel-2d`](#halaman-lkpskriteria-2tabel-2d)` | `app/(dashboard)/lkps/kriteria-2/tabel-2d/page.tsx` | 133 | Tabel 2.D — Rekognisi dan Apresiasi Kompetensi Lulusan |
| [`/lkps/kriteria-3`](#halaman-lkpskriteria-3)` | `app/(dashboard)/lkps/kriteria-3/page.tsx` | 186 | Kriteria 3 — Relevansi Penelitian |
| [`/lkps/kriteria-3/tabel-3a1`](#halaman-lkpskriteria-3tabel-3a1)` | `app/(dashboard)/lkps/kriteria-3/tabel-3a1/page.tsx` | 132 | Tabel 3.A.1 — Sarana dan Prasarana Penelitian |
| [`/lkps/kriteria-3/tabel-3a2`](#halaman-lkpskriteria-3tabel-3a2)` | `app/(dashboard)/lkps/kriteria-3/tabel-3a2/page.tsx` | 155 | Tabel 3.A.2 — Penelitian DTPR, Hibah, dan Pembiayaan |
| [`/lkps/kriteria-3/tabel-3a3`](#halaman-lkpskriteria-3tabel-3a3)` | `app/(dashboard)/lkps/kriteria-3/tabel-3a3/page.tsx` | 148 | Tabel 3.A.3 — Pengembangan DTPR di Bidang Penelitian |
| [`/lkps/kriteria-3/tabel-3c1`](#halaman-lkpskriteria-3tabel-3c1)` | `app/(dashboard)/lkps/kriteria-3/tabel-3c1/page.tsx` | 150 | Tabel 3.C.1 — Kerja Sama Penelitian |
| [`/lkps/kriteria-3/tabel-3c2`](#halaman-lkpskriteria-3tabel-3c2)` | `app/(dashboard)/lkps/kriteria-3/tabel-3c2/page.tsx` | 153 | Tabel 3.C.2 — Publikasi Penelitian |
| [`/lkps/kriteria-3/tabel-3c3`](#halaman-lkpskriteria-3tabel-3c3)` | `app/(dashboard)/lkps/kriteria-3/tabel-3c3/page.tsx` | 149 | Tabel 3.C.3 — Perolehan HKI Penelitian |
| [`/lkps/kriteria-4`](#halaman-lkpskriteria-4)` | `app/(dashboard)/lkps/kriteria-4/page.tsx` | 181 | Kriteria 4 — Relevansi PkM |
| [`/lkps/kriteria-4/tabel-4a1`](#halaman-lkpskriteria-4tabel-4a1)` | `app/(dashboard)/lkps/kriteria-4/tabel-4a1/page.tsx` | 149 | Tabel 4.A.1 — Sarana dan Prasarana PkM |
| [`/lkps/kriteria-4/tabel-4a2`](#halaman-lkpskriteria-4tabel-4a2)` | `app/(dashboard)/lkps/kriteria-4/tabel-4a2/page.tsx` | 154 | Tabel 4.A.2 — PkM DTPR, Hibah, dan Pembiayaan |
| [`/lkps/kriteria-4/tabel-4c1`](#halaman-lkpskriteria-4tabel-4c1)` | `app/(dashboard)/lkps/kriteria-4/tabel-4c1/page.tsx` | 150 | Tabel 4.C.1 — Kerja Sama PkM |
| [`/lkps/kriteria-4/tabel-4c2`](#halaman-lkpskriteria-4tabel-4c2)` | `app/(dashboard)/lkps/kriteria-4/tabel-4c2/page.tsx` | 152 | Tabel 4.C.2 — Diseminasi Hasil PkM |
| [`/lkps/kriteria-4/tabel-4c3`](#halaman-lkpskriteria-4tabel-4c3)` | `app/(dashboard)/lkps/kriteria-4/tabel-4c3/page.tsx` | 152 | Tabel 4.C.3 — Perolehan HKI PkM |
| [`/lkps/kriteria-5-6`](#halaman-lkpskriteria-5-6)` | `app/(dashboard)/lkps/kriteria-5-6/page.tsx` | 230 | Kriteria 5 & 6 — Akuntabilitas & Diferensiasi Misi |
| [`/lkps/kriteria-5-6/tabel-51`](#halaman-lkpskriteria-5-6tabel-51)` | `app/(dashboard)/lkps/kriteria-5-6/tabel-51/page.tsx` | 124 | Tabel 5.1 — Sistem Tata Kelola |
| [`/lkps/kriteria-5-6/tabel-52`](#halaman-lkpskriteria-5-6tabel-52)` | `app/(dashboard)/lkps/kriteria-5-6/tabel-52/page.tsx` | 149 | Tabel 5.2 — Sarana dan Prasarana Pendidikan |
| [`/lkps/kriteria-6`](#halaman-lkpskriteria-6)` | `app/(dashboard)/lkps/kriteria-6/page.tsx` | 188 | Kriteria 6 — Diferensiasi Misi |
| [`/lkps/kriteria-6/tabel-61`](#halaman-lkpskriteria-6tabel-61)` | `app/(dashboard)/lkps/kriteria-6/tabel-61/page.tsx` | 160 | Tabel 6.1 — Visi Misi Tujuan |
| [`/lkps/kriteria-6/tabel-62`](#halaman-lkpskriteria-6tabel-62)` | `app/(dashboard)/lkps/kriteria-6/tabel-62/page.tsx` | 160 | Tabel 6.2 — Strategi Pencapaian |
| [`/lkps/submissions`](#halaman-lkpssubmissions)` | `app/(dashboard)/lkps/submissions/page.tsx` | 104 | Pengajuan Saya — Status Tabel LKPS |
| [`/lkps/validasi`](#halaman-lkpsvalidasi)` | `app/(dashboard)/lkps/validasi/page.tsx` | 104 | Validasi — Tabel Menunggu Review |
| [`/master/dosen/new`](#halaman-masterdosennew)` | `app/(dashboard)/master/dosen/new/page.tsx` | 259 | — |
| [`/master/dosen`](#halaman-masterdosen)` | `app/(dashboard)/master/dosen/page.tsx` | 115 | Master Data - Dosen |
| [`/master/mahasiswa/[id]/edit`](#halaman-mastermahasiswaidedit)` | `app/(dashboard)/master/mahasiswa/[id]/edit/page.tsx` | 21 | — |
| [`/master/mahasiswa/new`](#halaman-mastermahasiswanew)` | `app/(dashboard)/master/mahasiswa/new/page.tsx` | 6 | — |
| [`/master/mahasiswa`](#halaman-mastermahasiswa)` | `app/(dashboard)/master/mahasiswa/page.tsx` | 175 | Master Data - Mahasiswa |
| [`/master/mata-kuliah/[id]/edit`](#halaman-mastermata-kuliahidedit)` | `app/(dashboard)/master/mata-kuliah/[id]/edit/page.tsx` | 21 | — |
| [`/master/mata-kuliah/new`](#halaman-mastermata-kuliahnew)` | `app/(dashboard)/master/mata-kuliah/new/page.tsx` | 6 | — |
| [`/master/mata-kuliah`](#halaman-mastermata-kuliah)` | `app/(dashboard)/master/mata-kuliah/page.tsx` | 167 | Master Data - Mata Kuliah |
| [`/master`](#halaman-master)` | `app/(dashboard)/master/page.tsx` | 430 | Master Data |
| [`/master/prodi`](#halaman-masterprodi)` | `app/(dashboard)/master/prodi/page.tsx` | 28 | Master Data - Program Studi |
| [`/master/tahun-akademik`](#halaman-mastertahun-akademik)` | `app/(dashboard)/master/tahun-akademik/page.tsx` | 102 | Master Data - Tahun Akademik |
| [`/penilaian/butir/[kode]`](#halaman-penilaianbutirkode)` | `app/(dashboard)/penilaian/butir/[kode]/page.tsx` | 205 | Penilaian — Detail Butir |
| [`/penilaian/kriteria/[kode]`](#halaman-penilaiankriteriakode)` | `app/(dashboard)/penilaian/kriteria/[kode]/page.tsx` | 159 | Penilaian — Kriteria |
| [`/penilaian`](#halaman-penilaian)` | `app/(dashboard)/penilaian/page.tsx` | 199 | Matriks Penilaian |
| [`/settings/audit-log`](#halaman-settingsaudit-log)` | `app/(dashboard)/settings/audit-log/page.tsx` | 229 | Audit Log |
| [`/settings`](#halaman-settings)` | `app/(dashboard)/settings/page.tsx` | 6 | — |
| [`/settings/users`](#halaman-settingsusers)` | `app/(dashboard)/settings/users/page.tsx` | 92 | Manajemen User |
| [`/`](#halaman-)` | `app/page.tsx` | 14 | — |


### Penjelasan tiap halaman


<a id="halaman-login"></a>

#### Halaman `/login`

| | |
|---|---|
| **Berkas** | `app/(auth)/login/page.tsx` |
| **Alamat** | `/login` |
| **Ukuran** | 89 baris |
| **Judul tab** | Masuk - SIM-LKPS |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/forms/login-form`
- `components/shared/error-boundary`

**Pustaka luar:** `lucide-react`, `next`, `react`


<a id="halaman-dashboard"></a>

#### Halaman `/dashboard`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/dashboard/page.tsx` |
| **Alamat** | `/dashboard` |
| **Ukuran** | 167 baris |
| **Judul tab** | Dashboard |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `auditLog`
- `dosen`
- `evidence`
- `mahasiswa`
- `mataKuliah`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`
- `user`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `@prisma/client`, `next`


<a id="halaman-developer"></a>

#### Halaman `/developer`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/developer/page.tsx` |
| **Alamat** | `/developer` |
| **Ukuran** | 140 baris |
| **Judul tab** | Tentang Developer |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `next`


<a id="halaman-evidence"></a>

#### Halaman `/evidence`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/evidence/page.tsx` |
| **Alamat** | `/evidence` |
| **Ukuran** | 60 baris |
| **Judul tab** | Bukti Pendukung | SIM-LKPS |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `next`


<a id="halaman-forbidden"></a>

#### Halaman `/forbidden`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/forbidden/page.tsx` |
| **Alamat** | `/forbidden` |
| **Ukuran** | 21 baris |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `ForbiddenPage` | komponen default |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-laporan"></a>

#### Halaman `/laporan`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/laporan/page.tsx` |
| **Alamat** | `/laporan` |
| **Ukuran** | 107 baris |
| **Judul tab** | Laporan LKPS |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `@prisma/client`, `next`


<a id="halaman-ledbab-1"></a>

#### Halaman `/led/bab-1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/bab-1/page.tsx` |
| **Alamat** | `/led/bab-1` |
| **Ukuran** | 46 baris |
| **Judul tab** | LED — BAB I Pendahuluan |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedAccordion`
- `components/led/LedPageHeader`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-ledbab-2kondisi-eksternal"></a>

#### Halaman `/led/bab-2/kondisi-eksternal`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx` |
| **Alamat** | `/led/bab-2/kondisi-eksternal` |
| **Ukuran** | 42 baris |
| **Judul tab** | LED — Kondisi Eksternal |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedAccordion`
- `components/led/LedPageHeader`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-ledbab-2kriterianomor"></a>

#### Halaman `/led/bab-2/kriteria/[nomor]`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx` |
| **Alamat** | `/led/bab-2/kriteria/[nomor]` |
| **Ukuran** | 82 baris |
| **Judul tab** | LED — Kriteria |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedAccordion`
- `components/led/LedPageHeader`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-ledbab-2"></a>

#### Halaman `/led/bab-2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/bab-2/page.tsx` |
| **Alamat** | `/led/bab-2` |
| **Ukuran** | 139 baris |
| **Judul tab** | LED — BAB II Laporan Evaluasi Diri |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedPageHeader`
- `components/led/status`

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-ledbab-2profil"></a>

#### Halaman `/led/bab-2/profil`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/bab-2/profil/page.tsx` |
| **Alamat** | `/led/bab-2/profil` |
| **Ukuran** | 48 baris |
| **Judul tab** | LED — Profil UPPS & Program Studi |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedAccordion`
- `components/led/LedPageHeader`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-ledbab-2suplemen"></a>

#### Halaman `/led/bab-2/suplemen`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/bab-2/suplemen/page.tsx` |
| **Alamat** | `/led/bab-2/suplemen` |
| **Ukuran** | 45 baris |
| **Judul tab** | LED — Suplemen Program Studi |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedAccordion`
- `components/led/LedPageHeader`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-ledbab-3"></a>

#### Halaman `/led/bab-3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/bab-3/page.tsx` |
| **Alamat** | `/led/bab-3` |
| **Ukuran** | 42 baris |
| **Judul tab** | LED — BAB III Penutup |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedAccordion`
- `components/led/LedPageHeader`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-ledexport"></a>

#### Halaman `/led/export`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/export/page.tsx` |
| **Alamat** | `/led/export` |
| **Ukuran** | 218 baris |
| **Judul tab** | Export LED |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedExportDialog`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-led"></a>

#### Halaman `/led`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/led/page.tsx` |
| **Alamat** | `/led` |
| **Ukuran** | 219 baris |
| **Judul tab** | Laporan Evaluasi Diri |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/led/LedProgressCard`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-1"></a>

#### Halaman `/lkps/kriteria-1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-1/page.tsx` |
| **Alamat** | `/lkps/kriteria-1` |
| **Ukuran** | 186 baris |
| **Judul tab** | Kriteria 1 — Budaya Mutu |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-lkpskriteria-1tabel-1a1"></a>

#### Halaman `/lkps/kriteria-1/tabel-1a1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-1/tabel-1a1/page.tsx` |
| **Alamat** | `/lkps/kriteria-1/tabel-1a1` |
| **Ukuran** | 135 baris |
| **Judul tab** | Tabel 1.A.1 — Pimpinan dan Tupoksi UPPS dan PS |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-1tabel-1a2"></a>

#### Halaman `/lkps/kriteria-1/tabel-1a2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-1/tabel-1a2/page.tsx` |
| **Alamat** | `/lkps/kriteria-1/tabel-1a2` |
| **Ukuran** | 137 baris |
| **Judul tab** | Tabel 1.A.2 — Sumber Pendanaan UPPS/PS |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/tabel-1a2-client`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-1tabel-1a3"></a>

#### Halaman `/lkps/kriteria-1/tabel-1a3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-1/tabel-1a3/page.tsx` |
| **Alamat** | `/lkps/kriteria-1/tabel-1a3` |
| **Ukuran** | 225 baris |
| **Judul tab** | Tabel 1.A.3 — Penggunaan Dana UPPS/PS |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-1tabel-1a4"></a>

#### Halaman `/lkps/kriteria-1/tabel-1a4`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-1/tabel-1a4/page.tsx` |
| **Alamat** | `/lkps/kriteria-1/tabel-1a4` |
| **Ukuran** | 165 baris |
| **Judul tab** | Tabel 1.A.4 — Rata-rata Beban DTPR per Semester (EWMP) |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-1tabel-1a5"></a>

#### Halaman `/lkps/kriteria-1/tabel-1a5`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-1/tabel-1a5/page.tsx` |
| **Alamat** | `/lkps/kriteria-1/tabel-1a5` |
| **Ukuran** | 160 baris |
| **Judul tab** | Tabel 1.A.5 — Kualifikasi Tenaga Kependidikan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-1tabel-1b"></a>

#### Halaman `/lkps/kriteria-1/tabel-1b`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-1/tabel-1b/page.tsx` |
| **Alamat** | `/lkps/kriteria-1/tabel-1b` |
| **Ukuran** | 160 baris |
| **Judul tab** | Tabel 1.B — Unit SPMI dan SDM |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2"></a>

#### Halaman `/lkps/kriteria-2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/page.tsx` |
| **Alamat** | `/lkps/kriteria-2` |
| **Ukuran** | 191 baris |
| **Judul tab** | Kriteria 2 — Relevansi Pendidikan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2a1"></a>

#### Halaman `/lkps/kriteria-2/tabel-2a1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2a1/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2a1` |
| **Ukuran** | 165 baris |
| **Judul tab** | Tabel 2.A.1 — Data Mahasiswa |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2a2"></a>

#### Halaman `/lkps/kriteria-2/tabel-2a2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2a2/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2a2` |
| **Ukuran** | 107 baris |
| **Judul tab** | Tabel 2.A.2 — Keragaman Asal Mahasiswa |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2a3"></a>

#### Halaman `/lkps/kriteria-2/tabel-2a3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2a3/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2a3` |
| **Ukuran** | 104 baris |
| **Judul tab** | Tabel 2.A.3 — Kondisi Jumlah Mahasiswa |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2b1"></a>

#### Halaman `/lkps/kriteria-2/tabel-2b1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2b1/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2b1` |
| **Ukuran** | 66 baris |
| **Judul tab** | Tabel 2.B.1 — Isi Pembelajaran |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2b2"></a>

#### Halaman `/lkps/kriteria-2/tabel-2b2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2b2/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2b2` |
| **Ukuran** | 63 baris |
| **Judul tab** | Tabel 2.B.2 — Pemetaan CPL dan PL |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2b3"></a>

#### Halaman `/lkps/kriteria-2/tabel-2b3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2b3/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2b3` |
| **Ukuran** | 63 baris |
| **Judul tab** | Tabel 2.B.3 — Peta Pemenuhan CPL |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2b4"></a>

#### Halaman `/lkps/kriteria-2/tabel-2b4`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2b4/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2b4` |
| **Ukuran** | 204 baris |
| **Judul tab** | Tabel 2.B.4 — Rata-rata Masa Tunggu Lulusan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2b5"></a>

#### Halaman `/lkps/kriteria-2/tabel-2b5`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2b5/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2b5` |
| **Ukuran** | 136 baris |
| **Judul tab** | Tabel 2.B.5 — Kesesuaian Bidang Kerja Lulusan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2b6"></a>

#### Halaman `/lkps/kriteria-2/tabel-2b6`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2b6/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2b6` |
| **Ukuran** | 98 baris |
| **Judul tab** | Tabel 2.B.6 — Kepuasan Pengguna Lulusan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2c"></a>

#### Halaman `/lkps/kriteria-2/tabel-2c`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2c/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2c` |
| **Ukuran** | 134 baris |
| **Judul tab** | Tabel 2.C — Fleksibilitas Dalam Proses Pembelajaran |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-2tabel-2d"></a>

#### Halaman `/lkps/kriteria-2/tabel-2d`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-2/tabel-2d/page.tsx` |
| **Alamat** | `/lkps/kriteria-2/tabel-2d` |
| **Ukuran** | 133 baris |
| **Judul tab** | Tabel 2.D — Rekognisi dan Apresiasi Kompetensi Lulusan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-3"></a>

#### Halaman `/lkps/kriteria-3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-3/page.tsx` |
| **Alamat** | `/lkps/kriteria-3` |
| **Ukuran** | 186 baris |
| **Judul tab** | Kriteria 3 — Relevansi Penelitian |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-lkpskriteria-3tabel-3a1"></a>

#### Halaman `/lkps/kriteria-3/tabel-3a1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-3/tabel-3a1/page.tsx` |
| **Alamat** | `/lkps/kriteria-3/tabel-3a1` |
| **Ukuran** | 132 baris |
| **Judul tab** | Tabel 3.A.1 — Sarana dan Prasarana Penelitian |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-3tabel-3a2"></a>

#### Halaman `/lkps/kriteria-3/tabel-3a2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-3/tabel-3a2/page.tsx` |
| **Alamat** | `/lkps/kriteria-3/tabel-3a2` |
| **Ukuran** | 155 baris |
| **Judul tab** | Tabel 3.A.2 — Penelitian DTPR, Hibah, dan Pembiayaan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-3tabel-3a3"></a>

#### Halaman `/lkps/kriteria-3/tabel-3a3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-3/tabel-3a3/page.tsx` |
| **Alamat** | `/lkps/kriteria-3/tabel-3a3` |
| **Ukuran** | 148 baris |
| **Judul tab** | Tabel 3.A.3 — Pengembangan DTPR di Bidang Penelitian |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-3tabel-3c1"></a>

#### Halaman `/lkps/kriteria-3/tabel-3c1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-3/tabel-3c1/page.tsx` |
| **Alamat** | `/lkps/kriteria-3/tabel-3c1` |
| **Ukuran** | 150 baris |
| **Judul tab** | Tabel 3.C.1 — Kerja Sama Penelitian |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-3tabel-3c2"></a>

#### Halaman `/lkps/kriteria-3/tabel-3c2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-3/tabel-3c2/page.tsx` |
| **Alamat** | `/lkps/kriteria-3/tabel-3c2` |
| **Ukuran** | 153 baris |
| **Judul tab** | Tabel 3.C.2 — Publikasi Penelitian |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-3tabel-3c3"></a>

#### Halaman `/lkps/kriteria-3/tabel-3c3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-3/tabel-3c3/page.tsx` |
| **Alamat** | `/lkps/kriteria-3/tabel-3c3` |
| **Ukuran** | 149 baris |
| **Judul tab** | Tabel 3.C.3 — Perolehan HKI Penelitian |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-4"></a>

#### Halaman `/lkps/kriteria-4`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-4/page.tsx` |
| **Alamat** | `/lkps/kriteria-4` |
| **Ukuran** | 181 baris |
| **Judul tab** | Kriteria 4 — Relevansi PkM |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-lkpskriteria-4tabel-4a1"></a>

#### Halaman `/lkps/kriteria-4/tabel-4a1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-4/tabel-4a1/page.tsx` |
| **Alamat** | `/lkps/kriteria-4/tabel-4a1` |
| **Ukuran** | 149 baris |
| **Judul tab** | Tabel 4.A.1 — Sarana dan Prasarana PkM |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-4tabel-4a2"></a>

#### Halaman `/lkps/kriteria-4/tabel-4a2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-4/tabel-4a2/page.tsx` |
| **Alamat** | `/lkps/kriteria-4/tabel-4a2` |
| **Ukuran** | 154 baris |
| **Judul tab** | Tabel 4.A.2 — PkM DTPR, Hibah, dan Pembiayaan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-4tabel-4c1"></a>

#### Halaman `/lkps/kriteria-4/tabel-4c1`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-4/tabel-4c1/page.tsx` |
| **Alamat** | `/lkps/kriteria-4/tabel-4c1` |
| **Ukuran** | 150 baris |
| **Judul tab** | Tabel 4.C.1 — Kerja Sama PkM |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-4tabel-4c2"></a>

#### Halaman `/lkps/kriteria-4/tabel-4c2`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-4/tabel-4c2/page.tsx` |
| **Alamat** | `/lkps/kriteria-4/tabel-4c2` |
| **Ukuran** | 152 baris |
| **Judul tab** | Tabel 4.C.2 — Diseminasi Hasil PkM |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-4tabel-4c3"></a>

#### Halaman `/lkps/kriteria-4/tabel-4c3`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-4/tabel-4c3/page.tsx` |
| **Alamat** | `/lkps/kriteria-4/tabel-4c3` |
| **Ukuran** | 152 baris |
| **Judul tab** | Tabel 4.C.3 — Perolehan HKI PkM |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-5-6"></a>

#### Halaman `/lkps/kriteria-5-6`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-5-6/page.tsx` |
| **Alamat** | `/lkps/kriteria-5-6` |
| **Ukuran** | 230 baris |
| **Judul tab** | Kriteria 5 & 6 — Akuntabilitas & Diferensiasi Misi |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-lkpskriteria-5-6tabel-51"></a>

#### Halaman `/lkps/kriteria-5-6/tabel-51`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-5-6/tabel-51/page.tsx` |
| **Alamat** | `/lkps/kriteria-5-6/tabel-51` |
| **Ukuran** | 124 baris |
| **Judul tab** | Tabel 5.1 — Sistem Tata Kelola |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-5-6tabel-52"></a>

#### Halaman `/lkps/kriteria-5-6/tabel-52`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-5-6/tabel-52/page.tsx` |
| **Alamat** | `/lkps/kriteria-5-6/tabel-52` |
| **Ukuran** | 149 baris |
| **Judul tab** | Tabel 5.2 — Sarana dan Prasarana Pendidikan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-6"></a>

#### Halaman `/lkps/kriteria-6`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-6/page.tsx` |
| **Alamat** | `/lkps/kriteria-6` |
| **Ukuran** | 188 baris |
| **Judul tab** | Kriteria 6 — Diferensiasi Misi |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-6tabel-61"></a>

#### Halaman `/lkps/kriteria-6/tabel-61`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-6/tabel-61/page.tsx` |
| **Alamat** | `/lkps/kriteria-6/tabel-61` |
| **Ukuran** | 160 baris |
| **Judul tab** | Tabel 6.1 — Visi Misi Tujuan |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpskriteria-6tabel-62"></a>

#### Halaman `/lkps/kriteria-6/tabel-62`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/kriteria-6/tabel-62/page.tsx` |
| **Alamat** | `/lkps/kriteria-6/tabel-62` |
| **Ukuran** | 160 baris |
| **Judul tab** | Tabel 6.2 — Strategi Pencapaian |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelDefinition`
- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/shared/error-boundary`
- `components/tables/validation-history`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-lkpssubmissions"></a>

#### Halaman `/lkps/submissions`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/submissions/page.tsx` |
| **Alamat** | `/lkps/submissions` |
| **Ukuran** | 104 baris |
| **Judul tab** | Pengajuan Saya — Status Tabel LKPS |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelLkps`
- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `@prisma/client`, `next`


<a id="halaman-lkpsvalidasi"></a>

#### Halaman `/lkps/validasi`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/lkps/validasi/page.tsx` |
| **Alamat** | `/lkps/validasi` |
| **Ukuran** | 104 baris |
| **Judul tab** | Validasi — Tabel Menunggu Review |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tabelLkps`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-masterdosennew"></a>

#### Halaman `/master/dosen/new`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/dosen/new/page.tsx` |
| **Alamat** | `/master/dosen/new` |
| **Ukuran** | 259 baris |
| **Jenis** | berjalan di peramban |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `NewDosenPage` | komponen default |  |

**Pustaka luar:** `framer-motion`, `lucide-react`, `next`, `react`


<a id="halaman-masterdosen"></a>

#### Halaman `/master/dosen`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/dosen/page.tsx` |
| **Alamat** | `/master/dosen` |
| **Ukuran** | 115 baris |
| **Judul tab** | Master Data - Dosen |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-mastermahasiswaidedit"></a>

#### Halaman `/master/mahasiswa/[id]/edit`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/mahasiswa/[id]/edit/page.tsx` |
| **Alamat** | `/master/mahasiswa/[id]/edit` |
| **Ukuran** | 21 baris |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `mahasiswa`

**Pustaka luar:** `next`


<a id="halaman-mastermahasiswanew"></a>

#### Halaman `/master/mahasiswa/new`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/mahasiswa/new/page.tsx` |
| **Alamat** | `/master/mahasiswa/new` |
| **Ukuran** | 6 baris |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `NewMahasiswaPage` | komponen default |  |


<a id="halaman-mastermahasiswa"></a>

#### Halaman `/master/mahasiswa`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/mahasiswa/page.tsx` |
| **Alamat** | `/master/mahasiswa` |
| **Ukuran** | 175 baris |
| **Judul tab** | Master Data - Mahasiswa |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `mahasiswa`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-mastermata-kuliahidedit"></a>

#### Halaman `/master/mata-kuliah/[id]/edit`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/mata-kuliah/[id]/edit/page.tsx` |
| **Alamat** | `/master/mata-kuliah/[id]/edit` |
| **Ukuran** | 21 baris |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `mataKuliah`

**Pustaka luar:** `next`


<a id="halaman-mastermata-kuliahnew"></a>

#### Halaman `/master/mata-kuliah/new`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/mata-kuliah/new/page.tsx` |
| **Alamat** | `/master/mata-kuliah/new` |
| **Ukuran** | 6 baris |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `NewMataKuliahPage` | komponen default |  |


<a id="halaman-mastermata-kuliah"></a>

#### Halaman `/master/mata-kuliah`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/mata-kuliah/page.tsx` |
| **Alamat** | `/master/mata-kuliah` |
| **Ukuran** | 167 baris |
| **Judul tab** | Master Data - Mata Kuliah |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `mataKuliah`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-master"></a>

#### Halaman `/master`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/page.tsx` |
| **Alamat** | `/master` |
| **Ukuran** | 430 baris |
| **Judul tab** | Master Data |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `dosen`
- `mahasiswa`
- `prodi`
- `tahunAkademik`
- `user`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-masterprodi"></a>

#### Halaman `/master/prodi`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/prodi/page.tsx` |
| **Alamat** | `/master/prodi` |
| **Ukuran** | 28 baris |
| **Judul tab** | Master Data - Program Studi |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `prodi`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `next`


<a id="halaman-mastertahun-akademik"></a>

#### Halaman `/master/tahun-akademik`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/master/tahun-akademik/page.tsx` |
| **Alamat** | `/master/tahun-akademik` |
| **Ukuran** | 102 baris |
| **Judul tab** | Master Data - Tahun Akademik |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `tahunAkademik`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `lucide-react`, `next`


<a id="halaman-penilaianbutirkode"></a>

#### Halaman `/penilaian/butir/[kode]`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/penilaian/butir/[kode]/page.tsx` |
| **Alamat** | `/penilaian/butir/[kode]` |
| **Ukuran** | 205 baris |
| **Judul tab** | Penilaian — Detail Butir |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `butirPenilaian`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-penilaiankriteriakode"></a>

#### Halaman `/penilaian/kriteria/[kode]`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/penilaian/kriteria/[kode]/page.tsx` |
| **Alamat** | `/penilaian/kriteria/[kode]` |
| **Ukuran** | 159 baris |
| **Judul tab** | Penilaian — Kriteria |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-penilaian"></a>

#### Halaman `/penilaian`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/penilaian/page.tsx` |
| **Alamat** | `/penilaian` |
| **Ukuran** | 199 baris |
| **Judul tab** | Matriks Penilaian |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/penilaian/AksiFinalisasi`
- `components/penilaian/KriteriaBreakdown`
- `components/penilaian/StatusGauge`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-settingsaudit-log"></a>

#### Halaman `/settings/audit-log`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/settings/audit-log/page.tsx` |
| **Alamat** | `/settings/audit-log` |
| **Ukuran** | 229 baris |
| **Judul tab** | Audit Log |
| **Jenis** | berjalan di server |

**Data yang dibaca dari database:**

- `auditLog`

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-settings"></a>

#### Halaman `/settings`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/settings/page.tsx` |
| **Alamat** | `/settings` |
| **Ukuran** | 6 baris |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `SettingsPage` | komponen default |  |

**Pustaka luar:** `next`


<a id="halaman-settingsusers"></a>

#### Halaman `/settings/users`

| | |
|---|---|
| **Berkas** | `app/(dashboard)/settings/users/page.tsx` |
| **Alamat** | `/settings/users` |
| **Ukuran** | 92 baris |
| **Judul tab** | Manajemen User |
| **Jenis** | berjalan di server |

**Isi berkas:**

| Nama | Jenis | Keterangan |
|---|---|---|
| `metadata` | konstanta |  |

**Komponen tampilan yang dipakai:**

- `components/forms/create-user-dialog`
- `components/shared/error-boundary`
- `components/shared/permission-gate`
- `components/tables/user-table`

**Pustaka luar:** `@prisma/client`, `lucide-react`, `next`


<a id="halaman-"></a>

#### Halaman `/`

| | |
|---|---|
| **Berkas** | `app/page.tsx` |
| **Alamat** | `/` |
| **Ukuran** | 14 baris |
| **Jenis** | berjalan di server |

**Pustaka luar:** `next`


---

<a id="10-api-dan-server-action"></a>

## 10. API dan Server Action

9 titik akhir API dan 9 berkas server action


### Titik akhir API

Titik akhir API adalah pintu masuk dari luar aplikasi. Dipakai terutama untuk
unduhan berkas, karena unduhan membutuhkan alamat yang bisa dibuka langsung.

| Alamat | Metode | Berkas | Baris |
|---|---|---|---:|
| `/api/api/auth/[...nextauth]` | — | `app/api/auth/[...nextauth]/route.ts` | 4 |
| `/api/api/export/excel` | GET | `app/api/export/excel/route.ts` | 248 |
| `/api/api/export/led/pdf` | GET | `app/api/export/led/pdf/route.ts` | 89 |
| `/api/api/export/led/word` | GET | `app/api/export/led/word/route.ts` | 91 |
| `/api/api/export` | GET | `app/api/export/route.ts` | 181 |
| `/api/api/export/word` | GET | `app/api/export/word/route.ts` | 316 |
| `/api/api/health` | GET | `app/api/health/route.ts` | 21 |
| `/api/api/master/dosen` | POST, GET | `app/api/master/dosen/route.ts` | 116 |
| `/api/api/notifications` | GET | `app/api/notifications/route.ts` | 46 |


#### `/api/api/auth/[...nextauth]`

| | |
|---|---|
| **Berkas** | `app/api/auth/[...nextauth]/route.ts` |
| **Metode** | — |
| **Ukuran** | 4 baris |


#### `/api/api/export/excel`

| | |
|---|---|
| **Berkas** | `app/api/export/excel/route.ts` |
| **Metode** | GET |
| **Ukuran** | 248 baris |

**Tabel database yang disentuh:** `tabelDefinition`, `tabelLkps`, `tahunAkademik`


#### `/api/api/export/led/pdf`

| | |
|---|---|
| **Berkas** | `app/api/export/led/pdf/route.ts` |
| **Metode** | GET |
| **Ukuran** | 89 baris |


#### `/api/api/export/led/word`

| | |
|---|---|
| **Berkas** | `app/api/export/led/word/route.ts` |
| **Metode** | GET |
| **Ukuran** | 91 baris |


#### `/api/api/export`

| | |
|---|---|
| **Berkas** | `app/api/export/route.ts` |
| **Metode** | GET |
| **Ukuran** | 181 baris |

**Maksud berkas.** Export API Route Handles Excel, Word, PDF

**Tabel database yang disentuh:** `tahunAkademik`


#### `/api/api/export/word`

| | |
|---|---|
| **Berkas** | `app/api/export/word/route.ts` |
| **Metode** | GET |
| **Ukuran** | 316 baris |

**Tabel database yang disentuh:** `tabelDefinition`, `tabelLkps`, `tahunAkademik`


#### `/api/api/health`

| | |
|---|---|
| **Berkas** | `app/api/health/route.ts` |
| **Metode** | GET |
| **Ukuran** | 21 baris |


#### `/api/api/master/dosen`

| | |
|---|---|
| **Berkas** | `app/api/master/dosen/route.ts` |
| **Metode** | POST, GET |
| **Ukuran** | 116 baris |

**Tabel database yang disentuh:** `dosen`


#### `/api/api/notifications`

| | |
|---|---|
| **Berkas** | `app/api/notifications/route.ts` |
| **Metode** | GET |
| **Ukuran** | 46 baris |

**Tabel database yang disentuh:** `notification`


### Server Action

Server action adalah fungsi yang dipanggil langsung dari komponen. Berbeda
dengan API, tidak ada alamat yang perlu disepakati — pemanggil dan yang
dipanggil ada di proyek yang sama. **Semua pemeriksaan izin ada di sini.**


#### `lib/actions/auth.ts`

Ukuran: 139 baris.

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `LoginState` |  |
| `loginAction` | Server Action: Login with credentials. Flow: 1. Read email/password/callbackUrl from FormData 2. Validate with Zod (loginSchema) — strict email + min-6 password On invalid: return LoginState with fieldErrors, form shows error 3. Fire-and-forget audit log "LOGIN_ATTEMPT" (so we have a record even if credentials are wrong; success audit happens via session callback) 4. signIn with redirect:true + redirectTo=sanitized callbackUrl - On success: Next.js sets session cookie + throws NEXT_REDIRECT, client navigates to callbackUrl - On CredentialsSignin: catch → return LoginState - On AccessDenied: catch → return LoginState |
| `logoutAction` | Server Action: Logout |


#### `lib/actions/evidence.ts`

Ukuran: 306 baris.

**Tabel database:** `evidence`, `tabelDefinition`, `tabelLkps`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `uploadEvidence` |  |
| `getEvidenceList` |  |
| `deleteEvidence` |  |
| `addEvidenceLink` |  |
| `getTabelLkpsId` |  |


#### `lib/actions/led.ts`

Ukuran: 311 baris.

**Tabel database:** `ledBagian`, `ledEvidence`, `ledIsian`, `tahunAkademik`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `saveLedIsian` | SIMPAN NARASI (autosave) |
| `setLedStatus` | UBAH STATUS |
| `addLedEvidence` | BUKTI PENDUKUNG |
| `deleteLedEvidence` |  |


#### `lib/actions/lkps.ts`

Ukuran: 559 baris.

**Maksud berkas.** UPSERT / DELETE ROWS

**Tabel database:** `dosen`, `tabelDefinition`, `tabelLkps`, `tabelLkpsRow`, `user`, `validationHistory`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `upsertLkpsRow` | UPSERT / DELETE ROWS |
| `deleteLkpsRow` |  |
| `submitLkpsTabel` | SUBMIT — Operator mengirim tabel untuk divalidasi |
| `validateLkpsTabel` | VALIDATE — Validator menyetujui/menolak/meminta revisi |
| `createDosen` |  |
| `updateDosen` |  |
| `deleteDosen` |  |


#### `lib/actions/mahasiswa.ts`

Ukuran: 109 baris.

**Tabel database:** `mahasiswa`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `createMahasiswa` |  |
| `updateMahasiswa` |  |
| `deleteMahasiswa` |  |


#### `lib/actions/matakuliah.ts`

Ukuran: 109 baris.

**Tabel database:** `mataKuliah`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `createMatakuliah` |  |
| `updateMatakuliah` |  |
| `deleteMatakuliah` |  |


#### `lib/actions/notification.ts`

Ukuran: 129 baris.

**Tabel database:** `notification`, `user`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `createNotification` |  |
| `notifyMutation` |  |
| `markNotificationAsRead` |  |
| `markAllNotificationsAsRead` |  |


#### `lib/actions/penilaian.ts`

Ukuran: 333 baris.

**Maksud berkas.** SIMPAN SKOR

**Tabel database:** `butirPenilaian`, `penilaianSesi`, `skorPenilaian`, `tahunAkademik`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `setSkor` | SIMPAN SKOR |
| `setSkorBanyak` | Simpan banyak skor sekaligus (dipakai form per kriteria). |
| `finalisasiSesi` | Kunci penilaian + simpan nilai akhir & status. Ditolak kalau masih ada butir yang belum dinilai (Edge Case §7). |
| `bukaKembaliSesi` | Buka kembali penilaian yang sudah difinalisasi (ADMIN saja). |
| `resetSesi` | Kosongkan seluruh skor sesi ini (ADMIN). |


#### `lib/actions/user.ts`

Ukuran: 279 baris.

**Maksud berkas.** Get all users (paginated)

**Tabel database:** `account`, `evidence`, `session`, `tabelLkps`, `user`

**Fungsi yang disediakan:**

| Fungsi | Keterangan |
|---|---|
| `getUsers` | Get all users (paginated) |
| `createUser` | Create a new user |
| `updateUser` | Update a user |
| `deleteUser` | Delete a user permanently (hard delete). Blocked when the user still owns data referenced by other tables (submitted/validated LKPS, uploaded evidence). User must reassign or remove those records first. |
| `resetUserPassword` | Reset user password |


---

<a id="11-referensi-komponen"></a>

## 11. Referensi Komponen

Seluruh 68 komponen tampilan, dikelompokkan per folder

Ada **68 komponen**. Semuanya ada di folder `components/`.


### Ringkasan per folder

| Folder | Jumlah | Kegunaan |
|---|---:|---|
| `components/forms/` | 4 | Formulir data induk |
| `components/layout/` | 6 | Kerangka halaman: menu, kepala, tema |
| `components/led/` | 11 | Modul narasi LED |
| `components/navigation-events.tsx/` | 1 | — |
| `components/penilaian/` | 4 | Modul Matriks Penilaian |
| `components/shared/` | 5 | Komponen yang dipakai lintas modul |
| `components/tables/` | 36 | Tampilan tiap tabel LKPS |
| `components/ui/` | 1 | Komponen tampilan dasar |


### Folder `components/forms/`


#### `create-user-dialog.tsx`

**Berkas.** `components/forms/create-user-dialog.tsx` (157 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `CreateUserDialog`


#### `delete-user-dialog.tsx`

**Berkas.** `components/forms/delete-user-dialog.tsx` (145 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `userId` | ya | `string` |
| `userName` | ya | `string` |
| `variant` | tidak | `"soft" \| "hard"` |

**Yang diekspor:** `DeleteUserDialog`


#### `edit-user-dialog.tsx`

**Berkas.** `components/forms/edit-user-dialog.tsx` (275 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `user` | ya | `EditableUser` |
| `trigger` | tidak | `React.ReactNode` |

**Yang diekspor:** `EditableUser`, `EditUserDialog`


#### `login-form.tsx`

**Berkas.** `components/forms/login-form.tsx` (225 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `LoginForm`


### Folder `components/layout/`


#### `NotificationBell.tsx`

**Berkas.** `components/layout/NotificationBell.tsx` (233 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `NotificationBell`


#### `developer-badge.tsx`

**Berkas.** `components/layout/developer-badge.tsx` (261 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `DeveloperBadge`


#### `header.tsx`

**Berkas.** `components/layout/header.tsx` (157 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `user` | ya | `{` |
| `name` | tidak | `string \| null` |
| `email` | tidak | `string \| null` |
| `image` | tidak | `string \| null` |
| `role` | tidak | `string` |

**Yang diekspor:** `Header`


#### `sidebar.tsx`

**Berkas.** `components/layout/sidebar.tsx` (321 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `role` | ya | `string` |

**Yang diekspor:** `Sidebar`


#### `theme-sync.tsx`

**Berkas.** `components/layout/theme-sync.tsx` (60 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Menjaga class `dark` pada <html> tetap sinkron dengan rute yang sedang dibuka. - Di rute terang (login): class `dark` dilepas, apa pun pilihan pengguna. - Di rute lain: tema dipasang ulang dari localStorage / preferensi sistem, supaya pilihan pengguna tetap terbawa setelah keluar dari halaman login.

**Yang diekspor:** `ThemeSync`


#### `theme-toggle.tsx`

**Berkas.** `components/layout/theme-toggle.tsx` (56 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Tombol pengalih mode terang / gelap. Pilihan disimpan di localStorage (`sim-lkps-theme`). Pada kunjungan pertama (belum ada pilihan) tema mengikuti preferensi sistem — penentuannya dilakukan script inline di app/layout.tsx sebelum paint, jadi tidak ada kedipan putih saat halaman dimuat.

**Yang diekspor:** `ThemeToggle`


### Folder `components/led/`


#### `LedAccordion.tsx`

**Berkas.** `components/led/LedAccordion.tsx` (89 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Accordion per tahap PPEPP (dipakai di halaman kriteria).

**Yang diekspor:** `LedAccordion`, `LedBagianList`


#### `LedButirKartu.tsx`

**Berkas.** `components/led/LedButirKartu.tsx` (96 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Satu kartu butir LED: judul + status + petunjuk + editor + bukti.

**Yang diekspor:** `LedButirKartu`


#### `LedEditor.tsx`

**Berkas.** `components/led/LedEditor.tsx` (272 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `LedEditor`


#### `LedEvidenceList.tsx`

**Berkas.** `components/led/LedEvidenceList.tsx` (172 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `LedEvidenceList`


#### `LedExportDialog.tsx`

**Berkas.** `components/led/LedExportDialog.tsx` (307 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `RingkasExport`, `LedExportDialog`


#### `LedPageHeader.tsx`

**Berkas.** `components/led/LedPageHeader.tsx` (113 baris)

**Jenis.** Berjalan di server

**Maksud.** Top bar halaman LED — mengikuti pola halaman detail tabel LKPS: chip statistik + tombol aksi sebaris, aksen slate.

**Yang diekspor:** `LedPageHeader`


#### `LedProgressCard.tsx`

**Berkas.** `components/led/LedProgressCard.tsx` (145 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `KartuLed`, `LedProgressCard`, `LedBatasBanner`, `LedBelumDiSeed`


#### `LedStatusSelect.tsx`

**Berkas.** `components/led/LedStatusSelect.tsx` (70 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `LedStatusSelect`


#### `ikon.ts`

**Berkas.** `components/led/ikon.ts` (32 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Peta nama → komponen ikon untuk modul LED. Komponen (fungsi) TIDAK boleh dikirim dari Server Component ke Client Component — React melempar "Functions cannot be passed directly to Client Components". Jadi server mengirim NAMA ikon, klien yang me-resolve.

**Yang diekspor:** `IKON_LED`, `ikonLed`


#### `status.ts`

**Berkas.** `components/led/status.ts` (38 baris)

**Jenis.** Berjalan di server

**Maksud.** Akses aman ke LED_STATUS_META (tsconfig pakai noUncheckedIndexedAccess).

**Yang diekspor:** `statusMeta`, `VARIAN_KELAS`, `statusKelas`, `ringkasProgres`


#### `types.ts`

**Berkas.** `components/led/types.ts` (37 baris)

**Jenis.** Berjalan di server

**Maksud.** Data satu bagian LED yang dikirim dari server ke client.

**Yang diekspor:** `LedBuktiData`, `LedIsianData`, `LedBagianData`, `HasilSimpan`


### Folder `components/navigation-events.tsx/`


#### `navigation-events.tsx`

**Berkas.** `components/navigation-events.tsx` (33 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `NavigationEvents`


### Folder `components/penilaian/`


#### `AksiFinalisasi.tsx`

**Berkas.** `components/penilaian/AksiFinalisasi.tsx` (111 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Tombol finalisasi / buka kembali / reset + blokir kalau belum lengkap.

**Yang diekspor:** `AksiFinalisasi`


#### `KriteriaBreakdown.tsx`

**Berkas.** `components/penilaian/KriteriaBreakdown.tsx` (129 baris)

**Jenis.** Berjalan di server

**Maksud.** Bar per kriteria + rerata tertimbang. Ambient warna: merah <3,00 · amber 3,00–3,19 · hijau ≥3,20. Kriteria kunci (C1–C3) diberi penanda karena menentukan gelar Unggul.

**Yang diekspor:** `KriteriaBreakdown`, `KartuKriteriaRingkas`


#### `SkorSelector.tsx`

**Berkas.** `components/penilaian/SkorSelector.tsx` (102 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Pemilih skor 1–4 sesuai deskriptor Matriks Penilaian. Kurang(1) · Cukup(2) · Baik(3) · Sangat Baik(4). Pakai role="radiogroup" + navigasi panah kiri/kanan (a11y).

**Yang diekspor:** `SkorSelector`, `LegendaSkor`


#### `StatusGauge.tsx`

**Berkas.** `components/penilaian/StatusGauge.tsx` (136 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Gauge nilai akhir 0–400 dengan 3 zona ambang resmi §V: merah <200 · amber 200–320 · hijau ≥321.

**Yang diekspor:** `StatusGauge`


### Folder `components/shared/`


#### `DosenSelect.tsx`

**Berkas.** `components/shared/DosenSelect.tsx` (285 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `value` | ya | `string` |
| `onChange` | ya | `(value: string) => void` |
| `dosens` | ya | `DosenOption[]` |
| `label` | tidak | `string` |
| `placeholder` | tidak | `string` |
| `required` | tidak | `boolean` |
| `accent` | tidak | `DosenAccent` |
| `size` | tidak | `"sm" \| "md"` |

**Yang diekspor:** `DosenOption`, `DosenAccent`, `DosenSelect`


#### `error-boundary.tsx`

**Berkas.** `components/shared/error-boundary.tsx` (67 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Maksud.** Error boundary untuk client components. Bungkus komponen yang rentan crash (tabel, form kompleks, dll). Usage: <ErrorBoundary> <Tabel1A1Client ... /> </ErrorBoundary>

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `children` | ya | `ReactNode` |
| `fallback` | tidak | `ReactNode` |
| `onError` | tidak | `(error: Error, errorInfo: ErrorInfo) => void` |

**Yang diekspor:** `ErrorBoundary`


#### `permission-gate.tsx`

**Berkas.** `components/shared/permission-gate.tsx` (43 baris)

**Jenis.** Berjalan di server

**Maksud.** Server Component: conditionally renders children based on permissions

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `children` | ya | `React.ReactNode` |
| `permission` | tidak | `string` |
| `permissions` | tidak | `string[]` |
| `mode` | tidak | `"all" \| "any"` |
| `fallback` | tidak | `React.ReactNode` |

**Yang diekspor:** `PermissionGate`


#### `skeleton.tsx`

**Berkas.** `components/shared/skeleton.tsx` (117 baris)

**Jenis.** Berjalan di server

**Maksud.** Skeleton component untuk loading states. Gunakan di loading.tsx atau sebagai fallback Suspense. Usage: <Skeleton className="h-4 w-24" />

**Yang diekspor:** `Skeleton`, `CardSkeleton`, `TableRowSkeleton`, `FormSkeleton`, `TablePageSkeleton`


#### `status-badge.tsx`

**Berkas.** `components/shared/status-badge.tsx` (99 baris)

**Jenis.** Berjalan di server

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `variant` | tidak | `StatusVariant` |
| `children` | ya | `React.ReactNode` |
| `icon` | tidak | `React.ReactNode` |
| `size` | tidak | `"sm" \| "md" \| "lg"` |
| `className` | tidak | `string` |

**Yang diekspor:** `StatusBadge`, `DraftBadge`, `SubmittedBadge`, `ApprovedBadge`, `RevisionBadge`, `RejectedBadge`, `TabelStatusBadge`


### Folder `components/tables/`


#### `tabel-1a1-client.tsx`

**Berkas.** `components/tables/tabel-1a1-client.tsx` (629 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `TabelStatus` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `{` |
| `id` | ya | `string` |
| `nidn` | ya | `string` |
| `nama` | ya | `string` |
| `jabatanFungsional` | ya | `string \| null` |
| `pendidikanTerakhir` | ya | `string` |

**Yang diekspor:** `Tabel1A1Client`


#### `tabel-1a2-client.tsx`

**Berkas.** `components/tables/tabel-1a2-client.tsx` (623 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel1A2Client`


#### `tabel-1a3-client.tsx`

**Berkas.** `components/tables/tabel-1a3-client.tsx` (562 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel1A3Client`


#### `tabel-1a4-client.tsx`

**Berkas.** `components/tables/tabel-1a4-client.tsx` (722 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `dosenList` | ya | `DosenOption[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel1A4Client`


#### `tabel-1a5-client.tsx`

**Berkas.** `components/tables/tabel-1a5-client.tsx` (666 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel1A5Client`


#### `tabel-1b-client.tsx`

**Berkas.** `components/tables/tabel-1b-client.tsx` (713 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel1BClient`


#### `tabel-2a1-client.tsx`

**Berkas.** `components/tables/tabel-2a1-client.tsx` (402 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `RowData[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2A1Client`


#### `tabel-2a2-client.tsx`

**Berkas.** `components/tables/tabel-2a2-client.tsx` (308 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2A2Client`


#### `tabel-2a3-client.tsx`

**Berkas.** `components/tables/tabel-2a3-client.tsx` (400 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `{` |
| `id` | ya | `string` |
| `rowOrder` | ya | `number` |
| `rowData` | ya | `any` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2A3Client`


#### `tabel-2b1-client.tsx`

**Berkas.** `components/tables/tabel-2b1-client.tsx` (171 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `Tabel2B1Client`


#### `tabel-2b2-client.tsx`

**Berkas.** `components/tables/tabel-2b2-client.tsx` (105 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `Tabel2B2Client`


#### `tabel-2b3-client.tsx`

**Berkas.** `components/tables/tabel-2b3-client.tsx` (119 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Yang diekspor:** `Tabel2B3Client`


#### `tabel-2b4-client.tsx`

**Berkas.** `components/tables/tabel-2b4-client.tsx` (388 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `Tabel2B4Row[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2B4Client`


#### `tabel-2b5-client.tsx`

**Berkas.** `components/tables/tabel-2b5-client.tsx` (392 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `Row[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2B5Client`


#### `tabel-2b6-client.tsx`

**Berkas.** `components/tables/tabel-2b6-client.tsx` (353 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `Row[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2B6Client`


#### `tabel-2c-client.tsx`

**Berkas.** `components/tables/tabel-2c-client.tsx` (344 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `rowsTs` | ya | `Record<string, any>` |
| `rowsTs1` | ya | `Record<string, any>` |
| `rowsTs2` | ya | `Record<string, any>` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2CClient`


#### `tabel-2d-client.tsx`

**Berkas.** `components/tables/tabel-2d-client.tsx` (248 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `defaultSources` | ya | `{ key: string; label: string }[]` |
| `rowsTs` | ya | `Record<string, any>` |
| `rowsTs1` | ya | `Record<string, any>` |
| `rowsTs2` | ya | `Record<string, any>` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel2DClient`


#### `tabel-3a1-client.tsx`

**Berkas.** `components/tables/tabel-3a1-client.tsx` (586 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `SaranaItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel3A1Client`


#### `tabel-3a2-client.tsx`

**Berkas.** `components/tables/tabel-3a2-client.tsx` (575 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `PenelitianItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `DosenOption[]` |

**Yang diekspor:** `Tabel3A2Client`


#### `tabel-3a3-client.tsx`

**Berkas.** `components/tables/tabel-3a3-client.tsx` (303 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `PengembanganItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `DosenOption[]` |

**Yang diekspor:** `Tabel3A3Client`


#### `tabel-3c1-client.tsx`

**Berkas.** `components/tables/tabel-3c1-client.tsx` (228 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `KerjasamaItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel3C1Client`


#### `tabel-3c2-client.tsx`

**Berkas.** `components/tables/tabel-3c2-client.tsx` (222 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `PublikasiItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `DosenOption[]` |

**Yang diekspor:** `Tabel3C2Client`


#### `tabel-3c3-client.tsx`

**Berkas.** `components/tables/tabel-3c3-client.tsx` (202 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `HkiItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `DosenOption[]` |

**Yang diekspor:** `Tabel3C3Client`


#### `tabel-4a1-client.tsx`

**Berkas.** `components/tables/tabel-4a1-client.tsx` (600 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `PrasaranaPkmItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel4A1Client`


#### `tabel-4a2-client.tsx`

**Berkas.** `components/tables/tabel-4a2-client.tsx` (591 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `PkmItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `DosenOption[]` |

**Yang diekspor:** `Tabel4A2Client`


#### `tabel-4c1-client.tsx`

**Berkas.** `components/tables/tabel-4c1-client.tsx` (225 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `KerjasamaPkmItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel4C1Client`


#### `tabel-4c2-client.tsx`

**Berkas.** `components/tables/tabel-4c2-client.tsx` (347 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `DiseminasiItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `DosenOption[]` |

**Yang diekspor:** `Tabel4C2Client`


#### `tabel-4c3-client.tsx`

**Berkas.** `components/tables/tabel-4c3-client.tsx` (344 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `HkiPkmItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |
| `dosens` | ya | `DosenOption[]` |

**Yang diekspor:** `Tabel4C3Client`


#### `tabel-51-client.tsx`

**Berkas.** `components/tables/tabel-51-client.tsx` (585 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `TataKelolaItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel51Client`


#### `tabel-52-client.tsx`

**Berkas.** `components/tables/tabel-52-client.tsx` (612 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `PrasaranaPendidikanItem[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel52Client`


#### `tabel-6-client.tsx`

**Berkas.** `components/tables/tabel-6-client.tsx` (363 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `VisiMisiRow[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel6Client`


#### `tabel-61-client.tsx`

**Berkas.** `components/tables/tabel-61-client.tsx` (432 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `VisiMisiRow[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel61Client`


#### `tabel-62-client.tsx`

**Berkas.** `components/tables/tabel-62-client.tsx` (390 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `initialRows` | ya | `StrategiRow[]` |
| `tahunAkademikId` | ya | `string` |
| `tabelKode` | ya | `string` |
| `status` | ya | `string` |
| `userRole` | ya | `Role` |

**Yang diekspor:** `Tabel62Client`


#### `user-table.tsx`

**Berkas.** `components/tables/user-table.tsx` (192 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `users` | ya | `User[]` |
| `meta` | ya | `Meta` |
| `currentRole` | ya | `Role` |

**Yang diekspor:** `UserTable`


#### `validation-controls.tsx`

**Berkas.** `components/tables/validation-controls.tsx` (205 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `tabelKode` | ya | `string` |
| `tahunAkademikId` | ya | `string` |
| `currentStatus` | ya | `string` |
| `userRole` | ya | `string` |
| `onChangeStatus` | ya | `(status: string) => void` |
| `triggerToast` | ya | `(message: string, type: "success" \| "error") => void` |

**Yang diekspor:** `ValidationControls`


#### `validation-history.tsx`

**Berkas.** `components/tables/validation-history.tsx` (98 baris)

**Jenis.** Berjalan di peramban — ada pengelolaan keadaan dan kejadian

**Properti yang diterima:**

| Nama | Wajib | Tipe |
|---|---|---|
| `history` | ya | `HistoryItem[]` |

**Yang diekspor:** `ValidationHistory`


### Folder `components/ui/`


#### `loading-screen.tsx`

**Berkas.** `components/ui/loading-screen.tsx` (71 baris)

**Jenis.** Berjalan di server

**Maksud.** Shared loading screen — logo UBBG breathing + pulse ring + sweeping progress bar. Used across all dashboard routes & LKPS BAB sections.

**Yang diekspor:** `Loading`


---

<a id="12-modul-led"></a>

## 12. Modul LED

Seluruh 92 bagian narasi, susunannya, dan cara dokumen dihasilkan

LED adalah **Laporan Evaluasi Diri** — dokumen naratif yang menyertai LKPS.
Terdiri dari **92 bagian** yang tersusun sebagai BAB I sampai BAB III.

### Sebaran bagian per bab

| Bab | Jumlah bagian |
|---|---:|
| BAB I | 3 |
| BAB II | 88 |
| BAB III | 1 |
| **Total** | **92** |

### Daftar seluruh bagian

| No | Kode | Bab | Judul | Jenis | Batas halaman |
|---:|---|---|---|---|---:|
| 1 | `BAB1.A` | I | Dasar Penyusunan | NARASI | 10 |
| 2 | `BAB1.B` | I | Tim Penyusun dan Tanggung Jawabnya | NARASI | 10 |
| 3 | `BAB1.C` | I | Mekanisme Kerja Penyusunan LED | NARASI | 10 |
| 4 | `BAB2.A` | II | Kondisi Eksternal | NARASI | 10 |
| 5 | `BAB2.B.1` | II | Sejarah Unit Pengelola Program Studi | NARASI | — |
| 6 | `BAB2.B.2` | II | Visi, Misi, Tujuan, Strategi, dan Tata Nilai | NARASI | — |
| 7 | `BAB2.B.3` | II | Organisasi dan Tata Kerja | NARASI | — |
| 8 | `BAB2.B.4` | II | Mahasiswa dan Lulusan | NARASI | — |
| 9 | `BAB2.B.5` | II | Dosen dan Tenaga Kependidikan | NARASI | — |
| 10 | `BAB2.B.6` | II | Keuangan, Sarana, dan Prasarana | NARASI | — |
| 11 | `BAB2.B.7` | II | Sistem Penjaminan Mutu | NARASI | — |
| 12 | `BAB2.B.8` | II | Kinerja Unit Pengelola Program Studi dan Program Studi yang Diakreditasi | NARASI | — |
| 13 | `BAB2.C.1.1.A` | II | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — |
| 14 | `BAB2.C.1.1.B` | II | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — |
| 15 | `BAB2.C.1.2.A` | II | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — |
| 16 | `BAB2.C.1.2.B` | II | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — |
| 17 | `BAB2.C.1.3.A` | II | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — |
| 18 | `BAB2.C.1.3.B` | II | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — |
| 19 | `BAB2.C.1.4.A` | II | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — |
| 20 | `BAB2.C.1.4.B` | II | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — |
| 21 | `BAB2.C.1.5.A` | II | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — |
| 22 | `BAB2.C.1.5.B` | II | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — |
| 23 | `BAB2.C.2.1.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — |
| 24 | `BAB2.C.2.1.B` | II | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — |
| 25 | `BAB2.C.2.1.C` | II | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — |
| 26 | `BAB2.C.2.1.D` | II | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — |
| 27 | `BAB2.C.2.2.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — |
| 28 | `BAB2.C.2.2.B` | II | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — |
| 29 | `BAB2.C.2.2.C` | II | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — |
| 30 | `BAB2.C.2.2.D` | II | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — |
| 31 | `BAB2.C.2.3.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — |
| 32 | `BAB2.C.2.3.B` | II | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — |
| 33 | `BAB2.C.2.3.C` | II | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — |
| 34 | `BAB2.C.2.3.D` | II | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — |
| 35 | `BAB2.C.2.4.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — |
| 36 | `BAB2.C.2.4.B` | II | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — |
| 37 | `BAB2.C.2.4.C` | II | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — |
| 38 | `BAB2.C.2.4.D` | II | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — |
| 39 | `BAB2.C.2.5.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — |
| 40 | `BAB2.C.2.5.B` | II | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — |
| 41 | `BAB2.C.2.5.C` | II | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — |
| 42 | `BAB2.C.2.5.D` | II | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — |
| 43 | `BAB2.C.3.1.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — |
| 44 | `BAB2.C.3.1.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — |
| 45 | `BAB2.C.3.1.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — |
| 46 | `BAB2.C.3.2.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — |
| 47 | `BAB2.C.3.2.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — |
| 48 | `BAB2.C.3.2.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — |
| 49 | `BAB2.C.3.3.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — |
| 50 | `BAB2.C.3.3.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — |
| 51 | `BAB2.C.3.3.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — |
| 52 | `BAB2.C.3.4.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — |
| 53 | `BAB2.C.3.4.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — |
| 54 | `BAB2.C.3.4.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — |
| 55 | `BAB2.C.3.5.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — |
| 56 | `BAB2.C.3.5.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — |
| 57 | `BAB2.C.3.5.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — |
| 58 | `BAB2.C.4.1.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — |
| 59 | `BAB2.C.4.1.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — |
| 60 | `BAB2.C.4.1.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — |
| 61 | `BAB2.C.4.2.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — |
| 62 | `BAB2.C.4.2.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — |
| 63 | `BAB2.C.4.2.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — |
| 64 | `BAB2.C.4.3.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — |
| 65 | `BAB2.C.4.3.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — |
| 66 | `BAB2.C.4.3.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — |
| 67 | `BAB2.C.4.4.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — |
| 68 | `BAB2.C.4.4.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — |
| 69 | `BAB2.C.4.4.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — |
| 70 | `BAB2.C.4.5.A` | II | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — |
| 71 | `BAB2.C.4.5.B` | II | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — |
| 72 | `BAB2.C.4.5.C` | II | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — |
| 73 | `BAB2.C.5.1.A` | II | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — |
| 74 | `BAB2.C.5.1.B` | II | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — |
| 75 | `BAB2.C.5.2.A` | II | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — |
| 76 | `BAB2.C.5.2.B` | II | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — |
| 77 | `BAB2.C.5.3.A` | II | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — |
| 78 | `BAB2.C.5.3.B` | II | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — |
| 79 | `BAB2.C.5.4.A` | II | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — |
| 80 | `BAB2.C.5.4.B` | II | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — |
| 81 | `BAB2.C.5.5.A` | II | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — |
| 82 | `BAB2.C.5.5.B` | II | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — |
| 83 | `BAB2.C.6.1.A` | II | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — |
| 84 | `BAB2.C.6.2.A` | II | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — |
| 85 | `BAB2.C.6.3.A` | II | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — |
| 86 | `BAB2.C.6.4.A` | II | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — |
| 87 | `BAB2.C.6.5.A` | II | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — |
| 88 | `BAB2.D.1` | II | Mata Kuliah Inti/Khas Ilmu Komputer | SUPLEMEN | — |
| 89 | `BAB2.D.2` | II | Mata Kuliah Domain Spesifik dan Lingkungan Pengembangan Perangkat Lunak | SUPLEMEN | — |
| 90 | `BAB2.D.3` | II | Mata Kuliah Terkait Matematika/Ilmu Dasar | SUPLEMEN | — |
| 91 | `BAB2.D.4` | II | Proyek Utama (Capstone Project) | SUPLEMEN | — |
| 92 | `BAB3` | III | Penutup | NARASI | 2 |


---

<a id="13-rincian-tiap-bagian-led"></a>

## 13. Rincian Tiap Bagian LED

Susunan 92 bagian dari tiga bab LED, beserta batas halamannya

Laporan Evaluasi Diri (LED) disusun dari **92 bagian** yang
terbagi ke dalam **3 bab**.

**Batas halaman itu anjuran, bukan tembok.** Angka di kolom batas halaman
menunjukkan perkiraan panjang yang wajar. Bagian yang isinya lebih padat
boleh lebih panjang, tapi bagian yang jauh melebihi batas biasanya tanda
uraiannya belum dipadatkan.


### Jenis bagian dan cara menulisnya


#### NARASI — 13 bagian

Bagian yang berisi uraian bebas.
Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau
pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan
didukung data.

Bagian berjenis ini: `BAB1.A`, `BAB1.B`, `BAB1.C`, `BAB2.A`, `BAB2.B.1`, `BAB2.B.2`, `BAB2.B.3`, `BAB2.B.4`, `BAB2.B.5`, `BAB2.B.6`, `BAB2.B.7`, `BAB2.B.8`, `BAB3`.


#### KRITERIA — 75 bagian

Bagian yang menguraikan satu kriteria penilaian instrumen.
Bagian ini berpasangan langsung dengan satu butir penilaian di modul
Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk
butir yang bersangkutan.

Bagian berjenis ini: `BAB2.C.1.1.A`, `BAB2.C.1.1.B`, `BAB2.C.1.2.A`, `BAB2.C.1.2.B`, `BAB2.C.1.3.A`, `BAB2.C.1.3.B`, `BAB2.C.1.4.A`, `BAB2.C.1.4.B`, `BAB2.C.1.5.A`, `BAB2.C.1.5.B`, `BAB2.C.2.1.A`, `BAB2.C.2.1.B`, `BAB2.C.2.1.C`, `BAB2.C.2.1.D`, `BAB2.C.2.2.A`, `BAB2.C.2.2.B`, `BAB2.C.2.2.C`, `BAB2.C.2.2.D`, `BAB2.C.2.3.A`, `BAB2.C.2.3.B`, `BAB2.C.2.3.C`, `BAB2.C.2.3.D`, `BAB2.C.2.4.A`, `BAB2.C.2.4.B`, `BAB2.C.2.4.C`, `BAB2.C.2.4.D`, `BAB2.C.2.5.A`, `BAB2.C.2.5.B`, `BAB2.C.2.5.C`, `BAB2.C.2.5.D`, `BAB2.C.3.1.A`, `BAB2.C.3.1.B`, `BAB2.C.3.1.C`, `BAB2.C.3.2.A`, `BAB2.C.3.2.B`, `BAB2.C.3.2.C`, `BAB2.C.3.3.A`, `BAB2.C.3.3.B`, `BAB2.C.3.3.C`, `BAB2.C.3.4.A`, `BAB2.C.3.4.B`, `BAB2.C.3.4.C`, `BAB2.C.3.5.A`, `BAB2.C.3.5.B`, `BAB2.C.3.5.C`, `BAB2.C.4.1.A`, `BAB2.C.4.1.B`, `BAB2.C.4.1.C`, `BAB2.C.4.2.A`, `BAB2.C.4.2.B`, `BAB2.C.4.2.C`, `BAB2.C.4.3.A`, `BAB2.C.4.3.B`, `BAB2.C.4.3.C`, `BAB2.C.4.4.A`, `BAB2.C.4.4.B`, `BAB2.C.4.4.C`, `BAB2.C.4.5.A`, `BAB2.C.4.5.B`, `BAB2.C.4.5.C`, `BAB2.C.5.1.A`, `BAB2.C.5.1.B`, `BAB2.C.5.2.A`, `BAB2.C.5.2.B`, `BAB2.C.5.3.A`, `BAB2.C.5.3.B`, `BAB2.C.5.4.A`, `BAB2.C.5.4.B`, `BAB2.C.5.5.A`, `BAB2.C.5.5.B`, `BAB2.C.6.1.A`, `BAB2.C.6.2.A`, `BAB2.C.6.3.A`, `BAB2.C.6.4.A`, `BAB2.C.6.5.A`.


#### SUPLEMEN — 4 bagian

Bagian pelengkap.
Berisi dokumen pendukung yang diminta instrumen, misalnya daftar lampiran
atau rekapitulasi tambahan yang tidak masuk bagian utama.

Bagian berjenis ini: `BAB2.D.1`, `BAB2.D.2`, `BAB2.D.3`, `BAB2.D.4`.


### Rekapitulasi per bab

| Bab | Bagian | Batas halaman | Jenis yang ada |
|---|---:|---:|---|
| [BAB I](#bagian-led-bab-i) | 3 | 30 | NARASI |
| [BAB II](#bagian-led-bab-ii) | 88 | 10 | NARASI, KRITERIA, SUPLEMEN |
| [BAB III](#bagian-led-bab-iii) | 1 | 2 | NARASI |
| **Total** | **92** | **42** | |


<a id="bagian-led-bab-i"></a>

### BAB I — 3 bagian

Bab ini memuat **3 bagian** dengan batas halaman keseluruhan
**30 halaman**.

| No | Kode | Bagian | Judul | Jenis | Batas halaman | Halaman terkait |
|---:|---|---|---|---|---:|---|
| 1 | `BAB1.A` | A | Dasar Penyusunan | NARASI | 10 | `/led/bab1a` |
| 2 | `BAB1.B` | B | Tim Penyusun dan Tanggung Jawabnya | NARASI | 10 | `/led/bab1b` |
| 3 | `BAB1.C` | C | Mekanisme Kerja Penyusunan LED | NARASI | 10 | `/led/bab1c` |


<a id="bab1a"></a>

#### `BAB1.A` — Dasar Penyusunan

| | |
|---|---|
| **Kode** | `BAB1.A` |
| **Bab** | BAB I |
| **Bagian** | A |
| **Jenis** | NARASI |
| **Batas halaman** | 10 |
| **Urutan** | 1 |
| **Halaman aplikasi** | `/led/bab1a` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab1b"></a>

#### `BAB1.B` — Tim Penyusun dan Tanggung Jawabnya

| | |
|---|---|
| **Kode** | `BAB1.B` |
| **Bab** | BAB I |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | 10 |
| **Urutan** | 2 |
| **Halaman aplikasi** | `/led/bab1b` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab1c"></a>

#### `BAB1.C` — Mekanisme Kerja Penyusunan LED

| | |
|---|---|
| **Kode** | `BAB1.C` |
| **Bab** | BAB I |
| **Bagian** | C |
| **Jenis** | NARASI |
| **Batas halaman** | 10 |
| **Urutan** | 3 |
| **Halaman aplikasi** | `/led/bab1c` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bagian-led-bab-ii"></a>

### BAB II — 88 bagian

Bab ini memuat **88 bagian** dengan batas halaman keseluruhan
**10 halaman**.

| No | Kode | Bagian | Judul | Jenis | Batas halaman | Halaman terkait |
|---:|---|---|---|---|---:|---|
| 1 | `BAB2.A` | A | Kondisi Eksternal | NARASI | 10 | `/led/bab2a` |
| 2 | `BAB2.B.1` | B | Sejarah Unit Pengelola Program Studi | NARASI | — | `/led/bab2b1` |
| 3 | `BAB2.B.2` | B | Visi, Misi, Tujuan, Strategi, dan Tata Nilai | NARASI | — | `/led/bab2b2` |
| 4 | `BAB2.B.3` | B | Organisasi dan Tata Kerja | NARASI | — | `/led/bab2b3` |
| 5 | `BAB2.B.4` | B | Mahasiswa dan Lulusan | NARASI | — | `/led/bab2b4` |
| 6 | `BAB2.B.5` | B | Dosen dan Tenaga Kependidikan | NARASI | — | `/led/bab2b5` |
| 7 | `BAB2.B.6` | B | Keuangan, Sarana, dan Prasarana | NARASI | — | `/led/bab2b6` |
| 8 | `BAB2.B.7` | B | Sistem Penjaminan Mutu | NARASI | — | `/led/bab2b7` |
| 9 | `BAB2.B.8` | B | Kinerja Unit Pengelola Program Studi dan Program Studi yang Diakreditasi | NARASI | — | `/led/bab2b8` |
| 10 | `BAB2.C.1.1.A` | C | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — | `/led/bab2c11a` |
| 11 | `BAB2.C.1.1.B` | C | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — | `/led/bab2c11b` |
| 12 | `BAB2.C.1.2.A` | C | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — | `/led/bab2c12a` |
| 13 | `BAB2.C.1.2.B` | C | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — | `/led/bab2c12b` |
| 14 | `BAB2.C.1.3.A` | C | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — | `/led/bab2c13a` |
| 15 | `BAB2.C.1.3.B` | C | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — | `/led/bab2c13b` |
| 16 | `BAB2.C.1.4.A` | C | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — | `/led/bab2c14a` |
| 17 | `BAB2.C.1.4.B` | C | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — | `/led/bab2c14b` |
| 18 | `BAB2.C.1.5.A` | C | Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT | KRITERIA | — | `/led/bab2c15a` |
| 19 | `BAB2.C.1.5.B` | C | Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten | KRITERIA | — | `/led/bab2c15b` |
| 20 | `BAB2.C.2.1.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c21a` |
| 21 | `BAB2.C.2.1.B` | C | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — | `/led/bab2c21b` |
| 22 | `BAB2.C.2.1.C` | C | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — | `/led/bab2c21c` |
| 23 | `BAB2.C.2.1.D` | C | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — | `/led/bab2c21d` |
| 24 | `BAB2.C.2.2.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c22a` |
| 25 | `BAB2.C.2.2.B` | C | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — | `/led/bab2c22b` |
| 26 | `BAB2.C.2.2.C` | C | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — | `/led/bab2c22c` |
| 27 | `BAB2.C.2.2.D` | C | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — | `/led/bab2c22d` |
| 28 | `BAB2.C.2.3.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c23a` |
| 29 | `BAB2.C.2.3.B` | C | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — | `/led/bab2c23b` |
| 30 | `BAB2.C.2.3.C` | C | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — | `/led/bab2c23c` |
| 31 | `BAB2.C.2.3.D` | C | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — | `/led/bab2c23d` |
| 32 | `BAB2.C.2.4.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c24a` |
| 33 | `BAB2.C.2.4.B` | C | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — | `/led/bab2c24b` |
| 34 | `BAB2.C.2.4.C` | C | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — | `/led/bab2c24c` |
| 35 | `BAB2.C.2.4.D` | C | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — | `/led/bab2c24d` |
| 36 | `BAB2.C.2.5.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c25a` |
| 37 | `BAB2.C.2.5.B` | C | Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum | KRITERIA | — | `/led/bab2c25b` |
| 38 | `BAB2.C.2.5.C` | C | Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran | KRITERIA | — | `/led/bab2c25c` |
| 39 | `BAB2.C.2.5.D` | C | Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi | KRITERIA | — | `/led/bab2c25d` |
| 40 | `BAB2.C.3.1.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c31a` |
| 41 | `BAB2.C.3.1.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — | `/led/bab2c31b` |
| 42 | `BAB2.C.3.1.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — | `/led/bab2c31c` |
| 43 | `BAB2.C.3.2.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c32a` |
| 44 | `BAB2.C.3.2.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — | `/led/bab2c32b` |
| 45 | `BAB2.C.3.2.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — | `/led/bab2c32c` |
| 46 | `BAB2.C.3.3.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c33a` |
| 47 | `BAB2.C.3.3.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — | `/led/bab2c33b` |
| 48 | `BAB2.C.3.3.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — | `/led/bab2c33c` |
| 49 | `BAB2.C.3.4.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c34a` |
| 50 | `BAB2.C.3.4.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — | `/led/bab2c34b` |
| 51 | `BAB2.C.3.4.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — | `/led/bab2c34c` |
| 52 | `BAB2.C.3.5.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama | KRITERIA | — | `/led/bab2c35a` |
| 53 | `BAB2.C.3.5.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian | KRITERIA | — | `/led/bab2c35b` |
| 54 | `BAB2.C.3.5.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama | KRITERIA | — | `/led/bab2c35c` |
| 55 | `BAB2.C.4.1.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — | `/led/bab2c41a` |
| 56 | `BAB2.C.4.1.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — | `/led/bab2c41b` |
| 57 | `BAB2.C.4.1.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — | `/led/bab2c41c` |
| 58 | `BAB2.C.4.2.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — | `/led/bab2c42a` |
| 59 | `BAB2.C.4.2.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — | `/led/bab2c42b` |
| 60 | `BAB2.C.4.2.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — | `/led/bab2c42c` |
| 61 | `BAB2.C.4.3.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — | `/led/bab2c43a` |
| 62 | `BAB2.C.4.3.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — | `/led/bab2c43b` |
| 63 | `BAB2.C.4.3.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — | `/led/bab2c43c` |
| 64 | `BAB2.C.4.4.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — | `/led/bab2c44a` |
| 65 | `BAB2.C.4.4.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — | `/led/bab2c44b` |
| 66 | `BAB2.C.4.4.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — | `/led/bab2c44c` |
| 67 | `BAB2.C.4.5.A` | C | Kebijakan, standar dan indikator terkait sarana dan prasarana PkM | KRITERIA | — | `/led/bab2c45a` |
| 68 | `BAB2.C.4.5.B` | C | Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan | KRITERIA | — | `/led/bab2c45b` |
| 69 | `BAB2.C.4.5.C` | C | Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM | KRITERIA | — | `/led/bab2c45c` |
| 70 | `BAB2.C.5.1.A` | C | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — | `/led/bab2c51a` |
| 71 | `BAB2.C.5.1.B` | C | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — | `/led/bab2c51b` |
| 72 | `BAB2.C.5.2.A` | C | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — | `/led/bab2c52a` |
| 73 | `BAB2.C.5.2.B` | C | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — | `/led/bab2c52b` |
| 74 | `BAB2.C.5.3.A` | C | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — | `/led/bab2c53a` |
| 75 | `BAB2.C.5.3.B` | C | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — | `/led/bab2c53b` |
| 76 | `BAB2.C.5.4.A` | C | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — | `/led/bab2c54a` |
| 77 | `BAB2.C.5.4.B` | C | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — | `/led/bab2c54b` |
| 78 | `BAB2.C.5.5.A` | C | Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong | KRITERIA | — | `/led/bab2c55a` |
| 79 | `BAB2.C.5.5.B` | C | Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola | KRITERIA | — | `/led/bab2c55b` |
| 80 | `BAB2.C.6.1.A` | C | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — | `/led/bab2c61a` |
| 81 | `BAB2.C.6.2.A` | C | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — | `/led/bab2c62a` |
| 82 | `BAB2.C.6.3.A` | C | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — | `/led/bab2c63a` |
| 83 | `BAB2.C.6.4.A` | C | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — | `/led/bab2c64a` |
| 84 | `BAB2.C.6.5.A` | C | Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS | KRITERIA | — | `/led/bab2c65a` |
| 85 | `BAB2.D.1` | D | Mata Kuliah Inti/Khas Ilmu Komputer | SUPLEMEN | — | `/led/bab2d1` |
| 86 | `BAB2.D.2` | D | Mata Kuliah Domain Spesifik dan Lingkungan Pengembangan Perangkat Lunak | SUPLEMEN | — | `/led/bab2d2` |
| 87 | `BAB2.D.3` | D | Mata Kuliah Terkait Matematika/Ilmu Dasar | SUPLEMEN | — | `/led/bab2d3` |
| 88 | `BAB2.D.4` | D | Proyek Utama (Capstone Project) | SUPLEMEN | — | `/led/bab2d4` |


<a id="bab2a"></a>

#### `BAB2.A` — Kondisi Eksternal

| | |
|---|---|
| **Kode** | `BAB2.A` |
| **Bab** | BAB II |
| **Bagian** | A |
| **Jenis** | NARASI |
| **Batas halaman** | 10 |
| **Urutan** | 4 |
| **Halaman aplikasi** | `/led/bab2a` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b1"></a>

#### `BAB2.B.1` — Sejarah Unit Pengelola Program Studi

| | |
|---|---|
| **Kode** | `BAB2.B.1` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 5 |
| **Halaman aplikasi** | `/led/bab2b1` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b2"></a>

#### `BAB2.B.2` — Visi, Misi, Tujuan, Strategi, dan Tata Nilai

| | |
|---|---|
| **Kode** | `BAB2.B.2` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 6 |
| **Halaman aplikasi** | `/led/bab2b2` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b3"></a>

#### `BAB2.B.3` — Organisasi dan Tata Kerja

| | |
|---|---|
| **Kode** | `BAB2.B.3` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 7 |
| **Halaman aplikasi** | `/led/bab2b3` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b4"></a>

#### `BAB2.B.4` — Mahasiswa dan Lulusan

| | |
|---|---|
| **Kode** | `BAB2.B.4` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 8 |
| **Halaman aplikasi** | `/led/bab2b4` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b5"></a>

#### `BAB2.B.5` — Dosen dan Tenaga Kependidikan

| | |
|---|---|
| **Kode** | `BAB2.B.5` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 9 |
| **Halaman aplikasi** | `/led/bab2b5` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b6"></a>

#### `BAB2.B.6` — Keuangan, Sarana, dan Prasarana

| | |
|---|---|
| **Kode** | `BAB2.B.6` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 10 |
| **Halaman aplikasi** | `/led/bab2b6` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b7"></a>

#### `BAB2.B.7` — Sistem Penjaminan Mutu

| | |
|---|---|
| **Kode** | `BAB2.B.7` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 11 |
| **Halaman aplikasi** | `/led/bab2b7` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2b8"></a>

#### `BAB2.B.8` — Kinerja Unit Pengelola Program Studi dan Program Studi yang Diakreditasi

| | |
|---|---|
| **Kode** | `BAB2.B.8` |
| **Bab** | BAB II |
| **Bagian** | B |
| **Jenis** | NARASI |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 12 |
| **Halaman aplikasi** | `/led/bab2b8` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


<a id="bab2c11a"></a>

#### `BAB2.C.1.1.A` — Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT

| | |
|---|---|
| **Kode** | `BAB2.C.1.1.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 13 |
| **Halaman aplikasi** | `/led/bab2c11a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c11b"></a>

#### `BAB2.C.1.1.B` — Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten

| | |
|---|---|
| **Kode** | `BAB2.C.1.1.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 14 |
| **Halaman aplikasi** | `/led/bab2c11b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c12a"></a>

#### `BAB2.C.1.2.A` — Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT

| | |
|---|---|
| **Kode** | `BAB2.C.1.2.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 15 |
| **Halaman aplikasi** | `/led/bab2c12a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c12b"></a>

#### `BAB2.C.1.2.B` — Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten

| | |
|---|---|
| **Kode** | `BAB2.C.1.2.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 16 |
| **Halaman aplikasi** | `/led/bab2c12b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c13a"></a>

#### `BAB2.C.1.3.A` — Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT

| | |
|---|---|
| **Kode** | `BAB2.C.1.3.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 17 |
| **Halaman aplikasi** | `/led/bab2c13a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c13b"></a>

#### `BAB2.C.1.3.B` — Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten

| | |
|---|---|
| **Kode** | `BAB2.C.1.3.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 18 |
| **Halaman aplikasi** | `/led/bab2c13b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c14a"></a>

#### `BAB2.C.1.4.A` — Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT

| | |
|---|---|
| **Kode** | `BAB2.C.1.4.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 19 |
| **Halaman aplikasi** | `/led/bab2c14a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c14b"></a>

#### `BAB2.C.1.4.B` — Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten

| | |
|---|---|
| **Kode** | `BAB2.C.1.4.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 20 |
| **Halaman aplikasi** | `/led/bab2c14b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c15a"></a>

#### `BAB2.C.1.5.A` — Kebijakan, standar, dan indikator terkait Sistem Tata Kelola UPPS dan/atau PT

| | |
|---|---|
| **Kode** | `BAB2.C.1.5.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 21 |
| **Halaman aplikasi** | `/led/bab2c15a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c15b"></a>

#### `BAB2.C.1.5.B` — Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten

| | |
|---|---|
| **Kode** | `BAB2.C.1.5.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 22 |
| **Halaman aplikasi** | `/led/bab2c15b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c21a"></a>

#### `BAB2.C.2.1.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.2.1.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 23 |
| **Halaman aplikasi** | `/led/bab2c21a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c21b"></a>

#### `BAB2.C.2.1.B` — Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum

| | |
|---|---|
| **Kode** | `BAB2.C.2.1.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 24 |
| **Halaman aplikasi** | `/led/bab2c21b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c21c"></a>

#### `BAB2.C.2.1.C` — Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran

| | |
|---|---|
| **Kode** | `BAB2.C.2.1.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 25 |
| **Halaman aplikasi** | `/led/bab2c21c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c21d"></a>

#### `BAB2.C.2.1.D` — Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi

| | |
|---|---|
| **Kode** | `BAB2.C.2.1.D` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 26 |
| **Halaman aplikasi** | `/led/bab2c21d` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c22a"></a>

#### `BAB2.C.2.2.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.2.2.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 27 |
| **Halaman aplikasi** | `/led/bab2c22a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c22b"></a>

#### `BAB2.C.2.2.B` — Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum

| | |
|---|---|
| **Kode** | `BAB2.C.2.2.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 28 |
| **Halaman aplikasi** | `/led/bab2c22b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c22c"></a>

#### `BAB2.C.2.2.C` — Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran

| | |
|---|---|
| **Kode** | `BAB2.C.2.2.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 29 |
| **Halaman aplikasi** | `/led/bab2c22c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c22d"></a>

#### `BAB2.C.2.2.D` — Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi

| | |
|---|---|
| **Kode** | `BAB2.C.2.2.D` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 30 |
| **Halaman aplikasi** | `/led/bab2c22d` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c23a"></a>

#### `BAB2.C.2.3.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.2.3.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 31 |
| **Halaman aplikasi** | `/led/bab2c23a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c23b"></a>

#### `BAB2.C.2.3.B` — Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum

| | |
|---|---|
| **Kode** | `BAB2.C.2.3.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 32 |
| **Halaman aplikasi** | `/led/bab2c23b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c23c"></a>

#### `BAB2.C.2.3.C` — Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran

| | |
|---|---|
| **Kode** | `BAB2.C.2.3.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 33 |
| **Halaman aplikasi** | `/led/bab2c23c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c23d"></a>

#### `BAB2.C.2.3.D` — Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi

| | |
|---|---|
| **Kode** | `BAB2.C.2.3.D` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 34 |
| **Halaman aplikasi** | `/led/bab2c23d` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c24a"></a>

#### `BAB2.C.2.4.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.2.4.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 35 |
| **Halaman aplikasi** | `/led/bab2c24a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c24b"></a>

#### `BAB2.C.2.4.B` — Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum

| | |
|---|---|
| **Kode** | `BAB2.C.2.4.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 36 |
| **Halaman aplikasi** | `/led/bab2c24b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c24c"></a>

#### `BAB2.C.2.4.C` — Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran

| | |
|---|---|
| **Kode** | `BAB2.C.2.4.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 37 |
| **Halaman aplikasi** | `/led/bab2c24c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c24d"></a>

#### `BAB2.C.2.4.D` — Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi

| | |
|---|---|
| **Kode** | `BAB2.C.2.4.D` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 38 |
| **Halaman aplikasi** | `/led/bab2c24d` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c25a"></a>

#### `BAB2.C.2.5.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.2.5.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 39 |
| **Halaman aplikasi** | `/led/bab2c25a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c25b"></a>

#### `BAB2.C.2.5.B` — Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum

| | |
|---|---|
| **Kode** | `BAB2.C.2.5.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 40 |
| **Halaman aplikasi** | `/led/bab2c25b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c25c"></a>

#### `BAB2.C.2.5.C` — Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran

| | |
|---|---|
| **Kode** | `BAB2.C.2.5.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 41 |
| **Halaman aplikasi** | `/led/bab2c25c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c25d"></a>

#### `BAB2.C.2.5.D` — Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi

| | |
|---|---|
| **Kode** | `BAB2.C.2.5.D` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 42 |
| **Halaman aplikasi** | `/led/bab2c25d` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c31a"></a>

#### `BAB2.C.3.1.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.3.1.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 43 |
| **Halaman aplikasi** | `/led/bab2c31a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c31b"></a>

#### `BAB2.C.3.1.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian

| | |
|---|---|
| **Kode** | `BAB2.C.3.1.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 44 |
| **Halaman aplikasi** | `/led/bab2c31b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c31c"></a>

#### `BAB2.C.3.1.C` — Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama

| | |
|---|---|
| **Kode** | `BAB2.C.3.1.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 45 |
| **Halaman aplikasi** | `/led/bab2c31c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c32a"></a>

#### `BAB2.C.3.2.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.3.2.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 46 |
| **Halaman aplikasi** | `/led/bab2c32a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c32b"></a>

#### `BAB2.C.3.2.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian

| | |
|---|---|
| **Kode** | `BAB2.C.3.2.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 47 |
| **Halaman aplikasi** | `/led/bab2c32b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c32c"></a>

#### `BAB2.C.3.2.C` — Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama

| | |
|---|---|
| **Kode** | `BAB2.C.3.2.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 48 |
| **Halaman aplikasi** | `/led/bab2c32c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c33a"></a>

#### `BAB2.C.3.3.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.3.3.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 49 |
| **Halaman aplikasi** | `/led/bab2c33a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c33b"></a>

#### `BAB2.C.3.3.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian

| | |
|---|---|
| **Kode** | `BAB2.C.3.3.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 50 |
| **Halaman aplikasi** | `/led/bab2c33b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c33c"></a>

#### `BAB2.C.3.3.C` — Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama

| | |
|---|---|
| **Kode** | `BAB2.C.3.3.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 51 |
| **Halaman aplikasi** | `/led/bab2c33c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c34a"></a>

#### `BAB2.C.3.4.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.3.4.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 52 |
| **Halaman aplikasi** | `/led/bab2c34a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c34b"></a>

#### `BAB2.C.3.4.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian

| | |
|---|---|
| **Kode** | `BAB2.C.3.4.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 53 |
| **Halaman aplikasi** | `/led/bab2c34b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c34c"></a>

#### `BAB2.C.3.4.C` — Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama

| | |
|---|---|
| **Kode** | `BAB2.C.3.4.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 54 |
| **Halaman aplikasi** | `/led/bab2c34c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c35a"></a>

#### `BAB2.C.3.5.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan kerja sama

| | |
|---|---|
| **Kode** | `BAB2.C.3.5.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 55 |
| **Halaman aplikasi** | `/led/bab2c35a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c35b"></a>

#### `BAB2.C.3.5.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian

| | |
|---|---|
| **Kode** | `BAB2.C.3.5.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 56 |
| **Halaman aplikasi** | `/led/bab2c35b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c35c"></a>

#### `BAB2.C.3.5.C` — Kebijakan, standar, dan indikator terkait perolehan hibah penelitian, kerjasama

| | |
|---|---|
| **Kode** | `BAB2.C.3.5.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 57 |
| **Halaman aplikasi** | `/led/bab2c35c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c41a"></a>

#### `BAB2.C.4.1.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.1.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 58 |
| **Halaman aplikasi** | `/led/bab2c41a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c41b"></a>

#### `BAB2.C.4.1.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan

| | |
|---|---|
| **Kode** | `BAB2.C.4.1.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 59 |
| **Halaman aplikasi** | `/led/bab2c41b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c41c"></a>

#### `BAB2.C.4.1.C` — Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.1.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 60 |
| **Halaman aplikasi** | `/led/bab2c41c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c42a"></a>

#### `BAB2.C.4.2.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.2.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 61 |
| **Halaman aplikasi** | `/led/bab2c42a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c42b"></a>

#### `BAB2.C.4.2.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan

| | |
|---|---|
| **Kode** | `BAB2.C.4.2.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 62 |
| **Halaman aplikasi** | `/led/bab2c42b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c42c"></a>

#### `BAB2.C.4.2.C` — Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.2.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 63 |
| **Halaman aplikasi** | `/led/bab2c42c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c43a"></a>

#### `BAB2.C.4.3.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.3.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 64 |
| **Halaman aplikasi** | `/led/bab2c43a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c43b"></a>

#### `BAB2.C.4.3.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan

| | |
|---|---|
| **Kode** | `BAB2.C.4.3.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 65 |
| **Halaman aplikasi** | `/led/bab2c43b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c43c"></a>

#### `BAB2.C.4.3.C` — Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.3.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 66 |
| **Halaman aplikasi** | `/led/bab2c43c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c44a"></a>

#### `BAB2.C.4.4.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.4.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 67 |
| **Halaman aplikasi** | `/led/bab2c44a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c44b"></a>

#### `BAB2.C.4.4.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan

| | |
|---|---|
| **Kode** | `BAB2.C.4.4.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 68 |
| **Halaman aplikasi** | `/led/bab2c44b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c44c"></a>

#### `BAB2.C.4.4.C` — Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.4.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 69 |
| **Halaman aplikasi** | `/led/bab2c44c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c45a"></a>

#### `BAB2.C.4.5.A` — Kebijakan, standar dan indikator terkait sarana dan prasarana PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.5.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 70 |
| **Halaman aplikasi** | `/led/bab2c45a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c45b"></a>

#### `BAB2.C.4.5.B` — Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan

| | |
|---|---|
| **Kode** | `BAB2.C.4.5.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 71 |
| **Halaman aplikasi** | `/led/bab2c45b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c45c"></a>

#### `BAB2.C.4.5.C` — Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM

| | |
|---|---|
| **Kode** | `BAB2.C.4.5.C` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 72 |
| **Halaman aplikasi** | `/led/bab2c45c` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c51a"></a>

#### `BAB2.C.5.1.A` — Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong

| | |
|---|---|
| **Kode** | `BAB2.C.5.1.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 73 |
| **Halaman aplikasi** | `/led/bab2c51a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c51b"></a>

#### `BAB2.C.5.1.B` — Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola

| | |
|---|---|
| **Kode** | `BAB2.C.5.1.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 74 |
| **Halaman aplikasi** | `/led/bab2c51b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c52a"></a>

#### `BAB2.C.5.2.A` — Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong

| | |
|---|---|
| **Kode** | `BAB2.C.5.2.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 75 |
| **Halaman aplikasi** | `/led/bab2c52a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c52b"></a>

#### `BAB2.C.5.2.B` — Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola

| | |
|---|---|
| **Kode** | `BAB2.C.5.2.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 76 |
| **Halaman aplikasi** | `/led/bab2c52b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c53a"></a>

#### `BAB2.C.5.3.A` — Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong

| | |
|---|---|
| **Kode** | `BAB2.C.5.3.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 77 |
| **Halaman aplikasi** | `/led/bab2c53a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c53b"></a>

#### `BAB2.C.5.3.B` — Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola

| | |
|---|---|
| **Kode** | `BAB2.C.5.3.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 78 |
| **Halaman aplikasi** | `/led/bab2c53b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c54a"></a>

#### `BAB2.C.5.4.A` — Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong

| | |
|---|---|
| **Kode** | `BAB2.C.5.4.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 79 |
| **Halaman aplikasi** | `/led/bab2c54a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c54b"></a>

#### `BAB2.C.5.4.B` — Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola

| | |
|---|---|
| **Kode** | `BAB2.C.5.4.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 80 |
| **Halaman aplikasi** | `/led/bab2c54b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c55a"></a>

#### `BAB2.C.5.5.A` — Kebijakan, standar dan indikator terkait sistem tata kelola dan tata pamong

| | |
|---|---|
| **Kode** | `BAB2.C.5.5.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 81 |
| **Halaman aplikasi** | `/led/bab2c55a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c55b"></a>

#### `BAB2.C.5.5.B` — Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola

| | |
|---|---|
| **Kode** | `BAB2.C.5.5.B` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 82 |
| **Halaman aplikasi** | `/led/bab2c55b` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c61a"></a>

#### `BAB2.C.6.1.A` — Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS

| | |
|---|---|
| **Kode** | `BAB2.C.6.1.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 83 |
| **Halaman aplikasi** | `/led/bab2c61a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c62a"></a>

#### `BAB2.C.6.2.A` — Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS

| | |
|---|---|
| **Kode** | `BAB2.C.6.2.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 84 |
| **Halaman aplikasi** | `/led/bab2c62a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c63a"></a>

#### `BAB2.C.6.3.A` — Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS

| | |
|---|---|
| **Kode** | `BAB2.C.6.3.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 85 |
| **Halaman aplikasi** | `/led/bab2c63a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c64a"></a>

#### `BAB2.C.6.4.A` — Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS

| | |
|---|---|
| **Kode** | `BAB2.C.6.4.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 86 |
| **Halaman aplikasi** | `/led/bab2c64a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2c65a"></a>

#### `BAB2.C.6.5.A` — Dokumen kebijakan, standar dan indikator terkait tridarma PT mencakup VMTS

| | |
|---|---|
| **Kode** | `BAB2.C.6.5.A` |
| **Bab** | BAB II |
| **Bagian** | C |
| **Jenis** | KRITERIA |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 87 |
| **Halaman aplikasi** | `/led/bab2c65a` |

*Bagian yang menguraikan satu kriteria penilaian instrumen.* Bagian ini berpasangan langsung dengan satu butir penilaian di modul Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk butir yang bersangkutan.

Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,
periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab
apa yang diminta instrumen.


<a id="bab2d1"></a>

#### `BAB2.D.1` — Mata Kuliah Inti/Khas Ilmu Komputer

| | |
|---|---|
| **Kode** | `BAB2.D.1` |
| **Bab** | BAB II |
| **Bagian** | D |
| **Jenis** | SUPLEMEN |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 88 |
| **Halaman aplikasi** | `/led/bab2d1` |

*Bagian pelengkap.* Berisi dokumen pendukung yang diminta instrumen, misalnya daftar lampiran atau rekapitulasi tambahan yang tidak masuk bagian utama.


<a id="bab2d2"></a>

#### `BAB2.D.2` — Mata Kuliah Domain Spesifik dan Lingkungan Pengembangan Perangkat Lunak

| | |
|---|---|
| **Kode** | `BAB2.D.2` |
| **Bab** | BAB II |
| **Bagian** | D |
| **Jenis** | SUPLEMEN |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 89 |
| **Halaman aplikasi** | `/led/bab2d2` |

*Bagian pelengkap.* Berisi dokumen pendukung yang diminta instrumen, misalnya daftar lampiran atau rekapitulasi tambahan yang tidak masuk bagian utama.


<a id="bab2d3"></a>

#### `BAB2.D.3` — Mata Kuliah Terkait Matematika/Ilmu Dasar

| | |
|---|---|
| **Kode** | `BAB2.D.3` |
| **Bab** | BAB II |
| **Bagian** | D |
| **Jenis** | SUPLEMEN |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 90 |
| **Halaman aplikasi** | `/led/bab2d3` |

*Bagian pelengkap.* Berisi dokumen pendukung yang diminta instrumen, misalnya daftar lampiran atau rekapitulasi tambahan yang tidak masuk bagian utama.


<a id="bab2d4"></a>

#### `BAB2.D.4` — Proyek Utama (Capstone Project)

| | |
|---|---|
| **Kode** | `BAB2.D.4` |
| **Bab** | BAB II |
| **Bagian** | D |
| **Jenis** | SUPLEMEN |
| **Batas halaman** | tidak dibatasi |
| **Urutan** | 91 |
| **Halaman aplikasi** | `/led/bab2d4` |

*Bagian pelengkap.* Berisi dokumen pendukung yang diminta instrumen, misalnya daftar lampiran atau rekapitulasi tambahan yang tidak masuk bagian utama.


<a id="bagian-led-bab-iii"></a>

### BAB III — 1 bagian

Bab ini memuat **1 bagian** dengan batas halaman keseluruhan
**2 halaman**.

| No | Kode | Bagian | Judul | Jenis | Batas halaman | Halaman terkait |
|---:|---|---|---|---|---:|---|
| 1 | `BAB3` | - | Penutup | NARASI | 2 | `/led/bab3` |


<a id="bab3"></a>

#### `BAB3` — Penutup

| | |
|---|---|
| **Kode** | `BAB3` |
| **Bab** | BAB III |
| **Bagian** | - |
| **Jenis** | NARASI |
| **Batas halaman** | 2 |
| **Urutan** | 92 |
| **Halaman aplikasi** | `/led/bab3` |

*Bagian yang berisi uraian bebas.* Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan didukung data.


---

<a id="14-modul-matriks-penilaian"></a>

## 14. Modul Matriks Penilaian

Rumus perhitungan dan seluruh 82 butir beserta bobotnya

Modul ini menghitung capaian akreditasi. Tiap butir punya empat tingkat skor
beserta deskriptornya dan bobotnya sendiri.

### Rumus perhitungan

```
nilai akhir = Σ (skor butir × bobot butir) / 4
```

- **Jumlah butir:** 82
- **Total bobot:** 400 (dirancang tepat 400; pengisian data akan gagal kalau tidak sama)
- **Skor tiap butir:** 0 sampai 4
- **Bobot perkalian:** skor 1 dikali 1, skor 2 dikali 2, skor 3 dikali 3, skor 4 dikali 4

### Sebaran butir per kriteria

| Kriteria | Nama | Butir | Bobot |
|---|---|---:|---:|
| `CE` | Kondisi Eksternal | 1 | 4 |
| `PU` | Profil Unit Pengelola Program Studi | 1 | 4 |
| `C1` | Budaya Mutu | 10 | 40 |
| `C2` | Relevansi Pendidikan | 20 | 120 |
| `C3` | Relevansi Penelitian | 15 | 72 |
| `C4` | Relevansi PkM | 15 | 60 |
| `C5` | Akuntabilitas | 10 | 40 |
| `C6` | Diferensiasi Misi | 5 | 40 |
| `SUP` | Suplemen Program Studi | 5 | 20 |
| **Total** | | **82** | **400** |

### Daftar seluruh butir

| No | Kode | Kriteria | Bobot | Tahap PPEPP | Elemen penilaian |
|---:|---|---|---:|---|---|
| 1 | `A` | CE | 4 | — | Kondisi Eksternal |
| 2 | `B` | PU | 4 | — | Profil Unit Pengelola Program Studi / Analisis Internal |
| 3 | `1.1A` | C1 | 3 | PENETAPAN | 1.1 [PENETAPAN] A. Kebijakan, standar, dan indikator terkait sistem tata kelola internal UPPS dan/ atau PT ber |
| 4 | `1.1B` | C1 | 3 | — | B. Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten sebagai pelaksana di tingkat |
| 5 | `1.2A` | C1 | 5 | PELAKSANAAN | 1.2 [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait sistem tata kelola internal UPPS dan/ atau PT be |
| 6 | `1.2.B` | C1 | 5 | — | B. Efektifitas pelaksanaan standar dan indikator yang menunjukkan berfungsinya berfungsinya SPMI dengan SDM ya |
| 7 | `1.3.A` | C1 | 5 | EVALUASI | 1.3. [EVALUASI] A. Efektifitas keberkalaan pelaksanaan evaluasi ketercapaian standar dan indikator terkait sis |
| 8 | `1.3B` | C1 | 5 | — | B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait fungsi SPMI dan SDM pelaksana d |
| 9 | `1.4.A` | C1 | 2 | PENGENDALIAN | 1.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator |
| 10 | `1.4.B` | C1 | 2 | — | B. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait fungsi SPMI |
| 11 | `1.5.A` | C1 | 5 | PENINGKATAN | 1.5. [PENINGKATAN] A. Efektifitas peningkatan/ optimalisasi standar dan indikator terkait sistem tata kelola i |
| 12 | `1.5.B` | C1 | 5 | — | B. Efektifitas peningkatan/ optimalisasi standar dan indikator terkait fungsi SPMI dan SDM pelaksana di tingka |
| 13 | `2.1.A` | C2 | 5 | PENETAPAN | 2.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan pembia |
| 14 | `2.1.B` | C2 | 4 | — | B. Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum outcome-based education, |
| 15 | `2.1.C` | C2 | 4 | — | C. Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran (luring, daring, atau hibr |
| 16 | `2.1.D` | C2 | 4 | — | D. Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi lulusan yang dapat dinilai dari |
| 17 | `2.2.A` | C2 | 9 | PELAKSANAAN | 2.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait Sarana dan prasarana pendidikan, DTPR, dan pemb |
| 18 | `2.2.B` | C2 | 7 | — | B. Efektifitas pelaksanaan Kegiatan terkait isi pembelajaran dan rancangan kurikulum outcome-based education, |
| 19 | `2.2C` | C2 | 7 | — | C. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang fleksibilitas dalam proses pembelaja |
| 20 | `2.2D` | C2 | 30 | — | D. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang prestasi mahasiswa dan kompetensi lu |
| 21 | `2.3.A` | C2 | 5 | EVALUASI | 2.3. [EVALUASI] A. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator tentang sarana dan pras |
| 22 | `2.3.B` | C2 | 5 | — | B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait isi pembelajaran dan rancangan |
| 23 | `2.3.C` | C2 | 4 | — | C. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait fleksibilitas dalam proses pemb |
| 24 | `2.3.D` | C2 | 4 | — | D. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait prestasi mahasiswa dan kompeten |
| 25 | `2.4.A` | C2 | 4 | PENGENDALIAN | 2.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator |
| 26 | `2.4.B` | C2 | 4 | — | B. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait isi pembela |
| 27 | `2.4.C` | C2 | 3 | — | C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait fleksibilit |
| 28 | `2.4.D` | C2 | 3 | — | D. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait prestasi ma |
| 29 | `2.5.A` | C2 | 5 | PENINGKATAN | 2.5. [PENINGKATAN] A. Efektifitas peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait s |
| 30 | `2.5.B` | C2 | 5 | — | B. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait isi pembelajaran dan |
| 31 | `2.5.C` | C2 | 4 | — | C. Efektifitas peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait fleksibilitas dalam |
| 32 | `2.5.D` | C2 | 4 | — | D. Efektifitas peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait prestasi mahasiswa d |
| 33 | `3.1.A` | C3 | 4 | PENETAPAN | 3.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan pembia |
| 34 | `3.1.B` | C3 | 4 | — | B. Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian, pelibatan mahasiswa berdasarka |
| 35 | `3.1.C` | C3 | 4 | — | C. Kebijakan,standar, dan indikator terkait perolehan hibah penelitian, kerjasama penelitian, publikasi baik l |
| 36 | `3.2.A` | C3 | 8 | PELAKSANAAN | 3.2. [PELAKSANAAN] A. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang sarana dan prasar |
| 37 | `3.2.B` | C3 | 6 | — | B. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang implementasi peta jalan penelitian, |
| 38 | `3.2.C` | C3 | 18 | — | C. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang perolehan hibah penelitian, kerjasam |
| 39 | `3.3.A` | C3 | 3 | EVALUASI | 3.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait sarana dan pras |
| 40 | `3.3.B` | C3 | 3 | — | B. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait implementasi peta jalan penelit |
| 41 | `3.3.C` | C3 | 3 | — | C. Efektivitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait perolehan hibah penelitian, ker |
| 42 | `3.4.A` | C3 | 3 | PENGENDALIAN | 3.4. [PENGENDALIAN] A. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator |
| 43 | `3.4.B` | C3 | 3 | — | B. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait implementas |
| 44 | `3.4.C` | C3 | 3 | — | C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait perolehan h |
| 45 | `3.5.A` | C3 | 4 | PENINGKATAN | 3.5. [PENINGKATAN] A. Efektifitas Peningkatan/optim ali sasi hasil ketercapaian standar dan indikator terkait |
| 46 | `3.5.B` | C3 | 3 | — | B. Efektifitas Peningkatan/optim ali sasi hasil ketercapaian standar dan indikator terkait implementasi peta j |
| 47 | `3.5.C` | C3 | 3 | — | C. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait perolehan hibah pene |
| 48 | `4.1.A` | C4 | 3 | PENETAPAN | 4.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait saranamdan Prasarana PkM, DTPR, dan pembiayaan Pk |
| 49 | `4.1.B` | C4 | 2.5 | — | B. Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi |
| 50 | `4.1.C` | C4 | 2 | — | C. Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM, diseminasi baik lingkup lokal |
| 51 | `4.2.A` | C4 | 7 | PELAKSANAAN | 4.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang sarana dan prasar |
| 52 | `4.2.B` | C4 | 6 | — | B. Efektifitas pelaksanaan kegiatan terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi |
| 53 | `4.2.C` | C4 | 15 | — | C. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang perolehan hibah PkM, Kerjasama PkM, |
| 54 | `4.3.A` | C4 | 3 | EVALUASI | 4.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait sarana dan Pras |
| 55 | `4.3.B` | C4 | 3 | — | B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait implementasi peta jalan PkM, pe |
| 56 | `4.3.C` | C4 | 3 | — | C. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait perolehan hibah PkM, kerjasama |
| 57 | `4.4.A` | C4 | 3 | PENGENDALIAN | 4.4. [PENGENDALIAN] A. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian terkait sarana dan Pr |
| 58 | `4.4.B` | C4 | 2 | — | B. Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi |
| 59 | `4.4.C` | C4 | 2 | — | C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian terkait perolehan hibah PkM, kerjasama Pk |
| 60 | `4.5.A` | C4 | 3 | PENINGKATAN | 4.5. [PENINGKATAN] A. Efektifitas peningkatan/optimali sasi hasil Ketercapaian standar dan indikator terkait s |
| 61 | `4.5.B` | C4 | 3 | — | B. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait implementasi peta ja |
| 62 | `4.5.C` | C4 | 2.5 | — | C. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait perolehan hibah PkM, |
| 63 | `5.1.A` | C5 | 3 | PENETAPAN | 5.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait sistem tata kelola yang otonom secara transparan, |
| 64 | `5.1.B` | C5 | 2 | — | B. Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana d |
| 65 | `5.2.A` | C5 | 5 | PELAKSANAAN | 5.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait standar dan indikator terkait sistem tata kelol |
| 66 | `5.2.B` | C5 | 4 | — | B. Efektifitas pelaksanaan standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola dan tata pam |
| 67 | `5.3.A` | C5 | 6 | EVALUASI | 5.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait sistem tata kel |
| 68 | `5.3.B` | C5 | 5 | — | B. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait audit mutu pemenuhan tupoksi ta |
| 69 | `5.4.A` | C5 | 3 | PENGENDALIAN | 5.4. [PENGENDALIAN] A. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator |
| 70 | `5.4.B` | C5 | 2 | — | B. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait audit mutu |
| 71 | `5.5.A` | C5 | 5 | PENINGKATAN | 5.5. [PENINGKATAN] A. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait s |
| 72 | `5.5.B` | C5 | 5 | — | B. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait audit mutu pemenuhan |
| 73 | `6.1` | C6 | 5 | PENETAPAN | 6.1. [PENETAPAN] Kebijakan, standar dan indikator terkait tridarma perguruan tinggi yang Mencakup VMTS, rencan |
| 74 | `6.2` | C6 | 8 | PELAKSANAAN | 6.2. [PELAKSANAAN] Efektifitas Pelaksanaan standar dan indikator terkait tridarma perguruan tinggi yang Mencak |
| 75 | `6.3` | C6 | 13 | EVALUASI | 6.3. [EVALUASI] Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait tridarma perguruan |
| 76 | `6.4` | C6 | 4 | PENGENDALIAN | 6.4. [PENGENDALIAN] Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator te |
| 77 | `6.5` | C6 | 10 | PENINGKATAN | 6.5. [PENINGKATAN] Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait trid |
| 78 | `SUP.1` | SUP | 4 | — | Mata kuliah inti/khas prodi |
| 79 | `SUP.2` | SUP | 3 | — | Mata kuliah domain spesifik dan lingkungan prodi infokom |
| 80 | `SUP.3` | SUP | 3 | — | Mata kuliah terkait Matematika/metode atau Analisis Kuantitatif yang relevan |
| 81 | `SUP.4` | SUP | 5 | — | Proyek Utama (Capstone project) yang relevan |
| 82 | `SUP.5` | SUP | 5 | — | Pengembangan bidang Infokom yang digunakan di masyarakat |


---

<a id="15-penjelasan-lengkap-tiap-butir-penilaian"></a>

## 15. Penjelasan Lengkap Tiap Butir Penilaian

Deskriptor dan keempat tingkat skor untuk seluruh 82 butir — dipakai saat menilai

Bab ini memuat isi penuh setiap butir penilaian: apa yang dinilai, apa yang
diminta untuk tiap tingkat skor, dan berapa bobotnya.

**Cara membacanya.** Setiap butir punya empat tingkat. Penilai memilih tingkat
yang paling sesuai dengan kondisi nyata program studi. Tingkat yang lebih
tinggi menuntut bukti yang lebih kuat — perhatikan kata penegasnya: *kurang*,
*cukup*, *komprehensif*, *sangat komprehensif*.

> **Skor bukan nilai akhir.** Kontribusi tiap butir dihitung dengan
> `skor × bobot`, lalu dijumlahkan seluruhnya dan dibagi 4. Butir berbobot
> besar berpengaruh lebih kuat terhadap hasil akhir.


### Kriteria `CE` — Kondisi Eksternal

Memuat **1 butir** dengan total bobot **4**.


#### Butir `A` — bobot 4

| | |
|---|---|
| **Kode** | `A` |
| **Kriteria** | `CE` — Kondisi Eksternal |
| **Bobot** | 4 |
| **Jenis** | INPUT |
| **Halaman di instrumen** | 5 |

**Elemen penilaian:**

> Kondisi Eksternal

**Deskriptor:**

Kemampuan UPPS dalam menganalisis aspek- aspek dalam lingkungan makro dan lingkungan mikro yang relevan dan dapat mempengaruhi eksistensi dan pengembangan PS maupun UPPS. Berdasar hasil analisis kondisi makro dan mikro, UPPS perlu mengidentifikasi peluang dan ancaman.

**Tingkat skor:**

- **Skor 1** — UPPS mampu menganalisis aspek- aspek dalam lingkungan makro dan lingkungan mikro yang relevan dan dapat mempengaruhi eksistensi dan pengembangan PS maupun UPPS, serta mengidentifikasi peluang dan ancaman secara kurang komprehensif.

- **Skor 2** — UPPS mampu menganalisis aspek- aspek dalam lingkungan makro dan lingkungan mikro yang relevan dan dapat mempengaruhi eksistensi dan pengembangan PS maupun UPPS, serta mengidentifikasi peluang dan ancaman secara cukup komprehensif.

- **Skor 3** — UPPS mampu menganalisis aspek- aspek dalam lingkungan makro dan lingkungan mikro yang relevan dan dapat mempengaruhi eksistensi dan pengembangan PS maupun UPPS, serta mengidentifikasi peluang dan ancaman secara komprehensif.

- **Skor 4** — UPPS mampu menganalisis aspek- aspek dalam lingkungan makro dan lingkungan mikro yang relevan dan dapat mempengaruhi eksistensi dan pengembangan PS maupun UPPS, serta mengidentifikasi peluang dan ancaman secara sangat komprehensif.


### Kriteria `PU` — Profil Unit Pengelola Program Studi

Memuat **1 butir** dengan total bobot **4**.


#### Butir `B` — bobot 4

| | |
|---|---|
| **Kode** | `B` |
| **Kriteria** | `PU` — Profil Unit Pengelola Program Studi |
| **Bobot** | 4 |
| **Jenis** | INPUT |
| **Halaman di instrumen** | 5 |

**Elemen penilaian:**

> Profil Unit Pengelola Program Studi / Analisis Internal

**Deskriptor:**

Kemampuan UPPS dan PS dalam menyajikan informasi secara ringkas dengan mengemukakan hal-hal yang terpenting tentang sejarah UPPS, visi, misi, tujuan, strategi dan tata nilai, struktur organisasi, mahasiswa dan lulusan, sumber daya manusia (dosen dan tenaga kependidikan), keuangan, sarana dan prasarana, sistem penjaminan mutu internal, serta kinerja UPPS.

**Tingkat skor:**

- **Skor 1** — UPPS mampu menyajikan seluruh informasi secara ringkas, kurang komprehensif, dan kurang konsisten terhadap data dan informasi yang disampaikan pada masing-masing kriteria.

- **Skor 2** — UPPS mampu menyajikan seluruh informasi secara ringkas, cukup komprehensif, dan konsisten terhadap data dan informasi yang disampaikan pada masing-masing kriteria.

- **Skor 3** — UPPS mampu menyajikan seluruh informasi secara ringkas, komprehensif, dan konsisten terhadap data dan informasi yang disampaikan pada masing-masing kriteria.

- **Skor 4** — UPPS mampu menyajikan seluruh informasi secara ringkas, sangat komprehensif, dan konsisten terhadap data dan informasi yang disampaikan pada masing-masing kriteria.


### Kriteria `C1` — Budaya Mutu

Memuat **10 butir** dengan total bobot **40**.


#### Butir `1.1A` — bobot 3

| | |
|---|---|
| **Kode** | `1.1A` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 3 |
| **Jenis** | INPUT |
| **Tahap PPEPP** | PENETAPAN |

**Elemen penilaian:**

> 1.1 [PENETAPAN] A. Kebijakan, standar, dan indikator terkait sistem tata kelola internal UPPS dan/ atau PT berikut SOP, yang mencakup administrasi akademik, keuangan, SDM, dan aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT.

**Deskriptor:**

1.1 [PENETAPAN] A. Ketersediaan kebijakan, standar, dan indikator terkait sistem tata kelola internal UPPS dan/ atau PT berikut SOP, yang mencakup administrasi akademik, keuangan, SDM, dan aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, dan 3.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar, dan indikator terkait sistem tata kelola internal UPPS dan/ atau PT berikut SOP, yang mencakup: 1. Administrasi akademik. 2. Administrasi keuangan. 3. Administrasi SDM. 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar, dan indikator terkait sistem tata kelola internal UPPS dan/ atau PT berikut SOP, yang mencakup: 1. Administrasi akademik. 2. Administrasi keuangan. 3. Administrasi SDM. 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar, dan indikator terkait sistem tata kelola internal UPPS dan/ atau PT berikut SOP, yang mencakup: 1. Administrasi akademik. 2. Administrasi keuangan. 3. Administrasi SDM. 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar, dan indikator terkait sistem tata kelola internal UPPS dan/ atau PT berikut SOP, yang mencakup: 1. Administrasi akademik. 2. Administrasi keuangan. 3. Administrasi SDM. 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `1.1B` — bobot 3

| | |
|---|---|
| **Kode** | `1.1B` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 3 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> B. Kebijakan, standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT.

**Deskriptor:**

B. Ketersediaan kebijakan,standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi semua aspek dengan bukti lengkap.

**Tingkat skor:**

- **Skor 1** — Tersedianya Kebijakan, standar, dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, disertai bukti-bukti yang sahih dan lengkap.


#### Butir `1.2A` — bobot 5

| | |
|---|---|
| **Kode** | `1.2A` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 5 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PELAKSANAAN |

**Elemen penilaian:**

> 1.2 [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait sistem tata kelola internal UPPS dan/ atau PT berikut SOP, yang mencakup administrasi akademik, keuangan, SDM, dan aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT. Dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT.

**Deskriptor:**

1.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait standar dan indikator yang menunjukkan berfungsinya sistem tata kelola internal UPPS dan/atau PT berikut, SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, dan 3.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator yang menunjukkan berfungsinya sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Aministrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap, Dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator yang menunjukkan berfungsinya sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator yang menunjukkan berfungsinya sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, secara efektif disertai bukti-bukti yang sahih dan lengkap, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator yang menunjukkan berfungsinya sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik. 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT


#### Butir `1.2.B` — bobot 5

| | |
|---|---|
| **Kode** | `1.2.B` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 5 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan standar dan indikator yang menunjukkan berfungsinya berfungsinya SPMI dengan SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT.

**Deskriptor:**

B. Efektifitas pelaksanaan kegiatan terkait standar dan indikator yang menunjukkan. 1. Berfungsinya SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi semua aspek dengan bukti lengkap.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan standar dan indikator yang menunjukkan. 1. Berfungsinya SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan standar dan indikator yang menunjukkan. 1. Berfungsinya SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan standar dan indikator yang menunjukkan. 1. Berfungsinya SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan standar dan indikator yang menunjukkan. 1. Berfungsinya SPMI dengan 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `1.3.A` — bobot 5

| | |
|---|---|
| **Kode** | `1.3.A` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | EVALUASI |

**Elemen penilaian:**

> 1.3. [EVALUASI] A. Efektifitas keberkalaan pelaksanaan evaluasi ketercapaian standar dan indikator terkait sistem tata kelola Internal UPPS dan/atau PT berikut SOP, yang mencakup Administrasi Akademik, Keuangan, SDM, dan aspek lain di tingkat UPPS dan/atau PT.

**Deskriptor:**

1.3. [EVALUASI] A. Efektifitas dan keberkalaan pelaksanaan evaluasi ketercapaian standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, dan 3.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara berkala dan kurang efektif, dan disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara berkala dan cukup efektif, dan disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara berkala dan efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait fungsi SPMI dengan SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara berkala dan sangat efektif, dan disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `1.3B` — bobot 5

| | |
|---|---|
| **Kode** | `1.3B` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait fungsi SPMI dan SDM pelaksana di tingkat UPPS dan/atau PT.

**Deskriptor:**

B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM pelaksana di tingkat UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi semua aspek dengan bukti lengkap.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, dilaksanakan secara berkala dan kurang efektif, dan disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, dilaksanakan secara berkala dan cukup efektif, dan disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, ilaksanakan secara berkala dan efektif, dan disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, dilaksanakan secara berkala dan sangat efektif, dan disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `1.4.A` — bobot 2

| | |
|---|---|
| **Kode** | `1.4.A` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 2 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PENGENDALIAN |

**Elemen penilaian:**

> 1.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup

**Deskriptor:**

1.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, dan 3.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara kurang efektif, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara cukup efektif, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara efektif, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, dilaksanakan secara sangat efektif, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `1.4.B` — bobot 2

| | |
|---|---|
| **Kode** | `1.4.B` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 2 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait fungsi SPMI dan SDM Pelaksananya di tingkat PT/UPPS.

**Deskriptor:**

B. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi semua aspek dengan bukti lengkap.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan 2. SDM yang kompeten sebagai pelaksana di tingkat PT/UPPS, dilaksanakan secara kurang efektif, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan 2. SDM yang kompeten sebagai pelaksana di tingkat PT/UPPS, dilaksanakan secara cukup efektif, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan 2. SDM yang kompeten sebagai pelaksana di tingkat PT/UPPS, dilaksanakan secara efektif, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fungsi SPMI dengan 2. SDM yang kompeten sebagai pelaksana di tingkat PT/UPPS, dilaksanakan secara sangat efektif, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `1.5.A` — bobot 5

| | |
|---|---|
| **Kode** | `1.5.A` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | PENINGKATAN |

**Elemen penilaian:**

> 1.5. [PENINGKATAN] A. Efektifitas peningkatan/ optimalisasi standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup administrasi akademik, keuangan, sdm, dan aspek lain dalam siklus PPEPP di tingkat UPPS dan/atau PT.

**Deskriptor:**

1.5. [PENINGKATAN] A. Efektifitas Peningkatan/optimalisasi standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, dan 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, dan 3.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optimali sasi standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, dan 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, secara kurang efektif disertai bukti-bukti yang sahih, tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optimali sasi standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, dan 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optimalisa si standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, dan 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi standar dan indikator terkait sistem tata kelola internal UPPS dan/atau PT berikut SOP, yang mencakup: 1. Administrasi akademik, 2. Administrasi keuangan, 3. Administrasi SDM, dan 4. Aspek lain dalam siklus PPEPP, di tingkat UPPS dan/atau PT, dokumen pendukung misalnya laporan tahunan pimpinan UPPS dan/atau PT, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `1.5.B` — bobot 5

| | |
|---|---|
| **Kode** | `1.5.B` |
| **Kriteria** | `C1` — Budaya Mutu |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas peningkatan/ optimalisasi standar dan indikator terkait fungsi SPMI dan SDM pelaksana di tingkat UPPS dan/atau PT .

**Deskriptor:**

B. Efektifitas Peningkatan/optimalisasi standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT.

**Syarat peringkat Unggul:** Memenuhi semua aspek dengan bukti lengkap.

**Tingkat skor:**

- **Skor 1** — Peningkatan/ optimalisasi standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT. secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/ optimalisasi standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/ optimalisasi standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/ optimalisasi standar dan indikator terkait: 1. Fungsi SPMI dengan. 2. SDM yang kompeten sebagai pelaksana di tingkat UPPS dan/atau PT, secara sangat efektif disertai bukti- bukti yang sahih dan sangat lengkap.


### Kriteria `C2` — Relevansi Pendidikan

Memuat **20 butir** dengan total bobot **120**.


#### Butir `2.1.A` — bobot 5

| | |
|---|---|
| **Kode** | `2.1.A` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 5 |
| **Jenis** | INPUT |
| **Tahap PPEPP** | PENETAPAN |

**Elemen penilaian:**

> 2.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan pembiayaan pendidikan, penerimaan mahasiswa baru dalam rangka Perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Deskriptor:**

2.1. [PENETAPAN] A. Ketersediaan kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, disertai bukti-bukti yang sahih tetapi kurang lengkap

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, disertai bukti-bukti yang sahih dan cukup lengkap

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, disertai bukti-bukti yang sahih dan lengkap

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, disertai bukti-bukti yang sahih dan sangat lengkap


#### Butir `2.1.B` — bobot 4

| | |
|---|---|
| **Kode** | `2.1.B` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> B. Kebijakan, standar dan indikator terkait isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI Level 6), yang ditetapkan oleh Perguruan tinggi serta keterlibatan/masukan pemangku kepentingan (stakeholder) dalam penyusunannya.

**Deskriptor:**

B. Ketersediaan kebijakan, standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi, dan. 2. Keterlibatan/masukan pemangku kepentingan (stakeholder) dalam penyusunannya.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan memenuhi sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi, dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi, dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunanny, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome- based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi, dan. 2. Keterlibatan/masuk an pemangku kepentingan (stakeholder) dalam penyusunannya, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome- based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi, dan. 2. Keterlibatan/masuk an pemangku kepentingan (stakeholder) dalam penyusunannya, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.1.C` — bobot 4

| | |
|---|---|
| **Kode** | `2.1.C` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> C. Kebijakan, standar dan indikator tentang fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL) yang Relevan dengan bidang keilmuan PS, penciptaan suasana akademik, dan penilaian pembelajaran serta pemenuhan beban belajar.

**Deskriptor:**

C. Ketersediaan kebijakan, standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan. 4. Pemenuhan beban belajar.

**Syarat peringkat Unggul:** Memenuhi aspek 2, 3, 4, dan sebagian aspek 1

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik. 3. Penilaian pembelajaran, dan. 4. Pemenuhan beban belajar, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik. 3. Penilaian pembelajaran, dan. 4. Pemenuhan beban belajar, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik. 3. Penilaian pembelajaran, dan. 4. Pemenuhan beban belajar, disertai bukti-bukti yang sahih dan sangat lengkap.

- **Skor 4** — Tersedianya kebijakan, standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik. 3. Penilaian pembelajaran, dan. 4. Pemenuhan beban belajar, disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `2.1.D` — bobot 4

| | |
|---|---|
| **Kode** | `2.1.D` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> D. Kebijakan, standar dan indikator terkait prestasi mahasiswa dan kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi), dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), serta sebaran kerja lulusan (lokal, nasional, internasional).

**Deskriptor:**

D. Ketersediaan kebijakan, standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional)

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 2, dan sebagian aspek 3.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, internasional), disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, internasional), dsertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, internasional), disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, internasional), disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.2.A` — bobot 9

| | |
|---|---|
| **Kode** | `2.2.A` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 9 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PELAKSANAAN |

**Elemen penilaian:**

> 2.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait Sarana dan prasarana pendidikan, DTPR, dan pembiayaan pendidikan, penerimaan mahasiswa baru dalam rangka Perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus..

**Deskriptor:**

2.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, secara sangat efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, secara sangat efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, secara sangat efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.2.B` — bobot 7

| | |
|---|---|
| **Kode** | `2.2.B` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 7 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan Kegiatan terkait isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI Level 6), yangDitetapkan oleh perguruan tinggi serta keterlibatan/masukan pemangku kepentingan (stakeholder) dalam penyusunannya.

**Deskriptor:**

B. Efektifitas Pelaksanaan Kegiatan terkait standar dan indikator tentang: 1 . Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi serta. 2 . Keterlibatan/masukan pemangku kepentingan (stakeholder) dalam penyusunannya.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan memenuhi sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan Kegiatan terkait standar dan indikator tentang: 1 . Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi serta. 2. Keterlibatan/mas ukan pemangku kepentingan (stakeholder) dalam penyusunannya, secara sangat efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan Kegiatan terkait standar dan indikator tentang: 1 . Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi serta. 2 . Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, secara sangat efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan Kegiatan terkait standar dan indikator tentang: 1 . Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi serta. 2 . Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, secara sangat efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan Kegiatan terkait standar dan indikator tentang: 1 . Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi serta. 2 . Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.2C` — bobot 7

| | |
|---|---|
| **Kode** | `2.2C` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 7 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang keilmuan PS, penciptaan suasana akademik, dan penilaian pembelajaran serta pemenuhan beban belajar.

**Deskriptor:**

C. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaia pembelajaran, dan 4. Pemenuhan beban belajar.

**Syarat peringkat Unggul:** Memenuhi aspek 2, 3, 4, dan sebagian aspek 1

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaia pembelajaran, dan 4. Pemenuhan beban belajar, secara sangat efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaia pembelajaran, dan 4. Pemenuhan beban belajar, secara sangat efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaia pembelajaran, dan 4. Pemenuhan beban belajar, secara sangat efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator tentang: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaia pembelajaran, dan 4. Pemenuhan beban belajar, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.2D` — bobot 30

| | |
|---|---|
| **Kode** | `2.2D` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 30 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> D. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang prestasi mahasiswa dan kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), serta sebaran kerja lulusan (lokal, nasional, internasional)

**Deskriptor:**

D. Efektifitas pelaksanaan kegiatan terkait standar dan indikator terkait: 1. Prestasi mahasiswa 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional)

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 2, dan sebagian aspek 3.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator terkait 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, secara kurang efektif disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator terkait 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, secara cukup efektif disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator terkait 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator terkait 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.3.A` — bobot 5

| | |
|---|---|
| **Kode** | `2.3.A` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | EVALUASI |

**Elemen penilaian:**

> 2.3. [EVALUASI] A. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator tentang sarana dan prasarana pendidikan, DTPR, dan pembiayaan pendidikan, penerimaan mahasiswa baru dalam rangka Perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Deskriptor:**

2.3. [EVALUASI] A. Efektivitas pelaksanaan evaluasi ketercapaian standar dan indikator tentang 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator tentang 1. Sarana dan prasarana pendidikan. 2. DTPR. 3. Pembiayaan pendidikan, dan. 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara berkala dan kurang efektif, dan

- **Skor 2** — Evaluasi ketercapaian standar dan indikator tentang 1. Sarana dan prasarana pendidikan. 2. DTPR. 3. Pembiayaan pendidikan, dan. 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara berkala dan cukup efektif, dan

- **Skor 3** — Evaluasi ketercapaian standar dan indikator tentang 1. Sarana dan prasarana pendidikan. 2. DTPR. 3. Pembiayaan pendidikan, dan. 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara berkala dan efektif, dan disertai

- **Skor 4** — Evaluasi ketercapaian standar dan indikator tentang 1. Sarana dan prasarana pendidikan. 2. DTPR. 3. Pembiayaan pendidikan, dan. 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara berkala dan sangat efektif, dan disertai bukti- bukti yang


#### Butir `2.3.B` — bobot 5

| | |
|---|---|
| **Kode** | `2.3.B` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait isi pembelajaran dan rancangan kurikulum outcome- based education, yang mencakup soft dan hard competence (memenuhi KKNI Level 6), yang ditetapkan oleh perguruan tinggi serta keterlibatan/masukan pemangku kepentingan (stakeholder) dalam penyusunannya

**Deskriptor:**

B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/masuk an pemangku kepentingan (stakeholder) dalam penyusunannya.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan memenuhi sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/mas ukan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara berkala dan kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara berkala dan cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara berkala dan efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara berkala dan sangat efektif disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `2.3.C` — bobot 4

| | |
|---|---|
| **Kode** | `2.3.C` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang keilmuan PS, penciptaan suasana akademik, dan penilaian pembelajaran serta pemenuhan beban belajar

**Deskriptor:**

C. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar.

**Syarat peringkat Unggul:** Memenuhi aspek 2, 3, 4, dan sebagian aspek 1

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.3.D` — bobot 4

| | |
|---|---|
| **Kode** | `2.3.D` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> D. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait prestasi mahasiswa dan kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), serta sebaran kerja lulusan (lokal, nasional, internasional).

**Deskriptor:**

D. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa, 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional).

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 2, dan sebagian aspek 3.

**Tingkat skor:**

- **Skor 1** — Evaluasi Ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa, 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi Ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa, 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara cukup efektif disertaibukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi Ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa, 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi Ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa, 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.4.A` — bobot 4

| | |
|---|---|
| **Kode** | `2.4.A` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PENGENDALIAN |

**Elemen penilaian:**

> 2.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, Dan pembiayaan pendidikan, penerimaan mahasiswa baru dalam rangka Perluasan akses, Keragaman asal calon mahasiswa (misal: tempat, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Deskriptor:**

2.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara kurang efektif, dan disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara cukup efektif, dan disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, dan 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: asal, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara sangat efektif, dan disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.4.B` — bobot 4

| | |
|---|---|
| **Kode** | `2.4.B` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait isi pembelajaran dan rancangan kurikulum outcome- based education, yang mencakup soft dan hard competence (memenuhi KKNI Level 6), yang Ditetapkan oleh Perguruan tinggi serta keterlibatan/masukan pemangku kepentingan (stakeholder) dalam penyusunannya.

**Deskriptor:**

B. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome- based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi, dan 2. Keterlibatan/masuk an pemangku kepentingan (stakeholder) dalam penyusunannya.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan memenuhi sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan. 2. Keterlibatan/masu kan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.4.C` — bobot 3

| | |
|---|---|
| **Kode** | `2.4.C` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 3 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait fleksibilitas dalam proses pembelajaran dan pemenuhan beban belajar, misalnya: micro- credential, rekognisi pembelajaran lampau (RPL), atau pembelajaran di luar program studi.

**Deskriptor:**

C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar.

**Syarat peringkat Unggul:** Memenuhi aspek 2, 3, 4, dan sebagian aspek 1

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang PS, 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang PS, 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang PS, 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang PS. 2. Penciptaan suasana akademik. 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.4.D` — bobot 3

| | |
|---|---|
| **Kode** | `2.4.D` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 3 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> D. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait prestasi mahasiswa dan kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), serta sebaran kerja lulusan (lokal, nasional, internasional)

**Deskriptor:**

D. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), 3. Sebaran kerja lulusan (lokal, nasional, internasional).

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 2, dan sebagian aspek 3.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.5.A` — bobot 5

| | |
|---|---|
| **Kode** | `2.5.A` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | PENINGKATAN |

**Elemen penilaian:**

> 2.5. [PENINGKATAN] A. Efektifitas peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait sarana dan prasarana pendidikan, DTPR, dan pembiayaan pendidikan, penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: tempat, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Deskriptor:**

2.5. [PENINGKATAN] A. Efektifitas peningkatan/optimalis asi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: tempat, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: tempat, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara kurang efektif, dan disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: tempat, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara cukup efektif, dan disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: tempat, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana pendidikan, 2. DTPR, 3. Pembiayaan pendidikan, 4. Penerimaan mahasiswa baru dalam rangka perluasan akses, keragaman asal calon mahasiswa (misal: tempat, suku, jenis kelamin), program afirmasi, dan calon mahasiswa berkebutuhan khusus, dilaksanakan secara sangat efektif, dan disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.5.B` — bobot 5

| | |
|---|---|
| **Kode** | `2.5.B` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait isi pembelajaran dan rancangan kurikulum outcome- based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi serta keterlibatan/masukan pemangku kepentingan (stakeholder) dalam penyusunannya.

**Deskriptor:**

B. Efektifitas peningkatan/optimalisa si hasil ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome- based education/OBE, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi, dan 2. Keterlibatan/masuka n pemangku kepentingan (stakeholder) dalam penyusunannya.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan memenuhi sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome- based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan 2. Keterlibatan/ masukan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Isi pembelajaran dan rancangan kurikulum outcome- based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan 2. Keterlibatan/ masukan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome- based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan 2. Keterlibatan/ masukan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Isi pembelajaran dan rancangan kurikulum outcome-based education, yang mencakup soft dan hard competence (memenuhi KKNI level 6), yang ditetapkan oleh perguruan tinggi dan 2. Keterlibatan/ masukan pemangku kepentingan (stakeholder) dalam penyusunannya, dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.5.C` — bobot 4

| | |
|---|---|
| **Kode** | `2.5.C` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektifitas peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait fleksibilitas dalam proses pembelajaran dan pemenuhan beban belajar, misalnya: micro- credential, rekognisi pembelajaran lampau (RPL), atau pembelajaran di luar program studi.

**Deskriptor:**

C. Efektifitas peningkatan/optimalisasi hasil ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL)) yang relevan dengan bidang keilmuan PS 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar.

**Syarat peringkat Unggul:** Memenuhi aspek 2, 3, 4, dan sebagian aspek 1

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang keilmuan PS. 2. Penciptaan suasana akademik. 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, laksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro-credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Fleksibilitas dalam proses pembelajaran (luring, daring, atau hibrida, CBL, PBL, micro- credential, rekognisi pembelajaran lampau (RPL) yang relevan dengan bidang keilmuan PS, 2. Penciptaan suasana akademik, 3. Penilaian pembelajaran, dan 4. Pemenuhan beban belajar, dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `2.5.D` — bobot 4

| | |
|---|---|
| **Kode** | `2.5.D` |
| **Kriteria** | `C2` — Relevansi Pendidikan |
| **Bobot** | 4 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> D. Efektifitas peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait prestasi mahasiswa dan kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), serta sebaran kerja lulusan (lokal, nasional, internasional)

**Deskriptor:**

B. Efektifitas peningkatan/optimalisasi hasil ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi) dan apresiasi kompetensi lulusan oleh masyarakat dan dunia usaha, dunia industri dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional).

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan memenuhi sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi), dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi), dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi), dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Prestasi mahasiswa. 2. Kompetensi lulusan yang dapat dinilai dari pengakuan (rekognisi), dan apresiasi kompetensi lulusan oleh masyarakat dunia usaha, dunia industri, dan dunia kerja (DUDIKA), dan. 3. Sebaran kerja lulusan (lokal, nasional, internasional), secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


### Kriteria `C3` — Relevansi Penelitian

Memuat **15 butir** dengan total bobot **72**.


#### Butir `3.1.A` — bobot 4

| | |
|---|---|
| **Kode** | `3.1.A` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 4 |
| **Jenis** | INPUT |
| **Tahap PPEPP** | PENETAPAN |

**Elemen penilaian:**

> 3.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan pembiayaan penelitian, serta peta jalan penelitian.

**Deskriptor:**

3.1. [PENETAPAN] A. Ketersediaan kebijakan, standar, dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan 4. Pengembangan DTPR di bidang penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan 4. P engembangan DTPR di bidang penelitian, disertai bukti- bukti yang sahih tetapi kurang lengkap

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan 4. Pengembangan DTPR di bidang penelitian, disertai bukti- bukti yang sahih dan cukup lengkap

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. sarana dan prasarana penelitian. 2. Pembiayaan penelitian 3. Peta jalan penelitian, dan 4. Pengembangan DTPR di bidang penelitian, disertai bukti- bukti yang sahih dan lengkap

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan 4. Pengembangan DTPR di bidang penelitian, disertai bukti-bukti yang sahih dan sangat lengkap


#### Butir `3.1.B` — bobot 4

| | |
|---|---|
| **Kode** | `3.1.B` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 4 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> B. Kebijakan, standar dan indikator terkait implementasi peta jalan penelitian, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Ketersediaan Ketersediaan kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 3, dan sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.1.C` — bobot 4

| | |
|---|---|
| **Kode** | `3.1.C` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 4 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> C. Kebijakan,standar, dan indikator terkait perolehan hibah penelitian, kerjasama penelitian, publikasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan penelitian.

**Deskriptor:**

C. Ketersediaan Ketersediaan kebijakan, standar, dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4 atau aspek 5.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah penelitian. 2. erjasama penelitian 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.2.A` — bobot 8

| | |
|---|---|
| **Kode** | `3.2.A` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 8 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PELAKSANAAN |

**Elemen penilaian:**

> 3.2. [PELAKSANAAN] A. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang sarana dan prasarana penelitian, DTPR,dan pembiayaan penelitian, dan peta jalan penelitian.

**Deskriptor:**

3.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan 4. Pengembangan DTPR di bidang penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4. .

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.2.B` — bobot 6

| | |
|---|---|
| **Kode** | `3.2.B` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 6 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang implementasi peta jalan penelitian, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Efektifitas pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 3, dan sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, secara kurang efektif disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Implementasi peta jalan penelitian 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, secara cukup efektif disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.2.C` — bobot 18

| | |
|---|---|
| **Kode** | `3.2.C` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 18 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang perolehan hibah penelitian, kerjasama penelitian, publikasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan penelitian

**Deskriptor:**

C. Efektifitas pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4 atau aspek 5.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Perolehan hibah penelitian 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.3.A` — bobot 3

| | |
|---|---|
| **Kode** | `3.3.A` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | EVALUASI |

**Elemen penilaian:**

> 3.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan pembiayaan penelitian, dan peta jalan penelitian.

**Deskriptor:**

3.3. [EVALUASI] A. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembanga n DTPR di bidang penelitian, yang dilaksanakan secara berkala tetapi kurang efektif, dan disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembanga n DTPR di bidang penelitian, yang dilaksanakan secara berkala dan cukup efektif, dan disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, yang dilaksanakan secara berkala dan efektif, dan disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, yang dilaksanakan secara berkala dan sangat efektif, dan disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `3.3.B` — bobot 3

| | |
|---|---|
| **Kode** | `3.3.B` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait implementasi peta jalan penelitian, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program

**Deskriptor:**

B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 3, dan sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara berkala dan kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara berkala dan cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi dan. 3. Kebutuhan masyarakat serta DUDIKA., yang dilaksanakan secara berkala dan efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara berkala dan sangat efektif disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `3.3.C` — bobot 3

| | |
|---|---|
| **Kode** | `3.3.C` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektivitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait perolehan hibah penelitian, kerjasama penelitian, publikasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan penelitian.

**Deskriptor:**

C. Efektivitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4 atau aspek 5.

**Tingkat skor:**

- **Skor 1** — valuasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang engkap.

- **Skor 2** — valuasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.4.A` — bobot 3

| | |
|---|---|
| **Kode** | `3.4.A` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PENGENDALIAN |

**Elemen penilaian:**

> 3.4. [PENGENDALIAN] A. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan pembiayaan penelitian, dan peta jalan penelitian. .

**Deskriptor:**

3.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, yang dilaksanakan secara kurang efektif, dan disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, yang dilaksanakan secara cukup efektif, dan disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, yang dilaksanakan secara efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, yang dilaksanakan secara sangat efektif, dan disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.4.B` — bobot 3

| | |
|---|---|
| **Kode** | `3.4.B` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait implementasi peta jalan penelitian, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 3, dan sebagian aspek 2.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.4.C` — bobot 3

| | |
|---|---|
| **Kode** | `3.4.C` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait perolehan hibah penelitian, kerjasama penelitian, publikasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan penelitian. Elemen Penilaian LAM

**Deskriptor:**

C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional, 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4 atau aspek 5.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional, 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional, 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional, 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional, 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.5.A` — bobot 4

| | |
|---|---|
| **Kode** | `3.5.A` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 4 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | PENINGKATAN |

**Elemen penilaian:**

> 3.5. [PENINGKATAN] A. Efektifitas Peningkatan/optim ali sasi hasil ketercapaian standar dan indikator terkait sarana dan prasarana penelitian, DTPR, dan pembiayaan penelitian, dan peta jalan penelitian

**Deskriptor:**

3.5. [PENINGKATAN] A. Efektifitas peningkatan/optimalisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana penelitian. 2. Pembiayaan penelitian. 3. Peta jalan penelitian, dan. 4. Pengembangan DTPR di bidang penelitian, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.5.B` — bobot 3

| | |
|---|---|
| **Kode** | `3.5.B` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas Peningkatan/optim ali sasi hasil ketercapaian standar dan indikator terkait implementasi peta jalan penelitian, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi dan kebutuhan masyarakat dan DUDIKA.

**Deskriptor:**

B. Efektifitas peningkatan/optimalisasi hasil ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA.

**Syarat peringkat Unggul:** Memenuhi aspek 1 dan 3, dan sebagian aspek 2. .

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan penelitian. 2. Pelibatan mahasiswa berdasarkan visi misi perguruan tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `3.5.C` — bobot 3

| | |
|---|---|
| **Kode** | `3.5.C` |
| **Kriteria** | `C3` — Relevansi Penelitian |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait perolehan hibah penelitian, kerjasama penelitian, publikasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan penelitian. Elemen Penilaian LAM

**Deskriptor:**

C. Efektifitas peningkatan/optimalisasi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian.

**Syarat peringkat Unggul:** Memenuhi aspek 1, 2, 3, dan sebagian aspek 4 atau aspek 5.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optimalis asi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah penelitian. 2. Kerjasama penelitian. 3. Publikasi baik lingkup lokal, nasional, dan internasional. 4. Perolehan HKI, serta. 5. Keberlanjutan penelitian, disertai bukti-bukti yang sahih dan sangat lengkap.


### Kriteria `C4` — Relevansi PkM

Memuat **15 butir** dengan total bobot **60**.


#### Butir `4.1.A` — bobot 3

| | |
|---|---|
| **Kode** | `4.1.A` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 3 |
| **Jenis** | INPUT |
| **Tahap PPEPP** | PENETAPAN |

**Elemen penilaian:**

> 4.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait saranamdan Prasarana PkM, DTPR, dan pembiayaan PkM, dan peta jalan PkM (layanan kepakaran).

**Deskriptor:**

4.1. [PENETAPAN] A. Ketersediaan Kebijakan standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan. 3. Pembiayaan PkM, dan 4. Peta jalan PkM (layanan kepakaran).

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana PkM 2. DTPR, dan. 3. Pembiayaan PkM, dan. 4. Peta jalan PkM (layanan kepakaran), disertai bukti-bukti yang sahih tetapi kurang lengkap

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan. 3. Pembiayaan PkM, dan. 4. Peta jalan PkM (layanan kepakaran), dsertai bukti-bukti yang sahih dan cukup lengkap

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. sarana dan prasarana PkM. 2. DTPR, dan. 3. Pembiayaan PkM, dan 4. Peta jalan PkM (layanan kepakaran), disertai bukti-bukti yang sahih dan lengkap

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan. 3. Pembiayaan PkM, dan 4. Peta jalan PkM (layanan kepakaran), disertai bukti-bukti yang sahih dan sangat lengkap


#### Butir `4.1.B` — bobot 2.5

| | |
|---|---|
| **Kode** | `4.1.B` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 2.5 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> B. Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi.UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA. .

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi.UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi.UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi.UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi.UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.1.C` — bobot 2

| | |
|---|---|
| **Kode** | `4.1.C` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 2 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> C. Kebijakan, standar, dan indikator terkait perolehan hibah PkM, kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan PkM.

**Deskriptor:**

C. Kebijakan, standar, dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasioal. 3. Perolehan HKI, serta keberlanjutan PkM, disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasioal. 3. Perolehan HKI, serta keberlanjutan PkM, disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasioal. 3. Perolehan HKI, serta keberlanjutan PkM, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar, dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.2.A` — bobot 7

| | |
|---|---|
| **Kode** | `4.2.A` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 7 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PELAKSANAAN |

**Elemen penilaian:**

> 4.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang sarana dan prasarana PkM, DTPR, dan Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran).

**Deskriptor:**

4.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang 1. Sarana dan prasarana PkM. 2. DTPR, dan pembiayaan PkM, dan. 3. Peta jalan PkM (layanan kepakaran).

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. sarana dan prasarana PkM. 2. DTPR, pembiayaan PkM, dan 3. Peta jalan PkM (layanan kepakaran) secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Sarana dan prasarana PkM. 2. DTPR, pembiayaan PkM, dan. 3. Peta jalan PkM (layanan kepakaran) secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Sarana dan prasarana PkM. 2. DTPR, pembiayaan PkM, dan 3. Peta jalan PkM (layanan kepakaran) secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Sarana dan prasarana PkM. 2. DTPR, pembiayaan PkM, dan 3. peta jalan PkM (layanan kepakaran) secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.2.B` — bobot 6

| | |
|---|---|
| **Kode** | `4.2.B` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 6 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan kegiatan terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA. .

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.2.C` — bobot 15

| | |
|---|---|
| **Kode** | `4.2.C` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 15 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan Kegiatan terkait standar dan indikator tentang perolehan hibah PkM, Kerjasama PkM, Diseminasi baik Lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan PkM.

**Deskriptor:**

C. Efektifitas pelaksanaan kegiatan terkait standar dan indikator tentang 1. perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, secara kurang efektif disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Perolehan hibah PkM. 2. erjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. erolehan HKI, serta keberlanjutan PkM, secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, secara sangat efektif disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `4.3.A` — bobot 3

| | |
|---|---|
| **Kode** | `4.3.A` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | EVALUASI |

**Elemen penilaian:**

> 4.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait sarana dan Prasarana PkM, DTPR, dan pembiayaan PkM, dan peta jalan PkM (layanan kepakaran).

**Deskriptor:**

4.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran).

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan. 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), yang dilaksanakan secara berkala tetapi kurang efektif, dan disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), yang dilaksanakan secara berkala dan cukup efektif, dan disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), yang dilaksanakan secara berkala dan efektif, dan disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), yang dilaksanakan secara berkala dan sangat efektif, dan disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `4.3.B` — bobot 3

| | |
|---|---|
| **Kode** | `4.3.B` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara berkala dan kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara berkala dan cukup efektif disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara berkala dan efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara berkala dan sangat efektif disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `4.3.C` — bobot 3

| | |
|---|---|
| **Kode** | `4.3.C` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait perolehan hibah PkM, kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan PkM.

**Deskriptor:**

C. Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM.

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.4.A` — bobot 3

| | |
|---|---|
| **Kode** | `4.4.A` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 3 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PENGENDALIAN |

**Elemen penilaian:**

> 4.4. [PENGENDALIAN] A. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian terkait sarana dan Prasarana PkM, DTPR, dan pembiayaan PkM, dan peta jalan PkM (layanan kepakaran).

**Deskriptor:**

4.4. [PENGENDALIAN] A. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan. 4. Peta jalan PkM (layanan kepakaran).

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan. 4. Peta jalan PkM (layanan kepakaran), yang dilaksanakan secara kurang efektif, dan disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian terkait: 1. Sarana dan prasarana PkM 2. DTPR, dan 3. Pembiayaan PkM, dan. 4. Peta jalan PkM (layanan kepakaran), yang dilaksanakan secara cukup efektif, dan disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan. 4. Peta jalan PkM (layanan kepakaran), yang dilaksanakan secara efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan. 4. Peta jalan PkM (layanan kepakaran), yang dilaksanakan secara sangat efektif, dan disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `4.4.B` — bobot 2

| | |
|---|---|
| **Kode** | `4.4.B` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 2 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Kebijakan, standar dan indikator terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Kebijakan, standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.4.C` — bobot 2

| | |
|---|---|
| **Kode** | `4.4.C` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 2 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian terkait perolehan hibah PkM, kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan PkM.

**Deskriptor:**

C. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaiai terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.5.A` — bobot 3

| | |
|---|---|
| **Kode** | `4.5.A` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | PENINGKATAN |

**Elemen penilaian:**

> 4.5. [PENINGKATAN] A. Efektifitas peningkatan/optimali sasi hasil Ketercapaian standar dan indikator terkait sarana dan Prasarana PkM, DTPR, dan pembiayaan PkM, dan peta jalan PkM (layanan kepakaran).

**Deskriptor:**

4.5. [PENINGKATAN] A. Efektifitas peningkatan/optimalis asi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran).

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait: 1. Sarana dan prasarana PkM. 2. DTPR, dan 3. Pembiayaan PkM, dan peta jalan PkM (layanan kepakaran), disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `4.5.B` — bobot 3

| | |
|---|---|
| **Kode** | `4.5.B` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait implementasi peta jalan PkM, pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan kebutuhan masyarakat serta DUDIKA.

**Deskriptor:**

B. Efektifitas Peningkatan/optimalis asi hasil ketercapaian standar dan indikator terkait: 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakatserta DUDIKA.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait 1. Implementasi peta jalan PkM. 2. Pelibatan mahasiswa berdasarkan visi misi Perguruan Tinggi, UPPS, visi misi keilmuan program studi, dan. 3. Kebutuhan masyarakat serta DUDIKA, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `4.5.C` — bobot 2.5

| | |
|---|---|
| **Kode** | `4.5.C` |
| **Kriteria** | `C4` — Relevansi PkM |
| **Bobot** | 2.5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> C. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait perolehan hibah PkM, kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional, perolehan HKI, serta keberlanjutan PkM.

**Deskriptor:**

C. Efektifitas Peningkatan/optimalis asi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, secara cukup efektif disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait: 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional. 3. Perolehan HKI, serta keberlanjutan PkM, disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait ‘ 1. Perolehan hibah PkM. 2. Kerjasama PkM, diseminasi baik lingkup lokal, nasional, dan internasional 3. Perolehan HKI, serta keberlanjutan PkM, disertai bukti-bukti yang sahih dan sangat lengkap.


### Kriteria `C5` — Akuntabilitas

Memuat **10 butir** dengan total bobot **40**.


#### Butir `5.1.A` — bobot 3

| | |
|---|---|
| **Kode** | `5.1.A` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 3 |
| **Jenis** | INPUT |
| **Tahap PPEPP** | PENETAPAN |

**Elemen penilaian:**

> 5.1. [PENETAPAN] A. Kebijakan, standar dan indikator terkait sistem tata kelola yang otonom secara transparan, dan akuntabel yang didukung kapasitas sarana dan prasarana yang memadai dan SDM yang profesional

**Deskriptor:**

5.1. [PENETAPAN] A. Ketersediaan kebijakan, standar dan indikator terkait: 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, disertai bukti-bukti yang sahih tetapi kurang lengkap

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, disertai bukti-bukti yang sahih dan cukup lengkap

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, disertai bukti-bukti yang sahih dan lengkap

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, disertai bukti-bukti yang sahih dan sangat lengkap


#### Butir `5.1.B` — bobot 2

| | |
|---|---|
| **Kode** | `5.1.B` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 2 |
| **Jenis** | INPUT |

**Elemen penilaian:**

> B. Kebijakan, standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana dan SDM yang profesional.

**Deskriptor:**

B. Ketersediaan Kebijakan, standar dan indikator terkait: 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait: 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait: 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `5.2.A` — bobot 5

| | |
|---|---|
| **Kode** | `5.2.A` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 5 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PELAKSANAAN |

**Elemen penilaian:**

> 5.2. [PELAKSANAAN] A. Efektifitas pelaksanaan kegiatan terkait standar dan indikator terkait sistem tata kelola yang otonom secara transparan, dan akuntabel yang didukung kapasitas sarana dan prasarana yang memadai dan SDM yang profesional.

**Deskriptor:**

5.2. [PELAKSANAAN] A. Efektifitas pelaksanaan standar dan indikator tentang 1. Sistem tata kelola yang otonom yang didukung kapasitas sarana dan prasarana yang memadai. 2. SDM yang profesional.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Sistem tata kelola yang otonom yang didukung kapasitas sarana dan prasarana yang memadaii. 2. SDM yang profesional, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang: 1. Sistem tata kelola yang otonom yang didukung kapasitas sarana dan prasarana yang memadai. 2. SDM yang profesional, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang 1. Sistem tata kelola yang otonom yang didukung kapasitas sarana dan prasarana yang memadai. 2. SDM yang profesional, secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang 1. Sistem tata kelola yang otonom yang didukung kapasitas sarana dan prasarana yang memadai. 2. SDM yang profesional, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `5.2.B` — bobot 4

| | |
|---|---|
| **Kode** | `5.2.B` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 4 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana dan SDM yang profesional.

**Deskriptor:**

B. Efektifitas pelaksanaan standar dan indikator terkait: 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait pelaksanaan standar dan indikator tentang 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `5.3.A` — bobot 6

| | |
|---|---|
| **Kode** | `5.3.A` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 6 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | EVALUASI |

**Elemen penilaian:**

> 5.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait sistem tata kelola yang otonom secara transparan, dan akuntabel yang didukung kapasitas sarana dan prasarana yang memadai dan SDM yang profesional .

**Deskriptor:**

5.3. [EVALUASI] A. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait: 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara berkala tetapi kurang efektif, dan disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara berkala dan cukup efektif, dan disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara berkala dan efektif, dan disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait 1. Sistem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara berkala dan sangat efektif, dan disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `5.3.B` — bobot 5

| | |
|---|---|
| **Kode** | `5.3.B` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana dan SDM yang profesional.

**Deskriptor:**

B. Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait: 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana. 2. SDM yang profesional. . .

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana. 2. SDM yang profesional, yang dilaksanakan secara berkala dan kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana. 2. SDM yang profesional, yang dilaksanakan secara berkala dan cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana. 2. SDM yang profesional, yang dilaksanakan secara berkala dan efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana. 2. SDM yang profesional, yang dilaksanakan secara berkala dan sangat efektif disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `5.4.A` — bobot 3

| | |
|---|---|
| **Kode** | `5.4.A` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 3 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PENGENDALIAN |

**Elemen penilaian:**

> 5.4. [PENGENDALIAN] A. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait sistem tata kelola yang otonom secara transparan, dan Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai dan SDM yang profesional

**Deskriptor:**

5.4. [PENGENDALIAN] A. Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian terkait 1. Otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional. .

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara kurang efektif, dan disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara cukup efektif, dan disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, yang dilaksanakan secara sangat efektif, dan disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `5.4.B` — bobot 2

| | |
|---|---|
| **Kode** | `5.4.B` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 2 |
| **Jenis** | PROSES |

**Elemen penilaian:**

> B. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana dan SDM yang profesional.

**Deskriptor:**

B. Efektifitas pelaksanaan Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait: 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional.

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, yang dilaksanakan secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, yang dilaksanakan secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, yang dilaksanakan secara efektif disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait 1. Audit mutu pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, yang dilaksanakan secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `5.5.A` — bobot 5

| | |
|---|---|
| **Kode** | `5.5.A` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | PENINGKATAN |

**Elemen penilaian:**

> 5.5. [PENINGKATAN] A. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait sistem tata kelola yang otonom secara transparan, dan akuntabel yang didukung kapasitas sarana dan prasarana yang memadai dan SDM yang profesional.

**Deskriptor:**

5.5. [PENINGKATAN] A. Efektifitas Peningkatan/optimalis asi hasil ketercapaian standar dan indikator terkait 1. SIstem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. SIstem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. SIstem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. SIstem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait 1. SIstem tata kelola yang otonom secara transparan. 2. Akuntabel yang didukung kapasitas sarana dan prasarana yang memadai. 3. SDM yang profesional, disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `5.5.B` — bobot 5

| | |
|---|---|
| **Kode** | `5.5.B` |
| **Kriteria** | `C5` — Akuntabilitas |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> B. Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait audit mutu pemenuhan tupoksi tata kelola dan tata pamong, sarana dan prasarana dan SDM yang profesional.

**Deskriptor:**

B. Efektifitas peningkatan/optimalisa si hasil ketercapaian standar dan indikator terkait 1. Pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional.

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional. disertai bukti- bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait 1. Pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, disertai bukti- bukti yang sahih dan lengkap.

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait 1. Pemenuhan tupoksi tata kelola dan tata pamong. 2. Sarana dan prasarana dan SDM yang profesional, disertai bukti- bukti yang sahih dan sangat lengkap.


### Kriteria `C6` — Diferensiasi Misi

Memuat **5 butir** dengan total bobot **40**.


#### Butir `6.1` — bobot 5

| | |
|---|---|
| **Kode** | `6.1` |
| **Kriteria** | `C6` — Diferensiasi Misi |
| **Bobot** | 5 |
| **Jenis** | INPUT |
| **Tahap PPEPP** | PENETAPAN |

**Elemen penilaian:**

> 6.1. [PENETAPAN] Kebijakan, standar dan indikator terkait tridarma perguruan tinggi yang Mencakup VMTS, rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan DUDIKA di tingkat lokal, nasional, dan internasional

**Deskriptor:**

6.1. [PENETAPAN] Ketersediaan kebijakan, standar dan indikator terkait: 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/ apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional.

**Tingkat skor:**

- **Skor 1** — Tersedianya kebijakan, standar dan indikator terkait terkait: 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/ apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional. disertai bukti- bukti yang sahih tetapi kurang lengkap

- **Skor 2** — Tersedianya kebijakan, standar dan indikator terkait terkait: 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/ apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, disertai bukti- bukti yang sahih dan cukup lengkap

- **Skor 3** — Tersedianya kebijakan, standar dan indikator terkait terkait: 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/ apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, disertai bukti- bukti yang sahih dan lengkap

- **Skor 4** — Tersedianya kebijakan, standar dan indikator terkait terkait: 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/ apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, disertai bukti-bukti yang sahih dan sangat lengkap


#### Butir `6.2` — bobot 8

| | |
|---|---|
| **Kode** | `6.2` |
| **Kriteria** | `C6` — Diferensiasi Misi |
| **Bobot** | 8 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PELAKSANAAN |

**Elemen penilaian:**

> 6.2. [PELAKSANAAN] Efektifitas Pelaksanaan standar dan indikator terkait tridarma perguruan tinggi yang Mencakup VMTS, rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan DUDIKA di tingkat lokal, nasional, dan internasional

**Deskriptor:**

6.2. [PELAKSANAAN] Efektifitas pelaksanaan kegiatan terkait 1. Standar dan indikator tentang tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional.

**Tingkat skor:**

- **Skor 1** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Standar dan indikator tentang tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresias i oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional secara kurang efektif disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Standar dan indikator tentang tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresias i oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, secara cukup efektif disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Standar dan indikator tentang tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresias i oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, secara efektif disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Pelaksanaan kegiatan terkait standar dan indikator tentang 1. Standar dan indikator tentang tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, secara sangat efektif disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `6.3` — bobot 13

| | |
|---|---|
| **Kode** | `6.3` |
| **Kriteria** | `C6` — Diferensiasi Misi |
| **Bobot** | 13 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | EVALUASI |

**Elemen penilaian:**

> 6.3. [EVALUASI] Efektifitas pelaksanaan Evaluasi ketercapaian standar dan indikator terkait tridarma perguruan tinggi yang Mencakup VMTS, rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan DUDIKA di tingkat lokal, nasional, dan internasional

**Deskriptor:**

6.3. [EVALUASI] Efektifitas pelaksanaan evaluasi ketercapaian standar dan indikator terkait: 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional. .

**Tingkat skor:**

- **Skor 1** — Evaluasi ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresi asi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara berkala tetapi kurang efektif, dan disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Evaluasi ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara berkala dan cukup efektif, dan disertai bukti-bukti yang sahih dan cukup lengkap.

- **Skor 3** — Evaluasi ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresi asi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara berkala dan efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Evaluasi ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresi asi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara berkala dan sangat efektif, dan disertai bukti- bukti yang sahih dan sangat lengkap.


#### Butir `6.4` — bobot 4

| | |
|---|---|
| **Kode** | `6.4` |
| **Kriteria** | `C6` — Diferensiasi Misi |
| **Bobot** | 4 |
| **Jenis** | PROSES |
| **Tahap PPEPP** | PENGENDALIAN |

**Elemen penilaian:**

> 6.4. [PENGENDALIAN] Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian standar dan indikator terkait tridarma perguruan tinggi yang Mencakup VMTS, rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan DUDIKA di tingkat lokal, nasional, dan internasional

**Deskriptor:**

6.4. [PENGENDALIAN] Efektifitas pelaksanaan tindak lanjut hasil evaluasi ketercapaian terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional. .

**Tingkat skor:**

- **Skor 1** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresi asi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara kurang efektif, dan disertai bukti-bukti yang sahih tetapi kurang lengkap.

- **Skor 2** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apres iasi oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara cukup efektif, dan disertai bukti- bukti yang sahih dan cukup lengkap.

- **Skor 3** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresia si oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara efektif, dan disertai bukti-bukti yang sahih dan lengkap.

- **Skor 4** — Tindak lanjut hasil evaluasi ketercapaian terkait 1. Tridarma perguruan tinggi yang mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresia si oleh masyarakat dan 3. DUDIKA di tingkat lokal, nasional, dan internasional, yang dilaksanakan secara sangat efektif, dan disertai bukti-bukti yang sahih dan sangat lengkap.


#### Butir `6.5` — bobot 10

| | |
|---|---|
| **Kode** | `6.5` |
| **Kriteria** | `C6` — Diferensiasi Misi |
| **Bobot** | 10 |
| **Jenis** | OUTPUT |
| **Tahap PPEPP** | PENINGKATAN |

**Elemen penilaian:**

> 6.5. [PENINGKATAN] Efektifitas Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait tridarma perguruan tinggi mencakup VMTS, rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan DUDIKA. P 0 P 4 1 1 1 1 P 7 1 1 1

**Deskriptor:**

6.5. [PENINGKATAN] Efektifitas peningkatan/optimalisasi hasil ketercapaian standar dan indikator terkait: 1. Tridarma perguruan tinggi mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresiasi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional. O 0 O 4 1 1 1 1 O 9 1 1 1

**Tingkat skor:**

- **Skor 1** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresi asi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, disertai bukti-bukti yang sahih tetapi kurang lengkap. Subtotal 2 Subtotal 10% Subtotal 30%

- **Skor 2** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apre siasi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, disertai bukti- bukti yang sahih dan cukup lengkap. O 0,0 O 21,0 6,0 5,0 5,0 5,0 O 66,0 30,0 5,0 5,0

- **Skor 3** — Peningkatan/optim alisasi hasil ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apre siasi oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, disertai bukti- bukti yang sahih dan lengkap. P 0,0 P 14,0 5,0 5,0 2,0 2,0 P 37,0 9,0 7,0 7,0

- **Skor 4** — Peningkatan/optimali sasi hasil ketercapaian standar dan indikator terkait 1. Tridarma perguruan tinggi mencakup VMTS. 2. Rencana pengembangan strategis UPPS dan/atau PS yang dapat menggambarkan ciri khas keilmuan PS, serta pengakuan/apresia si oleh masyarakat dan. 3. DUDIKA di tingkat lokal, nasional, dan internasional, disertai bukti-bukti yang sahih dan sangat lengkap. Bobot Tiap Butir I 8,0 4,0 4,0 Bobot Tiap Butir I 6,0 3,0 3,0 Bobot Tiap Butir I 17,0 5,0 4,0 4,0 4,0


### Kriteria `SUP` — Suplemen Program Studi

Memuat **5 butir** dengan total bobot **20**.


#### Butir `SUP.1` — bobot 4

| | |
|---|---|
| **Kode** | `SUP.1` |
| **Kriteria** | `SUP` — Suplemen Program Studi |
| **Bobot** | 4 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> Mata kuliah inti/khas prodi

**Deskriptor:**

Mata kuliah inti/khas prodi

**Tingkat skor:**


#### Butir `SUP.2` — bobot 3

| | |
|---|---|
| **Kode** | `SUP.2` |
| **Kriteria** | `SUP` — Suplemen Program Studi |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> Mata kuliah domain spesifik dan lingkungan prodi infokom

**Deskriptor:**

Mata kuliah domain spesifik dan lingkungan prodi infokom

**Tingkat skor:**


#### Butir `SUP.3` — bobot 3

| | |
|---|---|
| **Kode** | `SUP.3` |
| **Kriteria** | `SUP` — Suplemen Program Studi |
| **Bobot** | 3 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> Mata kuliah terkait Matematika/metode atau Analisis Kuantitatif yang relevan

**Deskriptor:**

Mata kuliah terkait Matematika/metode atau Analisis Kuantitatif yang relevan

**Tingkat skor:**


#### Butir `SUP.4` — bobot 5

| | |
|---|---|
| **Kode** | `SUP.4` |
| **Kriteria** | `SUP` — Suplemen Program Studi |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> Proyek Utama (Capstone project) yang relevan

**Deskriptor:**

Proyek Utama (Capstone project) yang relevan

**Tingkat skor:**


#### Butir `SUP.5` — bobot 5

| | |
|---|---|
| **Kode** | `SUP.5` |
| **Kriteria** | `SUP` — Suplemen Program Studi |
| **Bobot** | 5 |
| **Jenis** | OUTPUT |

**Elemen penilaian:**

> Pengembangan bidang Infokom yang digunakan di masyarakat

**Deskriptor:**

Pengembangan bidang Infokom yang digunakan di masyarakat

**Tingkat skor:**


---

<a id="16-pustaka-internal"></a>

## 16. Pustaka Internal

37 berkas di folder lib/: perkakas, hitungan, dan penyusun dokumen


### Folder `lib/ (akar)`


#### `auth.ts`

**Berkas.** `lib/auth.ts` (98 baris)

**Tabel database:** `user`


#### `db.ts`

**Berkas.** `lib/db.ts` (14 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `db` | konstanta |  |


#### `format.ts`

**Berkas.** `lib/format.ts` (32 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `formatDate` | fungsi |  |
| `formatCurrency` | fungsi |  |
| `formatNumber` | fungsi |  |
| `formatSKS` | fungsi |  |


#### `minio.ts`

**Berkas.** `lib/minio.ts` (64 baris)

**Maksud.** Ensure the evidence bucket exists

| Nama | Jenis | Keterangan |
|---|---|---|
| `ensureBucket` | fungsi async (server action / data) | Ensure the evidence bucket exists |
| `uploadFile` | fungsi async (server action / data) | Upload a file to MinIO |
| `getDownloadUrl` | fungsi async (server action / data) | Get a presigned URL for downloading a file |
| `deleteFile` | fungsi async (server action / data) | Delete a file from MinIO |


### Folder `lib/actions`


#### `auth.ts`

**Berkas.** `lib/actions/auth.ts` (139 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `LoginState` | interface |  |
| `loginAction` | fungsi async (server action / data) | Server Action: Login with credentials. Flow: 1. Read email/password/callbackUrl from FormData 2. Validate with Zod (loginSchema) — strict email + min-6 password On invalid: return LoginState with fieldErrors, form shows error 3. Fire-and-forget audit log "LOGIN_ATTEMPT" (so we have a record even if credentials are wrong; success audit happens via session callback) 4. signIn with redirect:true + redirectTo=sanitized callbackUrl - On success: Next.js sets session cookie + throws NEXT_REDIRECT, client navigates to callbackUrl - On CredentialsSignin: catch → return LoginState - On AccessDenied: catch → return LoginState |
| `logoutAction` | fungsi async (server action / data) | Server Action: Logout |


#### `evidence.ts`

**Berkas.** `lib/actions/evidence.ts` (306 baris)

**Tabel database:** `evidence`, `tabelDefinition`, `tabelLkps`

| Nama | Jenis | Keterangan |
|---|---|---|
| `uploadEvidence` | fungsi async (server action / data) |  |
| `getEvidenceList` | fungsi async (server action / data) |  |
| `deleteEvidence` | fungsi async (server action / data) |  |
| `addEvidenceLink` | fungsi async (server action / data) |  |
| `getTabelLkpsId` | fungsi async (server action / data) |  |


#### `led.ts`

**Berkas.** `lib/actions/led.ts` (311 baris)

**Tabel database:** `ledBagian`, `ledEvidence`, `ledIsian`, `tahunAkademik`

| Nama | Jenis | Keterangan |
|---|---|---|
| `saveLedIsian` | fungsi async (server action / data) | SIMPAN NARASI (autosave) |
| `setLedStatus` | fungsi async (server action / data) | UBAH STATUS |
| `addLedEvidence` | fungsi async (server action / data) | BUKTI PENDUKUNG |
| `deleteLedEvidence` | fungsi async (server action / data) |  |


#### `lkps.ts`

**Berkas.** `lib/actions/lkps.ts` (559 baris)

**Maksud.** UPSERT / DELETE ROWS

**Tabel database:** `dosen`, `tabelDefinition`, `tabelLkps`, `tabelLkpsRow`, `user`, `validationHistory`

| Nama | Jenis | Keterangan |
|---|---|---|
| `upsertLkpsRow` | fungsi async (server action / data) | UPSERT / DELETE ROWS |
| `deleteLkpsRow` | fungsi async (server action / data) |  |
| `submitLkpsTabel` | fungsi async (server action / data) | SUBMIT — Operator mengirim tabel untuk divalidasi |
| `validateLkpsTabel` | fungsi async (server action / data) | VALIDATE — Validator menyetujui/menolak/meminta revisi |
| `createDosen` | fungsi async (server action / data) |  |
| `updateDosen` | fungsi async (server action / data) |  |
| `deleteDosen` | fungsi async (server action / data) |  |


#### `mahasiswa.ts`

**Berkas.** `lib/actions/mahasiswa.ts` (109 baris)

**Tabel database:** `mahasiswa`

| Nama | Jenis | Keterangan |
|---|---|---|
| `createMahasiswa` | fungsi async (server action / data) |  |
| `updateMahasiswa` | fungsi async (server action / data) |  |
| `deleteMahasiswa` | fungsi async (server action / data) |  |


#### `matakuliah.ts`

**Berkas.** `lib/actions/matakuliah.ts` (109 baris)

**Tabel database:** `mataKuliah`

| Nama | Jenis | Keterangan |
|---|---|---|
| `createMatakuliah` | fungsi async (server action / data) |  |
| `updateMatakuliah` | fungsi async (server action / data) |  |
| `deleteMatakuliah` | fungsi async (server action / data) |  |


#### `notification.ts`

**Berkas.** `lib/actions/notification.ts` (129 baris)

**Tabel database:** `notification`, `user`

| Nama | Jenis | Keterangan |
|---|---|---|
| `createNotification` | fungsi async (server action / data) |  |
| `notifyMutation` | fungsi async (server action / data) |  |
| `markNotificationAsRead` | fungsi async (server action / data) |  |
| `markAllNotificationsAsRead` | fungsi async (server action / data) |  |


#### `penilaian.ts`

**Berkas.** `lib/actions/penilaian.ts` (333 baris)

**Maksud.** SIMPAN SKOR

**Tabel database:** `butirPenilaian`, `penilaianSesi`, `skorPenilaian`, `tahunAkademik`

| Nama | Jenis | Keterangan |
|---|---|---|
| `setSkor` | fungsi async (server action / data) | SIMPAN SKOR |
| `setSkorBanyak` | fungsi async (server action / data) | Simpan banyak skor sekaligus (dipakai form per kriteria). |
| `finalisasiSesi` | fungsi async (server action / data) | Kunci penilaian + simpan nilai akhir & status. Ditolak kalau masih ada butir yang belum dinilai (Edge Case §7). |
| `bukaKembaliSesi` | fungsi async (server action / data) | Buka kembali penilaian yang sudah difinalisasi (ADMIN saja). |
| `resetSesi` | fungsi async (server action / data) | Kosongkan seluruh skor sesi ini (ADMIN). |


#### `user.ts`

**Berkas.** `lib/actions/user.ts` (279 baris)

**Maksud.** Get all users (paginated)

**Tabel database:** `account`, `evidence`, `session`, `tabelLkps`, `user`

| Nama | Jenis | Keterangan |
|---|---|---|
| `getUsers` | fungsi async (server action / data) | Get all users (paginated) |
| `createUser` | fungsi async (server action / data) | Create a new user |
| `updateUser` | fungsi async (server action / data) | Update a user |
| `deleteUser` | fungsi async (server action / data) | Delete a user permanently (hard delete). Blocked when the user still owns data referenced by other tables (submitted/validated LKPS, uploaded evidence). User must reassign or remove those records first. |
| `resetUserPassword` | fungsi async (server action / data) | Reset user password |


### Folder `lib/config`


#### `developer.ts`

**Berkas.** `lib/config/developer.ts` (52 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `DeveloperInfo` | interface |  |
| `developer` | konstanta |  |


### Folder `lib/export`


#### `excel.ts`

**Berkas.** `lib/export/excel.ts` (341 baris)

**Maksud.** Generate Excel workbook from table data Single sheet containing all tables grouped by BAB with proper spacing

| Nama | Jenis | Keterangan |
|---|---|---|
| `generateExcelWorkbook` | fungsi async (server action / data) | Generate Excel workbook from table data Single sheet containing all tables grouped by BAB with proper spacing |
| `generateSingleTableExcel` | fungsi async (server action / data) | Generate Excel for a single table |


#### `helpers.ts`

**Berkas.** `lib/export/helpers.ts` (187 baris)

**Maksud.** Export Helper Functions Shared data fetching for Excel, Word, PDF

**Tabel database:** `tabelDefinition`, `tabelLkps`, `tahunAkademik`

| Nama | Jenis | Keterangan |
|---|---|---|
| `ColumnDef` | interface |  |
| `RowData` | interface |  |
| `TableData` | interface |  |
| `getTableDataForExport` | fungsi async (server action / data) | Get single table data for export |
| `getBabDataForExport` | fungsi async (server action / data) | Get all tables data for a specific BAB |
| `getAllTablesDataForExport` | fungsi async (server action / data) | Get all tables data for export (full report) |
| `getActiveTahunAkademik` | fungsi async (server action / data) | Get active tahun akademik |
| `STATUS_LABELS` | konstanta | Status label mapping |


#### `led-docx.ts`

**Berkas.** `lib/export/led-docx.ts` (493 baris)

**Maksud.** Pembangun Word (`.docx`) untuk dokumen LED. Format mengikuti Lampiran 2 Instrumen LED LAM INFOKOM 2.1: A4, Arial 11 pt, spasi 1,15, margin 3 cm, nomor halaman di footer. Memakai library `docx` (sudah dipakai modul

| Nama | Jenis | Keterangan |
|---|---|---|
| `MetaLed` | tipe |  |
| `buildLedDocx` | fungsi async (server action / data) | Bangun dokumen Word lengkap. Mengembalikan Buffer siap kirim. Tidak menyentuh DB — pemanggil yang menyiapkan `bagian` (lihat `lib/utils/led-export-query.ts`). |


#### `led-dokumen.ts`

**Berkas.** `lib/export/led-dokumen.ts` (390 baris)

**Maksud.** Blok Markdown

| Nama | Jenis | Keterangan |
|---|---|---|
| `Blok` | tipe | Blok Markdown |
| `parseMarkdownBlok` | fungsi | Parse Markdown jadi blok. Sengaja sebaris dengan renderer pratinjau (`lib/utils/markdown.tsx`) supaya apa yang dilihat di editor sama dengan apa yang tercetak. |
| `Potongan` | tipe | Teks inline (bold/italic/code) → potongan berformat |
| `pecahInline` | fungsi | Pecah teks inline jadi potongan berformat, untuk TextRun/Text dokumen. |
| `sanitasiTeks` | fungsi | Bersihkan karakter yang tidak ada di Arial/Helvetica dan bikin rusak di dokumen resmi (emoji, simbol aneh). Tanda baca tipografis dinormalkan. |
| `ringkasBlok` | fungsi | Ringkas blok jadi satu kalimat — dipakai untuk daftar isi & pratinjau. |
| `SimpulDokumen` | tipe | Struktur dokumen |
| `JUDUL_BAB` | konstanta |  |
| `susunDokumenLed` | fungsi | Susun urutan dokumen dari bagian LED terurut. Simpul "kelompok" hanya muncul untuk BAB II (A/B/C/D) — struktur itu yang dipakai instrumen, dan tanpa itu dokumen jadi daftar panjang tanpa peta. |
| `labelBagian` | fungsi | "BAB2.C.2.1.A" → "C.2.1.A" — nomor bagian tanpa awalan BAB. |
| `BagianKosong` | tipe | Pra-export |
| `HasilPraExport` | tipe |  |
| `BATAS_HALAMAN_LED` | konstanta |  |
| `KARAKTER_PER_HALAMAN` | konstanta |  |
| `periksaPraExport` | fungsi | Periksa kelengkapan & estimasi halaman sebelum dokumen dibuat. |
| `namaBerkasLed` | fungsi | Nama berkas unduhan: LED_<prodi>_<tahun>-<semester>_<tanggal>.<ext> |


#### `led-pdf.tsx`

**Berkas.** `lib/export/led-pdf.tsx` (277 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `buildLedPdf` | fungsi async (server action / data) | Bangun dokumen PDF LED. Mengembalikan Buffer siap kirim. |


#### `pdf.tsx`

**Berkas.** `lib/export/pdf.tsx` (399 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `generatePDFDocument` | fungsi async (server action / data) |  |
| `generateSingleTablePDF` | fungsi async (server action / data) |  |


#### `word.ts`

**Berkas.** `lib/export/word.ts` (395 baris)

**Maksud.** Generate Word document from table data

| Nama | Jenis | Keterangan |
|---|---|---|
| `generateWordDocument` | fungsi async (server action / data) | Generate Word document from table data |
| `generateSingleTableWord` | fungsi async (server action / data) | Generate Word document for a single table |


### Folder `lib/types`


#### `auth.ts`

**Berkas.** `lib/types/auth.ts` (23 baris)


### Folder `lib/utils`


#### `audit.ts`

**Berkas.** `lib/utils/audit.ts` (62 baris)

**Maksud.** Create an audit log entry

**Tabel database:** `auditLog`

| Nama | Jenis | Keterangan |
|---|---|---|
| `createAuditLog` | fungsi async (server action / data) | Create an audit log entry |
| `logAccessDenied` | fungsi | Log an access denied attempt (fire-and-forget). Use this BEFORE throwing on permission/state checks so admin can audit rejected mutations via /settings/audit-log. |


#### `db-retry.ts`

**Berkas.** `lib/utils/db-retry.ts` (65 baris)

**Maksud.** Apakah error ini termasuk gangguan koneksi yang layak dicoba ulang?

| Nama | Jenis | Keterangan |
|---|---|---|
| `isTransientDbError` | fungsi | Apakah error ini termasuk gangguan koneksi yang layak dicoba ulang? |
| `withDbRetry` | fungsi async (server action / data) | Jalankan `fn`, ulangi kalau gagal karena gangguan koneksi. Error selain gangguan koneksi langsung dilempar (tidak diulang). |


#### `format.ts`

**Berkas.** `lib/utils/format.ts` (75 baris)

**Maksud.** Merge Tailwind CSS classes safely

| Nama | Jenis | Keterangan |
|---|---|---|
| `cn` | fungsi | Merge Tailwind CSS classes safely |
| `formatRupiah` | fungsi | Format number as Indonesian Rupiah |
| `formatDate` | fungsi | Format date to Indonesian locale |
| `formatDateTime` | fungsi | Format date with time |
| `truncate` | fungsi | Truncate text to a max length |
| `capitalize` | fungsi | Capitalize first letter |
| `getInitials` | fungsi | Generate initials from name |


#### `kriteria-led.ts`

**Berkas.** `lib/utils/kriteria-led.ts` (13 baris)

**Maksud.** Daftar 6 kriteria LED LAM INFOKOM 2.1 beserta bobotnya.

| Nama | Jenis | Keterangan |
|---|---|---|
| `KRITERIA_LED` | konstanta | Daftar 6 kriteria LED LAM INFOKOM 2.1 beserta bobotnya. |
| `TAHAP_PPEPP` | konstanta | Lima tahap siklus PPEPP. |


#### `kriteria.ts`

**Berkas.** `lib/utils/kriteria.ts` (48 baris)

**Maksud.** Slug route halaman kriteria, mis. `kriteria-5-6`.

| Nama | Jenis | Keterangan |
|---|---|---|
| `kriteriaSlug` | fungsi | Slug route halaman kriteria, mis. `kriteria-5-6`. |
| `kriteriaNama` | fungsi | Nama kriteria, mis. "Relevansi Pendidikan". |
| `kriteriaLabel` | fungsi | Label lengkap dengan nomor, mis. "Kriteria 2 — Relevansi Pendidikan". |
| `tabelHref` | fungsi | URL halaman detail sebuah tabel. |


#### `led-export-query.ts`

**Berkas.** `lib/utils/led-export-query.ts` (50 baris)

**Tabel database:** `tahunAkademik`

| Nama | Jenis | Keterangan |
|---|---|---|
| `ikutkanBagianKosong` | konstanta | Query khusus export LED. Hanya bagian yang punya isi yang diikutkan ke dokumen — bagian kosong tetap dilaporkan lewat pra-export check, tapi tidak dicetak sebagai halaman "[belum diisi]" sebanyak 92 kali. |
| `KonteksExportLed` | tipe |  |
| `siapkanExportLed` | fungsi async (server action / data) | Ambil tahun akademik (aktif atau yang diminta) + semua bagian LED-nya. |
| `daftarTahunAkademik` | fungsi async (server action / data) | Daftar tahun akademik untuk pemilih di halaman export. |


#### `led-progress.ts`

**Berkas.** `lib/utils/led-progress.ts` (138 baris)

**Maksud.** Estimasi halaman LED. Lampiran 2 Instrumen LED: A4, Arial 11, spasi 1,15, maksimum 150 halaman. Pada setelan itu satu halaman A4 menampung ±3.000 karakter teks mengalir. Angka ini PERKIRAAN — dipakai sebagai indikator, bukan patokan mutlak.

| Nama | Jenis | Keterangan |
|---|---|---|
| `KARAKTER_PER_HALAMAN` | konstanta | Estimasi halaman LED. Lampiran 2 Instrumen LED: A4, Arial 11, spasi 1,15, maksimum 150 halaman. Pada setelan itu satu halaman A4 menampung ±3.000 karakter teks mengalir. Angka ini PERKIRAAN — dipakai sebagai indikator, bukan patokan mutlak. |
| `BATAS_HALAMAN_LED` | konstanta | Batas total halaman LED (Lampiran 2). |
| `BATAS_KARAKTER_PER_BAGIAN` | konstanta | Batas karakter per bagian — menjaga editor tetap responsif. |
| `RingkasanIsian` | tipe |  |
| `ProgresLed` | tipe |  |
| `hitungProgres` | fungsi | Hitung progres dari daftar isian. `total` = jumlah bagian yang SEHARUSNYA ada (dari struktur `LedBagian`), bukan jumlah baris `LedIsian` — supaya bagian yang belum pernah dibuka tetap terhitung sebagai kosong. |
| `estimasiHalaman` | fungsi | Estimasi halaman dari sejumlah karakter. |
| `LED_STATUS_META` | konstanta | Label + varian badge untuk tiap status LED. |
| `TAHAP_LABEL` | konstanta | Label tahap PPEPP yang enak dibaca. |
| `TAHAP_URUTAN` | konstanta | Urutan tahap PPEPP yang baku. |
| `BAB_LABEL` | konstanta | Label BAB yang enak dibaca. |


#### `led-query.ts`

**Berkas.** `lib/utils/led-query.ts` (104 baris)

**Maksud.** Status default untuk bagian yang belum pernah diisi.

**Tabel database:** `ledBagian`, `ledIsian`, `tahunAkademik`

| Nama | Jenis | Keterangan |
|---|---|---|
| `STATUS_KOSONG` | konstanta | Status default untuk bagian yang belum pernah diisi. |
| `ambilBagianLed` | fungsi async (server action / data) | Query bagian LED + isiannya untuk satu tahun akademik. Semua halaman LED lewat sini supaya bentuk datanya seragam dan bagian yang belum pernah diisi tetap ikut terkirim (isian = null). |
| `ambilRingkasanLed` | fungsi async (server action / data) | Semua isian LED pada satu tahun akademik — untuk hitung progres. |
| `ambilStatusPerKode` | fungsi async (server action / data) | Peta kode bagian → status. Dipakai halaman index untuk kartu per BAB. |
| `ambilStrukturLed` | fungsi async (server action / data) | Struktur ringkas semua bagian LED (tanpa join isian). |
| `jumlahBagianLed` | fungsi async (server action / data) | Jumlah total bagian LED yang seharusnya ada (struktur baku). |
| `tahunAkademikAktif` | fungsi async (server action / data) | Tahun akademik aktif. |


#### `led-rute.ts`

**Berkas.** `lib/utils/led-rute.ts` (19 baris)

**Maksud.** Pemetaan kode bagian LED → rute halaman editornya. Dipakai untuk menautkan daftar bagian kosong di dialog

| Nama | Jenis | Keterangan |
|---|---|---|
| `ruteBagianLed` | fungsi | Pemetaan kode bagian LED → rute halaman editornya. Dipakai untuk menautkan daftar bagian kosong di dialog export ke tempat pengisiannya, tanpa harus menyimpan rute di DB. |


#### `markdown.tsx`

**Berkas.** `lib/utils/markdown.tsx` (231 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `renderMarkdown` | fungsi |  |


#### `penilaian-query.ts`

**Berkas.** `lib/utils/penilaian-query.ts` (105 baris)

**Maksud.** Tahun akademik aktif.

**Tabel database:** `butirPenilaian`, `penilaianSesi`, `tahunAkademik`

| Nama | Jenis | Keterangan |
|---|---|---|
| `tahunAktifPenilaian` | fungsi async (server action / data) | Tahun akademik aktif. |
| `sesiPenilaian` | fungsi async (server action / data) | Sesi penilaian tahun aktif, atau null kalau belum pernah dibuat. |
| `ButirLengkap` | tipe |  |
| `ambilButirPenilaian` | fungsi async (server action / data) | Semua butir + skor sesi ini (kalau ada). Mengembalikan `ButirLengkap[]` supaya halaman bisa menampilkan deskriptor 4 level dan sekaligus menghitung nilai akhir tanpa query tambahan. |
| `keButirHitung` | fungsi | Ubah daftar butir jadi bentuk ringkas untuk kalkulasi murni. |


#### `penilaian.ts`

**Berkas.** `lib/utils/penilaian.ts` (317 baris)

**Maksud.** Kalkulasi Matriks Penilaian LAM INFOKOM 2.1. Fungsi di file ini MURNI (tanpa DB, tanpa React) supaya gampang di-unit-test: nilai akhir berbobot, rerata per kriteria, dan prediksi status akreditasi. ## Rumus nilai akhir PDF §III/§IV menulis bobot sebagai "Bobot dari 400" dengan skor tiap butir 1–4 (Sangat baik 4 · Baik 3 · Cukup 2 · Kurang 1). Supaya nilai akhir jatuh di skala 0–400, jumlah berbobot HARUS dinormalisasi dengan skor maksimum: nilaiAkhir = Σ(skor × bobot) / 4 Ini dicek silang dengan ambang resmi §V — kalau tanpa dibagi 4, skor seragam 1 pun menghasilkan 400 dan ambang "< 200 Tidak Terakreditasi" jadi mustahil. Dengan normalisasi: semua skor 4 → 400   (Unggul 5 tahun) semua skor 3 → 300   (Terakreditasi) semua skor 2 → 200   (Terakreditasi, batas bawah) semua skor 1 → 100   (Tidak Terakreditasi) ## Ambang status (§V) < 200        → Tidak Terakreditasi 200 – 320    → Terakreditasi 321 – 360    → Unggul 3 tahun  (kalau syarat terpenuhi) ≥ 361        → Unggul 5 tahun  (kalau syarat terpenuhi) ## Syarat tambahan gelar Unggul Dua-duanya harus terpenuhi, dan keduanya HANYA menyangkut kriteria C1–C3 (Budaya Mutu, Relevansi Pendidikan, Relevansi Penelitian) — bukan seluruh 82 butir. Ini kutipan langsung §V: • rerata tiap kriteria C1, C2, C3 masing-masing ≥ 3,20 • setiap butir pada C1, C2, C3 bernilai ≥ 3,00 Butir yang belum dinilai dianggap belum memenuhi syarat — bukan lolos.

| Nama | Jenis | Keterangan |
|---|---|---|
| `BOBOT_TOTAL` | konstanta | Kalkulasi Matriks Penilaian LAM INFOKOM 2.1. Fungsi di file ini MURNI (tanpa DB, tanpa React) supaya gampang di-unit-test: nilai akhir berbobot, rerata per kriteria, dan prediksi status akreditasi. ## Rumus nilai akhir PDF §III/§IV menulis bobot sebagai "Bobot dari 400" dengan skor tiap butir 1–4 (Sangat baik 4 · Baik 3 · Cukup 2 · Kurang 1). Supaya nilai akhir jatuh di skala 0–400, jumlah berbobot HARUS dinormalisasi dengan skor maksimum: nilaiAkhir = Σ(skor × bobot) / 4 Ini dicek silang dengan ambang resmi §V — kalau tanpa dibagi 4, skor seragam 1 pun menghasilkan 400 dan ambang "< 200 Tidak Terakreditasi" jadi mustahil. Dengan normalisasi: semua skor 4 → 400   (Unggul 5 tahun) semua skor 3 → 300   (Terakreditasi) semua skor 2 → 200   (Terakreditasi, batas bawah) semua skor 1 → 100   (Tidak Terakreditasi) ## Ambang status (§V) < 200        → Tidak Terakreditasi 200 – 320    → Terakreditasi 321 – 360    → Unggul 3 tahun  (kalau syarat terpenuhi) ≥ 361        → Unggul 5 tahun  (kalau syarat terpenuhi) ## Syarat tambahan gelar Unggul Dua-duanya harus terpenuhi, dan keduanya HANYA menyangkut kriteria C1–C3 (Budaya Mutu, Relevansi Pendidikan, Relevansi Penelitian) — bukan seluruh 82 butir. Ini kutipan langsung §V: • rerata tiap kriteria C1, C2, C3 masing-masing ≥ 3,20 • setiap butir pada C1, C2, C3 bernilai ≥ 3,00 Butir yang belum dinilai dianggap belum memenuhi syarat — bukan lolos. |
| `SKOR_MAKS` | konstanta |  |
| `SKOR_MIN` | konstanta |  |
| `AMBANG` | konstanta |  |
| `KRITERIA_KUNCI` | konstanta | Kriteria kunci penentu gelar Unggul. |
| `RERATA_KUNCI_MIN` | konstanta |  |
| `BUTIR_MIN` | konstanta |  |
| `StatusPrediksi` | tipe |  |
| `STATUS_META` | konstanta |  |
| `URUTAN_KRITERIA` | konstanta | Urutan tampilan kriteria pada dashboard. |
| `NAMA_KRITERIA` | konstanta |  |
| `NAMA_PENDEK` | konstanta | Nama pendek untuk kartu/legenda. |
| `BOBOT_KRITERIA` | konstanta | Bobot resmi per kriteria (PDF §III). Dipakai memverifikasi hasil seed: kalau Σ bobot ≠ 400, seluruh prediksi jadi salah dan UI harus menolak render. |
| `ButirHitung` | tipe | Butir ringkas yang dibutuhkan kalkulasi. |
| `RerataKriteria` | tipe |  |
| `HasilPenilaian` | tipe |  |
| `nilaiBerbobot` | fungsi | Σ(skor × bobot) mentah; butir kosong dihitung 0. |
| `nilaiAkhir` | fungsi | Nilai akhir skala 0–400. Σ(skor × bobot) dibagi 4 (skor maksimum) supaya skor penuh = 400. |
| `rerataKriteria` | fungsi | Rerata tertimbang satu kriteria pada skala 1–4: Σ(skor × bobot) / Σ(bobot). Dipakai juga untuk syarat Unggul. |
| `totalBobot` | fungsi |  |
| `semuaButirAman` | fungsi | Semua butir dinilai ≥ 3,00? Butir kosong dianggap belum aman. |
| `prediksiStatus` | fungsi | Prediksi status akreditasi. Ambang nilai diperiksa lebih dulu, baru syarat Unggul — jadi nilai 380 dengan satu butir C1 bernilai 2,9 tetap Terakreditasi. |
| `hitungPenilaian` | fungsi | Hitung semuanya sekaligus dari daftar butir. |
| `bobotValid` | fungsi | Cek total bobot hasil seed. Kalau tidak persis 400, seluruh prediksi salah — dashboard harus menolak render (Edge Case §7 RANCANGAN-012). |
| `bulatkan` | fungsi | Bulatkan ke 2 desimal — menghindari 60,49999999 dari aritmetika float. |
| `persenTerisi` | fungsi | Persentase progres pengisian butir. |
| `SKOR_LABEL` | konstanta | Label skor 1–4 sesuai deskriptor matriks. |
| `warnaRerata` | fungsi | Ambient warna rerata kriteria: merah <3,00 · amber 3,00–3,19 · hijau ≥3,20. |


#### `permissions.ts`

**Berkas.** `lib/utils/permissions.ts` (152 baris)

**Maksud.** Permission definitions per role 3-role system (per RANCANGAN-007): - ADMIN: superuser - OPERATOR: input data + submit + validate (trusted user, replaces old VALIDATOR role) - PIMPINAN: read-only +

| Nama | Jenis | Keterangan |
|---|---|---|
| `hasPermission` | fungsi | Check if a role has a specific permission |
| `hasAllPermissions` | fungsi | Check multiple permissions (AND logic) |
| `hasAnyPermission` | fungsi | Check multiple permissions (OR logic) |
| `getRolePermissions` | fungsi | Get all permissions for a role |
| `ROLE_LABELS` | konstanta | Role display names in Indonesian |
| `STATUS_LABELS` | konstanta | Table status labels for UI display |
| `STATUS_COLORS` | konstanta | Status colors for badges |
| `canEditTable` | fungsi | Check if user can edit a table based on status and role ADMIN: can edit all statuses OPERATOR: can edit DRAFT, DIREVISI, DITOLAK only PIMPINAN: cannot edit any |
| `canDeleteRow` | fungsi | Check if user can delete rows from a table based on status and role Same rules as canEditTable |


### Folder `lib/validations`


#### `auth.ts`

**Berkas.** `lib/validations/auth.ts` (32 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `loginSchema` | konstanta |  |
| `createUserSchema` | konstanta |  |
| `updateUserSchema` | konstanta |  |
| `resetPasswordSchema` | konstanta |  |
| `LoginInput` | tipe |  |
| `CreateUserInput` | tipe |  |
| `UpdateUserInput` | tipe |  |
| `ResetPasswordInput` | tipe |  |


#### `master.ts`

**Berkas.** `lib/validations/master.ts` (51 baris)

| Nama | Jenis | Keterangan |
|---|---|---|
| `tahunAkademikSchema` | konstanta |  |
| `dosenSchema` | konstanta |  |
| `mahasiswaSchema` | konstanta |  |
| `mataKuliahSchema` | konstanta |  |
| `tendikSchema` | konstanta |  |
| `TahunAkademikInput` | tipe |  |
| `DosenInput` | tipe |  |
| `MahasiswaInput` | tipe |  |
| `MataKuliahInput` | tipe |  |
| `TendikInput` | tipe |  |


---

<a id="17-panduan-pengembangan"></a>

## 17. Panduan Pengembangan

Perintah, konvensi penamaan, dan cara menambah fitur

### Perintah yang sering dipakai

| Perintah | Kegunaan |
|---|---|
| `pnpm dev` | Menjalankan server pengembangan |
| `pnpm build` | Membangun versi produksi |
| `pnpm start` | Menjalankan hasil build |
| `pnpm type-check` | Memeriksa tipe TypeScript |
| `pnpm test` | Uji cepat (Vitest) |
| `pnpm test:e2e` | Uji dari sisi pengguna (Playwright) |
| `pnpm db:push` | Menyamakan struktur database dengan schema |
| `pnpm db:seed` | Mengisi data awal |
| `pnpm db:studio` | Membuka penjelajah database |

### Memeriksa kode sebelum menaikkan perubahan

```bash
npx eslint components/ app/     # bukan `pnpm lint` — lihat penjelasan di bawah
pnpm type-check
npx vitest run
pnpm build
```

**Jangan memakai `pnpm lint`.** Isinya hanya memeriksa folder `app/` dan
selalu melaporkan berhasil. Ini sudah pernah menyebabkan build produksi gagal
padahal di komputer sendiri tampak hijau.

### Konvensi penamaan yang berlaku

| Hal | Aturan | Contoh |
|---|---|---|
| Berkas komponen | huruf kecil, tanda hubung | `tabel-2b3-client.tsx` |
| Berkas halaman | selalu `page.tsx` | `app/(dashboard)/led/page.tsx` |
| Nama komponen | huruf besar di awal | `LedEditor` |
| Fungsi di `lib/utils/` | kata kerja bahasa Indonesia | `hitungNilaiAkhir` |
| Server action | kata kerja bahasa Indonesia | `simpanNarasi` |
| Tipe data | bahasa Indonesia atau Inggris sesuai konteks | `BagianLed`, `Props` |
| Variabel keadaan | bahasa Indonesia | `kotor`, `tersimpan` |

Bahasa campur ini memang terjadi sejak awal: nama berkas dan pustaka memakai
bahasa Inggris, sedangkan logika bisnis memakai bahasa Indonesia. **Jangan
menyeragamkan sebagian** — itu justru membuat kode tidak konsisten.

### Menambah tabel LKPS baru

1. Tambah entri di `prisma/seed.ts` pada daftar tabel — tentukan kode, kriteria,
   urutan, dan daftar kolomnya.
2. Jalankan `pnpm db:seed` untuk membuat barisnya di database.
3. Buat halaman di `app/(dashboard)/lkps/kriteria-N/tabel-<kode>/page.tsx` —
   salin dari tabel yang kode-nya mirip, lalu sesuaikan.
4. Buat komponen di `components/tables/tabel-<kode>-client.tsx`.
5. Tambah kartunya di halaman kriteria yang bersangkutan.
6. Jalankan pemeriksaan kode.

### Mengubah kolom tabel yang sudah ada

Kolom tabel disimpan sebagai JSON, jadi mengubah susunannya **tidak** mengubah
struktur database. Yang perlu disesuaikan hanya:

1. Daftar kolom di `prisma/seed.ts`
2. Komponen di `components/tables/`

Data yang sudah ada tidak hilang, tetapi isi pada kolom yang dibuang akan
menjadi tidak terpakai. **Cadangkan dulu** sebelum mengubah susunan kolom tabel
yang sudah terisi.

### Menjalankan generator dokumentasi

```bash
node scripts/generate-readme.mjs          # berkas ini
node docs/handover/generate-referensi.mjs # referensi per-berkas
```

Keduanya membaca kode asli. Kalau kode berubah, jalankan ulang supaya
dokumentasinya tidak basi.


---

<a id="18-pengujian"></a>

## 18. Pengujian

Dua lapis pengujian dan apa saja yang ditutup

Ada dua lapis pengujian, dan keduanya punya peran berbeda.

### Uji cepat — Vitest (79 uji)

Diuji langsung tanpa database, jadi jalannya di bawah satu detik.

```bash
npx vitest run
```

| Berkas | Yang diuji |
|---|---|
| `tests/unit/` | Hitungan nilai penilaian, kemajuan LED, format |

Karena pengujiannya cepat, jalankan setiap kali mengubah logika hitungan.
Kalau hasilnya berubah, itu pertanda ada yang berubah perilakunya — mungkin
disengaja, mungkin tidak.

### Uji menyeluruh — Playwright (79 skenario)

Menjalankan aplikasi sungguhan di peramban dan menirukan pemakaian.

```bash
DATABASE_URL="postgresql://postgres:SANDI_DB_UJI@localhost:5432/sim_lkps_uji" \
  npx playwright test --config=tests/playwright.config.ts
```

Habis sekitar enam menit.

| Berkas | Yang ditutup |
|---|---|
| `auth.spec.ts` | Login, logout, penolakan kredensial salah |
| `permissions.spec.ts` | Tiap peran hanya bisa membuka yang seharusnya |
| `lkps.spec.ts` | Membuka tabel, mengisi, menyimpan |
| `led.spec.ts` | Editor narasi, penyimpanan otomatis |
| `export-led.spec.ts` | Hasil ekspor dan formatnya |
| `penilaian.spec.ts` | Matriks penilaian dan hitungannya |
| `master-dosen.spec.ts` | Pengelolaan data induk dosen |
| `workflow.spec.ts` | Alur status dari draft sampai disetujui |

### Pengamanan pada uji menyeluruh

`tests/global-setup-penilaian.ts` **menghapus data** sebelum suite berjalan.
Karena itu ada pengaman: berkas itu **menolak berjalan kalau alamat database
bukan localhost**.

Alasannya sederhana — berkas `.env` proyek ini menunjuk database produksi. Tanpa
pengaman itu, menjalankan uji bisa menghapus data akreditasi sungguhan.

**Jangan menghapus pengaman ini.** Kalau uji menolak berjalan, itu memang
tujuannya; yang perlu dilakukan adalah memberi `DATABASE_URL` yang benar seperti
contoh di atas.

### Kenapa perlu membersihkan data sebelum uji

Suite yang berjalan berurutan bisa saling mengganggu lewat database yang sama.
Pernah terjadi: uji ekspor mengharapkan teks `1/92`, tetapi uji editor LED
berjalan lebih dulu dan mengisi satu bagian, sehingga yang muncul `2/92` dan uji
gagal.

Gejalanya menyesatkan — tampak seperti kerusakan tampilan, padahal hanya urutan
pengujian. Karena itu pembersihan `led_isian` ditambahkan ke persiapan global.

### Uji yang tidak stabil

Satu uji di `permissions.spec.ts` kadang gagal dengan "menunggu halaman terlalu
lama", lalu lulus saat dicoba ulang. Ini sudah lama terjadi dan bukan pertanda
kerusakan kode.

### Peramban untuk pengujian

Playwright dikonfigurasi memakai Chrome yang sudah terpasang di komputer
(`channel: "chrome"`). Alasannya: build bawaan Playwright tidak tersedia, dan
mengunduhnya memakan ratusan megabita.

### Yang belum ditutup pengujian

Perlu diketahui supaya tidak mengira semuanya aman:

- Tampilan di layar kecil belum diuji otomatis
- Mode gelap belum diuji otomatis
- Ekspor Word untuk tabel LKPS (bukan LED) belum diuji otomatis
- Pengunggahan berkas ke penyimpanan sungguhan belum diuji otomatis


---

<a id="19-deploy-dan-operasi"></a>

## 19. Deploy dan Operasi

Menaikkan perubahan, memantau, dan merawat

### Alur menaikkan perubahan

```bash
git push origin main
```

Setelah itu server hosting mendeteksi perubahan, membangun ulang aplikasi, dan
menggantikan versi yang berjalan. Tidak ada langkah manual.

### Yang paling sering terlewat: database

**Perubahan kode saja tidak cukup kalau strukturnya berubah.**

Kalau `prisma/schema.prisma` berubah, database harus disamakan **lebih dulu**.
Kalau tidak, kode baru akan menanyakan tabel yang belum ada, dan halaman terkait
gagal dengan pesan "tabel tidak ditemukan".

Urutan yang benar:

1. Samakan database
2. Jalankan pengisian data awal kalau ada data baru
3. Baru `git push`

### Memeriksa sebelum menyamakan database

Perintah `prisma db push` menyamakan database dengan schema, **termasuk
menghapus** apa pun yang tidak tertulis di sana. Karena itu periksa dulu
rencananya:

```bash
pnpm prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > /tmp/rencana.sql

grep -inE "drop |truncate|delete " /tmp/rencana.sql
```

Kalau perintah terakhir menemukan apa pun, **jangan lanjutkan** sebelum tahu
dampaknya.

### Memantau hasilnya

Buka halaman proyek di Vercel, tab **Deployments**. Perubahan teratas harus
berubah menjadi **Ready**.

> **Deploy tidak langsung muncul.** Diperlukan sekitar dua sampai lima menit
> setelah push. Kalau belum terlihat, **tunggu dulu** — pernah terjadi kesimpulan
> "deploy otomatis rusak" padahal hanya belum sampai.

### Kalau build gagal padahal di komputer berhasil

Penyebab paling sering: **pemeriksa kode di server lebih ketat** daripada yang
ada di komputer. Selalu jalankan `npx eslint components/ app/` sebelum push.

### Membatalkan perubahan yang sudah naik

```bash
git log --oneline -5     # lihat perubahan terakhir, catat kodenya
git revert <kode>        # buat perubahan baru yang membatalkan yang lama
git push origin main
```

Cara ini membuat perubahan baru yang membatalkan, bukan menghapus riwayat. Jauh
lebih aman daripada memaksa.

### Setelah selesai menaikkan

Periksa halaman yang terdampak benar-benar terbuka. Jangan hanya percaya pada
tanda "Ready" di halaman pemantauan.

### Rutinitas perawatan

| Tenggang | Yang dilakukan |
|---|---|
| Mingguan | Melihat catatan aktivitas, memeriksa pemberitahuan tagihan |
| Bulanan | Mencadangkan database, membetulkan susunan pengguna |
| Enam bulanan | Mengganti sandi administrator, memeriksa akun yang tidak terpakai |


---

<a id="20-pemecahan-masalah"></a>

## 20. Pemecahan Masalah

Gejala, sebab, dan penanganan — dari kejadian nyata

Bagian ini berasal dari masalah yang benar-benar pernah terjadi. Urutannya
sengaja dari gejala, karena itulah yang pertama kali terlihat.

### "Gagal Memuat Halaman" dengan pesan tabel tidak ditemukan

**Gejala.** Halaman pembuka dan dasbor normal, tetapi satu modul menampilkan
kartu galat berisi pesan dari database, misalnya:

> The table `public.led_bagian` does not exist in the current database

**Sebab.** Database yang dipakai belum punya tabel untuk modul itu. Ini biasanya
terjadi saat kode sudah diperbarui tetapi database belum disamakan.

**Penanganan.** Samakan struktur database:

```bash
pnpm db:push
```

**Cara memastikan.** Periksa database mana yang sedang dipakai sebelum
menyimpulkan apa pun. Bisa jadi komputer sedang menunjuk database uji, sedangkan
yang ingin dilihat adalah data yang lain.

### Halaman tampak kosong padahal aplikasi berjalan

**Gejala.** Tidak ada galat, kerangka halaman tampil, tetapi isinya kosong.

**Sebab paling sering.** Alat penghubung database belum dibuat setelah paket
dipasang ulang.

**Penanganan.**

```bash
pnpm prisma generate
```

Lalu **matikan dan nyalakan ulang** server pengembangan.

### Semua halaman gagal dan login tidak bisa

**Gejala.** Halaman login terbuka, tetapi menekan tombol masuk tidak berhasil.
Semua halaman setelahnya ikut gagal. Log diisi pesan berulang tentang berkas
yang tidak ditemukan di dalam folder `.next`.

**Sebab.** Folder hasil build rusak. Ini bukan kesalahan kode dan bukan masalah
database.

**Penanganan.**

```bash
# Matikan dulu server yang sedang berjalan
rm -rf .next
pnpm dev
```

> **Jangan menghapus isi `.next/cache` selagi server berjalan.** Berkasnya
> sedang dipegang proses, dan yang muncul adalah pesan kesalahan bertubi-tubi.

**Jangan tertipu.** Gejala ini menyerupai masalah login, padahal sama sekali
bukan. Login tampak normal, tetapi selalu gagal.

### Build gagal di server padahal di komputer berhasil

**Sebab.** Versi pemeriksa kode di server berbeda dengan yang di komputer.
Aturan yang belum ada di versi lama bisa menggagalkan build.

Dua aturan yang sudah pernah menyebabkan ini:

| Aturan | Artinya |
|---|---|
| `react-hooks/refs` | Dilarang membaca atau menulis rujukan saat render |
| `react-hooks/static-components` | Dilarang membuat komponen di dalam render |

**Penanganan yang benar** adalah memperbaiki kodenya, **bukan mematikan
aturannya** — aturan itu menangkap masalah nyata.

### Menu samping terlihat menyegarkan diri

**Gejala.** Setiap kali data disimpan, daftar menu di samping berkedip dan
animasinya terputar ulang.

**Sebab.** Penyegaran halaman dilakukan dengan lingkup yang terlalu luas,
sehingga seluruh kerangka halaman ikut dipasang ulang.

**Penanganan.** Ganti penyegaran berlingkup luas menjadi penyegaran halaman
spesifik. Polanya sudah ada di `lib/actions/led.ts`.

### Data tidak muncul padahal ada di database

**Sebab.** Tahun akademik yang aktif bukan tahun yang dimaksud. Aplikasi hanya
menampilkan data tahun yang sedang aktif.

**Penanganan.** Buka **Data Induk → Tahun Akademik**, pastikan hanya satu yang
aktif dan tahunnya benar.

### Tautan berkas bukti tidak bisa dibuka

**Sebab yang paling sering.** Tautan unduhan punya masa berlaku terbatas.

**Penanganan.** Muat ulang halaman untuk membuat tautan baru. Kalau tetap gagal,
periksa apakah berkasnya masih ada di penyimpanan.

### Jumlah tabel terbaca 33, bukan 32

**Sebab.** Di database pernah ada satu baris tambahan yang bukan bagian dari
instrumen.

**Penanganan.** Hitung dari sumber yang benar — daftar di `prisma/seed.ts`.
Jangan menghitung langsung dari database.

### Total bobot penilaian tidak 400

**Sebab.** Pengisian data awal memang dirancang **gagal dengan sengaja** kalau
total bobot bukan 400. Itu pengamanan, bukan kerusakan.

**Penanganan.** Periksa `prisma/seed-data/butir-penilaian.json`. Periksa tanpa
mengubah apa pun:

```bash
node -e "
const b = require('./prisma/seed-data/butir-penilaian.json');
console.log('butir:', b.length, '| bobot:', b.reduce((s,x)=>s+x.bobot,0));
"
```

### Aplikasi terasa lambat

Urutan pemeriksaan:

1. Seberapa besar database saat ini?
2. Berapa banyak orang membuka bersamaan?
3. Apakah lambat di semua halaman, atau hanya satu?

Kalau hanya satu halaman, laporkan halaman mana — jauh lebih cepat ditelusuri.


---

<a id="21-konvensi-dan-aturan-tetap"></a>

## 21. Konvensi dan Aturan Tetap

Aturan yang tidak boleh dilanggar beserta alasannya

Aturan di bawah ini bukan selera. Masing-masing lahir dari masalah yang pernah
terjadi, dan melanggarnya berarti mengulang masalah itu.

### 1. Penghitungan murni diletakkan di `lib/utils/`, bukan di server action

**Alasannya.** Fungsi hitungan di sana bisa diuji tanpa database. Kalau logika
hitungan bercampur dengan akses database, mengujinya butuh database berjalan —
dan pengujian jadi lambat sehingga jarang dijalankan.

### 2. Hindari lingkup `"layout"` pada penyegaran halaman

**Alasannya.** Lingkup itu menyuruh Next mengirim ulang seluruh kerangka
dashboard, sehingga menu samping ikut dipasang ulang dan animasinya terputar
dari awal. Pengguna melihatnya sebagai gangguan.

Pakai penyegaran halaman spesifik. Tiap modul punya fungsi tersendiri supaya
cakupannya terkumpul di satu tempat.

> Sebagian tempat masih memakai lingkup luas. Daftarnya ada di bab 19.

### 3. Warna permukaan dan teks selalu lewat kelas, jangan gaya sebaris

**Alasannya.** Pengaturan mode gelap bekerja dengan menimpa kelas warna. Warna
yang ditulis langsung di atribut `style` **tidak ikut tertimpa**, sehingga
bagian itu tetap terang saat mode gelap aktif.

Aturan ini berlaku untuk warna latar dan warna huruf. Untuk nilai yang berubah
dinamis (misalnya lebar bilah kemajuan), gaya sebaris tetap boleh dipakai.

### 4. Jangan memakai kelas yang tidak ada di tema

**Alasannya.** Tailwind v4 di proyek ini tidak punya berkas konfigurasi; semua
token ada di blok `@theme` dalam `app/globals.css`. Kelas yang tidak terdaftar
di sana **tidak menghasilkan gaya apa pun, tanpa pesan kesalahan apa pun**.

Sebelum memakai kelas yang tidak biasa, periksa dulu:

```bash
grep -n "@theme" -A 60 app/globals.css
```

### 5. Pemeriksaan izin dilakukan di server, bukan dengan menyembunyikan tombol

**Alasannya.** Menyembunyikan tombol hanya kenyamanan tampilan. Siapa pun yang
tahu alamat fungsi tetap bisa memanggilnya. Pemeriksaan yang sebenarnya ada di
server action dan di penangan API.

### 6. Jangan menjalankan perapi kode otomatis pada seluruh repo

**Alasannya.** Susunan kode di repo ini belum seragam menurut perapi tersebut.
Satu berkas yang diedit dua puluh baris bisa berubah menjadi ratusan baris
perbedaan karena urutan kelas ditata ulang — dan perubahannya jadi tidak bisa
ditinjau.

Semua suntingan dikerjakan dengan tangan. **Cara mendeteksi kecelakaan ini:**
perubahan wajar satu fitur sekitar 15–25 baris per berkas. Kalau ada berkas yang
melonjak ratusan baris padahal isinya sama, itu perapi kode nyasar.

### 7. Dokumentasi yang dihasilkan otomatis jangan disunting tangan

**Alasannya.** Isinya akan tertimpa saat dibuat ulang. Ubah kodenya, lalu
jalankan ulang generatornya.

Aturan ini berlaku untuk `docs/handover/referensi/` dan bagian yang dihasilkan
di berkas README ini.

### 8. Jangan menyimpan nama dosen sebagai kaitan ke tabel dosen di isian LKPS

**Alasannya.** Tabel LKPS harus tetap bisa diisi meski data induk dosen belum
lengkap — dan itu memang kondisi nyata di lapangan. Kompromi ini disengaja;
akibatnya mengganti nama di data induk tidak otomatis memperbarui isian lama.

### 9. Bahasa campur: berkas dan pustaka dalam bahasa Inggris, logika bisnis dalam bahasa Indonesia

**Alasannya.** Sudah begitu sejak awal. **Jangan menyeragamkan sebagian** — kode
akan jadi setengah-setengah dan lebih membingungkan daripada campur sejak awal.

### 10. Nama perlu berkas halaman/API mengikuti aturan Next.js

Nama berkas seperti `page.tsx` dan `route.ts` bukan pilihan gaya — itu yang
dibaca kerangka kerja. Menggantinya akan membuat halaman tidak terbaca.


---

<a id="22-utang-teknis"></a>

## 22. Utang Teknis

Yang belum beres, disertai alamat berkasnya

Bagian ini jujur menyebutkan apa yang belum beres. Masing-masing disertai
alamat berkasnya supaya bisa langsung ditindaklanjuti.

### 1. Penyegaran berlingkup luas masih tersisa

**Di mana.** `lib/actions/led.ts`, baris 283 dan 307.

**Apa.** Dua fungsi — mengunggah dan menghapus berkas bukti — masih memakai
penyegaran berlingkup `"layout"` yang seharusnya dihindari.

**Akibatnya.** Menu samping terlihat menyegarkan diri setiap kali berkas bukti
diunggah atau dihapus.

**Seberapa serius.** Hanya soal tampilan. Tidak ada data yang hilang atau salah.

**Perbaikannya.** Samakan dengan pola fungsi `revalidateLed()` di berkas yang
sama.

### 2. Dua berkas dokumentasi lama sudah kedaluwarsa

**Di mana.** `docs/roadmap.md` dan `docs/requirements.md`.

**Apa.** Keduanya masih memakai istilah lama, menyebut 31 tabel, dan menyebut
empat peran pengguna padahal sekarang tiga.

**Perbaikannya.** Perbarui atau tandai dengan jelas sebagai arsip. Sudah diberi
catatan peringatan di awal berkas, tetapi isinya belum dibetulkan.

### 3. Berkas panduan asisten masih basi

**Di mana.** `CLAUDE.md` di akar repo.

**Apa.** Masih menyebut 31 tabel dan alamat lama bergaya `bab-X`.

**Kenapa belum diperbaiki.** Berkas ini dilindungi dari penyuntingan otomatis.
Perlu disunting langsung oleh manusia.

### 4. Tabel LKPS tidak punya kaitan resmi ke data induk dosen

**Di mana.** `prisma/schema.prisma`, model `TabelLkpsRow`.

**Apa.** Nama dosen disimpan sebagai teks di dalam kolom JSON.

**Akibatnya.** Mengganti nama dosen di data induk tidak memperbarui isian yang
sudah ada. Data lama bisa memuat nama yang sudah tidak dipakai.

**Kenapa begitu.** Disengaja — supaya pengisian LKPS tidak tersandera
kelengkapan data induk.

**Kalau ingin diperbaiki.** Perlu penelusuran menyeluruh terhadap isian lama,
dan itu pekerjaan yang berisiko. Sebaiknya disertai alat pembanding yang
menunjukkan mana yang tidak cocok sebelum apa pun diubah.

### 5. Isian kolom JSON tidak bisa dicari langsung

**Apa.** Karena isinya JSON, pencarian dan penjumlahan langsung lewat SQL perlu
operator khusus.

**Dampaknya sekarang.** Belum terasa karena data masih sedikit. Akan terasa saat
data bertambah banyak dan laporan perlu dihitung lintas tabel.

### 6. Belum ada pengujian untuk layar kecil dan mode gelap

**Apa.** Keduanya dikerjakan manual.

**Risikonya.** Kerusakan pada keduanya tidak akan tertangkap oleh pengujian
otomatis.

### 7. Repo tidak memakai sistem migrasi database

**Apa.** Struktur database disamakan dengan `prisma db push`.

**Akibatnya.** Tidak ada riwayat perubahan struktur database, dan tidak ada
pembatalan otomatis.

**Kalau ingin diperbaiki.** Pindah ke `prisma migrate` adalah perbaikan yang
layak, tetapi harus dikerjakan hati-hati pada proyek yang sudah berisi data.

### 8. Satu uji kadang tidak stabil

**Di mana.** `tests/permissions.spec.ts`.

**Apa.** Kadang gagal karena waktu tunggu halaman habis, lalu lulus saat dicoba
ulang.

**Seberapa serius.** Tidak mengganggu; perlu diketahui supaya tidak dikira
kerusakan baru saat muncul.


---

<a id="23-indeks-seluruh-berkas"></a>

## 23. Indeks Seluruh Berkas

Peta semua berkas: mana dijelaskan di bab mana

Tabel di bawah memetakan setiap berkas sumber ke bab yang membahasnya. Dipakai
kalau kamu menemukan sebuah berkas dan ingin tahu fungsinya.

| Berkas | Baris | Dijelaskan di |
|---|---:|---|
| `app/(auth)/login/page.tsx` | 89 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/dashboard/page.tsx` | 167 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/developer/page.tsx` | 140 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/evidence/page.tsx` | 60 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/forbidden/page.tsx` | 21 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/laporan/page.tsx` | 107 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/bab-1/page.tsx` | 46 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx` | 42 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx` | 82 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/bab-2/page.tsx` | 139 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/bab-2/profil/page.tsx` | 48 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/bab-2/suplemen/page.tsx` | 45 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/bab-3/page.tsx` | 42 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/export/page.tsx` | 218 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/led/page.tsx` | 219 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-1/page.tsx` | 186 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-1/tabel-1a1/page.tsx` | 135 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-1/tabel-1a2/page.tsx` | 137 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-1/tabel-1a3/page.tsx` | 225 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-1/tabel-1a4/page.tsx` | 165 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-1/tabel-1a5/page.tsx` | 160 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-1/tabel-1b/page.tsx` | 160 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/page.tsx` | 191 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2a1/page.tsx` | 165 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2a2/page.tsx` | 107 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2a3/page.tsx` | 104 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2b1/page.tsx` | 66 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2b2/page.tsx` | 63 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2b3/page.tsx` | 63 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2b4/page.tsx` | 204 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2b5/page.tsx` | 136 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2b6/page.tsx` | 98 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2c/page.tsx` | 134 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-2/tabel-2d/page.tsx` | 133 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-3/page.tsx` | 186 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-3/tabel-3a1/page.tsx` | 132 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-3/tabel-3a2/page.tsx` | 155 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-3/tabel-3a3/page.tsx` | 148 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-3/tabel-3c1/page.tsx` | 150 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-3/tabel-3c2/page.tsx` | 153 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-3/tabel-3c3/page.tsx` | 149 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-4/page.tsx` | 181 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-4/tabel-4a1/page.tsx` | 149 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-4/tabel-4a2/page.tsx` | 154 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-4/tabel-4c1/page.tsx` | 150 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-4/tabel-4c2/page.tsx` | 152 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-4/tabel-4c3/page.tsx` | 152 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-5-6/page.tsx` | 230 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-5-6/tabel-51/page.tsx` | 124 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-5-6/tabel-52/page.tsx` | 149 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-6/page.tsx` | 188 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-6/tabel-61/page.tsx` | 160 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/kriteria-6/tabel-62/page.tsx` | 160 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/submissions/page.tsx` | 104 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/lkps/validasi/page.tsx` | 104 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/dosen/new/page.tsx` | 259 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/dosen/page.tsx` | 115 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/mahasiswa/[id]/edit/page.tsx` | 21 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/mahasiswa/new/page.tsx` | 6 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/mahasiswa/page.tsx` | 175 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/mata-kuliah/[id]/edit/page.tsx` | 21 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/mata-kuliah/new/page.tsx` | 6 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/mata-kuliah/page.tsx` | 167 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/page.tsx` | 430 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/prodi/page.tsx` | 28 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/master/tahun-akademik/page.tsx` | 102 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/penilaian/butir/[kode]/page.tsx` | 205 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/penilaian/kriteria/[kode]/page.tsx` | 159 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/penilaian/page.tsx` | 199 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/settings/audit-log/page.tsx` | 229 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/settings/page.tsx` | 6 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/(dashboard)/settings/users/page.tsx` | 92 | [9. Referensi Halaman](#9-referensi-halaman) |
| `app/api/auth/[...nextauth]/route.ts` | 4 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/export/excel/route.ts` | 248 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/export/led/pdf/route.ts` | 89 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/export/led/word/route.ts` | 91 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/export/route.ts` | 181 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/export/word/route.ts` | 316 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/health/route.ts` | 21 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/master/dosen/route.ts` | 116 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/api/notifications/route.ts` | 46 | [10. API dan Server Action](#10-api-dan-server-action) |
| `app/page.tsx` | 14 | [9. Referensi Halaman](#9-referensi-halaman) |
| `components/forms/create-user-dialog.tsx` | 157 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/forms/delete-user-dialog.tsx` | 145 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/forms/edit-user-dialog.tsx` | 275 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/forms/login-form.tsx` | 225 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/layout/developer-badge.tsx` | 261 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/layout/header.tsx` | 157 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/layout/NotificationBell.tsx` | 233 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/layout/sidebar.tsx` | 321 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/layout/theme-sync.tsx` | 60 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/layout/theme-toggle.tsx` | 56 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/ikon.ts` | 32 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedAccordion.tsx` | 89 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedButirKartu.tsx` | 96 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedEditor.tsx` | 272 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedEvidenceList.tsx` | 172 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedExportDialog.tsx` | 307 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedPageHeader.tsx` | 113 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedProgressCard.tsx` | 145 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/LedStatusSelect.tsx` | 70 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/status.ts` | 38 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/led/types.ts` | 37 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/navigation-events.tsx` | 33 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/penilaian/AksiFinalisasi.tsx` | 111 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/penilaian/KriteriaBreakdown.tsx` | 129 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/penilaian/SkorSelector.tsx` | 102 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/penilaian/StatusGauge.tsx` | 136 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/shared/DosenSelect.tsx` | 285 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/shared/error-boundary.tsx` | 67 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/shared/permission-gate.tsx` | 43 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/shared/skeleton.tsx` | 117 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/shared/status-badge.tsx` | 99 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-1a1-client.tsx` | 629 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-1a2-client.tsx` | 623 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-1a3-client.tsx` | 562 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-1a4-client.tsx` | 722 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-1a5-client.tsx` | 666 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-1b-client.tsx` | 713 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2a1-client.tsx` | 402 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2a2-client.tsx` | 308 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2a3-client.tsx` | 400 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2b1-client.tsx` | 171 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2b2-client.tsx` | 105 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2b3-client.tsx` | 119 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2b4-client.tsx` | 388 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2b5-client.tsx` | 392 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2b6-client.tsx` | 353 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2c-client.tsx` | 344 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-2d-client.tsx` | 248 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-3a1-client.tsx` | 586 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-3a2-client.tsx` | 575 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-3a3-client.tsx` | 303 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-3c1-client.tsx` | 228 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-3c2-client.tsx` | 222 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-3c3-client.tsx` | 202 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-4a1-client.tsx` | 600 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-4a2-client.tsx` | 591 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-4c1-client.tsx` | 225 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-4c2-client.tsx` | 347 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-4c3-client.tsx` | 344 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-51-client.tsx` | 585 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-52-client.tsx` | 612 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-6-client.tsx` | 363 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-61-client.tsx` | 432 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/tabel-62-client.tsx` | 390 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/user-table.tsx` | 192 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/validation-controls.tsx` | 205 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/tables/validation-history.tsx` | 98 | [11. Referensi Komponen](#11-referensi-komponen) |
| `components/ui/loading-screen.tsx` | 71 | [11. Referensi Komponen](#11-referensi-komponen) |
| `lib/actions/auth.ts` | 139 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/evidence.ts` | 306 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/led.ts` | 311 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/lkps.ts` | 559 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/mahasiswa.ts` | 109 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/matakuliah.ts` | 109 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/notification.ts` | 129 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/penilaian.ts` | 333 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/actions/user.ts` | 279 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/auth.ts` | 98 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/config/developer.ts` | 52 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/db.ts` | 14 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/export/excel.ts` | 341 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/export/helpers.ts` | 187 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/export/led-docx.ts` | 493 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/export/led-dokumen.ts` | 390 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/export/led-pdf.tsx` | 277 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/export/pdf.tsx` | 399 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/export/word.ts` | 395 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/format.ts` | 32 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/minio.ts` | 64 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/types/auth.ts` | 23 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/audit.ts` | 62 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/db-retry.ts` | 65 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/format.ts` | 75 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/kriteria-led.ts` | 13 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/kriteria.ts` | 48 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/led-export-query.ts` | 50 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/led-progress.ts` | 138 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/led-query.ts` | 104 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/led-rute.ts` | 19 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/markdown.tsx` | 231 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/penilaian-query.ts` | 105 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/penilaian.ts` | 317 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/utils/permissions.ts` | 152 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/validations/auth.ts` | 32 | [16. Pustaka Internal](#16-pustaka-internal) |
| `lib/validations/master.ts` | 51 | [16. Pustaka Internal](#16-pustaka-internal) |
| `prisma/schema.prisma` | 539 | [8. Skema Basis Data](#8-skema-basis-data) |
| `prisma/seed-modul-baru.ts` | 28 | [12. Modul LED](#12-modul-led) |
| `prisma/seed.ts` | 496 | [6. Daftar Tabel LKPS](#6-daftar-tabel-lkps) |


---

<a id="24-penutup"></a>

## 24. Penutup

Ringkasan angka dan cara menjaga dokumen ini tetap benar

### Ringkasan angka penting

| Yang dihitung | Jumlah | Sumber yang benar |
|---|---|---|
| Tabel LKPS | 32 | `prisma/seed.ts` |
| Bagian LED | 92 | `prisma/seed-data/led-bagian.json` |
| Butir penilaian | 82 | `prisma/seed-data/butir-penilaian.json` |
| Total bobot penilaian | 400 | berkas yang sama |
| Tabel database | 23 | `prisma/schema.prisma` |
| Pilihan nilai tetap (enum) | 7 | berkas yang sama |
| Halaman | 73 | hitungan berkas `page.tsx` |
| Titik akhir API | 9 | hitungan berkas `route.ts` |
| Komponen | 68 | hitungan folder `components/` |
| Berkas logika | 37 | hitungan folder `lib/` |
| Peran pengguna | 3 | `lib/utils/permissions.ts` |
| Uji cepat | 79 | `npx vitest run` |
| Skenario uji menyeluruh | 79 | `npx playwright test` |

**Aturan yang berlaku soal angka-angka ini:** kalau ada yang bertanya "ada berapa
...", jawabannya diambil dari sumber di kolom kanan — **bukan** dari hitungan
langsung di database, dan bukan dari dokumen lama.

### Kalau bingung harus mulai dari mana

| Kebutuhanku | Buka bab |
|---|---|
| Tahu aplikasi ini untuk apa | 2 |
| Tahu fitur apa saja yang ada | 3 |
| Tahu bagian-bagian sistemnya | 4 |
| Tahu kenapa pustaka ini yang dipakai | 5 |
| Tahu berkas mana yang harus dibuka | 6 |
| Tahu arti sebuah tabel database | 7 |
| Tahu cara kerja sebuah halaman | 8 |
| Tahu cara kerja sebuah API atau server action | 9 |
| Tahu fungsi sebuah komponen | 10 |
| Tahu cara kerja modul LED | 11 |
| Tahu cara menghitung nilai | 12 |
| Tahu cara memakai perkakas internal | 13 |
| Mulai mengembangkan | 14 |
| Menjalankan pengujian | 15 |
| Menaikkan perubahan ke server | 16 |
| Mencari solusi sebuah masalah | 17 |
| Tahu aturan yang tidak boleh dilanggar | 18 |
| Tahu apa yang belum beres | 19 |

### Cara menjaga dokumen ini tetap benar

Berkas README ini dihasilkan oleh skrip. Setelah mengubah kode:

```bash
node scripts/generate-readme.mjs
```

Kalau isinya jadi tidak sesuai dengan kode, itu pertanda ada bagian yang ditulis
tangan perlu disesuaikan. Teks naratifnya tersimpan di
`scripts/readme/narasi.mjs`.

**Jangan menyunting README.md langsung** — perubahan akan tertimpa saat
dibuat ulang.
