import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

// Types
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  isSuccess: boolean
  isError: boolean
}

export interface UseApiOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  showErrorToast?: boolean
  showSuccessToast?: boolean | string
  successMessage?: string
  retryCount?: number
  retryDelay?: number
  transform?: (data: any) => T
  cache?: boolean
  cacheKey?: string
  debounceDelay?: number
}

export interface UseApiReturn<T, P extends any[]> extends ApiState<T> {
  execute: (...params: P) => Promise<T | null>
  reset: () => void
  retry: () => void
  cancel: () => void
}

// Cache implementation
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

const DEFAULT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function clearApiCache(key?: string) {
  if (key) {
    apiCache.delete(key)
  } else {
    apiCache.clear()
  }
}

function getCachedData<T>(key: string): T | null {
  const cached = apiCache.get(key)

  if (!cached) return null
  
  const now = Date.now()

  if (now - cached.timestamp > cached.ttl) {
    apiCache.delete(key)

    return null
  }
  
  return cached.data as T
}

function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL) {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

// Main hook
export function useApi<T, P extends any[] = []>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const {
    immediate = false,
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    retryCount = 0,
    retryDelay = 1000,
    transform,
    cache = false,
    cacheKey,
    debounceDelay = 0,
  } = options

  // State
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
    isError: false,
  })

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastParamsRef = useRef<P | null>(null)
  const mountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Reset function
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
    })
    abortControllerRef.current?.abort()
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  // Execute function with retry logic
  const executeWithRetry = useCallback(
    async (params: P, currentRetry = 0): Promise<T | null> => {
      try {
        // Cancel previous request
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()

        // Check cache first
        if (cache && cacheKey) {
          const cached = getCachedData<T>(cacheKey)

          if (cached) {
            if (!mountedRef.current) return null
            
            setState(prev => ({
              ...prev,
              data: cached,
              loading: false,
              error: null,
              isSuccess: true,
              isError: false,
            }))
            
            onSuccess?.(cached)

            return cached
          }
        }

        // Set loading state
        if (!mountedRef.current) return null
        setState(prev => ({
          ...prev,
          loading: true,
          error: null,
          isError: false,
        }))

        // Execute API call
        const rawData = await apiFunction(...params)
        
        if (!mountedRef.current) return null

        // Transform data if transform function provided
        const data = transform ? transform(rawData) : rawData

        // Cache data if caching enabled
        if (cache && cacheKey) {
          setCachedData(cacheKey, data)
        }

        // Update state
        setState({
          data,
          loading: false,
          error: null,
          isSuccess: true,
          isError: false,
        })

        // Success callbacks
        onSuccess?.(data)
        
        if (showSuccessToast) {
          const message = typeof showSuccessToast === 'string' 
            ? showSuccessToast 
            : successMessage || 'Operação realizada com sucesso!'
            
          toast.success(message)
        }

        return data
      } catch (error) {
        if (!mountedRef.current) return null

        // Handle abort
        if (error instanceof Error && error.name === 'AbortError') {
          return null
        }

        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

        // Retry logic
        if (currentRetry < retryCount) {
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current)
          }

          retryTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              void executeWithRetry(params, currentRetry + 1)
            }
          }, retryDelay * Math.pow(2, currentRetry)) // Exponential backoff

          return null
        }

        // Update error state
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          isSuccess: false,
          isError: true,
        })

        // Error callbacks
        onError?.(errorMessage)
        
        if (showErrorToast) {
          toast.error(`Erro: ${errorMessage}`)
        }

        return null
      }
    },
    [
      apiFunction,
      onSuccess,
      onError,
      showErrorToast,
      showSuccessToast,
      successMessage,
      retryCount,
      retryDelay,
      transform,
      cache,
      cacheKey,
    ]
  )

  // Main execute function with debouncing
  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      lastParamsRef.current = params

      if (debounceDelay > 0) {
        return new Promise<T | null>((resolve) => {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }

          debounceTimeoutRef.current = setTimeout(() => {
            executeWithRetry(params)
              .then((result) => {
                resolve(result)
              })
              .catch((_error) => {
                resolve(null)
              })
          }, debounceDelay)
        })
      }

      return executeWithRetry(params)
    },
    [executeWithRetry, debounceDelay]
  )

  // Retry function
  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      void execute(...lastParamsRef.current)
    }
  }, [execute])

  // Cancel function
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    
    setState(prev => ({
      ...prev,
      loading: false,
    }))
  }, [])

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      // TypeScript workaround for empty params
      void execute(...([] as unknown as P))
    }
  }, [execute, immediate]) // Only run on mount

  return {
    ...state,
    execute,
    reset,
    retry,
    cancel,
  }
}

// Specialized hooks for common patterns

// Hook for GET requests with automatic loading
export function useApiGet<T>(
  apiFunction: () => Promise<T>,
  options: Omit<UseApiOptions<T>, 'immediate'> & { enabled?: boolean } = {}
) {
  const { enabled = true, ...restOptions } = options
  
  return useApi(apiFunction, {
    ...restOptions,
    immediate: enabled,
    cache: true,
    ...restOptions,
  })
}

// Hook for mutations (POST, PUT, DELETE)
export function useApiMutation<T, P extends any[] = []>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  return useApi(apiFunction, {
    showSuccessToast: true,
    ...options,
    immediate: false,
  })
}

// Hook for paginated data
export function useApiPagination<T extends { data: any[]; total: number; page: number }>(
  apiFunction: (page: number, limit: number) => Promise<T>,
  limit = 10,
  options: UseApiOptions<T> = {}
) {
  const [page, setPage] = useState(1)
  const [allData, setAllData] = useState<T['data']>([])

  const api = useApi(
    (pageNum: number) => apiFunction(pageNum, limit),
    {
      ...options,
      onSuccess: (data) => {
        if (page === 1) {
          setAllData(data.data)
        } else {
          setAllData(prev => [...prev, ...(data.data as T['data'] || [])])
        }
        options.onSuccess?.(data)
      },
    }
  )

  const loadMore = useCallback(() => {
    const nextPage = page + 1

    setPage(nextPage)
    void api.execute(nextPage)
  }, [page, api])

  const refresh = useCallback(() => {
    setPage(1)
    setAllData([])
    void api.execute(1)
  }, [api])

  const hasMore = api.data ? page * limit < api.data.total : false

  return {
    ...api,
    data: api.data ? { ...api.data, data: allData } : null,
    page,
    hasMore,
    loadMore,
    refresh,
  }
}

// Hook for search with debouncing
export function useApiSearch<T>(
  searchFunction: (query: string) => Promise<T>,
  debounceDelay = 300,
  options: UseApiOptions<T> = {}
) {
  const [query, setQuery] = useState('')

  const api = useApi(searchFunction, {
    ...options,
    debounceDelay,
  })

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery)
      if (searchQuery.trim()) {
        void api.execute(searchQuery)
      } else {
        api.reset()
      }
    },
    [api]
  )

  return {
    ...api,
    query,
    search,
  }
}

export default useApi