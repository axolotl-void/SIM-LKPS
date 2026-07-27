"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  FileText,
  GraduationCap,
  BookOpen,
  Users,
  Upload,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

// Grouped menu structure with LKPS table counts
const menuGroups: Array<{
  group: string;
  items: Array<{
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    roles: string[];
    badge: string | null;
    fullLabel?: string;
  }>;
}> = [
  {
    group: "UTAMA",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: null },
      { label: "Master Data", href: "/master", icon: Database, roles: ["ADMIN"], badge: null },
    ],
  },
  {
    group: "INSTRUMEN LKPS",
    items: [
      { label: "BAB 1", href: "/lkps/bab-1", icon: FileText, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "9 Tabel", fullLabel: "BAB 1 — Tata Pamong" },
      { label: "BAB 2", href: "/lkps/bab-2", icon: GraduationCap, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "6 Tabel", fullLabel: "BAB 2 — Pendidikan" },
      { label: "BAB 3", href: "/lkps/bab-3", icon: BookOpen, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "4 Tabel", fullLabel: "BAB 3 — Penelitian" },
      { label: "BAB 4", href: "/lkps/bab-4", icon: Users, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "3 Tabel", fullLabel: "BAB 4 — Pengabdian" },
      { label: "BAB 5 & 6", href: "/lkps/bab-5", icon: ClipboardList, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "2 Tabel", fullLabel: "BAB 5 & 6" },
    ],
  },
  {
    group: "FITUR & UTILITY",
    items: [
      { label: "Bukti Pendukung", href: "/evidence", icon: Upload, roles: ["ADMIN", "OPERATOR", "VALIDATOR"], badge: null },
      { label: "Laporan", href: "/laporan", icon: BarChart3, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: null },
      { label: "Pengaturan", href: "/settings", icon: Settings, roles: ["ADMIN"], badge: null },
    ],
  },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-60 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Logo Header */}
      <div className="flex h-16 items-center border-b border-slate-100 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm">
            <span className="text-xs font-bold text-white">SL</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">SIM-LKPS</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">UBBG</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar" aria-label="Main navigation">
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(role));

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.group} className="mb-4">
              {/* Section Label */}
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </p>

              {/* Menu Items */}
              <ul className="space-y-0.5" role="list">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;
                  const displayLabel = item.fullLabel || item.label;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`
                          group relative flex items-center justify-between rounded-lg px-3 py-2
                          text-[13px] font-medium
                          transition-all duration-150
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                          ${isActive
                            ? "bg-blue-50/80 text-blue-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                      >
                        {/* Active Left Border */}
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-blue-600" />
                        )}

                        {/* Icon & Label */}
                        <span className="flex items-center gap-3">
                          <Icon
                            className={`
                              h-4 w-4 shrink-0
                              transition-colors duration-150
                              ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
                            `}
                          />
                          <span className="truncate">{displayLabel}</span>
                        </span>

                        {/* Badge */}
                        {item.badge && (
                          <span
                            className={`
                              shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium
                              transition-colors duration-150
                              ${isActive
                                ? "border-blue-200/60 bg-blue-100/60 text-blue-600"
                                : "border-slate-200/60 bg-slate-100 text-slate-500"
                              }
                            `}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer Divider */}
      <div className="border-t border-slate-100" />

      {/* Footer - DO NOT MODIFY */}
      <div className="p-4">
        <div
          className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-soft"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(67, 56, 202, 0.9) 100%), url('/img/gedung-ubbg_11zon.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Program Studi</p>
          <p className="mt-0.5 text-sm font-bold text-white">Ilmu Komputer UBBG</p>
          <p className="mt-2 text-[11px] text-blue-200">Versi 0.1.0 (Soft UI)</p>
        </div>
      </div>
    </aside>
  );
}
