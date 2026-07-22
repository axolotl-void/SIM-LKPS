"use client";

import { useEffect, useState, useRef, memo, useCallback } from "react";
import {
  Shield,
  GraduationCap,
  FlaskConical,
  CircleCheck,
  Cog,
  Eye,
  LucideIcon,
} from "lucide-react";
import { ChevronRight } from "lucide-react";

interface ProgressItem {
  bab: string;
  title: string;
  filled: number;
  total: number;
  percentage: number;
  color: string;
}

interface ProgressSectionProps {
  items: ProgressItem[];
}

const icons: LucideIcon[] = [Shield, GraduationCap, FlaskConical, CircleCheck, Cog, Eye];

const getStatus = (percentage: number) => {
  if (percentage === 100) return { label: "Selesai", variant: "success" as const };
  if (percentage >= 70) return { label: "Dalam Progress", variant: "progress" as const };
  if (percentage >= 40) return { label: "Hampir Selesai", variant: "warning" as const };
  return { label: "Belum Dimulai", variant: "pending" as const };
};

const statusStyles = {
  success: { bg: "rgba(16, 185, 129, 0.12)", color: "#10B981", border: "rgba(16, 185, 129, 0.25)" },
  progress: { bg: "rgba(99, 102, 241, 0.12)", color: "#6366F1", border: "rgba(99, 102, 241, 0.25)" },
  warning: { bg: "rgba(245, 158, 11, 0.12)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.25)" },
  pending: { bg: "rgba(156, 163, 175, 0.12)", color: "#9CA3AF", border: "rgba(156, 163, 175, 0.25)" },
};

// Premium easing: cubic-bezier(0.22, 0.61, 0.36, 1)
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

// Fixed elegant asymmetric path - 2 smooth Bézier curves
// Amplitude ~10px, organic asymmetric curves
const createWavePath = (width: number, height: number) => {
  const midY = height / 2;
  const amp = 10;

  // Asymmetric bezier for organic feel
  // Curve 1: slower rise, faster fall
  const c1x = width * 0.25;
  const c1y = midY - amp * 1.2;
  const c2x = width * 0.35;
  const c2y = midY + amp * 0.6;

  // Curve 2: gradual rise, sharp peak, gentle fall
  const c3x = width * 0.65;
  const c3y = midY - amp * 0.8;
  const c4x = width * 0.8;
  const c4y = midY + amp * 0.4;

  return `M0,${midY} C${c1x},${c1y} ${c2x},${c2y} ${width * 0.5},${midY} C${c3x},${c3y} ${c4x},${c4y} ${width},${midY}`;
};

// CSS custom property name for glow animation
const getGlowVarName = (index: number) => `--glow-opacity-${index}`;

// Wave SVG with optimized draw animation
const WaveAnimation = memo(function WaveAnimation({
  percentage,
  color,
  index,
  width = 360,
  height = 40,
}: {
  percentage: number;
  color: string;
  index: number;
  width?: number;
  height?: number;
}) {
  const wavePathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const pathLengthRef = useRef(0);
  const prefersReducedMotion = useRef(false);

  const wavePath = createWavePath(width, height);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Get path length once on mount
  useEffect(() => {
    if (wavePathRef.current && pathLengthRef.current === 0) {
      pathLengthRef.current = wavePathRef.current.getTotalLength();
    }
  }, []);

  // Main animation effect
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const pathLength = pathLengthRef.current;
    if (pathLength === 0) return;

    // If reduced motion, set final state immediately
    if (prefersReducedMotion.current) {
      if (wavePathRef.current) {
        wavePathRef.current.style.strokeDashoffset = "0";
      }
      if (glowPathRef.current) {
        glowPathRef.current.style.strokeDashoffset = "0";
      }
      if (dotRef.current) {
        const point = wavePathRef.current?.getPointAtLength(pathLength) || { x: width, y: height / 2 };
        dotRef.current.setAttribute("cx", String(point.x));
        dotRef.current.setAttribute("cy", String(point.y));
        dotRef.current.setAttribute("r", "4");
      }
      return;
    }

    const drawLength = (percentage / 100) * pathLength;
    const drawDuration = 3000; // 3 seconds

    // Set initial state - path fully hidden
    if (wavePathRef.current) {
      wavePathRef.current.style.strokeDasharray = `${pathLength}`;
      wavePathRef.current.style.strokeDashoffset = `${pathLength}`;
    }
    if (glowPathRef.current) {
      glowPathRef.current.style.strokeDasharray = `${pathLength}`;
      glowPathRef.current.style.strokeDashoffset = `${pathLength}`;
    }

    const startTime = performance.now();
    let rafId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / drawDuration, 1);
      const eased = easeOutQuart(t);
      const currentDraw = eased * drawLength;

      // Update stroke-dashoffset
      if (wavePathRef.current) {
        wavePathRef.current.style.strokeDashoffset = String(pathLength - currentDraw);
      }
      if (glowPathRef.current) {
        glowPathRef.current.style.strokeDashoffset = String(pathLength - currentDraw);
      }

      // Update dot position
      if (dotRef.current && wavePathRef.current) {
        const point = wavePathRef.current.getPointAtLength(currentDraw);
        dotRef.current.setAttribute("cx", String(point.x));
        dotRef.current.setAttribute("cy", String(point.y));
        dotRef.current.setAttribute("r", "4");
      }

      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      }
      // Animation completes naturally - path stays at final position
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [percentage, width, height]); // Intentionally minimal deps

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`waveGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={`${color}90`} />
          </linearGradient>
          <filter id={`waveFilter-${index}`}>
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dotted guide line */}
        <path
          d={wavePath}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2,6"
          opacity="0.4"
        />

        {/* Glow path */}
        <path
          ref={glowPathRef}
          d={wavePath}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          filter={`url(#waveFilter-${index})`}
          className="wave-glow"
          style={{
            ["--target-opacity" as string]: 0.4,
          }}
        />

        {/* Main wave path */}
        <path
          ref={wavePathRef}
          d={wavePath}
          fill="none"
          stroke={`url(#waveGrad-${index})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Animated dot */}
        <circle
          ref={dotRef}
          cx={0}
          cy={height / 2}
          r={0}
          fill={color}
          className="wave-dot"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
    </div>
  );
});

// Progress item row
const ProgressItemRow = memo(function ProgressItemRow({
  item,
  index,
}: {
  item: ProgressItem;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = icons[index % icons.length] || Shield;
  const status = getStatus(item.percentage);
  const statusStyle = statusStyles[status.variant];

  const progressLabel = `${item.percentage}% - ${item.filled} dari ${item.total} tabel ${item.title}`;

  return (
    <div
      className="relative rounded-xl px-4 py-3 flex items-center gap-4 transition-all duration-300"
      role="listitem"
      style={{
        height: "72px", // Fixed 72px
        background: isHovered ? "#FFFFFF" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${isHovered ? "rgba(99,102,241,0.2)" : "rgba(229,231,235,0.6)"}`,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)"
          : "0 1px 3px rgba(0,0,0,0.03)",
        marginBottom: "8px", // Fixed 8px
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LEFT (~30%) */}
      <div className="flex items-center gap-3" style={{ width: "30%", flexShrink: 0 }}>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300"
          style={{
            background: `linear-gradient(135deg, ${item.color}18, ${item.color}08)`,
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            boxShadow: isHovered ? `0 0 20px ${item.color}30` : "none",
          }}
          aria-hidden="true"
        >
          <IconComponent className="w-5 h-5" style={{ color: item.color }} />
        </div>

        <div className="flex flex-col min-w-0">
          <h4 className="text-[13px] font-semibold text-gray-900 truncate leading-tight">
            {item.title}
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {item.filled} dari {item.total} tabel
          </p>
          <span
            className="inline-flex items-center justify-center mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium leading-tight w-fit"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* CENTER (~45%) */}
      <div
        className="relative flex-1"
        role="progressbar"
        aria-valuenow={item.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={progressLabel}
        style={{ height: "40px" }}
      >
        <div
          className="absolute inset-0 rounded-lg transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${item.color}15 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
        <WaveAnimation
          percentage={item.percentage}
          color={item.color}
          index={index}
          width={360}
          height={40}
        />
      </div>

      {/* RIGHT (~25%) */}
      <div
        className="flex items-center gap-3 flex-shrink-0 transition-transform duration-300"
        style={{
          width: "25%",
          transform: isHovered ? "translateX(6px)" : "translateX(0)",
        }}
      >
        <div
          className="px-3 py-1.5 rounded-lg text-center transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
            backdropFilter: "blur(12px)",
            border: `1px solid ${item.color}35`,
            boxShadow: isHovered
              ? `0 0 20px ${item.color}30, inset 0 1px 0 rgba(255,255,255,0.6)`
              : "inset 0 1px 0 rgba(255,255,255,0.4)",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            minWidth: "64px",
          }}
          aria-hidden="true"
        >
          <span
            className="text-[18px] font-bold leading-none"
            style={{
              color: item.color,
              textShadow: `0 0 12px ${item.color}50`,
            }}
          >
            {item.percentage}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-gray-600 whitespace-nowrap">
            {item.filled}/{item.total}
          </span>
          <span
            className="text-gray-400 transition-transform duration-300"
            style={{
              transform: isHovered ? "translateX(6px)" : "translateX(0)",
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
});

export function ProgressSection({ items }: ProgressSectionProps) {
  return (
    <div
      className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl flex flex-col overflow-hidden"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)",
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100/80 flex-shrink-0">
        <h3 className="text-[13px] font-semibold text-gray-900">
          Progres Pengisian Data per BAB
        </h3>
        <a
          href="#"
          className="text-[11px] font-medium text-indigo-500 flex items-center gap-1 hover:text-indigo-600 transition-colors"
        >
          Lihat Semua
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto p-3"
        role="list"
        aria-label="Daftar progres BAB"
      >
        {items.map((item, index) => (
          <ProgressItemRow key={item.bab} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
