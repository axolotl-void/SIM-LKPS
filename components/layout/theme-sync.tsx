"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "sim-lkps-theme";

/**
 * Rute yang SELALU terang — tidak pernah ikut mode gelap.
 *
 * Login sengaja dipaksa terang: form masuk sebaiknya tetap seperti biasa dan
 * tidak berubah warna cuma karena pengguna memilih mode gelap di dashboard.
 *
 * Catatan: daftar ini juga disalin ke skrip anti-kedip di `app/layout.tsx`
 * (skrip itu jalan sebelum React hydrate, jadi tidak bisa impor dari sini).
 * Kalau menambah rute terang baru, ubah di dua tempat.
 */
const LIGHT_ROUTES = ["/login"];

function isLightRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return LIGHT_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

/**
 * Menjaga class `dark` pada <html> tetap sinkron dengan rute yang sedang dibuka.
 *
 * - Di rute terang (login): class `dark` dilepas, apa pun pilihan pengguna.
 * - Di rute lain: tema dipasang ulang dari localStorage / preferensi sistem,
 *   supaya pilihan pengguna tetap terbawa setelah keluar dari halaman login.
 */
export function ThemeSync() {
  const pathname = usePathname();
  const forceLight = isLightRoute(pathname);

  useEffect(() => {
    const root = document.documentElement;

    if (forceLight) {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      return;
    }

    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;

    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  }, [forceLight, pathname]);

  return null;
}
