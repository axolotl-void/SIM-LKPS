"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Shield, GraduationCap, FlaskConical, CircleCheck, Cog, Eye, ChevronRight, BookOpen, TrendingUp } from "lucide-react";

// CSS-only animation styles
const styleId = "progress-section-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes bab-card-in {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .bab-card { animation: bab-card-in 0.5s ease-out forwards; }
    .progress-fill {
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
}

interface ProgressItem {
  bab: string;
  title: string;
  filled: number;
  total: number;
  percentage: number;
  color: string;
}

interface ProgressSectionProps {
  items: ProgressItem[];
}

const BAB_ICONS = [Shield, GraduationCap, FlaskConical, CircleCheck, Cog, Eye];
const BAB_GRADIENTS = ["from-indigo-500 to-indigo-600", "from-emerald-500 to-emerald-600", "from-amber-500 to-amber-600", "from-rose-500 to-rose-600", "from-violet-500 to-violet-600", "from-cyan-500 to-cyan-600"];
const BAB_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#06B6D4"];

const getStatus = (percentage: number) => {
  if (percentage === 100) return { label: "Selesai", variant: "success" as const };
  if (percentage >= 70) return { label: "Dalam Progress", variant: "progress" as const };
  if (percentage >= 40) return { label: "Hampir Selesai", variant: "warning" as const };
  return { label: "Belum Dimulai", variant: "pending" as const };
};

const STATUS_CONFIG = {
  success: { bg: "bg-emerald-50", text: "text-emerald-600" },
  progress: { bg: "bg-indigo-50", text: "text-indigo-600" },
  warning: { bg: "bg-amber-50", text: "text-amber-600" },
  pending: { bg: "bg-slate-50", text: "text-slate-500" },
};

// Memoized progress bar
const AnimatedProgressBar = memo(function AnimatedProgressBar({ percentage, color, delay }: { percentage: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animatedRef.current = true;
          observer.disconnect();
          // Delayed animation start
          setTimeout(() => setWidth(percentage), delay * 150);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [percentage, delay]);

  return (
    <div ref={ref} className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full progress-fill"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}, ${color}CC)`,
          boxShadow: `0 0 10px ${color}50`,
        }}
      />
      {/* Shine */}
      <div
        className="absolute inset-y-0 left-0 w-8 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          transform: `translateX(${width}%)`,
          transition: `transform 1s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />
    </div>
  );
});

AnimatedProgressBar.displayName = "AnimatedProgressBar";

// Memoized BAB card
const BABCard = memo(function BABCard({ item, index }: { item: ProgressItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = BAB_ICONS[index % BAB_ICONS.length];
  const gradientClass = BAB_GRADIENTS[index % BAB_GRADIENTS.length];
  const color = BAB_COLORS[index % BAB_COLORS.length];
  const status = getStatus(item.percentage);
  const statusConfig = STATUS_CONFIG[status.variant];

  return (
    <div
      className="bab-card group relative"
      style={{ opacity: 0, animationDelay: `${index * 80}ms`, willChange: "transform, opacity" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative bg-white rounded-2xl p-5 overflow-hidden transition-all duration-300"
        style={{
          border: `1px solid ${isHovered ? `${color}30` : "rgba(0,0,0,0.06)"}`,
          boxShadow: isHovered
            ? `0 16px 32px -8px ${color}15, 0 4px 12px -4px ${color}10`
            : "0 2px 8px -2px rgba(0,0,0,0.04)",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          willChange: "transform",
        }}
      >
        {/* Glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />

        {/* Top accent */}
        <div
          className="absolute top-0 left-4 right-4 h-1 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}60)`, opacity: isHovered ? 1 : 0.6, transition: "opacity 0.3s" }}
        />

        {/* Content */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg transition-transform duration-300 ${isHovered ? "scale-110 rotate-3" : ""}`}
            style={{ willChange: "transform", boxShadow: isHovered ? `0 8px 20px -4px ${color}50` : `0 4px 12px -2px ${color}30` }}
          >
            <IconComponent className="w-6 h-6 text-white" />
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity" style={{ background: color, filter: "blur(8px)", transform: "scale(1.2)" }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                {status.label}
              </span>
            </div>
            <div className="mb-2">
              <AnimatedProgressBar percentage={item.percentage} color={color} delay={index + 1} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{item.filled}</span> dari {item.total} tabel
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color }}>{item.percentage}%</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-all duration-300 ${isHovered ? "translate-x-1 text-indigo-500" : ""}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BABCard.displayName = "BABCard";

export function ProgressSection({ items }: ProgressSectionProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const totalTables = items.reduce((sum, item) => sum + item.total, 0);
  const totalFilled = items.reduce((sum, item) => sum + item.filled, 0);
  const overallProgress = totalTables > 0 ? Math.round((totalFilled / totalTables) * 100) : 0;

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: "0 4px 24px -4px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(0, 0, 0, 0.04)",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Progres Pengisian Data per BAB</h3>
              <p className="text-xs text-slate-400">Pantau progres pengisian tabel LKPS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-500">Total Progress</p>
              <p className="text-lg font-bold text-indigo-600">{overallProgress}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <AnimatedProgressBar percentage={overallProgress} color="#6366F1" delay={0} />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <BABCard key={item.bab} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4">
        <button className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 p-[1.5px] transition-all duration-300 hover:shadow-md hover:from-indigo-50 hover:to-indigo-50">
          <div className="relative flex items-center justify-center gap-2 bg-white rounded-[11px] px-4 py-2.5 group-hover:bg-gradient-to-r group-hover:from-indigo-50 group-hover:to-white transition-colors duration-300">
            <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">Lihat Semua</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </button>
      </div>
    </div>
  );
}
