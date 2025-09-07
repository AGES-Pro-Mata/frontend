import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/auth/redefine-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/auth/redefine-password"!</div>
}
