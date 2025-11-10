import { act } from "@testing-library/react";
import { vi } from "vitest";

const capturedApplyDataCallbacks = vi.hoisted(
  () =>
    [] as Array<
      (
        data: import("@/types/experience").ExperienceTuningData | null,
        markSaved: boolean
      ) => void
    >
);

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useCallback: ((
      fn: unknown,
      deps: Parameters<typeof actual.useCallback>[1]
    ) => {
      capturedApplyDataCallbacks.push(
        fn as (
          data: import("@/types/experience").ExperienceTuningData | null,
          markSaved: boolean
        ) => void
      );

      return actual.useCallback(
        fn as Parameters<typeof actual.useCallback>[0],
        deps
      );
    }) as typeof actual.useCallback,
  } satisfies typeof import("react");
});

import { renderHookWithProviders } from "@/test/test-utils";
import { useExperienceTuning } from "@/hooks/useExperienceTuning";
import type { ExperienceTuningData } from "@/types/experience";

describe("useExperienceTuning", () => {
  const storageKey = "experience_tuning_e1";

  beforeEach(() => {
    capturedApplyDataCallbacks.length = 0;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore when custom spies force removeItem to throw
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore when custom spies force removeItem to throw
    }
  });

  it("loads persisted data and save/reset behave as expected", () => {
    const saved = {
      experienceId: "e1",
      men: 2,
      women: 3,
      from: new Date(2020, 1, 1).toISOString(),
      to: new Date(2020, 1, 2).toISOString(),
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(saved));

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true })
    );

    // loading happens on mount; saved flag should become true
    expect(result.current.saved).toBe(true);
    expect(result.current.savedMen).toBe(2);

    // change values and save
    act(() => {
      result.current.setMen("5");
      result.current.setWomen("6");
      result.current.setRange({
        from: new Date(2021, 1, 1),
        to: new Date(2021, 1, 2),
      });
    });

    // capture save return value while using act
    let payload: any;

    act(() => {
      payload = result.current.save();
    });

    expect(payload).toBeDefined();

    // reset clears
    act(() => result.current.reset());

    expect(result.current.saved).toBe(false);
  });

  it("save returns undefined when range is missing", () => {
    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true })
    );

    // nothing set; save should return undefined and not mark as saved
    let payload: any;

    act(() => {
      payload = result.current.save();
    });

    expect(payload).toBeUndefined();
    expect(result.current.saved).toBe(false);
  });

  it("persists to memory when persist=false (no storageKey) and does not write localStorage", () => {
    const key = "experience_tuning_e3";
    // ensure no storage entry

    localStorage.removeItem(key);

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e3", persist: false })
    );

    act(() => {
      result.current.setRange({
        from: new Date(2022, 1, 1),
        to: new Date(2022, 1, 2),
      });
      result.current.setMen("1");
      result.current.setWomen("2");
    });

    let payload: any;

    act(() => {
      payload = result.current.save();
    });

    expect(payload).toBeDefined();
    // no localStorage entry should be created because persist=false
    expect(localStorage.getItem(`experience_tuning_e3`)).toBeNull();
    expect(result.current.saved).toBe(true);
  });

  it("handles malformed JSON on load gracefully without logging", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    localStorage.setItem(storageKey, "not-a-json");

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true })
    );

    // should not crash or mark the state as saved
    expect(result.current.saved).toBe(false);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("handles localStorage.setItem throwing (save) without crashing", () => {
    const setSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true })
    );

    act(() => {
      result.current.setRange({
        from: new Date(2022, 1, 1),
        to: new Date(2022, 1, 2),
      });
      result.current.setMen("4");
      result.current.setWomen("5");
    });

    act(() => {
      result.current.save();
    });

    expect(setSpy).toHaveBeenCalled();
    // state is still marked as saved even if persistence fails silently
    expect(result.current.saved).toBe(true);
  });

  it("handles localStorage.removeItem throwing (reset) without crashing", () => {
    // pre-populate storage and make removeItem throw
    localStorage.setItem(storageKey, JSON.stringify({}));
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("fail-remove");
    });

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true })
    );

    // reset should still clear internal state
    act(() => result.current.reset());

    expect(result.current.saved).toBe(false);
    expect(removeSpy).toHaveBeenCalled();

    // storage entry isn't removed but state stays consistent
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify({}));
  });

  it("calls onLoad when persisted data exists and defaults missing men/women to 0", () => {
    const onLoad = vi.fn();

    const saved = {
      experienceId: "e1",
      // men/women intentionally omitted to hit nullish-coalescing fallback
      from: new Date(2020, 1, 1).toISOString(),
      to: new Date(2020, 1, 2).toISOString(),
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(saved));

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true, onLoad })
    );

    expect(onLoad).toHaveBeenCalled();
    // missing men/women should coalesce to 0
    expect(result.current.savedMen).toBe(0);
    expect(result.current.savedWomen).toBe(0);
    expect(result.current.men).toBe("0");
    expect(result.current.women).toBe("0");
  });

  it("calls onSave and uses 0 when men/women are empty strings", () => {
    const onSave = vi.fn();

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true, onSave })
    );

    act(() => {
      result.current.setRange({
        from: new Date(2022, 1, 1),
        to: new Date(2022, 1, 2),
      });
      // leave men/women as empty strings to trigger the "" ? 0 branch
    });

    let payload: any;

    act(() => {
      payload = result.current.save();
    });

    expect(payload).toBeDefined();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ men: 0, women: 0 })
    );
    expect(result.current.savedMen).toBe(0);
    expect(result.current.savedWomen).toBe(0);
  });

  it("calls onSave when men/women are non-empty and passes parsed numbers", () => {
    const onSave = vi.fn();

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true, onSave })
    );

    act(() => {
      result.current.setRange({
        from: new Date(2022, 1, 1),
        to: new Date(2022, 1, 2),
      });
      result.current.setMen("7");
      result.current.setWomen("8");
    });

    let payload: any;

    act(() => {
      payload = result.current.save();
    });

    expect(payload).toBeDefined();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ men: 7, women: 8 })
    );
    expect(result.current.savedMen).toBe(7);
    expect(result.current.savedWomen).toBe(8);
  });

  it("ignores persisted data when dates are invalid", () => {
    const onLoad = vi.fn();

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        experienceId: "e1",
        men: 3,
        women: 4,
        from: "invalid-date",
        to: new Date(2020, 1, 2).toISOString(),
        savedAt: new Date().toISOString(),
      })
    );

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true, onLoad })
    );

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(result.current.saved).toBe(false);
    expect(result.current.range.from).toBeUndefined();
    expect(result.current.range.to).toBeUndefined();
  });

  it("normalizes negative and non-numeric persisted counts to zero", () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        experienceId: "e1",
        men: -5,
        women: "not-a-number",
        from: new Date(2020, 1, 1).toISOString(),
        to: new Date(2020, 1, 2).toISOString(),
        savedAt: new Date().toISOString(),
      })
    );

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true })
    );

    expect(result.current.savedMen).toBe(0);
    expect(result.current.savedWomen).toBe(0);
    expect(result.current.men).toBe("0");
    expect(result.current.women).toBe("0");
  });

  it("applies initialData with Date objects and resets when initialData is removed", () => {
    const initial = {
      experienceId: "e1",
      men: 4,
      women: 5,
      from: new Date(2024, 0, 1),
      to: new Date(2024, 0, 2),
      savedAt: new Date().toISOString(),
    } as unknown as ExperienceTuningData;

    type HookProps = { data: ExperienceTuningData | null };

    const { result, rerender } = renderHookWithProviders<
      ReturnType<typeof useExperienceTuning>,
      HookProps
    >(
      ({ data }) =>
        useExperienceTuning({
          experienceId: "e1",
          persist: true,
          initialData: data,
        }),
      { initialProps: { data: initial } }
    );

    expect(result.current.range.from).toBeInstanceOf(Date);
    expect(result.current.range.to).toBeInstanceOf(Date);
    expect(result.current.men).toBe("4");
    expect(result.current.women).toBe("5");
    expect(result.current.saved).toBe(true);

    act(() => {
      rerender({ data: null });
    });

    expect(result.current.range.from).toBeUndefined();
    expect(result.current.range.to).toBeUndefined();
    expect(result.current.men).toBe("");
    expect(result.current.women).toBe("");
    expect(result.current.saved).toBe(false);
  });

  it("skips storage access when experienceId is missing", () => {
    const getSpy = vi.spyOn(Storage.prototype, "getItem");

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ persist: true })
    );

    expect(getSpy).not.toHaveBeenCalled();
    expect(result.current.saved).toBe(false);
  });

  it("ignores persisted payloads missing required fields", () => {
    const onLoad = vi.fn();

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        experienceId: "e1",
        to: new Date(2020, 1, 2).toISOString(),
        savedAt: new Date().toISOString(),
      })
    );

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true, onLoad })
    );

    expect(onLoad).not.toHaveBeenCalled();
    expect(result.current.saved).toBe(false);
  });

  it("ignores persisted payloads that are not objects", () => {
    const onLoad = vi.fn();

    localStorage.setItem(storageKey, JSON.stringify("oops"));

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true, onLoad })
    );

    expect(onLoad).not.toHaveBeenCalled();
    expect(result.current.saved).toBe(false);
  });

  it("no-ops when applyData receives null or empty ranges", () => {
    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true })
    );

  const applyData = capturedApplyDataCallbacks[0];

  expect(applyData).toBeDefined();

    if (!applyData) {
      throw new Error("applyData callback not captured");
    }

    applyData(null, false);

    applyData(
      {
        experienceId: "e1",
        men: null as unknown as number,
        women: null as unknown as number,
        from: null as unknown as string,
        to: null as unknown as string,
        savedAt: new Date().toISOString(),
      } as unknown as ExperienceTuningData,
      false
    );

    expect(result.current.saved).toBe(false);
  });
});
