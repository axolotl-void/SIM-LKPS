# `lib/utils/db-retry.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 65 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 3 berkas |

## Maksud berkas

Retry untuk operasi database yang gagal karena gangguan koneksi sesaat. Database produksi ada di Neon (serverless). Compute-nya bisa "tidur" dan bangun lagi saat ada request, dan proses bangun itu kadang gagal di percobaan pertama. Tanpa retry, kegagalan sesaat ini sampai ke pengguna sebagai error yang menyesatkan (mis. "kredensial salah" padahal bukan). /

## Letak berkas

Dari akar repo: `lib/utils/db-retry.ts`.

## Isi yang bisa dipakai berkas lain

### `isTransientDbError`

Jenis: **fungsi**

Apakah error ini termasuk gangguan koneksi yang layak dicoba ulang?

### `withDbRetry`

Jenis: **fungsi async**

Jalankan `fn`, ulangi kalau gagal karena gangguan koneksi. Error selain gangguan koneksi langsung dilempar (tidak diulang). /

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`lib/actions/auth.ts`](./lib__actions__auth.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`tests/db-retry.test.ts`](./tests__db-retry.test.md)

