import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, ArrowRight, Calendar, BookOpen, 
  Users, Wallet, PieChart, LineChart, 
  UserCheck, ShieldCheck, Target, TrendingUp, CheckCircle2,
  Plus, Clock
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BAB 1 — Tata Pamong",
};

// Table configurations with unique identities
const TABLE_CONFIGS: Record<string, {
  gradient: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  badge: string;
}> = {
  "1.A.1": {
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    accentColor: "blue",
    badge: "Pimpinan"
  },
  "1.A.2": {
    gradient: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    accentColor: "emerald",
    badge: "Keuangan"
  },
  "1.A.3": {
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
    accentColor: "amber",
    badge: "Dana"
  },
  "1.A.4": {
    gradient: "from-rose-500 to-pink-500",
    iconBg: "bg-rose-500",
    iconColor: "text-white",
    accentColor: "rose",
    badge: "Beban"
  },
  "1.A.5": {
    gradient: "from-violet-500 to-purple-500",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
    accentColor: "violet",
    badge: "Tenaga"
  },
  "1.B": {
    gradient: "from-cyan-500 to-teal-500",
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
    accentColor: "cyan",
    badge: "Kerja Sama"
  },
};

const TABLE_ICONS: Record<string, any> = {
  "1.A.1": Users,
  "1.A.2": Wallet,
  "1.A.3": PieChart,
  "1.A.4": LineChart,
  "1.A.5": UserCheck,
  "1.B": ShieldCheck,
};

export default async function Bab1Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true }
  });

  const definitions = await db.tabelDefinition.findMany({
    where: { bab: 1 },
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

  return (
    <div className="min-h-screen pb-12">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO HEADER */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 mb-8 shadow-2xl">
        {/* Animated background blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest">BAB 1 • Akreditasi</span>
              <h1 className="text-white text-2xl font-black tracking-tight">Tata Pamong & Tata Kelola</h1>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span className="text-white/70 text-3xs font-bold uppercase">Terisi</span>
              </div>
              <div className="text-white text-3xl font-black">{filledTables}/{definitions.length}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-blue-300" />
                <span className="text-white/70 text-3xs font-bold uppercase">Total Data</span>
              </div>
              <div className="text-white text-3xl font-black">{totalData}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-300" />
                <span className="text-white/70 text-3xs font-bold uppercase">Status</span>
              </div>
              <div className="text-white text-xl font-black mt-0.5">Draft</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-pink-300" />
                <span className="text-white/70 text-3xs font-bold uppercase">Tahun</span>
              </div>
              <div className="text-white text-lg font-black mt-0.5">{activeTa?.tahun || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TABLE CARDS - LARGE PREMIUM DESIGN */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {definitions.map((def, index) => {
          const inst = instanceMap[def.id];
          const rowCount = inst?._count.rows || 0;
          const hasData = rowCount > 0;
          const config = TABLE_CONFIGS[def.kode] || TABLE_CONFIGS["1.A.1"];
          const IconComponent = TABLE_ICONS[def.kode] || FileText;

          return (
            <Link
              key={def.id}
              href={`/lkps/bab-1/tabel-${def.kode.toLowerCase().replace(/\./g, "")}`}
              className="group"
            >
              {/* Outer glow */}
              <div className={`relative`}>
                <div className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`} />
                
                {/* Main Card */}
                <div className={`relative h-full rounded-3xl bg-white shadow-lg border border-slate-100/80 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2`}>
                  
                  {/* Hero Color Banner */}
                  <div className={`relative h-24 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                        backgroundSize: '16px 16px'
                      }}
                    />
                    
                    {/* Large floating icon */}
                    <div className="absolute -bottom-6 right-4">
                      <div className={`flex items-center justify-center w-20 h-20 rounded-2xl ${config.iconBg} shadow-2xl transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500`}>
                        <IconComponent className={`w-10 h-10 ${config.iconColor}`} />
                      </div>
                    </div>

                    {/* Table Code Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/25 backdrop-blur-sm rounded-full text-white text-2xs font-black uppercase tracking-wider border border-white/30">
                        Tabel {def.kode}
                      </span>
                    </div>

                    {/* Status indicator */}
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 px-2.5 py-1 backdrop-blur-sm rounded-full text-white text-3xs font-bold border ${
                        hasData 
                          ? 'bg-emerald-500/80 border-emerald-400/50' 
                          : 'bg-white/20 border-white/30'
                      }`}>
                        {hasData ? <><CheckCircle2 className="w-3 h-3" /> Done</> : 'Empty'}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors leading-tight">
                      {def.nama}
                    </h3>

                    {/* Stats Box */}
                    <div className={`rounded-2xl p-4 mb-4 border-2 transition-all duration-300 ${
                      hasData 
                        ? 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200' 
                        : 'bg-slate-50 border-dashed border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-4xl font-black ${hasData ? `text-${config.accent}-600` : 'text-slate-300'}`}>
                            {rowCount}
                          </div>
                          <div className="text-3xs font-bold text-slate-400 uppercase tracking-wide mt-1">Data Entry</div>
                        </div>
                        
                        {/* Circular Progress */}
                        <div className="relative w-14 h-14">
                          <svg className="w-14 h-14 -rotate-90">
                            <circle cx="28" cy="28" r="24" fill="none" stroke={hasData ? `rgb(var(--${config.accent}-200))` : '#e2e8f0'} strokeWidth="6" />
                            <circle 
                              cx="28" cy="28" r="24" 
                              fill="none" 
                              stroke={hasData ? `rgb(var(--${config.accent}-500))` : '#94a3b8'} 
                              strokeWidth="6"
                              strokeDasharray={`${hasData ? 150 : 30} 150`}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            {hasData ? (
                              <CheckCircle2 className={`w-6 h-6 text-${config.accent}-500`} />
                            ) : (
                              <Plus className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${hasData ? `from-${config.accent}-50 to-${config.accent}-100/50` : 'from-slate-50 to-slate-100'} border border-${hasData ? config.accent : 'slate'}-200/50 transition-all duration-300 group-hover:shadow-md`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${hasData ? `bg-${config.accent}-500` : 'bg-slate-400'} animate-pulse`} />
                        <span className={`text-xs font-bold ${hasData ? `text-${config.accent}-700` : 'text-slate-500'}`}>
                          {hasData ? 'Lihat & Edit' : 'Mulai Isi'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${hasData ? `bg-${config.accent}-500 text-white` : 'bg-slate-200 text-slate-400'} group-hover:translate-x-1 transition-all duration-300`}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
