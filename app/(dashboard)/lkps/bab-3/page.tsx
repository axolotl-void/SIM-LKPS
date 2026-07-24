import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, ArrowRight, Calendar, 
  FlaskConical, Users, BookMarked, Handshake, FileTextIcon, Award, CheckCircle2, Clock
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BAB 3 — Penelitian",
};

const TABLE_ICONS: Record<string, any> = {
  "3.A.1": FlaskConical,
  "3.A.2": Users,
  "3.A.3": BookMarked,
  "3.C.1": Handshake,
  "3.C.2": FileTextIcon,
  "3.C.3": Award,
};

const tables = [
  { kode: "3.A.1", nama: "Sarana dan Prasarana Penelitian", desc: "Data inventaris dan kelengkapan sarana penelitian." },
  { kode: "3.A.2", nama: "Penelitian DTPR, Hibah dan Pembiayaan", desc: "Data penelitian, sumber pendanaan, dan pembiayaan." },
  { kode: "3.A.3", nama: "Pengembangan DTPR di Bidang Penelitian", desc: "Data pengembangan dan inovasi penelitian DTPR." },
  { kode: "3.C.1", nama: "Kerjasama Penelitian", desc: "Data kerjasama penelitian dengan institusi dalam dan luar negeri." },
  { kode: "3.C.2", nama: "Publikasi Penelitian", desc: "Data publikasi pada jurnal, prosiding, dan media lainnya." },
  { kode: "3.C.3", nama: "Perolehan HKI (Granted)", desc: "Data hak kekayaan intelektual yang diperoleh." },
];

export default async function Bab3Page() {
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

  const filledTables = tables.filter(t => (lkpsMap.get(t.kode) as any)?.rows?.length > 0).length;
  const totalData = Array.from(lkpsMap.values()).reduce((sum: number, lkps: any) => sum + (lkps?.rows?.length || 0), 0);
  const progressPercent = tables.length > 0 ? Math.round((filledTables / tables.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-12">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-5 mb-6 shadow-xl animate-fade-in-up">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-2xs font-bold uppercase tracking-widest">BAB 3 • Akreditasi</span>
                <h1 className="text-white text-xl font-black tracking-tight">Penelitian</h1>
                <p className="text-white/60 text-xs font-medium">Inovasi dan Pengetahuan</p>
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
                <div className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">Sarana</div>
                  <div className="text-white text-sm font-bold">Penelitian</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">DTPR</div>
                  <div className="text-white text-sm font-bold">Hibah</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/30 flex items-center justify-center">
                  <BookMarked className="w-4 h-4 text-fuchsia-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">Publikasi</div>
                  <div className="text-white text-sm font-bold">Jurnal</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center">
                  <Award className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">HKI</div>
                  <div className="text-white text-sm font-bold">Granted</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <div className="text-white/60 text-3xs">Total</div>
                  <div className="text-white text-sm font-bold">{totalData}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-white/70 text-xs font-medium">
            <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">{activeTa?.tahun} ({activeTa?.semester})</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">{activeTa?.prodi.nama}</span>
            <span className="px-2.5 py-1 bg-violet-500/20 rounded-lg border border-violet-400/20 text-violet-200">{filledTables}/{tables.length} tabel terisi</span>
          </div>
        </div>
      </div>

      {/* TABLE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tables.map((table, index) => {
          const lkpsData = lkpsMap.get(table.kode);
          const rowCount = (lkpsData as any)?.rows?.length || 0;
          const hasData = rowCount > 0;
          const IconComponent = TABLE_ICONS[table.kode] || FlaskConical;

          return (
            <Link
              key={table.kode}
              href={`/lkps/bab-3/tabel-${table.kode.replace(/\./g, "").toLowerCase()}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500 -z-10" />
              
              <div className="relative h-full rounded-2xl bg-gradient-to-br from-white to-violet-50/30 shadow-lg border border-slate-100 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-violet-200/50">
                
                <div className="relative h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 overflow-hidden">
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
                  <h3 className="text-base font-bold text-slate-800 leading-snug mb-3 group-hover:text-violet-600 transition-colors">
                    {table.nama}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{table.desc}</p>

                  <div className={`rounded-xl p-4 transition-all ${hasData
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-100 border-2 border-dashed border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-3xl font-black ${hasData ? 'text-white' : 'text-slate-300'}`}>{rowCount}</div>
                        <div className={`text-sm font-medium ${hasData ? 'text-violet-100' : 'text-slate-400'}`}>Data Entry</div>
                      </div>
                      {hasData && (
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm font-semibold ${hasData ? 'text-violet-600' : 'text-slate-500'} group-hover:underline`}>
                      {hasData ? 'Lihat & Edit Data' : 'Mulai Mengisi'}
                    </span>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${hasData
                      ? 'bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white group-hover:translate-x-1'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-violet-500 group-hover:text-white group-hover:translate-x-1'}`}>
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
