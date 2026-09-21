# Rancangan — Menutup Celah Izin di Server Action

**Tanggal:** 22 Sep 2026
**Status:** dijalankan
**Latar:** lanjutan audit `RANCANGAN-KEAMANAN.md` (21 Sep 2026)

---

## Koreksi temuan lama: formula injection = TIDAK VALID

`RANCANGAN-KEAMANAN.md` mencatat "formula injection di ekspor Excel" sebagai temuan
terbuka. **Temuan itu salah.**

Bukti (dijalankan 22 Sep 2026):

1. `ws.getCell(1,1).value = String("=1+1")` pada ExcelJS 4.4.0 → `xl/worksheets/sheet1.xml`
   berisi `<c r="A1" t="s"><v>0</v></c>` — tipe **shared string**, bukan elemen `<f>`.
   `Value.getType()` di `lib/doc/cell.js:1081` hanya masuk cabang Formula kalau nilainya
   **objek** `{formula: …}`, sedangkan `String(value)` selalu menghasilkan tipe `String`.
2. Dibuka ulang lewat LibreOffice headless (`--convert-to csv`) → sel berisi teks literal
   `=1+1`, **bukan** hasil `2`.

Jadi menambahkan filter `^[=+\-@]` di `lib/export/excel.ts` **tidak menambah keamanan
apa pun**. Yang perlu dikoreksi adalah dokumen auditnya, bukan kodenya.

Catatan: `lib/export/led-dokumen.ts` → `sanitasiTeks()` juga bukan penjaga formula
(hanya rapikan tipografi) — pernyataan itu tetap benar.

---

## Temuan nyata: server action hanya memeriksa "sudah login", bukan izin

`middleware.ts` hanya menjaga apakah pengguna sudah login. Izin ditentukan di server
action. Beberapa action **tidak memeriksanya**.

### Celah 1 — `lib/actions/evidence.ts` (5 action)

Semua hanya `if (!session?.user?.id)`. Akibatnya PIMPINAN — yang menurut
`lib/utils/permissions.ts` tidak punya satu pun izin `evidence.*` — bisa
mengunggah, menghapus, dan menautkan bukti pendukung.

### Celah 2 — `lib/actions/mahasiswa.ts` + `lib/actions/matakuliah.ts` (6 action)

Sama: hanya cek login. PIMPINAN bisa membuat/mengubah/menghapus mahasiswa dan mata kuliah.

### Celah 3 — `lib/actions/lkps.ts` → `updateDosen` (baris 494), `deleteDosen` (baris 529)

Hanya cek login, padahal `createDosen` (baris 424) sudah benar memeriksa
`master.dosen.create`. Jadi siapa pun yang login bisa mengubah/menghapus dosen.

### Kenapa ini nyata, bukan teoretis

Semua action ini diekspor lewat direktif `"use server"`. Server action adalah endpoint
POST publik; menyembunyikan tombol di sidebar **tidak** menutup pemanggilannya. Tambahan
pula, dua action ini mengubah data yang **dipakai di laporan akreditasi**.

### Koreksi asumsi yang perlu disetujui Yogi

1. **`/master/mahasiswa` + `/master/mata-kuliah` jadi milik ADMIN.** Di
   `lib/utils/permissions.ts`, OPERATOR memang tidak punya izin `master_data.*` untuk
   tulis (hanya `master_data.read` dan `master.dosen.create`). Sidebar juga menaruh
   "Master Data" hanya untuk ADMIN. Jadi OPERATOR **tetap bisa melihat** halaman
   (punya `master_data.read`), tapi tombol Tambah/Edit/Hapus disembunyikan.
2. **PIMPINAN kehilangan akses `/evidence`.** Sidebar sudah membatasinya ke
   ADMIN+OPERATOR; halaman `/evidence` sekarang lolos untuk semua yang login. Yang
   disamakan ke perilaku sidebar, bukan sebaliknya.
3. **`updateDosen`/`deleteDosen` = ADMIN saja.** OPERATOR sengaja diberi
   `master.dosen.create` (bisa menambah, tidak bisa mengubah/menghapus) — itu tertulis
   di skill. Jadi `.update`/`.delete` memang bukan miliknya.

---

## Perubahan yang dikerjakan

| # | Berkas | Perubahan |
|---|---|---|
| 1 | `lib/utils/permissions.ts` | OPERATOR dapat `evidence.delete` |
| 2 | `lib/actions/evidence.ts` | 5 action diberi cek izin |
| 3 | `lib/actions/mahasiswa.ts` | 3 action → `master_data.create/update/delete` |
| 4 | `lib/actions/matakuliah.ts` | 3 action → idem |
| 5 | `lib/actions/lkps.ts` | `updateDosen`/`deleteDosen` → `master.dosen.update/delete` |
| 6 | `lib/actions/notification.ts` | `createNotification` pakai `notifyMutation` (dalam), bukan action publik |
| 7 | `app/(dashboard)/master/{mahasiswa,mata-kuliah,dosen}` | guard halaman + tombol kondisional |
| 8 | `app/(dashboard)/evidence/page.tsx` + `evidence-client.tsx` | guard `evidence.read` + tombol hapus kondisional |
| 9 | `tests/unit/permission-guards.test.ts` | uji regresi matriks izin |

### Pola yang dipakai

Mengikuti yang sudah ada di `lkps.ts`:

```ts
const role = session.user.role as Role;
if (!hasPermission(role, "…")) {
  logAccessDenied("…", "…", "missing_permission", { role });
  throw new Error("Anda tidak memiliki izin …");
}
```

`logAccessDenied` sudah dipakai di tempat lain, jadi penolakan ikut tercatat di audit log.

---

## Cara verifikasi (bertingkat, tanpa vision)

1. **Unit** — `tests/unit/permission-guards.test.ts`: matriks izin, termasuk penjaga
   regresi bahwa PIMPINAN tidak punya izin tulis mana pun.
2. **Statis** — `npx eslint components/ app/ lib/` (bukan `pnpm lint`) + `pnpm type-check`.
3. **HTTP nyata (Playwright, `channel: "chrome"`)** — login PIMPINAN, panggil langsung
   server action lewat `page.evaluate` dan pastikan **ditolak**; login OPERATOR untuk
   memastikan yang seharusnya boleh tetap boleh. Ini bukti yang tidak bisa dipalsukan UI.
4. **UI** — pastikan tombol Tambah/Hapus tidak tampil untuk peran yang tidak berhak.

Prasyarat: Docker Desktop hidup (DB `sim_lkps_uji`), dev server jalan.
