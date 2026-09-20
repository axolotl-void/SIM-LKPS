# `lib/utils/penilaian-query.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 105 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 4 berkas |

## Maksud berkas

Berkas ini menyediakan 4 fungsi utama: `tahunAktifPenilaian`, `sesiPenilaian`, `ambilButirPenilaian`, `keButirHitung`.

## Letak berkas

Dari akar repo: `lib/utils/penilaian-query.ts`.

## Isi yang bisa dipakai berkas lain

### `tahunAktifPenilaian`

Jenis: **fungsi async**

Tahun akademik aktif.

### `sesiPenilaian`

Jenis: **fungsi async**

Sesi penilaian tahun aktif, atau null kalau belum pernah dibuat.

### `ButirLengkap`

Jenis: **tipe**

### `ambilButirPenilaian`

Jenis: **fungsi async**

Semua butir + skor sesi ini (kalau ada). Mengembalikan `ButirLengkap[]` supaya halaman bisa menampilkan deskriptor 4 level dan sekaligus menghitung nilai akhir tanpa query tambahan. /

### `keButirHitung`

Jenis: **fungsi**

Ubah daftar butir jadi bentuk ringkas untuk kalkulasi murni.

## Berkas lain di proyek ini yang dipanggil

- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/penilaian.ts`](./lib__utils__penilaian.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/penilaian/butir/[kode]/page.tsx`](./app__-dashboard-__penilaian__butir__-kode-__page.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__KriteriaPenilaianClient.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__page.md)
- [`app/(dashboard)/penilaian/page.tsx`](./app__-dashboard-__penilaian__page.md)

