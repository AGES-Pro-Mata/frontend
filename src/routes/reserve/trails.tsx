import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reserve/trails')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Trilhas</div>
}
