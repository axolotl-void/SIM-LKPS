# `lib/notifikasi-internal.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 124 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 5 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `createNotification`, `notifyMutation`.

## Letak berkas

Dari akar repo: `lib/notifikasi-internal.ts`.

## Isi yang bisa dipakai berkas lain

### `createNotification`

Jenis: **fungsi async**

Buat satu notifikasi. CATATAN: ini helper internal, bukan pintu publik. Kalau nanti butuh memanggilnya dari client, jangan buka kembali sebagai server action bikin aksi terpisah yang memeriksa izin dan mengunci penerimanya. /

### `notifyMutation`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `@prisma/client`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`lib/actions/evidence.ts`](./lib__actions__evidence.md)
- [`lib/actions/lkps.ts`](./lib__actions__lkps.md)
- [`lib/actions/mahasiswa.ts`](./lib__actions__mahasiswa.md)
- [`lib/actions/matakuliah.ts`](./lib__actions__matakuliah.md)
- [`lib/actions/user.ts`](./lib__actions__user.md)

