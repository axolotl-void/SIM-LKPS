"use client";

import { ErrorBoundary } from "@/components/shared/error-boundary";

export default function Bab3Error({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
