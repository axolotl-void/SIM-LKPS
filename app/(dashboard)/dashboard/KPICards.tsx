"use client";

import { useEffect, useState, useRef } from "react";
import { FileText, CheckCircle2, Clock, Shield, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardsProps {
  totalTables: number;
  filledTables: number;
  approved: number;
  pending: number;
}

interface KPICardProps {
  title: string;
  subtitle: string;
  value: number;
  progress: number;
  trend: "up" | "down";
  trendValue: string;
  icon: "document" | "check" | "clock" | "shield";
  accentColors: [string, string];
  progressColors: [string, string];
  bgIcon: [string, string];
  iconColor: string;
  delay: number;
}

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <div ref={ref}>{count}</div>;
}

function KPICard({
  title,
  subtitle,
  value,
  progress,
  trend,
  trendValue,
  icon,
  accentColors,
  progressColors,
  bgIcon,
  iconColor,
  delay,
}: KPICardProps) {
  const [visible, setVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setTimeout(() => {
            setVisible(true);
            setTimeout(() => setProgressWidth(progress), 300);
          }, delay * 100);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, progress]);

  const icons = {
    document: <FileText className="w-5 h-5" />,
    check: <CheckCircle2 className="w-5 h-5" />,
    clock: <Clock className="w-5 h-5" />,
    shield: <Shield className="w-5 h-5" />,
  };

  return (
    <div
      ref={ref}
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 1px 4px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "140px",
      }}
    >
      {/* Top accent line - exact 3px */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, ${accentColors[0]}, ${accentColors[1]})`,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3.5">
        {/* Icon - exact 40px */}
        <div
          className="w-[40px] h-[40px] rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${bgIcon[0]}, ${bgIcon[1]})`,
          }}
        >
          <span style={{ color: iconColor }}>{icons[icon]}</span>
        </div>

        {/* Trend */}
        <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trendValue}
        </div>
      </div>

      {/* Value - exact 30px */}
      <div className="text-[30px] font-bold text-gray-900 mb-1.5" style={{ letterSpacing: "-0.8px" }}>
        <AnimatedCounter target={value} />
      </div>

      {/* Label - exact uppercase */}
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{title}</div>
      <div className="text-[11px] text-gray-500">{subtitle}</div>

      {/* Progress - exact 5px height */}
      <div className="h-[5px] bg-gray-100 rounded-full mt-3.5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progressWidth}%`,
            background: `linear-gradient(90deg, ${progressColors[0]}, ${progressColors[1]})`,
            transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}

export function KPICards({ totalTables, filledTables, approved, pending }: KPICardsProps) {
  const filledPercentage = totalTables > 0 ? Math.round((filledTables / totalTables) * 100) : 0;

  const cards: KPICardProps[] = [
    {
      title: "Total Tabel LKPS",
      subtitle: `dari ${totalTables} tabel`,
      value: totalTables,
      progress: 100,
      trend: "up",
      trendValue: "100%",
      icon: "document",
      accentColors: ["#4F46E5", "#818CF8"],
      progressColors: ["#6366F1", "#818CF8"],
      bgIcon: ["#EEF0FF", "#E0E4FF"],
      iconColor: "#4F46E5",
      delay: 0,
    },
    {
      title: "Sudah Diisi",
      subtitle: `${filledPercentage}% dari total`,
      value: filledTables,
      progress: filledPercentage,
      trend: "up",
      trendValue: `+${filledTables}`,
      icon: "check",
      accentColors: ["#10B981", "#34D399"],
      progressColors: ["#10B981", "#34D399"],
      bgIcon: ["#ECFDF5", "#D1FAE5"],
      iconColor: "#10B981",
      delay: 1,
    },
    {
      title: "Menunggu Validasi",
      subtitle: `${Math.round((pending / totalTables) * 100) || 0}% dari total`,
      value: pending,
      progress: Math.round((pending / totalTables) * 100) || 0,
      trend: "down",
      trendValue: `-${pending}`,
      icon: "clock",
      accentColors: ["#F59E0B", "#FBBF24"],
      progressColors: ["#F59E0B", "#FBBF24"],
      bgIcon: ["#FFFBEB", "#FEF3C7"],
      iconColor: "#F59E0B",
      delay: 2,
    },
    {
      title: "Disetujui",
      subtitle: `${Math.round((approved / totalTables) * 100) || 0}% dari total`,
      value: approved,
      progress: Math.round((approved / totalTables) * 100) || 0,
      trend: "up",
      trendValue: `+${approved}`,
      icon: "shield",
      accentColors: ["#06B6D4", "#22D3EE"],
      progressColors: ["#06B6D4", "#22D3EE"],
      bgIcon: ["#ECFEFF", "#CFFAFE"],
      iconColor: "#06B6D4",
      delay: 3,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-[14px] flex-shrink-0">
      {cards.map((card, index) => (
        <KPICard key={index} {...card} />
      ))}
    </div>
  );
}
