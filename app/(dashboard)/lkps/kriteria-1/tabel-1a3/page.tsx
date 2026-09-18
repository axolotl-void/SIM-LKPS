import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
const Tabel1A3Client = dynamic(() =>
  import("@/components/tables/tabel-1a3-client").then((m) => m.Tabel1A3Client)
);
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { Role } from "@prisma/client";

type LkpsRow = {
  id: string;
  rowOrder: number;
  rowData: Record<string, unknown> | null;
};

export const metadata: Metadata = {
  title: "Tabel 1.A.3 — Penggunaan Dana UPPS/PS",
};

const statusBadge = {
  DRAFT:     { icon: <Clock className="h-3.5 w-3.5" />, label: "Draft", color: "slate" as const },
  DIAJUKAN:  { icon: <Clock className="h-3.5 w-3.5" />, label: "Diajukan", color: "amber" as const },
  DIREVISI:  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Direvisi", color: "orange" as const },
  DISETUJUI: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Disetujui", color: "emerald" as const },
  DITOLAK:   { icon: <XCircle className="h-3.5 w-3.5" />, label: "Ditolak", color: "red" as const },
};

export default async function Tabel1A3Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get active academic year
  // PERF: query di bawah tidak saling bergantung → jalankan paralel (dulu berurutan).
  const [activeTa, def] = await Promise.all([
    await db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true }, }),
    await db.tabelDefinition.findUnique({ where: { kode: "1.A.3" }, }),
  ]);

  if (!activeTa) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Belum ada tahun akademik yang aktif. Hubungi Administrator.
      </div>
    );
  }


  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 1.A.3 tidak ditemukan di database. Pastikan seed data telah dijalankan.
      </div>
    );
  }

  // Determine TS-1 and TS-2 academic years based on active Ta
  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]!);
  const ts1Tahun = `${activeYearStart - 1}/${activeYearStart}`;
  const ts2Tahun = `${activeYearStart - 2}/${activeYearStart - 1}`;

  // PERF: dua query di bawah independen → jalankan paralel.
  const [taTs1, taTs2] = await Promise.all([
    await db.tahunAkademik.findFirst({ where: { tahun: ts1Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId }, }),
    await db.tahunAkademik.findFirst({ where: { tahun: ts2Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId }, }),
  ]);

  // Get current year (TS) TabelLkps
  const lkpsTs = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: def.id,
        tahunAkademikId: activeTa.id,
      },
    },
    include: {
      rows: {
        orderBy: { rowOrder: "asc" },
      },
      validationHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true, role: true } } },
      },
    },
  });

  // Get TS-1 rows
  const lkpsTs1 = taTs1
    ? await db.tabelLkps.findUnique({
        where: {
          tabelDefinitionId_tahunAkademikId: {
            tabelDefinitionId: def.id,
            tahunAkademikId: taTs1.id,
          },
        },
        include: { rows: true },
      })
    : null;

  // Get TS-2 rows
  const lkpsTs2 = taTs2
    ? await db.tabelLkps.findUnique({
        where: {
          tabelDefinitionId_tahunAkademikId: {
            tabelDefinitionId: def.id,
            tahunAkademikId: taTs2.id,
          },
        },
        include: { rows: true },
      })
    : null;

  const rowsTs = lkpsTs?.rows || [];
  const rowsTs1 = lkpsTs1?.rows || [];
  const rowsTs2 = lkpsTs2?.rows || [];
  const status = lkpsTs?.status ?? "DRAFT";
  const statusCfg = statusBadge[status] ?? statusBadge.DRAFT;
  const history = lkpsTs?.validationHistory || [];

  // Merge rows by 'jenisPenggunaan'
  const initialRows = rowsTs.map((r) => {
    const rd = r.rowData as Record<string, unknown> | null;
    const penggunaan = rd?.jenisPenggunaan as string | undefined;
    const matchTs1 = penggunaan ? rowsTs1.find((x) => (x.rowData as Record<string, unknown> | null)?.jenisPenggunaan === penggunaan) : undefined;
    const matchTs2 = penggunaan ? rowsTs2.find((x) => (x.rowData as Record<string, unknown> | null)?.jenisPenggunaan === penggunaan) : undefined;
    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        jenisPenggunaan: penggunaan ?? "",
        ts: Number(rd?.nominal) || 0,
        ts1: matchTs1 ? Number((matchTs1.rowData as Record<string, unknown> | null)?.nominal) || 0 : 0,
        ts2: matchTs2 ? Number((matchTs2.rowData as Record<string, unknown> | null)?.nominal) || 0 : 0,
        linkBukti: (rd?.linkBukti as string) ?? "",
      },
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-soft-sm border border-slate-100/60">        

        <div className="relative z-10 flex flex-col gap-2.5 md:max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">
              Tabel {def.kode}
            </span>
            <span className={`flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-lg bg-${statusCfg.color}-50 text-${statusCfg.color}-600 border border-${statusCfg.color}-100/50`}>
              {statusCfg.icon} {statusCfg.label}
            </span>
          </div>
          <h2 className="mt-1.5 text-base font-bold text-slate-800 tracking-tight">
            {def.nama}
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Kriteria Penggunaan Alokasi Finansial Program Studi UBBG
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Academic Year Card */}
            <div className="flex items-center gap-2 rounded-lg bg-slate-50/70 p-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-2xs font-semibold text-slate-500">
                  Tahun Akademik
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-px">
                  {activeTa.tahun} ({activeTa.semester})
                </div>
              </div>
            </div>

            {/* Prodi Card */}
            <div className="flex items-center gap-2 rounded-lg bg-slate-50/70 p-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-2xs font-semibold text-slate-500">
                  Program Studi
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-px">
                  {activeTa.prodi.nama} ({activeTa.prodi.jenjang})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <ErrorBoundary>
        <Tabel1A3Client
          initialRows={initialRows}
          tahunAkademikId={activeTa.id}
          tabelKode={def.kode}
          status={status}
          userRole={session.user.role as Role}
        />
      </ErrorBoundary>

      {/* Validation History */}
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
