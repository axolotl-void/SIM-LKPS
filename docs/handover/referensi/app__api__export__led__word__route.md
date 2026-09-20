# `app/api/export/led/word/route.ts`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 91 baris |
| **Jenis** | modul biasa |
| **Alamat URL** | `/api/export/led/word` |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Berkas API untuk alamat `/api/export/led/word`. Di sinilah permintaan dari browser diproses dan jawabannya disusun.

## Letak berkas

Dari akar repo: `app/api/export/led/word/route.ts`.

## Isi yang bisa dipakai berkas lain

### `runtime`

Jenis: **konstanta**

### `maxDuration`

Jenis: **konstanta**

Dokumen panjang butuh waktu; Vercel Hobby default 10s.

### `GET`

Jenis: **fungsi async**

GET /api/export/led/word?tahun=<id> Membuat `.docx` LED (A4, Arial 11, spasi 1,15). Tanpa parameter `tahun`, memakai tahun akademik aktif. /

## Alamat yang dilayani

Halaman ini bisa dibuka di `/api/export/led/word`.

Kalau mau mengubah apa yang tampil di alamat itu, **berkas ini yang pertama dibuka**.

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/server`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/export/led-docx.ts`](./lib__export__led-docx.md)
- [`lib/export/led-dokumen.ts`](./lib__export__led-dokumen.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)
- [`lib/utils/led-export-query.ts`](./lib__utils__led-export-query.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

