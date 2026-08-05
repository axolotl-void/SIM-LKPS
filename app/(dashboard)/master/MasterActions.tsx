"use client";

import { useRouter } from "next/navigation";
import { Plus, UserPlus, ArrowRight } from "lucide-react";

interface MasterActionsProps {
  type: "dosen" | "mahasiswa";
  withDetailLink?: boolean;
}

export function MasterActions({ type, withDetailLink = false }: MasterActionsProps) {
  const router = useRouter();
  const addHref = type === "dosen" ? "/master/dosen/new" : "/master/mahasiswa/new";
  const detailHref = type === "dosen" ? "/master/dosen" : "/master/mahasiswa";

  const addStyles =
    type === "dosen"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-indigo-600 hover:bg-indigo-700";
  const Icon = type === "dosen" ? Plus : UserPlus;

  return (
    <>
      <button
        type="button"
        onClick={() => router.push(addHref)}
        className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md cursor-pointer ${addStyles}`}
      >
        <Icon className="h-3.5 w-3.5" />
        Tambah {type === "dosen" ? "Dosen" : ""}
      </button>
      {withDetailLink && (
        <button
          type="button"
          onClick={() => router.push(detailHref)}
          className="relative z-10 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
        >
          Lihat Detail
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </>
  );
}