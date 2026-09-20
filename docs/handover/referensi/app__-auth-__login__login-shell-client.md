# `app/(auth)/login/login-shell-client.tsx`

| | |
|---|---|
| **Area** | Halaman & API (App Router) |
| **Ukuran** | 84 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `LoginShellClient`.

## Letak berkas

Dari akar repo: `app/(auth)/login/login-shell-client.tsx`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `LoginShellClient`

Jenis: **fungsi**

Full-bleed login shell. Left pane + right pane are absolutely positioned to mirror the original Stitch design (no grid splitting that crops the right-side card or left-side illustration). Entrance: <main> fade, left pane slide-from-left, right pane slide-from-right Exit: triggered when navigating to dashboard (LoginForm sets sessionStorage flag then router.push — this shell starts in exit state an

## Pustaka luar yang dipakai

- `react`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(auth)/login/page.tsx`](./app__-auth-__login__page.md)

