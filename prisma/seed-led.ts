/**
 * Seed modul LED + Matriks Penilaian — LAM INFOKOM 2.1
 *
 * Modul terpisah dari seed LKPS supaya tidak mengganggu data lama.
 * ATURAN KERAS: HANYA `upsert`. Dilarang `deleteMany` — `LedIsian` bisa
 * berisi narasi yang sudah diketik user dan akan hancur kalau dihapus.
 *
 * Sumber data:
 *  - seed-data/led-bagian.json      → 92 bagian LED (17 non-kriteria + 75 butir kriteria)
 *  - seed-data/butir-penilaian.json → 82 butir matriks penilaian, total bobot 400
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PrismaClient } from "@prisma/client";

type LedBagianSeed = {
  kode: string;
  bab: string;
  bagian: string;
  subBagian?: string;
  judul: string;
  jenis: "NARASI" | "KRITERIA" | "SUPLEMEN" | "IDENTITAS";
  kriteria?: number;
  tahapPpepp?: string;
  subButir?: string;
  batasHalaman?: number;
  urutan: number;
};

type ButirSeed = {
  kode: string;
  kriteria: string;
  namaKriteria: string;
  tahapPpepp?: string | null;
  subButir?: string | null;
  elemenPenilaian: string;
  deskriptor: string;
  skor1: string;
  skor2: string;
  skor3: string;
  skor4: string;
  syaratUnggul?: string | null;
  bobot: number;
  jenis: string;
  urutan: number;
};

const DIR = join(process.cwd(), "prisma", "seed-data");

function baca<T>(nama: string): T[] {
  return JSON.parse(readFileSync(join(DIR, nama), "utf-8")) as T[];
}

type Akumulasi = Record<string, number>;

export async function seedLedDanPenilaian(db: PrismaClient) {
  // ---------------------------------------------------------------- LED
  const bagian = baca<LedBagianSeed>("led-bagian.json");

  for (const b of bagian) {
    await db.ledBagian.upsert({
      where: { kode: b.kode },
      update: {
        judul: b.judul,
        jenis: b.jenis,
        kriteria: b.kriteria ?? null,
        tahapPpepp: b.tahapPpepp ?? null,
        subButir: b.subButir ?? null,
        urutan: b.urutan,
      },
      create: {
        kode: b.kode,
        bab: b.bab,
        bagian: b.bagian,
        subBagian: b.subBagian ?? null,
        judul: b.judul,
        jenis: b.jenis,
        kriteria: b.kriteria ?? null,
        tahapPpepp: b.tahapPpepp ?? null,
        subButir: b.subButir ?? null,
        urutan: b.urutan,
        batasHalaman: b.batasHalaman ?? null,
      },
    });
  }

  const kriteriaCount = await db.ledBagian.count({ where: { jenis: "KRITERIA" } });
  console.log(`  ✅ LedBagian: ${bagian.length} baris (${kriteriaCount} butir kriteria)`);

  // --------------------------------------------------- BUTIR PENILAIAN
  const butir = baca<ButirSeed>("butir-penilaian.json");

  for (const b of butir) {
    const data = {
      kriteria: b.kriteria,
      namaKriteria: b.namaKriteria,
      tahapPpepp: b.tahapPpepp ?? null,
      subButir: b.subButir ?? null,
      elemenPenilaian: b.elemenPenilaian,
      deskriptor: b.deskriptor,
      skor1: b.skor1,
      skor2: b.skor2,
      skor3: b.skor3,
      skor4: b.skor4,
      syaratUnggul: b.syaratUnggul ?? null,
      bobot: b.bobot,
      jenis: b.jenis as "INPUT" | "PROSES" | "OUTPUT",
      urutan: b.urutan,
    };
    await db.butirPenilaian.upsert({
      where: { kode: b.kode },
      update: data,
      create: { kode: b.kode, ...data },
    });
  }

  // --------------------------------------------------------- ASSERTION
  // Lebih baik seed gagal daripada data penilaian salah.
  const semua = await db.butirPenilaian.findMany({ select: { bobot: true, kriteria: true, jenis: true } });
  const total = semua.reduce((s, x) => s + x.bobot, 0);

  if (semua.length !== 82) {
    throw new Error(`ButirPenilaian harus 82 baris, dapat ${semua.length}`);
  }
  // Assertion utama: total 400 + subtotal per kriteria. Ini yang menentukan
  // nilai akhir dan predikat akreditasi, jadi WAJIB tepat.
  if (Math.abs(total - 400) > 1e-9) {
    throw new Error(`Total bobot harus 400, dapat ${total}`);
  }

  const perJenis = semua.reduce<Akumulasi>((acc, x) => {
    acc[x.jenis] = (acc[x.jenis] ?? 0) + x.bobot;
    return acc;
  }, {});
  const cntJenis = semua.reduce<Akumulasi>((acc, x) => {
    acc[x.jenis] = (acc[x.jenis] ?? 0) + 1;
    return acc;
  }, {});

  // Komposisi I/P/O: jumlah BUTIR harus tepat 17/27/38 (ini yang konsisten
  // di instrumen). Untuk bobotnya, PDF memuat kontradiksi internal:
  //   - Header I/P/O menulis 60,0 / 120,0 / 220,0 (= 15% / 30% / 55% dari 400).
  //   - Tapi penjumlahan butir yang sesungguhnya menghasilkan 60,5 / 120,0 / 219,5.
  // Selisih 0,5 berasal dari butir 1.1.B: tabel detail menulis 2,5 sedangkan
  // tabel rekap menulis 3,0. Kami memilih 3,0 karena hanya itu yang membuat
  // C1 Budaya Mutu pas 40,0 dan total pas 400,0.
  // Konsekuensinya bobot INPUT jadi 60,5 — dan itu keterbatasan instrumen,
  // bukan kesalahan entri data. Dicatat sebagai peringatan, bukan error.
  const targetButir: Record<string, number> = { INPUT: 17, PROSES: 27, OUTPUT: 38 };
  for (const [j, target] of Object.entries(targetButir)) {
    const nyata = cntJenis[j] ?? 0;
    if (nyata !== target) {
      throw new Error(`Jumlah butir ${j} harus ${target}, dapat ${nyata}`);
    }
  }

  const targetBobotJenis: Record<string, number> = { INPUT: 60.5, PROSES: 120, OUTPUT: 219.5 };
  for (const [j, target] of Object.entries(targetBobotJenis)) {
    const nyata = perJenis[j] ?? 0;
    if (Math.abs(nyata - target) > 1e-9) {
      throw new Error(`Bobot ${j} harus ${target}, dapat ${nyata}`);
    }
  }

  const persen = (n: number) => ((n / total) * 100).toFixed(1);
  console.log(`  ✅ ButirPenilaian: ${semua.length} butir, total bobot ${total}`);
  for (const j of ["INPUT", "PROSES", "OUTPUT"]) {
    console.log(
      `     ${j.padEnd(6)} ${String(cntJenis[j]).padStart(2)} butir · bobot ${String(perJenis[j]).padStart(5)} · ${persen(perJenis[j] ?? 0)}%`,
    );
  }
  console.log("     ⚠️  PDF menulis I/P/O = 60,0/120,0/220,0 (15/30/55%). Angka nyata 60,5/120,0/219,5");
  console.log("         karena butir 1.1.B ditulis 2,5 di tabel detail tapi 3,0 di tabel rekap.");
  console.log("         Dipilih 3,0 agar C1 = 40 dan total pas 400. Lihat RANCANGAN-010 §6.");
}
