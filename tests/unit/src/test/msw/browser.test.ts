import { beforeEach, describe, expect, it, vi } from "vitest";

// Helper accessor to the global window property without using `any`.
const globalWithWindow = () => globalThis as unknown as { window?: unknown };

describe("startBrowserMocking", () => {
  let startMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // reset modules so our mocks are applied fresh for each test
    vi.resetModules();
    vi.clearAllMocks();
    startMock = vi.fn();

    // mock msw/browser to return a worker whose start is our mock
    // use doMock so the mock factory runs after this beforeEach (not hoisted)
    vi.doMock("msw/browser", () => ({
      setupWorker: (..._handlers: unknown[]) => ({ start: startMock }),
    }));

    // handlers can be an empty array; mock the handlers module too
    vi.doMock("@/test/msw/handlers", () => ({ handlers: [] }));
  });

  it("does not call worker.start when window is undefined", async () => {
    // Ensure no window in globalThis
    const gw = globalWithWindow();
    const prevWindow = gw.window;

    delete gw.window;

    const mod = await import("@/test/msw/browser");

    await mod.startBrowserMocking();

    expect(startMock).toHaveBeenCalledTimes(0);

    // restore
    gw.window = prevWindow;
  });

  it("calls worker.start with expected options when window exists", async () => {
    // ensure window exists
    const gw = globalWithWindow();

    gw.window = gw.window ?? {};

    const mod = await import("@/test/msw/browser");

    await mod.startBrowserMocking();

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(startMock).toHaveBeenCalledWith({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: "/mockServiceWorker.js" },
    });
  });
});
