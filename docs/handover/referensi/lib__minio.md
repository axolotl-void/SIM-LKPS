# `lib/minio.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 64 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 1 berkas |

## Maksud berkas

Berkas ini menyediakan 4 fungsi utama: `ensureBucket`, `uploadFile`, `getDownloadUrl`, `deleteFile`.

## Letak berkas

Dari akar repo: `lib/minio.ts`.

## Isi yang bisa dipakai berkas lain

### `ensureBucket`

Jenis: **fungsi async**

Ensure the evidence bucket exists /

### `uploadFile`

Jenis: **fungsi async**

Upload a file to MinIO /

### `getDownloadUrl`

Jenis: **fungsi async**

Get a presigned URL for downloading a file /

### `deleteFile`

Jenis: **fungsi async**

Delete a file from MinIO /

## Pustaka luar yang dipakai

- `minio`

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`lib/actions/evidence.ts`](./lib__actions__evidence.md)

