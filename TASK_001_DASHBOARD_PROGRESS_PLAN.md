# TASK-001: Dashboard Progress Calculation

**Task:** Dashboard Progress Calculation  
**Priority:** Critical  
**Status:** Bug Identified  
**Date:** 21 Juli 2026  

---

## 1. Current Implementation Analysis

### 1.1 Bug Location

**File:** `app/(dashboard)/dashboard/page.tsx`

**Buggy Code:**
```tsx
// Per-BAB progress hardcoded to 0
const babProgress = [
  { bab: "BAB 1 — Tata Pamong", total: 6, gradient: "..." },
  { bab: "BAB 2 — Pendidikan", total: 11, gradient: "..." },
  // ... all BABs
];

// In JSX render:
const percentage = 0; // ❌ HARDCODED TO 0!
```

### 1.2 Bug Impact

| Impact | Severity | Description |
|--------|----------|-------------|
| Dashboard shows 0% progress for all BABs | High | Misleading for users |
| Cannot track actual data completion | High | No visibility |
| Affects decision making | Medium | Stakeholders see wrong data |

---

## 2. Data Source Analysis

### 2.1 Database Tables Involved

| Table | Purpose | Relevant Fields |
|-------|---------|-----------------|
| `TabelDefinition` | 31 LKPS table definitions | `bab` (1-6), `kode` |
| `TabelLkps` | Per-table per tahun akademik instances | `tabelDefinitionId`, `tahunAkademikId`, `status` |
| `TabelLkpsRow` | Actual data rows | `tabelLkpsId`, `rowData` |
| `TahunAkademik` | Academic years | `id`, `isActive` |

### 2.2 Existing Queries in Dashboard

```typescript
// Current queries (already working):
const totalDefinitions = await db.tabelDefinition.count();
const tabelStats = await db.tabelLkps.groupBy({ by: ["status"], _count: true });
```

### 2.3 Missing Queries

```typescript
// Needed for per-BAB progress:
const babProgress = await db.tabelDefinition.groupBy({
  by: ["bab"],
  _count: { id: true },
});
```

---

## 3. Progress Calculation Logic

### 3.1 Definition of "Progress"

A table is considered "filled" when:
1. Has at least 1 row in `TabelLkpsRow`
2. NOT in DRAFT status only (status is not just created, has actual data)

### 3.2 Per-BAB Progress Formula

```
Progress per BAB = (Tables with rows in BAB) / (Total Tables in BAB) × 100%
```

### 3.3 Overall LKPS Progress Formula

```
Overall Progress = (Tables with rows) / 31 × 100%
```

### 3.4 BAB to Table Count Mapping

| BAB | Total Tables |
|-----|--------------|
| BAB 1 — Tata Pamong | 6 |
| BAB 2 — Pendidikan | 11 |
| BAB 3 — Penelitian | 6 |
| BAB 4 — Pengabdian | 5 |
| BAB 5 — Tata Kelola | 2 |
| BAB 6 — Visi Misi | 1 |
| **TOTAL** | **31** |

---

## 4. Required Database Queries

### 4.1 Query for Per-BAB Progress

```typescript
// Get table count per BAB
const babTableCounts = await db.tabelDefinition.groupBy({
  by: ['bab'],
  _count: { id: true },
});

// Get filled tables count per BAB (tables that have rows)
const filledTableCounts = await db.tabelLkps.findMany({
  where: {
    tahunAkademikId: activeTahunAkademikId, // Filter by active TA
    rows: { some: {} }, // Has at least 1 row
  },
  select: {
    tabelDefinition: { select: { bab: true } },
  },
});

// Group by BAB
const filledByBab = filledTableCounts.reduce((acc, item) => {
  const bab = item.tabelDefinition.bab;
  acc[bab] = (acc[bab] || 0) + 1;
  return acc;
}, {} as Record<number, number>);
```

### 4.2 Alternative Single Query Approach

```typescript
// More efficient: single query with aggregation
const babProgress = await db.$queryRaw`
  SELECT 
    td.bab,
    COUNT(DISTINCT td.id) as total_tables,
    COUNT(DISTINCT CASE WHEN tr.id IS NOT NULL THEN td.id END) as filled_tables
  FROM tabel_definition td
  LEFT JOIN tabel_lkps tl ON tl.tabel_definition_id = td.id 
    AND tl.tahun_akademik_id = ${activeTahunAkademikId}
  LEFT JOIN tabel_lkps_row tr ON tr.tabel_lkps_id = tl.id
  GROUP BY td.bab
  ORDER BY td.bab
`;
```

---

## 5. Implementation Plan

### 5.1 Step 1: Update Server Component Query

**File:** `app/(dashboard)/dashboard/page.tsx`

**Changes:**
1. Get `activeTahunAkademikId` from `TahunAkademik`
2. Query `TabelDefinition` grouped by `bab` with total count
3. Query `TabelLkps` joined with `TabelLkpsRow` filtered by active TA
4. Calculate percentage per BAB

### 5.2 Step 2: Add Helper Function

```typescript
// Helper to calculate percentage safely
function calculatePercentage(filled: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
}
```

### 5.3 Step 3: Update BAB Progress Data Structure

```typescript
interface BABProgress {
  bab: number;
  babName: string;
  gradient: string;
  total: number;
  filled: number;
  percentage: number;
}
```

---

## 6. Expected Output

### 6.1 Before Fix

```tsx
// All values hardcoded
const percentage = 0; // Always 0%
// Shows: "0/6 tabel (0%)" for all BABs
```

### 6.2 After Fix

```tsx
// Real data from database
// Shows: "4/6 tabel (67%)" for BAB 1
// Shows: "8/11 tabel (73%)" for BAB 2
```

---

## 7. Acceptance Criteria

### 7.1 Functional Requirements

- [ ] Progress bars show real percentage from database
- [ ] Per-BAB breakdown accurate
- [ ] Only counts tables for active tahun akademik
- [ ] Tables without rows show 0%
- [ ] Tables with rows show percentage
- [ ] Overall progress sums all BABs correctly

### 7.2 Edge Cases

| Case | Expected Behavior |
|------|------------------|
| No data at all | All bars show 0% |
| Partial data | Shows actual progress |
| No active tahun akademik | Show "Pilih tahun akademik" message |
| Empty tables | Count as unfilled (0%) |
| Tables with rows | Count as filled |

### 7.3 Performance Requirements

- Single query preferred (use `$queryRaw` or efficient joins)
- < 100ms dashboard load time
- No N+1 queries

---

## 8. Implementation Checklist

### Step 1: Get Active Tahun Akademik
```typescript
const activeTa = await db.tahunAkademik.findFirst({
  where: { isActive: true },
  select: { id: true },
});
```

### Step 2: Query BAB Progress Data
```typescript
// Option A: Simple approach (2 queries)
const totalByBab = await db.tabelDefinition.groupBy({
  by: ['bab'],
  _count: { id: true },
});

// Option B: Efficient (1 query with $queryRaw or complex join)
```

### Step 3: Calculate Progress
```typescript
const babProgressData = totalByBab.map((bab) => ({
  bab: bab.bab,
  filled: filledByBab[bab.bab] || 0,
  total: bab._count.id,
  percentage: calculatePercentage(filledByBab[bab.bab] || 0, bab._count.id),
}));
```

### Step 4: Update JSX
```tsx
{babProgress.map((item) => (
  // Use item.percentage, item.filled, item.total
))}
```

---

## 9. File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `app/(dashboard)/dashboard/page.tsx` | Modify | Update query and JSX |

---

## 10. Testing Plan

### 10.1 Test Cases

| Test | Input | Expected Output |
|------|--------|----------------|
| Empty database | No rows | All 0% |
| BAB 1 partial | 3/6 tables filled | 50% for BAB 1 |
| All filled | 31/31 tables | 100% overall |
| Mixed TA | Different TA | Filtered by active TA only |

### 10.2 Manual Test Steps

1. Clear all table data
2. Fill only BAB 1 tables
3. Check dashboard shows 6/31 (19%) overall
4. Check BAB 1 shows 6/6 (100%)
5. Check other BABs show 0/6 (0%)

---

## 11. Related Issues

| Issue | Description |
|-------|-------------|
| TASK-002 | Quick stats calculation (Dosen/Mahasiswa counts) |
| TASK-003 | Recent activity feed filter by user role |

---

## 12. Effort Estimate

| Task | Complexity | Time |
|------|------------|------|
| Query update | Simple | 30 min |
| JSX update | Simple | 15 min |
| Testing | Medium | 30 min |

**Total: ~1.5 hours**

---

## 13. Priority

**CRITICAL** — Dashboard is the main entry point for users to understand system state. Showing 0% progress when data exists is misleading and erodes trust in the system.
