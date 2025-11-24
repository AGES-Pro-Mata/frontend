import { renderHookWithProviders } from "@/test/test-utils";

function createMatchMediaMock() {
  const listeners: Array<(e: any) => void> = [];

  return {
    addEventListener: (_: string, cb: (e: any) => void) => listeners.push(cb),

    removeEventListener: (_: string, cb: (e: any) => void) => {
      const idx = listeners.indexOf(cb);

      if (idx >= 0) listeners.splice(idx, 1);
    },
    // helper to trigger change
    trigger: (matches: boolean) => listeners.forEach((l) => l({ matches })),
  };
}

import { useIsMobile } from "@/hooks/shared/useMobile";
import { act } from "@testing-library/react";

describe("useIsMobile", () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    // restore default if needed
    // remove test matchMedia if present
    delete (window as unknown as Record<string, unknown>)["matchMedia"];
  });

  it("returns true when window innerWidth is less than breakpoint and updates on change", () => {
    window.innerWidth = 320;

    // provide matchMedia implementation with trigger helper

    const m = createMatchMediaMock();

    // attach test matchMedia (cast to satisfy DOM types)

    window.matchMedia = () => m as unknown as MediaQueryList;
    let result: any = undefined;

    act(() => {
      // render inside act so the initial effect updates are wrapped

      result = renderHookWithProviders(() => useIsMobile()).result;
    });

    expect((result as { current: unknown }).current).toBe(true);

    // simulate resize to large and trigger change event inside act
    act(() => {
      window.innerWidth = 1024;
      m.trigger(false);
    });

    expect((result as { current: unknown }).current).toBe(false);
  });
});
