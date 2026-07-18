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
} from "lucide-react";

interface SidebarProps {
  role: string;
}

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "Master Data", href: "/master", icon: Database, roles: ["ADMIN"] },
  {
    label: "BAB 1 — Tata Pamong",
    href: "/lkps/bab-1",
    icon: FileText,
    roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"],
  },
  {
    label: "BAB 2 — Pendidikan",
    href: "/lkps/bab-2",
    icon: GraduationCap,
    roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"],
  },
  {
    label: "BAB 3 — Penelitian",
    href: "/lkps/bab-3",
    icon: BookOpen,
    roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"],
  },
  {
    label: "BAB 4 — Pengabdian",
    href: "/lkps/bab-4",
    icon: Users,
    roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"],
  },
  {
    label: "BAB 5 & 6",
    href: "/lkps/bab-5",
    icon: FileText,
    roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"],
  },
  { label: "Bukti Pendukung", href: "/evidence", icon: Upload, roles: ["ADMIN", "OPERATOR", "VALIDATOR"] },
  { label: "Validasi", href: "/validasi", icon: ClipboardCheck, roles: ["ADMIN", "VALIDATOR"] },
  { label: "Laporan", href: "/laporan", icon: BarChart3, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "Notifikasi", href: "/notifikasi", icon: Bell, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"] },
  { label: "Pengaturan", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const filteredItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-64 flex-col rounded-2xl border-none bg-white shadow-soft">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-soft-sm">
            <span className="font-black text-sm">SL</span>
          </div>
          <span className="text-base font-bold tracking-tight text-slate-800">SIM-LKPS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1.5 px-4 py-3 custom-scrollbar">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white shadow-soft text-slate-700"
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-700"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-soft-sm"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
              </div>
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-50">
        <div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 p-4 text-white shadow-soft"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(37, 99, 235, 0.85) 0%, rgba(67, 56, 202, 0.85) 100%), url('/img/gedung-ubbg_11zon.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="text-2xs font-bold text-blue-100 uppercase tracking-wider">Program Studi</p>
          <p className="text-xs font-bold text-white mt-0.5">Ilmu Komputer UBBG</p>
          <p className="text-2xs text-blue-200 mt-2">Versi 0.1.0 (Soft UI)</p>
        </div>
      </div>
    </aside>
  );
}
