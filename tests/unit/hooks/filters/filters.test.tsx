import { act } from "@testing-library/react";
import { renderHookWithProviders } from "@/test/test-utils";
import { useFilters } from "@/hooks/filters/filters";
import { useFilterStore } from "@/hooks/filters/store";

describe("useFilters hook", () => {
  beforeEach(() => {
    // reset the zustand store before each test
    useFilterStore.setState(() => ({ filterStates: {} }));
  });

  it("initializes with initialFilters and builds query when setQueryOnChange=true", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true })
    );

    expect(result.current.values).toEqual({ a: "1" });
    expect(result.current.filters).toEqual({ a: "1" });
    expect(result.current.query).toBe("a=1");

    const storeState = useFilterStore.getState().filterStates["k"];

    expect(storeState).toBeDefined();
    expect(storeState.values).toEqual({ a: "1" });
  });

  it("setFilter updates values and filters when setQueryOnChange=true", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string; b?: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true })
    );

    act(() => {
      result.current.setFilter("b", "2");
    });

    const storeState = useFilterStore.getState().filterStates["k"];

    expect(storeState.values).toEqual({ a: "1", b: "2" });
    expect(storeState.filters).toEqual({ a: "1", b: "2" });
    expect(storeState.query).toBe("a=1&b=2");
  });

  it("setFilters with setQueryOnChange=false updates values but not filters/query", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string; b?: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true })
    );

    act(() => {
      result.current.setFilters({ b: "2" }, { setQueryOnChange: false });
    });

    const storeState = useFilterStore.getState().filterStates["k"];

    expect(storeState.values).toEqual({ a: "1", b: "2" });
    // filters and query should remain as before (only initial a=1)
    expect(storeState.filters).toEqual({ a: "1" });
    expect(storeState.query).toBe("a=1");
  });

  it("setFilters defaults to setQueryOnChange=true when options omitted", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string; b?: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true })
    );

    act(() => {
      // omit options to use default
      result.current.setFilters({ b: "2" });
    });

    const storeState = useFilterStore.getState().filterStates["k"];

    expect(storeState.values).toEqual({ a: "1", b: "2" });

    // default should have updated filters and query
    expect(storeState.filters).toEqual({ a: "1", b: "2" });
    expect(storeState.query).toBe("a=1&b=2");
  });

  it("applyValues copies values to filters and updates query", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string; b?: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: false })
    );

    // initially filters shouldn't contain values because setQueryOnChange=false
    expect(result.current.filters).toEqual({});

    act(() => {
      result.current.setFilter("b", "2", { setQueryOnChange: false });
    });

    let storeState = useFilterStore.getState().filterStates["k"];

    expect(storeState.values).toEqual({ a: "1", b: "2" });
    // still no filters since setQueryOnChange was false
    expect(storeState.filters).toEqual({});

    act(() => {
      result.current.applyValues();
    });

    storeState = useFilterStore.getState().filterStates["k"];
    expect(storeState.filters).toEqual({ a: "1", b: "2" });
    expect(storeState.query).toBe("a=1&b=2");
  });

  it("reset removes the filter state for the key", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true })
    );

    // ensure key exists
    expect(useFilterStore.getState().filterStates["k"]).toBeDefined();

    act(() => {
      result.current.reset();
    });

    expect(useFilterStore.getState().filterStates["k"]).toBeUndefined();
  });

  it("unmount cleans up when persist=false", () => {
    const { unmount } = renderHookWithProviders(() =>
      useFilters<{ a: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true, persist: false })
    );

    expect(useFilterStore.getState().filterStates["k"]).toBeDefined();

    unmount();

    expect(useFilterStore.getState().filterStates["k"]).toBeUndefined();
  });

  it("ignores null values when building query", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string; b: string | null }>({
        key: "k",
        initialFilters: { a: "1", b: null },
        setQueryOnChange: true,
      })
    );

    // b is null so it should be omitted from the query
    expect(result.current.query).toBe("a=1");
  });

  it("setFilter with setQueryOnChange=false updates values but not filters/query", () => {
    const { result } = renderHookWithProviders(() =>
      useFilters<{ a: string; b?: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true })
    );

    act(() => {
      result.current.setFilter("b", "2", { setQueryOnChange: false });
    });

  const storeState = useFilterStore.getState().filterStates["k"];

  expect(storeState.values).toEqual({ a: "1", b: "2" });
    // filters and query should remain as before (only initial a=1)
    expect(storeState.filters).toEqual({ a: "1" });
    expect(storeState.query).toBe("a=1");
  });

  it("does not cleanup on unmount when persist=true", () => {
    const { unmount } = renderHookWithProviders(() =>
      useFilters<{ a: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true, persist: true })
    );

    expect(useFilterStore.getState().filterStates["k"]).toBeDefined();

    unmount();

    // because persist=true the state should remain after unmount
    expect(useFilterStore.getState().filterStates["k"]).toBeDefined();
  });

  it("runs cleanup when effect dependencies change (persist flips)", () => {
    const { rerender } = renderHookWithProviders(
      (props: { persist: boolean }) =>
        useFilters<{ a: string }>({ key: "k", initialFilters: { a: "1" }, setQueryOnChange: true, persist: props.persist }),
      { initialProps: { persist: false } }
    );

    // state exists initially
    expect(useFilterStore.getState().filterStates["k"]).toBeDefined();

    // flip persist to true; this should cause the effect to re-run and the previous
    // cleanup (which deletes the filter) to execute
    act(() => {
      rerender({ persist: true });
    });

    expect(useFilterStore.getState().filterStates["k"]).toBeUndefined();
  });
});
