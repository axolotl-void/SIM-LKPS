# Constitution Compliance Workflow

**Project:** SIM-LKPS  
**Reference:** Engineering Constitution v1.0  
**Effective Date:** 21 Juli 2026  

---

## 1. Tujuan Constitution Compliance

Memastikan seluruh output AI Agent (PM, CTO, Developer) memenuhi standar Engineering Constitution v1.0 secara konsisten. Constitution Compliance adalah:

- **Quality Gate** sebelum kode masuk ke repository
- **Shared Language** antar agent untuk mendefinisikan "kode yang benar"
- **Audit Trail** untuk traceable compliance decisions
- **Feedback Loop** untuk continuous improvement konstitusi

---

## 2. Kapan Constitution Wajib Diperiksa

| Fase | Timing | Scope |
|------|--------|-------|
| **Before Implementation** | Sebelum menulis kode | Desain, arsitektur, naming |
| **After Implementation** | Setelah kode ditulis | Setiap file yang dimodifikasi/dibuat |
| **Before Handover** | Sebelum task ditandai selesai | Review final terhadap checklist |
| **On Request** | Ketika ada质疑 | Agent bisa minta review sewaktu-waktu |

**Trigger Points:**
- PM Agent selesai menghasilkan requirements
- CTO Agent selesai menghasilkan architecture design
- Developer Agent selesai menulis setiap file
- Code review sebelum pull request
- Sprint review sebelum demo

---

## 3. Agent yang Wajib Melakukan Pemeriksaan

### 3.1 PM Agent (Product Manager)
**Fokus:** Folder structure, naming convention, requirement alignment

| Duty | Description |
|------|-------------|
| Validate folder structure | Memastikan output sesuai EC-003, EC-004, EC-005, EC-006 |
| Validate naming | Memastikan file/folder naming sesuai EC-007, EC-008 |
| Validate requirements completeness | Setiap requirement memiliki target file yang jelas |

**Checklist:**
- [ ] Folder pattern `bab-{n}/tabel-{kode}/` konsisten
- [ ] Server Actions di `lib/actions/`
- [ ] Components organized by feature
- [ ] Naming convention sesuai EC-007, EC-008

---

### 3.2 CTO Agent (Chief Technology Officer)
**Fokus:** Architecture, database design, security patterns

| Duty | Description |
|------|-------------|
| Validate architecture | Memastikan sesuai EC-001, EC-002 |
| Validate database patterns | Memastikan sesuai EC-015, EC-016 |
| Validate auth patterns | Memastikan sesuai EC-017, EC-018, EC-019 |
| Validate tech stack decisions | Tidak ada deviation dari stack yang sudah dipilih |

**Checklist:**
- [ ] Next.js 15 App Router (EC-001)
- [ ] Layer separation (EC-002)
- [ ] Prisma singleton pattern (EC-015, EC-016)
- [ ] NextAuth + JWT (EC-017)
- [ ] Wildcard permissions (EC-018)
- [ ] Middleware protection (EC-019)

---

### 3.3 Developer Agent
**Fokus:** Implementation compliance, Server Actions, error handling

| Duty | Description |
|------|-------------|
| Self-review sebelum submit | Setiap file yang ditulis di-review terhadap constitution |
| Validate Server Actions | Memastikan EC-010, EC-011, EC-012, EC-013 terpenuhi |
| Validate components | Memastikan EC-020, EC-021, EC-022 terpenuhi |
| Validate error handling | Memastikan EC-023 diterapkan |

**Checklist:**
- [ ] `"use server"` directive ada (EC-010)
- [ ] Auth check di awal action (EC-011)
- [ ] Permission check sebelum eksekusi (EC-012)
- [ ] `revalidatePath()` setelah mutasi (EC-013)
- [ ] Zod validation untuk semua input (EC-014)
- [ ] Server Components untuk data fetching (EC-020)
- [ ] Client Components untuk interactivity (EC-021)
- [ ] Error Boundary tersedia (EC-023)

---

### 3.4 Reviewer (Manual atau AI)
**Fokus:** Final validation, edge cases, compliance summary

| Duty | Description |
|------|-------------|
| Validate full implementation | Semua rules terpenuhi |
| Check edge cases | Pola yang tidak konsisten di-detect |
| Provide compliance report | Dokumentasi compliance status |
| Approve atau reject | Keputusan final terhadap task |

---

## 4. Alur Pemeriksaan Sebelum dan Sesudah Implementasi

### 4.1 Before Implementation (Pre-Implementation Check)

```
┌─────────────────┐
│   TASK START    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PM validates   │──── Pass ────► ┌─────────────────┐
│  folder/naming  │                │  CTO validates  │
└─────────────────┘                │  architecture   │
         │                          └────────┬────────┘
         │ Fail                               │
         ▼                                    │ Fail
┌─────────────────┐                          ▼
│  Return to PM   │◄────────────────────┌─────────────────┐
│  with findings  │                     │  Return to CTO   │
└─────────────────┘                     │  with findings  │
                                        └─────────────────┘
```

**Pre-Implementation Check List:**
1. PM Agent memvalidasi folder structure dan naming
2. CTO Agent memvalidasi architecture decisions
3. Jika ada FAIL → task dikembalikan ke agent yang bertanggung jawab
4. Jika PASS → Developer Agent mulai implementasi

---

### 4.2 After Implementation (Post-Implementation Check)

```
┌─────────────────┐
│  IMPLEMENTATION │
│     COMPLETE    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Self-Review    │──── Pass ────► ┌─────────────────┐
│  by Developer   │                │  Reviewer       │
└─────────────────┘                │  Final Check    │
         │                          └────────┬────────┘
         │ Fail                               │
         ▼                                    │ Fail
┌─────────────────┐                          ▼
│  Fix by         │◄────────────────────┌─────────────────┐
│  Developer      │                     │  Return to      │
└─────────────────┘                     │  Developer      │
                                        └─────────────────┘
```

**Post-Implementation Check List:**
1. Developer Agent melakukan self-review
2. Reviewer melakukan final validation
3. Jika ada FAIL → dikembalikan ke Developer untuk fix
4. Jika PASS → task ditandai selesai

---

## 5. Kriteria PASS, WARNING, dan FAIL

### 5.1 PASS ✅
Semua rule yang applicable terpenuhi:
- Tidak ada violation terhadap Mandatory rules
- Warning rules memiliki dokumentasi jika diabaikan
- Pattern konsisten dengan repository

**Indikator:**
- ✅ Folder structure sesuai pattern
- ✅ Naming convention konsisten
- ✅ Server Actions memiliki auth + permission check
- ✅ Prisma singleton pattern diterapkan
- ✅ Client/Server split jelas
- ✅ Error boundaries tersedia

**Action:** Task boleh dilanjutkan atau ditandai selesai.

---

### 5.2 WARNING ⚠️
Ada potensi issues yang perlu diperhatikan:
- Recommended rules tidak diterapkan tapi ada workaround
- Pattern sedikit berbeda dari standar tapi masih acceptable
- Ada duplication yang perlu di-refactor nanti

**Indikator:**
- ⚠️ Recommended rule (EC-009, EC-022, EC-023, EC-025) tidak diterapkan
- ⚠️ Minor naming deviation
- ⚠️ Error handling ada tapi tidak comprehensive

**Action:** 
- Dokumentasikan warning
- Task boleh dilanjutkan
- Buat technical debt note untuk follow-up

---

### 5.3 FAIL ❌
Ada violation terhadap Mandatory rules:
- Core security pattern tidak diterapkan
- Architecture decision violated
- Server/Client boundary violated
- Auth/permission check missing

**Indikator:**
- ❌ Missing `"use server"` directive
- ❌ Missing auth check di Server Action
- ❌ Missing permission check
- ❌ Missing `revalidatePath()`
- ❌ Client component tanpa `"use client"` atau sebaliknya
- ❌ Wrong folder structure
- ❌ Prisma bukan singleton
- ❌ Auth bukan NextAuth v5 + JWT
- ❌ Route tidak dilindungi middleware

**Action:**
- Task HARUS dikembalikan ke agent yang responsible
- Wajib fix sebelum lanjut
- Dokumentasikan violation untuk tracking

---

## 6. Tindakan Jika Terjadi Pelanggaran Constitution

### 6.1 Pelanggaran Ringan (Warning)
| Step | Action |
|------|--------|
| 1 | Identifikasi rule yang violated |
| 2 | Dokumentasikan di task comment |
| 3 | Lanjutkan task dengan catatan |
| 4 | Buat technical debt item |

### 6.2 Pelanggaran Berat (Fail - Mandatory)
| Step | Action |
|------|--------|
| 1 | Identifikasi rule yang violated |
| 2 | Hentikan task sementara |
| 3 | Buat detailed finding report |
| 4 | Assign kembali ke agent yang responsible |
| 5 | Tunggu fix dan re-review |
| 6 | Jika fixed → continue; jika tidak → escalate |

### 6.3 Pelanggaran Security-Critical
| Step | Action |
|------|--------|
| 1 | Langsung stop execution |
| 2 | Eskalasi ke human reviewer |
| 3 | Tidak boleh continue sampai fixed |
| 4 | Dokumentasikan incident |

**Security-Critical Rules (tidak boleh violated):**
- EC-011: Auth check (Unauthorized access risk)
- EC-012: Permission check (Privilege escalation risk)
- EC-017: NextAuth v5 + JWT (Session security)
- EC-019: Middleware protection (Route exposure)

---

## 7. Kapan Task Boleh Dilanjutkan dan Kapan Harus Dikembalikan

### 7.1 Boleh Dilanjutkan ✅
| Condition | Description |
|-----------|-------------|
| Pre-check PASS | Folder/naming/architecture valid |
| Post-check PASS | Semua applicable Mandatory rules terpenuhi |
| Warning only | Hanya recommended rules yang missed |

### 7.2 Harus Dikembalikan 🔄
| Condition | Reason |
|-----------|--------|
| Pre-check FAIL | Desain tidak sesuai constitution |
| Post-check FAIL | Ada Mandatory rule yang violated |
| Security violation | Ada rule EC-011, EC-012, EC-017, atau EC-019 yang violated |
| Pattern inconsistency | Deviation yang signifikan dari established pattern |
| Missing documentation | Required explanation tidak ada |

### 7.3 Decision Matrix

| Pre-Check | Post-Check | Action |
|-----------|------------|--------|
| PASS | PASS | ✅ Task selesai |
| PASS | WARNING | ⚠️ Task selesai dengan catatan |
| PASS | FAIL | 🔄 Return ke Developer |
| FAIL | - | 🔄 Return ke PM/CTO sesuai temuan |
| WARNING | PASS | ⚠️ Task selesai dengan catatan |
| WARNING | FAIL | 🔄 Return ke Developer |

---

## 8. Diagram Workflow Sederhana

### Full Compliance Workflow

```
                    ┌──────────────────────────────┐
                    │        TASK RECEIVED         │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │       PRE-IMPLEMENTATION      │
                    │           CHECK             │
                    └──────────────┬───────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
                    ┌─────────┐         ┌─────────┐
                    │  PASS   │         │  FAIL   │
                    └────┬────┘         └────┬────┘
                         │                   │
                         ▼                   ▼
               ┌─────────────────┐   ┌─────────────────┐
               │  START          │   │  RETURN TO      │
               │  IMPLEMENTATION │   │  PM/CTO         │
               └────────┬────────┘   │  WITH FINDINGS  │
                        │            └─────────────────┘
                        ▼
              ┌──────────────────────────┐
              │    IMPLEMENTATION        │
              │       COMPLETE           │
              └──────────────┬───────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │      SELF-REVIEW          │
              │  (Developer Agent)        │
              └──────────────┬───────────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
                   ▼                   ▼
              ┌─────────┐         ┌─────────┐
              │  PASS   │         │  FAIL   │
              └────┬────┘         └────┬────┘
                   │                   │
                   ▼                   ▼
         ┌─────────────────┐   ┌─────────────────┐
         │  REVIEWER       │   │  FIX BY         │
         │  FINAL CHECK    │   │  DEVELOPER      │
         └────────┬────────┘   └─────────────────┘
                  │
        ┌─────────┴─────────┐
        │                     │
        ▼                     ▼
  ┌─────────┐           ┌─────────┐
  │  PASS   │           │  FAIL   │
  └────┬────┘           └────┬────┘
       │                     │
       ▼                     ▼
 ┌─────────────────┐  ┌─────────────────┐
 │  ✅ TASK DONE   │  │  RETURN TO      │
 │  (Mark Complete)│  │  DEVELOPER      │
 └─────────────────┘  └─────────────────┘
```

### Compliance Decision Flow

```
┌─────────────────────────────────────────────────────┐
│                  RULE VIOLATION?                     │
└─────────────────────┬───────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │MANDATORY │ │RECOMMEND │ │  INFO    │
   │  RULE    │ │  RULE    │ │  RULE    │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │   FAIL   │ │ WARNING   │ │   PASS   │
  │  🔄 STOP │ │  ⚠️ NOTE  │ │  ✅ OK   │
  └──────────┘ └──────────┘ └──────────┘
```

---

## 9. Compliance Checklist Template

```markdown
## Constitution Compliance Checklist

**Task:** [Task Name]
**Agent:** [PM/CTO/Developer]
**Date:** [Date]

### Folder & Naming (EC-003 to EC-009)
- [ ] Folder structure sesuai `bab-{n}/tabel-{kode}/`
- [ ] Server Actions di `lib/actions/`
- [ ] Components organized by feature
- [ ] Client components suffix `-client.tsx`
- [ ] Zod schemas suffix `Schema`

### Architecture (EC-001, EC-002)
- [ ] Next.js 15 App Router
- [ ] Layer separation: presentation/business/data

### Server Actions (EC-010 to EC-013)
- [ ] `"use server"` directive ada
- [ ] Auth check di awal
- [ ] Permission check sebelum eksekusi
- [ ] `revalidatePath()` setelah mutasi

### Validation (EC-014)
- [ ] Zod validation untuk semua input

### Database (EC-015, EC-016)
- [ ] Prisma singleton pattern
- [ ] Export `db` dari `lib/db.ts`

### Auth (EC-017 to EC-019)
- [ ] NextAuth v5 + JWT strategy
- [ ] Wildcard permissions defined
- [ ] Middleware protection active

### Components (EC-020 to EC-022)
- [ ] Server Components untuk data fetching
- [ ] Client Components untuk interactivity
- [ ] Props dari server ke client

### Error Handling (EC-023)
- [ ] Error Boundary tersedia

### Env Variables (EC-024, EC-025)
- [ ] `NEXT_PUBLIC_` prefix untuk client vars
- [ ] Required env vars validated

### Result
- [ ] **PASS** - All Mandatory rules met
- [ ] **WARNING** - Recommended rules missed (document below)
- [ ] **FAIL** - Mandatory rules violated (list below)

**Notes:**
[If WARNING or FAIL, detail here]
```

---

## 10. Quick Reference: Rule Categories

| Category | Rules | Mandatory | Recommended |
|----------|-------|-----------|--------------|
| **Architecture** | EC-001, EC-002 | 2 | 0 |
| **Folder Structure** | EC-003, EC-004, EC-005, EC-006 | 4 | 0 |
| **Naming** | EC-007, EC-008, EC-009 | 2 | 1 |
| **Server Actions** | EC-010, EC-011, EC-012, EC-013 | 4 | 0 |
| **Validation** | EC-014 | 1 | 0 |
| **Database** | EC-015, EC-016 | 2 | 0 |
| **Auth** | EC-017, EC-018, EC-019 | 3 | 0 |
| **Components** | EC-020, EC-021, EC-022 | 2 | 1 |
| **Error Handling** | EC-023 | 0 | 1 |
| **Env Variables** | EC-024, EC-025 | 1 | 1 |
| **TOTAL** | EC-001 to EC-025 | **21** | **4** |

---

*Document ini adalah panduan operasional untuk seluruh AI Agent. Setiap violation harus didokumentasikan dan ditrack untuk continuous improvement.*
