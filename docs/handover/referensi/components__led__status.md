# `components/led/status.ts`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 38 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 4 berkas |

## Maksud berkas

Berkas ini menyediakan 3 fungsi utama: `statusMeta`, `statusKelas`, `ringkasProgres`.

## Letak berkas

Dari akar repo: `components/led/status.ts`.

## Isi yang bisa dipakai berkas lain

### `statusMeta`

Jenis: **fungsi**

Akses aman ke LED_STATUS_META (tsconfig pakai noUncheckedIndexedAccess).

### `VARIAN_KELAS`

Jenis: **konstanta**

Kelas badge untuk tiap varian status.

### `statusKelas`

Jenis: **fungsi**

Kelas badge dari sebuah status LED.

### `ringkasProgres`

Jenis: **fungsi**

Ringkas daftar isian menjadi satu angka progres untuk kartu.

## Pustaka luar yang dipakai

- `@prisma/client`

## Berkas lain di proyek ini yang dipanggil

- [`lib/utils/led-progress.ts`](./lib__utils__led-progress.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/bab-2/page.tsx`](./app__-dashboard-__led__bab-2__page.md)
- [`components/led/LedButirKartu.tsx`](./components__led__LedButirKartu.md)
- [`components/led/LedProgressCard.tsx`](./components__led__LedProgressCard.md)
- [`components/led/LedStatusSelect.tsx`](./components__led__LedStatusSelect.md)

