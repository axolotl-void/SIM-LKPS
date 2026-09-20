#!/usr/bin/env node
/**
 * Generator referensi kode untuk handover SIM-LKPS.
 *
 * Membaca repo ini apa adanya lalu menghasilkan satu halaman Markdown per berkas
 * sumber di docs/handover/referensi/, plus indeks RINGKASAN.md.
 *
 * Tujuannya: tim BTIK (atau siapa pun yang melanjutkan) bisa mencari
 * "file ini gunanya apa, dipanggil siapa, dan kalau mau ubah X buka di mana".
 *
 * Jalankan ulang setiap kali kode berubah:
 *   node docs/handover/generate-referensi.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync } from "node:fs";
import { join, relative, dirname, basename, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const OUT = join(ROOT, "docs/handover/referensi");

/** Direktori yang dipindai, urut sesuai kepentingan pembaca. */
const AREA = [
  { dir: "app", label: "Halaman & API (App Router)" },
  { dir: "components", label: "Komponen Antarmuka" },
  { dir: "lib", label: "Logika Server, Utilitas, Export" },
  { dir: "prisma", label: "Skema & Seed Basis Data" },
  { dir: "tests", label: "Pengujian" },
];

const BERKAS_ROOT = [
  "middleware.ts",
  "next.config.ts",
  "eslint.config.js",
  "package.json",
  "tsconfig.json",
  "docker-compose.yml",
  "README.md",
];

const ABAB = new Set(["node_modules", ".next", ".git", "test-results", "playwright-report", "docs"]);

// ---------------------------------------------------------------- pemindaian

function daftarBerkas(dir) {
  const hasil = [];
  const telusuri = (d) => {
    let isi;
    try {
      isi = execFileSync("find", [d, "-type", "f"], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
    } catch {
      return;
    }
    for (const baris of isi.split("\n")) {
      const p = baris.trim();
      if (!p) continue;
      if (p.split("/").some((seg) => ABAB.has(seg))) continue;
      if (!/\.(ts|tsx|js|mjs|json|prisma|yml|yaml|css|md)$/.test(p)) continue;
      hasil.push(p);
    }
  };
  telusuri(dir);
  return hasil.sort();
}

const berkas = [];
for (const a of AREA) {
  const d = join(ROOT, a.dir);
  if (existsSync(d) && statSync(d).isDirectory()) {
    for (const f of daftarBerkas(d)) berkas.push({ path: f, area: a.label });
  }
}
for (const r of BERKAS_ROOT) {
  const p = join(ROOT, r);
  if (existsSync(p)) berkas.push({ path: p, area: "Berkas Akar Repo" });
}

// ------------------------------------------------------------------ pemetaan

const info = new Map();

function ambilBlokKomentarAtas(teks) {
  const baris = teks.split("\n");
  const keluar = [];
  let mulai = false;
  for (const b of baris.slice(0, 60)) {
    const t = b.trim();
    if (!mulai) {
      if (t.startsWith("/**") || t.startsWith("/*")) {
        mulai = true;
        keluar.push(t.replace(/^\/\*\*?\s?/, "").replace(/\*\/$/, "").trim());
        if (t.includes("*/")) break;
      } else if (t.startsWith("//")) {
        keluar.push(t.replace(/^\/\/\s?/, ""));
      } else if (t.startsWith('"use client"') || t.startsWith("'use client'") || t.startsWith('"use server"')) {
        continue;
      } else if (t === "") {
        continue;
      } else {
        break;
      }
    } else {
      keluar.push(t.replace(/^\*\s?/, "").replace(/\*\/$/, "").trim());
      if (t.includes("*/")) break;
    }
  }
  const bersih = keluar.map((s) => s.trim()).filter((s) => s && !s.startsWith("@"));
  return bersih.join(" ").trim();
}

/** Ambil komentar yang PERSIS berada di atas sebuah baris (mundur dari baris itu). */
function komentarAtas(teks, posisi) {
  const sebelum = teks.slice(0, posisi).split("\n");
  // buang ekor kosong
  let i = sebelum.length - 1;
  while (i >= 0 && sebelum[i].trim() === "") i--;
  if (i < 0) return "";
  const baris = [];
  if (sebelum[i].trim().endsWith("*/")) {
    // blok /** ... */ atau /* ... */
    while (i >= 0) {
      const t = sebelum[i].trim();
      if (t.startsWith("/**") || t.startsWith("/*")) {
        baris.unshift(t.replace(/^\/\*\*?\s?/, "").replace(/\*\/$/, "").trim());
        break;
      }
      baris.unshift(t.replace(/^\*\s?/, "").replace(/\*\/$/, "").trim());
      i--;
      if (sebelum.length - i > 60) break;
    }
  } else {
    // deretan komentar //
    while (i >= 0 && sebelum[i].trim().startsWith("//")) {
      baris.unshift(sebelum[i].trim().replace(/^\/\/\s?/, ""));
      i--;
      if (sebelum.length - i > 40) break;
    }
  }
  return baris
    .map((s) => s.trim().replace(/^[─=\-*_\s]+/, "").replace(/[─=\-*_\s]+$/, "").trim())
    .filter((s) => s && !s.startsWith("@") && !s.startsWith("eslint") && !s.startsWith("prettier"))
    .join(" ")
    .trim();
}

function ambilEkspor(teks) {
  const pola = [
    [/^export\s+async\s+function\s+([A-Za-z0-9_]+)/gm, "fungsi async"],
    [/^export\s+function\s+([A-Za-z0-9_]+)/gm, "fungsi"],
    [/^export\s+async\s+const\s+([A-Za-z0-9_]+)/gm, "konstanta async"],
    [/^export\s+const\s+([A-Za-z0-9_]+)/gm, "konstanta"],
    [/^export\s+type\s+([A-Za-z0-9_]+)/gm, "tipe"],
    [/^export\s+interface\s+([A-Za-z0-9_]+)/gm, "interface"],
    [/^export\s+default\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/gm, "default"],
  ];
  const hasil = [];
  const terlihat = new Set();
  for (const [re, jenis] of pola) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(teks))) {
      const nama = m[1];
      if (terlihat.has(nama)) continue;
      terlihat.add(nama);
      hasil.push({ nama, jenis, pos: m.index, catatan: komentarAtas(teks, m.index).slice(0, 400) });
    }
  }
  // urutkan sesuai kemunculan di berkas supaya enak dibaca
  hasil.sort((a, b) => a.pos - b.pos);
  return hasil;
}

/** Ringkasan satu baris untuk berkas yang tidak punya komentar pembuka. */
function ringkasDariNama(v) {
  const nama = v.pathRel;

  // Berkas halaman/API: jelaskan perannya, bukan sekadar "1 deklarasi: metadata".
  if (/page\.tsx$/.test(nama)) {
    const klien = v.impor.dalam.find((p) => /Client|Form|Section/.test(p));
    const dasar = `Berkas halaman untuk alamat \`${v.rute ?? "?"}\`. Tugasnya menyiapkan data di server (dan memeriksa izin), lalu menyerahkan tampilan ke komponen client.`;
    return klien ? `${dasar} Isinya dirender oleh \`${klien}\`.` : dasar;
  }
  if (/route\.ts$/.test(nama)) {
    return `Berkas API untuk alamat \`${v.rute ?? "?"}\`. Di sinilah permintaan dari browser diproses dan jawabannya disusun.`;
  }
  if (/layout\.tsx$/.test(nama)) {
    return "Berkas tata letak (layout) — pembungkus yang tetap terpasang saat berpindah antar halaman di bawahnya.";
  }
  if (/loading\.tsx$/.test(nama)) {
    return "Tampilan sementara yang muncul saat halaman ini masih dimuat.";
  }
  if (/error\.tsx$/.test(nama)) {
    return "Tampilan yang muncul kalau halaman ini gagal dimuat, supaya pengguna tidak melihat layar putih.";
  }
  if (/\.spec\.ts$/.test(nama)) {
    return "Berkas pengujian otomatis — memeriksa bahwa fitur ini bekerja seperti seharusnya.";
  }
  if (/seed/.test(nama)) {
    return "Berkas pengisian data awal — menyiapkan data bawaan saat sistem dipasang pertama kali.";
  }

  const fungsi = v.ekspor.filter((e) => e.jenis.startsWith("fungsi")).map((e) => e.nama);
  if (fungsi.length) {
    return `Berkas ini menyediakan ${fungsi.length} fungsi utama: ${fungsi.slice(0, 8).map((n) => `\`${n}\``).join(", ")}${fungsi.length > 8 ? ", dan lainnya" : ""}.`;
  }
  const kandidat = v.ekspor.filter((e) => e.jenis === "konstanta" || e.jenis === "interface" || e.jenis === "tipe");
  if (kandidat.length) {
    return `Berkas ini berisi ${kandidat.length} deklarasi: ${kandidat.slice(0, 8).map((n) => `\`${n.nama}\``).join(", ")}${kandidat.length > 8 ? ", dan lainnya" : ""}.`;
  }
  const khusus = v.ekspor.filter((e) => e.jenis === "default" || e.jenis === "komponen");
  if (khusus.length) {
    return `Berkas ini berisi komponen tampilan \`${khusus.map((e) => e.nama).join("`, `")}\`.`;
  }
  return "Berkas ini tidak mengekspor apa pun ke luar — dipakai sekali di tempatnya sendiri.";
}

function ambilImpor(teks, pathRel) {
  const dalam = new Set();
  const luar = new Set();
  const re = /(?:^|\n)\s*import[\s\S]*?from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(teks))) {
    const s = m[1];
    if (s.startsWith("@/")) {
      dalam.add(s.replace(/^@\//, ""));
    } else if (s.startsWith(".")) {
      // Impor relatif ("./DeveloperClient") HARUS diselesaikan ke path repo,
      // kalau tidak tautannya menggantung dan bagian "Dipakai oleh" jadi salah.
      const diselesaikan = resolveRelatif(pathRel, s);
      if (diselesaikan) dalam.add(diselesaikan);
    } else if (!s.startsWith("next/") && !s.startsWith("react")) {
      luar.add(s.split("/")[0].startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0]);
    } else {
      luar.add(s);
    }
  }
  return { dalam: [...dalam].sort(), luar: [...luar].sort() };
}

/** Ubah "./DeveloperClient" (dari dalam app/x/page.tsx) jadi "app/x/DeveloperClient". */
function resolveRelatif(pathRel, spec) {
  const dir = pathRel.includes("/") ? pathRel.slice(0, pathRel.lastIndexOf("/")) : "";
  const gabung = dir ? `${dir}/${spec}` : spec;
  const bagian = gabung.split("/");
  const keluar = [];
  for (const b of bagian) {
    if (b === "" || b === ".") continue;
    if (b === "..") keluar.pop();
    else keluar.push(b);
  }
  return keluar.join("/");
}

function ruteDari(pathRel) {
  if (!pathRel.startsWith("app/")) return null;
  let r = pathRel.replace(/^app\//, "").replace(/(?:^|\/)page\.tsx$/, "").replace(/(?:^|\/)route\.ts$/, "");
  if (!/page\.tsx$/.test(pathRel) && !/route\.ts$/.test(pathRel)) return null;
  r = r.replace(/\([^)]*\)\//g, "");
  r = r.replace(/^\/+|\/+$/g, "");
  const adalahApi = /route\.ts$/.test(pathRel);
  return (adalahApi ? "/api/" : "/") + r.replace(/^api\//, "");
}

for (const { path, area } of berkas) {
  let teks = "";
  try {
    teks = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  if (teks.length > 400_000) continue;
  const pathRel = relative(ROOT, path);
  info.set(pathRel, {
    pathRel,
    area,
    baris: teks.split("\n").length,
    byte: teks.length,
    maksud: ambilBlokKomentarAtas(teks),
    ekspor: ambilEkspor(teks),
    impor: ambilImpor(teks, pathRel),
    rute: ruteDari(pathRel),
    client: /^\s*["']use client["']/m.test(teks),
    server: /^\s*["']use server["']/m.test(teks),
  });
}

/** Peta balik: berkas ini diimpor oleh siapa. */
const dipakaiOleh = new Map();
for (const [k, v] of info) {
  for (const impor of v.impor.dalam) {
    const kandidat = [
      impor,
      `${impor}.ts`,
      `${impor}.tsx`,
      `${impor}/index.ts`,
      `${impor}/index.tsx`,
      `${impor}.css`,
    ];
    for (const c of kandidat) {
      if (info.has(c)) {
        if (!dipakaiOleh.has(c)) dipakaiOleh.set(c, new Set());
        dipakaiOleh.get(c).add(k);
        break;
      }
    }
  }
}

// ------------------------------------------------------------------- penulisan

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/** Nama berkas aman untuk dipakai di filesystem. */
function namaAman(pathRel) {
  // PENTING: ekstensi sumber (.ts/.tsx) diganti ".md" supaya TypeScript tidak
  // menganggap berkas dokumentasi ini sebagai kode sumber — pernah kejadian dan
  // membuat `pnpm type-check` gagal dengan ratusan galat palsu.
  return (
    pathRel
      .replace(/[/\\]/g, "__")
      .replace(/[^A-Za-z0-9_.@\-]/g, "-")
      .replace(/\.(tsx|ts|mjs|jsx|js|css|prisma|json)$/, "") + ".md"
  );
}

function tautanDari(dariPath, kePath) {
  const dariDir = dirname(join(OUT, namaAman(dariPath)));
  const ke = join(OUT, namaAman(kePath));
  let rel = relative(dariDir, ke);
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return encodeURI(rel);
}

const urutanArea = [...new Set(berkas.map((b) => b.area))];
let totalBarisDokumen = 0;
const indeks = [];

for (const area of urutanArea) {
  const anggota = [...info.values()].filter((v) => v.area === area);
  for (const v of anggota) {
    const L = [];
    const judul = v.pathRel;
    L.push(`# \`${judul}\``);
    L.push("");
    L.push(`| | |`);
    L.push(`|---|---|`);
    L.push(`| **Area** | ${v.area} |`);
    L.push(`| **Ukuran** | ${v.baris} baris |`);
    L.push(`| **Jenis** | ${v.client ? "Client Component (`\"use client\"`)" : v.server ? "Server Action (`\"use server\"`)" : "modul biasa"} |`);
    if (v.rute) L.push(`| **Alamat URL** | \`${v.rute}\` |`);
    const pemakai = [...(dipakaiOleh.get(v.pathRel) ?? [])].sort();
    L.push(`| **Dipakai oleh** | ${pemakai.length} berkas |`);
    L.push("");

    if (v.maksud) {
      L.push("## Maksud berkas");
      L.push("");
      L.push(v.maksud);
      L.push("");
    } else {
      L.push("## Maksud berkas");
      L.push("");
      L.push(ringkasDariNama(v));
      L.push("");
    }

    L.push("## Letak berkas");
    L.push("");
    L.push(`Dari akar repo: \`${judul}\`.`);
    L.push("");
    if (v.client) {
      L.push("Berkas ini berjalan **di browser pengguna** (`\"use client\"`). Di dalamnya ada");
      L.push("pengelolaan state dan kejadian klik/ketik. Jangan menaruh kode rahasia");
      L.push("(kata sandi, kunci API) di sini — isinya bisa dibaca pengguna.");
      L.push("");
    }
    if (v.server) {
      L.push("Berkas ini berjalan **di server saja** (`\"use server\"`). Semua perubahan data");
      L.push("ke basis data lewat sini, dan di sini juga pemeriksaan izin dilakukan.");
      L.push("");
    }

    if (v.ekspor.length) {
      L.push("## Isi yang bisa dipakai berkas lain");
      L.push("");
      for (const e of v.ekspor) {
        L.push(`### \`${e.nama}\``);
        L.push("");
        L.push(`Jenis: **${e.jenis}**`);
        L.push("");
        if (e.catatan) {
          L.push(e.catatan);
          L.push("");
        }
      }
    }

    if (v.rute) {
      L.push("## Alamat yang dilayani");
      L.push("");
      L.push(`Halaman ini bisa dibuka di \`${v.rute}\`.`);
      L.push("");
      L.push("Kalau mau mengubah apa yang tampil di alamat itu, **berkas ini yang pertama dibuka**.");
      L.push("");
    }

    if (v.impor.luar.length) {
      L.push("## Pustaka luar yang dipakai");
      L.push("");
      for (const p of v.impor.luar) L.push(`- \`${p}\``);
      L.push("");
    }

    if (v.impor.dalam.length) {
      L.push("## Berkas lain di proyek ini yang dipanggil");
      L.push("");
      for (const p of v.impor.dalam) {
        const ada = info.has(p) || info.has(`${p}.ts`) || info.has(`${p}.tsx`);
        const target = info.has(p) ? p : info.has(`${p}.ts`) ? `${p}.ts` : info.has(`${p}.tsx`) ? `${p}.tsx` : null;
        if (target) L.push(`- [\`${target}\`](${tautanDari(v.pathRel, target)})`);
        else L.push(`- \`${p}\`${ada ? "" : " *(tidak ditemukan di pindai ini)*"}`);
      }
      L.push("");
    }

    if (pemakai.length) {
      L.push("## Berkas yang memanggil berkas ini");
      L.push("");
      L.push("Kalau kamu mengubah nama fungsi atau bentuk datanya, berkas-berkas ini ikut terdampak:");
      L.push("");
      for (const p of pemakai) L.push(`- [\`${p}\`](${tautanDari(v.pathRel, p)})`);
      L.push("");
    }

    const isi = L.join("\n") + "\n";
    writeFileSync(join(OUT, namaAman(v.pathRel)), isi);
    totalBarisDokumen += isi.split("\n").length;
    indeks.push(v);
  }
}

// --------------------------------------------------------------- RINGKASAN.md

const R = [];
R.push("# Referensi Berkas SIM-LKPS");
R.push("");
R.push("Dokumen ini **dihasilkan otomatis** dari kode yang benar-benar ada di repo.");
R.push("Setiap berkas sumber punya halamannya sendiri di folder ini.");
R.push("");
R.push("> **Jangan sunting berkas di folder ini dengan tangan.**");
R.push("> Setelah kode diubah, jalankan ulang dari akar repo:");
R.push(">");
R.push("> ```bash");
R.push("> node docs/handover/generate-referensi.mjs");
R.push("> ```");
R.push("");
R.push(`Terakhir dibuat: ${new Date().toISOString().slice(0, 10)} · ` +
  `${indeks.length} berkas · ${indeks.reduce((s, v) => s + v.baris, 0).toLocaleString("id-ID")} baris kode`);
R.push("");
R.push("## Cara memakai halaman ini");
R.push("");
R.push("1. Cari berkas yang mau diubah di daftar bawah.");
R.push("2. Buka halamannya — di situ ada maksud berkas, isi yang bisa dipakai");
R.push("   berkas lain, dan **berkas mana saja yang ikut terdampak** kalau diubah.");
R.push("3. Alamat URL yang dilayani tertera di bagian atas halaman.");
R.push("");
R.push("Untuk tugas umum (\"ganti logo\", \"tambah kolom tabel\", \"ubah warna\"),");
R.push("lebih cepat buka `../03-ubah-fitur-ini.md`.");
R.push("");

for (const area of urutanArea) {
  const anggota = indeks.filter((v) => v.area === area).sort((a, b) => a.pathRel.localeCompare(b.pathRel));
  if (!anggota.length) continue;
  R.push(`## ${area}`);
  R.push("");
  R.push(`${anggota.length} berkas · ${anggota.reduce((s, v) => s + v.baris, 0).toLocaleString("id-ID")} baris`);
  R.push("");
  R.push("| Berkas | Baris | URL | Ringkas |");
  R.push("|---|---:|---|---|");
  for (const v of anggota) {
    const ringkas = (v.maksud || v.ekspor.map((e) => e.nama).slice(0, 4).join(", ") || "—")
      .replace(/\|/g, "\\|")
      .slice(0, 110);
    const url = v.rute ? `\`${v.rute}\`` : "—";
    R.push(`| [\`${v.pathRel}\`](${tautanDari("RINGKASAN.md", v.pathRel)}) | ${v.baris} | ${url} | ${ringkas} |`);
  }
  R.push("");
}

const isiRingkasan = R.join("\n") + "\n";
writeFileSync(join(OUT, "RINGKASAN.md"), isiRingkasan);

// -------------------------------------------------------------------- laporan

const lap = [];
lap.push("");
lap.push("SELESAI");
lap.push(`  berkas dipindai     : ${indeks.length}`);
lap.push(`  baris kode          : ${indeks.reduce((s, v) => s + v.baris, 0).toLocaleString("id-ID")}`);
lap.push(`  halaman referensi   : ${indeks.length}`);
lap.push(`  baris dokumentasi   : ${(totalBarisDokumen + isiRingkasan.split("\n").length).toLocaleString("id-ID")}`);
lap.push("");
for (const area of urutanArea) {
  const n = indeks.filter((v) => v.area === area).length;
  lap.push(`  ${String(n).padStart(4)} berkas  ${area}`);
}
console.log(lap.join("\n"));
