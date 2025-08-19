import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-reservations/')({
  component: RouteComponent,
})
function RouteComponent() {
  return <div>
    <h1>Minhas Reservas</h1>
  </div>
}
