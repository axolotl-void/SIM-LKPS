# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |
| < 0.1   | No        |

## Reporting a Vulnerability

Untuk dosen atau calon user yang menemukan bug atau celah keamanan:

1. **Email**: yogiprasetya@ubbg.ac.id
2. **GitHub Issue** — HANYA untuk bug biasa (bukan celah keamanan, karena
   issue itu publik): https://github.com/axolotl-void/SIM-LKPS/issues

Response time: 1 sampai 3 hari kerja.

## Aturan utama: JANGAN pernah menaruh sandi di berkas yang ikut ter-commit

Repositori ini **publik**. Apa pun yang di-commit ke sini bisa dibaca siapa
saja, termasuk bot yang menjelajah GitHub 24 jam sehari.

Aturan ini berlaku untuk: kode, berkas uji, dokumentasi, README, berkas
contoh, pesan komit, dan komentar.

**Sandi, kunci API, dan token hanya boleh ada di berkas `.env`** — berkas itu
tidak ikut ter-commit (lihat `.gitignore`).

```bash
# Membuat sandi acak yang kuat
openssl rand -base64 18
```

### Kenapa ini penting

Sandi yang pernah ter-commit harus **dianggap bocor selamanya**, walaupun
setelah itu dihapus dari kode. Sebabnya: riwayat git menyimpan semuanya. Sandi
tetap bisa dibaca dari komit lama, dan GitHub menyimpan cache yang sulit
dibersihkan. Satu-satunya perbaikan yang benar-benar bekerja adalah
**mengganti sandinya**.

### Kenapa "GitHub secret scanning" saja tidak cukup

Fitur itu hanya mengenali pola milik penyedia tertentu (token AWS, kunci
Stripe, dan sejenisnya). Sandi buatan sendiri seperti `NamaAplikasi2026!`
**tidak akan terdeteksi** — bentuknya tidak cocok dengan pola mana pun.

## Daftar periksa sebelum mendorong kode

Jalankan ini sebelum `git push`:

```bash
# 1. Pastikan tidak ada berkas .env yang ikut ter-commit
git status --short

# 2. Cari pola sandi/kunci di berkas yang akan dikirim
grep -rniE 'password\s*[:=]\s*["'\''][^"'\'']{6,}' --include='*.ts' --include='*.tsx' \
  --include='*.md' --include='*.json' . | grep -v node_modules

# 3. Cek dependensi yang rentan
pnpm audit --prod
```

Untuk memeriksa riwayat git secara menyeluruh, pakai
[gitleaks](https://github.com/gitleaks/gitleaks):

```bash
gitleaks detect --source . --verbose
```

## Kebiasaan keamanan yang berlaku

- **Sandi**: dibuat acak, tidak pernah ditulis di berkas yang ikut ter-commit
- **`AUTH_SECRET`**: jangan pernah dibagikan; ganti setiap 90 hari
- **HTTPS**: Vercel mengaturnya otomatis
- **Backup database**: mingguan, lewat dasbor Neon
- **Sesi**: 2 jam. Setelah mengganti sandi, hapus sesi lama
  (`DELETE FROM "Session";`) supaya sesi yang sudah terbuka ikut mati
- **Akun terpisah**: satu akun per orang, jangan berbagi. Catatan audit
  mencatat siapa mengubah apa — kalau akunnya dipakai bersama, catatan itu
  tidak berguna

## Yang sudah dipasang di aplikasi

- Pembatas percobaan login berbasis database (10 kali per akun, 30 kali per
  alamat IP, per 15 menit) — berlaku lintas instance, bukan per proses
- Kepala keamanan HTTP: CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`
- Pemeriksaan login di middleware (lapisan terdepan) + di tiap halaman
- Validasi berkas unggahan (ukuran, jenis, nama)
- Sandi di-hash bcrypt (cost 12)
- Cookie sesi `httpOnly` + `secure`
- Pesan galat tidak membocorkan struktur database
- `X-Powered-By` dimatikan
