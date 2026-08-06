"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Github,
  Instagram,
  ArrowLeft,
  Code2,
  Globe,
  Sparkles,
  MapPin,
  Briefcase,
  Copy,
  Check,
  Star,
  GitFork,
  Database,
  Layers,
  Rocket,
  ExternalLink,
  Terminal,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: "whatsapp" | "email" | "github" | "instagram" | "portfolio";
  external: boolean;
}

interface DeveloperInfo {
  name: string;
  role: string;
  project: string;
  institution: string;
  bio: string;
  photoUrl: string;
  repoUrl: string;
  stats: { tables: number; roles: number; stack: string };
  message: string;
  contacts: ContactLink[];
}

const ICON_MAP = {
  whatsapp: MessageCircle,
  email: Mail,
  github: Github,
  instagram: Instagram,
  portfolio: Globe,
} as const;

const TONE = {
  whatsapp: {
    ring: "ring-emerald-200/70",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  email: {
    ring: "ring-rose-200/70",
    chip: "bg-rose-50 text-rose-700 border-rose-200",
    icon: "from-rose-500 to-orange-500",
    shadow: "shadow-rose-500/20",
  },
  github: {
    ring: "ring-slate-300",
    chip: "bg-slate-100 text-slate-700 border-slate-300",
    icon: "from-slate-700 to-slate-900",
    shadow: "shadow-slate-500/20",
  },
  instagram: {
    ring: "ring-pink-200/70",
    chip: "bg-pink-50 text-pink-700 border-pink-200",
    icon: "from-amber-500 via-rose-500 to-fuchsia-500",
    shadow: "shadow-rose-500/20",
  },
  portfolio: {
    ring: "ring-sky-200/70",
    chip: "bg-sky-50 text-sky-700 border-sky-200",
    icon: "from-sky-500 to-indigo-600",
    shadow: "shadow-sky-500/20",
  },
} as const;

export function DeveloperClient({ developer }: { developer: DeveloperInfo }) {
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [repoCopied, setRepoCopied] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  const handleCopy = async (key: string, value: string, isRepo = false) => {
    try {
      await navigator.clipboard.writeText(value);
      if (isRepo) {
        setRepoCopied(true);
        setTimeout(() => setRepoCopied(false), 1500);
      } else {
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
      }
    } catch {
      /* ignore */
    }
  };

  const initials = developer.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-[calc(100vh-2rem)] p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-5xl"
      >
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Open to collaboration
          </div>
        </div>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
          {/* Animated gradient border accent */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400"
          />
          {/* Ambient blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/40 to-cyan-200/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-amber-200/30 to-rose-200/30 blur-3xl"
          />

          <div className="relative p-6 sm:p-10">
            {/* Header: profile photo + identity */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar block */}
              <div className="relative shrink-0">
                {/* Outer rotating gradient ring */}
                <div
                  aria-hidden
                  className="absolute -inset-1.5 rounded-3xl bg-[conic-gradient(from_180deg_at_50%_50%,#38bdf8_0deg,#34d399_120deg,#fbbf24_240deg,#38bdf8_360deg)] opacity-70 blur-md"
                />
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-400 opacity-90" />

                {/* Avatar frame */}
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-slate-200 shadow-lg shadow-slate-900/20 sm:h-28 sm:w-28">
                  {photoFailed ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 text-2xl font-bold text-white sm:text-3xl">
                      {initials}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={developer.photoUrl}
                      alt={`Foto ${developer.name}`}
                      onError={() => setPhotoFailed(true)}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>

                {/* Verified badge */}
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 shadow-md">
                  <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {developer.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" strokeWidth={2.5} />
                    v1.0
                  </span>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <Briefcase className="h-3.5 w-3.5" strokeWidth={2} />
                    {developer.role}
                  </span>
                  <span className="hidden text-slate-300 sm:inline">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                    Aceh, Indonesia
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    <Rocket className="h-3 w-3" strokeWidth={2.5} />
                    {developer.project}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    {developer.institution}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                    Prodi Ilmu Komputer
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              {developer.bio}
            </p>

            {/* Stats row */}
            <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Layers className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">
                      {developer.stats.tables}
                    </p>
                    <p className="text-xs font-medium text-slate-500">Tabel LKPS</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Database className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">
                      {developer.stats.roles}
                    </p>
                    <p className="text-xs font-medium text-slate-500">User Roles</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Terminal className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-base font-bold tracking-tight text-slate-900">
                      {developer.stats.stack}
                    </p>
                    <p className="text-xs font-medium text-slate-500">Stack</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Repo CTA card */}
            <motion.a
              href={developer.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ y: -2 }}
              className="group mt-5 block overflow-hidden rounded-2xl border border-slate-900 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-lg shadow-slate-900/20 transition-shadow duration-200 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 0%, rgba(56,189,248,0.25), transparent 50%), radial-gradient(circle at 80% 100%, rgba(16,185,129,0.20), transparent 50%)",
                }}
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur">
                    <Github className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">Source Code</p>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Public
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-xs text-slate-300">
                      github.com/axolotl-void/SIM-LKPS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCopy("repo", developer.repoUrl, true);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors duration-200 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {repoCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2.5} />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <GitFork className="h-3.5 w-3.5" strokeWidth={2} />
                        Clone URL
                      </>
                    )}
                  </button>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-transform duration-200 group-hover:translate-x-0.5">
                    Buka Repo
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </motion.a>

            {/* Section title */}
            <div className="mt-10 flex items-center gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Hubungi Saya
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
            </div>
            <p className="mt-2 text-sm text-slate-500">{developer.message}</p>

            {/* Contact grid */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {developer.contacts.map((contact, idx) => {
                const Icon = ICON_MAP[contact.icon];
                const tone = TONE[contact.icon];
                const isCopied = copied === contact.label;
                return (
                  <motion.div
                    key={contact.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 + idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-inset ${tone.ring} transition-shadow duration-200 hover:shadow-md ${tone.shadow}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone.icon} text-white shadow-md ${tone.shadow}`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {contact.label}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                          {contact.value}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={contact.href}
                        target={contact.external ? "_blank" : undefined}
                        rel={contact.external ? "noopener noreferrer" : undefined}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${tone.chip} hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                      >
                        Buka
                        <Globe className="h-3 w-3" strokeWidth={2} />
                      </a>
                      <button
                        onClick={() => handleCopy(contact.label, contact.value)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label={`Salin ${contact.label}`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
                            Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" strokeWidth={2} />
                            Salin
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-10 border-t border-slate-200 pt-5">
              <p className="flex items-center justify-center gap-1.5 text-center text-xs leading-relaxed text-slate-400">
                <span>Dibangun dengan Next.js 15, Prisma, dan PostgreSQL.</span>
                <Heart className="h-3 w-3 text-rose-400" strokeWidth={2} />
                <span>untuk akreditasi Indonesia.</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
