"use client";

import { useEffect, useState, useRef, memo } from "react";
import { FileText, CheckCircle2, Clock, ShieldCheck, Sparkles, Target, Award } from "lucide-react";

// CSS-only animation keyframes (more performant)
const styleId = "kpi-cards-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes kpi-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    @keyframes kpi-float {
      0%, 100% { transform: translateY(0); opacity: 0.3; }
      50% { transform: translateY(-8px); opacity: 0.6; }
    }
    @keyframes kpi-glow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.7; }
    }
    .kpi-card-enter { animation: kpi-card-in 0.5s ease-out forwards; }
    @keyframes kpi-card-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

interface KPICardsProps {
  totalTables: number;
  filledTables: number;
  approved: number;
  pending: number;
}

// Animated counter - optimized with single RAF
const AnimatedNumber = memo(function AnimatedNumber({ target, delay }: { target: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animatedRef.current = true;
          observer.disconnect();
          
          let start: number | null = null;
          const duration = 1500;
          
          const animate = (time: number) => {
            if (!start) start = time;
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} style={{ willChange: "contents" }}>0</span>;
});

AnimatedNumber.displayName = "AnimatedNumber";

// Animated percentage
const AnimatedPercentage = memo(function AnimatedPercentage({ target, delay }: { target: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animatedRef.current = true;
          observer.disconnect();
          
          let start: number | null = null;
          const duration = 1500;
          
          const animate = (time: number) => {
            if (!start) start = time;
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>0</span>;
});

AnimatedPercentage.displayName = "AnimatedPercentage";

// Progress ring - optimized
const ProgressRing = memo(function ProgressRing({ progress, color, size = 56, strokeWidth = 4 }: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const animatedRef = useRef(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    if (animatedRef.current) return;
    const circle = circleRef.current;
    if (!circle) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animatedRef.current = true;
          observer.disconnect();
          
          let start: number | null = null;
          const duration = 1200;
          
          const animate = (time: number) => {
            if (!start) start = time;
            const p = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const offset = circumference - (eased * progress / 100) * circumference;
            circle.style.strokeDashoffset = String(offset);
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(circle);
    return () => observer.disconnect();
  }, [progress, circumference]);

  return (
    <svg width={size} height={size} className="transform -rotate-90" style={{ willChange: "contents" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={strokeWidth} />
      <circle
        ref={circleRef}
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
});

ProgressRing.displayName = "ProgressRing";

// Single animated card
const KPICard = memo(function KPICard({
  title, subtitle, value, percentage, trend, icon: Icon,
  gradient, glowColor, ringColor, delay
}: {
  title: string;
  subtitle: string;
  value: number;
  percentage: number;
  trend: "up" | "down";
  icon: React.ElementType;
  gradient: [string, string];
  glowColor: string;
  ringColor: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer kpi-card-enter"
      style={{ animationDelay: `${delay * 100}ms`, willChange: "transform, opacity" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow effect - CSS animated */}
      <div
        className="absolute -inset-1 rounded-3xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent)`,
          opacity: hovered ? 0.4 : 0,
          filter: "blur(20px)",
          transition: "opacity 0.3s ease",
          animation: hovered ? "none" : "kpi-glow 3s ease-in-out infinite",
        }}
      />

      {/* Main card */}
      <div
        className="relative rounded-3xl overflow-hidden p-5 h-[160px]"
        style={{
          background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
          boxShadow: hovered
            ? "0 20px 40px -12px rgba(0,0,0,0.25)"
            : "0 8px 24px -8px rgba(0,0,0,0.15)",
          transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
          transition: "all 0.3s ease",
          willChange: "transform",
        }}
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%)",
            animation: hovered ? "kpi-shimmer 0.8s ease-out" : "none",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animation: `kpi-float ${2.5 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="relative"
              style={{ transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1)", transition: "transform 0.3s ease" }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-xl blur-md" />
              <div className="relative w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-white/90">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{title}</div>
              <div className="text-sm text-white/70 mt-0.5">{subtitle}</div>
            </div>
          </div>

          {/* Trend */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${trend === "up" ? "bg-emerald-500/30 text-emerald-200" : "bg-red-500/30 text-red-200"}`}>
            {trend === "up" ? "↑" : "↓"}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 mt-auto flex items-end justify-between">
          <div>
            <span className="text-4xl font-black text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)", letterSpacing: "-2px" }}>
              <AnimatedNumber target={value} delay={delay} />
            </span>
            <span className="text-lg font-bold text-white/60">/ 31</span>
          </div>

          <div className="relative">
            <ProgressRing progress={percentage} color={ringColor} size={56} strokeWidth={4} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                <AnimatedPercentage target={percentage} delay={delay} />%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${ringColor}, transparent)`, opacity: hovered ? 1 : 0.6, transition: "opacity 0.3s ease" }} />
      </div>
    </div>
  );
});

KPICard.displayName = "KPICard";

export function KPICards({ totalTables, filledTables, approved, pending }: KPICardsProps) {
  const filledPercentage = totalTables > 0 ? Math.round((filledTables / totalTables) * 100) : 0;
  const pendingPercentage = totalTables > 0 ? Math.round((pending / totalTables) * 100) : 0;
  const approvedPercentage = totalTables > 0 ? Math.round((approved / totalTables) * 100) : 0;

  const cards = [
    { title: "Total Tabel LKPS", subtitle: "dari 31 tabel", value: totalTables, percentage: 100, trend: "up" as const, icon: Target, gradient: ["#6366F1", "#8B5CF6"] as [string, string], glowColor: "#8B5CF6", ringColor: "#A78BFA", delay: 0 },
    { title: "Sudah Diisi", subtitle: `${filledPercentage}% dari total`, value: filledTables, percentage: filledPercentage, trend: "up" as const, icon: Sparkles, gradient: ["#10B981", "#059669"] as [string, string], glowColor: "#10B981", ringColor: "#34D399", delay: 1 },
    { title: "Menunggu Validasi", subtitle: `${pendingPercentage}% dari total`, value: pending, percentage: pendingPercentage, trend: pending > 0 ? "down" as const : "up" as const, icon: Clock, gradient: ["#F59E0B", "#D97706"] as [string, string], glowColor: "#F59E0B", ringColor: "#FCD34D", delay: 2 },
    { title: "Disetujui", subtitle: `${approvedPercentage}% dari total`, value: approved, percentage: approvedPercentage, trend: "up" as const, icon: Award, gradient: ["#06B6D4", "#0891B2"] as [string, string], glowColor: "#06B6D4", ringColor: "#22D3EE", delay: 3 },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <KPICard key={index} {...card} />
      ))}
    </div>
  );
}
