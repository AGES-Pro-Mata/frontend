import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/highlights/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/highlight/"!</div>
}
