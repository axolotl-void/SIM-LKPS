# `lib/export/led-pdf.tsx`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 277 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Pembangun PDF untuk dokumen LED. Memakai `@react-pdf/renderer` (JS murni) — bukan Playwright/Chromium, yang gagal di Vercel Lambda (lihat RANCANGAN-005). Catatan font: PDF standar tidak menyertakan Arial. Dipakai **Helvetica**, metrik paling dekat dengan Arial, supaya tanpa menanam berkas font ke dalam bundle serverless. Dokumen Word tetap memakai Arial sungguhan. /

## Letak berkas

Dari akar repo: `lib/export/led-pdf.tsx`.

## Isi yang bisa dipakai berkas lain

### `buildLedPdf`

Jenis: **fungsi async**

Bangun dokumen PDF LED. Mengembalikan Buffer siap kirim.

## Pustaka luar yang dipakai

- `@react-pdf/renderer`

## Berkas lain di proyek ini yang dipanggil

- [`components/led/types.ts`](./components__led__types.md)
- [`lib/export/led-docx.ts`](./lib__export__led-docx.md)
- [`lib/export/led-dokumen.ts`](./lib__export__led-dokumen.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/led/pdf/route.ts`](./app__api__export__led__pdf__route.md)

