import { createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'

import { DashboardPage } from '@/pages/DashboardPage'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { accommodationService } from '@/services/accommodation.service'
import { reservationService } from '@/services/reservation.service'
import { userService } from '@/services/user.service'

// Types for dashboard data
interface DashboardData {
  stats: {
    totalReservations: number
    activeReservations: number
    totalRevenue: number
    occupancyRate: number
  }
  recentReservations: Array<{
    id: string
    guestName: string
    accommodation: string
    checkIn: string
    status: string
  }>
  featuredAccommodations: Array<{
    id: string
    name: string
    price: number
    images: string[]
    occupancyRate: number
  }>
  userProfile: {
    name: string
    email: string
    memberSince: string
    totalReservations: number
    upcomingReservations: number
  }
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
  
  // Authentication guard
  beforeLoad: ({ context, location }) => {
    const { auth } = context
    
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    
    return { auth }
  },

  // Data loader
  loader: async ({ context }): Promise<DashboardData> => {
    const { auth } = context
    
    try {
      // Determine what data to load based on user role
      if (auth.hasRole('ADMIN') || auth.hasRole('STAFF')) {
        // Admin dashboard data
        const [stats, recentReservations, featuredAccommodations] = await Promise.all([
          userService.getDashboardStats(),
          reservationService.getRecent({ limit: 5 }),
          accommodationService.getFeatured(),
        ])

        return {
          stats,
          recentReservations: recentReservations.data,
          featuredAccommodations,
          userProfile: {
            name: auth.user?.name || '',
            email: auth.user?.email || '',
            memberSince: auth.user?.createdAt || '',
            totalReservations: 0,
            upcomingReservations: 0,
          },
        }
      } else {
        // Regular user dashboard data
        const [userReservations, featuredAccommodations, userProfile] = await Promise.all([
          reservationService.getUserReservations(),
          accommodationService.getFeatured(),
          userService.getProfile(),
        ])

        const activeReservations = userReservations.filter(r => 
          ['CONFIRMED', 'CHECKED_IN'].includes(r.status)
        )
        
        const upcomingReservations = userReservations.filter(r =>
          r.status === 'CONFIRMED' && new Date(r.checkIn) > new Date()
        )

        return {
          stats: {
            totalReservations: userReservations.length,
            activeReservations: activeReservations.length,
            totalRevenue: userReservations.reduce((sum, r) => sum + r.totalAmount, 0),
            occupancyRate: 0, // Not applicable for regular users
          },
          recentReservations: userReservations
            .slice(0, 5)
            .map(r => ({
              id: r.id,
              guestName: userProfile.name,
              accommodation: r.accommodationName || '',
              checkIn: r.checkIn,
              status: r.status,
            })),
          featuredAccommodations,
          userProfile: {
            name: userProfile.name,
            email: userProfile.email,
            memberSince: userProfile.createdAt,
            totalReservations: userReservations.length,
            upcomingReservations: upcomingReservations.length,
          },
        }
      }
    } catch (error) {
      console.error('Dashboard data loading failed:', error)
      throw new Error('Falha ao carregar dados do dashboard')
    }
  },

  // Loading component
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    </div>
  ),

  // Error component
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-2xl font-bold text-destructive">Erro no Dashboard</h1>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
        <div className="space-x-2">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  ),

  // Meta information
  meta: () => [
    {
      title: 'Dashboard - Pro-Mata',
      description: 'Dashboard do sistema Pro-Mata',
    },
  ],
})

function DashboardComponent() {
  const { auth } = Route.useRouteContext()
  const dashboardData = Route.useLoaderData()

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    }>
      <DashboardPage 
        data={dashboardData}
        userRole={auth.user?.role || 'USER'}
        isAdmin={auth.hasRole('ADMIN') || auth.hasRole('STAFF')}
      />
    </Suspense>
  )
}