# `lib/utils/format.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 75 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 18 berkas |

## Maksud berkas

Berkas ini menyediakan 7 fungsi utama: `cn`, `formatRupiah`, `formatDate`, `formatDateTime`, `truncate`, `capitalize`, `getInitials`.

## Letak berkas

Dari akar repo: `lib/utils/format.ts`.

## Isi yang bisa dipakai berkas lain

### `cn`

Jenis: **fungsi**

Merge Tailwind CSS classes safely /

### `formatRupiah`

Jenis: **fungsi**

Format number as Indonesian Rupiah /

### `formatDate`

Jenis: **fungsi**

Format date to Indonesian locale /

### `formatDateTime`

Jenis: **fungsi**

Format date with time /

### `truncate`

Jenis: **fungsi**

Truncate text to a max length /

### `capitalize`

Jenis: **fungsi**

Capitalize first letter /

### `getInitials`

Jenis: **fungsi**

Generate initials from name /

## Pustaka luar yang dipakai

- `clsx`
- `tailwind-merge`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/led/export/page.tsx`](./app__-dashboard-__led__export__page.md)
- [`app/(dashboard)/penilaian/butir/[kode]/ButirPenilaianClient.tsx`](./app__-dashboard-__penilaian__butir__-kode-__ButirPenilaianClient.md)
- [`app/(dashboard)/penilaian/butir/[kode]/page.tsx`](./app__-dashboard-__penilaian__butir__-kode-__page.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/KriteriaPenilaianClient.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__KriteriaPenilaianClient.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__page.md)
- [`app/(dashboard)/settings/audit-log/page.tsx`](./app__-dashboard-__settings__audit-log__page.md)
- [`components/led/LedAccordion.tsx`](./components__led__LedAccordion.md)
- [`components/led/LedButirKartu.tsx`](./components__led__LedButirKartu.md)
- [`components/led/LedEditor.tsx`](./components__led__LedEditor.md)
- [`components/led/LedExportDialog.tsx`](./components__led__LedExportDialog.md)
- [`components/led/LedProgressCard.tsx`](./components__led__LedProgressCard.md)
- [`components/led/LedStatusSelect.tsx`](./components__led__LedStatusSelect.md)
- [`components/penilaian/KriteriaBreakdown.tsx`](./components__penilaian__KriteriaBreakdown.md)
- [`components/penilaian/SkorSelector.tsx`](./components__penilaian__SkorSelector.md)
- [`components/penilaian/StatusGauge.tsx`](./components__penilaian__StatusGauge.md)
- [`components/shared/skeleton.tsx`](./components__shared__skeleton.md)
- [`components/shared/status-badge.tsx`](./components__shared__status-badge.md)
- [`components/tables/user-table.tsx`](./components__tables__user-table.md)

