"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a[href], button, summary, [role="button"], [tabindex]:not([tabindex="-1"])';
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

/** Decorative only: native cursors, clicks and keyboard focus remain available. */
export function PointerEffects() {
  const layerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!layer || !dot || !ring || !glow) return;

    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime = 0;
    let initialized = false;
    let x = 0;
    let y = 0;
    let ringX = 0;
    let ringY = 0;

    function hide() {
      layer!.dataset.visible = "false";
      layer!.dataset.pressed = "false";
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      initialized = false;
    }

    function updateTarget(target: EventTarget | null) {
      if (!(target instanceof Element) || target.closest(EDITABLE)) {
        hide();
        return;
      }
      const control = target.closest(INTERACTIVE);
      layer!.dataset.interactive = String(Boolean(
        control && !control.matches(':disabled, [aria-disabled="true"]'),
      ));
      layer!.dataset.visible = "true";
    }

    function draw(time: number) {
      // Time-based damping keeps the same trailing feel on 60Hz and 120Hz screens.
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const follow = 1 - Math.exp(-elapsed / 85);
      ringX += (x - ringX) * follow;
      ringY += (y - ringY) * follow;
      dot!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      glow!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = 0;
      if (Math.abs(x - ringX) + Math.abs(y - ringY) > 0.1) {
        frame = window.requestAnimationFrame(draw);
      } else {
        previousTime = 0;
      }
    }

    function move(event: PointerEvent) {
      if (!pointer.matches || motion.matches || event.pointerType !== "mouse") {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      updateTarget(event.target);
      if (layer!.dataset.visible !== "true") return;
      if (!initialized) {
        ringX = x;
        ringY = y;
        initialized = true;
      }
      if (!frame) frame = window.requestAnimationFrame(draw);
    }

    function leave(event: PointerEvent) {
      if (!event.relatedTarget) hide();
    }
    function press() { layer!.dataset.pressed = "true"; }
    function release() { layer!.dataset.pressed = "false"; }
    function scroll() {
      if (initialized) updateTarget(document.elementFromPoint(x, y));
    }
    function visibility() { if (document.hidden) hide(); }
    function keyboard(event: KeyboardEvent) { if (event.key === "Tab") hide(); }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", hide, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("keydown", keyboard);
    pointer.addEventListener("change", hide);
    motion.addEventListener("change", hide);

    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", scroll, true);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("keydown", keyboard);
      pointer.removeEventListener("change", hide);
      motion.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div ref={layerRef} className="ui-pointer-effects" aria-hidden="true" data-visible="false">
      <span ref={glowRef} className="ui-pointer-glow" />
      <span ref={ringRef} className="ui-pointer-ring"><span /></span>
      <span ref={dotRef} className="ui-pointer-dot"><span /></span>
    </div>
  );
}
