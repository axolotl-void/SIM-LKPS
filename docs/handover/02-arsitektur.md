# Arsitektur SIM-LKPS

Dokumen ini menjelaskan bagian-bagian sistem dan bagaimana mereka saling
berhubungan. Ditulis untuk staf TI yang perlu memahami gambaran besarnya
sebelum menyentuh kode.

---

## Gambaran besar

```
                        PENGGUNA
              (dosen, operator, pimpinan)
                            │
                            │  membuka lkps.zegika.com
                            ▼
        ┌───────────────────────────────────────────┐
        │              VERCEL                       │
        │         (tempat aplikasi hidup)           │
        │                                           │
        │   ┌─────────────────────────────────┐     │
        │   │   Aplikasi Next.js              │     │
        │   │   - Menampilkan halaman         │     │
        │   │   - Memeriksa login & izin      │     │
        │   │   - Mengolah data               │     │
        │   └─────────────────────────────────┘     │
        └──────────┬──────────────────────┬─────────┘
                   │                      │
                   │ menyimpan data       │ menyimpan berkas
                   ▼                      ▼
        ┌──────────────────┐   ┌──────────────────────┐
        │      NEON        │   │   CLOUDFLARE R2      │
        │   (database)     │   │  (berkas bukti)      │
        │                  │   │                      │
        │  semua data:     │   │  PDF, foto, dokumen  │
        │  dosen, tabel,   │   │  yang diunggah       │
        │  narasi, skor    │   │  pengguna            │
        └──────────────────┘   └──────────────────────┘
```

## Empat layanan, dan siapa pemilik akunnya

| Bagian | Layanan | Fungsi | Yang harus dimiliki kampus |
|---|---|---|---|
| **Aplikasi** | Vercel | Menjalankan aplikasi, memberi alamat web | Akun Vercel dengan email prodi |
| **Database** | Neon | Menyimpan semua data berupa teks dan angka | Akun Neon dengan email prodi |
| **Berkas** | Cloudflare R2 | Menyimpan berkas yang diunggah pengguna | Akun Cloudflare dengan email prodi |
| **Kode** | GitHub | Menyimpan salinan kode, riwayat perubahan | Akses ke repositori `axolotl-void/SIM-LKPS` |

> **Ini bagian terpenting dari serah terima.** Selama keempat akun itu masih
> terdaftar dengan email pribadi pengembang, kampus belum benar-benar memiliki
> sistemnya. Cara memindahkannya ada di
> [`05-akun-dan-keamanan.md`](./05-akun-dan-keamanan.md).

---

## Bagaimana satu klik bekerja

Contoh: operator mengisi satu baris di tabel LKPS lalu menekan Simpan.

```
1. Operator menekan tombol "Simpan"
       │
       ▼
2. Kode di browser (components/tables/tabel-*-client.tsx)
   mengumpulkan isi kotak-kotak yang diisi
       │
       ▼
3. Isi itu dikirim ke server lewat jalur khusus
   (lib/actions/lkps.ts → upsertLkpsRow)
       │
       ▼
4. Di server, TIGA hal diperiksa dulu:
   a. Apakah pengguna sudah login?
   b. Apakah perannya boleh mengubah tabel ini?
   c. Apakah isinya masuk akal? (mis. NIDN harus angka)
       │
       ▼
5. Kalau lolos, data disimpan ke Neon
       │
       ▼
6. Catatan perubahan ditulis ke tabel AuditLog
   (siapa, kapan, mengubah apa)
       │
       ▼
7. Tampilan di browser diperbarui tanpa perlu muat ulang halaman
```

Pola ini berlaku sama untuk hampir semua tombol di aplikasi. Yang berubah hanya
nama fungsi dan berkasnya.

**Kenapa penting dipahami:** kalau ada yang bertanya "kok data ini bisa berubah
padahal saya tidak menyentuhnya", jawabannya biasanya ada di tabel `AuditLog`
(langkah 6) — di situ tercatat siapa yang mengubah.

---

## Tiga lapis kode, dan aturannya

Aplikasi ini memakai **Next.js**. Dalam kerangka kerja ini, kode dipisah tegas
menjadi tiga jenis, dan **salah menaruh kode bisa menimbulkan masalah keamanan**.

### Lapis 1 — Halaman (berjalan di server)

Contoh: `app/(dashboard)/lkps/kriteria-1/tabel-1a1/page.tsx`

Tugasnya: **mengambil data dari database lalu mengirimnya ke tampilan.**
Di sini hanya boleh ada kode yang aman dijalankan di server (misalnya
menyambung ke database).

### Lapis 2 — Tampilan (berjalan di browser)

Contoh: `components/tables/tabel-1a1-client.tsx`

Ditandai dengan `"use client"` di baris pertama. Tugasnya: **mengurus interaksi
pengguna** — klik, ketik, buka-tutup jendela, peringatan.

> **Aturan penting:** kode di lapis ini bisa dibaca siapa saja yang membuka
> "View Source" di browser. **Jangan pernah menaruh kata sandi, kunci API, atau
> alamat database di sini.**

### Lapis 3 — Logika server (berjalan di server saja)

Contoh: `lib/actions/lkps.ts`

Ditandai dengan `"use server"`. Tugasnya: **melakukan perubahan data**, dan
**memeriksa izin** sebelum melakukannya.

> **Aturan penting:** semua pemeriksaan izin harus ada di lapis ini, bukan hanya
> di tampilan. Menyembunyikan tombol di tampilan **bukan** pengamanan — orang
> bisa memanggil fungsi di lapis ini langsung tanpa lewat tombol.

---

## Struktur folder

```
sim-lkps/
│
├── app/                     ← Halaman dan jalur API
│   ├── (auth)/              ← Halaman login (tanpa menu kiri)
│   ├── (dashboard)/         ← Semua halaman setelah login (dengan menu kiri)
│   │   ├── dashboard/       ← Halaman muka
│   │   ├── lkps/            ← 32 tabel LKPS, dikelompokkan per kriteria
│   │   ├── led/             ← 92 bagian narasi LED
│   │   ├── penilaian/       ← Matriks penilaian, 82 butir
│   │   ├── master/          ← Data induk: dosen, mahasiswa, mata kuliah, prodi
│   │   ├── settings/        ← Pengguna dan catatan audit
│   │   ├── evidence/        ← Daftar semua berkas bukti
│   │   ├── laporan/         ← Laporan dan ekspor
│   │   └── developer/       ← Informasi pengembang (lihat catatan di bawah)
│   └── api/                 ← Jalur API langsung (ekspor, notifikasi, kesehatan)
│
├── components/              ← Komponen tampilan yang dipakai ulang
│   ├── layout/              ← Menu kiri, header atas, tombol mode gelap
│   ├── tables/              ← 36 berkas komponen tabel LKPS
│   ├── led/                 ← Editor narasi, kartu progres, daftar bukti
│   ├── penilaian/           ← Tampilan matriks dan skor
│   ├── shared/              ← Pemilih dosen, kotak pencarian, dan sejenisnya
│   ├── forms/               ← Formulir data induk
│   └── ui/                  ← Tombol, jendela dialog, kotak isian (dasar)
│
├── lib/                     ← Logika yang tidak terlihat di layar
│   ├── actions/             ← Semua fungsi yang mengubah data
│   ├── utils/               ← Izin, format, perhitungan, catatan audit
│   ├── export/              ← Pembuat berkas Word, PDF, Excel
│   ├── validations/         ← Aturan pemeriksaan isian
│   ├── config/              ← Informasi pengembang
│   └── db.ts, auth.ts       ← Sambungan ke database dan penanganan login
│
├── prisma/                  ← Susunan database
│   ├── schema.prisma        ← Definisi semua tabel
│   ├── seed.ts              ← Data awal
│   └── seed-data/           ← Daftar 92 bagian LED dan 82 butir penilaian
│
├── docs/                    ← Dokumen
│   └── handover/            ← DOKUMEN YANG SEDANG KAMU BACA
│
├── tests/                   ← Uji otomatis (Playwright, Vitest)
├── middleware.ts            ← Penjaga pintu: menentukan halaman mana perlu login
├── next.config.ts           ← Pengaturan Next.js, termasuk pengalihan alamat lama
└── docker-compose.yml       ← Database untuk dipakai di komputer sendiri
```

---

## Peta alamat halaman

Alamat di kolom kiri bisa langsung dibuka di browser.

| Alamat | Halaman | Perlu login |
|---|---|---|
| `/login` | Masuk | tidak |
| `/dashboard` | Halaman muka | ya |
| `/lkps/kriteria-1` … `/lkps/kriteria-6` | Daftar tabel per kriteria | ya |
| `/lkps/kriteria-N/tabel-<kode>` | Satu tabel LKPS | ya |
| `/led` | Ringkasan semua bagian LED | ya |
| `/led/bab-1`, `/led/bab-2`, `/led/bab-3` | Bagian narasi per BAB | ya |
| `/led/export` | Unduh dokumen LED (Word / PDF) | ya |
| `/penilaian` | Dasbor matriks penilaian | ya |
| `/penilaian/kriteria/C1` … `C6` | Butir per kriteria | ya |
| `/penilaian/butir/<kode>` | Satu butir penilaian | ya |
| `/master/dosen`, `/master/mahasiswa`, `/master/mata-kuliah` | Data induk | ya |
| `/settings/users` | Kelola pengguna | ADMIN |
| `/settings/audit-log` | Riwayat perubahan | ADMIN |
| `/developer` | Informasi pengembang | ya |
| `/api/health` | Pemeriksaan status sistem | tidak |

### Catatan soal alamat lama

Dulu kelompok tabel LKPS disebut **"BAB"** (`/lkps/bab-1`). Sekarang disebut
**"Kriteria"** (`/lkps/kriteria-1`), mengikuti istilah instrumen LAM INFOKOM 2.1.

Alamat lama **masih bisa dibuka** — akan dialihkan otomatis ke yang baru.
Pengalihannya diatur di `next.config.ts`. Jangan hapus, karena dokumen atau
tautan lama mungkin masih memakainya.

---

## Tiga modul instrumen

| Modul | Jumlah | Jenis isi | Alamat |
|---|---|---|---|
| **LKPS** | 32 tabel | Angka | `/lkps/kriteria-N` |
| **LED** | 92 bagian | Narasi | `/led` |
| **Matriks Penilaian** | 82 butir | Skor 1–4 | `/penilaian` |

Pembagian ini mengikuti instrumen resmi: **tabel berisi angka masuk ke LKPS,
narasi masuk ke LED.** Dosen penguji pernah menegaskan hal ini, jadi jangan
menaruh narasi di modul LKPS atau sebaliknya.

### Sebaran 32 tabel LKPS

| Kriteria | Nama | Jumlah tabel |
|---|---|---|
| Kriteria 1 | Budaya Mutu | 6 |
| Kriteria 2 | Relevansi Pendidikan | 11 |
| Kriteria 3 | Relevansi Penelitian | 6 |
| Kriteria 4 | Relevansi PkM | 5 |
| Kriteria 5 & 6 | Akuntabilitas & Diferensiasi Misi | 4 |
| **Total** | | **32** |

> **Sumber kebenaran jumlah tabel adalah berkas `prisma/seed.ts`,** bukan
> hitungan langsung di database. Di database uji pernah ada satu baris nyasar
> yang membuat hitungannya jadi 33. Kalau ada yang bertanya, jawabannya **32**.

### Cara penilaian dihitung

```
Nilai akhir = Σ (skor butir × bobot butir) ÷ 4

Bobot total semua 82 butir = 400
Setiap butir diberi skor 1 sampai 4
```

| Nilai akhir | Status |
|---|---|
| ≥ 361 | Unggul |
| 301 – 360 | Baik Sekali |
| ≤ 300 | Baik |

Ada butir khusus yang disebut **"penghambat Unggul"** — kalau butir ini belum
memenuhi syarat, status Unggul tidak bisa diraih walaupun nilainya cukup.

---

## Login dan izin

Maskipun aplikasi punya sistem login sendiri (**Auth.js versi 5**), aturannya
sederhana:

1. **middleware.ts** — penjaga pintu pertama. Semua alamat kecuali `/login`
   butuh login. Ini memakai file cookie yang ditandatangani, jadi cepat dan
   tidak perlu menyentuh database.
2. **Tiga peran** — ADMIN, OPERATOR, PIMPINAN. Daftar lengkap izin tiap peran ada
   di `lib/utils/permissions.ts`.
3. **Pemeriksaan sebenarnya terjadi di server** — setiap fungsi yang mengubah
   data memanggil `hasPermission()` sebelum bertindak.

Contoh isi daftar izin:

```typescript
ADMIN:    "user.*"            → boleh semuanya soal pengguna
OPERATOR: "tabel_lkps.update" → boleh mengubah isi tabel LKPS
PIMPINAN: "report.export"     → boleh mengunduh laporan
```

Tanda bintang artinya "apa pun setelahnya".

> **Jebakan yang pernah terjadi:** penulisan izin harus konsisten memakai tanda
> **titik** (`master_data.read`), bukan garis bawah (`master_data_read`). Satu
> perbedaan karakter membuat izin **tidak pernah cocok** — aplikasi tidak
> menampilkan kesalahan apa pun, fiturnya cuma diam-diam mati. Setiap kali
> menambah izin baru, bandingkan definisinya dengan cara pemakaiannya.

---

## Aliran status pengajuan

Tabel LKPS dan bagian LED punya alur persetujuan:

```
   DRAFT ──(operator menekan "Ajukan")──▶ DIAJUKAN
     ▲                                      │
     │                                      ├──(pimpinan setuju)──▶ DISETUJUI
     │                                      │
     └──(ditolak / perlu revisi)────────────┘
```

Hanya ADMIN dan PIMPINAN yang bisa menyetujui. Setiap perpindahan status dicatat
di `ValidationHistory` beserta alasan dan waktunya.

---

## Berkas dan penyimpanan bukti

Pengguna bisa mengunggah berkas bukti (PDF, foto, dokumen) pada tabel LKPS dan
bagian LED, atau menempelkan tautan ke berkas yang sudah ada di tempat lain.

Berkas **tidak** disimpan di dalam database. Yang disimpan di database hanya
catatannya (nama berkas, ukuran, jenis); berkas aslinya ada di penyimpanan
terpisah.

> **Catatan teknis yang membingungkan:** pustaka yang dipakai bernama **MinIO**,
> tapi di server produksi `MINIO_ENDPOINT` diarahkan ke **Cloudflare R2**.
> Jadi "MinIO" itu cuma nama alatnya, tempat penyimpanannya sebenarnya R2.
>
> Ada juga variabel bernama `R2_ACCESS_KEY_ID` dan sejenisnya yang **tidak
> dipakai kode mana pun** — sisa dari rancangan awal. Jangan bingung kalau
> melihatnya.

---

## Halaman yang isinya dibekukan di dalam kode

Halaman **`/developer`** (`app/(dashboard)/developer/page.tsx`) menyimpan
informasi pengembang sebagai teks yang ditulis langsung di dalam berkas, bukan
diambil dari database.

Artinya: kalau jumlah tabel, jumlah peran, atau tautan berubah, halaman ini
**menjadi kedaluwarsa tanpa menampilkan kesalahan apa pun**. Kalau kamu
memperbarui salah satu angka di sana, periksa seluruh isi halaman itu sekaligus.

Halaman ini juga yang menampilkan identitas pengembang kepada pihak kampus —
itulah alasan dokumen serah terima ini dibuat.

---

## Uji otomatis

Ada 3 jenis pemeriksaan, jalankan berurutan sebelum menaikkan perubahan:

```bash
# 1. Penulisan tipe data — menangkap banyak salah ketik
pnpm type-check

# 2. Gaya kode — pakai ini, JANGAN pakai `pnpm lint`
npx eslint components/ app/

# 3. Uji otomatis
npx vitest run                                    # cepat, ±1 detik
npx playwright test --config=tests/playwright.config.ts   # lama, ±6 menit
```

Hasil acuan saat dokumen ini ditulis: **79 uji unit lulus**, **79 uji
end-to-end lulus** (1 tidak stabil, 2 dilewati).

> **Uji end-to-end menolak jalan ke database produksi.** Itu pengamanan yang
> disengaja, karena uji ini menghapus data. Jalankan dengan menunjuk database
> uji lokal seperti tertulis di
> [`06-operasi-rutin.md`](./06-operasi-rutin.md).

---

## Yang sengaja tidak dilakukan (dan alasannya)

Dicatat supaya tidak dikira kelalaian:

| Hal | Alasan |
|---|---|
| **33 komponen tabel terpisah**, bukan satu formulir serbaguna | Sudah dicoba dirancang serbaguna, tapi tiap tabel punya kebutuhan berbeda. Memaksakan satu formulir justru bikin rumit. |
| **Pemeriksaan status tidak mengunci pengisian** | Blokir pengisian saat status bukan DRAFT sengaja dimatikan. Kode penandanya masih ada dengan label `VALIDASI DIHAPUS`. Jangan dihidupkan tanpa membicarakannya dulu. |
| **Folder migrasi database tidak ada** | Perubahan susunan tabel dilakukan dengan `prisma db push`, bukan sistem migrasi bertahap. Konsekuensinya ada di [`04-basis-data.md`](./04-basis-data.md) — penting dibaca sebelum mengubah tabel. |
| **Ada dua berkas dokumentasi lama** (`docs/roadmap.md`, `docs/requirements.md`) | Masih memakai istilah BAN-PT lama dan menyebut 31 tabel. Sudah ditandai kedaluwarsa; jangan dijadikan acuan. |
