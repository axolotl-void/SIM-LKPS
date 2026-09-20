# Menjalankan SIM-LKPS di Komputer Sendiri

Panduan ini untuk menjalankan aplikasi di komputer sendiri, biasanya untuk
mencoba perubahan sebelum naik ke server resmi.

**Ada dua cara**, pilih yang sesuai situasimu:

| Cara | Butuh apa | Cocok untuk |
|---|---|---|
| **A. Pakai Docker** | Docker Desktop | Staf TI, uji coba aman |
| **B. Pakai database online** | Node.js + akun Neon | Programmer, uji dengan data asli |

Untuk pertama kali mencoba, **pakai Cara A** — tidak akan menyentuh data asli
sama sekali.

---

# Cara A — Dengan Docker (aman, tidak menyentuh data asli)

## Yang harus ada di komputer

| Perangkat lunak | Untuk apa | Cara cek |
|---|---|---|
| **Docker Desktop** | Menjalankan database | buka aplikasinya, ikonnya hijau |
| **Node.js versi 20 ke atas** | Menjalankan aplikasi | `node --version` |
| **pnpm** | Memasang bahan-bahan | `pnpm --version` |
| **Git** | Mengambil kode | `git --version` |

Kalau `pnpm` belum ada:

```bash
npm install -g pnpm
```

## Langkah 1 — Ambil kodenya

```bash
cd tempat-kamu-menyimpan-proyek
git clone https://github.com/axolotl-void/SIM-LKPS.git
cd SIM-LKPS
```

## Langkah 2 — Nyalakan database

```bash
docker compose up -d
```

Tunggu sekitar 10 detik, lalu pastikan keduanya sudah **healthy**:

```bash
docker ps
```

Harus muncul dua baris: `sim-lkps-db` dan `sim-lkps-minio`.

Kalau salah satu tidak muncul, lihat bagian Penanganan Gangguan di bawah.

## Langkah 3 — Siapkan pengaturan

Buat berkas `.env` dengan menyalin contohnya:

```bash
cp .env.example .env
```

Lalu **ubah dua baris** di dalamnya supaya menunjuk ke database Docker:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sim_lkps"
AUTH_SECRET="<isi-dengan-kunci-acak-panjang>"
```

Untuk membuat kunci acak, jalankan:

```bash
openssl rand -base64 32
```

Salin hasilnya ke `AUTH_SECRET`. **Isi nilai yang sama juga ke
`NEXTAUTH_SECRET`.**

Buat berkas `.env.local` untuk pengaturan lokal:

```
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
```

> **Kenapa dua berkas?** `.env` berisi pengaturan yang dipakai di server.
> `.env.local` menimpanya khusus untuk komputer ini. Keduanya **tidak ikut
> terkirim ke GitHub** — itu memang disengaja supaya rahasia tidak bocor.

## Langkah 4 — Pasang bahan dan siapkan database

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm tsx prisma/seed.ts
```

Penjelasan singkat:

- `pnpm install` — memasang semua bahan yang dibutuhkan
- `prisma generate` — menyiapkan alat komunikasi ke database
- `prisma db push` — membuat tabel-tabel di database
- `tsx prisma/seed.ts` — mengisi data awal (akun admin, daftar tabel, daftar bagian LED)

> **`prisma generate` sering terlewat dan akibatnya fatal**: aplikasi hidup tapi
> semua halaman yang menampilkan data akan gagal. Kalau halaman kosong padahal
> server jalan, jalankan ini dulu.

## Langkah 5 — Nyalakan

```bash
pnpm dev
```

Tunggu sampai muncul tulisan:

```
▲ Next.js 15.5.25
- Local:  http://localhost:3000
```

Buka **http://localhost:3000** di browser, lalu masuk dengan:

```
Email : admin@ubbg.ac.id
Sandi : SANDI_LAMA_ADMIN_DIHAPUS
```

Untuk mematikan: tekan `Ctrl + C` di jendela tempat perintah tadi berjalan.

---

# Cara B — Menyambung ke database asli

> ⚠️ **Hati-hati.** Cara ini menyambung ke database produksi. Apa pun yang kamu
> ubah di aplikasi akan langsung mengubah data resmi program studi.

Ikuti Cara A, tapi **jangan** tambahkan baris `DATABASE_URL` di `.env.local`.
Sebagai gantinya, isi `.env` dengan alamat database dari Neon (minta ke
pengelola sistem).

Untuk membuktikan sedang menyambung ke mana, jalankan:

```bash
docker exec sim-lkps-db psql -U postgres -d sim_lkps -c "select 1;"
```

Kalau perintah itu berhasil, berarti database lokal hidup — tapi **tidak**
membuktikan aplikasi memakai yang mana. Yang menentukan adalah isi `DATABASE_URL`
di `.env` dan `.env.local`.

> **Aturan aman**: sebelum mengubah data apa pun, pastikan dulu kamu sedang
> menunjuk ke database yang kamu maksud. Kebingungan di titik ini sudah pernah
> menyebabkan data uji masuk ke sistem resmi.

---

## Daftar perintah yang sering dipakai

| Perintah | Fungsinya |
|---|---|
| `pnpm dev` | Menyalakan aplikasi untuk pengembangan |
| `pnpm build` | Menguji apakah kode siap naik ke server |
| `pnpm type-check` | Memeriksa kesalahan penulisan tipe data |
| `npx eslint components/ app/` | Memeriksa masalah gaya penulisan kode |
| `npx vitest run` | Menjalankan uji otomatis |
| `pnpm prisma studio` | Membuka penjelajah database di browser |
| `docker compose up -d` | Menyalakan database |
| `docker compose down` | Mematikan database |

> **`pnpm lint` menipu.** Perintah itu hanya memeriksa folder `app/` dan selalu
> melaporkan "berhasil" apa pun yang terjadi. Selalu pakai
> `npx eslint components/ app/` kalau ingin hasil yang benar.

---

## Penanganan gangguan saat menjalankan

### Database tidak mau nyala

```
docker compose up -d
docker ps
```

Kalau `sim-lkps-db` tidak muncul atau statusnya bukan healthy:

```bash
docker compose logs postgres
```

Yang paling sering: **port 5432 sudah dipakai** aplikasi lain (biasanya
PostgreSQL yang dipasang langsung di komputer). Matikan layanan itu, atau ubah
nomor port di `docker-compose.yml`.

### Halaman kosong padahal aplikasi jalan

Alat komunikasi ke database belum dibuat:

```bash
pnpm prisma generate
```

Lalu **matikan dan nyalakan ulang** `pnpm dev`.

### Semua halaman gagal, login juga tidak bisa

Pohon build-nya rusak. Perbaikannya:

```bash
# tekan Ctrl+C dulu untuk mematikan server
rm -rf .next
pnpm dev
```

> **Jangan pernah menjalankan `pnpm build` sementara `pnpm dev` masih hidup.**
> Keduanya memakai folder `.next` yang sama dan saling merusak. Gejalanya
> menyesatkan: halaman login tampak normal, tapi login selalu gagal.

### Muncul "Cannot find module ./vendor-chunks/..."

Sama seperti di atas — hapus folder `.next` lalu nyalakan ulang.

### Perubahan tidak muncul di browser

1. Segarkan dengan `Cmd + Shift + R` (memaksa ambil versi terbaru)
2. Pastikan server masih jalan di jendela terminal
3. Kalau tetap tidak muncul, matikan server lalu `rm -rf .next` dan nyalakan lagi

### Login gagal padahal sandi benar

Tiga kemungkinan, cek berurutan:

1. `AUTH_SECRET` dan `NEXTAUTH_SECRET` **harus berisi nilai yang sama persis**
2. `.env.local` harus punya `AUTH_URL="http://localhost:3000"`
3. Kode verifikasi di database — lihat [`05-akun-dan-keamanan.md`](./05-akun-dan-keamanan.md)

### Port 3000 sudah dipakai

```bash
pnpm dev --port 3001
```

Lalu buka `http://localhost:3001`. Jangan lupa ubah `AUTH_URL` di `.env.local`
supaya cocok.
