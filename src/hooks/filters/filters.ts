import { useEffect, useId } from "react";
import { useFilterStore } from "./store";

export type UseFiltersParams<F> = {
  key?: string;
  initialFilters?: Partial<F>;
  setQueryOnChange?: boolean;
  persist?: boolean;
};

export type SetFiltersOptions = {
  setQueryOnChange?: boolean;
};

export type UseFiltersReturn<F> = {
  filters: F;
  setFilters: (filters: Partial<F>, options?: SetFiltersOptions) => void;
  setFilter: <K extends keyof F>(
    key: K,
    value: F[K],
    options?: SetFiltersOptions
  ) => void;
  values: F;
  query: string;
  applyValues: () => void;
  reset: () => void;
};

export function useFilters<F>(
  params: UseFiltersParams<F> = {}
): UseFiltersReturn<F> {
  const id = useId();
  const { key = id, setQueryOnChange = true, persist = false } = params;

  const {
    getFilterState,
    setFilter: setStoreFilter,
    setFilters: setStoreFilters,
    applyValues: applyStoreValues,
    deleteFilter,
  } = useFilterStore();

  const { values, filters, query } = getFilterState({
    key,
    initialFilters: params.initialFilters as Record<string, unknown>,
    setQueryOnChange,
  });

  const handleSetFilter = <K extends keyof F>(
    filterKey: K,
    value: F[K],
    options: SetFiltersOptions = {}
  ) => {
    setStoreFilter({
      key,
      filterKey: filterKey as string,
      value,
      setQueryOnChange: options.setQueryOnChange ?? setQueryOnChange,
    });
  };

  const handleSetFilters = (
    newFilters: Partial<F>,
    options: SetFiltersOptions = {}
  ) => {
    setStoreFilters({
      key,
      newFilters,
      setQueryOnChange: options.setQueryOnChange ?? setQueryOnChange,
    });
  };

  const handleApplyValues = () => {
    applyStoreValues(key);
  };

  const handleReset = () => {
    deleteFilter(key);
    getFilterState({
      key,
      initialFilters: params.initialFilters as Record<string, unknown>,
      setQueryOnChange,
    });
  };

  useEffect(() => {
    if (!persist) {
      return () => {
        deleteFilter(key);
      };
    }
    return undefined;
  }, [persist, key, deleteFilter]);

  return {
    query,
    values: values as F,
    filters: filters as F,
    setFilter: handleSetFilter,
    setFilters: handleSetFilters,
    applyValues: handleApplyValues,
    reset: handleReset,
  };
}
