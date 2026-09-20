# Dokumentasi SIM-LKPS

Seluruh dokumentasi proyek ada di folder ini.

---

## Belum tahu harus mulai dari mana?

Buka **[handover/00-START-HERE.md](handover/00-START-HERE.md)**.

Di situ ada penjelasan singkat tentang aplikasi ini, siapa mengerjakan apa, dan
urutan membaca dokumen yang disarankan — berbeda tergantung kamu ini staf TI,
dosen pengelola, atau pimpinan.

---

## Isi folder

### `handover/` — Serah terima sistem

Panduan untuk kampus, ditulis dengan bahasa sehari-hari (tanpa istilah teknis
yang tidak dijelaskan).

| Berkas | Isinya | Untuk siapa |
|---|---|---|
| [00-START-HERE.md](handover/00-START-HERE.md) | Pembuka, kontak, urutan membaca | Semua orang |
| [01-cara-menjalankan.md](handover/01-cara-menjalankan.md) | Menjalankan aplikasi di komputer sendiri | Staf TI |
| [02-arsitektur.md](handover/02-arsitektur.md) | Bagian sistem dan hubungannya | Staf TI |
| [03-ubah-fitur-ini.md](handover/03-ubah-fitur-ini.md) | **Buku resep**: "mau ubah X? buka berkas Y" | Staf TI |
| [04-basis-data.md](handover/04-basis-data.md) | Struktur data, pencadangan, pemulihan | Staf TI |
| [05-akun-dan-keamanan.md](handover/05-akun-dan-keamanan.md) | Peran, sandi, **cara memindahkan kepemilikan akun** | Manajemen + TI |
| [06-operasi-rutin.md](handover/06-operasi-rutin.md) | Rutinitas, penanganan gangguan, daftar periksa serah terima | Staf TI |
| [07-pertanyaan-lanjutan.md](handover/07-pertanyaan-lanjutan.md) | Jawaban pertanyaan teknis yang sering muncul | Programmer baru |

### `handover/referensi/` — Penjelasan tiap berkas kode

Satu halaman untuk **setiap berkas** di `app/`, `components/`, `lib/`, dan
`prisma/` — 263 halaman.

Tiap halaman berisi:

- Fungsi dan tujuan berkas itu
- Daftar fungsi yang diekspor, beserta penjelasan singkatnya
- Halaman web mana yang memakainya
- Berkas lain yang berhubungan
- Jumlah baris

Ini hasil olahan otomatis dari kode aslinya, jadi isinya selalu sesuai dengan
yang benar-benar ada di aplikasi — bukan karangan.

**Cara pakai:** kalau ada yang bilang "fitur penilaian rusak", cari berkas yang
namanya mengandung `penilaian` di folder ini. Atau buka
`03-ubah-fitur-ini.md` dan lihat berkas apa yang ditunjuk.

**Cara memperbarui:** setelah mengubah kode, jalankan dari akar proyek:

```bash
node docs/handover/generate-referensi.mjs
```

### `CLAUDE.md` dan `docs/*.md` — dokumen lama

`CLAUDE.md`, `docs/roadmap.md`, dan `docs/requirements.md` **sudah
kedaluwarsa** — masih memakai istilah BAN-PT lama (menyebut "31 tabel") padahal
instrumen sekarang LAM INFOKOM 2.1 (32 tabel, 92 bagian LED, 82 butir penilaian).

Angka-angka di dokumen lama itu **jangan dipakai sebagai acuan.** Lihat
`handover/07-pertanyaan-lanjutan.md` bagian terakhir untuk daftar berkas yang
bisa dijadikan acuan.

---

## Ringkasan angka penting

Kalau ada yang bertanya "ada berapa ...", ini jawabannya:

| Yang dihitung | Jumlah | Sumber yang benar |
|---|---|---|
| Tabel LKPS | **32** | `prisma/seed.ts` |
| Bagian narasi LED | **92** | `prisma/seed-data/led-bagian.json` |
| Butir penilaian | **82** | `prisma/seed-data/butir-penilaian.json` |
| Total bobot penilaian | **400** | idem |
| Peran pengguna | **3** | `lib/utils/permissions.ts` |
| Uji otomatis cepat | **79 lulus** | `npx vitest run` |

---

## Sedang dicari apa?

| Kebutuhanku | Buka ini |
|---|---|
| Menjalankan aplikasi di komputer | `handover/01-cara-menjalankan.md` |
| Tahu alur sistem secara keseluruhan | `handover/02-arsitektur.md` |
| Mengubah sesuatu di aplikasi | `handover/03-ubah-fitur-ini.md` |
| Mencadangkan atau memulihkan data | `handover/04-basis-data.md` |
| Memindahkan akun ke kampus | `handover/05-akun-dan-keamanan.md` |
| Ada yang rusak, harus bagaimana | `handover/06-operasi-rutin.md` |
| Kode ini maksudnya apa | `handover/07-pertanyaan-lanjutan.md` |
| Berkas ini gunanya apa | `handover/referensi/` |
| Menyerahkan sistem ke pihak lain | `handover/06-operasi-rutin.md` bagian 6 |
