import Image from "next/image";

/**
 * Left pane branding. Mirrors DESAIN-LOGIN-PAGE 1:1:
 *  - UBBG lockup (gradient square + school icon + UBBG text)
 *  - Center: SIMLKPS headline (gradient on "LKPS") + sub-heading w/ gradient bar + paragraph + image ilustrasi
 *  - Footer "© 2026 BTIK"
 *
 * Visual stagger handled by CSS (login-stagger-N classes from globals.css).
 * Pointer-events enabled inside the aside since shell sets pointer-events:none.
 */
export function LoginVisual() {
  return (
    <aside
      className="flex w-full max-w-[1920px] flex-col justify-between gap-0 px-6 py-8 sm:px-10 md:px-12 lg:px-14 xl:px-16 lg:py-10 xl:py-12 2xl:py-12 2xl:max-w-[2400px] relative z-0 pointer-events-auto mx-auto h-full select-none"
    >
      {/* Header Logo / Universitas Branding */}
      <div className="login-stagger-item login-stagger-1 flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md shadow-blue-500/10 ring-1 ring-slate-200/80 2xl:h-[52px] 2xl:w-[52px]">
          <Image
            src="/logo-ubbg.svg"
            alt="Logo Universitas Bina Bangsa Getsempena"
            width={32}
            height={32}
            priority
            className="h-7 w-7 object-contain 2xl:h-8 2xl:w-8"
          />
        </div>
        <div>
          <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Universitas Bina Bangsa Getsempena
          </p>
          <p className="mt-0.5 text-xs font-medium tracking-wide text-slate-500">
            Jurusan Ilmu Komputer &amp; Fakultas Sains, Humaniora &amp; Teknologi
          </p>
        </div>
      </div>

      {/* Middle: headline + sub + paragraph + ilustrasi */}
      <div className="relative my-auto flex flex-col justify-center py-2 xl:py-4">
        {/* Main heading — Geist display */}
        <h1
          className="login-stagger-item login-stagger-2 font-sans font-light tracking-[-0.04em] leading-[0.92] text-slate-900"
          style={{ fontFamily: "'Geist', 'Plus Jakarta Sans', system-ui, sans-serif", fontSize: "clamp(3.5rem, 8vw, 7rem)", letterSpacing: "-0.045em" }}
        >
          SIM
          <span className="bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 bg-clip-text font-medium text-transparent">
            LKPS
          </span>
        </h1>

        {/* Sub heading with gradient bar */}
        <div className="login-stagger-item login-stagger-3 mt-5 flex items-start gap-3.5">
          <div className="mt-1.5 h-14 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-blue-600 via-sky-500 to-cyan-400 sm:h-16" />
          <div>
            <h2
              className="font-sans font-semibold tracking-tight leading-[1.15] text-slate-800"
              style={{ fontFamily: "'Geist', 'Plus Jakarta Sans', system-ui, sans-serif", fontSize: "clamp(1.25rem, 1.8vw, 1.625rem)" }}
            >
              Sistem Manajemen Laporan Kinerja Program Studi
            </h2>
            <p className="mt-1.5 text-sm font-semibold tracking-wide text-blue-600 xl:text-base">
              Jurusan Ilmu Komputer &nbsp;Universitas Bina Bangsa Getsempena
            </p>
          </div>
        </div>

        {/* Paragraph */}
        <p
          className="login-stagger-item login-stagger-4 mt-5 max-w-xl font-normal leading-[1.65] text-slate-600"
          style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.0625rem)" }}
        >
          Platform terintegrasi untuk pelaporan capaian tridharma, pemantauan
          akreditasi program studi, dan tata kelola administrasi akademik yang
          mutakhir, presisi, serta transparan.
        </p>

        {/* Ilustrasi */}
        <div className="animate-login-illustration-entrance mt-4 max-w-[480px] xl:mt-5 xl:max-w-[530px] 2xl:max-w-[620px] pointer-events-none relative">
          <div className="animate-login-illustration-float">
            <Image
              src="/img/akademik-ilustrasi.jpg"
              alt="Ilustrasi Akademik SIM-LKPS"
              width={512}
              height={343}
              priority
              className="h-auto max-h-[220px] w-full object-contain drop-shadow-[0_12px_24px_rgba(37,99,235,0.08)] select-none xl:max-h-[260px] 2xl:max-h-[320px]"
            />
          </div>
        </div>
      </div>

      {/* Footer — mini brand row */}
      <div className="login-stagger-item login-stagger-5 flex items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80">
            <Image
              src="/logo-ubbg.svg"
              alt="Logo UBBG"
              width={22}
              height={22}
              className="h-5 w-5 object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              BTIK UBBG
            </span>
            <span className="text-[10px] font-medium tracking-wide text-slate-400">
              Badan TI &amp; Komunikasi
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
          <span className="font-mono">v1.0.0</span>
          <span className="text-slate-300">·</span>
          <span>© 2026</span>
        </div>
      </div>
    </aside>
  );
}
