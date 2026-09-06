import Image from "next/image";

/**
 * Shared loading screen — logo UBBG breathing + pulse ring + sweeping progress bar.
 * Used across all dashboard routes & LKPS BAB sections.
 */
export default function Loading() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[60vh] w-full overflow-hidden rounded-3xl"
      style={{
        background:
          "linear-gradient(135deg, #F5F7FA 0%, #E8ECF1 50%, #F0F4F8 100%)",
      }}
    >
      {/* Soft ambient blobs (slow drift, low opacity) */}
      <div
        className="absolute top-12 left-16 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl"
        style={{ animation: "loginDriftA 9s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-16 right-20 h-40 w-40 rounded-full bg-indigo-200/20 blur-2xl"
        style={{ animation: "loginDriftB 11s ease-in-out infinite" }}
      />

      {/* Center stack: logo + progress */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Breathing logo badge */}
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl shadow-blue-500/15 ring-1 ring-slate-200/80"
          style={{ animation: "logoBreathe 2.4s ease-in-out infinite" }}
        >
          <Image
            src="/logo-ubbg.svg"
            alt="Logo UBBG"
            width={56}
            height={56}
            priority
            className="h-12 w-12 object-contain"
          />
          {/* Soft pulse ring expanding outward */}
          <span
            className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-blue-400/40"
            style={{ animation: "logoPulseRing 2.4s ease-out infinite" }}
            aria-hidden
          />
        </div>

        {/* Brand text + status */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black tracking-wider text-slate-700">
              SIM
            </span>
            <span className="text-sm font-black tracking-wider text-blue-600">
              LKPS
            </span>
          </div>
          <p className="text-2xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Memuat data…
          </p>
        </div>

        {/* Progress bar — sweeping gradient */}
        <div className="relative h-1 w-48 overflow-hidden rounded-full bg-slate-200/60 sm:w-56">
          <div
            className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400"
            style={{ animation: "progressSweep 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
