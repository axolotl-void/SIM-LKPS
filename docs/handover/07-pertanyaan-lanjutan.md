# Pertanyaan Teknis yang Sering Muncul

Kumpulan jawaban untuk pertanyaan yang biasanya muncul saat programmer baru
membuka proyek ini. Ditulis dengan asumsi pembaca sudah biasa dengan JavaScript
atau TypeScript tapi belum pernah melihat SIM-LKPS.

---

## Teknologi yang dipakai

| Lapis | Teknologi | Versi |
|---|---|---|
| Kerangka kerja | Next.js (App Router) | 15 |
| Bahasa | TypeScript | 5 |
| Tampilan | React | 19 |
| Gaya | Tailwind CSS | v4 |
| Animasi | Framer Motion | — |
| Basis data | PostgreSQL | 16 |
| Alat basis data | Prisma | 6 |
| Login | Auth.js (NextAuth) | v5 |
| Ikon | Lucide React | — |
| Validasi | Zod | — |
| Ekspor | docx, @react-pdf/renderer, ExcelJS | — |
| Penyimpanan berkas | MinIO SDK (dipakai untuk Cloudflare R2) | — |
| Uji | Vitest + Playwright | — |
| Pemasang paket | pnpm | — |

> **Tailwind v4 tidak punya `tailwind.config`.** Semua token warna dan ukuran
> didefinisikan di blok `@theme` di dalam `app/globals.css`. Ini penting:
> **kelas yang tidak ada di `@theme` tidak menghasilkan CSS apa pun — tanpa
> pesan kesalahan.** Pernah kejadian: kelas `text-3xs` dipakai di 50+ berkas
> padahal tidak pernah ada di tema. Yang benar untuk ukuran mikro di proyek ini
> adalah `text-[10px]`.

---

## Pertanyaan soal struktur

### Kenapa ada 33 komponen tabel yang hampir sama?

Semuanya ada di `components/tables/` — satu berkas `tabel-<kode>-client.tsx` per
tabel (33 berkas dari 36 isi folder; sisanya berkas bersama).

Awalnya memang direncanakan satu formulir serbaguna yang membaca
`kolomDefinitions` dan merender apa saja. Setelah dicoba, tiap tabel ternyata
punya kebutuhan berbeda (kolom gabungan, perhitungan, pemilih dosen,
pengelompokan). Memaksakan satu komponen justru menambah percabangan di dalamnya.

Keputusannya: dibiarkan terpisah. Ini penyimpangan sadar dari prinsip YAGNI
(You Aren't Gonna Need It) dan sudah dicatat di `CLAUDE.md`.

**Kalau mau menyatukan lagi:** hitung dulu berapa banyak cabang yang akan
muncul. Kalau lebih dari lima, jangan.

### Kenapa ada `(auth)` dan `(dashboard)` dalam tanda kurung?

Itu **route group** di Next.js App Router. Tanda kurung berarti **folder ini
tidak muncul di URL**, hanya dipakai untuk mengelompokkan layout.

- `app/(auth)/login/page.tsx` → URL-nya `/login`
- `app/(dashboard)/led/page.tsx` → URL-nya `/led`

Gunanya: `(auth)` punya layout tanpa menu kiri, `(dashboard)` punya layout
dengan menu kiri.

### Kenapa dulu disebut "BAB" sekarang "Kriteria"?

Instrumennya berganti dari BAN-PT lama ke **LAM INFOKOM 2.1**, dan istilahnya
berubah. Yang penting dipahami pembagiannya:

- **Tabel LKPS** → `/lkps/kriteria-N` (dulu `/lkps/bab-N`)
- **Narasi LED** → `/led/bab-1..3` (tetap pakai "bab" karena LED memang
  tersusun sebagai BAB I–III)

Kedua istilah itu sekarang hidup berdampingan dan **itu memang benar** — jangan
diseragamkan.

Alamat lama masih dilayani sebagai pengalihan di `next.config.ts`.

### Di mana logika bisnis diletakkan?

Tiga tempat, sesuai jenisnya:

| Jenis logika | Tempat |
|---|---|
| Mengubah data + periksa izin | `lib/actions/*.ts` |
| Perhitungan murni (nilai, progres, halaman) | `lib/utils/*.ts` |
| Menyusun dokumen ekspor | `lib/export/*.ts` |

Perhitungan murni sengaja dipisah supaya **bisa diuji tanpa database**. Contoh:
`lib/utils/penilaian.ts` bisa diuji langsung.

---

## Pertanyaan soal basis data

### Kenapa tidak ada folder `prisma/migrations/`?

Proyek ini memakai `prisma db push` sejak awal, bukan sistem migrasi bertahap.

**Konsekuensi yang harus dipahami:**

- `db push` menyamakan database dengan `schema.prisma` — apa pun yang tidak
  tertulis di situ **akan dihapus**
- Tidak ada riwayat perubahan susunan tabel
- Rollback tidak otomatis; harus dari cadangan

**Sebelum mengubah `schema.prisma` dan menjalankan `db push` ke produksi:**

```bash
pnpm prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > /tmp/rencana.sql
grep -inE "drop |truncate|delete " /tmp/rencana.sql
```

Kalau perintah `grep` itu menemukan apa pun, **jangan lanjutkan** sebelum tahu
dampaknya.

Untuk jangka panjang, memindahkan proyek ini ke `prisma migrate` adalah
perbaikan yang layak dipertimbangkan.

### Kenapa data baris tabel disimpan sebagai JSON, bukan kolom terpisah?

`TabelLkpsRow.rowData` menyimpan isian dalam bentuk `Json`. Alasannya: tiap dari
32 tabel punya susunan kolom berbeda, dan susunannya berubah mengikuti
instrumen.

Keuntungannya menambah kolom baru tidak perlu mengubah struktur database.
Konsekuensinya data itu tidak bisa dicari atau dijumlahkan langsung lewat SQL
(butuh operator JSON khusus).

### Kenapa nama dosen disimpan sebagai teks, bukan id?

Tabel LKPS tidak punya relasi ke tabel `Dosen`. Nama yang dipilih tersimpan
sebagai teks di `rowData`.

**Akibatnya:**

- Menghapus data dosen **tidak merusak** isian LKPS — sudah terbukti saat
  data master dikosongkan lalu diisi ulang
- Tapi mengganti nama dosen **tidak otomatis** memperbarui isian yang sudah ada

Ini kompromi sadar: tabel LKPS harus tetap bisa diisi meski data dosen belum
lengkap.

### Kenapa jumlah tabel kadang terbaca 33?

Di database uji pernah ada baris nyasar dengan `kode = "6"` bernama "Kesesuaian
Visi dan Misi" yang tidak punya kolom sama sekali — sisa dari penyisipan lama.

**Sumber kebenaran adalah `prisma/seed.ts` → 32 entri.** Hitungan langsung di
database bisa meleset karena baris itu.

---

## Pertanyaan soal tampilan

### Kenapa warna-warnanya abu-abu semua?

Pengguna menolak gradasi ungu/violet. Aturannya sekarang:

- **Modul LED dan Matriks Penilaian** memakai abu-abu netral (`slate-700` sampai
  `slate-900`)
- **Lencana status** tetap berwarna (hijau/amber/biru/merah) — itu membawa
  makna, bukan hiasan
- **Modul LKPS** masih memakai warna per kriteria (biru, cyan, teal, emerald)

### Bagaimana mode gelap bekerja?

Pemicunya kelas `.dark` di elemen `<html>`. Preferensinya disimpan di
`localStorage` dengan kunci `sim-lkps-theme`. Kunjungan pertama mengikuti
pengaturan sistem.

Remap warnanya dilakukan **per kelas** di `app/globals.css` — satu blok panjang
berisi aturan seperti `.dark .bg-white { ... }`.

**Kenapa bukan dengan menukar variabel warna Tailwind?** Karena `--color-white`
dipakai bersama oleh `bg-white` (harus jadi gelap) dan `text-white` (harus tetap
putih). Tidak bisa dibedakan lewat variabel.

**Dua jebakan yang sudah pernah kena:**

1. **Varian hover ikut mati.** `.dark .bg-white` lebih spesifik daripada
   `.hover\:bg-red-50:hover`, jadi varian `hover:`, `focus:`, `focus-visible:`,
   `disabled:`, dan `group-hover:` harus dibuat ulang aturannya.
2. **Warna lewat `style={{}}` tidak ketangkap.** Remap CSS hanya menyentuh kelas.
   Pernah kejadian di `DashboardClient.tsx` — satu warna inline membuat separuh
   halaman tidak ikut gelap.

**Aturan: warna permukaan dan teks selalu lewat kelas, jangan lewat inline style.**

### Kenapa animasi sidebar cuma jalan sekali?

Ada flag **`sudahPernahTampil` tingkat-modul** di `components/layout/sidebar.tsx`
(baris 109). Nilainya dibaca saat menentukan `delay` dan `duration` animasi.

**Kenapa harus di level modul (bukan di dalam komponen)?** Flag ini harus
bertahan melintasi pemasangan-ulang komponen, tapi kembali ke nol saat halaman
dimuat ulang penuh — supaya kesan pertama tetap dianimasikan. Variabel biasa di
dalam komponen akan hilang tiap kali komponen dipasang ulang.

**Latar belakangnya:** dulu sidebar terlihat "menyegarkan diri" setiap kali data
disimpan. Penyebabnya bukan sidebar-nya, tapi `revalidatePath(x, "layout")` —
flag `"layout"` menyuruh Next mengirim ulang seluruh layout dasbor, jadi
`<Sidebar>` ikut dipasang ulang dan animasinya jalan dari awal.

**Perbaikannya ada di `lib/actions/led.ts` baris 68–78** — fungsi `revalidateLed()`
memberi komentar panjang kenapa flag `"layout"` **sengaja tidak dipakai**, dan
hanya memanggil halaman-halaman spesifik.

> ⚠️ **Pekerjaan rumah yang masih tersisa:** di berkas yang sama, baris **283**
> dan **307** (`uploadLedEvidence` dan `deleteLedEvidence`) **masih memakai**
> `revalidatePath("/led", "layout")`. Artinya bug sidebar itu **masih bisa
> muncul** setiap kali pengguna mengunggah atau menghapus berkas bukti.
>
> Perbaikannya: ganti keduanya menjadi halaman spesifik, mengikuti pola
> `revalidateLed()`:
>
> ```typescript
> // sebelum
> revalidatePath("/led", "layout");
> // sesudah — sesuaikan dengan bagian yang berkasnya diubah
> revalidatePath("/led");
> revalidatePath(ruteBagianLed(bagian.kode));
> ```
>
> Sudah dicatat, belum dikerjakan. Risiko kalau tidak dikerjakan: **hanya
> kosmetik** (animasi menu jalan ulang), bukan kehilangan data.

**Aturan tetap untuk repo ini: hindari flag `"layout"` di `revalidatePath`
kecuali benar-benar perlu menyegarkan seluruh layout.**

---

## Pertanyaan soal keamanan

### Bagaimana izin diperiksa?

Fungsi `hasPermission(role, "izin.yang.dicek")` di `lib/utils/permissions.ts`.
Pencocokan wildcard dilakukan lewat awalan yang sama persis, jadi tanda
pemisahnya harus konsisten.

**Berkas itu memakai dua gaya penamaan sekaligus, dan itu memang disengaja:**

| Gaya | Dipakai oleh | Contoh |
|---|---|---|
| **Garis bawah** | Izin domain master data | `master_data.read`, `master_data.*` |
| **Titik** | Izin fitur spesifik | `master.dosen.create`, `led.update`, `report.export` |

Karena `hasPermission` membandingkan awalan secara harfiah, **tanda pemisahnya
harus sama persis** antara definisi dan pemakaian. `master_data.*` **tidak**
akan cocok dengan `master.data.create`.

**Cara memeriksa saat menambah izin baru:**

```bash
# izin apa saja yang benar-benar dipakai kode
grep -rhoE 'hasPermission\([^,]+, *"[^"]+"' app lib | grep -oE '"[^"]+"' | sort -u

# izin apa saja yang didefinisikan
grep -n '"' lib/utils/permissions.ts
```

Bandingkan kedua hasilnya. Kalau ada yang dipakai tapi tidak terdaftar di peran
mana pun, izin itu **selalu ditolak tanpa pesan kesalahan** — karena keduanya
hanya bertipe `string`, pemeriksa tipe tidak bisa menangkapnya.

> **Perhatikan jebakan ini:** `master_data.*` (garis bawah, untuk ADMIN) dan
> `master.dosen.create` (titik, untuk OPERATOR) **dipakai berdampingan dan
> keduanya benar**. Kalau menemukan keduanya, jangan buru-buru menyeragamkan —
> periksa dulu pasangan definisi dan pemakaiannya.
>
> Satu-satunya izin `master.dosen` yang terdaftar untuk OPERATOR adalah
> **`.create`**. OPERATOR tidak punya `master.dosen.update` atau `.delete`, jadi
> dia bisa **menambah** dosen tapi tidak bisa mengubah atau menghapusnya. Ini
> memang rancangan yang berlaku — bukan kekurangan.

### Apakah pemeriksaan izin di tampilan cukup?

**Tidak.** Menyembunyikan tombol hanya kenyamanan. Pengamanan sebenarnya ada di
`lib/actions/*.ts`, karena fungsi itu bisa dipanggil langsung tanpa lewat
tombol.

---

## Pertanyaan soal pengujian

### Kenapa `pnpm lint` tidak berguna?

Isinya:

```json
"lint": "eslint app/ --max-warnings=-1 || true"
```

Hanya memeriksa folder `app/`, dan `|| true` membuatnya **selalu melaporkan
berhasil**. Ini sudah menyebabkan build produksi gagal sementara lokal hijau.

Pakai ini:

```bash
npx eslint components/ app/
```

### Kenapa uji end-to-end menolak jalan?

`tests/global-setup-penilaian.ts` sengaja menolak kalau `DATABASE_URL` bukan
localhost, karena uji ini **menghapus data**. `.env` proyek menunjuk database
produksi, jadi tanpa override uji ini akan menghapus skor sungguhan.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sim_lkps_uji" \
  npx playwright test --config=tests/playwright.config.ts
```

**Jangan hapus pengamanan ini.**

### Kenapa Playwright minta `playwright install`?

Build chromium bawaan Playwright tidak ada di mesin ini. Config-nya sudah
memakai Chrome sistem:

```typescript
use: { ...devices['Desktop Chrome'], channel: 'chrome' }
```

Kalau tetap gagal, pastikan Google Chrome terpasang.

### Ada uji yang tidak stabil

`tests/permissions.spec.ts` kadang gagal dengan "page.goto timeout 15 detik" di
dev server, lalu lulus saat dicoba ulang. Ini sudah lama terjadi dan bukan
regresi kode.

---

## Pertanyaan soal deploy

### Bagaimana alur deploy?

```
git push origin main
   → Vercel mendeteksi
   → menjalankan: prisma generate && next build
   → kalau berhasil, langsung menggantikan versi produksi
```

Tidak ada langkah manual. Pemantauan di Vercel → **Deployments**.

### Kapan perlu `prisma db push` sebelum push?

**Selalu, kalau `schema.prisma` berubah.** Kalau tidak, kode baru akan
menanyakan tabel yang belum ada di produksi dan halaman terkait akan gagal.

Urutan yang benar:

1. `pnpm prisma db push` (ke database produksi)
2. Jalankan seed kalau ada data baru
3. `git push`

### Build gagal di Vercel padahal lolos di lokal

Penyebab paling sering: **versi `eslint-plugin-react-hooks` berbeda.**

Versi 7.x punya dua aturan yang belum ada di versi lama:

| Aturan | Artinya |
|---|---|
| `react-hooks/refs` | Dilarang menulis atau membaca `ref.current` saat render |
| `react-hooks/static-components` | Dilarang membuat komponen di dalam render |

**Cara mengatasinya dengan benar:**

- Untuk `refs`: kalau nilainya dipakai saat render, **angkat jadi `useState`**.
  Kalau hanya dipakai di event handler, pindahkan penulisannya ke dalam
  `useEffect`.
- Untuk `static-components`: pakai `createElement(komponen, props)` alih-alih
  `const Icon = ambilIkon(nama)`. Perlu diketahui: memberi nama variabel huruf
  kapital tetap kena aturannya, **termasuk di komponen terpisah di level modul**.

**Jangan menyelesaikannya dengan mematikan aturannya** — aturan itu menangkap
bug nyata.

### Bagaimana cara memastikan versi lokal dan server sama?

```bash
pnpm install --frozen-lockfile
```

Perintah itu memasang persis versi yang tercatat di `pnpm-lock.yaml`. Vercel
memakai cara ini, jadi menguji dengan cara ini paling mendekati kondisi server.

---

## Pertanyaan soal berkas dan ekspor

### Kenapa namanya MinIO padahal pakai Cloudflare R2?

`lib/minio.ts` memakai pustaka klien MinIO, tapi `MINIO_ENDPOINT` di produksi
diarahkan ke endpoint R2. R2 memang kompatibel dengan protokol S3, jadi pustaka
MinIO bisa dipakai.

**Jadi "MinIO" itu nama alatnya, bukan tempat penyimpanannya.**

Ada juga variabel `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`,
`R2_PUBLIC_URL` yang terpasang di Vercel tapi **tidak dibaca kode mana pun** —
sisa rancangan awal yang tidak jadi dipakai. Aman dibiarkan.

### Kenapa ekspor Word jadi PDF merusak tata letak?

Itu masalah konversi di macOS, bukan masalah aplikasinya. **Buka berkas
`.docx`-nya langsung** — formatnya sudah benar.

### Apa format wajib dokumen LED?

Dari Lampiran 2 instrumen:

- Huruf **Arial** ukuran **11**
- Spasi **1,15**
- Kertas **A4** (11906 × 16838 twip)
- Maksimum **10 halaman**

Semuanya diperiksa oleh uji otomatis di `tests/export-led.spec.ts`. **Kalau
kamu mengubah format, uji itu akan gagal** — dan itu memang tujuannya.

---

## Pekerjaan yang sering diminta, dan di mana

| Permintaan | Berkas | Catatan |
|---|---|---|
| Ganti tautan portofolio pengembang | `app/(dashboard)/developer/page.tsx` | Nilainya ditulis di dalam berkas, bukan dari database |
| Ganti pesan galat | dicari dengan `grep` | Tersebar di berbagai berkas |
| Tambah kolom tabel | `prisma/seed.ts` + komponen client-nya | Lihat `03-ubah-fitur-ini.md` D2 |
| Ubah bobot penilaian | `prisma/seed-data/butir-penilaian.json` | Total harus tetap 400 |
| Ubah jumlah bagian LED | `prisma/seed-data/led-bagian.json` | 92 bagian; jalankan `pnpm tsx prisma/seed-modul-baru.ts` |
| Ubah daftar izin | `lib/utils/permissions.ts` | Uji pakai akun asli peran itu |

---

## Berkas CLAUDE.md dan dokumen lama

**`CLAUDE.md`** di akar repo sudah usang di beberapa bagian (masih menyebut 31
tabel dan pola `bab-X`). Berkas itu berisi instruksi untuk asisten AI, dan
**tidak bisa diperbaiki lewat sesi asisten** — patchnya ditolak dengan alasan
berkas instruksi dilindungi. Perlu disunting manual oleh manusia.

**`docs/roadmap.md`** dan **`docs/requirements.md`** juga sudah kedaluwarsa —
masih memakai istilah BAN-PT lama. Sudah ditandai, tapi jangan dijadikan acuan.

**Yang bisa dijadikan acuan:**

| Pertanyaan | Berkas |
|---|---|
| Ada berapa tabel LKPS? | `prisma/seed.ts` |
| Ada berapa bagian LED? | `prisma/seed-data/led-bagian.json` |
| Ada berapa butir penilaian? | `prisma/seed-data/butir-penilaian.json` |
| Siapa boleh apa? | `lib/utils/permissions.ts` |
| Susunan tabel database | `prisma/schema.prisma` |
