"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check, Loader2, AlertCircle, Eye, PencilLine, Clock, CloudOff, RotateCcw,
} from "lucide-react";
import { saveLedIsian } from "@/lib/actions/led";
import type { HasilSimpan } from "./types";
import { renderMarkdown } from "@/lib/utils/markdown";
import { estimasiHalaman, BATAS_KARAKTER_PER_BAGIAN } from "@/lib/utils/led-progress";
import { cn } from "@/lib/utils/format";

type Props = {
  bagianId: string;
  nilaiAwal: string;
  readOnly?: boolean;
  /** Dipegang server; dipakai mendeteksi tab lain yang menyimpan lebih dulu. */
  updatedAtAwal: string | null;
  onSaved?: (updatedAt: string) => void;
};

const DEBOUNCE_MS = 2000;
const KUNCI_DRAFT = (id: string) => `led-draft:${id}`;

export function LedEditor({ bagianId, nilaiAwal, readOnly = false, updatedAtAwal, onSaved }: Props) {
  const [konten, setKonten] = useState(nilaiAwal);
  const [mode, setMode] = useState<"tulis" | "pratinjau">("tulis");
  const [menyimpan, setMenyimpan] = useState(false);
  const [tersimpanPada, setTersimpanPada] = useState<string | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [adaDraftLokal, setAdaDraftLokal] = useState(false);
  const [konflik, setKonflik] = useState<string | null>(null);
  /** Nilai yang terakhir diketahui sudah masuk server — pembanding "kotor".
   *  Sengaja state, bukan ref: nilainya dipakai saat render (badge status). */
  const [nilaiTersimpan, setNilaiTersimpan] = useState(nilaiAwal);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updatedAtRef = useRef<string | null>(updatedAtAwal);
  const mounted = useRef(false);

  // ── pulihkan draft lokal kalau ada (mis. jaringan putus saat menyimpan)
  useEffect(() => {
    if (readOnly) return;
    try {
      const lokal = localStorage.getItem(KUNCI_DRAFT(bagianId));
      if (lokal && lokal !== nilaiAwal) {
        setAdaDraftLokal(true);
      }
    } catch {
      /* localStorage bisa diblokir; abaikan */
    }
  }, [bagianId, nilaiAwal, readOnly]);

  const simpan = useCallback(
    async (nilai?: string) => {
      const isi = nilai ?? konten;
      if (readOnly || isi === nilaiTersimpan) return;

      setMenyimpan(true);
      setGalat(null);
      setKonflik(null);
      try {
        const hasil: HasilSimpan = await saveLedIsian({
          ledBagianId: bagianId,
          konten: isi,
          updatedAtDiketahui: updatedAtRef.current,
        });

        if (!hasil.ok && hasil.konflik) {
          setKonflik(hasil.pesan);
          // Jangan hapus draft lokal — kerjaan user belum masuk server
          try {
            localStorage.setItem(KUNCI_DRAFT(bagianId), isi);
          } catch { /* abaikan */ }
          return;
        }

        if (hasil.ok) {
          setNilaiTersimpan(isi);
          updatedAtRef.current = hasil.updatedAt;
          setTersimpanPada(
            new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          );
          setAdaDraftLokal(false);
          try {
            localStorage.removeItem(KUNCI_DRAFT(bagianId));
          } catch { /* abaikan */ }
          onSaved?.(hasil.updatedAt);
        }
      } catch (e) {
        const pesan = e instanceof Error ? e.message : "Gagal menyimpan.";
        setGalat(pesan);
        // Simpan ke localStorage supaya isi tidak hilang
        try {
          localStorage.setItem(KUNCI_DRAFT(bagianId), isi);
          setAdaDraftLokal(true);
        } catch { /* abaikan */ }
      } finally {
        setMenyimpan(false);
      }
    },
    [bagianId, onSaved, readOnly, konten, nilaiTersimpan],
  );

  // ── autosave setelah berhenti mengetik
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (readOnly) return;
    if (konten === nilaiTersimpan) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void simpan(), DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [konten, readOnly, simpan, nilaiTersimpan]);

  // ── Ctrl/Cmd + S
  useEffect(() => {
    if (readOnly) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void simpan();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [readOnly, simpan]);

  const ulangiDraft = () => {
    try {
      const lokal = localStorage.getItem(KUNCI_DRAFT(bagianId));
      if (lokal) {
        setKonten(lokal);
        setAdaDraftLokal(false);
      }
    } catch { /* abaikan */ }
  };

  const jumlah = konten.length;
  const halaman = estimasiHalaman(jumlah);
  const lewatBatas = jumlah > BATAS_KARAKTER_PER_BAGIAN;
  const kotor = konten !== nilaiTersimpan;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode("tulis")}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
              mode === "tulis"
                ? "bg-white text-slate-800 border border-slate-300 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
            aria-pressed={mode === "tulis"}
          >
            <PencilLine className="w-3.5 h-3.5" /> Tulis
          </button>
          <button
            type="button"
            onClick={() => setMode("pratinjau")}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
              mode === "pratinjau"
                ? "bg-white text-slate-800 border border-slate-300 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
            aria-pressed={mode === "pratinjau"}
          >
            <Eye className="w-3.5 h-3.5" /> Pratinjau
          </button>
        </div>

        <div className="flex items-center gap-3 text-2xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {jumlah.toLocaleString("id-ID")} kar · ±{halaman} hal
          </span>
          {readOnly ? (
            <span className="font-semibold text-slate-400">Hanya baca</span>
          ) : menyimpan ? (
            <span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
              <Loader2 className="w-3 h-3 animate-spin" /> Menyimpan…
            </span>
          ) : galat ? (
            <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
              <AlertCircle className="w-3 h-3" /> Gagal
            </span>
          ) : tersimpanPada ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <Check className="w-3 h-3" /> Tersimpan {tersimpanPada}
            </span>
          ) : kotor ? (
            <span className="text-slate-400">Belum disimpan</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-400">
              <CloudOff className="w-3 h-3" /> Belum ada perubahan
            </span>
          )}
        </div>
      </div>

      {/* Peringatan */}
      {galat && (
        <div className="mx-3 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {galat} — isi kamu masih aman di kotak tulis dan tersimpan sementara di perangkat ini.
        </div>
      )}
      {konflik && (
        <div className="mx-3 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {konflik}{" "}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-bold underline cursor-pointer"
          >
            Muat ulang
          </button>
        </div>
      )}
      {adaDraftLokal && (
        <div className="mx-3 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 inline-flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          Ada draft tersimpan di perangkat ini yang belum masuk server.
          <button type="button" onClick={ulangiDraft} className="font-bold underline cursor-pointer">
            Pulihkan
          </button>
        </div>
      )}
      {lewatBatas && (
        <div className="mx-3 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Isi melebihi batas {BATAS_KARAKTER_PER_BAGIAN.toLocaleString("id-ID")} karakter. Pecah jadi
          beberapa bagian.
        </div>
      )}

      {/* Isi */}
      {mode === "tulis" ? (
        <textarea
          value={konten}
          readOnly={readOnly}
          onChange={(e) => setKonten(e.target.value)}
          onBlur={() => void simpan()}
          placeholder={
            readOnly
              ? "Belum ada isi."
              : "Tulis narasi di sini. Format Markdown didukung: ## judul, **tebal**, - daftar."
          }
          className={cn(
            "w-full min-h-[240px] resize-y px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none font-mono",
            readOnly && "bg-slate-50 text-slate-500 cursor-not-allowed",
          )}
        />
      ) : (
        <div className="min-h-[240px] px-4 py-3">
          {renderMarkdown(konten) ?? (
            <p className="text-sm text-slate-400 italic">Belum ada isi untuk ditampilkan.</p>
          )}
        </div>
      )}
    </div>
  );
}
