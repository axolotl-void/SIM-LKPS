# `lib/utils/pesan-galat.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 70 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 2 berkas |

## Maksud berkas

Pesan galat yang aman ditampilkan ke pengguna. MASALAH YANG DIPERBAIKI Beberapa halaman menampilkan `error.message` apa adanya, misalnya "Gagal Memuat Halaman: {error.message}". Kalau Next.js meneruskan galat asli dari server, teksnya ikut terkirim ke layar — dan galat Prisma biasanya memuat nama tabel, nama kolom, bahkan potongan query: Invalid `prisma.dosen.findMany()` invocation: Raw query failed. Code: `42P01`. Message: `relation "dosen" does not exist` Nama tabel dan struktur database adalah peta yang memudahkan penyerang memilih sasaran. Jadi pesan asli hanya boleh masuk LOG server (untuk ditelusuri), bukan layar pengguna. YANG DITAMPILKAN KE PENGGUNA Pesan singkat yang menjelaskan KEADAANNYA, bukan penyebab teknisnya, plus `digest` — ID singkat yang dicatat Next.js di log server. Pengguna bisa menyebutkan ID itu saat melapor, dan kita bisa mencari penyebab aslinya di log tanpa pernah menampilkannya di layar. /

## Letak berkas

Dari akar repo: `lib/utils/pesan-galat.ts`.

## Isi yang bisa dipakai berkas lain

### `pesanAman`

Jenis: **fungsi**

Ambil pesan yang aman ditampilkan dari sebuah galat. /

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/error.tsx`](./app__-dashboard-__error.md)
- [`app/(dashboard)/lkps/kriteria-1/error.tsx`](./app__-dashboard-__lkps__kriteria-1__error.md)

