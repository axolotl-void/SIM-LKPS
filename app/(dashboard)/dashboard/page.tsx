import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/utils/permissions";
import type { Metadata } from "next";
import { TabelStatus } from "@prisma/client";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userRole = (session.user as { role: string }).role;

  const totalDefinitions = await db.tabelDefinition.count();
  const tabelStats = await db.tabelLkps.groupBy({ by: ["status"], _count: true });
  const dosenCount = await db.dosen.count({ where: { isActive: true } });
  const mahasiswaCount = await db.mahasiswa.count({ where: { isActive: true } });
  const userCount = await db.user.count({ where: { isActive: true } });
  const recentLogs = await db.auditLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const activeTa = await db.tahunAkademik.findFirst({ where: { isActive: true } });
  let babStats: { bab: number; filled: number; total: number }[] = [];

  if (activeTa) {
    // Get all definitions grouped by BAB
    const definitions = await db.tabelDefinition.findMany({
      select: { id: true, bab: true, kode: true },
      orderBy: [{ bab: "asc" }, { urutan: "asc" }],
    });

    // Get all TabelLkps instances for active year with row counts
    const instances = await db.tabelLkps.findMany({
      where: { tahunAkademikId: activeTa.id },
      select: {
        tabelDefinitionId: true,
        _count: { select: { rows: true } },
      },
    });

    // Create map: definitionId -> hasRows
    const instanceMap = new Map<string, boolean>();
    for (const inst of instances) {
      instanceMap.set(inst.tabelDefinitionId, inst._count.rows > 0);
    }

    // Count filled vs total per BAB
    const babMap = new Map<number, { filled: number; total: number }>();
    for (const def of definitions) {
      const existing = babMap.get(def.bab) || { filled: 0, total: 0 };
      existing.total = existing.total + 1;
      // Table is "filled" if it has at least 1 row
      if (instanceMap.get(def.id)) {
        existing.filled = existing.filled + 1;
      }
      babMap.set(def.bab, existing);
    }

    babStats = Array.from(babMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map((entry) => ({
        bab: entry[0],
        filled: entry[1].filled,
        total: entry[1].total,
      }));
  }

  const statusMap: Record<string, number> = {};
  for (const s of tabelStats) statusMap[s.status] = s._count;
  const terisi = tabelStats.reduce((sum, s) => sum + s._count, 0);
  const disetujui = statusMap[TabelStatus.DISETUJUI] || 0;
  const diajukan = statusMap[TabelStatus.DIAJUKAN] || 0;
  const ditolak = statusMap[TabelStatus.DITOLAK] || 0;

  const babNames: Record<number, { title: string; color: string; glowColor: string }> = {
    1: { title: "BAB 1 - Tata Pamong", color: "#6366F1", glowColor: "#818CF8" },
    2: { title: "BAB 2 - Pendidikan", color: "#3B82F6", glowColor: "#60A5FA" },
    3: { title: "BAB 3 - Penelitian", color: "#10B981", glowColor: "#34D399" },
    4: { title: "BAB 4 - Pengabdian", color: "#F59E0B", glowColor: "#FBBF24" },
    5: { title: "BAB 5 - Tata Kelola", color: "#EC4899", glowColor: "#F472B6" },
    6: { title: "BAB 6 - Visi Misi", color: "#8B5CF6", glowColor: "#A78BFA" },
  };

  const progressItems = babStats.map((stat) => {
    const percentage = stat.total > 0 ? Math.round((stat.filled / stat.total) * 100) : 0;
    const info = babNames[stat.bab] || { title: "BAB " + stat.bab, color: "#6366F1", glowColor: "#818CF8" };
    return {
      bab: "BAB " + stat.bab,
      title: info.title,
      filled: stat.filled,
      total: stat.total,
      percentage,
      color: info.color,
      glowColor: info.glowColor,
    };
  });

  const dashboardData = {
    user: { name: session.user.name || "User", email: session.user.email || "", role: ROLE_LABELS[userRole as keyof typeof ROLE_LABELS] },
    stats: { totalDefinitions, terisi, disetujui, diajukan, ditolak },
    quickStats: { dosenCount, mahasiswaCount, userCount },
    isAdmin: userRole === "ADMIN",
    recentLogs: recentLogs.map((log) => ({
      id: log.id,
      userName: log.user?.name || "System",
      action: log.action,
      entity: log.entity,
      createdAt: log.createdAt.toISOString(),
    })),
    progressItems,
  };

  return <DashboardClient data={dashboardData} />;
}
