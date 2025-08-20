import { IsAuthenticated } from '@/store/auth.store'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/requests')({
  beforeLoad: () => {
      if (!IsAuthenticated()) {
        throw redirect({ to: '/login' })
      }
    },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Solicitações</div>
}
