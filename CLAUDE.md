# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**SIM-LKPS** — Sistem Informasi Manajemen Laporan Kinerja Program Studi
Next.js 15 app (App Router) for managing **32 LKPS tables** + LED + Matriks Penilaian, sesuai instrumen **LAM INFOKOM 2.1**. Indonesian higher education accreditation system for Prodi Ilmu Komputer, Universitas Bina Bangsa Getsempena.

### Tiga modul instrumen (LAM INFOKOM 2.1)

| Modul | Isi | Route |
|---|---|---|
| **LKPS** | 32 tabel data kuantitatif | `/lkps/kriteria-{1..6}` |
| **LED** | Laporan Evaluasi Diri — BAB I–III, 92 bagian naratif (PPEPP) | `/led`, `/led/bab-1..3`, `/led/export` |
| **Matriks Penilaian** | 82 butir, bobot total 400, prediksi status akreditasi | `/penilaian` |

Tabel LKPS dulu disebut "BAB N"; sekarang **"Kriteria N"** (redirect lama ada di `next.config.ts`).
Halaman LED & Matriks Penilaian memakai izin `led.*` dan `penilaian.*`; `penilaian.finalisasi` hanya ADMIN.

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier write
npm run type-check   # TypeScript check
npm run db:push      # Prisma db push
npm run db:seed      # Seed database
npm run db:studio    # Prisma Studio
npm run test         # Vitest
npm run test:e2e     # Playwright
```

## Akun awal (lokal saja)

Sandi akun awal **tidak ditulis di kode** — repo ini publik, dan sandi yang
tertulis di kode akan terbaca siapa pun yang membuka GitHub. Sandi diambil dari
variabel lingkungan:

```bash
# .env  (berkas ini TIDAK ikut ter-commit)
SEED_ADMIN_PASSWORD="hasil dari: openssl rand -base64 18"
SEED_OPERATOR_PASSWORD="..."
SEED_PIMPINAN_PASSWORD="..."
```

Email akunnya: `admin@ubbg.ac.id`, `operator@ubbg.ac.id`, `pimpinan@ubbg.ac.id`.
Lupa sandinya? Ganti lewat halaman **Pengguna** di aplikasi (peran ADMIN), atau
variabel lingkungan di dashboard hosting.

> ⚠️ Jangan pernah menaruh sandi di berkas yang ikut ter-commit — termasuk
> berkas ini, README, dokumentasi, atau berkas uji.

## Architecture

### Route Groups (App Router)

- `(auth)/` — Login page only (no sidebar, centered gradient layout)
- `(dashboard)/` — All authenticated pages (shared sidebar layout)

### Server/Client Split

- **Server Components** (`page.tsx`): Fetch data with Prisma, pass to client
- **Client Components** (`*-client.tsx`): All interactivity (forms, modals, optimistic updates)
- **Server Actions** (`lib/actions/*.ts`): All mutations with auth + permission checks

### LKPS Table Pattern

1. Page (`app/(dashboard)/lkps/bab-X/tabel-X/page.tsx`): Server component fetches data
2. Client (`components/tables/tabel-X-client.tsx`): Manages state, calls server actions
3. Server Actions (`lib/actions/lkps.ts`): `upsertLkpsRow`, `deleteLkpsRow`, `submitLkpsTabel`

### Permission System

```typescript
// lib/utils/permissions.ts
hasPermission(role, "tabel_lkps.submit")  // true for OPERATOR
// PermissionGate server component wraps UI
```

### Auth Pattern

Auth.js v5 with JWT strategy. `middleware.ts` protects all routes except `/login`. Session contains `id` and `role`.

### Workflow Status

```
DRAFT → (submit) → DIAJUKAN → (approve) → DISETUJI
                   ↘ (reject) → DITOLAK/DIREVISI → (resubmit) → DIAJUKAN
```

### Key Libraries

- **Database**: Prisma ORM with PostgreSQL
- **Storage**: MinIO (S3-compatible) for evidence uploads
- **UI**: Tailwind CSS v4, shadcn/ui, Framer Motion
- **Validation**: Zod, React Hook Form
- **Export**: ExcelJS, docx

## Database Schema (Prisma)

- **Auth**: User, Account, Session
- **Master**: Prodi, TahunAkademik, Dosen, Tendik, Mahasiswa, MataKuliah
- **LKPS**: TabelDefinition (31 entries), TabelLkps, TabelLkpsRow (dynamic JSON)
- **Workflow**: ValidationHistory, Notification
- **Audit**: AuditLog

## UI/UX Standards

Lihat `.claude/skills/ui-ux.md` untuk pedoman desain lengkap (integrasi dari ui-ux-pro-max-skill, taste-skill, impeccable).

**Ringkasan key rules:**

- Tidak ada emoji sebagai icon — gunakan Lucide SVG
- `cursor-pointer` pada semua elemen interaktif
- Hover transitions 150-300ms, no bounce/elastic easing
- Contrast minimum 4.5:1 (WCAG AA)
- Focus states visible untuk keyboard navigation
- Responsive breakpoints: 375px, 768px, 1024px, 1440px
- LARANGAN: nested cards, purple gradients, pure black/gray, em-dash

## Important Notes

- All validation blocks for status-based editing have been commented out with `VALIDASI DIHAPUS`
- 34 table client components exist despite a planned generic dynamic form (YAGNI deviation)
- Indonesian language used throughout UI
- Audit logging via `createAuditLog()` (fire-and-forget) in all mutation actions
- `revalidatePath()` called after all mutations
