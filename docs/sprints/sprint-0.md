# Sprint 0 — Project Foundation

**Sprint Goal:** Setup fondasi proyek SIM-LKPS sehingga seluruh tim (CTO + Developer) siap memulai implementasi.

**Durasi:** 7 hari  
**Status:** ▶️ IN PROGRESS  
**Agent:** PM Agent (perencanaan) → CTO Agent (arsitektur) → Developer Agent (setup)

---

## 1. Tujuan Sprint 0

| No | Tujuan | Kriteria Selesai |
|----|--------|-----------------|
| 1 | Dokumen requirement, user story, AC, dan roadmap tersedia | Semua dokumen di `docs/` terisi lengkap |
| 2 | Arsitektur teknis, ERD, dan API contract dirancang | CTO menghasilkan `architecture.md`, `database.md`, `api-contract.md` |
| 3 | Repository Next.js 15 App Router siap | `npm run dev` berjalan tanpa error |
| 4 | Database PostgreSQL terkonfigurasi | `npx prisma db push` berhasil |
| 5 | Auth.js terkonfigurasi | Login/logout flow basic berfungsi |
| 6 | MinIO storage terkonfigurasi | File upload test berhasil |
| 7 | CI pipeline dasar aktif | Lint + type-check berjalan otomatis |
| 8 | Coding standard terdokumentasi | ESLint, Prettier, TypeScript strict rules |

---

## 2. Masalah Utama yang Diselesaikan

1. **Tidak ada repository** — Belum ada codebase untuk SIM-LKPS
2. **Tidak ada arsitektur** — Belum ada desain ERD, API, dan folder structure
3. **Tidak ada standard** — Belum ada aturan coding dan tooling
4. **Tidak ada CI** — Belum ada pipeline otomatis untuk quality check
5. **Tidak ada dokumentasi** — Requirement tersebar di berbagai dokumen

---

## 3. Ruang Lingkup MVP vs Non-MVP

### MVP (Sprint 0–6)
Fitur minimum yang harus ada sebelum rilis pertama:

| Modul | Fitur Inti |
|-------|-----------|
| Auth | Login, logout, 4 role, permission |
| Dashboard | Statistik per role |
| Master Data | Prodi, tahun akademik, dosen, tendik, mahasiswa, mata kuliah, user |
| BAB 1 | 6 tabel Tata Pamong |
| BAB 2 | 11 tabel Pendidikan |

### Non-MVP (Sprint 7–15)
Fitur yang ditunda setelah MVP stabil:
- BAB 3–6 (14 tabel sisanya)
- Evidence management (upload bukti)
- Validation workflow lengkap
- Export Excel/Word/PDF
- Notifikasi
- Deployment production

---

## 4. Daftar Aktor dan Permission

| Aktor | Kode | Deskripsi | Permission Utama |
|-------|------|-----------|-----------------|
| **Admin** | `ADMIN` | Superuser sistem | Semua akses, termasuk user management dan settings |
| **Operator** | `OPERATOR` | Tim LKPS yang mengisi data | Input/edit tabel LKPS, upload bukti, submit |
| **Validator** | `VALIDATOR` | Kaprodi yang mereview | Review, komentar, approve/reject submission |
| **Pimpinan** | `PIMPINAN` | Dekan/Wakil Dekan | View dashboard, view laporan, export |

### Permission Detail (Sprint 1)

```
ADMIN:
  - user.*          (create, read, update, delete)
  - master_data.*   (create, read, update, delete)
  - tabel_lkps.*    (create, read, update, delete, submit, validate)
  - evidence.*      (create, read, update, delete)
  - settings.*      (read, update)
  - audit_log.read

OPERATOR:
  - tabel_lkps.read
  - tabel_lkps.create
  - tabel_lkps.update   (own data only)
  - tabel_lkps.submit   (own data only)
  - evidence.create
  - evidence.read
  - master_data.read

VALIDATOR:
  - tabel_lkps.read
  - tabel_lkps.validate
  - tabel_lkps.comment
  - evidence.read
  - master_data.read

PIMPINAN:
  - dashboard.read
  - tabel_lkps.read
  - report.read
  - report.export
  - master_data.read
```

---

## 5. User Journey Utama

### Journey Prioritas 1: Pengisian Tabel LKPS

```
[Operator Login]
    → Dashboard: lihat tabel mana yang belum terisi
    → Pilih BAB (misal: BAB 1)
    → Pilih Tabel (misal: 1.A.1 Pimpinan dan Tupoksi)
    → Pilih Tahun Akademik (misal: 2024/2025 Ganjil)
    → Isi form sesuai kolom BAN-PT
    → Simpan sebagai Draft
    → Lanjut isi / Edit
    → Submit untuk validasi
    → Tunggu review Validator
    → [Ditolak] → Edit → Re-submit
    → [Disetujui] → ✅ Done
```

### Journey Prioritas 2: Validasi (Validator)

```
[Validator Login]
    → Dashboard: lihat antrian validasi
    → Pilih submission tabel
    → Review data
    → Periksa bukti pendukung (jika ada)
    → Beri catatan / komentar
    → Approve / Reject / Minta Revisi
    → Operator diberitahu otomatis
```

---

## 6. Risiko dan Asumsi

### Risiko

| No | Risiko | Dampak | Mitigasi |
|----|--------|--------|----------|
| R-01 | Format tabel LKPS berubah (update BAN-PT) | Redesign form | Tabel LKPS configurable, schema di database |
| R-02 | VPS belum tersedia saat deployment | Tidak bisa deploy | Dev pakai Docker local, VPS disiapkan parallel |
| R-03 | Import data lama dari Excel bermasalah | Data tidak konsisten | Buat import tool dengan validasi |
| R-04 | User tidak familiar dengan sistem baru | Adoption lambat | UI intuitif, sertakan panduan penggunaan |
| R-05 | Sinkronisasi data antar tabel kompleks | Bug kalkulasi | Unit test untuk setiap kalkulasi tabel |

### Asumsi

1. Panduan tabel LKPS mengacu BAN-PT terbaru dan tidak berubah selama pengembangan
2. PostgreSQL dan MinIO dijalankan via Docker (development dan production)
3. Minimal 1 Admin account di-seed saat pertama kali setup
4. VPS spesifikasi minimum: 2 vCPU, 4 GB RAM, 40 GB disk
5. Browser target: Chrome, Firefox, Edge (versi terbaru)
6. Tidak ada integrasi ke sistem eksternal (PDDIKTI, feeder) di MVP

---

## 7. Keputusan yang Sudah Dikonfirmasi

| Keputusan | Pilihan | Diputuskan oleh |
|-----------|---------|----------------|
| Authentication library | **Auth.js (NextAuth v5)** | User (via PM Agent) |
| Storage provider | **MinIO** (self-hosted S3-compatible) | User (via PM Agent) |
| Frontend framework | **Next.js 15 App Router** | Dokumen rancangan |
| Database | **PostgreSQL** | Dokumen rancangan |
| ORM | **Prisma** | Dokumen rancangan |
| UI library | **Tailwind CSS + shadcn/ui** | Dokumen rancangan |
| Validation | **Zod + React Hook Form** | Dokumen rancangan |
| State management | **Server state default, Zustand jika perlu** | Dokumen rancangan |
| Export | **ExcelJS, docx, Puppeteer** | Dokumen rancangan |
| Testing | **Vitest/Jest, Testing Library, Playwright** | Dokumen rancangan |
| Deployment | **Docker, VPS, reverse proxy** | Dokumen rancangan |

---

## 8. Keputusan yang Masih Perlu Dikonfirmasi

| No | Keputusan | Opsi | Status |
|----|-----------|------|--------|
| 1 | **Nama domain** untuk deployment | Belum ditentukan | ⏳ Pending (non-blocking untuk Sprint 0) |
| 2 | **Provider VPS** | DigitalOcean / Hetzner / local server kampus | ⏳ Pending (Sprint 15) |
| 3 | **Email service** untuk notifikasi | SMTP kampus / Resend / Mailtrap | ⏳ Pending (Sprint 12) |
| 4 | **Format kolom per tabel LKPS** | Referensi dokumen BAN-PT resmi | ⏳ Perlu validasi per tabel di Sprint 4+ |

---

## 9. Sprint 0 Task List (untuk CTO Agent)

Setelah dokumen PM ini di-review, CTO Agent akan memecah Sprint 0 menjadi task-task implementasi:

**Expected tasks:**
1. Setup Next.js 15 App Router project
2. Konfigurasi TypeScript strict mode
3. Konfigurasi ESLint + Prettier
4. Setup Tailwind CSS + shadcn/ui
5. Setup Prisma + PostgreSQL connection
6. Buat initial Prisma schema (User, Role, AuditLog, Prodi, TahunAkademik)
7. Setup Auth.js (credential provider)
8. Setup MinIO client library
9. Buat seed script (Admin user + tahun akademik default)
10. Setup CI pipeline (lint + type-check)
11. Buat README.md dan kontribusi guide

---

## 10. Definition of Done — Sprint 0

- [ ] Semua dokumen PM tersedia di `docs/`
- [ ] Arsitektur CTO tersedia (architecture.md, database.md, api-contract.md)
- [ ] Next.js 15 project berjalan (`npm run dev` sukses)
- [ ] PostgreSQL terhubung (`npx prisma db push` sukses)
- [ ] Auth.js terkonfigurasi
- [ ] MinIO client terkonfigurasi
- [ ] ESLint + Prettier + TypeScript strict aktif
- [ ] Seed data tersedia (1 Admin, 1 tahun akademik)
- [ ] README.md lengkap
- [ ] CI pipeline berjalan (lint + type-check)

---

**PM Agent Status: ✅ SPRINT 0 PLANNING COMPLETE**

➡️ **Selanjutnya: Serahkan ke CTO Agent untuk arsitektur dan task breakdown.**

---

*Dokumen ini dibuat oleh PM Agent. Semua deliverable PM Sprint 0 tersedia di:*
- `docs/requirements.md` ✅
- `docs/user-stories.md` ✅
- `docs/acceptance-criteria.md` ✅
- `docs/roadmap.md` ✅
- `docs/sprints/sprint-0.md` ✅ *(dokumen ini)*
