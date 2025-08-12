import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Import global styles
import './styles/globals.css'

// Import error boundary
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (except 408, 429)
        if (error instanceof Error) {
          type ErrorWithResponse = Error & { response?: { status?: number } }
          let status: number | undefined = undefined

          if ('response' in error && typeof (error as ErrorWithResponse).response?.status === 'number') {
            status = (error as ErrorWithResponse).response!.status
          }

          if (status !== undefined && status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false
          }
        }

        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
})

// Create the router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Global error handler
const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error('Global error caught:', error, errorInfo)
  
  // Send error to monitoring service (e.g., Sentry)
  if (import.meta.env.PROD) {
    // You can integrate with error tracking services here
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }
}

// Root component
function App() {
  return (
    <ErrorBoundary onError={handleGlobalError}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {import.meta.env.DEV && (
          <ReactQueryDevtools 
            initialIsOpen={false} 
            position="bottom"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

// Render the app
const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}