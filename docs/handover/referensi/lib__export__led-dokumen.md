# `lib/export/led-dokumen.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 390 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 6 berkas |

## Maksud berkas

Lapisan dokumen LED — MURNI, tanpa DB/React. Mengubah daftar bagian LED + narasi Markdown menjadi urutan simpul dokumen yang siap dicetak. Dipakai bersama oleh pembangun Word (`led-docx.ts`) dan PDF (`led-pdf.tsx`), jadi urutan bagian & aturan kelengkapan hanya ditulis sekali di sini. Urutan mengikuti Lampiran 1/2 Instrumen LED LAM INFOKOM 2.1: Ringkasan Eksekutif → BAB I → BAB II (A, B, C.1–C.6, D) → BAB III /

## Letak berkas

Dari akar repo: `lib/export/led-dokumen.ts`.

## Isi yang bisa dipakai berkas lain

### `Blok`

Jenis: **tipe**

Blok Markdown

### `parseMarkdownBlok`

Jenis: **fungsi**

Parse Markdown jadi blok. Sengaja sebaris dengan renderer pratinjau (`lib/utils/markdown.tsx`) supaya apa yang dilihat di editor sama dengan apa yang tercetak. /

### `Potongan`

Jenis: **tipe**

Teks inline (bold/italic/code) → potongan berformat

### `pecahInline`

Jenis: **fungsi**

Pecah teks inline jadi potongan berformat, untuk TextRun/Text dokumen.

### `sanitasiTeks`

Jenis: **fungsi**

Bersihkan karakter yang tidak ada di Arial/Helvetica dan bikin rusak di dokumen resmi (emoji, simbol aneh). Tanda baca tipografis dinormalkan. /

### `ringkasBlok`

Jenis: **fungsi**

Ringkas blok jadi satu kalimat — dipakai untuk daftar isi & pratinjau.

### `SimpulDokumen`

Jenis: **tipe**

Struktur dokumen

### `JUDUL_BAB`

Jenis: **konstanta**

### `susunDokumenLed`

Jenis: **fungsi**

Susun urutan dokumen dari bagian LED terurut. Simpul "kelompok" hanya muncul untuk BAB II (A/B/C/D) — struktur itu yang dipakai instrumen, dan tanpa itu dokumen jadi daftar panjang tanpa peta. /

### `labelBagian`

Jenis: **fungsi**

"BAB2.C.2.1.A" → "C.2.1.A" — nomor bagian tanpa awalan BAB.

### `BagianKosong`

Jenis: **tipe**

Pra-export

### `HasilPraExport`

Jenis: **tipe**

### `BATAS_HALAMAN_LED`

Jenis: **konstanta**

### `KARAKTER_PER_HALAMAN`

Jenis: **konstanta**

### `periksaPraExport`

Jenis: **fungsi**

Periksa kelengkapan & estimasi halaman sebelum dokumen dibuat.

### `namaBerkasLed`

Jenis: **fungsi**

Nama berkas unduhan: LED_<prodi>_<tahun>-<semester>_<tanggal>.<ext>

## Berkas lain di proyek ini yang dipanggil

- [`components/led/types.ts`](./components__led__types.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/led/pdf/route.ts`](./app__api__export__led__pdf__route.md)
- [`app/api/export/led/word/route.ts`](./app__api__export__led__word__route.md)
- [`lib/export/led-docx.ts`](./lib__export__led-docx.md)
- [`lib/export/led-pdf.tsx`](./lib__export__led-pdf.md)
- [`lib/utils/led-export-query.ts`](./lib__utils__led-export-query.md)
- [`tests/unit/led-dokumen.test.ts`](./tests__unit__led-dokumen.test.md)

