"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function SecurityFooter() {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={
        reduced ? undefined : { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }
      }
      className="mt-8 flex flex-col items-center gap-2 text-center text-[11.5px] text-white/70"
    >
      <div className="flex items-center gap-2 text-white/85">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
        <span className="font-medium">Sistem aman terproteksi</span>
        <span aria-hidden className="text-white/30">
          ·
        </span>
        <span>Data Anda dilindungi</span>
      </div>
      <p className="text-[11px] text-white/50">
        © {new Date().getFullYear()} Universitas Bina Bangsa Getsempena
      </p>
    </motion.div>
  );
}