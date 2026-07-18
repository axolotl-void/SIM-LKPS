import Link from "next/link";
import { ArrowRight, FlaskConical, Users, BookOpen, Award } from "lucide-react";

const tables = [
  // 3.A - Sarana dan Prasarana
  { code: "3A1", name: "Sarana dan Prasarana Penelitian", icon: FlaskConical, color: "from-emerald-500 to-teal-600", status: "inventory" },
  { code: "3A2", name: "Penelitian DTPR, Hibah dan Pembiayaan", icon: Users, color: "from-teal-500 to-cyan-600", status: "time-series" },
  { code: "3A3", name: "Pengembangan DTPR di Bidang Penelitian", icon: BookOpen, color: "from-cyan-500 to-blue-600", status: "time-series" },
  // 3.C - Publikasi & HKI
  { code: "3C1", name: "Kerjasama Penelitian", icon: Users, color: "from-blue-500 to-indigo-600", status: "time-series" },
  { code: "3C2", name: "Publikasi Penelitian", icon: BookOpen, color: "from-indigo-500 to-purple-600", status: "time-series" },
  { code: "3C3", name: "Perolehan HKI (Granted)", icon: Award, color: "from-purple-500 to-pink-600", status: "time-series" },
];

export default function Bab3Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <nav className="text-xs text-slate-500 mb-2">
          <span>LKPS</span> / <span className="text-slate-700 font-semibold">BAB 3</span>
        </nav>
        <h1 className="text-2xl font-black text-slate-800">BAB 3 — Relevansi Penelitian</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          6 tabel — Sarana prasarana, penelitian DTPR, publikasi, dan HKI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tables.map((table) => {
          const Icon = table.icon;
          return (
            <Link
              key={table.code}
              href={`/lkps/bab-3/tabel-${table.code.toLowerCase()}`}
              className="group rounded-2xl border border-slate-100/50 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${table.color} text-white shadow-soft-sm`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">{table.code}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-bold ${
                      table.status === "inventory"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {table.status === "inventory" ? "Inventory" : "TS"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {table.name}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-2xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                <span>Buka Tabel</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
