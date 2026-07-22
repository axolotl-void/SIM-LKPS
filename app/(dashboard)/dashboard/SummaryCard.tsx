"use client";

import { useEffect, useRef, useState } from "react";

interface SummaryCardProps {
  totalUsers: number;
  dosenAktif: number;
  mahasiswaAktif: number;
  penggunaAktif: number;
}

// Easing functions
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export function SummaryCard({
  totalUsers,
  dosenAktif,
  mahasiswaAktif,
  penggunaAktif,
}: SummaryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const animationRef = useRef<number | null>(null);
  const progressArcRef = useRef<SVGCircleElement>(null);
  const glowArcRef = useRef<SVGCircleElement>(null);
  const highlightArcRef = useRef<SVGCircleElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Static state — only changes twice: initial load + animation complete
  const [isAnimating, setIsAnimating] = useState(false);

  const circumference = 2 * Math.PI * 50;
  const targetPercentage = Math.round((dosenAktif / totalUsers) * 100);
  const targetValue = totalUsers;

  // Pre-calculate final values ONCE at render — no recalculation during animation
  const finalOffset = circumference - (targetPercentage / 100) * circumference;
  const finalGlowOpacity = 0.1;
  const finalGlowScale = 1 + (targetPercentage / 100) * 0.15;

  // Apply final values to DOM directly — no React re-render
  const applyFinalState = () => {
    if (progressArcRef.current) {
      progressArcRef.current.style.strokeDashoffset = String(finalOffset);
    }
    if (glowArcRef.current) {
      glowArcRef.current.style.strokeDashoffset = String(finalOffset);
      glowArcRef.current.style.opacity = String(finalGlowOpacity * 0.25);
    }
    if (highlightArcRef.current) {
      highlightArcRef.current.style.strokeDashoffset = String(finalOffset);
    }
    if (counterRef.current) {
      counterRef.current.textContent = String(targetValue);
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = String(finalGlowOpacity);
      glowRef.current.style.transform = `scale(${finalGlowScale})`;
    }
  };

  const runAnimation = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    setIsAnimating(true);

    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    // Timeline
    const fillDuration = 1800;
    const holdDuration = 700;
    const settleDuration = 1700;
    const totalDuration = fillDuration + holdDuration + settleDuration;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      if (elapsed >= totalDuration) {
        // Animation complete — apply final values and stop
        animationRef.current = null;
        setIsAnimating(false);
        applyFinalState();
        return;
      }

      let progress: number;

      if (elapsed < fillDuration) {
        const t = elapsed / fillDuration;
        progress = easeOutExpo(t) * 100;
      } else if (elapsed < fillDuration + holdDuration) {
        progress = 100;
      } else {
        const t = (elapsed - fillDuration - holdDuration) / settleDuration;
        const eased = easeInOutCubic(t);
        progress = 100 - eased * (100 - targetPercentage);
      }

      // Clamp progress
      progress = Math.max(0, Math.min(100, progress));

      // Compute current offset
      const currentOffset = circumference - (progress / 100) * circumference;

      // Apply to DOM directly — NO React state update
      if (progressArcRef.current) {
        progressArcRef.current.style.strokeDashoffset = String(currentOffset);
      }
      if (glowArcRef.current) {
        glowArcRef.current.style.strokeDashoffset = String(currentOffset);
        const glowOpacity = 0.1 + (progress / 100) * 0.4;
        glowArcRef.current.style.opacity = String(glowOpacity * 0.25);
      }
      if (highlightArcRef.current) {
        highlightArcRef.current.style.strokeDashoffset = String(currentOffset);
      }

      // Counter
      const currentValue = Math.round((progress / 100) * targetValue);
      if (counterRef.current) {
        counterRef.current.textContent = String(currentValue);
      }

      // Glow element
      if (glowRef.current) {
        const glowOpacity = 0.1 + (progress / 100) * 0.4;
        const glowScale = 1 + (progress / 100) * 0.15;
        glowRef.current.style.opacity = String(glowOpacity);
        glowRef.current.style.transform = `scale(${glowScale})`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated.current) {
          const timer = setTimeout(runAnimation, 200);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 1px 4px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <h3 className="text-[14px] font-semibold text-gray-900" style={{ letterSpacing: "-0.1px" }}>
          Ringkasan Data Kampus
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-4 items-center">
          {/* Donut */}
          <div ref={ref} className="relative w-[130px] h-[130px] flex-shrink-0">
            {/* Ambient glow — controlled by DOM ref */}
            <div
              ref={glowRef}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)`,
                filter: "blur(16px)",
                opacity: 0.1,
              }}
            />

            <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
              {/* Background track */}
              <circle
                cx="65"
                cy="65"
                r="50"
                fill="none"
                stroke="#F8F9FB"
                strokeWidth="14"
              />

              {/* Outer glow ring */}
              <circle
                ref={glowArcRef}
                cx="65"
                cy="65"
                r="50"
                fill="none"
                stroke="url(#donutGlow)"
                strokeWidth="22"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                style={{ filter: "blur(6px)" }}
              />

              {/* Main progress arc */}
              <circle
                ref={progressArcRef}
                cx="65"
                cy="65"
                r="50"
                fill="none"
                stroke="url(#donutGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
              />

              {/* Inner highlight */}
              <circle
                ref={highlightArcRef}
                cx="65"
                cy="65"
                r="50"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
              />

              <defs>
                <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="donutGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center counter — controlled by DOM ref */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div
                ref={counterRef}
                className="text-[32px] font-bold text-gray-900 leading-none"
                style={{ letterSpacing: "-0.8px" }}
              >
                0
              </div>
              <div className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wide">
                Total Pengguna
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5 p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="w-[9px] h-[9px] rounded-full bg-indigo-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[12px] text-gray-500">Dosen Aktif</div>
              </div>
              <div className="text-[15px] font-bold text-gray-900">{dosenAktif}</div>
            </div>

            <div className="flex items-center gap-2.5 p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="w-[9px] h-[9px] rounded-full bg-cyan-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[12px] text-gray-500">Mahasiswa Aktif</div>
              </div>
              <div className="text-[15px] font-bold text-gray-900">{mahasiswaAktif}</div>
            </div>

            <div className="flex items-center gap-2.5 p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="w-[9px] h-[9px] rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[12px] text-gray-500">Pengguna Aktif</div>
              </div>
              <div className="text-[15px] font-bold text-gray-900">{penggunaAktif}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
