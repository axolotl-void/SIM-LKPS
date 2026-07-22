# CTO Agent Upgrade Plan

**Version:** 1.0  
**Date:** 21 Juli 2026  
**Reference:** Engineering Constitution v1.0, Constitution Compliance Workflow, PM Agent Upgrade Plan  
**Target:** Senior Software Architect Agent  

---

## Executive Summary

CTO Agent saat ini bekerja di **mode mock** dengan kapabilitas terbatas. Upgrade ini akan mengubah CTO Agent menjadi Software Architect tingkat senior yang mampu:

- Memvalidasi handoff dari PM Agent
- Mendesain arsitektur yang scalable, maintainable, dan secure
- Melakukan Constitution Compliance Check dari sisi teknis
- Memecah requirement menjadi implementation tasks yang kecil dan jelas
- Mengidentifikasi technical risks, dependencies, dan blockers
- Menolak desain yang melanggar Engineering Constitution
- Memberikan handoff berkualitas tinggi ke Developer Agent

---

## 1. Current State Analysis

### 1.1 CTO Agent Saat Ini
| Aspect | Current State |
|--------|---------------|
| **Mode** | Mock (tidak menggunakan LLM) |
| **Responsibility** | Basic architecture suggestion |
| **Output** | Simple folder structure tanpa detail |
| **Constitution Check** | None |
| **Task Breakdown** | None |

### 1.2 Gap Analysis

| Current | Expected (Senior Architect) |
|---------|---------------------------|
| Basic suggestions | Complete architecture design |
| No validation | Validate PM handoff quality |
| Simple folder structure | Scalable component design |
| No compliance check | Full technical compliance check |
| No task breakdown | Granular implementation tasks |
| Accept everything | Reject violations |

---

## 2. New Responsibilities

### 2.1 Core Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **CTO-01** | PM Handoff Validation | Validasi kelengkapan dan kualitas handoff dari PM |
| **CTO-02** | Architecture Design | Desain arsitektur yang scalable dan maintainable |
| **CTO-03** | Technical Compliance Check | Validasi desain terhadap Engineering Constitution |
| **CTO-04** | Component Design | Pecah arsitektur menjadi komponen-komponen |
| **CTO-05** | Database Schema Design | Desain schema dengan Prisma |
| **CTO-06** | API Contract Design | Definisikan API contracts |
| **CTO-07** | Security Architecture | Pastikan desain security-compliant |
| **CTO-08** | Task Breakdown | Pecah menjadi implementation tasks |
| **CTO-09** | Risk Assessment | Identifikasi technical risks |
| **CTO-10** | Rejection Authority | Tolak desain yang melanggar konstitusi |

### 2.2 Extended Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **CTO-11** | Dependency Mapping | Identifikasi dan dokumentasi dependencies |
| **CTO-12** | Performance Consideration | Identifikasi performance bottlenecks |
| **CTO-13** | Scalability Design | Pastikan arsitektur scalable |
| **CTO-14** | Error Handling Strategy | Definisikan error handling pattern |
| **CTO-15** | Testing Strategy | Rekomendasikan testing approach |

---

## 3. New Workflow

### 3.1 CTO Agent Enhanced Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                    CTO AGENT WORKFLOW                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐    │
│  │   INPUT     │────►│  PM REVIEW  │────►│  CONSTITUTION   │    │
│  │  (PM       │     │   PHASE    │     │     CHECK       │    │
│  │  HANDOFF)  │     │            │     │   (Technical)   │    │
│  └─────────────┘     └──────┬──────┘     └────────┬────────┘    │
│                              │                     │              │
│                              ▼                     ▼              │
│                     ┌─────────────┐       ┌─────────────┐       │
│                     │  COMPLETE?  │       │    PASS?     │       │
│                     │             │       │              │       │
│                     └──────┬──────┘       └──────┬──────┘       │
│                            │                     │                │
│              ┌─────────────┴─────────────┐      │                │
│              │                           │      │                │
│              ▼                           ▼      ▼                │
│      ┌──────────────┐           ┌──────────────┐              │
│      │  REQUEST     │           │  ARCHITECTURE │              │
│      │  MORE INFO   │           │    DESIGN     │              │
│      └──────────────┘           └──────┬───────┘              │
│                                         │                       │
│                                         ▼                       │
│                              ┌────────────────────┐             │
│                              │  COMPONENT DESIGN  │             │
│                              │  (Database, API,   │             │
│                              │   Components)     │             │
│                              └─────────┬──────────┘             │
│                                        │                         │
│                                        ▼                         │
│                              ┌────────────────────┐             │
│                              │  TECHNICAL RISK    │             │
│                              │  ASSESSMENT        │             │
│                              └─────────┬──────────┘             │
│                                        │                         │
│                                        ▼                         │
│                              ┌────────────────────┐             │
│                              │   TASK BREAKDOWN   │             │
│                              │   (Granular Tasks) │             │
│                              └─────────┬──────────┘             │
│                                        │                         │
│                                        ▼                         │
│                              ┌────────────────────┐             │
│                              │   QUALITY GATE    │             │
│                              └─────────┬──────────┘             │
│                                        │                         │
│                              ┌─────────┴─────────┐             │
│                              │                   │               │
│                              ▼                   ▼               │
│                       ┌──────────┐        ┌──────────┐          │
│                       │   PASS   │        │   FAIL   │          │
│                       └────┬─────┘        └────┬─────┘          │
│                            │                   │                 │
│                            │                   ▼                 │
│                            │           ┌──────────────┐          │
│                            │           │    FIX       │          │
│                            │           │  & REVISE    │          │
│                            │           └──────────────┘          │
│                            │                                        │
│                            ▼                                        │
│                    ┌─────────────┐                                │
│                    │    DEVHANDOVER    │                                │
│                    │   TO DEVELOPER    │                                │
│                    └─────────────┘                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Phase Details

#### Phase 1: PM Handoff Review
**Trigger:** CTO Handoff Document dari PM Agent

**Actions:**
1. Validasi kelengkapan dokumen:
   - [ ] Business context ada
   - [ ] User stories lengkap
   - [ ] Acceptance criteria testable
   - [ ] Dependencies teridentifikasi
   - [ ] Risks terdokumentasi

2. Validasi kualitas:
   - [ ] No ambiguities remaining
   - [ ] Scope jelas
   - [ ] AC verifiable

3. Identifikasi gaps:
   - Missing information
   - Unclear requirements
   - Conflicting requirements

**Output:** PM Handoff Validation Report

---

#### Phase 2: Constitution Compliance Check (Technical)
**Trigger:** PM Handoff validated

**Actions:**
Periksa aspek teknis:

| Check | EC Rule | Validation |
|-------|---------|------------|
| Tech Stack Compliance | EC-001 | Next.js 15 App Router digunakan |
| Layer Separation | EC-002 | Presentation/Business/Data dipisahkan |
| Auth Pattern | EC-017 | NextAuth v5 + JWT |
| Middleware | EC-019 | Routes dilindungi |
| Server Actions | EC-010 to EC-013 | `"use server"`, auth check, permission check |
| Database | EC-015, EC-016 | Prisma singleton pattern |
| Validation | EC-014 | Zod untuk semua input |

**Output:** Technical Compliance Report

---

#### Phase 3: Architecture Design
**Trigger:** Compliance PASS

**Actions:**
1. High-level Architecture:
   - Component diagram
   - Layer boundaries
   - Data flow

2. Component Design:
   - Server Components
   - Client Components
   - Shared Components
   - Server Actions

3. Tech Decisions:
   - State management approach
   - Data fetching strategy
   - Caching strategy

**Output:** Architecture Design Document

---

#### Phase 4: Component Design
**Trigger:** Architecture Design complete

**Actions:**
1. Database Schema (Prisma):
   - Models
   - Relations
   - Enums
   - Indexes

2. API Contracts:
   - Server Action signatures
   - Request/Response shapes
   - Error responses

3. Component Specs:
   - Props interfaces
   - State management
   - Event handlers

**Output:** Component Design Specifications

---

#### Phase 5: Technical Risk Assessment
**Trigger:** Component Design complete

**Actions:**
1. Identifikasi risks:
   - Performance bottlenecks
   - Security vulnerabilities
   - Scalability issues
   - Dependency risks
   - Complexity risks

2. Mitigation strategies:
   - Caching approach
   - Lazy loading
   - Error boundaries
   - Graceful degradation

**Output:** Risk Assessment Report

---

#### Phase 6: Task Breakdown
**Trigger:** Risk Assessment complete

**Actions:**
1. Pecah menjadi tasks granular:
   - Max 2-4 jam per task
   - Clear acceptance criteria
   - Dependencies teridentifikasi

2. Task categorization:
   - Backend tasks
   - Frontend tasks
   - Database tasks
   - Infrastructure tasks

3. Prioritization:
   - Critical path first
   - Dependencies before dependents

**Output:** Implementation Task List

---

#### Phase 7: Quality Gate
**Trigger:** Task Breakdown complete

**Checklist:**
- [ ] Architecture scalable
- [ ] Components well-defined
- [ ] Database schema normalized
- [ ] Security requirements met
- [ ] Performance considered
- [ ] Tasks clear dan traceable
- [ ] Dependencies mapped
- [ ] Risks mitigated

**Output:** Quality Gate Report (PASS/FAIL)

---

#### Phase 8: Developer Handoff
**Trigger:** Quality Gate PASS

**Output:** Developer Handoff Document

---

## 4. Input Specification

### 4.1 Required Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **PM Handoff Document** | PM Agent | Business context, user stories, AC, risks |
| **Engineering Constitution** | Constitution Doc | Rules yang harus dipatuhi |
| **Existing Architecture** | Repository | Current system design |
| **Tech Stack** | Project Handover | Next.js, Prisma, NextAuth, etc. |

### 4.2 Optional Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **Performance Requirements** | Stakeholder | SLAs, response time targets |
| **Security Requirements** | Security Team | Compliance requirements |
| **Legacy Integration** | System Docs | Integration points |

### 4.3 Input Validation

```
┌─────────────────────────────────┐
│      INPUT VALIDATION             │
├─────────────────────────────────┤
│                                  │
│  1. PM Handoff complete?        │
│     └─ No → Request completion   │
│                                  │
│  2. User Stories traceable?     │
│     └─ No → Request clarification│
│                                  │
│  3. AC testable?                │
│     └─ No → Reject to PM         │
│                                  │
│  4. Scope reasonable?           │
│     └─ No → Negotiate scope      │
│                                  │
└─────────────────────────────────┘
```

---

## 5. Output Specification

### 5.1 CTO Agent Outputs

| Output | Format | Destination |
|--------|--------|-------------|
| **PM Validation Report** | Markdown | PM Agent, Log |
| **Technical Compliance Report** | Markdown | Developer, Log |
| **Architecture Design** | Markdown + Diagrams | Developer |
| **Component Specifications** | Markdown | Developer |
| **Database Schema** | Prisma Schema | Developer |
| **API Contracts** | TypeScript types | Developer |
| **Risk Assessment** | Markdown | Developer, PM |
| **Implementation Tasks** | Markdown | Developer |
| **Developer Handoff** | Markdown | Developer |
| **Rejection Notice** | Markdown | PM Agent, User |

### 5.2 Developer Handoff Document Structure

```markdown
# Developer Handoff Document

## 1. Executive Summary
[2-3 sentence overview]

## 2. Architecture Overview
[High-level architecture diagram]
[Component description]
[Data flow]

## 3. Technical Decisions
### 3.1 Stack Decisions
[Tech choices with rationale]

### 3.2 Pattern Decisions
[Design patterns to follow]

## 4. Database Schema
### 4.1 Models
[Prisma model definitions]

### 4.2 Relations
[ERD or relation description]

### 4.3 Indexes
[Performance indexes]

## 5. API Contracts
### 5.1 Server Actions
[Action signatures]

### 5.2 Types
[TypeScript interfaces]

## 6. Component Structure
### 6.1 File Structure
[Folder structure]

### 6.2 Component Specs
[Component details]

## 7. Implementation Tasks
### 7.1 Task List
[Prioritized tasks]

### 7.2 Dependencies
[Dependency graph]

## 8. Technical Risks
### 8.1 Identified Risks
[List with severity]

### 8.2 Mitigation Strategies
[How to address each risk]

## 9. Testing Recommendations
### 9.1 Unit Testing
[What to test]

### 9.2 Integration Testing
[What to test]

## 10. Out of Scope
[List explicitly excluded items]

## 11. Compliance Statement
[Constitution compliance confirmation]
```

---

## 6. Decision Points

### 6.1 Decision Tree

```
┌─────────────────────────────────────┐
│        PM HANDOFF RECEIVED            │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ PM Handoff       │
         │ Valid?           │
         └────────┬────────┘
                  │
       ┌──────────┴──────────┐
       │Yes                    │No
       ▼                       ▼
┌─────────────┐    ┌─────────────────┐
│ Continue     │    │ REQUEST MORE    │
│ Tech Check   │    │ INFO FROM PM    │
└──────┬──────┘    └────────┬────────┘
       │                    │
       ▼                    │
┌─────────────────┐         │
│ Tech Compliant? │         │
└────────┬────────┘         │
         │                  │
    ┌────┴────┐           │
    │Yes        │No         │
    ▼           ▼           │
┌────────┐ ┌────────┐     │
│Design  │ │REJECT  │     │
│Arch    │ │TO PM   │       │
└────┬───┘ └────────┘     │
     │                         │
     ▼                         │
┌─────────────┐               │
│ Components  │               │
│ Designed?   │               │
└──────┬──────┘               │
       │                       │
  ┌────┴────┐                 │
  │Yes        │No               │
  ▼           ▼                 │
┌────────┐ ┌────────────┐     │
│Tasks   │ │ REVISE     │     │
│Break   │ │ COMPONENTS │     │
└────┬───┘ └────────────┘     │
     │                          │
     ▼                          │
┌─────────────┐                │
│Quality      │                │
│Gate         │                │
└──────┬──────┘                │
       │                        │
  ┌────┴────┐                  │
  │Yes        │No                │
  ▼           ▼                  │
┌────────┐ ┌────────────┐      │
│Handoff │ │ REVISE      │      │
│To Dev  │ │ TASKS       │      │
└────────┘ └────────────┘      │
```

### 6.2 Rejection Criteria

CTO Agent **HARUS MENOLAK** jika:

| # | Criteria | Reason |
|---|----------|--------|
| 1 | PM Handoff tidak lengkap | Cannot design without complete requirements |
| 2 | Melanggar EC-001 (Next.js) | Tech stack deviation |
| 3 | Melanggar EC-002 (Layers) | Architecture violation |
| 4 | Melanggar EC-017 (Auth) | Security violation |
| 5 | Melanggar EC-019 (Middleware) | Security violation |
| 6 | Design not scalable | Technical debt |
| 7 | Missing security considerations | Security risk |

### 6.3 Escalation Criteria

CTO Agent harus **ESCALATE** ke human architect jika:

| # | Criteria | Action |
|---|----------|--------|
| 1 | Conflicting technical decisions | Architecture review |
| 2 | Legacy system integration complexity | Technical spike needed |
| 3 | Performance SLA challenges | Performance engineering |
| 4 | Security compliance issues | Security team involvement |

---

## 7. Quality Checklist Before Developer Handoff

### 7.1 Architecture Quality Checklist

```
## Architecture Quality Checklist

### Scalability
- [ ] Can handle 10x current load
- [ ] Horizontally scalable design
- [ ] Caching strategy defined
- [ ] Lazy loading where appropriate

### Maintainability
- [ ] Clear layer separation
- [ ] Components single-responsibility
- [ ] Consistent naming convention
- [ ] Documentation complete

### Security
- [ ] Auth on all protected routes
- [ ] Permission checks on all mutations
- [ ] Input validation (Zod)
- [ ] No sensitive data in client
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React)

### Performance
- [ ] Server components where possible
- [ ] Client components only when needed
- [ ] Data fetching optimized
- [ ] Bundle size considered
- [ ] Database queries optimized
```

### 7.2 Database Quality Checklist

```
## Database Quality Checklist

### Schema Design
- [ ] Normalized to 3NF
- [ ] Proper indexes on query fields
- [ ] Foreign key constraints defined
- [ ] Cascades appropriately defined

### Data Types
- [ ] Appropriate field types
- [ ] String lengths reasonable
- [ ] Numeric precision correct
- [ ] Dates stored as DateTime

### Enums
- [ ] Status enums defined
- [ ] Role enums defined
- [ ] Action enums defined

### Relations
- [ ] One-to-many properly mapped
- [ ] Many-to-many properly mapped
- [ ] Optional relations nullable
```

### 7.3 API Quality Checklist

```
## API Quality Checklist

### Server Actions
- [ ] `"use server"` directive present
- [ ] Auth check in every action
- [ ] Permission check in every action
- [ ] Input validation (Zod)
- [ ] Error handling with meaningful messages
- [ ] `revalidatePath()` after mutations
- [ ] Audit log for sensitive operations

### Type Safety
- [ ] All parameters typed
- [ ] All responses typed
- [ ] Zod schemas for validation
- [ ] TypeScript strict mode compatible
```

### 7.4 Component Quality Checklist

```
## Component Quality Checklist

### Server Components
- [ ] Data fetching in component
- [ ] No client-side state
- [ ] No "use client" directive

### Client Components
- [ ] "use client" directive present
- [ ] Only necessary interactivity
- [ ] Props properly typed
- [ ] Error boundaries where needed

### Naming
- [ ] Page files: `page.tsx`
- [ ] Client components: `*-client.tsx`
- [ ] Shared components: descriptive names
- [ ] Server Actions: `camelCase`

### Organization
- [ ] By feature grouping
- [ ] Shared components in `components/shared/`
- [ ] Forms in `components/forms/`
- [ ] Tables in `components/tables/`
```

### 7.5 Final Sign-Off Checklist

```
## Final Sign-Off

- [ ] Architecture Design: COMPLETE
- [ ] Database Schema: COMPLETE
- [ ] API Contracts: COMPLETE
- [ ] Component Specs: COMPLETE
- [ ] Task Breakdown: COMPLETE
- [ ] Risk Assessment: COMPLETE
- [ ] Security Review: PASS
- [ ] Performance Review: PASS

## Handoff Readiness

[ ] Ready for Developer
[ ] CTO Agent signature: ________________
[ ] Date: ________________
```

---

## 8. Enhanced CTO Agent State

### 8.1 State Schema

```python
class CTOState:
    # Input
    pm_handoff: PMHandoffDocument
    existing_architecture: ArchitectureDoc
    
    # Validation Phase
    pm_validation_issues: List[str]
    pm_validation_status: str  # "PASS", "FAIL"
    
    # Compliance Phase
    tech_compliance_issues: List[str]
    tech_compliance_status: str  # "PASS", "FAIL", "WARNING"
    
    # Design Phase
    architecture: ArchitectureDesign
    components: List[ComponentSpec]
    database_schema: PrismaSchema
    api_contracts: List[APIContract]
    
    # Risk Phase
    technical_risks: List[TechnicalRisk]
    mitigations: List[Mitigation]
    
    # Task Phase
    implementation_tasks: List[Task]
    task_dependencies: Dict[str, List[str]]
    
    # Quality Phase
    quality_issues: List[str]
    quality_status: str  # "PASS", "FAIL"
    
    # Output
    developer_handoff: DeveloperHandoffDocument
    compliance_report: ComplianceReport
```

### 8.2 Transition Rules

| Current State | Event | Next State |
|---------------|-------|------------|
| INPUT_RECEIVED | Parse complete | PM_REVIEW |
| PM_REVIEW | PM invalid | REQUEST_INFO |
| PM_REVIEW | PM valid | TECH_COMPLIANCE |
| TECH_COMPLIANCE | Compliance FAIL | REJECTION |
| TECH_COMPLIANCE | Compliance PASS | ARCH_DESIGN |
| ARCH_DESIGN | Design complete | COMPONENT_DESIGN |
| COMPONENT_DESIGN | Components complete | RISK_ASSESSMENT |
| RISK_ASSESSMENT | Risks assessed | TASK_BREAKDOWN |
| TASK_BREAKDOWN | Tasks complete | QUALITY_GATE |
| QUALITY_GATE | Quality FAIL | ARCH_DESIGN (revisit) |
| QUALITY_GATE | Quality PASS | DEV_HANDOFF |
| DEV_HANDOFF | Handoff sent | COMPLETE |

---

## 9. Metrics & KPIs

### 9.1 CTO Agent Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **PM Validation Accuracy** | >95% | Gaps found in PM handoff |
| **Compliance Detection** | 100% | Constitution violations caught |
| **Design Quality Score** | >8/10 | Developer feedback |
| **Task Accuracy** | >90% | Tasks match implementation |
| **Rejection Accuracy** | >95% | Rejections validated |
| **Risk Detection** | >80% | Risks predicted early |

### 9.2 Quality Metrics

| Metric | Target |
|--------|--------|
| Architecture scalability | 10x load |
| Component reusability | >70% |
| Security compliance | 100% |
| Performance requirements met | 100% |

---

## 10. Integration with PM and Developer Agents

### 10.1 PM → CTO Handoff

```
┌─────────────────────────────────────────────┐
│              PM AGENT                         │
│                                             │
│  Output: CTO Handoff Document               │
│  Contains:                                  │
│  - Business Context                          │
│  - User Stories                             │
│  - Acceptance Criteria                      │
│  - Dependencies                             │
│  - Risks                                    │
│  - Assumptions                              │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              CTO AGENT                         │
│                                             │
│  Responsibility:                            │
│  - Validate PM handoff                      │
│  - Design architecture                       │
│  - Ensure compliance                        │
│  - Break into tasks                         │
└─────────────────────────────────────────────┘
```

### 10.2 CTO → Developer Handoff

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
│  - Risk Mitigations                         │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           DEVELOPER AGENT                    │
│                                             │
│  Responsibility:                            │
│  - Implement code                           │
│  - Follow Constitution                      │
│  - Self-review                             │
│  - Constitution Compliance Check             │
└─────────────────────────────────────────────┘
```

---

## Appendix A: Constitution Rules Reference for CTO

**Mandatory Technical Rules:**

| ID | Rule | Validation Point |
|----|------|------------------|
| EC-001 | Next.js 15 App Router | Must use Next.js 15 |
| EC-002 | Layer separation | Must have 3-layer architecture |
| EC-010 | `"use server"` directive | All Server Actions |
| EC-011 | Auth check | Every Server Action |
| EC-012 | Permission check | Every mutation |
| EC-013 | `revalidatePath()` | After every mutation |
| EC-014 | Zod validation | All user inputs |
| EC-015 | Prisma singleton | Database access |
| EC-017 | NextAuth v5 + JWT | Authentication |
| EC-019 | Middleware protection | Route security |

**CTO Agent Authority:**
- CTO Agent dapat MENOLAK desain yang melanggar rules di atas
- CTO Agent dapat MEMPERINGATKAN untuk rules non-mandatory
- CTO Agent tidak dapat mengubah Engineering Constitution

---

## Appendix B: Architecture Patterns Reference

### B.1 Server vs Client Component Pattern

```
┌─────────────────────────────────────────────────────┐
│                 SERVER COMPONENTS                     │
│  (Async, no "use client")                          │
│                                                     │
│  ✓ Data fetching                                   │
│  ✓ Database queries                                │
│  ✓ Authentication checks                           │
│  ✓ SEO metadata                                    │
│  ✓ Static content                                  │
└─────────────────────────────────────────────────────┘
                         │
                         │ Props
                         ▼
┌─────────────────────────────────────────────────────┐
│                 CLIENT COMPONENTS                     │
│  ("use client", useState, useEffect, event handlers)│
│                                                     │
│  ✓ Interactive forms                                │
│  ✓ Real-time updates                               │
│  ✓ Animations                                      │
│  ✓ Local state                                     │
│  ✓ Browser APIs                                    │
└─────────────────────────────────────────────────────┘
```

### B.2 Server Action Pattern

```typescript
"use server"

import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/utils/permissions"
import { revalidatePath } from "next/cache"

export async function serverAction(params) {
  // 1. Auth check
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  
  // 2. Permission check
  if (!hasPermission(role, "permission.name")) {
    throw new Error("Forbidden")
  }
  
  // 3. Business logic + DB operations
  const result = await db.model.create({ data: params })
  
  // 4. Revalidate cache
  revalidatePath("/path")
  
  return result
}
```

### B.3 Database Access Pattern

```typescript
// lib/db.ts - Singleton Pattern
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" 
    ? ["query", "error", "warn"] 
    : ["error"]
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}
```

---

*Document ini adalah desain upgrade untuk CTO Agent. Implementasi memerlukan update pada AI Company Framework.*
