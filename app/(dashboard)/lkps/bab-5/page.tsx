import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, ArrowRight, Settings, Building2, Eye, Target, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata = { title: "BAB 5 & 6 — Tata Kelola & Visi Misi" };

const TABLE_ICONS: Record<string, LucideIcon> = { "5.1": Settings, "5.2": Building2, "6.1": Eye, "6.2": Target };

const tables = [
  { kode: "5.1", nama: "Sistem Tata Kelola", desc: "Data sistem informasi tata kelola UPPS/PS.", bab: "BAB 5" },
  { kode: "5.2", nama: "Sarana dan Prasarana", desc: "Data inventaris sarana dan prasarana.", bab: "BAB 5" },
  { kode: "6.1", nama: "Visi Misi Tujuan", desc: "Data keselarasan visi, misi, dan tujuan.", bab: "BAB 6" },
  { kode: "6.2", nama: "Strategi Pencapaian", desc: "Data strategi pencapaian tujuan.", bab: "BAB 6" },
];

export default async function Bab5Page() {
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
  const filledTables = tables.filter(t => {
    const def = definitions.find(d => d.kode === t.kode);
    return def && (instanceMap.get(def.id)?._count?.rows ?? 0) > 0;
  }).length;
  const totalData = instances.reduce((s, i) => s + i._count.rows, 0);
  const progressPercent = tables.length ? Math.round((filledTables / tables.length) * 100) : 0;

  const bab5Tables = tables.filter(t => t.bab === "BAB 5");
  const bab6Tables = tables.filter(t => t.bab === "BAB 6");

  return (
    <div className="min-h-screen pb-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 p-5 mb-6 shadow-xl animate-fade-in-up">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-4 border-white/10 transform rotate-12" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full border-4 border-white/10 transform -rotate-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 transform hover:scale-105 transition-transform">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">BAB 5 & 6 • Akreditasi</span>
                <h1 className="text-white text-xl font-black tracking-tight">Tata Kelola & Visi Misi</h1>
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
            <MiniStat icon={Settings} label="Tata Kelola" sub={`${bab5Tables.length}`} />
            <MiniStat icon={Building2} label="Sarana" sub="-" />
            <MiniStat icon={Eye} label="Visi Misi" sub={`${bab6Tables.length}`} />
            <MiniStat icon={Target} label="Strategi" sub="-" />
            <MiniStat icon={FileText} label="Total" sub={`${totalData}`} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-white/80 text-xs font-medium">
            <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.tahun} ({activeTa.semester})</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg border border-white/20">{activeTa.prodi.nama}</span>
            <span className="px-2 py-1 bg-slate-500/30 rounded-lg border border-slate-400/30 text-slate-200">{filledTables}/{tables.length} tabel</span>
          </div>
        </div>
      </div>

      {/* BAB 5 Section */}
      <div className="mb-8 animate-fade-in-up stagger-1">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" /> BAB 5 — Tata Kelola
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bab5Tables.map((table, index) => (
            <TableCard key={table.kode} table={table} definitions={definitions} instanceMap={instanceMap} hrefBase="/lkps/bab-5" staggerIndex={index} section="BAB5" />
          ))}
        </div>
      </div>

      {/* BAB 6 Section */}
      <div className="animate-fade-in-up stagger-2">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" /> BAB 6 — Visi dan Misi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bab6Tables.map((table, index) => (
            <TableCard key={table.kode} table={table} definitions={definitions} instanceMap={instanceMap} hrefBase="/lkps/bab-6" staggerIndex={index + 2} section="BAB6" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Kartu tabel — struktur identik dengan kartu di BAB 1/2/3/4 (band gradient + ikon tile + blok data + CTA)
const SECTION_THEMES = {
  BAB5: {
    grad: "from-slate-500 via-slate-600 to-slate-700",
    hoverBorder: "group-hover:border-slate-300",
    hoverText: "group-hover:text-slate-700",
    statOn: "from-slate-500 to-slate-600",
    statSubOn: "text-slate-100",
    ctaOn: "text-slate-600",
    arrowOn: "bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white",
    arrowOff: "bg-slate-100 text-slate-400 group-hover:bg-slate-500 group-hover:text-white",
  },
  BAB6: {
    grad: "from-indigo-500 via-indigo-600 to-blue-600",
    hoverBorder: "group-hover:border-indigo-200",
    hoverText: "group-hover:text-indigo-600",
    statOn: "from-indigo-500 to-blue-600",
    statSubOn: "text-indigo-100",
    ctaOn: "text-indigo-600",
    arrowOn: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    arrowOff: "bg-slate-100 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white",
  },
} as const;

function TableCard({ table, definitions, instanceMap, hrefBase, staggerIndex, section }: {
  table: { kode: string; nama: string; desc: string };
  definitions: { id: string; kode: string }[];
  instanceMap: Map<string, { _count?: { rows: number } }>;
  hrefBase: string;
  staggerIndex: number;
  section: keyof typeof SECTION_THEMES;
}) {
  const def = definitions.find(d => d.kode === table.kode);
  const inst = def ? instanceMap.get(def.id) : null;
  const rowCount = inst?._count?.rows || 0;
  const hasData = rowCount > 0;
  const IconComponent = TABLE_ICONS[table.kode] || FileText;
  const staggerClass = `stagger-${Math.min(staggerIndex + 1, 8)}`;
  const t = SECTION_THEMES[section];

  return (
    <Link href={`${hrefBase}/tabel-${table.kode.replace(/\./g, "")}`} className={`group relative block animate-fade-in-up ${staggerClass}`}>
      <div className={`relative h-full rounded-2xl bg-white shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 ${t.hoverBorder}`}>
        <div className={`relative h-20 bg-gradient-to-br ${t.grad}`}>
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

          {hasData && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 rounded-full px-2.5 py-1 bg-emerald-500/90 text-white text-xs font-bold">
                <CheckCircle2 className="w-3 h-3" /> Terisi
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className={`text-base font-bold text-slate-800 leading-snug mb-2 ${t.hoverText} transition-colors`}>
            {table.nama}
          </h3>
          <p className="text-xs text-slate-400 mb-4">{table.desc}</p>

          <div className={`rounded-xl p-4 ${hasData
            ? `bg-gradient-to-br ${t.statOn} text-white`
            : 'bg-slate-100 border-2 border-dashed border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-black ${hasData ? 'text-white' : 'text-slate-300'}`}>{rowCount}</div>
                <div className={`text-sm font-medium ${hasData ? t.statSubOn : 'text-slate-400'}`}>Data Entry</div>
              </div>
              {hasData ? <CheckCircle2 className="w-6 h-6 text-white/80" /> : <IconComponent className="w-6 h-6 text-slate-300" />}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm font-semibold ${hasData ? t.ctaOn : 'text-slate-500'} group-hover:underline`}>
              {hasData ? 'Lihat & Edit Data' : 'Mulai Mengisi'}
            </span>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${hasData ? t.arrowOn : t.arrowOff}`}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniStat({ icon: Icon, label, sub }: { icon: LucideIcon; label: string; sub: string }) {
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
