import { beforeEach, describe, expect, it, vi } from "vitest";

describe("src/test/msw/index - re-exports", () => {
  beforeEach(() => {
    // reset module registry so our mocks are applied on import
    vi.resetModules();
  });

  it("re-exports handlers and server and browser exports", async () => {
    const fakeHandlers = [{ type: "rest" }];
    const fakeServer = { listen: vi.fn(), close: vi.fn() };
    const fakeWorker = { start: vi.fn() };
    const fakeStart = vi.fn();

    // Install mocks before importing the index module
    vi.doMock("@/test/msw/handlers", () => ({ handlers: fakeHandlers }));
    vi.doMock("@/test/msw/server", () => ({ server: fakeServer }));
    vi.doMock("@/test/msw/browser", () => ({
      worker: fakeWorker,
      startBrowserMocking: fakeStart,
    }));

    const mod = await import("@/test/msw/index");

    // The index should re-export the same references we mocked
    expect(mod.handlers).toBe(fakeHandlers);
    expect(mod.server).toBe(fakeServer);
    expect(mod.worker).toBe(fakeWorker);
    expect(mod.startBrowserMocking).toBe(fakeStart);
  });
});
