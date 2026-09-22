# `lib/auth.config.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 69 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 2 berkas |

## Maksud berkas

Berkas ini berisi 1 deklarasi: `authConfig`.

## Letak berkas

Dari akar repo: `lib/auth.config.ts`.

## Isi yang bisa dipakai berkas lain

### `authConfig`

Jenis: **konstanta**

Konfigurasi autentikasi yang aman untuk Edge runtime. MENGAPA DIPISAH DARI `lib/auth.ts`: `middleware.ts` berjalan di Edge runtime, yang tidak bisa memuat Prisma, bcrypt, atau modul Node apa pun. Kalau middleware mengimpor `lib/auth.ts` (yang berisi PrismaAdapter + bcrypt), build akan gagal. Berkas ini karena itu HANYA memuat hal-hal yang bisa jalan di Edge: pengaturan cookie, durasi sesi, dan cal

## Pustaka luar yang dipakai

- `@prisma/client`
- `next-auth`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`lib/auth.ts`](./lib__auth.md)
- [`middleware.ts`](./middleware.md)

