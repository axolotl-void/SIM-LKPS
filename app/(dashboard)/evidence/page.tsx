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

  // Deep clone for client component (Date objects, Prisma Decimal, etc. can't cross
  // the RSC boundary). Wrapped in try-catch — should never throw with valid Prisma
  // output, but guards against circular refs / BigInt edge cases.
  let tabelLkpsSerializable: unknown = [];
  try {
    tabelLkpsSerializable = JSON.parse(JSON.stringify(tabelLkpsWithEvidence));
  } catch (err) {
    console.error("[evidence page] failed to serialize tabelLkpsWithEvidence:", err);
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-soft-sm border border-slate-100/60">
        <h1 className="text-base font-bold text-slate-800">Bukti Pendukung</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Kelola file bukti pendukung untuk setiap tabel LKPS.
        </p>
      </div>

      <EvidenceClient
        tabelLkpsWithEvidence={tabelLkpsSerializable as Parameters<typeof EvidenceClient>[0]["tabelLkpsWithEvidence"]}
      />
    </div>
  );
}
