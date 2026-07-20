import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2B1Client } from "@/components/tables/tabel-2b1-client";
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tabel 2.B.1 — Isi Pembelajaran" };

const statusBadge = {
  DRAFT:     { icon: <Clock className="h-3.5 w-3.5" />, label: "Draft", color: "slate" as const },
  DIAJUKAN:  { icon: <Clock className="h-3.5 w-3.5" />, label: "Diajukan", color: "amber" as const },
  DIREVISI:  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Direvisi", color: "orange" as const },
  DISETUJUI: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Disetujui", color: "emerald" as const },
  DITOLAK:   { icon: <XCircle className="h-3.5 w-3.5" />, label: "Ditolak", color: "red" as const },
};

export default async function Tabel2B1Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true } });
  if (!activeTa) return <div className="p-6 text-center text-xs font-bold">TA tidak ditemukan.</div>;

  const def = await db.tabelDefinition.findUnique({ where: { kode: "2.B.1" } });
  if (!def) return <div className="p-6 text-center text-xs font-bold">Definisi 2.B.1 tidak ditemukan.</div>;

  const lkpsTs = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } },
    include: { rows: { orderBy: { rowOrder: "asc" } }, validationHistory: { orderBy: { createdAt: "desc" }, take: 10, include: { user: { select: { name: true, role: true } } } } },
  });

  const rows = lkpsTs?.rows || [];
  const status = lkpsTs?.status ?? "DRAFT";
  const history = lkpsTs?.validationHistory || [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
          <span className={`flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-lg bg-${statusBadge[status]?.color ?? "slate"}-50 text-${statusBadge[status]?.color ?? "slate"}-600 border border-${statusBadge[status]?.color ?? "slate"}-100/50`}>
            {statusBadge[status]?.icon ?? statusBadge.DRAFT.icon} {statusBadge[status]?.label ?? "Draft"}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-800">{def.nama}</h2>
      </div>
      <ErrorBoundary>
        <Tabel2B1Client initialRows={rows} tahunAkademikId={activeTa.id} tabelKode={def.kode} status={status} userRole={session.user.role} />
      </ErrorBoundary>
      {history.length > 0 && (
        <ValidationHistory history={history.map((h) => ({ id: h.id, action: h.action, comment: h.comment, createdAt: h.createdAt.toISOString(), user: h.user }))} />
      )}
    </div>
  );
}
