"use client";

import { Bell, Settings, Search, ChevronDown } from "lucide-react";

interface TopbarProps {
  user: { name: string; email: string; role: string };
}

export function Topbar({ user }: TopbarProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="h-[60px] bg-white border border-gray-200 rounded-xl flex items-center px-5 flex-shrink-0"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 1px 4px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #EEF0FF 0%, #E0E4FF 100%)",
              border: "1px solid #E0E4FF",
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
              className="w-[18px] h-[18px]"
              style={{ color: "#4F46E5" }}
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900 leading-tight" style={{ letterSpacing: "-0.3px" }}>
              SIM-LKPS
            </span>
            <span
              className="text-[9px] font-semibold text-gray-400 uppercase leading-tight"
              style={{ letterSpacing: "0.8px" }}
            >
              UBBG
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-gray-200 mx-1" />

        {/* Page Title */}
        <h1 className="text-[17px] font-semibold text-gray-900" style={{ letterSpacing: "-0.2px" }}>
          Dashboard Utama
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Search Box */}
        <div className="relative w-[300px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-[15px] h-[15px]" />
          </span>
          <input
            type="text"
            placeholder="Cari di dashboard..."
            className="w-full h-[38px] pl-9 pr-14 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none"
            style={{
              borderColor: "#E5E7EB",
              transition: "all 150ms ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#818CF8";
              e.target.style.background = "white";
              e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E5E7EB";
              e.target.style.background = "#F8F9FB";
              e.target.style.boxShadow = "none";
            }}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            ⌘K
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
            style={{ transition: "all 150ms ease" }}
          >
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
            />
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
            style={{ transition: "all 150ms ease" }}
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* User Menu */}
        <button
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-transparent hover:bg-gray-100 hover:border-gray-200 transition-all"
          style={{ transition: "all 150ms ease" }}
        >
          <div className="relative">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[13px] font-semibold"
              style={{ background: "linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)" }}
            >
              {initials}
            </div>
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
            />
          </div>
          <div className="text-left">
            <div className="text-[13px] font-semibold text-gray-900 leading-tight">{user.name}</div>
            <div className="text-[10px] text-gray-400 leading-tight">{user.email}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
