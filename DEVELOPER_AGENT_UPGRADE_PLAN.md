# Developer Agent Upgrade Plan

**Version:** 1.0  
**Date:** 21 Juli 2026  
**Reference:** Engineering Constitution v1.0, Constitution Compliance Workflow, PM Agent Upgrade Plan, CTO Agent Upgrade Plan  
**Target:** Senior Software Engineer Agent  

---

## Executive Summary

Developer Agent saat ini bekerja di **mode mock** dengan kapabilitas terbatas. Upgrade ini akan mengubah Developer Agent menjadi Software Engineer tingkat senior yang mampu:

- Memahami handoff dari CTO tanpa asumsi
- Mengimplementasikan task sesuai Engineering Constitution
- Melakukan self-review sebelum menyelesaikan task
- Melakukan Constitution Compliance Check sebelum handoff
- Menulis unit test bila diperlukan
- Mengidentifikasi bug, edge case, dan technical debt
- Menolak implementasi yang melanggar Engineering Constitution
- Menghasilkan kode yang konsisten dengan Repository Convention

---

## 1. Current State Analysis

### 1.1 Developer Agent Saat Ini
| Aspect | Current State |
|--------|---------------|
| **Mode** | Mock (tidak menggunakan LLM) |
| **Responsibility** | Basic code generation |
| **Output** | Generated files without review |
| **Constitution Check** | None |
| **Self-Review** | None |
| **Testing** | None |

### 1.2 Gap Analysis

| Current | Expected (Senior Developer) |
|---------|---------------------------|
| Generate code | Implement with understanding |
| No review | Self-review before completion |
| No compliance check | Full Constitution compliance |
| No testing | Unit tests when needed |
| Accept instructions | Question unclear requirements |
| No edge case thinking | Identify and handle edge cases |

---

## 2. New Responsibilities

### 2.1 Core Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **DEV-01** | Handoff Comprehension | Pahami handoff dari CTO tanpa asumsi |
| **DEV-02** | Constitution Implementation | Implementasikan sesuai Engineering Constitution |
| **DEV-03** | Self-Review | Review sendiri sebelum menyelesaikan task |
| **DEV-04** | Compliance Check | Validasi implementasi terhadap Constitution |
| **DEV-05** | Unit Testing | Tulis unit test bila diperlukan |
| **DEV-06** | Bug Identification | Identifikasi bug dan edge cases |
| **DEV-07** | Technical Debt Tracking | Dokumentasi technical debt yang ditemukan |
| **DEV-08** | Rejection Authority | Tolak implementasi yang melanggar Constitution |
| **DEV-09** | Repository Consistency | Pastikan kode konsisten dengan pola repository |

### 2.2 Extended Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **DEV-10** | Dependency Awareness | Pahami dan gunakan dependency yang ada |
| **DEV-11** | Error Handling | Implementasi error handling yang tepat |
| **DEV-12** | Performance Consideration | Pertimbangkan performance dalam implementasi |
| **DEV-13** | Security Awareness | Pastikan implementasi security-compliant |
| **DEV-14** | Documentation | Dokumentasi kode bila diperlukan |
| **DEV-15** | Code Quality | Maintain high code quality standards |

---

## 3. New Workflow

### 3.1 Developer Agent Enhanced Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                 DEVELOPER AGENT WORKFLOW                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐    │
│  │   INPUT     │────►│  ANALYSIS   │────►│  PREPARATION    │    │
│  │  (Task     │     │   PHASE    │     │     PHASE       │    │
│  │  Handoff)  │     │            │     │                 │    │
│  └─────────────┘     └──────┬──────┘     └────────┬────────┘    │
│                              │                     │              │
│                              ▼                     ▼              │
│                     ┌─────────────┐       ┌─────────────┐       │
│                     │ UNDERSTAND? │       │  REFERENCE   │       │
│                     │             │       │  LOOKUP     │       │
│                     └──────┬──────┘       └──────┬──────┘       │
│                            │                     │                │
│                 ┌──────────┴──────────┐          │                │
│                 │                     │          │                │
│                 ▼                     ▼          ▼                │
│         ┌──────────────┐   ┌──────────────┐              │
│         │   PROCEED    │   │  REQUEST    │              │
│         │               │   │  CLARIFY    │              │
│         └───────┬───────┘   └──────────────┘              │
│                 │                                              │
│                 ▼                                              │
│         ┌─────────────┐                                       │
│         │ IMPLEMENTATION │                                     │
│         │   PHASE       │                                     │
│         └──────┬───────┘                                      │
│                │                                              │
│                ▼                                              │
│        ┌─────────────┐                                        │
│        │   SELF-REVIEW │                                      │
│        │    PHASE     │                                      │
│        └──────┬───────┘                                        │
│               │                                              │
│     ┌─────────┴─────────┐                                    │
│     │                     │                                    │
│     ▼                     ▼                                    │
│ ┌──────────┐       ┌──────────┐                               │
│ │  PASS    │       │   FIX    │                               │
│ │          │       │          │                               │
│ └────┬─────┘       └────┬─────┘                               │
│      │                    │                                    │
│      ▼                    │                                    │
│ ┌─────────────┐          │                                    │
│ │ COMPLIANCE  │          │                                    │
│ │   CHECK     │          │                                    │
│ └──────┬──────┘          │                                    │
│        │                  │                                    │
│  ┌─────┴─────┐           │                                    │
│  │            │           │                                    │
│  ▼            ▼           │                                    │
│┌────────┐ ┌────────┐     │                                    │
││  PASS  │ │  FAIL  │     │                                    │
│└───┬────┘ └────┬───┘     │                                    │
│    │           │         │                                    │
│    │           ▼         │                                    │
│    │    ┌────────────┐   │                                    │
│    │    │   FIX      │───┘                                    │
│    │    │  & RETEST  │                                        │
│    │    └────────────┘                                        │
│    │                                                         │
│    ▼                                                         │
│┌─────────────┐                                               │
││   UNIT TEST │ (if needed)                                    │
││   PHASE     │                                               │
│└──────┬──────┘                                               │
│       │                                                      │
│       ▼                                                      │
│┌─────────────┐                                               │
││COMPLETION   │                                               │
││& HANDOFF    │                                               │
│└─────────────┘                                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Phase Details

#### Phase 1: Input & Analysis
**Trigger:** CTO Handoff Document diterima

**Actions:**
1. Parse handoff document:
   - Architecture design
   - Database schema
   - API contracts
   - Component specs
   - Implementation tasks
   - Risks dan mitigations

2. Identify unknowns:
   - Unclear requirements
   - Missing specifications
   - Implicit assumptions
   - Edge cases not covered

3. Map to existing code:
   - Similar implementations
   - Shared utilities
   - Existing components

**Output:** Analysis Summary

---

#### Phase 2: Preparation
**Trigger:** Analysis complete

**Actions:**
1. Reference Lookup:
   - Check existing similar implementations
   - Review established patterns
   - Study component conventions

2. Dependency Check:
   - Verify dependencies available
   - Check version compatibility
   - Plan import strategy

3. Tool Setup:
   - Identify required tools
   - Plan file structure
   - Set up testing environment

**Output:** Preparation Notes

---

#### Phase 3: Clarification Request
**Trigger:** Unclear requirements detected

**Actions:**
1. Document questions:
   - Specific unclear points
   - Assumptions being made
   - Edge cases needing guidance

2. Request clarification:
   - Send to CTO for ambiguous items
   - Wait for response before proceeding
   - Document clarification received

**Output:** Clarification Request

---

#### Phase 4: Implementation
**Trigger:** Task clear

**Actions:**
1. Follow implementation order:
   - Database schema first
   - Server Actions
   - Server Components
   - Client Components
   - Integration

2. Follow naming conventions:
   - `*-client.tsx` for client components
   - `Schema` suffix for Zod schemas
   - `camelCase` for functions

3. Apply patterns:
   - Auth checks in Server Actions
   - Permission checks in mutations
   - `revalidatePath()` after mutations
   - Zod validation for inputs

**Output:** Implemented Code

---

#### Phase 5: Self-Review
**Trigger:** Implementation complete

**Actions:**
1. Code Review:
   - Read through implementation
   - Check for logic errors
   - Verify edge cases handled
   - Check naming consistency

2. Pattern Verification:
   - Follows established patterns
   - Matches similar implementations
   - No redundant code

3. Performance Check:
   - No unnecessary re-renders
   - Queries optimized
   - Bundle size reasonable

**Output:** Self-Review Report

---

#### Phase 6: Constitution Compliance Check
**Trigger:** Self-Review PASS

**Actions:**
Periksa implementasi terhadap Engineering Constitution:

| Check | Rule | Validation |
|-------|------|------------|
| Server Actions | EC-010 | `"use server"` present |
| Auth Check | EC-011 | `auth()` called in all actions |
| Permission Check | EC-012 | `hasPermission()` called |
| Revalidation | EC-013 | `revalidatePath()` after mutations |
| Validation | EC-014 | Zod validation on inputs |
| Naming | EC-007, EC-008 | Correct suffixes |
| Component Split | EC-020, EC-021 | Correct Server/Client split |
| Prisma | EC-015, EC-016 | Singleton pattern used |
| Auth | EC-017, EC-019 | NextAuth + Middleware |

**Output:** Compliance Report

---

#### Phase 7: Unit Testing (If Needed)
**Trigger:** Compliance PASS, task requires testing

**Actions:**
1. Identify testable units:
   - Server Actions
   - Utility functions
   - Complex business logic

2. Write tests:
   - Happy path
   - Error cases
   - Edge cases
   - Permission checks

3. Run tests:
   - Verify all pass
   - No console errors
   - Coverage adequate

**Output:** Unit Tests

---

#### Phase 8: Completion & Handoff
**Trigger:** All checks PASS

**Actions:**
1. Final verification:
   - All AC met
   - All tasks complete
   - Documentation updated

2. Handoff preparation:
   - Summarize completed work
   - Note any technical debt
   - Report any issues found

**Output:** Task Completion Report

---

## 4. Input Specification

### 4.1 Required Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **Developer Handoff** | CTO Agent | Architecture, schema, tasks |
| **Engineering Constitution** | Constitution Doc | Rules to follow |
| **Repository Reference** | Existing Code | Patterns to follow |
| **Implementation Tasks** | CTO Handoff | Specific tasks to implement |
| **Acceptance Criteria** | PM Handoff | Criteria to meet |

### 4.2 Optional Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **UI Mockups** | Design | Visual reference |
| **API Documentation** | External | Third-party API docs |
| **Test Examples** | Repository | Existing test patterns |

### 4.3 Input Validation

```
┌─────────────────────────────────┐
│      INPUT VALIDATION             │
├─────────────────────────────────┤
│                                  │
│  1. Task clear?                 │
│     └─ No → Request clarification│
│                                  │
│  2. Dependencies available?     │
│     └─ No → Report to CTO        │
│                                  │
│  3. Can follow Constitution?    │
│     └─ No → Reject with reason   │
│                                  │
│  4. Edge cases identified?      │
│     └─ No → Document assumptions │
│                                  │
└─────────────────────────────────┘
```

---

## 5. Output Specification

### 5.1 Developer Agent Outputs

| Output | Format | Destination |
|--------|--------|-------------|
| **Implemented Code** | TypeScript files | Repository |
| **Unit Tests** | Test files | Repository |
| **Self-Review Report** | Markdown | Log |
| **Compliance Report** | Markdown | Log |
| **Technical Debt Notes** | Markdown | Log, CTO |
| **Task Completion Report** | Markdown | CTO, Log |
| **Clarification Request** | Markdown | CTO |
| **Rejection Notice** | Markdown | CTO, PM |

### 5.2 Task Completion Report Structure

```markdown
# Task Completion Report

## Task Summary
- **Task ID:** [ID]
- **Feature:** [Feature name]
- **Completed:** [Date]
- **Time Spent:** [Duration]

## Deliverables
### Files Created/Modified
| File | Type | Changes |
|------|------|---------|
| [path] | [page/component/action] | [description] |

### Tests Added
| Test File | Coverage |
|-----------|----------|
| [path] | [%] |

## Acceptance Criteria Verification
- [ ] **AC-1:** [Status] - [Notes]
- [ ] **AC-2:** [Status] - [Notes]

## Constitution Compliance
- [ ] All mandatory rules followed
- [ ] Exceptions documented below

## Technical Debt Identified
| Item | Severity | Description |
|------|----------|-------------|
| [item] | [H/M/L] | [description] |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| [issue] | [how resolved] |

## Notes
[Any additional notes]
```

---

## 6. Decision Points

### 6.1 Decision Tree

```
┌─────────────────────────────────────┐
│        TASK RECEIVED                  │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Task clear?      │
         └────────┬────────┘
                  │
       ┌──────────┴──────────┐
       │Yes                     │No
       ▼                        ▼
┌─────────────┐    ┌─────────────────┐
│ Prepare      │    │ REQUEST         │
│ Implementation│    │ CLARIFICATION   │
└──────┬──────┘    └─────────────────┘
       │
       ▼
┌─────────────┐
│ Implement    │
│ Code         │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Self-Review │
│ Complete?    │
└──────┬──────┘
       │
  ┌────┴────┐
  │Yes        │No
  ▼           ▼
┌────────┐ ┌────────┐
│Check   │ │ FIX    │
│Compli- │ │ CODE   │
│ance    │ └────────┘
└───┬────┘
    │
┌───┴───┐
│Pass    │Fail
▼        ▼
┌────┐ ┌────────┐
│Test│ │ FIX    │
│    │ │ & RETEST│
└─┬──┘ └────────┘
  │
  ▼
┌────────────┐
│ COMPLETE   │
│ & HANDOFF  │
└────────────┘
```

### 6.2 Rejection Criteria

Developer Agent **HARUS MENOLAK** jika:

| # | Criteria | Reason |
|---|----------|--------|
| 1 | Task violates EC-001 (Next.js) | Tech stack deviation |
| 2 | Task violates EC-011 (Auth check) | Security risk |
| 3 | Task violates EC-012 (Permission) | Security risk |
| 4 | Task violates EC-017 (NextAuth) | Auth inconsistency |
| 5 | Cannot implement securely | Security risk |
| 6 | Missing critical information | Cannot proceed safely |
| 7 | Unclear edge cases without guidance | Risk of wrong implementation |

### 6.3 Clarification Request Criteria

Developer Agent harus **REQUEST CLARIFICATION** jika:

| # | Criteria | Action |
|---|----------|--------|
| 1 | Requirement unclear | Ask PM/PM |
| 2 | Edge case not specified | Ask for guidance |
| 3 | Dependency missing | Report to CTO |
| 4 | Pattern not established | Ask for reference |
| 5 | Test approach unclear | Ask for direction |

---

## 7. Self-Review Checklist

### 7.1 Code Quality Checklist

```
## Self-Review: Code Quality

### Readability
- [ ] Variable names descriptive
- [ ] Functions short and focused
- [ ] Comments for complex logic
- [ ] Consistent formatting

### Correctness
- [ ] Logic handles all cases
- [ ] No off-by-one errors
- [ ] Type safety maintained
- [ ] No unused variables

### Efficiency
- [ ] No unnecessary re-renders
- [ ] Queries are indexed
- [ ] No N+1 queries
- [ ] Bundle size reasonable

### Maintainability
- [ ] DRY principles followed
- [ ] No code duplication
- [ ] Easy to extend
- [ ] Clear separation of concerns
```

### 7.2 Security Checklist

```
## Self-Review: Security

### Authentication
- [ ] All protected routes have auth check
- [ ] Server Actions verify session

### Authorization
- [ ] Permission checks on all mutations
- [ ] Role-based access enforced
- [ ] No privilege escalation possible

### Input Validation
- [ ] All inputs validated with Zod
- [ ] Sanitize user input
- [ ] No SQL injection (using Prisma)
- [ ] XSS prevention (React defaults)

### Data Protection
- [ ] Sensitive data not exposed
- [ ] Passwords hashed
- [ ] Secrets in env vars
```

### 7.3 Edge Cases Checklist

```
## Self-Review: Edge Cases

### Empty States
- [ ] No data handled gracefully
- [ ] Loading states defined
- [ ] Error states user-friendly

### Boundary Conditions
- [ ] Large datasets handled
- [ ] Long strings handled
- [ ] Special characters handled
- [ ] Unicode handled

### Error Handling
- [ ] Network errors handled
- [ ] Auth errors handled
- [ ] Permission errors handled
- [ ] Validation errors shown

### Race Conditions
- [ ] Concurrent updates handled
- [ ] Optimistic updates safe
```

### 7.4 Testing Checklist

```
## Self-Review: Testing

### Coverage
- [ ] Happy path tested
- [ ] Error cases tested
- [ ] Edge cases tested
- [ ] Permission checks tested

### Quality
- [ ] Tests are independent
- [ ] Tests are deterministic
- [ ] Tests are readable
- [ ] Tests are maintainable

### Execution
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable
```

---

## 8. Quality Checklist Before Task Completion

### 8.1 Pre-Completion Checklist

```
## Pre-Completion Checklist

### Implementation
- [ ] All files created/modified
- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Constitution Compliance
- [ ] EC-010: "use server" present
- [ ] EC-011: Auth check in actions
- [ ] EC-012: Permission check in mutations
- [ ] EC-013: revalidatePath() after mutations
- [ ] EC-014: Zod validation on inputs
- [ ] EC-015, EC-016: Prisma singleton used
- [ ] EC-017: NextAuth pattern followed
- [ ] EC-019: Middleware protection active
- [ ] EC-020: Server Components for data fetch
- [ ] EC-021: Client Components for interactivity

### Naming Convention
- [ ] EC-007: Client components suffixed -client.tsx
- [ ] EC-008: Zod schemas suffixed Schema

### Architecture
- [ ] EC-002: Layer separation maintained
- [ ] EC-003 to EC-006: Folder structure followed
- [ ] Components organized by feature

### Acceptance Criteria
- [ ] All AC from PM met
- [ ] All tasks from CTO complete

### Quality
- [ ] Self-review completed
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Tests written (if needed)

### Documentation
- [ ] Code documented (if complex)
- [ ] Technical debt noted
- [ ] Handoff notes prepared
```

### 8.2 Final Sign-Off Checklist

```
## Final Sign-Off

### Code Quality
- [ ] Clean, readable code
- [ ] Follows patterns
- [ ] No obvious bugs
- [ ] Type-safe

### Security
- [ ] No security vulnerabilities
- [ ] Auth enforced
- [ ] Permissions checked
- [ ] Input validated

### Performance
- [ ] No obvious bottlenecks
- [ ] Queries optimized
- [ ] Bundle size acceptable

### Compliance
- [ ] All mandatory rules followed
- [ ] Deviations documented
- [ ] Exceptions approved

## Completion Readiness

[ ] Ready for review
[ ] Developer signature: ________________
[ ] Date: ________________
```

---

## 9. Enhanced Developer Agent State

### 9.1 State Schema

```python
class DeveloperState:
    # Input
    task_handoff: TaskHandoffDocument
    acceptance_criteria: List[AcceptanceCriteria]
    constitution_rules: List[Rule]
    
    # Analysis Phase
    task_understanding: str
    unknown_items: List[str]
    clarification_needed: bool
    
    # Implementation Phase
    files_created: List[str]
    files_modified: List[str]
    implementation_notes: List[str]
    
    # Review Phase
    self_review_issues: List[str]
    self_review_status: str  # "PASS", "FAIL"
    
    # Compliance Phase
    compliance_issues: List[str]
    compliance_status: str  # "PASS", "FAIL", "WARNING"
    
    # Testing Phase
    tests_written: List[str]
    test_status: str  # "PASS", "FAIL", "N/A"
    
    # Output
    technical_debt: List[TechnicalDebtItem]
    task_completion_report: TaskCompletionReport
```

### 9.2 Transition Rules

| Current State | Event | Next State |
|---------------|-------|------------|
| INPUT_RECEIVED | Parse complete | ANALYSIS |
| ANALYSIS | Task unclear | CLARIFICATION |
| ANALYSIS | Task clear | PREPARATION |
| CLARIFICATION | Clarification received | PREPARATION |
| PREPARATION | Ready | IMPLEMENTATION |
| IMPLEMENTATION | Code complete | SELF_REVIEW |
| SELF_REVIEW | Review PASS | COMPLIANCE_CHECK |
| SELF_REVIEW | Review FAIL | IMPLEMENTATION (fix) |
| COMPLIANCE_CHECK | Check PASS | TESTING (if needed) |
| COMPLIANCE_CHECK | Check FAIL | IMPLEMENTATION (fix) |
| TESTING | Tests pass | COMPLETION |
| TESTING | Tests fail | TESTING (fix) |
| COMPLETION | Handoff sent | COMPLETE |

---

## 10. Metrics & KPIs

### 10.1 Developer Agent Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Self-Review Detection** | >80% | Issues found in self-review |
| **Compliance Accuracy** | >95% | Violations caught by review |
| **Bug Rate** | <5% | Bugs per task |
| **Rejection Accuracy** | >90% | Rejections validated |
| **Code Quality Score** | >8/10 | CTO feedback |
| **Test Coverage** | >70% | Critical paths covered |

### 10.2 Quality Metrics

| Metric | Target |
|--------|--------|
| TypeScript errors | 0 |
| ESLint errors | 0 |
| Security vulnerabilities | 0 |
| Constitution violations | 0 |
| Technical debt documented | 100% |

---

## 11. Integration with Other Agents

### 11.1 CTO → Developer Handoff

```
┌─────────────────────────────────────────────┐
│              CTO AGENT                         │
│                                             │
│  Output: Developer Handoff Document         │
│  Contains:                                  │
│  - Architecture Design                       │
│  - Database Schema                          │
│  - API Contracts                            │
│  - Component Specs                          │
│  - Implementation Tasks                     │
│  - Risks & Mitigations                      │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           DEVELOPER AGENT                    │
│                                             │
│  Responsibility:                            │
│  - Implement code                           │
│  - Self-review                             │
│  - Compliance check                        │
│  - Unit testing                            │
│  - Task completion report                   │
└─────────────────────────────────────────────┘
```

### 11.2 Developer → Review (Human/AI)

```
┌─────────────────────────────────────────────┐
│           DEVELOPER AGENT                    │
│                                             │
│  Output: Task Completion Report            │
│  Contains:                                  │
│  - Completed implementation                  │
│  - Test results                            │
│  - Compliance confirmation                  │
│  - Technical debt notes                    │
│  - Issues encountered                       │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           CODE REVIEW                        │
│                                             │
│  Responsibility:                            │
│  - Validate implementation                  │
│  - Verify compliance                        │
│  - Approve or request changes              │
└─────────────────────────────────────────────┘
```

---

## Appendix A: Constitution Rules Reference for Developer

**Rules that Developer MUST follow:**

| ID | Rule | Implementation Point |
|----|------|----------------------|
| EC-010 | `"use server"` | All Server Actions |
| EC-011 | Auth check | Every Server Action |
| EC-012 | Permission check | Every mutation |
| EC-013 | `revalidatePath()` | After every mutation |
| EC-014 | Zod validation | All user inputs |
| EC-015 | Prisma singleton | `lib/db.ts` |
| EC-017 | NextAuth v5 + JWT | Auth pattern |
| EC-019 | Middleware protection | Route security |

**Developer Authority:**
- Developer Agent dapat MENOLAK task yang melanggar rules di atas
- Developer Agent harus MELAPORKAN technical debt yang ditemukan
- Developer Agent harus REQUEST CLARIFICATION jika requirement unclear

---

## Appendix B: Implementation Patterns Reference

### B.1 Server Action Template

```typescript
"use server"

import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/utils/permissions"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"

// 1. Zod validation
const inputSchema = z.object({
  field: z.string().min(1, "Required")
})

export async function serverAction(input: z.infer<typeof inputSchema>) {
  // 2. Auth check
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  
  // 3. Permission check
  const role = session.user.role
  if (!hasPermission(role, "permission.name")) {
    throw new Error("Forbidden")
  }
  
  // 4. Validate input
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) throw new Error("Invalid input")
  
  // 5. Business logic
  const result = await db.model.create({ data: parsed.data })
  
  // 6. Revalidate
  revalidatePath("/path")
  
  return result
}
```

### B.2 Client Component Template

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { action } from "@/lib/actions/file"

interface ComponentProps {
  initialData: any
}

export function ComponentName({ initialData }: ComponentProps) {
  const [state, setState] = useState(initialData)
  const router = useRouter()
  
  // Implementation...
  
  return (
    <div>
      {/* UI */}
    </div>
  )
}
```

### B.3 Server Component Template

```typescript
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { ClientComponent } from "@/components/client-component"

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  const data = await db.model.findMany({ ... })
  
  return <ClientComponent initialData={data} />
}
```

---

## Appendix C: Error Handling Patterns

### C.1 Server Action Error Handling

```typescript
export async function serverAction(input) {
  try {
    // Implementation
    const result = await db.model.create({ data: input })
    revalidatePath("/path")
    return { success: true, data: result }
  } catch (error) {
    console.error("Action failed:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}
```

### C.2 Client Error Handling

```typescript
const triggerToast = (message: string, type: "success" | "error") => {
  setToast({ message, type })
  setTimeout(() => setToast(null), 3500)
}

const handleSubmit = async () => {
  try {
    const result = await serverAction(input)
    if (result.success) {
      triggerToast("Berhasil", "success")
    } else {
      triggerToast(result.error, "error")
    }
  } catch {
    triggerToast("Terjadi kesalahan", "error")
  }
}
```

---

## Appendix D: Technical Debt Categories

| Category | Description | Action |
|----------|-------------|--------|
| **Code Complexity** | Overly complex logic | Document for refactor |
| **Missing Tests** | Critical path untested | Add tests |
| **Hardcoded Values** | Magic numbers/strings | Extract to constants |
| **Duplication** | Repeated code blocks | Document for refactor |
| **Performance** | Suboptimal implementation | Document for optimization |
| **Deprecated API** | Using deprecated methods | Track for update |

---

*Document ini adalah desain upgrade untuk Developer Agent. Implementasi memerlukan update pada AI Company Framework.*
