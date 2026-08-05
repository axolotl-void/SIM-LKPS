"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, X } from "lucide-react";

interface Dosen {
  id: string;
  nidn: string;
  nama: string;
  jabatanFungsional: string | null;
  pendidikanTerakhir: string;
}

interface DosenSelectProps {
  value: string;
  onChange: (value: string) => void;
  dosens: Dosen[];
  placeholder?: string;
  required?: boolean;
}

export function DosenSelect({
  value,
  onChange,
  dosens,
  placeholder = "Pilih atau ketik nama dosen...",
  required = false,
}: DosenSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter dosens based on input
  const filteredDosens = dosens.filter((dosen) =>
    dosen.nama.toLowerCase().includes(inputValue.toLowerCase()) ||
    dosen.nidn.includes(inputValue)
  );

  // Check if current value is a manual entry
  const selectedDosen = dosens.find((d) => d.nama === value);
  const isManualEntry = value && !selectedDosen;

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
      inputRef.current.select();
    }
  }, [isOpen]);

  const handleSelect = (dosen: Dosen) => {
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
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-2xs font-bold text-slate-700 mb-1.5">
        Nama Ketua / Pejabat {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <User className="h-4 w-4 text-blue-500" />
        </span>

        {/* Input field - can type or select */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-3xs"
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
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-64 overflow-y-auto">
          {filteredDosens.length === 0 && !inputValue ? (
            <div className="px-4 py-4 text-center text-xs text-slate-400">
              Ketik untuk mencari atau menambahkan manual
            </div>
          ) : filteredDosens.length === 0 && inputValue ? (
            <div className="px-4 py-4 text-center text-xs text-slate-500">
              Tidak ada hasil. Ketik manual: "{inputValue}"
            </div>
          ) : (
            filteredDosens.map((dosen) => (
              <button
                key={dosen.id}
                type="button"
                onClick={() => handleSelect(dosen)}
                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-b-0"
              >
                <p className="text-xs font-medium text-slate-800">{dosen.nama}</p>
                <p className="text-2xs text-slate-500">
                  {dosen.nidn} • {dosen.jabatanFungsional || "-"} • {dosen.pendidikanTerakhir}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
