"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, Settings, Bell, Search } from "lucide-react";
import { getInitials } from "@/lib/utils/format";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  
  // Basic breadcrumb translation
  const pathSegments = pathname.split("/").filter(Boolean);
  const activePage = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1]?.replace(/-/g, " ") 
    : "default";

  return (
    <header className="flex w-full items-center justify-between bg-transparent px-4 py-3 border-none">
      {/* Breadcrumbs & Active Page */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-2xs text-slate-400 font-semibold tracking-wide uppercase">
          <span>Halaman</span>
          {pathSegments.map((segment, index) => (
            <span key={segment} className="flex items-center gap-1.5">
              <span>/</span>
              <span className={index === pathSegments.length - 1 ? "text-slate-600 font-bold" : ""}>
                {segment.replace(/-/g, " ")}
              </span>
            </span>
          ))}
        </div>
        <h1 className="text-base font-bold text-slate-800 mt-0.5 capitalize">
          {activePage === "dashboard" || pathSegments.length === 0 ? "Dashboard Utama" : activePage}
        </h1>
      </div>

      {/* Right Side: Search & User Info */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-3.5 w-3.5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Cari sesuatu..."
            className="w-48 rounded-xl border border-slate-200 bg-white/80 py-1.5 pl-9 pr-4 text-xs shadow-soft-inset backdrop-blur-sm transition-all focus:w-56 focus:border-slate-300 focus:bg-white focus:outline-none"
          />
        </div>

        {/* User Details & Actions */}
        <div className="flex items-center gap-2">
          {/* Settings & Notifications Icon */}
          <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-soft-sm transition-all duration-200">
            <Bell className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-soft-sm transition-all duration-200">
            <Settings className="h-4 w-4" />
          </button>

          {/* User Card */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/60">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-soft-sm">
              {user.name ? getInitials(user.name) : "U"}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-700">{user.name}</p>
              <p className="text-3xs text-slate-400 font-semibold">{user.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-2 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:shadow-soft-sm transition-all duration-200"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
