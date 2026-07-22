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
    "#A5B4FC", // primary-300
    "#818CF8", // primary-400
    "#A5B4FC", // primary-300
    "#6366F1", // primary-500
    "#818CF8", // primary-400
    "#6366F1", // primary-500
    "#818CF8", // primary-400
  ];

  return (
    <>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(-50%) rotate(-4deg); }
          50% { transform: translateY(-52%) rotate(-4deg); }
        }
        @keyframes heroBarGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
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
          minHeight: "148px",
          padding: "28px 36px",
        }}
      >
        {/* Floating dots - exact positions from source */}
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-white/20 z-10"
          style={{ top: "22px", right: "340px" }}
        />
        <div
          className="absolute w-2 h-2 rounded-full bg-white/15 z-10"
          style={{ top: "45px", right: "380px" }}
        />
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-white/25 z-10"
          style={{ top: "18px", right: "400px" }}
        />
        <div
          className="absolute w-1 h-1 rounded-full bg-white/15 z-10"
          style={{ top: "70px", right: "320px" }}
        />

        {/* Content */}
        <div className="relative z-20 max-w-[60%]">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mb-3.5"
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
              className="w-3.5 h-3.5 text-white/80"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
            </svg>
            <span className="text-[11px] font-medium text-white/80">Tahun Ajaran 2025/2026</span>
          </div>

          {/* Title - exact 25px */}
          <h2 className="text-[25px] font-bold text-white mb-1.5" style={{ letterSpacing: "-0.4px" }}>
            Selamat Datang kembali, {userName}!
          </h2>

          {/* Subtitle */}
          <p className="text-[13px] font-normal text-white/60 mb-4">SIM-LKPS • {userRole}</p>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-[22px] h-[22px] bg-white/15 rounded flex items-center justify-center">
                <FileText className="w-3 h-3 text-white/85" />
              </div>
              <span className="text-[12px] font-medium text-white/90">
                <span className="font-bold">{tablesFilled}</span>/{totalTables} tabel terisi
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[22px] h-[22px] bg-white/15 rounded flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white/85" />
              </div>
              <span className="text-[12px] font-medium text-white/90">
                <span className="font-bold">{approved}</span> disetujui
              </span>
            </div>
          </div>
        </div>

        {/* Hero Illustration - exact position */}
        <div
          className="absolute right-7 top-1/2 hero-float-anim"
          style={{ transform: "translateY(-50%) rotate(-4deg)", zIndex: 30 }}
        >
          {/* Main Card - exact 280px */}
          <div
            className="rounded-xl p-3.5 mb-2.5"
            style={{
              width: "280px",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-gray-900">Overview Statistik</span>
              <div className="w-[26px] h-[26px] rounded flex items-center justify-center" style={{ background: "#EEF0FF" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3 text-indigo-500"
                >
                  <line x1="18" x2="18" y1="20" y2="10" />
                  <line x1="12" x2="12" y1="20" y2="4" />
                  <line x1="6" x2="6" y1="20" y2="14" />
                </svg>
              </div>
            </div>

            {/* Bar Chart - exact heights */}
            <div className="flex items-end gap-1.5 h-[52px]">
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

          {/* Small Card - exact 130px */}
          <div
            className="rounded-xl p-2.5"
            style={{
              width: "130px",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-600 flex-1">Mahasiswa</span>
              <span className="text-[10px] font-semibold text-gray-900">{mahasiswaCount}</span>
            </div>
            <div className="flex items-center gap-2 py-1.5 border-b border-gray-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-600 flex-1">Dosen</span>
              <span className="text-[10px] font-semibold text-gray-900">{dosenCount}</span>
            </div>
            <div className="flex items-center gap-2 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-600 flex-1">Kurikulum</span>
              <span className="text-[10px] font-semibold text-gray-900">8</span>
            </div>
          </div>
        </div>

        {/* Wave bottom - exact */}
        <div className="absolute bottom-0 left-0 right-0 h-12 z-10 overflow-hidden">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full">
            <path
              fill="rgba(255,255,255,0.06)"
              d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,36 1440,24 L1440,48 L0,48 Z"
              className="hero-wave-anim"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
