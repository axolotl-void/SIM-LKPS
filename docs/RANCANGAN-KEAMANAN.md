# Rancangan & Laporan Keamanan SIM-LKPS

> Terakhir diperbarui: 21 September 2026
> Status: **Fase 0-4 SELESAI dan terverifikasi.** Fase 5 (verifikasi produksi) menunggu push.

Dokumen ini menggabungkan dua hal: **hasil pemindaian** (apa yang ditemukan) dan
**rancangan perbaikan** (apa yang dilakukan, dan mengapa begitu).

---

## Cara membaca dokumen ini

Setiap temuan punya tingkat bahaya dan status:

| Tingkat | Artinya |
|---|---|
| 🔴 KRITIS | Bisa langsung dipakai penyerang untuk masuk atau mengambil data |
| 🟠 SEDANG | Menambah risiko, tapi butuh syarat lain untuk dieksploitasi |
| 🟡 RINGAN | Memperkecil kemudahan penyerang, bukan celah langsung |

| Status | Artinya |
|---|---|
| ✅ SELESAI | Sudah diperbaiki dan dibuktikan dengan uji |
| ⏳ MENUNGGU | Rancangan siap, belum dijalankan |

---

## Ringkasan hasil

**17 titik diperiksa, 6 temuan ditindaklanjuti.**

Kabar baiknya dulu: **fondasi kode aplikasi ini tidak ceroboh.** Yang ditemukan
bukan kode sembarangan, tapi beberapa hal yang terlewat.

Yang sudah bersih (tidak perlu apa-apa):

- **SQL injection: tidak ada.** 0 raw query di seluruh kode, kecuali
  `SELECT 1` yang ditulis tetap untuk uji koneksi. Semua akses data lewat
  Prisma, yang otomatis memisahkan perintah dari data.
- **Berkas `.env` tidak pernah masuk git.** Hanya `.env.example` yang
  ter-commit, dan isinya placeholder semua.
- **0 kunci API, token, atau kunci privat** di 582 berkas ter-track.
- **Semua server action punya pemeriksaan izin** (`butuhIzin` /
  `requirePermission`). Tidak ada satu pun yang terbuka.
- **Semua endpoint API balas 401 tanpa login** (diuji langsung ke produksi).
- **Unggahan berkas divalidasi lengkap**: ukuran, ekstensi, tipe MIME, dan
  nama berkas dibersihkan.
- **XSS: teks tidak disisipkan mentah** ke HTML.
- **Sandi di-hash bcrypt cost 12**; cookie sesi `httpOnly` + `secure`.

---

## 🔴 K-1 — Sandi produksi tertulis di repositori PUBLIK

**Status: ✅ SELESAI**

### Yang ditemukan

Sandi tiga akun produksi (`admin@`, `operator@`, `pimpinan@`) tertulis apa
adanya di repositori GitHub yang **bisa dibaca siapa saja**. Tersebar di
**11 commit sejak 17 Juli 2026** — hampir dua bulan.

Lokasinya ada di 10 tempat, termasuk `prisma/seed.ts`, `CLAUDE.md`,
`tests/fixtures.ts`, `docs/handover/*.md`, dan `docs/database.md`.

### Bukti bahwa ini nyata, bukan kekhawatiran

Ini **tidak** disimpulkan dari membaca kode. Saya benar-benar mencobanya ke
produksi memakai sandi yang tertera di GitHub itu:

| Tindakan | Hasil |
|---|---|
| Login ke `lkps.zegika.com` | **Berhasil**, dapat cookie sesi |
| Buka `/settings/users` (kelola pengguna) | **200** |
| Buka `/settings/audit-log` (catatan audit) | **200** |
| `GET /api/master/dosen` | **200** — 31 dosen lengkap dengan NIDN |
| `GET /api/export/excel` | **200** — 13.519 byte seluruh data LKPS |

Sesi uji itu sudah diakhiri dan cookie-nya dihapus.

**Kenapa ini bahaya terbesar:** bot pemindai menjelajah repositori publik
terus-menerus. Cukup satu bot membaca satu berkas, dan ia langsung jadi admin —
tanpa perlu menebak sandi, tanpa perlu celah lain.

### Yang dilakukan

1. **Sandi admin diganti di produksi.** Sandi lama tidak berlaku lagi —
   dibuktikan dengan login ulang: sandi lama **ditolak**, sandi baru berhasil.
2. **Sandi dihapus dari 7 berkas** (kode, uji, dokumentasi):
   - `prisma/seed.ts` → membaca `SEED_ADMIN_PASSWORD` dari `.env`
   - `tests/fixtures.ts` + 4 berkas spec → membaca `TEST_*_PASSWORD`
   - `CLAUDE.md`, `docs/database.md`, `docs/handover/00`, `01`, `05`
3. **Berkas contoh dibuat** supaya orang berikutnya tahu caranya:
   `tests/.env.test.example`, plus bagian baru di `.env.example`.
4. **`.gitignore` ditambah** `tests/.env.test` dan `tests/.auth/`.
5. **Verifikasi:** `git grep` untuk sandi lama di seluruh berkas ter-track →
   **0 kecocokan**.

### Rancangan jangka panjang

Sandi yang pernah ter-commit harus **dianggap bocor selamanya** — riwayat git
menyimpannya, dan cache GitHub sulit dibersihkan. Karena itu urutannya wajib:
**ganti sandi dulu, baru bersihkan riwayat.** Kalau riwayat dibersihkan tanpa
mengganti sandi, lubangnya masih terbuka.

### Catatan penting soal `SECURITY.md`

Berkas itu sudah menulis "Ganti `ADMIN_PASSWORD` setelah first login" sejak
dulu — tapi tidak pernah dijalankan. Ia juga mengandalkan "GitHub secret
scanning aktif", padahal fitur itu **hanya mendeteksi pola penyedia tertentu**
(token AWS, kunci Stripe). Sandi buatan sendiri (mis. `NamaAplikasi` + tahun + tanda seru) **tidak akan
pernah terdeteksi** — bentuknya tidak cocok dengan pola mana pun.

**Pelajaran:** peringatan yang tidak dijalankan sama nilainya dengan tidak ada
peringatan. Yang bekerja adalah yang **tidak bisa dilewati** — dalam hal ini,
membuat seed menolak jalan tanpa variabel lingkungan.

---

## 🔴 K-2 — Pembatas percobaan login tidak berfungsi di produksi

**Status: ✅ SELESAI**

### Yang ditemukan

Saya kirim 8 login gagal berturut-turut ke produksi. **Tidak pernah dapat 429**
— semuanya lolos seperti biasa. Artinya penyerang bisa mencoba sandi sepuasnya.

Dua penyebabnya:

1. **Hitungannya disimpan di memori proses** (`new Map()`). Di Vercel,
   aplikasi berjalan di beberapa instance sekaligus dan tiap instance didaur
   ulang kapan saja. Karena itu hitungan di tiap instance hanya melihat
   sebagian kecil percobaan, lalu hilang sebelum mencapai batasnya.
2. **Batasnya 50 percobaan per 5 menit**, dilonggarkan khusus supaya uji E2E
   tidak terganjal. Nilai itu terlalu longgar untuk produksi.

### Yang dilakukan

1. **Tabel `login_attempt` di database** (model Prisma baru). Karena disimpan
   di database, hitungannya berlaku untuk **semua instance sekaligus** dan
   tidak hilang saat instance didaur ulang.
2. **Batas baru: 10 percobaan gagal per akun, 30 per alamat IP, per 15 menit.**
   Kunci gabungan IP + email dipilih dengan alasan:
   - Per-IP saja bisa melukai satu kantor yang berbagi satu IP publik
   - Per-email saja tidak berguna — penyerang tinggal mencoba banyak email
   - Gabungan keduanya: serangan yang menyasar satu akun ikut terhenti
3. **Hanya percobaan GAGAL yang dihitung.** Login berhasil mengosongkan
   hitungan, supaya pengguna sah yang salah ketik tidak ikut terhukum.
4. **Pemeriksaan dilakukan sebelum sandi dicek**, supaya penyerang tidak bisa
   memakai waktu balasan untuk menebak.
5. **Kalau database bermasalah, permintaan diloloskan.** Alasannya: pembatas
   ini pelengkap, bukan pengaman utama (pengaman utamanya bcrypt + sandi
   kuat). Menolak login seluruh kampus gara-gara gangguan DB justru merugikan,
   dan penyerang bisa memakainya untuk mematikan layanan.
6. **Penghitung di sisi klien dibuang.** Sebelumnya formulir login menghitung
   sendiri dan mengunci tombol setelah 5 gagal. Hitungan di klien mudah
   dilewati (cukup muat ulang halaman) dan bisa keliru mengunci pengguna sah.
   Sekarang klien hanya *menampilkan* keadaan yang diputuskan server.
7. **Pembersihan otomatis**: baris kedaluwarsa dihapus sesekali (1 dari 20
   percobaan), tanpa menunggu hasilnya.

### Cara pesan blokir sampai ke pengguna

NextAuth hanya meneruskan sebagian jenis error ke sisi klien. Error yang tidak
dikenal akan berubah jadi halaman error umum — pengguna cuma melihat
"Configuration" tanpa penjelasan. Karena itu error pembatas **mewarisi
`CredentialsSignin`**, yang punya properti `code` dan ikut dikirim di URL.
`code` diisi `terlalu_banyak_percobaan`, dan aplikasi menampilkan pesan yang
benar. Penanda ini sengaja tidak menyebut email mana yang dikunci, supaya
tidak membocorkan akun mana yang ada di sistem.

### Bukti pengujian

| Uji | Hasil |
|---|---|
| Percobaan gagal 1-10 | Balasan normal "sandi salah" |
| Percobaan ke-11 dan ke-12 | **Diblokir**, `code=terlalu_banyak_percobaan` |
| 9 gagal lalu login dengan sandi BENAR | **Berhasil**, hitungan direset ke 0 |
| Isi tabel setelah login berhasil | **0 baris** (bersih) |

Uji dilakukan lewat jalur yang sama dengan browser, dan isi tabel diperiksa
langsung di database.

---

## 🔴 K-3 — Middleware tidak memeriksa login sama sekali

**Status: ✅ SELESAI**

### Yang ditemukan

`middleware.ts` — lapisan yang berjalan **sebelum** halaman mana pun —
tidak pernah memanggil `auth()`. Ia hanya menempelkan header keamanan dan
menghitung percobaan login.

Akibatnya, keamanan sepenuhnya bergantung pada pemeriksaan `auth()` di
**tiap halaman**. Cara ini bekerja hari ini (semua halaman memeriksanya),
tapi rapuh: **halaman baru yang lupa memeriksa akan otomatis terbuka**, dan
tidak ada yang menangkapnya.

### Yang dilakukan

1. **Middleware sekarang memeriksa sesi** dan menolak akses sebelum halaman
   dieksekusi.
2. **Daftar jalur publik dibuat sempit** (tolak-lewat): `/login`, `/api/auth`,
   `/api/health`, berkas statis. Apa pun di luar daftar itu **harus** login.
   Jadi halaman baru otomatis **terlindungi**, bukan otomatis terbuka.
3. **Bentuk balasan disesuaikan**: API dan permintaan server-action menerima
   **401 JSON**; halaman biasa dialihkan ke `/login` dengan `callbackUrl`
   supaya pengguna kembali ke halaman tujuannya setelah masuk.

### Hambatan teknis dan penyelesaiannya

Middleware Next.js berjalan di **Edge runtime**, yang tidak bisa memuat
Prisma — sementara `lib/auth.ts` berisi PrismaAdapter dan bcrypt. Kalau
middleware mengimpor berkas itu, build gagal.

Penyelesaiannya dengan **memisahkan konfigurasi** (pola resmi NextAuth v5):

- `lib/auth.config.ts` — hanya hal yang aman di Edge: pengaturan cookie,
  durasi sesi, callback token. **Tanpa** Prisma/bcrypt.
- `lib/auth.ts` — tetap di runtime Node, memuat adapter + logika sandi,
  lalu menyebar (`...authConfig`) supaya kedua sisi tidak bisa berbeda.
- `middleware.ts` — membuat instance NextAuth sendiri dari `authConfig`.
  Karena sesi disimpan sebagai **JWT**, instance ini bisa *membaca* sesi tanpa
  menyentuh database — cukup memeriksa tanda tangannya.

Kedua sisi harus sepakat soal bentuk token. Karena keduanya memakai
`authConfig` yang sama, tidak mungkin lagi berbeda diam-diam.

### Bukti pengujian

| Uji | Hasil |
|---|---|
| `/dashboard` tanpa cookie | **307** → `/login?callbackUrl=%2Fdashboard` |
| `/dashboard` dengan cookie sesi | **200** |
| Pemuatan middleware | Berhasil, tidak ada galat Prisma di Edge |

---

## 🟠 S-1 — Header keamanan kurang, dan diatur di DUA tempat

**Status: ✅ SELESAI**

### Yang ditemukan

1. **`'unsafe-eval'` masih ada di CSP.** Itu yang membuat celah XSS bisa
   berubah menjadi eksekusi kode. Runtime produksi tidak membutuhkannya.
2. **Tidak ada HSTS** — tanpa itu, kunjungan pertama lewat HTTP bisa
   disadap dan dialihkan.
3. **Header diatur di dua tempat** (`next.config.ts` *dan* `middleware.ts`)
   dengan isi berbeda. Saat sebuah header diatur dua kali, yang menang tidak
   selalu jelas, dan perubahan di satu tempat diam-diam tertimpa.
4. **CSP tidak punya** `object-src`, `base-uri`, `form-action`, dan
   `upgrade-insecure-requests`.

### Yang dilakukan

1. **`'unsafe-eval'` dihapus** dari CSP.
   `'unsafe-inline'` **dipertahankan** pada `script-src`, dan ini disengaja:
   Next.js menyisipkan skrip bootstrap dan data hidrasi sebagai skrip inline.
   Menghapusnya akan mematikan aplikasi, bukan mengamankannya. Kalau nanti
   Next.js menyediakan nonce, `'unsafe-inline'` bisa diganti nonce.
2. **HSTS ditambahkan**: `max-age=63072000; includeSubDomains; preload`
   (2 tahun). Hanya dikirim di produksi — di lokal protokolnya http, dan
   header ini akan mengunci `localhost` ke HTTPS di browser.
3. **Semua header disatukan di `middleware.ts`** — satu sumber kebenaran.
   `next.config.ts` diberi catatan yang menjelaskan ke mana pindahnya.
4. **`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, dan
   `upgrade-insecure-requests` ditambahkan.**
5. **`X-XSS-Protection` dibuang.** Header itu sudah usang, dan di browser
   lama justru bisa memunculkan masalah sendiri. CSP sudah menggantikannya
   dengan cara yang lebih benar.
6. **`Permissions-Policy` diperluas**: `payment=()`, `usb=()`.
7. **`X-Powered-By` dimatikan** (`poweredByHeader: false`). Header itu
   memberi tahu penyerang framework apa yang dipakai, memudahkan mereka
   memilih celah sesuai versi.

---

## 🟠 S-2 — Pesan galat membocorkan struktur database

**Status: ✅ SELESAI**

### Yang ditemukan

Dua halaman galat menampilkan `error.message` **apa adanya** ke layar. Galat
Prisma biasanya memuat nama tabel, nama kolom, bahkan potongan query:

```
Invalid `prisma.dosen.findMany()` invocation:
Raw query failed. Code: `42P01`.
Message: `relation "dosen" does not exist`
```

Nama tabel dan struktur database adalah peta yang memudahkan penyerang memilih
sasaran.

### Yang dilakukan

1. **Modul baru `lib/utils/pesan-galat.ts`.** Aturannya:
   - Pesan asli **selalu** masuk log server (untuk ditelusuri)
   - Ke layar hanya pesan singkat yang menjelaskan **keadaannya**, bukan
     penyebab teknisnya
   - **ID galat** (`digest`) tetap ditampilkan — ID itu hanya berguna kalau
     kita punya akses log server, jadi aman, dan memudahkan pelaporan
2. **Penyaring memeriksa penanda teknis**: `prisma`, `invocation`, `Raw query`,
   `relation `, `column `, `.js:`, `.ts:`, `ECONNREFUSED`, kode galat Prisma
   (`P1001`, `P2002`, `P2025`), dan `SQL`.
3. **Diterapkan di 2 halaman galat** yang bocor. (Halaman galat global
   `app/error.tsx` sudah aman sejak awal — hanya menampilkan `digest`.)

### Yang diperiksa dan ternyata sudah aman

**Semua server action** sudah menyaring galat dengan benar. Berkas
`lib/actions/lkps.ts`, `led.ts`, dan `penilaian.ts` sudah punya penyaring
(`withErrorHandling`) yang melempar hanya galat yang dikenal, sisanya diganti
pesan umum. Berkas `evidence.ts`, `notification.ts`, `mahasiswa.ts`,
`matakuliah.ts`, dan `user.ts` mengembalikan pesan generik sambil mencatat
galat aslinya ke server. **Tidak ada yang bocor**, jadi tidak ada yang diubah.

---

## 🟠 S-3 — 8 kerentanan dependensi (3 tingkat tinggi)

**Status: ✅ SELESAI**

### Yang ditemukan

`pnpm audit --prod` menemukan **8 kerentanan: 3 tinggi, 5 sedang.** Semuanya
di **dependensi tidak langsung** — pustaka yang tidak kita pakai langsung, tapi
ikut terpasang sebagai bawaan pustaka lain:

| Pustaka | Jalur | Bahaya |
|---|---|---|
| `postcss` (3 celah) | lewat `next` | Pembacaan berkas sembarang lewat `sourceMappingURL` |
| `deepmerge-ts` | lewat `prisma` | Kehabisan tumpukan saat menggabungkan objek bersarang |
| `uuid` | lewat `exceljs` | Pemeriksaan batas buffer kurang |
| `decode-uri-component` | lewat `minio` | Layanan lumpuh (DoS) lewat masukan cacat |
| `stream-json` | lewat `minio` | Event loop terblokir berjam-jam (DoS) |

### Yang dilakukan

**`overrides` di `pnpm-workspace.yaml`** memaksa resolver memakai versi yang
sudah ditambal oleh pustaka masing-masing. Ini pendekatan yang benar
dibandingkan menambal manual atau mematikan pemeriksaan — kita tidak menunggu
pihak lain naik versi.

Catatan teknis: pada **pnpm 11**, `overrides` **tidak dibaca dari
`package.json`** (perilaku versi lama). Tempatnya di `pnpm-workspace.yaml`.
Kesalahan menaruhnya di `package.json` membuat `pnpm install` melaporkan
"Already up to date" sementara kerentanannya tetap ada.

### Bukti

| Pustaka | Sebelum | Sesudah |
|---|---|---|
| postcss | 8.5.28 | **8.5.28** ✓ |
| uuid | 8.3.2 | **14.0.2** ✓ |
| deepmerge-ts | 7.1.5 | **8.0.2** ✓ |
| decode-uri-component | 0.2.2 | **0.5.0** ✓ |
| stream-json | 1.9.1 | *tidak di-override* — lihat di bawah ⚠️ |

`pnpm audit --prod` → **8 temuan hilang, sisa 1 temuan sedang** (stream-json).

### Koreksi: override `stream-json` sempat merusak build produksi

Perbaikan awal memaksa `stream-json: '>=3.4.1'`. **Build lokal lolos, tapi deploy
Vercel GAGAL** dengan:

```
./node_modules/.pnpm/minio@8.0.7/node_modules/minio/dist/esm/notification.mjs
Module not found: Can't resolve 'stream-json/jsonl/Parser.js'
```

Sebabnya soal **huruf besar-kecil**: minio mengimpor `jsonl/Parser.js` (P besar),
sedangkan stream-json 3.x hanya menyediakan `src/jsonl/parser.js` (p kecil) dan
mengekspornya lewat `"./*": "./src/*"`. **macOS memaafkan perbedaan ini, Linux
tidak** — jadi bug ini mustahil terdeteksi dari laptop, hanya muncul di Vercel.

Override itu dibuang dan minio kembali mendapat `1.9.1` yang berkasnya cocok.
Sisa temuan diterima dengan alasan yang dicatat di `pnpm-workspace.yaml`:

- Kode yang rentan adalah filter `pick/ignore/filter/replace` stream-json.
  Aplikasi **tidak menyentuhnya** — hanya memakai `bucketExists`, `makeBucket`,
  `putObject`, `removeObject`, dan `presignedGetObject`.
- Efeknya DoS pada proses sendiri, **bukan kebocoran data**.
- `minio@8.0.7` adalah versi terbaru; belum ada perbaikan dari hulu.
- Versi 1.x versi berapa pun ada di rentang rentan (`<=3.4.0`), jadi menaikkan
  ke 1.9.1 tidak menolong.

Pelajaran yang lebih luas: **build lokal yang hijau tidak membuktikan build
Linux/Vercel hijau.** Perbedaan yang tidak terasa di macOS — huruf besar-kecil
nama berkas, pemisah jalur — baru muncul di sana. Satu-satunya cara tahu adalah
men-deploy.

---

## 🟡 R-1 — `/api/health` terbuka tanpa login

**Status: ✅ DIBIARKAN SENGAJA**

### Yang diperiksa

Endpoint `/api/health` bisa diakses tanpa login. Isinya sudah diperiksa dan
**tidak membocorkan apa pun** yang sensitif:

- Status koneksi database (`connected`/`disconnected`)
- Waktu server
- Kode balasan: 200 kalau normal, 503 kalau database bermasalah

Tidak ada versi, tidak ada nama tabel, tidak ada konfigurasi.

### Mengapa dibiarkan

Endpoint kesehatan **memang harus bisa diakses tanpa login** — kalau butuh
login, alat pemantauan uptime tidak bisa memakainya, dan kita baru tahu situs
mati setelah ada yang mengeluh. Isinya sudah dijaga tetap kosong dari
informasi sensitif, jadi terbuka bukan masalah.

Dicatat di sini supaya keputusan ini **disengaja**, bukan terlewat.

---

## Yang secara sadar TIDAK dilakukan

Bagian ini sama pentingnya dengan daftar perbaikan. Semuanya keputusan
sengaja, bukan kelalaian.

### `'unsafe-inline'` masih ada di CSP `script-src`

**Alasan:** Next.js menyisipkan skrip bootstrap dan data hidrasi sebagai skrip
inline. Menghapusnya membuat aplikasi **mati total**. Yang penting adalah
`'unsafe-eval'` dihapus — itu yang membuat celah XSS bisa berubah jadi
eksekusi kode.

**Jalan keluar nanti:** kalau Next.js menyediakan nonce untuk skrip, ubah
`script-src` jadi `'self' 'nonce-<acak>'` dan buang `'unsafe-inline'`.

### Sandi DB lokal (`postgres`) tetap tertulis di dokumentasi

**Alasan:** itu sandi bawaan container Docker yang didefinisikan sendiri di
`docker-compose.yml` (`POSTGRES_PASSWORD: postgres`), hanya hidup di
komputer lokal, dan **tidak berkaitan sama sekali** dengan produksi (produksi
pakai Neon dengan kredensial terpisah). Mengubahnya akan merusak setup lokal
yang sudah terdokumentasi, tanpa menambah keamanan sedikit pun.

### Batas E2E yang berbeda dari produksi

Uji otomatis memakai sandi akun di DB uji, dibaca dari `tests/.env.test`
(gitignored). Suite juga menolak jalan kalau `DATABASE_URL` bukan localhost —
penjagaan di `tests/global-setup-penilaian.ts`.

---

## Soal klaim "aman 100%"

**Tidak ada yang bisa menjanjikan itu, dan siapa pun yang menjanjikannya
sedang tidak jujur.** Alasannya bukan pesimisme: setiap bulan ada celah baru
di framework dan pustaka yang dipakai aplikasi ini. Itu bagian dari
kenyataan memakai perangkat lunak orang lain.

**Yang bisa dijanjikan dan sudah dibuktikan:**

1. **0 temuan terbuka** dari daftar kerentanan yang diperiksa
2. **Bot pemindai otomatis gagal masuk** — tidak ada sandi yang bisa ditemukan
   di repositori publik
3. **Serangan tebak sandi terhenti** di 10 percobaan
4. **Data tidak bisa diunduh tanpa login** — dibuktikan dengan 401/307

**Perubahan tingkat risikonya:**

| | Sebelum | Sesudah |
|---|---|---|
| Cara masuk | Baca satu berkas GitHub, langsung jadi admin | Perlu sandi yang hanya ada di `.env` dan pengelola sandi |
| Serangan bot | Berhasil otomatis | **Gagal** — tidak ada lagi yang bisa dibaca |
| Tebak sandi | Tanpa batas | 10 percobaan per akun / 15 menit |
| Jalan masuk | Tergantung tiap halaman | **Dua lapis**: middleware + halaman |

Singkatnya: dari **"siapa pun bisa jadi admin"** menjadi **"perlu usaha
sungguhan"**. Itu perubahan yang nyata dan terukur.

---

## Berkas yang diubah

**Baru (4):**

| Berkas | Isi |
|---|---|
| `lib/utils/login-rate-limit.ts` | Pembatas login berbasis database |
| `lib/auth.config.ts` | Konfigurasi auth aman-Edge (tanpa Prisma) |
| `lib/utils/pesan-galat.ts` | Penyaring pesan galat |
| `tests/.env.test.example` | Contoh sandi akun uji |

**Diubah (23):** `middleware.ts`, `lib/auth.ts`, `lib/actions/auth.ts`,
`next.config.ts`, `prisma/schema.prisma` (model `LoginAttempt`),
`prisma/seed.ts`, `components/forms/login-form.tsx`, 2 halaman `error.tsx`,
`pnpm-workspace.yaml`, `package.json`, `.env.example`, `.gitignore`,
`SECURITY.md`, 7 berkas dokumentasi, 5 berkas uji.

---

## Cara memeriksa ulang

```bash
cd ~/Documents/03_Proyek/SIM-LKPS/ai-company/sim-lkps

# 1. Tidak ada sandi lama di berkas ter-track (harus 0 kecocokan)
git grep -n -I -E 'SANDI_LAMA_1|SANDI_LAMA_2|SANDI_LAMA_3'   # ganti dengan pola sandi lama

# 2. Dependensi bersih
pnpm audit --prod

# 3. Kode sehat
npx tsc --noEmit
npx eslint app lib components middleware.ts

# 4. Uji end-to-end (WAJIB pakai DB uji)
DATABASE_URL="postgresql://postgres:***@localhost:5432/sim_lkps_uji" \
  TEST_ADMIN_PASSWORD="..." TEST_OPERATOR_PASSWORD="..." TEST_PIMPINAN_PASSWORD="..." \
  npx playwright test --config=tests/playwright.config.ts
```

Untuk memeriksa riwayat git secara menyeluruh:

```bash
brew install gitleaks
gitleaks detect --source . --verbose
```

---

## Yang belum dilakukan (butuh keputusan)

### 1. Membersihkan riwayat git

Sandi lama masih tersimpan di **11 commit** riwayat git. **Sandi-nya sudah
diganti, jadi ini bukan lagi lubang yang bisa dipakai** — tapi jejaknya masih
bisa dibaca.

**Penting soal urutannya:** membersihkan riwayat **tidak menggantikan**
kewajiban mengganti sandi. Yang mengganti sandi adalah langkah yang menutup
lubangnya; membersihkan riwayat hanya menghapus jejak. Sandi lama wajib tetap
dianggap bocor.

**Rencana:** `git filter-repo` (bukan `filter-branch` — sudah usang dan
lambat) untuk menulis ulang riwayat, lalu `force push`. **Konsekuensi yang
harus disadari:** `force push` menulis ulang riwayat commit, dan hash semua
commit setelahnya ikut berubah. Kalau ada orang lain yang pernah meng-clone
repo ini, salinan mereka jadi tidak sinkron.

### 2. Mengganti sandi operator & pimpinan

Saat ini **hanya sandi admin** yang sudah diganti. Sandi operator dan pimpinan
**masih yang lama** — artinya masih bisa ditemukan di riwayat git.

Perlu dikoordinasikan dulu: kedua akun itu dipakai orang lain (dosen), jadi
mereka harus diberi tahu sandi barunya.

### 3. Memastikan `AUTH_SECRET` kuat, dan merotasinya

`AUTH_SECRET` adalah kunci yang menandatangani cookie sesi. Kalau nilainya
lemah atau pernah bocor, orang bisa **membuat cookie sesi palsu** tanpa perlu
tahu sandi siapa pun. Perlu diperiksa dan dirotasi. **Menunggu keputusan.**

### 4. Verifikasi di produksi

Setelah push, periksa langsung ke `lkps.zegika.com`:

- Header HSTS & CSP baru terpasang
- Penghitung percobaan login benar-benar jalan (bukan hanya di lokal)
- Tidak ada `X-Powered-By`
- Halaman baru di luar daftar publik → dialihkan ke `/login`
