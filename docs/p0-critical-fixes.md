# P0 Critical Fixes — Design Document

**Versi:** 1.0  
**Tanggal:** 2026-08-02  
**Status:** READY TO EXECUTE  
**Prioritas:** P0 — Critical

---

## Executive Summary

Tiga issue kritis yang harus diperbaiki segera:

1. **Validation Disabled** — Edit pada tabel yang sudah disetujui/diajukan tidak diblokir
2. **BAB 6 Duplicate Pages** — 3 folder (6, 61, 62) padahal hanya 1 tabel
3. **Missing GIN Index** — Query pada JSON `row_data` lambat karena tidak ada index

---

## 1. Enable Validation Blocks

### Problem Statement

Di `lib/actions/lkps.ts`, blok validasi untuk mencegah edit pada tabel berstatus tertentu telah dikomentari dengan marker `VALIDASI DIHAPUS`:

```typescript
// VALIDASI DIHAPUS - Semua orang bisa edit
// if (lkps.status === "DISETUJUI" || lkps.status === "DIAJUKAN") {
//   throw new Error("Tidak dapat mengubah data tabel yang sudah disetujui atau sedang diajukan.");
// }
```

Ini memungkinkan:
- ❌ Operator mengedit data tabel yang sudah DISETUJUI
- ❌ Operator mengedit data tabel yang sedang DIAJUKAN
- ❌ Tidak ada kontrol integritas data

### Current State Analysis

**File:** `lib/actions/lkps.ts`

**Location of commented blocks:**
| Line | Function | Commented Validation |
|------|----------|---------------------|
| 69-72 | `upsertLkpsRow()` | Cannot edit approved/submitted tables |
| 132-135 | `deleteLkpsRow()` | Cannot delete from approved/submitted tables |

### Proposed Solution

**1. Re-enable validation blocks** dengan kondisi yang lebih granular:

| Role | DRAFT | DIREVISI | DIAJUKAN | DISETUJUI | DITOLAK |
|------|:-----:|:--------:|:--------:|:---------:|:--------:|
| **ADMIN** | ✅ Edit | ✅ Edit | ✅ Edit | ✅ Edit | ✅ Edit |
| **OPERATOR** | ✅ Edit | ✅ Edit | ❌ Edit | ❌ Edit | ✅ Edit |
| **VALIDATOR** | ❌ Edit | ❌ Edit | ❌ Edit | ❌ Edit | ❌ Edit |
| **PIMPINAN** | ❌ Edit | ❌ Edit | ❌ Edit | ❌ Edit | ❌ Edit |

**Delete Permission:**
| Role | DRAFT | DIREVISI | DIAJUKAN | DISETUJUI | DITOLAK |
|------|:-----:|:--------:|:--------:|:---------:|:--------:|
| **ADMIN** | ✅ Delete | ✅ Delete | ✅ Delete | ✅ Delete | ✅ Delete |
| **OPERATOR** | ✅ Delete | ✅ Delete | ❌ Delete | ❌ Delete | ✅ Delete |
| **VALIDATOR** | ❌ Delete | ❌ Delete | ❌ Delete | ❌ Delete | ❌ Delete |
| **PIMPINAN** | ❌ Delete | ❌ Delete | ❌ Delete | ❌ Delete | ❌ Delete |

### Implementation Details

**File:** `lib/actions/lkps.ts`

**New validation function:**
```typescript
/**
 * Check if user can edit a table based on status and role
 */
function canEditTable(role: Role, status: TabelStatus): boolean {
  if (role === "ADMIN") return true;
  if (role === "OPERATOR") {
    return ["DRAFT", "DIREVISI", "DITOLAK"].includes(status);
  }
  return false; // VALIDATOR, PIMPINAN cannot edit
}

/**
 * Check if user can delete rows from a table based on status and role
 */
function canDeleteRow(role: Role, status: TabelStatus): boolean {
  return canEditTable(role, status);
}
```

**Updated `upsertLkpsRow`:**
```typescript
export async function upsertLkpsRow(params: {
  tabelKode: string;
  tahunAkademikId: string;
  rowId?: string;
  rowData: any;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  const lkps = await getOrCreateLkps(params.tabelKode, params.tahunAkademikId);

  // VALIDASI: Role-based edit permission
  if (!canEditTable(role, lkps.status)) {
    const statusLabels: Record<TabelStatus, string> = {
      DRAFT: "Draft",
      DIAJUKAN: "Diajukan untuk validasi",
      DIREVISI: "Direvisi",
      DISETUJUI: "Disetujui",
      DITOLAK: "Ditolak",
    };
    throw new Error(
      `Tidak dapat mengubah data pada tabel berstatus ${statusLabels[lkps.status]}.`
    );
  }

  // ... rest of function
}
```

**Updated `deleteLkpsRow`:**
```typescript
export async function deleteLkpsRow(params: { rowId: string; tabelKode: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role as Role;
  const row = await db.tabelLkpsRow.findUnique({
    where: { id: params.rowId },
    include: { tabelLkps: { include: { tabelDefinition: true } } },
  });
  if (!row) throw new Error("Row not found");

  // VALIDASI: Role-based delete permission
  if (!canDeleteRow(role, row.tabelLkps.status)) {
    const statusLabels: Record<TabelStatus, string> = {
      DRAFT: "Draft",
      DIAJUKAN: "Diajukan untuk validasi",
      DIREVISI: "Direvisi",
      DISETUJUI: "Disetujui",
      DITOLAK: "Ditolak",
    };
    throw new Error(
      `Tidak dapat menghapus data pada tabel berstatus ${statusLabels[row.tabelLkps.status]}.`
    );
  }

  // ... rest of function
}
```

### Error Messages (Indonesian)

| Scenario | Error Message |
|----------|---------------|
| Operator edit DIAJUKAN | "Tidak dapat mengubah data pada tabel berstatus Diajukan untuk validasi." |
| Operator edit DISETUJUI | "Tidak dapat mengubah data pada tabel berstatus Disetujui." |
| Validator edit any | "Validator tidak memiliki izin untuk mengubah data." |
| Delete DIAJUKAN | "Tidak dapat menghapus data pada tabel yang sedang diproses." |

### User Experience

**UI Changes Required:**

1. **Disable form inputs** when user cannot edit:
   ```typescript
   // In table client components
   const canEdit = canEditTable(userRole, status);
   ```

2. **Show tooltip/disabled state** on buttons:
   ```tsx
   <button
     disabled={!canEdit}
     title={!canEdit ? "Tabel sedang diproses, tidak dapat diedit" : ""}
     className={canEdit ? "" : "opacity-50 cursor-not-allowed"}
   >
     Edit
   </button>
   ```

3. **Add permission check helper** to client:
   ```typescript
   // lib/utils/permissions.ts (existing)
   export function canEditTable(role: Role, status: TabelStatus): boolean {
     // Same logic as server
   }
   ```

### Testing Requirements

| Test Case | Input | Expected |
|-----------|-------|---------|
| Operator edit DRAFT | status=DRAFT, role=OPERATOR | ✅ Success |
| Operator edit DIAJUKAN | status=DIAJUKAN, role=OPERATOR | ❌ Error |
| Operator edit DISETUJUI | status=DISETUJUI, role=OPERATOR | ❌ Error |
| Admin edit any | status=ANY, role=ADMIN | ✅ Success |
| Delete DIAJUKAN as OPERATOR | status=DIAJUKAN, role=OPERATOR | ❌ Error |

---

## 2. Fix BAB 6 Duplicate Pages

### Problem Statement

Folder BAB 6 memiliki 3 halaman padahal seharusnya hanya 1 tabel:

```
app/(dashboard)/lkps/bab-6/
├── tabel-6/       ← CORRECT (kode: "6")
├── tabel-61/      ← DUPLICATE (should not exist)
└── tabel-62/      ← DUPLICATE (should not exist)
```

**Root cause:** AI Agent membuat folder berdasarkan halaman LKPS PDF (halaman 38) yang memiliki sub-tabel, bukan tabel utama.

### Analysis

**BAB 6 dalam LKPS PDF:**
- Hanya ada 1 tabel utama: "Kesesuaian Visi dan Misi" (kode: "6")
- Tidak ada sub-tabel 6.1 atau 6.2

**Database:** `TabelDefinition` seharusnya hanya memiliki 1 entry untuk BAB 6:
```sql
SELECT * FROM "tabel_definition" WHERE bab = 6;
-- Should return: 1 row with kode = "6"
```

### Proposed Solution

**Step 1: Verify TabelDefinition**

Check `prisma/seed.ts` untuk memastikan hanya 1 definisi:
```typescript
// Should have:
{ kode: "6", nama: "Kesesuaian Visi dan Misi", bab: 6, urutan: 1, ... }
```

**Step 2: Delete duplicate folders**

```bash
# Delete tabel-61 folder
rm -rf app/(dashboard)/lkps/bab-6/tabel-61/

# Delete tabel-62 folder  
rm -rf app/(dashboard)/lkps/bab-6/tabel-62/
```

**Step 3: Update seed.ts if needed**

If seed has duplicate definitions:
```typescript
// prisma/seed.ts - Remove these if exists:
{ kode: "6.1", nama: "...", bab: 6, ... }
{ kode: "6.2", nama: "...", bab: 6, ... }
```

**Step 4: Verify redirect/routes**

Ensure `/lkps/bab-6` page correctly links to `/lkps/bab-6/tabel-6`.

### Implementation Steps

1. **Read current bab-6 page.tsx** to understand navigation
2. **Check seed.ts** for duplicate definitions
3. **Delete duplicate folders** (61, 62)
4. **Update page navigation** if needed
5. **Update breadcrumb/links** to use correct kode

### Target Structure

```
app/(dashboard)/lkps/bab-6/
├── page.tsx           ← Overview page (existing)
├── tabel-6/           ← Single table page
│   └── page.tsx
└── (no other folders)
```

### Migration Note

Since no data should exist in 6.1/6.2 (they were never properly linked), deletion is safe. If any data exists, it will be orphaned and should be manually cleaned from database.

---

## 3. Add GIN Index for row_data

### Problem Statement

`tabel_lkps_row.row_data` adalah kolom JSON yang menyimpan data dinamis untuk setiap baris tabel. Query pada kolom ini lambat karena tidak ada index.

**Current schema:**
```prisma
model TabelLkpsRow {
  id          String   @id @default(cuid())
  tabelLkpsId String
  rowOrder    Int
  rowData     Json     // No GIN index
  ...
}
```

### Query Patterns That Need Index

| Query | Purpose |
|-------|---------|
| `WHERE row_data->>'nama' = 'John'` | Search by field |
| `WHERE row_data @> '{"no": 1}'` | JSON containment |
| `WHERE row_data ? 'bidang'` | JSON key existence |
| Full text search | Search in text fields |

### Proposed Solution

**Option A: Prisma Native (Recommended)**

Prisma tidak mendukung GIN index secara native. Gunakan raw SQL dalam migration:

```sql
-- Create GIN index for row_data
CREATE INDEX idx_tabel_lkps_row_row_data_gin 
ON "tabel_lkps_row" USING GIN (row_data);
```

**Option B: Migration File**

Buat file migration baru:

```bash
npx prisma migrate dev --name add_gin_index_row_data
```

### Implementation

**Step 1: Create migration**

```bash
cd ai-company/output/sim-lkps
npx prisma migrate dev --name add_gin_index_row_data
```

**Step 2: Verify migration file**

```typescript
// prisma/migrations/xxx_add_gin_index_row_data/migration.sql
-- Should contain:
CREATE INDEX idx_tabel_lkps_row_row_data_gin 
ON "tabel_lkps_row" USING GIN (row_data);
```

**Step 3: Test index**

```sql
-- PostgreSQL console
EXPLAIN ANALYZE 
SELECT * FROM "tabel_lkps_row" 
WHERE row_data @> '{"no": 1}';
-- Should show "Index Scan using idx_tabel_lkps_row_row_data_gin"
```

### Alternative: GIN Index with jsonb_path_ops

For faster containment queries:
```sql
CREATE INDEX idx_tabel_lkps_row_row_data_gin 
ON "tabel_lkps_row" USING GIN (row_data jsonb_path_ops);
```

**Trade-off:** `jsonb_path_ops` is smaller but only supports `@>` containment operator.

**Recommendation:** Use default GIN (jsonb_ops) for flexibility.

### Performance Impact

| Before | After |
|--------|-------|
| Sequential scan on all rows | Index scan using GIN |
| O(n) time complexity | O(log n) time complexity |
| Slow on 1000+ rows | Fast even on 100k+ rows |

---

## 4. Additional Validation Improvements

### 4.1 Audit Log untuk Validation Attempts

Saat user mencoba edit yang tidak diizinkan, catat di audit log:

```typescript
// In upsertLkpsRow when validation fails
await createAuditLog({
  action: "ACCESS_DENIED",
  entity: "TabelLkpsRow",
  entityId: params.rowId || "new",
  newValue: { 
    tabelKode: params.tabelKode, 
    attempt: "edit_denied",
    reason: `Status: ${lkps.status}, Role: ${role}`
  },
});
```

### 4.2 Rate Limiting Consideration

Untuk prevent brute force pada validation bypass, consider adding:

```typescript
// lib/middleware/rate-limit.ts (future)
// Limit failed validation attempts per user
```

---

## 5. Testing Plan

### Unit Tests (Vitest)

```typescript
// tests/permissions.test.ts
describe("canEditTable", () => {
  it("ADMIN can edit any status", () => {
    expect(canEditTable("ADMIN", "DISETUJUI")).toBe(true);
  });
  
  it("OPERATOR cannot edit DIAJUKAN", () => {
    expect(canEditTable("OPERATOR", "DIAJUKAN")).toBe(false);
  });
  
  it("OPERATOR can edit DRAFT", () => {
    expect(canEditTable("OPERATOR", "DRAFT")).toBe(true);
  });
  
  it("VALIDATOR cannot edit any status", () => {
    expect(canEditTable("VALIDATOR", "DRAFT")).toBe(false);
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/validation-flow.spec.ts
test("Operator cannot edit approved table", async ({ page }) => {
  await login(page, "operator@test.com", "password");
  await navigateToTable(page, "bab-1", "1a1");
  
  // Table should be in DISETUJUI state
  await expect(page.getByText("Disetujui")).toBeVisible();
  
  // Edit button should be disabled
  await expect(page.getByRole("button", { name: "Edit" })).toBeDisabled();
  
  // Attempting to edit should show error
  // (UI should block before Server Action is called)
});
```

---

## 6. Rollback Plan

### If Issues Arise

| Issue | Rollback |
|-------|----------|
| Validation blocks break functionality | Revert to commented code, add behind feature flag |
| BAB 6 delete wrong folder | Restore from git: `git checkout HEAD -- app/(dashboard)/lkps/bab-6/tabel-6x` |
| GIN index causes issues | `DROP INDEX idx_tabel_lkps_row_row_data_gin;` |

### Feature Flag (Optional)

```typescript
// lib/config/flags.ts
export const FEATURES = {
  STRICT_VALIDATION: process.env.NEXT_PUBLIC_FEATURE_STRICT_VALIDATION === "true",
};

// Usage
if (FEATURES.STRICT_VALIDATION && !canEditTable(role, status)) {
  throw new Error("...");
}
```

---

## 7. Execution Checklist

- [ ] **Task 1: Enable Validation**
  - [ ] Read current `lib/actions/lkps.ts`
  - [ ] Create `canEditTable()` helper function
  - [ ] Create `canDeleteRow()` helper function
  - [ ] Uncomment and update `upsertLkpsRow` validation
  - [ ] Uncomment and update `deleteLkpsRow` validation
  - [ ] Add helper to `lib/utils/permissions.ts` for client use
  - [ ] Update table client components with disabled states
  - [ ] Test with different roles
  - [ ] Update error messages to be user-friendly

- [ ] **Task 2: Fix BAB 6**
  - [ ] Check current folder structure
  - [ ] Read `prisma/seed.ts` for definitions
  - [ ] Delete `tabel-61` folder
  - [ ] Delete `tabel-62` folder
  - [ ] Verify only `tabel-6` remains
  - [ ] Update navigation/links if needed
  - [ ] Check for any database cleanup needed

- [ ] **Task 3: GIN Index**
  - [ ] Create Prisma migration
  - [ ] Verify migration file
  - [ ] Run migration
  - [ ] Test with sample queries
  - [ ] Document in README

- [ ] **Testing**
  - [ ] Run existing tests
  - [ ] Add new unit tests for permissions
  - [ ] Add E2E tests for validation flow
  - [ ] Manual testing with all roles

---

## 8. Files to Modify

| File | Changes |
|------|---------|
| `lib/actions/lkps.ts` | Add validation functions, uncomment blocks |
| `lib/utils/permissions.ts` | Add `canEditTable()` and `canDeleteRow()` exports |
| `components/tables/*-client.tsx` | Add disabled states based on permissions |
| `app/(dashboard)/lkps/bab-6/tabel-61/` | DELETE |
| `app/(dashboard)/lkps/bab-6/tabel-62/` | DELETE |
| `prisma/migrations/` | ADD new migration for GIN index |
| `prisma/schema.prisma` | ADD comment about GIN index |

---

## 9. Success Criteria

| Criteria | Definition |
|----------|------------|
| Validation enabled | Operator cannot edit DISETUJUI/DIAJUKAN tables |
| BAB 6 fixed | Only 1 folder exists for BAB 6 |
| GIN index exists | Index visible in `pg_indexes` |
| All tests pass | `npm run test` passes |
| No regression | Existing functionality still works |

---

## 10. Timeline

| Task | Estimate | Dependencies |
|------|----------|--------------|
| Enable Validation | 1-2 hours | Read existing code |
| Fix BAB 6 | 30 minutes | Verify structure |
| GIN Index | 15 minutes | Run migration |
| Testing | 1 hour | All tasks complete |
| Documentation | 30 minutes | All tasks complete |
| **Total** | **3-4 hours** | — |

---

*Dokumen ini dibuat untuk P0 Critical Fixes - SIM-LKPS*
