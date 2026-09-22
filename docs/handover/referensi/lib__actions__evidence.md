# `lib/actions/evidence.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 292 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 4 fungsi utama: `uploadEvidence`, `getEvidenceList`, `deleteEvidence`, `addEvidenceLink`.

## Letak berkas

Dari akar repo: `lib/actions/evidence.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `uploadEvidence`

Jenis: **fungsi async**

### `getEvidenceList`

Jenis: **fungsi async**

### `deleteEvidence`

Jenis: **fungsi async**

### `addEvidenceLink`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/minio.ts`](./lib__minio.md)
- [`lib/notifikasi-internal.ts`](./lib__notifikasi-internal.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/evidence/evidence-client.tsx`](./app__-dashboard-__evidence__evidence-client.md)

