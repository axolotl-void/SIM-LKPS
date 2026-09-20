/**
 * Alat baca repo untuk generator README.
 *
 * Semua yang dikeluarkan fungsi di sini diambil dari berkas asli — tidak ada
 * yang dikarang. Tujuan: README selalu sesuai kode, dan bisa dibuat ulang
 * kapan saja setelah kode berubah.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";

export const ROOT = process.cwd();

export const baca = (p) => readFileSync(join(ROOT, p), "utf8");
export const ada = (p) => existsSync(join(ROOT, p));
export const jumlahBaris = (p) => baca(p).split("\n").length;

/** Cari semua berkas di bawah sebuah folder. */
export function cariSemua(dir, akhiran = [".ts", ".tsx"], abaikan = ["node_modules", ".next"]) {
  const keluar = [];
  function jalan(d) {
    let isi;
    try {
      isi = readdirSync(join(ROOT, d), { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of isi) {
      if (abaikan.includes(e.name)) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) jalan(p);
      else if (akhiran.some((a) => e.name.endsWith(a))) keluar.push(p);
    }
  }
  jalan(dir);
  return keluar.sort();
}

// ------------------------------------------------------------- basis data

/** Baca seluruh model + enum dari schema.prisma. */
export function bacaSchema() {
  const teks = baca("prisma/schema.prisma");
  const model = [];
  const enums = [];

  for (const m of teks.matchAll(/model\s+(\w+)\s*\{([\s\S]*?)\n\}/g)) {
    const [, nama, isi] = m;
    const kolom = [];
    const relasi = [];
    const catatan = [];
    for (const barisMentah of isi.split("\n")) {
      const baris = barisMentah.trim();
      if (!baris) continue;
      if (baris.startsWith("//")) {
        catatan.push(baris.replace(/^\/\/\s?/, ""));
        continue;
      }
      if (baris.startsWith("@@")) continue;
      const bagian = baris.split(/\s+/);
      if (bagian.length < 2) continue;
      const [nama2, tipe] = bagian;
      const atribut = baris.slice(nama2.length).trim();
      const tipeBersih = tipe.replace(/[?[\]]/g, "");
      const entri = { nama: nama2, tipe, atribut, catatan: null };
      // Komentar di ujung baris
      const km = baris.match(/\/\/\s*(.+)$/);
      if (km) entri.catatan = km[1].trim();
      if (/^[A-Z]\w*(\[\])?$/.test(tipeBersih) && !["String", "Int", "Boolean", "DateTime", "Float", "Json", "Decimal"].includes(tipeBersih)) {
        relasi.push(entri);
      } else {
        kolom.push(entri);
      }
    }
    model.push({ nama, kolom, relasi, catatan: catatan.join(" ") });
  }

  for (const m of teks.matchAll(/enum\s+(\w+)\s*\{([\s\S]*?)\n\}/g)) {
    const nilai = m[2]
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("//"));
    enums.push({ nama: m[1], nilai });
  }

  return { model, enums };
}

// ----------------------------------------------------------------- kode

/** Komentar blok yang menempel di atas sebuah posisi. */
export function komentarAtas(teks, posisi) {
  const sebelum = teks.slice(0, posisi).split("\n");
  const baris = [];
  for (let i = sebelum.length - 1; i >= 0; i--) {
    const t = sebelum[i].trim();
    if (!t) {
      if (baris.length) break;
      continue;
    }
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) {
      baris.unshift(t.replace(/^\/\*+\s?/, "").replace(/\*\/$/, "").replace(/^\/\/\s?/, "").replace(/^\*\s?/, "").trim());
      continue;
    }
    break;
  }
  return baris
    .filter((s) => s && !s.startsWith("@") && !s.startsWith("eslint") && !s.startsWith("prettier"))
    .join(" ")
    .replace(/^[─=\-*_\s]+|[─=\-*_\s]+$/g, "")
    .trim();
}

/** Fungsi/konstanta yang diekspor. */
export function bacaEkspor(teks) {
  const keluar = [];
  const pola = [
    [/^export\s+async\s+function\s+(\w+)/gm, "fungsi async (server action / data)"],
    [/^export\s+function\s+(\w+)/gm, "fungsi"],
    [/^export\s+const\s+(\w+)\s*=\s*(?:async\s*)?\(/gm, "fungsi panah"],
    [/^export\s+const\s+(\w+)/gm, "konstanta"],
    [/^export\s+default\s+function\s+(\w+)/gm, "komponen default"],
    [/^export\s+interface\s+(\w+)/gm, "interface"],
    [/^export\s+type\s+(\w+)/gm, "tipe"],
    [/^export\s+class\s+(\w+)/gm, "kelas"],
  ];
  for (const [re, jenis] of pola) {
    for (const m of teks.matchAll(re)) {
      keluar.push({ nama: m[1], jenis, pos: m.index, catatan: komentarAtas(teks, m.index) });
    }
  }
  keluar.sort((a, b) => a.pos - b.pos);
  return keluar.filter((e, i, arr) => arr.findIndex((x) => x.nama === e.nama) === i);
}

/** Impor dalam proyek (bukan pustaka luar). */
export function bacaImpor(teks, pathRel) {
  const dalam = new Set();
  for (const m of teks.matchAll(/(?:^|\n)\s*import[\s\S]*?from\s+["']([^"']+)["']/g)) {
    const s = m[1];
    if (s.startsWith("@/")) dalam.add(s.replace(/^@\//, ""));
    else if (s.startsWith(".")) dalam.add(selesaikanRelatif(pathRel, s));
  }
  return [...dalam].filter(Boolean).sort();
}

/** "./X" dari "app/a/b/page.tsx" → "app/a/b/X". */
export function selesaikanRelatif(pathRel, spec) {
  const dir = pathRel.includes("/") ? pathRel.slice(0, pathRel.lastIndexOf("/")) : "";
  const bagian = `${dir}/${spec}`.split("/");
  const keluar = [];
  for (const b of bagian) {
    if (!b || b === ".") continue;
    if (b === "..") keluar.pop();
    else keluar.push(b);
  }
  return keluar.join("/");
}

/** Pustaka luar yang diimpor. */
export function bacaPustaka(teks) {
  const luar = new Set();
  for (const m of teks.matchAll(/(?:^|\n)\s*import[\s\S]*?from\s+["']([^"']+)["']/g)) {
    const s = m[1];
    if (s.startsWith("@/") || s.startsWith(".")) continue;
    const akar = s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0];
    luar.add(akar);
  }
  return [...luar].sort();
}

/** Tabel Prisma yang diakses (db.xxx). */
export function bacaTabelDb(teks) {
  const set = new Set();
  for (const m of teks.matchAll(/\bdb\.(\w+)\./g)) set.add(m[1]);
  return [...set].sort();
}

// ------------------------------------------------------------ halaman/API

/** Ubah path berkas → rute URL. */
export function ruteDari(pathRel) {
  if (!pathRel.startsWith("app/")) return null;
  const halaman = /page\.tsx$/.test(pathRel);
  const api = /route\.ts$/.test(pathRel);
  if (!halaman && !api) return null;
  let r = pathRel
    .replace(/^app\//, "")
    .replace(/(?:^|\/)page\.tsx$/, "")
    .replace(/(?:^|\/)route\.ts$/, "");
  r = r.replace(/\([^)]*\)\//g, "");
  r = r.replace(/^\/+|\/+$/g, "");
  return (api ? "/api/" : "/") + r;
}

/** Info satu berkas halaman. */
export function bacaHalaman(pathRel) {
  const teks = baca(pathRel);
  return {
    pathRel,
    rute: ruteDari(pathRel),
    baris: teks.split("\n").length,
    ekspor: bacaEkspor(teks),
    impor: bacaImpor(teks, pathRel),
    pustaka: bacaPustaka(teks),
    tabel: bacaTabelDb(teks),
    judul: (teks.match(/title:\s*["']([^"']+)["']/) || [])[1] ?? null,
    maksud: komentarAtas(teks, teks.indexOf("export")),
    klien: /^\s*["']use client["']/m.test(teks),
    server: /^\s*["']use server["']/m.test(teks),
  };
}

/** Info satu berkas API route. */
export function bacaApi(pathRel) {
  const teks = baca(pathRel);
  const metode = [...teks.matchAll(/export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)/g)].map((m) => m[1]);
  return {
    pathRel,
    rute: ruteDari(pathRel),
    baris: teks.split("\n").length,
    metode: [...new Set(metode)],
    tabel: bacaTabelDb(teks),
    impor: bacaImpor(teks, pathRel),
    maksud: komentarAtas(teks, teks.indexOf("export")),
  };
}

/** Props sebuah komponen (dari interface Props / { x }: { x: T }). */
export function bacaProps(teks) {
  const keluar = [];
  const m = teks.match(/interface\s+\w*Props\w*\s*\{([\s\S]*?)\n\}/);
  if (m) {
    for (const b of m[1].split("\n")) {
      const t = b.trim().replace(/\/\/.*$/, "").trim();
      if (!t || t.startsWith("//")) continue;
      const mm = t.match(/^(\w+)(\?)?:\s*(.+?);?$/);
      if (mm) keluar.push({ nama: mm[1], wajib: !mm[2], tipe: mm[3].replace(/;$/, "") });
    }
  }
  return keluar;
}

export function barisTabel(nilai) {
  return String(nilai ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n+/g, " ")
    .trim();
}

/** Tautan anchor ala GitHub. */
export function anchor(judul) {
  return judul
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
