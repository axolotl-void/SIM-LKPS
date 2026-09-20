# `app/(dashboard)/dashboard/page.tsx`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 167 baris |
| **Jenis** | modul biasa |
| **Alamat URL** | `/dashboard` |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Berkas halaman untuk alamat `/dashboard`. Tugasnya menyiapkan data di server (dan memeriksa izin), lalu menyerahkan tampilan ke komponen client. Isinya dirender oleh `app/(dashboard)/dashboard/DashboardClient`.

## Letak berkas

Dari akar repo: `app/(dashboard)/dashboard/page.tsx`.

## Isi yang bisa dipakai berkas lain

### `metadata`

Jenis: **konstanta**

### `DashboardPage`

Jenis: **default**

## Alamat yang dilayani

Halaman ini bisa dibuka di `/dashboard`.

Kalau mau mengubah apa yang tampil di alamat itu, **berkas ini yang pertama dibuka**.

## Pustaka luar yang dipakai

- `@prisma/client`
- `next`
- `next/navigation`

## Berkas lain di proyek ini yang dipanggil

- [`app/(dashboard)/dashboard/DashboardClient.tsx`](./app__-dashboard-__dashboard__DashboardClient.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

