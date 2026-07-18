import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel2B3Client } from "@/components/tables/tabel-2b3-client";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tabel 2.B.3 — Peta Pemenuhan CPL" };

export default async function Tabel2B3Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({ where: { isActive: true } });
  const def = await db.tabelDefinition.findUnique({ where: { kode: "2.B.3" } });
  if (!def || !activeTa) return <div className="p-6 text-center text-xs font-bold">Data tidak ditemukan.</div>;

  const lkpsTs = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } },
    include: { rows: { orderBy: { rowOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <span className="text-3xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
        <h2 className="mt-4 text-xl font-bold text-slate-800">{def.nama}</h2>
      </div>
      <ErrorBoundary>
        <Tabel2B3Client initialRows={lkpsTs?.rows || []} tahunAkademikId={activeTa.id} tabelKode={def.kode} />
      </ErrorBoundary>
    </div>
  );
}
