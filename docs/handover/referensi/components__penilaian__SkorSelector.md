# `components/penilaian/SkorSelector.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 102 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 2 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `SkorSelector`, `LegendaSkor`.

## Letak berkas

Dari akar repo: `components/penilaian/SkorSelector.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `SkorSelector`

Jenis: **fungsi**

Pemilih skor 1–4 sesuai deskriptor Matriks Penilaian. Kurang(1) · Cukup(2) · Baik(3) · Sangat Baik(4). Pakai role="radiogroup" + navigasi panah kiri/kanan (a11y). /

### `LegendaSkor`

Jenis: **fungsi**

Legenda skor untuk header tabel.

## Berkas lain di proyek ini yang dipanggil

- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/penilaian.ts`](./lib__utils__penilaian.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/penilaian/butir/[kode]/ButirPenilaianClient.tsx`](./app__-dashboard-__penilaian__butir__-kode-__ButirPenilaianClient.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__KriteriaPenilaianClient.md)

