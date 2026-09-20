# `lib/actions/led.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 311 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 3 berkas |

## Maksud berkas

Berkas ini menyediakan 4 fungsi utama: `saveLedIsian`, `setLedStatus`, `addLedEvidence`, `deleteLedEvidence`.

## Letak berkas

Dari akar repo: `lib/actions/led.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `saveLedIsian`

Jenis: **fungsi async**

SIMPAN NARASI (autosave)

### `setLedStatus`

Jenis: **fungsi async**

UBAH STATUS

### `addLedEvidence`

Jenis: **fungsi async**

BUKTI PENDUKUNG

### `deleteLedEvidence`

Jenis: **fungsi async**

## Pustaka luar yang dipakai

- `@prisma/client`
- `next/cache`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)
- [`lib/utils/led-progress.ts`](./lib__utils__led-progress.md)
- [`lib/utils/led-rute.ts`](./lib__utils__led-rute.md)
- [`lib/utils/permissions.ts`](./lib__utils__permissions.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/led/LedEditor.tsx`](./components__led__LedEditor.md)
- [`components/led/LedEvidenceList.tsx`](./components__led__LedEvidenceList.md)
- [`components/led/LedStatusSelect.tsx`](./components__led__LedStatusSelect.md)

