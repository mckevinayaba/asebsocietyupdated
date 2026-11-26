import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useMobileChrome } from "@/hooks/use-mobile-chrome";

const scroll = (y: number) => {
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });
  act(() => window.dispatchEvent(new Event("scroll")));
};

afterEach(() => { Object.defineProperty(window, "scrollY", { configurable: true, value: 0 }); });

describe("mobile navigation pacing", () => {
  it("keeps navigation visible near the top and reveals it when scrolling back", () => {
    const { result } = renderHook(() => useMobileChrome("/summit"));
    scroll(80);
    expect(result.current).toBe(false);
    scroll(250);
    expect(result.current).toBe(true);
    scroll(200);
    expect(result.current).toBe(false);
  });
  it("ignores small scroll jitter and resets on navigation", () => {
    const { result, rerender } = renderHook(({ path }) => useMobileChrome(path), { initialProps: { path: "/summit" } });
    scroll(250);
    scroll(245);
    expect(result.current).toBe(true);
    rerender({ path: "/registry" });
    expect(result.current).toBe(false);
  });
});