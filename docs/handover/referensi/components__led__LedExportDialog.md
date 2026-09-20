# `components/led/LedExportDialog.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 307 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `LedExportDialog`.

## Letak berkas

Dari akar repo: `components/led/LedExportDialog.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `RingkasExport`

Jenis: **tipe**

### `LedExportDialog`

Jenis: **fungsi**

Dialog unduh LED: pratinjau kelengkapan + tombol Word/PDF.

## Pustaka luar yang dipakai

- `lucide-react`
- `next/link`
- `react`

## Berkas lain di proyek ini yang dipanggil

- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/led-rute.ts`](./lib__utils__led-rute.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/export/page.tsx`](./app__-dashboard-__led__export__page.md)

