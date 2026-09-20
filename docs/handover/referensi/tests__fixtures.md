# `tests/fixtures.ts`

| | |
|---|---|
| **Area** | Pengujian |
| **Ukuran** | 52 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 5 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `login`, `expectHealthyPage`.

## Letak berkas

Dari akar repo: `tests/fixtures.ts`.

## Isi yang bisa dipakai berkas lain

### `ROLES`

Jenis: **konstanta**

### `RoleKey`

Jenis: **tipe**

### `STORAGE_BY_ROLE`

Jenis: **konstanta**

### `login`

Jenis: **fungsi async**

Login via UI and wait for redirect to dashboard. /

### `expectHealthyPage`

Jenis: **fungsi async**

Quick health check: page renders, no Next.js error overlay. /

## Pustaka luar yang dipakai

- `@playwright/test`
- `path`
- `url`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`tests/access-denied.spec.ts`](./tests__access-denied.spec.md)
- [`tests/auth.spec.ts`](./tests__auth.spec.md)
- [`tests/export.spec.ts`](./tests__export.spec.md)
- [`tests/permissions.spec.ts`](./tests__permissions.spec.md)
- [`tests/workflow.spec.ts`](./tests__workflow.spec.md)

