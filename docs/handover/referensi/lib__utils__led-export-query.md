# `lib/utils/led-export-query.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 50 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 3 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `siapkanExportLed`, `daftarTahunAkademik`.

## Letak berkas

Dari akar repo: `lib/utils/led-export-query.ts`.

## Isi yang bisa dipakai berkas lain

### `ikutkanBagianKosong`

Jenis: **konstanta**

Query khusus export LED. Hanya bagian yang punya isi yang diikutkan ke dokumen — bagian kosong tetap dilaporkan lewat pra-export check, tapi tidak dicetak sebagai halaman "[belum diisi]" sebanyak 92 kali. /

### `KonteksExportLed`

Jenis: **tipe**

### `siapkanExportLed`

Jenis: **fungsi async**

Ambil tahun akademik (aktif atau yang diminta) + semua bagian LED-nya.

### `daftarTahunAkademik`

Jenis: **fungsi async**

Daftar tahun akademik untuk pemilih di halaman export.

## Berkas lain di proyek ini yang dipanggil

- [`lib/db.ts`](./lib__db.md)
- [`lib/export/led-dokumen.ts`](./lib__export__led-dokumen.md)
- [`lib/utils/led-query.ts`](./lib__utils__led-query.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/export/page.tsx`](./app__-dashboard-__led__export__page.md)
- [`app/api/export/led/pdf/route.ts`](./app__api__export__led__pdf__route.md)
- [`app/api/export/led/word/route.ts`](./app__api__export__led__word__route.md)

