import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Target, ArrowLeft } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { sesiPenilaian, tahunAktifPenilaian } from "@/lib/utils/penilaian-query";
import { NAMA_KRITERIA, SKOR_LABEL, BUTIR_MIN, RERATA_KUNCI_MIN } from "@/lib/utils/penilaian";
import { ButirPenilaianClient } from "./ButirPenilaianClient";
import { cn } from "@/lib/utils/format";

export const metadata = { title: "Penilaian — Detail Butir" };

export default async function ButirPenilaianPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const kodeBersih = decodeURIComponent(kode);

  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;

  const ta = await tahunAktifPenilaian();
  if (!ta) redirect("/dashboard");

  const sesi = await sesiPenilaian(ta.id);

  const butir = await db.butirPenilaian.findUnique({
    where: { kode: kodeBersih },
    include: { skor: { where: { penilaianSesiId: sesi?.id ?? "__tidak_ada__" } } },
  });
  if (!butir) notFound();

  const skor = butir.skor[0];
  const terkunci = sesi?.finalisasi ?? false;
  const readOnly = !hasPermission(role, "penilaian.update");

  const deskriptor = [
    { level: 4, teks: butir.skor4 },
    { level: 3, teks: butir.skor3 },
    { level: 2, teks: butir.skor2 },
    { level: 1, teks: butir.skor1 },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-5 mb-6 shadow-xl">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-4 border-white/10 transform rotate-12" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  {butir.kriteria} • {butir.namaKriteria}
                </span>
                <h1 className="text-white text-lg font-black tracking-tight">
                  Butir <span className="font-mono">{butir.kode}</span>
                </h1>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-white/60 text-2xs font-bold">Skor saat ini</div>
              <div className="text-2xl font-black text-white tabular-nums">
                {skor?.skor === null || skor?.skor === undefined ? "–" : skor.skor}
              </div>
              {skor?.skor != null && (
                <div className="text-2xs text-white/60">{SKOR_LABEL[skor.skor]}</div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <Chip label={`Bobot ${butir.bobot}`} />
            <Chip label={butir.jenis} />
            {butir.tahapPpepp && <Chip label={butir.tahapPpepp} />}
            {butir.subButir && <Chip label={`Sub ${butir.subButir}`} />}
          </div>

          <div className="mt-4">
            <Link
              href={`/penilaian/kriteria/${butir.kriteria}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 text-white text-xs font-semibold hover:bg-white/25 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Daftar {butir.kriteria}
            </Link>
          </div>
        </div>
      </div>

      {/* Elemen penilaian + syarat unggul */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Elemen Penilaian
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{butir.elemenPenilaian}</p>
          {butir.deskriptor && (
            <>
              <h3 className="text-2xs font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">
                Deskriptor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{butir.deskriptor}</p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Catatan Syarat
          </h2>
          {butir.syaratUnggul ? (
            <p className="text-xs text-slate-600 leading-relaxed">{butir.syaratUnggul}</p>
          ) : (
            <p className="text-xs text-slate-400 italic">Tidak ada catatan khusus.</p>
          )}
          {["C1", "C2", "C3"].includes(butir.kriteria) && (
            <div className="mt-3 rounded-lg bg-slate-100 border border-slate-300 px-3 py-2">
              <p className="text-2xs text-slate-900 leading-relaxed">
                Butir kriteria kunci: untuk gelar <strong>Unggul</strong>, nilai butir ini minimal{" "}
                <strong>{BUTIR_MIN.toFixed(2).replace(".", ",")}</strong> dan rerata{" "}
                {butir.kriteria} minimal <strong>{RERATA_KUNCI_MIN.toFixed(2).replace(".", ",")}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Deskriptor 4 level */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
          <h2 className="text-sm font-bold text-slate-800">Deskriptor 4 Level</h2>
          <p className="text-2xs text-slate-500 mt-0.5">
            {NAMA_KRITERIA[butir.kriteria] ?? butir.kriteria} — pilih level yang paling menggambarkan kondisi.
          </p>
        </div>
        <ul className="divide-y divide-slate-100">
          {deskriptor.map((d) => {
            const aktif = skor?.skor === d.level;
            return (
              <li
                key={d.level}
                className={cn(
                  "px-4 py-3 flex items-start gap-3",
                  aktif && "bg-slate-100/60",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 inline-flex flex-col items-center justify-center w-12 h-12 rounded-xl font-black",
                    aktif ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  <span className="text-lg leading-none">{d.level}</span>
                  <span className="text-[8px] font-bold uppercase mt-0.5">
                    {SKOR_LABEL[d.level]}
                  </span>
                </span>
                <p
                  className={cn(
                    "text-xs leading-relaxed flex-1",
                    aktif ? "text-slate-900 font-medium" : "text-slate-600",
                  )}
                >
                  {d.teks}
                </p>
                {aktif && (
                  <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                    dipilih
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <ButirPenilaianClient
        butirId={butir.id}
        kode={butir.kode}
        kriteria={butir.kriteria}
        skorAwal={skor?.skor ?? null}
        catatanAwal={skor?.catatanBukti ?? null}
        readOnly={readOnly}
        terkunci={terkunci}
      />
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-lg bg-white/15 border border-white/20 px-2 py-1 text-2xs font-bold text-white/90">
      {label}
    </span>
  );
}
