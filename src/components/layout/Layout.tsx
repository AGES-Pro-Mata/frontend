import { ReactNode } from 'react'
import { useLocation } from '@tanstack/react-router'

import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/utils'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { isAuthenticated, hasRole } = useAuthStore()

  // Determine layout configuration based on current route
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    path => location.pathname.startsWith(path)
  )
  
  const isAdminPage = location.pathname.startsWith('/admin')
  const isDashboardPage = location.pathname.startsWith('/dashboard')
  
  // Show sidebar for authenticated users on dashboard and admin pages
  const showSidebar = isAuthenticated && (isDashboardPage || isAdminPage)
  
  // Full page layout for auth pages
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pro-mata-green-50 to-pro-mata-blue-50">
        <main className="min-h-screen flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar for authenticated pages */}
        {showSidebar && (
          <aside className="hidden lg:block w-64 border-r bg-muted/5">
            <Sidebar />
          </aside>
        )}

        {/* Main content */}
        <main 
          className={cn(
            "flex-1 overflow-auto",
            showSidebar ? "lg:pl-0" : "w-full"
          )}
        >
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}