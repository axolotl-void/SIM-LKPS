# `lib/actions/user.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 279 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 4 berkas |

## Maksud berkas

Berkas ini menyediakan 5 fungsi utama: `getUsers`, `createUser`, `updateUser`, `deleteUser`, `resetUserPassword`.

## Letak berkas

Dari akar repo: `lib/actions/user.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `getUsers`

Jenis: **fungsi async**

Get all users (paginated) /

### `createUser`

Jenis: **fungsi async**

Create a new user /

### `updateUser`

Jenis: **fungsi async**

Update a user /

### `deleteUser`

Jenis: **fungsi async**

Delete a user permanently (hard delete). Blocked when the user still owns data referenced by other tables (submitted/validated LKPS, uploaded evidence). User must reassign or remove those records first. /

### `resetUserPassword`

Jenis: **fungsi async**

Reset user password /

## Pustaka luar yang dipakai

- `@prisma/client`
- `bcryptjs`
- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/actions/notification.ts`](./lib__actions__notification.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)
- [`lib/validations/auth.ts`](./lib__validations__auth.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/settings/users/page.tsx`](./app__-dashboard-__settings__users__page.md)
- [`components/forms/create-user-dialog.tsx`](./components__forms__create-user-dialog.md)
- [`components/forms/delete-user-dialog.tsx`](./components__forms__delete-user-dialog.md)
- [`components/forms/edit-user-dialog.tsx`](./components__forms__edit-user-dialog.md)

