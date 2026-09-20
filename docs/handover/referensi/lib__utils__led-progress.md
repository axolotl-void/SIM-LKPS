# `lib/utils/led-progress.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 138 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 7 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `hitungProgres`, `estimasiHalaman`.

## Letak berkas

Dari akar repo: `lib/utils/led-progress.ts`.

## Isi yang bisa dipakai berkas lain

### `KARAKTER_PER_HALAMAN`

Jenis: **konstanta**

Estimasi halaman LED. Lampiran 2 Instrumen LED: A4, Arial 11, spasi 1,15, maksimum 150 halaman. Pada setelan itu satu halaman A4 menampung ±3.000 karakter teks mengalir. Angka ini PERKIRAAN — dipakai sebagai indikator, bukan patokan mutlak. /

### `BATAS_HALAMAN_LED`

Jenis: **konstanta**

Batas total halaman LED (Lampiran 2).

### `BATAS_KARAKTER_PER_BAGIAN`

Jenis: **konstanta**

Batas karakter per bagian — menjaga editor tetap responsif.

### `RingkasanIsian`

Jenis: **tipe**

### `ProgresLed`

Jenis: **tipe**

### `hitungProgres`

Jenis: **fungsi**

Hitung progres dari daftar isian. `total` = jumlah bagian yang SEHARUSNYA ada (dari struktur `LedBagian`), bukan jumlah baris `LedIsian` — supaya bagian yang belum pernah dibuka tetap terhitung sebagai kosong. /

### `estimasiHalaman`

Jenis: **fungsi**

Estimasi halaman dari sejumlah karakter.

### `LED_STATUS_META`

Jenis: **konstanta**

Label + varian badge untuk tiap status LED.

### `TAHAP_LABEL`

Jenis: **konstanta**

Label tahap PPEPP yang enak dibaca.

### `TAHAP_URUTAN`

Jenis: **konstanta**

Urutan tahap PPEPP yang baku.

### `BAB_LABEL`

Jenis: **konstanta**

Label BAB yang enak dibaca.

## Pustaka luar yang dipakai

- `@prisma/client`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx`](./app__-dashboard-__led__bab-2__kriteria__-nomor-__page.md)
- [`app/(dashboard)/led/page.tsx`](./app__-dashboard-__led__page.md)
- [`components/led/LedAccordion.tsx`](./components__led__LedAccordion.md)
- [`components/led/LedEditor.tsx`](./components__led__LedEditor.md)
- [`components/led/LedStatusSelect.tsx`](./components__led__LedStatusSelect.md)
- [`components/led/status.ts`](./components__led__status.md)
- [`lib/actions/led.ts`](./lib__actions__led.md)

