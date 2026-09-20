# `lib/actions/evidence.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 306 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 5 fungsi utama: `uploadEvidence`, `getEvidenceList`, `deleteEvidence`, `addEvidenceLink`, `getTabelLkpsId`.

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

### `getTabelLkpsId`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/actions/notification.ts`](./lib__actions__notification.md)
- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/minio.ts`](./lib__minio.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/evidence/evidence-client.tsx`](./app__-dashboard-__evidence__evidence-client.md)

