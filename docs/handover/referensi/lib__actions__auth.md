# `lib/actions/auth.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 170 baris |
| **Jenis** | Server Action (`"use server"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `loginAction`, `logoutAction`.

## Letak berkas

Dari akar repo: `lib/actions/auth.ts`.

Berkas ini berjalan **di server saja** (`"use server"`). Semua perubahan data
ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.

## Isi yang bisa dipakai berkas lain

### `LoginState`

Jenis: **interface**

### `loginAction`

Jenis: **fungsi async**

Server Action: Login with credentials. Flow: 1. Read email/password/callbackUrl from FormData 2. Validate with Zod (loginSchema) — strict email + min-6 password On invalid: return LoginState with fieldErrors, form shows error 3. Fire-and-forget audit log "LOGIN_ATTEMPT" (so we have a record even if credentials are wrong; success audit happens via session callback) 4. signIn with redirect:true + re

### `logoutAction`

Jenis: **fungsi async**

Server Action: Logout /

## Pustaka luar yang dipakai

- `next-auth`

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/utils/db-retry.ts`](./lib__utils__db-retry.md)
- [`lib/validations/auth.ts`](./lib__validations__auth.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/forms/login-form.tsx`](./components__forms__login-form.md)

