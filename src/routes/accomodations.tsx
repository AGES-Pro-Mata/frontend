import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/accomodations')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>Acomodações</h1>
  </div>
}
