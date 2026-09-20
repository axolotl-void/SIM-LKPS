# `lib/export/led-docx.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 493 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 2 berkas |

## Maksud berkas

Pembangun Word (`.docx`) untuk dokumen LED. Format mengikuti Lampiran 2 Instrumen LED LAM INFOKOM 2.1: A4, Arial 11 pt, spasi 1,15, margin 3 cm, nomor halaman di footer. Memakai library `docx` (sudah dipakai modul export LKPS) — TIDAK memakai Playwright/Chromium karena gagal di Vercel (lihat RANCANGAN-005). /

## Letak berkas

Dari akar repo: `lib/export/led-docx.ts`.

## Isi yang bisa dipakai berkas lain

### `MetaLed`

Jenis: **tipe**

### `buildLedDocx`

Jenis: **fungsi async**

Bangun dokumen Word lengkap. Mengembalikan Buffer siap kirim. Tidak menyentuh DB — pemanggil yang menyiapkan `bagian` (lihat `lib/utils/led-export-query.ts`). /

## Pustaka luar yang dipakai

- `docx`

## Berkas lain di proyek ini yang dipanggil

- [`components/led/types.ts`](./components__led__types.md)
- [`lib/export/led-dokumen.ts`](./lib__export__led-dokumen.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/led/word/route.ts`](./app__api__export__led__word__route.md)
- [`lib/export/led-pdf.tsx`](./lib__export__led-pdf.md)

