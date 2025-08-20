import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reserve/labs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>Laboratórios</h1>
  </div>
}
