# SIM-LKPS

**Sistem Informasi Manajemen Laporan Kinerja Program Studi**

Aplikasi web untuk mengelola 31 tabel LKPS Program Studi Ilmu Komputer, Universitas Bina Bangsa Getsempena (UBBG).

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20 LTS
- Docker & Docker Compose
- Git

### Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd sim-lkps

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database URL

# 4. Start services (PostgreSQL + MinIO)
docker compose up -d

# 5. Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# 6. Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Default Login

```
Email:    admin@ubbg.ac.id
Password: Admin@2026!
```

---

## 📋 Features

- ✅ 31 tabel LKPS sesuai format BAN-PT
- ✅ 4 role: Admin, Operator, Validator, Pimpinan
- ✅ Dashboard progres per BAB
- ✅ Workflow validasi (Draft → Submit → Review → Approve)
- ✅ Upload bukti pendukung (MinIO S3)
- ✅ Export ke Excel, Word, PDF
- ✅ Audit log aktivitas
- ✅ Notifikasi in-app

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 App Router, React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Next.js Route Handlers, Server Actions |
| Database | PostgreSQL 16, Prisma ORM |
| Auth | Auth.js (NextAuth v5) |
| Storage | MinIO (S3-compatible) |
| Validation | Zod, React Hook Form |
| Testing | Vitest, Playwright |
| Deploy | Docker, Nginx |

---

## 📁 Project Structure

```
sim-lkps/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth pages (login)
│   ├── (dashboard)/        # Dashboard pages (sidebar layout)
│   └── api/                # API route handlers
├── components/
│   ├── forms/              # Form components
│   ├── layout/             # Layout (sidebar, header)
│   ├── tables/             # Data table components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth.ts             # Auth.js configuration
│   ├── db.ts               # Prisma client
│   ├── minio.ts            # MinIO client
│   ├── utils/              # Utility functions
│   └── validations/        # Zod schemas
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── docker-compose.yml      # PostgreSQL + MinIO
└── docs/                   # Documentation
```

---

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Lint
npm run lint

# Type check
npm run type-check

# Format code
npm run format

# Run tests
npm run test

# Open Prisma Studio
npm run db:studio
```

---

## 📊 LKPS Tables (31)

| BAB | Jumlah | Tabel |
|-----|--------|-------|
| BAB 1 — Tata Pamong | 6 | 1.A.1–1.A.5, 1.B |
| BAB 2 — Pendidikan | 11 | 2.A.1–2.A.3, 2.B.1–2.B.6, 2.C, 2.D |
| BAB 3 — Penelitian | 6 | 3.A.1–3.A.3, 3.C.1–3.C.3 |
| BAB 4 — Pengabdian | 5 | 4.A.1–4.A.2, 4.C.1–4.C.3 |
| BAB 5 — Tata Kelola | 2 | 5.1, 5.2 |
| BAB 6 — Visi Misi | 1 | 6 |

---

## 🔐 Roles & Permissions

| Feature | Admin | Operator | Validator | Pimpinan |
|---------|:-----:|:--------:|:---------:|:--------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Master Data CRUD | ✅ | ❌ | ❌ | ❌ |
| Input Tabel LKPS | ✅ | ✅ | ❌ | ❌ |
| Submit Tabel | ❌ | ✅ | ❌ | ❌ |
| Validasi Tabel | ❌ | ❌ | ✅ | ❌ |
| Export Laporan | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ❌ | ❌ | ❌ |

---

## 📄 License

Private — Program Studi Ilmu Komputer, UBBG.
