# Deploy SIM-LKPS di server kampus (`lkps.bbg.ac.id`)

## Kondisi server kampus (hasil periksa 7 Okt 2026)

| Hal | Kenyataan |
|---|---|
| Aplikasi SPMI | PHP native + mysqli, tanpa framework, tanpa git |
| IP server | `103.87.67.248` (Biznet, Indonesia) |
| Panel | **WHM/cPanel** — port 2087 (WHM) & 2086 **terbuka** → bukan shared hosting biasa, ini server yang adminnya punya akses root |
| Port lain terbuka | 22 (SSH), 21 (FTP), 80, 443, 3306 (MySQL), 8080, 8443 |
| Depan | **Cloudflare** mem-proxy `bbg.ac.id` + `spmi.bbg.ac.id` (origin disembunyikan) |
| Artinya | Node.js **bisa** dijalankan. Yang perlu diputuskan cuma caranya |

Karena CNAME sudah diizinkan, tidak ada DNS rumit: satu record baru di Cloudflare
(`lkps` → IP server yang sama, proxy ON) dan satu subdomain di cPanel.

## Tiga cara menjalankan Node di server itu

Urutan sesuai kecocokan: **Docker** kalau root SSH boleh → **systemd** kalau root SSH boleh
tapi tanpa Docker → **Node.js App (Passenger)** kalau root tidak diberikan. Ketiganya
memakai image/build yang sama; yang beda cuma siapa yang menjalankan prosesnya.

### Jalur 1 — Docker (paling rapi)

```bash
# di server, sekali saja
dnf install -y docker-ce docker-compose-plugin || yum install -y docker docker-compose
systemctl enable --now docker

# deploy
cd /opt/sim-lkps && git clone <repo> .   # atau rsync dari Mac
cp deploy/.env.production.example deploy/.env.production && nano deploy/.env.production
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.production up -d --build
```

Skema DB di server baru (hanya kalau memakai Postgres lokal):

```bash
docker compose -f deploy/docker-compose.prod.yml exec app \
  npx prisma db push --skip-generate
docker compose -f deploy/docker-compose.prod.yml exec app \
  npx tsx prisma/seed.ts        # butuh SEED_ADMIN_PASSWORD di env
```

### Jalur 2 — systemd (tanpa Docker)

```bash
sudo useradd -r -m -d /var/www/sim-lkps simlkps
sudo -u simlkps git clone <repo> /var/www/sim-lkps
cd /var/www/sim-lkps
sudo -u simlkps corepack enable && sudo -u simlkps pnpm install --frozen-lockfile
sudo -u simlkps pnpm prisma generate && sudo -u simlkps pnpm build
sudo cp deploy/sim-lkps.service /etc/systemd/system/
sudo chmod 600 /etc/sim-lkps.env && sudo systemctl enable --now sim-lkps
```

### Jalur 3 — cPanel "Setup Node.js App" (Passenger, tanpa root)

Tidak perlu root; cPanel menjalankan sendiri proses Node-nya. Batasannya: satu proses per
subdomain, sumber daya dibatasi, dan restart bisa dilakukan cPanel sendiri.

- **Application root**: `/home/<user>/lkps`
- **Application URL**: `lkps.bbg.ac.id`
- **Application startup file**: `server.js` (dari `.next/standalone`)
- **Node version**: 22
- Env variabel dimasukkan lewat menu itu (bukan berkas).
- Build dilakukan lewat SSH: `pnpm install && pnpm prisma generate && pnpm build`, lalu
  salin isi `.next/standalone` + `.next/static` + `public` ke application root.

> Kalau jalur 3 dipakai, **jangan pindah DB ke MySQL**. Prisma di proyek ini memakai
> PostgreSQL; pindah ke MySQL berarti mengubah provider, dan beberapa query (mode
> `insensitive`, perilaku JSON) ikut berubah. Tetap pakai Neon atau Postgres lokal.

## Menyambungkan subdomain ke aplikasi

**Apache/cPanel (jalur 1 & 2)** — taruh `deploy/cpanel-proxy.htaccess` sebagai `.htaccess`
di docroot subdomain. Wajib ada `RequestHeader set X-Forwarded-Proto "https"`; tanpa itu
Next.js mengira dirinya di HTTP dan **cookie sesi (secure) tidak akan terkirim** — gejalanya
"login berhasil tapi dilempar balik ke halaman login".

**nginx (jalur 1 & 2, kalau ada nginx sendiri)** — pakai `deploy/nginx-sim-lkps.conf`.

**SSL**: subdomain di cPanel bisa pakai AutoSSL (Let's Encrypt). Karena Cloudflare ada di
depan, atur mode SSL ke **Full (strict)**; jangan "Flexible" — itu membuat Cloudflare bicara
HTTP ke origin padahal aplikasi mengira HTTPS.

## Data yang perlu dipindahkan (kalau keluar dari Vercel)

| Yang lama | Yang baru | Cara |
|---|---|---|
| Neon (Postgres) | Postgres di server kampus | `pg_dump --no-owner <neon-url> \| psql <url-lokal>` — urutannya: dump dulu, restore, baru ganti `DATABASE_URL` |
| Cloudflare R2 (berkas bukti) | tetap R2 atau MinIO lokal | Kalau tetap R2: tidak ada yang dipindah. Kalau pindah ke MinIO: `rclone` dari S3 R2 → S3 MinIO, lalu samakan `MINIO_*` |
| Vercel | Apache/nginx + Node | lihat jalur 1–3 |

Jujur soal ini: **pindah DB dan berkas itu pekerjaan yang bisa gagal setengah jalan.**
Rekomendasi: tahap pertama pindahkan **aplikasinya saja**, `DATABASE_URL` dan `MINIO_*` tetap
menunjuk Neon + R2. Semua tetap jalan, dan tidak ada risiko data. Pemindahan data dikerjakan
belakangan sebagai langkah terpisah, saat sudah tenang dan ada backup.

## Verifikasi setelah deploy

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://lkps.bbg.ac.id/login          # 200
curl -sI https://lkps.bbg.ac.id/dashboard | head -1                            # 307 ke /login (belum login)
curl -s https://lkps.bbg.ac.id/api/health                                      # balasan sehat dari DB
```

Lalu uji sungguhan di browser: login manual → `/dashboard` 200; klik dari SPMI → masuk tanpa
login (setelah RANCANGAN-014 dipasang); unggah satu bukti → tersimpan.

## Rollback

- Aplikasi: `docker compose down` (jalur 1), `systemctl stop sim-lkps` (jalur 2), atau matikan
  app di cPanel (jalur 3). Domain lalu diarahkan balik ke Vercel (`lkps.zegika.com` masih hidup).
- DB: selama tahap pertama tidak memindahkan data, rollback tidak menyentuh data sama sekali.
- DNS: record `lkps` dihapus/diarahkan balik. Cloudflare membuat perubahan ini hampir instan.

## Jangan dilakukan

- Jangan taruh `AUTH_SECRET` atau `SSO_SPMI_SECRET` di dalam docroot, di repo, atau di dokumen.
  Berkas env di server: `chmod 600`, di luar folder yang bisa diunduh.
- Jangan menyimpan `node_modules` hasil build Mac ke server — arsitektur beda. Selalu build di
  server (Docker atau `pnpm build` di sana).
- Jangan pakai Cloudflare SSL mode "Flexible".
- Jangan menyalakan `pnpm build` di Mac selagi `next dev` jalan (`.next` bisa rusak).
