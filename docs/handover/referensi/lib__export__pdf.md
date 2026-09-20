# `lib/export/pdf.tsx`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 399 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

PDF Export Module Generates PDF files using @react-pdf/renderer (pure JS, serverless-ready). Replaces the previous Playwright/Chromium approach which fails on Vercel Lambda because Chromium requires system libraries that are not present in the Vercel serverless image. /

## Letak berkas

Dari akar repo: `lib/export/pdf.tsx`.

## Isi yang bisa dipakai berkas lain

### `generatePDFDocument`

Jenis: **fungsi async**

### `generateSingleTablePDF`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `@react-pdf/renderer`

## Berkas lain di proyek ini yang dipanggil

- [`lib/export/helpers.ts`](./lib__export__helpers.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/route.ts`](./app__api__export__route.md)

