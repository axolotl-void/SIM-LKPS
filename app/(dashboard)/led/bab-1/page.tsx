import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { ambilBagianLed, tahunAkademikAktif } from "@/lib/utils/led-query";
import { LedBagianList } from "@/components/led/LedAccordion";
import { LedPageHeader } from "@/components/led/LedPageHeader";

export const metadata = { title: "LED — BAB I Pendahuluan" };

export default async function LedBab1Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ta = await tahunAkademikAktif();
  if (!ta) redirect("/dashboard");

  const bagian = await ambilBagianLed(ta.id, {
    kode: ["BAB1.A", "BAB1.B", "BAB1.C"],
  });

  const readOnly = !hasPermission(session.user.role as Role, "led.update");
  const terisi = bagian.filter((b) => b.isian && b.isian.jumlahKarakter > 0).length;

  return (
    <div className="min-h-screen pb-12">
      <LedPageHeader
        kembaliHref="/led"
        kembaliLabel="Kembali ke LED"
        ikon={BookOpen}
        eyebrow="BAB I • Pendahuluan"
        judul="Dasar, Tim, dan Mekanisme Penyusunan"
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
