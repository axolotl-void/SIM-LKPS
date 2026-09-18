import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { ambilBagianLed, tahunAkademikAktif } from "@/lib/utils/led-query";
import { LedBagianList } from "@/components/led/LedAccordion";
import { LedPageHeader } from "@/components/led/LedPageHeader";

export const metadata = { title: "LED — Profil UPPS & Program Studi" };

export default async function LedProfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ta = await tahunAkademikAktif();
  if (!ta) redirect("/dashboard");

  const bagian = await ambilBagianLed(ta.id, {
    kode: [
      "BAB2.B.1", "BAB2.B.2", "BAB2.B.3", "BAB2.B.4",
      "BAB2.B.5", "BAB2.B.6", "BAB2.B.7", "BAB2.B.8",
    ],
  });

  const readOnly = !hasPermission(session.user.role as Role, "led.update");
  const terisi = bagian.filter((b) => b.isian && b.isian.jumlahKarakter > 0).length;

  return (
    <div className="min-h-screen pb-12">
      <LedPageHeader
        kembaliHref="/led/bab-2"
        kembaliLabel="Kembali ke BAB II"
        ikon={FileText}
        eyebrow="BAB II.B"
        judul="Profil UPPS & Program Studi"
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
