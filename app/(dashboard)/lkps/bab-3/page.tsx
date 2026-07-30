import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  FileText, ArrowRight,
  FlaskConical, Users, BookMarked, Handshake, FileTextIcon, Award, CheckCircle2
} from "lucide-react";

export const metadata = { title: "BAB 3 — Penelitian" };

const TABLE_ICONS: Record<string, any> = {
  "3.A.1": FlaskConical, "3.A.2": Users, "3.A.3": BookMarked,
  "3.C.1": Handshake, "3.C.2": FileTextIcon, "3.C.3": Award,
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

  const [activeTa, definitions] = await Promise.all([
    db.tahunAkademik.findFirst({ where: { isActive: true }, include: { prodi: true } }),
    db.tabelDefinition.findMany({ where: { kode: { in: tables.map(t => t.kode) } } }),
  ]);

  if (!activeTa) redirect("/dashboard");

  const instances = await db.tabelLkps.findMany({
    where: { tahunAkademikId: activeTa.id, tabelDefinitionId: { in: definitions.map(d => d.id) } },
    include: { _count: { select: { rows: true } } },
  });

  const instanceMap = new Map(instances.map(i => [i.tabelDefinitionId, i]));
  const filledTables = tables.filter(t => (instanceMap.get(definitions.find(d => d.kode === t.kode)?.id || "") as any)?._count?.rows > 0).length;
  const totalData = instances.reduce((s, i) => s + i._count.rows, 0);
  const progressPercent = tables.length ? Math.round((filledTables / tables.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-600 p-5 mb-6 shadow-xl animate-fade-in-up">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-4 border-white/10 transform rotate-12" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full border-4 border-white/10 transform -rotate-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 transform hover:scale-105 transition-transform">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">BAB 3 • Akreditasi</span>
                <h1 className="text-white text-xl font-black tracking-tight">Penelitian</h1>
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

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <MiniStat icon={FlaskConical} label="Sarana" sub="Penelitian" />
            <MiniStat icon={Users} label="DTPR" sub="Hibah" />
            <MiniStat icon={BookMarked} label="Publikasi" sub="Jurnal" />
            <MiniStat icon={Award} label="HKI" sub="Granted" />
            <MiniStat icon={FileText} label="Total" sub={`${totalData} data`} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-white/80 text-xs font-medium">
            <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.tahun} ({activeTa.semester})</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.prodi.nama}</span>
            <span className="px-2 py-1 bg-teal-500/30 rounded-lg border border-teal-400/30 text-teal-200">{filledTables}/{tables.length} tabel</span>
          </div>
        </div>
      </div>

      {/* TABLE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tables.map((table, index) => {
          const def = definitions.find(d => d.kode === table.kode);
          const inst = def ? instanceMap.get(def.id) : null;
          const rowCount = inst?._count.rows || 0;
          const hasData = rowCount > 0;
          const IconComponent = TABLE_ICONS[table.kode] || FlaskConical;
          const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

          return (
            <Link key={table.kode} href={`/lkps/bab-3/tabel-${table.kode.replace(/\./g, "").toLowerCase()}`} className={`group relative block animate-fade-in-up ${staggerClass}`}>
              <div className="relative h-full rounded-2xl bg-white shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-teal-200">
                <div className="relative h-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />

                  <div className="absolute -bottom-3 right-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/25 border border-white/40 shadow-lg rotate-12 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/25 rounded-lg text-white text-xs font-bold border border-white/40">
                      Tabel {table.kode}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 group-hover:text-teal-600 transition-colors">
                    {table.nama}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">{table.desc}</p>

                  <div className={`rounded-xl p-4 ${hasData
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white'
                    : 'bg-slate-100 border-2 border-dashed border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-3xl font-black ${hasData ? 'text-white' : 'text-slate-300'}`}>{rowCount}</div>
                        <div className={`text-sm font-medium ${hasData ? 'text-teal-100' : 'text-slate-400'}`}>Data Entry</div>
                      </div>
                      {hasData ? <CheckCircle2 className="w-6 h-6 text-white/80" /> : <FlaskConical className="w-6 h-6 text-slate-300" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm font-semibold ${hasData ? 'text-teal-600' : 'text-slate-500'} group-hover:underline`}>
                      {hasData ? 'Lihat & Edit Data' : 'Mulai Mengisi'}
                    </span>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${hasData
                      ? 'bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-teal-500 group-hover:text-white'}`}>
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

function MiniStat({ icon: Icon, label, sub }: { icon: any; label: string; sub: string }) {
  return (
    <div className="bg-white/15 rounded-xl p-2.5 border border-white/20">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-white/60" />
        <div>
          <div className="text-white/60 text-3xs">{label}</div>
          <div className="text-white text-sm font-bold">{sub}</div>
        </div>
      </div>
    </div>
  );
}
