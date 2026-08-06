"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Inbox, Info, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notification";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

const TYPE_ICON = {
  INFO: { Icon: Info, tone: "text-sky-600 bg-sky-50" },
  SUCCESS: { Icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
  WARNING: { Icon: AlertTriangle, tone: "text-amber-600 bg-amber-50" },
  ERROR: { Icon: AlertCircle, tone: "text-rose-600 bg-rose-50" },
} as const;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  if (h < 24) return `${h} jam lalu`;
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications ?? []);
      setUnread(data.unreadCount ?? 0);
    } catch (err) {
      console.error("[NotificationBell] fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleItemClick = async (n: Notification) => {
    if (!n.isRead) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      setUnread((c) => Math.max(0, c - 1));
      await markNotificationAsRead(n.id);
    }
    if (n.link) {
      setOpen(false);
      router.push(n.link);
    }
  };

  const handleMarkAll = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
    setUnread(0);
    await markAllNotificationsAsRead();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        title="Notifikasi"
        aria-label="Notifikasi"
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Daftar notifikasi"
          className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:w-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Notifikasi</h3>
              <p className="text-[11px] text-slate-400">
                {unread > 0 ? `${unread} belum dibaca` : "Semua sudah dibaca"}
              </p>
            </div>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-blue-600 transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Tandai semua
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-xs text-slate-400">
                Memuat...
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                  <Inbox className="h-5 w-5 text-slate-400" strokeWidth={1.75} />
                </div>
                <p className="text-xs font-semibold text-slate-700">Belum ada notifikasi</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Pemberitahuan sistem akan muncul di sini
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((n) => {
                  const { Icon, tone } = TYPE_ICON[n.type] ?? TYPE_ICON.INFO;
                  return (
                    <li key={n.id}>
                      <button
                        onClick={() => handleItemClick(n)}
                        className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 ${
                          n.isRead ? "" : "bg-blue-50/40"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-xs ${
                                n.isRead
                                  ? "font-medium text-slate-700"
                                  : "font-bold text-slate-900"
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                            {n.message}
                          </p>
                          <p className="mt-1 text-[10px] font-medium text-slate-400">
                            {timeAgo(n.createdAt)}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/notifications");
              }}
              className="block w-full cursor-pointer rounded-lg py-1.5 text-center text-[11px] font-semibold text-blue-600 transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Lihat semua notifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}