# `lib/actions/lkps.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 559 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 35 berkas |

## Maksud berkas

Berkas ini menyediakan 7 fungsi utama: `upsertLkpsRow`, `deleteLkpsRow`, `submitLkpsTabel`, `validateLkpsTabel`, `createDosen`, `updateDosen`, `deleteDosen`.

## Letak berkas

Dari akar repo: `lib/actions/lkps.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `upsertLkpsRow`

Jenis: **fungsi async**

UPSERT / DELETE ROWS

### `deleteLkpsRow`

Jenis: **fungsi async**

### `submitLkpsTabel`

Jenis: **fungsi async**

SUBMIT — Operator mengirim tabel untuk divalidasi

### `validateLkpsTabel`

Jenis: **fungsi async**

VALIDATE — Validator menyetujui/menolak/meminta revisi

### `createDosen`

Jenis: **fungsi async**

### `updateDosen`

Jenis: **fungsi async**

### `deleteDosen`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/actions/notification.ts`](./lib__actions__notification.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)
- [`lib/utils/kriteria.ts`](./lib__utils__kriteria.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/master/dosen/DosenActions.tsx`](./app__-dashboard-__master__dosen__DosenActions.md)
- [`components/tables/tabel-1a1-client.tsx`](./components__tables__tabel-1a1-client.md)
- [`components/tables/tabel-1a2-client.tsx`](./components__tables__tabel-1a2-client.md)
- [`components/tables/tabel-1a3-client.tsx`](./components__tables__tabel-1a3-client.md)
- [`components/tables/tabel-1a4-client.tsx`](./components__tables__tabel-1a4-client.md)
- [`components/tables/tabel-1a5-client.tsx`](./components__tables__tabel-1a5-client.md)
- [`components/tables/tabel-1b-client.tsx`](./components__tables__tabel-1b-client.md)
- [`components/tables/tabel-2a1-client.tsx`](./components__tables__tabel-2a1-client.md)
- [`components/tables/tabel-2a2-client.tsx`](./components__tables__tabel-2a2-client.md)
- [`components/tables/tabel-2a3-client.tsx`](./components__tables__tabel-2a3-client.md)
- [`components/tables/tabel-2b1-client.tsx`](./components__tables__tabel-2b1-client.md)
- [`components/tables/tabel-2b2-client.tsx`](./components__tables__tabel-2b2-client.md)
- [`components/tables/tabel-2b3-client.tsx`](./components__tables__tabel-2b3-client.md)
- [`components/tables/tabel-2b4-client.tsx`](./components__tables__tabel-2b4-client.md)
- [`components/tables/tabel-2b5-client.tsx`](./components__tables__tabel-2b5-client.md)
- [`components/tables/tabel-2b6-client.tsx`](./components__tables__tabel-2b6-client.md)
- [`components/tables/tabel-2c-client.tsx`](./components__tables__tabel-2c-client.md)
- [`components/tables/tabel-2d-client.tsx`](./components__tables__tabel-2d-client.md)
- [`components/tables/tabel-3a1-client.tsx`](./components__tables__tabel-3a1-client.md)
- [`components/tables/tabel-3a2-client.tsx`](./components__tables__tabel-3a2-client.md)
- [`components/tables/tabel-3a3-client.tsx`](./components__tables__tabel-3a3-client.md)
- [`components/tables/tabel-3c1-client.tsx`](./components__tables__tabel-3c1-client.md)
- [`components/tables/tabel-3c2-client.tsx`](./components__tables__tabel-3c2-client.md)
- [`components/tables/tabel-3c3-client.tsx`](./components__tables__tabel-3c3-client.md)
- [`components/tables/tabel-4a1-client.tsx`](./components__tables__tabel-4a1-client.md)
- [`components/tables/tabel-4a2-client.tsx`](./components__tables__tabel-4a2-client.md)
- [`components/tables/tabel-4c1-client.tsx`](./components__tables__tabel-4c1-client.md)
- [`components/tables/tabel-4c2-client.tsx`](./components__tables__tabel-4c2-client.md)
- [`components/tables/tabel-4c3-client.tsx`](./components__tables__tabel-4c3-client.md)
- [`components/tables/tabel-51-client.tsx`](./components__tables__tabel-51-client.md)
- [`components/tables/tabel-52-client.tsx`](./components__tables__tabel-52-client.md)
- [`components/tables/tabel-6-client.tsx`](./components__tables__tabel-6-client.md)
- [`components/tables/tabel-61-client.tsx`](./components__tables__tabel-61-client.md)
- [`components/tables/tabel-62-client.tsx`](./components__tables__tabel-62-client.md)
- [`components/tables/validation-controls.tsx`](./components__tables__validation-controls.md)

