"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Github, Instagram, ArrowLeft, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: "whatsapp" | "email" | "github" | "instagram";
  external: boolean;
}

interface DeveloperInfo {
  name: string;
  role: string;
  project: string;
  institution: string;
  message: string;
  contacts: ContactLink[];
}

const ICON_MAP = {
  whatsapp: MessageCircle,
  email: Mail,
  github: Github,
  instagram: Instagram,
} as const;

const ICON_COLOR = {
  whatsapp: "from-emerald-500 to-green-600",
  email: "from-rose-500 to-red-600",
  github: "from-slate-700 to-slate-900",
  instagram: "from-fuchsia-500 via-pink-500 to-amber-500",
} as const;

export function DeveloperClient({ developer }: { developer: DeveloperInfo }) {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        {/* Profile card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          {/* Subtle ambient blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200/30 to-sky-200/30 blur-3xl"
          />

          <div className="relative">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30">
                <Code2 className="h-8 w-8" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {developer.name}
                </h1>
                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  {developer.role}
                </p>
              </div>
            </div>

            {/* Project badge */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {developer.project}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {developer.institution}
              </span>
            </div>

            {/* Message */}
            <p className="mt-6 text-[15px] leading-relaxed text-slate-600">
              {developer.message}
            </p>

            {/* Contact grid */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {developer.contacts.map((contact, idx) => {
                const Icon = ICON_MAP[contact.icon];
                return (
                  <motion.a
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ICON_COLOR[contact.icon]} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {contact.label}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                        {contact.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="mt-8 border-t border-slate-200 pt-5">
              <p className="text-center text-xs text-slate-400">
                Sistem ini akan terus berkembang. Kontak tersedia untuk alumni
                dan staf kampus yang ingin melanjutkan pengembangan.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
