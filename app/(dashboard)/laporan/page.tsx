"use client";

import { useState, useEffect, useRef, memo } from "react";
import { FileText, Download, Printer, CheckCircle2, Clock, AlertCircle, TrendingUp, BookOpen, Shield, FlaskConical, CircleCheck, Users, Sparkles } from "lucide-react";
import { BarChart3, ChevronRight } from "lucide-react";

// CSS-only animation styles
const styleId = "laporan-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in-left {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    .animate-fade-up { animation: fade-in-up 0.5s ease-out forwards; }
    .animate-fade-left { animation: fade-in-left 0.4s ease-out forwards; }
    .animate-scale-in { animation: scale-in 0.4s ease-out forwards; }
    .progress-fill { transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
  `;
  document.head.appendChild(style);
}

interface BABReport {
  id: string;
  bab: string;
  title: string;
  filled: number;
  total: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const BAB_REPORTS: BABReport[] = [
  { id: "bab1", bab: "BAB 1", title: "Tata Pamong", filled: 4, total: 4, icon: Shield, color: "#6366F1", bgColor: "#EEF2FF" },
  { id: "bab2", bab: "BAB 2", title: "Pendidikan", filled: 5, total: 6, icon: BookOpen, color: "#10B981", bgColor: "#ECFDF5" },
  { id: "bab3", bab: "BAB 3", title: "Penelitian", filled: 3, total: 5, icon: FlaskConical, color: "#F59E0B", bgColor: "#FFFBEB" },
  { id: "bab4", bab: "BAB 4", title: "Pengabdian", filled: 3, total: 4, icon: Users, color: "#F43F5E", bgColor: "#FFF1F2" },
  { id: "bab5", bab: "BAB 5 & 6", title: "Tata Kelola & Visi Misi", filled: 7, total: 12, icon: CircleCheck, color: "#8B5CF6", bgColor: "#F5F3FF" },
];

// Fix: Total should be 31 (4+6+5+4+12=31)
const TOTAL_TABLES = 31;

function getStatus(percentage: number) {
  if (percentage === 100) return { label: "Lengkap", variant: "success" as const };
  if (percentage >= 70) return { label: "Hampir Lengkap", variant: "warning" as const };
  return { label: "Belum Lengkap", variant: "danger" as const };
}

// Memoized Summary Card - PRO Version
const SummaryCard = memo(function SummaryCard({ 
  icon: Icon, 
  value, 
  label, 
  sublabel, 
  color, 
  bgColor, 
  delay 
}: { 
  icon: React.ElementType;
  value: string | number;
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  delay: number;
}) {
  return (
    <div 
      className="animate-fade-up relative overflow-hidden rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ 
        animationDelay: `${delay}ms`, 
        opacity: 0,
        background: `linear-gradient(145deg, ${color}08, ${color}03)`,
        border: `1px solid ${color}20`,
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />
      
      {/* Icon */}
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${color}20` }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      
      {/* Value - BIG and BOLD */}
      <div 
        className="text-5xl font-black tracking-tight mb-1"
        style={{ color, textShadow: `0 2px 10px ${color}30` }}
      >
        {value}
      </div>
      
      {/* Label */}
      <div className="text-lg font-bold text-gray-800 mb-1">{label}</div>
      
      {/* Sublabel */}
      <div className="text-sm font-medium" style={{ color: `${color}80` }}>{sublabel}</div>
      
      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </div>
  );
});

// Memoized BAB Row - PRO Version
const BABRow = memo(function BABRow({ 
  bab, 
  index 
}: { 
  bab: BABReport; 
  index: number; 
}) {
  const percentage = Math.round((bab.filled / bab.total) * 100);
  const status = getStatus(percentage);
  const BabIcon = bab.icon;
  
  return (
    <div 
      className="animate-fade-left group px-5 py-4 hover:bg-gradient-to-r hover:from-gray-50/80 to-transparent transition-all duration-300 cursor-pointer border-b border-gray-50 last:border-0"
      style={{ opacity: 0, animationDelay: `${300 + index * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Icon & Info */}
        <div className="flex items-center gap-4 w-72">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md"
            style={{ background: `${bab.color}15` }}
          >
            <BabIcon className="w-8 h-8" style={{ color: bab.color }} />
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-gray-900">{bab.bab}</div>
            <div className="text-sm text-gray-600 font-medium">{bab.title}</div>
            <div className="text-xs text-gray-400 mt-1">
              {bab.filled} dari {bab.total} tabel
            </div>
          </div>
        </div>

        {/* Progress Bar - Bigger and more visible */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-lg font-black" style={{ color: bab.color }}>
              {percentage}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full progress-fill shadow-sm"
              style={{ 
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${bab.color}, ${bab.color}AA)`,
                boxShadow: `0 0 10px ${bab.color}40`
              }}
            />
          </div>
        </div>

        {/* Status Badge - Larger */}
        <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
          status.variant === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
          status.variant === "warning" ? "bg-amber-50 text-amber-700 border border-amber-200" :
          "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status.label}
        </div>

        {/* Action Button */}
        <a
          href={`/lkps/${bab.id.replace("bab", "bab-")}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-sm transition-all duration-200 hover:shadow-md"
        >
          Lihat Detail
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
});

export default function LaporanPage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const totalTables = TOTAL_TABLES;
  const totalFilled = BAB_REPORTS.reduce((sum, bab) => sum + bab.filled, 0);
  const overallProgress = Math.round((totalFilled / totalTables) * 100);
  const completeBAB = BAB_REPORTS.filter(bab => bab.filled === bab.total).length;

  const handleExport = async (type: "excel" | "pdf" | "print") => {
    setExporting(type);
    
    try {
      if (type === "excel") {
        const response = await fetch("/api/export/excel");
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `LKPS_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } else if (type === "pdf") {
        const response = await fetch("/api/export/word");
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `LKPS_Report_${new Date().toISOString().split("T")[0]}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } else if (type === "print") {
        window.print();
      }
    } catch (error) {
      console.error("Export error:", error);
    }
    
    setExporting(null);
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)" }}>
      {/* Header */}
      <div 
        className="mb-6 animate-scale-in"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Laporan LKPS</h1>
                <p className="text-sm text-gray-500">Rekapitulasi data Laporan Kinerja Program Studi</p>
              </div>
            </div>
          </div>
          
          {/* Export Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport("excel")}
              disabled={exporting !== null}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-[1.5px] shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              <div className="relative flex items-center gap-2 bg-white rounded-[11px] px-4 py-2.5 group-hover:bg-emerald-50 transition-colors duration-300">
                {exporting === "excel" ? (
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-emerald-500" />
                )}
                <span className="text-sm font-semibold text-emerald-600">Export Excel</span>
              </div>
            </button>
            
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-rose-600 p-[1.5px] shadow-lg shadow-red-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30"
            >
              <div className="relative flex items-center gap-2 bg-white rounded-[11px] px-4 py-2.5 group-hover:bg-red-50 transition-colors duration-300">
                {exporting === "pdf" ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-semibold text-red-600">Export Word</span>
              </div>
            </button>
            
            <button
              onClick={() => handleExport("print")}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 p-[1.5px] shadow-lg shadow-slate-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/30"
            >
              <div className="relative flex items-center gap-2 bg-white rounded-[11px] px-4 py-2.5 group-hover:bg-slate-50 transition-colors duration-300">
                <Printer className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-600">Print</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SummaryCard icon={FileText} value={totalTables} label="Total Tabel" sublabel="31 tabel LKPS" color="#6366F1" bgColor="#EEF2FF" delay={100} />
        <SummaryCard icon={CheckCircle2} value={totalFilled} label="Sudah Terisi" sublabel={`${overallProgress}% dari total`} color="#10B981" bgColor="#ECFDF5" delay={150} />
        <SummaryCard icon={Clock} value={totalTables - totalFilled} label="Belum Terisi" sublabel="Tabel kosong" color="#F59E0B" bgColor="#FFFBEB" delay={200} />
        <SummaryCard icon={TrendingUp} value={`${overallProgress}%`} label="Progress" sublabel={`${completeBAB}/5 BAB lengkap`} color="#8B5CF6" bgColor="#F5F3FF" delay={250} />
      </div>

      {/* Main Card - Rekap per BAB - PRO */}
      <div 
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50 mb-6 animate-fade-up"
        style={{ animationDelay: "300ms", opacity: 0 }}
      >
        {/* Top gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Rekapitulasi per BAB</h2>
                <p className="text-sm text-gray-500">Status pengisian tabel LKPS berdasarkan BAB</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-xl font-black text-indigo-600">{completeBAB}</div>
                <div className="text-xs text-gray-500">Lengkap</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-xl font-black text-amber-600">{5 - completeBAB}</div>
                <div className="text-xs text-gray-500">Belum</div>
              </div>
            </div>
          </div>
        </div>

        {/* BAB Rows */}
        <div className="divide-y divide-gray-50">
          {BAB_REPORTS.map((bab, index) => (
            <BABRow key={bab.id} bab={bab} index={index} />
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <div 
        className="animate-fade-up bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5 shadow-lg shadow-indigo-100/50"
        style={{ animationDelay: "800ms", opacity: 0 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-indigo-800">Tips</h4>
            <p className="text-xs text-indigo-600 mt-1 leading-relaxed">
              Gunakan tombol Export untuk mengunduh laporan dalam format Excel atau Word. 
              Anda juga bisa langsung Print halaman ini untuk dokumentasi fisik. 
              Klik "Lihat" pada setiap BAB untuk membuka halaman detail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
