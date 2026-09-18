import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Target } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { ambilBagianLed, tahunAkademikAktif } from "@/lib/utils/led-query";
import { LedAccordion } from "@/components/led/LedAccordion";
import { LedPageHeader } from "@/components/led/LedPageHeader";
import { KRITERIA_LED } from "@/lib/utils/kriteria-led";
import { TAHAP_URUTAN } from "@/lib/utils/led-progress";

export const metadata = { title: "LED — Kriteria" };

export default async function LedKriteriaPage({
  params,
}: {
  params: Promise<{ nomor: string }>;
}) {
  const { nomor } = await params;
  const n = Number(nomor);
  const info = KRITERIA_LED.find((k) => k.nomor === n);
  if (!info) notFound();

  const session = await auth();
  if (!session?.user) redirect("/login");

  const ta = await tahunAkademikAktif();
  if (!ta) redirect("/dashboard");

  const bagian = await ambilBagianLed(ta.id, { kriteria: n });
  const readOnly = !hasPermission(session.user.role as Role, "led.update");
  const terisi = bagian.filter((b) => b.isian && b.isian.jumlahKarakter > 0).length;

  // Kelompokkan per tahap PPEPP — urutan sesuai TAHAP_URUTAN, bukan urutan DB
  const perTahap = TAHAP_URUTAN.map((tahap) => ({
    tahap,
    butir: bagian.filter((b) => b.tahapPpepp === tahap),
  })).filter((g) => g.butir.length > 0);

  return (
    <div className="min-h-screen pb-12">
      <LedPageHeader
        kembaliHref="/led/bab-2"
        kembaliLabel="Kembali ke BAB II"
        ikon={Target}
        eyebrow={`BAB II.C • Kriteria ${n} • Bobot ${info.bobot}`}
        judul={info.judul}
        terisi={terisi}
        total={bagian.length}
        readOnly={readOnly}
        tahun={ta.tahun}
        semester={ta.semester}
        aksi={<PemilihKriteria aktif={n} />}
      />

      {perTahap.map((g) => (
        <LedAccordion key={g.tahap} tahap={g.tahap} butir={g.butir} readOnly={readOnly} />
      ))}
    </div>
  );
}

function PemilihKriteria({ aktif }: { aktif: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {KRITERIA_LED.map((k) => (
        <a
          key={k.nomor}
          href={`/led/bab-2/kriteria/${k.nomor}`}
          className={`px-2.5 py-1 rounded-lg text-2xs font-bold border transition-colors cursor-pointer ${
            k.nomor === aktif
              ? "bg-white text-slate-800 border-white"
              : "bg-white/10 text-white/80 border-white/25 hover:bg-white/20"
          }`}
        >
          K{k.nomor}
        </a>
      ))}
    </div>
  );
}
