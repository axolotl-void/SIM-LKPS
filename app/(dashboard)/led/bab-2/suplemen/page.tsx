import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { ambilBagianLed, tahunAkademikAktif } from "@/lib/utils/led-query";
import { LedBagianList } from "@/components/led/LedAccordion";
import { LedPageHeader } from "@/components/led/LedPageHeader";

export const metadata = { title: "LED — Suplemen Program Studi" };

export default async function LedSuplemenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ta = await tahunAkademikAktif();
  if (!ta) redirect("/dashboard");

  const bagian = await ambilBagianLed(ta.id, {
    kode: ["BAB2.D.1", "BAB2.D.2", "BAB2.D.3", "BAB2.D.4"],
  });

  const readOnly = !hasPermission(session.user.role as Role, "led.update");
  const terisi = bagian.filter((b) => b.isian && b.isian.jumlahKarakter > 0).length;

  return (
    <div className="min-h-screen pb-12">
      <LedPageHeader
        kembaliHref="/led/bab-2"
        kembaliLabel="Kembali ke BAB II"
        ikon={Package}
        eyebrow="BAB II.D • Bidang Ilmu Komputer"
        judul="Suplemen Program Studi"
        terisi={terisi}
        total={bagian.length}
        readOnly={readOnly}
        tahun={ta.tahun}
        semester={ta.semester}
      />

      <LedBagianList bagian={bagian} readOnly={readOnly} />
    </div>
  );
}
