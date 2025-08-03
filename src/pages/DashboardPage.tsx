import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DashboardPageProps {
  data?: {
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
  }
}

export function DashboardPage({ data }: DashboardPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas reservas e propriedades
        </p>
      </div>

      {/* Stats Grid */}
      {data?.stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalReservations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reservas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.activeReservations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {data.stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Ocupação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.occupancyRate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas Recentes</CardTitle>
            <CardDescription>
              Últimas reservas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.recentReservations && data.recentReservations.length > 0 ? (
              <div className="space-y-3">
                {data.recentReservations.slice(0, 5).map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{reservation.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        reservation.status === 'confirmed' ? 'default' :
                        reservation.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {reservation.status === 'confirmed' ? 'Confirmada' :
                       reservation.status === 'pending' ? 'Pendente' : 'Cancelada'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma reserva encontrada.</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Check-ins</CardTitle>
            <CardDescription>
              Check-ins programados para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.upcomingCheckIns && data.upcomingCheckIns.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingCheckIns.slice(0, 5).map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{checkIn.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        {checkIn.accommodationName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(checkIn.checkIn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum check-in programado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
