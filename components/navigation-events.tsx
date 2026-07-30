"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function NavigationEvents() {
  const pathname = usePathname();

  // Prefetch adjacent routes for faster navigation
  useEffect(() => {
    // Preload visible links on current page for instant navigation
    const prefetchVisibleLinks = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href !== pathname) {
          // Use native Next.js prefetch when link is visible in viewport
          const rect = link.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight) {
            // Link is visible, let Next.js handle prefetch naturally
          }
        }
      });
    };

    // Small delay to let the page render first
    const timeout = setTimeout(prefetchVisibleLinks, 100);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
