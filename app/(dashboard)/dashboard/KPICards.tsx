"use client";

import { Clock, Sparkles, Target, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface KPICardsProps {
  totalTables: number;
  filledTables: number;
  approved: number;
  pending: number;
}

// Animated counter with smooth fade-in
function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <span>{displayValue}</span>;
}

// Progress ring - animated on mount
function ProgressRing({ progress, color, size = 48 }: {
  progress: number;
  color: string;
  size?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashOffset = animated ? circumference - (progress / 100) * circumference : circumference;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
    </svg>
  );
}

// Single KPI card with consistent height
function KPICard({
  title, subtitle, value, percentage, trend, icon: Icon,
  gradient, ringColor, delay = 0,
}: {
  title: string;
  subtitle: string;
  value: number;
  percentage: number;
  trend: "up" | "down";
  icon: React.ElementType;
  gradient: [string, string];
  ringColor: string;
  delay?: number;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col"
      style={{
        background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.15)",
        minHeight: 160,
        animation: `fadeInUp 0.5s ease-out ${delay}ms both`,
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-white/90">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{title}</div>
            <div className="text-[11px] text-white/70 mt-0.5">{subtitle}</div>
          </div>
        </div>

        <div className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-bold ${trend === "up" ? "bg-emerald-500/30 text-emerald-200" : "bg-red-500/30 text-red-200"}`}>
          {trend === "up" ? "↑" : "↓"}
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)", letterSpacing: "-2px" }}>
            <AnimatedNumber value={value} delay={delay + 200} />
          </span>
          <span className="text-lg font-bold text-white/60">/ 31</span>
        </div>

        <div className="relative" style={{ width: 56, height: 56 }}>
          <ProgressRing progress={percentage} color={ringColor} size={56} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 rounded-b-2xl" />
    </div>
  );
}

export function KPICards({ totalTables, filledTables, approved, pending }: KPICardsProps) {
  const filledPercentage = totalTables > 0 ? Math.round((filledTables / totalTables) * 100) : 0;
  const pendingPercentage = totalTables > 0 ? Math.round((pending / totalTables) * 100) : 0;
  const approvedPercentage = totalTables > 0 ? Math.round((approved / totalTables) * 100) : 0;

  const cards = [
    { title: "Total Tabel LKPS", subtitle: `${totalTables} tabel`, value: totalTables, percentage: 100, trend: "up" as const, icon: Target, gradient: ["#6366F1", "#8B5CF6"] as [string, string], ringColor: "#A78BFA", delay: 0 },
    { title: "Sudah Diisi", subtitle: `${filledPercentage}% dari total`, value: filledTables, percentage: filledPercentage, trend: "up" as const, icon: Sparkles, gradient: ["#10B981", "#059669"] as [string, string], ringColor: "#34D399", delay: 100 },
    { title: "Menunggu Validasi", subtitle: `${pendingPercentage}% dari total`, value: pending, percentage: pendingPercentage, trend: pending > 0 ? "down" as const : "up" as const, icon: Clock, gradient: ["#F59E0B", "#D97706"] as [string, string], ringColor: "#FCD34D", delay: 200 },
    { title: "Disetujui", subtitle: `${approvedPercentage}% dari total`, value: approved, percentage: approvedPercentage, trend: "up" as const, icon: Award, gradient: ["#06B6D4", "#0891B2"] as [string, string], ringColor: "#22D3EE", delay: 300 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}
