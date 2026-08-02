"use client";

import { HeroBanner } from "./HeroBanner";
import { KPICards } from "./KPICards";
import { ProgressSection } from "./ProgressSection";
import { SummaryCard } from "./SummaryCard";
import { ActivityCard } from "./ActivityCard";

interface ProgressItem {
  bab: string;
  title: string;
  filled: number;
  total: number;
  percentage: number;
  color: string;
  glowColor: string;
}

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
  progressItems: ProgressItem[];
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
  const { user, stats, quickStats, recentLogs, progressItems } = data;

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

  return (
    <div className="flex flex-col h-full p-4 gap-4" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Left Column - Takes full width on mobile, majority on desktop */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
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

          {/* KPI Cards - Responsive Grid */}
          <KPICards
            totalTables={stats.totalDefinitions}
            filledTables={stats.terisi}
            approved={stats.disetujui}
            pending={stats.diajukan}
          />

          {/* Progress Section */}
          <ProgressSection items={progressItems} />
        </div>

        {/* Right Column - Hidden on small screens, visible on lg and up */}
        <div className="hidden lg:flex w-80 xl:w-[340px] flex-shrink-0 flex-col gap-4 min-h-0">
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
