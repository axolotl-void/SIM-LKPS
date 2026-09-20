# `prisma/seed-led.ts`

| | |
|---|---|
| **Area** | Skema & Seed Basis Data |
| **Ukuran** | 177 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 2 berkas |

## Maksud berkas

Seed modul LED + Matriks Penilaian — LAM INFOKOM 2.1 Modul terpisah dari seed LKPS supaya tidak mengganggu data lama. ATURAN KERAS: HANYA `upsert`. Dilarang `deleteMany` — `LedIsian` bisa berisi narasi yang sudah diketik user dan akan hancur kalau dihapus. Sumber data: - seed-data/led-bagian.json      → 92 bagian LED (17 non-kriteria + 75 butir kriteria) - seed-data/butir-penilaian.json → 82 butir matriks penilaian, total bobot 400 /

## Letak berkas

Dari akar repo: `prisma/seed-led.ts`.

## Isi yang bisa dipakai berkas lain

### `seedLedDanPenilaian`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `@prisma/client`
- `node:fs`
- `node:path`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`prisma/seed-modul-baru.ts`](./prisma__seed-modul-baru.md)
- [`prisma/seed.ts`](./prisma__seed.md)

