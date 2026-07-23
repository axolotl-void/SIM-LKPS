"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardCheck,
  Upload,
  BarChart3,
  Bell,
  Settings,
  Database,
  Send,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "Master Data", href: "/master", icon: Database, roles: ["ADMIN"] },
  { label: "BAB 1 — Tata Pamong", href: "/lkps/bab-1", icon: FileText, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "BAB 2 — Pendidikan", href: "/lkps/bab-2", icon: GraduationCap, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "BAB 3 — Penelitian", href: "/lkps/bab-3", icon: BookOpen, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "BAB 4 — Pengabdian", href: "/lkps/bab-4", icon: Users, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "BAB 5 & 6", href: "/lkps/bab-5", icon: FileText, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "Bukti Pendukung", href: "/evidence", icon: Upload, roles: ["ADMIN", "OPERATOR", "VALIDATOR"] },
  { label: "Laporan", href: "/laporan", icon: BarChart3, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "Pengaturan", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const filteredItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-64 flex-col rounded-2xl border-none bg-white shadow-soft">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-soft-sm">
            <span className="font-black text-sm">SL</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-800">SIM-LKPS</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">UBBG</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar"
        aria-label="Main navigation"
      >
        <ul className="space-y-1.5" role="list">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    group flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-[13px] font-semibold
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    ${isActive
                      ? "bg-white text-slate-700 shadow-soft-sm"
                      : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-700"
                    }
                  `}
                >
                  {/* Icon Container */}
                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                      transition-colors duration-150
                      ${isActive
                        ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-soft-sm"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                      }
                    `}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  {/* Label */}
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100/80 p-4">
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
