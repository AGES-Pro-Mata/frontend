/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable indent */
import { create } from 'zustand'

interface FilterStateValue {
  filters: Record<string, unknown>
  values: Record<string, unknown>
  query: string
}

type FilterState = Record<string, FilterStateValue>

type FilterStore = {
  filterStates: FilterState
  setFilter: (params: {
    key: string
    filterKey: string
    value: unknown
    setQueryOnChange?: boolean
  }) => void
  setFilters: (params: {
    key: string
    newFilters: Record<string, unknown>
    setQueryOnChange?: boolean
  }) => void
  applyValues: (key: string) => void
  deleteFilter: (key: string) => void
  initFilterState: (params: {
    key: string
    initialFilters?: Record<string, unknown>
    setQueryOnChange?: boolean
  }) => void
  getFilterState: (params: {
    key: string
    initialFilters?: Record<string, unknown>
    setQueryOnChange?: boolean
  }) => FilterStateValue
}

const createSearchParams = (obj: Record<string, unknown>): string => {
  const params = new URLSearchParams()
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null) {
      params.append(key, String(value))
    }
  })
  return params.toString()
}

const DEFAULT_STATE: FilterStateValue = {
  filters: {},
  values: {},
  query: ''
}

export const useFilterStore = create<FilterStore>()((set, get) => ({
  filterStates: {},
  setFilter: ({ key, filterKey, value, setQueryOnChange }) => {
    set((state) => {
      const currentState = state.filterStates[key] ?? DEFAULT_STATE
      const newValues = {
        ...currentState.values,
        [filterKey]: value
      }

      return {
        filterStates: {
          ...state.filterStates,
          [key]: {
            ...currentState,
            values: newValues,
            ...(setQueryOnChange && {
              filters: newValues,
              query: createSearchParams(newValues)
            })
          }
        }
      }
    })
  },
  setFilters: ({ key, newFilters, setQueryOnChange = true }) => {
    set((state) => {
      const currentState = state.filterStates[key] ?? DEFAULT_STATE
      const updatedValues = {
        ...currentState.values,
        ...newFilters
      }

      return {
        filterStates: {
          ...state.filterStates,
          [key]: {
            ...currentState,
            values: updatedValues,
            ...(setQueryOnChange && {
              filters: updatedValues,
              query: createSearchParams(updatedValues)
            })
          }
        }
      }
    })
  },
  applyValues: (key) => {
    set((state) => {
      const currentState = state.filterStates[key] ?? DEFAULT_STATE
      return {
        filterStates: {
          ...state.filterStates,
          [key]: {
            ...currentState,
            filters: currentState.values,
            query: createSearchParams(currentState.values)
          }
        }
      }
    })
  },
  deleteFilter: (key) => {
    set((state) => ({
      filterStates: Object.fromEntries(
        Object.entries(state.filterStates).filter(([k]) => k !== key)
      )
    }))
  },
  initFilterState: ({ key, initialFilters = {}, setQueryOnChange = true }) => {
    set((prev) => {
      if (prev.filterStates[key]) return prev

      const newState = {
        values: initialFilters,
        filters: setQueryOnChange ? initialFilters : {},
        query: setQueryOnChange ? createSearchParams(initialFilters) : ''
      }

      return {
        filterStates: {
          ...prev.filterStates,
          [key]: newState
        }
      }
    })
  },
  getFilterState: ({ key, initialFilters = {}, setQueryOnChange = true }) => {
    const state = get().filterStates[key]
    if (state) return state

    return {
      values: initialFilters,
      filters: setQueryOnChange ? initialFilters : {},
      query: setQueryOnChange ? createSearchParams(initialFilters) : ''
    }
  }
}))
