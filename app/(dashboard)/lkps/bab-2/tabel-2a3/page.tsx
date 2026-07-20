import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2A3Client } from "@/components/tables/tabel-2a3-client";
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 2.A.3 — Kondisi Jumlah Mahasiswa",
};

const statusBadge = {
  DRAFT:     { icon: <Clock className="h-3.5 w-3.5" />, label: "Draft", color: "slate" as const },
  DIAJUKAN:  { icon: <Clock className="h-3.5 w-3.5" />, label: "Diajukan", color: "amber" as const },
  DIREVISI:  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Direvisi", color: "orange" as const },
  DISETUJUI: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Disetujui", color: "emerald" as const },
  DITOLAK:   { icon: <XCircle className="h-3.5 w-3.5" />, label: "Ditolak", color: "red" as const },
};

export default async function Tabel2A3Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  if (!activeTa) return <div className="p-6 text-center text-xs font-bold text-slate-400">Tahun Akademik Aktif tidak ditemukan.</div>;

  const def = await db.tabelDefinition.findUnique({ where: { kode: "2.A.3" } });
  if (!def) return <div className="p-6 text-center text-xs font-bold text-slate-400">Definisi tabel 2.A.3 tidak ditemukan.</div>;

  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]!);
  const taTs1 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 1}/${activeYearStart}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });
  const taTs2 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 2}/${activeYearStart - 1}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });

  const lkpsTs = await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } }, include: { rows: true, validationHistory: { orderBy: { createdAt: "desc" }, take: 10, include: { user: { select: { name: true, role: true } } } } } });
  const lkpsTs1 = taTs1 ? await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs1.id } }, include: { rows: true } }) : null;
  const lkpsTs2 = taTs2 ? await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs2.id } }, include: { rows: true } }) : null;

  const rowsTs = lkpsTs?.rows || [];
  const rowsTs1 = lkpsTs1?.rows || [];
  const rowsTs2 = lkpsTs2?.rows || [];
  const status = lkpsTs?.status ?? "DRAFT";
  const statusCfg = statusBadge[status] ?? statusBadge.DRAFT;
  const history = lkpsTs?.validationHistory || [];

  const initialRows = rowsTs.map((r: any) => {
    const kat = r.rowData?.kategori as string | undefined;
    const matchTs1 = kat ? rowsTs1.find((x: any) => x.rowData?.kategori === kat) : undefined;
    const matchTs2 = kat ? rowsTs2.find((x: any) => x.rowData?.kategori === kat) : undefined;
    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        kategori: kat ?? "",
        ts: Number(r.rowData?.nominal) || 0,
        ts1: matchTs1 ? Number((matchTs1.rowData as any)?.nominal) || 0 : 0,
        ts2: matchTs2 ? Number((matchTs2.rowData as any)?.nominal) || 0 : 0,
      },
    };
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
            <span className={`flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-lg bg-${statusCfg.color}-50 text-${statusCfg.color}-600 border border-${statusCfg.color}-100/50`}>
              {statusCfg.icon} {statusCfg.label}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">{def.nama}</h2>
          <p className="text-xs font-semibold text-slate-500">Rekap kondisi jumlah mahasiswa {activeTa.tahun} ({activeTa.semester}) — {activeTa.prodi.nama}</p>
        </div>
      </div>
      <ErrorBoundary>
        <Tabel2A3Client initialRows={initialRows} tahunAkademikId={activeTa.id} tabelKode={def.kode} status={status} userRole={session.user.role} />
      </ErrorBoundary>
      {history.length > 0 && (
        <ValidationHistory history={history.map((h) => ({ id: h.id, action: h.action, comment: h.comment, createdAt: h.createdAt.toISOString(), user: h.user }))} />
      )}
    </div>
  );
}
