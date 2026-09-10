import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
const Tabel2A3Client = dynamic(() =>
  import("@/components/tables/tabel-2a3-client").then((m) => m.Tabel2A3Client)
);
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { Role } from "@prisma/client";
import type { Metadata } from "next";

type LkpsRow = {
  id: string;
  rowOrder: number;
  rowData: Record<string, unknown> | null;
};

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

  // PERF: query di bawah tidak saling bergantung → jalankan paralel (dulu berurutan).
  const [activeTa, def] = await Promise.all([
    await db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true }, }),
    await db.tabelDefinition.findUnique({ where: { kode: "2.A.3" } }),
  ]);

  if (!activeTa) return <div className="p-6 text-center text-xs font-bold text-slate-400">Tahun Akademik Aktif tidak ditemukan.</div>;

  if (!def) return <div className="p-6 text-center text-xs font-bold text-slate-400">Definisi tabel 2.A.3 tidak ditemukan.</div>;

  const lkpsTs = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } },
    include: {
      rows: { orderBy: { rowOrder: "asc" } },
      validationHistory: { orderBy: { createdAt: "desc" }, take: 10, include: { user: { select: { name: true, role: true } } } },
    },
  });

  const rowsTs = lkpsTs?.rows || [];
  const status = lkpsTs?.status ?? "DRAFT";
  const statusCfg = statusBadge[status] ?? statusBadge.DRAFT;
  const history = lkpsTs?.validationHistory || [];

  // Flatten each row: ts/ts1/ts2 may live inside rowData already (single-row store)
  const initialRows = rowsTs.map((r) => {
    const rd = r.rowData as Record<string, unknown> | null;
    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        kategori: (rd?.kategori as string) ?? "",
        ts: Number(rd?.ts ?? rd?.nominal) || 0,
        ts1: Number(rd?.ts1) || 0,
        ts2: Number(rd?.ts2) || 0,
      },
    };
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-soft-sm border border-slate-100/60">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="relative z-10 flex flex-col gap-2.5 md:max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xs font-black uppercase tracking-wider text-cyan-600 bg-cyan-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
            <span className={`flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-lg bg-${statusCfg.color}-50 text-${statusCfg.color}-600 border border-${statusCfg.color}-100/50`}>
              {statusCfg.icon} {statusCfg.label}
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">{def.nama}</h2>
          <p className="text-xs font-semibold text-slate-500">Rekap kondisi jumlah mahasiswa {activeTa.tahun} ({activeTa.semester}) — {activeTa.prodi.nama}</p>
        </div>
      </div>
      <ErrorBoundary>
        <Tabel2A3Client
          initialRows={initialRows}
          tahunAkademikId={activeTa.id}
          tabelKode={def.kode}
          status={status}
          userRole={session.user.role as Role}
        />
      </ErrorBoundary>
      {history.length > 0 && (
        <ValidationHistory history={history.map((h) => ({ id: h.id, action: h.action, comment: h.comment, createdAt: h.createdAt.toISOString(), user: h.user }))} />
      )}
    </div>
  );
}
