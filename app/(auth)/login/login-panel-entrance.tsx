"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Entrance choreography for the right (form) panel.
 * Stagger: lockup → subtitle → heading → card → footer.
 * Card has slightly heavier motion (scale + translate) to feel "anchored".
 * Honors prefers-reduced-motion (no initial offset, instant show).
 */
export function LoginPanelEntrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="contents"
    >
      {children}
    </motion.div>
  );
}

export function LoginPanelItem({
  children,
  variant = "item",
}: {
  children: ReactNode;
  variant?: "item" | "card";
}) {
  const reduced = useReducedMotion() ?? false;
  const variants = variant === "card" ? cardVariants : itemVariants;

  return (
    <motion.div
      variants={reduced ? undefined : variants}
      className="contents"
    >
      {children}
    </motion.div>
  );
}

const shellVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Wraps <main>. Subtle page-level fade so the whole layout
 * doesn't pop in instantly. Children animate via LoginPanelEntrance.
 */
export function LoginShellEntrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={shellVariants}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
