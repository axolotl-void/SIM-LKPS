# `lib/utils/permissions.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 152 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 62 berkas |

## Maksud berkas

Berkas ini menyediakan 6 fungsi utama: `hasPermission`, `hasAllPermissions`, `hasAnyPermission`, `getRolePermissions`, `canEditTable`, `canDeleteRow`.

## Letak berkas

Dari akar repo: `lib/utils/permissions.ts`.

## Isi yang bisa dipakai berkas lain

### `hasPermission`

Jenis: **fungsi**

Check if a role has a specific permission /

### `hasAllPermissions`

Jenis: **fungsi**

Check multiple permissions (AND logic) /

### `hasAnyPermission`

Jenis: **fungsi**

Check multiple permissions (OR logic) /

### `getRolePermissions`

Jenis: **fungsi**

Get all permissions for a role /

### `ROLE_LABELS`

Jenis: **konstanta**

Role display names in Indonesian /

### `STATUS_LABELS`

Jenis: **konstanta**

Table status labels for UI display /

### `STATUS_COLORS`

Jenis: **konstanta**

Status colors for badges /

### `canEditTable`

Jenis: **fungsi**

Check if user can edit a table based on status and role ADMIN: can edit all statuses OPERATOR: can edit DRAFT, DIREVISI, DITOLAK only PIMPINAN: cannot edit any /

### `canDeleteRow`

Jenis: **fungsi**

Check if user can delete rows from a table based on status and role Same rules as canEditTable /

## Pustaka luar yang dipakai

- `@prisma/client`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/dashboard/page.tsx`](./app__-dashboard-__dashboard__page.md)
- [`app/(dashboard)/led/bab-1/page.tsx`](./app__-dashboard-__led__bab-1__page.md)
- [`app/(dashboard)/led/bab-2/kondisi-eksternal/page.tsx`](./app__-dashboard-__led__bab-2__kondisi-eksternal__page.md)
- [`app/(dashboard)/led/bab-2/kriteria/[nomor]/page.tsx`](./app__-dashboard-__led__bab-2__kriteria__-nomor-__page.md)
- [`app/(dashboard)/led/bab-2/profil/page.tsx`](./app__-dashboard-__led__bab-2__profil__page.md)
- [`app/(dashboard)/led/bab-2/suplemen/page.tsx`](./app__-dashboard-__led__bab-2__suplemen__page.md)
- [`app/(dashboard)/led/bab-3/page.tsx`](./app__-dashboard-__led__bab-3__page.md)
- [`app/(dashboard)/led/export/page.tsx`](./app__-dashboard-__led__export__page.md)
- [`app/(dashboard)/led/page.tsx`](./app__-dashboard-__led__page.md)
- [`app/(dashboard)/lkps/kriteria-6/page.tsx`](./app__-dashboard-__lkps__kriteria-6__page.md)
- [`app/(dashboard)/penilaian/butir/[kode]/page.tsx`](./app__-dashboard-__penilaian__butir__-kode-__page.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__page.md)
- [`app/(dashboard)/penilaian/page.tsx`](./app__-dashboard-__penilaian__page.md)
- [`app/(dashboard)/settings/audit-log/page.tsx`](./app__-dashboard-__settings__audit-log__page.md)
- [`app/(dashboard)/settings/users/page.tsx`](./app__-dashboard-__settings__users__page.md)
- [`app/api/export/excel/route.ts`](./app__api__export__excel__route.md)
- [`app/api/export/led/pdf/route.ts`](./app__api__export__led__pdf__route.md)
- [`app/api/export/led/word/route.ts`](./app__api__export__led__word__route.md)
- [`app/api/export/route.ts`](./app__api__export__route.md)
- [`app/api/export/word/route.ts`](./app__api__export__word__route.md)
- [`app/api/master/dosen/route.ts`](./app__api__master__dosen__route.md)
- [`components/forms/edit-user-dialog.tsx`](./components__forms__edit-user-dialog.md)
- [`components/shared/permission-gate.tsx`](./components__shared__permission-gate.md)
- [`components/tables/tabel-1a1-client.tsx`](./components__tables__tabel-1a1-client.md)
- [`components/tables/tabel-1a2-client.tsx`](./components__tables__tabel-1a2-client.md)
- [`components/tables/tabel-1a3-client.tsx`](./components__tables__tabel-1a3-client.md)
- [`components/tables/tabel-1a4-client.tsx`](./components__tables__tabel-1a4-client.md)
- [`components/tables/tabel-1a5-client.tsx`](./components__tables__tabel-1a5-client.md)
- [`components/tables/tabel-1b-client.tsx`](./components__tables__tabel-1b-client.md)
- [`components/tables/tabel-2a1-client.tsx`](./components__tables__tabel-2a1-client.md)
- [`components/tables/tabel-2a2-client.tsx`](./components__tables__tabel-2a2-client.md)
- [`components/tables/tabel-2a3-client.tsx`](./components__tables__tabel-2a3-client.md)
- [`components/tables/tabel-2b1-client.tsx`](./components__tables__tabel-2b1-client.md)
- [`components/tables/tabel-2b2-client.tsx`](./components__tables__tabel-2b2-client.md)
- [`components/tables/tabel-2b3-client.tsx`](./components__tables__tabel-2b3-client.md)
- [`components/tables/tabel-2b4-client.tsx`](./components__tables__tabel-2b4-client.md)
- [`components/tables/tabel-2b5-client.tsx`](./components__tables__tabel-2b5-client.md)
- [`components/tables/tabel-2b6-client.tsx`](./components__tables__tabel-2b6-client.md)
- [`components/tables/tabel-2c-client.tsx`](./components__tables__tabel-2c-client.md)
- [`components/tables/tabel-2d-client.tsx`](./components__tables__tabel-2d-client.md)
- [`components/tables/tabel-3a1-client.tsx`](./components__tables__tabel-3a1-client.md)
- [`components/tables/tabel-3a2-client.tsx`](./components__tables__tabel-3a2-client.md)
- [`components/tables/tabel-3a3-client.tsx`](./components__tables__tabel-3a3-client.md)
- [`components/tables/tabel-3c1-client.tsx`](./components__tables__tabel-3c1-client.md)
- [`components/tables/tabel-3c2-client.tsx`](./components__tables__tabel-3c2-client.md)
- [`components/tables/tabel-3c3-client.tsx`](./components__tables__tabel-3c3-client.md)
- [`components/tables/tabel-4a1-client.tsx`](./components__tables__tabel-4a1-client.md)
- [`components/tables/tabel-4a2-client.tsx`](./components__tables__tabel-4a2-client.md)
- [`components/tables/tabel-4c1-client.tsx`](./components__tables__tabel-4c1-client.md)
- [`components/tables/tabel-4c2-client.tsx`](./components__tables__tabel-4c2-client.md)
- [`components/tables/tabel-4c3-client.tsx`](./components__tables__tabel-4c3-client.md)
- [`components/tables/tabel-51-client.tsx`](./components__tables__tabel-51-client.md)
- [`components/tables/tabel-52-client.tsx`](./components__tables__tabel-52-client.md)
- [`components/tables/tabel-6-client.tsx`](./components__tables__tabel-6-client.md)
- [`components/tables/tabel-61-client.tsx`](./components__tables__tabel-61-client.md)
- [`components/tables/tabel-62-client.tsx`](./components__tables__tabel-62-client.md)
- [`components/tables/user-table.tsx`](./components__tables__user-table.md)
- [`lib/actions/led.ts`](./lib__actions__led.md)
- [`lib/actions/lkps.ts`](./lib__actions__lkps.md)
- [`lib/actions/penilaian.ts`](./lib__actions__penilaian.md)
- [`lib/actions/user.ts`](./lib__actions__user.md)
- [`tests/unit/bug-01-permission-dosen.test.ts`](./tests__unit__bug-01-permission-dosen.test.md)

