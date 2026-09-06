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
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20 2xl:h-[52px] 2xl:w-[52px]">
          <span className="material-symbols-outlined text-2xl 2xl:text-3xl">school</span>
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
        {/* Main heading */}
        <h1 className="login-stagger-item login-stagger-2 text-4xl font-black tracking-tight leading-[1.08] text-slate-900 sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] 2xl:text-6xl">
          SIM
          <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
            LKPS
          </span>
        </h1>

        {/* Sub heading with gradient bar */}
        <div className="login-stagger-item login-stagger-3 mt-3 flex items-start gap-3">
          <div className="mt-0.5 h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-blue-600 to-sky-400 sm:h-11" />
          <div>
            <h2 className="text-base font-bold tracking-tight leading-snug text-slate-800 sm:text-lg xl:text-xl">
              Sistem Manajemen Laporan Kinerja Program Studi
            </h2>
            <p className="mt-0.5 text-xs font-semibold tracking-wide text-blue-600 xl:text-sm">
              Jurusan Ilmu Komputer &nbsp;Universitas Bina Bangsa Getsempena
            </p>
          </div>
        </div>

        {/* Paragraph */}
        <p className="login-stagger-item login-stagger-4 mt-3.5 max-w-lg text-xs font-normal leading-relaxed text-slate-600 sm:text-sm">
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

      {/* Footer */}
      <div className="login-stagger-item login-stagger-5 flex items-center gap-2 text-xs font-medium text-slate-400">
        <span>© 2026 BTIK</span>
      </div>
    </aside>
  );
}
