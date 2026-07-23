"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Clock, ChevronRight, Activity, TrendingUp } from "lucide-react";

// CSS-only animation styles
const styleId = "activity-card-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes activity-in {
      from { opacity: 0; transform: translateX(-12px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .activity-row { animation: activity-in 0.4s ease-out forwards; }
    .activity-hover-bg {
      background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    }
  `;
  document.head.appendChild(style);
}

interface ActivityItem {
  id: string;
  userName: string;
  action: string;
  target: string;
  time: string;
}

interface ActivityCardProps {
  activities: ActivityItem[];
}

const getInitials = (name: string): string => {
  if (!name) return "U";
  return name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
};

const AVATAR_GRADIENTS = [
  "from-slate-500 to-slate-600",
  "from-indigo-500 to-indigo-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
];

const getAvatarGradient = (name: string): string => AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];

// Memoized activity row
const ActivityRow = memo(function ActivityRow({ activity, index }: { activity: ActivityItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Single intersection observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.style.animationDelay = `${index * 60}ms`;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="group relative activity-row"
      style={{ opacity: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover background - CSS controlled */}
      <div
        className={`absolute inset-x-0 -inset-y-1 rounded-xl transition-all duration-200 ${isHovered ? "activity-hover-bg" : ""}`}
        style={{ transform: isHovered ? "scale(1.01)" : "scale(1)" }}
      />

      <div className="relative flex items-center gap-3 py-3 px-2">
        {/* Avatar */}
        <div
          className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(activity.userName)} flex items-center justify-center text-white text-sm font-semibold shadow-md transition-transform duration-200 ${isHovered ? "scale-105 shadow-lg" : ""}`}
          style={{ willChange: "transform" }}
        >
          {getInitials(activity.userName)}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800">{activity.userName}</span>
            <span className="text-sm text-slate-500">{activity.action}</span>
            <span className="text-sm font-medium text-indigo-600">{activity.target}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">{activity.time}</span>
          </div>
        </div>

        {/* Arrow - CSS transition */}
        <div
          className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center transition-all duration-200"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-4px)",
            willChange: "opacity, transform",
          }}
        >
          <ChevronRight className="w-4 h-4 text-indigo-500" />
        </div>
      </div>

      {/* Separator */}
      {index < 5 && (
        <div className="ml-[52px] h-px bg-gradient-to-r from-slate-100 via-slate-200 to-transparent" />
      )}
    </div>
  );
});

ActivityRow.displayName = "ActivityRow";

export function ActivityCard({ activities }: ActivityCardProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simple delay, no complex animation
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: "0 4px 24px -4px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(0, 0, 0, 0.04)",
        transition: "all 0.4s ease",
        opacity: loaded ? 1 : 0,
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600" />

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Aktivitas Terkini</h3>
            <p className="text-xs text-slate-400">Aktivitas terbaru sistem</p>
          </div>
        </div>

        {/* Stats badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full">
          <Activity className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-600">{activities.length}</span>
          <span className="text-xs text-slate-400">items</span>
        </div>
      </div>

      {/* Activity List */}
      <div className="px-4 pb-4">
        <div className="bg-slate-50/80 rounded-xl p-2">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">Belum ada aktivitas</p>
              <p className="text-xs text-slate-400 mt-1">Aktivitas akan muncul di sini</p>
            </div>
          ) : (
            <div>
              {activities.slice(0, 6).map((activity, index) => (
                <ActivityRow key={activity.id} activity={activity} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <button className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 p-[1.5px] shadow-lg shadow-indigo-500/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-500/30">
          <div className="relative flex items-center justify-center gap-2 bg-white rounded-[11px] px-4 py-2.5 group-hover:bg-slate-50 transition-colors duration-300">
            <span className="text-sm font-semibold text-indigo-600">Lihat Semua Aktivitas</span>
            <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </button>
      </div>
    </div>
  );
}
