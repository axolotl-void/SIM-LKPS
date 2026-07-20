"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary untuk client components.
 * Bungkus komponen yang rentan crash (tabel, form kompleks, dll).
 *
 * Usage:
 *   <ErrorBoundary>
 *     <Tabel1A1Client ... />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-100/50 bg-red-50/50 p-8 text-center shadow-soft-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">Gagal Memuat Komponen</p>
            <p className="text-2xs font-semibold text-slate-400">
              {this.state.error?.message || "Terjadi kesalahan yang tidak terduga."}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 px-4 py-2 text-2xs font-bold text-white shadow-soft-sm hover:shadow-soft transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
