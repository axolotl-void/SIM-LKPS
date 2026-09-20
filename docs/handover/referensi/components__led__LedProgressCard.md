# `components/led/LedProgressCard.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 145 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 3 fungsi utama: `LedProgressCard`, `LedBatasBanner`, `LedBelumDiSeed`.

## Letak berkas

Dari akar repo: `components/led/LedProgressCard.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `KartuLed`

Jenis: **tipe**

### `LedProgressCard`

Jenis: **fungsi**

Kartu progres untuk satu bagian LED (pola kartu kanonik LKPS, aksen slate).

### `LedBatasBanner`

Jenis: **fungsi**

Banner peringatan saat estimasi halaman melewati batas Lampiran 2.

### `LedBelumDiSeed`

Jenis: **fungsi**

Placeholder saat struktur LED belum di-seed.

## Pustaka luar yang dipakai

- `@prisma/client`
- `lucide-react`
- `next/link`
- `react`

## Berkas lain di proyek ini yang dipanggil

- [`components/led/ikon.ts`](./components__led__ikon.md)
- [`components/led/status.ts`](./components__led__status.md)
- [`lib/utils/format.ts`](./lib__utils__format.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/page.tsx`](./app__-dashboard-__led__page.md)

