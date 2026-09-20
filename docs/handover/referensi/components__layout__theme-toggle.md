# `components/layout/theme-toggle.tsx`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 56 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `ThemeToggle`.

## Letak berkas

Dari akar repo: `components/layout/theme-toggle.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `ThemeToggle`

Jenis: **fungsi**

Tombol pengalih mode terang / gelap. Pilihan disimpan di localStorage (`sim-lkps-theme`). Pada kunjungan pertama (belum ada pilihan) tema mengikuti preferensi sistem — penentuannya dilakukan script inline di app/layout.tsx sebelum paint, jadi tidak ada kedipan putih saat halaman dimuat. /

## Pustaka luar yang dipakai

- `lucide-react`
- `react`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/layout/header.tsx`](./components__layout__header.md)

