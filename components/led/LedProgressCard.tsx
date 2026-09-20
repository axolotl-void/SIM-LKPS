"use client";

import { createElement, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, FileText, ArrowRight } from "lucide-react";
import type { LedStatus } from "@prisma/client";
import { ringkasProgres } from "./status";
import { ikonLed } from "./ikon";
import { cn } from "@/lib/utils/format";

export type KartuLed = {
  kode: string; // "BAB1" | "BAB2.A" | ...
  judul: string;
  deskripsi: string;
  href: string;
  /** Nama ikon Lucide — bukan komponennya (server→client tidak bisa kirim fungsi). */
  ikon: string;
  status: LedStatus[]; // status tiap bagian di dalamnya
};

/** Ikon kartu dirender lewat createElement — komponennya diresolusi dari nama
 *  (server→client tidak bisa kirim fungsi), dan memanggilnya langsung saat render
 *  akan dianggap "membuat komponen di dalam render" oleh react-hooks/static-components. */
function ikonKartu(nama: string, className: string) {
  return createElement(ikonLed(nama), { className });
}

/** Kartu progres untuk satu bagian LED (pola kartu kanonik LKPS, aksen slate). */
export function LedProgressCard({ kartu, index = 0 }: { kartu: KartuLed; index?: number }) {
  const ringkas = useMemo(
    () => ringkasProgres(kartu.status.map((s) => ({ status: s, jumlahKarakter: s === "KOSONG" ? 0 : 1 }))),
    [kartu.status],
  );
  const belumMulai = ringkas.terisi === 0;

  return (
    <Link
      href={kartu.href}
      className={cn("group relative block animate-fade-in-up", `stagger-${Math.min(index + 1, 8)}`)}
    >
      <div className="relative h-full rounded-2xl bg-white shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-slate-300">
        <div className="relative h-20 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
          <div className="absolute -bottom-3 right-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/25 border border-white/40 shadow-lg rotate-12 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
              {ikonKartu(kartu.ikon, "w-7 h-7 text-white")}
            </div>
          </div>
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/25 rounded-lg text-white text-xs font-bold border border-white/40">
              {kartu.kode}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 group-hover:text-slate-900 transition-colors">
            {kartu.judul}
          </h3>
          <p className="text-xs text-slate-400 mb-4">{kartu.deskripsi}</p>

          <div
            className={cn(
              "rounded-xl p-4",
              belumMulai
                ? "bg-slate-100 border-2 border-dashed border-slate-200"
                : "bg-gradient-to-br from-slate-700 to-slate-800 text-white",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className={cn("text-3xl font-black", belumMulai ? "text-slate-300" : "text-white")}>
                  {ringkas.persen}%
                </div>
                <div className={cn("text-xs font-medium", belumMulai ? "text-slate-400" : "text-slate-200")}>
                  {ringkas.terisi}/{ringkas.total} bagian terisi
                </div>
              </div>
              {ikonKartu(kartu.ikon, cn("w-6 h-6", belumMulai ? "text-slate-300" : "text-white/80"))}
            </div>
            <div className={cn("h-1.5 rounded-full overflow-hidden", belumMulai ? "bg-slate-200" : "bg-white/25")}>
              <div
                className={cn("h-full rounded-full transition-all duration-500", belumMulai ? "bg-slate-300" : "bg-white")}
                style={{ width: `${ringkas.persen}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className={cn("text-sm font-semibold group-hover:underline", belumMulai ? "text-slate-500" : "text-slate-800")}>
              {belumMulai ? "Mulai Mengisi" : "Lanjut Mengisi"}
            </span>
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                belumMulai
                  ? "bg-slate-100 text-slate-400 group-hover:bg-slate-600 group-hover:text-white"
                  : "bg-slate-200 text-slate-800 group-hover:bg-slate-800 group-hover:text-white",
              )}
            >
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Banner peringatan saat estimasi halaman melewati batas Lampiran 2. */
export function LedBatasBanner({ estimasi, batas }: { estimasi: number; batas: number }) {
  if (estimasi <= batas) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-fade-in-up">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-amber-900">
          Estimasi {estimasi} halaman — melebihi batas {batas} halaman
        </p>
        <p className="text-xs text-amber-800 mt-1">
          Lampiran 2 Instrumen LED membatasi LED maksimum {batas} halaman (A4, Arial 11, spasi 1,15).
          Ini baru perkiraan, tapi sebaiknya narasi dipadatkan.
        </p>
      </div>
    </div>
  );
}

/** Placeholder saat struktur LED belum di-seed. */
export function LedBelumDiSeed() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <h2 className="text-base font-bold text-slate-700 mb-1">Struktur LED belum di-seed</h2>
      <p className="text-sm text-slate-500 mb-4">
        Tabel <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs">led_bagian</code> masih
        kosong. Jalankan seed modul LED lebih dulu.
      </p>
      <code className="inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-100 font-mono">
        pnpm tsx prisma/seed-modul-baru.ts
      </code>
    </div>
  );
}
