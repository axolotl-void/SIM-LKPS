# `lib/utils/kriteria.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 48 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 3 berkas |

## Maksud berkas

Pemetaan kriteria LKPS — LAM INFOKOM 2.1 Instrumen LKPS tidak memakai istilah "BAB" (itu milik LED). Penomoran resminya per kriteria. Kolom `bab` di `TabelDefinition` tetap Int 1–6 (internal), tapi URL & label memakai kriteria. /

## Letak berkas

Dari akar repo: `lib/utils/kriteria.ts`.

## Isi yang bisa dipakai berkas lain

### `kriteriaSlug`

Jenis: **fungsi**

Slug route halaman kriteria, mis. `kriteria-5-6`.

### `kriteriaNama`

Jenis: **fungsi**

Nama kriteria, mis. "Relevansi Pendidikan".

### `kriteriaLabel`

Jenis: **fungsi**

Label lengkap dengan nomor, mis. "Kriteria 2 — Relevansi Pendidikan".

### `tabelHref`

Jenis: **fungsi**

URL halaman detail sebuah tabel.

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/lkps/submissions/submissions-client.tsx`](./app__-dashboard-__lkps__submissions__submissions-client.md)
- [`app/(dashboard)/lkps/validasi/page.tsx`](./app__-dashboard-__lkps__validasi__page.md)
- [`lib/actions/lkps.ts`](./lib__actions__lkps.md)

