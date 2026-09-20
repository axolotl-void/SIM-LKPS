#!/usr/bin/env node
/**
 * Generator README.md SIM-LKPS.
 *
 * Membaca repo apa adanya, lalu menyusun README panjang yang isinya sesuai kode
 * nyata. Bagian naratif ditulis di scripts/readme/narasi.mjs; bagian berulang
 * (skema, halaman, API, komponen, lib, indeks) dihasilkan dari sumbernya.
 *
 * Jalankan dari akar repo:
 *   node scripts/generate-readme.mjs
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  ROOT,
  baca,
  ada,
  cariSemua,
  bacaSchema,
  bacaEkspor,
  bacaImpor,
  bacaPustaka,
  bacaTabelDb,
  komentarAtas,
  ruteDari,
  bacaHalaman,
  bacaApi,
  bacaProps,
  barisTabel,
  anchor,
} from "./readme/util.mjs";
import { bacaTabelLkps, ARTI_TIPE_KOLOM } from "./readme/seed.mjs";
import * as N from "./readme/narasi.mjs";

/** Cari nomor + anchor bab berdasarkan judulnya (biar tidak salah indeks). */
function rujukBab(judul) {
  const d = DAFTAR_ISI.find((x) => x.judul === judul);
  return d ? `[${d.nomor}. ${d.judul}](#${d.anchor})` : judul;
}

const B = [];
const push = (...x) => B.push(...x);

const DAFTAR_ISI = [];
let nomor = 0;
function bab(judul, ringkas, isi) {
  nomor += 1;
  const a = anchor(`${nomor}. ${judul}`);
  DAFTAR_ISI.push({ nomor, judul, ringkas, anchor: a });
  push("", "---", "", `<a id="${a}"></a>`, "", `## ${nomor}. ${judul}`, "");
  if (ringkas) push(ringkas, "");
  if (isi) {
    const s = typeof isi === "function" ? isi({ nomor, judul }) : isi;
    push(s.trim(), "");
  }
  return nomor;
}

function sub(judul) {
  push("", `### ${judul}`, "");
}
function subsub(judul) {
  push("", `#### ${judul}`, "");
}

/**
 * Heading tingkat 3/4 yang bisa ditautkan.
 *
 * Markdown membuat anchor sendiri dari judul, tapi judul di sini memuat tanda
 * baca dan backtick (`Tabel `1.A.1` — ...`), sehingga anchor hasil olahan
 * Markdown tidak bisa diprediksi dan tautan jadi mati. Karena itu anchor
 * ditulis eksplisit lewat <a id="...">, lalu judulnya menyusul.
 */
function subAnchor(judul, id) {
  push("", `<a id="${id}"></a>`, "", `### ${judul}`, "");
}
function subsubAnchor(judul, id) {
  push("", `<a id="${id}"></a>`, "", `#### ${judul}`, "");
}

// =========================================================== kumpulkan data

const schema = bacaSchema();
const semuaTs = cariSemua("app", [".ts", ".tsx"]);
const semuaLib = cariSemua("lib", [".ts", ".tsx"]);
const semuaKomponen = cariSemua("components", [".ts", ".tsx"]);

const halaman = semuaTs.filter((p) => p.endsWith("page.tsx")).map(bacaHalaman);
const api = semuaTs.filter((p) => p.endsWith("route.ts")).map(bacaApi);
const komponen = semuaKomponen.map((p) => {
  const t = baca(p);
  return {
    pathRel: p,
    baris: t.split("\n").length,
    ekspor: bacaEkspor(t),
    props: bacaProps(t),
    impor: bacaImpor(t, p),
    pustaka: bacaPustaka(t),
    klien: /^\s*["']use client["']/m.test(t),
    maksud: komentarAtas(t, t.indexOf("export")),
  };
});
const libBerkas = semuaLib.map((p) => {
  const t = baca(p);
  return {
    pathRel: p,
    baris: t.split("\n").length,
    ekspor: bacaEkspor(t),
    impor: bacaImpor(t, p),
    pustaka: bacaPustaka(t),
    tabel: bacaTabelDb(t),
    maksud: komentarAtas(t, t.indexOf("export")),
    server: /^\s*["']use server["']/m.test(t),
  };
});

const ledBagian = JSON.parse(baca("prisma/seed-data/led-bagian.json"));
const butirPenilaian = JSON.parse(baca("prisma/seed-data/butir-penilaian.json"));

const stat = {
  model: schema.model.length,
  enum: schema.enums.length,
  kolom: schema.model.reduce((s, m) => s + m.kolom.length, 0),
  halaman: halaman.length,
  api: api.length,
  komponen: komponen.length,
  lib: libBerkas.length,
  led: ledBagian.length,
  butir: butirPenilaian.length,
  bobot: butirPenilaian.reduce((s, x) => s + x.bobot, 0),
  barisApp: semuaTs.reduce((s, p) => s + baca(p).split("\n").length, 0),
  barisKomponen: semuaKomponen.reduce((s, p) => s + baca(p).split("\n").length, 0),
  barisLib: semuaLib.reduce((s, p) => s + baca(p).split("\n").length, 0),
};

// ================================================================ 1. KEPALA

push("<!-- =========================================================== -->");
push("<!-- BERKAS INI DIHASILKAN OTOMATIS — JANGAN DISUNTING LANGSUNG  -->");
push("<!-- Ubah kode, lalu jalankan: node scripts/generate-readme.mjs    -->");
push("<!-- Teks naratif ada di: scripts/readme/narasi.mjs               -->");
push("<!-- =========================================================== -->");
push("");
push('<p align="center">');
push('  <img src=".github/assets/banner.svg" alt="SIM-LKPS" width="100%">');
push("</p>");
push("");
push('<p align="center">');
push("  <strong>Sistem Informasi Manajemen Laporan Kinerja Program Studi</strong><br>");
push("  Aplikasi web untuk 32 tabel LKPS, LED, dan Matriks Penilaian<br>");
push("  Program Studi Ilmu Komputer — Universitas Bina Bangsa Getsempena");
push("</p>");
push("");
push('<p align="center">');
push('  <a href="#daftar-isi">Daftar Isi</a> ·');
push('  <a href="docs/handover/00-START-HERE.md">Panduan Serah Terima</a> ·');
push('  <a href="https://github.com/axolotl-void/SIM-LKPS/issues">Laporkan Masalah</a>');
push("</p>");
push("");
push('<p align="center">');
for (const [nama, w, l, warna] of [
  ["Next.js 15", "Next.js", "next.js", "000"],
  ["TypeScript 5", "TypeScript", "typescript", "3178C6"],
  ["React 19", "React", "react", "61DAFB"],
  ["PostgreSQL 16", "PostgreSQL", "postgresql", "336791"],
  ["Prisma 6", "Prisma", "prisma", "2D3748"],
  ["Auth.js v5", "Auth.js", "auth.js", "000"],
  ["Tailwind 4", "Tailwind", "tailwindcss", "06B6D4"],
  ["Cloudflare R2", "Cloudflare_R2", "cloudflare", "F38020"],
  ["Vercel", "Vercel", "vercel", "000"],
]) {
  push(`  <img src="https://img.shields.io/badge/${w}-${warna}?logo=${l}&logoColor=white" alt="${nama}">`);
}
push("</p>");
push("");
push("<br>");
push("");
push("> **Catatan tentang berkas ini.** README ini dihasilkan dari kode yang");
push("> benar-benar ada di repo. Angka, nama kolom, daftar halaman, dan daftar");
push("> komponen di sini dihitung langsung dari sumbernya, bukan ditulis manual.");
push("> Kalau kode berubah, jalankan `node scripts/generate-readme.mjs`.");
push("");
push("> **Untuk tim kampus.** Kalau kamu baru pertama kali membuka proyek ini dan");
push("> bukan programmer, mulai dari **[Panduan Serah Terima](docs/handover/00-START-HERE.md)**");
push("> — bahasanya lebih sederhana dan urutannya jelas.");

// =========================================================== 2. DAFTAR ISI

push("", "---", "", '<a id="daftar-isi"></a>', "", "## Daftar Isi", "");
push("");
push("| # | Bab | Isinya |");
push("|---|---|---|");
DAFTAR_ISI.forEach((d) => push(`| ${d.nomor} | [${d.judul}](#${d.anchor}) | ${d.ringkas} |`));
push("");
push("**Ringkasan angka:**");
push("");
push(`- \`${stat.model}\` tabel database · \`${stat.kolom}\` kolom · \`${stat.enum}\` pilihan nilai tetap`);
push(`- \`32\` tabel LKPS · \`${stat.led}\` bagian LED · \`${stat.butir}\` butir penilaian (bobot ${stat.bobot})`);
push(`- \`${stat.halaman}\` halaman · \`${stat.api}\` titik akhir API · \`${stat.komponen}\` komponen`);

// ============================================================ 3. BAB-BAB

bab("Pengenalan", "Aplikasi ini untuk apa dan masalah apa yang diselesaikan", N.babPengenalan);
bab("Ikhtisar Sistem", "Tiga modul utama dan bagaimana mereka terhubung", N.babIkhtisar);
bab("Arsitektur", "Bagian-bagian sistem, alur permintaan, dan alasan tiap keputusan", N.babArsitektur);
bab("Teknologi yang Dipakai", "Setiap pustaka, versinya, dan kenapa dipilih", N.babTechStack);
bab("Struktur Folder", "Peta seluruh folder dan berkas di proyek", N.babStruktur);

// Pohon folder nyata
sub("Pohon berkas tingkat atas");
push("```");
push("sim-lkps/");
for (const e of pohonRingkas()) push(e);
push("```");

function pohonRingkas() {
  const out = [];
  const tambah = (label, isi) => {
    out.push(`├── ${label}`);
    isi.forEach((x, i) => out.push(`│   ${i === isi.length - 1 ? "└──" : "├──"} ${x}`));
  };
  tambah("app/", [`${stat.halaman} halaman, ${stat.api} titik akhir API`]);
  tambah("components/", [`${stat.komponen} komponen`]);
  tambah("lib/", [`${stat.lib} berkas logika`]);
  tambah("prisma/", ["schema.prisma", "seed.ts", "seed-data/"]);
  tambah("scripts/", ["generate-readme.mjs", "readme/"]);
  tambah("tests/", ["unit/", "*.spec.ts"]);
  tambah("docs/", ["handover/"]);
  out.push("└── public/");
  return out;
}

// ---------------------------------------------------- bab: tabel LKPS

const tabelLkps = bacaTabelLkps();
const totalKolomLkps = tabelLkps.reduce((s, t) => s + t.kolom.length, 0);

bab(
  "Daftar Tabel LKPS",
  `Seluruh ${tabelLkps.length} tabel LKPS beserta ${totalKolomLkps} kolomnya — apa yang harus diisi di tiap kolom`,
);

push(
  `LKPS memuat **${tabelLkps.length} tabel** dengan total **${totalKolomLkps} kolom**.`,
  "Susunannya dibaca dari `prisma/seed.ts` — berkas itulah sumber kebenaran",
  "jumlah tabel, bukan hitungan langsung di database.",
  "",
);
push("### Sebaran tabel per kriteria");
push("");
push("| Kriteria | Tabel | Kode tabel |");
push("|---|---:|---|");
for (const b of [...new Set(tabelLkps.map((t) => t.bab))].sort((a, c) => a - c)) {
  const isi = tabelLkps.filter((t) => t.bab === b);
  push(`| [Kriteria ${b}](#kriteria-${b}) | ${isi.length} | ${isi.map((t) => `\`${t.kode}\``).join(", ")} |`);
}
push(`| **Total** | **${tabelLkps.length}** | |`);
push("");

push("### Ringkasan seluruh tabel");
push("");
push("| Kode | Kriteria | Nama | Jumlah kolom |");
push("|---|---:|---|---:|");
for (const t of tabelLkps) {
  push(`| [\`${t.kode}\`](#tabel-lkps-${anchor(t.kode)}) | ${t.bab} | ${barisTabel(t.nama)} | ${t.kolom.length} |`);
}
push("");

push("### Penjelasan tiap tabel");
push("");
push(
  "Tiap tabel di bawah ini punya halamannya sendiri. Kolom yang bertanda",
  '**wajib** harus diisi sebelum baris bisa disimpan; yang tidak wajib boleh',
  "dikosongkan.",
  "",
);

for (const b of [...new Set(tabelLkps.map((t) => t.bab))].sort((a, c) => a - c)) {
  subAnchor(`Kriteria ${b}`, `kriteria-${b}`);
  for (const t of tabelLkps.filter((x) => x.bab === b)) {
    subsubAnchor(`Tabel \`${t.kode}\` — ${t.nama}`, `tabel-lkps-${anchor(t.kode)}`);
    push(`| | |`);
    push(`|---|---|`);
    push(`| **Kode** | \`${t.kode}\` |`);
    push(`| **Kriteria** | ${t.bab} |`);
    push(`| **Urutan** | ${t.urutan} |`);
    push(`| **Jumlah kolom** | ${t.kolom.length} |`);
    push(`| **Halaman** | \`/lkps/kriteria-${t.bab}/tabel-${t.kode.toLowerCase().replace(/\./g, "")}\` |`);
    push("");

    if (t.kolom.length) {
      push("**Kolom yang harus diisi:**", "");
      push("| # | Label kolom | Kunci data | Tipe | Wajib |");
      push("|---:|---|---|---|---|");
      t.kolom.forEach((k, i) => {
        push(`| ${i + 1} | ${barisTabel(k.label)} | \`${k.key}\` | ${ARTI_TIPE_KOLOM[k.type] ?? k.type} | ${k.required ? "**ya**" : "tidak"} |`);
      });
      push("");

      const sidebar = t.kolom.find((k) => /nama|dosen/i.test(k.key));
      const catatanTambahan = [];
      if (t.kolom.some((k) => k.type === "currency")) catatanTambahan.push("Ada kolom bernilai uang — masukkan angka saja, tanpa titik atau tanda rupiah.");
      if (t.kolom.some((k) => k.type === "url")) catatanTambahan.push("Ada kolom tautan — tempelkan alamat lengkap yang diawali `http`.");
      if (t.kolom.some((k) => /linkBukti|bukti/i.test(k.key))) catatanTambahan.push("Ada kolom bukti — bisa diisi tautan ke dokumen pendukung.");
      if (sidebar && /nama/i.test(sidebar.key)) catatanTambahan.push("Kolom nama terhubung ke data induk dosen, bisa dipilih atau diketik manual.");
      if (catatanTambahan.length) {
        push("**Yang perlu diperhatikan:**", "");
        for (const c of catatanTambahan) push(`- ${c}`);
        push("");
      }
    }
  }
}

// ------------------------------------------------------- bab: format & tipe

bab(
  "Format Isian dan Tipe Kolom",
  "Arti tiap tipe kolom, cara pengisiannya, dan kesalahan yang sering terjadi",
);

push(
  "Tiap kolom di tabel LKPS punya tipe. Tipe itu menentukan bentuk isian yang",
  "muncul dan bagaimana isinya diperiksa sebelum disimpan.",
  "",
);

sub("Daftar tipe kolom");
push("| Tipe | Wujud isian | Cara mengisi | Contoh benar |");
push("|---|---|---|---|");
for (const [tipe, arti] of Object.entries(ARTI_TIPE_KOLOM)) {
  const contoh = {
    text: "Teks satu baris",
    textarea: "Kotak teks besar",
    number: "Kotak angka",
    currency: "Kotak angka",
    url: "Kotak teks",
    date: "Pemilih tanggal",
    select: "Daftar pilihan",
    checkbox: "Kotak centang",
    email: "Kotak teks",
  }[tipe] ?? "Kotak isian";
  const cara = {
    text: "Ketik langsung",
    textarea: "Ketik bebas, boleh panjang",
    number: "Angka saja, **tanpa titik pemisah**",
    currency: "Angka saja, **tanpa titik atau tanda rupiah**",
    url: "Tempelkan alamat lengkap, diawali `http`",
    date: "Pilih dari kalender",
    select: "Pilih salah satu",
    checkbox: "Centang kalau ya",
    email: "Ketik alamat surel lengkap",
  }[tipe] ?? "Ketik";
  const ok = {
    text: "`Sumber Dana PNBP`",
    textarea: "`Program studi menyelenggarakan…`",
    number: "`12`",
    currency: "`45000000`",
    url: "`https://contoh.ac.id/bukti.pdf`",
    date: "`2026-09-21`",
    select: "`Ya`",
    checkbox: "☑",
    email: "`nama@ubbg.ac.id`",
  }[tipe] ?? "—";
  push(`| \`${tipe}\` | ${arti} | ${cara} | ${ok} |`);
}
push("");

sub("Kesalahan pengisian yang sering terjadi");
push("| Yang ditulis | Kenapa salah | Yang benar |");
push("|---|---|---|");
push("| `Rp 45.000.000` | Tanda rupiah dan titik bukan angka | `45000000` |");
push("| `45.000.000` | Titik dibaca sebagai pemisah desimal | `45000000` |");
push("| `www.contoh.ac.id` | Tautan tanpa awalan tidak bisa dibuka | `https://www.contoh.ac.id` |");
push("| `21 September 2026` | Bukan bentuk tanggal yang dikenali | Pilih lewat kalender |");
push("| `-` atau `N/A` di kolom wajib | Kolom wajib tidak boleh kosong | Isi dengan data sebenarnya, atau kosongkan setelah data tersedia |");
push("| Angka dengan spasi `45 000` | Spasi bukan bagian dari angka | `45000` |");
push("");

sub("Kolom yang terhubung ke data induk dosen");
push(
  "Beberapa kolom nama dosen tidak diketik bebas, melainkan dipilih dari daftar",
  "yang berasal dari data induk dosen. Ketentuannya:",
  "",
);
push("| Keadaan | Yang terjadi |");
push("|---|---|");
push("| Data induk sudah lengkap | Nama bisa dicari berdasarkan nama atau NIDN |");
push("| Nama tidak ada di daftar | **Masih bisa diketik manual** — muncul penanda bahwa namanya tidak ada di data induk |");
push("| Data induk diganti namanya | Isian lama **tidak ikut berubah** — nama tersimpan sebagai teks |");
push("");
push(
  "> Konsekuensi terakhir itu disengaja, supaya pengisian tabel tidak tersandera",
  "> kelengkapan data induk. Tapi artinya: kalau ada dosen berganti nama, isian",
  "> lama perlu diperiksa terpisah.",
  "",
);

sub("Cara memastikan isian tersimpan");
push(
  "Setelah menekan simpan, ada dua tanda yang perlu diperiksa:",
  "",
);
push(
  "1. **Pesan berhasil** muncul di layar",
  "2. **Muat ulang halaman** (tekan F5), lalu pastikan isian masih ada",
  "",
);
push(
  "Kalau isinya hilang setelah dimuat ulang, artinya penyimpanan gagal meski",
  "tidak ada pesan galat. Yang perlu diperiksa: sambungan internet, dan apakah",
  "sesi login masih aktif.",
  "",
);

// -------------------------------------------- bab: skema basis data

const totalRelasi = schema.model.reduce((s, m) => s + m.relasi.length, 0);

bab(
  "Skema Basis Data",
  `Seluruh ${stat.model} tabel beserta ${stat.kolom} kolom datanya, apa artinya, dan bagaimana berhubungan`,
);

push(
  `Basis data memuat **${stat.model} tabel** dengan total **${stat.kolom} kolom data**,`,
  `**${totalRelasi} relasi** antar tabel, dan **${stat.enum} pilihan nilai tetap**.`,
  "Daftar di bawah dibaca langsung dari `prisma/schema.prisma`.",
  "",
);
push(
  "**Kolom data vs relasi.** Kolom data menyimpan isi sebenarnya (teks, angka,",
  "tanggal). Relasi tidak menyimpan isi — ia hanya penunjuk ke baris di tabel",
  "lain, dan yang tersimpan di database adalah id baris yang ditunjuk. Jadi kalau",
  `ditotal, ada ${stat.kolom + totalRelasi} bidang di seluruh tabel:`,
  `**${stat.kolom} kolom data** + **${totalRelasi} relasi**.`,
  "",
);
push("### Ringkasan tabel");
push("");
push("| Tabel | Kolom | Relasi | Kegunaan |");
push("|---|---:|---:|---|");
for (const m of schema.model) {
  push(`| [\`${m.nama}\`](#tabel-${anchor(m.nama)}) | ${m.kolom.length} | ${m.relasi.length} | ${barisTabel(m.catatan || kegunaanTabel(m.nama))} |`);
}
push("");

sub("Pilihan nilai tetap (enum)");
push("Nilai yang hanya boleh dipilih dari daftar tertentu. Dipakai database untuk menolak nilai yang tidak dikenal.");
push("");
push("| Enum | Jumlah nilai | Nilai yang boleh |");
push("|---|---:|---|");
for (const e of schema.enums) push(`| \`${e.nama}\` | ${e.nilai.length} | ${e.nilai.map((v) => `\`${v}\``).join(", ")} |`);
push("");

function kegunaanTabel(n) {
  const peta = {
    User: "Akun pengguna aplikasi",
    Account: "Kaitan akun login (dipakai Auth.js)",
    Session: "Sesi login yang sedang aktif",
    VerificationToken: "Token verifikasi milik Auth.js",
    Prodi: "Data program studi",
    TahunAkademik: "Daftar tahun akademik; satu ditandai aktif",
    Dosen: "Data induk dosen",
    Tendik: "Data induk tenaga kependidikan",
    Mahasiswa: "Data induk mahasiswa",
    MataKuliah: "Data induk mata kuliah",
    TabelDefinition: "Daftar 32 tabel LKPS beserta susunan kolomnya",
    TabelLkps: "Satu baris untuk tiap tabel LKPS per tahun akademik",
    TabelLkpsRow: "Isi baris tabel LKPS (disimpan sebagai JSON)",
    Evidence: "Bukti pendukung untuk tabel LKPS",
    ValidationHistory: "Riwayat perpindahan status tabel",
    AuditLog: "Catatan siapa mengubah apa",
    Notification: "Pemberitahuan untuk pengguna",
    LedBagian: "Daftar 92 bagian narasi LED",
    LedIsian: "Isi narasi tiap bagian LED",
    LedEvidence: "Bukti pendukung untuk bagian LED",
    ButirPenilaian: "Daftar 82 butir penilaian beserta bobotnya",
    PenilaianSesi: "Satu sesi penilaian",
    SkorPenilaian: "Skor tiap butir dalam sebuah sesi penilaian",
  };
  return peta[n] ?? "—";
}

sub("Penjelasan tiap tabel");

for (const m of schema.model) {
  subsubAnchor(`Tabel \`${m.nama}\``, `tabel-${anchor(m.nama)}`);
  if (m.catatan) push(m.catatan, "");
  push(`**Kegunaan.** ${kegunaanTabel(m.nama)}`, "");

  if (m.kolom.length) {
    push(`**Kolom (${m.kolom.length}):**`, "");
    push("| Kolom | Tipe | Keterangan |");
    push("|---|---|---|");
    for (const k of m.kolom) {
      let ket = k.catatan ?? "";
      if (!ket) {
        if (k.atribut.includes("@id")) ket = "Kunci utama";
        else if (k.atribut.includes("@unique")) ket = "Harus unik";
        else if (k.atribut.includes("@default(now())")) ket = "Diisi otomatis saat dibuat";
        else if (k.atribut.includes("@default(now")) ket = "Diisi otomatis saat diubah";
        else if (k.atribut.includes("@default(")) ket = `Bawaan: ${(k.atribut.match(/@default\(([^)]+)\)/) || [])[1] ?? ""}`;
        else if (k.tipe.endsWith("?")) ket = "Boleh kosong";
        else ket = "";
      }
      push(`| \`${k.nama}\` | \`${k.tipe}\` | ${barisTabel(ket)} |`);
    }
    push("");
  }

  if (m.relasi.length) {
    push(`**Hubungan ke tabel lain (${m.relasi.length}):**`, "");
    push("| Kolom | Menunjuk ke | Artinya |");
    push("|---|---|---|");
    for (const r of m.relasi) {
      const banyak = r.tipe.endsWith("[]");
      push(`| \`${r.nama}\` | ${banyak ? "banyak" : "satu"} \`${r.tipe.replace(/[?[\]]/g, "")}\` | ${barisTabel(r.catatan ?? (banyak ? "Satu baris ini punya banyak baris di sana" : "Satu baris ini terkait satu baris di sana"))} |`);
    }
    push("");
  }

  // Contoh akses
  push("**Contoh mengaksesnya:**", "");
  push("```ts");
  push(`// Mengambil daftar`);
  push(`const daftar = await db.${m.nama[0].toLowerCase() + m.nama.slice(1)}.findMany({`);
  push(`  take: 10,`);
  if (m.kolom.some((k) => k.nama === "createdAt")) push(`  orderBy: { createdAt: "desc" },`);
  push(`});`);
  push("");
  push(`// Mengambil satu baris berdasarkan kunci utama`);
  push(`const satu = await db.${m.nama[0].toLowerCase() + m.nama.slice(1)}.findUnique({`);
  push(`  where: { id: "..." },`);
  push(`});`);
  push("```");
  push("");
}

// ----------------------------------------------------- bab: halaman

bab("Referensi Halaman", `Seluruh ${stat.halaman} halaman: alamat, berkas, data yang diambil, dan komponennya`);

push(
  `Ada **${stat.halaman} halaman** di aplikasi ini. Tiap halaman menempati satu`,
  "berkas `page.tsx`. Daftar di bawah dibaca langsung dari isi folder `app/`.",
  "",
);

sub("Daftar seluruh halaman");
push("| Alamat | Berkas | Baris | Judul |");
push("|---|---|---:|---|");
for (const h of halaman) {
  push(`| [\`${h.rute}\`](#halaman-${anchor(h.rute)})\` | \`${h.pathRel}\` | ${h.baris} | ${barisTabel(h.judul ?? "—")} |`);
}
push("");

sub("Penjelasan tiap halaman");
for (const h of halaman) {
  subsubAnchor(`Halaman \`${h.rute}\``, `halaman-${anchor(h.rute)}`);
  push(`| | |`);
  push(`|---|---|`);
  push(`| **Berkas** | \`${h.pathRel}\` |`);
  push(`| **Alamat** | \`${h.rute}\` |`);
  push(`| **Ukuran** | ${h.baris} baris |`);
  if (h.judul) push(`| **Judul tab** | ${h.judul} |`);
  push(`| **Jenis** | ${h.klien ? "berjalan di peramban" : "berjalan di server"} |`);
  push("");

  if (h.maksud) push(`**Maksud berkas.** ${h.maksud}`, "");

  if (h.tabel.length) {
    push("**Data yang dibaca dari database:**", "");
    for (const t of h.tabel) push(`- \`${t}\``);
    push("");
  }

  if (h.ekspor.length) {
    push("**Isi berkas:**", "");
    push("| Nama | Jenis | Keterangan |");
    push("|---|---|---|");
    for (const e of h.ekspor) push(`| \`${e.nama}\` | ${e.jenis} | ${barisTabel(e.catatan ?? "—")} |`);
    push("");
  }

  const komponenDipakai = h.impor.filter((i) => i.startsWith("components/"));
  if (komponenDipakai.length) {
    push("**Komponen tampilan yang dipakai:**", "");
    for (const k of komponenDipakai) push(`- \`${k}\``);
    push("");
  }

  if (h.pustaka.length) {
    push(`**Pustaka luar:** ${h.pustaka.map((p) => `\`${p}\``).join(", ")}`, "");
  }
}

// -------------------------------------------------------- bab: API

bab("API dan Server Action", `${stat.api} titik akhir API dan ${libBerkas.filter((l) => l.pathRel.startsWith("lib/actions/")).length} berkas server action`);

sub("Titik akhir API");
push(
  "Titik akhir API adalah pintu masuk dari luar aplikasi. Dipakai terutama untuk",
  "unduhan berkas, karena unduhan membutuhkan alamat yang bisa dibuka langsung.",
  "",
);
push("| Alamat | Metode | Berkas | Baris |");
push("|---|---|---|---:|");
for (const a of api) push(`| \`${a.rute}\` | ${a.metode.join(", ") || "—"} | \`${a.pathRel}\` | ${a.baris} |`);
push("");

for (const a of api) {
  subsub(`\`${a.rute}\``);
  push(`| | |`);
  push(`|---|---|`);
  push(`| **Berkas** | \`${a.pathRel}\` |`);
  push(`| **Metode** | ${a.metode.join(", ") || "—"} |`);
  push(`| **Ukuran** | ${a.baris} baris |`);
  push("");
  if (a.maksud) push(`**Maksud berkas.** ${a.maksud}`, "");
  if (a.tabel.length) {
    push(`**Tabel database yang disentuh:** ${a.tabel.map((t) => `\`${t}\``).join(", ")}`, "");
  }
}

sub("Server Action");
push(
  "Server action adalah fungsi yang dipanggil langsung dari komponen. Berbeda",
  "dengan API, tidak ada alamat yang perlu disepakati — pemanggil dan yang",
  "dipanggil ada di proyek yang sama. **Semua pemeriksaan izin ada di sini.**",
  "",
);

for (const l of libBerkas.filter((x) => x.pathRel.startsWith("lib/actions/"))) {
  subsub(`\`${l.pathRel}\``);
  push(`Ukuran: ${l.baris} baris.`);
  push("");
  if (l.maksud) push(`**Maksud berkas.** ${l.maksud}`, "");
  if (l.tabel.length) push(`**Tabel database:** ${l.tabel.map((t) => `\`${t}\``).join(", ")}`, "");
  if (l.ekspor.length) {
    push("**Fungsi yang disediakan:**", "");
    push("| Fungsi | Keterangan |");
    push("|---|---|");
    for (const e of l.ekspor) push(`| \`${e.nama}\` | ${barisTabel(e.catatan ?? "—")} |`);
    push("");
  }
}

// ----------------------------------------------------- bab: komponen

bab("Referensi Komponen", `Seluruh ${stat.komponen} komponen tampilan, dikelompokkan per folder`);

push(
  `Ada **${stat.komponen} komponen**. Semuanya ada di folder \`components/\`.`,
  "",
);

const grupKomponen = {};
for (const k of komponen) {
  const g = k.pathRel.split("/").slice(0, 2).join("/");
  (grupKomponen[g] ??= []).push(k);
}

sub("Ringkasan per folder");
push("| Folder | Jumlah | Kegunaan |");
push("|---|---:|---|");
for (const [g, isi] of Object.entries(grupKomponen).sort()) {
  push(`| \`${g}/\` | ${isi.length} | ${kegunaanFolderKomponen(g)} |`);
}
push("");

function kegunaanFolderKomponen(g) {
  const peta = {
    "components/tables": "Tampilan tiap tabel LKPS",
    "components/led": "Modul narasi LED",
    "components/layout": "Kerangka halaman: menu, kepala, tema",
    "components/shared": "Komponen yang dipakai lintas modul",
    "components/forms": "Formulir data induk",
    "components/penilaian": "Modul Matriks Penilaian",
    "components/ui": "Komponen tampilan dasar",
  };
  return peta[g] ?? "—";
}

for (const [g, isi] of Object.entries(grupKomponen).sort()) {
  sub(`Folder \`${g}/\``);
  for (const k of isi) {
    subsub(`\`${k.pathRel.split("/").pop()}\``);
    push(`**Berkas.** \`${k.pathRel}\` (${k.baris} baris)`, "");
    push(`**Jenis.** ${k.klien ? "Berjalan di peramban — ada pengelolaan keadaan dan kejadian" : "Berjalan di server"}`, "");
    if (k.maksud) push(`**Maksud.** ${k.maksud}`, "");
    if (k.props.length) {
      push("**Properti yang diterima:**", "");
      push("| Nama | Wajib | Tipe |");
      push("|---|---|---|");
      for (const p of k.props) push(`| \`${p.nama}\` | ${p.wajib ? "ya" : "tidak"} | \`${barisTabel(p.tipe)}\` |`);
      push("");
    }
    if (k.ekspor.length) {
      push(`**Yang diekspor:** ${k.ekspor.map((e) => `\`${e.nama}\``).join(", ")}`, "");
    }
    push("");
  }
}

// --------------------------------------------------------- bab: LED

bab("Modul LED", `Seluruh ${stat.led} bagian narasi, susunannya, dan cara dokumen dihasilkan`);

push(
  `LED adalah **Laporan Evaluasi Diri** — dokumen naratif yang menyertai LKPS.`,
  `Terdiri dari **${stat.led} bagian** yang tersusun sebagai BAB I sampai BAB III.`,
  "",
);

const perBab = ledBagian.reduce((a, x) => {
  const k = String(x.bab);
  (a[k] ??= []).push(x);
  return a;
}, {});
push("### Sebaran bagian per bab");
push("");
push("| Bab | Jumlah bagian |");
push("|---|---:|");
for (const [k, v] of Object.entries(perBab)) push(`| BAB ${k} | ${v.length} |`);
push(`| **Total** | **${ledBagian.length}** |`);
push("");

push("### Daftar seluruh bagian");
push("");
push("| No | Kode | Bab | Judul | Jenis | Batas halaman |");
push("|---:|---|---|---|---|---:|");
ledBagian.forEach((x, i) => {
  push(`| ${i + 1} | \`${x.kode}\` | ${x.bab} | ${barisTabel(x.judul)} | ${barisTabel(x.jenis)} | ${x.batasHalaman ?? "—"} |`);
});
push("");


// ------------------------------------- bab: rincian tiap bagian LED

const jenisLed = ledBagian.reduce((a, x) => {
  (a[x.jenis] ??= []).push(x);
  return a;
}, {});
const ARTi_JENIS_LED = {
  NARASI: [
    "Bagian yang berisi uraian bebas.",
    "Ditulis dalam bentuk paragraf yang menjelaskan kondisi, kebijakan, atau",
    "pelaksanaan sesuatu. Tidak ada format baku — yang penting isinya jelas dan",
    "didukung data.",
  ],
  KRITERIA: [
    "Bagian yang menguraikan satu kriteria penilaian instrumen.",
    "Bagian ini berpasangan langsung dengan satu butir penilaian di modul",
    "Matriks Penilaian. Menulis bagian ini berarti menyiapkan bahan bukti untuk",
    "butir yang bersangkutan.",
  ],
  SUPLEMEN: [
    "Bagian pelengkap.",
    "Berisi dokumen pendukung yang diminta instrumen, misalnya daftar lampiran",
    "atau rekapitulasi tambahan yang tidak masuk bagian utama.",
  ],
};

bab(
  "Rincian Tiap Bagian LED",
  `Susunan ${ledBagian.length} bagian dari tiga bab LED, beserta batas halamannya`,
);

push(
  `Laporan Evaluasi Diri (LED) disusun dari **${ledBagian.length} bagian** yang`,
  `terbagi ke dalam **${Object.keys(perBab).length} bab**.`,
  "",
);
push("**Batas halaman itu anjuran, bukan tembok.** Angka di kolom batas halaman");
push(
  "menunjukkan perkiraan panjang yang wajar. Bagian yang isinya lebih padat",
  "boleh lebih panjang, tapi bagian yang jauh melebihi batas biasanya tanda",
  "uraiannya belum dipadatkan.",
  "",
);

sub("Jenis bagian dan cara menulisnya");
for (const [j, ket] of Object.entries(ARTi_JENIS_LED)) {
  subsub(`${j} — ${jenisLed[j]?.length ?? 0} bagian`);
  for (const baris of ket) push(baris);
  push("");
  if (jenisLed[j]?.length) {
    push(`Bagian berjenis ini: ${jenisLed[j].map((x) => `\`${x.kode}\``).join(", ")}.`, "");
  }
}

sub("Rekapitulasi per bab");
push("| Bab | Bagian | Batas halaman | Jenis yang ada |");
push("|---|---:|---:|---|");
for (const [k, v] of Object.entries(perBab)) {
  const total = v.reduce((s, x) => s + (x.batasHalaman ?? 0), 0);
  const jenis = [...new Set(v.map((x) => x.jenis))].join(", ");
  push(`| [BAB ${k}](#bagian-led-${anchor("bab " + k)}) | ${v.length} | ${total} | ${jenis} |`);
}
push(`| **Total** | **${ledBagian.length}** | **${ledBagian.reduce((s, x) => s + (x.batasHalaman ?? 0), 0)}** | |`);
push("");

for (const [k, v] of Object.entries(perBab)) {
  subAnchor(`BAB ${k} — ${v.length} bagian`, `bagian-led-${anchor("bab " + k)}`);
  push(
    `Bab ini memuat **${v.length} bagian** dengan batas halaman keseluruhan`,
    `**${v.reduce((s, x) => s + (x.batasHalaman ?? 0), 0)} halaman**.`,
    "",
  );
  push("| No | Kode | Bagian | Judul | Jenis | Batas halaman | Halaman terkait |");
  push("|---:|---|---|---|---|---:|---|");
  v.forEach((x, i) => {
    push(
      `| ${i + 1} | \`${x.kode}\` | ${x.bagian} | ${barisTabel(x.judul)} | ${x.jenis} | ${x.batasHalaman ?? "—"} | \`/led/${anchor(x.kode)}\` |`,
    );
  });
  push("");

  for (const x of v) {
    subsubAnchor(`\`${x.kode}\` — ${x.judul}`, anchor(x.kode));
    push("| | |");
    push("|---|---|");
    push(`| **Kode** | \`${x.kode}\` |`);
    push(`| **Bab** | BAB ${x.bab} |`);
    push(`| **Bagian** | ${x.bagian} |`);
    push(`| **Jenis** | ${x.jenis} |`);
    push(`| **Batas halaman** | ${x.batasHalaman ?? "tidak dibatasi"} |`);
    push(`| **Urutan** | ${x.urutan} |`);
    push(`| **Halaman aplikasi** | \`/led/${anchor(x.kode)}\` |`);
    push("");
    const ket = ARTi_JENIS_LED[x.jenis];
    if (ket) push(`*${ket[0]}* ${ket.slice(1).join(" ")}`, "");
    if (x.jenis === "KRITERIA") {
      push(
        "Bagian ini punya pasangan butir di Matriks Penilaian. Waktu menulis,",
        "periksa dulu deskriptor butirnya supaya uraian LED benar-benar menjawab",
        "apa yang diminta instrumen.",
        "",
      );
    }
  }
}

// ---------------------------------------------------- bab: penilaian

bab("Modul Matriks Penilaian", `Rumus perhitungan dan seluruh ${stat.butir} butir beserta bobotnya`);

push(
  "Modul ini menghitung capaian akreditasi. Tiap butir punya empat tingkat skor",
  "beserta deskriptornya dan bobotnya sendiri.",
  "",
);
push("### Rumus perhitungan");
push("");
push("```");
push("nilai akhir = Σ (skor butir × bobot butir) / 4");
push("```");
push("");
push(
  `- ` + "**Jumlah butir:** " + stat.butir,
  `- **Total bobot:** ${stat.bobot} (dirancang tepat ${stat.bobot}; pengisian data akan gagal kalau tidak sama)`,
  "- **Skor tiap butir:** 0 sampai 4",
  "- **Bobot perkalian:** skor 1 dikali 1, skor 2 dikali 2, skor 3 dikali 3, skor 4 dikali 4",
  "",
);

const perKriteria = butirPenilaian.reduce((a, x) => {
  (a[x.kriteria] ??= []).push(x);
  return a;
}, {});
push("### Sebaran butir per kriteria");
push("");
push("| Kriteria | Nama | Butir | Bobot |");
push("|---|---|---:|---:|");
for (const [k, v] of Object.entries(perKriteria)) {
  push(`| \`${k}\` | ${barisTabel(v[0].namaKriteria ?? "—")} | ${v.length} | ${v.reduce((s, x) => s + x.bobot, 0)} |`);
}
push(`| **Total** | | **${stat.butir}** | **${stat.bobot}** |`);
push("");

push("### Daftar seluruh butir");
push("");
push("| No | Kode | Kriteria | Bobot | Tahap PPEPP | Elemen penilaian |");
push("|---:|---|---|---:|---|---|");
butirPenilaian.forEach((x, i) => {
  push(`| ${i + 1} | \`${x.kode}\` | ${x.kriteria} | ${x.bobot} | ${barisTabel(x.tahapPpepp ?? "—")} | ${barisTabel((x.elemenPenilaian ?? "").slice(0, 110))} |`);
});
push("");

// ---------------------------------------- bab: penjelasan penuh tiap butir

bab(
  "Penjelasan Lengkap Tiap Butir Penilaian",
  `Deskriptor dan keempat tingkat skor untuk seluruh ${stat.butir} butir — dipakai saat menilai`,
);

push(
  "Bab ini memuat isi penuh setiap butir penilaian: apa yang dinilai, apa yang",
  "diminta untuk tiap tingkat skor, dan berapa bobotnya.",
  "",
  "**Cara membacanya.** Setiap butir punya empat tingkat. Penilai memilih tingkat",
  "yang paling sesuai dengan kondisi nyata program studi. Tingkat yang lebih",
  "tinggi menuntut bukti yang lebih kuat — perhatikan kata penegasnya: *kurang*,",
  "*cukup*, *komprehensif*, *sangat komprehensif*.",
  "",
  "> **Skor bukan nilai akhir.** Kontribusi tiap butir dihitung dengan",
  "> `skor × bobot`, lalu dijumlahkan seluruhnya dan dibagi 4. Butir berbobot",
  "> besar berpengaruh lebih kuat terhadap hasil akhir.",
  "",
);

for (const [krt, isi] of Object.entries(perKriteria)) {
  sub(`Kriteria \`${krt}\` — ${isi[0].namaKriteria ?? ""}`);
  push(
    `Memuat **${isi.length} butir** dengan total bobot **${isi.reduce((s, x) => s + x.bobot, 0)}**.`,
    "",
  );

  for (const b of isi) {
    subsub(`Butir \`${b.kode}\` — bobot ${b.bobot}`);
    push("| | |");
    push("|---|---|");
    push(`| **Kode** | \`${b.kode}\` |`);
    push(`| **Kriteria** | \`${b.kriteria}\` — ${barisTabel(b.namaKriteria ?? "—")} |`);
    push(`| **Bobot** | ${b.bobot} |`);
    if (b.jenis) push(`| **Jenis** | ${barisTabel(b.jenis)} |`);
    if (b.tahapPpepp) push(`| **Tahap PPEPP** | ${barisTabel(b.tahapPpepp)} |`);
    if (b.halPdf !== undefined && b.halPdf !== null) push(`| **Halaman di instrumen** | ${b.halPdf} |`);
    push("");

    if (b.elemenPenilaian) {
      push("**Elemen penilaian:**", "");
      push(`> ${b.elemenPenilaian}`, "");
    }
    if (b.deskriptor) {
      push("**Deskriptor:**", "");
      push(b.deskriptor, "");
    }
    if (b.syaratUnggul) {
      push(`**Syarat peringkat Unggul:** ${b.syaratUnggul}`, "");
    }

    push("**Tingkat skor:**", "");
    for (const t of [1, 2, 3, 4]) {
      const teks = b[`skor${t}`];
      if (!teks) continue;
      push(`- **Skor ${t}** — ${teks}`);
      push("");
    }
    push("");
  }
}


// --------------------------------------------------------- bab: lib

bab("Pustaka Internal", `${stat.lib} berkas di folder lib/: perkakas, hitungan, dan penyusun dokumen`);

const grupLib = {};
for (const l of libBerkas) {
  const bagian = l.pathRel.split("/");
  const g = bagian.length > 2 ? bagian.slice(0, 2).join("/") : "lib/ (akar)";
  (grupLib[g] ??= []).push(l);
}

for (const [g, isi] of Object.entries(grupLib).sort()) {
  sub(`Folder \`${g}\``);
  for (const l of isi) {
    subsub(`\`${l.pathRel.split("/").pop()}\``);
    push(`**Berkas.** \`${l.pathRel}\` (${l.baris} baris)`, "");
    if (l.maksud) push(`**Maksud.** ${l.maksud}`, "");
    if (l.tabel.length) push(`**Tabel database:** ${l.tabel.map((t) => `\`${t}\``).join(", ")}`, "");
    if (l.ekspor.length) {
      push("| Nama | Jenis | Keterangan |");
      push("|---|---|---|");
      for (const e of l.ekspor) push(`| \`${e.nama}\` | ${e.jenis} | ${barisTabel(e.catatan ?? "—")} |`);
      push("");
    }
  }
}

// --------------------------------------------- bab naratif lanjutan

bab("Panduan Pengembangan", "Perintah, konvensi penamaan, dan cara menambah fitur", N.babPanduanDev);
bab("Pengujian", "Dua lapis pengujian dan apa saja yang ditutup", N.babPengujian);
bab("Deploy dan Operasi", "Menaikkan perubahan, memantau, dan merawat", N.babDeploy);
bab("Pemecahan Masalah", "Gejala, sebab, dan penanganan — dari kejadian nyata", N.babMasalah);
bab("Konvensi dan Aturan Tetap", "Aturan yang tidak boleh dilanggar beserta alasannya", N.babKonvensi);
bab("Utang Teknis", "Yang belum beres, disertai alamat berkasnya", N.babUtangTeknis);

// --------------------------------------------------- bab: indeks berkas

bab("Indeks Seluruh Berkas", "Peta semua berkas: mana dijelaskan di bab mana");

push(
  "Tabel di bawah memetakan setiap berkas sumber ke bab yang membahasnya. Dipakai",
  "kalau kamu menemukan sebuah berkas dan ingin tahu fungsinya.",
  "",
);
push("| Berkas | Baris | Dijelaskan di |");
push("|---|---:|---|");
const indeksBerkas = [
  ...halaman.map((h) => ({ p: h.pathRel, b: h.baris, bab: rujukBab("Referensi Halaman") })),
  ...api.map((a) => ({ p: a.pathRel, b: a.baris, bab: rujukBab("API dan Server Action") })),
  ...komponen.map((k) => ({ p: k.pathRel, b: k.baris, bab: rujukBab("Referensi Komponen") })),
  ...libBerkas.map((l) => ({ p: l.pathRel, b: l.baris, bab: rujukBab("Pustaka Internal") })),
  { p: "prisma/schema.prisma", b: baca("prisma/schema.prisma").split("\n").length, bab: rujukBab("Skema Basis Data") },
  { p: "prisma/seed.ts", b: baca("prisma/seed.ts").split("\n").length, bab: rujukBab("Daftar Tabel LKPS") },
  { p: "prisma/seed-modul-baru.ts", b: baca("prisma/seed-modul-baru.ts").split("\n").length, bab: rujukBab("Modul LED") },
];
indeksBerkas.sort((a, b) => a.p.localeCompare(b.p));
for (const x of indeksBerkas) push(`| \`${x.p}\` | ${x.b} | ${x.bab} |`);
push("");

bab("Penutup", "Ringkasan angka dan cara menjaga dokumen ini tetap benar", N.babPenutup);

// ============================================================== penulisan

const isi = B.join("\n").replace(/\n{4,}/g, "\n\n\n").trimEnd() + "\n";

// Daftar isi ditulis ulang sekarang karena semua bab sudah terdaftar
const akhir = isi.replace(
  /(\| # \| Bab \| Isinya \|\n\|---\|---\|---\|\n)(?:.*\n)*?(\n\*\*Ringkasan angka)/,
  (m, kepala, ekor) => kepala + DAFTAR_ISI.map((d) => `| ${d.nomor} | [${d.judul}](#${d.anchor}) | ${d.ringkas} |`).join("\n") + ekor,
);

writeFileSync(join(ROOT, "README.md"), akhir);
console.log(`README.md ditulis: ${akhir.split("\n").length} baris`);
