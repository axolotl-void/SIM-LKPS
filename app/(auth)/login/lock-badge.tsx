"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";

export function LockBadge() {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      aria-hidden
      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
      animate={reduced ? undefined : { opacity: 1, scale: 1 }}
      transition={reduced ? undefined : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="absolute -top-7 left-1/2 z-10 -translate-x-1/2"
    >
      <div className="relative">
        {/* Outer ring */}
        <div
          className="absolute inset-0 -m-2 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, rgba(59,130,246,0.35), rgba(124,58,237,0.35), rgba(59,130,246,0.35))",
            opacity: 0.5,
            filter: "blur(8px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-full ring-2 ring-white"
          style={{
            background:
              "linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #7C3AED 100%)",
            boxShadow:
              "0 12px 28px -10px rgba(37,99,235,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          <Lock className="h-6 w-6 text-white" strokeWidth={2.2} />
        </div>
      </div>
    </motion.div>
  );
}