# RANCANGAN README.md SIM-LKPS

**Target:** `README.md` di root repo, **> 10.000 baris** (minimal 10.001).
**Fokus:** penjelasan lengkap proyek — struktur, bahasa, file, kode.
**Dikecualikan:** sandi, kredensial, dan keamanan (permintaan eksplisit Yogi).

---

## 1. Diagnosis README sekarang

`README.md` saat ini **232 baris**. Masalah yang ditemukan:

| Masalah | Bukti |
|---|---|
| Menyebut **31 tabel** di banner & project structure | baris 8, 95, 104 — padahal instrumen sekarang 32 |
| Masih ada role **Validator** | baris 172, 207–215 — role sudah 3 (ADMIN/OPERATOR/PIMPINAN) |
| Pakai **`npm`** di Quick Start | baris 133, 148, 154 — repo pakai `pnpm` |
| Storage tertukar | baris 80 "Cloudflare R2 (production), MinIO (dev)" — kode pakai MinIO SDK ke R2 |
| Menyebut **shadcn/ui** | baris 81, 105 — `components/ui/` cuma 1 berkas |
| Project structure menyebut 13 models | baris 112 — sekarang **23 model** |
| **Membocorkan demo credentials** | baris 168–173 — harus DIHAPUS sesuai instruksi |
| Tidak ada penjelasan per-file | inti permintaan, sama sekali belum ada |

---

## 2. Bahan mentah yang tersedia (sudah dihitung dari repo)

| Bahan | Jumlah | Sumber |
|---|---|---|
| Model Prisma | **23** | `prisma/schema.prisma` |
| Kolom Prisma | **253** | idem |
| Enum | **7** (Role 3, TabelStatus 5, ValidationAction 4, NotificationType 4, LedJenis 4, LedStatus 5, JenisPenilaian 3) | idem |
| Halaman (`page.tsx`) | **73** | `app/` |
| API route | **9** | `app/**/route.ts` |
| Layout / loading / error | 4 / 7 / 4 | `app/` |
| Komponen | **68** (tables 36, led 11, layout 6, shared 5, forms 4, penilaian 4, ui 1) | `components/` |
| Berkas lib | **37** (actions 9, utils 13, export 7, validations 2, config 1, types 1, akar 4) | `lib/` |
| Bagian LED | **92** (BAB I 3, BAB II 88, BAB III 1) | `prisma/seed-data/led-bagian.json` |
| Butir penilaian | **82**, bobot total **400** | `prisma/seed-data/butir-penilaian.json` |
| Tabel LKPS | **32** | `prisma/seed.ts` |
| Baris kode total | ~53.000 (app 15.502, components 18.631, lib 6.464, prisma 698, tests 2.005, scripts 263) | dihitung langsung |

---

## 3. Struktur bab & estimasi baris

Total target: **~11.300 baris**. Setiap bab punya sumber data nyata, jadi tidak ada karangan.

| # | Bab | Isi | Est. baris |
|---|---|---|---|
| 1 | Header & navigasi | Banner, badges, daftar isi lengkap dengan tautan | 250 |
| 2 | Pengenalan | Apa itu LKPS/LED, konteks akreditasi LAM INFOKOM 2.1, masalah yang diselesaikan, tujuan | 400 |
| 3 | Ikhtisar sistem | Fitur per modul, angka-angka penting, alur pemakaian | 450 |
| 4 | Arsitektur | Diagram berlapis, alur request, keputusan arsitektur + alasannya | 700 |
| 5 | Tech stack | Per pustaka: versi, alasan dipakai, di mana dipakai, alternatif yang ditolak | 600 |
| 6 | Struktur folder | Setiap folder + berkas penting, dengan pohon lengkap | 800 |
| 7 | **Skema basis data** | **23 model × (tabel 253 kolom + relasi + contoh query)** | 2.400 |
| 8 | **Referensi halaman** | **73 halaman × (rute, berkas, data, alur, komponen)** | 2.200 |
| 9 | **API & Server Actions** | 9 route + 9 berkas actions, tiap fungsi dijelaskan | 1.100 |
| 10 | **Komponen** | 68 komponen, dikelompokkan, dengan props & contoh pakai | 900 |
| 11 | **Modul LED** | 92 bagian dijelaskan + struktur BAB + format ekspor | 700 |
| 12 | **Matriks Penilaian** | Rumus, 82 butir per kriteria, tahap PPEPP, predikat | 700 |
| 13 | Pustaka internal (`lib/`) | 37 berkas: util, ekspor, validasi | 800 |
| 14 | Panduan pengembangan | Setup, perintah, konvensi kode, alur kontribusi | 550 |
| 15 | Pengujian | 79 unit + suite E2E, cara menjalankan, apa yang ditutup | 450 |
| 16 | Deploy & operasi | Alur deploy, urutan DB, pemantauan, penanganan gangguan | 500 |
| 17 | Pemecahan masalah | Gejala → sebab → solusi (dari pengalaman nyata) | 600 |
| 18 | Konvensi & aturan tetap | Aturan yang tidak boleh dilanggar + alasannya | 400 |
| 19 | Utang teknis & rencana | Yang belum beres, disertai rujukan berkas & baris | 350 |
| 20 | Indeks lengkap | Tabel semua 250+ berkas → tautan bab yang menjelaskannya | 550 |
| | **TOTAL** | | **~14.000** |

Sengaja dilebihkan dari 10.000 supaya aman kalau ada bab yang lebih pendek dari perkiraan.

---

## 4. Cara menghasilkan

**Prinsip: tulisan tangan untuk bagian yang butuh penjelasan, di-generate untuk yang butuh kelengkapan.**

Sama seperti `docs/handover/` yang sudah terbukti:

1. **Bagian naratif** (bab 2–6, 14–19) — ditulis tangan, bahasa Indonesia, sesuai gaya yang sudah dipakai di `docs/handover/`.
2. **Bagian berulang** (bab 7–13, 20) — di-generate dari kode asli lewat skrip Node, jadi:
   - Selalu akurat (nama kolom, rute, props diambil dari sumbernya)
   - Bisa di-generate ulang kalau kode berubah
   - Tidak ada berkas yang terlewat

3. Skrip generator: `scripts/generate-readme.mjs`
   - Membaca `prisma/schema.prisma` → bab 7
   - Membaca `app/**/page.tsx` + `route.ts` → bab 8–9
   - Membaca `components/**` → bab 10
   - Membaca JSON seed → bab 11–12
   - Membaca `lib/**` → bab 13
   - Menyusun indeks berkas → bab 20
   - Menggabung dengan teks naratif dari `docs/readme-src/*.md`

---

## 5. Verifikasi (bukti, bukan klaim)

Setelah generate:

```bash
wc -l README.md                    # harus > 10000
grep -c '^#' README.md             # jumlah judul
```

Ditambah pemeriksaan isi:

- [ ] Tidak ada kata sandi/kredensial di seluruh berkas
- [ ] Jumlah model yang dijelaskan = 23 (cocok dengan schema)
- [ ] Jumlah halaman yang dijelaskan = 73 (cocok dengan `find app -name page.tsx`)
- [ ] Jumlah butir penilaian = 82, bobot 400
- [ ] Jumlah bagian LED = 92
- [ ] Semua tautan internal (`#anchor`) mengarah ke judul yang ada
- [ ] Angka "32 tabel" konsisten, tidak ada sisa "31"

---

## 6. Yang TIDAK dikerjakan

Sesuai instruksi "jangan kerjakan yang lain, fokus ini saja":

- Tidak mengubah kode aplikasi
- Tidak menyentuh `docs/handover/` (sudah selesai)
- Tidak memperbaiki temuan di bagian 1 selain yang masuk README
- Tidak menambah uji
- Tidak menyentuh keamanan/sandi (justru dihapus dari README)

---

## 7. Risiko

| Risiko | Penanganan |
|---|---|
| README 10.000 baris berat dibuka di GitHub | Tetap satu berkas sesuai permintaan; daftar isi di atas supaya mudah dilompati |
| Isi berulang jadi sampah | Tiap baris punya sumber data nyata; tidak ada kalimat pengisi |
| Angka basi lagi setelah kode berubah | Ada skrip generator, tinggal jalankan ulang |
| Bab ter-generate terasa kaku | Ditambah konteks "kenapa" yang ditulis tangan di bagian pembuka tiap bab |
