import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EvidenceClient } from "./evidence-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bukti Pendukung | SIM-LKPS",
};

export default async function EvidencePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });
  if (!activeTa) redirect("/dashboard");

  // Get all TabelLkps records with their evidence (including empty ones for upload)
  const tabelLkpsWithEvidence = await db.tabelLkps.findMany({
    where: {
      tahunAkademikId: activeTa.id,
    },
    include: {
      tabelDefinition: true,
      evidence: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { tabelDefinition: { bab: "asc" } },
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <h1 className="text-lg font-bold text-slate-800">Bukti Pendukung</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Kelola file bukti pendukung untuk setiap tabel LKPS.
        </p>
      </div>

      <EvidenceClient
        tabelLkpsWithEvidence={JSON.parse(JSON.stringify(tabelLkpsWithEvidence))}
      />
    </div>
  );
}
