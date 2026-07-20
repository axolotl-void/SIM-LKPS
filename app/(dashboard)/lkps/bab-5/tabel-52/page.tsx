import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel52Client } from "@/components/tables/tabel-52-client";
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { GraduationCap, Calendar, BookOpen, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 5.2 — Sarana dan Prasarana Pendidikan",
};

const statusBadge = {
  DRAFT:     { icon: <Clock className="h-3.5 w-3.5" />, label: "Draft", color: "slate" as const },
  DIAJUKAN:  { icon: <Clock className="h-3.5 w-3.5" />, label: "Diajukan", color: "amber" as const },
  DIREVISI:  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Direvisi", color: "orange" as const },
  DISETUJUI: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Disetujui", color: "emerald" as const },
  DITOLAK:   { icon: <XCircle className="h-3.5 w-3.5" />, label: "Ditolak", color: "red" as const },
};

export default async function Tabel52Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
  if (!activeTa) redirect("/dashboard");

  const def = await db.tabelDefinition.findUnique({ where: { kode: "5.2" } });
  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 5.2 tidak ditemukan. Pastikan seed data telah dijalankan.
      </div>
    );
  }

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
  const rawRows = lkpsTs?.rows ?? [];
  const status = lkpsTs?.status ?? "DRAFT";
  const statusCfg = statusBadge[status] ?? statusBadge.DRAFT;
  const history = lkpsTs?.validationHistory || [];

  const rows = rawRows.map((r) => {
    const d = r.rowData as Record<string, unknown>;
    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        tahun: String(d.tahun ?? "inventory"),
        namaPrasarana: String(d.namaPrasarana ?? ""),
        dayaTampung: Number(d.dayaTampung ?? 0),
        luasRuang: Number(d.luasRuang ?? 0),
        status: (d.status === "W" ? "W" : "M") as "M" | "W",
        publicDomain: (d.publicDomain === "T" ? "T" : "P") as "P" | "T",
        perangkat: String(d.perangkat ?? ""),
        linkBukti: String(d.linkBukti ?? ""),
      },
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-violet-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="flex h-20 w-16 rotate-12 items-center justify-center rounded-2xl bg-white shadow-soft-lg border border-slate-100/40 text-violet-500">
            <GraduationCap className="h-10 w-10 text-violet-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xs font-black uppercase tracking-wider text-violet-600 bg-violet-50/80 px-2.5 py-1 rounded-lg">
                Tabel {def.kode}
              </span>
              <span className={`flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-lg bg-${statusCfg.color}-50 text-${statusCfg.color}-600 border border-${statusCfg.color}-100/50`}>
                {statusCfg.icon} {statusCfg.label}
              </span>
            </div>
            <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">
              {def.nama}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Inventarisasi sarana dan prasarana pendidikan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-500/10 to-purple-500/10 text-violet-600 shadow-soft-2xs">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Tahun Akademik</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{activeTa.tahun} ({activeTa.semester})</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-500/10 to-purple-500/10 text-violet-600 shadow-soft-2xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Program Studi</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{activeTa.prodi.nama} ({activeTa.prodi.jenjang})</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorBoundary>
        <Tabel52Client initialRows={rows} tahunAkademikId={activeTa.id} tabelKode={def.kode} status={status} userRole={session.user.role} />
      </ErrorBoundary>

      {history.length > 0 && (
        <ValidationHistory
          history={history.map((h) => ({
            id: h.id,
            action: h.action,
            comment: h.comment,
            createdAt: h.createdAt.toISOString(),
            user: h.user,
          }))}
        />
      )}
    </div>
  );
}
