import { renderHookWithProviders } from "@/test/test-utils";
import { useExperienceTuning } from "@/hooks/useExperienceTuning";
import { act } from "@testing-library/react";
import { vi } from "vitest";

describe("useExperienceTuning", () => {
  const storageKey = "experience_tuning_e1";

  beforeEach(() => {
    localStorage.removeItem(storageKey);
  });

  afterEach(() => {
    localStorage.removeItem(storageKey);
    vi.restoreAllMocks();
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

    const { result } = renderHookWithProviders(() => useExperienceTuning({ experienceId: "e1", persist: true }));

    // loading happens on mount; saved flag should become true
    expect(result.current.saved).toBe(true);
    expect(result.current.savedMen).toBe(2);

    // change values and save
    act(() => {
      result.current.setMen("5");
      result.current.setWomen("6");
      result.current.setRange({ from: new Date(2021, 1, 1), to: new Date(2021, 1, 2) });
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
    const { result } = renderHookWithProviders(() => useExperienceTuning({ experienceId: "e1", persist: true }));

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
      result.current.setRange({ from: new Date(2022, 1, 1), to: new Date(2022, 1, 2) });
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

  it("handles malformed JSON on load gracefully (warns)", () => {
  const spy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  localStorage.setItem(storageKey, "not-a-json");

    const { result } = renderHookWithProviders(() => useExperienceTuning({ experienceId: "e1", persist: true }));

    // should not crash and should have called console.warn
    expect(spy).toHaveBeenCalled();
    expect(result.current.saved).toBe(false);
  });

  it("handles localStorage.setItem throwing (save) by warning and not marking saved", () => {
  const spyWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    // make setItem throw
    const setSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    const { result } = renderHookWithProviders(() => useExperienceTuning({ experienceId: "e1", persist: true }));

    act(() => {
      result.current.setRange({ from: new Date(2022, 1, 1), to: new Date(2022, 1, 2) });
      result.current.setMen("4");
      result.current.setWomen("5");
    });

    act(() => {
      result.current.save();
    });

    expect(spyWarn).toHaveBeenCalled();
    // because setItem threw, the try-block didn't set the saved flags
    expect(result.current.saved).toBe(false);

    setSpy.mockRestore();
  });

  it("handles localStorage.removeItem throwing (reset) by warning but still resets state", () => {
  const spyWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  // pre-populate storage and make removeItem throw
  localStorage.setItem(storageKey, JSON.stringify({}));
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("fail-remove");
    });

    const { result } = renderHookWithProviders(() => useExperienceTuning({ experienceId: "e1", persist: true }));

    // reset should still clear internal state
    act(() => result.current.reset());

    expect(spyWarn).toHaveBeenCalled();
    expect(result.current.saved).toBe(false);

    removeSpy.mockRestore();
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
      result.current.setRange({ from: new Date(2022, 1, 1), to: new Date(2022, 1, 2) });
      // leave men/women as empty strings to trigger the "" ? 0 branch
    });

    let payload: any;

    act(() => {
      payload = result.current.save();
    });

    expect(payload).toBeDefined();
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ men: 0, women: 0 }));
    expect(result.current.savedMen).toBe(0);
    expect(result.current.savedWomen).toBe(0);
  });

  it("calls onSave when men/women are non-empty and passes parsed numbers", () => {
    const onSave = vi.fn();

    const { result } = renderHookWithProviders(() =>
      useExperienceTuning({ experienceId: "e1", persist: true, onSave })
    );

    act(() => {
      result.current.setRange({ from: new Date(2022, 1, 1), to: new Date(2022, 1, 2) });
      result.current.setMen("7");
      result.current.setWomen("8");
    });

    let payload: any;

    act(() => {
      payload = result.current.save();
    });

    expect(payload).toBeDefined();
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ men: 7, women: 8 }));
    expect(result.current.savedMen).toBe(7);
    expect(result.current.savedWomen).toBe(8);
  });
});
