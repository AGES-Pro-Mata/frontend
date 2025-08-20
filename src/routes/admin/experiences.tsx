import { createFileRoute, redirect } from '@tanstack/react-router'
import { IsAuthenticated } from '@/store/auth.store'

export const Route = createFileRoute('/admin/experiences')({
  beforeLoad: () => {
    if (!IsAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Experiências</div>
}
