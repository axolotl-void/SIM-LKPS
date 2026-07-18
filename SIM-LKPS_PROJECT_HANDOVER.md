# SIM-LKPS — Project Handover Document

> Copy seluruh dokumen ini ke chat baru sebagai instruksi awal untuk Kiro.

---

## 📋 RINGKASAN PROYEK

**Nama:** SIM-LKPS (Sistem Informasi Manajemen Laporan Kinerja Program Studi)
**Institusi:** Program Studi Ilmu Komputer, Universitas Bina Bangsa Getsempena (UBBG), Banda Aceh
**Tujuan:** Digitalisasi 31 tabel LKPS untuk akreditasi BAN-PT
**Status:** Dalam pengembangan (BAB 1 ✅, BAB 2 ✅)

---

## 🏗️ STACK TEKNOLOGI

| Layer | Teknologi | Versi |
|---|---|---|
| **Frontend** | Next.js App Router | 15.x |
| **Bahasa** | TypeScript | 5.6 (strict) |
| **UI** | Tailwind CSS | 4.x |
| **UI Komponen** | shadcn/ui (Radix) | latest |
| **Animasi** | Framer Motion | 11.x |
| **Auth** | Auth.js (NextAuth v5) | 5.x (Credentials provider) |
| **Database** | PostgreSQL | 16+ |
| **ORM** | Prisma | 6.x |
| **Storage** | MinIO | 8.x |
| **Form/Validasi** | React Hook Form + Zod | latest |
| **State Client** | Zustand | 5.x |
| **Export** | ExcelJS, docx | latest |
| **Testing** | Vitest, Playwright | latest |
| **Deployment** | Docker + Docker Compose | latest |

### UI Theme: **Soft UI**
- Warna: `#f8f9fa` background, `bg-gradient-to-tr from-blue-500 to-indigo-600` primary
- Shadow: `shadow-soft`, `shadow-soft-sm`, `shadow-soft-lg`
- Border radius: `rounded-xl` (1rem), `rounded-2xl` (1.25rem), `rounded-3xl` (1.5rem)
- Font: Inter, ukuran `text-xs` untuk body, `text-3xs` untuk badge
- Semua aturan detail di: `ai-company/.kiro/steering/soft-ui-design-system.md`

---

## 🧠 AI TEAM (ai-company/)

### Arsitektur Multi-Agent (LangGraph)

```
START → PM Agent → CTO Agent → Developer Agent [loop] → END
```

| Agent | Peran | Status |
|---|---|---|
| **PM Agent** | Analisis requirement, user story, acceptance criteria, prioritas | ✅ Ada, tapi **Mode Mock** |
| **CTO Agent** | Arsitektur, ERD, Prisma schema, task breakdown | ✅ Ada, tapi **Mode Mock** |
| **Developer Agent** | Implementasi kode ke `output/sim-lkps/` | ✅ Ada, tapi **Mode Mock** |
| **Design Critic Agent** | Evaluasi UI/UX (disebut di CANVAS) | ❌ **Belum diimplementasi** |
| **Benchmark Reviewer** | Benchmark kelas dunia (disebut di CANVAS) | ❌ **Belum diimplementasi** |

### ⚠️ Status AI Company:
- **LLM dalam mode MOCK** karena `.env` pakai `your-api-key-here`
- Kode di `output/sim-lkps/` kemungkinan besar dibuat MANUAL oleh Kiro, **BUKAN** oleh AI Company agents
- File prompt (`pm.md`, `cto.md`, `developer.md`) **tidak ada** di folder `shared/`
- Agent review (Design Critic & Benchmark) tidak ada di kode

---

## 📂 STRUKTUR PROYEK

```
output/sim-lkps/
├── app/
│   ├── (auth)/login/page.tsx          # Halaman login
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Layout sidebar + header
│   │   ├── page.tsx                   # Dashboard redirect
│   │   ├── dashboard/page.tsx         # Dashboard stats
│   │   ├── forbidden/page.tsx         # Halaman akses ditolak
│   │   ├── lkps/bab-1/               # 6 tabel BAB 1 (LENGKAP)
│   │   │   ├── page.tsx               # Grid card daftar tabel
│   │   │   ├── tabel-1a1/page.tsx     # Pimpinan dan Tupoksi
│   │   │   ├── tabel-1a2/page.tsx     # Sumber Pendanaan
│   │   │   ├── tabel-1a3/page.tsx     # Penggunaan Dana
│   │   │   ├── tabel-1a4/page.tsx     # Beban DTPR (EWMP)
│   │   │   ├── tabel-1a5/page.tsx     # Kualifikasi Tendik
│   │   │   ├── tabel-1b/page.tsx      # Unit SPMI dan SDM
│   │   │   └── error.tsx              # Error boundary BAB 1
│   │   ├── lkps/bab-2/               # 11 tabel BAB 2 (LENGKAP)
│   │   │   ├── page.tsx               # Grid card daftar tabel
│   │   │   ├── tabel-2a1/page.tsx     # Data Mahasiswa
│   │   │   ├── tabel-2a2/page.tsx     # Keragaman Asal Mahasiswa
│   │   │   ├── tabel-2a3/page.tsx     # Kondisi Jumlah Mahasiswa
│   │   │   ├── tabel-2b1/page.tsx     # Isi Pembelajaran
│   │   │   ├── tabel-2b2/page.tsx     # Pemetaan CPL dan PL
│   │   │   ├── tabel-2b3/page.tsx     # Peta Pemenuhan CPL
│   │   │   ├── tabel-2b4/page.tsx     # Rata-rata Masa Tunggu
│   │   │   ├── tabel-2b5/page.tsx     # Kesesuaian Bidang Kerja
│   │   │   ├── tabel-2b6/page.tsx     # Kepuasan Pengguna
│   │   │   ├── tabel-2c/page.tsx      # Fleksibilitas Pembelajaran
│   │   │   └── tabel-2d/page.tsx      # Rekognisi Lulusan
│   │   ├── lkps/bab-3/               # ❌ BELUM DIBUAT
│   │   ├── settings/users/page.tsx    # Manajemen user
│   │   ├── settings/audit-log/page.tsx# Audit log
│   │   └── settings/layout.tsx        # Layout settings
│   ├── api/auth/[...nextauth]/       # Auth API
│   ├── api/health/route.ts            # Health check
│   ├── layout.tsx                     # Root layout (Inter font)
│   ├── page.tsx                       # Root → redirect ke /dashboard
│   ├── globals.css                    # Global styles (Soft UI tokens)
│   ├── error.tsx                      # Global error boundary
│   └── loading.tsx                    # Global loading skeleton
│
├── components/
│   ├── layout/ (sidebar.tsx, header.tsx)  # Layout komponen
│   ├── forms/ (login-form.tsx, create-user-dialog.tsx)
│   ├── tables/                             # Client komponen per tabel
│   │   ├── tabel-1a1-client.tsx sampai tabel-1b-client.tsx (6 file BAB 1)
│   │   ├── tabel-2a1-client.tsx sampai tabel-2d-client.tsx (11 file BAB 2)
│   │   ├── user-table.tsx
│   │   └── (BAB 3-6: ❌ BELUM)
│   └── shared/
│       ├── error-boundary.tsx         # Reusable ErrorBoundary class
│       ├── skeleton.tsx               # 6 varian skeleton utilities
│       └── permission-gate.tsx        # RBAC component
│
├── lib/
│   ├── auth.ts                        # NextAuth config
│   ├── db.ts                          # Prisma client singleton
│   ├── minio.ts                       # MinIO client
│   ├── actions/ (auth.ts, lkps.ts, user.ts)  # Server Actions
│   ├── types/auth.ts
│   ├── utils/ (audit.ts, format.ts, permissions.ts)
│   └── validations/ (auth.ts, master.ts)
│
├── prisma/
│   ├── schema.prisma                  # 15+ model (User, Dosen, TabelLkps, dll)
│   └── seed.ts                        # Seed data (admin, prodi, 31 definisi)
│
├── docs/                              # Dokumentasi lengkap
│   ├── requirements.md, architecture.md, api-contract.md
│   ├── database.md, user-stories.md, acceptance-criteria.md
│   ├── roadmap.md, task-breakdown.md
│   └── sprints/ (sprint-0.md, sprint-5.md)
│
├── .kiro/steering/
│   └── soft-ui-design-system.md       # Design system guide (auto-include)
│
├── middleware.ts                       # Auth middleware
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## ✅ STATUS IMPLEMENTASI

### Modul Selesai (✅)
| Modul | Detail |
|---|---|
| **Auth & RBAC** | Login, session JWT, 4 roles (ADMIN/OPERATOR/VALIDATOR/PIMPINAN), middleware |
| **Dashboard** | Stats cards, progress per BAB, aktivitas terkini, role-based view |
| **BAB 1** (6 tabel) | Lengkap dengan CRUD, modal form, toast, delete confirmation |
| **BAB 2** (11 tabel) | Lengkap — semua tabel bisa diisi, TS-1/TS-2 auto rollover |
| **Error Boundary** | Global + dashboard + BAB 1 + reusable ErrorBoundary class |
| **Loading Skeleton** | Dashboard loading + 6 varian reusable skeleton components |
| **Soft UI Design Guide** | Steering file auto-include untuk konsistensi desain |

### Pola Tabel yang Sudah Baku
Semua tabel di BAB 1 dan BAB 2 mengikuti pola ini:
1. **Read table** — tampilkan data TS-2, TS-1 (read-only, abu-abu), TS (tebal, berwarna)
2. **1 tombol "Edit Data TS"** — buka modal besar isi semua data sekaligus
3. **Modal form** — input dikelompokkan per kategori dengan icon + warna
4. **Simpan** → data masuk DB → `router.refresh()` → table update
5. **Total baris** + persentase di footer

### Khusus Tabel Tipe Time-Series (TS)
- User **hanya isi TS** (tahun sekarang)
- TS-1 = data TS tahun lalu (otomatis dari DB tahun akademik sebelumnya)
- TS-2 = data TS 2 tahun lalu
- ❌ **TIDAK** perlu isi TS-1/TS-2 manual

### Yang Belum (❌)
| Modul | Keterangan |
|---|---|
| **BAB 3 — Penelitian** (6 tabel) | Belum ada folder/page/component |
| **BAB 4 — Pengabdian** (5 tabel) | Belum ada folder/page/component |
| **BAB 5 — Tata Kelola** (2 tabel) | Belum ada folder/page/component |
| **BAB 6 — Visi Misi** (1 tabel) | Belum ada folder/page/component |
| **Evidence/Upload** | Schema + MinIO config ada, UI upload belum |
| **Validation Workflow** | Schema status enum ada, UI validasi belum |
| **Export** (Excel/Word/PDF) | Dependency diinstall, implementasi belum |
| **Testing** | Dependency ada, file test = 0 |
| **Seed data komprehensif** | Admin + prodi + ta + definisi ada, data dosen/tendik/mahasiswa belum |
| **Database migration** | Perlu `npx prisma db push` atau `npx prisma migrate dev` |
| **Deployment** | Docker compose ada, tapi belum di-deploy |

---

## 🗄️ DATABASE (Prisma Schema)

### Model Utama
```
User (role: ADMIN/OPERATOR/VALIDATOR/PIMPINAN)
Prodi → TahunAkademik
Dosen, Tendik, Mahasiswa, MataKuliah  (master data)
TabelDefinition → TabelLkps → TabelLkpsRow (dynamic JSON)
Evidence, ValidationHistory, AuditLog, Notification
```

### Login Admin Default (dari seed)
- **Email:** `admin@ubbg.ac.id`
- **Sandi:** `Admin@2026!`

### Cara Setup Database
```bash
cd output/sim-lkps
cp .env.example .env
# Edit .env — isi DATABASE_URL
npx prisma db push
npx prisma db seed
npm run dev
```

---

## 🔑 KEPUTUSAN ARSITEKTUR PENTING

1. **Auth:** Auth.js (NextAuth v5) — Credentials provider
2. **Storage:** MinIO (self-hosted, S3-compatible)
3. **State:** Server State default, Zustand hanya untuk global UI
4. **Data tabel:** JSON di `TabelLkpsRow.rowData` — dynamic, no migration per tabel
5. **TS rolling:** Setiap tabel punya data per tahun akademik, TS-1/TS-2 diambil dari tahun sebelumnya
6. **UI Pattern:** Modal-based CRUD, bukan inline editing, untuk UX lebih nyaman
7. **Error handling:** Global error boundary + per segment + reusable ErrorBoundary class
8. **File naming:** `tabel-{kode}.tsx` dengan kode lowercase tanpa titik (contoh: `tabel-1a1`, `tabel-2b4`)

---

## 📝 PROMPT UNTUK CHAT BARU

> Salin teks di bawah ini ke chat baru sebagai instruksi awal:

---

Saya melanjutkan project **SIM-LKPS** (Sistem Informasi Manajemen LKPS) untuk Prodi Ilmu Komputer UBBG.

**Stack:** Next.js 15 App Router, TypeScript strict, Tailwind CSS 4, shadcn/ui, Framer Motion, Prisma ORM + PostgreSQL, Auth.js, MinIO.

**UI Theme:** Soft UI — baca file `.kiro/steering/soft-ui-design-system.md` untuk design tokens lengkap.

**Project path:** `ai-company/output/sim-lkps/`

**Yang sudah selesai:**
- Auth & RBAC (login, 4 roles, middleware)
- Dashboard dengan stats + progress
- BAB 1 — 6 tabel Tata Pamong (CRUD, modal form, toast, delete)
- BAB 2 — 11 tabel Pendidikan (CRUD, TS rollover, summary cards, persentase)
- Error boundary global + reusable ErrorBoundary class
- Loading skeleton komponen
- Soft UI design guide di steering files
- Prisma schema lengkap (15+ model)
- Seed data (admin, prodi, tahun akademik, 31 definisi tabel)
- API contract & dokumentasi di folder docs/

**Login admin:** admin@ubbg.ac.id / Admin@2026!

**Yang perlu dikerjakan selanjutnya (BAB 3-6):**
1. BAB 3 — Penelitian (6 tabel: 3.A.1, 3.A.2, 3.A.3, 3.C.1, 3.C.2, 3.C.3)
2. BAB 4 — Pengabdian (5 tabel: 4.A.1, 4.A.2, 4.C.1, 4.C.2, 4.C.3)
3. BAB 5 — Tata Kelola (2 tabel: 5.1, 5.2)
4. BAB 6 — Visi Misi (1 tabel: 6)

**Pola pembuatan tabel yang sudah baku:**
- 1 file `app/(dashboard)/lkps/bab-{n}/tabel-{kode}/page.tsx` (server, fetch data)
- 1 file `components/tables/tabel-{kode}-client.tsx` (client, CRUD)
- Lihat contoh `tabel-2b5` atau `tabel-2b4` sebagai referensi pola terbaru
- User hanya input TS, TS-1/TS-2 auto dari tahun sebelumnya
- 1 tombol "Edit Data TS" → modal besar input semua baris
- Summary cards di atas, total baris + persentase di footer
- UI harus konsisten dengan Soft UI (shadow-soft, rounded-2xl, gradient primary)

**Data LKPS lengkap** ada di file: `LKPS_LAM_INFOKOM_Kiro.md` (berisi semua tabel dan isi dari PDF BAN-PT).

Mulai dengan BAB 3 — Penelitian, tabel 3.A.1 Sarana dan Prasarana Penelitian.
