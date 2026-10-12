"use client";

import { useEffect, useRef } from "react";

/** Enhance server-rendered content only after the browser can observe it. */
export function useScrollReveal<T extends HTMLElement>(contentKey: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        target.style.setProperty("--reveal-order", String(Math.min(order++, 2)));
        target.dataset.scrollReveal = "revealed";
        observer.unobserve(target);
      }
    }, { rootMargin: "0px 0px -48px 0px", threshold: 0 });

    // Keep anything already visible (including restored scroll positions) visible.
    for (const target of targets) {
      if (target.dataset.scrollReveal === "revealed") continue;
      if (target.getBoundingClientRect().top < window.innerHeight - 48) {
        target.dataset.scrollReveal = "visible";
      } else {
        target.dataset.scrollReveal = "pending";
        observer.observe(target);
      }
    }

    const revealFocused = (event: FocusEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-scroll-reveal]");
      if (!target || !root.contains(target)) return;
      target.dataset.scrollReveal = "visible";
      observer.unobserve(target);
    };
    const revealAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      targets.forEach((target) => { target.dataset.scrollReveal = "visible"; });
    };

    root.addEventListener("focusin", revealFocused);
    motion.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      root.removeEventListener("focusin", revealFocused);
      motion.removeEventListener("change", revealAll);
      targets.forEach((target) => {
        if (target.dataset.scrollReveal === "pending") target.dataset.scrollReveal = "visible";
      });
    };
  }, [contentKey]);

  return ref;
}
