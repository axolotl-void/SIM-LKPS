import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel1A3Client } from "@/components/tables/tabel-1a3-client";
import { ValidationHistory } from "@/components/tables/validation-history";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

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

  // Get definition for 1.A.3
  const def = await db.tabelDefinition.findUnique({
    where: { kode: "1.A.3" },
  });

  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 1.A.3 tidak ditemukan di database. Pastikan seed data telah dijalankan.
      </div>
    );
  }

  // Determine TS-1 and TS-2 academic years based on active Ta
  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]);
  const ts1Tahun = `${activeYearStart - 1}/${activeYearStart}`;
  const ts2Tahun = `${activeYearStart - 2}/${activeYearStart - 1}`;

  const taTs1 = await db.tahunAkademik.findFirst({
    where: { tahun: ts1Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId },
  });

  const taTs2 = await db.tahunAkademik.findFirst({
    where: { tahun: ts2Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId },
  });

  // Get current year (TS) TabelLkps
  let lkpsTs = await db.tabelLkps.findUnique({
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
  const initialRows = rowsTs.map((r: any) => {
    const penggunaan = r.rowData.jenisPenggunaan;
    
    // Find matching nominal in TS-1 and TS-2
    const matchTs1 = rowsTs1.find((x: any) => x.rowData.jenisPenggunaan === penggunaan);
    const matchTs2 = rowsTs2.find((x: any) => x.rowData.jenisPenggunaan === penggunaan);

    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        jenisPenggunaan: penggunaan,
        ts: Number(r.rowData.nominal) || 0,
        ts1: matchTs1 ? Number(matchTs1.rowData.nominal) || 0 : 0,
        ts2: matchTs2 ? Number(matchTs2.rowData.nominal) || 0 : 0,
        linkBukti: r.rowData.linkBukti || "",
      },
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="flex h-20 w-16 rotate-12 items-center justify-center rounded-2xl bg-white shadow-soft-lg border border-slate-100/40 text-indigo-500">
            <FileText className="h-10 w-10 text-indigo-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">
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
            Kriteria Penggunaan Alokasi Finansial Program Studi UBBG
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Academic Year Card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Tahun Akademik
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {activeTa.tahun} ({activeTa.semester})
                </div>
              </div>
            </div>

            {/* Prodi Card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Program Studi
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
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
          userRole={session.user.role}
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
