"use client";

import { Topbar } from "./Topbar";
import { HeroBanner } from "./HeroBanner";
import { KPICards } from "./KPICards";
import { ProgressSection } from "./ProgressSection";
import { SummaryCard } from "./SummaryCard";
import { ActivityCard } from "./ActivityCard";

interface DashboardData {
  user: { name: string; email: string; role: string };
  stats: {
    totalDefinitions: number;
    terisi: number;
    disetujui: number;
    diajukan: number;
    ditolak: number;
  };
  quickStats: { dosenCount: number; mahasiswaCount: number; userCount: number };
  isAdmin: boolean;
  recentLogs: Array<{
    id: string;
    userName: string;
    action: string;
    entity: string;
    createdAt: string;
  }>;
}

function formatActivityTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const { user, stats, quickStats, recentLogs } = data;

  // Transform logs to activities
  const activities = recentLogs.slice(0, 5).map((log) => ({
    id: log.id,
    userName: log.userName,
    action: log.action.toLowerCase().includes("delete") ? "menghapus" : 
            log.action.toLowerCase().includes("upload") || log.action.toLowerCase().includes("create") ? "mengunggah" :
            log.action.toLowerCase().includes("update") ? "memperbarui" : "mengedit",
    target: log.entity,
    time: formatActivityTime(log.createdAt),
  }));

  // Progress items per BAB - matching exact source data
  const progressItems = [
    { bab: "BAB 1", title: "BAB 1 - Tata Pamong", filled: 4, total: 4, percentage: 100, color: "#6366F1", glowColor: "#818CF8" },
    { bab: "BAB 2", title: "BAB 2 - Pendidikan", filled: 5, total: 6, percentage: 83, color: "#3B82F6", glowColor: "#60A5FA" },
    { bab: "BAB 3", title: "BAB 3 - Penelitian", filled: 3, total: 5, percentage: 60, color: "#10B981", glowColor: "#34D399" },
    { bab: "BAB 4", title: "BAB 4 - Pengabdian", filled: 3, total: 4, percentage: 75, color: "#F59E0B", glowColor: "#FBBF24" },
    { bab: "BAB 5", title: "BAB 5 - Tata Kelola", filled: 4, total: 6, percentage: 66, color: "#EC4899", glowColor: "#F472B6" },
    { bab: "BAB 6", title: "BAB 6 - Visi Misi", filled: 3, total: 6, percentage: 50, color: "#8B5CF6", glowColor: "#A78BFA" },
  ];

  return (
    <div
      className="flex flex-col h-full p-4 gap-[14px]"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      {/* Topbar */}
      <Topbar user={user} />

      {/* Main Content */}
      <div className="flex-1 flex gap-[14px] min-h-0">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-[14px] min-h-0">
          {/* Hero Banner */}
          <HeroBanner
            userName={user.name}
            userRole={user.role}
            tablesFilled={stats.terisi}
            totalTables={stats.totalDefinitions}
            approved={stats.disetujui}
            mahasiswaCount={quickStats.mahasiswaCount}
            dosenCount={quickStats.dosenCount}
          />

          {/* KPI Cards */}
          <KPICards
            totalTables={stats.totalDefinitions}
            filledTables={stats.terisi}
            approved={stats.disetujui}
            pending={stats.diajukan}
          />

          {/* Progress Section */}
          <ProgressSection items={progressItems} />
        </div>

        {/* Right Column */}
        <div className="w-[340px] flex flex-col gap-[14px] min-h-0">
          {/* Summary Card */}
          <SummaryCard
            totalUsers={quickStats.userCount}
            dosenAktif={quickStats.dosenCount}
            mahasiswaAktif={quickStats.mahasiswaCount}
            penggunaAktif={quickStats.userCount - quickStats.dosenCount - quickStats.mahasiswaCount}
          />

          {/* Activity Card */}
          <ActivityCard activities={activities} />
        </div>
      </div>
    </div>
  );
}
