# 🔄 Validation Workflow — Spesifikasi & Task Breakdown

**Versi:** 1.0  
**Status:** Planning  
**Estimasi:** 2-3 hari

---

## 1. Tujuan

Mengimplementasikan alur validasi tabel LKPS: Operator mengisi → submit → Validator setuju/tolak/revise → notifikasi perubahan status.

---

## 2. Status Flow

```
┌─────────┐   submit    ┌───────────┐   approve    ┌───────────┐
│  DRAFT  │────────────▶│  DIAJUKAN │─────────────▶│ DISETUJUI │
└─────────┘             └───────────┘              └───────────┘
     ▲                       │                           │
     │                       │ reject                    │
     │                       ▼                           │
     │                  ┌───────────┐                    │
     │                  │  DITOLAK  │                    │
     │                  └───────────┘                    │
     │                       │                           │
     │                       │ revise                    │
     │                       ▼                           │
     │                  ┌───────────┐                    │
     └──────────────────│  DIREVISI │── resubmit ──────▶ DIAJUKAN
          (edit)        └───────────┘
```

### Aturan transisi status:

| Aksi | Role | Dari → Ke | Syarat |
|------|------|-----------|--------|
| Submit | OPERATOR, ADMIN | DRAFT → DIAJUKAN | Minimal 1 baris data |
| Resubmit | OPERATOR, ADMIN | DIREVISI → DIAJUKAN | - |
| Approve | VALIDATOR, ADMIN | DIAJUKAN → DISETUJUI | - |
| Reject | VALIDATOR, ADMIN | DIAJUKAN → DITOLAK | Wajib isi komentar |
| Revise | VALIDATOR, ADMIN | DIAJUKAN → DIREVISI | Wajib isi komentar |
| Edit (simpan) | OPERATOR, ADMIN | DITOLAK → DRAFT | Otomatis jadi DRAFT saat edit |
| Edit (simpan) | OPERATOR, ADMIN | DIREVISI → DIREVISI | Status tetap |
| Edit | SEMUA | DISETUJUI | DIBLOKIR — tidak bisa edit |

---

## 3. Yang Perlu Dibuat

### 3.1 Server Action: Submit/Validate (`lib/actions/lkps.ts`)

Tambahkan 2 fungsi baru:

#### `submitLkpsTabel(tabelKode, tahunAkademikId)`
- Cek session → harus OPERATOR/ADMIN
- Cek permission `tabel_lkps.submit`
- Cek status harus DRAFT atau DIREVISI
- Cek minimal 1 row exists
- Update status → DIAJUKAN, set `submittedById`, `submittedAt`
- Catat di `ValidationHistory` (action: SUBMIT)
- Catat di audit log
- Buat notifikasi untuk VALIDATOR

#### `validateLkpsTabel(tabelKode, tahunAkademikId, action, comment)`
- Cek session → harus VALIDATOR/ADMIN
- Cek permission `tabel_lkps.validate`
- Cek status harus DIAJUKAN
- `action` = APPROVE | REJECT | REVISE
- Jika REJECT atau REVISE → `comment` wajib diisi
- Update status sesuai action
- Set `validatedById`, `validatedAt` jika APPROVE
- Catat di `ValidationHistory`
- Catat di audit log
- Buat notifikasi untuk OPERATOR (submitter)

### 3.2 Notification Helper (`lib/actions/notification.ts`)

File baru:

```typescript
// lib/actions/notification.ts
export async function createNotification(userId, title, message, type, link?)
```

### 3.3 Update Page Component — Kirim Status ke Client

Di setiap `app/(dashboard)/lkps/bab-{n}/tabel-{kode}/page.tsx`:

- Setelah fetch `lkps`, ambil juga `ValidationHistory` (5 terakhir)
- Kirim `lkps.status`, `lkps.submittedAt`, `lkps.validatedAt`, `validationHistory` ke client component
- Kirim `session.user.role` ke client component

### 3.4 Update Client Component — Tambah Tombol & Status Display

Di setiap `components/tables/tabel-*-client.tsx`:

- **Status banner** di atas tabel — badge status besar dengan warna
- **Tombol Submit** — hanya muncul jika status DRAFT/DIREVISI dan role OPERATOR/ADMIN
- **Tombol Approve/Reject/Revise** — hanya muncul jika status DIAJUKAN dan role VALIDATOR/ADMIN
- **Modal konfirmasi submit** — "Yakin submit tabel ini untuk divalidasi?"
- **Modal validasi** — pilih action (Approve/Reject/Revise) + form komentar (wajib untuk Reject/Revise)
- **Disable edit** jika status DISETUJUI atau DIAJUKAN
- **Disable delete** jika status DISETUJUI atau DIAJUKAN

### 3.5 Validation History Component (`components/tables/validation-history.tsx`)

File baru — timeline/riwayat validasi:

- Tampilkan daftar action yang sudah dilakukan
- Icon per action (SUBMIT → Clock, APPROVE → Check, REJECT → X, REVISE → Edit)
- Nama user + timestamp
- Komentar (jika ada)

### 3.6 Halaman Pending Validations (`app/(dashboard)/lkps/validasi/page.tsx`)

File baru — khusus untuk role VALIDATOR:

- List semua tabel yang statusnya DIAJUKAN
- Link ke halaman tabel masing-masing
- Badge jumlah pending

---

## 4. File-by-File Perubahan

```
sim-lkps/
├── lib/
│   ├── actions/
│   │   ├── lkps.ts              # [EDIT] + submitLkpsTabel, validateLkpsTabel
│   │   └── notification.ts      # [NEW] createNotification helper
│   └── validations/
│       └── master.ts            # [EDIT] + validationSchema (action, comment)
│
├── components/
│   └── tables/
│       ├── validation-history.tsx # [NEW] timeline component
│       ├── tabel-1a1-client.tsx   # [EDIT] + submit/validate buttons
│       ├── tabel-1a2-client.tsx   # [EDIT] (sama)
│       ├── ... (30 lainnya)       # [EDIT] (sama)
│       └── tabel-52-client.tsx    # [EDIT] (sama)
│
├── app/(dashboard)/
│   └── lkps/
│       └── validasi/
│           └── page.tsx           # [NEW] pending validations page
│
└── lib/utils/
    └── permissions.ts            # [EDIT] tambah permission notifikasi?
```

---

## 5. Execution Order (Dependency)

```
1. Notification helper         (10 menit) — independent
2. Server action: submitLkps   (20 menit) — butuh #1
3. Server action: validateLkps (20 menit) — butuh #1
4. Validation history component(15 menit) — independent
5. Update 1 client component   (30 menit) — butuh #2, #3, #4
   sebagai contoh (tabel-1a1-client.tsx)
6. Update 30 client lainnya    (copy pattern → 30 menit)
7. Pending validations page    (15 menit) — butuh #2
8. Update page.tsx components   (15 menit) — kirim status ke client

                            Total: ~2.5 jam kerja
```

---

## 6. Acceptance Criteria

1. Operator bisa submit tabel (DRAFT → DIAJUKAN) hanya jika ada minimal 1 baris data
2. Validator bisa Approve/Reject/Revise tabel yang DIAJUKAN
3. Reject dan Revise WAJIB menyertakan komentar
4. Setiap aksi tercatat di ValidationHistory dengan timestamp + user
5. Notifikasi dibuat untuk user yang relevan saat submit/validate
6. Edit/delete terblokir saat status DIAJUKAN atau DISETUJUI
7. Edit di status DITOLAK otomatis mengembalikan ke DRAFT
8. Halaman /validasi menampilkan daftar tabel menunggu review
9. Timeline validasi tampil di halaman detail tabel

---

## 7. Risiko

| Risiko | Mitigasi |
|--------|----------|
| 30 client component mirip, rawan copy-paste error | Kerjakan 1 dulu, sisanya mekanik |
| Lupa handle status edge case (DIREVISI → DIAJUKAN) | Cek flow diagram di atas |
| Notifikasi belum ada UI inbox | Kirim console dulu, UI belakangan |
