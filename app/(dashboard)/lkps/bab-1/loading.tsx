import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[60vh] w-full overflow-hidden rounded-3xl"
      style={{
        background:
          "linear-gradient(135deg, #F5F7FA 0%, #E8ECF1 50%, #F0F4F8 100%)",
      }}
    >
      {/* Decorative blobs - soft floating shapes */}
      <div className="absolute top-12 left-16 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl animate-blob" />
      <div
        className="absolute bottom-16 right-20 h-40 w-40 rounded-full bg-indigo-200/20 blur-2xl animate-blob"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-purple-200/20 blur-2xl animate-blob"
        style={{ animationDelay: "4s" }}
      />

      {/* Center loader */}
      <div className="relative flex flex-col items-center gap-7">
        {/* Outer rotating ring (dashed) */}
        <div className="relative h-32 w-32">
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 8"
              className="text-slate-300/70 animate-[spin_8s_linear_infinite]"
            />
          </svg>

          {/* Middle ring (gradient, faster) */}
          <svg
            className="absolute inset-2 -rotate-90"
            viewBox="0 0 120 120"
            fill="none"
          >
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="url(#brandGrad)"
              strokeWidth="3"
              strokeDasharray="100 240"
              strokeLinecap="round"
              className="animate-[spin_1.4s_ease-in-out_infinite]"
            />
          </svg>

          {/* Inner pulse ring */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 animate-pulse" />

          {/* Logo badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-8 w-8 text-white" strokeWidth={2.2} />
              {/* Tiny corner accent */}
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand text */}
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

        {/* Progress bar dots */}
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-[bounce_1.2s_ease-in-out_infinite]" />
          <div
            className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-[bounce_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: "0.15s" }}
          />
          <div
            className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-[bounce_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
}
