# `lib/utils/led-query.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 104 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 9 berkas |

## Maksud berkas

Berkas ini menyediakan 6 fungsi utama: `ambilBagianLed`, `ambilRingkasanLed`, `ambilStatusPerKode`, `ambilStrukturLed`, `jumlahBagianLed`, `tahunAkademikAktif`.

## Letak berkas

Dari akar repo: `lib/utils/led-query.ts`.

## Isi yang bisa dipakai berkas lain

### `STATUS_KOSONG`

Jenis: **konstanta**

Status default untuk bagian yang belum pernah diisi.

### `ambilBagianLed`

Jenis: **fungsi async**

Query bagian LED + isiannya untuk satu tahun akademik. Semua halaman LED lewat sini supaya bentuk datanya seragam dan bagian yang belum pernah diisi tetap ikut terkirim (isian = null). /

### `ambilRingkasanLed`

Jenis: **fungsi async**

Semua isian LED pada satu tahun akademik — untuk hitung progres.

### `ambilStatusPerKode`

Jenis: **fungsi async**

Peta kode bagian → status. Dipakai halaman index untuk kartu per BAB.

### `ambilStrukturLed`

Jenis: **fungsi async**

Struktur ringkas semua bagian LED (tanpa join isian).

### `jumlahBagianLed`

Jenis: **fungsi async**

Jumlah total bagian LED yang seharusnya ada (struktur baku).

### `tahunAkademikAktif`

Jenis: **fungsi async**

Tahun akademik aktif.

## Pustaka luar yang dipakai

- `@prisma/client`

## Berkas lain di proyek ini yang dipanggil

- [`components/led/types.ts`](./components__led__types.md)
- [`lib/db.ts`](./lib__db.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/bab-1/page.tsx`](./app__-dashboard-__led__bab-1__page.md)
- [`app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx`](./app__-dashboard-__led__bab-2__kondisi-eksternal__page.md)
- [`app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx`](./app__-dashboard-__led__bab-2__kriteria__-nomor-__page.md)
- [`app/(dashboard)/led/bab-2/page.tsx`](./app__-dashboard-__led__bab-2__page.md)
- [`app/(dashboard)/led/bab-2/profil/page.tsx`](./app__-dashboard-__led__bab-2__profil__page.md)
- [`app/(dashboard)/led/bab-2/suplemen/page.tsx`](./app__-dashboard-__led__bab-2__suplemen__page.md)
- [`app/(dashboard)/led/bab-3/page.tsx`](./app__-dashboard-__led__bab-3__page.md)
- [`app/(dashboard)/led/page.tsx`](./app__-dashboard-__led__page.md)
- [`lib/utils/led-export-query.ts`](./lib__utils__led-export-query.md)

