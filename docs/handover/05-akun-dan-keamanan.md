# Akun, Peran, dan Keamanan

Dokumen ini menjelaskan siapa yang boleh masuk, apa yang boleh mereka lakukan,
dan **bagian paling penting untuk kampus**: memindahkan kepemilikan sistem dari
pengembang ke universitas.

---

# Bagian 1 — Tiga peran pengguna

| Peran | Bahasa manusia | Boleh apa |
|---|---|---|
| **ADMIN** | Administrator sistem | Semuanya, termasuk mengelola pengguna dan memfinalkan penilaian |
| **OPERATOR** | Staf pengisi data | Mengisi tabel, menulis narasi, mengajukan validasi, mengunggah bukti |
| **PIMPINAN** | Pimpinan prodi | Melihat semua, menyetujui, memvalidasi, mengunduh laporan |

Aturan lengkapnya ada di `lib/utils/permissions.ts` — satu berkas, mudah dibaca.

## Rincian izin per peran

**ADMIN** (`user.*`, `master_data.*`, `tabel_lkps.*`, `led.*`, `penilaian.*`,
`settings.*`, `report.*`, `audit_log.read`, `penilaian.finalisasi`)

Semua izin. Satu-satunya peran yang boleh memfinalkan penilaian.

**OPERATOR** (`tabel_lkps.read/create/update/submit/validate/comment`,
`evidence.create/read`, `led.read/create/update/submit`,
`penilaian.read/create/update`, `master_data.read`, `master.dosen.create`)

Tidak boleh: mengelola pengguna, memfinalkan penilaian, mengubah peran.

**PIMPINAN** (`dashboard.read`, `tabel_lkps.read`, `report.read`, `report.export`,
`master_data.read`, `led.read`, `penilaian.read`)

**Hanya membaca.** Satu-satunya hal istimewa: boleh **mengunduh laporan**, dan
itu memang tujuan peran ini.

> **Menyembunyikan menu bukan pengamanan.** Kalau sebuah menu tidak tampil untuk
> OPERATOR tapi dia tahu alamatnya, dia tetap bisa membukanya. Pengamanan
> sebenarnya adalah pemeriksaan izin di sisi server. Selalu periksa keduanya.

---

# Bagian 2 — Akun bawaan

Saat aplikasi dipasang pertama kali, ada tiga akun yang dibuat otomatis:

| Peran | Email | Sandi |
|---|---|---|
| ADMIN | `admin@ubbg.ac.id` | dari `SEED_ADMIN_PASSWORD` di `.env` |
| OPERATOR | `operator@ubbg.ac.id` | dari `SEED_OPERATOR_PASSWORD` di `.env` |
| PIMPINAN | `pimpinan@ubbg.ac.id` | dari `SEED_PIMPINAN_PASSWORD` di `.env` |

Sandi **tidak ditulis di dokumen ini**, dan tidak ditulis di dalam kode.
Alasannya: dokumen ini dan seluruh kodenya tersimpan di GitHub yang bisa dibaca
publik. Sandi yang tertulis di sana akan ditemukan bot pemindai dalam hitungan
jam, dan sandi yang pernah tertulis di sana harus dianggap bocor selamanya
karena tetap tersimpan di riwayat git.

Sandi diisi lewat variabel lingkungan di berkas `.env` (berkas itu **tidak**
ikut ter-commit). Cara membuatnya:

```bash
openssl rand -base64 18      # jalankan, hasilnya salin ke .env
```

> ## ⚠️ Kalau variabelnya tidak diisi
>
> Akun admin tidak akan dibuat (seed berhenti dengan pesan jelas), dan akun
> operator/pimpinan dibuat dalam keadaan **nonaktif**. Jadi tidak akan pernah
> ada akun aktif dengan sandi yang bisa ditebak.
>
> Ini disengaja: lebih baik gagal terang-terangan daripada diam-diam membuat
> pintu masuk dengan kunci yang sudah tertulis di internet.

## Mengganti sandi

### Kalau sudah bisa masuk sebagai ADMIN

1. Masuk sebagai ADMIN
2. Buka menu **Pengguna**
3. Pilih akun → ganti sandi

### Kalau sudah tidak bisa masuk sama sekali

Sandi hanya bisa diganti kalau ada akses ke database. Caranya:

1. Buat hash sandi baru:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('SANDI-BARU-ANDA', 12))"
   ```
2. Jalankan di database:
   ```sql
   UPDATE "User" SET password = '<hash-tadi>' WHERE email = 'admin@ubbg.ac.id';
   ```
3. Hapus semua sesi lama supaya siapa pun yang sudah masuk terlempar:
   ```sql
   DELETE FROM "Session";
   ```

> **Setelah mengganti sandi, selalu hapus sesi lama.** Tanpa itu, orang yang
> sudah masuk dengan sandi lama tetap bisa memakai sesinya sampai kedaluwarsa.

## Buat akun terpisah untuk setiap orang — jangan berbagi satu akun

Catatan audit mencatat **siapa** mengubah apa berdasarkan akun. Kalau satu akun
dipakai beramai-ramai, catatan itu jadi tidak berguna.

---

# Bagian 3 — Yang tidak boleh dilakukan ke kata sandi

## Jangan menyimpan sandi asli di database

Sistem menyimpan sandi dalam bentuk **acakan satu arah** (`passwordHash`).
Artinya:

- Bahkan administrator **tidak bisa melihat** sandi pengguna
- Kalau ada yang lupa sandi, yang bisa dilakukan adalah **mengatur ulang**
- Kalau seseorang menawarkan "bisa mengembalikan sandi lama", **itu tidak benar**

## Jangan mengubah `passwordHash` langsung di database

Ganti sandi **selalu lewat aplikasi** (**Pengaturan → Pengguna**), supaya
penghasil acakannya benar. Mengisinya manual akan membuat sandi tidak pernah bisa
dipakai dan sulit dilacak penyebabnya.

---

# Bagian 4 — 🔴 MEMINDAHKAN KEPEMILIKAN SISTEM (bagian terpenting)

> **Ini bagian paling penting dari seluruh dokumen serah terima.**
>
> Selama akun-akun di bawah ini masih terdaftar dengan **email pribadi
> pengembang**, universitas belum benar-benar memiliki sistemnya. Kalau email
> itu hilang, tidak bisa diakses, atau pengembangnya sudah tidak bisa dihubungi,
> kampus akan kesulitan — bahkan untuk hal sederhana seperti memperbarui
> tagihan.

## Empat akun yang harus dipindahkan

| Layanan | Untuk apa | Kondisi kalau tidak dipindahkan |
|---|---|---|
| **Vercel** | Menjalankan aplikasi | Aplikasi tetap hidup, tapi kampus **tidak bisa mengubah apa pun** — termasuk mengganti domain atau menaikkan perubahan |
| **Neon** | Menyimpan data | Kampus **tidak bisa mencadangkan** data sendiri |
| **Cloudflare** | Menyimpan berkas bukti | Berkas bukti **tidak bisa diakses** kalau akun bermasalah |
| **GitHub** | Menyimpan kode | Kampus **tidak bisa memperbarui kode** sama sekali |

## Cara memindahkan

### Vercel

1. Masuk ke https://vercel.com dengan akun yang sekarang memegang proyek
2. Buka **Settings → Members**
3. Undang email resmi prodi sebagai **Owner**
4. Setelah diundang dan menerima, pemegang lama menurunkan perannya
5. Pastikan halaman tagihan memakai kartu/email institusi

### Neon (database)

1. Masuk ke https://console.neon.tech
2. Buka **Project Settings → Members**
3. Undang email institusi sebagai **Admin**
4. Pindahkan organisasi ke sana (**Transfer ownership**)
5. Setelah pindah, **segera catat** alamat `DATABASE_URL` di tempat yang aman

### Cloudflare (penyimpanan berkas)

1. Masuk ke https://dash.cloudflare.com
2. Buka **Manage Account → Members**
3. Undang email institusi sebagai **Super Administrator**
4. Pindahkan akun ke sana
5. Salin ulang **R2 API Token** dan simpan di tempat aman

### GitHub (kode)

1. Buka https://github.com/axolotl-void/SIM-LKPS/settings
2. Bagian **Danger Zone → Transfer ownership**
3. Pindahkan ke organisasi kampus, **atau** undang akun institusi sebagai admin
4. Kalau ingin lebih aman: buat salinan (**Fork**) di akun institusi

## Yang harus diserahkan bersamaan (dan CARA menyimpannya)

Kelima nilai di bawah ini adalah **kunci masuk ke sistem**. Tanpa ini, aplikasi
yang sudah dipindahkan tetap tidak bisa dibuka atau dirawat.

| Nama | Untuk apa | Di mana melihatnya |
|---|---|---|
| `DATABASE_URL` | Alamat database + kata sandinya | Vercel → Settings → Environment Variables |
| `AUTH_SECRET` | Kunci penanda tangan sesi login | Sama |
| `MINIO_ACCESS_KEY` | Akun penyimpanan berkas | Sama |
| `MINIO_SECRET_KEY` | Sandi penyimpanan berkas | Sama |
| `MINIO_ENDPOINT` | Alamat penyimpanan berkas | Sama |

> **Cara menyimpan yang benar:** di **pengelola kata sandi** (Bitwarden, 1Password,
> KeePass) milik institusi. Bukan di WhatsApp, bukan di Google Docs, bukan di
> kertas yang ditempel di dinding.
>
> **Cara menyimpan yang salah, dan pernah dilakukan orang:** dikirim lewat chat
> tugas, disimpan di notes ponsel pribadi, atau di-commit ke GitHub. Ketiganya
> sudah terjadi di banyak proyek.

## Cara memeriksa sudah benar-benar pindah

Setelah semua dipindahkan, uji dengan cara ini:

1. Minta **satu orang dari kampus** (bukan pengembang) masuk ke Vercel
2. Orang itu membuka **Deployments** dan menekan tombol **Redeploy**
3. Aplikasi harus tetap hidup dan bisa dibuka seperti biasa

Kalau langkah itu berhasil, berarti kepemilikan sudah benar-benar berpindah.

> **Periksa juga:** kelima nilai rahasia di tabel atas **bisa dibaca** oleh
> akun kampus. Kalau tidak bisa dibaca, artinya masih ada yang tertahan.

---

# Bagian 5 — Keamanan sehari-hari

## Yang dijalankan otomatis oleh sistem

| Pengamanan | Di mana |
|---|---|
| Semua halaman butuh login | `middleware.ts` |
| Kata sandi diacak satu arah | `lib/actions/user.ts` |
| Pemeriksaan izin setiap perubahan data | `lib/utils/permissions.ts` |
| Catatan siapa mengubah apa | `lib/utils/audit.ts` |
| Pembatasan percobaan login berulang | `@upstash/ratelimit` |
| Pemeriksaan isian sebelum disimpan | `lib/validations/` |

## Yang harus dijaga manusia

| Hal | Aturan |
|---|---|
| **Kata sandi** | Minimal 12 karakter, tidak dipakai ulang, diganti tiap 6 bulan |
| **Akun per orang** | Satu orang satu akun — jangan berbagi |
| **Akun mantan staf** | **Nonaktifkan segera** saat yang bersangkutan keluar. Jangan dihapus — catatan auditnya masih diperlukan |
| **Kode rahasia** | Hanya di pengelola kata sandi institusi |
| **Hak ADMIN** | Maksimal 2–3 orang |

## Menonaktifkan pengguna yang sudah keluar

**Pengaturan → Pengguna** → pilih pengguna → ubah menjadi **tidak aktif**.

> **Jangan menghapus akunnya.** Menghapus akan membuat catatan audit lamanya
> kehilangan pemilik — riwayat perubahan yang pernah dia lakukan akan tertulis
> "tidak diketahui". Menonaktifkan sudah cukup: dia tidak bisa masuk lagi, tapi
> riwayatnya tetap utuh.

## Kalau ada kode rahasia yang bocor

Tanda-tandanya: ada aktivitas aneh, tagihan naik tak wajar, atau email
pemberitahuan masuk dari layanan cloud.

Langkahnya:

1. **Segera ganti** `AUTH_SECRET` (di Vercel → Settings → Environment Variables)
2. Ganti juga `NEXTAUTH_SECRET` dengan nilai yang **sama persis**
3. Ganti sandi database di Neon
4. Ganti kunci penyimpanan berkas di Cloudflare
5. Klik **Redeploy** di Vercel
6. Periksa **Pengaturan → Audit Log** untuk melihat aktivitas mencurigakan

> **Mengganti `AUTH_SECRET` akan melempar semua pengguna keluar** dan mereka
> harus masuk ulang. Itu memang tujuannya — memutus sesi yang mungkin sudah
> diambil orang.

---

# Bagian 6 — Menjawab pertanyaan penguji akreditasi

Pertanyaan yang biasanya muncul soal keamanan data, beserta jawabannya:

**"Siapa saja yang bisa mengubah data?"**
> Tiga peran dengan hak berbeda. Setiap perubahan tercatat di tabel `AuditLog`
> lengkap dengan identitas pengubah, waktu, dan rincian sebelum-sesudah.

**"Bagaimana memastikan data tidak bisa diubah setelah disetujui?"**
> Ada alur DRAFT → DIAJUKAN → DISETUJUI. Hanya ADMIN dan PIMPINAN yang bisa
> menyetujui. Setiap perpindahan status tercatat di `ValidationHistory`.

**"Bagaimana kalau pengembangnya sudah tidak di kampus?"**
> Ada dokumen serah terima lengkap (dokumen ini), kode terbuka di GitHub,
> setiap berkas dijelaskan satu per satu di folder `referensi/`, dan akun
> layanan bisa dipindahkan ke email institusi.

**"Di mana datanya disimpan?"**
> Database PostgreSQL terkelola (Neon), berlokasi di Singapura. Berkas bukti di
> Cloudflare R2. Keduanya bisa dicadangkan dan diekspor dalam format standar.

**"Apakah kata sandi disimpan dengan aman?"**
> Kata sandi tidak pernah disimpan dalam bentuk asli — hanya acakannya
> (hash) yang tidak bisa dibalik. Bahkan administrator tidak bisa membacanya.

**"Siapa yang bisa melihat laporan?"**
> Peran PIMPINAN dan ADMIN. Peran OPERATOR bisa mengisi tapi tidak mengunduh
> laporan akhir.
