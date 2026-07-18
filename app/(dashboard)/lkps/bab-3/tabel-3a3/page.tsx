import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabel3A3Client } from "@/components/tables/tabel-3a3-client";
import { ErrorBoundary } from "@/components/shared/error-boundary";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const prodiId = session.user.id;
  const activeTa = await db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true } });
  if (!activeTa) redirect("/lkps");
  if (activeTa.prodi.id !== prodiId) redirect("/lkps");

  const def = await db.tabelDefinition.findFirst({ where: { kode: "3.A.3" } });
  if (!def) redirect("/lkps/bab-3");

  const lkpsTs = await db.lKpsTs.findFirst({ where: { tabelDefinitionId: def.id, tahunAkademikId: activeTa.id } });
  const rows = lkpsTs?.rows || [];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-50/50 via-blue-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="relative z-10 flex flex-col gap-5 md:max-w-xl">
          <div>
            <span className="text-3xs font-black uppercase tracking-wider text-cyan-600 bg-cyan-50/80 px-2.5 py-1 rounded-lg">Tabel {def.kode}</span>
            <h2 className="mt-3.5 text-lg font-bold text-slate-800 tracking-tight">{def.nama}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">Pengembangan DTPR di Bidang Penelitian</p>
          </div>
        </div>
      </div>
      <ErrorBoundary>
        <Tabel3A3Client initialRows={rows} tahunAkademikId={activeTa.id} tabelKode={def.kode} />
      </ErrorBoundary>
    </div>
  );
}
