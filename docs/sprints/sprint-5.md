# Sprint 5: BAB 2 Pendidikan (Tabel 2.A.1)

## Requirement: Tabel 2.A.1 Data Mahasiswa
Sistem harus mengelola data mahasiswa dengan mekanisme **Auto-Shifting TS**.

### 1. Struktur Tabel
| Tahun Akademik | Daya Tampung | Pendaftar | Lulus Seleksi | Mhs Baru (Reg) | Mhs Baru (Trf) | Mhs Aktif (Reg) | Mhs Aktif (Trf) |
|---|---|---|---|---|---|---|---|
| TS-2 | (Auto) | (Auto) | (Auto) | (Auto) | (Auto) | (Auto) | (Auto) |
| TS-1 | (Auto) | (Auto) | (Auto) | (Auto) | (Auto) | (Auto) | (Auto) |
| TS   | [Input] | [Input] | [Input] | [Input] | [Input] | [Input] | [Input] |

### 2. Aturan Bisnis (Auto-Shifting)
- **Logika:** 
  - `Data(TS-1, Year_N)` = `Data(TS, Year_N-1)`
  - `Data(TS-2, Year_N)` = `Data(TS, Year_N-2)`
- **Input Boundary:** User hanya mengisi baris TS untuk tahun berjalan.
- **Data Source:** `TabelLkpsRow` dengan `TabelDefinition.kode = "2.A.1"`.

### 3. Acceptance Criteria
- [ ] User bisa memilih Tahun Akademik.
- [ ] Sistem otomatis menampilkan 2 tahun sebelumnya di bawah baris TS.
- [ ] Baris TS-1 dan TS-2 tidak bisa diedit jika data tahun lalu sudah disetujui (Approved).
- [ ] Total mahasiswa per kategori dihitung otomatis.

### 4. Tabel 2.A.2 Keragaman Asal Mahasiswa
- **Kolom:** Asal Sekolah/Daerah (Provinsi, Luar Provinsi, Luar Negeri).
- **Logika:** Shifting TS-2, TS-1, TS.

### 5. Tabel 2.A.3 Kondisi Jumlah Mahasiswa
- **Kolom:** Jml Mahasiswa Aktif, Jml Dosen Tetap (DTPR), Ratio.
- **Otomasi:** 
  - Jml Mhs Aktif = Link ke data total di 2.A.1.
  - Jml Dosen = Query dari model `Dosen`.

## Technical Task (CTO)
1. [ ] Create helper `getHistoricalYearData(tahunAkademikId, steps)` di `lib/utils/shifting.ts`.
2. [ ] Define metadata kolom 2.A.2 & 2.A.3 di `prisma/seed.ts`.
3. [ ] Build Server Action untuk auto-calculate ratio di 2.A.3.
