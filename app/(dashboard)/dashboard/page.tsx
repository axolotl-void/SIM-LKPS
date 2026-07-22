import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/utils/permissions";
import type { Metadata } from "next";
import { Role, TabelStatus } from "@prisma/client";
import { DashboardClient } from "./DashboardClient";

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
      take: 6,
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

  // Prepare data for client component
  const dashboardData = {
    user: {
      name: session.user.name || "User",
      email: session.user.email || "",
      role: ROLE_LABELS[role],
    },
    stats: {
      totalDefinitions,
      terisi,
      disetujui,
      diajukan,
      ditolak,
    },
    quickStats: {
      dosenCount,
      mahasiswaCount,
      userCount,
    },
    isAdmin: role === "ADMIN",
    recentLogs: recentLogs.map((log) => ({
      id: log.id,
      userName: log.user?.name || "System",
      action: log.action,
      entity: log.entity,
      createdAt: log.createdAt.toISOString(),
    })),
  };

  return <DashboardClient data={dashboardData} />;
}
