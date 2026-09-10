"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "sim-lkps-theme";

/**
 * Tombol pengalih mode terang / gelap.
 *
 * Pilihan disimpan di localStorage (`sim-lkps-theme`). Pada kunjungan
 * pertama (belum ada pilihan) tema mengikuti preferensi sistem —
 * penentuannya dilakukan script inline di app/layout.tsx sebelum paint,
 * jadi tidak ada kedipan putih saat halaman dimuat.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    // Samakan color-scheme bawaan browser (scrollbar, kontrol form) dengan tema.
    // Tanpa ini, nilai inline dari ThemeSync bisa "menang" atas aturan `.dark`.
    root.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      /* localStorage bisa diblokir — tema tetap jalan untuk sesi ini */
    }
    setIsDark(dark);
  };

  return (
    <button
      type="button"
      onClick={() => applyTheme(!isDark)}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={isDark}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-colors duration-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </button>
  );
}

export default ThemeToggle;
