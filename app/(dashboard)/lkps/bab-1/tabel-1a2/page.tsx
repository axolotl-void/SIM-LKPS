import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel1A2Client } from "@/components/tables/tabel-1a2-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 1.A.2 — Sumber Pendanaan UPPS/PS",
};

export default async function Tabel1A2Page() {
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

  // Get definition for 1.A.2
  const def = await db.tabelDefinition.findUnique({
    where: { kode: "1.A.2" },
  });

  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 1.A.2 tidak ditemukan di database. Pastikan seed data telah dijalankan.
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

  // Merge rows by 'sumberPendanaan'
  const initialRows = rowsTs.map((r: any) => {
    const sumber = r.rowData.sumberPendanaan;
    
    // Find matching nominal in TS-1 and TS-2
    const matchTs1 = rowsTs1.find((x: any) => x.rowData.sumberPendanaan === sumber);
    const matchTs2 = rowsTs2.find((x: any) => x.rowData.sumberPendanaan === sumber);

    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        sumberPendanaan: sumber,
        ts: Number(r.rowData.nominal) || 0,
        ts1: matchTs1 ? Number(matchTs1.rowData.nominal) || 0 : 0,
        ts2: matchTs2 ? Number(matchTs2.rowData.nominal) || 0 : 0,
        linkBukti: r.rowData.linkBukti || "",
      },
    };
  });

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
          Tabel {def.kode}
        </span>
        <h2 className="mt-3 text-lg font-bold text-slate-800 tracking-tight">{def.nama}</h2>
        <p className="mt-1 text-xs text-slate-400 font-semibold leading-relaxed">
          Tahun Akademik: {activeTa.tahun} ({activeTa.semester}) — Prodi {activeTa.prodi.nama}
        </p>
      </div>

      {/* Client Interactive Table & Modal Form */}
      <Tabel1A2Client
        initialRows={initialRows}
        tahunAkademikId={activeTa.id}
        tabelKode={def.kode}
      />
    </div>
  );
}
