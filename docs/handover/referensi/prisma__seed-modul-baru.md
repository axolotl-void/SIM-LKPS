# `prisma/seed-modul-baru.ts`

| | |
|---|---|
| **Area** | Skema & Seed Basis Data |
| **Ukuran** | 28 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Entry point khusus modul LED + Matriks Penilaian. Dipakai untuk mengisi DB yang SUDAH ADA ISINYA tanpa menjalankan ulang seluruh seed LKPS. Semua operasi `upsert` — idempoten, tidak menghapus apa pun. pnpm tsx prisma/seed-modul-baru.ts /

## Letak berkas

Dari akar repo: `prisma/seed-modul-baru.ts`.

## Pustaka luar yang dipakai

- `@prisma/client`

## Berkas lain di proyek ini yang dipanggil

- [`prisma/seed-led.ts`](./prisma__seed-led.md)

