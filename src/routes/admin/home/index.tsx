import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/home/"!</div>
}
