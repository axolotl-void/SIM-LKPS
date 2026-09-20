# `tests/cleanup-dosen-uji.mjs`

| | |
|---|---|
| **Area** | Pengujian |
| **Ukuran** | 26 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Hapus baris dosen uji (NIDN 9999999999) dari database. Dipakai setelah tests/e2e-dosen-http.mjs, karena API tidak punya route DELETE. Jalankan dari root repo: node --env-file=.env tests/cleanup-dosen-uji.mjs /

## Letak berkas

Dari akar repo: `tests/cleanup-dosen-uji.mjs`.

## Pustaka luar yang dipakai

- `@prisma/client`

