# `lib/utils/penilaian.ts`

| | |
|---|---|
| **Area** | Logika Server, Utilitas, Export |
| **Ukuran** | 317 baris |
| **Jenis** | modul biasa |
| **Dipakai oleh** | 9 berkas |

## Maksud berkas

Kalkulasi Matriks Penilaian LAM INFOKOM 2.1. Fungsi di file ini MURNI (tanpa DB, tanpa React) supaya gampang di-unit-test: nilai akhir berbobot, rerata per kriteria, dan prediksi status akreditasi. ## Rumus nilai akhir PDF §III/§IV menulis bobot sebagai "Bobot dari 400" dengan skor tiap butir 1–4 (Sangat baik 4 · Baik 3 · Cukup 2 · Kurang 1). Supaya nilai akhir jatuh di skala 0–400, jumlah berbobot HARUS dinormalisasi dengan skor maksimum: nilaiAkhir = Σ(skor × bobot) / 4 Ini dicek silang dengan ambang resmi §V — kalau tanpa dibagi 4, skor seragam 1 pun menghasilkan 400 dan ambang "< 200 Tidak Terakreditasi" jadi mustahil. Dengan normalisasi: semua skor 4 → 400   (Unggul 5 tahun) semua skor 3 → 300   (Terakreditasi) semua skor 2 → 200   (Terakreditasi, batas bawah) semua skor 1 → 100   (Tidak Terakreditasi) ## Ambang status (§V) < 200        → Tidak Terakreditasi 200 – 320    → Terakreditasi 321 – 360    → Unggul 3 tahun  (kalau syarat terpenuhi) ≥ 361        → Unggul 5 tahun  (kalau syarat terpenuhi) ## Syarat tambahan gelar Unggul Dua-duanya harus terpenuhi, dan keduanya HANYA menyangkut kriteria C1–C3 (Budaya Mutu, Relevansi Pendidikan, Relevansi Penelitian) — bukan seluruh 82 butir. Ini kutipan langsung §V: • rerata tiap kriteria C1, C2, C3 masing-masing ≥ 3,20 • setiap butir pada C1, C2, C3 bernilai ≥ 3,00 Butir yang belum dinilai dianggap belum memenuhi syarat — bukan lolos. /

## Letak berkas

Dari akar repo: `lib/utils/penilaian.ts`.

## Isi yang bisa dipakai berkas lain

### `BOBOT_TOTAL`

Jenis: **konstanta**

Kalkulasi Matriks Penilaian LAM INFOKOM 2.1. Fungsi di file ini MURNI (tanpa DB, tanpa React) supaya gampang di-unit-test: nilai akhir berbobot, rerata per kriteria, dan prediksi status akreditasi. ## Rumus nilai akhir PDF §III/§IV menulis bobot sebagai "Bobot dari 400" dengan skor tiap butir 1–4 (Sangat baik 4 · Baik 3 · Cukup 2 · Kurang 1). Supaya nilai akhir jatuh di skala 0–400, jumlah berbobo

### `SKOR_MAKS`

Jenis: **konstanta**

### `SKOR_MIN`

Jenis: **konstanta**

### `AMBANG`

Jenis: **konstanta**

### `KRITERIA_KUNCI`

Jenis: **konstanta**

Kriteria kunci penentu gelar Unggul.

### `RERATA_KUNCI_MIN`

Jenis: **konstanta**

### `BUTIR_MIN`

Jenis: **konstanta**

### `StatusPrediksi`

Jenis: **tipe**

### `STATUS_META`

Jenis: **konstanta**

### `URUTAN_KRITERIA`

Jenis: **konstanta**

Urutan tampilan kriteria pada dashboard.

### `NAMA_KRITERIA`

Jenis: **konstanta**

### `NAMA_PENDEK`

Jenis: **konstanta**

Nama pendek untuk kartu/legenda.

### `BOBOT_KRITERIA`

Jenis: **konstanta**

Bobot resmi per kriteria (PDF §III). Dipakai memverifikasi hasil seed: kalau Σ bobot ≠ 400, seluruh prediksi jadi salah dan UI harus menolak render. /

### `ButirHitung`

Jenis: **tipe**

Butir ringkas yang dibutuhkan kalkulasi.

### `RerataKriteria`

Jenis: **tipe**

### `HasilPenilaian`

Jenis: **tipe**

### `nilaiBerbobot`

Jenis: **fungsi**

Σ(skor × bobot) mentah; butir kosong dihitung 0.

### `nilaiAkhir`

Jenis: **fungsi**

Nilai akhir skala 0–400. Σ(skor × bobot) dibagi 4 (skor maksimum) supaya skor penuh = 400. /

### `rerataKriteria`

Jenis: **fungsi**

Rerata tertimbang satu kriteria pada skala 1–4: Σ(skor × bobot) / Σ(bobot). Dipakai juga untuk syarat Unggul. /

### `totalBobot`

Jenis: **fungsi**

### `semuaButirAman`

Jenis: **fungsi**

Semua butir dinilai ≥ 3,00? Butir kosong dianggap belum aman.

### `prediksiStatus`

Jenis: **fungsi**

Prediksi status akreditasi. Ambang nilai diperiksa lebih dulu, baru syarat Unggul — jadi nilai 380 dengan satu butir C1 bernilai 2,9 tetap Terakreditasi. /

### `hitungPenilaian`

Jenis: **fungsi**

Hitung semuanya sekaligus dari daftar butir.

### `bobotValid`

Jenis: **fungsi**

Cek total bobot hasil seed. Kalau tidak persis 400, seluruh prediksi salah — dashboard harus menolak render (Edge Case §7 RANCANGAN-012). /

### `bulatkan`

Jenis: **fungsi**

Bulatkan ke 2 desimal — menghindari 60,49999999 dari aritmetika float.

### `persenTerisi`

Jenis: **fungsi**

Persentase progres pengisian butir.

### `SKOR_LABEL`

Jenis: **konstanta**

Label skor 1–4 sesuai deskriptor matriks.

### `warnaRerata`

Jenis: **fungsi**

Ambient warna rerata kriteria: merah <3,00 · amber 3,00–3,19 · hijau ≥3,20.

## Berkas yang memanggil berkas ini

Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:

- [`app/(dashboard)/penilaian/butir/[kode]/page.tsx`](./app__-dashboard-__penilaian__butir__-kode-__page.md)
- [`app/(dashboard)/penilaian/kriteria/[kode]/page.tsx`](./app__-dashboard-__penilaian__kriteria__-kode-__page.md)
- [`app/(dashboard)/penilaian/page.tsx`](./app__-dashboard-__penilaian__page.md)
- [`components/penilaian/KriteriaBreakdown.tsx`](./components__penilaian__KriteriaBreakdown.md)
- [`components/penilaian/SkorSelector.tsx`](./components__penilaian__SkorSelector.md)
- [`components/penilaian/StatusGauge.tsx`](./components__penilaian__StatusGauge.md)
- [`lib/actions/penilaian.ts`](./lib__actions__penilaian.md)
- [`lib/utils/penilaian-query.ts`](./lib__utils__penilaian-query.md)
- [`tests/unit/penilaian.test.ts`](./tests__unit__penilaian.test.md)

