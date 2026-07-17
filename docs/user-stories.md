# SIM-LKPS — User Stories

**Versi:** 1.0  
**Sprint:** 0  
**Agent:** PM Agent  
**Tanggal:** 2026-07-16  
**Status:** DRAFT → IN REVIEW

---

## 1. Daftar Aktor

| Aktor | Deskripsi | Jumlah Estimasi |
|-------|-----------|-----------------|
| **Admin** | Mengelola user, role, konfigurasi sistem, dan backup | 1–2 orang |
| **Operator** (Tim LKPS) | Mengisi data 31 tabel LKPS, upload bukti pendukung, submit untuk validasi | 3–5 orang |
| **Validator** (Kaprodi) | Mereview data yang disubmit, memberi catatan, menyetujui/menolak | 1–2 orang |
| **Pimpinan** (Dekan/Wakil Dekan) | Melihat dashboard progres, laporan rekapitulasi, status akreditasi | 1–3 orang |

---

## 2. Permission Matrix

| Fitur | Admin | Operator | Validator | Pimpinan |
|-------|:-----:|:--------:|:---------:|:--------:|
| **Login/Logout** | ✅ | ✅ | ✅ | ✅ |
| **Dashboard** | ✅ Full | ✅ Operator view | ✅ Validator view | ✅ Pimpinan view |
| **Master Data — Lihat** | ✅ | ✅ | ✅ | ✅ |
| **Master Data — CRUD** | ✅ | ❌ | ❌ | ❌ |
| **User Management** | ✅ | ❌ | ❌ | ❌ |
| **Tabel LKPS — Lihat** | ✅ | ✅ Assigned | ✅ | ✅ |
| **Tabel LKPS — Input/Edit** | ✅ | ✅ Assigned | ❌ | ❌ |
| **Tabel LKPS — Submit** | ❌ | ✅ | ❌ | ❌ |
| **Tabel LKPS — Validate** | ❌ | ❌ | ✅ | ❌ |
| **Tabel LKPS — Approve/Reject** | ❌ | ❌ | ✅ | ❌ |
| **Evidence — Upload** | ✅ | ✅ | ❌ | ❌ |
| **Evidence — Lihat** | ✅ | ✅ | ✅ | ✅ |
| **Report — Export** | ✅ | ✅ | ✅ | ✅ |
| **Audit Log — Lihat** | ✅ | ❌ | ❌ | ❌ |
| **Settings — Konfigurasi** | ✅ | ❌ | ❌ | ❌ |
| **Backup** | ✅ | ❌ | ❌ | ❌ |

---

## 3. User Journey Utama

### Journey 1: Pengisian Data LKPS (Operator)

```
Login → Dashboard Operator → Pilih BAB → Pilih Tabel → Isi Data
→ Simpan Draft → Review Mandiri → Submit untuk Validasi → Tunggu Feedback
→ [Jika Revisi] Edit → Re-submit → [Jika Disetujui] ✅ Done
```

### Journey 2: Validasi Data (Validator/Kaprodi)

```
Login → Dashboard Validator → Lihat Antrian Validasi → Pilih Submission
→ Review Data Tabel → Periksa Bukti Pendukung → Beri Catatan/Komentar
→ [Setuju] Approve → [Tolak] Reject dengan alasan → [Revisi] Minta perbaikan
```

### Journey 3: Monitoring (Pimpinan)

```
Login → Dashboard Pimpinan → Lihat Progres Pengisian (per BAB)
→ Lihat Status Validasi → Lihat Tabel yang Belum Diisi → Export Rekap
```

### Journey 4: Administrasi Sistem (Admin)

```
Login → Dashboard Admin → Kelola User → Assign Role → Kelola Master Data
→ Kelola Tahun Akademik → Lihat Audit Log → Backup Database
```

### Journey 5: Export Laporan (Semua Role)

```
Login → Pilih Menu Laporan → Pilih Tabel/BAB → Filter Tahun Akademik
→ Preview → Export Excel/Word/PDF → Download
```

---

## 4. User Stories — Prioritas P0 (Sprint 0–4)

### US-AUTH: Authentication & Authorization

| ID | User Story | AC (Acceptance Criteria) |
|----|-----------|--------------------------|
| US-01 | Sebagai **user**, saya ingin **login dengan email dan password**, sehingga **saya dapat mengakses sistem sesuai role saya** | Given: user terdaftar. When: input email+password benar. Then: redirect ke dashboard sesuai role |
| US-02 | Sebagai **user**, saya ingin **logout dari sistem**, sehingga **session saya dihapus dan aman** | Given: user sudah login. When: klik logout. Then: session dihapus, redirect ke halaman login |
| US-03 | Sebagai **Admin**, saya ingin **membuat akun user baru dan assign role**, sehingga **tim LKPS dapat mengakses sistem** | Given: Admin login. When: isi form user baru + pilih role. Then: user terdaftar dan bisa login |
| US-04 | Sebagai **Admin**, saya ingin **mereset password user lain**, sehingga **user yang lupa password bisa login kembali** | Given: Admin login. When: pilih user, klik reset. Then: password direset, user diberitahu |

### US-DASH: Dashboard

| ID | User Story | AC |
|----|-----------|-----|
| US-05 | Sebagai **Operator**, saya ingin **melihat progres pengisian tabel LKPS di dashboard**, sehingga **saya tahu tabel mana yang belum diisi** | Given: Operator login. When: buka dashboard. Then: tampil statistik terisi/belum per BAB |
| US-06 | Sebagai **Validator**, saya ingin **melihat antrian submission yang perlu direview**, sehingga **saya bisa memulai validasi** | Given: Validator login. When: buka dashboard. Then: tampil daftar submission pending review |
| US-07 | Sebagai **Pimpinan**, saya ingin **melihat progres keseluruhan pengisian dan validasi**, sehingga **saya bisa memantau kesiapan akreditasi** | Given: Pimpinan login. When: buka dashboard. Then: tampil overview progres per BAB |

### US-MASTER: Master Data

| ID | User Story | AC |
|----|-----------|-----|
| US-08 | Sebagai **Admin**, saya ingin **mengelola data tahun akademik** (CRUD), sehingga **data LKPS bisa dikaitkan dengan tahun tertentu** | Given: Admin login. When: buka master tahun akademik. Then: bisa tambah/edit/hapus/lihat tahun akademik |
| US-09 | Sebagai **Admin**, saya ingin **mengelola data dosen** (CRUD), sehingga **dosen terdaftar dan bisa digunakan di tabel LKPS** | Given: Admin login. When: buka master dosen. Then: bisa tambah/edit/hapus/lihat data dosen (NIDN, nama, jabatan, dll) |
| US-10 | Sebagai **Admin**, saya ingin **mengelola data mahasiswa** (CRUD), sehingga **data mahasiswa tersedia untuk tabel terkait** | Given: Admin login. When: buka master mahasiswa. Then: bisa tambah/edit/hapus/lihat data mahasiswa |
| US-11 | Sebagai **Admin**, saya ingin **mengelola data mata kuliah** (CRUD), sehingga **mata kuliah tersedia untuk tabel pembelajaran** | Given: Admin login. When: buka master mata kuliah. Then: bisa CRUD mata kuliah (kode, nama, SKS, semester) |
| US-12 | Sebagai **Admin**, saya ingin **mencari dan memfilter data di semua master data**, sehingga **saya cepat menemukan data yang dicari** | Given: Admin di halaman master data. When: ketik keyword di search. Then: data difilter real-time |

### US-TABEL: Tabel LKPS

| ID | User Story | AC |
|----|-----------|-----|
| US-13 | Sebagai **Operator**, saya ingin **mengisi data tabel LKPS sesuai format BAN-PT**, sehingga **data tercatat dengan format yang benar** | Given: Operator login. When: buka tabel 1.A.1. Then: form input sesuai kolom resmi BAN-PT |
| US-14 | Sebagai **Operator**, saya ingin **menyimpan data sebagai draft**, sehingga **saya bisa lanjutkan nanti tanpa kehilangan data** | Given: Operator mengisi tabel. When: klik simpan draft. Then: data tersimpan dengan status Draft |
| US-15 | Sebagai **Operator**, saya ingin **submit tabel untuk validasi**, sehingga **Validator bisa mereview data saya** | Given: data tabel sudah diisi. When: klik submit. Then: status berubah ke Diajukan, Validator mendapat notifikasi |
| US-16 | Sebagai **Validator**, saya ingin **mereview data tabel dan memberi catatan**, sehingga **Operator tahu bagian mana yang perlu diperbaiki** | Given: Validator login. When: buka submission. Then: bisa lihat data, beri komentar per field/per tabel |
| US-17 | Sebagai **Validator**, saya ingin **menyetujui atau menolak submission**, sehingga **data LKPS memiliki status final yang jelas** | Given: Validator selesai review. When: klik approve/reject. Then: status berubah, Operator diberitahu |

---

## 5. User Stories — Prioritas P1-P2 (Sprint 5–11)

### US-TABEL2: Tabel LKPS Lanjutan

| ID | User Story | Sprint |
|----|-----------|--------|
| US-18 | Sebagai **Operator**, saya ingin **mengisi tabel BAB 2 Pendidikan tahap 1 (2.A.1–2.B.3)** | Sprint 5 |
| US-19 | Sebagai **Operator**, saya ingin **mengisi tabel BAB 2 Pendidikan tahap 2 (2.B.4–2.D)** | Sprint 6 |
| US-20 | Sebagai **Operator**, saya ingin **mengisi tabel BAB 3 Penelitian** | Sprint 7 |
| US-21 | Sebagai **Operator**, saya ingin **mengisi tabel BAB 4 Pengabdian** | Sprint 8 |
| US-22 | Sebagai **Operator**, saya ingin **mengisi tabel BAB 5 Tata Kelola dan BAB 6 Visi Misi** | Sprint 9 |

### US-EVIDENCE: Evidence Management

| ID | User Story | Sprint |
|----|-----------|--------|
| US-23 | Sebagai **Operator**, saya ingin **upload bukti pendukung dan kaitkan dengan data tabel** | Sprint 10 |
| US-24 | Sebagai **Validator**, saya ingin **preview bukti pendukung langsung di browser** | Sprint 10 |
| US-25 | Sebagai **Operator**, saya ingin **upload ulang bukti tanpa kehilangan versi sebelumnya** | Sprint 10 |

### US-VALIDATION: Validation Workflow

| ID | User Story | Sprint |
|----|-----------|--------|
| US-26 | Sebagai **Operator**, saya ingin **melihat status submission semua tabel saya** | Sprint 11 |
| US-27 | Sebagai **Operator**, saya ingin **menerima notifikasi jika submission ditolak atau perlu revisi** | Sprint 11 |
| US-28 | Sebagai **Validator**, saya ingin **melihat riwayat validasi per tabel** | Sprint 11 |

---

## 6. User Stories — Prioritas P3 (Sprint 12–15)

### US-REPORT: Report & Export

| ID | User Story | Sprint |
|----|-----------|--------|
| US-29 | Sebagai **Pimpinan**, saya ingin **export laporan LKPS ke Excel** | Sprint 13 |
| US-30 | Sebagai **Pimpinan**, saya ingin **export laporan ke Word sesuai format BAN-PT** | Sprint 13 |
| US-31 | Sebagai **Pimpinan**, saya ingin **export laporan ke PDF** | Sprint 13 |
| US-32 | Sebagai **user**, saya ingin **filter laporan berdasarkan tahun akademik** | Sprint 13 |

### US-NOTIF: Notification

| ID | User Story | Sprint |
|----|-----------|--------|
| US-33 | Sebagai **user**, saya ingin **menerima notifikasi in-app saat ada perubahan status** | Sprint 12 |
| US-34 | Sebagai **Operator**, saya ingin **menerima pengingat tabel yang belum diisi** | Sprint 12 |

### US-SETTINGS: Settings

| ID | User Story | Sprint |
|----|-----------|--------|
| US-35 | Sebagai **Admin**, saya ingin **melihat audit log aktivitas sistem** | Sprint 14 |
| US-36 | Sebagai **Admin**, saya ingin **melakukan backup database** | Sprint 15 |

---

## 7. Ringkasan Prioritas

| Prioritas | Jumlah US | Sprint | Deskripsi |
|-----------|-----------|--------|-----------|
| **P0** | 17 | 0–4 | Core: Auth, Dashboard, Master Data, BAB 1 |
| **P1** | 5 | 5–6 | BAB 2 Pendidikan |
| **P2** | 8 | 7–11 | BAB 3-6, Evidence, Validation |
| **P3** | 6 | 12–15 | Export, Notifikasi, Settings, Deployment |
| **Total** | **36** | 0–15 | — |

---

*Dokumen ini dibuat oleh PM Agent dan akan di-review sebelum diserahkan ke CTO Agent.*
