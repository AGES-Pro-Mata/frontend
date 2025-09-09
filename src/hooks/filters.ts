import type { TApiDefaultFilters } from "@/entities/api-default-filters";
import React from "react";

const DEFAULTS_FILTERS: TApiDefaultFilters = {
  limit: 10,
  page: 0,
  sort: undefined,
  dir: undefined,
};

export type UseFiltersReturn<TApiDefaultFilters> = {
  filters: TApiDefaultFilters;
  setFilter: <K extends keyof TApiDefaultFilters>(
    key: K,
    value: TApiDefaultFilters[K]
  ) => void;
  reset: () => void;
};

export const useFilters = (): UseFiltersReturn<TApiDefaultFilters> => {
  const [filters, setFilters] =
    React.useState<TApiDefaultFilters>(DEFAULTS_FILTERS);

  const setFilter = <K extends keyof TApiDefaultFilters>(
    key: K,
    value: TApiDefaultFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setFilters(DEFAULTS_FILTERS);
  };

  return { filters, setFilter, reset };
};
