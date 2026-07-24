import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, ArrowRight, Calendar, 
  Users, Wallet, PieChart, LineChart, 
  UserCheck, ShieldCheck, Target, CheckCircle2, Clock, Sparkles
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BAB 1 — Tata Pamong",
};

// Table icons
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
  const progressPercent = definitions.length > 0 ? Math.round((filledTables / definitions.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-12">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 mb-6 shadow-xl animate-fade-in-up">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white/70 text-2xs font-bold uppercase tracking-widest">BAB 1 • Akreditasi</span>
                <h1 className="text-white text-lg font-black tracking-tight">Tata Pamong & Tata Kelola</h1>
              </div>
            </div>
            
            <div className="relative">
              <svg className="w-14 h-14 -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="white" strokeWidth="5" strokeDasharray={`${(progressPercent / 100) * 150} 150`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-black">{progressPercent}%</span>
              </div>
            </div>
          </div>

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

          {activeTa && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-white/80 text-3xs font-semibold">
              <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.semester}</span>
              <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.prodi.nama} ({activeTa.prodi.jenjang})</span>
            </div>
          )}
        </div>
      </div>

      {/* TABLE CARDS - Premium Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {definitions.map((def, index) => {
          const inst = instanceMap[def.id];
          const rowCount = inst?._count.rows || 0;
          const hasData = rowCount > 0;
          const IconComponent = TABLE_ICONS[def.kode] || FileText;

          return (
            <Link
              key={def.id}
              href={`/lkps/bab-1/tabel-${def.kode.toLowerCase().replace(/\./g, "")}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500 -z-10" />
              
              {/* Card with gradient accent */}
              <div className="relative h-full rounded-2xl bg-gradient-to-br from-white to-blue-50/30 shadow-lg border border-slate-100 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-blue-200/50">
                
                {/* Top gradient bar with pattern */}
                <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 overflow-hidden">
                  {/* Dots pattern */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)",
                    backgroundSize: "12px 12px"
                  }} />
                  
                  {/* Floating icon */}
                  <div className="absolute -bottom-3 right-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 bg-white/25 backdrop-blur-sm rounded-lg text-white text-sm font-bold border border-white/30 shadow-sm">
                      Tabel {def.kode}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="absolute top-3 right-3">
                    {hasData && (
                      <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-white text-xs font-bold shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terisi
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-800 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                    {def.nama}
                  </h3>

                  {/* Data counter with gradient background */}
                  <div className={`rounded-xl p-4 mb-4 transition-all ${hasData 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-slate-100 border-2 border-dashed border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-4xl font-black ${hasData ? 'text-white' : 'text-slate-300'}`}>{rowCount}</div>
                        <div className={`text-sm font-medium ${hasData ? 'text-blue-100' : 'text-slate-400'}`}>Data Entry</div>
                      </div>
                      {hasData && (
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                      {!hasData && (
                        <Sparkles className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${hasData ? 'text-blue-600' : 'text-slate-500'} group-hover:underline`}>
                      {hasData ? 'Lihat & Edit Data' : 'Mulai Mengisi'}
                    </span>
                    <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${hasData 
                      ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-1' 
                      : 'bg-slate-100 text-slate-400 group-hover:bg-blue-500 group-hover:text-white group-hover:translate-x-1'}`}>
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
