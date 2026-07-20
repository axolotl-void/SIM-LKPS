# 🔒 Security Quick Fix — Rencana Eksekusi

**Versi:** 1.0  
**Status:** Planning  
**Estimasi:** 1 hari (paralel dengan pengembangan fitur)

---

## Ringkasan

Security Quick Fix mencakup 3 area:
1. **Fix MinIO public bucket** — Hapus akses anonim
2. **Fix credential fallback** — Hapus hardcoded default credentials
3. **Rapihin struktur folder** — Pindahkan `ai-company/output/sim-lkps/` ke root project

Tidak mengubah logika bisnis. Tidak memengaruhi fitur yang sedang berjalan.

---

## Task 1: Fix MinIO Public Bucket

### Lokasi: `docker-compose.yml`

### Masalah
Baris ini membuat bucket `evidence` bisa di-download siapa saja tanpa autentikasi:
```yaml
mc anonymous set download local/evidence;
```

### Solusi
Hapus baris `mc anonymous set download` dari service `minio-init`. Bucket tetap dibuat, tapi akses hanya via aplikasi yang punya session valid.

### Perubahan
```yaml
# docker-compose.yml — service minio-init
entrypoint: >
  /bin/sh -c "
  mc alias set local http://minio:9000 minioadmin minioadmin;
  mc mb local/evidence --ignore-existing;
  exit 0;
  "
```

### Verification
- `docker compose up` → bucket `evidence` terbuat
- Akses langsung ke MinIO API tanpa token → ditolak (bukan 200)

---

## Task 2: Fix Credential Fallback

### Lokasi: `lib/minio.ts`

### Masalah
```typescript
accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
```

Jika env var tidak ter-set, fallback ke `minioadmin:minioadmin` — default MinIO yang public diketahui.

### Solusi
Hapus fallback hardcoded. Jika env var tidak ada, throw error di init sehingga aplikasi tidak jalan dengan credential default.

### Perubahan

```typescript
// lib/minio.ts — before
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

// lib/minio.ts — after
const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: parseInt(process.env.MINIO_PORT ?? "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: requiredEnv("MINIO_ACCESS_KEY"),
  secretKey: requiredEnv("MINIO_SECRET_KEY"),
});
```

MinIO endpoint dan port boleh fallback (localhost:9000 aman untuk dev). Tapi credential tidak boleh.

### Verification
- Hapus `MINIO_ACCESS_KEY` dari `.env` → app throw error di init
- Set credential valid → app berjalan normal
- Di production, credential wajib diubah dari default

---

## Task 3: Rapihin Struktur Folder

### Masalah
Aplikasi utama (`sim-lkps/`) terkubur di dalam folder framework AI:
```
SIM-LKPS/
  ├── ai-company/              # Framework AI Python (generator code)
  │     └── output/
  │           └── sim-lkps/    # ⬅️ Aplikasi utama di sini
```

Ini membuat:
- Repo tidak intuitive untuk developer baru
- Path jadi panjang (contoh: `ai-company/output/sim-lkps/lib/auth.ts`)
- Bisa ada konflik jika AI Company generate ulang

### Solusi
Pindahkan `output/sim-lkps/` ke root project. Gunakan dua strategi:

#### Opsi A: Symlink (Cepat, Tidak Rusak)
```
# Dari root SIM-LKPS/
ln -s ai-company/output/sim-lkps/ sim-lkps
```
Keuntungan: AI Company tetap bisa generate ke folder yang sama, path tetap jalan.
Kerugian: Masih ada duplikasi path.

#### Opsi B: Pindah Folder + Update AI Company Output Path
1. `mv ai-company/output/sim-lkps/ ./sim-lkps/`
2. Update `main.py` atau env biar output path jadi `../sim-lkps/`

**Rekomendasi: Opsi A dulu (symlink), karena zero risk.**

Setelah fitur selesai 100% nanti, baru lakukan Opsi B sebagai permanent fix.

### Struktur setelah symlink
```
SIM-LKPS/
  ├── ai-company/              # Framework AI
  │     └── output/
  │           └── sim-lkps/    # tetap ada (asal folder generate)
  ├── sim-lkps/                # ⬅️ Symlink ke ai-company/output/sim-lkps/
  ├── LKPS_LAM_INFOKOM_Kiro.md
  └── Rancangan_SIM-LKPS_AI_Team.md
```

### Verification
- `ls -la` dari root → `sim-lkps` hijau/blink (symlink)
- `cd sim-lkps && npm run dev` → berjalan normal
- AI Company generate ulang → file tetap muncul di `ai-company/output/sim-lkps/`

---

## Execution Order

```
Task 1: Fix MinIO bucket ───────────────── 5 menit
Task 2: Fix credential fallback ─────────── 5 menit
Task 3: Rapihin folder (symlink) ────────── 2 menit
                          Total: ~12 menit kerja
```

Semua task independent — bisa dikerjakan paralel.

---

## Rollback Plan

| Task | Rollback |
|------|----------|
| Task 1 | Kembalikan baris `mc anonymous set download` |
| Task 2 | Kembalikan ke `|| "minioadmin"` |
| Task 3 | Hapus symlink: `rm sim-lkps` |

---

## Status Tracking

| Task | Status | Catatan |
|------|--------|---------|
| 1. Fix MinIO bucket | ⬜ Belum | |
| 2. Fix credential fallback | ⬜ Belum | |
| 3. Rapihin folder | ⬜ Belum | |
