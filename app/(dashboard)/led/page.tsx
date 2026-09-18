import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import {
  ambilRingkasanLed, jumlahBagianLed, tahunAkademikAktif,
  ambilStrukturLed, ambilStatusPerKode, STATUS_KOSONG,
} from "@/lib/utils/led-query";
import { hitungProgres, BATAS_HALAMAN_LED } from "@/lib/utils/led-progress";
import {
  LedProgressCard, LedBatasBanner, LedBelumDiSeed, type KartuLed,
} from "@/components/led/LedProgressCard";

export const metadata = { title: "Laporan Evaluasi Diri" };

export default async function LedIndexPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ta = await tahunAkademikAktif();
  if (!ta) redirect("/dashboard");

  const struktur = await ambilStrukturLed();
  if (struktur.length === 0) {
    return (
      <div className="min-h-screen pb-12">
        <HeroLed />
        <LedBelumDiSeed />
      </div>
    );
  }

  const [isian, total, statusPerKode] = await Promise.all([
    ambilRingkasanLed(ta.id),
    jumlahBagianLed(),
    ambilStatusPerKode(ta.id),
  ]);

  const progres = hitungProgres(
    isian.map((i) => ({ status: i.status, jumlahKarakter: i.jumlahKarakter })),
    total,
  );

  /** Kumpulkan status untuk sekelompok bagian — yang belum diisi dianggap KOSONG. */
  const ambil = (pred: (b: (typeof struktur)[number]) => boolean) =>
    struktur.filter(pred).map((b) => statusPerKode.get(b.kode) ?? STATUS_KOSONG);

  const kartu: KartuLed[] = [
    {
      kode: "BAB I",
      judul: "Pendahuluan",
      deskripsi: "Dasar penyusunan, tim penyusun, dan mekanisme kerja LED.",
      href: "/led/bab-1",
      ikon: "BookOpen",
      status: ambil((b) => b.bab === "I"),
    },
    {
      kode: "BAB II.A",
      judul: "Kondisi Eksternal",
      deskripsi: "Analisis lingkungan makro dan mikro UPPS serta program studi.",
      href: "/led/bab-2/kondisi-eksternal",
      ikon: "Building2",
      status: ambil((b) => b.kode === "BAB2.A"),
    },
    {
      kode: "BAB II.B",
      judul: "Profil UPPS & Program Studi",
      deskripsi: "Sejarah, VMTS, organisasi, mahasiswa, dosen, keuangan, SPMI, kinerja.",
      href: "/led/bab-2/profil",
      ikon: "FileText",
      status: ambil((b) => b.bab === "II" && b.bagian === "B"),
    },
    {
      kode: "BAB II.C",
      judul: "Kriteria 1–6",
      deskripsi: "75 butir naratif mengikuti siklus PPEPP (Penetapan → Peningkatan).",
      href: "/led/bab-2/kriteria/1",
      ikon: "Target",
      status: ambil((b) => b.jenis === "KRITERIA"),
    },
    {
      kode: "BAB II.D",
      judul: "Suplemen Program Studi",
      deskripsi: "Muatan kurikulum khas prodi: MK inti, domain spesifik, matematika, capstone.",
      href: "/led/bab-2/suplemen",
      ikon: "Package",
      status: ambil((b) => b.jenis === "SUPLEMEN"),
    },
    {
      kode: "BAB III",
      judul: "Penutup",
      deskripsi: "Simpulan dan rencana tindak lanjut penyusunan LED.",
      href: "/led/bab-3",
      ikon: "ClipboardList",
      status: ambil((b) => b.bab === "III"),
    },
  ];

  const bolehIsi = hasPermission(session.user.role as Role, "led.update");

  return (
    <div className="min-h-screen pb-12">
      <HeroLed
        terisi={progres.terisi}
        total={progres.total}
        draft={progres.draft}
        lengkap={progres.lengkap}
        estimasi={progres.estimasiHalaman}
        persen={progres.persenTerisi}
      />

      {!bolehIsi && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          Peran <strong>{session.user.role}</strong> hanya bisa membaca LED. Hubungi administrator
          kalau perlu hak mengisi.
        </div>
      )}

      <LedBatasBanner estimasi={progres.estimasiHalaman} batas={BATAS_HALAMAN_LED} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kartu.map((k, i) => (
          <LedProgressCard key={k.kode} kartu={k} index={i} />
        ))}
      </div>

      <p className="mt-6 text-2xs text-slate-400">
        Estimasi halaman memakai asumsi ±3.000 karakter per halaman A4 (Arial 11, spasi 1,15) sesuai
        Lampiran 2 Instrumen LED. Angka ini indikator, bukan patokan mutlak.
      </p>
    </div>
  );
}

function HeroLed({
  terisi = 0,
  total = 0,
  draft = 0,
  lengkap = 0,
  estimasi = 0,
  persen = 0,
}: {
  terisi?: number;
  total?: number;
  draft?: number;
  lengkap?: number;
  estimasi?: number;
  persen?: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-5 mb-6 shadow-xl animate-fade-in-up">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-4 border-white/10 transform rotate-12" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border-4 border-white/10 transform -rotate-12" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                LAM INFOKOM 2.1
              </span>
              <h1 className="text-white text-xl font-black tracking-tight">Laporan Evaluasi Diri</h1>
            </div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6"
                strokeDasharray={`${(persen / 100) * 176} 176`} strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-lg font-black">{persen}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Chip label="Terisi" value={`${terisi}/${total}`} />
          <Chip label="Draft" value={draft} />
          <Chip label="Lengkap" value={lengkap} />
          <Chip label="Estimasi" value={`${estimasi} hal`} />
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/15 rounded-xl p-3 border border-white/20">
      <div className="text-white/70 text-2xs font-semibold mb-0.5">{label}</div>
      <div className="text-white text-xl font-black">{value}</div>
    </div>
  );
}
