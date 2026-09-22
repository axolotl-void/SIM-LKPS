# `lib/actions/notification.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 48 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `markNotificationAsRead`, `markAllNotificationsAsRead`.

## Letak berkas

Dari akar repo: `lib/actions/notification.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `markNotificationAsRead`

Jenis: **fungsi async**

Aksi notifikasi yang memang perlu dipanggil dari client. `createNotification` dan `notifyMutation` SENGAJA TIDAK ada di sini. Dulu keduanya server action di berkas ini, sehingga siapa pun yang login bisa memanggil `createNotification({ userId: "<orang lain>", ... })` langsung dari browser. Keduanya sekarang tinggal di `@/lib/notifikasi-internal` yang tidak punya direktif "use server". /

### `markAllNotificationsAsRead`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/layout/NotificationBell.tsx`](./components__layout__NotificationBell.md)

