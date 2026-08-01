"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle2 } from "lucide-react";

interface HeroBannerProps {
  userName: string;
  userRole: string;
  tablesFilled: number;
  totalTables: number;
  approved: number;
  mahasiswaCount: number;
  dosenCount: number;
}

export function HeroBanner({
  userName,
  userRole,
  tablesFilled,
  totalTables,
  approved,
  mahasiswaCount,
  dosenCount,
}: HeroBannerProps) {
  const [animated, setAnimated] = useState(false);
  const [barHeights, setBarHeights] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
      setBarHeights([38, 62, 45, 78, 55, 88, 68]);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const barColors = [
    "#A5B4FC", "#818CF8", "#A5B4FC", "#6366F1", "#818CF8", "#6366F1", "#818CF8",
  ];

  return (
    <>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(-50%) rotate(-4deg); }
          50% { transform: translateY(-52%) rotate(-4deg); }
        }
        @keyframes heroWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }
        .hero-float-anim {
          animation: heroFloat 5s ease-in-out infinite;
        }
        .hero-wave-anim {
          animation: heroWave 8s linear infinite;
        }
      `}</style>

      <section
        className="relative rounded-2xl overflow-hidden flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 35%, #6366F1 75%, #818CF8 100%)",
          boxShadow: "0 4px 6px rgba(30, 27, 75, 0.1), 0 10px 20px rgba(30, 27, 75, 0.15)",
          minHeight: "clamp(120px, 15vw, 160px)",
          padding: "clamp(16px, 3vw, 28px)",
        }}
      >
        {/* Floating dots */}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/20 z-10 hidden sm:block" style={{ top: "22px", right: "340px" }} />
        <div className="absolute w-2 h-2 rounded-full bg-white/15 z-10 hidden sm:block" style={{ top: "45px", right: "380px" }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/25 z-10 hidden sm:block" style={{ top: "18px", right: "400px" }} />

        {/* Content */}
        <div className="relative z-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 mb-2 sm:mb-3.5"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-white/80"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
            </svg>
            <span className="text-[10px] sm:text-[11px] font-medium text-white/80">Tahun Ajaran 2025/2026</span>
          </div>

          {/* Title - Fluid font size */}
          <h2 className="text-white font-bold mb-1" style={{
            fontSize: "clamp(16px, 3vw, 25px)",
            letterSpacing: "-0.4px"
          }}>
            Selamat Datang kembali, {userName}!
          </h2>

          {/* Subtitle - Fluid font size */}
          <p className="text-white/60 mb-3 sm:mb-4" style={{ fontSize: "clamp(11px, 1.5vw, 13px)" }}>
            SIM-LKPS • {userRole}
          </p>

          {/* Stats - Fluid */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] bg-white/15 rounded flex items-center justify-center">
                <FileText className="w-3 h-3 text-white/85" />
              </div>
              <span className="text-white/90 font-medium" style={{ fontSize: "clamp(10px, 1.3vw, 12px)" }}>
                <span className="font-bold">{tablesFilled}</span>/{totalTables} tabel terisi
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] bg-white/15 rounded flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white/85" />
              </div>
              <span className="text-white/90 font-medium" style={{ fontSize: "clamp(10px, 1.3vw, 12px)" }}>
                <span className="font-bold">{approved}</span> disetujui
              </span>
            </div>
          </div>
        </div>

        {/* Hero Illustration - Hidden on mobile */}
        <div
          className="absolute right-4 xl:right-7 top-1/2 hero-float-anim hidden sm:block"
          style={{ transform: "translateY(-50%) rotate(-4deg)", zIndex: 30 }}
        >
          {/* Main Card */}
          <div
            className="rounded-xl p-3 mb-2"
            style={{
              width: "clamp(180px, 20vw, 280px)",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-900">Overview Statistik</span>
              <div className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] rounded flex items-center justify-center" style={{ background: "#EEF0FF" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-indigo-500">
                  <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" />
                </svg>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-[40px] sm:h-[52px]">
              {barHeights.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: animated ? `${height}%` : "0%",
                    background: barColors[i],
                    transformOrigin: "bottom",
                    transition: `height 0.8s ease-out ${0.1 + i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Small Card */}
          <div
            className="rounded-xl p-2 sm:p-2.5"
            style={{
              width: "clamp(100px, 12vw, 130px)",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex items-center gap-2 py-1 sm:py-1.5 border-b border-gray-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] text-gray-600 flex-1">Mahasiswa</span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-900">{mahasiswaCount}</span>
            </div>
            <div className="flex items-center gap-2 py-1 sm:py-1.5 border-b border-gray-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] text-gray-600 flex-1">Dosen</span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-900">{dosenCount}</span>
            </div>
            <div className="flex items-center gap-2 py-1 sm:py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] text-gray-600 flex-1">Kurikulum</span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-900">8</span>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 z-10 overflow-hidden">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full">
            <path fill="rgba(255,255,255,0.06)" d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,36 1440,24 L1440,48 L0,48 Z" className="hero-wave-anim" />
          </svg>
        </div>
      </section>
    </>
  );
}
