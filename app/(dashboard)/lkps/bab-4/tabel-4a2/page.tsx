import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel4A2Client } from "@/components/tables/tabel-4a2-client";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { Users, Calendar, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabel 4.A.2 — PkM DTPR, Hibah, dan Pembiayaan",
};

export default async function Tabel4A2Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
  if (!activeTa) redirect("/dashboard");

  const def = await db.tabelDefinition.findUnique({ where: { kode: "4.A.2" } });
  if (!def) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center text-xs font-semibold text-slate-500">
        Definisi Tabel 4.A.2 tidak ditemukan. Pastikan seed data telah dijalankan.
      </div>
    );
  }

  const lkpsTs = await db.tabelLkps.findUnique({
    where: { tabelDefinitionId_tahunAkademikId: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } },
    include: { rows: { orderBy: { rowOrder: "asc" } } },
  });
  const rawRows = lkpsTs?.rows ?? [];

  const rows = rawRows.map((r) => {
    const d = r.rowData as Record<string, unknown>;
    return {
      id: r.id,
      rowOrder: r.rowOrder,
      rowData: {
        tahun: String(d.tahun ?? "TS"),
        namaDtpr: String(d.namaDtpr ?? ""),
        judulPkm: String(d.judulPkm ?? ""),
        jumlahMahasiswa: Number(d.jumlahMahasiswa ?? 0),
        jenisHibah: (["L", "N", "I"].includes(String(d.jenisHibah)) ? d.jenisHibah : "L") as "L" | "N" | "I",
        durasi: Number(d.durasi ?? 0),
        danaTs2: Number(d.danaTs2 ?? 0),
        danaTs1: Number(d.danaTs1 ?? 0),
        danaTs: Number(d.danaTs ?? 0),
        linkBukti: String(d.linkBukti ?? ""),
      },
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-50/50 via-red-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="flex h-20 w-16 rotate-12 items-center justify-center rounded-2xl bg-white shadow-soft-lg border border-slate-100/40 text-orange-500">
            <Users className="h-10 w-10 text-orange-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <span className="text-3xs font-black uppercase tracking-wider text-orange-600 bg-orange-50/80 px-2.5 py-1 rounded-lg">
              Tabel {def.kode}
            </span>
            <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">
              {def.nama}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Kegiatan PkM yang melibatkan DTPR beserta hibah dan pembiayaannya
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500/10 to-red-500/10 text-orange-600 shadow-soft-2xs">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider">Tahun Akademik</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{activeTa.tahun} ({activeTa.semester})</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500/10 to-red-500/10 text-orange-600 shadow-soft-2xs">
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
        <Tabel4A2Client initialRows={rows} tahunAkademikId={activeTa.id} tabelKode={def.kode} />
      </ErrorBoundary>
    </div>
  );
}
