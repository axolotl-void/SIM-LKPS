# `lib/export/helpers.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 187 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 4 berkas |

## Maksud berkas

Export Helper Functions Shared data fetching for Excel, Word, PDF exports /

## Letak berkas

Dari akar repo: `lib/export/helpers.ts`.

## Isi yang bisa dipakai berkas lain

### `ColumnDef`

Jenis: **interface**

### `RowData`

Jenis: **interface**

### `TableData`

Jenis: **interface**

### `getTableDataForExport`

Jenis: **fungsi async**

Get single table data for export /

### `getBabDataForExport`

Jenis: **fungsi async**

Get all tables data for a specific BAB /

### `getAllTablesDataForExport`

Jenis: **fungsi async**

Get all tables data for export (full report) /

### `getActiveTahunAkademik`

Jenis: **fungsi async**

Get active tahun akademik /

### `STATUS_LABELS`

Jenis: **konstanta**

Status label mapping /

## Pustaka luar yang dipakai

- `@prisma/client`

## Berkas lain di proyek ini yang dipanggil

- [`lib/db.ts`](./lib__db.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/route.ts`](./app__api__export__route.md)
- [`lib/export/excel.ts`](./lib__export__excel.md)
- [`lib/export/pdf.tsx`](./lib__export__pdf.md)
- [`lib/export/word.ts`](./lib__export__word.md)

