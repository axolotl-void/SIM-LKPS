import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/utils/permissions";
import type { Metadata } from "next";
import { Role, TabelStatus } from "@prisma/client";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  GraduationCap,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;

  // Parallel queries for dashboard stats
  const [
    totalDefinitions,
    tabelStats,
    dosenCount,
    mahasiswaCount,
    userCount,
    recentLogs,
  ] = await Promise.all([
    db.tabelDefinition.count(),
    db.tabelLkps.groupBy({
      by: ["status"],
      _count: true,
    }),
    db.dosen.count({ where: { isActive: true } }),
    db.mahasiswa.count({ where: { isActive: true } }),
    db.user.count({ where: { isActive: true } }),
    db.auditLog.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Calculate stats
  const statusMap = Object.fromEntries(
    tabelStats.map((s) => [s.status, s._count])
  );
  const terisi = tabelStats.reduce((sum, s) => sum + s._count, 0);
  const disetujui = statusMap[TabelStatus.DISETUJUI] || 0;
  const diajukan = statusMap[TabelStatus.DIAJUKAN] || 0;
  const ditolak = statusMap[TabelStatus.DITOLAK] || 0;

  // Stats cards config
  const statsCards = [
    {
      label: "Total Tabel LKPS",
      value: totalDefinitions,
      icon: FileText,
      bg: "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-soft-sm",
    },
    {
      label: "Sudah Diisi",
      value: terisi,
      icon: CheckCircle2,
      bg: "bg-gradient-to-tr from-emerald-400 to-green-600 text-white shadow-soft-sm",
    },
    {
      label: "Menunggu Validasi",
      value: diajukan,
      icon: Clock,
      bg: "bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-soft-sm",
    },
    {
      label: "Disetujui",
      value: disetujui,
      icon: CheckCircle2,
      bg: "bg-gradient-to-tr from-teal-400 to-cyan-500 text-white shadow-soft-sm",
    },
  ];

  // Quick stats for admin
  const quickStats = [
    { label: "Dosen Aktif", value: dosenCount, icon: Users },
    { label: "Mahasiswa Aktif", value: mahasiswaCount, icon: GraduationCap },
    { label: "Pengguna Aktif", value: userCount, icon: BookOpen },
  ];

  // Progress per BAB
  const babProgress = [
    { bab: "BAB 1 — Tata Pamong", total: 6, gradient: "from-blue-500 to-cyan-500" },
    { bab: "BAB 2 — Pendidikan", total: 11, gradient: "from-indigo-500 to-purple-500" },
    { bab: "BAB 3 — Penelitian", total: 6, gradient: "from-purple-500 to-pink-500" },
    { bab: "BAB 4 — Pengabdian", total: 5, gradient: "from-pink-500 to-rose-500" },
    { bab: "BAB 5 — Tata Kelola", total: 2, gradient: "from-orange-500 to-amber-500" },
    { bab: "BAB 6 — Visi dan Misi", total: 1, gradient: "from-teal-500 to-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl border-none bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-soft">
        <h1 className="text-xl font-bold tracking-tight">Selamat Datang kembali,</h1>
        <p className="mt-1 text-2xl font-black tracking-tight bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
          {session.user.name}!
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {ROLE_LABELS[role]} — SIM-LKPS Ilmu Komputer UBBG
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
            {terisi}/{totalDefinitions} tabel terisi
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
            {disetujui} disetujui
          </div>
          {ditolak > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-red-500/20 px-3 py-1.5 text-xs font-semibold">
              <AlertCircle className="h-3.5 w-3.5 text-red-300" />
              <span className="text-red-200">{ditolak} ditolak</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border-none bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-soft-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                  <p className="mt-1 text-2xl font-black text-slate-700">{card.value}</p>
                </div>
                <div className={`h-11 w-11 flex items-center justify-center rounded-xl ${card.bg}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress per BAB */}
        <div className="col-span-2 rounded-2xl border-none bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-base font-bold text-slate-800 tracking-tight">Progres Pengisian Data per BAB</h2>
          <div className="space-y-4">
            {babProgress.map((item) => {
              const percentage = 0; // Will be dynamic when data is filled
              return (
                <div key={item.bab}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">{item.bab}</span>
                    <span className="font-semibold text-slate-400">
                      0/{item.total} tabel ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100/80">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats + Recent Activity */}
        <div className="space-y-6">
          {/* Quick Stats */}
          {role === "ADMIN" && (
            <div className="rounded-2xl border-none bg-white p-6 shadow-soft">
              <h2 className="mb-4 text-base font-bold text-slate-800 tracking-tight">Ringkasan Data Kampus</h2>
              <div className="space-y-3.5">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        {stat.label}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-2xl border-none bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-base font-bold text-slate-800 tracking-tight">Aktivitas Terkini</h2>
            {recentLogs.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400">Belum ada aktivitas baru</p>
            ) : (
              <div className="space-y-3.5">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500 shadow-soft-sm" />
                    <div>
                      <span className="font-bold text-slate-700">
                        {log.user?.name || "System"}
                      </span>{" "}
                      <span className="text-slate-400 font-medium">
                        {log.action.toLowerCase()} {log.entity.toLowerCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
