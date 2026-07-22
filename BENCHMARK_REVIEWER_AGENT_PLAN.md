# Benchmark Reviewer Agent Plan

**Version:** 1.0  
**Date:** 21 Juli 2026  
**Reference:** Engineering Constitution v1.0, PM Agent Upgrade Plan, CTO Agent Upgrade Plan, Developer Agent Upgrade Plan, Design Critic Agent Plan  
**Target:** Benchmark Reviewer Agent  

---

## Executive Summary

Benchmark Reviewer Agent adalah reviewer terakhir sebelum sebuah fitur dinyatakan selesai dan siap di-merge. Agent ini membandingkan hasil implementasi dengan:

- Standar software profesional
- Engineering Constitution
- Repository Convention
- Best practices industry

Agent ini bertanggung jawab memberikan keputusan final PASS/WARNING/FAIL dan menentukan apakah fitur layak di-merge atau harus dikembalikan ke Developer.

---

## 1. Purpose & Positioning

### 1.1 Agent Position in Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                    AI COMPANY WORKFLOW                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PM Agent ──► CTO Agent ──► Developer Agent ──► Design Critic ──►│
│                                                                    │
│                                                                   ► BENCHMARK
│                                                                   │ REVIEWER
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      FINAL REVIEW                             │   │
│  │                                                                  │   │
│  │  • Compare with professional standards                         │   │
│  │  • Verify Constitution compliance                              │   │
│  │  • Check repository consistency                               │   │
│  │  • Assess architecture quality                                │   │
│  │  • Identify technical debt                                    │   │
│  │  • Make merge/no-merge decision                               │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                   │
│                                              ┌─────────────┐       │
│                                              │   HUMAN    │       │
│                                              │   REVIEW   │       │
│                                              └─────────────┘       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Role Definition

| Aspect | Description |
|--------|-------------|
| **Primary Role** | Final Quality Gate |
| **Trigger** | After Design Critic completes review |
| **Authority** | Final PASS/WARNING/FAIL decision |
| **Decision** | Merge approval or return to Developer |
| **Scope** | Full implementation review |

---

## 2. Responsibilities

### 2.1 Core Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **BR-01** | Professional Standards Comparison | Bandingkan dengan standar software professional |
| **BR-02** | Constitution Compliance Verification | Verifikasi kepatuhan Engineering Constitution |
| **BR-03** | Repository Convention Check | Pastikan konsistensi dengan pola repository |
| **BR-04** | Architecture Quality Assessment | Nilai kualitas arsitektur |
| **BR-05** | Readability Assessment | Nilai readability kode |
| **BR-06** | Maintainability Assessment | Nilai maintainability |
| **BR-07** | Scalability Assessment | Nilai scalability design |
| **BR-08** | Consistency Assessment | Nilai konsistensi keseluruhan |
| **BR-09** | Technical Debt Identification | Identifikasi technical debt |
| **BR-10** | Duplicate Logic Detection | Deteksi duplicate code/logic |
| **BR-11** | Over/Under Engineering Detection | Deteksi over atau under engineering |
| **BR-12** | Merge Decision | Putuskan layak merge atau tidak |
| **BR-13** | Feedback Provision | Berikan feedback untuk improvement |

### 2.2 Extended Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **BR-14** | Performance Assessment | Nilai performance implications |
| **BR-15** | Security Assessment | Verifikasi security compliance |
| **BR-16** | Test Coverage Assessment | Nilai test coverage |
| **BR-17** | Documentation Review | Verifikasi dokumentasi |
| **BR-18** | Dependency Analysis | Analisis dependency health |

---

## 3. Benchmark Standards

### 3.1 Professional Software Standards

| Category | Standard | Target |
|----------|----------|--------|
| **Code Quality** | Clean Code principles | Adhered |
| **Architecture** | SOLID principles | Mostly adhered |
| **Patterns** | Industry-accepted patterns | Used appropriately |
| **Documentation** | Self-documenting code | < 10% comments needed |
| **Testing** | Test coverage | > 70% critical paths |

### 3.2 Code Quality Metrics

| Metric | Good | Acceptable | Poor |
|--------|-------|------------|------|
| **Cyclomatic Complexity** | < 10 | 10-15 | > 15 |
| **Function Length** | < 30 lines | 30-50 lines | > 50 lines |
| **File Length** | < 300 lines | 300-500 lines | > 500 lines |
| **Coupling** | Low | Medium | High |
| **Cohesion** | High | Medium | Low |

### 3.3 Architecture Metrics

| Metric | Good | Acceptable | Poor |
|--------|-------|------------|------|
| **Component Size** | Single responsibility | Multiple responsibilities | God components |
| **Layer Separation** | Clear boundaries | Some bleeding | No separation |
| **Dependency Direction** | Points inward | Some violations | All over |
| **Abstraction Level** | Consistent | Some inconsistency | Inconsistent |

---

## 4. Workflow

### 4.1 Benchmark Reviewer Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│              BENCHMARK REVIEWER WORKFLOW                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐    │
│  │   INPUT     │────►│   PARSE    │────►│    CONSTITUTION │    │
│  │  COLLECTION │     │   PHASE    │     │     CHECK       │    │
│  └─────────────┘     └──────┬──────┘     └────────┬────────┘    │
│                               │                     │              │
│                               ▼                     ▼              │
│                      ┌─────────────┐       ┌─────────────┐       │
│                      │  CODEBASE   │       │   PASS?     │       │
│                      │   ANALYSIS   │       │             │       │
│                      └──────┬──────┘       └──────┬──────┘       │
│                             │                     │                │
│                             │            ┌────────┴────────┐      │
│                             │            │                  │       │
│                             │            ▼                  ▼       │
│                             │     ┌──────────┐      ┌──────────┐  │
│                             │     │   PASS   │      │   FAIL   │  │
│                             │     └────┬─────┘      └────┬─────┘  │
│                             │          │                   │        │
│                             │          ▼                   ▼        │
│                             │   ┌─────────────┐  ┌────────────┐  │
│                             │   │  QUALITY    │  │   FLAG &   │  │
│                             │   │  METRICS    │  │   CONTINUE │  │
│                             │   └──────┬─────┘  └────────────┘  │
│                             │          │                            │
│                             │          ▼                            │
│                             │   ┌─────────────┐                    │
│                             │   │ ARCHITECTURE│                    │
│                             │   │  ASSESSMENT │                    │
│                             │   └──────┬─────┘                    │
│                             │          │                            │
│                             │          ▼                            │
│                             │   ┌─────────────┐                    │
│                             │   │TECHNICAL DEBT│                    │
│                             │   │ IDENTIFICATION│                    │
│                             │   └──────┬─────┘                    │
│                             │          │                            │
│                             │          ▼                            │
│                             │   ┌─────────────┐                    │
│                             │   │ CONSISTENCY │                    │
│                             │   │  CHECK      │                    │
│                             │   └──────┬─────┘                    │
│                             │          │                            │
│                             │          ▼                            │
│                             │   ┌─────────────┐                    │
│                             │   │   DECISION  │                    │
│                             │   │   GATE      │                    │
│                             │   └──────┬─────┘                    │
│                             │          │                            │
│                             │   ┌──────┴──────┐                    │
│                             │   │             │                     │
│                             │   ▼             ▼                     │
│                             │ ┌────────┐  ┌────────┐            │
│                             │ │  PASS  │  │WARNING/│            │
│                             │ │        │  │  FAIL  │            │
│                             │ └───┬────┘  └───┬────┘            │
│                             │     │            │                   │
│                             │     ▼            ▼                   │
│                             │ ┌─────────────┐  ┌────────────┐  │
│                             │ │   MERGE    │  │  DETAILED  │  │
│                             │ │  APPROVAL │  │  FEEDBACK  │  │
│                             │ └─────────────┘  └────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Phase Details

#### Phase 1: Input Collection
**Trigger:** Design Critic review complete

**Actions:**
1. Collect all review inputs:
   - Developer implementation
   - Design Critic report
   - CTO handoff document
   - PM requirements

2. Analyze scope:
   - Files changed
   - Features implemented
   - Tests added
   - Documentation updated

3. Identify context:
   - Related features
   - Dependencies
   - Breaking changes

**Output:** Review Scope Document

---

#### Phase 2: Constitution Check
**Trigger:** Input collection complete

**Actions:**
1. Verify all mandatory rules:
   - EC-010: "use server" directive
   - EC-011: Auth check
   - EC-012: Permission check
   - EC-013: revalidatePath()
   - EC-014: Zod validation
   - EC-015, EC-016: Prisma singleton
   - EC-017: NextAuth v5 + JWT
   - EC-019: Middleware protection
   - EC-020: Server Components
   - EC-021: Client Components

2. Check recommended rules:
   - EC-009: Type exports
   - EC-022: Props from server
   - EC-023: Error boundaries
   - EC-025: Env validation

**Output:** Constitution Compliance Report

---

#### Phase 3: Codebase Analysis
**Trigger:** Constitution check complete

**Actions:**
1. Static analysis:
   - File structure
   - Component organization
   - Import patterns
   - Export patterns

2. Code metrics:
   - Function lengths
   - File sizes
   - Complexity scores
   - Line counts

3. Pattern analysis:
   - Server/Client split
   - Server Action patterns
   - Database access patterns

**Output:** Codebase Analysis Report

---

#### Phase 4: Architecture Assessment
**Trigger:** Codebase analysis complete

**Actions:**
1. Architecture review:
   - Layer separation
   - Component responsibilities
   - Dependency direction
   - Coupling analysis

2. Design patterns:
   - Pattern usage
   - Pattern appropriateness
   - Pattern violations

3. Scalability:
   - Horizontal scalability potential
   - Vertical scalability considerations
   - Performance bottlenecks

**Output:** Architecture Assessment Report

---

#### Phase 5: Technical Debt Identification
**Trigger:** Architecture assessment complete

**Actions:**
1. Identify debt categories:
   - Code complexity debt
   - Documentation debt
   - Test debt
   - Dependency debt
   - Design debt

2. Assess severity:
   - High: Must fix before merge
   - Medium: Should fix soon
   - Low: Can defer

3. Estimate impact:
   - Development velocity impact
   - Maintenance cost
   - Risk level

**Output:** Technical Debt Register

---

#### Phase 6: Consistency Check
**Trigger:** Technical debt identified

**Actions:**
1. Repository consistency:
   - Naming conventions
   - Pattern usage
   - Style consistency

2. Feature consistency:
   - UI patterns match
   - API patterns match
   - Error handling match

3. Documentation consistency:
   - Comment style
   - README updates
   - API documentation

**Output:** Consistency Report

---

#### Phase 7: Decision Gate
**Trigger:** All assessments complete

**Actions:**
1. Aggregate findings:
   - Critical issues
   - Major issues
   - Minor issues
   - Positive findings

2. Calculate scores:
   - Overall quality score
   - Compliance score
   - Consistency score

3. Make decision:
   - PASS: Ready for merge
   - WARNING: Merge with notes
   - FAIL: Return to Developer

**Output:** Decision Report

---

#### Phase 8: Merge Approval & Feedback
**Trigger:** Decision made

**Actions:**
1. If PASS:
   - Generate merge approval
   - Create merge checklist
   - Document for record

2. If WARNING:
   - Document concerns
   - Define conditions for merge
   - Set follow-up tasks

3. If FAIL:
   - Detailed feedback report
   - Required changes list
   - Return to Developer

**Output:** Final Review Report

---

## 5. Input Specification

### 5.1 Required Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **Implementation Files** | Developer | All created/modified files |
| **Design Critic Report** | Design Critic | UI/UX review results |
| **CTO Handoff** | CTO Agent | Architecture design, tasks |
| **PM Requirements** | PM Agent | User stories, AC |
| **Engineering Constitution** | Constitution Doc | Rules to verify |
| **Repository Baseline** | Repository | Existing patterns |

### 5.2 Optional Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **Test Files** | Developer | Unit/integration tests |
| **Performance Metrics** | Dev/PM | Performance data |
| **Security Scan** | Tool | Security findings |

---

## 6. Output Specification

### 6.1 Final Review Report Structure

```markdown
# Final Review Report

## Review Summary
- **Feature:** [Feature name]
- **Reviewer:** Benchmark Reviewer Agent
- **Date:** [Date]
- **Files Reviewed:** [Count]
- **Overall Status:** [PASS / WARNING / FAIL]

## Executive Verdict
[2-3 sentence summary]

## Constitution Compliance
### Score: [X/10]
### Mandatory Rules
| Rule | Status | Notes |
|------|--------|-------|
| EC-010 | ✅/❌ | [notes] |
| EC-011 | ✅/❌ | [notes] |
| ... | ... | ... |

### Recommended Rules
| Rule | Status | Notes |
|------|--------|-------|
| EC-009 | ✅/⚠️ | [notes] |
| ... | ... | ... |

## Quality Metrics
### Code Quality
| Metric | Score | Assessment |
|--------|-------|------------|
| Complexity | [X/10] | [Good/Acceptable/Poor] |
| Readability | [X/10] | [Good/Acceptable/Poor] |
| Maintainability | [X/10] | [Good/Acceptable/Poor] |

### Architecture Quality
| Metric | Score | Assessment |
|--------|-------|------------|
| Layer Separation | [X/10] | [Good/Acceptable/Poor] |
| Component Design | [X/10] | [Good/Acceptable/Poor] |
| Scalability | [X/10] | [Good/Acceptable/Poor] |

### Overall Quality Score: [X/10]

## Repository Consistency
### Score: [X/10]
- Naming conventions: [Consistent/Issues]
- Pattern usage: [Consistent/Issues]
- Style consistency: [Consistent/Issues]

## Technical Debt
### Critical (Must Fix)
| Item | Location | Impact | Fix Effort |
|------|----------|--------|------------|
| [item] | [file] | [impact] | [effort] |

### Major (Should Fix)
| Item | Location | Impact | Fix Effort |
|------|----------|--------|------------|
| [item] | [file] | [impact] | [effort] |

### Minor (Can Defer)
| Item | Location | Impact | Fix Effort |
|------|----------|--------|------------|
| [item] | [file] | [impact] | [effort] |

**Total Technical Debt:** [H/M/L]
**Debt-to-Value Ratio:** [X:1]

## Issues Analysis
### Critical Issues: [Count]
1. [Issue] - [Impact]
2. [Issue] - [Impact]

### Major Issues: [Count]
1. [Issue]
2. [Issue]

### Minor Issues: [Count]
1. [Issue]
2. [Issue]

## Positive Findings
1. [Positive aspect]
2. [Positive aspect]

## Merge Decision

### Decision: [APPROVED / APPROVED WITH CONDITIONS / REJECTED]

### If APPROVED:
- Merge checklist:
  - [ ] All AC met
  - [ ] Tests passing
  - [ ] Documentation updated
  - [ ] No breaking changes

### If APPROVED WITH CONDITIONS:
- Conditions:
  - [Condition 1]
  - [Condition 2]
- Follow-up tasks:
  - [Task 1]
  - [Task 2]

### If REJECTED:
- Required changes:
  1. [Change 1]
  2. [Change 2]
- Estimated rework time: [X hours]

## Detailed Feedback

### For Developer
[Specific feedback with file references]

### For Future Reference
[Lessons learned, patterns to establish]

## Signature
- Benchmark Reviewer: ________________
- Date: ________________
- Decision: ________________
```

---

## 7. Decision Points

### 7.1 Decision Tree

```
┌─────────────────────────────────────┐
│        REVIEW INITIATED                  │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Constitution     │
         │ Compliant?       │
         └────────┬────────┘
                  │
       ┌──────────┴──────────┐
       │Yes                     │No
       ▼                        ▼
┌─────────────┐    ┌─────────────────┐
│ Continue     │    │    FAIL        │
│ Assessment   │    │  Return to Dev │
└──────┬──────┘    └─────────────────┘
       │
       ▼
┌─────────────────┐
│ Quality Metrics  │
│ Acceptable?     │
└────────┬────────┘
         │
    ┌────┴────┐
    │Yes         │No
    ▼            ▼
┌────────┐ ┌────────┐
│Continue│ │ WARNING│
│Review  │ │ Continue│
└───┬────┘ └────────┘
    │
    ▼
┌─────────────────┐
│ Architecture    │
│ Sound?          │
└────────┬────────┘
         │
    ┌────┴────┐
    │Yes         │No
    ▼            ▼
┌────────┐ ┌────────┐
│Continue│ │ WARNING│
│Review  │ │ Continue│
└───┬────┘ └────────┘
    │
    ▼
┌─────────────────┐
│ Tech Debt       │
│ Critical?       │
└────────┬────────┘
         │
    ┌────┴────┐
    │No         │Yes
    ▼            ▼
┌────────┐ ┌────────┐
│Continue│ │  FAIL  │
│Review  │ │Return  │
└───┬────┘ │to Dev  │
    │       └────────┘
    ▼
┌─────────────────┐
│ Consistency    │
│ Issues?        │
└────────┬────────┘
         │
    ┌────┴────┐
    │No         │Yes (Major)
    ▼            ▼
┌────────┐ ┌────────┐
│  PASS  │ │WARNING │
│        │ │Continue│
└────────┘ └────────┘
```

### 7.2 PASS Criteria

Review PASS (Layak Merge) jika:

| Criteria | Requirement |
|----------|-------------|
| **Constitution Compliance** | 100% mandatory rules |
| **Critical Issues** | 0 |
| **Major Issues** | 0 |
| **Technical Debt (Critical)** | 0 |
| **Architecture** | Sound (≥ 8/10) |
| **Code Quality** | Acceptable (≥ 7/10) |
| **Consistency** | ≥ 8/10 |

### 7.3 WARNING Criteria

Review WARNING (Merge dengan Catatan) jika:

| Criteria | Requirement |
|----------|-------------|
| **Constitution Compliance** | 100% mandatory, < 50% recommended |
| **Critical Issues** | 0 |
| **Major Issues** | ≤ 2 |
| **Technical Debt (Critical)** | 0 |
| **Technical Debt (Major)** | ≤ 3 |
| **Architecture** | Acceptable (≥ 6/10) |
| **Code Quality** | Acceptable (≥ 6/10) |

### 7.4 FAIL Criteria

Review FAIL (Tidak Layak Merge) jika:

| Criteria | Requirement |
|----------|-------------|
| **Constitution Compliance** | < 100% mandatory rules |
| **Critical Issues** | ≥ 1 |
| **Major Issues** | > 2 |
| **Technical Debt (Critical)** | ≥ 1 |
| **Architecture** | Poor (< 6/10) |
| **Code Quality** | Poor (< 6/10) |
| **Security Vulnerability** | Any unfixed |
| **Broken Functionality** | Any |

---

## 8. Review Checklist

### 8.1 Constitution Compliance Checklist

```
## Constitution Compliance Checklist

### Mandatory Rules (Must Pass)
- [ ] EC-010: "use server" in all Server Actions
- [ ] EC-011: auth() check in all Server Actions
- [ ] EC-012: hasPermission() in all mutations
- [ ] EC-013: revalidatePath() after all mutations
- [ ] EC-014: Zod validation on all inputs
- [ ] EC-015: Prisma singleton in lib/db.ts
- [ ] EC-016: db export from lib/db.ts
- [ ] EC-017: NextAuth v5 + JWT strategy
- [ ] EC-019: Middleware protection active
- [ ] EC-020: Server Components for data fetch
- [ ] EC-021: Client Components with "use client"

### Recommended Rules (Should Follow)
- [ ] EC-009: Type exports from Zod schemas
- [ ] EC-022: Props from Server to Client
- [ ] EC-023: Error boundaries implemented
- [ ] EC-025: Env var validation
```

### 8.2 Code Quality Checklist

```
## Code Quality Checklist

### Complexity
- [ ] No function > 50 lines
- [ ] No file > 500 lines
- [ ] Cyclomatic complexity < 15
- [ ] No deeply nested code (> 4 levels)

### Naming
- [ ] Descriptive variable names
- [ ] Consistent naming convention
- [ ] No single-letter variables (except loops)
- [ ] Boolean variables use is/has/can prefix

### Structure
- [ ] Single responsibility per function
- [ ] DRY principle followed
- [ ] No commented-out code
- [ ] No TODO without description

### Error Handling
- [ ] All async operations in try-catch
- [ ] Meaningful error messages
- [ ] Graceful degradation
- [ ] No silent failures
```

### 8.3 Architecture Checklist

```
## Architecture Checklist

### Layer Separation
- [ ] Presentation in components/
- [ ] Business logic in lib/actions/
- [ ] Data access through Prisma only

### Component Design
- [ ] Server vs Client split correct
- [ ] Components single-responsibility
- [ ] Props interfaces defined
- [ ] No prop drilling > 2 levels

### Database
- [ ] Singleton pattern used
- [ ] Queries optimized
- [ ] Indexes on query fields
- [ ] No raw SQL (Prisma only)
```

### 8.4 Consistency Checklist

```
## Consistency Checklist

### Naming Patterns
- [ ] Files: kebab-case
- [ ] Components: PascalCase
- [ ] Functions: camelCase
- [ ] Constants: SCREAMING_SNAKE

### Import Patterns
- [ ] @/ alias used
- [ ] Relative imports avoided
- [ ] Type imports separated

### Style
- [ ] Tailwind classes sorted
- [ ] Consistent quote usage
- [ ] Consistent semicolon usage
- [ ] Prettier config followed
```

### 8.5 Security Checklist

```
## Security Checklist

### Authentication
- [ ] All protected routes check auth
- [ ] No exposed sensitive data

### Authorization
- [ ] Permission checks on mutations
- [ ] Role-based access enforced

### Input
- [ ] All inputs validated
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React)

### Data
- [ ] No secrets in code
- [ ] Passwords hashed
- [ ] Sensitive data masked
```

### 8.6 Testing Checklist

```
## Testing Checklist

### Coverage
- [ ] Server Actions tested
- [ ] Utility functions tested
- [ ] Complex logic tested

### Quality
- [ ] Tests are independent
- [ ] Tests are deterministic
- [ ] Tests are readable

### Results
- [ ] All tests passing
- [ ] No skipped tests (without reason)
- [ ] No console errors
```

---

## 9. Metrics & KPIs

### 9.1 Review Quality Metrics

| Metric | Target | Measurement |
|--------|--------|------------|
| **Critical Issues Detection** | 100% | Critical issues caught / total |
| **False Positive Rate** | < 10% | Invalid issues flagged |
| **Decision Accuracy** | > 90% | Decisions validated by humans |
| **Consistency** | > 95% | Same issue = same rating |
| **Coverage** | 100% | All files reviewed |

### 9.2 Quality Thresholds

| Category | Pass | Warning | Fail |
|----------|------|---------|------|
| Constitution Compliance | 100% | 100% mandatory | < 100% mandatory |
| Quality Score | ≥ 8/10 | 6-7.9/10 | < 6/10 |
| Architecture Score | ≥ 8/10 | 6-7.9/10 | < 6/10 |
| Consistency | ≥ 8/10 | 6-7.9/10 | < 6/10 |
| Critical Issues | 0 | 0 | ≥ 1 |

---

## 10. Merge Approval Workflow

### 10.1 Merge Approval Process

```
┌─────────────────────────────────────────────┐
│         BENCHMARK REVIEW PASSED                 │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         GENERATE MERGE CHECKLIST              │
│                                              │
│  □ Constitution 100% compliant              │
│  □ All critical issues resolved             │
│  □ Tests passing                           │
│  □ Documentation updated                    │
│  □ No breaking changes (or documented)      │
│  □ Security scan clean                     │
│  □ Performance acceptable                   │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         EXECUTE MERGE CHECKLIST               │
│                                              │
│  [ ] All items checked                     │
│  [ ] Sign-off from Benchmark Reviewer        │
│  [ ] Sign-off from Human Reviewer (if req) │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         APPROVE MERGE                        │
│                                              │
│  Status: APPROVED                          │
│  Timestamp: [Date/Time]                    │
│  Reviewer: Benchmark Reviewer Agent        │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         NOTIFY STAKEHOLDERS                  │
│                                              │
│  - Developer: Merge approved                │
│  - PM: Feature ready                       │
│  - CI/CD: Ready for deployment             │
└─────────────────────────────────────────────┘
```

### 10.2 Merge Rejection Process

```
┌─────────────────────────────────────────────┐
│         BENCHMARK REVIEW FAILED               │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         GENERATE DETAILED FEEDBACK           │
│                                              │
│  - List all issues                          │
│  - Categorize by severity                   │
│  - Provide specific fixes                   │
│  - Estimate rework time                     │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         RETURN TO DEVELOPER                  │
│                                              │
│  Status: REJECTED                           │
│  Required changes documented                │
│  Estimated rework: [X hours]               │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         DEVELOPER FIXES                       │
│                                              │
│  [ ] Address critical issues                │
│  [ ] Address major issues                   │
│  [ ] Re-run self-review                    │
│  [ ] Re-submit for review                  │
└─────────────────────────────────────────────┘
```

---

## 11. Integration with Workflow

### 11.1 Final Quality Gate

```
┌─────────────────────────────────────────────────────┐
│                  REVIEW PIPELINE                        │
├─────────────────────────────────────────────────────┤
│                                                       │
│  1. Developer Self-Review                            │
│     └── Self-review checklist                       │
│                                                       │
│  2. Design Critic Review                            │
│     └── UI/UX compliance                           │
│     └── Design system check                         │
│                                                       │
│  3. Benchmark Reviewer (FINAL)                       │
│     └── Constitution compliance                       │
│     └── Architecture quality                          │
│     └── Code quality                                 │
│     └── Technical debt                               │
│     └── Merge decision                               │
│                                                       │
│  4. Human Review (spot-check)                       │
│     └── Spot-check critical features                 │
│     └── Final approval for major releases            │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Appendix A: Issue Severity Definitions

### A.1 Critical Issues

| Issue | Definition | Examples |
|-------|------------|----------|
| **Security** | Vulnerability that exposes data/systems | SQL injection, XSS, exposed secrets |
| **Functionality** | Feature doesn't work as specified | Broken CRUD, wrong calculations |
| **Architecture** | Fundamental design flaw | Circular dependencies, god components |
| **Constitution** | Violation of mandatory rule | Missing auth check, no "use server" |

### A.2 Major Issues

| Issue | Definition | Examples |
|-------|------------|----------|
| **Code Quality** | Makes code hard to maintain | Functions > 100 lines, deep nesting |
| **Performance** | Causes noticeable slowdown | N+1 queries, no pagination |
| **Consistency** | Inconsistent with codebase | Wrong naming, different patterns |
| **Maintainability** | Will cause future problems | Duplicated logic, magic values |

### A.3 Minor Issues

| Issue | Definition | Examples |
|-------|------------|----------|
| **Style** | Cosmetic/style differences | Slightly different formatting |
| **Documentation** | Missing/non-critical docs | Undocumented helper function |
| **Complexity** | Could be simpler | Overly clever solution |

---

## Appendix B: Review Score Calculation

### B.1 Overall Score Formula

```
Overall Score = (
  Constitution Score × 0.25 +
  Code Quality Score × 0.20 +
  Architecture Score × 0.20 +
  Consistency Score × 0.15 +
  Maintainability Score × 0.10 +
  Test Coverage Score × 0.10
)
```

### B.2 Score Weights

| Component | Weight | Description |
|-----------|--------|-------------|
| Constitution | 25% | Critical for compliance |
| Code Quality | 20% | Day-to-day maintainability |
| Architecture | 20% | Long-term structure |
| Consistency | 15% | Team productivity |
| Maintainability | 10% | Technical debt prevention |
| Test Coverage | 10% | Regression prevention |

---

*Document ini adalah desain untuk Benchmark Reviewer Agent. Implementasi memerlukan update pada AI Company Framework.*
