import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2DClient } from "@/components/tables/tabel-2d-client";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 2.D — Rekognisi dan Apresiasi Kompetensi Lulusan",
};

export default async function Tabel2DPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  if (!activeTa) return <div className="p-6 text-center text-xs font-bold text-slate-400">Tahun Akademik Aktif tidak ditemukan.</div>;

  const def = await db.tabelDefinition.findUnique({ where: { kode: "2.D" } });
  if (!def) return <div className="p-6 text-center text-xs font-bold text-slate-400">Definisi tabel 2.D tidak ditemukan.</div>;

  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]);
  const taTs1 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 1}/${activeYearStart}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });
  const taTs2 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 2}/${activeYearStart - 1}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });

  const [lkpsTs, lkpsTs1, lkpsTs2] = await Promise.all([
    db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } }, include: { rows: { orderBy: { rowOrder: "asc" } } } }),
    taTs1 ? db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs1.id } }, include: { rows: { orderBy: { rowOrder: "asc" } } } }) : null,
    taTs2 ? db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs2.id } }, include: { rows: { orderBy: { rowOrder: "asc" } } } }) : null,
  ]);

  const DEFAULT_SOURCES = [
    { key: "masyarakat", label: "Masyarakat" },
    { key: "duniaUsaha", label: "Dunia Usaha" },
    { key: "duniaIndustri", label: "Dunia Industri" },
    { key: "duniaKerja", label: "Dunia Kerja" },
  ];

  const buildRows = (rows: any[], tahun: string) => {
    const result: Record<string, any> = {};
    for (const s of DEFAULT_SOURCES) {
      const match = rows.find((r: any) => r.rowData.key === s.key);
      result[s.key] = match ? match.rowData : null;
    }
    return result;
  };

  const rowsTs = buildRows(lkpsTs?.rows || [], "TS");
  const rowsTs1 = buildRows(lkpsTs1?.rows || [], "TS-1");
  const rowsTs2 = buildRows(lkpsTs2?.rows || [], "TS-2");

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 via-purple-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
            <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">{def.nama}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">Pengakuan dan apresiasi kompetensi lulusan oleh DUDIKA</p>
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
        <Tabel2DClient
          tahunAkademikId={activeTa.id}
          tabelKode={def.kode}
          defaultSources={DEFAULT_SOURCES}
          rowsTs={rowsTs}
          rowsTs1={rowsTs1}
          rowsTs2={rowsTs2}
        />
      </ErrorBoundary>
    </div>
  );
}
