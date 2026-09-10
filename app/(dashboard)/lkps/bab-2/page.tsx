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

const TABLE_ICONS: Record<string, LucideIcon> = {
  "2.A.1": Users, "2.A.2": Map, "2.A.3": BarChart3,
  "2.B.1": BookOpen, "2.B.2": GraduationCap, "2.B.3": FileText,
  "2.B.4": Clock, "2.B.5": Briefcase, "2.B.6": Star,
  "2.C": Shuffle, "2.D": Award,
};

const TABLE_DESCS: Record<string, string> = {
  "2.A.1": "Data jumlah dan profil mahasiswa program studi.",
  "2.A.2": "Data keragaman asal daerah dan sekolah mahasiswa.",
  "2.A.3": "Data kondisi jumlah mahasiswa per angkatan.",
  "2.B.1": "Data isi pembelajaran dan bahan kajian kurikulum.",
  "2.B.2": "Data pemetaan CPL terhadap profil lulusan.",
  "2.B.3": "Data pemenuhan CPL pada mata kuliah.",
  "2.B.4": "Data rata-rata masa tunggu lulusan mendapatkan pekerjaan.",
  "2.B.5": "Data kesesuaian bidang kerja lulusan dengan keilmuan.",
  "2.B.6": "Data tingkat kepuasan pengguna lulusan.",
  "2.C": "Data fleksibilitas proses pembelajaran di program studi.",
  "2.D": "Data rekognisi dan apresiasi kompetensi lulusan.",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {definitions.map((def, index) => {
          const inst = instanceMap[def.id];
          const rowCount = inst?._count.rows || 0;
          const hasData = rowCount > 0;
          const IconComponent = TABLE_ICONS[def.kode] || FileText;
          const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

          return (
            <Link key={def.id} href={`/lkps/bab-2/tabel-${def.kode.toLowerCase().replace(/\./g, "")}`} className={`group relative block animate-fade-in-up ${staggerClass}`}>
              <div className="relative h-full rounded-2xl bg-white shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-cyan-200">
                <div className="relative h-20 bg-gradient-to-br from-cyan-500 via-teal-500 to-sky-500">
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
                      <span className="flex items-center gap-1 rounded-full px-2.5 py-1 bg-emerald-500/90 text-white text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Terisi
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 group-hover:text-cyan-600 transition-colors">
                    {def.nama}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">{TABLE_DESCS[def.kode] ?? ""}</p>

                  <div className={`rounded-xl p-4 ${hasData
                    ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white'
                    : 'bg-slate-100 border-2 border-dashed border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-3xl font-black ${hasData ? 'text-white' : 'text-slate-300'}`}>{rowCount}</div>
                        <div className={`text-sm font-medium ${hasData ? 'text-cyan-100' : 'text-slate-400'}`}>Data Entry</div>
                      </div>
                      {hasData ? <CheckCircle2 className="w-6 h-6 text-white/80" /> : <IconComponent className="w-6 h-6 text-slate-300" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm font-semibold ${hasData ? 'text-cyan-600' : 'text-slate-500'} group-hover:underline`}>
                      {hasData ? 'Lihat & Edit Data' : 'Mulai Mengisi'}
                    </span>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${hasData
                      ? 'bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-cyan-500 group-hover:text-white'}`}>
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
