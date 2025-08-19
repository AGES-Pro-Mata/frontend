import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/experiences')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Experiências</div>
}
