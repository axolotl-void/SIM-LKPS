# AI Company Implementation Roadmap

**Version:** 1.0  
**Date:** 21 Juli 2026  
**Reference:** All Agent Plans, Engineering Constitution, Compliance Workflow  
**Purpose:** Implementation guide for AI Company Framework  

---

## Executive Summary

Dokumen ini menjelaskan urutan implementasi AI Company Framework secara aman, dimulai dari komponen dasar hingga integrasi penuh. Implementasi mengikuti pendekatan **iteratif dan inkremental** dengan validasi di setiap tahap.

**Total Estimasi:** ~12-16 minggu (dengan 1 AI Engineer)  
**Approach:** Incremental dengan early validation

---

## 1. Implementation Overview

### 1.1 Dependencies Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY GRAPH                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Stage 1          Stage 2           Stage 3           Stage 4       │
│  ┌───────┐       ┌───────┐        ┌───────┐        ┌───────┐    │
│  │ LLM   │──────►│ PM    │───────►│ CTO   │───────►│ Dev   │    │
│  │ Config │       │ Agent │        │ Agent │        │ Agent │    │
│  └───────┘       └───────┘        └───────┘        └───────┘    │
│       │                                                    │         │
│       │              Stage 5           Stage 6           │         │
│       │              ┌───────┐        ┌───────┐         │         │
│       └────────────►│Design │────────►│Bench- │         │         │
│                      │Critic │        │mark   │         │         │
│                      └───────┘        │Review │─────────┘         │
│                                        │er    │                   │
│                                        └───────┘                   │
│                                                                      │
│  Stage 0: Foundation (selalu aktif)                                │
│  ┌───────────────────────────────────────────────────────────┐      │
│  │ Constitution, Workflow, State Schema, Logging, Testing   │      │
│  └───────────────────────────────────────────────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Implementation Phases

### 2.1 Phase 0: Foundation (Week 1-2)

**Tujuan:** Siapkan infrastruktur dasar yang dibutuhkan seluruh agent.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **State Schema** | Definisi state untuk seluruh agent | `state/company.py` |
| **Constitution Loader** | Load dan validate Constitution rules | `lib/constitution.py` |
| **Compliance Checker** | Utility untuk compliance check | `lib/compliance.py` |
| **Logger** | Structured logging | `shared/logger.py` |
| **Test Harness** | Base test infrastructure | `tests/` |

#### Implementation Tasks

- [ ] Extend `CompanyState` dengan field baru sesuai agent plans
- [ ] Implement `ConstitutionLoader` class
- [ ] Implement `ComplianceChecker` utility functions
- [ ] Implement `RuleValidator` untuk setiap category
- [ ] Set up structured logging
- [ ] Create test harness dengan fixtures

#### Definition of Done

- [ ] `CompanyState` mendukung semua agent states
- [ ] Constitution rules dapat di-load dan di-query
- [ ] Compliance checker dapat validasi semua 25 rules
- [ ] Logging berjalan dengan structured format
- [ ] Unit tests untuk core utilities pass

#### Complexity: **Medium**  
#### Risk: **Low** (foundation, tidak breaking change)

---

### 2.2 Phase 1: LLM Configuration (Week 2-3)

**Tujuan:** Aktifkan real LLM connection dengan proper fallback.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **LLM Router** | Enhanced routing dengan retry logic | `configs/llm.py` |
| **Response Validator** | Validate LLM responses | `lib/llm_validator.py` |
| **Mock Enhancer** | Improved mock responses | `configs/mock_responses.py` |

#### Implementation Tasks

- [ ] Enhance `get_llm()` dengan retry dan timeout logic
- [ ] Implement response format validation
- [ ] Create structured prompt templates
- [ ] Improve mock responses untuk setiap agent
- [ ] Add monitoring untuk LLM usage
- [ ] Implement cost tracking

#### Definition of Done

- [ ] Real LLM connect dengan timeout handling
- [ ] Fallback ke mock jika LLM unavailable
- [ ] Response validation aktif
- [ ] Monitoring dashboard tersedia
- [ ] Mock mode menghasilkan reasonable responses

#### Complexity: **Medium**  
#### Risk: **Medium** (external dependency)

---

### 2.3 Phase 2: PM Agent Implementation (Week 3-5)

**Tujuan:** Implement PM Agent dengan semua tanggung jawab baru.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **PM Agent Core** | Main agent logic | `agents/pm_agent.py` |
| **Requirement Parser** | Parse raw requirements | `agents/pm/parser.py` |
| **UserStory Generator** | Generate User Stories | `agents/pm/user_story.py` |
| **AcceptanceCriteria Generator** | Generate AC | `agents/pm/ac_generator.py` |
| **Constitution Compliance** | Check compliance | `agents/pm/compliance.py` |
| **Handoff Generator** | Generate CTO handoff | `agents/pm/handoff.py` |

#### Implementation Tasks

- [ ] Refactor `PMAgent` dari BaseAgent
- [ ] Implement 8-phase workflow
- [ ] Implement requirement parsing
- [ ] Implement User Story generator
- [ ] Implement AC generator dengan Gherkin format
- [ ] Implement Constitution compliance check
- [ ] Implement rejection logic
- [ ] Implement CTO handoff generator
- [ ] Unit tests untuk PM Agent

#### Definition of Done

- [ ] PM Agent dapat parse raw requirements
- [ ] User Stories well-formed sesuai template
- [ ] AC testable dan traceable
- [ ] Constitution compliance check berfungsi
- [ ] Rejection notice generated dengan benar
- [ ] CTO handoff document complete
- [ ] Self-review checklist implemented
- [ ] All unit tests pass

#### Complexity: **High**  
#### Risk: **Medium** (complex logic, many decision points)

---

### 2.4 Phase 3: CTO Agent Implementation (Week 5-7)

**Tujuan:** Implement CTO Agent dengan architecture design capabilities.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **CTO Agent Core** | Main agent logic | `agents/cto_agent.py` |
| **PM Validator** | Validate PM handoff | `agents/cto/pm_validator.py` |
| **Architecture Designer** | Design architecture | `agents/cto/architecture.py` |
| **Database Designer** | Design Prisma schema | `agents/cto/database.py` |
| **API Designer** | Design API contracts | `agents/cto/api.py` |
| **Task Breakdown** | Generate tasks | `agents/cto/task_breakdown.py` |
| **Risk Assessor** | Identify risks | `agents/cto/risk.py` |
| **Handoff Generator** | Generate Dev handoff | `agents/cto/handoff.py` |

#### Implementation Tasks

- [ ] Refactor `CTOAgent` dari BaseAgent
- [ ] Implement PM handoff validation
- [ ] Implement Constitution compliance check (technical)
- [ ] Implement architecture designer
- [ ] Implement database schema generator
- [ ] Implement API contract designer
- [ ] Implement task breakdown generator
- [ ] Implement risk assessor
- [ ] Implement Developer handoff generator
- [ ] Unit tests untuk CTO Agent

#### Definition of Done

- [ ] CTO Agent validate PM handoff dengan benar
- [ ] Architecture design scalable dan maintainable
- [ ] Database schema normalized
- [ ] API contracts typed dan consistent
- [ ] Tasks granular (2-4 jam per task)
- [ ] Risks teridentifikasi dengan mitigations
- [ ] Developer handoff complete
- [ ] All unit tests pass

#### Complexity: **High**  
#### Risk: **Medium** (depends on PM Agent)

---

### 2.5 Phase 4: Developer Agent Implementation (Week 7-10)

**Tujuan:** Implement Developer Agent dengan self-review dan compliance.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **Dev Agent Core** | Main agent logic | `agents/developer_agent.py` |
| **Task Analyzer** | Analyze task requirements | `agents/dev/task_analyzer.py` |
| **Code Generator** | Generate implementation | `agents/dev/code_generator.py` |
| **Self Reviewer** | Self-review implementation | `agents/dev/self_reviewer.py` |
| **Compliance Checker** | Check Constitution | `agents/dev/compliance.py` |
| **Test Generator** | Generate tests | `agents/dev/test_generator.py` |
| **Completion Reporter** | Generate report | `agents/dev/completion.py` |

#### Implementation Tasks

- [ ] Refactor `DeveloperAgent` dari BaseAgent
- [ ] Implement task comprehension tanpa asumsi
- [ ] Implement code generator dengan templates
- [ ] Implement self-review dengan checklists
- [ ] Implement Constitution compliance checker
- [ ] Implement unit test generator
- [ ] Implement edge case detector
- [ ] Implement technical debt tracker
- [ ] Implement completion reporter
- [ ] Integration tests

#### Definition of Done

- [ ] Developer memahami handoff tanpa asumsi
- [ ] Code generated sesuai Constitution
- [ ] Self-review checklists complete
- [ ] Compliance check semua 25 rules
- [ ] Unit tests generated untuk critical paths
- [ ] Edge cases teridentifikasi
- [ ] Technical debt terdokumentasi
- [ ] Completion report accurate
- [ ] Integration tests pass

#### Complexity: **High**  
#### Risk: **Medium** (depends on CTO Agent)

---

### 2.6 Phase 5: Design Critic Agent (Week 10-12)

**Tujuan:** Implement Design Critic Agent untuk UI/UX quality.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **DC Agent Core** | Main agent logic | `agents/design_critic_agent.py` |
| **Visual Analyzer** | Analyze visual design | `agents/dc/visual_analyzer.py` |
| **Design System Checker** | Check Soft UI compliance | `agents/dc/design_system.py` |
| **AI Pattern Detector** | Detect generic AI patterns | `agents/dc/ai_detector.py` |
| **Feedback Generator** | Generate feedback | `agents/dc/feedback.py` |

#### Implementation Tasks

- [ ] Create `DesignCriticAgent` class
- [ ] Implement visual analysis engine
- [ ] Implement Soft UI compliance checker
- [ ] Implement AI pattern detector
- [ ] Implement layout analyzer
- [ ] Implement typography analyzer
- [ ] Implement color scheme analyzer
- [ ] Implement responsiveness checker
- [ ] Implement feedback generator
- [ ] Integration dengan workflow

#### Definition of Done

- [ ] Design Critic aktif setelah Developer selesai
- [ ] Soft UI compliance di-validasi
- [ ] AI patterns terdetect
- [ ] PASS/WARNING/FAIL decision works
- [ ] Feedback specific dan actionable
- [ ] Design debt tracked
- [ ] Integration test pass

#### Complexity: **High**  
#### Risk: **Low** (new agent, no dependencies)

---

### 2.7 Phase 6: Benchmark Reviewer Agent (Week 12-14)

**Tujuan:** Implement final quality gate sebelum merge.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **BR Agent Core** | Main agent logic | `agents/benchmark_reviewer_agent.py` |
| **Standards Comparator** | Compare dengan standards | `agents/br/standards.py` |
| **Architecture Reviewer** | Review architecture | `agents/br/architecture.py` |
| **TechDebt Analyzer** | Analyze technical debt | `agents/br/techdebt.py` |
| **Merge Decider** | Make merge decision | `agents/br/merge_decider.py` |

#### Implementation Tasks

- [ ] Create `BenchmarkReviewerAgent` class
- [ ] Implement standards comparator
- [ ] Implement architecture reviewer
- [ ] Implement code quality analyzer
- [ ] Implement tech debt analyzer
- [ ] Implement consistency checker
- [ ] Implement merge decision engine
- [ ] Implement approval workflow
- [ ] Integration dengan git/CI

#### Definition of Done

- [ ] Benchmark Reviewer aktif setelah Design Critic
- [ ] Professional standards comparison works
- [ ] Architecture quality assessed
- [ ] Technical debt teridentifikasi
- [ ] Merge decision PASS/WARNING/FAIL works
- [ ] Merge approval workflow functional
- [ ] Integration dengan CI/CD pipeline

#### Complexity: **High**  
#### Risk: **Medium** (requires CI integration)

---

### 2.8 Phase 7: Workflow Integration (Week 14-16)

**Tujuan:** Integrasikan seluruh agent ke dalam workflow yang coherent.

#### Components

| Component | Description | File |
|-----------|-------------|------|
| **Graph Updater** | Update company graph | `workflows/company_graph.py` |
| **State Manager** | Manage transitions | `workflows/state_manager.py` |
| **Error Handler** | Handle errors gracefully | `workflows/error_handler.py` |
| **Recovery Logic** | Recovery dari failures | `workflows/recovery.py` |

#### Implementation Tasks

- [ ] Update `company_graph.py` dengan new nodes
- [ ] Implement state transitions untuk new agents
- [ ] Implement error handling di setiap node
- [ ] Implement recovery logic
- [ ] Implement rollback mechanism
- [ ] Add monitoring dan metrics
- [ ] End-to-end integration tests
- [ ] Performance optimization

#### Definition of Done

- [ ] Workflow graph include semua agent
- [ ] State transitions correct
- [ ] Error handling graceful
- [ ] Recovery mechanism works
- [ ] Monitoring active
- [ ] E2E tests pass

#### Complexity: **Medium**  
#### Risk: **High** (complex integration)

---

## 3. Implementation Sequence

### 3.1 Safe Implementation Order

```
Urutan implementasi berdasarkan dependency dan risk:

1. PHASE 0: Foundation
   └─> Tidak ada dependencies
   └─> Risk: Low
   
2. PHASE 1: LLM Configuration  
   └─> Depends on: Phase 0
   └─> Risk: Low (fallback exists)
   
3. PHASE 2: PM Agent
   └─> Depends on: Phase 0, 1
   └─> Risk: Medium (complex logic)
   
4. PHASE 3: CTO Agent
   └─> Depends on: Phase 2 (PM output)
   └─> Risk: Medium
   
5. PHASE 4: Developer Agent
   └─> Depends on: Phase 3 (CTO output)
   └─> Risk: Medium
   
6. PHASE 5: Design Critic
   └─> Depends on: Phase 4
   └─> Risk: Low (new agent)
   
7. PHASE 6: Benchmark Reviewer
   └─> Depends on: Phase 4, 5
   └─> Risk: Medium
   
8. PHASE 7: Workflow Integration
   └─> Depends on: Semua phase
   └─> Risk: High
```

### 3.2 Parallelization Opportunities

| Phase | Can Parallelize With | Notes |
|-------|---------------------|-------|
| PM Agent | Foundation, LLM | Independent development |
| CTO Agent | - | Depends on PM |
| Developer Agent | - | Depends on CTO |
| Design Critic | Foundation | Can develop in parallel dengan PM |
| Benchmark Reviewer | - | Depends on Design Critic |

---

## 4. Risk Register

### 4.1 Per-Phase Risks

| Phase | Risk | Likelihood | Impact | Mitigation |
|-------|------|-----------|--------|-----------|
| **0: Foundation** | Breaking existing workflow | Low | High | Incremental changes, backward compat |
| **1: LLM** | LLM unavailable | Medium | Medium | Fallback to mock |
| **2: PM Agent** | Complex decision logic | Medium | Medium | Extensive unit tests |
| **3: CTO Agent** | Depends on PM quality | Medium | High | Validate PM output |
| **4: Dev Agent** | Depends on CTO design | High | High | CTO must be robust |
| **5: Design Critic** | Subjective assessment | Medium | Low | Clear criteria |
| **6: Benchmark** | CI integration complexity | Medium | Medium | CI team involvement |
| **7: Integration** | Breaking existing flow | High | High | Extensive E2E tests |

### 4.2 Cross-Cutting Risks

| Risk | Mitigation |
|------|-----------|
| **Scope creep** | Strict phase boundaries, defer non-critical features |
| **LLM inconsistency** | Response validation, fallback mechanisms |
| **Integration failures** | Incremental integration, early testing |
| **Performance issues** | Monitoring, optimization sprints |

---

## 5. Milestones

### 5.1 Milestone Timeline

```
Week 1-2:   ┌─────────────┐
             │  M0: Foundation Complete  │
             │  State schema, compliance lib  │
             └─────────────┘

Week 3:      ┌─────────────┐
             │  M1: LLM Operational  │
             │  Real LLM + fallback  │
             └─────────────┘

Week 5:      ┌─────────────┐
             │  M2: PM Agent Ready  │
             │  Senior PM capabilities  │
             └─────────────┘

Week 7:      ┌─────────────┐
             │  M3: CTO Agent Ready  │
             │  Senior Architect capabilities  │
             └─────────────┘

Week 10:     ┌─────────────┐
             │  M4: Developer Agent Ready  │
             │  Senior Engineer capabilities  │
             └─────────────┘

Week 12:     ┌─────────────┐
             │  M5: Design Critic Ready  │
             │  UI/UX QA active  │
             └─────────────┘

Week 14:     ┌─────────────┐
             │  M6: Benchmark Reviewer Ready  │
             │  Final quality gate active  │
             └─────────────┘

Week 16:     ┌─────────────────────────────────────┐
             │  M7: AI COMPANY FULLY OPERATIONAL  │
             │  All agents integrated, E2E working  │
             └─────────────────────────────────────┘
```

### 5.2 Milestone Criteria

| Milestone | Criteria |
|-----------|----------|
| **M0** | Foundation tests pass, compliance checker functional |
| **M1** | LLM connects, fallback works, monitoring active |
| **M2** | PM generates User Stories, rejects invalid requirements |
| **M3** | CTO designs architecture, validates PM handoff |
| **M4** | Developer implements, self-reviews, generates tests |
| **M5** | Design Critic reviews UI, detects AI patterns |
| **M6** | Benchmark Reviewer makes merge decisions |
| **M7** | Full workflow operational, E2E tests pass |

---

## 6. Testing Strategy

### 6.1 Test Pyramid

```
        ┌─────────────────────┐
        │   E2E Tests (M7)     │  ← Few, slow, comprehensive
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        │  Integration Tests    │  ← Medium, medium speed
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        │   Unit Tests         │  ← Many, fast, isolated
        └─────────────────────┘
```

### 6.2 Test Coverage Targets

| Component | Unit Test | Integration Test | E2E |
|-----------|-----------|-----------------|-----|
| Foundation | 80% | - | - |
| LLM Config | 70% | 50% | - |
| PM Agent | 75% | 60% | 30% |
| CTO Agent | 75% | 60% | 30% |
| Developer Agent | 75% | 60% | 30% |
| Design Critic | 70% | 50% | 20% |
| Benchmark Reviewer | 70% | 50% | 20% |
| Workflow | 60% | 80% | 50% |

---

## 7. Definition of Done Summary

### Per-Phase DoD

| Phase | DoD |
|-------|-----|
| **Phase 0** | State schema extended, Constitution loader functional, compliance checker works |
| **Phase 1** | Real LLM connects, fallback works, response validated, monitoring active |
| **Phase 2** | PM can parse requirements, generate User Stories & AC, check compliance, reject invalid, handoff to CTO |
| **Phase 3** | CTO can validate PM handoff, design architecture, create schema, break into tasks, hand off to Dev |
| **Phase 4** | Developer can understand handoff, implement code, self-review, check compliance, generate tests, report completion |
| **Phase 5** | Design Critic can review UI, check Soft UI compliance, detect AI patterns, make PASS/WARNING/FAIL decision |
| **Phase 6** | Benchmark Reviewer can compare with standards, assess architecture, identify debt, make merge decision |
| **Phase 7** | Full workflow operational, all agents integrated, E2E tests pass, monitoring active |

---

## 8. Quick Reference

### 8.1 Implementation Checklist

```
Before starting each phase:

□ Previous phase DoD met
□ Dependencies available
□ Test harness ready
□ Monitoring set up
□ Rollback plan defined

During phase:

□ Daily standups (progress, blockers)
□ Continuous testing
□ Documentation updated
□ Code reviewed

After phase:

□ All unit tests pass
□ Integration tests pass
□ Performance acceptable
□ Documentation complete
□ Handoff to next phase
```

### 8.2 Contact Points

| Phase | Owner | Reviewer |
|-------|-------|----------|
| Foundation | AI Engineer | Tech Lead |
| LLM | AI Engineer | Tech Lead |
| PM Agent | AI Engineer | PM Lead |
| CTO Agent | AI Engineer | Architect |
| Developer Agent | AI Engineer | Senior Dev |
| Design Critic | AI Engineer | Designer |
| Benchmark | AI Engineer | QA Lead |
| Integration | AI Engineer | Tech Lead |

---

## Appendix A: File Structure Updates

### A.1 New Files Required

```
ai-company/
├── agents/
│   ├── pm_agent.py              # Enhanced
│   ├── cto_agent.py             # Enhanced
│   ├── developer_agent.py        # Enhanced
│   ├── design_critic_agent.py   # NEW
│   ├── benchmark_reviewer_agent.py # NEW
│   ├── pm/
│   │   ├── parser.py            # NEW
│   │   ├── user_story.py       # NEW
│   │   ├── ac_generator.py     # NEW
│   │   ├── compliance.py        # NEW
│   │   └── handoff.py          # NEW
│   ├── cto/
│   │   ├── pm_validator.py      # NEW
│   │   ├── architecture.py     # NEW
│   │   ├── database.py         # NEW
│   │   ├── api.py              # NEW
│   │   ├── task_breakdown.py   # NEW
│   │   ├── risk.py             # NEW
│   │   └── handoff.py          # NEW
│   ├── dev/
│   │   ├── task_analyzer.py    # NEW
│   │   ├── code_generator.py   # NEW
│   │   ├── self_reviewer.py   # NEW
│   │   ├── compliance.py        # NEW
│   │   ├── test_generator.py   # NEW
│   │   └── completion.py       # NEW
│   ├── dc/
│   │   ├── visual_analyzer.py  # NEW
│   │   ├── design_system.py    # NEW
│   │   ├── ai_detector.py     # NEW
│   │   └── feedback.py         # NEW
│   └── br/
│       ├── standards.py         # NEW
│       ├── architecture.py     # NEW
│       ├── techdebt.py         # NEW
│       └── merge_decider.py    # NEW
├── lib/
│   ├── constitution.py          # NEW
│   ├── compliance.py           # NEW
│   └── llm_validator.py       # NEW
├── workflows/
│   ├── company_graph.py        # Enhanced
│   ├── state_manager.py        # NEW
│   ├── error_handler.py       # NEW
│   └── recovery.py            # NEW
└── tests/
    ├── conftest.py            # NEW
    ├── test_constitution.py   # NEW
    ├── test_pm_agent.py       # NEW
    ├── test_cto_agent.py      # NEW
    ├── test_dev_agent.py      # NEW
    ├── test_design_critic.py  # NEW
    ├── test_benchmark.py      # NEW
    └── test_integration.py    # NEW
```

---

*Document ini adalah panduan implementasi. Update secara inkremental sesuai progress.*
