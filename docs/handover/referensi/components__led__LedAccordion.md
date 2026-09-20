# `components/led/LedAccordion.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 89 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 6 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `LedAccordion`, `LedBagianList`.

## Letak berkas

Dari akar repo: `components/led/LedAccordion.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `LedAccordion`

Jenis: **fungsi**

Accordion per tahap PPEPP (dipakai di halaman kriteria).

### `LedBagianList`

Jenis: **fungsi**

Daftar datar butir LED (tanpa accordion) — untuk BAB I, III, Kondisi Eksternal, Profil, Suplemen.

## Pustaka luar yang dipakai

- `lucide-react`
- `react`

## Berkas lain di proyek ini yang dipanggil

- [`components/led/LedButirKartu.tsx`](./components__led__LedButirKartu.md)
- [`components/led/types.ts`](./components__led__types.md)
- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/led-progress.ts`](./lib__utils__led-progress.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/bab-1/page.tsx`](./app__-dashboard-__led__bab-1__page.md)
- [`app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx`](./app__-dashboard-__led__bab-2__kondisi-eksternal__page.md)
- [`app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx`](./app__-dashboard-__led__bab-2__kriteria__-nomor-__page.md)
- [`app/(dashboard)/led/bab-2/profil/page.tsx`](./app__-dashboard-__led__bab-2__profil__page.md)
- [`app/(dashboard)/led/bab-2/suplemen/page.tsx`](./app__-dashboard-__led__bab-2__suplemen__page.md)
- [`app/(dashboard)/led/bab-3/page.tsx`](./app__-dashboard-__led__bab-3__page.md)

