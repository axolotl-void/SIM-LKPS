"use client";

import { ChevronRight } from "lucide-react";

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

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  const result = parts
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return result || "U";
}

const AVATAR_COLORS: string[] = [
  "linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)",
  "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
  "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
  "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
  "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)",
];

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[index];
  if (color !== undefined) return color;
  const fallback = AVATAR_COLORS[0];
  return fallback !== undefined ? fallback : "linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)";
}

export function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 1px 4px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)",
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-[14px] font-semibold text-gray-900" style={{ letterSpacing: "-0.1px" }}>
          Aktivitas Terkini
        </h3>
        <a
          href="#"
          className="text-[12px] font-medium text-indigo-500 flex items-center gap-1 hover:text-indigo-600"
          style={{ transition: "color 150ms ease" }}
        >
          Lihat Semua
          <ChevronRight className="w-[14px] h-[14px]" />
        </a>
      </div>

      {/* Activity List */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{
          scrollbarWidth: "thin",
        }}
      >
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-2.5 py-2.5 border-b border-gray-100 last:border-b-0"
          >
            {/* Avatar - exact 30px */}
            <div
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
              style={{ background: getAvatarColor(activity.userName) }}
            >
              {getInitials(activity.userName)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-gray-600 leading-relaxed">
                <strong className="text-gray-900 font-semibold">{activity.userName}</strong>{" "}
                <span className="text-indigo-500 font-medium">{activity.action}</span>{" "}
                {activity.target}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 flex-shrink-0">
        <button
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[12px] font-medium text-indigo-600 hover:bg-indigo-100 hover:border-indigo-200"
          style={{ transition: "all 150ms ease" }}
        >
          Lihat Semua Aktivitas
          <ChevronRight className="w-[14px] h-[14px]" />
        </button>
      </div>
    </div>
  );
}
