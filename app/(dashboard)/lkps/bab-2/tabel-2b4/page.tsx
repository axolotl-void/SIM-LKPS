import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2B4Client } from "@/components/tables/tabel-2b4-client";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 2.B.4 — Rata-rata Masa Tunggu Lulusan",
};

export default async function Tabel2B4Page() {
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

  const def = await db.tabelDefinition.findUnique({ where: { kode: "2.B.4" } });
  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 2.B.4 tidak ditemukan. Jalankan seed data.
      </div>
    );
  }

  // Determine TS-1 and TS-2
  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]);
  const ts1Tahun = `${activeYearStart - 1}/${activeYearStart}`;
  const ts2Tahun = `${activeYearStart - 2}/${activeYearStart - 1}`;

  const taTs1 = await db.tahunAkademik.findFirst({
    where: { tahun: ts1Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId },
  });
  const taTs2 = await db.tahunAkademik.findFirst({
    where: { tahun: ts2Tahun, semester: activeTa.semester, prodiId: activeTa.prodiId },
  });

  // Fetch rows for TS, TS-1, TS-2
  const [lkpsTs, lkpsTs1, lkpsTs2] = await Promise.all([
    db.tabelLkps.findUnique({
      where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } },
      include: { rows: { orderBy: { rowOrder: "asc" } } },
    }),
    taTs1 ? db.tabelLkps.findUnique({
      where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs1.id } },
      include: { rows: { orderBy: { rowOrder: "asc" } } },
    }) : null,
    taTs2 ? db.tabelLkps.findUnique({
      where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs2.id } },
      include: { rows: { orderBy: { rowOrder: "asc" } } },
    }) : null,
  ]);

  // Build data per year — each year has one row with { jumlahLulusan, jumlahTerlacak, rataRata }
  const rowsTs = lkpsTs?.rows || [];
  const rowsTs1 = lkpsTs1?.rows || [];
  const rowsTs2 = lkpsTs2?.rows || [];

  const getYearData = (rows: any[], label: string) => {
    const match = rows.find((r: any) => r.rowData.tahun === label);
    return match
      ? {
          id: match.id,
          rowOrder: match.rowOrder,
          rowData: {
            tahun: label,
            jumlahLulusan: Number(match.rowData.jumlahLulusan) || 0,
            jumlahTerlacak: Number(match.rowData.jumlahTerlacak) || 0,
            rataRata: Number(match.rowData.rataRata) || 0,
          },
        }
      : null;
  };

  // Initialize rows for TS-2, TS-1, TS with defaults if not exist
  const createDefaultRow = (label: string) => ({
    id: "",
    rowOrder: 0,
    rowData: { tahun: label, jumlahLulusan: 0, jumlahTerlacak: 0, rataRata: 0 },
  });

  const initialRows = [
    getYearData(rowsTs2, "TS-2") || createDefaultRow("TS-2"),
    getYearData(rowsTs1, "TS-1") || createDefaultRow("TS-1"),
    getYearData(rowsTs, "TS") || createDefaultRow("TS"),
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="flex h-20 w-16 rotate-12 items-center justify-center rounded-2xl bg-white shadow-soft-lg border border-slate-100/40 text-indigo-500">
            <FileText className="h-10 w-10 text-indigo-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">
              Tabel {def.kode}
            </span>
            <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">
              {def.nama}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Rata-rata waktu tunggu lulusan Program Studi Ilmu Komputer untuk bekerja pertama kali
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Tahun Akademik</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {activeTa.tahun} ({activeTa.semester})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 shadow-soft-2xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Program Studi</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {activeTa.prodi.nama} ({activeTa.prodi.jenjang})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Interactive Table */}
      <ErrorBoundary>
        <Tabel2B4Client
          initialRows={initialRows}
          tahunAkademikId={activeTa.id}
          tabelKode={def.kode}
        />
      </ErrorBoundary>
    </div>
  );
}
