import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { daftarTahunAkademik, siapkanExportLed } from "@/lib/utils/led-export-query";
import { LedExportDialog } from "@/components/led/LedExportDialog";
import { cn } from "@/lib/utils/format";

export const metadata = { title: "Export LED" };

type Props = {
  searchParams: Promise<{ tahun?: string }>;
};

export default async function LedExportPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;
  if (!hasPermission(role, "report.export")) {
    return (
      <div className="min-h-screen pb-12">
        <Kepala />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="mb-1 text-sm font-bold text-red-800">Tidak punya izin export</h2>
          <p className="text-xs text-red-700">
            Peran <strong>{role}</strong> tidak boleh mengunduh dokumen LED. Minta ADMIN
            menaikkan izin, atau minta berkasnya langsung dari pengelola.
          </p>
        </div>
      </div>
    );
  }

  const { tahun } = await searchParams;
  const [ctx, daftar] = await Promise.all([siapkanExportLed(tahun), daftarTahunAkademik()]);

  if (!ctx) {
    return (
      <div className="min-h-screen pb-12">
        <Kepala />
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
          <Download className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <h2 className="mb-1 text-base font-bold text-slate-700">Tahun akademik tidak ditemukan</h2>
          <p className="text-sm text-slate-500">
            Tambahkan tahun akademik lebih dulu di pengaturan.
          </p>
        </div>
      </div>
    );
  }

  const { pra, bagianCetak, tahunAkademik, prodi } = ctx;
  const qs = `?tahun=${encodeURIComponent(tahunAkademik.id)}`;

  return (
    <div className="min-h-screen pb-12">
      <Kepala />

      {/* ── pemilih tahun akademik */}
      {daftar.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
            Tahun akademik
          </span>
          {daftar.map((t) => {
            const aktif = t.id === tahunAkademik.id;
            return (
              <Link
                key={t.id}
                href={`/led/export?tahun=${encodeURIComponent(t.id)}`}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-2xs font-bold transition-colors",
                  aktif
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-violet-200",
                )}
              >
                {t.tahun} {t.semester}
              </Link>
            );
          })}
        </div>
      )}

      {/* ── pratinjau kelengkapan */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold text-slate-800">Pemeriksaan Pra-Export</h2>

          <dl className="mb-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            <Statistik label="Program studi" nilai={`${prodi.nama} (${prodi.jenjang})`} />
            <Statistik label="Bagian terisi" nilai={`${bagianCetak.length}/${pra.jumlahBagian}`} />
            <Statistik label="Karakter" nilai={pra.totalKarakter.toLocaleString("id-ID")} />
            <Statistik
              label="Estimasi halaman"
              nilai={`${pra.estimasiHalaman} / ${pra.batasHalaman}`}
              peringatan={pra.lebihBatas}
            />
          </dl>

          {pra.siap ? (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <p className="text-xs text-emerald-800">
                Semua {pra.jumlahBagian} bagian sudah terisi dan estimasi halaman masih di bawah
                batas {pra.batasHalaman}. Dokumen siap diunduh.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              <div className="text-xs text-amber-800">
                {pra.jumlahKosong > 0 && (
                  <p>
                    <strong>{pra.jumlahKosong} bagian belum diisi</strong> — bagian itu tidak ikut
                    tercetak. Tetap boleh diunduh untuk memeriksa tata letak.
                  </p>
                )}
                {pra.lebihBatas && (
                  <p className="mt-1">
                    <strong>Estimasi {pra.estimasiHalaman} halaman</strong> melewati batas{" "}
                    {pra.batasHalaman} halaman Lampiran 2. Ringkas narasi sebelum dokumen dikirim ke
                    asesor.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-bold text-slate-800">Unduh</h2>
          <p className="mb-4 text-2xs text-slate-500">
            Word untuk diedit lebih lanjut, PDF untuk dikirim apa adanya.
          </p>
          <LedExportDialog
            ringkas={pra}
            urlWord={`/api/export/led/word${qs}`}
            urlPdf={`/api/export/led/pdf${qs}`}
            jumlahCetak={bagianCetak.length}
          />
        </div>
      </div>

      {/* ── daftar bagian kosong */}
      {pra.kosong.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-bold text-slate-800">
            Bagian yang belum diisi ({pra.kosong.length})
          </h2>
          <p className="mb-3 text-2xs text-slate-500">
            Daftar ini juga muncul di dialog unduhan. Klik untuk langsung membuka editornya.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pra.kosong.map((b) => (
              <span
                key={b.kode}
                className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 font-mono text-[10px] font-semibold text-amber-800"
                title={b.judul}
              >
                {b.kode}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Kepala() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-5 shadow-xl">
      <div className="absolute -right-8 -top-8 h-32 w-32 rotate-12 rounded-full border-4 border-white/10" />
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/20">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            LAM INFOKOM 2.1
          </span>
          <h1 className="text-xl font-black tracking-tight text-white">Export Dokumen LED</h1>
        </div>
      </div>
      <Link
        href="/led"
        className="absolute right-5 top-5 z-20 inline-flex items-center gap-1 rounded-lg border border-white/30 bg-white/15 px-2.5 py-1.5 text-2xs font-bold text-white transition-colors hover:bg-white/25"
      >
        <ArrowLeft className="h-3 w-3" />
        Ringkasan LED
      </Link>
    </div>
  );
}

function Statistik({
  label,
  nilai,
  peringatan,
}: {
  label: string;
  nilai: string;
  peringatan?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className={cn("text-sm font-black", peringatan ? "text-amber-600" : "text-slate-800")}>
        {nilai}
      </dd>
    </div>
  );
}
