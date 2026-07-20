import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

// Table definitions
const tables = [
  { 
    kode: "3.A.1", 
    nama: "Sarana dan Prasarana Penelitian", 
    desc: "Data inventaris dan kelengkapan sarana penelitian.",
    badge: "Inventory",
    icon: "🧪"
  },
  { 
    kode: "3.A.2", 
    nama: "Penelitian DTPR, Hibah dan Pembiayaan", 
    desc: "Data penelitian, sumber pendanaan, dan pembiayaan.",
    badge: "TS",
    icon: "👥"
  },
  { 
    kode: "3.A.3", 
    nama: "Pengembangan DTPR di Bidang Penelitian", 
    desc: "Data pengembangan dan inovasi penelitian DTPR.",
    badge: "TS",
    icon: "📖"
  },
  { 
    kode: "3.C.1", 
    nama: "Kerjasama Penelitian", 
    desc: "Data kerjasama penelitian dengan institusi dalam dan luar negeri.",
    badge: "TS",
    icon: "🫂"
  },
  { 
    kode: "3.C.2", 
    nama: "Publikasi Penelitian", 
    desc: "Data publikasi pada jurnal, prosiding, dan media lainnya.",
    badge: "TS",
    icon: "📝"
  },
  { 
    kode: "3.C.3", 
    nama: "Perolehan HKI (Granted)", 
    desc: "Data hak kekayaan intelektual yang diperoleh.",
    badge: "TS",
    icon: "🥇"
  },
];

export const metadata: Metadata = {
  title: "BAB 3 — Penelitian | SIM-LKPS",
  description: "Data dan informasi terkait penelitian program studi",
};

export default async function Bab3Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get active tahun akademik
  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
  if (!activeTa) redirect("/dashboard");

  // Fetch LKPS data untuk semua tabel BAB 3
  const tabelDefinitions = await db.tabelDefinition.findMany({
    where: { kode: { in: tables.map(t => t.kode) } },
    include: {
      tabelLkps: {
        where: { tahunAkademikId: activeTa.id },
        include: { rows: true },
      },
    },
  });

  // Create a map untuk easy lookup
  const lkpsMap = new Map(
    tabelDefinitions.map(d => [d.kode, d.tabelLkps[0]])
  );

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="hero-gradient rounded-3xl mx-8 mt-6 p-10 flex justify-between items-center soft-shadow relative overflow-hidden">
        <div className="max-w-xl">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full mb-4">LKPS / BAB 3</div>
          <h1 className="text-3xl font-bold mb-2">BAB 3 — Relevansi Penelitian</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            6 tabel — Sarana prasarana, penelitian DTPR, publikasi, dan HKI
          </p>
        </div>
        {/* Hero Illustration */}
        <div className="mr-12">
          <img 
            alt="Chapter Icon" 
            className="w-48 h-auto drop-shadow-2xl" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgZxkmcmOU4Yzgz3wxzTeZNXsZTYt6cDUm_S0eyBQ-_5CwHnJndPMR8SjQlBTVB1580sM02G07FqunRJyo26a-jy6k79XRtxhkvSowFzcDKsQJ6hrtDt0nyCkzyT1PwllEX3JnUl_k0vxKVTu0sghRRWDJGoEniRa_5V2aOfspHtQho2dMTSxd4dwt5LIv1TxSdqIkAhRBfesgCtZh_aZuhpUptjbnwG5PnXyKf4YdD2KRRG0bje-OrXVkbpPweolIudG3t9y1nJ_n" 
          />
        </div>
      </section>

      {/* Table Cards Grid */}
      <section className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => {
            const lkpsData = lkpsMap.get(table.kode);
            const rowCount = lkpsData?.rows?.length || 0;
            const hasData = rowCount > 0;

            return (
              <Link
                key={table.kode}
                href={`/lkps/bab-3/tabel-${table.kode.replace(/\./g, "").toLowerCase()}`}
                className="bg-white rounded-3xl p-6 soft-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center text-xl">
                      {table.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400">{table.kode}</span>
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded uppercase">{table.badge}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{table.nama}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">{table.desc}</p>
                  
                  {/* Status indicator */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${hasData ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {hasData ? `${rowCount} data` : 'Kosong'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-blue-600 flex items-center group">
                    Buka Tabel <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <button className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer Summary */}
      <footer className="mx-8 bg-white rounded-3xl p-6 soft-shadow flex flex-wrap lg:flex-nowrap items-center gap-8">
        {/* Info */}
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">ℹ️</div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Tentang BAB 3</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bagian ini memuat data dan informasi terkait penelitian yang dilakukan oleh program studi, mulai dari sarana prasarana hingga perolehan HKI.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-12 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center text-lg">🗂️</div>
            <div>
              <p className="text-xl font-bold leading-none">6</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Jumlah Tabel</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-l pl-12 border-slate-100">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center text-lg">✓</div>
            <div>
              <p className="text-xl font-bold text-emerald-600 leading-none">
                {tables.filter(t => (lkpsMap.get(t.kode) as any)?.rows?.length > 0).length}
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Terisi</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-l pl-12 border-slate-100">
            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center text-lg">🕒</div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Terakhir Diperbarui</p>
              <p className="text-xs font-bold leading-tight">17 Juni 2025, 10:45</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
