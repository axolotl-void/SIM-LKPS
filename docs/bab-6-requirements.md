# 📋 BAB 6 — Kesesuaian Visi dan Misi (Requirements)

**Modul:** 09. BAB 6 Visi dan Misi  
**Tabel LKPS:** Tabel 6 — Kesesuaian Visi, Misi  
**Status:** Requirements Ready

---

## 1. Ringkasan Fitur

Tabel 6 mengelola keselarasan Visi dan Misi antara tingkat Perguruan Tinggi (PT), Unit Pengelola Program Studi (UPPS/Fakultas), dan Program Studi (PS).

---

## 2. Struktur Data Tabel 6

### Field Data
- `kategori`: Enum / Teks (`Visi`, `Misi`)
- `tingkat`: Enum / Teks (`PT`, `UPPS`, `PS`)
- `nomorUrut`: Angka urutan (khusus butir misi)
- `pernyataan`: Teks narasi Visi/Misi
- `keterangan`: Teks tambahan / link dokumen pendukung

---

## 3. User Stories

1. **Sebagai Operator:**
   - Dapat mengisi narasi Visi & Misi PT, UPPS, dan PS.
   - Dapat menyimpan sebagai Draft.
   - Dapat mengajukan validasi ke Validator (Status: DIAJUKAN).

2. **Sebagai Validator:**
   - Dapat melihat keselarasan Visi & Misi yang diajukan.
   - Dapat menyetujui (DISETUJUI), menolak (DITOLAK), atau meminta perbaikan (DIREVISI) dengan komentar wajib.

3. **Sebagai Pimpinan:**
   - Dapat melihat data Visi & Misi yang disetujui untuk laporan akreditasi.

---

## 4. Acceptance Criteria

1. **Input & Display:**
   - Menampilkan perbandingan kolom/baris: Visi PT, Visi UPPS, Visi Keilmuan PS.
   - Menampilkan daftar butir Misi PT, Misi UPPS, dan Misi PS.
2. **Workflow Validation:**
   - Menggunakan `ValidationControls` dan `ValidationHistory`.
   - Edit terkunci saat status `DIAJUKAN` atau `DISETUJUI`.
3. **UI / Styling:**
   - Menggunakan tema Soft UI konsisten dengan BAB 1–5.
