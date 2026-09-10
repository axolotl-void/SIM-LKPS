"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, X, Database } from "lucide-react";

export interface DosenOption {
  id: string;
  nidn: string;
  nama: string;
  jabatanFungsional: string | null;
  pendidikanTerakhir: string;
}

export type DosenAccent =
  | "blue"
  | "teal"
  | "indigo"
  | "purple"
  | "orange"
  | "cyan"
  | "pink";

const ACCENTS: Record<
  DosenAccent,
  { icon: string; border: string; focusSm: string; focusMd: string; hover: string; header: string; sub: string }
> = {
  blue: {
    icon: "text-blue-500",
    border: "border-slate-200",
    focusSm: "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    focusMd: "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    hover: "hover:bg-blue-50",
    header: "bg-blue-50 text-blue-700",
    sub: "text-slate-500",
  },
  teal: {
    icon: "text-teal-500",
    border: "border-teal-200",
    focusSm: "focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
    focusMd: "focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
    hover: "hover:bg-teal-50",
    header: "bg-teal-50 text-teal-700",
    sub: "text-slate-500",
  },
  indigo: {
    icon: "text-indigo-500",
    border: "border-indigo-200",
    focusSm: "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
    focusMd: "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
    hover: "hover:bg-indigo-50",
    header: "bg-indigo-50 text-indigo-700",
    sub: "text-slate-500",
  },
  purple: {
    icon: "text-purple-500",
    border: "border-purple-200",
    focusSm: "focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
    focusMd: "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
    hover: "hover:bg-purple-50",
    header: "bg-purple-50 text-purple-700",
    sub: "text-slate-500",
  },
  orange: {
    icon: "text-orange-500",
    border: "border-orange-200",
    focusSm: "focus:border-orange-500 focus:ring-1 focus:ring-orange-500",
    focusMd: "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
    hover: "hover:bg-orange-50",
    header: "bg-orange-50 text-orange-700",
    sub: "text-slate-500",
  },
  cyan: {
    icon: "text-cyan-500",
    border: "border-cyan-200",
    focusSm: "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500",
    focusMd: "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
    hover: "hover:bg-cyan-50",
    header: "bg-cyan-50 text-cyan-700",
    sub: "text-slate-500",
  },
  pink: {
    icon: "text-pink-500",
    border: "border-pink-200",
    focusSm: "focus:border-pink-500 focus:ring-1 focus:ring-pink-500",
    focusMd: "focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
    hover: "hover:bg-pink-50",
    header: "bg-pink-50 text-pink-700",
    sub: "text-slate-500",
  },
};

interface DosenSelectProps {
  value: string;
  onChange: (value: string) => void;
  dosens: DosenOption[];
  /** Label di atas input. Default: "Nama Ketua / Pejabat" */
  label?: string;
  placeholder?: string;
  required?: boolean;
  /** Warna aksen mengikuti BAB/tabel. Default: "blue" (BAB 1) */
  accent?: DosenAccent;
  /** "sm" = gaya BAB 1, "md" = gaya modal tabel BAB 3 & 4. Default: "sm" */
  size?: "sm" | "md";
}

/**
 * Combobox nama dosen yang terhubung ke Master Data Dosen.
 * Ketik untuk memfilter (nama atau NIDN), klik untuk memilih, atau ketik manual
 * kalau nama tidak ada di master data.
 */
export function DosenSelect({
  value,
  onChange,
  dosens,
  label = "Nama Ketua / Pejabat",
  placeholder = "Pilih atau ketik nama dosen...",
  required = false,
  accent = "blue",
  size = "sm",
}: DosenSelectProps) {
  const a = ACCENTS[accent];
  const isMd = size === "md";

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter dosens based on input (nama atau NIDN)
  const q = inputValue.trim().toLowerCase();
  const filteredDosens = dosens.filter(
    (dosen) => dosen.nama.toLowerCase().includes(q) || dosen.nidn.toLowerCase().includes(q)
  );

  // Check if current value is a manual entry
  const selectedDosen = dosens.find((d) => d.nama === value);
  const isManualEntry = Boolean(value) && !selectedDosen;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset to selected value if not submitting
        if (!isManualEntry) {
          setInputValue(value);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, isManualEntry]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (dosen: DosenOption) => {
    onChange(dosen.nama);
    setInputValue(dosen.nama);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleClear = () => {
    onChange("");
    setInputValue("");
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label
        className={
          isMd
            ? "block text-2xs font-bold text-slate-600 mb-1"
            : "block text-2xs font-bold text-slate-700 mb-1.5"
        }
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className={`absolute inset-y-0 left-0 flex items-center ${isMd ? "pl-3.5" : "pl-3"}`}>
          <User className={`h-4 w-4 ${a.icon}`} />
        </span>

        {/* Input field - can type or select */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white transition-all focus:outline-none ${a.border} ${
            isMd
              ? `py-3 pl-11 pr-10 text-sm font-semibold shadow-sm placeholder:text-slate-300 ${a.focusMd}`
              : `py-2.5 pl-10 pr-10 text-xs shadow-3xs ${a.focusSm}`
          }`}
        />

        {/* Clear / Toggle button */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {inputValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform cursor-pointer ${isOpen ? "rotate-180" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Header: sumber data */}
          <div className={`flex items-center justify-between px-4 py-2 ${a.header} border-b border-white/60`}>
            <span className="flex items-center gap-1.5 text-3xs font-black uppercase tracking-wider">
              <Database className="h-3 w-3" /> Master Data Dosen
            </span>
            <span className="text-3xs font-bold">
              {filteredDosens.length}/{dosens.length}
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto">
            {filteredDosens.length === 0 ? (
              <div className="px-4 py-4 text-center text-xs text-slate-500">
                {inputValue
                  ? `Tidak ada di master data. Tetap pakai nama manual: "${inputValue}"`
                  : "Master data dosen masih kosong."}
              </div>
            ) : (
              filteredDosens.map((dosen) => (
                <button
                  key={dosen.id}
                  type="button"
                  onClick={() => handleSelect(dosen)}
                  className={`w-full px-4 py-2.5 text-left ${a.hover} transition-colors border-b border-slate-50 last:border-b-0`}
                >
                  <p className={`${isMd ? "text-sm font-semibold" : "text-xs font-medium"} text-slate-800`}>
                    {dosen.nama}
                  </p>
                  <p className={`text-2xs ${a.sub}`}>
                    {dosen.nidn} • {dosen.jabatanFungsional || "-"} • {dosen.pendidikanTerakhir}
                  </p>
                </button>
              ))
            )}
          </div>

          {isManualEntry && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 text-3xs font-semibold text-amber-700">
              Nama ini tidak ada di master data dosen — tersimpan sebagai entri manual.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
