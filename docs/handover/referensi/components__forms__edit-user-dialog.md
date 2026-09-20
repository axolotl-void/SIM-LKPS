# `components/forms/edit-user-dialog.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 275 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `EditUserDialog`.

## Letak berkas

Dari akar repo: `components/forms/edit-user-dialog.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `EditableUser`

Jenis: **interface**

### `EditUserDialog`

Jenis: **fungsi**

## Pustaka luar yang dipakai

- `lucide-react`
- `next/navigation`
- `react`

## Berkas lain di proyek ini yang dipanggil

- [`lib/actions/user.ts`](./lib__actions__user.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/tables/user-table.tsx`](./components__tables__user-table.md)

