# SIM-LKPS — Task Breakdown Sprint 0

**Versi:** 1.0  
**Sprint:** 0  
**Agent:** CTO Agent  
**Tanggal:** 2026-07-16  
**Status:** READY

---

## Task Overview

| ID | Title | Priority | Status | Dependency | Est. |
|----|-------|----------|--------|------------|------|
| T-001 | Setup Next.js 15 App Router project | P0 | READY | — | 1h |
| T-002 | Configure TypeScript strict + ESLint + Prettier | P0 | READY | T-001 | 30m |
| T-003 | Setup Tailwind CSS + shadcn/ui | P0 | READY | T-001 | 30m |
| T-004 | Setup Prisma + PostgreSQL connection | P0 | READY | T-001 | 1h |
| T-005 | Create initial Prisma schema | P0 | READY | T-004 | 2h |
| T-006 | Setup Auth.js (credential provider) | P0 | READY | T-005 | 1.5h |
| T-007 | Setup MinIO client library | P1 | READY | T-001 | 30m |
| T-008 | Create seed script | P0 | READY | T-005 | 1h |
| T-009 | Create project folder structure | P0 | READY | T-001 | 30m |
| T-010 | Create base layout components | P1 | READY | T-003 | 1h |
| T-011 | Setup CI pipeline (lint + type-check) | P1 | READY | T-002 | 30m |
| T-012 | Create README.md | P1 | READY | T-001 | 30m |

---

## Task Details

### T-001: Setup Next.js 15 App Router Project

**Status:** READY  
**Priority:** P0  
**Dependency:** None

**Description:**
Initialize Next.js 15 project with App Router, TypeScript, and basic configuration.

**Implementation Steps:**
1. Run `npx create-next-app@latest ./` with TypeScript, App Router, Tailwind
2. Verify `npm run dev` runs without errors
3. Configure path aliases (`@/` → `./`)

**Definition of Done:**
- [ ] `npm run dev` berjalan di localhost:3000
- [ ] TypeScript aktif
- [ ] App Router (bukan Pages Router)
- [ ] `@/` path alias berfungsi

**Files Created:**
```
package.json
tsconfig.json
next.config.ts
app/layout.tsx
app/page.tsx
```

---

### T-002: Configure TypeScript Strict + ESLint + Prettier

**Status:** READY  
**Priority:** P0  
**Dependency:** T-001

**Description:**
Enable TypeScript strict mode and configure ESLint + Prettier for consistent code quality.

**Implementation Steps:**
1. Update `tsconfig.json` with strict options
2. Install ESLint plugins (next, typescript, import)
3. Install Prettier + eslint-config-prettier
4. Create `.prettierrc`
5. Add lint script to package.json

**Definition of Done:**
- [ ] `"strict": true` di tsconfig.json
- [ ] `npm run lint` berjalan tanpa error
- [ ] Prettier formatting konsisten
- [ ] No `any` types allowed tanpa alasan

**Files:**
```
tsconfig.json (modified)
.eslintrc.json (created/modified)
.prettierrc (created)
package.json (scripts updated)
```

---

### T-003: Setup Tailwind CSS + shadcn/ui

**Status:** READY  
**Priority:** P0  
**Dependency:** T-001

**Description:**
Configure Tailwind CSS and initialize shadcn/ui with Indonesian-friendly theme.

**Implementation Steps:**
1. Tailwind should already be configured by create-next-app
2. Run `npx shadcn@latest init`
3. Configure theme colors (professional, clean)
4. Install core shadcn components: button, input, table, dialog, select, form, toast, card

**Definition of Done:**
- [ ] shadcn/ui initialized
- [ ] Core components installed
- [ ] Custom theme colors configured
- [ ] Dark mode support ready (optional)

**Files:**
```
components.json
components/ui/*.tsx
app/globals.css (updated)
tailwind.config.ts (updated)
```

---

### T-004: Setup Prisma + PostgreSQL Connection

**Status:** READY  
**Priority:** P0  
**Dependency:** T-001

**Description:**
Initialize Prisma ORM with PostgreSQL connection string.

**Implementation Steps:**
1. Install prisma + @prisma/client
2. Run `npx prisma init`
3. Configure DATABASE_URL in `.env`
4. Create `lib/db.ts` (Prisma client singleton)
5. Add docker-compose.yml for PostgreSQL

**Definition of Done:**
- [ ] Prisma initialized
- [ ] `.env` has DATABASE_URL
- [ ] `lib/db.ts` exports singleton client
- [ ] Docker Compose includes PostgreSQL service
- [ ] `npx prisma db push` succeeds

**Files:**
```
prisma/schema.prisma (initial)
lib/db.ts
.env (DATABASE_URL)
.env.example
docker-compose.yml
```

---

### T-005: Create Initial Prisma Schema

**Status:** READY  
**Priority:** P0  
**Dependency:** T-004

**Description:**
Define the complete initial Prisma schema based on database.md ERD.

**Implementation Steps:**
1. Define User, Account, Session models (Auth.js compatible)
2. Define Role enum
3. Define Prodi, TahunAkademik models
4. Define Dosen, Tendik, Mahasiswa, MataKuliah models
5. Define TabelDefinition, TabelLkps, TabelLkpsRow models
6. Define Evidence, ValidationHistory models
7. Define AuditLog, Notification models
8. Define TabelStatus enum
9. Add indexes and unique constraints
10. Run `npx prisma db push` to validate

**Definition of Done:**
- [ ] Semua model dari ERD terdefinisi
- [ ] Enum Role dan TabelStatus ada
- [ ] Relasi antar model benar
- [ ] `npx prisma generate` sukses
- [ ] `npx prisma db push` sukses

**Files:**
```
prisma/schema.prisma (complete)
```

---

### T-006: Setup Auth.js (Credential Provider)

**Status:** READY  
**Priority:** P0  
**Dependency:** T-005

**Description:**
Configure Auth.js v5 with credential provider and Prisma adapter.

**Implementation Steps:**
1. Install `next-auth@beta` + `@auth/prisma-adapter`
2. Create `lib/auth.ts` with configuration
3. Create `app/api/auth/[...nextauth]/route.ts`
4. Create middleware.ts for route protection
5. Implement credential provider (email + bcrypt password)
6. Add AUTH_SECRET to .env

**Definition of Done:**
- [ ] Login/logout berfungsi
- [ ] Session tersimpan di database
- [ ] Middleware protect routes
- [ ] Role tersedia di session
- [ ] Password di-hash dengan bcrypt

**Files:**
```
lib/auth.ts
app/api/auth/[...nextauth]/route.ts
middleware.ts
```

---

### T-007: Setup MinIO Client Library

**Status:** READY  
**Priority:** P1  
**Dependency:** T-001

**Description:**
Configure MinIO S3-compatible client for file storage.

**Implementation Steps:**
1. Install `minio` package
2. Create `lib/minio.ts` with client configuration
3. Add MinIO environment variables to .env
4. Add MinIO service to docker-compose.yml
5. Create default bucket for evidence

**Definition of Done:**
- [ ] MinIO client configured
- [ ] Docker Compose includes MinIO service
- [ ] Environment variables documented
- [ ] Upload/download test passes

**Files:**
```
lib/minio.ts
docker-compose.yml (updated with MinIO)
.env (MINIO_* vars)
```

---

### T-008: Create Seed Script

**Status:** READY  
**Priority:** P0  
**Dependency:** T-005

**Description:**
Create database seed script for initial data.

**Implementation Steps:**
1. Create `prisma/seed.ts`
2. Seed Admin user (hashed password)
3. Seed default Prodi (Ilmu Komputer UBBG)
4. Seed default TahunAkademik (2024/2025 Ganjil)
5. Seed all 31 TabelDefinition entries with kolom_definitions
6. Configure seed command in package.json

**Definition of Done:**
- [ ] `npx prisma db seed` succeeds
- [ ] Admin user can login
- [ ] Prodi and TA exist
- [ ] All 31 tabel definitions seeded

**Files:**
```
prisma/seed.ts
package.json (prisma.seed config)
```

---

### T-009: Create Project Folder Structure

**Status:** READY  
**Priority:** P0  
**Dependency:** T-001

**Description:**
Create the folder structure as defined in architecture.md.

**Implementation Steps:**
1. Create app/ route groups: (auth), (dashboard)
2. Create lib/ directories: validations, utils, types
3. Create components/ directories: layout, forms, tables, dashboard, shared
4. Add .gitkeep files to empty directories

**Definition of Done:**
- [ ] Folder structure matches architecture.md
- [ ] All directories created

---

### T-010: Create Base Layout Components

**Status:** READY  
**Priority:** P1  
**Dependency:** T-003

**Description:**
Build the base layout components (sidebar, header, breadcrumb).

**Implementation Steps:**
1. Create `components/layout/sidebar.tsx` — Navigation sidebar with role-based menu
2. Create `components/layout/header.tsx` — Top header with user info + logout
3. Create `components/layout/breadcrumb.tsx` — Dynamic breadcrumb
4. Create `components/layout/page-header.tsx` — Page title + actions
5. Create `app/(dashboard)/layout.tsx` — Dashboard layout combining sidebar + header
6. Create `app/(auth)/layout.tsx` — Auth layout (centered, no sidebar)

**Definition of Done:**
- [ ] Sidebar renders with navigation items
- [ ] Header shows user name + logout
- [ ] Breadcrumb updates per page
- [ ] Responsive on tablet (≥768px)

---

### T-011: Setup CI Pipeline

**Status:** READY  
**Priority:** P1  
**Dependency:** T-002

**Description:**
Create GitHub Actions CI pipeline for automated quality checks.

**Implementation Steps:**
1. Create `.github/workflows/ci.yml`
2. Configure: install → lint → type-check → (test)
3. Trigger on push to main and pull requests

**Definition of Done:**
- [ ] CI runs on push/PR
- [ ] Lint check passes
- [ ] Type-check passes

**Files:**
```
.github/workflows/ci.yml
```

---

### T-012: Create README.md

**Status:** READY  
**Priority:** P1  
**Dependency:** T-001

**Description:**
Create comprehensive README with setup instructions.

**Definition of Done:**
- [ ] Project description
- [ ] Tech stack listed
- [ ] Setup instructions (prerequisites, install, run)
- [ ] Docker Compose instructions
- [ ] Folder structure overview
- [ ] Contributing guidelines

---

## Execution Order

```
T-001 (Next.js setup)
   │
   ├── T-002 (TypeScript + Lint) ── T-011 (CI)
   ├── T-003 (Tailwind + shadcn) ── T-010 (Layout)
   ├── T-004 (Prisma + PostgreSQL)
   │      │
   │      └── T-005 (Schema)
   │             │
   │             ├── T-006 (Auth.js)
   │             └── T-008 (Seed)
   │
   ├── T-007 (MinIO)
   ├── T-009 (Folder Structure)
   └── T-012 (README)
```

**Critical Path:** T-001 → T-004 → T-005 → T-006 → T-008

---

*Dokumen ini dibuat oleh CTO Agent. Semua task berstatus READY dan siap dikerjakan Developer Agent.*
