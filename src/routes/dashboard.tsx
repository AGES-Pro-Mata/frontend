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
    checkIn: string
    checkOut: string
    status: 'confirmed' | 'pending' | 'cancelled'
  }>
  upcomingCheckIns: Array<{
    id: string
    guestName: string
    checkIn: string
    accommodationName: string
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
          // redirect: location.href, // TODO: fix redirect
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
        const [reservationStats, recentReservations, upcomingCheckIns] = await Promise.all([
          reservationService.getStats(),
          reservationService.getRecentReservations(5),
          reservationService.getUpcomingCheckIns(7),
        ])

        return {
          stats: reservationStats,
          recentReservations,
          upcomingCheckIns,
          userProfile: {
            name: auth.user?.name || '',
            email: auth.user?.email || '',
            memberSince: auth.user?.createdAt || '',
            totalReservations: reservationStats.totalReservations,
            upcomingReservations: 0,
          },
        }
      } else {
        // Regular user dashboard data
        const [userStats, userReservations] = await Promise.all([
          userService.getDashboardStats(),
          userService.getUserReservations(),
        ])

        const recentReservations = userReservations
          .slice(0, 5)
          .map(r => ({
            id: r.id,
            guestName: auth.user?.name || '',
            checkIn: r.checkIn,
            checkOut: r.checkOut,
            status: r.status.toLowerCase() as 'confirmed' | 'pending' | 'cancelled',
          }))

        const upcomingCheckIns = userReservations
          .filter(r => r.status === 'CONFIRMED' && new Date(r.checkIn) > new Date())
          .slice(0, 5)
          .map(r => ({
            id: r.id,
            guestName: auth.user?.name || '',
            checkIn: r.checkIn,
            accommodationName: r.accommodation?.name || '',
          }))

        return {
          stats: {
            totalReservations: userStats.totalReservations,
            activeReservations: userStats.upcomingReservations,
            totalRevenue: userReservations.reduce((sum, r) => sum + r.totalAmount, 0),
            occupancyRate: 0, // Not applicable for regular users
          },
          recentReservations,
          upcomingCheckIns,
          userProfile: {
            name: auth.user?.name || '',
            email: auth.user?.email || '',
            memberSince: auth.user?.createdAt || '',
            totalReservations: userStats.totalReservations,
            upcomingReservations: userStats.upcomingReservations,
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
      />
    </Suspense>
  )
}