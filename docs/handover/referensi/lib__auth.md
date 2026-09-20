# `lib/auth.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 98 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 88 berkas |

## Maksud berkas

Berkas ini tidak mengekspor apa pun ke luar — dipakai sekali di tempatnya sendiri.

## Letak berkas

Dari akar repo: `lib/auth.ts`.

## Pustaka luar yang dipakai

- `@auth/prisma-adapter`
- `@prisma/client`
- `bcryptjs`
- `next-auth`
- `zod`

## Berkas lain di proyek ini yang dipanggil

- [`lib/db.ts`](./lib__db.md)
- [`lib/utils/db-retry.ts`](./lib__utils__db-retry.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(auth)/login/page.tsx`](./app__-auth-__login__page.md)
- [`app/(dashboard)/dashboard/page.tsx`](./app__-dashboard-__dashboard__page.md)
- [`app/(dashboard)/developer/page.tsx`](./app__-dashboard-__developer__page.md)
- [`app/(dashboard)/evidence/page.tsx`](./app__-dashboard-__evidence__page.md)
- [`app/(dashboard)/laporan/page.tsx`](./app__-dashboard-__laporan__page.md)
- [`app/(dashboard)/layout.tsx`](./app__-dashboard-__layout.md)
- [`app/(dashboard)/led/bab-1/page.tsx`](./app__-dashboard-__led__bab-1__page.md)
- [`app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx`](./app__-dashboard-__led__bab-2__kondisi-eksternal__page.md)
- [`app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx`](./app__-dashboard-__led__bab-2__kriteria__-nomor-__page.md)
- [`app/(dashboard)/led/bab-2/page.tsx`](./app__-dashboard-__led__bab-2__page.md)
- [`app/(dashboard)/led/bab-2/profil/page.tsx`](./app__-dashboard-__led__bab-2__profil__page.md)
- [`app/(dashboard)/led/bab-2/suplemen/page.tsx`](./app__-dashboard-__led__bab-2__suplemen__page.md)
- [`app/(dashboard)/led/bab-3/page.tsx`](./app__-dashboard-__led__bab-3__page.md)
- [`app/(dashboard)/led/export/page.tsx`](./app__-dashboard-__led__export__page.md)
- [`app/(dashboard)/led/page.tsx`](./app__-dashboard-__led__page.md)
- [`app/(dashboard)/lkps/kriteria-1/page.tsx`](./app__-dashboard-__lkps__kriteria-1__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a1/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a1__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a2/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a2__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a3/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a3__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a4/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a4__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1a5/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1a5__page.md)
- [`app/(dashboard)/lkps/kriteria-1/tabel-1b/page.tsx`](./app__-dashboard-__lkps__kriteria-1__tabel-1b__page.md)
- [`app/(dashboard)/lkps/kriteria-2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2a1/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a1__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2a2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a2__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2a3/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2a3__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b1/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b1__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b2/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b2__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b3/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b3__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b4/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b4__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b5/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b5__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2b6/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2b6__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2c/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2c__page.md)
- [`app/(dashboard)/lkps/kriteria-2/tabel-2d/page.tsx`](./app__-dashboard-__lkps__kriteria-2__tabel-2d__page.md)
- [`app/(dashboard)/lkps/kriteria-3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3a1/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a1__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3a2/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a2__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3a3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3a3__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3c1/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c1__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3c2/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c2__page.md)
- [`app/(dashboard)/lkps/kriteria-3/tabel-3c3/page.tsx`](./app__-dashboard-__lkps__kriteria-3__tabel-3c3__page.md)
- [`app/(dashboard)/lkps/kriteria-4/page.tsx`](./app__-dashboard-__lkps__kriteria-4__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4a1/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4a1__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4a2/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4a2__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4c1/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c1__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4c2/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c2__page.md)
- [`app/(dashboard)/lkps/kriteria-4/tabel-4c3/page.tsx`](./app__-dashboard-__lkps__kriteria-4__tabel-4c3__page.md)
- [`app/(dashboard)/lkps/kriteria-5-6/page.tsx`](./app__-dashboard-__lkps__kriteria-5-6__page.md)
- [`app/(dashboard)/lkps/kriteria-5-6/tabel-51/page.tsx`](./app__-dashboard-__lkps__kriteria-5-6__tabel-51__page.md)
- [`app/(dashboard)/lkps/kriteria-5-6/tabel-52/page.tsx`](./app__-dashboard-__lkps__kriteria-5-6__tabel-52__page.md)
- [`app/(dashboard)/lkps/kriteria-6/page.tsx`](./app__-dashboard-__lkps__kriteria-6__page.md)
- [`app/(dashboard)/lkps/kriteria-6/tabel-61/page.tsx`](./app__-dashboard-__lkps__kriteria-6__tabel-61__page.md)
- [`app/(dashboard)/lkps/kriteria-6/tabel-62/page.tsx`](./app__-dashboard-__lkps__kriteria-6__tabel-62__page.md)
- [`app/(dashboard)/lkps/submissions/page.tsx`](./app__-dashboard-__lkps__submissions__page.md)
- [`app/(dashboard)/lkps/validasi/page.tsx`](./app__-dashboard-__lkps__validasi__page.md)
- [`app/(dashboard)/master/dosen/page.tsx`](./app__-dashboard-__master__dosen__page.md)
- [`app/(dashboard)/master/mahasiswa/[id]/edit/page.tsx`](./app__-dashboard-__master__mahasiswa__-id-__edit__page.md)
- [`app/(dashboard)/master/mahasiswa/page.tsx`](./app__-dashboard-__master__mahasiswa__page.md)
- [`app/(dashboard)/master/mata-kuliah/[id]/edit/page.tsx`](./app__-dashboard-__master__mata-kuliah__-id-__edit__page.md)
- [`app/(dashboard)/master/mata-kuliah/page.tsx`](./app__-dashboard-__master__mata-kuliah__page.md)
- [`app/(dashboard)/master/page.tsx`](./app__-dashboard-__master__page.md)
- [`app/(dashboard)/master/prodi/page.tsx`](./app__-dashboard-__master__prodi__page.md)
- [`app/(dashboard)/master/tahun-akademik/page.tsx`](./app__-dashboard-__master__tahun-akademik__page.md)
- [`app/(dashboard)/penilaian/butir/[kode]/page.tsx`](./app__-dashboard-__penilaian__butir__-kode-__page.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__page.md)
- [`app/(dashboard)/penilaian/page.tsx`](./app__-dashboard-__penilaian__page.md)
- [`app/(dashboard)/settings/audit-log/page.tsx`](./app__-dashboard-__settings__audit-log__page.md)
- [`app/(dashboard)/settings/users/page.tsx`](./app__-dashboard-__settings__users__page.md)
- [`app/api/auth/[...nextauth]/route.ts`](./app__api__auth__-...nextauth-__route.md)
- [`app/api/export/excel/route.ts`](./app__api__export__excel__route.md)
- [`app/api/export/led/pdf/route.ts`](./app__api__export__led__pdf__route.md)
- [`app/api/export/led/word/route.ts`](./app__api__export__led__word__route.md)
- [`app/api/export/route.ts`](./app__api__export__route.md)
- [`app/api/export/word/route.ts`](./app__api__export__word__route.md)
- [`app/api/master/dosen/route.ts`](./app__api__master__dosen__route.md)
- [`app/api/notifications/route.ts`](./app__api__notifications__route.md)
- [`app/page.tsx`](./app__page.md)
- [`components/shared/permission-gate.tsx`](./components__shared__permission-gate.md)
- [`lib/actions/auth.ts`](./lib__actions__auth.md)
- [`lib/actions/evidence.ts`](./lib__actions__evidence.md)
- [`lib/actions/led.ts`](./lib__actions__led.md)
- [`lib/actions/lkps.ts`](./lib__actions__lkps.md)
- [`lib/actions/mahasiswa.ts`](./lib__actions__mahasiswa.md)
- [`lib/actions/matakuliah.ts`](./lib__actions__matakuliah.md)
- [`lib/actions/notification.ts`](./lib__actions__notification.md)
- [`lib/actions/penilaian.ts`](./lib__actions__penilaian.md)
- [`lib/actions/user.ts`](./lib__actions__user.md)
- [`lib/utils/audit.ts`](./lib__utils__audit.md)

