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
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Sudah Diisi",
      value: terisi,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Menunggu Validasi",
      value: diajukan,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Disetujui",
      value: disetujui,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
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
    { bab: "BAB 1 — Tata Pamong", total: 6, color: "bg-blue-500" },
    { bab: "BAB 2 — Pendidikan", total: 11, color: "bg-indigo-500" },
    { bab: "BAB 3 — Penelitian", total: 6, color: "bg-purple-500" },
    { bab: "BAB 4 — Pengabdian", total: 5, color: "bg-pink-500" },
    { bab: "BAB 5 — Tata Kelola", total: 2, color: "bg-orange-500" },
    { bab: "BAB 6 — Visi dan Misi", total: 1, color: "bg-teal-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-xl border bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Selamat Datang, {session.user.name}!</h1>
        <p className="mt-1 text-blue-100">
          {ROLE_LABELS[role]} — SIM-LKPS Ilmu Komputer UBBG
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-lg bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
            {terisi}/{totalDefinitions} tabel terisi
          </div>
          <div className="rounded-lg bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
            {disetujui} disetujui
          </div>
          {ditolak > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-red-500/30 px-3 py-1 text-sm">
              <AlertCircle className="h-3 w-3" />
              {ditolak} ditolak
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`rounded-xl ${card.bg} p-3`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress per BAB */}
        <div className="col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Progres per BAB</h2>
          <div className="space-y-4">
            {babProgress.map((item) => {
              const percentage = 0; // Will be dynamic when data is filled
              return (
                <div key={item.bab}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.bab}</span>
                    <span className="text-gray-500">
                      0/{item.total} tabel ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
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
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Ringkasan Data</h2>
              <div className="space-y-3">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon className="h-4 w-4" />
                        {stat.label}
                      </div>
                      <span className="font-semibold text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Aktivitas Terkini</h2>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada aktivitas</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                    <div>
                      <span className="font-medium text-gray-900">
                        {log.user?.name || "System"}
                      </span>{" "}
                      <span className="text-gray-500">
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
