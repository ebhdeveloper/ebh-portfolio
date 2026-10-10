import { afterEach, describe, expect, it, vi } from "vitest";
import { transitionTheme } from "./theme-transition";

afterEach(() => vi.unstubAllGlobals());

function browser(reducedMotion = false) {
  const setProperty = vi.fn();
  vi.stubGlobal("window", { matchMedia: () => ({ matches: reducedMotion }) });
  const doc = { documentElement: { style: { setProperty }, classList: { add: vi.fn(), remove: vi.fn() } }, startViewTransition: undefined as undefined | ((update: () => void) => unknown) };
  vi.stubGlobal("document", doc);
  return { doc, setProperty };
}

describe("theme transitions", () => {
  it("still changes theme when the browser lacks view transitions", () => {
    browser();
    const update = vi.fn();
    transitionTheme(update, { x: 40, y: 60 });
    expect(update).toHaveBeenCalledOnce();
  });

  it("respects reduced motion even when view transitions are available", () => {
    const { doc } = browser(true);
    const start = vi.fn();
    doc.startViewTransition = start;
    const update = vi.fn();
    transitionTheme(update, { x: 40, y: 60 });
    expect(update).toHaveBeenCalledOnce();
    expect(start).not.toHaveBeenCalled();
  });

  it("updates inside the snapshot callback and uses the button origin", () => {
    const { doc, setProperty } = browser();
    let callback: (() => void) | undefined;
    doc.startViewTransition = (update) => {
      callback = update;
      return { ready: Promise.resolve(), finished: Promise.resolve() };
    };
    const update = vi.fn();
    transitionTheme(update, { x: 40, y: 60 });
    expect(update).not.toHaveBeenCalled();
    callback!();
    expect(update).toHaveBeenCalledOnce();
    expect(setProperty).toHaveBeenCalledWith("--theme-origin-x", "40px");
    expect(setProperty).toHaveBeenCalledWith("--theme-origin-y", "60px");
  });

  it("still changes theme if starting the transition throws", () => {
    const { doc } = browser();
    doc.startViewTransition = () => { throw new Error("Transition unavailable"); };
    const update = vi.fn();
    expect(() => transitionTheme(update, { x: 40, y: 60 })).not.toThrow();
    expect(update).toHaveBeenCalledOnce();
  });

  it("restores normal styling after an interrupted animation", async () => {
    const { doc } = browser();
    doc.startViewTransition = (update) => {
      update();
      return { ready: Promise.reject(new Error("Skipped")), finished: Promise.resolve() };
    };
    transitionTheme(() => {}, { x: 40, y: 60 });
    expect(doc.documentElement.classList.add).toHaveBeenCalledWith("theme-transition");
    await Promise.resolve();
    expect(doc.documentElement.classList.remove).toHaveBeenCalledWith("theme-transition");
  });

  it("does not let an older animation clear the styling of a newer one", async () => {
    const { doc } = browser();
    const completions: (() => void)[] = [];
    const skip = vi.fn();
    doc.startViewTransition = (update) => {
      update();
      return {
        ready: Promise.resolve(),
        finished: new Promise<void>((resolve) => completions.push(resolve)),
        skipTransition: skip,
      };
    };
    transitionTheme(() => {}, { x: 40, y: 60 });
    transitionTheme(() => {}, { x: 40, y: 60 });
    expect(skip).toHaveBeenCalledOnce();
    completions[0]();
    await Promise.resolve();
    expect(doc.documentElement.classList.remove).not.toHaveBeenCalled();
    completions[1]();
    await Promise.resolve();
    expect(doc.documentElement.classList.remove).toHaveBeenCalledOnce();
  });
});
