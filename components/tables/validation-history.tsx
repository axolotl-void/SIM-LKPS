"use client";

import {
  Clock, CheckCircle2, XCircle, RefreshCw, Send,
  User, CalendarDays
} from "lucide-react";

interface HistoryItem {
  id: string;
  action: string;
  comment?: string | null;
  createdAt: string;
  user: { name: string; role: string };
}

interface Props {
  history: HistoryItem[];
}

const actionConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  SUBMIT:  { icon: <Send className="h-4 w-4" />, color: "blue", label: "Diajukan" },
  APPROVE: { icon: <CheckCircle2 className="h-4 w-4" />, color: "emerald", label: "Disetujui" },
  REJECT:  { icon: <XCircle className="h-4 w-4" />, color: "red", label: "Ditolak" },
  REVISE:  { icon: <RefreshCw className="h-4 w-4" />, color: "orange", label: "Direvisi" },
};

export function ValidationHistory({ history }: Props) {
  if (!history || history.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-100/50 bg-white shadow-soft p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-slate-500" />
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Riwayat Validasi
        </h3>
      </div>

      <div className="relative space-y-0">
        {/* Timeline line */}
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-slate-200" />

        {[...history].reverse().map((item, idx) => {
          const config = actionConfig[item.action] ?? {
            icon: <Clock className="h-4 w-4" />,
            color: "slate",
            label: item.action,
          };
          const isFirst = idx === 0;

          return (
            <div key={item.id} className={`relative flex gap-4 pb-5 ${isFirst ? "" : ""}`}>
              {/* Dot */}
              <div className={`relative z-10 mt-0.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border-2 border-white bg-${config.color}-100 text-${config.color}-600 shadow-2xs`}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold text-${config.color}-700`}>
                    {config.label}
                  </span>
                  {isFirst && (
                    <span className="text-3xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">
                      Terbaru
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-3 text-2xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.user.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>

                {item.comment && (
                  <div className="mt-2 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-2xs text-slate-600 italic">
                    “{item.comment}”
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
