# `components/layout/theme-sync.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 60 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `ThemeSync`.

## Letak berkas

Dari akar repo: `components/layout/theme-sync.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `ThemeSync`

Jenis: **fungsi**

Menjaga class `dark` pada <html> tetap sinkron dengan rute yang sedang dibuka. Di rute terang (login): class `dark` dilepas, apa pun pilihan pengguna. Di rute lain: tema dipasang ulang dari localStorage / preferensi sistem, supaya pilihan pengguna tetap terbawa setelah keluar dari halaman login. /

## Pustaka luar yang dipakai

- `next/navigation`
- `react`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/layout.tsx`](./app__layout.md)

