# `lib/actions/matakuliah.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 109 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 2 berkas |

## Maksud berkas

Berkas ini menyediakan 3 fungsi utama: `createMatakuliah`, `updateMatakuliah`, `deleteMatakuliah`.

## Letak berkas

Dari akar repo: `lib/actions/matakuliah.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `createMatakuliah`

Jenis: **fungsi async**

### `updateMatakuliah`

Jenis: **fungsi async**

### `deleteMatakuliah`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/actions/notification.ts`](./lib__actions__notification.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/master/mata-kuliah/MataKuliahActions.tsx`](./app__-dashboard-__master__mata-kuliah__MataKuliahActions.md)
- [`app/(dashboard)/master/mata-kuliah/MataKuliahForm.tsx`](./app__-dashboard-__master__mata-kuliah__MataKuliahForm.md)

