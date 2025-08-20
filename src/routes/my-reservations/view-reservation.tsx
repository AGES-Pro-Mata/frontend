import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-reservations/view-reservation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Visualizar reserva</div>
}
