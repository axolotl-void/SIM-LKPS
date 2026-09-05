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
 * Stagger: lockup -> subtitle -> heading -> card -> footer.
 * Card has slightly heavier motion (scale + translate) to feel "anchored".
 * Honors prefers-reduced-motion (no initial offset, instant show).
 *
 * NOTE: We intentionally do NOT use `display: contents` here. Framer Motion
 * applies transform/opacity to the wrapper element, and `display: contents`
 * strips the element from the layout tree, breaking the animation entirely.
 * Instead, items stack naturally inside the flex column container.
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
    >
      {children}
    </motion.div>
  );
}
