# Engineering Constitution v1.0

**Project:** SIM-LKPS  
**Institution:** Prodi Ilmu Komputer, Universitas Bina Bangsa Getsempena  
**Effective Date:** 21 Juli 2026  
**Version:** 1.0  

---

## Architecuture

### EC-001: Gunakan Next.js 15 App Router sebagai foundation

**Rule:** Stack utama menggunakan Next.js 15 App Router dengan React 19.

**Reason:** Mendukung React Server Components, nested layouts, dan streaming out-of-the-box.

**Evidence:** `package.json` → `"next": "^15.0.0"`, `"react": "^19.0.0"`  
**Status:** Mandatory

---

### EC-002: Pisahkan layer presentation, business logic, dan data access

**Rule:** Arsitektur 3 layer: (1) `app/` + `components/` untuk presentation, (2) `lib/actions/` untuk business logic, (3) `lib/` + Prisma untuk data access.

**Reason:** Separation of concerns meningkatkan maintainability dan testability.

**Evidence:** `app/`, `components/`, `lib/actions/`, `lib/db.ts`  
**Status:** Mandatory

---

## Folder Structure

### EC-003: Gunakan route groups untuk auth dan dashboard

**Rule:** Route groups dengan nama `(auth)` untuk halaman login dan `(dashboard)` untuk halaman terproteksi.

**Reason:** Next.js route groups memisahkan auth routes dari protected routes secara eksplisit.

**Evidence:** `app/(auth)/`, `app/(dashboard)/`  
**Status:** Mandatory

---

### EC-004: Kumpulkan Server Actions di `lib/actions/`

**Rule:** Semua Server Actions ditempatkan di folder `lib/actions/` dengan satu file per domain (`auth.ts`, `lkps.ts`, `user.ts`).

**Reason:** Sentralisasi mutations memudahkan auditing dan menghindari scattered logic.

**Evidence:** `lib/actions/auth.ts`, `lib/actions/lkps.ts`, `lib/actions/user.ts`  
**Status:** Mandatory

---

### EC-005: Organize components by feature

**Rule:** Components dikelompokkan: `components/forms/`, `components/layout/`, `components/shared/`, `components/tables/`.

**Reason:** Feature-based grouping mempercepat navigasi dan memahami codebase.

**Evidence:** `components/forms/`, `components/tables/`, `components/shared/`  
**Status:** Mandatory

---

### EC-006: Table pages mengikuti pola `bab-{n}/tabel-{kode}/`

**Rule:** Setiap tabel LKPS berada di `app/(dashboard)/lkps/bab-{n}/tabel-{kode}/page.tsx`.

**Reason:** Konsisten dengan routing URL yang predictable.

**Evidence:** `app/(dashboard)/lkps/bab-1/tabel-1a1/page.tsx`  
**Status:** Mandatory

---

## Naming Convention

### EC-007: Client components suffix `-client.tsx`

**Rule:** Semua React components yang menggunakan `"use client"` di-suffix dengan `-client.tsx`.

**Reason:** Membedakan jelas antara Server dan Client components di filesystem level.

**Evidence:** `components/tables/tabel-1a1-client.tsx`  
**Status:** Mandatory

---

### EC-008: Zod schemas suffix `Schema`

**Rule:** Schema Zod di-export dengan nama yang di-suffix `Schema` (contoh: `loginSchema`, `createUserSchema`).

**Reason:** Naming convention yang jelas untuk schema definitions.

**Evidence:** `lib/validations/auth.ts` → `loginSchema`, `createUserSchema`  
**Status:** Mandatory

---

### EC-009: Export inferred types dari Zod schemas

**Rule:** Setiap schema Zod mengekspor inferred type dengan nama `{SchemaName}Input`.

**Reason:** Type safety dari schema ke consumer tanpa definisi duplikat.

**Evidence:** `lib/validations/auth.ts` → `export type LoginInput = z.infer<typeof loginSchema>`  
**Status:** Recommended

---

## Server Actions

### EC-010: Gunakan `"use server"` directive

**Rule:** Semua Server Actions wajib memiliki `"use server"` directive di baris pertama file.

**Reason:** Mengaktifkan Next.js server-side execution untuk mutations.

**Evidence:** `lib/actions/lkps.ts` → baris pertama: `"use server";`  
**Status:** Mandatory

---

### EC-011: Auth check di awal setiap Server Action

**Rule:** Setiap Server Action wajib melakukan auth check dengan `await auth()` dan throw error jika tidak terautentikasi.

**Reason:** Defense-in-depth untuk setiap mutation endpoint.

**Evidence:** `lib/actions/lkps.ts` → `const session = await auth(); if (!session?.user) throw new Error("Unauthorized");`  
**Status:** Mandatory

---

### EC-012: Permission check sebelum eksekusi

**Rule:** Setelah auth check, Server Action wajib memanggil `hasPermission(role, "permission.name")` untuk otorisasi.

**Reason:** RBAC enforcement pada setiap operasi.

**Evidence:** `lib/actions/lkps.ts` → `if (!hasPermission(role, "tabel_lkps.submit")) throw new Error(...)`  
**Status:** Mandatory

---

### EC-013: Selalu panggil `revalidatePath()` setelah mutasi

**Rule:** Setiap Server Action yang mengubah data wajib memanggil `revalidatePath()` untuk invalidasi cache.

**Reason:** Memastikan UI menampilkan data terbaru setelah mutations.

**Evidence:** `lib/actions/lkps.ts` → `revalidateTabel(params.tabelKode, bab);`  
**Status:** Mandatory

---

## Validation

### EC-014: Gunakan Zod untuk semua input validation

**Rule:** Seluruh input dari user (form, API, Server Actions) wajib divalidasi dengan Zod schema sebelum diproses.

**Reason:** Runtime type safety dan error messages yang konsisten.

**Evidence:** `lib/validations/auth.ts` → semua schemas menggunakan Zod  
**Status:** Mandatory

---

## Database Access

### EC-015: Gunakan Prisma singleton pattern

**Rule:** Gunakan singleton pattern untuk PrismaClient dengan global reference untuk menghindari multiple instances di development.

**Reason:** Menghindari connection pool exhaustion dan memory leak.

**Evidence:** `lib/db.ts` → `const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };`  
**Status:** Mandatory

---

### EC-016: Export Prisma client sebagai named export `db`

**Rule:** Prisma client di-export sebagai `export const db` dari `lib/db.ts`.

**Reason:** Single source of truth untuk database access point.

**Evidence:** `lib/db.ts` → `export const db = ...`  
**Status:** Mandatory

---

## Authentication & Authorization

### EC-017: Gunakan NextAuth v5 dengan Credentials provider dan JWT

**Rule:** Autentikasi menggunakan Auth.js (NextAuth v5) dengan Credentials provider dan JWT session strategy.

**Reason:** Stateless authentication yang scalable, cocok untuk Next.js.

**Evidence:** `lib/auth.ts` → `NextAuth({ session: { strategy: "jwt" }, providers: [Credentials(...)] })`  
**Status:** Mandatory

---

### EC-018: Definisikan permissions dengan wildcard support

**Rule:** Permissions didefinisikan sebagai array per role dengan wildcard pattern (`"*"` suffix) untuk grup permissions.

**Reason:** Flexible RBAC yang scalable saat permission count grow.

**Evidence:** `lib/utils/permissions.ts` → `const PERMISSIONS: Record<Role, string[]> = { ADMIN: ["user.*", ...] }`  
**Status:** Mandatory

---

### EC-019: Lindungi semua routes dengan middleware

**Rule:** Middleware melindungi seluruh routes kecuali explicitly exempted (`/login`, `/api/auth`, `/api/health`, static files).

**Reason:** Prevent unauthorized access at edge level.

**Evidence:** `middleware.ts` → `matcher: ["/((?!api/auth|api/health|_next/static|...).*)"]`  
**Status:** Mandatory

---

## Client vs Server Components

### EC-020: Server Components untuk data fetching

**Rule:** Halaman (`page.tsx`) adalah async Server Components yang melakukan data fetching dengan `db.*` queries.

**Reason:** Data fetching di server lebih secure, reduce client bundle, dan better caching.

**Evidence:** `app/(dashboard)/lkps/bab-1/tabel-1a1/page.tsx` → `const data = await db.tabelLkps.findUnique(...)`  
**Status:** Mandatory

---

### EC-021: Client Components untuk interaktivitas

**Rule:** Components yang menggunakan `useState`, `useEffect`, event handlers, atau client-side hooks wajib ditandai `"use client"`.

**Reason:**明确了 client-side interactivity boundary.

**Evidence:** `components/tables/tabel-1a1-client.tsx` → `"use client"; import { useState }`  
**Status:** Mandatory

---

### EC-022: Pass data dari Server ke Client via props

**Rule:** Server Components pass data ke Client Components melalui props, bukan melakukan fetch di client.

**Reason:** Optimal performance dengan zero client-side waterfalls.

**Evidence:** `app/(dashboard)/lkps/bab-1/tabel-1a1/page.tsx` → `<Tabel1A1Client initialRows={...} />`  
**Status:** Recommended

---

## Error Handling

### EC-023: Implementasi Error Boundary untuk setiap segment

**Rule:** Setiap major segment (global, dashboard, setiap BAB) memiliki Error Boundary component.

**Reason:** Graceful error handling tanpa crash entire app.

**Evidence:** `app/error.tsx`, `components/shared/error-boundary.tsx`  
**Status:** Recommended

---

## Environment Variables

### EC-024: Pisahkan environment variables dengan prefix `NEXT_PUBLIC_`

**Rule:** Hanya client-side variables yang di-prefix `NEXT_PUBLIC_`. Server-only variables tidak di-prefix.

**Reason:** Prevent accidental exposure of sensitive server configuration.

**Evidence:** `.env.example` → `DATABASE_URL` (server), `NEXT_PUBLIC_APP_NAME` (client)  
**Status:** Mandatory

---

### EC-025: Validasi required env vars dengan helper function

**Rule:** Required environment variables divalidasi dengan helper function yang throw error jika missing.

**Reason:** Fail-fast untuk misconfiguration sebelum runtime errors.

**Evidence:** `lib/minio.ts` → `const requiredEnv = (key) => { if (!value) throw new Error(`Missing: ${key}`); }`  
**Status:** Recommended

---

## Quick Reference

| ID | Rule | Status |
|----|------|--------|
| EC-001 | Next.js 15 App Router | Mandatory |
| EC-002 | Layer separation | Mandatory |
| EC-003 | Route groups (auth/dashboard) | Mandatory |
| EC-004 | Server Actions in lib/actions/ | Mandatory |
| EC-005 | Components by feature | Mandatory |
| EC-006 | Table path pattern | Mandatory |
| EC-007 | Client suffix `-client.tsx` | Mandatory |
| EC-008 | Zod schema suffix `Schema` | Mandatory |
| EC-009 | Export inferred types | Recommended |
| EC-010 | `"use server"` directive | Mandatory |
| EC-011 | Auth check in actions | Mandatory |
| EC-012 | Permission check | Mandatory |
| EC-013 | revalidatePath() after mutations | Mandatory |
| EC-014 | Zod for all validation | Mandatory |
| EC-015 | Prisma singleton pattern | Mandatory |
| EC-016 | Export db singleton | Mandatory |
| EC-017 | NextAuth v5 + JWT | Mandatory |
| EC-018 | Wildcard permissions | Mandatory |
| EC-019 | Middleware protection | Mandatory |
| EC-020 | Server Components for fetching | Mandatory |
| EC-021 | Client Components for interactivity | Mandatory |
| EC-022 | Props from server to client | Recommended |
| EC-023 | Error Boundaries | Recommended |
| EC-024 | NEXT_PUBLIC_ prefix | Mandatory |
| EC-025 | Env var validation | Recommended |

---

**Total Rules:** 25  
**Mandatory:** 21  
**Recommended:** 4  
**Optional:** 0

---

*Document generated from repository patterns analysis. Every rule has evidence-based justification.*
