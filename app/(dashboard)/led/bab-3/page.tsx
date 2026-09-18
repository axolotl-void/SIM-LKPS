import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { ambilBagianLed, tahunAkademikAktif } from "@/lib/utils/led-query";
import { LedBagianList } from "@/components/led/LedAccordion";
import { LedPageHeader } from "@/components/led/LedPageHeader";

export const metadata = { title: "LED — BAB III Penutup" };

export default async function LedBab3Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ta = await tahunAkademikAktif();
  if (!ta) redirect("/dashboard");

  const bagian = await ambilBagianLed(ta.id, { kode: ["BAB3"] });
  const readOnly = !hasPermission(session.user.role as Role, "led.update");
  const terisi = bagian.filter((b) => b.isian && b.isian.jumlahKarakter > 0).length;

  return (
    <div className="min-h-screen pb-12">
      <LedPageHeader
        kembaliHref="/led"
        kembaliLabel="Kembali ke LED"
        ikon={ClipboardList}
        eyebrow="BAB III"
        judul="Penutup"
        terisi={terisi}
        total={bagian.length}
        readOnly={readOnly}
        tahun={ta.tahun}
        semester={ta.semester}
      />

      <LedBagianList bagian={bagian} readOnly={readOnly} denganNomor={false} />
    </div>
  );
}
