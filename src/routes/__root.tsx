import { Outlet, createRootRoute, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

import { Layout } from '@/components/layout/Layout'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useAuthStore } from '@/store/auth.store'

// Global loading component
function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  )
}

// Global error fallback
function GlobalErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
        <p className="text-xl text-muted-foreground">Algo deu errado</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: GlobalErrorFallback,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Página não encontrada</p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  ),
  beforeLoad: async ({ location }) => {
    // Global auth check and token refresh
    const authStore = useAuthStore.getState()
    
    // Auto-refresh token if needed
    if (authStore.isAuthenticated && authStore.token) {
      try {
        const timeUntilExpiry = authStore.getTimeUntilExpiry()
        const fiveMinutes = 5 * 60 * 1000
        
        if (timeUntilExpiry && timeUntilExpiry < fiveMinutes) {
          await authStore.refreshAuth()
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        authStore.logout(false)
      }
    }

    // Return auth state for route guards
    return {
      auth: {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
        hasRole: authStore.hasRole,
        hasPermission: authStore.hasPermission,
      }
    }
  },
})

function RootComponent() {
  const router = useRouter()

  return (
    <ErrorBoundary fallback={GlobalErrorFallback}>
      <Layout>
        <Suspense fallback={<GlobalLoading />}>
          <Outlet />
        </Suspense>
      </Layout>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--destructive-foreground))',
            },
          },
        }}
      />

      {/* Development tools */}
      {import.meta.env.MODE === 'development' && (
        <TanStackRouterDevtools 
          router={router} 
          position="bottom-left"
          initialIsOpen={false}
        />
      )}
    </ErrorBoundary>
  )
}