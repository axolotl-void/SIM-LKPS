# `tests/e2e-dosen-http.mjs`

| | |
|---|---|
| **Area** | Pengujian |
| **Ukuran** | 188 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 0 berkas |

## Maksud berkas

Uji end-to-end endpoint POST /api/master/dosen lewat HTTP sungguhan. Alur: ambil CSRF -> login kredensial -> POST /api/master/dosen -> verifikasi. Dosen uji memakai NIDN 9999999999. Pembersihan TIDAK lewat HTTP (tidak ada route DELETE), melainkan lewat tests/cleanup-dosen-uji.mjs. /

## Letak berkas

Dari akar repo: `tests/e2e-dosen-http.mjs`.

