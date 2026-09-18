import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Target, ArrowLeft, ArrowRight } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { ambilButirPenilaian, keButirHitung, sesiPenilaian, tahunAktifPenilaian } from "@/lib/utils/penilaian-query";
import {
  hitungPenilaian, NAMA_KRITERIA, URUTAN_KRITERIA, warnaRerata,
} from "@/lib/utils/penilaian";
import { KriteriaPenilaianClient } from "./KriteriaPenilaianClient";
import { cn } from "@/lib/utils/format";

export const metadata = { title: "Penilaian — Kriteria" };

export default async function PenilaianKriteriaPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const kodeBersih = decodeURIComponent(kode);

  if (!URUTAN_KRITERIA.includes(kodeBersih as (typeof URUTAN_KRITERIA)[number])) notFound();

  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;

  const ta = await tahunAktifPenilaian();
  if (!ta) redirect("/dashboard");

  const butir = await ambilButirPenilaian(ta.id, { kriteria: kodeBersih });
  if (butir.length === 0) notFound();

  const hasil = hitungPenilaian(keButirHitung(butir));
  const diri = hasil.perKriteria.find((p) => p.kriteria === kodeBersih);
  const sesi = await sesiPenilaian(ta.id);
  const terkunci = sesi?.finalisasi ?? false;
  const readOnly = !hasPermission(role, "penilaian.update");

  // navigasi antar kriteria
  const idx = URUTAN_KRITERIA.indexOf(kodeBersih as (typeof URUTAN_KRITERIA)[number]);
  const sebelum = idx > 0 ? URUTAN_KRITERIA[idx - 1] : null;
  const sesudah = idx < URUTAN_KRITERIA.length - 1 ? URUTAN_KRITERIA[idx + 1] : null;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-5 mb-6 shadow-xl">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-4 border-white/10 transform rotate-12" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  Matriks Penilaian • {kodeBersih}
                </span>
                <h1 className="text-white text-xl font-black tracking-tight truncate">
                  {NAMA_KRITERIA[kodeBersih] ?? kodeBersih}
                </h1>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-white/60 text-2xs font-bold">Rerata</div>
              <div className="text-2xl font-black text-white tabular-nums">
                {diri?.rerata === null || diri?.rerata === undefined
                  ? "–"
                  : diri.rerata.toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Kotak label="Butir" nilai={`${diri?.jumlahTerisi ?? 0}/${diri?.jumlahButir ?? 0}`} />
            <Kotak label="Bobot" nilai={diri?.bobot ?? 0} />
            <Kotak label="Nilai" nilai={`${diri?.nilai ?? 0} / ${(diri?.bobot ?? 0) * 4}`} />
            <Kotak
              label="Warna"
              nilai={
                { merah: "Di bawah", amber: "Cukup", hijau: "Aman", abu: "Kosong" }[
                  warnaRerata(diri?.rerata ?? null)
                ]
              }
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href="/penilaian"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 text-white text-xs font-semibold hover:bg-white/25 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Ringkasan
            </Link>
            {sebelum && (
              <Link
                href={`/penilaian/kriteria/${sebelum}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white/80 text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                {sebelum}
              </Link>
            )}
            {sesudah && (
              <Link
                href={`/penilaian/kriteria/${sesudah}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white/80 text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                {sesudah} <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {terkunci && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          Penilaian sudah difinalisasi — skor terkunci. Buka kembali dari halaman ringkasan (ADMIN) untuk mengubah.
        </div>
      )}

      <KriteriaPenilaianClient butir={butir} readOnly={readOnly} terkunci={terkunci} />

      {/* daftar kriteria lain */}
      <div className="mt-6">
        <h2 className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kriteria lain</h2>
        <div className="flex flex-wrap gap-1.5">
          {hasil.perKriteria.length > 0 &&
            URUTAN_KRITERIA.map((k) => (
              <Link
                key={k}
                href={`/penilaian/kriteria/${k}`}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-2xs font-bold border transition-colors",
                  k === kodeBersih
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-700",
                )}
              >
                {k}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

function Kotak({ label, nilai }: { label: string; nilai: string | number }) {
  return (
    <div className="bg-white/15 rounded-xl p-3 border border-white/20">
      <div className="text-white/70 text-2xs font-semibold mb-0.5">{label}</div>
      <div className="text-white text-lg font-black tabular-nums">{nilai}</div>
    </div>
  );
}
