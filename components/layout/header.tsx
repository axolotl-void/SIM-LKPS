"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

const ROLE_DISPLAY: Record<string, string> = {
  ADMIN: "Administrator",
  OPERATOR: "Operator",
  VALIDATOR: "Validator",
  PIMPINAN: "Pimpinan",
};

const breadcrumbLabels: Record<string, string> = {
  "": "Dashboard",
  master: "Master Data",
  dosen: "Dosen",
  tendik: "Tenaga Kependidikan",
  mahasiswa: "Mahasiswa",
  "mata-kuliah": "Mata Kuliah",
  "tahun-akademik": "Tahun Akademik",
  users: "Pengguna",
  lkps: "Instrumen LKPS",
  "bab-1": "BAB 1",
  "bab-2": "BAB 2",
  "bab-3": "BAB 3",
  "bab-4": "BAB 4",
  "bab-5": "BAB 5 & 6",
  "bab-6": "BAB 6",
  evidence: "Bukti Pendukung",
  laporan: "Laporan",
  settings: "Pengaturan",
  validasi: "Validasi",
  submissions: "Pengajuan",
  developer: "Developer",
  prodi: "Program Studi",
  dashboard: "Dashboard",
};

const getBreadcrumbLabel = (segment: string): string =>
  breadcrumbLabels[segment.toLowerCase()] ||
  segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: getBreadcrumbLabel(segment),
    isLast: index === pathSegments.length - 1,
  }));

  const pageTitle =
    breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roleLabel = ROLE_DISPLAY[user.role || ""] || user.role || "";

  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white px-5 py-3 shadow-sm">
      {/* Left: breadcrumb + title */}
      <div className="min-w-0 flex-1">
        <nav className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="font-medium">Home</span>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span
                className={
                  crumb.isLast
                    ? "font-semibold text-slate-700"
                    : "font-medium"
                }
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
        <h1 className="mt-0.5 text-base font-bold tracking-tight text-slate-800">
          {pageTitle}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <NotificationBell />

        {/* Divider */}
        <div className="mx-1 h-8 w-px bg-slate-200" />

        {/* User pill */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-[11px] font-bold text-white shadow-sm">
            {getInitials(user?.name)}
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-semibold leading-tight text-slate-800">
              {user?.name || "User"}
            </span>
            <span className="text-[10px] font-medium leading-tight text-slate-400">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          title="Keluar"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}

export default Header;
