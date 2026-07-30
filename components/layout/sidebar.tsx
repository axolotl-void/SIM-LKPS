"use client";

import { useState, useCallback, memo, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronDown,
  ChevronRight,
  Circle,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge: string | null;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

interface SidebarProps {
  role: string;
}

const menuGroups: MenuGroup[] = [
  {
    group: "Utama",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: null },
      { label: "Master Data", href: "/master", icon: Database, roles: ["ADMIN"], badge: null },
    ],
  },
  {
    group: "Instrumen LKPS",
    items: [
      { label: "BAB 1", href: "/lkps/bab-1", icon: FileText, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "9" },
      { label: "BAB 2", href: "/lkps/bab-2", icon: GraduationCap, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "6" },
      { label: "BAB 3", href: "/lkps/bab-3", icon: BookOpen, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "4" },
      { label: "BAB 4", href: "/lkps/bab-4", icon: Users, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "3" },
      { label: "BAB 5 & 6", href: "/lkps/bab-5", icon: ClipboardList, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: "2" },
    ],
  },
  {
    group: "Fitur & Utility",
    items: [
      { label: "Bukti Pendukung", href: "/evidence", icon: Upload, roles: ["ADMIN", "OPERATOR", "VALIDATOR"], badge: null },
      { label: "Laporan", href: "/laporan", icon: BarChart3, roles: ["ADMIN", "OPERATOR", "VALIDATOR", "PIMPINAN"], badge: null },
      { label: "Pengaturan", href: "/settings", icon: Settings, roles: ["ADMIN"], badge: null },
    ],
  },
];

// Memoized menu item to prevent unnecessary re-renders
const MenuItemComponent = memo(function MenuItemComponent({
  item,
  isActive,
  isPending,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  isPending: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <li>
      <button
        onClick={onClick}
        disabled={isPending}
        className={`
          group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium
          transition-all duration-200 cursor-pointer
          ${isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          }
          ${isPending && isActive ? "opacity-70" : ""}
        `}
      >
        {isActive ? (
          <Circle className="h-1.5 w-1.5 fill-white text-white" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400" />
        )}
        <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white/90" : "text-slate-400 group-hover:text-slate-600"}`} />
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
            {item.badge}
          </span>
        )}
        {isPending && isActive && (
          <span className="shrink-0 h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        )}
      </button>
    </li>
  );
});

// Memoized group toggle button
const GroupToggle = memo(function GroupToggle({
  label,
  isCollapsed,
  onClick,
}: {
  label: string;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors duration-150"
    >
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${isCollapsed ? 'bg-slate-300' : 'bg-blue-500'}`} />
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
      {isCollapsed ? (
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform duration-200" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200" />
      )}
    </button>
  );
});

export const Sidebar = memo(function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = useCallback((group: string) => {
    setCollapsed((prev) => ({ ...prev, [group]: !prev[group] }));
  }, []);

  const handleNavigation = useCallback((href: string) => {
    startTransition(() => {
      router.push(href);
    });
  }, [router]);

  // Prefetch links on hover for instant navigation
  const handlePrefetch = useCallback((href: string) => {
    router.prefetch(href);
  }, [router]);
  void handlePrefetch;

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-64 flex-col rounded-2xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/40 overflow-hidden">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-100/80 px-5 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-600/25">
            <span className="text-sm font-bold text-white">SL</span>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 tracking-tight">SIM-LKPS</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">UBBG</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {menuGroups.map((group) => {
          const visible = group.items.filter((i) => i.roles.includes(role));
          if (!visible.length) return null;
          const isCollapsed = collapsed[group.group] ?? false;

          return (
            <div key={group.group} className="mb-2">
              <GroupToggle
                label={group.group}
                isCollapsed={isCollapsed}
                onClick={() => toggle(group.group)}
              />

              {!isCollapsed && (
                <ul className="mt-1 space-y-0.5 pl-1">
                  {visible.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href + "/"));

                    return (
                      <MenuItemComponent
                        key={item.href}
                        item={item}
                        isActive={isActive}
                        isPending={isPending}
                        onClick={() => handleNavigation(item.href)}
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="p-4">
        <div
          className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-lg shadow-blue-600/25"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(67, 56, 202, 0.95) 100%), url('/img/gedung-ubbg_11zon.png')",
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
});
