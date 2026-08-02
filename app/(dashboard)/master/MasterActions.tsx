"use client";

import { useRouter } from "next/navigation";
import { Plus, UserPlus } from "lucide-react";

interface MasterActionsProps {
  type: "dosen" | "mahasiswa";
}

export function MasterActions({ type }: MasterActionsProps) {
  const router = useRouter();
  const href = type === "dosen" ? "/master/dosen/new" : "/master/mahasiswa/new";

  const styles = type === "dosen"
    ? "bg-emerald-600 hover:bg-emerald-700"
    : "bg-indigo-600 hover:bg-indigo-700";

  const Icon = type === "dosen" ? Plus : UserPlus;

  return (
    <button
      onClick={() => router.push(href)}
      className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md cursor-pointer ${styles}`}
    >
      <Icon className="h-3.5 w-3.5" />
      Tambah {type === "dosen" ? "Dosen" : ""}
    </button>
  );
}
