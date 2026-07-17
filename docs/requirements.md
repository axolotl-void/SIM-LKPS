# SIM-LKPS — Requirements Specification

**Versi:** 1.0  
**Sprint:** 0  
**Agent:** PM Agent  
**Tanggal:** 2026-07-16  
**Status:** DRAFT → IN REVIEW

---

## 1. Tujuan Proyek

Membangun **Sistem Informasi Manajemen Laporan Kinerja Program Studi (SIM-LKPS)** berbasis web untuk Program Studi Ilmu Komputer, Universitas Bina Bangsa Getsempena (UBBG).

### Masalah Utama yang Diselesaikan

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | Pengelolaan 31 tabel LKPS masih menggunakan Excel/Word | Data tersebar, rawan inkonsistensi, sulit dilacak |
| 2 | Tidak ada alur validasi terpusat | Validator tidak tahu data mana yang sudah siap direview |
| 3 | Bukti pendukung dikelola manual (folder lokal/email) | Sulit dikaitkan dengan data, rawan hilang |
| 4 | Tidak ada audit trail | Tidak bisa melacak siapa mengubah apa dan kapan |
| 5 | Ekspor laporan manual | Memakan waktu, format tidak seragam |
| 6 | Tidak ada dashboard progres | Pimpinan tidak bisa memantau kesiapan akreditasi secara real-time |

---

## 2. Ruang Lingkup

### 2.1 Scope MVP (Sprint 0–6)

Fitur inti yang **harus ada** di rilis pertama:

| Prioritas | Modul | Fitur |
|-----------|-------|-------|
| P0 | 00. Foundation | Setup project, coding standard, CI |
| P0 | 01. Auth & AuthZ | Login, logout, session, role (Admin/Operator/Validator/Pimpinan), permission, audit log |
| P0 | 02. Dashboard | Statistik pengisian, progres validasi, notifikasi |
| P0 | 03. Master Data | Prodi, tahun akademik, dosen, tendik, mahasiswa, mata kuliah, user management |
| P0 | 04. BAB 1 | 6 tabel Tata Pamong (1.A.1–1.A.5, 1.B) |
| P1 | 05. BAB 2 (1) | 6 tabel Pendidikan tahap 1 (2.A.1–2.A.3, 2.B.1–2.B.3) |
| P1 | 06. BAB 2 (2) | 5 tabel Pendidikan tahap 2 (2.B.4–2.D) |

### 2.2 Scope Non-MVP (Sprint 7–15)

Fitur yang dikerjakan **setelah** MVP stabil:

| Prioritas | Modul | Fitur |
|-----------|-------|-------|
| P2 | 07. BAB 3 | 6 tabel Penelitian |
| P2 | 08. BAB 4 | 5 tabel Pengabdian |
| P2 | 09. BAB 5 & 6 | 3 tabel Tata Kelola + Visi Misi |
| P2 | 10. Evidence | Upload, preview, metadata, versi dokumen |
| P2 | 11. Validation | Draft, submit, review, revision, approval, rejection |
| P3 | 12. Dashboard+ | Dashboard progres lengkap + notifikasi |
| P3 | 13. Export | Excel, Word, PDF, rekap, filter tahun akademik |
| P3 | 14. Testing | Integration test, E2E, hardening keamanan |
| P3 | 15. Deployment | Docker, VPS, CI/CD, monitoring, backup |

---

## 3. Functional Requirements

### FR-01: Authentication & Authorization

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-01.1 | User dapat login dengan email dan password | P0 |
| FR-01.2 | Sistem mendukung 4 role: Admin, Operator, Validator, Pimpinan | P0 |
| FR-01.3 | Setiap role memiliki permission yang berbeda (lihat Permission Matrix) | P0 |
| FR-01.4 | User dapat logout dan session dihapus | P0 |
| FR-01.5 | Admin dapat reset password user lain | P0 |
| FR-01.6 | Semua aktivitas login/logout dicatat di audit log | P0 |
| FR-01.7 | Session expire setelah periode tidak aktif (configurable) | P1 |

### FR-02: Dashboard

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-02.1 | Dashboard menampilkan jumlah tabel LKPS yang sudah diisi vs belum | P0 |
| FR-02.2 | Dashboard menampilkan progres validasi per BAB | P0 |
| FR-02.3 | Dashboard menampilkan notifikasi terbaru | P1 |
| FR-02.4 | Dashboard menampilkan aktivitas terbaru (audit log singkat) | P2 |
| FR-02.5 | Dashboard berbeda per role (Admin vs Operator vs Validator vs Pimpinan) | P1 |

### FR-03: Master Data

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-03.1 | CRUD Program Studi (nama, jenjang, kode) | P0 |
| FR-03.2 | CRUD Tahun Akademik (tahun, semester, status aktif) | P0 |
| FR-03.3 | CRUD Dosen (NIDN, nama, jabatan, pendidikan, status) | P0 |
| FR-03.4 | CRUD Tenaga Kependidikan (NIP, nama, jabatan, pendidikan) | P0 |
| FR-03.5 | CRUD Mahasiswa (NIM, nama, angkatan, status) | P0 |
| FR-03.6 | CRUD Mata Kuliah (kode, nama, SKS, semester, kategori) | P0 |
| FR-03.7 | CRUD User Management (tambah user, assign role, nonaktifkan) | P0 |
| FR-03.8 | Import data dari Excel/CSV | P2 |
| FR-03.9 | Filter dan pencarian di semua master data | P1 |

### FR-04: Tabel LKPS (31 Tabel)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-04.1 | Setiap tabel LKPS memiliki form input sesuai kolom resmi BAN-PT | P0 |
| FR-04.2 | Data tabel dikaitkan dengan tahun akademik | P0 |
| FR-04.3 | Data tabel dapat disimpan sebagai draft | P0 |
| FR-04.4 | Data tabel dapat disubmit untuk validasi | P0 |
| FR-04.5 | Tabel menampilkan status (Draft/Diajukan/Direvisi/Disetujui/Ditolak) | P0 |
| FR-04.6 | Tabel mendukung inline editing | P1 |
| FR-04.7 | Tabel mendukung bulk entry (tambah banyak baris sekaligus) | P2 |

### FR-05: Evidence Management

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-05.1 | Upload file bukti pendukung (PDF, gambar, dokumen) | P2 |
| FR-05.2 | Kaitkan bukti dengan data tabel tertentu | P2 |
| FR-05.3 | Preview file langsung di browser | P2 |
| FR-05.4 | Validasi tipe dan ukuran file | P2 |
| FR-05.5 | Versi dokumen (upload ulang tanpa kehilangan versi sebelumnya) | P3 |

### FR-06: Validation Workflow

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-06.1 | Operator submit tabel untuk validasi | P2 |
| FR-06.2 | Validator mereview dan memberi catatan per data atau per tabel | P2 |
| FR-06.3 | Validator dapat menyetujui atau menolak submission | P2 |
| FR-06.4 | Operator menerima notifikasi jika ada revisi | P2 |
| FR-06.5 | Riwayat validasi tercatat (siapa, kapan, keputusan) | P2 |

### FR-07: Report & Export

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-07.1 | Rekap data per tabel LKPS | P3 |
| FR-07.2 | Export tabel ke Excel (.xlsx) | P3 |
| FR-07.3 | Export laporan ke Word (.docx) | P3 |
| FR-07.4 | Export laporan ke PDF | P3 |
| FR-07.5 | Filter data berdasarkan tahun akademik | P3 |

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | **Response time** — Halaman load < 2 detik | LCP < 2s |
| NFR-02 | **Concurrent users** — Minimal 20 user simultan | 20+ users |
| NFR-03 | **Keamanan** — OWASP Top 10 ditangani | XSS, CSRF, SQLi, Auth bypass |
| NFR-04 | **Availability** — Uptime 99% selama jam kerja | 99% uptime |
| NFR-05 | **Data integrity** — Tidak ada data hilang saat concurrent edit | DB transaction isolation |
| NFR-06 | **Backup** — Database di-backup harian | Daily automated backup |
| NFR-07 | **Browser** — Mendukung Chrome, Firefox, Edge (versi terbaru) | Cross-browser |
| NFR-08 | **Responsif** — Minimal usable di tablet (breakpoint ≥ 768px) | Responsive design |
| NFR-09 | **Audit trail** — Semua perubahan data penting dicatat | Complete audit log |
| NFR-10 | **TypeScript strict** — Tidak ada tipe `any` tanpa alasan | Strict mode |

---

## 5. Daftar 31 Tabel LKPS

### BAB 1 — Tata Pamong (6 tabel)

| No | Kode | Nama Tabel | Deskripsi |
|----|------|-----------|-----------|
| 1 | 1.A.1 | Pimpinan dan Tupoksi UPPS dan PS | Data pimpinan universitas/prodi beserta tugas pokok dan fungsi |
| 2 | 1.A.2 | Sumber Pendanaan UPPS/PS | Sumber dan jumlah dana yang diterima |
| 3 | 1.A.3 | Penggunaan Dana UPPS/PS | Alokasi penggunaan dana per kategori |
| 4 | 1.A.4 | Rata-rata Beban DTPR per Semester (EWMP) pada TS | Ekuivalensi waktu mengajar penuh dosen |
| 5 | 1.A.5 | Kualifikasi Tenaga Kependidikan | Pendidikan dan keahlian tenaga kependidikan |
| 6 | 1.B | Unit SPMI dan SDM | Sistem penjaminan mutu internal |

### BAB 2 — Pendidikan (11 tabel)

| No | Kode | Nama Tabel |
|----|------|-----------|
| 7 | 2.A.1 | Data Mahasiswa |
| 8 | 2.A.2 | Keragaman Asal Mahasiswa |
| 9 | 2.A.3 | Kondisi Jumlah Mahasiswa |
| 10 | 2.B.1 | Isi Pembelajaran |
| 11 | 2.B.2 | Pemetaan CPL dan Profil Lulusan |
| 12 | 2.B.3 | Peta Pemenuhan CPL |
| 13 | 2.B.4 | Rata-rata Masa Tunggu Lulusan |
| 14 | 2.B.5 | Kesesuaian Bidang Kerja Lulusan |
| 15 | 2.B.6 | Kepuasan Pengguna Lulusan |
| 16 | 2.C | Fleksibilitas Proses Pembelajaran |
| 17 | 2.D | Rekognisi dan Apresiasi Kompetensi Lulusan |

### BAB 3 — Penelitian (6 tabel)

| No | Kode | Nama Tabel |
|----|------|-----------|
| 18 | 3.A.1 | Sarana dan Prasarana Penelitian |
| 19 | 3.A.2 | Penelitian DTPR, Hibah, dan Pembiayaan |
| 20 | 3.A.3 | Pengembangan DTPR di Bidang Penelitian |
| 21 | 3.C.1 | Kerja Sama Penelitian |
| 22 | 3.C.2 | Publikasi Penelitian |
| 23 | 3.C.3 | Perolehan HKI Penelitian |

### BAB 4 — Pengabdian (5 tabel)

| No | Kode | Nama Tabel |
|----|------|-----------|
| 24 | 4.A.1 | Sarana dan Prasarana PkM |
| 25 | 4.A.2 | PkM DTPR, Hibah, dan Pembiayaan |
| 26 | 4.C.1 | Kerja Sama PkM |
| 27 | 4.C.2 | Diseminasi Hasil PkM |
| 28 | 4.C.3 | Perolehan HKI PkM |

### BAB 5 — Tata Kelola (2 tabel)

| No | Kode | Nama Tabel |
|----|------|-----------|
| 29 | 5.1 | Sistem Tata Kelola |
| 30 | 5.2 | Sarana dan Prasarana Pendidikan |

### BAB 6 — Visi dan Misi (1 tabel)

| No | Kode | Nama Tabel |
|----|------|-----------|
| 31 | 6 | Kesesuaian Visi dan Misi |

---

## 6. Keputusan Teknologi (Confirmed)

| Keputusan | Pilihan | Alasan |
|-----------|---------|--------|
| **Authentication** | Auth.js (NextAuth v5) | Mature, community besar, banyak provider |
| **Storage** | MinIO | Self-hosted, S3-compatible, full control di VPS |
| **Frontend** | Next.js 15 App Router | Sesuai dokumen rancangan |
| **Database** | PostgreSQL | Sesuai dokumen rancangan |
| **ORM** | Prisma | Sesuai dokumen rancangan |
| **UI** | Tailwind CSS + shadcn/ui | Sesuai dokumen rancangan |
| **Validation** | Zod + React Hook Form | Sesuai dokumen rancangan |
| **Export** | ExcelJS, docx, Puppeteer | Sesuai dokumen rancangan |

---

## 7. Constraints & Assumptions

### Constraints
- Sistem hanya untuk 1 Program Studi (Ilmu Komputer UBBG)
- Deployment target: VPS (bukan serverless)
- Bahasa antarmuka: Bahasa Indonesia
- Data sesuai format BAN-PT terbaru

### Assumptions
- Struktur 31 tabel LKPS tidak berubah selama pengembangan
- Minimal 1 Admin sudah tersedia di database (seeded)
- VPS memiliki spesifikasi minimal 2 vCPU, 4 GB RAM, 40 GB storage
- Akses internet tersedia untuk pull Docker images

---

*Dokumen ini dibuat oleh PM Agent dan akan di-review sebelum diserahkan ke CTO Agent.*
