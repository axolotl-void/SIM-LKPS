import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
const Tabel1A1Client = dynamic(() =>
  import("@/components/tables/tabel-1a1-client").then((m) => m.Tabel1A1Client)
);
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { BookOpen, Calendar, FileText } from "lucide-react";
import type { Metadata } from "next";
import { Role } from "@prisma/client";

export const metadata: Metadata = {
  title: "Tabel 1.A.1 — Pimpinan dan Tupoksi UPPS dan PS",
};

export default async function Tabel1A1Page() {
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

  const def = await db.tabelDefinition.findUnique({ where: { kode: "1.A.1" } });
  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 1.A.1 tidak ditemukan di database. Pastikan seed data telah dijalankan.
      </div>
    );
  }

  // Fetch dosens for dropdown
  const dosens = await db.dosen.findMany({
    where: { isActive: true },
    select: {
      id: true,
      nidn: true,
      nama: true,
      jabatanFungsional: true,
      pendidikanTerakhir: true,
    },
    orderBy: { nama: "asc" },
  });

  const lkps = await db.tabelLkps.findUnique({
    where: {
      tabelDefinitionId_tahunAkademikId: {
        tabelDefinitionId: def.id,
        tahunAkademikId: activeTa.id,
      },
    },
    include: {
      rows: { orderBy: { rowOrder: "asc" } },
      validationHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true, role: true } } },
      },
    },
  });

  const initialRows = lkps?.rows || [];
  const currentStatus = lkps?.status ?? "DRAFT";
  const userRole = (session.user.role as Role) ?? "PIMPINAN";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-soft-sm border border-slate-100/60">
        

        <div className="relative z-10 flex flex-col gap-2.5 md:max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xs font-black uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">
              Tabel {def.kode}
            </span>
            {/* Status badge dihapus */}
          </div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">{def.nama}</h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50/70 p-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-2xs font-semibold text-slate-500">Tahun Akademik</div>
                <div className="text-xs font-semibold text-slate-700 mt-px">{activeTa.tahun} ({activeTa.semester})</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50/70 p-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-2xs font-semibold text-slate-500">Program Studi</div>
                <div className="text-xs font-semibold text-slate-700 mt-px">{activeTa.prodi.nama} ({activeTa.prodi.jenjang})</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <ErrorBoundary>
        <Tabel1A1Client
          initialRows={initialRows.map((r) => ({
            id: r.id,
            rowOrder: r.rowOrder,
            rowData: r.rowData,
          }))}
          tahunAkademikId={activeTa.id}
          tabelKode={def.kode}
          status={currentStatus}
          userRole={userRole}
          dosens={dosens}
        />
      </ErrorBoundary>

      {/* Validation History - DIHAPUS
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
      )} */}
    </div>
  );
}
