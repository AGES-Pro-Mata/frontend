import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/experiences/$experienceId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/experiences/$experienceId"!</div>
}
