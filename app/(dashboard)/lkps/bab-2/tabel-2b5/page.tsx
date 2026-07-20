import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2B5Client } from "@/components/tables/tabel-2b5-client";
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 2.B.5 — Kesesuaian Bidang Kerja Lulusan",
};

const statusBadge = {
  DRAFT:     { icon: <Clock className="h-3.5 w-3.5" />, label: "Draft", color: "slate" as const },
  DIAJUKAN:  { icon: <Clock className="h-3.5 w-3.5" />, label: "Diajukan", color: "amber" as const },
  DIREVISI:  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Direvisi", color: "orange" as const },
  DISETUJUI: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Disetujui", color: "emerald" as const },
  DITOLAK:   { icon: <XCircle className="h-3.5 w-3.5" />, label: "Ditolak", color: "red" as const },
};

export default async function Tabel2B5Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  if (!activeTa) return <div className="p-6 text-center text-xs font-bold text-slate-400">Tahun Akademik Aktif tidak ditemukan.</div>;

  const def = await db.tabelDefinition.findUnique({ where: { kode: "2.B.5" } });
  if (!def) return <div className="p-6 text-center text-xs font-bold text-slate-400">Definisi tabel 2.B.5 tidak ditemukan.</div>;

  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]!);
  const taTs1 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 1}/${activeYearStart}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });
  const taTs2 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 2}/${activeYearStart - 1}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });

  const [lkpsTs, lkpsTs1, lkpsTs2] = await Promise.all([
    db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } }, include: { rows: true, validationHistory: { orderBy: { createdAt: "desc" }, take: 10, include: { user: { select: { name: true, role: true } } } } } }),
    taTs1 ? db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs1.id } }, include: { rows: true } }) : null,
    taTs2 ? db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs2.id } }, include: { rows: true } }) : null,
  ]);

  const extract = (rows: any[], label: string) => {
    const match = rows.find((r: any) => r.rowData.tahun === label);
    if (!match) return null;
    return {
      id: match.id, rowOrder: match.rowOrder,
      rowData: {
        tahun: label,
        jumlahLulusan: Number(match.rowData.jumlahLulusan) || 0,
        jumlahTerlacak: Number(match.rowData.jumlahTerlacak) || 0,
        profesiInfokom: Number(match.rowData.profesiInfokom) || 0,
        profesiNonInfokom: Number(match.rowData.profesiNonInfokom) || 0,
        internasional: Number(match.rowData.internasional) || 0,
        nasional: Number(match.rowData.nasional) || 0,
        wirausaha: Number(match.rowData.wirausaha) || 0,
      },
    };
  };

    const dflt = (label: string) => ({ id: "", rowOrder: 0, rowData: { tahun: label, jumlahLulusan: 0, jumlahTerlacak: 0, profesiInfokom: 0, profesiNonInfokom: 0, internasional: 0, nasional: 0, wirausaha: 0 } });

  const initialRows = [
    extract(lkpsTs2?.rows || [], "TS-2") || dflt("TS-2"),
    extract(lkpsTs1?.rows || [], "TS-1") || dflt("TS-1"),
    extract(lkpsTs?.rows || [], "TS") || dflt("TS"),
  ];
  const status = lkpsTs?.status ?? "DRAFT";
  const statusCfg = statusBadge[status] ?? statusBadge.DRAFT;
  const history = lkpsTs?.validationHistory || [];

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
          <div className="flex items-center gap-3">
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
            <span className={`flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-lg bg-${statusCfg.color}-50 text-${statusCfg.color}-600 border border-${statusCfg.color}-100/50`}>
              {statusCfg.icon} {statusCfg.label}
            </span>
          </div>
          <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">{def.nama}</h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">Kesesuaian bidang kerja lulusan Program Studi Ilmu Komputer</p>
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
        <Tabel2B5Client initialRows={initialRows} tahunAkademikId={activeTa.id} tabelKode={def.kode} status={status} userRole={session.user.role} />
      </ErrorBoundary>
      {history.length > 0 && (
        <ValidationHistory history={history.map((h) => ({ id: h.id, action: h.action, comment: h.comment, createdAt: h.createdAt.toISOString(), user: h.user }))} />
      )}
    </div>
  );
}
