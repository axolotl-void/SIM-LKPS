import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  FileText, ArrowRight, Calendar, BookOpen,
  GraduationCap, Users, Map, BarChart3,
  Briefcase, Star, Shuffle, Award, CheckCircle2, Clock
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata = { title: "BAB 2 — Pendidikan" };

const TABLE_CONFIGS: Record<string, { gradient: string; bg: string; color: string; badge: string }> = {
  "2.A.1": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Mahasiswa" },
  "2.A.2": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Kelulusan" },
  "2.A.3": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Prestasi" },
  "2.B.1": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Kurikulum" },
  "2.B.2": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Pembelajaran" },
  "2.B.3": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Integrasi" },
  "2.B.4": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Dosen" },
  "2.B.5": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Biaya" },
  "2.B.6": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Beasiswa" },
  "2.C": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Kerja Sama" },
  "2.D": { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "Luaran" },
};

const TABLE_ICONS: Record<string, LucideIcon> = {
  "2.A.1": Users, "2.A.2": Map, "2.A.3": BarChart3,
  "2.B.1": BookOpen, "2.B.2": GraduationCap, "2.B.3": FileText,
  "2.B.4": Clock, "2.B.5": Briefcase, "2.B.6": Star,
  "2.C": Shuffle, "2.D": Award,
};

export default async function Bab2Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [activeTa, definitions] = await Promise.all([
    db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true } }),
    db.tabelDefinition.findMany({ where: { bab: 2 }, orderBy: { urutan: "asc" } }),
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 p-5 mb-6 shadow-xl animate-fade-in-up">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-4 border-white/10 transform rotate-12" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full border-4 border-white/10 transform -rotate-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 transform hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">BAB 2 • Akreditasi</span>
                <h1 className="text-white text-xl font-black tracking-tight">Pendidikan</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {definitions.map((def, index) => {
          const inst = instanceMap[def.id];
          const rowCount = inst?._count.rows || 0;
          const hasData = rowCount > 0;
          const config = TABLE_CONFIGS[def.kode] ?? { gradient: "from-cyan-500 to-teal-500", bg: "bg-cyan-600", color: "text-white", badge: "" };
          const IconComponent = TABLE_ICONS[def.kode] || FileText;
          const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

          return (
            <Link key={def.id} href={`/lkps/bab-2/tabel-${def.kode.toLowerCase().replace(/\./g, "")}`} className={`group relative block animate-fade-in-up ${staggerClass}`}>
              <div className="relative h-full rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded-md text-2xs font-black uppercase tracking-wider">
                      Tabel {def.kode}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-2xs font-bold ${hasData ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {hasData ? 'Terisi' : 'Empty'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${config.bg} shadow-md group-hover:scale-105 transition-transform duration-200`}>
                      <IconComponent className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 leading-tight group-hover:text-cyan-700 transition-colors flex-1 pt-1">
                      {def.nama}
                    </h3>
                  </div>

                  <div className={`flex items-center justify-between p-2.5 rounded-xl border-2 ${hasData ? 'bg-cyan-50 border-cyan-100' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                    <div>
                      <div className={`text-2xl font-black ${hasData ? 'text-cyan-600' : 'text-slate-300'}`}>{rowCount}</div>
                      <div className="text-2xs text-slate-400 font-semibold">Data</div>
                    </div>
                    {hasData && <CheckCircle2 className="w-6 h-6 text-cyan-500" />}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-600 transition-colors">
                      {hasData ? 'Edit Data' : 'Mulai Isi'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>

                <div className={`h-0.5 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
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
