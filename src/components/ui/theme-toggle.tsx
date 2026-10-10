"use client";

import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { transitionTheme } from "@/lib/theme-transition";

export function ThemeToggle({ label = "Toggle color theme" }: { label?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const isDark = resolvedTheme
      ? resolvedTheme === "dark"
      : document.documentElement.classList.contains("dark");
    const rect = event.currentTarget.getBoundingClientRect();
    transitionTheme(() => flushSync(() => setTheme(isDark ? "light" : "dark")), {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="ui-theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <span className="ui-theme-symbol" aria-hidden="true">
      <svg className="ui-theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z" />
      </svg>
      <svg className="ui-theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      </span>
    </Button>
  );
}
