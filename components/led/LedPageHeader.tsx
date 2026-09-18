import Link from "next/link";
import { ArrowLeft, type LucideIcon, Calendar, CheckCircle2, Lock } from "lucide-react";

type Props = {
  kembaliHref: string;
  kembaliLabel: string;
  ikon: LucideIcon;
  eyebrow: string;
  judul: string;
  terisi: number;
  total: number;
  readOnly: boolean;
  tahun?: string;
  semester?: string;
  /** Slot tambahan di kanan (mis. pemilih kriteria). */
  aksi?: React.ReactNode;
};

/**
 * Top bar halaman LED — mengikuti pola halaman detail tabel LKPS:
 * chip statistik + tombol aksi sebaris, aksen slate.
 */
export function LedPageHeader({
  kembaliHref, kembaliLabel, ikon: Icon, eyebrow, judul,
  terisi, total, readOnly, tahun, semester, aksi,
}: Props) {
  const persen = total === 0 ? 0 : Math.round((terisi / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-5 mb-6 shadow-xl animate-fade-in-up">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-4 border-white/10 transform rotate-12" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border-4 border-white/10 transform -rotate-12" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{eyebrow}</span>
              <h1 className="text-white text-xl font-black tracking-tight truncate">{judul}</h1>
            </div>
          </div>

          <div className="relative w-16 h-16 shrink-0">
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
          <div className="bg-white/15 rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-1.5 mb-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              <span className="text-white/70 text-2xs font-semibold">Terisi</span>
            </div>
            <div className="text-white text-xl font-black">
              {terisi}/{total}
            </div>
          </div>

          {tahun && (
            <div className="bg-white/15 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Calendar className="w-3 h-3 text-pink-300" />
                <span className="text-white/70 text-2xs font-semibold">Tahun</span>
              </div>
              <div className="text-white text-xl font-black">{tahun}</div>
            </div>
          )}

          {semester && (
            <div className="bg-white/15 rounded-xl p-3 border border-white/20">
              <div className="text-white/70 text-2xs font-semibold mb-0.5">Semester</div>
              <div className="text-white text-xl font-black">{semester}</div>
            </div>
          )}

          {readOnly && (
            <div className="bg-white/15 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Lock className="w-3 h-3 text-amber-300" />
                <span className="text-white/70 text-2xs font-semibold">Akses</span>
              </div>
              <div className="text-white text-sm font-black">Hanya baca</div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={kembaliHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 text-white text-xs font-semibold hover:bg-white/25 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {kembaliLabel}
          </Link>
          {aksi}
        </div>
      </div>
    </div>
  );
}
