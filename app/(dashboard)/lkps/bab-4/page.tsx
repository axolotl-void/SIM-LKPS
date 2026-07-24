import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, ArrowRight, Calendar, 
  Microscope, Users, Handshake, Speaker, Trophy, CheckCircle2, Clock, Sparkles
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BAB 4 — Pengadian Masyarakat",
};

const TABLE_ICONS: Record<string, any> = {
  "4.A.1": Microscope,
  "4.A.2": Users,
  "4.C.1": Handshake,
  "4.C.2": Speaker,
  "4.C.3": Trophy,
};

const tables = [
  { kode: "4.A.1", nama: "Sarana dan Prasarana PkM", desc: "Data inventaris sarana dan prasarana pengadian kepada masyarakat." },
  { kode: "4.A.2", nama: "PkM DTPR, Hibah, dan Pembiayaan", desc: "Data PkM, sumber pendanaan, dan pembiayaan." },
  { kode: "4.C.1", nama: "Kerja Sama PkM", desc: "Data kerjasama PkM dengan institusi dalam dan luar negeri." },
  { kode: "4.C.2", nama: "Diseminasi Hasil PkM", desc: "Data diseminasi hasil PkM dalam lingkup lokal, nasional, internasional." },
  { kode: "4.C.3", nama: "Perolehan HKI PkM", desc: "Data hak kekayaan intelektual dari hasil PkM." },
];

export default async function Bab4Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
  if (!activeTa) redirect("/dashboard");

  const tabelDefinitions = await db.tabelDefinition.findMany({
    where: { kode: { in: tables.map(t => t.kode) } },
    include: {
      tabelLkps: {
        where: { tahunAkademikId: activeTa.id },
        include: { rows: true },
      },
    },
  });

  const lkpsMap = new Map(tabelDefinitions.map(d => [d.kode, d.tabelLkps[0]]));

  const totalData = Array.from(lkpsMap.values()).reduce((sum: number, lkps: any) => sum + (lkps?.rows?.length || 0), 0);
  const filledTables = tables.filter(t => (lkpsMap.get(t.kode) as any)?.rows?.length > 0).length;
  const progressPercent = tables.length > 0 ? Math.round((filledTables / tables.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-12">
      {/* HERO HEADER - Emerald/Teal Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-5 mb-6 shadow-xl animate-fade-in-up">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-2xs font-bold uppercase tracking-widest">BAB 4 • Akreditasi</span>
                <h1 className="text-white text-xl font-black tracking-tight">Pengadian Masyarakat</h1>
                <p className="text-white/60 text-xs font-medium">Ilmu untuk Kemaslahatan Umat</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="relative">
                <svg className="w-16 h-16 -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6" strokeDasharray={`${(progressPercent / 100) * 175} 175`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white text-lg font-black">{progressPercent}%</span>
                  <span className="text-white/60 text-2xs">Complete</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                  <Microscope className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">Sarana</div>
                  <div className="text-white text-sm font-bold">PKM</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">DTPR</div>
                  <div className="text-white text-sm font-bold">Hibah</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/30 flex items-center justify-center">
                  <Handshake className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">Kerja Sama</div>
                  <div className="text-white text-sm font-bold">Nasional</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                  <Speaker className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">Diseminasi</div>
                  <div className="text-white text-sm font-bold">Hasil</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/30 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">HKI</div>
                  <div className="text-white text-sm font-bold">Perolehan</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-white/70 text-xs font-medium">
            <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">{activeTa?.tahun} ({activeTa?.semester})</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">{activeTa?.prodi.nama}</span>
            <span className="px-2.5 py-1 bg-emerald-500/20 rounded-lg border border-emerald-400/20 text-emerald-200">{filledTables}/{tables.length} tabel terisi</span>
          </div>
        </div>
      </div>

      {/* TABLE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tables.map((table, index) => {
          const lkpsData = lkpsMap.get(table.kode);
          const rowCount = (lkpsData as any)?.rows?.length || 0;
          const hasData = rowCount > 0;
          const IconComponent = TABLE_ICONS[table.kode] || FileText;

          return (
            <Link
              key={table.kode}
              href={`/lkps/bab-4/tabel-${table.kode.replace(/\./g, "").toLowerCase()}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500 -z-10" />
              
              <div className="relative h-full rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 shadow-lg border border-slate-100 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-emerald-200/50">
                
                <div className="relative h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)",
                    backgroundSize: "12px 12px"
                  }} />
                  
                  <div className="absolute -bottom-3 right-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/25 backdrop-blur-sm rounded-lg text-white text-xs font-bold border border-white/30 shadow-sm">
                      Tabel {table.kode}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-800 leading-snug mb-3 group-hover:text-emerald-600 transition-colors">
                    {table.nama}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{table.desc}</p>

                  <div className={`rounded-xl p-4 transition-all ${hasData
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-slate-100 border-2 border-dashed border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-3xl font-black ${hasData ? 'text-white' : 'text-slate-300'}`}>{rowCount}</div>
                        <div className={`text-sm font-medium ${hasData ? 'text-emerald-100' : 'text-slate-400'}`}>Data Entry</div>
                      </div>
                      {hasData && (
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm font-semibold ${hasData ? 'text-emerald-600' : 'text-slate-500'} group-hover:underline`}>
                      {hasData ? 'Lihat & Edit Data' : 'Mulai Mengisi'}
                    </span>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${hasData
                      ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:translate-x-1'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:translate-x-1'}`}>
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
