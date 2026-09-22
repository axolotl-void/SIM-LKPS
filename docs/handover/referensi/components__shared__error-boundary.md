# `components/shared/error-boundary.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 67 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 35 berkas |

## Maksud berkas

Berkas ini tidak mengekspor apa pun ke luar — dipakai sekali di tempatnya sendiri.

## Letak berkas

Dari akar repo: `components/shared/error-boundary.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Pustaka luar yang dipakai

- `lucide-react`
- `react`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(auth)/login/page.tsx`](./app__-auth-__login__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a1/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a1__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a2/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a2__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a3/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a3__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a4/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a4__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a5/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a5__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1b/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1b__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2a1/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a1__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2a2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a2__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2a3/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a3__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b1/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b1__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b2__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b3/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b3__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b4/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b4__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b5/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b5__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b6/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b6__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2c/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2c__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2d/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2d__page.md)
- [`app/(dashboard)/lkps/kriteria-3/error.tsx`](./app__-dashboard-__lkps__kriteria-3__error.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3a1/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a1__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3a2/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a2__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3a3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a3__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3c1/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c1__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3c2/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c2__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3c3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c3__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4a1/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4a1__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4a2/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4a2__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4c1/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c1__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4c2/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c2__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4c3/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c3__page.md)
- [`app/(dashboard)/lkps/kriteria-5/tabel-51/page.tsx`](./app__-dashboard-__lkps__kriteria-5__tabel-51__page.md)
- [`app/(dashboard)/lkps/kriteria-5/tabel-52/page.tsx`](./app__-dashboard-__lkps__kriteria-5__tabel-52__page.md)
- [`app/(dashboard)/lkps/kriteria-6/tabel-61/page.tsx`](./app__-dashboard-__lkps__kriteria-6__tabel-61__page.md)
- [`app/(dashboard)/lkps/kriteria-6/tabel-62/page.tsx`](./app__-dashboard-__lkps__kriteria-6__tabel-62__page.md)
- [`app/(dashboard)/settings/users/page.tsx`](./app__-dashboard-__settings__users__page.md)

