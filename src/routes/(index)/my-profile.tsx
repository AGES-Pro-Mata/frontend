import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/my-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/my-profile"!</div>
}
