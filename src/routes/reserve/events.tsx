import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reserve/events')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Eventos</div>
}
