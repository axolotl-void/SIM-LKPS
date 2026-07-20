import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

const tables = [
  { kode: "5.1", nama: "Sistem Tata Kelola", desc: "Data sistem informasi tata kelola UPPS/PS.", badge: "Sistem", icon: "⚙️" },
  { kode: "5.2", nama: "Sarana dan Prasarana Pendidikan", desc: "Data inventaris sarana dan prasarana pendidikan.", badge: "Inventory", icon: "🏫" },
];

export const metadata: Metadata = { title: "BAB 5 — Tata Kelola | SIM-LKPS" };

export default async function Bab5Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true }, include: { prodi: true },
  });
  if (!activeTa) redirect("/dashboard");
  const tabelDefinitions = await db.tabelDefinition.findMany({
    where: { kode: { in: tables.map(t => t.kode) } },
    include: { tabelLkps: { where: { tahunAkademikId: activeTa.id }, include: { rows: true } } },
  });
  const lkpsMap = new Map(tabelDefinitions.map(d => [d.kode, d.tabelLkps[0]]));

  return (
    <div className="min-h-screen pb-12">
      <section className="bg-white rounded-3xl mx-8 mt-6 p-10 shadow-soft border border-slate-100/50 relative overflow-hidden">
        <div className="max-w-xl">
          <div className="inline-block px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-bold rounded-full mb-4">LKPS / BAB 5</div>
          <h1 className="text-3xl font-bold mb-2">BAB 5 — Akuntabilitas</h1>
          <p className="text-slate-500 text-sm leading-relaxed">2 tabel — Sistem tata kelola, sarana dan prasarana pendidikan</p>
        </div>
      </section>
      <section className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tables.map((table) => {
            const lkpsData = lkpsMap.get(table.kode);
            const rowCount = lkpsData?.rows?.length || 0;
            const hasData = rowCount > 0;
            return (
              <Link key={table.kode}
                href={`/lkps/bab-5/tabel-${table.kode.replace(/\./g, "").toLowerCase()}`}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100/50 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center text-xl">{table.icon}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400">{table.kode}</span>
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded uppercase">{table.badge}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{table.nama}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">{table.desc}</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${hasData ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {hasData ? `${rowCount} data` : 'Kosong'}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-violet-600 flex items-center group">Buka Tabel <span className="ml-1 transition-transform group-hover:translate-x-1">→</span></span>
                  <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-violet-600 hover:text-white transition-colors">→</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
