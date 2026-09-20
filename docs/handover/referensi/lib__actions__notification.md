# `lib/actions/notification.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 129 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 6 berkas |

## Maksud berkas

Berkas ini menyediakan 4 fungsi utama: `createNotification`, `notifyMutation`, `markNotificationAsRead`, `markAllNotificationsAsRead`.

## Letak berkas

Dari akar repo: `lib/actions/notification.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `createNotification`

Jenis: **fungsi async**

### `notifyMutation`

Jenis: **fungsi async**

### `markNotificationAsRead`

Jenis: **fungsi async**

### `markAllNotificationsAsRead`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/layout/NotificationBell.tsx`](./components__layout__NotificationBell.md)
- [`lib/actions/evidence.ts`](./lib__actions__evidence.md)
- [`lib/actions/lkps.ts`](./lib__actions__lkps.md)
- [`lib/actions/mahasiswa.ts`](./lib__actions__mahasiswa.md)
- [`lib/actions/matakuliah.ts`](./lib__actions__matakuliah.md)
- [`lib/actions/user.ts`](./lib__actions__user.md)

