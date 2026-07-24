import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, ArrowRight, Calendar, BookOpen, 
  GraduationCap, Users, Map, BarChart3,
  Briefcase, Star, Shuffle, Award, Target, TrendingUp, CheckCircle2,
  Plus, Clock
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BAB 2 — Pendidikan",
};

// Table configurations - Soft Cyan theme
const DEFAULT_CONFIG = { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Default" };
const TABLE_CONFIGS: Record<string, typeof DEFAULT_CONFIG> = {
  "2.A.1": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Mahasiswa" },
  "2.A.2": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Kelulusan" },
  "2.A.3": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Prestasi" },
  "2.B.1": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Kurikulum" },
  "2.B.2": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Pembelajaran" },
  "2.B.3": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Integrasi" },
  "2.B.4": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Dosen" },
  "2.B.5": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Biaya" },
  "2.B.6": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Beasiswa" },
  "2.C": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Kerja Sama" },
  "2.D": { gradient: "from-cyan-600 to-teal-600", iconBg: "bg-cyan-600", iconColor: "text-white", accentColor: "cyan", badge: "Luaran" },
};

const TABLE_ICONS: Record<string, any> = {
  "2.A.1": Users, "2.A.2": Map, "2.A.3": BarChart3,
  "2.B.1": BookOpen, "2.B.2": GraduationCap, "2.B.3": FileText,
  "2.B.4": Clock, "2.B.5": Briefcase, "2.B.6": Star,
  "2.C": Shuffle, "2.D": Award,
};

export default async function Bab2Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true }
  });

  const definitions = await db.tabelDefinition.findMany({
    where: { bab: 2 },
    orderBy: { urutan: "asc" },
  });

  const instances = activeTa
    ? await db.tabelLkps.findMany({
        where: {
          tahunAkademikId: activeTa.id,
          tabelDefinitionId: { in: definitions.map((d) => d.id) },
        },
        include: { _count: { select: { rows: true } } },
      })
    : [];

  const instanceMap = Object.fromEntries(
    instances.map((inst) => [inst.tabelDefinitionId, inst])
  );

  const totalData = instances.reduce((sum, i) => sum + i._count.rows, 0);
  const filledTables = instances.filter((i) => i._count.rows > 0).length;
  const progressPercent = definitions.length > 0 ? Math.round((filledTables / definitions.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-12">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO HEADER - Compact Cyan Theme */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 p-5 mb-6 shadow-xl animate-fade-in-up">
        {/* Animated blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white/70 text-2xs font-bold uppercase tracking-widest">BAB 2 • Akreditasi</span>
                <h1 className="text-white text-lg font-black tracking-tight">Pendidikan</h1>
              </div>
            </div>
            
            {/* Mini Progress Ring */}
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="white" strokeWidth="5" strokeDasharray={`${(progressPercent / 100) * 150} 150`} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-black">{progressPercent}%</span>
              </div>
            </div>
          </div>

          {/* Stats Row - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span className="text-white/70 text-2xs font-semibold">Terisi</span>
              </div>
              <div className="text-white text-xl font-black">{filledTables}/{definitions.length}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 mb-0.5">
                <FileText className="w-3 h-3 text-blue-300" />
                <span className="text-white/70 text-2xs font-semibold">Total Data</span>
              </div>
              <div className="text-white text-xl font-black">{totalData}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Clock className="w-3 h-3 text-amber-300" />
                <span className="text-white/70 text-2xs font-semibold">Status</span>
              </div>
              <div className="text-white text-base font-bold">Draft</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Calendar className="w-3 h-3 text-pink-300" />
                <span className="text-white/70 text-2xs font-semibold">Tahun</span>
              </div>
              <div className="text-white text-base font-bold">{activeTa?.tahun || '-'}</div>
            </div>
          </div>

          {/* Info Row - Compact */}
          {activeTa && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-white/80 text-3xs font-semibold">
              <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.semester}</span>
              <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.prodi.nama} ({activeTa.prodi.jenjang})</span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TABLE CARDS - Compact with Smooth Entrance Animation */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {definitions.map((def, index) => {
          const inst = instanceMap[def.id];
          const rowCount = inst?._count.rows || 0;
          const hasData = rowCount > 0;
          const config = TABLE_CONFIGS[def.kode] || DEFAULT_CONFIG;
          const IconComponent = TABLE_ICONS[def.kode] || FileText;

          return (
            <Link
              key={def.id}
              href={`/lkps/bab-2/tabel-${def.kode.toLowerCase().replace(/\./g, "")}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.08}s` }}
            >
              {/* Main Card - Compact */}
              <div className={`relative h-full rounded-2xl bg-white shadow-md border border-slate-100/50 overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5 group-hover:border-cyan-200/30`}>
                
                {/* Top Color Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

                {/* Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded-md text-2xs font-black uppercase tracking-wider">
                      Tabel {def.kode}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-2xs font-bold ${hasData ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {hasData ? 'Terisi' : 'Empty'}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${config.iconBg} shadow-md transform group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 leading-tight group-hover:text-cyan-700 transition-colors flex-1 pt-1">
                      {def.nama}
                    </h3>
                  </div>

                  {/* Data Counter */}
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border-2 ${hasData ? 'bg-cyan-50/50 border-cyan-100' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                    <div>
                      <div className={`text-2xl font-black ${hasData ? 'text-cyan-600' : 'text-slate-300'}`}>{rowCount}</div>
                      <div className="text-2xs text-slate-400 font-semibold">Data</div>
                    </div>
                    {hasData && (
                      <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-600 transition-colors">
                      {hasData ? 'Edit Data' : 'Mulai Isi'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>

                {/* Bottom accent */}
                <div className={`h-0.5 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>

              {/* Glow on hover */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-2xl opacity-0 group-hover:opacity-15 blur-sm transition-opacity duration-700 -z-10`} />
            </Link>
          );
        })}
      </div>

    </div>
  );
}
