// @vitest-environment happy-dom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { useCopy } from "../use-copy";

function mockClipboard(impl: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn(impl) },
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useCopy", () => {
  it("flips copied=true after a successful write and resets after resetMs", async () => {
    mockClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopy(1500));

    expect(result.current.copied).toBe(false);

    await act(async () => {
      await result.current.copy("hello");
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.copied).toBe(false);
  });

  it("uses the default 1500ms reset window", async () => {
    mockClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.copied).toBe(false);
  });

  it("swallows clipboard rejections and leaves copied=false", async () => {
    mockClipboard(() => Promise.reject(new Error("not allowed")));
    const { result } = renderHook(() => useCopy(1500));

    await act(async () => {
      await result.current.copy("hello");
    });

    expect(result.current.copied).toBe(false);
  });

  it("re-arms the reset timer on a second copy without leaking the first", async () => {
    mockClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopy(1500));

    await act(async () => {
      await result.current.copy("a");
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(true);

    await act(async () => {
      await result.current.copy("b");
    });
    expect(result.current.copied).toBe(true);

    // The first 1500ms timer must have been cleared; advancing the remaining
    // 500ms of the original window should NOT flip back to false.
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(false);
  });

  it("clears its pending timer on unmount", async () => {
    mockClipboard(() => Promise.resolve());
    const { result, unmount } = renderHook(() => useCopy(1500));

    await act(async () => {
      await result.current.copy("hello");
    });
    expect(result.current.copied).toBe(true);

    unmount();
    expect(() => vi.advanceTimersByTime(1500)).not.toThrow();
  });
});
