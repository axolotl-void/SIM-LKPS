# `components/led/ikon.ts`

| | |
|---|---|
| **Area** | Komponen Antarmuka |
| **Ukuran** | 32 baris |
| **Jenis** | Client Component (`"use client"`) |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 1 fungsi utama: `ikonLed`.

## Letak berkas

Dari akar repo: `components/led/ikon.ts`.

Berkas ini berjalan **di browser pengguna** (`"use client"`). Di dalamnya ada
pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia
(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.

## Isi yang bisa dipakai berkas lain

### `IKON_LED`

Jenis: **konstanta**

Peta nama → komponen ikon untuk modul LED. Komponen (fungsi) TIDAK boleh dikirim dari Server Component ke Client Component — React melempar "Functions cannot be passed directly to Client Components". Jadi server mengirim NAMA ikon, klien yang me-resolve. /

### `ikonLed`

Jenis: **fungsi**

Ambil ikon berdasarkan nama; fallback ke FileText.

## Pustaka luar yang dipakai

- `lucide-react`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`components/led/LedProgressCard.tsx`](./components__led__LedProgressCard.md)

