import { IsAuthenticated } from '@/store/auth.store'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users')({
  beforeLoad: () => {
      if (!IsAuthenticated()) {
        throw redirect({ to: '/login' })
      }
    },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Usuários</div>
}
