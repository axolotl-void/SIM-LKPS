# UI/UX Design Skill

Integrasi dari:
- [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [taste-skill](https://github.com/Leonxlnx/taste-skill)
- [impeccable](https://github.com/pbakaus/impeccable)

---

## Pre-Delivery Checklist (WAJIB sebelum deliver UI)

- [ ] Tidak ada emoji sebagai icon (gunakan SVG: Lucide/Heroicons)
- [ ] `cursor-pointer` pada semua elemen yang bisa diklik
- [ ] Hover states dengan smooth transitions (150-300ms)
- [ ] Light mode: text contrast minimum 4.5:1 (WCAG AA)
- [ ] Focus states visible untuk keyboard navigation
- [ ] `prefers-reduced-motion` dihormati
- [ ] Responsive: 375px, 768px, 1024px, 1440px breakpoints

---

## Anti-Patterns (LARANG)

### Font
- Jangan gunakan font yang overused (Arial, Inter, system defaults)
- Pilih font yang tepat untuk konteks: profesional, readable, dan tidak generic

### Warna
- Jangan gunakan gray text on colored backgrounds
- Jangan gunakan pure black/gray — selalu tint dengan warna
- Hindari purple/pink gradients untuk aplikasi serius (educational/government context)
- Palette harus calming dan professional untuk konteks LKPS

### Layout
- Jangan wrap everything in cards
- Jangan nested cards inside cards
- Gunakan whitespace dengan bijak — spacing yang cukup antar elemen

### Motion
- Jangan gunakan bounce/elastic easing (terasa outdated)
- Animasi harus purposeful, bukan decorative saja

### Typography
- LARANGAN EM-DASH (—) — gunakan comma, semicolon, atau dash yang sesuai

---

## Three Design Dials (Tunable)

### 1. DESIGN_VARIANCE (1-10)
- Low: centered, clean, standard layout
- High: asymmetric, modern, experimental
- **Rekomendasi untuk SIM-LKPS**: 3-5 (clean + slight variation)

### 2. MOTION_INTENSITY (1-10)
- Low: hover effects only
- High: scroll-driven, magnetic interactions
- **Rekomendasi untuk SIM-LKPS**: 2-4 (subtle, professional motion)

### 3. VISUAL_DENSITY (1-10)
- Low: spacious, banyak whitespace
- High: dense dashboards, banyak informasi
- **Rekomendasi untuk SIM-LKPS**: 5-7 (dashboard perlu display data yang cukup)

---

## Style Guidelines untuk SIM-LKPS

### Rekomendasi Style
- **Minimalism & Swiss Style** — Enterprise apps, dashboards
- **Soft UI Evolution** — Modern enterprise apps, SaaS
- **Bento Box Grid** — Dashboards, card layouts

### Hindari Style Berikut
- Glassmorphism (tidak cocok untuk context严肃)
- Brutalism / Neon colors
- Vaporwave / Retro aesthetics
- AI-native purple gradients

### Color Mood
- Primary: warna institutional/professional (biru, hijau tua, atau navy)
- Secondary: warna netral dengan aksen yang sesuai
- Background: clean, light, readable
- Text: high contrast untuk readability
- Accent: untuk CTA dan highlights

### Typography
- Font: Plus Jakarta Sans (sudah configured)
- Hierarchy yang jelas: headings, subheadings, body text
- Line length ideal: 60-80 characters
- Font size minimum untuk body text: 14px

---

## UX Guidelines

### Accessibility (WAJIB)
- WCAG AA compliance minimum
- Touch targets minimum 44x44px
- Skip heading levels tidak boleh dilompati (h1 → h2 → h3)
- Text overflow handling untuk konten dinamis

### Error Handling
- Error states yang jelas dan actionable
- Empty states yang helpful
- Loading states yang informative

### Forms
- Label yang jelas untuk setiap input
- Validation messages yang spesifik
- Disabled states yang visually distinct

### Tables (LKPS Context)
- Column headers yang jelas
- Proper alignment (numbers right-aligned, text left-aligned)
- Zebra striping atau subtle hover states
- Pagination atau infinite scroll sesuai kebutuhan

---

## Responsive Strategy

| Breakpoint | Target |
|------------|--------|
| 375px | Mobile |
| 768px | Tablet |
| 1024px | Desktop |
| 1440px | Large Desktop |

---

## Design Iteration Workflow

1. **Shape** — Plan UX/UI sebelum menulis code
2. **Build** — Implement components
3. **Critique** — Review hierarchy, clarity, emotional resonance
4. **Polish** — Final pass, design system alignment
5. **Audit** — Run quality checks (a11y, responsive, performance)
