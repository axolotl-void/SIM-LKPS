# `app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 145 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `KriteriaPenilaianClient`.

## Letak berkas

Dari akar repo: `app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `KriteriaPenilaianClient`

Jenis: **fungsi**

Tabel butir satu kriteria dengan pemilih skor. Skor disimpan per butir (bukan sekali submit semua) supaya aman kalau jaringan putus di tengah pengisian. /

## Pustaka luar yang dipakai

- `lucide-react`
- `next/link`
- `react`

## Berkas lain di proyek ini yang dipanggil

- [`components/penilaian/SkorSelector.tsx`](./components__penilaian__SkorSelector.md)
- [`lib/actions/penilaian.ts`](./lib__actions__penilaian.md)
- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/penilaian-query.ts`](./lib__utils__penilaian-query.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__page.md)

