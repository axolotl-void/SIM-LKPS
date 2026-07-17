# SIM-LKPS — System Architecture

**Versi:** 1.0  
**Sprint:** 0  
**Agent:** CTO Agent  
**Tanggal:** 2026-07-16  
**Status:** DRAFT → IN REVIEW

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  Next.js 15 App Router │ React │ TypeScript │ Tailwind/shadcn  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REVERSE PROXY (Nginx)                      │
│                    SSL Termination │ Caching                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION SERVER                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Next.js 15 (Node.js Runtime)               │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    │
│  │  │  App Router   │  │ Server       │  │  Route        │  │    │
│  │  │  (Pages/      │  │ Actions      │  │  Handlers     │  │    │
│  │  │   Layouts)    │  │ (Mutations)  │  │  (REST API)   │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    │
│  │  │  Auth.js      │  │  Prisma      │  │  MinIO       │  │    │
│  │  │  (NextAuth)   │  │  Client      │  │  Client      │  │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │    │
│  └─────────┼─────────────────┼─────────────────┼───────────┘    │
└────────────┼─────────────────┼─────────────────┼────────────────┘
             │                 │                 │
             ▼                 ▼                 ▼
    ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
    │   PostgreSQL   │ │   PostgreSQL   │ │     MinIO      │
    │   (Auth DB)    │ │   (Main DB)    │ │  (S3 Storage)  │
    │                │ │   31 Tabel     │ │  Evidence/     │
    │  sessions,     │ │   LKPS +       │ │  Documents     │
    │  users,        │ │   master data  │ │                │
    │  accounts      │ │                │ │                │
    └────────────────┘ └────────────────┘ └────────────────┘
```

> **Catatan:** Auth DB dan Main DB bisa dalam satu PostgreSQL instance dengan schema terpisah, atau satu database dengan tabel terpisah. Untuk simplicity, kita gunakan **satu database**.

---

## 2. Component Architecture

### 2.1 Frontend Components

```
app/
├── (auth)/                          # Auth group (no layout sidebar)
│   ├── login/page.tsx               # Login page
│   └── layout.tsx                   # Auth layout (centered, no sidebar)
│
├── (dashboard)/                     # Main app group (with sidebar)
│   ├── layout.tsx                   # Dashboard layout (sidebar + header)
│   ├── page.tsx                     # Dashboard home (per role)
│   │
│   ├── master/                      # Master Data module
│   │   ├── tahun-akademik/
│   │   ├── dosen/
│   │   ├── tendik/
│   │   ├── mahasiswa/
│   │   ├── mata-kuliah/
│   │   └── users/
│   │
│   ├── lkps/                        # Tabel LKPS module
│   │   ├── bab-1/
│   │   │   ├── tabel-1a1/page.tsx
│   │   │   ├── tabel-1a2/page.tsx
│   │   │   ├── tabel-1a3/page.tsx
│   │   │   ├── tabel-1a4/page.tsx
│   │   │   ├── tabel-1a5/page.tsx
│   │   │   └── tabel-1b/page.tsx
│   │   ├── bab-2/
│   │   ├── bab-3/
│   │   ├── bab-4/
│   │   ├── bab-5/
│   │   └── bab-6/
│   │
│   ├── evidence/                    # Evidence management
│   ├── validasi/                    # Validation workflow
│   ├── laporan/                     # Reports & export
│   ├── notifikasi/                  # Notifications
│   └── settings/                    # System settings
│
├── api/                             # Route handlers (REST API)
│   ├── auth/[...nextauth]/route.ts
│   ├── master/
│   ├── lkps/
│   ├── evidence/
│   └── export/
│
├── layout.tsx                       # Root layout
├── page.tsx                         # Root page → redirect to login/dashboard
└── globals.css                      # Global styles
```

### 2.2 Shared Libraries

```
lib/
├── auth.ts                # Auth.js configuration
├── db.ts                  # Prisma client singleton
├── minio.ts               # MinIO client configuration
├── validations/           # Zod schemas
│   ├── auth.ts
│   ├── master.ts
│   └── lkps.ts
├── utils/
│   ├── format.ts          # Number/date formatting
│   ├── permissions.ts     # Permission checker
│   └── audit.ts           # Audit log helper
└── types/
    ├── auth.ts
    ├── lkps.ts
    └── api.ts
```

### 2.3 Reusable Components

```
components/
├── ui/                    # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── table.tsx
│   ├── dialog.tsx
│   ├── select.tsx
│   ├── toast.tsx
│   └── ...
│
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── breadcrumb.tsx
│   └── page-header.tsx
│
├── forms/
│   ├── login-form.tsx
│   ├── master-form.tsx    # Generic CRUD form
│   └── lkps-form.tsx      # Generic LKPS table form
│
├── tables/
│   ├── data-table.tsx     # Generic data table with sort/filter/pagination
│   └── lkps-table.tsx     # LKPS-specific table wrapper
│
├── dashboard/
│   ├── stats-card.tsx
│   ├── progress-bar.tsx
│   └── activity-feed.tsx
│
└── shared/
    ├── loading.tsx        # Loading skeleton
    ├── empty-state.tsx    # Empty state component
    ├── error-boundary.tsx # Error boundary
    └── permission-gate.tsx # Permission-based rendering
```

---

## 3. Technology Decisions

### 3.1 Decisions (Final)

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Runtime** | Node.js | ≥20 LTS | Next.js 15 requirement |
| **Framework** | Next.js | 15 (App Router) | SSR + Server Actions, full-stack |
| **Language** | TypeScript | 5.x (strict) | Type safety, IDE support |
| **UI Framework** | Tailwind CSS | 4.x | Utility-first, consistent styling |
| **UI Components** | shadcn/ui | latest | Accessible, customizable, Tailwind-native |
| **Animation** | Framer Motion | latest | Smooth transitions, layout animations |
| **Database** | PostgreSQL | 16+ | ACID, JSON support, mature |
| **ORM** | Prisma | 6.x | Type-safe queries, migration system |
| **Auth** | Auth.js (NextAuth v5) | 5.x | Credential provider, session management |
| **Storage** | MinIO | latest | S3-compatible, self-hosted |
| **Form** | React Hook Form + Zod | latest | Performance, schema validation |
| **State** | Server state (default) | — | Minimal client state |
| **Client State** | Zustand | latest | Only for global UI state (sidebar, theme) |
| **Export** | ExcelJS, docx, Puppeteer | latest | Multi-format export |
| **Testing** | Vitest, Testing Library, Playwright | latest | Unit + E2E |
| **Container** | Docker + Docker Compose | latest | Reproducible deployment |
| **CI** | GitHub Actions | — | Lint, type-check, test |

### 3.2 Coding Standards

```typescript
// TypeScript strict mode — tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true
  }
}

// Naming conventions
- Files: kebab-case (e.g., data-table.tsx, login-form.tsx)
- Components: PascalCase (e.g., DataTable, LoginForm)
- Functions: camelCase (e.g., getUserById, createAuditLog)
- Constants: UPPER_SNAKE_CASE (e.g., MAX_FILE_SIZE, ROLES)
- Types/Interfaces: PascalCase with prefix (e.g., TUser, IApiResponse)
- Database tables: snake_case (e.g., tahun_akademik, tabel_lkps)
- API routes: kebab-case (e.g., /api/master/tahun-akademik)

// Import order (enforced by ESLint)
1. React/Next.js
2. Third-party libraries
3. Internal aliases (@/lib, @/components)
4. Relative imports
5. Types
```

---

## 4. Data Flow Patterns

### 4.1 Server-First Pattern (Default)

```
Browser Request
    → Next.js App Router (Server Component)
        → Prisma Query (Server-side)
            → PostgreSQL
        ← Data
    ← Rendered HTML (streamed)
```

### 4.2 Mutation Pattern (Server Actions)

```
User Action (form submit)
    → Server Action (use server)
        → Zod Validation
        → Permission Check
        → Prisma Mutation
        → Audit Log
        → revalidatePath()
    ← Response (redirect/revalidate)
```

### 4.3 File Upload Pattern (MinIO)

```
User selects file
    → Client validates (type, size)
    → Upload to /api/evidence/upload (Route Handler)
        → MinIO putObject()
        → Save metadata to PostgreSQL
    ← File URL + metadata
```

---

## 5. Security Architecture

### 5.1 Authentication Flow

```
Login Request (email + password)
    → Auth.js signIn("credentials", ...)
        → Verify password (bcrypt)
        → Create JWT session
        → Set httpOnly cookie
    ← Redirect to dashboard

Protected Route
    → Next.js middleware
        → Check session cookie
        → Verify JWT
        → Check role permission
    ← Allow / Redirect to 403
```

### 5.2 Authorization Model

```typescript
// Role-Based Access Control (RBAC)
enum Role {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  VALIDATOR = "VALIDATOR",
  PIMPINAN = "PIMPINAN",
}

// Permission check in Server Actions
async function updateTabelLkps(data: TabelInput) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  
  const hasPermission = checkPermission(session.user.role, "tabel_lkps.update")
  if (!hasPermission) throw new Error("Forbidden")
  
  // proceed...
}
```

### 5.3 Security Measures

| Threat | Mitigation |
|--------|------------|
| XSS | React auto-escaping, CSP headers, sanitize user input |
| CSRF | Server Actions (built-in CSRF), SameSite cookies |
| SQL Injection | Prisma parameterized queries (never raw SQL) |
| Auth bypass | Middleware on all protected routes, server-side session check |
| File upload attacks | Validate MIME type, file size limit (10MB), rename files |
| Sensitive data exposure | httpOnly cookies, no secrets in client, .env not committed |

---

## 6. Deployment Architecture

```
┌──────────────── VPS (Ubuntu 22.04) ─────────────────┐
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │              Docker Compose                   │    │
│  │                                               │    │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────┐ │    │
│  │  │  Nginx  │  │  Next.js  │  │  PostgreSQL │ │    │
│  │  │  :80    │──│  :3000    │  │  :5432      │ │    │
│  │  │  :443   │  │           │  │             │ │    │
│  │  └─────────┘  └──────────┘  └─────────────┘ │    │
│  │                                               │    │
│  │  ┌─────────────┐  ┌─────────────────────┐    │    │
│  │  │    MinIO     │  │  Backup (cron)      │    │    │
│  │  │  :9000/:9001 │  │  pg_dump → S3/local │    │    │
│  │  └─────────────┘  └─────────────────────┘    │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 7. Monitoring & Observability

| Aspect | Tool | Purpose |
|--------|------|---------|
| Logs | Docker logs + file rotation | Application & error logs |
| Uptime | Simple healthcheck endpoint | `/api/health` returns 200 |
| Database | pg_stat_statements | Query performance monitoring |
| Storage | MinIO Console (:9001) | Storage usage, bucket management |
| Backup | Cron + pg_dump | Daily database backup |

---

*Dokumen ini dibuat oleh CTO Agent berdasarkan artefak PM Agent.*
