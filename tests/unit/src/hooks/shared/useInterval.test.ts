import { act } from "@testing-library/react";
import { renderHookWithProviders } from "@/test/test-utils";
import { noop, useInterval } from "@/hooks/shared/useInterval";

describe("useInterval hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls immediate callback when immediate=true", () => {
    const cb = vi.fn();

    renderHookWithProviders(() => {
      useInterval(cb, 100, true);
    });

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("schedules periodic calls and clear stops them", () => {
    const cb = vi.fn();

    const { result } = renderHookWithProviders(() => useInterval(cb, 100));

    // advance timers a few ticks
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(cb).toHaveBeenCalledTimes(2); // at ~100ms and ~200ms

    // call clear
    act(() => {
      result.current();
      vi.advanceTimersByTime(500);
    });

    const callsAfterClear = cb.mock.calls.length;

    // no further calls after clear
    expect(callsAfterClear).toBeLessThanOrEqual(2);
  });

  it("does not call immediate when delay is null or false", () => {
    const cb = vi.fn();

    // immediate true but delay null -> should not call
    renderHookWithProviders(() => {
      useInterval(cb, null, true);
    });

    expect(cb).not.toHaveBeenCalled();

    // immediate true but delay false -> should not call
    const cb2 = vi.fn();

    renderHookWithProviders(() => {
      useInterval(cb2, false, true);
    });

    expect(cb2).not.toHaveBeenCalled();
  });

  it("clear is safe when no interval was created", () => {
    const cb = vi.fn();

    const { result } = renderHookWithProviders(() => useInterval(cb, null));

    // calling clear when there is no interval should be a no-op
    act(() => {
      result.current();
    });

    // advance timers to be sure nothing runs
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(cb).not.toHaveBeenCalled();
  });

  it("uses the latest callback after rerender", () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    const { rerender } = renderHookWithProviders(
      ({ cb, delay }) => useInterval(cb, delay),
      { initialProps: { cb: cb1, delay: 100 } }
    );

    // advance one tick -> cb1 should run
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(cb1).toHaveBeenCalledTimes(1);

    // change callback to cb2
    rerender({ cb: cb2, delay: 100 });

    // next tick should call cb2, not cb1
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(cb2).toHaveBeenCalled();
  });

  it("noop function exists and is callable", () => {
    // ensure noop is covered
    expect(noop()).toBeUndefined();
  });
});
