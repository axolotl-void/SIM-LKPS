# `lib/actions/penilaian.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 333 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 3 berkas |

## Maksud berkas

Berkas ini menyediakan 5 fungsi utama: `setSkor`, `setSkorBanyak`, `finalisasiSesi`, `bukaKembaliSesi`, `resetSesi`.

## Letak berkas

Dari akar repo: `lib/actions/penilaian.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `setSkor`

Jenis: **fungsi async**

SIMPAN SKOR

### `setSkorBanyak`

Jenis: **fungsi async**

Simpan banyak skor sekaligus (dipakai form per kriteria).

### `finalisasiSesi`

Jenis: **fungsi async**

Kunci penilaian + simpan nilai akhir & status. Ditolak kalau masih ada butir yang belum dinilai (Edge Case §7). /

### `bukaKembaliSesi`

Jenis: **fungsi async**

Buka kembali penilaian yang sudah difinalisasi (ADMIN saja).

### `resetSesi`

Jenis: **fungsi async**

Kosongkan seluruh skor sesi ini (ADMIN).

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)
- [`lib/utils/penilaian.ts`](./lib__utils__penilaian.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/penilaian/butir/[kode]/ButirPenilaianClient.tsx`](./app__-dashboard-__penilaian__butir__-kode-__ButirPenilaianClient.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__KriteriaPenilaianClient.md)
- [`components/penilaian/AksiFinalisasi.tsx`](./components__penilaian__AksiFinalisasi.md)

