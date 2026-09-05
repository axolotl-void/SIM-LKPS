"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const mainStyle: CSSProperties = {
  animation: "login-main-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
};

const leftPaneStyle: CSSProperties = {
  animation: "login-pane-left 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
};

const rightPaneStyle: CSSProperties = {
  animation: "login-pane-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
};

const exitMainStyle: CSSProperties = {
  animation: "login-main-out 0.45s cubic-bezier(0.4, 0, 1, 1) both",
};

const exitLeftStyle: CSSProperties = {
  animation: "login-pane-left-out 0.5s cubic-bezier(0.4, 0, 1, 1) both",
};

const exitRightStyle: CSSProperties = {
  animation: "login-pane-right-out 0.5s cubic-bezier(0.4, 0, 1, 1) 0.05s both",
};

/**
 * Login shell with entrance + exit animations driven by CSS keyframes.
 * - Entrance: <main> fade, left pane slide-from-left, right pane slide-from-right (with 0.1s lag)
 * - Exit: triggered when navigating to dashboard (LoginForm sets sessionStorage flag
 *   then router.push — this shell starts in exit state and plays reverse slide+fade)
 * - Honors prefers-reduced-motion: skipped entirely
 * - No Framer Motion: avoids variants inheritance conflicts with children
 */
export function LoginShellClient({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  const [reduced, setReduced] = useState(false);
  // Skip entrance on mount if user is returning from a successful login
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (sessionStorage.getItem("login-exit") === "1") {
      setExiting(true);
      sessionStorage.removeItem("login-exit");
      // After exit animation completes, return to entrance state so the
      // shell is ready for re-entry (refresh, back nav, etc.)
      const timer = window.setTimeout(() => setExiting(false), 500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const mainCss = exiting ? exitMainStyle : mainStyle;
  const leftCss = exiting ? exitLeftStyle : leftPaneStyle;
  const rightCss = exiting ? exitRightStyle : rightPaneStyle;

  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-hidden bg-slate-50 lg:grid lg:grid-cols-[56fr_44fr]"
      style={reduced ? undefined : mainCss}
    >
      <div style={reduced ? undefined : leftCss}>{left}</div>
      <div style={reduced ? undefined : rightCss}>{right}</div>
    </main>
  );
}
