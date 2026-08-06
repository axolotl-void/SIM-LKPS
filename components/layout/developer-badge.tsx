"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ChevronUp,
  Code2,
  Github,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { developer, type DeveloperInfo } from "@/lib/config/developer";

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.96,
    transition: { duration: 0.22 },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

interface ContactRow {
  key: keyof DeveloperInfo["contacts"];
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  hint: string;
}

const ROWS: ContactRow[] = [
  {
    key: "whatsapp",
    label: developer.contacts.whatsapp.label,
    href: developer.contacts.whatsapp.href,
    Icon: MessageCircle,
    hint: "WhatsApp",
  },
  {
    key: "phone",
    label: developer.contacts.phone.label,
    href: developer.contacts.phone.href,
    Icon: Phone,
    hint: "Telepon",
  },
  {
    key: "email",
    label: developer.contacts.email.label,
    href: developer.contacts.email.href,
    Icon: Mail,
    hint: "Email UBBG",
  },
  {
    key: "gmail",
    label: developer.contacts.gmail.label,
    href: developer.contacts.gmail.href,
    Icon: Mail,
    hint: "Gmail",
  },
  {
    key: "github",
    label: developer.contacts.github.label,
    href: developer.contacts.github.href,
    Icon: Github,
    hint: "GitHub",
  },
  {
    key: "instagram",
    label: developer.contacts.instagram.label,
    href: developer.contacts.instagram.href,
    Icon: Instagram,
    hint: "Instagram",
  },
];

export function DeveloperBadge() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full">
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="pill"
            type="button"
            onClick={() => setOpen(true)}
            whileHover={reduced ? undefined : { y: -1, scale: 1.01 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            aria-label="Tampilkan info developer"
            aria-expanded={false}
            className="group inline-flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-sky-300/40 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 px-5 text-left text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.55)] transition-shadow hover:shadow-[0_14px_30px_-10px_rgba(37,99,235,0.70)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[12px] font-bold tracking-tight ring-1 ring-white/25 backdrop-blur-sm"
              aria-hidden
            >
              {developer.initials}
            </span>
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-white/75">
                Dikembangkan oleh
              </span>
              <span className="text-[14px] font-semibold tracking-tight">
                {developer.shortName}
              </span>
            </span>
            <ChevronUp
              className="h-4 w-4 text-white/80 transition-transform group-hover:-translate-y-0.5"
              aria-hidden
            />
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            role="dialog"
            aria-label={`Informasi kontak ${developer.shortName}`}
            variants={reduced ? undefined : panelVariants}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "show"}
            exit={reduced ? undefined : "exit"}
            className="relative w-full overflow-hidden rounded-2xl border border-white/40 bg-white/95 backdrop-blur-md sm:w-[320px]"
            style={{
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.9) inset, 0 24px 48px -16px rgba(15,23,42,0.35), 0 8px 24px -10px rgba(37,99,235,0.30)",
            }}
          >
            {/* Top gradient strip */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
              style={{
                background:
                  "linear-gradient(90deg, #38BDF8 0%, #2563EB 50%, #7C3AED 100%)",
              }}
            />

            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup panel info developer"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3 px-4 pb-3 pt-5">
              <div
                className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${developer.accentClass} text-[13px] font-bold text-white shadow-sm ring-1 ring-white/30`}
                aria-hidden
              >
                {developer.initials}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/15"
                />
              </div>
              <div className="min-w-0 pr-6">
                <p className="truncate text-[13.5px] font-semibold tracking-tight text-slate-900">
                  {developer.name}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-slate-500">
                  <Code2 className="h-3 w-3" aria-hidden />
                  {developer.role}
                </p>
              </div>
            </div>

            <p className="px-4 pb-3 text-[11.5px] leading-snug text-slate-500">
              {developer.bio}
            </p>

            <div className="h-px bg-slate-100" aria-hidden />

            {/* Contact list */}
            <motion.ul
              variants={reduced ? undefined : listVariants}
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "show"}
              className="flex flex-col gap-0.5 p-2"
            >
              {ROWS.map((row) => {
                const Icon = row.Icon;
                return (
                  <motion.li key={row.key} variants={reduced ? undefined : itemVariants}>
                    <a
                      href={row.href}
                      target={row.href.startsWith("http") ? "_blank" : undefined}
                      rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                    >
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70 transition-colors group-hover:bg-sky-50 group-hover:text-sky-700 group-hover:ring-sky-200"
                        aria-hidden
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                          {row.hint}
                        </span>
                        <span className="truncate text-[12.5px] font-medium text-slate-800">
                          {row.label}
                        </span>
                      </span>
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-center text-[10.5px] text-slate-400">
              Built with care · SIM-LKPS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}