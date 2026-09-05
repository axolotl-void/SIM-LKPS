"use client";

import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Right pane wrapper for the login page.
 * Holds the original <section> markup + ambient glow + max-width container
 * so the entrance/exit animations on this pane are scoped to one place.
 */
export function LoginFormSection({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const ambient = !reduced; // skip ambient blur when reduced-motion

  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden bg-white px-6 py-10 sm:px-8 lg:py-12"
      aria-labelledby="login-heading"
    >
      {/* Soft ambient glow behind the card */}
      {ambient && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(40px)",
          }}
        />
      )}

      <div className="relative z-10 mx-auto w-full max-w-[460px]">{children}</div>
    </section>
  );
}
