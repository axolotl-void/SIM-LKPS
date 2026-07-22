import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Role } from "@prisma/client";
import { Clock, FileText, CheckCircle2, AlertCircle, XCircle, Search, X, ArrowRight, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { SubmissionStatusClient } from "./submissions-client";

export const metadata: Metadata = {
  title: "Pengajuan Saya — Status Tabel LKPS",
};

export default async function SubmissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;

  // Only OPERATOR and ADMIN can view their submissions
  if (role !== "OPERATOR" && role !== "ADMIN") {
    redirect("/forbidden");
  }

  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  if (!activeTa) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft text-center">
        <p className="text-sm font-semibold text-slate-500">
          Belum ada tahun akademik yang aktif.
        </p>
      </div>
    );
  }

  // ADMIN sees all, OPERATOR sees only their own
  const whereClause = role === "ADMIN"
    ? { tahunAkademikId: activeTa.id }
    : { tahunAkademikId: activeTa.id, submittedById: session.user.id };

  // Get all submitted tables for this user (non-DRAFT)
  const submissions = await db.tabelLkps.findMany({
    where: {
      ...whereClause,
      status: { not: "DRAFT" },
    },
    include: {
      tabelDefinition: true,
      submittedBy: { select: { name: true } },
      validatedBy: { select: { name: true } },
      validationHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      tahunAkademik: { include: { prodi: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  const submissionsData = submissions.map((s) => ({
    id: s.id,
    kode: s.tabelDefinition.kode,
    nama: s.tabelDefinition.nama,
    bab: s.tabelDefinition.bab,
    status: s.status,
    submittedAt: s.submittedAt?.toISOString() || null,
    validatedAt: s.validatedAt?.toISOString() || null,
    submittedByName: s.submittedBy?.name || "Unknown",
    validatedByName: s.validatedBy?.name || null,
    latestComment: s.validationHistory[0]?.comment || null,
    latestAction: s.validationHistory[0]?.action || null,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft border border-slate-100/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50/50 via-indigo-50/20 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Pengajuan Saya
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Lacak status tabel yang pernah diajukan untuk divalidasi
          </p>
          {role === "ADMIN" && (
            <span className="mt-2 inline-block rounded-lg bg-blue-50 px-2.5 py-1 text-2xs font-bold text-blue-600">
              Mode Admin — melihat semua submission
            </span>
          )}
        </div>
      </div>

      <SubmissionStatusClient
        initialSubmissions={submissionsData}
        activeTa={`${activeTa.tahun} (${activeTa.semester})`}
        prodi={activeTa.prodi.nama}
      />
    </div>
  );
}
