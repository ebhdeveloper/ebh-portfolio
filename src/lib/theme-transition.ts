let activeTransition: ViewTransition | undefined;

/** Keep theme switching available when animation is unsupported or unwanted. */
export function transitionTheme(update: () => void, origin: { x: number; y: number }) {
  if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--theme-origin-x", `${origin.x}px`);
  root.style.setProperty("--theme-origin-y", `${origin.y}px`);
  activeTransition?.skipTransition();
  root.classList.add("theme-transition");

  try {
    const transition = document.startViewTransition(update);
    activeTransition = transition;
    // A hidden tab or interrupted snapshot can skip animation without losing the update.
    void transition.ready.catch(() => {});
    const cleanup = () => {
      if (activeTransition === transition) {
        activeTransition = undefined;
        root.classList.remove("theme-transition");
      }
    };
    void transition.finished.then(cleanup, cleanup);
  } catch {
    activeTransition = undefined;
    root.classList.remove("theme-transition");
    update();
  }
}
