import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2A3Client } from "@/components/tables/tabel-2a3-client";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 2.A.3 — Kondisi Jumlah Mahasiswa",
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

  const activeYearStart = parseInt(activeTa.tahun.split("/")[0]);
  const taTs1 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 1}/${activeYearStart}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });
  const taTs2 = await db.tahunAkademik.findFirst({ where: { tahun: `${activeYearStart - 2}/${activeYearStart - 1}`, semester: activeTa.semester, prodiId: activeTa.prodiId } });

  const lkpsTs = await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } }, include: { rows: true } });
  const lkpsTs1 = taTs1 ? await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs1.id } }, include: { rows: true } }) : null;
  const lkpsTs2 = taTs2 ? await db.tabelLkps.findUnique({ where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: taTs2.id } }, include: { rows: true } }) : null;

  const rowsTs = lkpsTs?.rows || [];
  const rowsTs1 = lkpsTs1?.rows || [];
  const rowsTs2 = lkpsTs2?.rows || [];

  const initialRows = rowsTs.map((r: any) => {
    const kat = r.rowData.kategori;
    const matchTs1 = rowsTs1.find((x: any) => x.rowData.kategori === kat);
    const matchTs2 = rowsTs2.find((x: any) => x.rowData.kategori === kat);
    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        kategori: kat,
        ts: Number(r.rowData.nominal) || 0,
        ts1: matchTs1 ? Number(matchTs1.rowData.nominal) || 0 : 0,
        ts2: matchTs2 ? Number(matchTs2.rowData.nominal) || 0 : 0,
      },
    };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <span className="text-3xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
        <h2 className="mt-4 text-xl font-bold text-slate-800 tracking-tight">{def.nama}</h2>
        <p className="mt-1 text-xs font-semibold text-slate-400">Rekap kondisi jumlah mahasiswa {activeTa.tahun} ({activeTa.semester}) — {activeTa.prodi.nama}</p>
      </div>
      <ErrorBoundary>
        <Tabel2A3Client initialRows={initialRows} tahunAkademikId={activeTa.id} tabelKode={def.kode} />
      </ErrorBoundary>
    </div>
  );
}
