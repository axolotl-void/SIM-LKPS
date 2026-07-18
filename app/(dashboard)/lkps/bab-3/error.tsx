"use client";

import { ErrorBoundary as ReactErrorBoundary } from "@/components/shared/error-boundary";

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      title="BAB 3 Error"
      description="Terjadi kesalahan saat memuat halaman BAB 3. Silakan muat ulang."
      showHome
    >
      {children}
    </ReactErrorBoundary>
  );
}
