# `components/tables/user-table.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 192 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `UserTable`.

## Letak berkas

Dari akar repo: `components/tables/user-table.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `UserTable`

Jenis: **fungsi**

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/link`
- `next/navigation`

## Berkas lain di proyek ini yang dipanggil

- [`components/forms/delete-user-dialog.tsx`](./components__forms__delete-user-dialog.md)
- [`components/forms/edit-user-dialog.tsx`](./components__forms__edit-user-dialog.md)
- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/settings/users/page.tsx`](./app__-dashboard-__settings__users__page.md)

