import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  FileText, ArrowRight, Calendar,
  Users, Wallet, PieChart, LineChart,
  UserCheck, ShieldCheck, Target, CheckCircle2, Clock, Sparkles,
  type LucideIcon
} from "lucide-react";

export const metadata = { title: "BAB 1 — Tata Pamong" };

const TABLE_ICONS: Record<string, LucideIcon> = {
  "1.A.1": Users, "1.A.2": Wallet, "1.A.3": PieChart,
  "1.A.4": LineChart, "1.A.5": UserCheck, "1.B": ShieldCheck,
};

export default async function Bab1Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [activeTa, definitions] = await Promise.all([
    db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true } }),
    db.tabelDefinition.findMany({ where: { bab: 1 }, orderBy: { urutan: "asc" } }),
  ]);

  if (!activeTa) redirect("/dashboard");

  const instances = activeTa
    ? await db.tabelLkps.findMany({
        where: { tahunAkademikId: activeTa.id, tabelDefinitionId: { in: definitions.map(d => d.id) } },
        include: { _count: { select: { rows: true } } },
      })
    : [];

  const instanceMap = Object.fromEntries(instances.map(i => [i.tabelDefinitionId, i]));
  const totalData = instances.reduce((s, i) => s + i._count.rows, 0);
  const filledTables = instances.filter(i => i._count.rows > 0).length;
  const progressPercent = definitions.length ? Math.round((filledTables / definitions.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 mb-6 shadow-xl animate-fade-in-up">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-4 border-white/10 transform rotate-12" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border-4 border-white/10 transform -rotate-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 transform hover:scale-105 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">BAB 1 • Akreditasi</span>
                <h1 className="text-white text-xl font-black tracking-tight">Tata Pamong & Tata Kelola</h1>
              </div>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6"
                  strokeDasharray={`${(progressPercent / 100) * 176} 176`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-black">{progressPercent}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <StatCard icon={CheckCircle2} label="Terisi" value={`${filledTables}/${definitions.length}`} color="emerald" />
            <StatCard icon={FileText} label="Total Data" value={totalData} color="blue" />
            <StatCard icon={Clock} label="Status" value="Draft" color="amber" />
            <StatCard icon={Calendar} label="Tahun" value={activeTa?.tahun || '-'} color="pink" />
          </div>

          {activeTa && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-white/80 text-xs font-medium">
              <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.semester}</span>
              <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.prodi.nama} ({activeTa.prodi.jenjang})</span>
            </div>
          )}
        </div>
      </div>

      {/* TABLE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {definitions.map((def, index) => {
          const inst = instanceMap[def.id];
          const rowCount = inst?._count.rows || 0;
          const hasData = rowCount > 0;
          const IconComponent = TABLE_ICONS[def.kode] || FileText;
          const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

          return (
            <Link key={def.id} href={`/lkps/bab-1/tabel-${def.kode.toLowerCase().replace(/\./g, "")}`}
              className={`group relative block animate-fade-in-up ${staggerClass}`}>
              <div className="relative h-full rounded-2xl bg-white shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-blue-200">
                <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />

                  <div className="absolute -bottom-3 right-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/25 border border-white/40 shadow-lg rotate-12 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/25 rounded-lg text-white text-xs font-bold border border-white/40">
                      Tabel {def.kode}
                    </span>
                  </div>

                  {hasData && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-emerald-500/90 rounded-full text-white text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terisi
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-800 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                    {def.nama}
                  </h3>

                  <div className={`rounded-xl p-4 mb-4 ${hasData
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    : 'bg-slate-100 border-2 border-dashed border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-4xl font-black ${hasData ? 'text-white' : 'text-slate-300'}`}>{rowCount}</div>
                        <div className={`text-sm font-medium ${hasData ? 'text-blue-100' : 'text-slate-400'}`}>Data Entry</div>
                      </div>
                      {hasData ? <CheckCircle2 className="w-6 h-6 text-white/80" /> : <Sparkles className="w-6 h-6 text-slate-300" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${hasData ? 'text-blue-600' : 'text-slate-500'} group-hover:underline`}>
                      {hasData ? 'Lihat & Edit Data' : 'Mulai Mengisi'}
                    </span>
                    <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${hasData
                      ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = { emerald: 'emerald-300', blue: 'blue-300', amber: 'amber-300', pink: 'pink-300' };
  return (
    <div className="bg-white/15 rounded-xl p-3 border border-white/20">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={`w-3 h-3 text-${colors[color]}`} />
        <span className="text-white/70 text-2xs font-semibold">{label}</span>
      </div>
      <div className="text-white text-xl font-black">{value}</div>
    </div>
  );
}
