import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";
import { hasPermission } from "@/lib/utils/permissions";
import { Role } from "@prisma/client";
import { ambilButirPenilaian, keButirHitung, sesiPenilaian, tahunAktifPenilaian } from "@/lib/utils/penilaian-query";
import { hitungPenilaian, bobotValid, BOBOT_TOTAL, persenTerisi } from "@/lib/utils/penilaian";
import { StatusGauge } from "@/components/penilaian/StatusGauge";
import { KriteriaBreakdown } from "@/components/penilaian/KriteriaBreakdown";
import { AksiFinalisasi } from "@/components/penilaian/AksiFinalisasi";

export const metadata = { title: "Matriks Penilaian" };

export default async function PenilaianPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;

  const ta = await tahunAktifPenilaian();
  if (!ta) redirect("/dashboard");

  const butir = await ambilButirPenilaian(ta.id);

  // ── struktur belum di-seed
  if (butir.length === 0) {
    return (
      <div className="min-h-screen pb-12">
        <HeroPenilaian />
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
          <Target className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-700 mb-1">Matriks Penilaian belum di-seed</h2>
          <p className="text-sm text-slate-500 mb-4">
            Tabel <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs">butir_penilaian</code> masih
            kosong. Jalankan seed modul penilaian lebih dulu.
          </p>
          <code className="inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-100 font-mono">
            pnpm tsx prisma/seed-modul-baru.ts
          </code>
        </div>
      </div>
    );
  }

  const data = keButirHitung(butir);
  const hasil = hitungPenilaian(data);
  const sesi = await sesiPenilaian(ta.id);
  const validBobot = bobotValid(data);

  // ── Σ bobot ≠ 400 → prediksi tidak bisa dipercaya, tolak render angka
  if (!validBobot) {
    const total = data.reduce((a, b) => a + b.bobot, 0);
    return (
      <div className="min-h-screen pb-12">
        <HeroPenilaian />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-bold text-red-800 mb-1">Total bobot tidak sesuai</h2>
          <p className="text-xs text-red-700">
            Jumlah bobot butir <strong>{total.toFixed(1)}</strong>, seharusnya <strong>{BOBOT_TOTAL}</strong>.
            Selama selisih ini ada, nilai akhir dan prediksi status tidak bisa dihitung. Periksa hasil seed
            <code className="mx-1 px-1 py-0.5 rounded bg-red-100 font-mono">butir_penilaian</code>.
          </p>
        </div>
      </div>
    );
  }

  const bolehFinalisasi = hasPermission(role, "penilaian.finalisasi");
  const bolehIsi = hasPermission(role, "penilaian.update");
  const terkunci = sesi?.finalisasi ?? false;

  return (
    <div className="min-h-screen pb-12">
      <div className="mb-6">
        <StatusGauge
          nilaiAkhir={hasil.nilaiAkhir}
          status={hasil.status}
          syarat={{ rerataOk: hasil.rerataKunciOk, butirOk: hasil.semuaButirOk }}
          sementara={!hasil.lengkap}
          rerataKunci={hasil.rerataKunci}
        />
      </div>

      {/* ringkasan progres + aksi */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Stat label="Butir dinilai" nilai={`${hasil.jumlahTerisi}/${hasil.totalButir}`} />
          <Stat label="Progres" nilai={`${persenTerisi(hasil.jumlahTerisi, hasil.totalButir)}%`} />
          <Stat label="Belum dinilai" nilai={hasil.jumlahKosong} peringatan={hasil.jumlahKosong > 0} />
          {hasil.skorTerendah !== null && <Stat label="Skor terendah" nilai={hasil.skorTerendah} />}
          {terkunci && (
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-2xs font-bold text-emerald-700">
              Finalisasi {sesi?.updatedAt ? new Date(sesi.updatedAt).toLocaleDateString("id-ID") : ""}
            </span>
          )}
        </div>

        <AksiFinalisasi
          finalisasi={terkunci}
          lengkap={hasil.lengkap}
          jumlahKosong={hasil.jumlahKosong}
          bolehFinalisasi={bolehFinalisasi}
        />
      </div>

      {terkunci && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          Penilaian sudah difinalisasi dengan nilai akhir{" "}
          <strong>{(sesi?.nilaiAkhir ?? hasil.nilaiAkhir).toLocaleString("id-ID")}</strong>. Skor terkunci —
          {" "}buka kembali dulu (ADMIN) untuk mengubah.
        </div>
      )}

      {!bolehIsi && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          Peran <strong>{role}</strong> hanya bisa membaca hasil penilaian.
        </div>
      )}

      {/* daftar butir belum dinilai */}
      {!hasil.lengkap && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-bold text-amber-900 mb-1">
            {hasil.jumlahKosong} butir belum dinilai
          </h2>
          <p className="text-xs text-amber-800 mb-3">
            Butir kosong dihitung 0 sehingga nilai akhir masih sementara. Isi semuanya sebelum finalisasi.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {butir
              .filter((b) => b.skor === null)
              .slice(0, 40)
              .map((b) => (
                <Link
                  key={b.id}
                  href={`/penilaian/butir/${encodeURIComponent(b.kode)}`}
                  className="rounded-lg bg-white border border-amber-200 px-2 py-1 text-2xs font-mono font-semibold text-amber-800 hover:border-amber-400 transition-colors"
                >
                  {b.kode}
                </Link>
              ))}
            {hasil.jumlahKosong > 40 && (
              <span className="px-2 py-1 text-2xs text-amber-700">+{hasil.jumlahKosong - 40} lagi</span>
            )}
          </div>
        </div>
      )}

      <KriteriaBreakdown perKriteria={hasil.perKriteria} />

      {hasil.butirPenghambat.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold text-slate-800 mb-1">Penghambat gelar Unggul</h2>
          <p className="text-2xs text-slate-500 mb-3">
            Butir C1–C3 ini belum memenuhi syarat §V (setiap butir minimal 3,00).
          </p>
          <div className="flex flex-wrap gap-1.5">
            {hasil.butirPenghambat.slice(0, 40).map((b) => (
              <Link
                key={b.kode}
                href={`/penilaian/butir/${encodeURIComponent(b.kode)}`}
                className="rounded-lg bg-red-50 border border-red-200 px-2 py-1 text-2xs font-mono font-semibold text-red-700 hover:border-red-400 transition-colors"
              >
                {b.kode} {b.skor === null ? "· kosong" : `· ${b.skor}`}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HeroPenilaian() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-5 mb-6 shadow-xl">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-4 border-white/10 transform rotate-12" />
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">LAM INFOKOM 2.1</span>
          <h1 className="text-white text-xl font-black tracking-tight">Matriks Penilaian</h1>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, nilai, peringatan }: { label: string; nilai: string | number; peringatan?: boolean }) {
  return (
    <div>
      <div className="text-2xs font-semibold text-slate-400">{label}</div>
      <div className={`text-lg font-black ${peringatan ? "text-amber-600" : "text-slate-800"}`}>{nilai}</div>
    </div>
  );
}
