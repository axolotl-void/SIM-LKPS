# `app/(dashboard)/settings/users/page.tsx`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 92 baris |
| **Jenis** | modul biasa |
| **Alamat URL** | `/settings/users` |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Berkas halaman untuk alamat `/settings/users`. Tugasnya menyiapkan data di server (dan memeriksa izin), lalu menyerahkan tampilan ke komponen client.

## Letak berkas

Dari akar repo: `app/(dashboard)/settings/users/page.tsx`.

## Isi yang bisa dipakai berkas lain

### `metadata`

Jenis: **konstanta**

### `UsersPage`

Jenis: **default**

## Alamat yang dilayani

Halaman ini bisa dibuka di `/settings/users`.

Kalau mau mengubah apa yang tampil di alamat itu, **berkas ini yang pertama dibuka**.

## Pustaka luar yang dipakai

- `@prisma/client`
- `lucide-react`
- `next`
- `next/navigation`

## Berkas lain di proyek ini yang dipanggil

- [`components/forms/create-user-dialog.tsx`](./components__forms__create-user-dialog.md)
- [`components/shared/error-boundary.tsx`](./components__shared__error-boundary.md)
- [`components/shared/permission-gate.tsx`](./components__shared__permission-gate.md)
- [`components/tables/user-table.tsx`](./components__tables__user-table.md)
- [`lib/actions/user.ts`](./lib__actions__user.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

