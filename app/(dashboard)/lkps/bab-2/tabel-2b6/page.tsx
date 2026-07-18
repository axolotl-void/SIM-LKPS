import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2B6Client } from "@/components/tables/tabel-2b6-client";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 2.B.6 — Kepuasan Pengguna Lulusan",
};

export default async function Tabel2B6Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  if (!activeTa) return <div className="p-6 text-center text-xs font-bold text-slate-400">Tahun Akademik Aktif tidak ditemukan.</div>;

  const def = await db.tabelDefinition.findUnique({ where: { kode: "2.B.6" } });
  if (!def) return <div className="p-6 text-center text-xs font-bold text-slate-400">Definisi tabel 2.B.6 tidak ditemukan.</div>;

  const lkpsTs = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } },
    include: { rows: { orderBy: { rowOrder: "asc" } } },
  });

  // 2.B.6 is not time-series per year, it's a snapshot of satisfaction survey
  // Hasilnya adalah 7 jenis kemampuan + metadata (jumlah alumni, responden, mahasiswa aktif)
  const rows = lkpsTs?.rows || [];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="flex h-20 w-16 rotate-12 items-center justify-center rounded-2xl bg-white shadow-soft-lg border border-slate-100/40 text-indigo-500">
            <FileText className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
            <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">{def.nama}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">Tingkat kepuasan pengguna lulusan Program Studi Ilmu Komputer</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Tahun Akademik</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{activeTa.tahun} ({activeTa.semester})</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Program Studi</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{activeTa.prodi.nama} ({activeTa.prodi.jenjang})</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorBoundary>
        <Tabel2B6Client initialRows={rows} tahunAkademikId={activeTa.id} tabelKode={def.kode} />
      </ErrorBoundary>
    </div>
  );
}
