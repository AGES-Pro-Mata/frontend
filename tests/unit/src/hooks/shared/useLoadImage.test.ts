import { createTestQueryClient, renderHookWithProviders } from "@/test/test-utils";
import { useLoadImage } from "@/hooks/shared/useLoadImage";
import { act, waitFor } from "@testing-library/react";
import { vi } from "vitest";

type StubMode = "success" | "error" | "none";

function setupImageStub(mode: StubMode, error: unknown = new Error("image load failed")) {
  const calls: string[] = [];

  class MockImage {
    public onload: ((event?: Event) => void) | null = null;
    public onerror: ((event?: unknown) => void) | null = null;
    private srcValue = "";

    set src(value: string) {
      this.srcValue = value;
      calls.push(value);

      queueMicrotask(() => {
        if (mode === "success") {
          this.onload?.(new Event("load"));
        } else if (mode === "error") {
          this.onerror?.(error);
        }
      });
    }

    get src() {
      return this.srcValue;
    }
  }

  vi.stubGlobal("Image", MockImage as unknown as typeof Image);

  return { calls };
}

describe("useLoadImage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("resolves with the URL when the image loads successfully", async () => {
    const url = "https://example.com/success.png";
    const stub = setupImageStub("success");

    const { result } = renderHookWithProviders(() => useLoadImage(url));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(url);
    expect(stub.calls).toEqual([url]);
  });

  it("surfaces an error when the image fails to load", async () => {
    const url = "https://example.com/error.png";
    const loadError = new Error("boom");
    const stub = setupImageStub("error", loadError);

    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    try {
      const queryClient = createTestQueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            retryDelay: 1000,
          },
        },
      });

      const { result } = renderHookWithProviders(() => useLoadImage(url), {
        queryClient,
      });

      // allow initial onerror invocation to resolve
      await act(async () => {
        await Promise.resolve();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(loadError);
      expect(stub.calls).toHaveLength(3);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not attempt to load when url is empty", () => {
    const stub = setupImageStub("none");

    const { result } = renderHookWithProviders(() => useLoadImage(""));

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
    expect(stub.calls).toHaveLength(0);
  });
});
