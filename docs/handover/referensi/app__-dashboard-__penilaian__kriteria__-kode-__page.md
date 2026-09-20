# `app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 159 baris |
| **Jenis** | modul biasa |
| **Alamat URL** | `/penilaian/kriteria/[kode]` |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Berkas halaman untuk alamat `/penilaian/kriteria/[kode]`. Tugasnya menyiapkan data di server (dan memeriksa izin), lalu menyerahkan tampilan ke komponen client. Isinya dirender oleh `app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient`.

## Letak berkas

Dari akar repo: `app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`.

## Isi yang bisa dipakai berkas lain

### `metadata`

Jenis: **konstanta**

### `PenilaianKriteriaPage`

Jenis: **default**

## Alamat yang dilayani

Halaman ini bisa dibuka di `/penilaian/kriteria/[kode]`.

Kalau mau mengubah apa yang tampil di alamat itu, **berkas ini yang pertama dibuka**.

## Pustaka luar yang dipakai

- `@prisma/client`
- `lucide-react`
- `next/link`
- `next/navigation`

## Berkas lain di proyek ini yang dipanggil

- [`app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__KriteriaPenilaianClient.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/utils/format.ts`](./lib__utils__format.md)
- [`lib/utils/penilaian.ts`](./lib__utils__penilaian.md)
- [`lib/utils/penilaian-query.ts`](./lib__utils__penilaian-query.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

