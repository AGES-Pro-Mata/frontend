import { useEffect } from 'react'
import { Outlet, useRouter } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'

import { useAuthStore } from '@/store/auth.store'
import { Layout } from '@/components/layout/Layout'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Global app configuration
const APP_CONFIG = {
  name: 'Pro-Mata',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
}

function App() {
  const router = useRouter()
  const { isAuthenticated, token, refreshAuth, logout } = useAuthStore()

  // Initialize app on mount
  useEffect(() => {
    // Set app metadata
    document.title = APP_CONFIG.name
    
    // Add app version to window for debugging
    if (import.meta.env.DEV) {
      (window as Window & { __PRO_MATA_CONFIG__?: typeof APP_CONFIG }).__PRO_MATA_CONFIG__ = APP_CONFIG
    }

    // Initialize auth state
    if (isAuthenticated && token) {
      // Check if token is still valid on app startup
      const initAuth = async () => {
        try {
          await refreshAuth()
        } catch (error) {
          console.error('Auth initialization failed:', error)
          logout(false)
        }
      }
      
      void initAuth()
    }
  }, [isAuthenticated, token, refreshAuth, logout])

  // Handle app-wide keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Global shortcuts
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'k':
            // Open search (Cmd/Ctrl + K)
            event.preventDefault()
            // Implement global search modal
            break
          case '/':
            // Focus search input (Cmd/Ctrl + /)
            event.preventDefault()
            // Focus on search input if available
            break
        }
      }
      
      // Escape key - close modals, clear focus, etc.
      if (event.key === 'Escape') {
        // Handle escape key globally
        const activeElement = document.activeElement as HTMLElement

        if (activeElement && activeElement.blur) {
          activeElement.blur()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online')
      // You can add online status to a global store
    }

    const handleOffline = () => {
      console.log('App is offline')
      // You can add offline status to a global store
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Global error fallback component
  const GlobalErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8 max-w-md">
        <div className="text-6xl">😵</div>
        <h1 className="text-2xl font-bold text-destructive">Oops! Algo deu errado</h1>
        <p className="text-muted-foreground">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        
        {import.meta.env.DEV && (
          <details className="text-left mt-4 p-4 bg-muted rounded-lg">
            <summary className="cursor-pointer font-medium">Detalhes do erro (desenvolvimento)</summary>
            <pre className="mt-2 text-sm text-destructive whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex gap-2 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  )

  // Loading component for app initialization
  const AppLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Carregando {APP_CONFIG.name}...</p>
      </div>
    </div>
  )

  return (
    <ErrorBoundary fallback={GlobalErrorFallback}>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            fontSize: '14px',
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
          loading: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
        }}
      />

      {/* Main app layout */}
      <Layout>
        <Outlet />
      </Layout>

      {/* Development tools */}
      {import.meta.env.DEV && (
        <>
          {/* TanStack Router Devtools is loaded in the root route */}
          
          {/* Custom dev panel - you can add debug info here */}
          <div className="fixed bottom-4 left-4 bg-background border rounded-lg p-2 text-xs shadow-lg z-50 opacity-50 hover:opacity-100 transition-opacity">
            <div>v{APP_CONFIG.version}</div>
            <div>{APP_CONFIG.environment}</div>
          </div>
        </>
      )}
    </ErrorBoundary>
  )
}

export default App