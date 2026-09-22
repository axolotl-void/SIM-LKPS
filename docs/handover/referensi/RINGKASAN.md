# Referensi Berkas SIM-LKPS

Dokumen ini **dihasilkan otomatis** dari kode yang benar-benar ada di repo.
Setiap berkas sumber punya halamannya sendiri di folder ini.

> **Jangan sunting berkas di folder ini dengan tangan.**
> Setelah kode diubah, jalankan ulang dari akar repo:
>
> ```bash
> node docs/handover/generate-referensi.mjs
> ```

Terakhir dibuat: 2026-09-22 · 271 berkas · 48.890 baris kode

## Cara memakai halaman ini

1. Cari berkas yang mau diubah di daftar bawah.
2. Buka halamannya — di situ ada maksud berkas, isi yang bisa dipakai
   berkas lain, dan **berkas mana saja yang ikut terdampak** kalau diubah.
3. Alamat URL yang dilayani tertera di bagian atas halaman.

Untuk tugas umum ("ganti logo", "tambah kolom tabel", "ubah warna"),
lebih cepat buka `../03-ubah-fitur-ini.md`.

## Halaman & API (App Router)

126 berkas · 16.931 baris

| Berkas | Baris | URL | Ringkas |
|---|---:|---|---|
| [`app/(auth)/layout.tsx`](./app__-auth-__layout.md) | 4 | — | AuthLayout |
| [`app/(auth)/login/login-form-section.tsx`](./app__-auth-__login__login-form-section.md) | 140 | — | LoginFormSection |
| [`app/(auth)/login/login-shell-client.tsx`](./app__-auth-__login__login-shell-client.md) | 84 | — | LoginShellClient |
| [`app/(auth)/login/login-visual.tsx`](./app__-auth-__login__login-visual.md) | 123 | — | LoginVisual |
| [`app/(auth)/login/page.tsx`](./app__-auth-__login__page.md) | 89 | `/login` | metadata, LoginPage |
| [`app/(dashboard)/dashboard/ActivityCard.tsx`](./app__-dashboard-__dashboard__ActivityCard.md) | 209 | — | ActivityCard |
| [`app/(dashboard)/dashboard/DashboardClient.tsx`](./app__-dashboard-__dashboard__DashboardClient.md) | 113 | — | DashboardClient |
| [`app/(dashboard)/dashboard/HeroBanner.tsx`](./app__-dashboard-__dashboard__HeroBanner.md) | 192 | — | HeroBanner |
| [`app/(dashboard)/dashboard/KPICards.tsx`](./app__-dashboard-__dashboard__KPICards.md) | 152 | — | KPICards |
| [`app/(dashboard)/dashboard/page.tsx`](./app__-dashboard-__dashboard__page.md) | 167 | `/dashboard` | metadata, DashboardPage |
| [`app/(dashboard)/dashboard/ProgressSection.tsx`](./app__-dashboard-__dashboard__ProgressSection.md) | 258 | — | ProgressSection |
| [`app/(dashboard)/dashboard/SummaryCard.tsx`](./app__-dashboard-__dashboard__SummaryCard.md) | 234 | — | SummaryCard, SummaryCardSkeleton, SummaryCardError |
| [`app/(dashboard)/dashboard/Topbar.tsx`](./app__-dashboard-__dashboard__Topbar.md) | 13 | — | This component is deprecated - header is now in the layout Kept for backwards compatibility but renders nothin |
| [`app/(dashboard)/developer/DeveloperClient.tsx`](./app__-dashboard-__developer__DeveloperClient.md) | 540 | — | DeveloperClient |
| [`app/(dashboard)/developer/page.tsx`](./app__-dashboard-__developer__page.md) | 140 | `/developer` | metadata, DeveloperPage |
| [`app/(dashboard)/error.tsx`](./app__-dashboard-__error.md) | 44 | — | DashboardError |
| [`app/(dashboard)/evidence/evidence-client.tsx`](./app__-dashboard-__evidence__evidence-client.md) | 489 | — | EvidenceClient |
| [`app/(dashboard)/evidence/page.tsx`](./app__-dashboard-__evidence__page.md) | 67 | `/evidence` | metadata, EvidencePage |
| [`app/(dashboard)/forbidden/page.tsx`](./app__-dashboard-__forbidden__page.md) | 21 | `/forbidden` | ForbiddenPage |
| [`app/(dashboard)/laporan/LaporanClient.tsx`](./app__-dashboard-__laporan__LaporanClient.md) | 241 | — | LaporanClient |
| [`app/(dashboard)/laporan/page.tsx`](./app__-dashboard-__laporan__page.md) | 107 | `/laporan` | metadata, LaporanPage |
| [`app/(dashboard)/layout.tsx`](./app__-dashboard-__layout.md) | 36 | — | DashboardLayout |
| [`app/(dashboard)/led/bab-1/page.tsx`](./app__-dashboard-__led__bab-1__page.md) | 46 | `/led/bab-1` | metadata, LedBab1Page |
| [`app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx`](./app__-dashboard-__led__bab-2__kondisi-eksternal__page.md) | 42 | `/led/bab-2/kondisi-eksternal` | metadata, LedKondisiEksternalPage |
| [`app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx`](./app__-dashboard-__led__bab-2__kriteria__-nomor-__page.md) | 82 | `/led/bab-2/kriteria/[nomor]` | metadata, LedKriteriaPage |
| [`app/(dashboard)/led/bab-2/page.tsx`](./app__-dashboard-__led__bab-2__page.md) | 139 | `/led/bab-2` | metadata, LedBab2Page |
| [`app/(dashboard)/led/bab-2/profil/page.tsx`](./app__-dashboard-__led__bab-2__profil__page.md) | 48 | `/led/bab-2/profil` | metadata, LedProfilPage |
| [`app/(dashboard)/led/bab-2/suplemen/page.tsx`](./app__-dashboard-__led__bab-2__suplemen__page.md) | 45 | `/led/bab-2/suplemen` | metadata, LedSuplemenPage |
| [`app/(dashboard)/led/bab-3/page.tsx`](./app__-dashboard-__led__bab-3__page.md) | 42 | `/led/bab-3` | metadata, LedBab3Page |
| [`app/(dashboard)/led/export/page.tsx`](./app__-dashboard-__led__export__page.md) | 218 | `/led/export` | metadata, LedExportPage |
| [`app/(dashboard)/led/page.tsx`](./app__-dashboard-__led__page.md) | 219 | `/led` | metadata, LedIndexPage |
| [`app/(dashboard)/lkps/kriteria-1/error.tsx`](./app__-dashboard-__lkps__kriteria-1__error.md) | 51 | — | Bab1Error |
| [`app/(dashboard)/lkps/kriteria-1/loading.tsx`](./app__-dashboard-__lkps__kriteria-1__loading.md) | 6 | — | Loading |
| [`app/(dashboard)/lkps/kriteria-1/page.tsx`](./app__-dashboard-__lkps__kriteria-1__page.md) | 186 | `/lkps/kriteria-1` | metadata, Bab1Page |
| [`app/(dashboard)/lkps/kriteria-1/tabel-1a1/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a1__page.md) | 135 | `/lkps/kriteria-1/tabel-1a1` | metadata, Tabel1A1Page |
| [`app/(dashboard)/lkps/kriteria-1/tabel-1a2/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a2__page.md) | 137 | `/lkps/kriteria-1/tabel-1a2` | metadata, Tabel1A2Page |
| [`app/(dashboard)/lkps/kriteria-1/tabel-1a3/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a3__page.md) | 225 | `/lkps/kriteria-1/tabel-1a3` | metadata, Tabel1A3Page |
| [`app/(dashboard)/lkps/kriteria-1/tabel-1a4/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a4__page.md) | 165 | `/lkps/kriteria-1/tabel-1a4` | metadata, Tabel1A4Page |
| [`app/(dashboard)/lkps/kriteria-1/tabel-1a5/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a5__page.md) | 160 | `/lkps/kriteria-1/tabel-1a5` | metadata, Tabel1A5Page |
| [`app/(dashboard)/lkps/kriteria-1/tabel-1b/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1b__page.md) | 160 | `/lkps/kriteria-1/tabel-1b` | metadata, Tabel1BPage |
| [`app/(dashboard)/lkps/kriteria-2/loading.tsx`](./app__-dashboard-__lkps__kriteria-2__loading.md) | 6 | — | Loading |
| [`app/(dashboard)/lkps/kriteria-2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__page.md) | 191 | `/lkps/kriteria-2` | metadata, Bab2Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2a1/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a1__page.md) | 165 | `/lkps/kriteria-2/tabel-2a1` | metadata, Tabel2A1Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2a2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a2__page.md) | 107 | `/lkps/kriteria-2/tabel-2a2` | metadata, Tabel2A2Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2a3/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a3__page.md) | 104 | `/lkps/kriteria-2/tabel-2a3` | metadata, Tabel2A3Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2b1/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b1__page.md) | 66 | `/lkps/kriteria-2/tabel-2b1` | metadata, Tabel2B1Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2b2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b2__page.md) | 63 | `/lkps/kriteria-2/tabel-2b2` | metadata, Tabel2B2Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2b3/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b3__page.md) | 63 | `/lkps/kriteria-2/tabel-2b3` | metadata, Tabel2B3Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2b4/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b4__page.md) | 204 | `/lkps/kriteria-2/tabel-2b4` | metadata, Tabel2B4Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2b5/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b5__page.md) | 136 | `/lkps/kriteria-2/tabel-2b5` | metadata, Tabel2B5Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2b6/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b6__page.md) | 98 | `/lkps/kriteria-2/tabel-2b6` | metadata, Tabel2B6Page |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2c/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2c__page.md) | 134 | `/lkps/kriteria-2/tabel-2c` | metadata, Tabel2CPage |
| [`app/(dashboard)/lkps/kriteria-2/tabel-2d/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2d__page.md) | 133 | `/lkps/kriteria-2/tabel-2d` | metadata, Tabel2DPage |
| [`app/(dashboard)/lkps/kriteria-3/error.tsx`](./app__-dashboard-__lkps__kriteria-3__error.md) | 8 | — | Bab3Error |
| [`app/(dashboard)/lkps/kriteria-3/loading.tsx`](./app__-dashboard-__lkps__kriteria-3__loading.md) | 6 | — | Loading |
| [`app/(dashboard)/lkps/kriteria-3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__page.md) | 186 | `/lkps/kriteria-3` | metadata, Bab3Page |
| [`app/(dashboard)/lkps/kriteria-3/tabel-3a1/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a1__page.md) | 132 | `/lkps/kriteria-3/tabel-3a1` | metadata, Tabel3A1Page |
| [`app/(dashboard)/lkps/kriteria-3/tabel-3a2/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a2__page.md) | 155 | `/lkps/kriteria-3/tabel-3a2` | metadata, Tabel3A2Page |
| [`app/(dashboard)/lkps/kriteria-3/tabel-3a3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a3__page.md) | 148 | `/lkps/kriteria-3/tabel-3a3` | metadata, Tabel3A3Page |
| [`app/(dashboard)/lkps/kriteria-3/tabel-3c1/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c1__page.md) | 150 | `/lkps/kriteria-3/tabel-3c1` | metadata, Tabel3C1Page |
| [`app/(dashboard)/lkps/kriteria-3/tabel-3c2/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c2__page.md) | 153 | `/lkps/kriteria-3/tabel-3c2` | metadata, Tabel3C2Page |
| [`app/(dashboard)/lkps/kriteria-3/tabel-3c3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c3__page.md) | 149 | `/lkps/kriteria-3/tabel-3c3` | metadata, Tabel3C3Page |
| [`app/(dashboard)/lkps/kriteria-4/loading.tsx`](./app__-dashboard-__lkps__kriteria-4__loading.md) | 6 | — | Loading |
| [`app/(dashboard)/lkps/kriteria-4/page.tsx`](./app__-dashboard-__lkps__kriteria-4__page.md) | 181 | `/lkps/kriteria-4` | metadata, Bab4Page |
| [`app/(dashboard)/lkps/kriteria-4/tabel-4a1/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4a1__page.md) | 149 | `/lkps/kriteria-4/tabel-4a1` | metadata, Tabel4A1Page |
| [`app/(dashboard)/lkps/kriteria-4/tabel-4a2/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4a2__page.md) | 154 | `/lkps/kriteria-4/tabel-4a2` | metadata, Tabel4A2Page |
| [`app/(dashboard)/lkps/kriteria-4/tabel-4c1/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c1__page.md) | 150 | `/lkps/kriteria-4/tabel-4c1` | metadata, Tabel4C1Page |
| [`app/(dashboard)/lkps/kriteria-4/tabel-4c2/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c2__page.md) | 152 | `/lkps/kriteria-4/tabel-4c2` | metadata, Tabel4C2Page |
| [`app/(dashboard)/lkps/kriteria-4/tabel-4c3/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c3__page.md) | 152 | `/lkps/kriteria-4/tabel-4c3` | metadata, Tabel4C3Page |
| [`app/(dashboard)/lkps/kriteria-5/loading.tsx`](./app__-dashboard-__lkps__kriteria-5__loading.md) | 6 | — | Loading |
| [`app/(dashboard)/lkps/kriteria-5/page.tsx`](./app__-dashboard-__lkps__kriteria-5__page.md) | 194 | `/lkps/kriteria-5` | metadata, Kriteria5Page |
| [`app/(dashboard)/lkps/kriteria-5/tabel-51/page.tsx`](./app__-dashboard-__lkps__kriteria-5__tabel-51__page.md) | 124 | `/lkps/kriteria-5/tabel-51` | metadata, Tabel51Page |
| [`app/(dashboard)/lkps/kriteria-5/tabel-52/page.tsx`](./app__-dashboard-__lkps__kriteria-5__tabel-52__page.md) | 149 | `/lkps/kriteria-5/tabel-52` | metadata, Tabel52Page |
| [`app/(dashboard)/lkps/kriteria-6/loading.tsx`](./app__-dashboard-__lkps__kriteria-6__loading.md) | 6 | — | Loading |
| [`app/(dashboard)/lkps/kriteria-6/page.tsx`](./app__-dashboard-__lkps__kriteria-6__page.md) | 195 | `/lkps/kriteria-6` | metadata, Bab6Page |
| [`app/(dashboard)/lkps/kriteria-6/tabel-61/page.tsx`](./app__-dashboard-__lkps__kriteria-6__tabel-61__page.md) | 160 | `/lkps/kriteria-6/tabel-61` | metadata, Tabel61Page |
| [`app/(dashboard)/lkps/kriteria-6/tabel-62/page.tsx`](./app__-dashboard-__lkps__kriteria-6__tabel-62__page.md) | 160 | `/lkps/kriteria-6/tabel-62` | metadata, Tabel62Page |
| [`app/(dashboard)/lkps/submissions/page.tsx`](./app__-dashboard-__lkps__submissions__page.md) | 104 | `/lkps/submissions` | metadata, SubmissionsPage |
| [`app/(dashboard)/lkps/submissions/submissions-client.tsx`](./app__-dashboard-__lkps__submissions__submissions-client.md) | 200 | — | SubmissionStatusClient |
| [`app/(dashboard)/lkps/validasi/page.tsx`](./app__-dashboard-__lkps__validasi__page.md) | 104 | `/lkps/validasi` | metadata, ValidasiPage |
| [`app/(dashboard)/loading.tsx`](./app__-dashboard-__loading.md) | 6 | — | No loading screen for dashboard — content loads fast enough. Full LoadingScreen only shows inside bab-* table  |
| [`app/(dashboard)/master/dosen/DosenActions.tsx`](./app__-dashboard-__master__dosen__DosenActions.md) | 110 | — | DosenActions |
| [`app/(dashboard)/master/dosen/new/NewDosenForm.tsx`](./app__-dashboard-__master__dosen__new__NewDosenForm.md) | 259 | — | NewDosenForm |
| [`app/(dashboard)/master/dosen/new/page.tsx`](./app__-dashboard-__master__dosen__new__page.md) | 17 | `/master/dosen/new` | NewDosenPage |
| [`app/(dashboard)/master/dosen/page.tsx`](./app__-dashboard-__master__dosen__page.md) | 130 | `/master/dosen` | metadata, DosenPage |
| [`app/(dashboard)/master/mahasiswa/[id]/edit/page.tsx`](./app__-dashboard-__master__mahasiswa__-id-__edit__page.md) | 27 | `/master/mahasiswa/[id]/edit` | EditMahasiswaPage |
| [`app/(dashboard)/master/mahasiswa/MahasiswaActions.tsx`](./app__-dashboard-__master__mahasiswa__MahasiswaActions.md) | 109 | — | MahasiswaActions |
| [`app/(dashboard)/master/mahasiswa/MahasiswaForm.tsx`](./app__-dashboard-__master__mahasiswa__MahasiswaForm.md) | 190 | — | MahasiswaForm |
| [`app/(dashboard)/master/mahasiswa/new/page.tsx`](./app__-dashboard-__master__mahasiswa__new__page.md) | 17 | `/master/mahasiswa/new` | NewMahasiswaPage |
| [`app/(dashboard)/master/mahasiswa/page.tsx`](./app__-dashboard-__master__mahasiswa__page.md) | 190 | `/master/mahasiswa` | metadata, MahasiswaPage |
| [`app/(dashboard)/master/mahasiswa/SearchBar.tsx`](./app__-dashboard-__master__mahasiswa__SearchBar.md) | 49 | — | SearchBar |
| [`app/(dashboard)/master/MasterActions.tsx`](./app__-dashboard-__master__MasterActions.md) | 44 | — | MasterActions |
| [`app/(dashboard)/master/mata-kuliah/[id]/edit/page.tsx`](./app__-dashboard-__master__mata-kuliah__-id-__edit__page.md) | 27 | `/master/mata-kuliah/[id]/edit` | EditMataKuliahPage |
| [`app/(dashboard)/master/mata-kuliah/MataKuliahActions.tsx`](./app__-dashboard-__master__mata-kuliah__MataKuliahActions.md) | 109 | — | MataKuliahActions |
| [`app/(dashboard)/master/mata-kuliah/MataKuliahForm.tsx`](./app__-dashboard-__master__mata-kuliah__MataKuliahForm.md) | 187 | — | MataKuliahForm |
| [`app/(dashboard)/master/mata-kuliah/new/page.tsx`](./app__-dashboard-__master__mata-kuliah__new__page.md) | 17 | `/master/mata-kuliah/new` | NewMataKuliahPage |
| [`app/(dashboard)/master/mata-kuliah/page.tsx`](./app__-dashboard-__master__mata-kuliah__page.md) | 182 | `/master/mata-kuliah` | metadata, MataKuliahPage |
| [`app/(dashboard)/master/mata-kuliah/SearchBar.tsx`](./app__-dashboard-__master__mata-kuliah__SearchBar.md) | 49 | — | SearchBar |
| [`app/(dashboard)/master/page.tsx`](./app__-dashboard-__master__page.md) | 430 | `/master` | metadata, MasterDataPage |
| [`app/(dashboard)/master/prodi/page.tsx`](./app__-dashboard-__master__prodi__page.md) | 28 | `/master/prodi` | metadata, ProdiPage |
| [`app/(dashboard)/master/prodi/prodi-view.tsx`](./app__-dashboard-__master__prodi__prodi-view.md) | 383 | — | ProdiItem, ProdiView |
| [`app/(dashboard)/master/tahun-akademik/page.tsx`](./app__-dashboard-__master__tahun-akademik__page.md) | 102 | `/master/tahun-akademik` | metadata, TahunAkademikPage |
| [`app/(dashboard)/not-found.tsx`](./app__-dashboard-__not-found.md) | 42 | — | NotFound |
| [`app/(dashboard)/penilaian/butir/[kode]/ButirPenilaianClient.tsx`](./app__-dashboard-__penilaian__butir__-kode-__ButirPenilaianClient.md) | 144 | — | ButirPenilaianClient |
| [`app/(dashboard)/penilaian/butir/[kode]/page.tsx`](./app__-dashboard-__penilaian__butir__-kode-__page.md) | 205 | `/penilaian/butir/[kode]` | metadata, ButirPenilaianPage |
| [`app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__KriteriaPenilaianClient.md) | 145 | — | KriteriaPenilaianClient |
| [`app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__page.md) | 159 | `/penilaian/kriteria/[kode]` | metadata, PenilaianKriteriaPage |
| [`app/(dashboard)/penilaian/page.tsx`](./app__-dashboard-__penilaian__page.md) | 199 | `/penilaian` | metadata, PenilaianPage |
| [`app/(dashboard)/settings/audit-log/page.tsx`](./app__-dashboard-__settings__audit-log__page.md) | 229 | `/settings/audit-log` | metadata, AuditLogPage |
| [`app/(dashboard)/settings/layout.tsx`](./app__-dashboard-__settings__layout.md) | 15 | — | metadata, SettingsLayout |
| [`app/(dashboard)/settings/page.tsx`](./app__-dashboard-__settings__page.md) | 6 | `/settings` | SettingsPage |
| [`app/(dashboard)/settings/SettingsShell.tsx`](./app__-dashboard-__settings__SettingsShell.md) | 121 | — | SettingsShell |
| [`app/(dashboard)/settings/users/page.tsx`](./app__-dashboard-__settings__users__page.md) | 92 | `/settings/users` | metadata, UsersPage |
| [`app/api/auth/[...nextauth]/route.ts`](./app__api__auth__-...nextauth-__route.md) | 4 | `/api/auth/[...nextauth]` | — |
| [`app/api/export/excel/route.ts`](./app__api__export__excel__route.md) | 248 | `/api/export/excel` | GET |
| [`app/api/export/led/pdf/route.ts`](./app__api__export__led__pdf__route.md) | 89 | `/api/export/led/pdf` | runtime, maxDuration, GET |
| [`app/api/export/led/word/route.ts`](./app__api__export__led__word__route.md) | 91 | `/api/export/led/word` | runtime, maxDuration, GET |
| [`app/api/export/route.ts`](./app__api__export__route.md) | 181 | `/api/export` | Export API Route Handles Excel, Word, PDF export requests / |
| [`app/api/export/word/route.ts`](./app__api__export__word__route.md) | 316 | `/api/export/word` | GET |
| [`app/api/health/route.ts`](./app__api__health__route.md) | 21 | `/api/health` | GET |
| [`app/api/master/dosen/route.ts`](./app__api__master__dosen__route.md) | 116 | `/api/master/dosen` | POST, GET |
| [`app/api/notifications/route.ts`](./app__api__notifications__route.md) | 46 | `/api/notifications` | GET |
| [`app/error.tsx`](./app__error.md) | 60 | — | GlobalError |
| [`app/globals.css`](./app__globals.md) | 1190 | — | — |
| [`app/layout.tsx`](./app__layout.md) | 64 | — | metadata, RootLayout |
| [`app/page.tsx`](./app__page.md) | 14 | `/` | HomePage |

## Komponen Antarmuka

67 berkas · 18.353 baris

| Berkas | Baris | URL | Ringkas |
|---|---:|---|---|
| [`components/forms/create-user-dialog.tsx`](./components__forms__create-user-dialog.md) | 157 | — | CreateUserDialog |
| [`components/forms/delete-user-dialog.tsx`](./components__forms__delete-user-dialog.md) | 145 | — | DeleteUserDialog |
| [`components/forms/edit-user-dialog.tsx`](./components__forms__edit-user-dialog.md) | 275 | — | EditableUser, EditUserDialog |
| [`components/forms/login-form.tsx`](./components__forms__login-form.md) | 238 | — | LoginForm |
| [`components/layout/developer-badge.tsx`](./components__layout__developer-badge.md) | 261 | — | DeveloperBadge |
| [`components/layout/header.tsx`](./components__layout__header.md) | 157 | — | Header |
| [`components/layout/NotificationBell.tsx`](./components__layout__NotificationBell.md) | 236 | — | NotificationBell |
| [`components/layout/sidebar.tsx`](./components__layout__sidebar.md) | 322 | — | Sidebar |
| [`components/layout/theme-sync.tsx`](./components__layout__theme-sync.md) | 60 | — | ThemeSync |
| [`components/layout/theme-toggle.tsx`](./components__layout__theme-toggle.md) | 56 | — | ThemeToggle |
| [`components/led/ikon.ts`](./components__led__ikon.md) | 32 | — | IKON_LED, ikonLed |
| [`components/led/LedAccordion.tsx`](./components__led__LedAccordion.md) | 89 | — | LedAccordion, LedBagianList |
| [`components/led/LedButirKartu.tsx`](./components__led__LedButirKartu.md) | 96 | — | LedButirKartu |
| [`components/led/LedEditor.tsx`](./components__led__LedEditor.md) | 272 | — | LedEditor |
| [`components/led/LedEvidenceList.tsx`](./components__led__LedEvidenceList.md) | 172 | — | LedEvidenceList |
| [`components/led/LedExportDialog.tsx`](./components__led__LedExportDialog.md) | 307 | — | RingkasExport, LedExportDialog |
| [`components/led/LedPageHeader.tsx`](./components__led__LedPageHeader.md) | 113 | — | LedPageHeader |
| [`components/led/LedProgressCard.tsx`](./components__led__LedProgressCard.md) | 145 | — | KartuLed, LedProgressCard, LedBatasBanner, LedBelumDiSeed |
| [`components/led/LedStatusSelect.tsx`](./components__led__LedStatusSelect.md) | 70 | — | LedStatusSelect |
| [`components/led/status.ts`](./components__led__status.md) | 38 | — | statusMeta, VARIAN_KELAS, statusKelas, ringkasProgres |
| [`components/led/types.ts`](./components__led__types.md) | 37 | — | LedBuktiData, LedIsianData, LedBagianData, HasilSimpan |
| [`components/navigation-events.tsx`](./components__navigation-events.md) | 33 | — | NavigationEvents |
| [`components/penilaian/AksiFinalisasi.tsx`](./components__penilaian__AksiFinalisasi.md) | 111 | — | AksiFinalisasi |
| [`components/penilaian/KriteriaBreakdown.tsx`](./components__penilaian__KriteriaBreakdown.md) | 129 | — | KriteriaBreakdown, KartuKriteriaRingkas |
| [`components/penilaian/SkorSelector.tsx`](./components__penilaian__SkorSelector.md) | 102 | — | SkorSelector, LegendaSkor |
| [`components/penilaian/StatusGauge.tsx`](./components__penilaian__StatusGauge.md) | 136 | — | StatusGauge |
| [`components/shared/DosenSelect.tsx`](./components__shared__DosenSelect.md) | 285 | — | DosenOption, DosenAccent, DosenSelect |
| [`components/shared/error-boundary.tsx`](./components__shared__error-boundary.md) | 67 | — | — |
| [`components/shared/permission-gate.tsx`](./components__shared__permission-gate.md) | 43 | — | PermissionGate |
| [`components/shared/skeleton.tsx`](./components__shared__skeleton.md) | 117 | — | Skeleton, CardSkeleton, TableRowSkeleton, FormSkeleton |
| [`components/shared/status-badge.tsx`](./components__shared__status-badge.md) | 99 | — | StatusBadge, DraftBadge, SubmittedBadge, ApprovedBadge |
| [`components/tables/tabel-1a1-client.tsx`](./components__tables__tabel-1a1-client.md) | 629 | — | Tabel1A1Client |
| [`components/tables/tabel-1a2-client.tsx`](./components__tables__tabel-1a2-client.md) | 623 | — | Tabel1A2Client |
| [`components/tables/tabel-1a3-client.tsx`](./components__tables__tabel-1a3-client.md) | 562 | — | Tabel1A3Client |
| [`components/tables/tabel-1a4-client.tsx`](./components__tables__tabel-1a4-client.md) | 722 | — | Tabel1A4Client |
| [`components/tables/tabel-1a5-client.tsx`](./components__tables__tabel-1a5-client.md) | 666 | — | Tabel1A5Client |
| [`components/tables/tabel-1b-client.tsx`](./components__tables__tabel-1b-client.md) | 713 | — | Tabel1BClient |
| [`components/tables/tabel-2a1-client.tsx`](./components__tables__tabel-2a1-client.md) | 402 | — | Tabel2A1Client |
| [`components/tables/tabel-2a2-client.tsx`](./components__tables__tabel-2a2-client.md) | 308 | — | Tabel2A2Client |
| [`components/tables/tabel-2a3-client.tsx`](./components__tables__tabel-2a3-client.md) | 400 | — | Tabel2A3Client |
| [`components/tables/tabel-2b1-client.tsx`](./components__tables__tabel-2b1-client.md) | 171 | — | Tabel2B1Client |
| [`components/tables/tabel-2b2-client.tsx`](./components__tables__tabel-2b2-client.md) | 105 | — | Tabel2B2Client |
| [`components/tables/tabel-2b3-client.tsx`](./components__tables__tabel-2b3-client.md) | 119 | — | Tabel2B3Client |
| [`components/tables/tabel-2b4-client.tsx`](./components__tables__tabel-2b4-client.md) | 388 | — | Tabel2B4Client |
| [`components/tables/tabel-2b5-client.tsx`](./components__tables__tabel-2b5-client.md) | 392 | — | Tabel2B5Client |
| [`components/tables/tabel-2b6-client.tsx`](./components__tables__tabel-2b6-client.md) | 353 | — | Tabel2B6Client |
| [`components/tables/tabel-2c-client.tsx`](./components__tables__tabel-2c-client.md) | 344 | — | Tabel2CClient |
| [`components/tables/tabel-2d-client.tsx`](./components__tables__tabel-2d-client.md) | 248 | — | Tabel2DClient |
| [`components/tables/tabel-3a1-client.tsx`](./components__tables__tabel-3a1-client.md) | 586 | — | Tabel3A1Client |
| [`components/tables/tabel-3a2-client.tsx`](./components__tables__tabel-3a2-client.md) | 575 | — | Tabel3A2Client |
| [`components/tables/tabel-3a3-client.tsx`](./components__tables__tabel-3a3-client.md) | 303 | — | Tabel3A3Client |
| [`components/tables/tabel-3c1-client.tsx`](./components__tables__tabel-3c1-client.md) | 228 | — | Tabel3C1Client |
| [`components/tables/tabel-3c2-client.tsx`](./components__tables__tabel-3c2-client.md) | 222 | — | Tabel3C2Client |
| [`components/tables/tabel-3c3-client.tsx`](./components__tables__tabel-3c3-client.md) | 202 | — | Tabel3C3Client |
| [`components/tables/tabel-4a1-client.tsx`](./components__tables__tabel-4a1-client.md) | 600 | — | Tabel4A1Client |
| [`components/tables/tabel-4a2-client.tsx`](./components__tables__tabel-4a2-client.md) | 591 | — | Tabel4A2Client |
| [`components/tables/tabel-4c1-client.tsx`](./components__tables__tabel-4c1-client.md) | 225 | — | Tabel4C1Client |
| [`components/tables/tabel-4c2-client.tsx`](./components__tables__tabel-4c2-client.md) | 347 | — | Tabel4C2Client |
| [`components/tables/tabel-4c3-client.tsx`](./components__tables__tabel-4c3-client.md) | 344 | — | Tabel4C3Client |
| [`components/tables/tabel-51-client.tsx`](./components__tables__tabel-51-client.md) | 585 | — | Tabel51Client |
| [`components/tables/tabel-52-client.tsx`](./components__tables__tabel-52-client.md) | 612 | — | Tabel52Client |
| [`components/tables/tabel-61-client.tsx`](./components__tables__tabel-61-client.md) | 432 | — | Tabel61Client |
| [`components/tables/tabel-62-client.tsx`](./components__tables__tabel-62-client.md) | 390 | — | Tabel62Client |
| [`components/tables/user-table.tsx`](./components__tables__user-table.md) | 192 | — | UserTable |
| [`components/tables/validation-controls.tsx`](./components__tables__validation-controls.md) | 205 | — | ValidationControls |
| [`components/tables/validation-history.tsx`](./components__tables__validation-history.md) | 98 | — | ValidationHistory |
| [`components/ui/loading-screen.tsx`](./components__ui__loading-screen.md) | 71 | — | Loading |

## Logika Server, Utilitas, Export

41 berkas · 6.964 baris

| Berkas | Baris | URL | Ringkas |
|---|---:|---|---|
| [`lib/actions/auth.ts`](./lib__actions__auth.md) | 170 | — | LoginState, loginAction, logoutAction |
| [`lib/actions/evidence.ts`](./lib__actions__evidence.md) | 292 | — | uploadEvidence, getEvidenceList, deleteEvidence, addEvidenceLink |
| [`lib/actions/led.ts`](./lib__actions__led.md) | 311 | — | saveLedIsian, setLedStatus, addLedEvidence, deleteLedEvidence |
| [`lib/actions/lkps.ts`](./lib__actions__lkps.md) | 572 | — | upsertLkpsRow, deleteLkpsRow, submitLkpsTabel, validateLkpsTabel |
| [`lib/actions/mahasiswa.ts`](./lib__actions__mahasiswa.md) | 129 | — | createMahasiswa, updateMahasiswa, deleteMahasiswa |
| [`lib/actions/matakuliah.ts`](./lib__actions__matakuliah.md) | 129 | — | createMatakuliah, updateMatakuliah, deleteMatakuliah |
| [`lib/actions/notification.ts`](./lib__actions__notification.md) | 48 | — | markNotificationAsRead, markAllNotificationsAsRead |
| [`lib/actions/penilaian.ts`](./lib__actions__penilaian.md) | 333 | — | setSkor, setSkorBanyak, finalisasiSesi, bukaKembaliSesi |
| [`lib/actions/user.ts`](./lib__actions__user.md) | 279 | — | getUsers, createUser, updateUser, deleteUser |
| [`lib/auth.config.ts`](./lib__auth.config.md) | 69 | — | authConfig |
| [`lib/auth.ts`](./lib__auth.md) | 103 | — | KODE_TERLALU_BANYAK |
| [`lib/config/developer.ts`](./lib__config__developer.md) | 52 | — | DeveloperInfo, developer |
| [`lib/db.ts`](./lib__db.md) | 14 | — | db |
| [`lib/export/excel.ts`](./lib__export__excel.md) | 341 | — | Excel Export Module Generates Excel (.xlsx) files using ExcelJS Single sheet, all tables grouped by BAB with p |
| [`lib/export/helpers.ts`](./lib__export__helpers.md) | 187 | — | Export Helper Functions Shared data fetching for Excel, Word, PDF exports / |
| [`lib/export/led-docx.ts`](./lib__export__led-docx.md) | 493 | — | Pembangun Word (`.docx`) untuk dokumen LED. Format mengikuti Lampiran 2 Instrumen LED LAM INFOKOM 2.1: A4, Ari |
| [`lib/export/led-dokumen.ts`](./lib__export__led-dokumen.md) | 390 | — | Lapisan dokumen LED — MURNI, tanpa DB/React. Mengubah daftar bagian LED + narasi Markdown menjadi urutan simpu |
| [`lib/export/led-pdf.tsx`](./lib__export__led-pdf.md) | 277 | — | Pembangun PDF untuk dokumen LED. Memakai `@react-pdf/renderer` (JS murni) — bukan Playwright/Chromium, yang ga |
| [`lib/export/pdf.tsx`](./lib__export__pdf.md) | 399 | — | PDF Export Module Generates PDF files using @react-pdf/renderer (pure JS, serverless-ready). Replaces the prev |
| [`lib/export/word.ts`](./lib__export__word.md) | 395 | — | Word Export Module Generates Word (.docx) files using docx library Single document with all tables grouped by  |
| [`lib/format.ts`](./lib__format.md) | 32 | — | formatDate, formatCurrency, formatNumber, formatSKS |
| [`lib/minio.ts`](./lib__minio.md) | 64 | — | ensureBucket, uploadFile, getDownloadUrl, deleteFile |
| [`lib/notifikasi-internal.ts`](./lib__notifikasi-internal.md) | 124 | — | createNotification, notifyMutation |
| [`lib/types/auth.ts`](./lib__types__auth.md) | 23 | — | — |
| [`lib/utils/audit.ts`](./lib__utils__audit.md) | 62 | — | createAuditLog, logAccessDenied |
| [`lib/utils/db-retry.ts`](./lib__utils__db-retry.md) | 65 | — | Retry untuk operasi database yang gagal karena gangguan koneksi sesaat. Database produksi ada di Neon (serverl |
| [`lib/utils/format.ts`](./lib__utils__format.md) | 75 | — | cn, formatRupiah, formatDate, formatDateTime |
| [`lib/utils/kriteria-led.ts`](./lib__utils__kriteria-led.md) | 13 | — | Daftar 6 kriteria LED LAM INFOKOM 2.1 beserta bobotnya. |
| [`lib/utils/kriteria.ts`](./lib__utils__kriteria.md) | 48 | — | Pemetaan kriteria LKPS — LAM INFOKOM 2.1 Instrumen LKPS tidak memakai istilah "BAB" (itu milik LED). Penomoran |
| [`lib/utils/led-export-query.ts`](./lib__utils__led-export-query.md) | 50 | — | ikutkanBagianKosong, KonteksExportLed, siapkanExportLed, daftarTahunAkademik |
| [`lib/utils/led-progress.ts`](./lib__utils__led-progress.md) | 138 | — | KARAKTER_PER_HALAMAN, BATAS_HALAMAN_LED, BATAS_KARAKTER_PER_BAGIAN, RingkasanIsian |
| [`lib/utils/led-query.ts`](./lib__utils__led-query.md) | 104 | — | STATUS_KOSONG, ambilBagianLed, ambilRingkasanLed, ambilStatusPerKode |
| [`lib/utils/led-rute.ts`](./lib__utils__led-rute.md) | 19 | — | Pemetaan kode bagian LED → rute halaman editornya. Dipakai untuk menautkan daftar bagian kosong di dialog expo |
| [`lib/utils/login-rate-limit.ts`](./lib__utils__login-rate-limit.md) | 205 | — | Pembatas percobaan login — berbasis DATABASE, bukan memori proses. MASALAH YANG DIPERBAIKI Pembatas sebelumnya |
| [`lib/utils/markdown.tsx`](./lib__utils__markdown.md) | 231 | — | renderMarkdown |
| [`lib/utils/penilaian-query.ts`](./lib__utils__penilaian-query.md) | 105 | — | tahunAktifPenilaian, sesiPenilaian, ButirLengkap, ambilButirPenilaian |
| [`lib/utils/penilaian.ts`](./lib__utils__penilaian.md) | 317 | — | Kalkulasi Matriks Penilaian LAM INFOKOM 2.1. Fungsi di file ini MURNI (tanpa DB, tanpa React) supaya gampang d |
| [`lib/utils/permissions.ts`](./lib__utils__permissions.md) | 153 | — | hasPermission, hasAllPermissions, hasAnyPermission, getRolePermissions |
| [`lib/utils/pesan-galat.ts`](./lib__utils__pesan-galat.md) | 70 | — | Pesan galat yang aman ditampilkan ke pengguna. MASALAH YANG DIPERBAIKI Beberapa halaman menampilkan `error.mes |
| [`lib/validations/auth.ts`](./lib__validations__auth.md) | 32 | — | loginSchema, createUserSchema, updateUserSchema, resetPasswordSchema |
| [`lib/validations/master.ts`](./lib__validations__master.md) | 51 | — | tahunAkademikSchema, dosenSchema, mahasiswaSchema, mataKuliahSchema |

## Skema & Seed Basis Data

6 berkas · 3.718 baris

| Berkas | Baris | URL | Ringkas |
|---|---:|---|---|
| [`prisma/schema.prisma`](./prisma__schema.md) | 571 | — | SIM-LKPS — Initial Prisma Schema Agent: CTO Agent Sprint: 0 Version: 1.0 |
| [`prisma/seed-data/butir-penilaian.json`](./prisma__seed-data__butir-penilaian.md) | 1398 | — | — |
| [`prisma/seed-data/led-bagian.json`](./prisma__seed-data__led-bagian.md) | 980 | — | — |
| [`prisma/seed-led.ts`](./prisma__seed-led.md) | 177 | — | Seed modul LED + Matriks Penilaian — LAM INFOKOM 2.1 Modul terpisah dari seed LKPS supaya tidak mengganggu dat |
| [`prisma/seed-modul-baru.ts`](./prisma__seed-modul-baru.md) | 28 | — | Entry point khusus modul LED + Matriks Penilaian. Dipakai untuk mengisi DB yang SUDAH ADA ISINYA tanpa menjala |
| [`prisma/seed.ts`](./prisma__seed.md) | 564 | — | — |

## Pengujian

25 berkas · 2.484 baris

| Berkas | Baris | URL | Ringkas |
|---|---:|---|---|
| [`tests/access-denied.spec.ts`](./tests__access-denied.spec.md) | 64 | — | — |
| [`tests/auth.spec.ts`](./tests__auth.spec.md) | 39 | — | — |
| [`tests/cleanup-dosen-uji.mjs`](./tests__cleanup-dosen-uji.md) | 26 | — | Hapus baris dosen uji (NIDN 9999999999) dari database. Dipakai setelah tests/e2e-dosen-http.mjs, karena API ti |
| [`tests/db-retry.test.ts`](./tests__db-retry.test.md) | 77 | — | — |
| [`tests/e2e-dosen-http.mjs`](./tests__e2e-dosen-http.md) | 188 | — | Uji end-to-end endpoint POST /api/master/dosen lewat HTTP sungguhan. Alur: ambil CSRF -> login kredensial -> P |
| [`tests/export-led.spec.ts`](./tests__export-led.spec.md) | 170 | — | — |
| [`tests/export.spec.ts`](./tests__export.spec.md) | 36 | — | — |
| [`tests/fixtures.ts`](./tests__fixtures.md) | 95 | — | ROLES, RoleKey, STORAGE_BY_ROLE, login |
| [`tests/global-setup-penilaian.ts`](./tests__global-setup-penilaian.md) | 37 | — | globalSetup |
| [`tests/global-setup-pesan.ts`](./tests__global-setup-pesan.md) | 38 | — | Persiapan sebelum uji "pesan pembatas login". Uji itu sengaja menghabiskan kuota percobaan gagal (10x) untuk s |
| [`tests/led.spec.ts`](./tests__led.spec.md) | 184 | — | — |
| [`tests/lkps-tables.spec.ts`](./tests__lkps-tables.spec.md) | 151 | — | — |
| [`tests/middleware-guard.spec.ts`](./tests__middleware-guard.spec.md) | 87 | — | — |
| [`tests/penilaian.spec.ts`](./tests__penilaian.spec.md) | 199 | — | — |
| [`tests/permissions.spec.ts`](./tests__permissions.spec.md) | 69 | — | — |
| [`tests/playwright-pesan.config.ts`](./tests__playwright-pesan.config.md) | 22 | — | — |
| [`tests/playwright.config.ts`](./tests__playwright.config.md) | 33 | — | — |
| [`tests/setup.ts`](./tests__setup.md) | 13 | — | — |
| [`tests/uji-pesan-pembatas.spec.ts`](./tests__uji-pesan-pembatas.spec.md) | 87 | — | — |
| [`tests/unit/bug-01-permission-dosen.test.ts`](./tests__unit__bug-01-permission-dosen.test.md) | 37 | — | — |
| [`tests/unit/led-dokumen.test.ts`](./tests__unit__led-dokumen.test.md) | 267 | — | — |
| [`tests/unit/penilaian.test.ts`](./tests__unit__penilaian.test.md) | 301 | — | — |
| [`tests/unit/permission-guards.test.ts`](./tests__unit__permission-guards.test.md) | 175 | — | — |
| [`tests/utils.test.ts`](./tests__utils.test.md) | 52 | — | — |
| [`tests/workflow.spec.ts`](./tests__workflow.spec.md) | 37 | — | — |

## Berkas Akar Repo

6 berkas · 440 baris

| Berkas | Baris | URL | Ringkas |
|---|---:|---|---|
| [`docker-compose.yml`](./docker-compose.yml.md) | 57 | — | — |
| [`eslint.config.js`](./eslint.config.md) | 27 | — | — |
| [`middleware.ts`](./middleware.md) | 174 | — | middleware, config |
| [`next.config.ts`](./next.config.md) | 57 | — | — |
| [`package.json`](./package.md) | 94 | — | — |
| [`tsconfig.json`](./tsconfig.md) | 31 | — | — |

