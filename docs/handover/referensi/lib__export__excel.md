# `lib/export/excel.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 341 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Excel Export Module Generates Excel (.xlsx) files using ExcelJS Single sheet, all tables grouped by BAB with proper spacing and styling /

## Letak berkas

Dari akar repo: `lib/export/excel.ts`.

## Isi yang bisa dipakai berkas lain

### `generateExcelWorkbook`

Jenis: **fungsi async**

Generate Excel workbook from table data Single sheet containing all tables grouped by BAB with proper spacing /

### `generateSingleTableExcel`

Jenis: **fungsi async**

Generate Excel for a single table /

## Pustaka luar yang dipakai

- `exceljs`

## Berkas lain di proyek ini yang dipanggil

- [`lib/export/helpers.ts`](./lib__export__helpers.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/route.ts`](./app__api__export__route.md)

