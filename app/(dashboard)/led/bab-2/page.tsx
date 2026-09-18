import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Building2, FileText, Target, Package, type LucideIcon } from "lucide-react";
import { tahunAkademikAktif, ambilStrukturLed, ambilStatusPerKode, STATUS_KOSONG } from "@/lib/utils/led-query";
import { LedPageHeader } from "@/components/led/LedPageHeader";
import { ringkasProgres } from "@/components/led/status";

export const metadata = { title: "LED — BAB II Laporan Evaluasi Diri" };

export default async function LedBab2Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ta = await tahunAkademikAktif();
  if (!ta) redirect("/dashboard");

  const [struktur, statusPerKode] = await Promise.all([
    ambilStrukturLed(),
    ambilStatusPerKode(ta.id),
  ]);

  const ambil = (pred: (b: (typeof struktur)[number]) => boolean) =>
    struktur.filter(pred).map((b) => statusPerKode.get(b.kode) ?? STATUS_KOSONG);

  const sub = [
    {
      href: "/led/bab-2/kondisi-eksternal",
      kode: "A",
      judul: "Kondisi Eksternal",
      deskripsi: "Analisis lingkungan makro & mikro, peluang, dan ancaman.",
      icon: Building2,
      status: ambil((b) => b.kode === "BAB2.A"),
    },
    {
      href: "/led/bab-2/profil",
      kode: "B",
      judul: "Profil UPPS & Program Studi",
      deskripsi: "8 sub-bagian: sejarah, VMTS, organisasi, mahasiswa, dosen, keuangan, SPMI, kinerja.",
      icon: FileText,
      status: ambil((b) => b.bab === "II" && b.bagian === "B"),
    },
    {
      href: "/led/bab-2/kriteria/1",
      kode: "C",
      judul: "Kriteria 1–6",
      deskripsi: "75 butir naratif mengikuti siklus PPEPP.",
      icon: Target,
      status: ambil((b) => b.jenis === "KRITERIA"),
    },
    {
      href: "/led/bab-2/suplemen",
      kode: "D",
      judul: "Suplemen Program Studi",
      deskripsi: "4 bagian muatan kurikulum khas program studi.",
      icon: Package,
      status: ambil((b) => b.jenis === "SUPLEMEN"),
    },
  ];

  const semua = sub.flatMap((s) => s.status);
  const total = ringkasProgres(semua.map((s) => ({ status: s, jumlahKarakter: s === "KOSONG" ? 0 : 1 })));

  return (
    <div className="min-h-screen pb-12">
      <LedPageHeader
        kembaliHref="/led"
        kembaliLabel="Kembali ke LED"
        ikon={FileText}
        eyebrow="BAB II"
        judul="Laporan Evaluasi Diri"
        terisi={total.terisi}
        total={total.total}
        readOnly={false}
        tahun={ta.tahun}
        semester={ta.semester}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sub.map((s) => {
          const r = ringkasProgres(
            s.status.map((x) => ({ status: x, jumlahKarakter: x === "KOSONG" ? 0 : 1 })),
          );
          return <SubKartu key={s.kode} {...s} persen={r.persen} terisi={r.terisi} jumlah={r.total} />;
        })}
      </div>
    </div>
  );
}

function SubKartu({
  href, kode, judul, deskripsi, icon: Icon, persen, terisi, jumlah,
}: {
  href: string;
  kode: string;
  judul: string;
  deskripsi: string;
  icon: LucideIcon;
  persen: number;
  terisi: number;
  jumlah: number;
}) {
  const belum = terisi === 0;
  return (
    <Link href={href} className="group block">
      <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-violet-300 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-100 text-violet-700 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-2xs font-black text-violet-500 uppercase tracking-wider">
              Bagian {kode}
            </div>
            <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-violet-700 transition-colors">
              {judul}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4">{deskripsi}</p>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${belum ? "bg-slate-200" : "bg-violet-500"}`}
              style={{ width: `${persen}%` }}
            />
          </div>
          <span className={`text-2xs font-bold ${belum ? "text-slate-400" : "text-violet-600"}`}>
            {terisi}/{jumlah}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
