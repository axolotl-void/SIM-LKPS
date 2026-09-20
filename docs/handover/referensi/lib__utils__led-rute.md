# `lib/utils/led-rute.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 19 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 2 berkas |

## Maksud berkas

Pemetaan kode bagian LED → rute halaman editornya. Dipakai untuk menautkan daftar bagian kosong di dialog export ke tempat pengisiannya, tanpa harus menyimpan rute di DB. /

## Letak berkas

Dari akar repo: `lib/utils/led-rute.ts`.

## Isi yang bisa dipakai berkas lain

### `ruteBagianLed`

Jenis: **fungsi**

Pemetaan kode bagian LED → rute halaman editornya. Dipakai untuk menautkan daftar bagian kosong di dialog export ke tempat pengisiannya, tanpa harus menyimpan rute di DB. /

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/led/LedExportDialog.tsx`](./components__led__LedExportDialog.md)
- [`lib/actions/led.ts`](./lib__actions__led.md)

