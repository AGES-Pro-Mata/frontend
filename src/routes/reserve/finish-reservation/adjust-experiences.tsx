import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/reserve/finish-reservation/adjust-experiences',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Ajustar experiências</div>
}
