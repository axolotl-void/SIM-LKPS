# `lib/utils/login-rate-limit.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 205 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Pembatas percobaan login — berbasis DATABASE, bukan memori proses. MASALAH YANG DIPERBAIKI Pembatas sebelumnya menyimpan hitungan di `Map` dalam memori. Di Vercel, aplikasi berjalan di beberapa instance sekaligus dan tiap instance didaur ulang sesuka waktu. Penghitung di memori karena itu hanya melihat sebagian kecil percobaan, dan hilang sebelum sempat mencapai batas. Uji langsung ke produksi menunjukkan 8 percobaan gagal berturut-turut tidak pernah menghasilkan 429. CARA KERJA SEKARANG Hitungan disimpan di tabel `login_attempt`, jadi berlaku untuk semua instance sekaligus dan tidak hilang saat instance didaur ulang. ATURAN - Hanya percobaan GAGAL yang dihitung. Login berhasil mengosongkan hitungan, supaya pengguna sah yang salah ketik tidak ikut terhukum. - Kunci = IP + email. Mengunci hanya per-IP bisa melukai satu kantor yang berbagi satu IP publik; mengunci per-email saja tidak berguna karena penyerang tinggal mencoba banyak email. Kombinasi keduanya membuat serangan menyasar satu akun ikut terhenti. - Kalau database bermasalah, permintaan DILOLOSKAN. Alasannya: pembatas ini pelengkap, bukan pengaman utama (pengaman utamanya bcrypt + sandi kuat). Menolak login seluruh kampus gara-gara gangguan DB justru merugikan, dan penyerang bisa memakainya untuk mematikan layanan. /

## Letak berkas

Dari akar repo: `lib/utils/login-rate-limit.ts`.

## Isi yang bisa dipakai berkas lain

### `HasilPembatas`

Jenis: **interface**

### `ambilIp`

Jenis: **fungsi**

Ambil alamat IP pemanggil dari header. Di Vercel, `x-forwarded-for` diisi oleh platform dan tidak bisa dipalsukan dari luar. Nilai paling kiri adalah klien asli. /

### `normalEmail`

Jenis: **fungsi**

Normalisasi email supaya `Admin@ubbg.ac.id` dan `admin@ubbg.ac.id` dihitung sebagai akun yang sama. /

### `periksaPembatasLogin`

Jenis: **fungsi async**

Periksa apakah percobaan login berikutnya masih boleh dilakukan. Dipanggil SEBELUM memeriksa sandi, supaya penyerang tidak bisa memakai waktu balasan untuk menebak. /

### `catatLoginGagal`

Jenis: **fungsi async**

Catat satu percobaan login yang GAGAL. /

### `kosongkanHitungan`

Jenis: **fungsi async**

Kosongkan hitungan setelah login BERHASIL. Tanpa ini, pengguna yang salah ketik 9 kali lalu berhasil akan tetap terhitung 9, dan percobaan salah berikutnya mengunci akunnya sendiri. /

### `BATAS_LOGIN`

Jenis: **konstanta**

## Berkas lain di proyek ini yang dipanggil

- [`lib/db.ts`](./lib__db.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`lib/auth.ts`](./lib__auth.md)

