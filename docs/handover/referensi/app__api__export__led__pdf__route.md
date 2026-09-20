# `app/api/export/led/pdf/route.ts`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 89 baris |
| **Jenis** | modul biasa |
| **Alamat URL** | `/api/export/led/pdf` |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Berkas API untuk alamat `/api/export/led/pdf`. Di sinilah permintaan dari browser diproses dan jawabannya disusun.

## Letak berkas

Dari akar repo: `app/api/export/led/pdf/route.ts`.

## Isi yang bisa dipakai berkas lain

### `runtime`

Jenis: **konstanta**

### `maxDuration`

Jenis: **konstanta**

Dokumen panjang butuh waktu; Vercel Hobby default 10s.

### `GET`

Jenis: **fungsi async**

GET /api/export/led/pdf?tahun=<id> Membuat PDF LED. Helvetica (metrik terdekat Arial) — PDF standar tidak menyertakan Arial, dan menanam font akan membengkakkan bundle serverless. /

## Alamat yang dilayani

Halaman ini bisa dibuka di `/api/export/led/pdf`.

Kalau mau mengubah apa yang tampil di alamat itu, **berkas ini yang pertama dibuka**.

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/server`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/export/led-dokumen.ts`](./lib__export__led-dokumen.md)
- [`lib/export/led-pdf.tsx`](./lib__export__led-pdf.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)
- [`lib/utils/led-export-query.ts`](./lib__utils__led-export-query.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

