# `components/penilaian/KriteriaBreakdown.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 129 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `KriteriaBreakdown`, `KartuKriteriaRingkas`.

## Letak berkas

Dari akar repo: `components/penilaian/KriteriaBreakdown.tsx`.

## Isi yang bisa dipakai berkas lain

### `KriteriaBreakdown`

Jenis: **fungsi**

Bar per kriteria + rerata tertimbang. Ambient warna: merah <3,00 · amber 3,00–3,19 · hijau ≥3,20. Kriteria kunci (C1–C3) diberi penanda karena menentukan gelar Unggul. /

### `KartuKriteriaRingkas`

Jenis: **fungsi**

Grid kartu ringkas per kriteria (dipakai di halaman kriteria).

## Pustaka luar yang dipakai

- `lucide-react`
- `next/link`

## Berkas lain di proyek ini yang dipanggil

- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/penilaian.ts`](./lib__utils__penilaian.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/penilaian/page.tsx`](./app__-dashboard-__penilaian__page.md)

