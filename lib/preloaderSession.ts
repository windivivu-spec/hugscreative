let visitedSubpage = false;

export function markSubpageVisit() {
  visitedSubpage = true;
}

export function shouldSkipPreloader(): boolean {
  if (visitedSubpage) return true;
  if (typeof window === "undefined") return false;

  const navEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (navEntry?.type === "back_forward") return true;

  if (document.referrer) {
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === window.location.origin && ref.pathname !== "/") {
        return true;
      }
    } catch {
      // Ignore malformed referrer URLs.
    }
  }

  return false;
}
