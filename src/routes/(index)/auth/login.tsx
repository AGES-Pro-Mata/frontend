import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/auth/login"!</div>
}
