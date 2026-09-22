# `tests/global-setup-pesan.ts`

| | |
|---|---|
| **Area** | Pengujian |
| **Ukuran** | 38 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Persiapan sebelum uji "pesan pembatas login". Uji itu sengaja menghabiskan kuota percobaan gagal (10x) untuk sebuah akun. Kalau hitungan dari jalan sebelumnya tidak dibersihkan, uji berikutnya langsung menemukan keadaan terkunci dan bisa lulus/gagal secara palsu. Jadi hitungan dibersihkan dulu. PENGAMAN: hanya boleh jalan di database LOKAL. Uji ini tidak boleh menyentuh database produksi. Kalau DATABASE_URL bukan localhost, proses dihentikan. /

## Letak berkas

Dari akar repo: `tests/global-setup-pesan.ts`.

## Isi yang bisa dipakai berkas lain

### `globalSetup`

Jenis: **default**

## Pustaka luar yang dipakai

- `@prisma/client`

