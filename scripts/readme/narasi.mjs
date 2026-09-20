/**
 * Generator bab naratif README — bagian yang butuh penjelasan, bukan sekadar
 * daftar. Isi setiap bab ditulis di sini supaya bisa ditinjau dan diubah.
 */

export const babPengenalan = (angka) => `
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
  \`2.B.3\`. Menyalin baris antar berkas mudah membuat kode dan isinya tidak lagi
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
`;

export const babIkhtisar = (angka) => `
### Tiga modul utama

Aplikasi terbagi menjadi tiga modul yang bisa dipakai berdiri sendiri, tetapi
saling melengkapi.

#### LKPS — data angka (32 tabel)

Ini modul paling awal dan paling banyak dipakai. Tiap tabel menempati halaman
sendiri dengan alamat yang kodenya sesuai instrumen, misalnya
\`/lkps/kriteria-2/tabel-2b3\`. Isinya baris demi baris yang bisa ditambah,
diubah, dan dihapus.

Tiap tabel punya **kolom sendiri** yang berbeda-beda. Kolom itulah yang
menentukan apa yang boleh diisi — dan karena tiap tabel berbeda, komponen
tampilannya pun dibuat terpisah. Pilihan ini dijelaskan di bab 18.

Satu tabel melewati **alur status berjenjang**:

\`\`\`
DRAFT ──ajukan──▶ DIAJUKAN ──setujui──▶ DISETUJUI
                     │
                     ├──tolak──▶ DITOLAK ──perbaiki──┐
                     │                               │
                     └──revisi─▶ DIREVISI ───────────┘
\`\`\`

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

\`\`\`
nilai = Σ (skor butir × bobot butir) / 4
\`\`\`

Hasilnya dipetakan ke peringkat akreditasi. Karena angka ini menentukan, ada
**kunci finalisasi** — setelah difinalkan, nilai tidak bisa diubah lagi.

### Bagaimana ketiganya terhubung

\`\`\`
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
\`\`\`

Idealnya isi LED merujuk ke angka di tabel LKPS, dan penilaian merujuk ke
keduanya. Aplikasi menyediakan tempat untuk semuanya dalam satu sistem, supaya
rujukan itu tidak terputus.
`;

export const babArsitektur = (angka) => `
### Bentuk umum

Aplikasi ini adalah aplikasi web biasa dengan arsitektur tiga lapis:

\`\`\`
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
\`\`\`

### Empat lapis yang perlu dipahami

**Lapis 1 — Peramban.** Sebagian besar halaman dikirim dalam keadaan sudah
jadi. Peramban hanya menjalankan potongan yang memang butuh interaksi: editor
narasi, pengunggah berkas, pilihan dosen, tombol simpan.

**Lapis 2 — Server Next.js.** Di sinilah keputusan diambil. Ada dua jenis
berkas yang penting:

- \`page.tsx\` — menyiapkan data lalu mengirim tampilan. Berjalan di server.
- \`actions.ts\` — memproses perubahan. Juga berjalan di server.

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
2. Editor mengirim narasi ke server action \`simpanNarasi\`.
3. Server memeriksa **apakah pengguna masih login** dan **punya izin
   \`led.update\`**.
4. Server menyimpan isinya ke tabel \`led_isian\`, sekaligus mencatat ke
   \`AuditLog\`.
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
Ini dilakukan dengan \`revalidatePath\`.

Ada jebakannya: kalau menyegarkan dengan lingkup terlalu luas, seluruh kerangka
halaman ikut dipasang ulang — termasuk menu samping — dan animasinya terputar
dari awal. Pengguna melihatnya sebagai "menu terus menyegarkan diri".

Karena itu setiap modul punya **fungsi penyegaran sendiri** (\`revalidateLed\`,
\`revalidatePenilaian\`) yang menyebut halaman spesifik satu per satu. Jangan
memakai lingkup \`"layout"\` kecuali benar-benar perlu — alasannya ada di bab 18.
`;

export const babTechStack = (angka) => `
Semua pilihan di bawah ini sudah dipakai di kode, bukan rencana.

### Kerangka kerja dan bahasa

| Teknologi | Versi | Dipakai untuk | Berkas kunci |
|---|---|---|---|
| **Next.js** | 15 | Kerangka kerja utama, App Router | \`next.config.ts\`, \`app/\` |
| **React** | 19 | Komponen tampilan | \`components/\`, \`app/\` |
| **TypeScript** | 5 | Bahasa, mode ketat | \`tsconfig.json\` |
| **Tailwind CSS** | 4 | Gaya tampilan | \`app/globals.css\` |
| **Framer Motion** | 11 | Animasi perpindahan dan masuk | \`components/layout/\` |

**Kenapa TypeScript mode ketat.** Instrumen akreditasi memakai kode berlapis
dan tipe data yang mirip, misalnya kode tabel \`2.B.3\` dan kode butir \`2.B.3\`.
Kesalahan kecil seperti itu sulit terlihat saat membaca, tetapi mudah tertangkap
pemeriksa tipe.

**Catatan Tailwind v4 yang penting:** tidak ada berkas \`tailwind.config\`. Semua
token warna dan ukuran didefinisikan di blok \`@theme\` di dalam
\`app/globals.css\`. Akibatnya **kelas yang tidak terdaftar di sana tidak
menghasilkan gaya apa pun — tanpa pesan kesalahan**. Ini pernah terjadi: kelas
\`text-3xs\` dipakai di puluhan berkas padahal tidak pernah ada di tema. Ukuran
mikro yang benar di proyek ini adalah \`text-[10px]\`.

### Basis data dan otentikasi

| Teknologi | Versi | Dipakai untuk |
|---|---|---|
| **PostgreSQL** | 16 | Basis data utama |
| **Neon** | — | Pengelola basis data saat berjalan di internet |
| **Prisma** | 6 | Penghubung kode ke basis data |
| **Auth.js (NextAuth)** | 5 | Login dan sesi pemakaian |

**Kenapa Prisma tanpa folder migrasi.** Proyek ini menyamakan struktur database
memakai \`prisma db push\`, bukan sistem migrasi bertahap. Konsekuensinya perlu
dipahami betul dan dijelaskan terpisah di bab 16.

### Penyimpanan berkas

| Teknologi | Dipakai untuk |
|---|---|
| **Cloudflare R2** | Menyimpan berkas bukti di produksi |
| **MinIO SDK** | Pustaka yang dipakai kode untuk mengaksesnya |
| **MinIO (lokal)** | Penyimpanan tiruan untuk pengembangan |

Penyimpanan R2 memakai protokol yang sama dengan S3, sehingga pustaka klien
MinIO bisa dipakai apa adanya. Karena itu di kode akan ditemukan nama
\`lib/minio.ts\` dan variabel \`MINIO_*\`.

### Tampilan dan bentuk data

| Teknologi | Dipakai untuk |
|---|---|
| **Lucide React** | Kumpulan ikon |
| **Zod** | Memeriksa bentuk data sebelum disimpan |
| **React Hook Form** | Mengelola isian formulir |

### Ekspor dokumen

| Teknologi | Dipakai untuk | Berkas |
|---|---|---|
| **ExcelJS** | Ekspor tabel ke Excel | \`lib/export/excel.ts\` |
| **docx** | Ekspor ke Word | \`lib/export/word.ts\`, \`led-docx.ts\` |
| **@react-pdf/renderer** | Ekspor ke PDF | \`lib/export/pdf.tsx\`, \`led-pdf.tsx\` |

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
| **Prisma Migrate** | Proyek sudah berjalan dengan \`db push\` sejak awal (lihat bab 16) |
| **Sistem tema berbasis variabel** | Tidak bisa dipakai karena satu variabel warna dipakai untuk latar sekaligus teks (lihat bab 18) |
`;

export const babStruktur = (angka) => `
### Gambaran tingkat atas

\`\`\`
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
\`\`\`

### \`app/\` — halaman dan API

Folder ini mengikuti aturan Next.js App Router: **susunan folder = alamat URL**.

Dua hal yang sering membingungkan saat pertama membaca:

**Tanda kurung berarti tidak masuk URL.** Folder bernama \`(auth)\` dan
\`(dashboard)\` hanya untuk mengelompokkan tata letak.

| Alamat berkas | URL yang dihasilkan |
|---|---|
| \`app/(auth)/login/page.tsx\` | \`/login\` |
| \`app/(dashboard)/led/page.tsx\` | \`/led\` |

**Nama berkas menentukan perannya.**

| Nama berkas | Perannya |
|---|---|
| \`page.tsx\` | Halaman yang bisa dibuka |
| \`layout.tsx\` | Pembungkus yang tetap terpasang antar halaman |
| \`route.ts\` | Titik akhir API |
| \`loading.tsx\` | Tampilan sementara saat halaman dimuat |
| \`error.tsx\` | Tampilan saat halaman gagal dimuat |
| \`not-found.tsx\` | Tampilan saat alamat tidak ada |

### \`components/\` — komponen tampilan

| Folder | Jumlah | Isinya |
|---|---|---|
| \`tables/\` | 36 berkas | Tampilan tiap tabel LKPS (satu berkas per tabel) |
| \`led/\` | 11 berkas | Editor narasi, kartu kemajuan, daftar bukti |
| \`layout/\` | 6 berkas | Menu samping, kepala halaman, tombol mode gelap |
| \`shared/\` | 5 berkas | Pemilih dosen, kotak pencarian, dan sejenisnya |
| \`forms/\` | 4 berkas | Formulir data induk |
| \`penilaian/\` | 4 berkas | Matriks penilaian dan kartu skor |
| \`ui/\` | 1 berkas | Layar pemuatan |

### \`lib/\` — logika

| Folder | Jumlah | Isinya |
|---|---|---|
| \`utils/\` | 13 berkas | Hitungan murni: nilai, kemajuan, izin, format |
| \`actions/\` | 9 berkas | Server action: satu berkas per bidang |
| \`export/\` | 7 berkas | Penyusun dokumen Excel, Word, PDF |
| \`validations/\` | 2 berkas | Pemeriksaan bentuk data dengan Zod |
| \`config/\` | 1 berkas | Tetapan tetap |
| \`types/\` | 1 berkas | Tipe bersama |
| akar \`lib/\` | 4 berkas | \`auth.ts\`, \`db.ts\`, \`minio.ts\`, dan lain-lain |

**Pemisahan yang penting dipahami:** hitungan murni diletakkan di \`lib/utils/\`,
bukan di dalam server action. Alasannya bisa diuji tanpa perlu database. Contoh:
\`lib/utils/penilaian.ts\` menghitung nilai akhir dari sekumpulan skor — fungsi
itu bisa dipanggil langsung di uji.

### \`prisma/\` — basis data

| Berkas | Isinya |
|---|---|
| \`schema.prisma\` | Bentuk 23 tabel dan 7 pilihan nilai tetap |
| \`seed.ts\` | Data awal: 32 tabel LKPS, pengguna bawaan, data induk |
| \`seed-modul-baru.ts\` | Data awal modul LED dan Matriks Penilaian |
| \`seed-data/led-bagian.json\` | 92 bagian LED |
| \`seed-data/butir-penilaian.json\` | 82 butir penilaian |

### \`tests/\` — pengujian

| Bagian | Isinya |
|---|---|
| \`*.test.ts\`, \`unit/\` | Uji cepat per fungsi (Vitest) |
| \`*.spec.ts\` | Uji dari sisi pengguna (Playwright) |
| \`fixtures.ts\` | Alat bantu login untuk uji |
| \`playwright.config.ts\` | Tetapan Playwright |
| \`global-setup-penilaian.ts\` | Pembersih data sebelum uji berjalan |

### Pohon lengkap
`;

export const babPanduanDev = (angka) => `
### Perintah yang sering dipakai

| Perintah | Kegunaan |
|---|---|
| \`pnpm dev\` | Menjalankan server pengembangan |
| \`pnpm build\` | Membangun versi produksi |
| \`pnpm start\` | Menjalankan hasil build |
| \`pnpm type-check\` | Memeriksa tipe TypeScript |
| \`pnpm test\` | Uji cepat (Vitest) |
| \`pnpm test:e2e\` | Uji dari sisi pengguna (Playwright) |
| \`pnpm db:push\` | Menyamakan struktur database dengan schema |
| \`pnpm db:seed\` | Mengisi data awal |
| \`pnpm db:studio\` | Membuka penjelajah database |

### Memeriksa kode sebelum menaikkan perubahan

\`\`\`bash
npx eslint components/ app/     # bukan \`pnpm lint\` — lihat penjelasan di bawah
pnpm type-check
npx vitest run
pnpm build
\`\`\`

**Jangan memakai \`pnpm lint\`.** Isinya hanya memeriksa folder \`app/\` dan
selalu melaporkan berhasil. Ini sudah pernah menyebabkan build produksi gagal
padahal di komputer sendiri tampak hijau.

### Konvensi penamaan yang berlaku

| Hal | Aturan | Contoh |
|---|---|---|
| Berkas komponen | huruf kecil, tanda hubung | \`tabel-2b3-client.tsx\` |
| Berkas halaman | selalu \`page.tsx\` | \`app/(dashboard)/led/page.tsx\` |
| Nama komponen | huruf besar di awal | \`LedEditor\` |
| Fungsi di \`lib/utils/\` | kata kerja bahasa Indonesia | \`hitungNilaiAkhir\` |
| Server action | kata kerja bahasa Indonesia | \`simpanNarasi\` |
| Tipe data | bahasa Indonesia atau Inggris sesuai konteks | \`BagianLed\`, \`Props\` |
| Variabel keadaan | bahasa Indonesia | \`kotor\`, \`tersimpan\` |

Bahasa campur ini memang terjadi sejak awal: nama berkas dan pustaka memakai
bahasa Inggris, sedangkan logika bisnis memakai bahasa Indonesia. **Jangan
menyeragamkan sebagian** — itu justru membuat kode tidak konsisten.

### Menambah tabel LKPS baru

1. Tambah entri di \`prisma/seed.ts\` pada daftar tabel — tentukan kode, kriteria,
   urutan, dan daftar kolomnya.
2. Jalankan \`pnpm db:seed\` untuk membuat barisnya di database.
3. Buat halaman di \`app/(dashboard)/lkps/kriteria-N/tabel-<kode>/page.tsx\` —
   salin dari tabel yang kode-nya mirip, lalu sesuaikan.
4. Buat komponen di \`components/tables/tabel-<kode>-client.tsx\`.
5. Tambah kartunya di halaman kriteria yang bersangkutan.
6. Jalankan pemeriksaan kode.

### Mengubah kolom tabel yang sudah ada

Kolom tabel disimpan sebagai JSON, jadi mengubah susunannya **tidak** mengubah
struktur database. Yang perlu disesuaikan hanya:

1. Daftar kolom di \`prisma/seed.ts\`
2. Komponen di \`components/tables/\`

Data yang sudah ada tidak hilang, tetapi isi pada kolom yang dibuang akan
menjadi tidak terpakai. **Cadangkan dulu** sebelum mengubah susunan kolom tabel
yang sudah terisi.

### Menjalankan generator dokumentasi

\`\`\`bash
node scripts/generate-readme.mjs          # berkas ini
node docs/handover/generate-referensi.mjs # referensi per-berkas
\`\`\`

Keduanya membaca kode asli. Kalau kode berubah, jalankan ulang supaya
dokumentasinya tidak basi.
`;

export const babPengujian = (angka) => `
Ada dua lapis pengujian, dan keduanya punya peran berbeda.

### Uji cepat — Vitest (79 uji)

Diuji langsung tanpa database, jadi jalannya di bawah satu detik.

\`\`\`bash
npx vitest run
\`\`\`

| Berkas | Yang diuji |
|---|---|
| \`tests/unit/\` | Hitungan nilai penilaian, kemajuan LED, format |

Karena pengujiannya cepat, jalankan setiap kali mengubah logika hitungan.
Kalau hasilnya berubah, itu pertanda ada yang berubah perilakunya — mungkin
disengaja, mungkin tidak.

### Uji menyeluruh — Playwright (79 skenario)

Menjalankan aplikasi sungguhan di peramban dan menirukan pemakaian.

\`\`\`bash
DATABASE_URL="postgresql://postgres:SANDI_DB_UJI@localhost:5432/sim_lkps_uji" \\
  npx playwright test --config=tests/playwright.config.ts
\`\`\`

Habis sekitar enam menit.

| Berkas | Yang ditutup |
|---|---|
| \`auth.spec.ts\` | Login, logout, penolakan kredensial salah |
| \`permissions.spec.ts\` | Tiap peran hanya bisa membuka yang seharusnya |
| \`lkps.spec.ts\` | Membuka tabel, mengisi, menyimpan |
| \`led.spec.ts\` | Editor narasi, penyimpanan otomatis |
| \`export-led.spec.ts\` | Hasil ekspor dan formatnya |
| \`penilaian.spec.ts\` | Matriks penilaian dan hitungannya |
| \`master-dosen.spec.ts\` | Pengelolaan data induk dosen |
| \`workflow.spec.ts\` | Alur status dari draft sampai disetujui |

### Pengamanan pada uji menyeluruh

\`tests/global-setup-penilaian.ts\` **menghapus data** sebelum suite berjalan.
Karena itu ada pengaman: berkas itu **menolak berjalan kalau alamat database
bukan localhost**.

Alasannya sederhana — berkas \`.env\` proyek ini menunjuk database produksi. Tanpa
pengaman itu, menjalankan uji bisa menghapus data akreditasi sungguhan.

**Jangan menghapus pengaman ini.** Kalau uji menolak berjalan, itu memang
tujuannya; yang perlu dilakukan adalah memberi \`DATABASE_URL\` yang benar seperti
contoh di atas.

### Kenapa perlu membersihkan data sebelum uji

Suite yang berjalan berurutan bisa saling mengganggu lewat database yang sama.
Pernah terjadi: uji ekspor mengharapkan teks \`1/92\`, tetapi uji editor LED
berjalan lebih dulu dan mengisi satu bagian, sehingga yang muncul \`2/92\` dan uji
gagal.

Gejalanya menyesatkan — tampak seperti kerusakan tampilan, padahal hanya urutan
pengujian. Karena itu pembersihan \`led_isian\` ditambahkan ke persiapan global.

### Uji yang tidak stabil

Satu uji di \`permissions.spec.ts\` kadang gagal dengan "menunggu halaman terlalu
lama", lalu lulus saat dicoba ulang. Ini sudah lama terjadi dan bukan pertanda
kerusakan kode.

### Peramban untuk pengujian

Playwright dikonfigurasi memakai Chrome yang sudah terpasang di komputer
(\`channel: "chrome"\`). Alasannya: build bawaan Playwright tidak tersedia, dan
mengunduhnya memakan ratusan megabita.

### Yang belum ditutup pengujian

Perlu diketahui supaya tidak mengira semuanya aman:

- Tampilan di layar kecil belum diuji otomatis
- Mode gelap belum diuji otomatis
- Ekspor Word untuk tabel LKPS (bukan LED) belum diuji otomatis
- Pengunggahan berkas ke penyimpanan sungguhan belum diuji otomatis
`;

export const babDeploy = (angka) => `
### Alur menaikkan perubahan

\`\`\`bash
git push origin main
\`\`\`

Setelah itu server hosting mendeteksi perubahan, membangun ulang aplikasi, dan
menggantikan versi yang berjalan. Tidak ada langkah manual.

### Yang paling sering terlewat: database

**Perubahan kode saja tidak cukup kalau strukturnya berubah.**

Kalau \`prisma/schema.prisma\` berubah, database harus disamakan **lebih dulu**.
Kalau tidak, kode baru akan menanyakan tabel yang belum ada, dan halaman terkait
gagal dengan pesan "tabel tidak ditemukan".

Urutan yang benar:

1. Samakan database
2. Jalankan pengisian data awal kalau ada data baru
3. Baru \`git push\`

### Memeriksa sebelum menyamakan database

Perintah \`prisma db push\` menyamakan database dengan schema, **termasuk
menghapus** apa pun yang tidak tertulis di sana. Karena itu periksa dulu
rencananya:

\`\`\`bash
pnpm prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma \\
  --script > /tmp/rencana.sql

grep -inE "drop |truncate|delete " /tmp/rencana.sql
\`\`\`

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
ada di komputer. Selalu jalankan \`npx eslint components/ app/\` sebelum push.

### Membatalkan perubahan yang sudah naik

\`\`\`bash
git log --oneline -5     # lihat perubahan terakhir, catat kodenya
git revert <kode>        # buat perubahan baru yang membatalkan yang lama
git push origin main
\`\`\`

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
`;

export const babMasalah = (angka) => `
Bagian ini berasal dari masalah yang benar-benar pernah terjadi. Urutannya
sengaja dari gejala, karena itulah yang pertama kali terlihat.

### "Gagal Memuat Halaman" dengan pesan tabel tidak ditemukan

**Gejala.** Halaman pembuka dan dasbor normal, tetapi satu modul menampilkan
kartu galat berisi pesan dari database, misalnya:

> The table \`public.led_bagian\` does not exist in the current database

**Sebab.** Database yang dipakai belum punya tabel untuk modul itu. Ini biasanya
terjadi saat kode sudah diperbarui tetapi database belum disamakan.

**Penanganan.** Samakan struktur database:

\`\`\`bash
pnpm db:push
\`\`\`

**Cara memastikan.** Periksa database mana yang sedang dipakai sebelum
menyimpulkan apa pun. Bisa jadi komputer sedang menunjuk database uji, sedangkan
yang ingin dilihat adalah data yang lain.

### Halaman tampak kosong padahal aplikasi berjalan

**Gejala.** Tidak ada galat, kerangka halaman tampil, tetapi isinya kosong.

**Sebab paling sering.** Alat penghubung database belum dibuat setelah paket
dipasang ulang.

**Penanganan.**

\`\`\`bash
pnpm prisma generate
\`\`\`

Lalu **matikan dan nyalakan ulang** server pengembangan.

### Semua halaman gagal dan login tidak bisa

**Gejala.** Halaman login terbuka, tetapi menekan tombol masuk tidak berhasil.
Semua halaman setelahnya ikut gagal. Log diisi pesan berulang tentang berkas
yang tidak ditemukan di dalam folder \`.next\`.

**Sebab.** Folder hasil build rusak. Ini bukan kesalahan kode dan bukan masalah
database.

**Penanganan.**

\`\`\`bash
# Matikan dulu server yang sedang berjalan
rm -rf .next
pnpm dev
\`\`\`

> **Jangan menghapus isi \`.next/cache\` selagi server berjalan.** Berkasnya
> sedang dipegang proses, dan yang muncul adalah pesan kesalahan bertubi-tubi.

**Jangan tertipu.** Gejala ini menyerupai masalah login, padahal sama sekali
bukan. Login tampak normal, tetapi selalu gagal.

### Build gagal di server padahal di komputer berhasil

**Sebab.** Versi pemeriksa kode di server berbeda dengan yang di komputer.
Aturan yang belum ada di versi lama bisa menggagalkan build.

Dua aturan yang sudah pernah menyebabkan ini:

| Aturan | Artinya |
|---|---|
| \`react-hooks/refs\` | Dilarang membaca atau menulis rujukan saat render |
| \`react-hooks/static-components\` | Dilarang membuat komponen di dalam render |

**Penanganan yang benar** adalah memperbaiki kodenya, **bukan mematikan
aturannya** — aturan itu menangkap masalah nyata.

### Menu samping terlihat menyegarkan diri

**Gejala.** Setiap kali data disimpan, daftar menu di samping berkedip dan
animasinya terputar ulang.

**Sebab.** Penyegaran halaman dilakukan dengan lingkup yang terlalu luas,
sehingga seluruh kerangka halaman ikut dipasang ulang.

**Penanganan.** Ganti penyegaran berlingkup luas menjadi penyegaran halaman
spesifik. Polanya sudah ada di \`lib/actions/led.ts\`.

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

**Penanganan.** Hitung dari sumber yang benar — daftar di \`prisma/seed.ts\`.
Jangan menghitung langsung dari database.

### Total bobot penilaian tidak 400

**Sebab.** Pengisian data awal memang dirancang **gagal dengan sengaja** kalau
total bobot bukan 400. Itu pengamanan, bukan kerusakan.

**Penanganan.** Periksa \`prisma/seed-data/butir-penilaian.json\`. Periksa tanpa
mengubah apa pun:

\`\`\`bash
node -e "
const b = require('./prisma/seed-data/butir-penilaian.json');
console.log('butir:', b.length, '| bobot:', b.reduce((s,x)=>s+x.bobot,0));
"
\`\`\`

### Aplikasi terasa lambat

Urutan pemeriksaan:

1. Seberapa besar database saat ini?
2. Berapa banyak orang membuka bersamaan?
3. Apakah lambat di semua halaman, atau hanya satu?

Kalau hanya satu halaman, laporkan halaman mana — jauh lebih cepat ditelusuri.
`;

export const babKonvensi = (angka) => `
Aturan di bawah ini bukan selera. Masing-masing lahir dari masalah yang pernah
terjadi, dan melanggarnya berarti mengulang masalah itu.

### 1. Penghitungan murni diletakkan di \`lib/utils/\`, bukan di server action

**Alasannya.** Fungsi hitungan di sana bisa diuji tanpa database. Kalau logika
hitungan bercampur dengan akses database, mengujinya butuh database berjalan —
dan pengujian jadi lambat sehingga jarang dijalankan.

### 2. Hindari lingkup \`"layout"\` pada penyegaran halaman

**Alasannya.** Lingkup itu menyuruh Next mengirim ulang seluruh kerangka
dashboard, sehingga menu samping ikut dipasang ulang dan animasinya terputar
dari awal. Pengguna melihatnya sebagai gangguan.

Pakai penyegaran halaman spesifik. Tiap modul punya fungsi tersendiri supaya
cakupannya terkumpul di satu tempat.

> Sebagian tempat masih memakai lingkup luas. Daftarnya ada di bab 19.

### 3. Warna permukaan dan teks selalu lewat kelas, jangan gaya sebaris

**Alasannya.** Pengaturan mode gelap bekerja dengan menimpa kelas warna. Warna
yang ditulis langsung di atribut \`style\` **tidak ikut tertimpa**, sehingga
bagian itu tetap terang saat mode gelap aktif.

Aturan ini berlaku untuk warna latar dan warna huruf. Untuk nilai yang berubah
dinamis (misalnya lebar bilah kemajuan), gaya sebaris tetap boleh dipakai.

### 4. Jangan memakai kelas yang tidak ada di tema

**Alasannya.** Tailwind v4 di proyek ini tidak punya berkas konfigurasi; semua
token ada di blok \`@theme\` dalam \`app/globals.css\`. Kelas yang tidak terdaftar
di sana **tidak menghasilkan gaya apa pun, tanpa pesan kesalahan apa pun**.

Sebelum memakai kelas yang tidak biasa, periksa dulu:

\`\`\`bash
grep -n "@theme" -A 60 app/globals.css
\`\`\`

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

Aturan ini berlaku untuk \`docs/handover/referensi/\` dan bagian yang dihasilkan
di berkas README ini.

### 8. Jangan menyimpan nama dosen sebagai kaitan ke tabel dosen di isian LKPS

**Alasannya.** Tabel LKPS harus tetap bisa diisi meski data induk dosen belum
lengkap — dan itu memang kondisi nyata di lapangan. Kompromi ini disengaja;
akibatnya mengganti nama di data induk tidak otomatis memperbarui isian lama.

### 9. Bahasa campur: berkas dan pustaka dalam bahasa Inggris, logika bisnis dalam bahasa Indonesia

**Alasannya.** Sudah begitu sejak awal. **Jangan menyeragamkan sebagian** — kode
akan jadi setengah-setengah dan lebih membingungkan daripada campur sejak awal.

### 10. Nama perlu berkas halaman/API mengikuti aturan Next.js

Nama berkas seperti \`page.tsx\` dan \`route.ts\` bukan pilihan gaya — itu yang
dibaca kerangka kerja. Menggantinya akan membuat halaman tidak terbaca.
`;

export const babUtangTeknis = (angka) => `
Bagian ini jujur menyebutkan apa yang belum beres. Masing-masing disertai
alamat berkasnya supaya bisa langsung ditindaklanjuti.

### 1. Penyegaran berlingkup luas masih tersisa

**Di mana.** \`lib/actions/led.ts\`, baris 283 dan 307.

**Apa.** Dua fungsi — mengunggah dan menghapus berkas bukti — masih memakai
penyegaran berlingkup \`"layout"\` yang seharusnya dihindari.

**Akibatnya.** Menu samping terlihat menyegarkan diri setiap kali berkas bukti
diunggah atau dihapus.

**Seberapa serius.** Hanya soal tampilan. Tidak ada data yang hilang atau salah.

**Perbaikannya.** Samakan dengan pola fungsi \`revalidateLed()\` di berkas yang
sama.

### 2. Dua berkas dokumentasi lama sudah kedaluwarsa

**Di mana.** \`docs/roadmap.md\` dan \`docs/requirements.md\`.

**Apa.** Keduanya masih memakai istilah lama, menyebut 31 tabel, dan menyebut
empat peran pengguna padahal sekarang tiga.

**Perbaikannya.** Perbarui atau tandai dengan jelas sebagai arsip. Sudah diberi
catatan peringatan di awal berkas, tetapi isinya belum dibetulkan.

### 3. Berkas panduan asisten masih basi

**Di mana.** \`CLAUDE.md\` di akar repo.

**Apa.** Masih menyebut 31 tabel dan alamat lama bergaya \`bab-X\`.

**Kenapa belum diperbaiki.** Berkas ini dilindungi dari penyuntingan otomatis.
Perlu disunting langsung oleh manusia.

### 4. Tabel LKPS tidak punya kaitan resmi ke data induk dosen

**Di mana.** \`prisma/schema.prisma\`, model \`TabelLkpsRow\`.

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

**Apa.** Struktur database disamakan dengan \`prisma db push\`.

**Akibatnya.** Tidak ada riwayat perubahan struktur database, dan tidak ada
pembatalan otomatis.

**Kalau ingin diperbaiki.** Pindah ke \`prisma migrate\` adalah perbaikan yang
layak, tetapi harus dikerjakan hati-hati pada proyek yang sudah berisi data.

### 8. Satu uji kadang tidak stabil

**Di mana.** \`tests/permissions.spec.ts\`.

**Apa.** Kadang gagal karena waktu tunggu halaman habis, lalu lulus saat dicoba
ulang.

**Seberapa serius.** Tidak mengganggu; perlu diketahui supaya tidak dikira
kerusakan baru saat muncul.
`;

export const babIndeksPenutup = (angka) => `
Halaman ini **tidak diketik tangan**. Isinya dihasilkan dengan membaca isi
folder \`app/\`, \`components/\`, dan \`lib/\` saat generator dijalankan.

Karena itu, daftarnya selalu sesuai dengan berkas yang benar-benar ada.

### Cara memakai indeks ini

1. Cari nama berkas yang mau kamu pahami.
2. Lihat kolom **Dijelaskan di** — ke bab mana berkas itu dibahas.
3. Atau, kalau kamu tahu mau mengubah apa, langsung buka bab 3 yang berisi
   daftar pekerjaan umum beserta berkasnya.

### Indeks berkas
`;

export const babPenutup = (angka) => `
### Ringkasan angka penting

| Yang dihitung | Jumlah | Sumber yang benar |
|---|---|---|
| Tabel LKPS | 32 | \`prisma/seed.ts\` |
| Bagian LED | 92 | \`prisma/seed-data/led-bagian.json\` |
| Butir penilaian | 82 | \`prisma/seed-data/butir-penilaian.json\` |
| Total bobot penilaian | 400 | berkas yang sama |
| Tabel database | 23 | \`prisma/schema.prisma\` |
| Pilihan nilai tetap (enum) | 7 | berkas yang sama |
| Halaman | 73 | hitungan berkas \`page.tsx\` |
| Titik akhir API | 9 | hitungan berkas \`route.ts\` |
| Komponen | 68 | hitungan folder \`components/\` |
| Berkas logika | 37 | hitungan folder \`lib/\` |
| Peran pengguna | 3 | \`lib/utils/permissions.ts\` |
| Uji cepat | 79 | \`npx vitest run\` |
| Skenario uji menyeluruh | 79 | \`npx playwright test\` |

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

\`\`\`bash
node scripts/generate-readme.mjs
\`\`\`

Kalau isinya jadi tidak sesuai dengan kode, itu pertanda ada bagian yang ditulis
tangan perlu disesuaikan. Teks naratifnya tersimpan di
\`scripts/readme/narasi.mjs\`.

**Jangan menyunting README.md langsung** — perubahan akan tertimpa saat
dibuat ulang.
`;
