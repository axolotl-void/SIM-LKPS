import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel1A2Client } from "@/components/tables/tabel-1a2-client";
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 1.A.2 — Sumber Pendanaan UPPS/PS",
};

const statusBadge = {
  DRAFT:     { icon: <Clock className="h-3.5 w-3.5" />, label: "Draft", color: "slate" as const },
  DIAJUKAN:  { icon: <Clock className="h-3.5 w-3.5" />, label: "Diajukan", color: "amber" as const },
  DIREVISI:  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Direvisi", color: "orange" as const },
  DISETUJUI: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Disetujui", color: "emerald" as const },
  DITOLAK:   { icon: <XCircle className="h-3.5 w-3.5" />, label: "Ditolak", color: "red" as const },
};

export default async function Tabel1A2Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  if (!activeTa) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Belum ada tahun akademik yang aktif. Hubungi Administrator.
      </div>
    );
  }

  const def = await db.tabelDefinition.findUnique({ where: { kode: "1.A.2" } });
  if (!def) {
    return <div className="p-6 text-center text-xs font-bold text-slate-400">Definisi tabel 1.A.2 tidak ditemukan.</div>;
  }

  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]!);
  const ts1Tahun = `${activeYearStart - 1}/${activeYearStart}`;
  const ts2Tahun = `${activeYearStart - 2}/${activeYearStart - 1}`;

  const taTs1 = await db.tahunAkademik.findFirst({ where: { tahun: ts1Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId } });
  const taTs2 = await db.tahunAkademik.findFirst({ where: { tahun: ts2Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId } });

  const lkpsTs = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } },
    include: {
      rows: { orderBy: { rowOrder: "asc" } },
      validationHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true, role: true } } },
      },
    },
  });

  const lkpsTs1 = taTs1 ? await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs1.id } }, include: { rows: true } }) : null;
  const lkpsTs2 = taTs2 ? await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs2.id } }, include: { rows: true } }) : null;

  const rowsTs = lkpsTs?.rows || [];
  const rowsTs1 = lkpsTs1?.rows || [];
  const rowsTs2 = lkpsTs2?.rows || [];

  const initialRows = rowsTs.map((r: any) => {
    const sumber = r.rowData?.sumberPendanaan as string | undefined;
    const matchTs1 = sumber ? rowsTs1.find((x: any) => x.rowData?.sumberPendanaan === sumber) : undefined;
    const matchTs2 = sumber ? rowsTs2.find((x: any) => x.rowData?.sumberPendanaan === sumber) : undefined;
    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        sumberPendanaan: sumber ?? "",
        ts: Number(r.rowData?.nominal) || 0,
        ts1: matchTs1 ? Number((matchTs1.rowData as any)?.nominal) || 0 : 0,
        ts2: matchTs2 ? Number((matchTs2.rowData as any)?.nominal) || 0 : 0,
        linkBukti: (r.rowData?.linkBukti as string) ?? "",
      },
    };
  });

  const status = lkpsTs?.status ?? "DRAFT";
  const history = lkpsTs?.validationHistory || [];
  const statusCfg = statusBadge[status] ?? statusBadge.DRAFT;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
          <span className="flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100/50">
            {statusCfg.icon} {statusCfg.label}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-800">{def.nama}</h2>
        <p className="mt-1 text-xs text-slate-400 font-semibold">Tahun Akademik: {activeTa.tahun} ({activeTa.semester})</p>
      </div>

      <ErrorBoundary>
        <Tabel1A2Client initialRows={initialRows} tahunAkademikId={activeTa.id} tabelKode={def.kode} status={status} userRole={session.user.role} />
      </ErrorBoundary>
      {history.length > 0 && (
        <ValidationHistory history={history.map((h: any) => ({ id: h.id, action: h.action, comment: h.comment, createdAt: h.createdAt.toISOString(), user: h.user }))} />
      )}
    </div>
  );
}
