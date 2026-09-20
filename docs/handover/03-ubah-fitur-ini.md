# Mau Ubah Ini? Buka Berkas Ini

Buku resep praktis. Cari pekerjaanmu di daftar, ikuti langkahnya.

**Tanda pada judul:**

- 🟢 **Tanpa programmer** — bisa dikerjakan staf TI
- 🟡 **Butuh sedikit kehati-hatian** — mengubah kode, tapi cuma teks/angka
- 🔴 **BUTUH PROGRAMMER** — mengubah cara kerja sistem

Sebelum mengubah apa pun, **selalu kerjakan di komputer sendiri dulu**
(lihat [`01-cara-menjalankan.md`](./01-cara-menjalankan.md)), pastikan
tampilannya benar, baru naikkan ke server.

**Cara naikkan ke server** (setelah perubahan diuji):

```bash
git add -A
git commit -m "jelaskan singkat apa yang diubah"
git push origin main
```

Setelah `git push`, server akan membangun ulang aplikasi secara otomatis dalam
2–3 menit. Tidak ada langkah tambahan.

---

# A. Teks, nama, dan label

## A1. 🟢 Mengganti nama aplikasi di menu atas

**Berkas:** `components/layout/header.tsx`

Cari tulisan `SIM-LKPS` di dalam berkas itu, ganti dengan nama yang diinginkan.

## A2. 🟡 Mengganti judul dan deskripsi aplikasi di browser

**Berkas:** `app/layout.tsx`

Di situ ada blok `metadata` berisi `title` dan `description`. Ubah nilainya.

> Judul ini yang muncul di tab browser dan di hasil pencarian Google.

## A3. 🟡 Mengganti nama menu di bilah kiri

**Berkas:** `components/layout/sidebar.tsx`

Menu disusun dalam bentuk daftar. Cari tulisan yang ingin diubah, ganti
teksnya. **Jangan ubah bagian `href`** — itu alamat tujuan menu.

## A4. 🟡 Mengganti teks pada halaman tertentu

Gunakan pencarian di seluruh proyek. Dari akar repo:

```bash
grep -rn "teks yang mau dicari" app/ components/
```

Hasilnya menunjukkan berkas dan nomor barisnya. Buka berkas itu di nomor baris
tersebut, ubah teksnya.

Contoh: mencari tulisan "Selamat Datang":

```bash
grep -rn "Selamat Datang" app/ components/
```

> **Tips:** pakai tanda kutip supaya spasi ikut dicari. Kalau hasilnya banyak,
> persempit pencariannya, misalnya hanya di folder `app/dashboard`.

## A5. 🟡 Mengganti kalimat pada kartu tabel LKPS

**Berkas:** `app/(dashboard)/lkps/kriteria-N/page.tsx`

Di setiap berkas itu ada daftar bernama `TABLE_DESCS` yang memuat deskripsi
singkat tiap tabel. Ubah teksnya di situ.

> **Catatan:** deskripsi tabel **tidak** disimpan di database. Kalau kolom
> deskripsi di database kosong, itu normal — memang teksnya ada di berkas ini.

## A6. 🟡 Mengganti pesan galat yang muncul ke pengguna

Cari dulu teksnya:

```bash
grep -rn "Gagal memuat" app/ components/ lib/
```

Ubah teksnya di berkas yang ditemukan.

## A7. 🟡 Mengganti "Versi 0.1.0" yang tampil di halaman

Cari:

```bash
grep -rn "0.1.0" app/ components/ lib/ package.json
```

Ada di beberapa tempat. Ubah semuanya supaya konsisten.

---

# B. Tampilan dan warna

## B1. 🟢 Mengganti logo

**Berkas:** cari tahu dulu logonya dipasang di mana:

```bash
grep -rn "logo\|Logo" components/layout/ app/layout.tsx
```

Berkas gambar biasanya ada di folder `public/`. Ganti berkasnya dengan nama
yang **sama persis**, maka otomatis terpakai.

> Kalau ingin nama berkas baru, ubah juga nama yang tertulis di kode.
> Nama berkas di server peka huruf besar-kecil — `Logo.png` dan `logo.png`
> dianggap dua berkas berbeda.

## B2. 🟡 Mengganti warna aksen

**Berkas:** di mana saja warna itu dipakai. Cari dulu:

```bash
grep -rn "from-slate-700\|bg-slate-800" components/ app/
```

Warna ditulis dalam bentuk kelas Tailwind, contoh: `bg-slate-800`,
`text-blue-600`, `from-emerald-500 to-teal-600`.

| Kelas | Artinya |
|---|---|
| `bg-*` | warna latar |
| `text-*` | warna tulisan |
| `border-*` | warna garis tepi |
| `from-* to-*` | warna gradasi |

Angka di belakang menunjukkan gelap-terangnya: **50 paling terang, 900 paling
gelap**.

> **Aturan proyek ini:** modul LED dan Matriks Penilaian memakai **abu-abu
> netral** (`slate`). Gradasi ungu/violet pernah ditolak pengguna karena
> dianggap norak. Jangan kembalikan warna ungu ke modul itu.
>
> Warna yang **boleh** berwarna: lencana status (hijau/amber/biru/merah). Itu
> membawa makna, bukan hiasan.

## B3. 🔴 Menambah mode gelap ke halaman baru

Mekanisme mode gelap bekerja dengan mengganti warna berdasarkan kelas, di
`app/globals.css`.

> **Jangan memakai `style={{ backgroundColor: "..." }}` di dalam kode.** Warna
> yang ditulis dengan cara itu **tidak ikut berubah** saat mode gelap aktif.
> Selalu pakai kelas Tailwind.

## B4. 🟡 Mengubah urutan atau jumlah kolom pada tampilan

**Berkas:** `components/tables/tabel-<kode>-client.tsx`

Grid kolom diatur dengan `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Ubah
angkanya sesuai kebutuhan (maksimal 12).

---

# C. Data induk (tanpa mengubah kode)

## C1. 🟢 Menambah dosen

Buka aplikasi → **Master Data → Dosen → tombol Tambah**.

Yang perlu disiapkan: nama, NIDN, dan jabatan fungsional.

> **NIDN tidak boleh dikarang.** Kalau NIDN dosen belum ada, **kosongkan atau
> tanyakan ke bagian kepegawaian** — jangan mengisi angka yang kelihatan masuk
> akal. Data ini masuk ke laporan akreditasi dan tidak akan terlihat sebagai
> data palsu oleh sistem.

## C2. 🟢 Mengimpor banyak dosen sekaligus

Paling cepat lewat database langsung. Lihat
[`04-basis-data.md`](./04-basis-data.md), bagian Mengisi Banyak Data.

## C3. 🟢 Mengubah data mahasiswa, mata kuliah, prodi

Sama polanya: **Master Data** di menu kiri → pilih jenis data → Tambah / Ubah.

## C4. 🟢 Mengubah tahun akademik yang aktif

**Master Data → Tahun Akademik**. Pastikan **hanya satu** yang ditandai aktif.

> Tahun akademik yang aktif menentukan data mana yang sedang ditampilkan di
> seluruh aplikasi. Mengubahnya **tidak menghapus** data tahun lain.

## C5. 🟡 Menambah atau mengubah daftar pilihan pada formulir

**Berkas:** `lib/validations/master.ts`

Di situ ada daftar pilihan seperti jenis kelamin, jabatan fungsional, dan
status. Tambahkan pilihan baru di daftar yang sesuai.

---

# D. Tabel LKPS

## D1. 🟡 Mengubah judul atau susunan kolom satu tabel

**Dua tempat harus diubah:**

1. **Susunan kolom** → `prisma/seed.ts`, cari kode tabelnya (contoh `"1.A.1"`),
   ubah bagian `kolomDefinitions`.
2. **Cara menampilkannya** → `components/tables/tabel-<kode>-client.tsx`.

Setelah mengubah `seed.ts`, jalankan:

```bash
pnpm tsx prisma/seed.ts
```

> Perintah itu bersifat **menambah atau memperbarui**, tidak menghapus. Aman
> dijalankan berulang.

## D2. 🟡 Menambah kolom baru ke tabel yang sudah ada datanya

**Berkas:** `prisma/seed.ts` → bagian `kolomDefinitions` → tambahkan entri baru:

```typescript
{ key: "namaKolomBaru", label: "Judul Kolom", type: "text", required: false }
```

Pilihan `type` yang tersedia: `text`, `number`, `textarea`, `date`, `url`,
`select`.

> **Data lama tidak hilang.** Isian kolom baru akan kosong untuk baris yang
> sudah ada — itu wajar, karena isinya disimpan per baris dalam bentuk
> catatan bebas.

## D3. 🔴 Menambah tabel LKPS yang benar-benar baru

Butuh: menambah entri di `prisma/seed.ts`, membuat halaman baru di
`app/(dashboard)/lkps/kriteria-N/tabel-<kode>/page.tsx`, dan membuat komponen
tampilannya di `components/tables/`.

> **Jumlah tabel mengikuti instrumen resmi.** Menambah tabel berarti
> menyimpang dari instrumen LAM INFOKOM 2.1. Pastikan dulu ini memang diminta,
> bukan sekadar keinginan menambah.

## D4. 🟡 Mengubah nama "BAB" menjadi "Kriteria" (atau sebaliknya)

**Berkas:** `components/layout/sidebar.tsx` dan berkas halaman di
`app/(dashboard)/lkps/`.

> **Jangan ubah nama folder** `app/(dashboard)/lkps/kriteria-N`. Mengubah nama
> folder akan mengubah alamat URL dan memutus tautan yang sudah ada. Yang
> diubah **hanya teks yang tampil di layar**.

## D5. 🟡 Mengubah kolom yang memakai daftar dosen

Beberapa tabel punya kolom "Nama DTPR" atau "Nama Ketua" yang berupa daftar
pilihan dosen, bukan kotak ketik biasa.

**Komponennya:** `components/shared/DosenSelect.tsx`

Kalau daftar dosennya kosong, datanya belum diisi — lihat bagian C1.

---

# E. LED (Laporan Evaluasi Diri)

## E1. 🟡 Mengubah judul atau urutan bagian LED

**Berkas:** `prisma/seed-data/led-bagian.json`

Ini berkas daftar **92 bagian** LED. Setiap bagian punya keterangan: kode, BAB,
judul, dan petunjuk pengisian.

Setelah diubah, jalankan:

```bash
pnpm tsx prisma/seed-modul-baru.ts
```

> Perintah itu hanya memperbarui daftar bagiannya. **Narasi yang sudah ditulis
> pengguna tidak terhapus.**

## E2. 🟡 Mengubah petunjuk pengisian pada bagian LED

**Berkas:** `prisma/seed-data/led-bagian.json` → kolom `petunjuk`.

## E3. 🟡 Mengubah batas jumlah karakter dan perkiraan halaman

**Berkas:** `lib/utils/led-progress.ts`

Di situ ada nilai batas karakter per bagian dan cara menghitung perkiraan
halaman.

> Batas resmi Lampiran 2 instrumen LED adalah **10 halaman**. Kira-kira
> setara 20.000 karakter. Jangan menaikkan batas ini tanpa alasan kuat.

## E4. 🔴 Menambah jenis ekspor dokumen baru (mis. format RTF)

**Berkas:** `lib/export/` — pelajari `led-docx.ts` (Word) dan `led-pdf.tsx`
(PDF) sebagai contoh, lalu salin polanya.

## E5. 🟡 Mengubah nama berkas hasil unduhan

**Berkas:** `app/api/export/led/word/route.ts` dan
`app/api/export/led/pdf/route.ts`. Cari bagian yang mengatur nama berkas.

---

# F. Matriks Penilaian

## F1. 🟡 Mengubah bobot butir penilaian

**Berkas:** `prisma/seed-data/butir-penilaian.json`

> ⚠️ **Total semua bobot harus tetap 400.** Kalau tidak, proses pengisian data
> akan **gagal dengan sengaja** (ada pemeriksaan otomatisnya). Itu memang
> disengaja: lebih baik gagal daripada nilai akreditasi salah.

Setelah diubah:

```bash
pnpm tsx prisma/seed-modul-baru.ts
```

## F2. 🟡 Mengubah ambang batas status akreditasi

**Berkas:** `lib/utils/penilaian.ts`

Cari angka `361`, `301`, dan `300`. Ubah sesuai aturan terbaru.

> Ambang batas ini berasal dari instrumen resmi. **Periksa dulu ke dokumen
> LAM INFOKOM** sebelum mengubahnya.

## F3. 🔴 Mengubah rumus perhitungan nilai

**Berkas:** `lib/utils/penilaian.ts`

Rumusnya `Σ(skor × bobot) ÷ 4`. Mengubahnya berarti mengubah hasil penilaian
seluruh program studi — pastikan ini memang sesuai instrumen.

---

# G. Pengguna dan keamanan

## G1. 🟢 Menambah pengguna

Buka aplikasi sebagai ADMIN → **Pengaturan → Pengguna → Tambah**.

## G2. 🟢 Mengganti kata sandi pengguna

**Pengaturan → Pengguna** → pilih pengguna → tombol atur ulang sandi.

## G3. 🟡 Mengubah apa yang boleh dilakukan suatu peran

**Berkas:** `lib/utils/permissions.ts`

Cari nama peran (`ADMIN`, `OPERATOR`, `PIMPINAN`), lalu tambah atau hapus izin
di daftarnya.

> Daftar izin yang tersedia tercantum di berkas yang sama, di bagian atas.
>
> **Jebakan yang pernah terjadi:** penulisan izin harus konsisten memakai
> **titik** (`master_data.read`), bukan garis bawah (`master_data_read`). Satu
> karakter beda membuat izin **tidak pernah cocok** — aplikasi tidak
> menampilkan kesalahan apa pun, fiturnya cuma diam-diam mati.
>
> Setelah mengubah izin, **uji dengan akun asli dari peran itu**, bukan cuma
> melihat kodenya.

## G4. 🟡 Mengubah masa berlaku sesi login

**Berkas:** `lib/auth.ts`. Cari `maxAge`.

## G5. 🔴 Menambah peran baru keempat

Butuh perubahan di: `prisma/schema.prisma` (daftar `Role`),
`lib/utils/permissions.ts`, dan pemeriksaan di seluruh kode. Cari semua tempat
yang menyebut `PIMPINAN` untuk melihat berapa banyak yang harus disesuaikan.

---

# H. Menu dan halaman

## H1. 🟡 Menyembunyikan menu dari peran tertentu

**Berkas:** `components/layout/sidebar.tsx`

Menu disusun dengan keterangan peran yang boleh melihatnya. Tambahkan peran yang
diizinkan, atau kosongkan supaya semua bisa.

> **Tapi ingat:** menyembunyikan menu **bukan** pengamanan. Kalau orang tahu
> alamatnya, dia masih bisa membukanya. Pengamanan sebenarnya ada di
> `lib/utils/permissions.ts`.

## H2. 🟡 Mengubah urutan menu di bilah kiri

**Berkas:** `components/layout/sidebar.tsx`. Susun ulang urutan entrinya.

## H3. 🟡 Mengubah tampilan halaman muka (dasbor)

**Berkas:** `app/(dashboard)/dashboard/page.tsx` dan berkas pendampingnya di
folder yang sama (`SummaryCard.tsx`, `ActivityCard.tsx`, dan seterusnya).

## H4. 🟡 Mengubah isi halaman `/developer`

**Berkas:** `app/(dashboard)/developer/page.tsx`

> **Perhatian:** halaman ini isinya **ditulis langsung di dalam berkas**, bukan
> dari database. Kalau kamu memperbarui satu hal di situ (misalnya jumlah
> tabel), **periksa seluruh isi halaman itu sekaligus** — angka lainnya mungkin
> sudah kedaluwarsa juga.

---

# I. Ekspor dan laporan

## I1. 🟡 Mengubah isi dokumen LED yang diekspor

**Berkas:** `lib/export/led-dokumen.ts` — menyusun isi dokumen (judul, bagian,
urutan).
**Berkas:** `lib/export/led-docx.ts` — mengatur format Word.
**Berkas:** `lib/export/led-pdf.tsx` — mengatur format PDF.

> Format wajib Lampiran 2: **Arial ukuran 11, spasi 1,15, kertas A4**. Jangan
> ubah tanpa membuka dokumen instrumennya.

## I2. 🟡 Mengubah isi ekspor Excel

**Berkas:** `lib/export/excel.ts`

## I3. 🔴 Menambah jenis laporan baru ke menu

**Berkas:** `app/(dashboard)/laporan/page.tsx` dan `app/api/export/`.

---

# J. Pemeliharaan rutin

## J1. 🟢 Mencadangkan data sebelum perubahan besar

Lihat [`06-operasi-rutin.md`](./06-operasi-rutin.md).

## J2. 🟢 Mengosongkan data untuk mulai dari nol

> ⚠️ **Ini menghapus data sungguhan.** Pastikan sudah mencadangkan dulu.

## J3. 🟢 Menjalankan uji otomatis sebelum naik ke server

```bash
pnpm type-check
npx eslint components/ app/
npx vitest run
```

## J4. 🔴 Memperbarui versi Next.js atau pustaka lain

```bash
pnpm outdated          # lihat mana yang tertinggal
pnpm update            # perbarui versi yang aman
```

> **Kerjakan satu paket per satu perubahan, dan uji setelah masing-masing.**
> Memperbarui semuanya sekaligus akan sangat sulit dilacak kalau ada yang rusak.
>
> **Peringatan khusus ESLint:** aturan pemeriksaan kode berubah antar versi.
> Versi di komputer pengembang bisa berbeda dengan versi di server, dan
> **kode yang lolos di komputer bisa gagal dibangun di server**. Ini sudah
> pernah terjadi dan sempat membuat aplikasi gagal naik. Selalu jalankan
> `npx eslint components/ app/` sebelum `git push`.

---

# K. Kalau ada yang rusak

## K1. 🟢 Aplikasi tidak bisa dibuka sama sekali

Lihat [`06-operasi-rutin.md`](./06-operasi-rutin.md), bagian Penanganan Gangguan.

## K2. 🟢 Muncul tulisan "Gagal Memuat Halaman"

1. Perhatikan **kalimat setelah titik dua** — di situ disebutkan penyebabnya.
2. Kalau ada tulisan `does not exist`, berarti ada tabel database yang belum
   dibuat. Jalankan:
   ```bash
   pnpm prisma db push
   ```
3. Kalau tertulis `Can't reach database server`, database sedang tidak bisa
   dihubungi — periksa status layanannya.

## K3. 🟢 Data yang salah isi

**Jangan** memperbaiki langsung di database kalau bisa lewat aplikasi.
Perbaikan lewat database **tidak tercatat** di riwayat audit.

## K4. 🟢 Semua halaman lambat

1. Periksa berapa pengguna yang sedang membuka bersamaan
2. Periksa ukuran database (makin besar, makin lambat untuk laporan)
3. Kalau perlu, tinggalkan jejak di halaman
   [status layanan Vercel]

## K5. 🔴 Halaman tertentu berhenti berfungsi setelah perubahan

**Kembalikan dulu ke keadaan sebelumnya**, baru cari penyebabnya:

```bash
git log --oneline -5              # lihat 5 perubahan terakhir
git revert <kode-perubahan>       # batalkan perubahan tertentu
```

Cara itu membuat perubahan pembatalan yang tercatat rapi — lebih baik daripada
memperbaiki manual sambil menebak.

---

# Lampiran: mencari sesuatu di seluruh kode

Perintah ini adalah alat paling berguna saat mencari "kode ini di mana":

```bash
# Mencari teks di seluruh berkas kode
grep -rn "teks yang dicari" app/ components/ lib/

# Mencari nama berkas
find . -name "*dosen*" -not -path "./node_modules/*"

# Mencari teks hanya di jenis berkas tertentu
grep -rn "Gagal" --include="*.tsx" components/

# Melihat 5 perubahan terakhir yang tercatat
git log --oneline -5

# Melihat apa saja yang berubah tapi belum disimpan
git status

# Melihat rincian perubahan yang belum disimpan
git diff
```

Nama fungsi yang sering dicari:

| Mencari apa | Cari kata kunci |
|---|---|
| Cara data disimpan ke database | `create`, `update`, `upsert`, `delete` |
| Pemeriksaan izin | `hasPermission` |
| Catatan audit | `createAuditLog` |
| Aturan pemeriksaan isian | `zod`, `schema` |
| Penyegaran tampilan setelah data berubah | `revalidate` |

> **Cara paling cepat untuk pekerjaan umum:** buka folder `referensi/` di
> dokumen ini. Di situ ada satu halaman untuk setiap berkas kode, berisi
> maksudnya, isi yang bisa dipakai berkas lain, dan **berkas mana saja yang
> ikut terdampak** kalau diubah.
