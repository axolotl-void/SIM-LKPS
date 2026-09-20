# `tests/global-setup-penilaian.ts`

| | |
|---|---|
| **Area** | Pengujian |
| **Ukuran** | 37 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Berkas ini berisi komponen tampilan `globalSetup`.

## Letak berkas

Dari akar repo: `tests/global-setup-penilaian.ts`.

## Isi yang bisa dipakai berkas lain

### `globalSetup`

Jenis: **default**

Bersihkan state penilaian di DB uji sebelum suite jalan. PENGAMAN: hanya boleh jalan kalau DATABASE_URL menunjuk ke localhost. Tanpa penjagaan ini, menjalankan suite tanpa override DATABASE_URL akan menghapus skor di DB produksi (Neon) — karena `.env` proyek menunjuk ke sana. /

## Pustaka luar yang dipakai

- `@prisma/client`

