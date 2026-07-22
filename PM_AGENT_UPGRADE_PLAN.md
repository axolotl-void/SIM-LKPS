# PM Agent Upgrade Plan

**Version:** 1.0  
**Date:** 21 Juli 2026  
**Reference:** Engineering Constitution v1.0, Constitution Compliance Workflow  
**Target:** Senior Product Manager Agent  

---

## Executive Summary

PM Agent saat ini bekerja di **mode mock** dengan kapabilitas terbatas. Upgrade ini akan mengubah PM Agent menjadi Product Manager tingkat senior yang mampu:

- Memahami kebutuhan bisnis secara mendalam
- Mengidentifikasi dan menyelesaikan requirement yang ambigu
- Memberikan handoff berkualitas tinggi ke CTO tanpa asumsi
- Melakukan Constitution Compliance Check sebelum mengirim task
- Menolak requirement yang melanggar Engineering Constitution

---

## 1. Current State Analysis

### 1.1 PM Agent Saat Ini
| Aspect | Current State |
|--------|---------------|
| **Mode** | Mock (tidak menggunakan LLM) |
| **Responsibility** | Basic requirement listing |
| **Output** | Simple requirements without structure |
| **Constitution Check** | None |
| **Quality Gate** | None |

### 1.2 Gap Analysis

| Current | Expected (Senior PM) |
|---------|---------------------|
| List requirements | Understand business context |
| Simple output | Structured User Stories + AC |
| No validation | Ambiguity detection |
| No compliance check | Full Constitution check |
| Accept anything | Reject violations |

---

## 2. New Responsibilities

### 2.1 Core Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **PM-01** | Business Understanding | Pahami tujuan bisnis di balik setiap requirement |
| **PM-02** | Requirement Clarification | Identifikasi dan pecahkan ambiguities |
| **PM-03** | User Story Creation | Pecah requirement menjadi User Stories terstruktur |
| **PM-04** | Acceptance Criteria Definition | Definisikan AC yang testable dan verifiable |
| **PM-05** | Constitution Compliance Check | Validasi semua requirement terhadap Engineering Constitution |
| **PM-06** | Architecture Alignment | Pastikan requirement selaras dengan tech stack |
| **PM-07** | Rejection Authority | Tolak requirement yang melanggar konstitusi |
| **PM-08** | Complete Handoff | Berikan informasi lengkap ke CTO tanpa asumsi |

### 2.2 Extended Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **PM-09** | Risk Identification | Identifikasi risiko teknis dari requirement |
| **PM-10** | Dependency Mapping | Identifikasi ketergantungan antar fitur |
| **PM-11** | Priority Recommendation | Berikan prioritas berdasarkan value vs effort |
| **PM-12** | Assumption Documentation | Dokumentasikan semua asumsi yang dibuat |
| **PM-13** | Stakeholder Communication | jelaskan keputusan kepada stakeholder |

---

## 3. New Workflow

### 3.1 PM Agent Enhanced Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                     PM AGENT WORKFLOW                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐    │
│  │   INPUT     │────►│  ANALYSIS   │────►│  CLARIFICATION  │    │
│  │  (Request)  │     │   PHASE     │     │     PHASE      │    │
│  └─────────────┘     └──────┬──────┘     └────────┬────────┘    │
│                              │                     │              │
│                              │ Ambiguous?          │ Needs Info?  │
│                              ▼                     ▼              │
│                     ┌─────────────┐     ┌─────────────────┐      │
│                     │   CONST.    │     │   STAKEHOLDER   │      │
│                     │   CHECK     │     │   QUESTIONS     │      │
│                     └──────┬──────┘     └─────────────────┘      │
│                            │                                    │
│                   ┌─────────┴─────────┐                         │
│                   │                   │                          │
│                   ▼                   ▼                          │
│            ┌──────────┐        ┌──────────┐                     │
│            │  PASS    │        │   FAIL   │                     │
│            │          │        │          │                     │
│            └────┬─────┘        └────┬─────┘                     │
│                 │                   │                            │
│                 │                   ▼                            │
│                 │          ┌──────────────┐                       │
│                 │          │   REJECT    │                       │
│                 │          │   &         │                       │
│                 │          │   EXPLAIN   │                       │
│                 │          └──────────────┘                       │
│                 │                                                │
│                 ▼                                                │
│         ┌─────────────┐                                         │
│         │  USER STORY │                                         │
│         │  CREATION   │                                         │
│         └──────┬──────┘                                         │
│                │                                                │
│                ▼                                                │
│        ┌─────────────┐                                         │
│        │  ACCEPTANCE │                                         │
│        │  CRITERIA   │                                         │
│        └──────┬──────┘                                         │
│               │                                                │
│               ▼                                                │
│       ┌─────────────┐                                         │
│       │   QUALITY   │                                         │
│       │   GATE      │                                         │
│       └──────┬──────┘                                         │
│              │                                                │
│     ┌────────┴────────┐                                       │
│     │                 │                                        │
│     ▼                 ▼                                        │
│ ┌──────────┐    ┌──────────┐                                 │
│ │   PASS   │    │   FAIL   │                                 │
│ └────┬─────┘    └────┬─────┘                                 │
│      │                │                                        │
│      │                ▼                                        │
│      │         ┌──────────────┐                                │
│      │         │    FIX       │                                │
│      │         │  & RESUBMIT  │                                │
│      │         └──────────────┘                                │
│      │                                                        │
│      ▼                                                        │
│ ┌─────────────┐                                               │
│ │   HANDOFF   │                                               │
│ │    TO CTO   │                                               │
│ └─────────────┘                                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Phase Details

#### Phase 1: Input Reception
**Trigger:** User request atau existing requirement

**Actions:**
1. Parse request menjadi structured input
2. Identifikasi source (user story, bug report, feature request)
3. Extract key entities dan actions
4. Identifikasi stakeholder yang relevan

**Output:** Parsed Request Document

---

#### Phase 2: Analysis
**Trigger:** Parsed Request Document

**Actions:**
1. Analisis tujuan bisnis (why)
2. Identifikasi user actors dan roles
3. Mapping ke existing features
4. Identifikasi potential conflicts

**Output:** Analysis Summary

---

#### Phase 3: Clarification
**Trigger:** Analysis reveals ambiguity

**Actions:**
1. Identifikasi ambiguities:
   - Vague requirements ("user-friendly")
   - Missing information (who, what, when, where, why, how)
   - Conflicting requirements
   - Implicit assumptions
2. Generate clarifying questions
3. Prioritaskan pertanyaan berdasarkan impact

**Output:** Clarifying Questions List

---

#### Phase 4: Constitution Compliance Check
**Trigger:** Clarified requirements ready

**Actions:**
Periksa setiap requirement terhadap Engineering Constitution:

| Check | Rule | Validation |
|-------|------|------------|
| Tech Stack | EC-001 | Apakah Next.js 15 App Router? |
| Architecture | EC-002 | Apakah mengikuti layer separation? |
| Folder Structure | EC-003 to EC-006 | Apakah pattern `bab-{n}/tabel-{kode}/` applicable? |
| Naming | EC-007, EC-008 | Apakah naming convention terpenuhi? |
| Complexity | - | Apakah requirement feasible dengan stack yang ada? |

**Output:** Compliance Report

---

#### Phase 5: User Story Creation
**Trigger:** Passed Constitution Check

**Template:**
```markdown
### User Story [N]: [Title]

**As a** [role]
**I want to** [action]
**So that** [benefit]

**Context:**
- [Business context]
- [User context]

**Related to:** [Feature/Epic reference]
```

**Rules:**
1. Setiap story punya satu goal
2. Role jelas dan spesifik
3. Benefit terukur
4. Tidak ada technical implementation details

**Output:** User Stories List

---

#### Phase 6: Acceptance Criteria Definition
**Trigger:** User Stories created

**AC Template:**
```markdown
#### Acceptance Criteria [N.M]

**Given** [precondition]
**When** [action]
**Then** [expected result]

**Verification:**
- [ ] [Checkable criteria 1]
- [ ] [Checkable criteria 2]

**Out of Scope:**
- [ ] [Explicitly excluded]
```

**Rules:**
1. Setiap AC testable dan verifiable
2. Menggunakan Gherkin format (Given-When-Then)
3. Measurable outcomes
4. Clear boundaries (in/out of scope)

**Output:** Acceptance Criteria Document

---

#### Phase 7: Quality Gate
**Trigger:** User Stories + AC complete

**Checklist Validation:**
- [ ] Semua ambiguities terselesaikan
- [ ] User Stories well-formed
- [ ] AC testable dan complete
- [ ] Constitution compliance confirmed
- [ ] Dependencies teridentifikasi
- [ ] Assumptions terdokumentasi
- [ ] Risks teridentifikasi

**Output:** Quality Gate Report (PASS/FAIL)

---

#### Phase 8: CTO Handoff
**Trigger:** Quality Gate PASS

**Handoff Document Structure:**
```markdown
# CTO Handoff Document

## 1. Executive Summary
[2-3 sentence overview]

## 2. Business Context
[Why this feature matters]

## 3. User Stories
[All user stories]

## 4. Acceptance Criteria
[All AC with verification checklist]

## 5. Technical Considerations
[Any tech-specific notes from PM perspective]

## 6. Dependencies
[List of dependencies]

## 7. Risks
[Identified risks]

## 8. Assumptions
[Documented assumptions]

## 9. Out of Scope
[Explicitly excluded]

## 10. Compliance Statement
[Constitution compliance confirmation]
```

**Output:** CTO Handoff Document

---

## 4. Input Specification

### 4.1 Required Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **Raw Request** | User | Initial request (text, document, chat) |
| **Project Context** | Constitution | Engineering Constitution v1.0 |
| **Existing Features** | Repository | Current feature set untuk avoid duplication |
| **Tech Stack** | Handover Doc | Next.js 15, Prisma, NextAuth, etc. |
| **Business Rules** | Domain | Academic accreditation rules (LKPS/BAN-PT) |

### 4.2 Optional Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **User Research** | Stakeholder | User interviews, surveys |
| **Analytics Data** | System | Usage patterns, pain points |
| **Competitive Analysis** | External | Similar systems |

### 4.3 Input Validation

```
┌─────────────────────────────────┐
│       INPUT VALIDATION           │
├─────────────────────────────────┤
│                                  │
│  1. Is request clear?           │
│     └─ No → Ask clarifying Q     │
│                                  │
│  2. Is stakeholder clear?       │
│     └─ No → Ask clarifying Q     │
│                                  │
│  3. Is scope defined?           │
│     └─ No → Propose scope        │
│                                  │
│  4. Is it feasible?             │
│     └─ No → Reject with reason   │
│                                  │
└─────────────────────────────────┘
```

---

## 5. Output Specification

### 5.1 PM Agent Outputs

| Output | Format | Destination |
|--------|--------|-------------|
| **Clarifying Questions** | Markdown list | User |
| **Requirements Document** | Markdown | CTO, Repository |
| **User Stories** | Markdown | CTO, Repository |
| **Acceptance Criteria** | Markdown | CTO, Developer |
| **CTO Handoff** | Markdown | CTO |
| **Constitution Compliance Report** | Markdown | CTO, Compliance Log |
| **Rejection Notice** | Markdown | User |

### 5.2 Output Quality Standards

| Aspect | Standard |
|--------|----------|
| **Completeness** | 100% of requirements covered |
| **Clarity** | No ambiguous language |
| **Traceability** | Every requirement traceable to user story |
| **Testability** | Every AC verifiable |
| **Compliance** | Constitution compliant |

---

## 6. Decision Points

### 6.1 Decision Tree

```
┌─────────────────────────────────────┐
│         REQUIREMENT RECEIVED          │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Is request      │
         │ clear?          │
         └────────┬────────┘
                  │
       ┌──────────┴──────────┐
       │Yes                   │No
       ▼                      ▼
┌─────────────┐    ┌─────────────────┐
│ Continue     │    │ Generate        │
│ analysis     │    │ Clarifying Q    │
└──────┬──────┘    └────────┬────────┘
       │                    │
       ▼                    │
┌─────────────────┐        │
│ Does it comply  │        │
│ with Constitution?│       │
└────────┬────────┘        │
         │                 │
    ┌────┴────┐           │
    │Yes       │No         │
    ▼          ▼           │
┌────────┐ ┌────────┐     │
│Create  │ │Rejection│    │
│Stories │ │Notice   │     │
└────┬───┘ └────────┘     │
     │                         │
     ▼                         │
┌─────────────┐               │
│ AC Complete?│               │
└──────┬──────┘               │
       │                       │
  ┌────┴────┐                 │
  │Yes       │No               │
  ▼          ▼                 │
┌────────┐ ┌────────────┐      │
│Quality │ │Revise      │      │
│Gate    │ │Stories/AC  │      │
└────────┘ └────────────┘      │
     │                         │
     ▼                         │
┌─────────────┐               │
│ CTO HANDOFF │               │
└─────────────┘               │
```

### 6.2 Rejection Criteria

PM Agent **HARUS MENOLAK** jika:

| # | Criteria | Reason |
|---|----------|--------|
| 1 | Melanggar EC-001 (Next.js required) | Tech stack deviation |
| 2 | Melanggar EC-002 (Layer separation) | Architecture violation |
| 3 | Melanggar EC-017 (Auth requirement) | Security violation |
| 4 | Melanggar EC-019 (Middleware protection) | Security violation |
| 5 | Meminta real-time database di client | Not feasible |
| 6 | Meminta complex state management untuk simple feature | Over-engineering |
| 7 | Scope creep yang tidak reasonable | Resource waste |

### 6.3 Escalation Criteria

PM Agent harus **ESCALATE** ke human reviewer jika:

| # | Criteria | Action |
|---|----------|--------|
| 1 | Konflik antar stakeholder | Human mediation needed |
| 2 | Budget/time constraints | Product Manager decision |
| 3 | Legal/Compliance issues | Legal team involvement |
| 4 | Third-party dependencies | Vendor negotiation needed |

---

## 7. Quality Checklist Before CTO Handoff

### 7.1 Completeness Checklist

```
## Pre-Handoff Completeness Checklist

### Requirements
- [ ] All requirements captured
- [ ] No ambiguous requirements remaining
- [ ] All unknowns documented as assumptions
- [ ] Scope boundaries clear

### User Stories
- [ ] Each story has: role, action, benefit
- [ ] Each story is independent
- [ ] Each story is estimable
- [ ] Each story is negotiable (not spec)
- [ ] Each story is small enough

### Acceptance Criteria
- [ ] Every story has at least 1 AC
- [ ] Every AC is testable
- [ ] Every AC has verification checklist
- [ ] Out of scope clearly defined

### Dependencies
- [ ] Internal dependencies identified
- [ ] External dependencies identified
- [ ] Blockers documented

### Risks
- [ ] Technical risks identified
- [ ] Business risks identified
- [ ] Mitigation strategies proposed
```

### 7.2 Constitution Compliance Checklist

```
## Constitution Compliance Checklist

### Architecture (EC-001, EC-002)
- [ ] Next.js 15 App Router requirement
- [ ] Layer separation understood

### Folder Structure (EC-003 to EC-006)
- [ ] `bab-{n}/tabel-{kode}/` pattern applicable
- [ ] Server Actions in `lib/actions/`
- [ ] Components by feature

### Naming (EC-007, EC-008)
- [ ] Client components suffix `-client.tsx`
- [ ] Zod schemas suffix `Schema`

### Server Actions (EC-010 to EC-013)
- [ ] Auth check requirement understood
- [ ] Permission check requirement understood
- [ ] `revalidatePath()` requirement understood

### Validation (EC-014)
- [ ] Zod validation requirement understood

### Database (EC-015, EC-016)
- [ ] Prisma ORM requirement understood

### Auth (EC-017 to EC-019)
- [ ] NextAuth v5 + JWT requirement
- [ ] RBAC requirement understood
- [ ] Middleware protection requirement
```

### 7.3 Final Sign-Off Checklist

```
## Final Sign-Off

- [ ] Requirements Document: COMPLETE
- [ ] User Stories: COMPLETE
- [ ] Acceptance Criteria: COMPLETE
- [ ] Constitution Compliance: PASS
- [ ] Dependencies: DOCUMENTED
- [ ] Risks: IDENTIFIED
- [ ] Assumptions: DOCUMENTED
- [ ] Out of Scope: DEFINED

## Handoff Readiness

[ ] Ready for CTO review
[ ] PM Agent signature: ________________
[ ] Date: ________________
```

---

## 8. Enhanced PM Agent State

### 8.1 State Schema

```python
class PMState:
    # Input
    raw_request: str
    source: str  # "user", "stakeholder", "bug_report"
    
    # Analysis Phase
    business_context: str
    actors: List[str]
    existing_features: List[str]
    
    # Clarification Phase
    ambiguities: List[str]
    clarifying_questions: List[str]
    stakeholder_answers: Dict[str, str]
    
    # Compliance Phase
    constitution_issues: List[str]
    compliance_status: str  # "PASS", "FAIL", "WARNING"
    
    # Creation Phase
    user_stories: List[UserStory]
    acceptance_criteria: List[AcceptanceCriteria]
    
    # Quality Phase
    quality_issues: List[str]
    quality_status: str  # "PASS", "FAIL"
    
    # Output
    handoff_document: str
    compliance_report: str
```

### 8.2 Transition Rules

| Current State | Event | Next State |
|---------------|-------|------------|
| INPUT_RECEIVED | Parse complete | ANALYSIS |
| ANALYSIS | Analysis complete | CLARIFICATION or COMPLIANCE_CHECK |
| CLARIFICATION | Questions answered | COMPLIANCE_CHECK |
| COMPLIANCE_CHECK | Compliance FAIL | REJECTION |
| COMPLIANCE_CHECK | Compliance PASS | STORY_CREATION |
| STORY_CREATION | Stories complete | AC_DEFINITION |
| AC_DEFINITION | AC complete | QUALITY_GATE |
| QUALITY_GATE | Quality FAIL | STORY_CREATION (revisit) |
| QUALITY_GATE | Quality PASS | CTO_HANDOFF |
| CTO_HANDOFF | Handoff sent | COMPLETE |

---

## 9. Metrics & KPIs

### 9.1 PM Agent Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Ambiguity Detection Rate** | >90% | % ambiguous requirements caught |
| **Rejection Accuracy** | >95% | Rejections validated by CTO |
| **Handoff Completeness** | 100% | Checklist completion rate |
| **Constitution Violation Caught** | 100% | Security violations escaped |
| **Rework Rate** | <10% | Stories/AC requiring major revision |
| **User Satisfaction** | >4/5 | Stakeholder feedback |

### 9.2 Quality Metrics

| Metric | Target |
|--------|--------|
| Requirements traceable | 100% |
| AC testable | 100% |
| Constitution compliant | 100% |
| Undefined assumptions | 0 |

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Enable LLM in PM Agent
- [ ] Implement Input Reception Phase
- [ ] Implement Analysis Phase

### Phase 2: Quality (Week 2)
- [ ] Implement Clarification Phase
- [ ] Implement Constitution Check
- [ ] Implement Rejection Logic

### Phase 3: Output (Week 3)
- [ ] Implement User Story Creation
- [ ] Implement Acceptance Criteria Definition
- [ ] Implement Quality Gate

### Phase 4: Integration (Week 4)
- [ ] Implement CTO Handoff Document
- [ ] Integration with CTO Agent
- [ ] Testing and validation

---

## 11. Integration with Existing Agents

### 11.1 PM-CTO Handoff

```
┌─────────────────────────────────────────────┐
│              PM AGENT                        │
│                                             │
│  Output: CTO Handoff Document                │
│  Contains:                                  │
│  - Business Context                          │
│  - User Stories                             │
│  - Acceptance Criteria                      │
│  - Technical Considerations (from PM view)   │
│  - Dependencies                             │
│  - Risks                                    │
│  - Compliance Statement                      │
└─────────────────────┬───────────────────────┘
                      │
                      │ JSON/Markdown
                      ▼
┌─────────────────────────────────────────────┐
│              CTO AGENT                       │
│                                             │
│  Input: PM Handoff Document                 │
│  Responsibility:                            │
│  - Technical Architecture Design             │
│  - Component Breakdown                      │
│  - Database Schema                          │
│  - API Design                               │
└─────────────────────────────────────────────┘
```

### 11.2 PM-Developer Handoff

```
┌─────────────────────────────────────────────┐
│              PM AGENT                        │
│                                             │
│  Output: Developer Package                   │
│  Contains:                                  │
│  - User Stories (for context)               │
│  - Acceptance Criteria (for testing)        │
│  - Wireframes/Layouts (if any)              │
│  - Edge Cases (from risk analysis)          │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           DEVELOPER AGENT                    │
│                                             │
│  Input: PM Package + CTO Design              │
│  Responsibility:                            │
│  - Implementation                           │
│  - Constitution Compliance (self-check)      │
│  - Code Review                              │
└─────────────────────────────────────────────┘
```

---

## Appendix A: Constitution Rules Reference

**Mandatory Rules for PM Agent to Enforce:**

| ID | Rule | Why Critical |
|----|------|--------------|
| EC-001 | Next.js 15 App Router | Core tech stack |
| EC-002 | Layer separation | Architecture integrity |
| EC-010 | "use server" directive | Security boundary |
| EC-011 | Auth check | Security |
| EC-012 | Permission check | Authorization |
| EC-014 | Zod validation | Input security |
| EC-017 | NextAuth v5 + JWT | Auth consistency |
| EC-019 | Middleware protection | Route security |

**PM Agent Authority:**
- PM Agent dapat MENOLAK requirement yang melanggar rules di atas
- PM Agent dapat MEMPERINGATKAN untuk rules non-mandatory
- PM Agent tidak dapat mengubah Engineering Constitution

---

*Document ini adalah desain upgrade untuk PM Agent. Implementasi memerlukan update pada AI Company Framework.*
