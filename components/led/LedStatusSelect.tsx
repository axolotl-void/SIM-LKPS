"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import type { LedStatus } from "@prisma/client";
import { setLedStatus } from "@/lib/actions/led";
import { LED_STATUS_META } from "@/lib/utils/led-progress";
import { statusKelas } from "./status";
import { cn } from "@/lib/utils/format";

const URUTAN: LedStatus[] = ["KOSONG", "DRAFT", "LENGKAP", "DIAJUKAN", "DISETUJUI"];

type Props = {
  bagianId: string;
  statusAwal: LedStatus;
  readOnly?: boolean;
};

export function LedStatusSelect({ bagianId, statusAwal, readOnly = false }: Props) {
  const [status, setStatus] = useState<LedStatus>(statusAwal);
  const [pending, setPending] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  if (readOnly) return null;

  const ubah = async (baru: LedStatus) => {
    const lama = status;
    setStatus(baru);
    setGalat(null);
    setPending(true);
    try {
      await setLedStatus({ ledBagianId: bagianId, status: baru });
    } catch (e) {
      setStatus(lama);
      setGalat(e instanceof Error ? e.message : "Gagal mengubah status.");
    } finally {
      setPending(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-1">
      <select
        value={status}
        onChange={(e) => void ubah(e.target.value as LedStatus)}
        disabled={pending}
        aria-label="Status bagian"
        className={cn(
          "text-2xs font-semibold rounded-lg border px-2 py-1 cursor-pointer outline-none",
          "focus:ring-2 focus:ring-violet-200 disabled:opacity-60",
          statusKelas(status),
        )}
      >
        {URUTAN.map((s) => (
          <option key={s} value={s}>
            {LED_STATUS_META[s].label}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
      {!pending && galat && (
        <span className="text-2xs text-red-600" title={galat}>
          <Check className="w-3 h-3 hidden" />
          gagal
        </span>
      )}
    </span>
  );
}
