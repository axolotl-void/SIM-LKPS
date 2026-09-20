# `lib/export/word.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 395 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Word Export Module Generates Word (.docx) files using docx library Single document with all tables grouped by BAB with color coding /

## Letak berkas

Dari akar repo: `lib/export/word.ts`.

## Isi yang bisa dipakai berkas lain

### `generateWordDocument`

Jenis: **fungsi async**

Generate Word document from table data /

### `generateSingleTableWord`

Jenis: **fungsi async**

Generate Word document for a single table /

## Pustaka luar yang dipakai

- `docx`

## Berkas lain di proyek ini yang dipanggil

- [`lib/export/helpers.ts`](./lib__export__helpers.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/route.ts`](./app__api__export__route.md)

