# SIM-LKPS — API Contract

**Versi:** 1.0  
**Sprint:** 0  
**Agent:** CTO Agent  
**Tanggal:** 2026-07-16  
**Status:** DRAFT → IN REVIEW

---

## 1. Conventions

| Aspect | Convention |
|--------|-----------|
| **Base path** | `/api` |
| **Auth** | Bearer token via httpOnly cookie (Auth.js managed) |
| **Content-Type** | `application/json` (default), `multipart/form-data` (uploads) |
| **Response format** | `{ success: boolean, data?: T, error?: { code: string, message: string } }` |
| **Pagination** | `?page=1&limit=20` → `{ data: T[], meta: { page, limit, total, totalPages } }` |
| **Sort** | `?sort=name&order=asc` |
| **Search** | `?search=keyword` |
| **HTTP Status** | 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error |

### Standard Response Types

```typescript
// Success response
interface ApiResponse<T> {
  success: true
  data: T
}

// Error response
interface ApiError {
  success: false
  error: {
    code: string    // e.g., "VALIDATION_ERROR", "NOT_FOUND"
    message: string // Human-readable message (Bahasa Indonesia)
  }
}

// Paginated response
interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

---

## 2. Authentication (Auth.js)

> Auth.js mengelola session secara otomatis. Route handler di bawah ini hanya yang custom.

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `POST` | `/api/auth/[...nextauth]` | Auth.js catch-all (login, logout, session) | — | — |

### Login (via Auth.js signIn)

```
POST /api/auth/callback/credentials
Body: { email: string, password: string }
Response: Redirect (set session cookie)
```

### Get Session

```
GET /api/auth/session
Response: { user: { id, name, email, role, image } } | null
```

---

## 3. User Management

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/users` | List all users (paginated) | ✅ | ADMIN |
| `POST` | `/api/users` | Create new user | ✅ | ADMIN |
| `GET` | `/api/users/:id` | Get user by ID | ✅ | ADMIN |
| `PATCH` | `/api/users/:id` | Update user (role, status) | ✅ | ADMIN |
| `DELETE` | `/api/users/:id` | Deactivate user (soft delete) | ✅ | ADMIN |
| `POST` | `/api/users/:id/reset-password` | Reset user password | ✅ | ADMIN |

### POST /api/users — Create User

```typescript
// Request
{
  name: string       // "Dr. Ahmad Fauzi"
  email: string      // "ahmad@ubbg.ac.id"
  password: string   // min 8 chars
  role: Role         // "ADMIN" | "OPERATOR" | "VALIDATOR" | "PIMPINAN"
}

// Response 201
{
  success: true,
  data: { id, name, email, role, isActive: true, createdAt }
}
```

---

## 4. Master Data

### 4.1 Tahun Akademik

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/master/tahun-akademik` | List tahun akademik | ✅ | ALL |
| `POST` | `/api/master/tahun-akademik` | Create tahun akademik | ✅ | ADMIN |
| `PATCH` | `/api/master/tahun-akademik/:id` | Update | ✅ | ADMIN |
| `DELETE` | `/api/master/tahun-akademik/:id` | Delete (soft) | ✅ | ADMIN |

```typescript
// POST /api/master/tahun-akademik
{
  tahun: string      // "2024/2025"
  semester: string   // "Ganjil" | "Genap"
  isActive: boolean
}
```

### 4.2 Dosen

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/master/dosen` | List dosen (paginated, searchable) | ✅ | ALL |
| `POST` | `/api/master/dosen` | Create dosen | ✅ | ADMIN |
| `GET` | `/api/master/dosen/:id` | Get dosen by ID | ✅ | ALL |
| `PATCH` | `/api/master/dosen/:id` | Update dosen | ✅ | ADMIN |
| `DELETE` | `/api/master/dosen/:id` | Delete dosen (soft) | ✅ | ADMIN |

```typescript
// POST /api/master/dosen
{
  nidn: string
  nama: string
  jabatanFungsional: string  // "Lektor" | "Lektor Kepala" | ...
  pendidikanTerakhir: string // "S2" | "S3"
  bidangKeahlian: string
  status: string             // "Tetap" | "Tidak Tetap"
  jenisKelamin: string       // "L" | "P"
}
```

### 4.3 Mahasiswa

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/master/mahasiswa` | List (paginated) | ✅ | ALL |
| `POST` | `/api/master/mahasiswa` | Create | ✅ | ADMIN |
| `PATCH` | `/api/master/mahasiswa/:id` | Update | ✅ | ADMIN |
| `DELETE` | `/api/master/mahasiswa/:id` | Delete (soft) | ✅ | ADMIN |

```typescript
// POST /api/master/mahasiswa
{
  nim: string
  nama: string
  angkatan: number    // 2020, 2021, ...
  status: string      // "Aktif" | "Cuti" | "Lulus" | "DO"
  jenisKelamin: string
}
```

### 4.4 Mata Kuliah

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/master/mata-kuliah` | List (paginated) | ✅ | ALL |
| `POST` | `/api/master/mata-kuliah` | Create | ✅ | ADMIN |
| `PATCH` | `/api/master/mata-kuliah/:id` | Update | ✅ | ADMIN |
| `DELETE` | `/api/master/mata-kuliah/:id` | Delete (soft) | ✅ | ADMIN |

### 4.5 Tendik

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/master/tendik` | List (paginated) | ✅ | ALL |
| `POST` | `/api/master/tendik` | Create | ✅ | ADMIN |
| `PATCH` | `/api/master/tendik/:id` | Update | ✅ | ADMIN |
| `DELETE` | `/api/master/tendik/:id` | Delete (soft) | ✅ | ADMIN |

---

## 5. Tabel LKPS

### 5.1 Tabel Definitions (Read-only)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/lkps/definitions` | List all 31 tabel definitions | ✅ | ALL |
| `GET` | `/api/lkps/definitions/:kode` | Get definition by kode (e.g., "1.A.1") | ✅ | ALL |

### 5.2 Tabel LKPS Data

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/lkps/:kode` | Get tabel data for active TA | ✅ | ALL |
| `GET` | `/api/lkps/:kode?ta=:taId` | Get tabel data for specific TA | ✅ | ALL |
| `POST` | `/api/lkps/:kode/rows` | Add row to tabel | ✅ | ADMIN, OPERATOR |
| `PATCH` | `/api/lkps/:kode/rows/:rowId` | Update row | ✅ | ADMIN, OPERATOR |
| `DELETE` | `/api/lkps/:kode/rows/:rowId` | Delete row | ✅ | ADMIN, OPERATOR |
| `POST` | `/api/lkps/:kode/submit` | Submit for validation | ✅ | OPERATOR |
| `POST` | `/api/lkps/:kode/validate` | Approve/Reject/Revise | ✅ | VALIDATOR |

```typescript
// GET /api/lkps/1.A.1?ta=clxyz123
{
  success: true,
  data: {
    id: string,
    kode: "1.A.1",
    nama: "Pimpinan dan Tupoksi UPPS dan PS",
    status: "DRAFT",
    tahunAkademik: { tahun: "2024/2025", semester: "Ganjil" },
    kolomDefinitions: [...],
    rows: [
      { id: "row1", rowOrder: 1, rowData: { no: 1, nama: "...", nidn: "..." } },
      { id: "row2", rowOrder: 2, rowData: { ... } }
    ],
    submittedAt: null,
    validatedAt: null
  }
}

// POST /api/lkps/1.A.1/rows
{
  rowData: {
    no: 1,
    nama: "Dr. Ahmad Fauzi, M.Kom.",
    nidn: "0101018901",
    jabatan: "Dekan",
    tupoksi: "Memimpin fakultas..."
  }
}

// POST /api/lkps/1.A.1/validate
{
  action: "APPROVE" | "REJECT" | "REVISE",
  comment: "Data sudah lengkap dan benar"  // Optional for APPROVE, required for REJECT/REVISE
}
```

---

## 6. Evidence Management

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/evidence?tabelId=:id` | List evidence for a tabel | ✅ | ALL |
| `POST` | `/api/evidence/upload` | Upload evidence file | ✅ | ADMIN, OPERATOR |
| `GET` | `/api/evidence/:id/download` | Download evidence file | ✅ | ALL |
| `DELETE` | `/api/evidence/:id` | Delete evidence | ✅ | ADMIN, OPERATOR |

```typescript
// POST /api/evidence/upload (multipart/form-data)
FormData:
  - file: File (max 10MB, PDF/JPEG/PNG/DOCX)
  - tabelLkpsId: string
  - description: string (optional)

// Response 201
{
  success: true,
  data: {
    id: string,
    filename: string,
    mimeType: string,
    size: number,
    version: 1,
    uploadedAt: string,
    uploadedBy: { id, name }
  }
}
```

---

## 7. Dashboard & Statistics

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/dashboard/stats` | Get dashboard statistics | ✅ | ALL |
| `GET` | `/api/dashboard/progress` | Get progress per BAB | ✅ | ALL |
| `GET` | `/api/dashboard/activity` | Get recent activity | ✅ | ALL |
| `GET` | `/api/dashboard/pending` | Get pending validations | ✅ | VALIDATOR |

```typescript
// GET /api/dashboard/stats
{
  success: true,
  data: {
    totalTabel: 31,
    terisi: 12,
    belumTerisi: 19,
    diajukan: 5,
    disetujui: 7,
    ditolak: 0,
    progressPercentage: 38.7
  }
}
```

---

## 8. Export

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/export/excel/:kode` | Export tabel to Excel | ✅ | ALL |
| `GET` | `/api/export/word/:kode` | Export tabel to Word | ✅ | ALL |
| `GET` | `/api/export/pdf/:kode` | Export tabel to PDF | ✅ | ALL |
| `GET` | `/api/export/rekap` | Export full rekap (all tables) | ✅ | ADMIN, PIMPINAN |

---

## 9. Audit Log

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|:----:|------|
| `GET` | `/api/audit-log` | List audit logs (paginated) | ✅ | ADMIN |
| `GET` | `/api/audit-log?userId=:id` | Filter by user | ✅ | ADMIN |

---

## 10. Health Check

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| `GET` | `/api/health` | Service health check | ❌ |

```typescript
// GET /api/health
{
  status: "ok",
  database: "connected",
  storage: "connected",
  timestamp: "2026-07-16T06:00:00Z"
}
```

---

## 11. Endpoint Summary

| Module | Endpoints | Methods |
|--------|-----------|---------|
| Auth | 1 | GET, POST |
| Users | 6 | GET, POST, PATCH, DELETE |
| Master Data | 20 | GET, POST, PATCH, DELETE |
| Tabel LKPS | 7 | GET, POST, PATCH, DELETE |
| Evidence | 4 | GET, POST, DELETE |
| Dashboard | 4 | GET |
| Export | 4 | GET |
| Audit Log | 1 | GET |
| Health | 1 | GET |
| **Total** | **~48** | — |

---

*Dokumen ini dibuat oleh CTO Agent berdasarkan artefak PM Agent.*
