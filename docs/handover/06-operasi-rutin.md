# Operasi Rutin dan Penanganan Gangguan

Panduan untuk menjaga aplikasi tetap sehat, dan apa yang harus dilakukan saat
ada masalah.

---

# Bagian 1 — Rutinitas

## Harian

Tidak ada yang wajib dilakukan. Aplikasi berjalan sendiri.

Sesekali periksa: buka **https://lkps.zegika.com/api/health** — kalau
membalas `{"status":"ok"}`, sistem sehat.

## Mingguan

- Buka **Pengaturan → Audit Log**, lihat sekilas apakah ada aktivitas tidak wajar
- Periksa email pemberitahuan dari Vercel dan Neon (peringatan tagihan, kuota)
- Pastikan tidak ada pengguna yang seharusnya sudah tidak aktif tapi masih aktif

## Bulanan

- **Cadangkan database** (lihat bagian 2)
- Periksa berapa besar pemakaian database dan penyimpanan berkas
- Perbarui catatan: siapa saja yang punya hak ADMIN

## Setiap 6 bulan

- Ganti kata sandi akun ADMIN
- Periksa apakah masih ada akun mantan staf yang belum dinonaktifkan
- Periksa apakah ada pembaruan keamanan untuk pustaka yang dipakai

## Sebelum setiap perubahan besar

Wajib, tanpa kecuali:

1. Cadangkan database
2. Kerjakan di komputer sendiri dulu
3. Jalankan `pnpm type-check`, `npx eslint components/ app/`, dan `npx vitest run`
4. Baru naikkan ke server

---

# Bagian 2 — Pencadangan

## Kenapa ini penting

Kalau database terhapus tanpa cadangan, **semua data akreditasi hilang**.
Neon punya cadangan otomatis, tapi **jangan bergantung hanya pada itu** — itu
perlindungan terhadap kerusakan mesin, bukan terhadap kesalahan manusia.

## Cadangan lengkap database

```bash
docker exec sim-lkps-db pg_dump -U postgres -d sim_lkps > cadangan-$(date +%F).sql
```

Akan terbentuk berkas seperti `cadangan-2026-09-20.sql`.

**Simpan di minimal dua tempat berbeda** — misalnya komputer kerja dan Google
Drive kampus. Berkas cadangan di satu tempat saja bukan cadangan.

## Cadangan lewat aplikasi (lebih mudah dibuka)

Masuk sebagai ADMIN → **Laporan** → unduh Excel. Hasilnya bisa langsung dibuka
di Excel, cocok untuk keperluan administrasi.

Untuk data induk, unduh dari masing-masing halaman di menu **Master Data**.

## Membuat cadangan otomatis harian

Bisa dijadwalkan dengan `cron` di server Linux. Contoh (berjalan tiap hari
pukul 2 pagi, disimpan 30 hari terakhir):

```bash
0 2 * * * docker exec sim-lkps-db pg_dump -U postgres -d sim_lkps \
  | gzip > /simpanan/cadangan-$(date +\%F).sql.gz && \
  find /simpanan -name "cadangan-*.sql.gz" -mtime +30 -delete
```

> Karena aplikasi berjalan di Vercel (bukan server sendiri), pencadangan
> terjadwal sebaiknya dijalankan dari **komputer kantor** atau server kampus
> yang menyala terus.

## Mengembalikan dari cadangan

> ⚠️ **Ini menimpa seluruh data yang ada sekarang.** Pastikan benar-benar
> diperlukan, dan pastikan berkas cadangannya benar.

```bash
# 1. Amankan dulu data yang sekarang, supaya bisa kembali kalau salah
docker exec sim-lkps-db pg_dump -U postgres -d sim_lkps > sebelum-pulih-$(date +%F-%H%M).sql

# 2. Pulihkan
docker exec -i sim-lkps-db psql -U postgres -d sim_lkps < cadangan-2026-09-20.sql

# 3. Periksa hasilnya
curl https://lkps.zegika.com/api/health
```

Setelah memulihkan, **buka aplikasi dan periksa beberapa halaman** untuk
memastikan datanya masuk dengan benar.

---

# Bagian 3 — Menaikkan perubahan ke server

## Alur normal

```bash
# 1. Pastikan semua sudah diuji di komputer sendiri
pnpm type-check
npx eslint components/ app/
npx vitest run

# 2. Simpan perubahan
git add -A
git commit -m "perbaikan: jelaskan singkat apa yang diubah"

# 3. Naikkan
git push origin main
```

Setelah `git push`, server otomatis membangun ulang aplikasi dalam **2–3 menit**.

## Memantau apakah berhasil

Buka https://vercel.com → pilih proyek **sim-lkps** → tab **Deployments**.
Deployment teratas harus berubah menjadi **Ready** (titik hijau).

Kalau berwarna merah (**Error**), klik deployment itu dan lihat bagian bawah
log-nya — di situ tertulis penyebabnya.

## Kalau gagal di server padahal berhasil di komputer

Penyebab paling sering: **versi pemeriksa kode di server berbeda dengan di
komputer**. Kode yang lolos di satu tempat bisa gagal di tempat lain.

Selalu jalankan ini sebelum `git push`:

```bash
npx eslint components/ app/
```

> **Jangan pakai `pnpm lint`.** Perintah itu hanya memeriksa folder `app/` dan
> **selalu melaporkan berhasil** apa pun yang terjadi — jadi tidak berguna
> sebagai pemeriksaan sebelum naik.

## Membatalkan perubahan yang sudah naik

```bash
git log --oneline -5        # lihat 5 perubahan terakhir, catat kodenya
git revert <kode>           # batalkan satu perubahan
git push origin main
```

> `git revert` membuat **perubahan baru yang membatalkan** perubahan lama.
> Riwayatnya tetap utuh — jauh lebih aman daripada menghapus dengan paksa.

---

# Bagian 4 — Penanganan gangguan

## Gejala: aplikasi tidak bisa dibuka (halaman putih / galat)

**Periksa berurutan:**

1. Buka https://vercel.com → proyek **sim-lkps** → **Deployments**
2. Kalau deployment teratas berwarna merah → lihat log-nya
3. Kalau deployment hijau tapi aplikasi tetap tidak bisa dibuka, periksa domain:
   https://lkps.zegika.com/api/health

## Gejala: "Gagal Memuat Halaman"

Perhatikan **kalimat setelah tanda titik dua** — di situ disebutkan sebabnya.

| Tulisan yang muncul | Artinya | Yang dilakukan |
|---|---|---|
| `does not exist` | Ada tabel database yang belum dibuat | `pnpm prisma db push` |
| `Can't reach database server` | Database tidak bisa dihubungi | Periksa status Neon |
| `Invalid ... invocation` | Susunan tabel dan kode tidak cocok | Perlu programmer |

## Gejala: tidak bisa login, sandi benar

Periksa berurutan:

1. Apakah `AUTH_SECRET` dan `NEXTAUTH_SECRET` berisi **nilai yang sama persis**?
2. Apakah `AUTH_URL` menunjuk alamat yang benar?
3. Apakah akun pengguna masih aktif? (**Pengaturan → Pengguna**)
4. Apakah alamat database (`DATABASE_URL`) masih benar?

Kalau semua benar tapi tetap gagal, **hapus folder `.next` lalu nyalakan ulang**:

```bash
rm -rf .next
pnpm dev
```

> Gejala ini pernah menipu: halaman login tampak normal, tapi login selalu
> gagal. Penyebabnya bukan urusan login sama sekali — pohon build-nya rusak.

## Gejala: halaman kosong padahal aplikasi jalan

Alat komunikasi ke database belum dibuat:

```bash
pnpm prisma generate
```

Lalu **matikan dan nyalakan ulang** server.

## Gejala: data tidak muncul di aplikasi padahal ada di database

Periksa **tahun akademik yang aktif**. Kalau yang aktif bukan tahun yang
dimaksud, aplikasi akan terlihat kosong padahal datanya ada.

**Master Data → Tahun Akademik** → pastikan hanya satu yang aktif.

## Gejala: aplikasi lambat

1. Periksa ukuran database — makin besar, makin lambat untuk laporan
2. Periksa berapa pengguna yang membuka bersamaan
3. Kalau hanya satu halaman yang lambat, laporkan halaman mana

## Gejala: berkas bukti tidak bisa dibuka

1. Periksa apakah berkasnya masih ada di penyimpanan (Cloudflare R2)
2. Periksa apakah `MINIO_ENDPOINT` masih benar
3. Tautan unduhan **kedaluwarsa setelah 1 jam** — coba muat ulang halaman

## Gejala: nomor tabel LKPS tidak 32

Jangan buru-buru mengira ada yang rusak. Hitung dari sumber yang benar:

```bash
grep -c "kode:" prisma/seed.ts
```

**Sumber kebenaran jumlah tabel adalah `prisma/seed.ts`.** Hitungan langsung di
database pernah menunjukkan 33 karena ada satu baris nyasar — itu bukan bagian
dari instrumen.

## Gejala: total bobot penilaian tidak 400

Proses pengisian data butir penilaian akan **gagal dengan sengaja** kalau total
bobot bukan 400. Itu pengamanan, bukan kerusakan.

Periksa berkas `prisma/seed-data/butir-penilaian.json`. Total semua nilai
`bobot` harus tepat **400**. Untuk memeriksa tanpa mengubah apa pun:

```bash
node -e "
const b = require('./prisma/seed-data/butir-penilaian.json');
const t = b.reduce((s,x) => s + x.bobot, 0);
console.log('jumlah butir:', b.length, '| total bobot:', t);
console.log('seharusnya: 82 butir, total 400');
"
```

---

# Bagian 5 — Menjalankan uji otomatis

## Uji cepat (sekitar 1 detik)

```bash
npx vitest run
```

Harusnya: **79 uji lulus**.

## Uji tipe data

```bash
pnpm type-check
```

Harusnya: tidak ada keluaran apa pun. Kalau ada tulisan, berarti ada kesalahan
penulisan di kode.

## Uji pemeriksaan kode

```bash
npx eslint components/ app/
```

Harusnya: **0 kesalahan**.

## Uji menyeluruh (sekitar 6 menit)

> ⚠️ **Uji ini menghapus data di database yang ditunjuk.** Karena itu ada
> pengamanan yang menolaknya kalau menunjuk database produksi. **Jangan hapus
> pengamanan itu.**

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sim_lkps_uji" \
  npx playwright test --config=tests/playwright.config.ts
```

Harusnya: **79 lulus**, 1 mungkin tidak stabil, 2 dilewati.

Perlu diketahui: `sim_lkps_uji` adalah **database uji terpisah**, bukan database
aplikasi. Pastikan sudah dibuat:

```bash
docker exec sim-lkps-db psql -U postgres -c "CREATE DATABASE sim_lkps_uji;"
docker exec sim-lkps-db psql -U postgres -d sim_lkps_uji -c "\dt"
```

> **Catatan:** uji ini membutuhkan **tempat penyimpanan data terpisah** dan
> **chromium/Chrome terpasang** di komputer. Kalau gagal memulai browser,
> periksa apakah Chrome sudah ada.

---

# Bagian 6 — Daftar periksa serah terima

Gunakan daftar ini saat menyerahkan sistem ke pihak lain.

## Kode dan dokumentasi

- [ ] Akses repositori GitHub sudah dimiliki kampus
- [ ] Dokumen serah terima ini sudah dibaca dan sudah bisa diakses dari repositori
- [ ] Salinan cetak dokumen utama disimpan di prodi

## Akun dan kepemilikan

- [ ] Vercel dipindahkan ke email institusi
- [ ] Neon dipindahkan ke email institusi
- [ ] Cloudflare dipindahkan ke email institusi
- [ ] Kelima nilai rahasia (`DATABASE_URL`, `AUTH_SECRET`, `MINIO_ACCESS_KEY`,
      `MINIO_SECRET_KEY`, `MINIO_ENDPOINT`) **bisa dibaca akun kampus**
- [ ] Semua nilai rahasia tersimpan di pengelola kata sandi institusi
- [ ] Sudah diuji: orang kampus bisa melakukan **Redeploy** sendiri

## Keamanan

- [ ] Ketiga sandi akun bawaan sudah diganti
- [ ] Akun bawaan yang tidak dipakai sudah dihapus
- [ ] Setiap pengguna punya akun sendiri (tidak ada akun berbagi)
- [ ] Akun yang sudah tidak aktif sudah dinonaktifkan
- [ ] Hak ADMIN dipegang maksimal 3 orang

## Data

- [ ] Cadangan database sudah dibuat dan disimpan di dua tempat
- [ ] Cadangan sudah **diuji dipulihkan** (jangan tunggu sampai darurat)
- [ ] Data induk sudah lengkap (dosen, mahasiswa, mata kuliah)
- [ ] Tahun akademik yang aktif sudah benar

## Pengetahuan

- [ ] Staf TI sudah mencoba menjalankan aplikasi di komputer sendiri
- [ ] Staf TI sudah mencoba satu perubahan kecil dari daftar di `03-ubah-fitur-ini.md`
- [ ] Staf TI tahu ke mana harus bertanya kalau ada masalah
- [ ] Kontak pengembang tercatat di halaman `/developer` pada aplikasi

## Administratif

- [ ] Berita acara serah terima ditandatangani
- [ ] Dokumen ini diberi tanggal dan ditandatangani
- [ ] Kontak pengembang untuk keadaan darurat dicatat di prodi

---

# Bagian 7 — Kalau butuh bantuan

## Urutan yang disarankan

1. **Cari di dokumen ini** — sebagian besar masalah sudah pernah terjadi
2. **Buka `referensi/`** — ada penjelasan tiap berkas kode
3. **Lihat catatan perubahan** — mungkin pernah diperbaiki sebelumnya:
   ```bash
   git log --oneline -20
   ```
4. **Baru hubungi pengembang**

## Yang perlu disiapkan sebelum bertanya

Supaya tidak bolak-balik, siapkan:

| Yang perlu disiapkan | Cara mendapatkannya |
|---|---|
| Pesan galat lengkap | Salin persis dari layar, jangan diringkas |
| Halaman mana yang bermasalah | Alamat URL-nya |
| Sejak kapan | Perkiraan waktu |
| Apa yang dilakukan sebelum bermasalah | Langkah-langkahnya |
| Sudah dicoba apa saja | Supaya tidak disarankan hal yang sama |

## Informasi pengembang

Selalu yang terbaru ada di dalam aplikasi: masuk lalu buka menu **Developer**.
