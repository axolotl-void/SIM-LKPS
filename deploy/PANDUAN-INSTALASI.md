# Panduan Instalasi SIM-LKPS di Server Kampus

**Tujuan:** SIM-LKPS berjalan di `https://lkps.bbg.ac.id`, tersambung ke SPMI
**Waktu pengerjaan:** ±60 menit (di luar waktu tunggu SSL ±15 menit)

> Dokumen ini ditulis supaya bisa diikuti orang yang **belum pernah melihat kode ini**.
> Setiap fase punya titik periksa. Kalau satu titik periksa gagal, **berhenti** dan
> baca bagian "Kalau ada masalah" — jangan lanjut ke fase berikutnya.

---

## Ringkasan yang harus dipahami dulu

```
Cloudflare  ──►  Apache/WHM :443
                   │
                   ├── spmi.bbg.ac.id  → PHP native (TIDAK diubah)
                   └── lkps.bbg.ac.id  → 127.0.0.1:3000 → proses Node (SIM-LKPS)
                                                              │
                                                              └── Neon (Singapore) + Cloudflare R2
```

Tiga hal yang **tidak** berubah pada pemasangan pertama:

| Komponen | Tetap di | Alasan |
|---|---|---|
| Database | **Neon** (Singapura) | Nol risiko kehilangan data. Pindah Postgres = fase terpisah. |
| Berkas bukti | **Cloudflare R2** | Idem. |
| SPMI | **tidak disentuh** | Yang ditambah cuma satu berkas PHP di folder `dashboard/`. |

Artinya: kalau pemasangan gagal di tengah jalan, **tidak ada data yang bisa rusak**.
Cukup matikan proses Node dan arahkan domain kembali ke Vercel.

---

## Yang perlu disiapkan sebelum mulai

### Dari pihak kampus

- [ ] Akun **SSH** ke `103.87.67.248` (boleh user biasa, tidak harus root)
- [ ] Subdomain **`lkps.bbg.ac.id`** dibuat di cPanel + record DNS
- [ ] Jawaban: **sisa RAM server berapa?** (lihat peringatan di bawah)
- [ ] Akses ke **cPanel** untuk memasang SSL dan `.htaccess`

### Dari pihak pengembang (Yogi)

- [ ] Nilai rahasia berikut — **diserahkan lewat jalur privat, bukan chat/email biasa**:
  - `DATABASE_URL` (Neon)
  - `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_ENDPOINT`, `MINIO_BUCKET`
  - `SSO_SPMI_SECRET` (rahasia bersama dengan SPMI)
- [ ] Akses repo: `https://github.com/axolotl-void/SIM-LKPS`

### ⚠️ Peringatan RAM — baca sebelum menjadwalkan

Build Next.js memakai **puncak 1,48 GB RAM**. Server ini sudah menjalankan
SPMI + WHM/cPanel + MySQL.

**Kalau RAM menjepit saat build, sistem bisa membunuh proses lain — dan yang
mati bisa SPMI sekalian, bukan cuma SIM-LKPS.**

Mitigasi (pilih satu):

1. Build dilakukan **di mesin lain**, hasilnya dikirim ke server (paling aman untuk server RAM kecil).
2. Build di server **di luar jam kerja**, sambil memantau `free -h`.

Aplikasi yang sudah jalan hanya memakai **±250 MB**. Yang berat itu build-nya, bukan operasionalnya.

---

## Fase 1 — Cek server (5 menit)

Masuk ke server:

```bash
ssh <user>@103.87.67.248
```

Jalankan pemeriksaan ini dan **catat hasilnya**:

```bash
# Sistem operasi — panduan ini mengasumsikan Ubuntu 22.04 / 24.04
lsb_release -d

# Node.js harus 22 atau lebih baru
node -v 2>/dev/null || echo "Node BELUM ADA"

# RAM dan swap
free -h

# Sisa disk
df -h /

# Apakah Docker sudah ada
docker --version 2>/dev/null || echo "Docker BELUM ADA"

# Apakah port 3000 masih kosong (harus kosong)
ss -tlnp | grep :3000 || echo "OK: port 3000 kosong"
```

**✅ Titik periksa 1:** Node versi `v22.x` atau lebih baru, RAM tersedia ≥ 2 GB,
disk sisa ≥ 5 GB, port 3000 kosong.

Kalau Node belum ada, pasang:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v    # harus v22.x
```

---

## Fase 2 — Ambil kode dan build (15–25 menit)

### 2A. Ambil kode

```bash
sudo mkdir -p /opt/sim-lkps
sudo chown $USER:$USER /opt/sim-lkps
git clone https://github.com/axolotl-void/SIM-LKPS.git /opt/sim-lkps
cd /opt/sim-lkps
```

### 2B. Pasang dependensi

```bash
corepack enable
pnpm install --frozen-lockfile
```

> `--frozen-lockfile` **wajib**. Tanpa itu pnpm boleh menarik versi paket yang
> berbeda dari yang diuji, dan hasilnya bisa beda tanpa ada yang sadar.

### 2C. Siapkan berkas rahasia

Buat berkas env di **luar** folder aplikasi, supaya tidak bisa ikut terunduh:

```bash
sudo install -m 600 -o root -g root /dev/null /etc/sim-lkps.env
sudo nano /etc/sim-lkps.env
```

Isi dengan nilai berikut — **ganti semua nilai di dalam `<...>`**:

```dotenv
# ─── Wajib ───────────────────────────────────────────────────────────
DATABASE_URL="<connection string Neon, sertakan ?sslmode=require>"
AUTH_SECRET="<hasil: openssl rand -base64 32>"
AUTH_URL="https://lkps.bbg.ac.id"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="https://lkps.bbg.ac.id"
NEXTAUTH_SECRET="<HARUS sama persis dengan AUTH_SECRET di atas>"

# ─── Penyimpanan bukti (Cloudflare R2) ───────────────────────────────
MINIO_ENDPOINT="<host R2, TANPA https:// dan tanpa path>"
MINIO_PORT="443"
MINIO_USE_SSL="true"
MINIO_ACCESS_KEY="<access key R2>"
MINIO_SECRET_KEY="<secret key R2>"
MINIO_BUCKET="sim-lkps-evidence"

# ─── Integrasi SPMI ──────────────────────────────────────────────────
SSO_SPMI_SECRET="<rahasia bersama — HARUS sama dengan di SPMI>"
NEXT_PUBLIC_SPMI_URL="https://spmi.bbg.ac.id"

# ─── Identitas aplikasi ──────────────────────────────────────────────
NEXT_PUBLIC_APP_NAME="SIM-LKPS"
NEXT_PUBLIC_APP_URL="https://lkps.bbg.ac.id"
NODE_ENV="production"
```

Buat `AUTH_SECRET` baru kalau belum ada:

```bash
openssl rand -base64 32
```

> **`AUTH_SECRET` server ini HARUS berbeda dari yang dipakai Vercel.**
> Kalau disamakan, sesi login di satu tempat bisa dipakai di tempat lain.
> Akibat sampingan yang wajar: semua pengguna harus login ulang setelah pindah.

### 2D. Build

```bash
cd /opt/sim-lkps
pnpm prisma generate
pnpm build
```

Build pertama ±48 detik (kalau dependensi sudah terpasang), bisa sampai beberapa menit
di server yang lambat.

**✅ Titik periksa 2:** perintah terakhir mencetak kira-kira:

```
Route (app)                              Size     First Load JS
...
✓ Compiled successfully
```

dan folder `.next/standalone` ada:

```bash
ls -la /opt/sim-lkps/.next/standalone | head
```

---

## Fase 3 — Jalankan aplikasi (10 menit)

Pilih **salah satu** jalur. Hasil akhirnya sama.

### Jalur A — systemd (paling sederhana, rekomendasi kalau tanpa Docker)

```bash
sudo useradd -r -m -d /var/www/sim-lkps simlkps

# salin hasil build ke folder yang dibaca systemd
sudo mkdir -p /var/www/sim-lkps
sudo cp -a /opt/sim-lkps/.next/standalone/. /var/www/sim-lkps/
sudo mkdir -p /var/www/sim-lkps/.next
sudo cp -a /opt/sim-lkps/.next/static/. /var/www/sim-lkps/.next/static/
sudo cp -a /opt/sim-lkps/public/. /var/www/sim-lkps/public/
sudo chown -R simlkps:simlkps /var/www/sim-lkps

sudo cp /opt/sim-lkps/deploy/sim-lkps.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now sim-lkps
```

Cek statusnya:

```bash
sudo systemctl status sim-lkps --no-pager
sudo journalctl -u sim-lkps -n 30 --no-pager
```

**✅ Titik periksa 3A:** status `active (running)`, dan baris log memuat
`▲ Next.js` diikuti `- Local: http://127.0.0.1:3000`.

Uji dari dalam server:

```bash
curl -s http://127.0.0.1:3000/api/health
```

Balasan benar:

```json
{"status":"ok","timestamp":"...","database":"connected"}
```

> Kalau `"database":"disconnected"` → `DATABASE_URL` salah, atau server tidak
> bisa keluar ke internet. Betulkan dulu, jangan lanjut.

### Jalur B — Docker

```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker $USER   # lalu logout & login lagi

cd /opt/sim-lkps
cp deploy/.env.production.example deploy/.env.production
sudo nano deploy/.env.production      # isi sama seperti isi /etc/sim-lkps.env

sudo docker compose -f deploy/docker-compose.prod.yml \
  --env-file deploy/.env.production up -d --build
```

**✅ Titik periksa 3B:**

```bash
sudo docker compose -f deploy/docker-compose.prod.yml ps
# semua service harus "healthy" atau "running"
curl -s http://127.0.0.1:3000/api/health
```

> Compose bawaan repo ikut menyalakan **Postgres lokal** dan **MinIO lokal**.
> Kalau tetap memakai Neon + R2 (rekomendasi fase 1), matikan dua service itu
> dengan menghapus blok `postgres:` dan `minio:` dari `deploy/docker-compose.prod.yml`,
> dan buang baris `depends_on: postgres` pada service `app`.

---

## Fase 4 — Sambungkan subdomain (15 menit)

### 4A. Subdomain di cPanel

1. cPanel → **Domains** → **Create A New Domain**
2. Domain: `lkps.bbg.ac.id`, **deselect** "Share document root"
3. Document root: `/home/<user>/lkps.bbg.ac.id`

### 4B. Teruskan ke aplikasi

Salin berkas proxy bawaan repo ke docroot subdomain:

```bash
cp /opt/sim-lkps/deploy/cpanel-proxy.htaccess /home/<user>/lkps.bbg.ac.id/.htaccess
```

Isinya mem-proxy semua permintaan ke `127.0.0.1:3000` dan — ini yang paling penting —
menyisipkan header `X-Forwarded-Proto: https`.

> **Tanpa header itu**, Next.js mengira dirinya diakses lewat HTTP, sehingga cookie
> sesi (yang bertanda `Secure`) **tidak dikirim browser**. Gejalanya menyesatkan:
> login tampak berhasil, tapi dilempar balik ke halaman login terus-menerus.

### 4C. DNS

Di Cloudflare (zona `bbg.ac.id`):

- Record `A` → nama `lkps` → isi `103.87.67.248`
- **Proxy: ON** (awan oranye)

### 4D. SSL

1. cPanel → **SSL/TLS Status** → **Run AutoSSL** untuk `lkps.bbg.ac.id`
2. Cloudflare → **SSL/TLS** → mode **Full (strict)**

> **Jangan pakai mode "Flexible".** Dengan mode itu Cloudflare bicara HTTP ke
> server padahal aplikasi mengira HTTPS — cookie sesi tidak terkirim, dan API
> gagal dengan gejala yang membingungkan.

**✅ Titik periksa 4:**

```bash
curl -sI https://lkps.bbg.ac.id/login | head -1
# HTTP/2 200

curl -sI https://lkps.bbg.ac.id/dashboard | head -3
# Harus 307 dengan Location: /login?callbackUrl=%2Fdashboard
# Kalau 200 → berbahaya: halaman dalam bisa dibuka tanpa login. STOP.
```

---

## Fase 5 — Uji menyeluruh (10 menit)

Jalankan **semua** uji ini. Satu saja gagal = belum selesai.

| # | Uji | Cara | Hasil benar |
|---|---|---|---|
| 1 | Halaman login hidup | buka `https://lkps.bbg.ac.id/login` | form muncul, ikon & logo tampil |
| 2 | Halaman dalam terkunci | buka `/dashboard` tanpa login | dilempar ke `/login` |
| 3 | **Login sungguhan** | masuk dengan akun admin | sampai ke `/dashboard` |
| 4 | Sesi tersimpan | tekan F5 di `/dashboard` | tetap masuk, tidak balik ke login |
| 5 | Data terbaca | buka `/lkps/kriteria-1` | kartu tabel muncul, bukan "Gagal Memuat" |
| 6 | **Unggah bukti** | buka salah satu tabel → unggah 1 PDF kecil | berhasil, tidak error 500 |
| 7 | Ekspor | buka `/laporan` → ekspor Excel | berkas terunduh |
| 8 | Hidup setelah restart | `sudo systemctl restart sim-lkps` lalu ulangi uji 3 | tetap normal |
| 9 | SSO dari SPMI | login SPMI → klik **DKPS → LAM Infokom** | masuk dashboard LKPS tanpa login |

Uji 6 dan 9 adalah yang paling sering gagal. Jangan lewati.

---

## Fase 6 — Setelah dinyatakan jalan

### Jangan langsung matikan Vercel

Biarkan `lkps.zegika.com` hidup **minimal dua minggu**. Itu jaring pengaman:
kalau server kampus bermasalah, cukup arahkan domain kembali.

### Cara memperbarui aplikasi nanti

Di Vercel, `git push` = deploy otomatis. **Di server kampus tidak.** Alurnya manual:

```bash
cd /opt/sim-lkps
sudo -u simlkps git pull
sudo -u simlkps pnpm install --frozen-lockfile
sudo -u simlkps pnpm prisma generate
sudo -u simlkps pnpm build
sudo rsync -a --delete .next/standalone/ /var/www/sim-lkps/
sudo rsync -a --delete .next/static/     /var/www/sim-lkps/.next/static/
sudo rsync -a --delete public/           /var/www/sim-lkps/public/
sudo systemctl restart sim-lkps
```

> **Siapa yang menjalankan ini setelah mahasiswa lulus?** Ini pertanyaan serah
> terima, bukan teknis. Sebaiknya ditunjuk satu orang penanggung jawab dan dicatat namanya.

### Kalau `prisma/schema.prisma` berubah

Database harus disamakan **sebelum** aplikasi baru dijalankan:

```bash
cd /opt/sim-lkps
pnpm prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > /tmp/rencana.sql
grep -inE "drop |truncate|delete " /tmp/rencana.sql   # HARUS kosong
pnpm prisma db push
```

Kalau `grep` menemukan apa pun, **berhenti** dan tanyakan ke pengembang.

---

## Rollback — kalau ada yang salah

| Yang dibatalkan | Caranya | Dampak data |
|---|---|---|
| Aplikasi | `sudo systemctl stop sim-lkps` (atau `docker compose down`) | tidak ada |
| Domain | arahkan `lkps.bbg.ac.id` kembali ke Vercel / hapus record | tidak ada |
| Integrasi SPMI | hapus `dashboard/laminfokom.php` di SPMI | tidak ada |
| Semua | ketiganya sekaligus | tidak ada |

Karena fase 1 tidak memindahkan database maupun berkas bukti, **rollback tidak
menyentuh data sama sekali**.

---

## Kalau ada masalah

| Gejala | Penyebab paling sering | Perbaikan |
|---|---|---|
| Login berhasil tapi balik ke halaman login | `X-Forwarded-Proto` tidak sampai | pastikan `.htaccess` terpasang & `mod_proxy` aktif |
| Cloudflare error 521/522 | proses Node mati atau port salah | `systemctl status sim-lkps` |
| Halaman `Gagal Memuat` berisi `table ... does not exist` | DB yang ditunjuk bukan DB yang sudah dimigrasi | periksa `DATABASE_URL` |
| Unggah bukti error 500 | `MINIO_*` salah/kosong | uji `MINIO_ENDPOINT` dengan `curl` dari server |
| `pnpm install` gagal saat build script | versi pnpm berbeda | `npm i -g pnpm@11.0.8` lalu ulangi |
| Build mati sendiri (`Killed`) | RAM habis | build di mesin lain, kirim hasilnya |
| Aplikasi hidup tapi semua halaman 500 | `.next` rusak | `rm -rf .next && pnpm build` |
| Sesi hilang tiap beberapa jam | `AUTH_SECRET` berubah tiap restart | pastikan nilainya tetap, di berkas env |

### Perintah pemeriksaan cepat

```bash
sudo systemctl status sim-lkps --no-pager    # hidup atau tidak
sudo journalctl -u sim-lkps -n 50 --no-pager # log terakhir
curl -s http://127.0.0.1:3000/api/health     # DB tersambung atau tidak
ss -tlnp | grep :3000                        # proses benar-benar dengar port
```

---

## Daftar larangan

1. **Jangan** taruh sandi atau `AUTH_SECRET` di repo, dokumen, atau dalam docroot.
   Berkas env: `chmod 600`, milik root, di `/etc/`.
2. **Jangan** menyalin `node_modules` dari komputer lain — arsitektur bisa berbeda.
   Selalu `pnpm install` di server.
3. **Jangan** memakai Cloudflare SSL mode "Flexible".
4. **Jangan** memindahkan database ke MySQL walaupun server punya MySQL.
   Aplikasi ini memakai PostgreSQL; ganti provider = query berubah perilaku.
5. **Jangan** mematikan `lkps.zegika.com` sebelum dua minggu pemantauan.
6. **Jangan** menjalankan `pnpm build` bersamaan dengan aplikasi yang sedang melayani
   lalu lintas, di server RAM kecil.

---

## Lampiran — daftar variabel lingkungan

| Variabel | Wajib | Keterangan |
|---|:---:|---|
| `DATABASE_URL` | ✅ | Postgres. Sertakan `?sslmode=require` untuk Neon. |
| `AUTH_SECRET` | ✅ | Kunci tanda tangan sesi. 32 byte acak. Harus stabil. |
| `AUTH_URL` | ✅ | `https://lkps.bbg.ac.id` — dipakai menyusun tautan SSO. |
| `AUTH_TRUST_HOST` | ✅ | `true` kalau di belakang proxy. Tanpa ini login gagal. |
| `NEXTAUTH_SECRET` | ✅ | Harus **sama** dengan `AUTH_SECRET`. |
| `NEXTAUTH_URL` | ✅ | Sama dengan `AUTH_URL`. |
| `MINIO_ENDPOINT` | ✅ | Host R2, tanpa skema dan tanpa path. |
| `MINIO_PORT` | ✅ | `443` untuk R2. |
| `MINIO_USE_SSL` | ✅ | `true` untuk R2. |
| `MINIO_ACCESS_KEY` | ✅ | Kredensial R2. |
| `MINIO_SECRET_KEY` | ✅ | Kredensial R2. |
| `MINIO_BUCKET` | ✅ | `sim-lkps-evidence` |
| `SSO_SPMI_SECRET` | ✅ | Rahasia bersama dengan SPMI. Sama persis di kedua sisi. |
| `NEXT_PUBLIC_SPMI_URL` | ✅ | `https://spmi.bbg.ac.id` — tujuan tombol "Kembali ke SPMI". |
| `NEXT_PUBLIC_APP_NAME` | — | Judul aplikasi. |
| `NEXT_PUBLIC_APP_URL` | — | Alamat publik aplikasi. |
| `SSO_SPMI_AUTOPROVISI` | — | `0` = pengguna SPMI harus sudah punya akun LKPS. Lebih aman. |

> **Catatan keamanan:** dengan `SSO_SPMI_AUTOPROVISION=1` (bawaan), siapa pun yang
> bisa membuat tiket SPMI — yaitu siapa pun yang bisa membaca `system/config.php`
> di server SPMI — dapat membuat akun LKPS. Set ke `0` kalau akun dibuat manual.

---

*Dokumen ini dibuat 2 November 2026. Kalau kode berubah dan langkah di sini tidak
lagi cocok, perbarui dokumen ini — jangan biarkan panduan yang salah beredar.*
