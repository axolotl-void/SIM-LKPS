"use client";

import { useState, useTransition } from "react";
import { Paperclip, Trash2, Plus, ExternalLink, Loader2, FileText } from "lucide-react";
import { addLedEvidence, deleteLedEvidence } from "@/lib/actions/led";
import type { LedBuktiData } from "./types";

type Props = {
  bagianId: string;
  evidence: LedBuktiData[];
  readOnly?: boolean;
};

export function LedEvidenceList({ bagianId, evidence, readOnly = false }: Props) {
  const [daftar, setDaftar] = useState(evidence);
  const [nama, setNama] = useState("");
  const [link, setLink] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [formBuka, setFormBuka] = useState(false);

  const tambah = () => {
    if (!nama.trim()) {
      setGalat("Nama berkas wajib diisi.");
      return;
    }
    if (!link.trim()) {
      setGalat("Tempel tautan berkas atau dokumen bukti.");
      return;
    }
    setGalat(null);
    startTransition(async () => {
      try {
        const hasil = await addLedEvidence({
          ledBagianId: bagianId,
          filename: nama.trim(),
          linkUrl: link.trim(),
        });
        if (hasil.ok) {
          setDaftar((d) => [
            ...d,
            {
              id: hasil.bukti.id,
              filename: hasil.bukti.filename,
              linkUrl: hasil.bukti.linkUrl,
              keterangan: null,
              createdAt: new Date(hasil.bukti.createdAt).toISOString(),
            },
          ]);
          setNama("");
          setLink("");
          setFormBuka(false);
        }
      } catch (e) {
        setGalat(e instanceof Error ? e.message : "Gagal menambah bukti.");
      }
    });
  };

  const hapus = (id: string) => {
    const lama = daftar;
    setDaftar((d) => d.filter((x) => x.id !== id));
    startTransition(async () => {
      try {
        await deleteLedEvidence({ evidenceId: id });
      } catch (e) {
        setDaftar(lama); // kembalikan kalau server menolak
        setGalat(e instanceof Error ? e.message : "Gagal menghapus bukti.");
      }
    });
  };

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 text-2xs font-bold text-slate-600">
          <Paperclip className="w-3.5 h-3.5" /> Bukti Pendukung ({daftar.length})
        </span>
        {!readOnly && (
          <button
            type="button"
            onClick={() => setFormBuka((v) => !v)}
            className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Tambah
          </button>
        )}
      </div>

      {daftar.length === 0 && !formBuka && (
        <p className="text-2xs text-slate-400 italic">Belum ada bukti pendukung.</p>
      )}

      {daftar.length > 0 && (
        <ul className="space-y-1.5 mb-2">
          {daftar.map((b) => (
            <li
              key={b.id}
              className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-700 truncate flex-1">{b.filename}</span>
              {b.linkUrl && (
                <a
                  href={b.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:text-slate-900 cursor-pointer"
                  title="Buka bukti"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => hapus(b.id)}
                  disabled={pending}
                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                  title="Hapus bukti"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {formBuka && !readOnly && (
        <div className="space-y-2 mt-2">
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama berkas, mis. RPS Algoritma 2025"
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://tautan-berkas-atau-dokumen"
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={tambah}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-2xs font-bold text-white hover:bg-slate-900 transition-colors cursor-pointer disabled:opacity-60"
            >
              {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              Simpan bukti
            </button>
            <button
              type="button"
              onClick={() => {
                setFormBuka(false);
                setGalat(null);
              }}
              className="text-2xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {galat && <p className="mt-2 text-2xs text-red-600">{galat}</p>}
    </div>
  );
}
