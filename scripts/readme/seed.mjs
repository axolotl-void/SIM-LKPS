/**
 * Alat baca berkas seed (data awal) untuk generator README.
 *
 * `prisma/seed.ts` menyimpan susunan kolom 32 tabel LKPS sebagai objek
 * TypeScript. Berkas ini membacanya tanpa menjalankan berkas itu, supaya
 * generator tidak perlu menyentuh database.
 *
 * Catatan penting: penulisan di seed.ts TIDAK seragam. Sebagian entri menaruh
 * `nama` di baris terpisah, sebagian di baris yang sama dengan `kode`. Karena
 * itu parser di bawah bekerja atas objek yang sudah dipisah lebih dulu — bukan
 * dengan satu regex panjang yang menuntut satu bentuk penulisan tertentu.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

/** Ambil blok `[...]` atau `{...}` yang seimbang, mulai dari posisi tanda buka. */
function blokSeimbang(teks, mulai) {
  const buka = teks[mulai];
  const tutup = buka === "[" ? "]" : "}";
  let dalam = 0;
  let i = mulai;
  let teksString = null;
  for (; i < teks.length; i++) {
    const c = teks[i];
    if (teksString) {
      if (c === "\\") i++;
      else if (c === teksString) teksString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      teksString = c;
      continue;
    }
    if (c === buka) dalam++;
    else if (c === tutup) {
      dalam--;
      if (dalam === 0) return teks.slice(mulai, i + 1);
    }
  }
  return teks.slice(mulai);
}

/**
 * Pisahkan isi sebuah array menjadi objek-objek `{...}` pada tingkat teratas.
 * Tanda kurung di dalam string diabaikan, jadi objek yang memuat `options:
 * ["M", "W"]` tidak akan memotong objek induknya.
 *
 * `isiArray` harus berupa ISI array — tanpa tanda `[` dan `]` terluarnya.
 * Kalau tanda itu ikut disertakan, penghitung kedalaman akan menganggap semua
 * objek berada di dalam satu tingkat dan hasilnya kosong.
 */
function objekTingkatAtas(isiArray) {
  const hasil = [];
  let dalam = 0;
  let mulai = -1;
  let teksString = null;
  for (let i = 0; i < isiArray.length; i++) {
    const c = isiArray[i];
    if (teksString) {
      if (c === "\\") i++;
      else if (c === teksString) teksString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      teksString = c;
      continue;
    }
    if (c === "[" || c === "(") dalam++;
    else if (c === "]" || c === ")") dalam--;
    else if (c === "{" && dalam === 0) {
      if (mulai === -1) mulai = i;
    } else if (c === "}" && dalam === 0 && mulai !== -1) {
      hasil.push(isiArray.slice(mulai, i + 1));
      mulai = -1;
    }
  }
  return hasil;
}

/** Ambil nilai `field: "teks"` — tidak peduli di baris mana pun ia berada. */
function ambilTeks(teks, nama) {
  const m = new RegExp(`\\b${nama}:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(teks);
  return m ? m[1] : null;
}

/** Ambil nilai `field: 123` atau `field: "12"`. */
function ambilAngka(teks, nama) {
  const m = new RegExp(`\\b${nama}:\\s*"?(-?\\d+(?:\\.\\d+)?)"?`).exec(teks);
  return m ? Number(m[1]) : null;
}

/** Ubah escape urutan di dalam string TypeScript menjadi karakter aslinya. */
function bukaEscape(s) {
  return s.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\\/g, "\\");
}

/**
 * Baca daftar 32 tabel LKPS beserta susunan kolomnya dari seed.ts.
 * Dipakai untuk bab "Daftar Tabel LKPS".
 */
export function bacaTabelLkps() {
  const teks = readFileSync(join(ROOT, "prisma", "seed.ts"), "utf8");
  const mulai = teks.indexOf("const tabelDefinitions = [");
  if (mulai === -1) return [];
  const isiPenuh = blokSeimbang(teks, teks.indexOf("[", mulai));
  // Buang kurung terluar + komentar baris, supaya penghitung kedalaman bersih.
  const isi = isiPenuh.slice(1, -1).replace(/\/\/[^\n]*/g, "");

  const daftar = [];
  for (const objekTabel of objekTingkatAtas(isi)) {
    const kode = ambilTeks(objekTabel, "kode");
    const nama = ambilTeks(objekTabel, "nama");
    if (!kode || nama === null) continue;

    const posKolom = objekTabel.indexOf("kolomDefinitions:");
    let kolom = [];
    if (posKolom !== -1) {
      const bukaArr = objekTabel.indexOf("[", posKolom);
      if (bukaArr !== -1) {
        const isiKolom = blokSeimbang(objekTabel, bukaArr).slice(1, -1);
        for (const o of objekTingkatAtas(isiKolom)) {
          const key = ambilTeks(o, "key");
          if (!key) continue;
          const posOpsi = o.indexOf("options:");
          let options = null;
          if (posOpsi !== -1) {
            const bukaOpsi = o.indexOf("[", posOpsi);
            if (bukaOpsi !== -1) {
              const isiOpsi = blokSeimbang(o, bukaOpsi);
              options = [...isiOpsi.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => bukaEscape(x[1]));
            }
          }
          kolom.push({
            key,
            label: bukaEscape(ambilTeks(o, "label") ?? key),
            type: ambilTeks(o, "type") ?? "text",
            required: /\brequired:\s*true/.test(o),
            options,
          });
        }
      }
    }

    daftar.push({
      kode,
      bab: ambilAngka(objekTabel, "bab") ?? 0,
      urutan: ambilAngka(objekTabel, "urutan") ?? 0,
      nama: bukaEscape(nama),
      kolom,
    });
  }
  return daftar;
}

/** Nama tabel di seed → keterangan bahasa manusia. */
export const ARTI_TIPE_KOLOM = {
  text: "teks pendek",
  textarea: "teks panjang",
  number: "angka",
  currency: "nilai uang",
  url: "tautan",
  date: "tanggal",
  select: "pilihan",
  checkbox: "centang",
  email: "alamat surel",
};
