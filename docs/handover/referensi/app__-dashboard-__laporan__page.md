# `app/(dashboard)/laporan/page.tsx`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 107 baris |
| **Jenis** | modul biasa |
| **Alamat URL** | `/laporan` |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Berkas halaman untuk alamat `/laporan`. Tugasnya menyiapkan data di server (dan memeriksa izin), lalu menyerahkan tampilan ke komponen client. Isinya dirender oleh `app/(dashboard)/laporan/LaporanClient`.

## Letak berkas

Dari akar repo: `app/(dashboard)/laporan/page.tsx`.

## Isi yang bisa dipakai berkas lain

### `metadata`

Jenis: **konstanta**

### `LaporanPage`

Jenis: **default**

## Alamat yang dilayani

Halaman ini bisa dibuka di `/laporan`.

Kalau mau mengubah apa yang tampil di alamat itu, **berkas ini yang pertama dibuka**.

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/navigation`

## Berkas lain di proyek ini yang dipanggil

- [`app/(dashboard)/laporan/LaporanClient.tsx`](./app__-dashboard-__laporan__LaporanClient.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)

