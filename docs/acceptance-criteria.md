# SIM-LKPS — Acceptance Criteria

**Versi:** 1.0  
**Sprint:** 0  
**Agent:** PM Agent  
**Tanggal:** 2026-07-16  
**Status:** DRAFT → IN REVIEW

---

## Format

Setiap acceptance criteria menggunakan format **Given/When/Then** dan dikategorikan:
- ✅ **Automated** — dapat diverifikasi dengan unit/integration test
- 👁️ **Manual** — perlu verifikasi visual atau interaksi manusia

---

## Sprint 0: Project Foundation

### AC-S0.1: Setup Repository ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Repository kosong | `npm run dev` dijalankan | Aplikasi berjalan di localhost:3000 tanpa error | ✅ Automated |
| 2 | Project di-clone | `npm install` selesai | Semua dependency terinstal tanpa warning critical | ✅ Automated |
| 3 | TypeScript strict mode aktif | Kode ditulis tanpa tipe | Compiler menampilkan error | ✅ Automated |
| 4 | ESLint + Prettier terkonfigurasi | `npm run lint` dijalankan | Tidak ada error lint | ✅ Automated |

### AC-S0.2: Database Connection ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | PostgreSQL berjalan | `npx prisma db push` dijalankan | Schema berhasil di-push ke database | ✅ Automated |
| 2 | Prisma schema valid | `npx prisma generate` dijalankan | Client terbentuk tanpa error | ✅ Automated |
| 3 | Seed data tersedia | `npx prisma db seed` dijalankan | Data awal (Admin user, tahun akademik default) tersedia | ✅ Automated |

---

## Sprint 1: Authentication & Authorization

### AC-S1.1: Login ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | User terdaftar dengan email `admin@ubbg.ac.id` dan password valid | User mengisi form login dan submit | Redirect ke dashboard sesuai role, session aktif | ✅ Automated |
| 2 | Email tidak terdaftar | User mengisi email salah dan submit | Pesan error "Email atau password salah" ditampilkan | ✅ Automated |
| 3 | Password salah | User mengisi password salah dan submit | Pesan error "Email atau password salah" ditampilkan | ✅ Automated |
| 4 | Form login | Kedua field kosong, klik submit | Validasi client-side menampilkan pesan "wajib diisi" | ✅ Automated |

### AC-S1.2: Logout ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | User sudah login | Klik tombol Logout | Session dihapus, redirect ke halaman login | ✅ Automated |
| 2 | Session sudah dihapus | User mengakses halaman dashboard langsung via URL | Redirect otomatis ke halaman login | ✅ Automated |

### AC-S1.3: Role & Permission ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Operator login | Akses halaman User Management | Redirect ke 403 Forbidden atau dashboard | ✅ Automated |
| 2 | Admin login | Akses halaman User Management | Halaman tampil dengan daftar user | ✅ Automated |
| 3 | Validator login | Akses halaman input tabel LKPS | Tabel tampil read-only, tombol edit tidak muncul | ✅ Automated |
| 4 | Pimpinan login | Akses halaman Settings | Redirect ke 403 Forbidden | ✅ Automated |

### AC-S1.4: User Management (Admin Only) ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Admin di halaman User Management | Klik "Tambah User", isi form, submit | User baru tersimpan, muncul di tabel | ✅ Automated |
| 2 | Admin di halaman User Management | Klik edit user, ubah role, simpan | Role user berubah, permission updated | ✅ Automated |
| 3 | Admin di halaman User Management | Klik nonaktifkan user | User tidak bisa login lagi, muncul badge "Nonaktif" | ✅ Automated |
| 4 | Admin di halaman User Management | Klik reset password | Password direset, user diberitahu melalui notifikasi/email | ✅ Automated |

### AC-S1.5: Audit Log ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | User login berhasil | Cek audit log | Entry "User [email] logged in" tercatat dengan timestamp | ✅ Automated |
| 2 | Admin membuat user baru | Cek audit log | Entry "Admin created user [email]" tercatat | ✅ Automated |
| 3 | Data tabel LKPS diubah | Cek audit log | Entry perubahan tercatat (who, what, when, old value, new value) | ✅ Automated |

---

## Sprint 2: Layout & Dashboard

### AC-S2.1: Layout Aplikasi 👁️

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | User login | Buka halaman apapun | Sidebar navigasi tampil dengan menu sesuai role | 👁️ Manual |
| 2 | User di desktop (≥1024px) | Lihat layout | Sidebar di kiri, konten di kanan, header di atas | 👁️ Manual |
| 3 | User di tablet (768px–1023px) | Lihat layout | Sidebar bisa di-toggle (hamburger menu) | 👁️ Manual |
| 4 | Menu navigasi | Klik menu BAB 1 | Submenu tabel 1.A.1–1.B tampil | 👁️ Manual |

### AC-S2.2: Dashboard Operator 👁️

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Operator login | Buka dashboard | Tampil card statistik: total tabel (31), terisi, belum terisi, disubmit | 👁️ Manual |
| 2 | 5 dari 31 tabel sudah diisi | Lihat dashboard | Progress bar menunjukkan 5/31 (~16%) | ✅ Automated |
| 3 | Ada submission ditolak | Lihat dashboard | Notifikasi "2 submission perlu revisi" tampil | ✅ Automated |

### AC-S2.3: Dashboard Validator 👁️

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Validator login | Buka dashboard | Tampil antrian submission pending review | 👁️ Manual |
| 2 | 3 submission pending | Lihat dashboard | Badge "3 menunggu review" tampil | ✅ Automated |

### AC-S2.4: Dashboard Pimpinan 👁️

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Pimpinan login | Buka dashboard | Tampil overview progres per BAB (chart/progress bar) | 👁️ Manual |
| 2 | Semua tabel BAB 1 disetujui | Lihat dashboard | BAB 1 menunjukkan 100% complete | ✅ Automated |

### AC-S2.5: Master Tahun Akademik ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Admin di halaman Master Tahun Akademik | Klik "Tambah", isi "2024/2025 Ganjil" | Tahun akademik tersimpan, tampil di tabel | ✅ Automated |
| 2 | Admin edit tahun akademik | Ubah status menjadi "Aktif" | Hanya 1 tahun akademik berstatus Aktif | ✅ Automated |
| 3 | Admin hapus tahun akademik | Klik hapus, konfirmasi | Tahun akademik terhapus (soft delete jika ada data terkait) | ✅ Automated |

---

## Sprint 3: Master Data

### AC-S3.1: Master Dosen ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Admin di halaman Master Dosen | Klik "Tambah", isi NIDN, nama, jabatan, pendidikan, status | Dosen tersimpan, tampil di tabel | ✅ Automated |
| 2 | Admin input NIDN duplikat | Submit form | Error "NIDN sudah terdaftar" tampil | ✅ Automated |
| 3 | Ada 50 data dosen | Ketik "Dr." di search | Data difilter, hanya dosen dengan "Dr." yang tampil | ✅ Automated |
| 4 | Admin di halaman Master Dosen | Klik export | Data dosen di-download sebagai Excel | ✅ Automated |

### AC-S3.2: Master Mahasiswa ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Admin di halaman Master Mahasiswa | Tambah mahasiswa (NIM, nama, angkatan, status) | Mahasiswa tersimpan | ✅ Automated |
| 2 | NIM duplikat | Submit form | Error "NIM sudah terdaftar" | ✅ Automated |
| 3 | Filter angkatan | Pilih angkatan 2023 | Hanya mahasiswa angkatan 2023 yang tampil | ✅ Automated |

### AC-S3.3: Master Mata Kuliah ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Admin di halaman Master Mata Kuliah | Tambah MK (kode, nama, SKS, semester, kategori) | MK tersimpan | ✅ Automated |
| 2 | Kode MK duplikat | Submit form | Error "Kode MK sudah terdaftar" | ✅ Automated |

---

## Sprint 4: BAB 1 — Tata Pamong

### AC-S4.1: Tabel 1.A.1 — Pimpinan dan Tupoksi ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Operator buka tabel 1.A.1 | Form input tampil sesuai kolom BAN-PT (No, Nama, NIDN, Jabatan, Tupoksi) | Form valid dan sesuai format | 👁️ Manual |
| 2 | Operator isi data pimpinan | Klik "Simpan Draft" | Data tersimpan, status "Draft" | ✅ Automated |
| 3 | Operator submit tabel | Klik "Submit" | Status berubah ke "Diajukan", Validator diberitahu | ✅ Automated |
| 4 | Validator review tabel 1.A.1 | Klik "Setuju" | Status berubah ke "Disetujui" | ✅ Automated |
| 5 | Data dikaitkan dengan TA | Pilih TA 2024/2025 | Data hanya menampilkan entri untuk TA tersebut | ✅ Automated |

### AC-S4.2: Tabel 1.A.2 — Sumber Pendanaan ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Operator buka tabel 1.A.2 | Form input: Sumber Dana, Jumlah (Rp), Tahun | Form numeric validation aktif | ✅ Automated |
| 2 | Operator isi jumlah negatif | Submit | Error "Jumlah harus positif" | ✅ Automated |
| 3 | Total otomatis dihitung | 3 baris sumber dana diisi | Total di footer tabel ter-update otomatis | ✅ Automated |

### AC-S4.3: Tabel 1.A.4 — Beban EWMP ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Operator buka tabel 1.A.4 | Form: NIDN, Nama Dosen, Pendidikan, Penelitian, PkM, Tugas Tambahan, Total | Kolom sesuai format EWMP BAN-PT | 👁️ Manual |
| 2 | Operator isi EWMP > 12 sks | Submit | Warning "EWMP melebihi batas normal" tampil | ✅ Automated |
| 3 | Total EWMP otomatis | Isi per kategori | Total = Pendidikan + Penelitian + PkM + Tugas Tambahan (otomatis) | ✅ Automated |

---

## Cross-Cutting Acceptance Criteria (Semua Sprint)

### CC-01: Loading State 👁️

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Halaman sedang load | — | Skeleton/spinner tampil, bukan blank screen | 👁️ Manual |
| 2 | Form sedang submit | — | Tombol disabled, spinner tampil, double submit dicegah | ✅ Automated |

### CC-02: Error State ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | API gagal (500/network error) | — | Toast error "Terjadi kesalahan, silakan coba lagi" tampil | ✅ Automated |
| 2 | Validasi form gagal | — | Pesan error ditampilkan di bawah field yang bermasalah | ✅ Automated |

### CC-03: Empty State 👁️

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | Tabel belum ada data | Buka halaman | Pesan "Belum ada data" + tombol "Tambah" tampil | 👁️ Manual |
| 2 | Pencarian tidak menemukan hasil | — | Pesan "Data tidak ditemukan" tampil | 👁️ Manual |

### CC-04: Permission State ✅

| # | Given | When | Then | Verifikasi |
|---|-------|------|------|------------|
| 1 | User tidak punya akses | Akses URL restricted | Redirect ke 403 atau dashboard | ✅ Automated |
| 2 | Tombol aksi di luar permission | — | Tombol hidden atau disabled | ✅ Automated |

---

## Ringkasan

| Sprint | Jumlah AC | Automated | Manual |
|--------|-----------|:---------:|:------:|
| Sprint 0 | 7 | 7 | 0 |
| Sprint 1 | 16 | 16 | 0 |
| Sprint 2 | 14 | 7 | 7 |
| Sprint 3 | 9 | 9 | 0 |
| Sprint 4 | 11 | 9 | 2 |
| Cross-cutting | 6 | 4 | 2 |
| **Total** | **63** | **52** | **11** |

---

*Dokumen ini dibuat oleh PM Agent dan akan di-review sebelum diserahkan ke CTO Agent.*
