import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TabelStatus } from "@prisma/client";
import { LaporanClient } from "./LaporanClient";

export const metadata = { title: "Laporan LKPS" };

export default async function LaporanPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get active tahun akademik
  const activeTa = await db.tahunAkademik.findFirst({
    where: { isActive: true },
    include: { prodi: true },
  });

  // Get all definitions
  const definitions = await db.tabelDefinition.findMany({
    orderBy: [{ bab: "asc" }, { urutan: "asc" }],
  });

  // Get instances for active year
  let babStats: BABStats[] = [];
  let globalStats = {
    totalTables: definitions.length,
    filledTables: 0,
    approvedTables: 0,
    pendingTables: 0,
    rejectedTables: 0,
  };

  if (activeTa) {
    const instances = await db.tabelLkps.findMany({
      where: { tahunAkademikId: activeTa.id },
      select: {
        tabelDefinitionId: true,
        status: true,
        _count: { select: { rows: true } },
      },
    });

    const instanceMap = new Map<string, { status: TabelStatus; hasRows: boolean }>();
    for (const inst of instances) {
      instanceMap.set(inst.tabelDefinitionId, {
        status: inst.status,
        hasRows: inst._count.rows > 0,
      });
    }

    const babMap = new Map<number, { filled: number; total: number; disetujui: number; diajukan: number }>();

    for (const def of definitions) {
      const info = instanceMap.get(def.id);
      const hasRows = info?.hasRows || false;
      const status = info?.status || null;

      const existing = babMap.get(def.bab) || { filled: 0, total: 0, disetujui: 0, diajukan: 0 };
      existing.total = existing.total + 1;
      if (hasRows) existing.filled = existing.filled + 1;
      if (status === "DISETUJUI") existing.disetujui = existing.disetujui + 1;
      if (status === "DIAJUKAN") existing.diajukan = existing.diajukan + 1;
      babMap.set(def.bab, existing);
    }

    babStats = Array.from(babMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([bab, stats]) => ({
        num: bab,
        title: BAB_TITLES[bab] || `BAB ${bab}`,
        tableCount: stats.total,
        filled: stats.filled,
        disetujui: stats.disetujui,
        diajukan: stats.diajukan,
      }));

    globalStats.filledTables = babStats.reduce((sum, b) => sum + b.filled, 0);
    globalStats.approvedTables = babStats.reduce((sum, b) => sum + b.disetujui, 0);
    globalStats.pendingTables = babStats.reduce((sum, b) => sum + b.diajukan, 0);
  }

  return (
    <LaporanClient
      tahunAkademik={activeTa ? `${activeTa.tahun} / ${activeTa.semester}` : null}
      prodi={activeTa?.prodi.nama || null}
      globalStats={globalStats}
      babStats={babStats}
    />
  );
}

const BAB_TITLES: Record<number, string> = {
  1: "Tata Pamong",
  2: "Pendidikan",
  3: "Penelitian",
  4: "Pengabdian",
  5: "Tata Kelola",
  6: "Visi Misi",
};

interface BABStats {
  num: number;
  title: string;
  tableCount: number;
  filled: number;
  disetujui: number;
  diajukan: number;
}
