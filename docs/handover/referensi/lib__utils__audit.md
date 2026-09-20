# `lib/utils/audit.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 62 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 10 berkas |

## Maksud berkas

Berkas ini menyediakan 2 fungsi utama: `createAuditLog`, `logAccessDenied`.

## Letak berkas

Dari akar repo: `lib/utils/audit.ts`.

## Isi yang bisa dipakai berkas lain

### `createAuditLog`

Jenis: **fungsi async**

Create an audit log entry /

### `logAccessDenied`

Jenis: **fungsi**

Log an access denied attempt (fire-and-forget). Use this BEFORE throwing on permission/state checks so admin can audit rejected mutations via /settings/audit-log. /

## Berkas lain di proyek ini yang dipanggil

- [`lib/auth.ts`](./lib__auth.md)
- [`lib/db.ts`](./lib__db.md)

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/api/export/led/pdf/route.ts`](./app__api__export__led__pdf__route.md)
- [`app/api/export/led/word/route.ts`](./app__api__export__led__word__route.md)
- [`app/api/master/dosen/route.ts`](./app__api__master__dosen__route.md)
- [`lib/actions/evidence.ts`](./lib__actions__evidence.md)
- [`lib/actions/led.ts`](./lib__actions__led.md)
- [`lib/actions/lkps.ts`](./lib__actions__lkps.md)
- [`lib/actions/mahasiswa.ts`](./lib__actions__mahasiswa.md)
- [`lib/actions/matakuliah.ts`](./lib__actions__matakuliah.md)
- [`lib/actions/penilaian.ts`](./lib__actions__penilaian.md)
- [`lib/actions/user.ts`](./lib__actions__user.md)

