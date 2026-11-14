"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function WorkTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useLayoutEffect(() => {
    // Start a new project page at its title, while preserving chapter anchors
    // and keeping the current position when only archive filters change.
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);
  return children;
}
