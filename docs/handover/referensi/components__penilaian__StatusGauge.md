# `components/penilaian/StatusGauge.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 136 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `StatusGauge`.

## Letak berkas

Dari akar repo: `components/penilaian/StatusGauge.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `StatusGauge`

Jenis: **fungsi**

Gauge nilai akhir 0–400 dengan 3 zona ambang resmi §V: merah <200 · amber 200–320 · hijau ≥321. /

## Pustaka luar yang dipakai

- `lucide-react`

## Berkas lain di proyek ini yang dipanggil

- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/penilaian.ts`](./lib__utils__penilaian.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/penilaian/page.tsx`](./app__-dashboard-__penilaian__page.md)

