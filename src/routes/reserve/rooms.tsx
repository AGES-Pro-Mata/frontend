import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reserve/rooms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>Quartos</h1>
  </div>
}
