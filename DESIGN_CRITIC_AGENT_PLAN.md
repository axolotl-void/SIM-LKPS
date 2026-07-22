# Design Critic Agent Plan

**Version:** 1.0  
**Date:** 21 Juli 2026  
**Reference:** Engineering Constitution v1.0, PM Agent Upgrade Plan, CTO Agent Upgrade Plan, Developer Agent Upgrade Plan  
**Target:** Design Critic Agent  

---

## Executive Summary

Design Critic Agent adalah agen baru yang bertanggung jawab untuk melakukan review UI/UX setelah Developer selesai mengimplementasikan fitur. Agent ini memastikan bahwa seluruh output visual memenuhi standar desain yang telah ditetapkan dan konsisten dengan design system project SIM-LKPS.

Tanggung jawab utama:
- Menilai kualitas UI dan UX secara objektif
- Mendeteksi desain yang terlihat generik atau terlalu "AI-generated"
- Menilai konsistensi dengan Soft UI Design System
- Memberikan feedback yang spesifik dan actionable
- Menolak hasil yang belum memenuhi standar visual

---

## 1. Purpose & Positioning

### 1.1 Agent Position in Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                    AI COMPANY WORKFLOW                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PM Agent ──► CTO Agent ──► Developer Agent ──► DESIGN CRITIC ──► │
│                                                                    │
│                                              ▲                     │
│                                              │                     │
│                                              │ Review              │
│                                              │ (No code change)    │
│                                                                   │
│                                         ┌─────────────┐           │
│                                         │  DESIGN     │           │
│                                         │  CRITIC     │           │
│                                         │  AGENT      │           │
│                                         └─────────────┘           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Role Definition

| Aspect | Description |
|--------|-------------|
| **Primary Role** | UI/UX Quality Assurance |
| **Trigger** | After Developer completes implementation |
| **Authority** | Reject designs that don't meet standards |
| **Constraint** | Cannot modify code directly |
| **Output** | Specific, actionable feedback |

---

## 2. Responsibilities

### 2.1 Core Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **DC-01** | Visual Quality Assessment | Menilai kualitas visual secara objektif |
| **DC-02** | AI-Generated Pattern Detection | Mendeteksi desain yang terlalu generik |
| **DC-03** | Design System Compliance | Menilai konsistensi dengan Soft UI |
| **DC-04** | Layout & Spacing Review | Menilai layout, margin, padding, alignment |
| **DC-05** | Typography Review | Menilai font sizes, weights, hierarchy |
| **DC-06** | Color & Theme Review | Menilai konsistensi warna |
| **DC-07** | Iconography Review | Menilai penggunaan icons |
| **DC-08** | Responsiveness Review | Menilai responsivitas di berbagai viewport |
| **DC-09** | Feedback Provision | Memberikan feedback spesifik dan actionable |
| **DC-10** | Rejection Authority | Menolak desain yang tidak memenuhi standar |

### 2.2 Extended Responsibilities

| ID | Responsibility | Description |
|----|----------------|-------------|
| **DC-11** | Design Debt Tracking | Mendokumentasi design issues untuk tracking |
| **DC-12** | Best Practice Identification | Mengidentifikasi pola desain yang baik |
| **DC-13** | Consistency Audit | Memastikan konsistensi antar fitur |
| **DC-14** | Accessibility Consideration | Menilai accessibility compliance |

---

## 3. Design System Reference

### 3.1 Soft UI Design System (SIM-LKPS)

**Referensi:** `.kiro/steering/soft-ui-design-system.md`

| Element | Standard |
|---------|----------|
| **Background** | `#f8f9fa` |
| **Primary Gradient** | `bg-gradient-to-tr from-blue-500 to-indigo-600` |
| **Shadow Classes** | `shadow-soft`, `shadow-soft-sm`, `shadow-soft-lg` |
| **Border Radius** | `rounded-xl` (1rem), `rounded-2xl` (1.25rem), `rounded-3xl` (1.5rem) |
| **Body Font** | Inter, `text-xs` |
| **Badge Font** | Inter, `text-3xs` |

### 3.2 Component Patterns

| Component | Pattern |
|-----------|---------|
| **Cards** | `rounded-2xl bg-white shadow-soft border border-slate-100/50` |
| **Buttons Primary** | `rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-soft-sm` |
| **Buttons Secondary** | `rounded-xl border border-slate-200 bg-white` |
| **Modals** | `rounded-3xl bg-white shadow-soft-lg` |
| **Inputs** | `rounded-xl border border-slate-200 shadow-3xs` |
| **Badges** | `rounded-lg px-2.5 py-1 text-2xs font-bold` |

---

## 4. Workflow

### 4.1 Design Critic Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                 DESIGN CRITIC WORKFLOW                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐    │
│  │   INPUT     │────►│   ANALYSIS │────►│  DESIGN SYSTEM  │    │
│  │  (Files)   │     │   PHASE    │     │    CHECK        │    │
│  └─────────────┘     └──────┬──────┘     └────────┬────────┘    │
│                              │                     │              │
│                              ▼                     ▼              │
│                     ┌─────────────┐       ┌─────────────┐       │
│                     │  COMPONENT  │       │   PASS?     │       │
│                     │  INSPECTION │       │             │       │
│                     └──────┬──────┘       └──────┬──────┘       │
│                            │                     │                │
│                            │            ┌─────────┴─────────┐    │
│                            │            │                   │      │
│                            │            ▼                   ▼      │
│                            │     ┌──────────┐       ┌────────┐  │
│                            │     │   PASS   │       │  FAIL  │   │
│                            │     │          │       │        │   │
│                            │     └────┬─────┘       └────┬───┘  │
│                            │          │                   │       │
│                            │          ▼                   ▼       │
│                            │   ┌─────────────┐   ┌────────────┐ │
│                            │   │ LAYOUT     │   │ FEEDBACK  │ │
│                            │   │ REVIEW     │   │ GENERATION│ │
│                            │   └──────┬─────┘   └─────┬──────┘ │
│                            │          │               │         │
│                            │          ▼               ▼         │
│                            │   ┌─────────────┐   ┌────────────┐ │
│                            │   │ TYPOGRAPHY │   │ DETAILED  │ │
│                            │   │ REVIEW     │   │ FEEDBACK  │ │
│                            │   └──────┬─────┘   └─────┬──────┘ │
│                            │          │               │         │
│                            │          ▼               ▼         │
│                            │   ┌─────────────┐   ┌────────────┐ │
│                            │   │ COLOR      │   │ DESIGN    │ │
│                            │   │ REVIEW     │   │ REPORT    │ │
│                            │   └──────┬─────┘   └─────┬──────┘ │
│                            │          │               │         │
│                            │          ▼               ▼         │
│                            │   ┌─────────────┐   ┌────────────┐ │
│                            │   │ RESPONSIVE  │   │ PASS/WARN/│ │
│                            │   │ REVIEW      │   │ FAIL      │ │
│                            │   └──────┬─────┘   └─────┬──────┘ │
│                            │          │               │         │
│                            │          └───────┬───────┘         │
│                            │                  │                  │
│                            │                  ▼                  │
│                            │          ┌─────────────┐           │
│                            │          │COMPLETION  │           │
│                            │          │& HANDOFF   │           │
│                            │          └─────────────┘           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Phase Details

#### Phase 1: Input & Analysis
**Trigger:** Developer completion notification

**Actions:**
1. Collect files to review:
   - Page components (`app/**/*.tsx`)
   - Client components (`components/**/*.tsx`)
   - Global styles (`app/globals.css`)
   - Design tokens

2. Analyze context:
   - Feature type (form, table, dashboard, etc.)
   - Target devices
   - Design complexity

3. Map to design system:
   - Identify design tokens used
   - Map components to patterns

**Output:** Analysis Summary

---

#### Phase 2: Design System Compliance Check
**Trigger:** Analysis complete

**Actions:**
1. Check Soft UI tokens:
   - Background color
   - Primary gradient
   - Shadow classes
   - Border radius
   - Typography scale

2. Check component patterns:
   - Cards
   - Buttons
   - Inputs
   - Modals
   - Badges

3. Flag deviations:
   - Custom colors not in palette
   - Non-standard shadows
   - Inconsistent border radius

**Output:** Design System Compliance Report

---

#### Phase 3: Component Inspection
**Trigger:** Compliance check complete

**Actions:**
1. Inspect each component:
   - Structural elements
   - Visual hierarchy
   - Spacing consistency
   - Alignment

2. Identify patterns:
   - Consistent patterns → note as best practice
   - Inconsistent patterns → flag for review

3. Compare with existing:
   - Similar components in codebase
   - Established patterns

**Output:** Component Inspection Report

---

#### Phase 4: Layout Review
**Trigger:** Component inspection complete

**Actions:**
1. Layout assessment:
   - Grid system usage
   - Responsive breakpoints
   - Margin/padding consistency
   - Alignment (vertical/horizontal)

2. Spacing audit:
   - Consistent spacing scale
   - No arbitrary values
   - Proper use of Tailwind spacing

3. Visual balance:
   - White space usage
   - Content hierarchy
   - Breathing room

**Output:** Layout Assessment

---

#### Phase 5: Typography Review
**Trigger:** Layout review complete

**Actions:**
1. Font hierarchy:
   - Headings (h1, h2, h3)
   - Body text
   - Labels and captions
   - Sizes match scale

2. Font weights:
   - Semantic weight usage
   - Consistent weight assignment
   - Visual hierarchy clear

3. Text properties:
   - Line height appropriate
   - Letter spacing consistent
   - Text colors accessible

**Output:** Typography Assessment

---

#### Phase 6: Color & Theme Review
**Trigger:** Typography review complete

**Actions:**
1. Color palette:
   - Primary colors correct
   - Semantic colors (success, error, warning)
   - Neutral palette
   - No unexpected colors

2. Color usage:
   - Contrast ratio accessibility
   - Consistent semantic mapping
   - Proper gradient usage

3. Theme consistency:
   - Light/dark if applicable
   - Consistent theming

**Output:** Color Assessment

---

#### Phase 7: Responsiveness Review
**Trigger:** Color review complete

**Actions:**
1. Viewport testing:
   - Mobile (< 640px)
   - Tablet (640px - 1024px)
   - Desktop (> 1024px)

2. Layout adaptation:
   - Grid columns adjust
   - Font sizes scale
   - Touch targets appropriate

3. Edge cases:
   - Long content handling
   - Overflow behavior
   - Scroll behavior

**Output:** Responsiveness Assessment

---

#### Phase 8: Feedback Generation & Completion
**Trigger:** All reviews complete

**Actions:**
1. Compile findings:
   - Categorize issues (critical/major/minor)
   - Prioritize feedback
   - Generate specific recommendations

2. Decision:
   - PASS: No critical issues
   - WARNING: Minor issues, acceptable
   - FAIL: Critical issues must be fixed

3. Generate report:
   - Detailed findings
   - Specific feedback per file
   - Actionable recommendations

**Output:** Design Review Report

---

## 5. Input Specification

### 5.1 Required Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **Implemented Files** | Developer | All created/modified component files |
| **Design System** | Steering Files | Soft UI tokens dan patterns |
| **Reference Components** | Repository | Existing well-designed components |
| **Feature Context** | Developer | Feature type, purpose, users |

### 5.2 Optional Inputs

| Input | Source | Description |
|-------|--------|-------------|
| **Screenshots** | Developer | Visual reference if available |
| **Wireframes** | PM/Design | Initial design intent |
| **User Research** | PM | User expectations |

---

## 6. Output Specification

### 6.1 Design Review Report Structure

```markdown
# Design Review Report

## Review Summary
- **Feature:** [Feature name]
- **Reviewer:** Design Critic Agent
- **Date:** [Date]
- **Overall Status:** [PASS / WARNING / FAIL]

## Design System Compliance

### Tokens Used
| Token | Used | Correct |
|-------|------|---------|
| Background | [Yes/No] | [Yes/No] |
| Primary Gradient | [Yes/No] | [Yes/No] |
| Shadows | [Yes/No] | [Yes/No] |
| Border Radius | [Yes/No] | [Yes/No] |
| Typography Scale | [Yes/No] | [Yes/No] |

### Compliance Score: [X/10]

## Component Assessment

### [Component Name]
- **Status:** [Good / Needs Work]
- **Issues:**
  - [Issue 1]
  - [Issue 2]
- **Recommendations:**
  - [Recommendation 1]
  - [Recommendation 2]

## Layout Assessment
- **Grid Usage:** [Good / Needs Work]
- **Spacing:** [Consistent / Inconsistent]
- **Alignment:** [Correct / Issues Found]

## Typography Assessment
- **Hierarchy:** [Clear / Unclear]
- **Sizes:** [Correct / Incorrect]
- **Weights:** [Appropriate / Issues]

## Color Assessment
- **Palette:** [Correct / Deviations Found]
- **Contrast:** [Pass / Fail]
- **Semantic Usage:** [Correct / Issues]

## Responsiveness
- **Mobile:** [Pass / Fail]
- **Tablet:** [Pass / Fail]
- **Desktop:** [Pass / Fail]

## AI-Generated Pattern Detection
- **Detected Patterns:** [List if any]
- **Genericism Score:** [X/10]

## Critical Issues (Must Fix)
1. [Issue] - [Impact]
2. [Issue] - [Impact]

## Recommendations (Should Fix)
1. [Recommendation]
2. [Recommendation]

## Design Debt
| Item | Severity | Description |
|------|----------|-------------|
| [item] | [H/M/L] | [description] |
```

---

## 7. Decision Points

### 7.1 Decision Tree

```
┌─────────────────────────────────────┐
│        REVIEW STARTED                  │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Design System     │
         │ Compliant?        │
         └────────┬────────┘
                  │
       ┌──────────┴──────────┐
       │Yes                      │No
       ▼                         ▼
┌─────────────┐       ┌─────────────────┐
│ Continue     │       │  FLAG AS ISSUE  │
│ Review       │       │  & CONTINUE    │
└──────┬──────┘       └────────┬────────┘
       │                        │
       ▼                        │
┌─────────────┐                 │
│ Layout      │                 │
│ Consistent? │                 │
└──────┬──────┘                 │
       │                        │
    ┌──┴──┐                   │
    │Yes   │No                  │
    ▼       ▼                   │
┌────────┐ ┌────────┐         │
│Continue│ │ FLAG   │         │
│Review  │ │ & FIX  │         │
└───┬────┘ └────────┘         │
    │                              │
    ▼                              │
┌─────────────┐                   │
│ Typography  │                   │
│ Appropriate? │                   │
└──────┬──────┘                   │
       │                           │
    ┌──┴──┐                      │
    │Yes   │No                     │
    ▼       ▼                     │
┌────────┐ ┌────────┐          │
│Continue│ │ FLAG   │          │
│Review  │ │ & FIX  │          │
└───┬────┘ └────────┘          │
    │                             │
    ▼                             │
┌─────────────┐                  │
│ Color       │                  │
│ Correct?     │                  │
└──────┬──────┘                  │
       │                          │
    ┌──┴──┐                     │
    │Yes   │No                    │
    ▼       ▼                    │
┌────────┐ ┌────────┐         │
│Continue│ │ FLAG   │         │
│Review  │ │ & FIX  │         │
└───┬────┘ └────────┘         │
    │                            │
    ▼                            │
┌─────────────┐                 │
│ Responsive?  │                 │
└──────┬──────┘                 │
       │                         │
    ┌──┴──┐                    │
    │Yes   │No                   │
    ▼       ▼                   │
┌────────┐ ┌────────┐        │
│FINAL   │ │FINAL   │        │
│DECISION│ │DECISION│        │
└────────┘ └────────┘        │
```

### 7.2 PASS Criteria

Review PASS jika:

| Criteria | Requirement |
|----------|-------------|
| **Design System Compliance** | ≥ 8/10 tokens correct |
| **Layout** | No critical spacing issues |
| **Typography** | Hierarchy clear, sizes correct |
| **Color** | Palette correct, contrast pass |
| **Responsive** | Works on all breakpoints |
| **AI Patterns** | ≤ 2 generic patterns detected |
| **Critical Issues** | 0 critical issues |

### 7.3 WARNING Criteria

Review WARNING jika:

| Criteria | Requirement |
|----------|-------------|
| **Design System Compliance** | 6-7/10 tokens correct |
| **Layout** | Minor spacing inconsistencies |
| **Typography** | Size hierarchy slightly off |
| **Color** | Minor palette deviations |
| **Responsive** | Works but minor issues |
| **AI Patterns** | 3-4 generic patterns |
| **Critical Issues** | 0 critical, ≤ 3 major |

### 7.4 FAIL Criteria

Review FAIL jika:

| Criteria | Requirement |
|----------|-------------|
| **Design System Compliance** | < 6/10 tokens correct |
| **Layout** | Major spacing issues |
| **Typography** | Unclear hierarchy |
| **Color** | Major palette deviations |
| **Responsive** | Broken on mobile/tablet |
| **AI Patterns** | > 4 generic patterns |
| **Critical Issues** | ≥ 1 critical issue |

---

## 8. Review Checklist

### 8.1 Design System Compliance

```
## Design System Checklist

### Background
- [ ] Uses #f8f9fa or transparent
- [ ] No custom background colors

### Primary Gradient
- [ ] Uses `from-blue-500 to-indigo-600`
- [ ] No custom gradients

### Shadows
- [ ] Uses `shadow-soft`, `shadow-soft-sm`, `shadow-soft-lg`
- [ ] No custom shadow values

### Border Radius
- [ ] Uses `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- [ ] No arbitrary radius values

### Typography
- [ ] Body: `text-xs`
- [ ] Badge: `text-3xs`
- [ ] Uses Inter font

### Colors
- [ ] Uses Tailwind color palette
- [ ] No hex colors outside palette
- [ ] Semantic colors consistent
```

### 8.2 Layout & Spacing

```
## Layout Checklist

### Grid System
- [ ] Uses Tailwind grid
- [ ] Columns appropriate for content
- [ ] Responsive columns defined

### Spacing Scale
- [ ] Uses Tailwind spacing (1, 2, 3, 4, 5, 6)
- [ ] No arbitrary values (e.g., `px-[23px]`)
- [ ] Consistent padding/margin

### Alignment
- [ ] Items properly aligned
- [ ] Consistent text alignment
- [ ] Icons aligned with text

### Visual Hierarchy
- [ ] Primary content stands out
- [ ] Secondary content subordinate
- [ ] Clear visual flow
```

### 8.3 Typography

```
## Typography Checklist

### Font Sizes
- [ ] Heading sizes appropriate (text-lg, text-xl)
- [ ] Body text readable (text-xs)
- [ ] Badge text small (text-3xs)
- [ ] Consistent size scale

### Font Weights
- [ ] Headings bold (font-bold)
- [ ] Body semibold/medium (font-semibold)
- [ ] Labels readable (font-medium)
- [ ] Consistent weight usage

### Text Properties
- [ ] Line height appropriate (leading-relaxed)
- [ ] Letter spacing normal (tracking-tight)
- [ ] Text colors from palette
```

### 8.4 Color & Theme

```
## Color Checklist

### Primary Colors
- [ ] Blue/Indigo gradient for primary actions
- [ ] White backgrounds
- [ ] Slate for text

### Semantic Colors
- [ ] Green/Emerald for success
- [ ] Red/Rose for error
- [ ] Amber/Orange for warning
- [ ] Blue/Indigo for info

### Accessibility
- [ ] Contrast ratio ≥ 4.5:1 for text
- [ ] Focus states visible
- [ ] No color-only indicators

### Consistency
- [ ] Same colors for same purposes
- [ ] No random color usage
- [ ] Theme consistent across components
```

### 8.5 Iconography

```
## Iconography Checklist

### Usage
- [ ] Lucide React icons used
- [ ] Consistent icon size (h-4 w-4, h-5 w-5)
- [ ] Icons properly colored

### Sizing
- [ ] Small icons: `h-4 w-4`
- [ ] Medium icons: `h-5 w-5`
- [ ] Large icons: `h-6 w-6`

### Alignment
- [ ] Icons aligned with text
- [ ] Consistent padding around icons
- [ ] Icons in buttons properly sized
```

### 8.6 Responsiveness

```
## Responsiveness Checklist

### Mobile (< 640px)
- [ ] Single column layout
- [ ] Touch targets ≥ 44px
- [ ] Font sizes readable
- [ ] No horizontal scroll

### Tablet (640px - 1024px)
- [ ] 2-column grid where appropriate
- [ ] Adequate spacing
- [ ] No cramped layout

### Desktop (> 1024px)
- [ ] Multi-column layout
- [ ] Proper use of space
- [ ] Max-width constraints where needed
```

### 8.7 AI-Generated Pattern Detection

```
## AI Pattern Detection Checklist

### Genericism Signs
- [ ] No "typical AI" colors (generic blue/purple gradients)
- [ ] Varied border radius (not all rounded-xl)
- [ ] Organic spacing (not all uniform)
- [ ] Realistic content (not lorem ipsum style)

### Diversity Check
- [ ] Components don't all look the same
- [ ] Visual variety in similar components
- [ ] Not all cards have identical structure

### Human Touch
- [ ] Subtle visual interest
- [ ] Intentional hierarchy
- [ ] Considered whitespace
```

---

## 9. Metrics & KPIs

### 9.1 Design Quality Metrics

| Metric | Target | Measurement |
|--------|--------|------------|
| **Design System Compliance** | > 90% | Tokens correct / total |
| **Critical Issues Found** | < 1 | Per review |
| **Major Issues Found** | < 3 | Per review |
| **Pass Rate** | > 80% | Reviews passing |
| **Warning Rate** | < 15% | Reviews with warnings |
| **Fail Rate** | < 5% | Reviews failing |

### 9.2 Quality Metrics

| Metric | Target |
|--------|--------|
| Feedback specificity | > 8/10 |
| Actionable recommendations | 100% |
| Consistency detection | > 90% |

---

## 10. Integration with Workflow

### 10.1 Post-Development Integration

```
┌─────────────────────────────────────────────┐
│           DEVELOPER AGENT                       │
│                                             │
│  Completes implementation                  │
│  Runs self-review                          │
│  Checks Constitution compliance             │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         DESIGN CRITIC AGENT                    │
│                                             │
│  Review UI/UX                              │
│  Check design system compliance             │
│  Provide feedback                          │
│  Make PASS/WARNING/FAIL decision           │
└─────────────────────┬───────────────────────┘
                      │
           ┌─────────┴─────────┐
           │                     │
           ▼                     ▼
    ┌──────────┐         ┌──────────┐
    │ PASS/    │         │   FAIL   │
    │ WARNING  │         │          │
    └────┬─────┘         └────┬─────┘
         │                    │
         │              ┌─────┴─────┐
         │              │            │
         │              ▼            ▼
         │        ┌──────────┐ ┌──────────┐
         │        │ FIX BY   │ │ RETURN   │
         │        │ DEVELOPER│ │ TO DEv   │
         │        └──────────┘ └──────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         HANDOVER TO HUMAN REVIEW              │
└─────────────────────────────────────────────┘
```

### 10.2 Design Debt Tracking

```
┌─────────────────────────────────────────────┐
│         DESIGN DEBT TRACKING                   │
│                                             │
│  Issues identified → Logged                 │
│  Severity assessed                         │
│  Priority assigned                         │
│  Tracked for future sprints                 │
└─────────────────────────────────────────────┘
```

---

## Appendix A: Design System Tokens Reference

### A.1 Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `bg-slate-50` | #f8fafc | Light background |
| `bg-white` | #ffffff | Card background |
| `text-slate-400` | #94a3b8 | Muted text |
| `text-slate-500` | #64748b | Secondary text |
| `text-slate-700` | #334155 | Body text |
| `text-slate-800` | #1e293b | Headings |
| `text-blue-600` | #2563eb | Primary accent |
| `text-indigo-600` | #4f46e5 | Secondary accent |
| `from-blue-500` | #3b82f6 | Gradient start |
| `to-indigo-600` | #4f46e5 | Gradient end |
| `bg-emerald-50` | #ecfdf5 | Success background |
| `bg-amber-50` | #fffbeb | Warning background |
| `bg-rose-50` | #fff1f2 | Error background |

### A.2 Shadow Tokens

| Token | Usage |
|-------|-------|
| `shadow-soft` | Cards, panels |
| `shadow-soft-sm` | Buttons, inputs |
| `shadow-soft-lg` | Modals, overlays |
| `shadow-soft-2xs` | Small elements |

### A.3 Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-xl` | 0.75rem | Buttons, inputs |
| `rounded-2xl` | 1rem | Cards, panels |
| `rounded-3xl` | 1.5rem | Modals, large cards |

### A.4 Typography Scale

| Class | Size | Usage |
|-------|------|-------|
| `text-3xs` | 0.625rem | Badges, labels |
| `text-2xs` | 0.6875rem | Secondary labels |
| `text-xs` | 0.75rem | Body text |
| `text-sm` | 0.875rem | Subheadings |
| `text-base` | 1rem | Section titles |
| `text-lg` | 1.125rem | Page titles |
| `text-xl` | 1.25rem | Hero headings |

---

## Appendix B: Common Design Issues

### B.1 Critical Issues (Must Fix)

| Issue | Impact | Fix |
|-------|--------|-----|
| Missing gradient on primary button | Brand inconsistency | Add `bg-gradient-to-tr from-blue-500 to-indigo-600` |
| No shadow on cards | Poor visual hierarchy | Add `shadow-soft` |
| Wrong border radius | Inconsistency | Use `rounded-2xl` for cards |
| Poor contrast | Accessibility | Increase text color darkness |
| Broken mobile layout | Usability | Fix grid columns |

### B.2 Major Issues (Should Fix)

| Issue | Impact | Fix |
|-------|--------|-----|
| Inconsistent spacing | Visual noise | Use consistent spacing scale |
| Unclear hierarchy | Confusion | Adjust font sizes/weights |
| Too many colors | Brand dilution | Stick to palette |
| Generic icons | Boring UI | Ensure consistent sizing |
| No hover states | Poor feedback | Add `hover:` variants |

### B.3 Minor Issues (Nice to Fix)

| Issue | Impact | Fix |
|-------|--------|-----|
| Slightly off alignment | Minor visual noise | Fine-tune alignment |
| Inconsistent badge size | Minor inconsistency | Use `text-2xs` consistently |
| Arbitrary spacing | Technical debt | Use Tailwind scale |

---

*Document ini adalah desain untuk Design Critic Agent. Implementasi memerlukan update pada AI Company Framework.*
