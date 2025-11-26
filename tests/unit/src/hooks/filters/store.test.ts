import { useFilterStore } from "@/hooks/filters/store";

describe("filter store", () => {
  beforeEach(() => {
    useFilterStore.setState(() => ({ filterStates: {} }));
  });

  it("setFilter with setQueryOnChange=true updates filters and query", () => {
    useFilterStore.getState().setFilter({
      key: "k",
      filterKey: "a",
      value: "1",
      setQueryOnChange: true,
    });

    const state = useFilterStore.getState().filterStates["k"];

    expect(state.values).toEqual({ a: "1" });

    expect(state.filters).toEqual({ a: "1" });

    expect(state.query).toBe("a=1");
  });

  it("setFilter with setQueryOnChange=false updates values only", () => {
    useFilterStore.getState().setFilter({
      key: "k",
      filterKey: "a",
      value: "1",
      setQueryOnChange: false,
    });

    const state = useFilterStore.getState().filterStates["k"];

    expect(state.values).toEqual({ a: "1" });

    expect(state.filters).toEqual({});

    expect(state.query).toBe("");
  });

  it("setFilters defaults to setQueryOnChange=true", () => {
    useFilterStore.getState().setFilters({ key: "k", newFilters: { a: "1" } });

    const state = useFilterStore.getState().filterStates["k"];

    expect(state.values).toEqual({ a: "1" });

    expect(state.filters).toEqual({ a: "1" });

    expect(state.query).toBe("a=1");
  });

  it("applyValues copies values to filters and builds query", () => {
    // set values without updating filters
    useFilterStore.getState().setFilter({
      key: "k",
      filterKey: "a",
      value: "1",
      setQueryOnChange: false,
    });

    let state = useFilterStore.getState().filterStates["k"];

    expect(state.filters).toEqual({});

    useFilterStore.getState().applyValues("k");

    state = useFilterStore.getState().filterStates["k"];

    expect(state.filters).toEqual({ a: "1" });

    expect(state.query).toBe("a=1");
  });

  it("deleteFilter removes the key", () => {
    useFilterStore.getState().setFilters({ key: "k", newFilters: { a: "1" } });
    expect(useFilterStore.getState().filterStates["k"]).toBeDefined();

    useFilterStore.getState().deleteFilter("k");
    expect(useFilterStore.getState().filterStates["k"]).toBeUndefined();
  });

  it("initFilterState does not override existing state", () => {
    useFilterStore.getState().initFilterState({
      key: "k",
      initialFilters: { a: "1" },
      setQueryOnChange: true,
    });
    // mutate state
    useFilterStore.getState().setFilter({
      key: "k",
      filterKey: "b",
      value: "2",
      setQueryOnChange: true,
    });

    // second init should be a no-op
    useFilterStore.getState().initFilterState({
      key: "k",
      initialFilters: { a: "x" },
      setQueryOnChange: true,
    });

    const state = useFilterStore.getState().filterStates["k"];

    expect(state.values).toEqual({ a: "1", b: "2" });
  });

  it("getFilterState returns defaults when missing", () => {
    const missing = useFilterStore.getState().getFilterState({
      key: "missing",
      initialFilters: { a: "1" },
      setQueryOnChange: false,
    });

    expect(missing.values).toEqual({ a: "1" });

    expect(missing.filters).toEqual({});

    expect(missing.query).toBe("");

    const present = useFilterStore.getState().getFilterState({
      key: "another",
      initialFilters: { a: "1" },
      setQueryOnChange: true,
    });

    expect(present.values).toEqual({ a: "1" });

    expect(present.filters).toEqual({ a: "1" });

    expect(present.query).toBe("a=1");
  });

  it("ignores null values when creating search params via setFilters", () => {
    useFilterStore.getState().setFilters({
      key: "k",
      newFilters: { a: "1", b: null as unknown as string },
      setQueryOnChange: true,
    });
    const state = useFilterStore.getState().filterStates["k"];

    // b should be omitted from query because createSearchParams skips null

    expect(state.query).toBe("a=1");
  });

  it("applyValues when key is missing initializes entry with defaults", () => {
    // ensure key does not exist
    expect(useFilterStore.getState().filterStates["missing"]).toBeUndefined();

    useFilterStore.getState().applyValues("missing");

    const state = useFilterStore.getState().filterStates["missing"];

    // when missing, applyValues should create an entry based on DEFAULT_STATE
    expect(state).toBeDefined();
    expect(state.values).toEqual({});
    expect(state.filters).toEqual({});
    expect(state.query).toBe("");
  });
});
